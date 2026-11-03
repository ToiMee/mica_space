// Host half of the Chat Space plugin.
//
// It owns the only things the browser cannot do safely:
//   - keep the space JSON in the current workspace
//   - call the model that DSH is already configured to use
//   - stream the answer back as Server-Sent Events
//
// The browser half is a plain client bundle; it talks to these routes with
// fetch(). No credentials or provider details ever reach the page.

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const API_ROOT = '/chat-space/api'
const DATA_DIR_NAME = '.chat-space'
const DATA_FILE_NAME = 'space.json'
const MAX_BODY_BYTES = 4 * 1024 * 1024
const MAX_ANCHOR_CHARS = 2400
const MAX_MAIN_CONTEXT_CHARS = 1600
const MAX_HISTORY_ITEM_CHARS = 6000

export const inject = ['webServer', 'llm', 'agentDefaultModel']

export function apply(ctx) {
  const workingDirectory = ctx.get('workingDirectory')

  // The chat space is global to this profile, but its data belongs beside the
  // user's default workspace so it can be backed up with the rest of the work.
  const resolveBaseDir = () => {
    try {
      const registry = ctx.get('workspaceRegistry')
      const workspaces = registry && typeof registry.list === 'function' ? registry.list() : []
      if (workspaces.length > 0 && typeof workspaces[0].path === 'string' && workspaces[0].path) {
        return workspaces[0].path
      }
    } catch (_error) {
      // Fall through to the profile working directory.
    }
    return workingDirectory?.defaultDirectory || process.cwd()
  }

  const dataFile = () => path.join(resolveBaseDir(), DATA_DIR_NAME, DATA_FILE_NAME)

  const readSpace = async () => {
    try {
      const raw = await readFile(dataFile(), 'utf8')
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch (error) {
      if (error && error.code === 'ENOENT') return null
      throw error
    }
  }

  const writeSpace = async (space) => {
    const file = dataFile()
    await mkdir(path.dirname(file), { recursive: true })
    try {
      await copyFile(file, file + '.bak')
    } catch (error) {
      if (error && error.code !== 'ENOENT') throw error
    }
    await writeFile(file, JSON.stringify(space, null, 2), 'utf8')
  }

  const route = (pathName, handler) => ctx.webServer.register({
    kind: 'exact',
    path: pathName,
    handler,
  })

  ctx.effect(() => {
    const disposers = [
      route(`${API_ROOT}/space`, async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: '只支持 GET' })
        try {
          const space = await readSpace()
          let model = null
          try {
            model = ctx.agentDefaultModel.currentSelection()
          } catch (_error) {
            model = null
          }
          sendJson(res, 200, { ok: true, space, model })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(`${API_ROOT}/save`, async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const space = body && body.space
          if (!space || typeof space !== 'object' || !space.main || !Array.isArray(space.main.turns) || !Array.isArray(space.branches)) {
            return sendJson(res, 400, { ok: false, error: '聊天空间数据格式不正确' })
          }
          await writeSpace(space)
          sendJson(res, 200, { ok: true })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(`${API_ROOT}/chat`, async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        await handleChat(ctx, req, res)
      }),

      route(`${API_ROOT}/summary`, async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        await handleSummary(ctx, req, res)
      }),
    ]
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'chat-space: routes')
}

async function handleChat(ctx, req, res) {
  let body
  try {
    body = await readJsonBody(req)
  } catch (error) {
    return sendJson(res, 400, { ok: false, error: messageOf(error) })
  }

  const question = stringOf(body?.question).trim()
  if (!question) return sendJson(res, 400, { ok: false, error: '问题不能为空' })

  let selection
  try {
    selection = ctx.agentDefaultModel.currentSelection()
  } catch (error) {
    return sendJson(res, 503, { ok: false, error: `当前没有可用的模型：${messageOf(error)}` })
  }

  const provider = selection?.provider
  const model = selection?.model
  if (!provider || !model) return sendJson(res, 503, { ok: false, error: '当前没有配置模型，请先在设置里选择模型。' })

  const kind = body?.kind === 'branch' ? 'branch' : 'main'
  const branchId = stringOf(body?.branchId)
  const anchorText = stringOf(body?.anchorText).slice(0, MAX_ANCHOR_CHARS)
  const brief = stringOf(body?.brief).slice(0, 1200)
  const mainContext = Array.isArray(body?.mainContext) ? body.mainContext.slice(-8) : []
  const history = Array.isArray(body?.history) ? body.history : []
  const branchDigest = Array.isArray(body?.branchDigest) ? body.branchDigest.slice(0, 6) : []
  const mainDigest = Array.isArray(body?.mainDigest) ? body.mainDigest.slice(-4) : []

  const system = buildSystemPrompt({ kind, anchorText, brief, mainContext, branchDigest, mainDigest, branchId })
  const messages = buildMessages({ history, question, provider, model })

  const controller = new AbortController()
  let closed = false
  res.on('close', () => {
    closed = true
    controller.abort()
  })

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.flushHeaders?.()

  let usage = null
  let finished = false

  const emit = (event) => {
    if (closed || res.writableEnded) return
    try {
      res.write(`data: ${JSON.stringify(event)}\n\n`)
    } catch (_error) {
      // The browser went away; the close handler will abort the model stream.
    }
  }

  try {
    const stream = ctx.llm.stream({
      provider,
      model,
      system,
      messages,
      signal: controller.signal,
      ...(selection?.reasoningEffort ? { reasoningEffort: selection.reasoningEffort } : {}),
    })

    for await (const chunk of stream) {
      if (closed) break
      if (!chunk || typeof chunk !== 'object') continue
      if (chunk.type === 'text-delta' && typeof chunk.text === 'string') {
        emit({ type: 'delta', text: chunk.text })
      } else if (chunk.type === 'usage') {
        usage = chunk.usage
      } else if (chunk.type === 'finish') {
        finished = true
        const reason = chunk.reason
        if (reason && reason.kind === 'error') {
          emit({ type: 'error', message: reason.failure?.message || '模型返回失败', code: reason.failure?.code })
        } else if (reason && reason.kind === 'aborted') {
          emit({ type: 'aborted' })
        } else {
          emit({ type: 'done', usage })
        }
        break
      }
    }

    if (!finished && !closed) emit({ type: 'done', usage })
  } catch (error) {
    if (!closed) emit({ type: 'error', message: messageOf(error) })
  } finally {
    if (!closed && !res.writableEnded) {
      try {
        res.end()
      } catch (_error) {
        // Already closed.
      }
    }
  }
}

async function handleSummary(ctx, req, res) {
  let body
  try {
    body = await readJsonBody(req)
  } catch (error) {
    return sendJson(res, 400, { ok: false, error: messageOf(error) })
  }

  const question = stringOf(body?.question).trim()
  const answer = stringOf(body?.answer).trim()
  if (!question && !answer) return sendJson(res, 400, { ok: false, error: '没有可总结的内容' })

  let selection
  try {
    selection = ctx.agentDefaultModel.currentSelection()
  } catch (error) {
    return sendJson(res, 503, { ok: false, error: `当前没有可用的模型：${messageOf(error)}` })
  }
  const provider = selection?.provider
  const model = selection?.model
  if (!provider || !model) return sendJson(res, 503, { ok: false, error: '当前没有配置模型' })

  const controller = new AbortController()
  res.on('close', () => controller.abort())

  const system = [
    '你是一个学习助手。请用一句不超过30个汉字的中文，概括下面这次问答的核心内容。',
    '只输出摘要本身，不要引号、不要解释、不要前缀。',
  ].join('\n')
  const messages = [{
    role: 'user',
    content: [{
      type: 'text',
      text: `问题：\n${question.slice(0, 3000)}\n\n回答：\n${answer.slice(0, 5000)}`,
    }],
  }]

  let summary = ''
  try {
    const stream = ctx.llm.stream({
      provider,
      model,
      system,
      messages,
      maxTokens: 160,
      signal: controller.signal,
      ...(selection?.reasoningEffort ? { reasoningEffort: selection.reasoningEffort } : {}),
    })
    for await (const chunk of stream) {
      if (res.writableEnded || controller.signal.aborted) break
      if (!chunk || typeof chunk !== 'object') continue
      if (chunk.type === 'text-delta' && typeof chunk.text === 'string') {
        summary += chunk.text
      } else if (chunk.type === 'finish') {
        if (chunk.reason && chunk.reason.kind === 'error') {
          throw new Error(chunk.reason.failure?.message || '模型返回失败')
        }
        break
      }
    }
    if (controller.signal.aborted) return
    sendJson(res, 200, { ok: true, summary: summary.replace(/\s+/g, ' ').trim().slice(0, 160) })
  } catch (error) {
    if (!controller.signal.aborted) sendJson(res, 502, { ok: false, error: messageOf(error) })
  }
}

function formatBranchDigest(branches) {
  return branches
    .map((branch, index) => {
      const parent = branch.parentBranchId ? `父级：分支 ${stringOf(branch.parentBranchId)}` : '父级：主线'
      const head = `分支 ${index + 1}（从${parent}分出；分叉点「${stringOf(branch.anchorText)}」${branch.brief ? `；说明：${stringOf(branch.brief)}` : ''}）`
      const turns = (Array.isArray(branch.turns) ? branch.turns : [])
        .slice(-3)
        .map((turn) => `  问：${stringOf(turn?.question)}\n  答/摘要：${stringOf(turn?.answer)}`)
        .join('\n')
      return `${head}\n${turns}`
    })
    .join('\n\n')
    .slice(0, 6000)
}

function formatMainDigest(turns) {
  return turns
    .map((turn, index) => `主线 ${index + 1}\n问：${stringOf(turn?.question)}\n答/摘要：${stringOf(turn?.answer)}`)
    .join('\n\n')
    .slice(0, 3000)
}

function buildSystemPrompt({ kind, anchorText, brief, mainContext, branchDigest, mainDigest, branchId }) {
  const lines = [
    '你是“聊天空间”里的学习助手。用户把学习对话组织成一条纵向主线和若干横向分支。',
    '回答要直接、清楚，优先解释概念和原因；需要时用简短例子。',
    '只使用本次提供的背景。不要假装记得没有提供的对话，也不要复述整段背景。',
  ]

  if (kind === 'branch') {
    lines.push('', '当前是分支追问。')
    if (anchorText) lines.push(`用户从上游回答中选中的文字：\n"""${anchorText}"""`)
    if (brief) lines.push(`分支说明：${brief}`)
    if (mainContext.length > 0) {
      const context = mainContext
        .map((turn, index) => {
          const q = stringOf(turn?.question).slice(0, MAX_MAIN_CONTEXT_CHARS)
          const a = stringOf(turn?.answer).slice(0, MAX_MAIN_CONTEXT_CHARS)
          return `【主线片段 ${index + 1}】\n问：${q}\n答：${a}`
        })
        .join('\n\n')
      lines.push('', '分叉前的上游对话片段（只作背景，不要逐段复述）：', context)
    }
    lines.push('', '请围绕分支问题回答。如果问题与选中的文字无关，先指出这一点，再回答。')
  } else {
    lines.push('', '当前是主线问答。请把回答控制在适合继续学习的长度，必要时在结尾给出一个可继续追问的点。')
  }

  const otherBranches = branchDigest.filter((branch) => branch && branch.id !== branchId)
  if (otherBranches.length > 0) {
    lines.push('', '当前聊天空间的分支索引（不是全文，只用于知道其他分支讨论过什么）：', formatBranchDigest(otherBranches))
  }
  if (kind === 'branch' && mainDigest.length > 0) {
    lines.push('', '主线最近的问答（可能发生在分支分叉之后）：', formatMainDigest(mainDigest))
  }
  lines.push('', '如果用户提到“支线/分支里已经说过”，先在分支索引中查找对应内容；能对应上就引用其要点，不能对应就明确说没有看到。不要假装读过索引之外的细节。')

  return lines.join('\n')
}

function buildMessages({ history, question, provider, model }) {
  const messages = []
  for (const item of history) {
    if (!item || typeof item !== 'object') continue
    const content = stringOf(item.content).trim()
    if (!content) continue
    const text = { type: 'text', text: content.slice(0, MAX_HISTORY_ITEM_CHARS) }
    if (item.role === 'assistant') {
      messages.push({
        role: 'assistant',
        content: [text],
        source: { kind: 'model', provider, model },
      })
    } else if (item.role === 'user') {
      messages.push({ role: 'user', content: [text] })
    }
  }
  // Keep the request bounded even if an older client sends a long transcript.
  const trimmed = messages.slice(-24)
  trimmed.push({ role: 'user', content: [{ type: 'text', text: question }] })
  return trimmed
}

function readJsonBody(req, limit = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error('请求内容过大'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (_error) {
        reject(new Error('请求内容不是有效的 JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, value) {
  if (res.writableEnded) return
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  })
  res.end(body)
}

function stringOf(value) {
  return typeof value === 'string' ? value : ''
}

function messageOf(error) {
  if (error instanceof Error && error.message) return error.message
  return String(error)
}
