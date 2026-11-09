import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const requests = [
  { id: 1, method: 'tools/list' },
  { id: 2, method: 'tools/call', params: { name: 'open_mica_space', arguments: {} } },
  { id: 3, method: 'resources/read', params: { uri: 'ui://mica-space/canvas.html' } },
]
const reply = spawnSync(process.execPath, [fileURLToPath(new URL('../codex/server.mjs', import.meta.url))], {
  input: requests.map(request => JSON.stringify({ jsonrpc: '2.0', ...request })).join('\n') + '\n',
  encoding: 'utf8',
  timeout: 10000,
  maxBuffer: 8 * 1024 * 1024,
})
assert.equal(reply.status, 0, reply.stderr)
const responses = new Map(reply.stdout.trim().split('\n').map(line => {
  const message = JSON.parse(line)
  assert.equal(message.error, undefined)
  return [message.id, message.result]
}))
const { tools } = responses.get(1)
const openTool = tools.find(tool => tool.name === 'open_mica_space')
assert.deepEqual(openTool._meta['openai/ui']?.entrypoints, [{ type: 'global' }])
assert.equal(openTool.title, 'Mica Space')
assert.equal(openTool._meta.ui.resourceUri, openTool._meta['openai/outputTemplate'])
assert.equal(responses.get(2).content[0].type, 'text')
const [canvas] = responses.get(3).contents
assert.equal(canvas.uri, openTool._meta.ui.resourceUri)
assert.equal(canvas.mimeType, 'text/html;profile=mcp-app')
