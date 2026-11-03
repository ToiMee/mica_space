// Host half of the Chat Space plugin.
//
// Data model (v2):
//   .chat-space/library.json          folders + space metadata
//   .chat-space/spaces/<id>.json      one independent canvas/conversation
//   .chat-space/trash/                deleted space snapshots
//
// The old single .chat-space/space.json is migrated to the "default" space
// the first time the library is read.

import { execFile } from 'node:child_process'
import { copyFile, mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { inflateRawSync, inflateSync } from 'node:zlib'

const execFileAsync = promisify(execFile)

const API_ROOT = '/chat-space/api'
const DATA_DIR_NAME = '.chat-space'
const LIBRARY_FILE_NAME = 'library.json'
const LEGACY_FILE_NAME = 'space.json'
const SPACES_DIR_NAME = 'spaces'
const TRASH_DIR_NAME = 'trash'
const MAX_BODY_BYTES = 4 * 1024 * 1024
const MAX_UPLOAD_BYTES = 32 * 1024 * 1024
const MAX_ANCHOR_CHARS = 2400
const MAX_MAIN_CONTEXT_CHARS = 1600
const MAX_HISTORY_ITEM_CHARS = 6000

export const inject = ['webServer', 'llm', 'agentDefaultModel', 'attachments']

function validId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value)
}

function makeId(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
}

