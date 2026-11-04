(function () {
  const now = Date.now()
  const turn = (id, question, answer, extra) => Object.assign({
    id,
    question,
    answer,
    status: 'completed',
    error: '',
    summary: question,
    usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
    createdAt: now,
    z: 1,
    todo: false,
    flag: false,
    unread: false,
    attachments: [],
    layout: { dx: 0, dy: 0, w: 420, h: 300 },
  }, extra || {})

  const vertical = {
    version: 1,
    schemaVersion: 2,
    id: 'v1',
    title: 'Vertical E2E',
    layoutMode: 'vertical',
    mainColor: '#4fc3f7',
    memoryMode: 'lexical',
    summaryMode: 'every',
    main: {
      turns: [
        turn('v1-t1', 'Vertical first', 'First answer for vertical layout.'),
        turn('v1-t2', 'Vertical second', 'Second answer for vertical layout.'),
      ],
    },
    branches: [
      {
        id: 'v1-b1',
        anchorTurnId: 'v1-t1',
        anchorText: 'vertical anchor',
        anchorSource: 'selection',
        brief: '',
        parentBranchId: null,
        colorIndex: 0,
        color: '#5d9b6a',
        collapsed: true,
        tag: '',
        createdAt: now,
        turns: [
          turn('v1-b1-t1', 'Visible branch turn', 'Visible branch answer.'),
          turn('v1-b1-t2', 'Hidden pending turn', 'Hidden pending answer.', { todo: true }),
        ],
      },
    ],
    view: { x: 260, y: 120, zoom: 1 },
  }

  const horizontal = {
    version: 1,
    schemaVersion: 2,
    id: 'h1',
    title: 'Horizontal E2E',
    layoutMode: 'horizontal',
    mainColor: '#4fc3f7',
    memoryMode: 'lexical',
    summaryMode: 'every',
    main: {
      turns: [
        turn('h1-t1', 'Horizontal first', 'First answer for horizontal layout.'),
        turn('h1-t2', 'Horizontal second', 'Second answer for horizontal layout.'),
      ],
    },
    branches: [
      {
        id: 'h1-b1',
        anchorTurnId: 'h1-t1',
        anchorText: 'horizontal anchor',
        anchorSource: 'selection',
        brief: '',
        parentBranchId: null,
        colorIndex: 0,
        color: '#d4874a',
        collapsed: false,
        tag: '',
        createdAt: now,
        turns: [turn('h1-b1-t1', 'Horizontal branch', 'Horizontal branch answer.')],
      },
    ],
    view: { x: 160, y: 160, zoom: 1 },
  }

  const library = {
    version: 1,
    schemaVersion: 2,
    folders: [{ id: 'f1', name: 'E2E Folder', parentId: null, order: 1, createdAt: now }],
    spaces: [
      { id: 'v1', title: 'Vertical E2E', folderId: null, layoutMode: 'vertical', createdAt: now, updatedAt: now, turnCount: 2, lastQuestion: 'Vertical second' },
      { id: 'h1', title: 'Horizontal E2E', folderId: 'f1', layoutMode: 'horizontal', createdAt: now, updatedAt: now, turnCount: 2, lastQuestion: 'Horizontal second' },
    ],
  }

  const spaces = { v1: vertical, h1: horizontal }
  const welcome = {
    welcomeVersion: 'v0.9.10 体验版',
    welcomeTitle: '欢迎使用 E2E',
    welcomeIntro: '这是 E2E 欢迎页。',
    welcomeNotesTitle: '注意事项',
    welcomeNote1: '数据保存在 .chat-space。',
    welcomeNote2: '提问会发送给模型提供商。',
    welcomeNote3: '这是预览版。',
    welcomeNote4: '附件清理可能不彻底。',
    welcomeNote5: '删除先进入回收站。',
    welcomeNote6: '模型提供商有自己的隐私政策。',
    welcomePrivacyTitle: '隐私',
    welcomePrivacy1: '没有遥测。',
    welcomePrivacy2: 'Git 备份由你触发。',
    welcomePrivacy3: '导出文件可能包含对话。',
    welcomeFeedback: '去 GitHub 提意见。',
    welcomeFeedbackLink: 'GitHub Issues',
    welcomeStart: '让我试试',
  }

  const json = (body, status) => new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' },
  })

  window.fetch = async function (url, options) {
    const target = String(url)
    const method = (options && options.method) || 'GET'
    if (target.indexOf('/chat-space/api/welcome-copy') >= 0) return json({ ok: true, copy: welcome })
    if (target.indexOf('/chat-space/api/library') >= 0) return json({ ok: true, library, model: { provider: 'e2e', model: 'e2e-model' } })
    if (target.indexOf('/chat-space/api/space?id=') >= 0) {
      const id = new URL(target, 'http://127.0.0.1').searchParams.get('id') || 'v1'
      return json({ ok: true, space: spaces[id] || vertical, model: { provider: 'e2e', model: 'e2e-model' } })
    }
    if (target.indexOf('/chat-space/api/trash') >= 0) return json({ ok: true, items: [] })
    if (target.indexOf('/chat-space/api/maintenance/backups') >= 0) return json({ ok: true, items: [] })
    if (target.indexOf('/chat-space/api/backup') >= 0) return json({ ok: true, config: { remote: '', branch: 'main' } })
    if (target.indexOf('/chat-space/api/save') >= 0) return json({ ok: true, library })
    if (target.indexOf('/chat-space/api/folder') >= 0) return json({ ok: true, library })
    if (target.indexOf('/chat-space/api/space') >= 0) return json({ ok: true, library })
    if (target.indexOf('/chat-space/api/summary') >= 0) return json({ ok: true, summary: 'E2E summary' })
    if (method === 'POST') return json({ ok: true })
    return json({ ok: true })
  }

  window.__ModuleLoader__ = { load: function (spec) { window.__micaSpec = spec } }
  window.__micaFixture = { library, spaces }
})()
