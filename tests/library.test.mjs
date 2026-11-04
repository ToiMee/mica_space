import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
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
    attachments: {
      fileHostPath(ref) { return ref && ref.hostPath ? ref.hostPath : null },
      imageHostPath() { return null },
    },
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
    assert.equal(library.body.library.schemaVersion, 2)

    const created = await request('POST', '/chat-space/api/space/create', { title: '测试空间', layoutMode: 'vertical' })
    assert.equal(created.status, 200)
    assert.equal(created.body.space.schemaVersion, 2)
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
    assert.equal(saved.body.space.schemaVersion, 2)
    const loaded = await request('GET', '/chat-space/api/space?id=' + encodeURIComponent(spaceId))
    assert.equal(loaded.status, 200)
    assert.equal(loaded.body.space.main.turns.length, 1)
    assert.equal(loaded.body.space.main.turns[0].question, '问题一')

    const uploaded = await request('POST', '/chat-space/api/upload', {
      kind: 'file',
      name: 'mica-local.txt',
      data: Buffer.from('mica local attachment').toString('base64'),
    })
    assert.equal(uploaded.status, 200, JSON.stringify(uploaded.body))
    assert.equal(uploaded.body.attachment.storage, 'mica')
    const localAttachmentPath = path.join(root, '.chat-space', 'attachments', uploaded.body.attachment.file)
    assert.equal((await stat(localAttachmentPath)).isFile(), true)
    const localSpace = await request('POST', '/chat-space/api/space/create', { title: '本地附件空间', layoutMode: 'vertical' })
    const localSpaceId = localSpace.body.space.id
    await request('POST', '/chat-space/api/save', {
      space: {
        ...localSpace.body.space,
        main: { turns: [{ id: 'turn-local-att', question: '本地附件', answer: '本地附件', status: 'completed', createdAt: Date.now(), attachments: [{ kind: 'file', attachment: uploaded.body.attachment }] }] },
        branches: [],
      },
      spaceId: localSpaceId,
    })
    await request('POST', '/chat-space/api/space/delete', { id: localSpaceId })
    const localTrash = await request('GET', '/chat-space/api/trash')
    const localTrashItem = localTrash.body.items.find((item) => item.id === localSpaceId)
    assert.ok(localTrashItem)
    const localPermanent = await request('POST', '/chat-space/api/trash/delete', { file: localTrashItem.file })
    assert.equal(localPermanent.status, 200)
    await assert.rejects(stat(localAttachmentPath))

    const attachmentPath = path.join(root, 'mica-orphan-test.txt')
    await writeFile(attachmentPath, 'orphan')
    const attachmentSpace = await request('POST', '/chat-space/api/space/create', { title: '附件空间', layoutMode: 'vertical' })
    const attachmentId = attachmentSpace.body.space.id
    await request('POST', '/chat-space/api/save', {
      space: {
        ...attachmentSpace.body.space,
        main: { turns: [{ id: 'turn-att', question: '附件', answer: '附件', status: 'completed', createdAt: Date.now(), attachments: [{ kind: 'file', attachment: { attachmentId: 'sha256:orphan-test', name: 'mica-orphan-test.txt', bytes: 6, hostPath: attachmentPath } }] }] },
        branches: [],
      },
      spaceId: attachmentId,
    })
    const attachmentDeleted = await request('POST', '/chat-space/api/space/delete', { id: attachmentId })
    assert.equal(attachmentDeleted.status, 200)
    const attachmentTrash = await request('GET', '/chat-space/api/trash')
    const attachmentTrashItem = attachmentTrash.body.items.find((item) => item.id === attachmentId)
    assert.ok(attachmentTrashItem)
    const attachmentPermanent = await request('POST', '/chat-space/api/trash/delete', { file: attachmentTrashItem.file })
    assert.equal(attachmentPermanent.status, 200)
    await assert.rejects(stat(attachmentPath))

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

    const backups = await request('GET', '/chat-space/api/maintenance/backups')
    assert.equal(backups.status, 200)
    assert.ok(Array.isArray(backups.body.items))

    const exported = await request('GET', '/chat-space/api/export')
    assert.equal(exported.status, 200)
    const imported = await request('POST', '/chat-space/api/import', { bundle: exported.body.bundle })
    assert.equal(imported.status, 200)
    assert.ok(imported.body.library.folders.some((folder) => folder.name.startsWith('导入 ')))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
