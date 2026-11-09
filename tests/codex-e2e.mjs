import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp } from 'node:fs/promises'
import { createServer } from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { createInterface } from 'node:readline'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const workspace = await mkdtemp(path.join(process.env.MICA_TEST_TMPDIR || os.tmpdir(), 'mica-codex-e2e-'))
const mock = createServer()
mock.listen(0, '127.0.0.1')
await once(mock, 'listening')
const requests = []
const child = spawn(process.execPath, [fileURLToPath(new URL('../codex/server.mjs', import.meta.url))], {
  env: {
    ...process.env, MICA_WORKSPACE: workspace, MICA_MODEL: 'mock-model', MICA_API_KEY: 'mock-key',
    MICA_API_BASE: 'http://127.0.0.1:' + mock.address().port + '/v1',
  },
  stdio: ['pipe', 'pipe', 'inherit'],
})
let counter = 0
const waiters = new Map()
createInterface({ input: child.stdout }).on('line', line => {
  const message = JSON.parse(line)
  const waiter = waiters.get(message.id)
  waiters.delete(message.id)
  if (message.error) waiter?.reject(new Error(message.error.message))
  else waiter?.resolve(message.result)
})
function rpc(method, params) {
  return new Promise((resolve, reject) => {
    const id = ++counter
    const timer = setTimeout(() => {
      waiters.delete(id)
      reject(new Error('MCP timeout: ' + method))
    }, 10000)
    waiters.set(id, {
      resolve(value) { clearTimeout(timer); resolve(value) },
      reject(error) { clearTimeout(timer); reject(error) },
    })
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
  })
}
const panel = args => rpc('tools/call', { name: 'mica_panel_request', arguments: args })
const route = async (url, data) => {
  const result = await panel({
    action: 'request', path: '/chat-space/api' + url, method: data ? 'POST' : 'GET',
    ...(data ? { body: JSON.stringify(data) } : {}),
  })
  assert.equal(result.isError, undefined)
  return result._meta.mica
}

let browser
let widget = ''
mock.on('request', async (request, response) => {
  try {
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    const body = Buffer.concat(chunks).toString()
    if (request.url === '/v1/chat/completions') {
      const outgoing = JSON.parse(body)
      requests.push(outgoing)
      const branch = outgoing.messages[0].content.includes('当前是分支追问')
      response.writeHead(200, { 'Content-Type': 'text/event-stream' })
      response.write('data: ' + JSON.stringify({ choices: [{ delta: { content: branch ? '支线结果' : '主线锚点 ABC' } }] }) + '\n\n')
      response.end('data: {"choices":[],"usage":{"prompt_tokens":10,"completion_tokens":5,"total_tokens":15}}\n\ndata: [DONE]\n\n')
    } else if (request.url === '/widget') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      response.end(widget)
    } else if (request.url === '/bridge') {
      const result = await rpc('tools/call', JSON.parse(body))
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(result))
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      response.end('<iframe id="widget" src="/widget" style="width:100%;height:850px;border:0"></iframe><script>' +
        'addEventListener("message", async event => {' +
        'const m=event.data;if(m.id==null)return;' +
        'try {const result=m.method==="ui/initialize"?{hostContext:{locale:"zh-CN"}}:' +
        'await fetch("/bridge",{method:"POST",body:JSON.stringify(m.params)}).then(r=>r.json());' +
        'event.source.postMessage({jsonrpc:"2.0",id:m.id,result},"*")}' +
        'catch(e){event.source.postMessage({jsonrpc:"2.0",id:m.id,error:{message:e.message}},"*")}' +
        '})</script>')
    }
  } catch {
    response.writeHead(500)
    response.end()
  }
})