export function apply(ctx) {
  const workingDirectory = ctx.get('workingDirectory')

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

  const dataDir = () => path.join(resolveBaseDir(), DATA_DIR_NAME)
  const legacyFile = () => path.join(dataDir(), LEGACY_FILE_NAME)
  const libraryFile = () => path.join(dataDir(), LIBRARY_FILE_NAME)
  const spacesDir = () => path.join(dataDir(), SPACES_DIR_NAME)
  const trashDir = () => path.join(dataDir(), TRASH_DIR_NAME)
  const spaceFile = (id) => path.join(spacesDir(), id + '.json')
  const backupFile = () => path.join(dataDir(), 'backup.json')

  const readBackupConfig = async () => {
    const config = await readJson(backupFile())
    return {
      remote: config && typeof config.remote === 'string' ? config.remote : '',
      branch: config && typeof config.branch === 'string' && config.branch ? config.branch : 'main',
    }
  }

  const saveBackupConfig = async (body) => {
    const remote = typeof body.remote === 'string' ? body.remote.trim().slice(0, 500) : ''
    const branch = typeof body.branch === 'string' && body.branch.trim() ? body.branch.trim().slice(0, 80) : 'main'
    await writeJson(backupFile(), { remote, branch })
    return { remote, branch }
  }

  const runGitBackup = async () => {
    const directory = dataDir()
    await mkdir(directory, { recursive: true })
    const config = await readBackupConfig()
    const run = async (args) => {
      try {
        const result = await execFileAsync('git', args, { cwd: directory, timeout: 45000, windowsHide: true, maxBuffer: 8 * 1024 * 1024 })
        return result.stdout || ''
      } catch (error) {
        const detail = String((error && (error.stderr || error.stdout)) || (error && error.message) || 'git 命令失败').trim()
        throw new Error(detail.slice(0, 1200))
      }
    }
    const ignoreFile = path.join(directory, '.gitignore')
    try { await writeFile(ignoreFile, 'backup.json\n*.tmp-*\n', 'utf8') } catch (_error) {}
    let initialized = false
    try {
      await run(['rev-parse', '--is-inside-work-tree'])
    } catch (_error) {
      await run(['init'])
      initialized = true
    }
    await run(['config', 'user.email', 'mica-space@local'])
    await run(['config', 'user.name', 'Mica Space'])
    await run(['add', '-A'])
    let committed = false
    try {
      await run(['commit', '-m', 'Mica Space backup ' + new Date().toISOString()])
      committed = true
    } catch (error) {
      if (!/nothing to commit|no changes added/i.test(String(error && error.message))) throw error
    }
    const commit = (await run(['rev-parse', 'HEAD'])).trim()
    let pushed = false
    if (config.remote) {
      try { await run(['remote', 'remove', 'origin']) } catch (_error) {}
      await run(['remote', 'add', 'origin', config.remote])
      await run(['push', '-u', 'origin', config.branch || 'main'])
      pushed = true
    }
    return { initialized, committed, pushed, commit, branch: config.branch || 'main', remote: config.remote }
  }

  const readJson = async (file) => {
    try {
      const raw = await readFile(file, 'utf8')
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch (error) {
      if (error && error.code === 'ENOENT') return null
      throw error
    }
  }

  const writeJson = async (file, value) => {
    await mkdir(path.dirname(file), { recursive: true })
    try {
      await copyFile(file, file + '.bak')
    } catch (error) {
      if (error && error.code !== 'ENOENT') throw error
    }
    const temp = file + '.tmp-' + process.pid + '-' + Date.now()
    await writeFile(temp, JSON.stringify(value, null, 2), 'utf8')
    try {
      await rename(temp, file)
    } catch (_error) {
      try { await unlink(file) } catch (unlinkError) { if (unlinkError && unlinkError.code !== 'ENOENT') throw unlinkError }
      await rename(temp, file)
    }
  }

  const normalizeLibrary = (raw) => {
    const folders = Array.isArray(raw && raw.folders)
      ? raw.folders.filter((folder) => folder && validId(folder.id)).map((folder) => ({
          id: folder.id,
          name: String(folder.name || '未命名文件夹').slice(0, 120),
          parentId: validId(folder.parentId) ? folder.parentId : null,
          order: Number.isFinite(folder.order) ? folder.order : 0,
          createdAt: Number.isFinite(folder.createdAt) ? folder.createdAt : Date.now(),
        }))
      : []
    const spaces = Array.isArray(raw && raw.spaces)
      ? raw.spaces.filter((space) => space && validId(space.id)).map((space) => ({
          id: space.id,
          title: String(space.title || '未命名空间').slice(0, 200),
          folderId: validId(space.folderId) ? space.folderId : null,
          layoutMode: space.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
          createdAt: Number.isFinite(space.createdAt) ? space.createdAt : Date.now(),
          updatedAt: Number.isFinite(space.updatedAt) ? space.updatedAt : Date.now(),
          lastOpenedAt: Number.isFinite(space.lastOpenedAt) ? space.lastOpenedAt : 0,
          turnCount: Number.isFinite(space.turnCount) ? space.turnCount : 0,
          lastQuestion: String(space.lastQuestion || '').slice(0, 240),
          firstSummary: String(space.firstSummary || '').slice(0, 240),
        }))
      : []
    return { version: 1, folders, spaces }
  }

  const spaceMeta = (space, folderId, createdAt) => {
    const mainTurns = Array.isArray(space.main && space.main.turns) ? space.main.turns : []
    const branches = Array.isArray(space.branches) ? space.branches : []
    const branchTurns = branches.flatMap((branch) => (Array.isArray(branch.turns) ? branch.turns : []))
    const allTurns = mainTurns.concat(branchTurns)
    const last = allTurns.length > 0 ? allTurns[allTurns.length - 1] : null
    const firstMain = mainTurns.length > 0 ? mainTurns[0] : null
    const firstSummary = firstMain ? String(firstMain.summary || firstMain.question || '').slice(0, 240) : ''
    return {
      id: space.id,
      title: String(space.title || '未命名空间').slice(0, 200),
      folderId: validId(folderId) ? folderId : null,
      layoutMode: space.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
      createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
      updatedAt: Date.now(),
      lastOpenedAt: Date.now(),
      turnCount: allTurns.length,
      lastQuestion: String(last && last.question || '').slice(0, 240),
      firstSummary,
    }
  }

  const syncFirstSummaries = async (library) => {
    let changed = false
    for (const meta of library.spaces) {
      if (meta.firstSummary) continue
      const space = await readJson(spaceFile(meta.id))
      const first = space && space.main && Array.isArray(space.main.turns) ? space.main.turns[0] : null
      if (first) {
        meta.firstSummary = String(first.summary || first.question || '').slice(0, 240)
        changed = true
      }
    }
    if (changed) await writeJson(libraryFile(), library)
    return library
  }

  const readLibrary = async () => {
    const existing = await readJson(libraryFile())
    if (existing) {
      const library = normalizeLibrary(existing)
      return syncFirstSummaries(library)
    }
    const legacy = await readJson(legacyFile())
    if (legacy && legacy.main && Array.isArray(legacy.main.turns) && Array.isArray(legacy.branches)) {
      const id = 'default'
      const space = {
        ...legacy,
        id,
        title: String(legacy.title || '默认空间'),
        layoutMode: legacy.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
      }
      await writeJson(spaceFile(id), space)
      const library = { version: 1, folders: [], spaces: [spaceMeta(space, null, space.createdAt)] }
      await writeJson(libraryFile(), library)
      return library
    }
    const empty = { version: 1, folders: [], spaces: [] }
    await writeJson(libraryFile(), empty)
    return empty
  }

  const readSpace = async (requestedId) => {
    const library = await readLibrary()
    const id = validId(requestedId) && library.spaces.some((space) => space.id === requestedId)
      ? requestedId
      : (library.spaces[0] && library.spaces[0].id) || 'default'
    if (!validId(id)) return null
    const space = await readJson(spaceFile(id))
    if (!space || !space.main || !Array.isArray(space.main.turns) || !Array.isArray(space.branches)) return null
    return {
      ...space,
      id,
      title: String(space.title || '未命名空间'),
      layoutMode: space.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
    }
  }

  const writeSpaceData = async (space, requestedId) => {
    const id = validId(space.id) ? space.id : validId(requestedId) ? requestedId : 'default'
    if (!validId(id)) throw new Error('空间 ID 不合法')
    const library = await readLibrary()
    const existing = library.spaces.find((item) => item.id === id) || null
    const normalized = {
      ...space,
      id,
      title: String(space.title || (existing && existing.title) || '未命名空间').slice(0, 200),
      layoutMode: space.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
    }
    await writeJson(spaceFile(id), normalized)
    const meta = spaceMeta(normalized, existing && existing.folderId, existing && existing.createdAt)
    library.spaces = library.spaces.filter((item) => item.id !== id).concat([meta])
    await writeJson(libraryFile(), library)
    return { space: normalized, library }
  }

  const createSpace = async (body) => {
    const library = await readLibrary()
    const folderId = validId(body.folderId) && library.folders.some((folder) => folder.id === body.folderId)
      ? body.folderId
      : null
    const id = makeId('s')
    const space = {
      version: 1,
      id,
      title: String(body.title || '未命名空间').trim().slice(0, 200) || '未命名空间',
      layoutMode: body.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
      main: { turns: [] },
      branches: [],
      view: { x: 120, y: 120, zoom: 1 },
      createdAt: Date.now(),
    }
    const written = await writeSpaceData(space, id)
    const meta = written.library.spaces.find((item) => item.id === id)
    if (meta) meta.folderId = folderId
    await writeJson(libraryFile(), written.library)
    return { space: written.space, library: written.library }
  }

  const updateSpaceMeta = async (body) => {
    const id = validId(body.id) ? body.id : ''
    if (!id) throw new Error('空间 ID 不合法')
    const library = await readLibrary()
    const meta = library.spaces.find((item) => item.id === id)
    if (!meta) throw new Error('空间不存在')
    if (typeof body.title === 'string' && body.title.trim()) {
      const space = await readJson(spaceFile(id))
      if (space) {
        space.title = body.title.trim().slice(0, 200)
        await writeJson(spaceFile(id), space)
      }
      meta.title = body.title.trim().slice(0, 200)
    }
    if (body.folderId === null || body.folderId === '') meta.folderId = null
    else if (validId(body.folderId) && library.folders.some((folder) => folder.id === body.folderId)) meta.folderId = body.folderId
    meta.updatedAt = Date.now()
    meta.lastOpenedAt = Date.now()
    await writeJson(libraryFile(), library)
    return library
  }

  const duplicateSpace = async (body) => {
    const id = validId(body.id) ? body.id : ''
    if (!id) throw new Error('空间 ID 不合法')
    const sourceSpace = await readJson(spaceFile(id))
    if (!sourceSpace) throw new Error('空间不存在')
    const library = await readLibrary()
    const sourceMeta = library.spaces.find((item) => item.id === id)
    const newId = makeId('s')
    const copy = {
      ...sourceSpace,
      id: newId,
      title: String(sourceSpace.title || '未命名空间') + ' 副本',
      createdAt: Date.now(),
    }
    const result = await writeSpaceData(copy, newId)
    const meta = result.library.spaces.find((item) => item.id === newId)
    if (meta && sourceMeta) meta.folderId = sourceMeta.folderId
    await writeJson(libraryFile(), result.library)
    return { space: result.space, library: result.library }
  }

  const deleteSpace = async (body) => {
    const id = validId(body.id) ? body.id : ''
    if (!id) throw new Error('空间 ID 不合法')
    const file = spaceFile(id)
    const library = await readLibrary()
    const meta = library.spaces.find((item) => item.id === id)
    try {
      const space = await readJson(file)
      if (space) {
        await mkdir(trashDir(), { recursive: true })
        const record = {
          space,
          folderId: (meta && validId(meta.folderId)) ? meta.folderId : null,
          deletedAt: Date.now(),
        }
        await writeJson(path.join(trashDir(), id + '-' + Date.now() + '.json'), record)
      }
    } catch (error) {
      if (error && error.code !== 'ENOENT') throw error
    }
    try { await unlink(file) } catch (error) { if (error && error.code !== 'ENOENT') throw error }
    library.spaces = library.spaces.filter((item) => item.id !== id)
    await writeJson(libraryFile(), library)
    return library
  }

  const trashEntries = async () => {
    const directory = trashDir()
    await mkdir(directory, { recursive: true })
    const names = await readdir(directory)
    const items = []
    for (const name of names) {
      if (!name.endsWith('.json') || name.includes('.bak')) continue
      const record = await readJson(path.join(directory, name))
      if (!record) continue
      const space = record.space && typeof record.space === 'object' ? record.space : record
      if (!space || !validId(space.id)) continue
      const stamp = name.match(/-(\d{10,})\.json$/)
      items.push({
        file: name,
        id: space.id,
        title: String(space.title || '未命名空间').slice(0, 200),
        folderId: validId(record.folderId) ? record.folderId : null,
        deletedAt: Number.isFinite(record.deletedAt) ? record.deletedAt : (stamp ? Number(stamp[1]) : 0),
      })
    }
    return items.sort((left, right) => (right.deletedAt || 0) - (left.deletedAt || 0))
  }

  const restoreTrash = async (body) => {
    const file = path.basename(stringOf(body.file))
    if (!file || !file.endsWith('.json')) throw new Error('回收站记录不合法')
    const record = await readJson(path.join(trashDir(), file))
    if (!record) throw new Error('回收站记录不存在')
    const space = record.space && typeof record.space === 'object' ? record.space : record
    if (!space || !validId(space.id)) throw new Error('回收站记录损坏')
    const result = await writeSpaceData(space, space.id)
    const library = result.library
    const meta = library.spaces.find((item) => item.id === space.id)
    if (meta) {
      meta.folderId = validId(record.folderId) && library.folders.some((folder) => folder.id === record.folderId)
        ? record.folderId
        : null
      await writeJson(libraryFile(), library)
    }
    try { await unlink(path.join(trashDir(), file)) } catch (error) { if (error && error.code !== 'ENOENT') throw error }
    return library
  }

  const deleteTrash = async (body) => {
    const file = path.basename(stringOf(body.file))
    if (!file || !file.endsWith('.json')) throw new Error('回收站记录不合法')
    try { await unlink(path.join(trashDir(), file)) } catch (error) { if (error && error.code !== 'ENOENT') throw error }
    return trashEntries()
  }

  const exportLibrary = async () => {
    const library = await readLibrary()
    const spaces = {}
    for (const meta of library.spaces) {
      const space = await readJson(spaceFile(meta.id))
      if (space) spaces[meta.id] = space
    }
    return { version: 1, exportedAt: new Date().toISOString(), library, spaces }
  }

  const importLibrary = async (body) => {
    const bundle = body && body.bundle && typeof body.bundle === 'object' ? body.bundle : body
    const sourceLibrary = bundle && bundle.library
    const sourceSpaces = bundle && bundle.spaces
    if (!sourceLibrary || !sourceSpaces || typeof sourceSpaces !== 'object') throw new Error('导入文件格式不正确')
    const library = await readLibrary()
    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const root = {
      id: makeId('f'),
      name: '导入 ' + stamp,
      parentId: null,
      order: Date.now(),
      createdAt: Date.now(),
    }
    library.folders.push(root)
    const sourceFolders = Array.isArray(sourceLibrary.folders) ? sourceLibrary.folders : []
    const folderMap = new Map()
    for (const folder of sourceFolders) {
      if (!folder || !validId(folder.id)) continue
      folderMap.set(folder.id, makeId('f'))
    }
    for (const folder of sourceFolders) {
      if (!folder || !validId(folder.id)) continue
      const mapped = folderMap.get(folder.id)
      const parent = folder.parentId && folderMap.has(folder.parentId) ? folderMap.get(folder.parentId) : root.id
      library.folders.push({
        id: mapped,
        name: String(folder.name || '未命名文件夹').slice(0, 120),
        parentId: parent,
        order: Number.isFinite(folder.order) ? folder.order : Date.now(),
        createdAt: Number.isFinite(folder.createdAt) ? folder.createdAt : Date.now(),
      })
    }
    await writeJson(libraryFile(), library)
    const sourceMetas = Array.isArray(sourceLibrary.spaces) ? sourceLibrary.spaces : []
    let currentLibrary = library
    for (const meta of sourceMetas) {
      if (!meta || !validId(meta.id)) continue
      const data = sourceSpaces[meta.id] || (Array.isArray(sourceSpaces) ? sourceSpaces.find((space) => space && space.id === meta.id) : null)
      if (!data || !data.main || !Array.isArray(data.main.turns) || !Array.isArray(data.branches)) continue
      const id = makeId('s')
      const space = {
        ...data,
        id,
        title: String(meta.title || data.title || '导入空间').slice(0, 200),
        layoutMode: meta.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
        createdAt: Date.now(),
      }
      const written = await writeSpaceData(space, id)
      currentLibrary = written.library
      const newMeta = currentLibrary.spaces.find((item) => item.id === id)
      if (newMeta) {
        newMeta.folderId = meta.folderId && folderMap.has(meta.folderId) ? folderMap.get(meta.folderId) : root.id
        await writeJson(libraryFile(), currentLibrary)
      }
    }
    return currentLibrary
  }

  const createFolder = async (body) => {
    const library = await readLibrary()
    const parentId = validId(body.parentId) && library.folders.some((folder) => folder.id === body.parentId)
      ? body.parentId
      : null
    const folder = {
      id: makeId('f'),
      name: String(body.name || '新建文件夹').trim().slice(0, 120) || '新建文件夹',
      parentId,
      order: Date.now(),
      createdAt: Date.now(),
    }
    library.folders.push(folder)
    await writeJson(libraryFile(), library)
    return library
  }

  const updateFolder = async (body) => {
    const id = validId(body.id) ? body.id : ''
    const library = await readLibrary()
    const folder = library.folders.find((item) => item.id === id)
    if (!folder) throw new Error('文件夹不存在')
    if (typeof body.name === 'string' && body.name.trim()) folder.name = body.name.trim().slice(0, 120)
    if (Object.prototype.hasOwnProperty.call(body, 'parentId')) {
      let parentId = null
      if (body.parentId) {
        if (!validId(body.parentId) || !library.folders.some((item) => item.id === body.parentId)) throw new Error('目标文件夹不存在')
        parentId = body.parentId
      }
      let cursor = parentId
      while (cursor) {
        if (cursor === id) throw new Error('不能把文件夹移动到自身或子文件夹里')
        const parent = library.folders.find((item) => item.id === cursor)
        cursor = parent ? parent.parentId : null
      }
      folder.parentId = parentId
    }
    await writeJson(libraryFile(), library)
    return library
  }

  const deleteFolder = async (body) => {
    const id = validId(body.id) ? body.id : ''
    const library = await readLibrary()
    const folder = library.folders.find((item) => item.id === id)
    if (!folder) throw new Error('文件夹不存在')
    const parentId = folder.parentId
    library.folders = library.folders
      .filter((item) => item.id !== id)
      .map((item) => (item.parentId === id ? { ...item, parentId } : item))
    library.spaces = library.spaces.map((item) => (item.folderId === id ? { ...item, folderId: parentId } : item))
    await writeJson(libraryFile(), library)
    return library
  }

  const route = (pathName, handler) => ctx.webServer.register({
    kind: 'exact',
    path: pathName,
    handler,
  })

  ctx.effect(() => {
    const disposers = [
      route(API_ROOT + '/library', async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: '只支持 GET' })
        try {
          const library = await readLibrary()
          let model = null
          try { model = ctx.agentDefaultModel.currentSelection() } catch (_error) { model = null }
          sendJson(res, 200, { ok: true, library, model })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/space', async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: '只支持 GET' })
        try {
          let requestedId = ''
          try {
            requestedId = new URL(req.url, 'http://localhost').searchParams.get('id') || ''
          } catch (_error) { requestedId = '' }
          const space = await readSpace(requestedId)
          let model = null
          try { model = ctx.agentDefaultModel.currentSelection() } catch (_error) { model = null }
          sendJson(res, 200, { ok: true, space, model })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/save', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const space = body && body.space
          if (!space || typeof space !== 'object' || !space.main || !Array.isArray(space.main.turns) || !Array.isArray(space.branches)) {
            return sendJson(res, 400, { ok: false, error: '聊天空间数据格式不正确' })
          }
          const result = await writeSpaceData(space, body.spaceId)
          sendJson(res, 200, { ok: true, library: result.library, space: result.space })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/upload', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          if (!ctx.attachments) return sendJson(res, 503, { ok: false, error: '附件服务不可用' })
          const body = await readJsonBody(req, MAX_UPLOAD_BYTES)
          const raw = stringOf(body.data)
          if (!raw) return sendJson(res, 400, { ok: false, error: '文件内容为空' })
          const buffer = Buffer.from(raw, 'base64')
          if (!buffer.length) return sendJson(res, 400, { ok: false, error: '文件内容为空' })
          const name = stringOf(body.name).slice(0, 200)
          const kind = body.kind === 'image' ? 'image' : 'file'
          if (kind === 'image') {
            const mediaType = stringOf(body.mediaType)
            const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
            if (allowed.indexOf(mediaType) < 0) return sendJson(res, 415, { ok: false, error: '只支持 PNG/JPEG/WebP/GIF 图片' })
            const attachment = await ctx.attachments.saveImage({
              data: new Uint8Array(buffer),
              mediaType,
              name: name || 'image',
            })
            return sendJson(res, 200, { ok: true, kind: 'image', attachment })
          }
          const attachment = await ctx.attachments.saveFile({
            data: new Uint8Array(buffer),
            name: name || 'file',
          })
          sendJson(res, 200, { ok: true, kind: 'file', attachment })
        } catch (error) {
          sendJson(res, 400, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/attachment', async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: '只支持 GET' })
        try {
          if (!ctx.attachments) return sendJson(res, 503, { ok: false, error: '附件服务不可用' })
          const url = new URL(req.url, 'http://localhost')
          const kind = url.searchParams.get('kind') === 'image' ? 'image' : 'file'
          const rawRef = url.searchParams.get('ref') || ''
          let ref
          try { ref = JSON.parse(rawRef) } catch (_error) { ref = null }
          if (!ref || typeof ref !== 'object') return sendJson(res, 400, { ok: false, error: '附件引用不合法' })
          if (kind === 'image') {
            const stored = await ctx.attachments.readImage(ref)
            const bytes = Buffer.from(stored.data)
            res.writeHead(200, {
              'Content-Type': ref.mediaType || 'image/png',
              'Content-Length': bytes.length,
              'Cache-Control': 'private, max-age=31536000, immutable',
            })
            res.end(bytes)
            return
          }
          const download = url.searchParams.get('download') === '1'
          res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': (download ? 'attachment' : 'inline') + "; filename*=UTF-8''" + encodeURIComponent(stringOf(ref.name) || 'file'),
            'Cache-Control': 'private, max-age=31536000, immutable',
          })
          for await (const chunk of ctx.attachments.readFileStream(ref)) {
            res.write(Buffer.from(chunk))
          }
          res.end()
        } catch (error) {
          if (!res.headersSent) sendJson(res, 404, { ok: false, error: messageOf(error) })
          else if (!res.writableEnded) res.end()
        }
      }),

      route(API_ROOT + '/backup', async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: '只支持 GET' })
        try {
          sendJson(res, 200, { ok: true, config: await readBackupConfig() })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/backup/config', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          sendJson(res, 200, { ok: true, config: await saveBackupConfig(body || {}) })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/backup/run', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          sendJson(res, 200, { ok: true, result: await runGitBackup() })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/export', async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: '只支持 GET' })
        try {
          sendJson(res, 200, { ok: true, bundle: await exportLibrary() })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/import', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req, MAX_UPLOAD_BYTES)
          const library = await importLibrary(body || {})
          sendJson(res, 200, { ok: true, library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/trash', async (req, res) => {
        if (req.method !== 'GET') return sendJson(res, 405, { ok: false, error: '只支持 GET' })
        try {
          sendJson(res, 200, { ok: true, items: await trashEntries() })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/trash/restore', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const library = await restoreTrash(body || {})
          sendJson(res, 200, { ok: true, library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/trash/delete', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const items = await deleteTrash(body || {})
          sendJson(res, 200, { ok: true, items })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/space/duplicate', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const result = await duplicateSpace(body || {})
          sendJson(res, 200, { ok: true, space: result.space, library: result.library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/space/create', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const result = await createSpace(body || {})
          sendJson(res, 200, { ok: true, space: result.space, library: result.library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/space/update', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const library = await updateSpaceMeta(body || {})
          sendJson(res, 200, { ok: true, library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/space/delete', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const library = await deleteSpace(body || {})
          sendJson(res, 200, { ok: true, library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/folder/create', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const library = await createFolder(body || {})
          sendJson(res, 200, { ok: true, library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/folder/update', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const library = await updateFolder(body || {})
          sendJson(res, 200, { ok: true, library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/folder/delete', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        try {
          const body = await readJsonBody(req)
          const library = await deleteFolder(body || {})
          sendJson(res, 200, { ok: true, library })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: messageOf(error) })
        }
      }),

      route(API_ROOT + '/chat', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: '只支持 POST' })
        await handleChat(ctx, req, res)
      }),

      route(API_ROOT + '/summary', async (req, res) => {
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
  const attachments = Array.isArray(body?.attachments) ? body.attachments.slice(0, 8) : []
  const fileTexts = []
  for (const item of attachments) {
    if (!item || item.kind !== 'file' || !item.attachment || typeof item.attachment !== 'object') continue
    try {
      const extracted = await extractAttachmentText(ctx, item.attachment)
      if (extracted && extracted.text) fileTexts.push(extracted)
    } catch (_error) {
      // A bad file should not block the chat.
    }
  }
  if (attachments.some((item) => item && item.kind === 'image')) {
    try {
      const info = await ctx.llm.resolveModelInfo(provider, model)
      if (Array.isArray(info?.inputModalities) && info.inputModalities.indexOf('image') < 0) {
        return sendJson(res, 400, { ok: false, error: '当前模型不支持图片输入，请先在设置里切换到支持视觉的模型。' })
      }
    } catch (_error) {
      // Capability lookup is advisory; let the provider decide.
    }
  }
  const messages = buildMessages({ history, question, provider, model, attachments, fileTexts })

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

function buildMessages({ history, question, provider, model, attachments, fileTexts }) {
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
  const content = [{ type: 'text', text: question }]
  for (const item of Array.isArray(attachments) ? attachments : []) {
    if (!item || typeof item !== 'object' || !item.attachment || typeof item.attachment !== 'object') continue
    if (item.kind === 'image' && item.attachment.attachmentId) {
      content.push({ type: 'image', attachment: item.attachment })
    } else if (item.kind === 'file' && item.attachment.attachmentId) {
      content.push({ type: 'file', attachment: item.attachment })
    }
  }
  for (const item of Array.isArray(fileTexts) ? fileTexts : []) {
    if (!item || !item.text) continue
    content.push({ type: 'text', text: '\n[File: ' + String(item.name || 'file') + ']\n' + String(item.text).slice(0, 12000) })
  }
  trimmed.push({ role: 'user', content })
  return trimmed
}

const TEXT_FILE_EXTENSIONS = new Set(['txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'jsonl', 'xml', 'html', 'htm', 'css', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'h', 'cpp', 'cs', 'go', 'rs', 'rb', 'php', 'sh', 'yaml', 'yml', 'toml', 'ini', 'log', 'sql'])
const MAX_EXTRACTED_TEXT = 12000

async function extractAttachmentText(ctx, ref) {
  const name = String(ref && ref.name || 'file')
  const extension = (name.split('.').pop() || '').toLowerCase()
  const chunks = []
  for await (const chunk of ctx.attachments.readFileStream(ref)) chunks.push(Buffer.from(chunk))
  const buffer = Buffer.concat(chunks)
  if (buffer.length === 0 || buffer.length > 20 * 1024 * 1024) return null
  if (TEXT_FILE_EXTENSIONS.has(extension)) {
    const text = buffer.toString('utf8')
    if (!text || text.indexOf('\u0000') >= 0) return null
    return { name, text: text.slice(0, MAX_EXTRACTED_TEXT) }
  }
  if (extension === 'docx') {
    const entries = readZipEntries(buffer)
    const xml = entries.get('word/document.xml')
    if (!xml) return null
    let text = xml.toString('utf8')
      .replace(/<w:tab[^>]*\/>/g, '\t')
      .replace(/<w:br[^>]*\/>/g, '\n')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
    text = decodeXmlEntities(text).replace(/\n{3,}/g, '\n\n').trim()
    return text ? { name, text: text.slice(0, MAX_EXTRACTED_TEXT) } : null
  }
  if (extension === 'xlsx') {
    const entries = readZipEntries(buffer)
    const sharedXml = entries.get('xl/sharedStrings.xml')
    const shared = []
    if (sharedXml) {
      const sourceText = sharedXml.toString('utf8')
      const matches = sourceText.match(/<si[\s\S]*?<\/si>/g) || []
      for (const item of matches) {
        const parts = item.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []
        shared.push(decodeXmlEntities(parts.map((part) => part.replace(/<[^>]+>/g, '')).join('')))
      }
    }
    const sheetNames = [...entries.keys()].filter((key) => /^xl\/worksheets\/sheet[^/]*\.xml$/.test(key)).sort()
    const lines = []
    for (const sheetName of sheetNames) {
      const xml = entries.get(sheetName).toString('utf8')
      const rows = xml.match(/<row[\s\S]*?<\/row>/g) || []
      for (const row of rows) {
        const cells = row.match(/<c[^>]*>[\s\S]*?<\/c>/g) || []
        const values = cells.map((cell) => {
          const isShared = /\bt="s"/.test(cell)
          const inline = /<is>[\s\S]*?<\/is>/.exec(cell)
          const raw = inline ? inline[0] : (/<v>([\s\S]*?)<\/v>/.exec(cell) || [])[1]
          if (raw === undefined) return ''
          const value = decodeXmlEntities(String(raw).replace(/<[^>]+>/g, ''))
          if (isShared) return shared[Number(value)] || ''
          return value
        })
        if (values.some(Boolean)) lines.push(values.join('\t'))
        if (lines.join('\n').length > MAX_EXTRACTED_TEXT) break
      }
    }
    const text = lines.join('\n').slice(0, MAX_EXTRACTED_TEXT)
    return text ? { name, text } : null
  }
  if (extension === 'pdf') {
    const text = extractPdfText(buffer).slice(0, MAX_EXTRACTED_TEXT)
    return text ? { name, text } : null
  }
  return null
}

function decodeXmlEntities(value) {
  return String(value)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
}

function readZipEntries(buffer) {
  const entries = new Map()
  const eocd = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  if (eocd < 0) return entries
  const count = buffer.readUInt16LE(eocd + 10)
  let offset = buffer.readUInt32LE(eocd + 16)
  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break
    const method = buffer.readUInt16LE(offset + 10)
    const compressedSize = buffer.readUInt32LE(offset + 20)
    const nameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const localOffset = buffer.readUInt32LE(offset + 42)
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength)
    if (buffer.readUInt32LE(localOffset) === 0x04034b50) {
      const localNameLength = buffer.readUInt16LE(localOffset + 26)
      const localExtraLength = buffer.readUInt16LE(localOffset + 28)
      const dataStart = localOffset + 30 + localNameLength + localExtraLength
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize)
      try {
        if (method === 0) entries.set(name, Buffer.from(compressed))
        else if (method === 8) entries.set(name, inflateRawSync(compressed))
      } catch (_error) {
        // Skip unsupported/corrupt entries.
      }
    }
    offset += 46 + nameLength + extraLength + commentLength
  }
  return entries
}

function extractPdfText(buffer) {
  const raw = buffer.toString('latin1')
  const outputs = []
  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g
  let match
  while ((match = streamPattern.exec(raw))) {
    let content = match[1]
    if (/\/FlateDecode/.test(raw.slice(Math.max(0, match.index - 400), match.index))) {
      try { content = inflateSync(Buffer.from(content, 'latin1')).toString('latin1') } catch (_error) { continue }
    }
    const textParts = []
    const tj = /\(((?:\\.|[^\\)])*)\)\s*Tj/g
    let textMatch
    while ((textMatch = tj.exec(content))) textParts.push(decodePdfString(textMatch[1]))
    const tjArray = /\[([\s\S]*?)\]\s*TJ/g
    while ((textMatch = tjArray.exec(content))) {
      const parts = textMatch[1].match(/\(((?:\\.|[^\\)])*)\)/g) || []
      textParts.push(parts.map((part) => decodePdfString(part.slice(1, -1))).join(''))
    }
    if (textParts.length > 0) outputs.push(textParts.join(' '))
  }
  return outputs.join('\n').replace(/[ \t]{2,}/g, ' ').trim()
}

function decodePdfString(value) {
  return String(value)
    .replace(/\\([nrtbf()\\])/g, (_match, symbol) => ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '(': '(', ')': ')', '\\': '\\' }[symbol] || symbol))
    .replace(/\\([0-7]{1,3})/g, (_match, code) => String.fromCharCode(parseInt(code, 8)))
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

export { buildMessages }
