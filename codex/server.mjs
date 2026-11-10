import { createInterface } from 'node:readline'
import path from 'node:path'
import os from 'node:os'
import { createHost } from './host.mjs'
import { buildWidget, resourceMimeType, resourceUri } from './widget.mjs'

const appData = process.env.LOCALAPPDATA || process.env.XDG_DATA_HOME
  || path.join(os.homedir(), '.local', 'share')
const defaultWorkspace = path.join(appData, 'Mica Space', 'Codex')
try {
  process.loadEnvFile(path.join(defaultWorkspace, 'model.env'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const workspace = path.resolve(process.env.MICA_WORKSPACE || defaultWorkspace)
const host = createHost(workspace)
const resource = {
  uri: resourceUri,
  name: 'Mica Space',
  mimeType: resourceMimeType,
  _meta: { ui: { prefersBorder: false } },
}
const openTool = {
  name: 'open_mica_space',
  title: 'Mica Space',
  description: 'Open the Mica Space canvas for branching learning conversations.',
  inputSchema: { type: 'object', additionalProperties: false },
  annotations: { readOnlyHint: true },
  _meta: {
    ui: { resourceUri },
    'openai/outputTemplate': resourceUri,
    'openai/ui': { entrypoints: [{ type: 'global' }] },
  },
}
const bridgeTool = {
  name: 'mica_panel_request',
  description: 'Handle requests from the Mica Space panel.',
  inputSchema: {
    type: 'object',
    required: ['action'],
    additionalProperties: false,
    properties: {
      action: { enum: ['request', 'read', 'cancel'] },
      path: { type: 'string' }, method: { enum: ['GET', 'POST'] },
      body: { type: 'string' }, id: { type: 'string' },
    },
  },
  _meta: { ui: { resourceUri, visibility: ['app'] }, 'openai/visibility': 'private' },
}

function send(message) {
  process.stdout.write(JSON.stringify(message) + '\n')
}

async function dispatch(method, params = {}) {
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: ['2025-03-26', '2025-06-18', '2025-11-25'].includes(params.protocolVersion) ? params.protocolVersion : '2025-11-25',
        serverInfo: { name: 'mica-space', version: '0.99.9' },
        capabilities: { tools: {}, resources: {} },
      }
    case 'ping': return {}
    case 'tools/list': return { tools: [openTool, bridgeTool] }
    case 'resources/list': return { resources: [resource] }
    case 'resources/templates/list': return { resourceTemplates: [] }
    case 'resources/read': {
      if (params.uri !== resourceUri) throw new Error('Unknown Mica resource.')
      return { contents: [{ ...resource, text: await buildWidget() }] }
    }
    case 'tools/call': {
      if (params.name === openTool.name) return { content: [{ type: 'text', text: 'Mica Space is ready to open.' }] }
      if (params.name !== bridgeTool.name) throw new Error('Unknown Mica tool.')
      const args = params.arguments || {}
      let result
      try {
        if (args.action === 'request') result = await host.request(args)
        else if (args.action === 'read') result = await host.read(args.id)
        else if (args.action === 'cancel') result = host.cancel(args.id)
        else throw new Error('Unknown panel action.')
      } catch (error) {
        return { content: [{ type: 'text', text: 'Mica request failed.' }], isError: true, _meta: { mica: { error: error.message } } }
      }
      return { content: [], _meta: { mica: result } }
    }
    default:
      throw Object.assign(new Error('Method not found.'), { code: -32601 })
  }
}

const lines = createInterface({ input: process.stdin, crlfDelay: Infinity })
lines.on('line', async line => {
  let message
  try { message = JSON.parse(line) } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error.' } })
    return
  }
  if (message.id == null) return
  try {
    const result = await dispatch(message.method, message.params)
    send({ jsonrpc: '2.0', id: message.id, result })
  } catch (error) {
    send({ jsonrpc: '2.0', id: message.id, error: { code: error.code || -32603, message: error.message } })
  }
})
lines.on('close', () => host.dispose())