try {
  const info = await rpc('initialize', { protocolVersion: '2025-11-25' })
  assert.equal(info.serverInfo.name, 'mica-space')
  const { tools } = await rpc('tools/list')
  const open = tools.find(tool => tool.name === 'open_mica_space')
  assert.equal(open._meta.ui.resourceUri, 'ui://mica-space/canvas.html')
  assert.equal(tools.find(tool => tool.name === 'mica_panel_request')._meta.ui.visibility[0], 'app')
  const resource = await rpc('resources/read', { uri: open._meta.ui.resourceUri })
  widget = resource.contents[0].text
  assert.equal(resource.contents[0].mimeType, 'text/html;profile=mcp-app')
  const created = JSON.parse((await route('/space/create', { title: 'Codex 迁移验证', layoutMode: 'vertical' })).body)
  assert.equal(created.ok, true, created.error)

  const upload = JSON.parse((await route('/upload', {
    name: 'notes.txt', kind: 'file', data: Buffer.from('attachment evidence').toString('base64'),
  })).body)
  const file = await route('/attachment?kind=file&ref=' + encodeURIComponent(JSON.stringify(upload.attachment)))
  assert.equal(Buffer.from(file.body, 'base64').toString(), 'attachment evidence')
  const rejected = await panel({ action: 'request', path: '/etc/passwd', method: 'GET' })
  assert.equal(rejected.isError, true)

  browser = await chromium.launch({
    headless: true,
    ...(process.env.MICA_CHROMIUM ? { executablePath: process.env.MICA_CHROMIUM } : {}),
  })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:' + mock.address().port)
  const frame = page.frameLocator('#widget')
  const welcome = frame.getByRole('button', { name: '让我试试' })
  await welcome.waitFor({ timeout: 10000 })
  await welcome.click()
  await frame.locator('.cs-lib-space-card').filter({ hasText: 'Codex 迁移验证' }).click()
  const composer = frame.locator('.cs-composer textarea').first()
  await composer.fill('主线问题')
  await composer.press('Enter')
  const answer = frame.locator('.cs-card-main .cs-a').filter({ hasText: '主线锚点 ABC' })
  await answer.waitFor({ timeout: 10000 })
  await frame.locator('.cs-card-main').first().dblclick()
  await frame.locator('.cs-card-main.cs-selected').first().waitFor()
  await frame.locator('.cs-card-main .cs-status').waitFor({ state: 'hidden' })
  await answer.evaluate(el => {
    const range = document.createRange()
    range.selectNodeContents(el)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 300, clientY: 350 }))
  })
  await frame.getByRole('button', { name: '从这里追问', exact: true }).first().click({ timeout: 5000 })
  const draft = frame.locator('.cs-composer textarea').first()
  await draft.fill('支线问题')
  await draft.press('Enter')
  await frame.locator('.cs-card-branch .cs-a').filter({ hasText: '支线结果' }).waitFor({ timeout: 10000 })
  await frame.locator('.cs-card-branch').getByRole('button', { name: 'M1', exact: true }).click()
  await frame.getByRole('button', { name: /定位原文/ }).first().click()
  let stored
  for (let attempt = 0; attempt < 25; attempt++) {
    stored = JSON.parse((await route('/space?id=' + created.space.id)).body).space
    if (stored?.branches[0]?.turns[0]?.status === 'completed') break
    await delay(200)
  }
  assert.ok(stored, 'The space is readable after the answer is saved')
  assert.equal(stored.main.turns[0].answer, '主线锚点 ABC')
  assert.equal(stored.branches[0].anchorTurnId, stored.main.turns[0].id)
  assert.equal(stored.branches[0].turns[0].answer, '支线结果')
  assert.equal(stored.branches[0].turns[0].sources[0].turnId, stored.main.turns[0].id)
  assert.ok(requests.some(request => request.messages[0].content.includes('主线锚点 ABC') && request.messages[0].content.includes('当前是分支追问')))
  assert.deepEqual(errors, [])
  console.log('Codex bridge E2E passed: open, upload/download, main stream, selected-text branch, locate, persist.')
} finally {
  await browser?.close()
  child.stdin.end()
  mock.close()
}
