import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { apply } from '../index.js'

function makeFakeCtx(root) {
  const routes = new Map()
  const ctx = {
    get(name) {
      if (name === 'workspaceRegistry') return { list: () => [{ path: root }] }
      if (name === 'workingDirectory') return { defaultDirectory: root }
      return null
    },
    effect(fn) { fn(); return () => {} },
    webServer: {
      register({ path: routePath, handler }) {
        routes.set(routePath, handler)
        return () => routes.delete(routePath)
      },
    },
    agentDefaultModel: { currentSelection: () => ({ provider: 'test-provider', model: 'test-model' }) },
    llm: {},
  }
  apply(ctx)
  return routes
}

function makeRequest(routes) {
  return async function request(method, requestPath, body) {
    const routePath = requestPath.split('?')[0]
    const handler = routes.get(routePath)
    if (!handler) return { status: 404, body: null }
    const req = new EventEmitter()
    req.method = method
    req.url = requestPath
    req.destroy = () => {}
    const res = {
      status: 0,
      body: null,
      writableEnded: false,
      writeHead(status) { this.status = status },
      end(value) {
        this.writableEnded = true
        this.body = value ? JSON.parse(value) : null
      },
    }
    const promise = handler(req, res)
    if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body)))
    req.emit('end')
    await promise
    return { status: res.status, body: res.body }
  }
}

test('space lifecycle, trash restore, duplicate, folder cycle, export/import', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'mica-space-test-'))
  try {
    const routes = makeFakeCtx(root)
    const request = makeRequest(routes)

    const library = await request('GET', '/chat-space/api/library')
    assert.equal(library.status, 200)
    assert.equal(library.body.ok, true)

    const created = await request('POST', '/chat-space/api/space/create', { title: '测试空间', layoutMode: 'vertical' })
    assert.equal(created.status, 200)
    const spaceId = created.body.space.id
    assert.ok(spaceId)
    const saved = await request('POST', '/chat-space/api/save', {
      space: {
        ...created.body.space,
        main: { turns: [{ id: 'turn-1', question: '问题一', answer: '回答一', status: 'completed', createdAt: Date.now() }] },
        branches: [],
      },
      spaceId,
    })
    assert.equal(saved.status, 200)
    const loaded = await request('GET', '/chat-space/api/space?id=' + encodeURIComponent(spaceId))
    assert.equal(loaded.status, 200)
    assert.equal(loaded.body.space.main.turns.length, 1)
    assert.equal(loaded.body.space.main.turns[0].question, '问题一')

    const duplicated = await request('POST', '/chat-space/api/space/duplicate', { id: spaceId })
    assert.equal(duplicated.status, 200)
    assert.ok(duplicated.body.library.spaces.some((space) => space.id !== spaceId && space.title.includes('副本')))

    const deleted = await request('POST', '/chat-space/api/space/delete', { id: spaceId })
    assert.equal(deleted.status, 200)
    assert.ok(!deleted.body.library.spaces.some((space) => space.id === spaceId))
    const trash = await request('GET', '/chat-space/api/trash')
    assert.equal(trash.status, 200)
    assert.ok(trash.body.items.some((item) => item.id === spaceId))
    const trashItem = trash.body.items.find((item) => item.id === spaceId)
    const restored = await request('POST', '/chat-space/api/trash/restore', { file: trashItem.file })
    assert.equal(restored.status, 200)
    assert.ok(restored.body.library.spaces.some((space) => space.id === spaceId))

    const parent = await request('POST', '/chat-space/api/folder/create', { name: '父文件夹', parentId: null })
    const parentId = parent.body.library.folders.find((folder) => folder.name === '父文件夹').id
    const child = await request('POST', '/chat-space/api/folder/create', { name: '子文件夹', parentId })
    const childId = child.body.library.folders.find((folder) => folder.name === '子文件夹').id
    const moved = await request('POST', '/chat-space/api/folder/update', { id: childId, parentId })
    assert.equal(moved.status, 200)
    const cycle = await request('POST', '/chat-space/api/folder/update', { id: parentId, parentId: childId })
    assert.equal(cycle.status, 500)

    const exported = await request('GET', '/chat-space/api/export')
    assert.equal(exported.status, 200)
    const imported = await request('POST', '/chat-space/api/import', { bundle: exported.body.bundle })
    assert.equal(imported.status, 200)
    assert.ok(imported.body.library.folders.some((folder) => folder.name.startsWith('导入 ')))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
