const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const React = require('react')
const TestRenderer = require('react-test-renderer')
const { act } = TestRenderer

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const library = {
  version: 1,
  schemaVersion: 2,
  folders: [],
  spaces: [{
    id: 'default',
    title: 'Test Space',
    folderId: null,
    layoutMode: 'vertical',
    createdAt: 1,
    updatedAt: 2,
    lastOpenedAt: 0,
    turnCount: 1,
    lastQuestion: 'Q',
  }],
}
const space = {
  version: 1,
  schemaVersion: 2,
  id: 'default',
  title: 'Test Space',
  layoutMode: 'vertical',
  memoryMode: 'lexical',
  summaryMode: 'every',
  main: { turns: [{ id: 'turn-1', question: 'Q', answer: 'A', status: 'completed', createdAt: 1 }] },
  branches: [],
  view: { x: 120, y: 120, zoom: 1 },
}

let captured = null
global.window = {
  __ModuleLoader__: { load: (spec) => { captured = spec } },
  innerWidth: 1200,
  innerHeight: 800,
  getSelection: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
  confirm: () => true,
  location: { reload: () => {} },
}
global.document = { addEventListener: () => {}, removeEventListener: () => {}, body: { appendChild: () => {} } }
try { Object.defineProperty(globalThis, 'navigator', { value: {}, configurable: true }) } catch (_error) {}
const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const fetchMock = async (url) => {
  const target = String(url)
  if (target.includes('/library')) return jsonResponse({ ok: true, library, model: { provider: 'test', model: 'test' } })
  if (target.includes('/space?id=')) return jsonResponse({ ok: true, space, model: { provider: 'test', model: 'test' } })
  if (target.includes('/maintenance/backups')) return jsonResponse({ ok: true, items: [{ kind: 'space', id: 'default', title: 'Test Space', source: 'bak', bytes: 128, modifiedAt: Date.now() }] })
  if (target.includes('/maintenance/restore')) return jsonResponse({ ok: true, library })
  if (target.includes('/backup')) return jsonResponse({ ok: true, config: { remote: '', branch: 'main' } })
  if (target.includes('/trash')) return jsonResponse({ ok: true, items: [] })
  return jsonResponse({ ok: true })
}
const sandbox = {
  window: global.window,
  document: global.document,
  navigator: {},
  fetch: fetchMock,
  console,
  TextDecoder,
  TextEncoder,
  Response,
  ReadableStream,
  Blob,
  AbortController,
  setTimeout,
  clearTimeout,
  sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
}
vm.createContext(sandbox)
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'client.js'), 'utf8'), sandbox)
assert.ok(captured, 'client plugin did not register')
const plugin = captured.factory((id) => {
  if (id === 'react') return React
  throw new Error('unexpected module ' + id)
})
const registrations = []
plugin.apply({
  effect: (fn) => { fn(); return () => {} },
  locale: { register: () => () => {}, bind: () => (key) => key },
  slots: {
    inject: (name, callback) => { callback(); return () => {} },
    register: (options, component) => { registrations.push({ options, component }); return () => {} },
  },
  layout: { selectPanel: () => {}, panelInfo: { getSnapshot: () => ({ activePanelId: null }), subscribe: () => () => {} } },
})
const Root = registrations.find((entry) => entry.options.key === 'chat-space').component

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
const textOf = (node) => {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (node.children) return node.children.map(textOf).join('')
  return ''
}
const buttonByText = (renderer, text) => renderer.root.findAll((node) => node.type === 'button' && textOf(node) === text)[0]
const findAll = (renderer, predicate) => renderer.root.findAll(predicate)

test('root renders library, canvas, settings, privacy, and recovery without crashing', async () => {
  let renderer
  await act(async () => {
    renderer = TestRenderer.create(React.createElement(Root, { tr: (key) => key, t: (key) => key, onBackToConversation: () => {} }))
    await flush()
    await flush()
  })
  assert.match(textOf(renderer.root), /Test Space/)
  const card = findAll(renderer, (node) => node.props && node.props.className === 'cs-lib-space-card')[0]
  assert.ok(card, 'space card missing')
  await act(async () => {
    card.props.onClick()
    await flush()
    await flush()
  })
  assert.ok(findAll(renderer, (node) => node.props && typeof node.props.className === 'string' && node.props.className.includes('cs-card-main')).length > 0)

  const mainCard = findAll(renderer, (node) => node.props && typeof node.props.className === 'string' && node.props.className.includes('cs-card-main'))[0]
  assert.ok(mainCard, 'main card missing')
  await act(async () => {
    mainCard.props.onContextMenu({ preventDefault: () => {}, stopPropagation: () => {}, clientX: 100, clientY: 100, target: { closest: () => null } })
    await flush()
  })
  assert.match(textOf(renderer.root), /copyQuestion/)
  assert.match(textOf(renderer.root), /delete/)
  assert.match(textOf(renderer.root), /changeColor/)

  const back = findAll(renderer, (node) => node.type === 'button' && textOf(node).includes('backToLibrary'))[0]
  assert.ok(back, 'back-to-library button missing')
  await act(async () => { back.props.onClick(); await flush(); await flush() })

  const settings = buttonByText(renderer, 'settings')
  assert.ok(settings, 'settings button missing')
  await act(async () => { settings.props.onClick(); await flush() })
  assert.match(textOf(renderer.root), /privacy/)
  assert.match(textOf(renderer.root), /backup/)
  assert.match(textOf(renderer.root), /recovery/)
  assert.match(textOf(renderer.root), /importLibrary/)
  assert.match(textOf(renderer.root), /exportLibrary/)

  const privacy = findAll(renderer, (node) => node.type === 'button' && textOf(node).startsWith('privacy'))[0]
  assert.ok(privacy, 'privacy row missing')
  await act(async () => { privacy.props.onClick(); await flush() })
  assert.match(textOf(renderer.root), /privacyBody/)
  const closePrivacy = buttonByText(renderer, 'close')
  await act(async () => { closePrivacy.props.onClick(); await flush() })

  await act(async () => { settings.props.onClick(); await flush() })
  const recovery = findAll(renderer, (node) => node.type === 'button' && textOf(node).startsWith('recovery'))[0]
  assert.ok(recovery, 'recovery row missing')
  await act(async () => { recovery.props.onClick(); await flush(); await flush() })
  assert.match(textOf(renderer.root), /Test Space/)
  assert.match(textOf(renderer.root), /bak/)
  assert.match(textOf(renderer.root), /recoveryHint/)
  const restore = buttonByText(renderer, 'restore')
  assert.ok(restore, 'restore button missing')
  await act(async () => { restore.props.onClick(); await flush(); await flush() })
  assert.match(textOf(renderer.root), /restoreDone/)

  const cardAgain = findAll(renderer, (node) => node.props && node.props.className === 'cs-lib-space-card')[0]
  await act(async () => { cardAgain.props.onClick(); await flush(); await flush() })
  const memory = buttonByText(renderer, 'memory')
  assert.ok(memory, 'memory button missing')
  await act(async () => { memory.props.onClick(); await flush() })
  assert.match(textOf(renderer.root), /memoryLexical/)
  assert.match(textOf(renderer.root), /memorySemantic/)
  assert.match(textOf(renderer.root), /summaryFrequency/)

  await act(async () => { renderer.unmount(); await flush() })
})
