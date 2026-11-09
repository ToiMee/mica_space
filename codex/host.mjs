import { EventEmitter, once } from 'node:events'
import { randomUUID } from 'node:crypto'
import { apply } from '../index.js'
import { createModelAdapter } from './model.mjs'

const MAX_REQUEST_BYTES = 32 * 1024 * 1024
const STREAM_IDLE_MS = 120000

export function createHost(workspace, modelAdapter = createModelAdapter(workspace)) {
  const routes = new Map()
  const jobs = new Map()
  apply({
    get(name) {
      return name === 'workingDirectory' ? { defaultDirectory: workspace } : null
    },
    effect(callback) { return callback() },
    webServer: {
      register({ path, handler }) {
        routes.set(path, handler)
        return () => routes.delete(path)
      },
    },
    agentDefaultModel: { currentSelection: modelAdapter.currentSelection },
    llm: modelAdapter,
  })

  function invoke({ path, method, body = '' }) {
    if (typeof path !== 'string' || !path.startsWith('/chat-space/api/') || path.startsWith('//')) {
      throw new Error('Invalid Mica route.')
    }
    if (typeof body !== 'string' || Buffer.byteLength(body) > MAX_REQUEST_BYTES) {
      throw new Error('请求超过插件的大小限制。')
    }
    const route = new URL(path, 'http://mica.local').pathname
    const handler = routes.get(route)
    if (!handler || !['GET', 'POST'].includes(method)) throw new Error('Unknown Mica route or method.')

    const request = new EventEmitter()
    Object.assign(request, { url: path, method, destroy() {} })
    const response = new EventEmitter()
    Object.assign(response, {
      status: 200, headers: {}, headersSent: false, writableEnded: false, chunks: [],
      writeHead(status, headers) {
        this.status = status
        this.headers = headers
        this.headersSent = true
      },
      write(chunk) {
        if (!this.writableEnded) {
          this.chunks.push(Buffer.from(chunk))
          this.emit('available')
        }
      },
      end(chunk) {
        if (chunk != null) this.write(chunk)
        this.writableEnded = true
        this.emit('available')
      },
    })

    const completion = Promise.resolve(handler(request, response)).catch(() => {
      if (response.writableEnded) return
      if (!response.headersSent) {
        response.writeHead(500, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ error: '插件请求失败。' }))
      } else {
        response.end()
      }
    })
    if (body) request.emit('data', Buffer.from(body))
    request.emit('end')
    return { response, completion }
  }

  function snapshot(response) {
    const headers = response.headers || {}
    const binary = !/^(application\/json|text\/event-stream)/i.test(headers['Content-Type'] || '')
    const bytes = Buffer.concat(response.chunks.splice(0))
    return {
      status: response.status, headers, binary, ready: response.headersSent,
      body: bytes.toString(binary ? 'base64' : 'utf8'), done: response.writableEnded,
    }
  }

  function close(id) {
    const job = jobs.get(id)
    if (!job) return
    jobs.delete(id)
    job.response.emit('close')
    job.response.end()
  }

  const sweeper = setInterval(() => {
    for (const [id, job] of jobs) if (Date.now() - job.lastRead > STREAM_IDLE_MS) close(id)
  }, 30000)
  sweeper.unref()

  return {
    async request(args) {
      const stream = args.path === '/chat-space/api/chat' && args.method === 'POST'
      if (stream && jobs.size >= 8) throw new Error('正在生成的请求过多。')
      const { response, completion } = invoke(args)
      if (stream) {
        const id = randomUUID()
        jobs.set(id, { response, lastRead: Date.now() })
        return { id }
      }
      await completion
      return snapshot(response)
    },
    async read(id) {
      const job = jobs.get(id)
      if (!job) throw new Error('生成请求已关闭。')
      job.lastRead = Date.now()
      if (!job.response.chunks.length && !job.response.writableEnded) {
        const timeout = AbortSignal.timeout(1000)
        await once(job.response, 'available', { signal: timeout }).catch(error => {
          if (error.name !== 'AbortError') throw error
        })
      }
      const result = snapshot(job.response)
      if (result.done) jobs.delete(id)
      return result
    },
    cancel(id) { close(id); return { ok: true } },
    dispose() {
      clearInterval(sweeper)
      for (const id of jobs.keys()) close(id)
    },
  }
}
