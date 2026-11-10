(() => {
  const pending = new Map()
  let nextId = 0
  const notify = (method, params = {}) => window.parent.postMessage({ jsonrpc: '2.0', method, params }, '*')
  function request(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++nextId
      const timeout = setTimeout(() => {
        pending.delete(id)
        reject(new Error('Codex 面板连接超时。'))
      }, 90000)
      pending.set(id, { resolve, reject, timeout })
      window.parent.postMessage({ jsonrpc: '2.0', id, method, params }, '*')
    })
  }
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.jsonrpc !== '2.0') return
    const reply = event.data
    const waiter = pending.get(reply.id)
    if (!waiter) return
    pending.delete(reply.id)
    clearTimeout(waiter.timeout)
    if (reply.error) waiter.reject(new Error(reply.error.message))
    else waiter.resolve(reply.result)
  })

  window.__micaBridgeReady = request('ui/initialize', {
    appInfo: { name: 'Mica Space', version: '0.99.9' },
    appCapabilities: {},
    protocolVersion: '2026-01-26',
  }).then(result => {
    notify('ui/notifications/initialized')
    return result
  })
  window.__micaBridgeReady.catch(() => {})

  async function call(args) {
    await window.__micaBridgeReady
    const result = await request('tools/call', { name: 'mica_panel_request', arguments: args })
    const response = result?._meta?.mica
    if (result?.isError || !response) throw new Error(response?.error || 'Codex 未返回画布数据。')
    return response
  }

  const originalFetch = window.fetch.bind(window)
  function makeResponse(result) {
    const bytes = result.binary ? Uint8Array.from(atob(result.body), char => char.charCodeAt(0)) : result.body
    return new Response(bytes, { status: result.status, headers: result.headers })
  }
  window.__micaAttachmentBlob = async path => {
    const response = await window.fetch(path)
    if (!response.ok) throw new Error('附件不可用。')
    return URL.createObjectURL(await response.blob())
  }
  window.fetch = async (input, options = {}) => {
    if (typeof input !== 'string' || !input.startsWith('/chat-space/api/')) return originalFetch(input, options)
    const signal = options.signal
    signal?.throwIfAborted()
    const initial = await call({ action: 'request', path: input, method: options.method || 'GET', body: options.body || '' })
    if (!initial.id) {
      signal?.throwIfAborted()
      return makeResponse(initial)
    }
    const id = initial.id
    const cancel = () => { call({ action: 'cancel', id }).catch(() => {}) }
    signal?.addEventListener('abort', cancel, { once: true })
    try {
      signal?.throwIfAborted()
      let next = await call({ action: 'read', id })
      signal?.throwIfAborted()
      while (!next.ready && !next.done) {
        next = await call({ action: 'read', id })
        signal?.throwIfAborted()
      }
      if (next.status !== 200 || !String(next.headers['Content-Type']).startsWith('text/event-stream')) {
        signal?.removeEventListener('abort', cancel)
        return makeResponse(next)
      }
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async pull(controller) {
          try {
            signal?.throwIfAborted()
            if (next.body) controller.enqueue(encoder.encode(next.body))
            if (next.done) {
              signal?.removeEventListener('abort', cancel)
              controller.close()
              return
            }
            next = await call({ action: 'read', id })
            signal?.throwIfAborted()
          } catch (error) {
            signal?.removeEventListener('abort', cancel)
            cancel()
            controller.error(error)
          }
        },
        cancel() {
          signal?.removeEventListener('abort', cancel)
          cancel()
        },
      })
      return new Response(stream, { headers: next.headers })
    } catch (error) {
      signal?.removeEventListener('abort', cancel)
      cancel()
      throw error
    }
  }
  window.__ModuleLoader__ = { load(spec) { window.__micaSpec = spec } }
})()
