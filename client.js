window.__ModuleLoader__.load({
  id: '@local/dsh-chat-space',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useRef, useCallback } = React

    const PANEL_ID = 'chat-space'
    const NS = 'chatSpace'
    const API = '/chat-space/api'
    const CARD_W = 420
    const CARD_H = 300
    const GAP = 36
    const TURN_STEP = CARD_H + GAP
    const MAIN_SCALE = 1.08
    const MAIN_W = CARD_W * MAIN_SCALE
    const MAIN_H = CARD_H * MAIN_SCALE
    const MAIN_STEP_V = MAIN_H + GAP
    const MAIN_STEP_H = MAIN_W + GAP
    const TOP_PAD = 80
    const BRANCH_X = 560
    const BRANCH_STEP = 520
    const SIBLING_STEP = CARD_W + 68
    const MIN_CARD_W = 280
    const MIN_CARD_H = 180
    const MAX_CARD_W = 1200
    const MAX_CARD_H = 1200
    const MIN_ZOOM = 0.15
    const MAX_ZOOM = 2.5
    const MAIN_COLOR = '#4fc3f7'
    const MINERAL_COLORS = [
      '#d4a843', '#d4874a', '#5d9b6a', '#9b7dcc', '#5da0a0', '#d4a8b0',
      '#9a8e82', '#6d8aaa', '#8a9448', '#5a4d4a', '#b8554a', '#b5a67a',
    ]

    const zh = {
      panel: '聊天空间',
      library: '空间库',
      libraryTitle: '聊天空间',
      librarySubtitle: '新建一个主题，旧的会留在空间库里',
      newSpace: '新建空间',
      newFolder: '新建文件夹',
      allSpaces: '全部空间',
      uncategorized: '未分类',
      rootFolder: '根目录',
      folders: '文件夹',
      spaces: '个空间',
      turns: '轮',
      emptySpace: '还没有内容',
      emptyLibrary: '还没有空间',
      emptyLibraryHint: '新建一个画布，从第一个问题开始。',
      untitledSpace: '未命名空间',
      titleLabel: '标题',
      folderName: '文件夹名称',
      folderLabel: '文件夹',
      parentFolder: '上级文件夹',
      layoutLabel: '画布方向',
      create: '创建',
      save: '保存',
      rename: '重命名',
      delete: '删除',
      moveTo: '移动到',
      confirmDeleteSpace: '删除这个空间？',
      confirmDeleteFolder: '删除这个文件夹？里面的空间会移到上一级。',
      libraryLoadError: '空间库读取失败',
      loading: '加载中…',
      retry: '重试',
      title: '聊天空间',
      subtitle: '主线向前，追问向两侧生长',
      main: '主线',
      branch: '分支',
      followUp: '从这里追问',
      continueFollowUp: '继续追问',
      continueMain: '继续主线',
      continueBranch: '继续这条分支',
      locateOriginal: '📌 定位原文',
      wholeAnswer: '整段回答',
      todo: '待办',
      important: '重要（红旗）',
      followUpTitle: '针对这段文字追问',
      questionPlaceholder: '你想问什么？',
      branchBrief: '分支说明（可选）',
      branchBriefPlaceholder: '给这个分支一个简短说明，帮助 AI 理解你的目的',
      createBranch: '创建分支',
      cancel: '取消',
      backToMain: '回到主线',
      backToConversation: '返回对话',
      resetView: '重置视图',
      fit: '适应画布',
      focusMain: '回归主线',
      layoutVertical: '竖向布局',
      layoutHorizontal: '横向布局',
      verticalShort: '竖',
      horizontalShort: '横',
      switchLayout: '切换竖向/横向布局',
      layers: '图层',
      delete: '删除',
      undo: '撤销',
      deleted: '已删除',
      undone: '已撤销',
      retry: '重试',
      emptyTitle: '从一个问题开始',
      emptyBody: '在主线提问，选中回答里的文字，就能向旁边长出一条追问分支。',
      mainPlaceholder: '在主线提问…',
      branchPlaceholder: '继续追问这条分支…',
      composerHint: 'Enter 发送 · Shift+Enter 换行',
      send: '发送',
      sending: '正在回答…',
      thinking: '正在思考…',
      loading: '正在打开聊天空间…',
      loadError: '读取失败',
      saveError: '保存失败',
      saving: '保存中…',
      saved: '已保存',
      model: '模型',
      noModel: '未配置模型',
      branchFrom: '从上游追问',
      backToFork: '回到分叉点',
      confirmDeleteBranch: '删除这条问答会同时删除它下面的分分支，继续？',
      failed: '回答失败',
      cancelled: '已停止',
      confirmDeleteMain: '删除这条主线问答会同时删除它下面的分支，继续？',
      zoomIn: '放大',
      zoomOut: '缩小',
      drag: '拖动',
      resize: '调整大小',
      summaryLoading: 'AI 正在总结…',
      noSummary: '暂无摘要',
      close: '关闭',
      branchBriefLabel: '分支说明',
      noAnswer: '（还没有回答）',
      loadErrorHint: '请刷新页面，或检查 DSH 是否仍在运行。',
      renderError: '聊天空间出错了',
      renderErrorHint: '可以点“重试”；如果反复出现，把这段错误发给我。',
      zoomHint: '滚轮任意位置缩放 · 鼠标中键拖动画布',
      selectHint: '选中回答中的文字即可追问',
      compactHint: '放大后可以继续阅读和追问',
      reload: '刷新页面',
      stop: '停止',
      tokens: 'tokens',
      welcome: '学习主线',
      welcomeBody: '把每一次问答放在主线上；需要展开的地方，从回答里选中文字，向旁边追问。',
      emptyBranch: '这条分支还没有问答。',
    }

    const en = {
      panel: 'Chat Space',
      library: 'Library',
      libraryTitle: 'Chat Space',
      librarySubtitle: 'Start a new topic; old canvases stay in the library',
      newSpace: 'New space',
      newFolder: 'New folder',
      allSpaces: 'All spaces',
      uncategorized: 'Uncategorized',
      rootFolder: 'Root',
      folders: 'Folders',
      spaces: 'spaces',
      turns: 'turns',
      emptySpace: 'No content yet',
      emptyLibrary: 'No spaces yet',
      emptyLibraryHint: 'Create a canvas and start with the first question.',
      untitledSpace: 'Untitled space',
      titleLabel: 'Title',
      folderName: 'Folder name',
      folderLabel: 'Folder',
      parentFolder: 'Parent folder',
      layoutLabel: 'Canvas direction',
      create: 'Create',
      save: 'Save',
      rename: 'Rename',
      delete: 'Delete',
      moveTo: 'Move to',
      confirmDeleteSpace: 'Delete this space?',
      confirmDeleteFolder: 'Delete this folder? Its spaces will move to the parent.',
      libraryLoadError: 'Failed to load the library',
      loading: 'Loading…',
      retry: 'Retry',
      title: 'Chat Space',
      subtitle: 'A main line that continues, branches that grow sideways',
      main: 'Main',
      branch: 'Branch',
      followUp: 'Ask from here',
      continueFollowUp: 'Continue asking',
      continueMain: 'Continue main line',
      continueBranch: 'Continue this branch',
      locateOriginal: '📌 Locate original',
      wholeAnswer: 'Whole answer',
      todo: 'Todo',
      important: 'Important (red flag)',
      followUpTitle: 'Ask about this passage',
      questionPlaceholder: 'What do you want to ask?',
      branchBrief: 'Branch note (optional)',
      branchBriefPlaceholder: 'A short note about what this branch is for',
      createBranch: 'Create branch',
      cancel: 'Cancel',
      backToMain: 'Back to main',
      backToConversation: 'Back to chat',
      resetView: 'Reset view',
      fit: 'Fit canvas',
      focusMain: 'Back to main line',
      layoutVertical: 'Vertical layout',
      layoutHorizontal: 'Horizontal layout',
      verticalShort: 'V',
      horizontalShort: 'H',
      switchLayout: 'Switch layout direction',
      layers: 'Layers',
      delete: 'Delete',
      undo: 'Undo',
      deleted: 'Deleted',
      undone: 'Undone',
      retry: 'Retry',
      emptyTitle: 'Start with one question',
      emptyBody: 'Ask on the main line, then select text in an answer to grow a follow-up branch beside it.',
      mainPlaceholder: 'Ask on the main line…',
      branchPlaceholder: 'Continue this branch…',
      composerHint: 'Enter to send · Shift+Enter for a new line',
      send: 'Send',
      sending: 'Answering…',
      thinking: 'Thinking…',
      loading: 'Opening Chat Space…',
      loadError: 'Could not load',
      saveError: 'Could not save',
      saving: 'Saving…',
      saved: 'Saved',
      model: 'Model',
      noModel: 'No model configured',
      branchFrom: 'Follow-up from here',
      backToFork: 'Back to fork',
      confirmDeleteBranch: 'Deleting this turn also deletes its sub-branches. Continue?',
      failed: 'Answer failed',
      cancelled: 'Stopped',
      confirmDeleteMain: 'Deleting this main-line question also deletes its branches. Continue?',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      drag: 'Drag',
      resize: 'Resize',
      summaryLoading: 'AI is summarizing…',
      noSummary: 'No summary',
      close: 'Close',
      branchBriefLabel: 'Branch note',
      noAnswer: '(no answer yet)',
      loadErrorHint: 'Refresh the page, or check that DSH is still running.',
      renderError: 'Chat Space hit an error',
      renderErrorHint: 'Try again. If it keeps happening, send me this message.',
      zoomHint: 'Wheel anywhere to zoom · Middle-drag to pan the canvas',
      selectHint: 'Select text in an answer to ask a follow-up',
      compactHint: 'Zoom in to read and continue',
      reload: 'Refresh page',
      stop: 'Stop',
      tokens: 'tokens',
      welcome: 'Learning main line',
      welcomeBody: 'Keep each exchange on the main line. When something needs room, select text in an answer and ask beside it.',
      emptyBranch: 'This branch has no exchanges yet.',
    }

    const CSS = `
.cs-root { --cs-accent: var(--dsw-static-neutral-bluish-400, #3370ff); --cs-accent-soft: var(--dsw-static-neutral-bluish-200, #dbe6ff); --cs-text: var(--dsw-alias-label-primary, #1f2329); --cs-muted: var(--dsw-alias-label-secondary, color-mix(in srgb, var(--dsw-alias-label-primary, #1f2329) 62%, var(--dsw-alias-bg-module-platform, #ffffff) 38%)); --cs-border: var(--dsw-alias-border-l2, rgba(0,0,0,.1)); --cs-border-strong: var(--dsw-alias-border-l4, rgba(0,0,0,.16)); --cs-bg: var(--dsw-alias-bg-l1, color-mix(in srgb, var(--dsw-alias-bg-module-platform, #ffffff) 94%, var(--dsw-alias-label-primary, #1f2329) 6%)); --cs-panel: var(--dsw-alias-bg-module-platform, #ffffff); --cs-hover: var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,.04)); --cs-shadow: var(--dsw-alias-shadow-l1, 0 4px 16px rgba(0,0,0,.08)); --cs-radius: var(--dsw-radius-xl, 12px); --cs-card-w: 420px; --cs-card-h: 300px; position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; min-height: 0; overflow: hidden; background: var(--cs-bg); color: var(--cs-text); font-family: inherit; font-size: 14px; }
.cs-root *, .cs-root *::before, .cs-root *::after { box-sizing: border-box; }
.cs-center { align-items: center; justify-content: center; gap: 12px; }
.cs-loading { display: flex; align-items: center; gap: 10px; color: var(--cs-muted); font-size: 14px; }
.cs-spinner { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--cs-border); border-top-color: var(--cs-accent); animation: cs-spin .8s linear infinite; }
@keyframes cs-spin { to { transform: rotate(360deg); } }
.cs-error-screen { max-width: 420px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--cs-muted); font-size: 13px; line-height: 1.6; }
.cs-error-screen strong { color: var(--cs-text); font-size: 15px; }
.cs-topbar { flex-shrink: 0; height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 18px; border-bottom: 1px solid var(--cs-border); background: var(--cs-panel); }
.cs-title-wrap { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cs-title { font-size: 15px; font-weight: 600; line-height: 1.3; }
.cs-subtitle { font-size: 11px; color: var(--cs-muted); line-height: 1.3; }
.cs-top-actions { display: flex; align-items: center; gap: 8px; min-width: 0; }
.cs-model { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--cs-muted); }
.cs-save { min-width: 52px; text-align: right; font-size: 11px; color: var(--cs-muted); }
.cs-save-error { color: #d93026; }
.cs-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid var(--cs-border); background: transparent; color: var(--cs-text); border-radius: 8px; padding: 6px 10px; font: inherit; font-size: 12px; line-height: 18px; cursor: pointer; white-space: nowrap; }
.cs-btn:hover { background: var(--cs-hover); }
.cs-btn:disabled { opacity: .5; cursor: not-allowed; }
.cs-btn-primary { border-color: transparent; background: var(--cs-accent); color: #ffffff; }
.cs-btn-primary:hover { background: var(--cs-accent); filter: brightness(1.06); }
.cs-viewport { position: relative; flex: 1; min-height: 0; overflow: hidden; background-color: var(--cs-bg); background-image: radial-gradient(circle, var(--cs-border) 1px, transparent 1px); background-size: 24px 24px; touch-action: none; }
.cs-world { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform; }
.cs-links { position: absolute; left: 0; top: 0; z-index: 0; overflow: visible; pointer-events: none; }
.cs-link-main { fill: none; stroke: var(--cs-accent); stroke-width: 5; opacity: .95; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 3px rgba(79,195,247,.45)); }
.cs-link-branch { fill: none; stroke: #7c9cff; stroke-width: 2; stroke-dasharray: 5 5; opacity: .7; vector-effect: non-scaling-stroke; }
.cs-link-branch-spine { fill: none; stroke: #7c9cff; stroke-width: 2; stroke-dasharray: 3 5; opacity: .5; vector-effect: non-scaling-stroke; }
.cs-node { position: absolute; width: var(--cs-card-w); height: var(--cs-card-h); }
.cs-composer-node { height: auto; }
.cs-welcome-node { height: var(--cs-card-h); }
.cs-composer-node .cs-composer { height: auto; }
.cs-card { width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative; background: var(--cs-panel); border: 1px solid var(--cs-border); border-left: 3px solid var(--cs-card-accent, var(--cs-accent)); border-radius: var(--cs-radius); box-shadow: var(--cs-shadow); transition: border-color .15s ease, box-shadow .15s ease; }
.cs-card-main { border-left: 3px solid var(--cs-accent); }
.cs-card-branch { border-left: 3px solid var(--cs-accent-soft); }
.cs-card-welcome { justify-content: center; align-items: flex-start; gap: 10px; padding: 28px; border-left: 3px solid var(--cs-accent); }
.cs-welcome-title { font-size: 18px; font-weight: 600; }
.cs-welcome-body { max-width: 330px; color: var(--cs-muted); font-size: 13px; line-height: 1.65; }
.cs-welcome-tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; background: var(--cs-accent-soft); color: var(--cs-accent); font-size: 11px; font-weight: 600; }
.cs-card-head { flex-shrink: 0; min-height: 42px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px; border-bottom: 1px solid var(--cs-border); }
.cs-card-tags { display: flex; align-items: center; gap: 8px; min-width: 0; }
.cs-tag { flex-shrink: 0; display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px; font-size: 11px; line-height: 16px; font-weight: 600; }
.cs-tag-main { background: var(--cs-accent-soft); color: var(--cs-accent); }
.cs-tag-branch { background: var(--cs-hover); color: var(--cs-muted); }
.cs-anchor { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--cs-muted); }
.cs-card-actions { flex-shrink: 0; display: flex; align-items: center; gap: 2px; }
.cs-mini { border: none; background: transparent; color: var(--cs-muted); border-radius: 6px; padding: 3px 6px; font: inherit; font-size: 11px; line-height: 16px; cursor: pointer; white-space: nowrap; }
.cs-mini:hover { background: var(--cs-hover); color: var(--cs-text); }
.cs-danger:hover { color: #d93026; }
.cs-card-body { flex: 1; min-height: 0; overflow: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; scrollbar-width: thin; scrollbar-color: var(--cs-border-strong) transparent; }
.cs-q { flex-shrink: 0; display: flex; align-items: flex-start; gap: 8px; }
.cs-q-mark { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 6px; background: var(--cs-hover); color: var(--cs-muted); font-size: 11px; font-weight: 700; }
.cs-q-text { min-width: 0; max-height: 76px; overflow: auto; font-size: 13px; font-weight: 600; line-height: 1.55; overflow-wrap: anywhere; }
.cs-a { flex: 1; min-height: 0; font-size: 13px; line-height: 1.68; color: var(--cs-text); user-select: text; cursor: text; overflow-wrap: anywhere; }
.cs-a-compact { color: var(--cs-muted); white-space: pre-wrap; line-height: 1.65; }
.cs-md { min-height: 1em; }
.cs-p { margin: 0 0 6px; white-space: pre-wrap; }
.cs-sp { height: 6px; }
.cs-h { margin: 8px 0 4px; font-weight: 600; line-height: 1.45; }
.cs-h1 { font-size: 16px; }
.cs-h2 { font-size: 15px; }
.cs-h3, .cs-h4 { font-size: 14px; }
.cs-li { display: flex; gap: 8px; margin: 0 0 4px; white-space: pre-wrap; }
.cs-li-dot { flex-shrink: 0; color: var(--cs-muted); }
.cs-code { margin: 6px 0; padding: 9px 10px; overflow: auto; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace; font-size: 12px; line-height: 1.55; white-space: pre; }
.cs-inline-code { padding: 1px 4px; border-radius: 4px; background: var(--cs-hover); font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace; font-size: 12px; }
.cs-cursor { display: inline-block; width: 6px; height: 14px; margin-left: 2px; vertical-align: -2px; background: var(--cs-accent); animation: cs-blink 1s steps(2) infinite; }
@keyframes cs-blink { 50% { opacity: 0; } }
.cs-error { flex-shrink: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 10px; border: 1px solid #f3c2bd; border-radius: 8px; background: #fff2f0; color: #b42318; font-size: 12px; line-height: 1.5; }
.cs-note { flex-shrink: 0; color: var(--cs-muted); font-size: 11px; }
.cs-card-foot { flex-shrink: 0; min-height: 32px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 12px; border-top: 1px solid var(--cs-border); color: var(--cs-muted); font-size: 11px; }
.cs-status { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-usage { flex-shrink: 0; }
.cs-branch-meta { flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); }
.cs-branch-anchor-label { font-size: 10px; letter-spacing: .02em; text-transform: uppercase; color: var(--cs-muted); }
.cs-branch-anchor-text { max-height: 58px; overflow: auto; white-space: pre-wrap; color: var(--cs-muted); font-size: 11px; line-height: 1.55; }
.cs-brief-input { width: 100%; border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--cs-text); padding: 4px 6px; font: inherit; font-size: 11px; line-height: 1.5; outline: none; }
.cs-brief-input:hover, .cs-brief-input:focus { border-color: var(--cs-border-strong); background: var(--cs-panel); }
.cs-composer { width: 100%; display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid var(--cs-border); border-radius: var(--cs-radius); background: var(--cs-panel); box-shadow: var(--cs-shadow); }
.cs-input { width: 100%; min-height: 64px; max-height: 180px; resize: vertical; overscroll-behavior: contain; border: none; outline: none; background: transparent; color: var(--cs-text); font: inherit; font-size: 13px; line-height: 1.6; }
.cs-input::placeholder { color: var(--cs-muted); }
.cs-composer-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.cs-hint { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--cs-muted); font-size: 11px; }
.cs-card-compact { cursor: zoom-in; }
.cs-card-compact .cs-card-actions, .cs-card-compact .cs-card-foot { display: none; }
.cs-card-compact .cs-q-text { max-height: 64px; }
.cs-card-compact .cs-card-body { gap: 6px; }
.cs-sel-toolbar { position: fixed; z-index: 900; transform: translate(-50%, -100%); padding: 5px 6px; border-radius: 8px; background: #1f2329; box-shadow: 0 8px 24px rgba(0,0,0,.24); }
.cs-sel-btn { border: none; background: transparent; color: #ffffff; padding: 2px 6px; border-radius: 5px; font: inherit; font-size: 12px; line-height: 18px; cursor: pointer; }
.cs-sel-btn:hover { background: rgba(255,255,255,.12); }
.cs-zoom { position: absolute; right: 18px; bottom: 18px; z-index: 950; display: flex; align-items: center; gap: 3px; padding: 4px; border: 1px solid var(--cs-border); border-radius: 10px; background: var(--cs-panel); box-shadow: var(--cs-shadow); }
.cs-zoom-btn { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 7px; background: transparent; color: var(--cs-text); font: inherit; font-size: 16px; line-height: 1; cursor: pointer; }
.cs-zoom-btn:hover { background: var(--cs-hover); }
.cs-zoom-label { min-width: 42px; text-align: center; color: var(--cs-muted); font-size: 11px; }
.cs-hintbar { position: absolute; left: 18px; bottom: 18px; z-index: 950; max-width: calc(100% - 180px); padding: 6px 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-panel); color: var(--cs-muted); font-size: 11px; line-height: 1.4; pointer-events: none; }
.cs-modal-backdrop { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(0,0,0,.35); }
.cs-modal { width: min(560px, 100%); max-height: calc(100vh - 48px); overflow: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 12px; padding: 20px; border: 1px solid var(--cs-border); border-radius: 14px; background: var(--cs-panel); box-shadow: 0 24px 64px rgba(0,0,0,.24); color: var(--cs-text); }
.cs-modal-title { font-size: 16px; font-weight: 600; line-height: 1.4; }
.cs-quote { margin: 0; max-height: 140px; overflow: auto; padding: 10px 12px; border-left: 3px solid var(--cs-accent); border-radius: 0 8px 8px 0; background: var(--cs-bg); color: var(--cs-muted); font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
.cs-field { display: flex; flex-direction: column; gap: 6px; color: var(--cs-muted); font-size: 12px; }
.cs-modal-input { width: 100%; min-height: 80px; max-height: 220px; resize: vertical; padding: 9px 10px; border: 1px solid var(--cs-border); border-radius: 8px; outline: none; background: var(--cs-bg); color: var(--cs-text); font: inherit; font-size: 13px; line-height: 1.55; }
.cs-modal-input:focus { border-color: var(--cs-accent); box-shadow: 0 0 0 2px var(--cs-accent-soft); }
.cs-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 2px; }
.cs-toast { position: fixed; left: 50%; bottom: 24px; z-index: 1100; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; max-width: calc(100vw - 48px); padding: 9px 14px; border-radius: 10px; background: #1f2329; color: #ffffff; box-shadow: 0 12px 32px rgba(0,0,0,.28); font-size: 12px; line-height: 1.5; }
.cs-toast-btn { border: none; background: transparent; color: #9db4ff; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; padding: 0; }
.cs-dot-wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.cs-dot-ring { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 2px solid; border-radius: 50%; pointer-events: none; box-shadow: 0 0 8px color-mix(in srgb, currentColor 35%, transparent); }
.cs-dot-flag { position: absolute; color: #e5484d; line-height: 1; pointer-events: none; text-shadow: 0 0 2px rgba(255,255,255,.9); }
.cs-marquee { position: fixed; z-index: 5000; border: 1px dashed var(--cs-accent); border-radius: 2px; background: color-mix(in srgb, var(--cs-accent) 10%, transparent); pointer-events: none; }
.cs-dot { border: none; padding: 0; border-radius: 50%; cursor: pointer; box-shadow: 0 0 0 4px rgba(51,112,255,.12); transition: transform .12s ease; }
.cs-dot:hover { transform: scale(1.15); }
.cs-dot-main { background: var(--cs-accent); box-shadow: 0 0 0 6px color-mix(in srgb, var(--cs-accent) 14%, transparent); }
.cs-dot-branch { background: var(--cs-accent-soft); box-shadow: 0 0 0 4px rgba(51,112,255,.08); }
.cs-highlight { animation: cs-pulse 1.2s ease-out 2; }
@keyframes cs-pulse { 0% { box-shadow: 0 0 0 0 rgba(51,112,255,.4); } 100% { box-shadow: 0 0 0 14px rgba(51,112,255,0); } }
.cs-branch-lane { position: absolute; width: var(--cs-card-w); height: 0; }
.cs-node { transition: opacity .18s ease; }
.cs-root.cs-card-focus .cs-node:not(.cs-focus-card) { opacity: .22; }
.cs-node.cs-focus-card { opacity: 1; }
.cs-branch-lane .cs-node { left: 0; }
.cs-card-main, .cs-card-branch { border-left-color: var(--cs-card-accent, var(--cs-accent)); }
.cs-card-main { box-shadow: 0 0 0 1px color-mix(in srgb, var(--cs-card-accent) 30%, transparent), var(--cs-shadow); }
.cs-seq { flex-shrink: 0; padding: 0 3px; border-radius: 4px; color: var(--cs-card-accent, var(--cs-accent)); font-size: 10px; font-weight: 700; line-height: 1.6; letter-spacing: .02em; }
.cs-layout-switch { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-panel); color: var(--cs-muted); cursor: pointer; font: inherit; font-size: 12px; }
.cs-layout-track { position: relative; width: 34px; height: 18px; border-radius: 9px; background: var(--cs-border); transition: background .18s ease; }
.cs-layout-knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--cs-panel); box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: left .18s ease; }
.cs-layout-switch.cs-layout-vertical .cs-layout-knob { left: 18px; }
.cs-layout-switch.cs-layout-horizontal .cs-layout-track { background: color-mix(in srgb, var(--cs-accent) 45%, var(--cs-border)); }
.cs-layout-switch.cs-layout-vertical .cs-layout-track { background: color-mix(in srgb, var(--cs-accent) 45%, var(--cs-border)); }
.cs-layout-switch.cs-layout-horizontal .cs-layout-h, .cs-layout-switch.cs-layout-vertical .cs-layout-v { color: var(--cs-text); font-weight: 600; }
.cs-card.cs-accent-left { border-left: 3px solid var(--cs-card-accent, var(--cs-accent)); }
.cs-card.cs-accent-right { border-left: 1px solid var(--cs-border); border-right: 3px solid var(--cs-card-accent, var(--cs-accent)); }
.cs-card.cs-accent-top { border-left: 1px solid var(--cs-border); border-top: 3px solid var(--cs-card-accent, var(--cs-accent)); }
.cs-card.cs-accent-bottom { border-left: 1px solid var(--cs-border); border-bottom: 3px solid var(--cs-card-accent, var(--cs-accent)); }
.cs-grip { flex-shrink: 0; padding: 0 2px; color: var(--cs-muted); font-size: 13px; line-height: 1; letter-spacing: -2px; cursor: grab; user-select: none; }
.cs-grip:active { cursor: grabbing; }
.cs-resize { position: absolute; right: 2px; bottom: 2px; z-index: 2; width: 16px; height: 16px; cursor: nwse-resize; }
.cs-resize::after { content: ''; position: absolute; right: 3px; bottom: 3px; width: 7px; height: 7px; border-right: 2px solid var(--cs-border-strong); border-bottom: 2px solid var(--cs-border-strong); border-radius: 0 0 2px 0; opacity: .7; }
.cs-btn-primary { background: var(--cs-accent); border-color: var(--cs-accent); color: #ffffff; }
.cs-btn-primary:hover { background: color-mix(in srgb, var(--cs-accent) 88%, #000000); }
.cs-library { background: var(--cs-bg); }
.cs-lib-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 20px; border-bottom: 1px solid var(--cs-border); flex-shrink: 0; }
.cs-lib-heading { min-width: 0; }
.cs-lib-body { flex: 1; min-height: 0; display: flex; }
.cs-lib-side { width: 230px; flex-shrink: 0; padding: 12px 8px; border-right: 1px solid var(--cs-border); overflow: auto; }
.cs-lib-side-title { padding: 0 10px 8px; color: var(--cs-muted); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
.cs-lib-folder { display: flex; align-items: center; gap: 6px; min-height: 30px; padding: 5px 8px; border-radius: 7px; color: var(--cs-text); cursor: pointer; font-size: 13px; }
.cs-lib-folder:hover { background: var(--cs-hover); }
.cs-lib-folder-active { background: color-mix(in srgb, var(--cs-accent) 12%, transparent); color: var(--cs-accent); }
.cs-lib-folder-icon { flex-shrink: 0; width: 12px; color: var(--cs-muted); font-size: 10px; }
.cs-lib-folder-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-lib-folder-count { flex-shrink: 0; color: var(--cs-muted); font-size: 11px; }
.cs-lib-folder-actions { display: none; flex-shrink: 0; gap: 1px; }
.cs-lib-folder:hover .cs-lib-folder-actions { display: inline-flex; }
.cs-lib-folder-actions button { border: 0; background: transparent; color: var(--cs-muted); cursor: pointer; font-size: 12px; padding: 1px 3px; border-radius: 3px; }
.cs-lib-folder-actions button:hover { background: var(--cs-border); color: var(--cs-text); }
.cs-lib-newfolder { width: 100%; margin-top: 10px; padding: 8px; border: 1px dashed var(--cs-border); border-radius: 7px; background: transparent; color: var(--cs-muted); cursor: pointer; font: inherit; font-size: 12px; text-align: left; }
.cs-lib-newfolder:hover { border-color: var(--cs-accent); color: var(--cs-accent); }
.cs-lib-main { flex: 1; min-width: 0; overflow: auto; padding: 16px 20px 28px; }
.cs-lib-main-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.cs-lib-main-title { font-size: 17px; font-weight: 600; }
.cs-lib-main-sub { margin-top: 3px; color: var(--cs-muted); font-size: 12px; }
.cs-lib-spaces { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.cs-lib-space-card { display: flex; flex-direction: column; gap: 9px; min-height: 154px; padding: 13px; border: 1px solid var(--cs-border); border-radius: 10px; background: var(--cs-panel); box-shadow: 0 1px 2px rgba(0,0,0,.03); cursor: pointer; transition: border-color .15s ease, transform .15s ease, box-shadow .15s ease; }
.cs-lib-space-card:hover { border-color: color-mix(in srgb, var(--cs-accent) 55%, var(--cs-border)); box-shadow: var(--cs-shadow); transform: translateY(-1px); }
.cs-lib-space-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.cs-lib-space-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 600; }
.cs-lib-layout-badge { flex-shrink: 0; padding: 1px 6px; border: 1px solid var(--cs-border); border-radius: 999px; color: var(--cs-muted); font-size: 10px; line-height: 1.6; }
.cs-lib-space-question { flex: 1; min-height: 34px; overflow: hidden; color: var(--cs-muted); font-size: 12px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.cs-lib-space-meta { display: flex; justify-content: space-between; gap: 8px; color: var(--cs-muted); font-size: 11px; }
.cs-lib-space-actions { display: flex; align-items: center; gap: 5px; padding-top: 6px; border-top: 1px solid var(--cs-border); }
.cs-lib-move { flex: 1; min-width: 0; padding: 3px 5px; border: 1px solid var(--cs-border); border-radius: 5px; background: var(--cs-bg); color: var(--cs-text); font: inherit; font-size: 11px; }
.cs-lib-mini { flex-shrink: 0; padding: 3px 6px; border: 1px solid transparent; border-radius: 5px; background: transparent; color: var(--cs-muted); cursor: pointer; font: inherit; font-size: 11px; }
.cs-lib-mini:hover { background: var(--cs-hover); color: var(--cs-text); }
.cs-lib-mini-danger:hover { color: #d9534f; }
.cs-lib-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 260px; border: 1px dashed var(--cs-border); border-radius: 12px; color: var(--cs-muted); text-align: center; }
.cs-lib-empty-title { color: var(--cs-text); font-size: 15px; font-weight: 600; }
.cs-lib-empty-text { max-width: 360px; color: var(--cs-muted); font-size: 12px; line-height: 1.6; }
.cs-lib-notice { padding: 7px 20px; border-bottom: 1px solid var(--cs-border); background: color-mix(in srgb, #d9534f 8%, var(--cs-bg)); color: #b8453f; font-size: 12px; }
.cs-lib-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--cs-muted); }
.cs-lib-modal-backdrop { position: fixed; inset: 0; z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(14, 20, 28, .34); backdrop-filter: blur(2px); }
.cs-lib-modal { width: min(440px, 100%); display: flex; flex-direction: column; gap: 13px; padding: 18px; border: 1px solid var(--cs-border); border-radius: 12px; background: var(--cs-panel); box-shadow: 0 18px 48px rgba(0,0,0,.22); }
.cs-lib-modal-title { font-size: 16px; font-weight: 600; }
.cs-lib-field { display: flex; flex-direction: column; gap: 5px; color: var(--cs-muted); font-size: 12px; }
.cs-lib-input { width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid var(--cs-border); border-radius: 7px; background: var(--cs-bg); color: var(--cs-text); font: inherit; font-size: 13px; outline: none; }
.cs-lib-input:focus { border-color: var(--cs-accent); }
.cs-lib-layout-choice { display: flex; gap: 8px; }
.cs-lib-layout-option { flex: 1; padding: 8px; border: 1px solid var(--cs-border); border-radius: 7px; background: var(--cs-bg); color: var(--cs-muted); cursor: pointer; font: inherit; font-size: 12px; }
.cs-lib-layout-active { border-color: var(--cs-accent); background: color-mix(in srgb, var(--cs-accent) 12%, var(--cs-panel)); color: var(--cs-accent); }
.cs-lib-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 3px; }
.cs-main-guide { position: absolute; z-index: 0; pointer-events: none; opacity: .42; }
.cs-main-guide-v { top: 0; bottom: 0; width: 3px; background-image: repeating-linear-gradient(to bottom, var(--cs-accent) 0 14px, transparent 14px 30px); }
.cs-main-guide-h { left: 0; right: 0; height: 3px; background-image: repeating-linear-gradient(to right, var(--cs-accent) 0 14px, transparent 14px 30px); }
.cs-dot-tip { position: fixed; z-index: 1200; max-width: 300px; padding: 8px 10px; border-radius: 8px; background: #1f2329; color: #ffffff; box-shadow: 0 8px 24px rgba(0,0,0,.25); font-size: 12px; line-height: 1.55; pointer-events: none; }
.cs-bottom-composer { position: absolute; left: 50%; bottom: 18px; z-index: 950; display: flex; flex-direction: column; gap: 6px; width: min(640px, calc(100% - 220px)); transform: translateX(-50%); }
.cs-bottom-label { align-self: flex-start; padding: 2px 8px; border: 1px solid var(--cs-border); border-radius: 999px; background: var(--cs-panel); color: var(--cs-muted); font-size: 11px; line-height: 1.4; }
.cs-bottom-composer .cs-composer { box-shadow: 0 12px 32px rgba(0,0,0,.18); }
.cs-card { cursor: default; }
.cs-card.cs-selected { border-color: var(--cs-card-accent, var(--cs-accent)); }
.cs-card:not(.cs-active) { user-select: none; }
.cs-card.cs-active { user-select: text; }
.cs-card:not(.cs-active) .cs-a { cursor: default; user-select: none; }
.cs-card.cs-active .cs-a { cursor: text; user-select: text; }
.cs-port { position: absolute; z-index: 6; width: 10px; height: 10px; border: 2px solid var(--cs-panel); border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 0 1px var(--cs-border); pointer-events: none; }
.cs-port-main { width: 12px; height: 12px; }
.cs-todo { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
.cs-todo input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.cs-todo-box { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border: 1.5px solid var(--cs-border-strong); border-radius: 3px; color: #fff; font-size: 10px; line-height: 1; }
.cs-todo-on .cs-todo-box { background: var(--cs-card-accent, var(--cs-accent)); border-color: var(--cs-card-accent, var(--cs-accent)); }
.cs-flag { padding: 0 2px; border: 0; background: transparent; color: var(--cs-muted); font-size: 14px; line-height: 1; cursor: pointer; }
.cs-flag-on { color: #e5484d; }
.cs-layer-list { display: flex; flex-direction: column; gap: 4px; max-height: 360px; overflow: auto; }
.cs-layer-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: transparent; color: var(--cs-text); font: inherit; font-size: 12px; text-align: left; cursor: pointer; }
.cs-layer-row:hover { background: var(--cs-hover); }
.cs-layer-dot { flex-shrink: 0; width: 9px; height: 9px; border-radius: 50%; }
.cs-layer-tag { flex-shrink: 0; min-width: 28px; color: var(--cs-muted); font-size: 10px; }
.cs-layer-q { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-layer-z { flex-shrink: 0; color: var(--cs-muted); font-size: 10px; }
.cs-root ::-webkit-scrollbar { width: 8px; height: 8px; }
.cs-root ::-webkit-scrollbar-thumb { background: var(--cs-border-strong); border-radius: 999px; }
.cs-root ::-webkit-scrollbar-track { background: transparent; }
`

    let counter = 0
    function uid(prefix) {
      counter += 1
      let random
      try {
        random = globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
          ? globalThis.crypto.randomUUID()
          : Math.random().toString(36).slice(2)
      } catch (_error) {
        random = Math.random().toString(36).slice(2)
      }
      return prefix + '-' + random + '-' + counter
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value))
    }

    function finite(value, fallback) {
      const number = Number(value)
      return Number.isFinite(number) ? number : fallback
    }

    function truncate(value, limit) {
      const text = typeof value === 'string' ? value : ''
      return text.length > limit ? text.slice(0, limit - 1) + '…' : text
    }

    function stringOf(value) {
      return typeof value === 'string' ? value : ''
    }

    function cx() {
      return Array.prototype.slice.call(arguments).filter(Boolean).join(' ')
    }

    const DRAFT_KEY = 'chat-space:draft'
    const SELECTION_KEY = 'chat-space:selection'
    const COMPOSER_PREFIX = 'chat-space:composer:'

    function readJsonStorage(key) {
      try {
        const raw = sessionStorage.getItem(key)
        return raw ? JSON.parse(raw) : null
      } catch (_error) {
        return null
      }
    }

    function writeJsonStorage(key, value) {
      try {
        if (value === null || value === undefined) sessionStorage.removeItem(key)
        else sessionStorage.setItem(key, JSON.stringify(value))
      } catch (_error) {
        // Storage is best effort.
      }
    }

    function readTextStorage(key) {
      if (!key) return ''
      try {
        return sessionStorage.getItem(key) || ''
      } catch (_error) {
        return ''
      }
    }

    function writeTextStorage(key, value) {
      if (!key) return
      try {
        if (value) sessionStorage.setItem(key, value)
        else sessionStorage.removeItem(key)
      } catch (_error) {
        // Storage is best effort.
      }
    }

    function formatUsage(usage) {
      if (!usage || typeof usage !== 'object') return ''
      const total = finite(usage.totalTokens, finite(usage.inputTokens, 0) + finite(usage.outputTokens, 0))
      return total > 0 ? Math.round(total) + ' tokens' : ''
    }

    function findTextRange(root, text) {
      const needle = stringOf(text).trim()
      if (!root || !needle) return null
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
      const nodes = []
      let full = ''
      let node
      while ((node = walker.nextNode())) {
        const value = node.nodeValue || ''
        if (!value) continue
        nodes.push({ node, start: full.length, end: full.length + value.length })
        full += value
      }
      let start = full.indexOf(needle)
      let end = start >= 0 ? start + needle.length : -1
      if (start < 0) {
        const collapsed = needle.replace(/\s+/g, ' ').trim()
        const chars = []
        const map = []
        let lastSpace = false
        for (let index = 0; index < full.length; index += 1) {
          const ch = full[index]
          if (/\s/.test(ch)) {
            if (!lastSpace) {
              chars.push(' ')
              map.push(index)
              lastSpace = true
            }
          } else {
            chars.push(ch)
            map.push(index)
            lastSpace = false
          }
        }
        const normalized = chars.join('')
        const found = normalized.indexOf(collapsed)
        if (found < 0) return null
        start = map[found]
        end = map[found + collapsed.length - 1] + 1
      }
      if (start < 0 || end < 0) return null
      const locate = (offset) => {
        for (const item of nodes) {
          if (offset >= item.start && offset <= item.end) {
            return { node: item.node, offset: Math.min(item.end - item.start, offset - item.start) }
          }
        }
        return null
      }
      const startPoint = locate(start)
      const endPoint = locate(end)
      if (!startPoint || !endPoint) return null
      const range = document.createRange()
      range.setStart(startPoint.node, startPoint.offset)
      range.setEnd(endPoint.node, endPoint.offset)
      return range
    }

    function normalizeTurn(turn) {
      if (!turn || typeof turn.id !== 'string') return null
      const known = ['streaming', 'completed', 'failed', 'cancelled']
      const rawLayout = turn.layout && typeof turn.layout === 'object' ? turn.layout : null
      const layout = rawLayout
        ? {
            dx: finite(rawLayout.dx, 0),
            dy: finite(rawLayout.dy, 0),
            w: clamp(finite(rawLayout.w, CARD_W), MIN_CARD_W, MAX_CARD_W),
            h: clamp(finite(rawLayout.h, CARD_H), MIN_CARD_H, MAX_CARD_H),
          }
        : null
      return {
        id: turn.id,
        question: stringOf(turn.question),
        answer: stringOf(turn.answer),
        status: turn.status === 'streaming' ? 'cancelled' : (known.indexOf(turn.status) >= 0 ? turn.status : 'completed'),
        error: stringOf(turn.error),
        summary: stringOf(turn.summary),
        usage: turn.usage && typeof turn.usage === 'object' ? turn.usage : null,
        createdAt: finite(turn.createdAt, Date.now()),
        z: finite(turn.z, 0),
        todo: Boolean(turn.todo),
        flag: Boolean(turn.flag),
        layout,
      }
    }

    function normalizeSpace(raw) {
      const fallback = {
        version: 1,
        id: '',
        title: '学习空间',
        main: { turns: [] },
        branches: [],
        layoutMode: 'vertical',
        view: { x: 120, y: 120, zoom: 1 },
      }
      if (!raw || typeof raw !== 'object') return fallback
      const rawMain = raw.main && typeof raw.main === 'object' ? raw.main : {}
      const mainTurns = Array.isArray(rawMain.turns) ? rawMain.turns.map(normalizeTurn).filter(Boolean) : []
      const branches = Array.isArray(raw.branches)
        ? raw.branches
            .filter((branch) => branch && typeof branch.id === 'string')
            .map((branch, index) => ({
              id: branch.id,
              anchorTurnId: stringOf(branch.anchorTurnId),
              anchorText: stringOf(branch.anchorText),
              anchorSource: branch.anchorSource === 'answer' ? 'answer' : branch.anchorSource === 'selection' ? 'selection' : null,
              brief: stringOf(branch.brief),
              parentBranchId: typeof branch.parentBranchId === 'string' && branch.parentBranchId ? branch.parentBranchId : null,
              colorIndex: Number.isInteger(branch.colorIndex) ? branch.colorIndex : index,
              createdAt: finite(branch.createdAt, Date.now()),
              turns: Array.isArray(branch.turns) ? branch.turns.map(normalizeTurn).filter(Boolean) : [],
            }))
        : []
      const turnBranch = new Map()
      mainTurns.forEach((turn) => turnBranch.set(turn.id, null))
      branches.forEach((branch) => branch.turns.forEach((turn) => turnBranch.set(turn.id, branch.id)))
      for (const branch of branches) {
        if (!branch.anchorSource) {
          const sourceTurn = mainTurns.find((turn) => turn.id === branch.anchorTurnId)
            || branches.flatMap((item) => item.turns).find((turn) => turn.id === branch.anchorTurnId)
          branch.anchorSource = sourceTurn && branch.anchorText.trim() && branch.anchorText.trim() === sourceTurn.answer.trim() ? 'answer' : 'selection'
        }
        if (!branch.parentBranchId) {
          const inferred = turnBranch.get(branch.anchorTurnId)
          if (inferred && inferred !== branch.id) branch.parentBranchId = inferred
        }
      }
      const rawView = raw.view && typeof raw.view === 'object' ? raw.view : null
      return {
        version: 1,
        id: stringOf(raw.id),
        title: stringOf(raw.title) || '学习空间',
        main: { turns: mainTurns },
        branches,
        layoutMode: raw.layoutMode === 'horizontal' ? 'horizontal' : 'vertical',
        view: rawView
          ? {
              x: finite(rawView.x, 120),
              y: finite(rawView.y, 120),
              zoom: clamp(finite(rawView.zoom, 1), MIN_ZOOM, MAX_ZOOM),
            }
          : fallback.view,
      }
    }

    function turnRect(turn, baseX, baseY, defaultW, defaultH) {
      const layout = turn.layout || {}
      return {
        x: baseX + finite(layout.dx, 0),
        y: baseY + finite(layout.dy, 0),
        w: clamp(finite(layout.w, defaultW || CARD_W), MIN_CARD_W, MAX_CARD_W),
        h: clamp(finite(layout.h, defaultH || CARD_H), MIN_CARD_H, MAX_CARD_H),
      }
    }

    function branchColorOf(branch, index) {
      const colorIndex = Number.isInteger(branch.colorIndex) ? branch.colorIndex : index
      return MINERAL_COLORS[((colorIndex % MINERAL_COLORS.length) + MINERAL_COLORS.length) % MINERAL_COLORS.length]
    }

    function nextColorIndex(branches) {
      const used = new Set(branches.map((branch, index) => (Number.isInteger(branch.colorIndex) ? branch.colorIndex : index)))
      for (let index = 0; index < MINERAL_COLORS.length; index += 1) {
        if (!used.has(index)) return index
      }
      return branches.length % MINERAL_COLORS.length
    }

    function buildBranchDigest(space) {
      if (!space || !Array.isArray(space.branches)) return []
      return space.branches.slice(0, 6).map((branch) => ({
        id: branch.id,
        parentBranchId: branch.parentBranchId || null,
        anchorText: stringOf(branch.anchorText).slice(0, 120),
        brief: stringOf(branch.brief).slice(0, 120),
        turns: branch.turns.slice(-3).map((turn) => ({
          question: stringOf(turn.question).slice(0, 180),
          answer: stringOf(turn.summary || turn.answer).slice(0, 360),
        })),
      }))
    }

    function branchSide(anchor, first) {
      const dx = (first.x + first.w / 2) - (anchor.x + anchor.w / 2)
      const dy = (first.y + first.h / 2) - (anchor.y + anchor.h / 2)
      if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'right' : 'left'
      return dy < 0 ? 'bottom' : 'top'
    }

    function portPosition(side, width, height) {
      if (side === 'right') return { left: width, top: height / 2 }
      if (side === 'top') return { left: width / 2, top: 0 }
      if (side === 'bottom') return { left: width / 2, top: height }
      return { left: 0, top: height / 2 }
    }

    function rectsOverlap(a, b) {
      return Boolean(a && b && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y)
    }

    function lineBlocked(a, b, cards, ignore) {
      for (const card of cards) {
        if (!card || (ignore && ignore.has(card.id))) continue
        for (let index = 1; index < 20; index += 1) {
          const t = index / 20
          const x = a.x + (b.x - a.x) * t
          const y = a.y + (b.y - a.y) * t
          if (x >= card.x && x <= card.x + card.w && y >= card.y && y <= card.y + card.h) return true
        }
      }
      return false
    }

    function sinePath(a, b, amplitude, waves) {
      const dx = b.x - a.x
      const dy = b.y - a.y
      const length = Math.hypot(dx, dy)
      if (length < 1) return 'M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y
      const ux = dx / length
      const uy = dy / length
      const px = -uy
      const py = ux
      const amp = amplitude || 14
      const count = waves || 2
      const segments = 40
      let path = 'M ' + a.x + ' ' + a.y
      for (let index = 1; index <= segments; index += 1) {
        const t = index / segments
        const offset = Math.sin(Math.PI * 2 * count * t) * amp
        const x = a.x + dx * t + px * offset
        const y = a.y + dy * t + py * offset
        path += ' L ' + x + ' ' + y
      }
      return path
    }

    function curvePorts(a, aSide, b, bSide) {
      const p = sidePoint(a, aSide)
      const q = sidePoint(b, bSide)
      const dx = q.x - p.x
      const dy = q.y - p.y
      if (Math.abs(dx) >= Math.abs(dy)) {
        const dir = dx >= 0 ? 1 : -1
        return `M ${p.x} ${p.y} C ${p.x + dir * 80} ${p.y}, ${q.x - dir * 80} ${q.y}, ${q.x} ${q.y}`
      }
      const dir = dy >= 0 ? 1 : -1
      return `M ${p.x} ${p.y} C ${p.x} ${p.y + dir * 80}, ${q.x} ${q.y - dir * 80}, ${q.x} ${q.y}`
    }

    function sidePoint(rect, side) {
      if (side === 'right') return { x: rect.x + rect.w, y: rect.y + rect.h / 2 }
      if (side === 'top') return { x: rect.x + rect.w / 2, y: rect.y }
      if (side === 'bottom') return { x: rect.x + rect.w / 2, y: rect.y + rect.h }
      return { x: rect.x, y: rect.y + rect.h / 2 }
    }

    function buildPositions(mainTurns, branches, layoutMode) {
      const horizontal = layoutMode === 'horizontal'
      const branchById = new Map(branches.map((branch) => [branch.id, branch]))
      const turnBranch = new Map()
      mainTurns.forEach((turn) => turnBranch.set(turn.id, null))
      branches.forEach((branch) => branch.turns.forEach((turn) => turnBranch.set(turn.id, branch.id)))
      const parentOf = (branch) => {
        if (branch.parentBranchId && branchById.has(branch.parentBranchId)) return branch.parentBranchId
        const inferred = turnBranch.get(branch.anchorTurnId)
        return inferred && inferred !== branch.id && branchById.has(inferred) ? inferred : null
      }
      const depths = new Map()
      const depthOf = (branch) => {
        if (!branch) return 0
        if (depths.has(branch.id)) return depths.get(branch.id)
        const parentId = parentOf(branch)
        const depth = parentId ? depthOf(branchById.get(parentId)) + 1 : 1
        depths.set(branch.id, depth)
        return depth
      }
      const ordered = [...branches].sort((left, right) => (depthOf(left) - depthOf(right)) || (finite(left.createdAt, 0) - finite(right.createdAt, 0)))
      const positions = new Map()
      const rects = new Map()
      mainTurns.forEach((turn, index) => {
        const x = horizontal ? TOP_PAD + index * MAIN_STEP_H : 0
        const y = horizontal ? TOP_PAD : TOP_PAD + index * MAIN_STEP_V
        rects.set(turn.id, turnRect(turn, x, y, MAIN_W, MAIN_H))
      })
      const siblings = new Map()
      for (const branch of ordered) {
        const parentId = parentOf(branch)
        const parentPosition = parentId ? positions.get(parentId) : null
        const anchor = rects.get(branch.anchorTurnId) || { x: 0, y: 0, w: CARD_W, h: CARD_H }
        const key = (parentId || 'main') + '|' + branch.anchorTurnId
        const siblingIndex = siblings.get(key) || 0
        siblings.set(key, siblingIndex + 1)
        const x = (horizontal
          ? (parentPosition ? parentPosition.x + BRANCH_STEP : anchor.x)
          : (parentPosition ? parentPosition.x + BRANCH_STEP : BRANCH_X)) + siblingIndex * SIBLING_STEP
        const y = horizontal ? anchor.y + anchor.h + GAP : anchor.y
        const position = {
          branch,
          index: branches.indexOf(branch),
          parentId,
          siblingIndex,
          x,
          y,
          side: 'left',
          color: branchColorOf(branch, branches.indexOf(branch)),
        }
        positions.set(branch.id, position)
        branch.turns.forEach((turn, index) => rects.set(turn.id, turnRect(turn, x, y + index * TURN_STEP)))
        const firstRect = branch.turns.length > 0 ? rects.get(branch.turns[0].id) : null
        if (horizontal) {
          position.side = firstRect && firstRect.y < anchor.y ? 'bottom' : 'top'
        } else {
          position.side = firstRect ? branchSide(anchor, firstRect) : 'left'
        }
      }
      let minX = 0
      let minY = 0
      let maxX = CARD_W
      let maxY = TURN_STEP
      for (const rect of rects.values()) {
        minX = Math.min(minX, rect.x)
        minY = Math.min(minY, rect.y)
        maxX = Math.max(maxX, rect.x + rect.w)
        maxY = Math.max(maxY, rect.y + rect.h)
      }
      const mainComposer = mainTurns.length > 0
        ? (() => {
            const rect = rects.get(mainTurns[mainTurns.length - 1].id)
            return { x: rect.x, y: rect.y + rect.h + 16 }
          })()
        : { x: 0, y: TOP_PAD + TURN_STEP }
      for (const branch of branches) {
        const position = positions.get(branch.id)
        if (!position || branch.turns.length === 0) continue
        const rect = rects.get(branch.turns[branch.turns.length - 1].id)
        maxY = Math.max(maxY, rect.y + rect.h + 16 + 180)
      }
      maxY = Math.max(maxY, mainComposer.y + 180)
      return {
        positions,
        rects,
        parentOf,
        turnBranch,
        branchById,
        mainComposer,
        bounds: { minX, minY, maxX, maxY, width: maxX - minX + 240, height: maxY - minY + 240 },
      }
    }

    function renderInline(text) {
      const value = String(text || '')
      const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g
      const parts = []
      let last = 0
      let match
      while ((match = pattern.exec(value)) !== null) {
        if (match.index > last) parts.push(value.slice(last, match.index))
        const token = match[0]
        if (token.slice(0, 2) === '**') {
          parts.push(h('strong', { key: 'b' + match.index }, token.slice(2, -2)))
        } else {
          parts.push(h('code', { key: 'c' + match.index, className: 'cs-inline-code' }, token.slice(1, -1)))
        }
        last = match.index + token.length
      }
      if (last < value.length) parts.push(value.slice(last))
      return parts
    }

    function renderMarkdown(text) {
      const value = String(text || '')
      if (!value) return null
      const blocks = []
      let inCode = false
      let codeLines = []
      const flushCode = () => {
        if (!inCode) return
        blocks.push(h('pre', { key: 'pre' + blocks.length, className: 'cs-code' }, h('code', null, codeLines.join('\n'))))
        inCode = false
        codeLines = []
      }
      value.split(/\r?\n/).forEach((line, index) => {
        if (line.slice(0, 3) === '```') {
          if (inCode) flushCode()
          else {
            inCode = true
            codeLines = []
          }
          return
        }
        if (inCode) {
          codeLines.push(line)
          return
        }
        if (!line.trim()) {
          blocks.push(h('div', { key: 'sp' + index, className: 'cs-sp' }))
          return
        }
        const heading = /^(#{1,4})\s+(.*)$/.exec(line)
        if (heading) {
          blocks.push(h('div', { key: 'h' + index, className: 'cs-h cs-h' + heading[1].length }, renderInline(heading[2])))
          return
        }
        const bullet = /^[-*]\s+(.*)$/.exec(line)
        if (bullet) {
          blocks.push(h('div', { key: 'li' + index, className: 'cs-li' },
            h('span', { className: 'cs-li-dot' }, '•'),
            h('span', null, renderInline(bullet[1]))
          ))
          return
        }
        blocks.push(h('div', { key: 'p' + index, className: 'cs-p' }, renderInline(line)))
      })
      flushCode()
      return h('div', { className: 'cs-md' }, blocks)
    }

    function ChatSpaceIcon({ size }) {
      const edge = Number(size) || 20
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': true,
        style: { display: 'block', pointerEvents: 'none' },
      },
        h('path', { d: 'M7 4.5v15', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' }),
        h('circle', { cx: 7, cy: 7.2, r: 1.9, fill: 'currentColor' }),
        h('circle', { cx: 7, cy: 12, r: 1.9, fill: 'currentColor' }),
        h('circle', { cx: 7, cy: 16.8, r: 1.9, fill: 'currentColor' }),
        h('path', { d: 'M7 12h4.4a3 3 0 0 1 3 3v3.4', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('circle', { cx: 14.4, cy: 18.4, r: 1.9, fill: 'currentColor', opacity: 0.7 })
      )
    }

    function Dot({ kind, zoom, label, color, selected, flagged, onClick, onHover, onLeave, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }) {
      const edge = kind === 'main'
        ? Math.max(10, 24 / Math.max(zoom, 0.01))
        : Math.max(8, 15 / Math.max(zoom, 0.01))
      const safeZoom = Math.max(zoom, 0.01)
      return h('div', { className: 'cs-dot-wrap' },
        selected ? h('span', {
          className: 'cs-dot-ring',
          style: {
            width: edge + 8 / safeZoom,
            height: edge + 8 / safeZoom,
            borderColor: color,
            borderWidth: 2 / safeZoom,
            color,
          },
        }) : null,
        h('button', {
          type: 'button',
          className: cx('cs-dot', kind === 'main' ? 'cs-dot-main' : 'cs-dot-branch'),
          style: { width: edge, height: edge, background: color, touchAction: 'none', position: 'relative' },
          'aria-label': label,
          onClick,
          onMouseEnter: onHover,
          onMouseLeave: onLeave,
          onPointerDown,
          onPointerMove,
          onPointerUp,
          onPointerCancel,
          onContextMenu: (event) => event.preventDefault(),
        },
          flagged
            ? h('span', {
                className: 'cs-dot-flag',
                style: {
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 14 / safeZoom,
                },
              }, '⚑')
            : null
        )
      )
    }

    function Composer({ t, placeholder, onSend, busy, autoFocus, storageKey }) {
      const [value, setValue] = useState(() => readTextStorage(storageKey))
      useEffect(() => {
        writeTextStorage(storageKey, value)
      }, [storageKey, value])
      const submit = () => {
        const question = value.trim()
        if (!question || busy) return
        setValue('')
        onSend(question)
      }
      const keyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault()
          submit()
        }
      }
      return h('div', { className: 'cs-composer' },
        h('textarea', {
          className: 'cs-input',
          value,
          placeholder,
          rows: 3,
          autoFocus: Boolean(autoFocus),
          disabled: busy,
          onChange: (event) => setValue(event.target.value),
          onKeyDown: keyDown,
        }),
        h('div', { className: 'cs-composer-bar' },
          h('span', { className: 'cs-hint' }, busy ? t('sending') : t('composerHint')),
          h('button', {
            type: 'button',
            className: 'cs-btn cs-btn-primary',
            disabled: busy || !value.trim(),
            onClick: submit,
          }, busy ? t('sending') : t('send'))
        )
      )
    }

    function TurnCard({
      t, turn, kind, branch, isFirst, detail, highlighted, color,
      onSelection, onAskWhole, onDelete, onRetry, onStop, onBackToMain, onFocus, onBriefChange,
      onDragStart, onDragMove, onDragEnd, onResizeStart, onResizeMove, onResizeEnd,
      onBringToFront, selected, active, side, sequence, onToggleTodo, onToggleFlag,
      onCardPointerDown, onCardPointerMove, onCardPointerUp, onCardPointerCancel, onCardClick, onCardDoubleClick, onLocateAnchor,
    }) {
      const streaming = turn.status === 'streaming'
      const failed = turn.status === 'failed'
      const cancelled = turn.status === 'cancelled'

      const handleSelection = (event) => {
        if (!active || !onSelection || detail !== 'full' || streaming) return
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed) return
        const text = selection.toString().trim()
        if (!text || text.length > 2000) return
        const root = event.currentTarget
        if (!root || !selection.anchorNode || !selection.focusNode) return
        if (!root.contains(selection.anchorNode) || !root.contains(selection.focusNode)) return
        let rect
        try {
          rect = selection.getRangeAt(0).getBoundingClientRect()
        } catch (_error) {
          return
        }
        if (!rect || (rect.width === 0 && rect.height === 0)) return
        onSelection({
          turnId: turn.id,
          branchId: kind === 'branch' ? branch.id : null,
          text,
          x: rect.left + rect.width / 2,
          y: rect.top - 8,
        })
      }

      return h('div', {
        className: cx(
          'cs-card',
          kind === 'main' ? 'cs-card-main' : 'cs-card-branch',
          detail === 'compact' ? 'cs-card-compact' : '',
          highlighted ? 'cs-highlight' : '',
          selected ? 'cs-selected' : '',
          active ? 'cs-active' : ''
        ),
        style: { '--cs-card-accent': color },
        'data-turn-id': turn.id,
        onPointerDownCapture: () => {
          if (onBringToFront) onBringToFront()
        },
        onPointerDown: onCardPointerDown,
        onPointerMove: onCardPointerMove,
        onPointerUp: onCardPointerUp,
        onPointerCancel: onCardPointerCancel,
        onClick: onCardClick,
        onDoubleClick: onCardDoubleClick,
      },
        h('div', { className: 'cs-card-head' },
          h('div', { className: 'cs-card-tags' },
            sequence ? h('span', { className: 'cs-seq' }, sequence) : null,
            h('span', {
              className: cx('cs-tag', kind === 'main' ? 'cs-tag-main' : 'cs-tag-branch'),
              style: { background: color + '22', color },
            }, t(kind === 'main' ? 'main' : 'branch')),
            h('label', {
              className: cx('cs-todo', turn.todo ? 'cs-todo-on' : ''),
              title: t('todo'),
              onClick: (event) => event.stopPropagation(),
            },
              h('input', {
                type: 'checkbox',
                checked: Boolean(turn.todo),
                onChange: (event) => onToggleTodo(event.target.checked),
              }),
              h('span', { className: 'cs-todo-box' }, turn.todo ? '✓' : '')
            ),
            h('button', {
              type: 'button',
              className: cx('cs-flag', turn.flag ? 'cs-flag-on' : ''),
              title: t('important'),
              onClick: () => onToggleFlag(!turn.flag),
            }, '⚑'),
            kind === 'branch' && isFirst && branch.anchorText
              ? h('span', { className: 'cs-anchor', title: branch.anchorText }, t('branchFrom') + ' · ' + (branch.anchorSource === 'answer' ? t('wholeAnswer') : truncate(branch.anchorText, 26)))
              : null
          ),
          h('div', { className: 'cs-card-actions' },

            detail === 'full' && kind === 'main' && active && !streaming && turn.answer.trim()
              ? h('button', { type: 'button', className: 'cs-mini', onClick: () => onAskWhole(turn) }, t('continueFollowUp'))
              : null,
            detail === 'full' && kind === 'branch' && active && !streaming && turn.answer.trim()
              ? h('button', { type: 'button', className: 'cs-mini', onClick: () => onAskWhole(turn) }, t('continueFollowUp'))
              : null,
            detail === 'full' && kind === 'branch' && branch.anchorText && branch.anchorSource !== 'answer'
              ? h('button', { type: 'button', className: 'cs-mini cs-locate', onClick: (event) => { event.stopPropagation(); onLocateAnchor() } }, t('locateOriginal'))
              : null,
            detail === 'full'
              ? h('button', { type: 'button', className: 'cs-mini cs-danger', onClick: () => onDelete(turn.id) }, t('delete'))
              : null
          )
        ),
        h('div', { className: 'cs-card-body' },
          kind === 'branch' && isFirst
            ? h('div', { className: 'cs-branch-meta' },
                h('div', { className: 'cs-branch-anchor-label' }, t('branchBriefLabel')),
                h('div', { className: 'cs-branch-anchor-text' }, branch.anchorText),
                h('input', {
                  className: 'cs-brief-input',
                  value: branch.brief,
                  placeholder: t('branchBriefPlaceholder'),
                  onChange: (event) => onBriefChange(event.target.value),
                })
              )
            : null,
          h('div', { className: 'cs-q' },
            h('span', { className: 'cs-q-mark' }, 'Q'),
            h('div', { className: 'cs-q-text' }, turn.question)
          ),
          h('div', { className: 'cs-a', 'data-turn-id': turn.id, onMouseUp: handleSelection },
            detail === 'compact'
              ? h('div', { className: 'cs-a-compact' }, truncate(turn.answer || t('noAnswer'), 260))
              : h(React.Fragment, null,
                  renderMarkdown(turn.answer || (streaming ? t('thinking') : t('noAnswer'))),
                  streaming ? h('span', { className: 'cs-cursor', 'aria-hidden': true }) : null
                )
          ),
          failed && turn.error
            ? h('div', { className: 'cs-error' },
                h('span', null, turn.error),
                h('button', { type: 'button', className: 'cs-mini', onClick: () => onRetry(turn.id) }, t('retry'))
              )
            : null,
          cancelled ? h('div', { className: 'cs-note' }, t('cancelled')) : null
        ),
        detail === 'full'
          ? h('div', { className: 'cs-card-foot' },
              h('span', { className: 'cs-status' }, streaming ? t('sending') : failed ? t('failed') : cancelled ? t('cancelled') : ''),
              streaming
                ? h('button', { type: 'button', className: 'cs-mini', onClick: () => onStop(turn.id) }, t('stop'))
                : h('span', { className: 'cs-usage' }, formatUsage(turn.usage))
            )
          : null,
        detail === 'full'
          ? h('span', {
              className: 'cs-resize',
              title: t('resize'),
              onPointerDown: onResizeStart,
              onPointerMove: onResizeMove,
              onPointerUp: onResizeEnd,
              onPointerCancel: onResizeEnd,
            })
          : null
      )
    }

    function ChatSpaceRoot({ tr, t: slotT, onBackToConversation }) {
      const t = typeof tr === 'function' ? tr : typeof slotT === 'function' ? slotT : (key) => key
      const [library, setLibrary] = useState(null)
      const [loadState, setLoadState] = useState('loading')
      const [loadError, setLoadError] = useState('')
      const [activeId, setActiveId] = useState(null)
      const [selectedFolder, setSelectedFolder] = useState('all')
      const [newSpaceOpen, setNewSpaceOpen] = useState(false)
      const [newSpaceTitle, setNewSpaceTitle] = useState('')
      const [newSpaceLayout, setNewSpaceLayout] = useState('vertical')
      const [newSpaceFolder, setNewSpaceFolder] = useState('')
      const [newFolderOpen, setNewFolderOpen] = useState(false)
      const [newFolderName, setNewFolderName] = useState('')
      const [newFolderParent, setNewFolderParent] = useState('')
      const [renameTarget, setRenameTarget] = useState(null)
      const [renameValue, setRenameValue] = useState('')
      const [busy, setBusy] = useState(false)
      const [notice, setNotice] = useState('')

      const loadLibrary = useCallback(async (silent) => {
        if (!silent) setLoadState('loading')
        try {
          const response = await fetch(API + '/library', { headers: { Accept: 'application/json' } })
          const body = await response.json()
          if (!response.ok || !body || body.ok === false) throw new Error(body && body.error ? body.error : '读取空间库失败')
          setLibrary(body.library || { folders: [], spaces: [] })
          setLoadError('')
          setLoadState('ready')
        } catch (error) {
          setLoadError(error && error.message ? error.message : '读取空间库失败')
          setLoadState('error')
        }
      }, [])

      useEffect(() => {
        loadLibrary()
      }, [loadLibrary])

      const post = async (pathName, body) => {
        const response = await fetch(API + pathName, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body || {}),
        })
        const data = await response.json()
        if (!response.ok || !data || data.ok === false) throw new Error(data && data.error ? data.error : '操作失败')
        return data
      }

      const run = async (action) => {
        setBusy(true)
        setNotice('')
        try {
          await action()
        } catch (error) {
          setNotice(error && error.message ? error.message : '操作失败')
        } finally {
          setBusy(false)
        }
      }

      const folders = library && Array.isArray(library.folders) ? library.folders : []
      const spaces = library && Array.isArray(library.spaces) ? library.spaces : []
      const folderById = new Map(folders.map((folder) => [folder.id, folder]))
      const childrenOf = (parentId) => folders
        .filter((folder) => (folder.parentId || null) === parentId)
        .sort((left, right) => (left.order || 0) - (right.order || 0))
      const folderDepth = (folder) => {
        let depth = 0
        let current = folder
        while (current && current.parentId && folderById.has(current.parentId) && depth < 30) {
          depth += 1
          current = folderById.get(current.parentId)
        }
        return depth
      }
      const flatten = (parentId, depth, output) => {
        for (const folder of childrenOf(parentId)) {
          output.push({ folder, depth })
          flatten(folder.id, depth + 1, output)
        }
        return output
      }
      const flatFolders = flatten(null, 0, [])
      const selectedName = selectedFolder === 'all'
        ? t('allSpaces')
        : selectedFolder === 'none'
          ? t('uncategorized')
          : (folderById.get(selectedFolder) && folderById.get(selectedFolder).name) || t('allSpaces')
      const visibleSpaces = spaces
        .filter((space) => {
          if (selectedFolder === 'all') return true
          if (selectedFolder === 'none') return !space.folderId
          return space.folderId === selectedFolder
        })
        .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))
      const formatDate = (value) => {
        const date = new Date(value || Date.now())
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = String(date.getHours()).padStart(2, '0')
        const minute = String(date.getMinutes()).padStart(2, '0')
        return month + '/' + day + ' ' + hour + ':' + minute
      }
      const folderOptions = (selected, rootLabel) => [
        h('option', { key: 'none', value: '' }, rootLabel || t('uncategorized')),
        ...flatFolders.map(({ folder, depth }) => h('option', { key: folder.id, value: folder.id }, '—'.repeat(depth) + ' ' + folder.name)),
      ]
      const openSpace = (id) => setActiveId(id)

      const createSpace = () => run(async () => {
        const data = await post('/space/create', {
          title: newSpaceTitle.trim() || t('untitledSpace'),
          layoutMode: newSpaceLayout,
          folderId: newSpaceFolder || null,
        })
        setLibrary(data.library || library)
        setNewSpaceOpen(false)
        setNewSpaceTitle('')
        setNewSpaceLayout('vertical')
        setNewSpaceFolder('')
        if (data.space && data.space.id) setActiveId(data.space.id)
      })

      const createFolder = () => run(async () => {
        const name = newFolderName.trim()
        if (!name) return
        const data = await post('/folder/create', { name, parentId: newFolderParent || null })
        setLibrary(data.library || library)
        setNewFolderOpen(false)
        setNewFolderName('')
        setNewFolderParent('')
      })

      const moveSpace = (space, folderId) => run(async () => {
        const data = await post('/space/update', { id: space.id, folderId: folderId || null })
        if (data.library) setLibrary(data.library)
      })

      const deleteSpace = (space) => run(async () => {
        if (!window.confirm(t('confirmDeleteSpace'))) return
        const data = await post('/space/delete', { id: space.id })
        if (data.library) setLibrary(data.library)
        if (selectedFolder !== 'all' && selectedFolder !== 'none' && !folderById.has(selectedFolder)) setSelectedFolder('all')
      })

      const deleteFolder = (folder) => run(async () => {
        if (!window.confirm(t('confirmDeleteFolder'))) return
        const data = await post('/folder/delete', { id: folder.id })
        if (data.library) setLibrary(data.library)
        if (selectedFolder === folder.id) setSelectedFolder('all')
      })

      const saveRename = () => run(async () => {
        if (!renameTarget) return
        const name = renameValue.trim()
        if (!name) return
        const data = renameTarget.kind === 'folder'
          ? await post('/folder/update', { id: renameTarget.id, name })
          : await post('/space/update', { id: renameTarget.id, title: name })
        if (data.library) setLibrary(data.library)
        setRenameTarget(null)
        setRenameValue('')
      })

      const openNewSpace = () => {
        setNewSpaceTitle('')
        setNewSpaceLayout('vertical')
        setNewSpaceFolder(selectedFolder !== 'all' && selectedFolder !== 'none' ? selectedFolder : '')
        setNewSpaceOpen(true)
      }

      const openNewFolder = () => {
        setNewFolderName('')
        setNewFolderParent(selectedFolder !== 'all' && selectedFolder !== 'none' ? selectedFolder : '')
        setNewFolderOpen(true)
      }

      const startRename = (kind, id, name) => {
        setRenameTarget({ kind, id })
        setRenameValue(name || '')
      }

      const renderFolderRow = (folder, depth) => {
        const childCount = spaces.filter((space) => space.folderId === folder.id).length
        return h('div', {
          key: folder.id,
          className: cx('cs-lib-folder', selectedFolder === folder.id ? 'cs-lib-folder-active' : ''),
          style: { paddingLeft: 10 + depth * 14 },
          onClick: () => setSelectedFolder(folder.id),
        },
          h('span', { className: 'cs-lib-folder-icon' }, '▸'),
          h('span', { className: 'cs-lib-folder-name' }, folder.name),
          h('span', { className: 'cs-lib-folder-count' }, childCount || ''),
          h('span', { className: 'cs-lib-folder-actions' },
            h('button', { type: 'button', title: t('rename'), onClick: (event) => { event.stopPropagation(); startRename('folder', folder.id, folder.name) } }, '✎'),
            h('button', { type: 'button', title: t('delete'), onClick: (event) => { event.stopPropagation(); deleteFolder(folder) } }, '×')
          )
        )
      }

      const renderFolderTree = (parentId, depth) => childrenOf(parentId).flatMap((folder) => [
        renderFolderRow(folder, depth),
        ...renderFolderTree(folder.id, depth + 1),
      ])

      const renderSpaceCard = (space) => {
        const layoutLabel = space.layoutMode === 'horizontal' ? t('horizontalShort') : t('verticalShort')
        return h('div', {
          key: space.id,
          className: 'cs-lib-space-card',
          onClick: () => openSpace(space.id),
        },
          h('div', { className: 'cs-lib-space-head' },
            h('div', { className: 'cs-lib-space-title', title: space.title }, space.title),
            h('span', { className: 'cs-lib-layout-badge' }, layoutLabel)
          ),
          h('div', { className: 'cs-lib-space-question' }, space.lastQuestion || t('emptySpace')),
          h('div', { className: 'cs-lib-space-meta' },
            h('span', null, (space.turnCount || 0) + ' ' + t('turns')),
            h('span', null, formatDate(space.updatedAt))
          ),
          h('div', { className: 'cs-lib-space-actions' },
            h('select', {
              className: 'cs-lib-move',
              value: space.folderId || '',
              title: t('moveTo'),
              onClick: (event) => event.stopPropagation(),
              onChange: (event) => { event.stopPropagation(); moveSpace(space, event.target.value) },
            }, folderOptions(space.folderId || '', t('uncategorized'))),
            h('button', { type: 'button', className: 'cs-lib-mini', onClick: (event) => { event.stopPropagation(); startRename('space', space.id, space.title) } }, t('rename')),
            h('button', { type: 'button', className: 'cs-lib-mini cs-lib-mini-danger', onClick: (event) => { event.stopPropagation(); deleteSpace(space) } }, t('delete'))
          )
        )
      }

      if (activeId) {
        return h(ChatSpacePanel, {
          key: activeId,
          tr,
          t,
          onBackToConversation,
          spaceId: activeId,
          onBackToLibrary: () => {
            setActiveId(null)
            loadLibrary(true)
          },
        })
      }

      if (loadState === 'loading') {
        return h('div', { className: 'cs-root cs-library' },
          h('style', null, CSS),
          h('div', { className: 'cs-lib-center' }, t('loading'))
        )
      }

      if (loadState === 'error') {
        return h('div', { className: 'cs-root cs-library' },
          h('style', null, CSS),
          h('div', { className: 'cs-lib-center' },
            h('div', { className: 'cs-lib-empty-title' }, t('libraryLoadError')),
            h('div', { className: 'cs-lib-empty-text' }, loadError),
            h('button', { type: 'button', className: 'cs-btn', onClick: () => loadLibrary() }, t('retry'))
          )
        )
      }

      return h('div', { className: 'cs-root cs-library' },
        h('style', null, CSS),
        h('div', { className: 'cs-lib-header' },
          h('div', { className: 'cs-lib-heading' },
            h('div', { className: 'cs-title' }, t('libraryTitle')),
            h('div', { className: 'cs-subtitle' }, t('librarySubtitle'))
          ),
          h('div', { className: 'cs-top-actions' },
            h('button', { type: 'button', className: 'cs-btn', onClick: openNewFolder }, t('newFolder')),
            h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: openNewSpace }, t('newSpace')),
            typeof onBackToConversation === 'function'
              ? h('button', { type: 'button', className: 'cs-btn', onClick: onBackToConversation }, t('backToConversation'))
              : null
          )
        ),
        notice ? h('div', { className: 'cs-lib-notice' }, notice) : null,
        h('div', { className: 'cs-lib-body' },
          h('aside', { className: 'cs-lib-side' },
            h('div', { className: 'cs-lib-side-title' }, t('folders')),
            h('div', {
              className: cx('cs-lib-folder', selectedFolder === 'all' ? 'cs-lib-folder-active' : ''),
              onClick: () => setSelectedFolder('all'),
            },
              h('span', { className: 'cs-lib-folder-icon' }, '◆'),
              h('span', { className: 'cs-lib-folder-name' }, t('allSpaces')),
              h('span', { className: 'cs-lib-folder-count' }, spaces.length)
            ),
            h('div', {
              className: cx('cs-lib-folder', selectedFolder === 'none' ? 'cs-lib-folder-active' : ''),
              onClick: () => setSelectedFolder('none'),
            },
              h('span', { className: 'cs-lib-folder-icon' }, '·'),
              h('span', { className: 'cs-lib-folder-name' }, t('uncategorized')),
              h('span', { className: 'cs-lib-folder-count' }, spaces.filter((space) => !space.folderId).length)
            ),
            renderFolderTree(null, 0),
            h('button', { type: 'button', className: 'cs-lib-newfolder', onClick: openNewFolder }, '+ ' + t('newFolder'))
          ),
          h('section', { className: 'cs-lib-main' },
            h('div', { className: 'cs-lib-main-head' },
              h('div', null,
                h('div', { className: 'cs-lib-main-title' }, selectedName),
                h('div', { className: 'cs-lib-main-sub' }, visibleSpaces.length + ' ' + t('spaces'))
              ),
              h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: openNewSpace }, '+ ' + t('newSpace'))
            ),
            visibleSpaces.length === 0
              ? h('div', { className: 'cs-lib-empty' },
                  h('div', { className: 'cs-lib-empty-title' }, t('emptyLibrary')),
                  h('div', { className: 'cs-lib-empty-text' }, t('emptyLibraryHint')),
                  h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: openNewSpace }, t('newSpace'))
                )
              : h('div', { className: 'cs-lib-spaces' }, visibleSpaces.map(renderSpaceCard))
          )
        ),
        newSpaceOpen ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setNewSpaceOpen(false) },
          h('div', { className: 'cs-lib-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('newSpace')),
            h('label', { className: 'cs-lib-field' },
              h('span', null, t('titleLabel')),
              h('input', { className: 'cs-lib-input', value: newSpaceTitle, autoFocus: true, placeholder: t('untitledSpace'), onChange: (event) => setNewSpaceTitle(event.target.value) })
            ),
            h('div', { className: 'cs-lib-field' },
              h('span', null, t('layoutLabel')),
              h('div', { className: 'cs-lib-layout-choice' },
                h('button', { type: 'button', className: cx('cs-lib-layout-option', newSpaceLayout === 'vertical' ? 'cs-lib-layout-active' : ''), onClick: () => setNewSpaceLayout('vertical') }, t('layoutVertical')),
                h('button', { type: 'button', className: cx('cs-lib-layout-option', newSpaceLayout === 'horizontal' ? 'cs-lib-layout-active' : ''), onClick: () => setNewSpaceLayout('horizontal') }, t('layoutHorizontal'))
              )
            ),
            h('label', { className: 'cs-lib-field' },
              h('span', null, t('folderLabel')),
              h('select', { className: 'cs-lib-input', value: newSpaceFolder, onChange: (event) => setNewSpaceFolder(event.target.value) }, folderOptions(newSpaceFolder, t('uncategorized')))
            ),
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setNewSpaceOpen(false) }, t('cancel')),
              h('button', { type: 'button', className: 'cs-btn cs-btn-primary', disabled: busy, onClick: createSpace }, t('create'))
            )
          )
        ) : null,
        newFolderOpen ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setNewFolderOpen(false) },
          h('div', { className: 'cs-lib-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('newFolder')),
            h('label', { className: 'cs-lib-field' },
              h('span', null, t('folderName')),
              h('input', { className: 'cs-lib-input', value: newFolderName, autoFocus: true, onChange: (event) => setNewFolderName(event.target.value) })
            ),
            h('label', { className: 'cs-lib-field' },
              h('span', null, t('parentFolder')),
              h('select', { className: 'cs-lib-input', value: newFolderParent, onChange: (event) => setNewFolderParent(event.target.value) }, folderOptions(newFolderParent, t('rootFolder')))
            ),
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setNewFolderOpen(false) }, t('cancel')),
              h('button', { type: 'button', className: 'cs-btn cs-btn-primary', disabled: busy, onClick: createFolder }, t('create'))
            )
          )
        ) : null,
        renameTarget ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setRenameTarget(null) },
          h('div', { className: 'cs-lib-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('rename')),
            h('label', { className: 'cs-lib-field' },
              h('span', null, renameTarget.kind === 'folder' ? t('folderName') : t('titleLabel')),
              h('input', { className: 'cs-lib-input', value: renameValue, autoFocus: true, onChange: (event) => setRenameValue(event.target.value) })
            ),
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setRenameTarget(null) }, t('cancel')),
              h('button', { type: 'button', className: 'cs-btn cs-btn-primary', disabled: busy, onClick: saveRename }, t('save'))
            )
          )
        ) : null
      )
    }


    function ChatSpacePanel({ tr, t: slotT, onBackToConversation, spaceId, onBackToLibrary }) {
      const t = typeof tr === 'function' ? tr : typeof slotT === 'function' ? slotT : (key) => key
      const [space, setSpace] = useState(null)
      const [model, setModel] = useState(null)
      const [loadState, setLoadState] = useState('loading')
      const [loadError, setLoadError] = useState('')
      const [saveState, setSaveState] = useState('idle')
      const [selection, setSelection] = useState(() => {
        const saved = readJsonStorage(SELECTION_KEY)
        if (!saved || typeof saved.turnId !== 'string' || typeof saved.text !== 'string') return null
        return {
          ...saved,
          x: clamp(finite(saved.x, window.innerWidth / 2), 80, Math.max(80, window.innerWidth - 80)),
          y: Math.max(64, finite(saved.y, 160)),
        }
      })
      const [draft, setDraft] = useState(() => {
        const saved = readJsonStorage(DRAFT_KEY)
        if (!saved || typeof saved.anchorTurnId !== 'string' || typeof saved.anchorText !== 'string') return null
        return {
          anchorTurnId: saved.anchorTurnId,
          anchorText: saved.anchorText,
          anchorSource: saved.anchorSource === 'answer' ? 'answer' : 'selection',
          parentBranchId: stringOf(saved.parentBranchId) || null,
          question: stringOf(saved.question),
          brief: stringOf(saved.brief),
        }
      })
      const [toast, setToast] = useState(null)
      const [highlight, setHighlight] = useState(null)
      const [hover, setHover] = useState(null)
      const [layersOpen, setLayersOpen] = useState(false)
      const [marquee, setMarquee] = useState(null)
      const [selectedTurn, setSelectedTurn] = useState(null)
      const [selectedIds, setSelectedIds] = useState(() => new Set())
      const [anchorReveal, setAnchorReveal] = useState(null)
      const [undoCount, setUndoCount] = useState(0)

      const spaceRef = useRef(null)
      const viewportRef = useRef(null)
      const rootRef = useRef(null)
      const saveTimerRef = useRef(null)
      const streamsRef = useRef(new Map())
      const loadedRef = useRef(false)
      const panRef = useRef(null)
      const marqueeRef = useRef(null)
      const fitViewRef = useRef(null)
      const highlightTimerRef = useRef(null)
      const draftQuestionRef = useRef(null)
      const suppressSelectionClearRef = useRef(false)
      const dragRef = useRef(null)
      const summaryRequestsRef = useRef(new Set())
      const zCounterRef = useRef(0)
      const historyRef = useRef([])
      const dotPressRef = useRef(null)
      const suppressDotClickRef = useRef(false)
      const cardPressRef = useRef(null)
      const suppressCardClickRef = useRef(false)
      const anchorOverlayRef = useRef(null)

      useEffect(() => () => {
        if (dotPressRef.current && dotPressRef.current.timer) clearTimeout(dotPressRef.current.timer)
        if (cardPressRef.current) {
          if (cardPressRef.current.timer) clearTimeout(cardPressRef.current.timer)
          if (cardPressRef.current.cleanup) cardPressRef.current.cleanup()
        }
        if (anchorOverlayRef.current) {
          anchorOverlayRef.current.remove()
          anchorOverlayRef.current = null
        }
      }, [])

      const commit = useCallback((updater) => {
        setSpace((previous) => {
          if (!previous) return previous
          const next = typeof updater === 'function' ? updater(previous) : updater
          spaceRef.current = next
          return next
        })
      }, [])

      const saveNow = useCallback(async () => {
        if (!loadedRef.current || !spaceRef.current) return
        setSaveState('saving')
        try {
          const response = await fetch(API + '/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ space: { ...spaceRef.current, id: spaceId || spaceRef.current.id }, spaceId: spaceId || spaceRef.current.id }),
          })
          if (!response.ok) throw new Error('HTTP ' + response.status)
          setSaveState('saved')
        } catch (_error) {
          setSaveState('error')
        }
      }, [])

      const saveSoon = useCallback((delay) => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        saveTimerRef.current = setTimeout(() => {
          saveTimerRef.current = null
          saveNow()
        }, typeof delay === 'number' ? delay : 700)
      }, [saveNow])

      useEffect(() => {
        let alive = true
        fetch(API + '/space?id=' + encodeURIComponent(spaceId || 'default'), { headers: { Accept: 'application/json' } })
          .then((response) => response.json().then((body) => ({ response, body })))
          .then(({ response, body }) => {
            if (!alive) return
            if (!response.ok || !body || body.ok === false) throw new Error(body && body.error ? body.error : '读取失败')
            const next = normalizeSpace(body.space)
            spaceRef.current = next
            setSpace(next)
            const allTurns = [...next.main.turns, ...next.branches.flatMap((branch) => branch.turns)]
            zCounterRef.current = Math.max(0, ...allTurns.map((turn) => finite(turn.z, 0)))
            historyRef.current = []
            setUndoCount(0)
            setSelectedTurn(null)
            setSelectedIds(new Set())
            const savedDraft = readJsonStorage(DRAFT_KEY)
            if (savedDraft && !allTurns.some((turn) => turn.id === savedDraft.anchorTurnId)) {
              writeJsonStorage(DRAFT_KEY, null)
              setDraft(null)
            }
            const savedSelection = readJsonStorage(SELECTION_KEY)
            if (savedSelection && !allTurns.some((turn) => turn.id === savedSelection.turnId)) {
              writeJsonStorage(SELECTION_KEY, null)
              setSelection(null)
            }
            setModel(body.model || null)
            setLoadState('ready')
            loadedRef.current = true
          })
          .catch((error) => {
            if (!alive) return
            setLoadError(error && error.message ? error.message : '读取失败')
            setLoadState('error')
          })
        return () => {
          alive = false
        }
      }, [spaceId])

      useEffect(() => {
        writeJsonStorage(DRAFT_KEY, draft)
      }, [draft])

      useEffect(() => {
        writeJsonStorage(SELECTION_KEY, selection)
      }, [selection])

      useEffect(() => {
        const onSelectionChange = () => {
          if (suppressSelectionClearRef.current) return
          const current = window.getSelection()
          const text = current && !current.isCollapsed ? current.toString().trim() : ''
          setSelection((existing) => {
            if (!existing) return existing
            if (!text || text !== existing.text) return null
            return existing
          })
        }


      const onPointerDown = (event) => {
          const target = event.target
          if (target && target.closest && target.closest('.cs-sel-toolbar')) return
          setSelection((existing) => (existing ? null : existing))
        }
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setSelection((existing) => (existing ? null : existing))
        }
        document.addEventListener('selectionchange', onSelectionChange)
        document.addEventListener('pointerdown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown)
        return () => {
          document.removeEventListener('selectionchange', onSelectionChange)
          document.removeEventListener('pointerdown', onPointerDown, true)
          document.removeEventListener('keydown', onKeyDown)
        }
      }, [])

      useEffect(() => {
        if (!draft) return
        const timer = setTimeout(() => {
          if (draftQuestionRef.current) draftQuestionRef.current.focus()
        }, 30)
        return () => clearTimeout(timer)
      }, [draft])

      useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => setToast(null), 6000)
        return () => clearTimeout(timer)
      }, [toast])

      useEffect(() => {
        const onBeforeUnload = () => {
          if (!loadedRef.current || !spaceRef.current) return
          try {
            const blob = new Blob([JSON.stringify({ space: spaceRef.current })], { type: 'application/json' })
            navigator.sendBeacon(API + '/save', blob)
          } catch (_error) {
            // The page is going away; there is no second chance.
          }
        }
        window.addEventListener('beforeunload', onBeforeUnload)
        return () => window.removeEventListener('beforeunload', onBeforeUnload)
      }, [])

      useEffect(() => () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
        for (const controller of streamsRef.current.values()) {
          try {
            controller.abort()
          } catch (_error) {
            // Already closed.
          }
        }
        if (loadedRef.current && spaceRef.current) {
          try {
            fetch(API + '/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ space: spaceRef.current }),
              keepalive: true,
            }).catch(() => {})
          } catch (_error) {
            // Ignore a teardown save failure.
          }
        }
      }, [])

      useEffect(() => {
        if (loadState !== 'ready') return
        const root = rootRef.current
        const viewport = viewportRef.current
        if (!root || !viewport) return
        const onWheel = (event) => {
          const current = spaceRef.current
          if (!current) return
          const target = event.target
          const card = target && target.closest ? target.closest('.cs-card') : null
          if (selectedTurn && card && card.getAttribute('data-turn-id') === selectedTurn.turnId) {
            const body = card.querySelector('.cs-card-body')
            if (body) {
              event.preventDefault()
              body.scrollTop += event.deltaY
              return
            }
          }
          event.preventDefault()
          const view = current.view || { x: 120, y: 120, zoom: 1 }
          const rect = viewport.getBoundingClientRect()
          const px = event.clientX - rect.left
          const py = event.clientY - rect.top
          const wx = (px - view.x) / view.zoom
          const wy = (py - view.y) / view.zoom
          const zoom = clamp(view.zoom * Math.exp(-event.deltaY * 0.0015), MIN_ZOOM, MAX_ZOOM)
          if (zoom < 0.55) setSelection(null)
          if (zoom >= 0.25) setHover(null)
          commit((previous) => ({
            ...previous,
            view: { zoom, x: px - wx * zoom, y: py - wy * zoom },
          }))
          saveSoon(1200)
        }
        root.addEventListener('wheel', onWheel, { passive: false })
        return () => root.removeEventListener('wheel', onWheel)
      }, [loadState, commit, saveSoon, selectedTurn])

      useEffect(() => {
        if (!anchorReveal) return
        const timer = setTimeout(() => {
          const answer = document.querySelector('.cs-a[data-turn-id="' + anchorReveal.turnId + '"]')
          if (!answer) return
          const range = findTextRange(answer, anchorReveal.text)
          if (!range) return
          const body = answer.closest('.cs-card-body')
          const scrollRange = () => {
            if (!body || !range) return
            const rr = range.getBoundingClientRect()
            const br = body.getBoundingClientRect()
            if (rr.top < br.top || rr.bottom > br.bottom) {
              body.scrollTop += (rr.top + rr.height / 2) - (br.top + br.height / 2)
            }
          }
          scrollRange()
          setTimeout(() => {
            scrollRange()
            const viewport = viewportRef.current
            if (!viewport) return
            const rr = range.getBoundingClientRect()
            const vr = viewport.getBoundingClientRect()
            if (!rr || (rr.width === 0 && rr.height === 0)) return
            const dx = (vr.left + vr.width / 2) - (rr.left + rr.width / 2)
            const dy = (vr.top + vr.height / 2) - (rr.top + rr.height / 2)
            commit((previous) => ({
              ...previous,
              view: { ...previous.view, x: previous.view.x + dx, y: previous.view.y + dy },
            }))
            saveSoon(500)
            setTimeout(() => {
              if (anchorOverlayRef.current) {
                anchorOverlayRef.current.remove()
                anchorOverlayRef.current = null
              }
              const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0)
              if (rects.length === 0) return
              const overlay = document.createElement('div')
              overlay.style.cssText = 'position:fixed;inset:0;z-index:1600;pointer-events:none;'
              const marks = rects.map((rect) => {
                const mark = document.createElement('div')
                mark.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;background:rgba(255,214,10,.38);border-radius:2px;opacity:1;transition:opacity 4s ease;`
                overlay.appendChild(mark)
                return mark
              })
              document.body.appendChild(overlay)
              anchorOverlayRef.current = overlay
              setTimeout(() => {
                for (const mark of marks) mark.style.opacity = '0'
              }, 1200)
              setTimeout(() => {
                if (overlay.parentNode) overlay.remove()
                if (anchorOverlayRef.current === overlay) anchorOverlayRef.current = null
              }, 6000)
            }, 90)
          }, 80)
        }, 180)
        return () => clearTimeout(timer)
      }, [anchorReveal])

      if (loadState === 'loading') {
        return h('div', { className: 'cs-root cs-center' },
          h('style', null, CSS),
          h('div', { className: 'cs-loading' },
            h('span', { className: 'cs-spinner' }),
            h('span', null, t('loading'))
          )
        )
      }

      if (loadState === 'error') {
        return h('div', { className: 'cs-root cs-center' },
          h('style', null, CSS),
          h('div', { className: 'cs-error-screen' },
            h('strong', null, t('loadError')),
            h('span', null, loadError || t('loadErrorHint')),
            h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: () => window.location.reload() }, t('reload'))
          )
        )
      }

      if (!space) return null

      const view = space.view || { x: 120, y: 120, zoom: 1 }
      const mainTurns = space.main.turns
      const branches = space.branches
      const layoutMode = space.layoutMode === 'horizontal' ? 'horizontal' : 'vertical'
      const layout = buildPositions(mainTurns, branches, layoutMode)
      const positions = layout.positions
      const turnRects = layout.rects
      const branchPositions = branches.map((branch) => positions.get(branch.id)).filter(Boolean)
      const ports = new Map()
      const addPort = (turnId, side) => {
        if (!turnId) return
        const set = ports.get(turnId) || new Set()
        set.add(side)
        ports.set(turnId, set)
      }
      for (let index = 1; index < mainTurns.length; index += 1) {
        if (layoutMode === 'horizontal') {
          addPort(mainTurns[index - 1].id, 'right')
          addPort(mainTurns[index].id, 'left')
        } else {
          addPort(mainTurns[index - 1].id, 'bottom')
          addPort(mainTurns[index].id, 'top')
        }
      }
      for (const position of branchPositions) {
        const branch = position.branch
        const first = branch.turns.length > 0 ? branch.turns[0] : null
        if (first) {
          const side = position.side || 'left'
          const anchorSide = side === 'left' ? 'right' : side === 'right' ? 'left' : side === 'top' ? 'bottom' : 'top'
          addPort(branch.anchorTurnId, anchorSide)
          addPort(first.id, side)
        }
        for (let index = 1; index < branch.turns.length; index += 1) {
          addPort(branch.turns[index - 1].id, 'bottom')
          addPort(branch.turns[index].id, 'top')
        }
      }
      const detail = view.zoom >= 0.55 ? 'full' : view.zoom >= 0.25 ? 'compact' : 'dot'
      const bounds = layout.bounds
      const renderPorts = (turnId, rect, color, isMain) => {
        if (detail === 'dot') return null
        const sides = ports.get(turnId)
        if (!sides) return null
        return [...sides].map((side) => h('span', {
          key: 'port-' + side,
          className: cx('cs-port', isMain ? 'cs-port-main' : ''),
          style: { ...portPosition(side, rect.w, rect.h), background: color },
        }))
      }

      const mainBusy = mainTurns.some((turn) => turn.status === 'streaming')
      const focusIds = new Set()
      if (selectedTurn) {
        focusIds.add(selectedTurn.turnId)
        if (selectedTurn.kind === 'main') {
          const index = mainTurns.findIndex((turn) => turn.id === selectedTurn.turnId)
          if (index > 0) focusIds.add(mainTurns[index - 1].id)
          if (index >= 0 && index < mainTurns.length - 1) focusIds.add(mainTurns[index + 1].id)
        } else {
          const branch = branches.find((item) => item.id === selectedTurn.branchId)
          if (branch) {
            const index = branch.turns.findIndex((turn) => turn.id === selectedTurn.turnId)
            if (index > 0) focusIds.add(branch.turns[index - 1].id)
            if (index >= 0 && index < branch.turns.length - 1) focusIds.add(branch.turns[index + 1].id)
            if (branch.anchorTurnId) focusIds.add(branch.anchorTurnId)
          }
        }
        for (const branch of branches) {
          if (branch.anchorTurnId === selectedTurn.turnId && branch.turns.length > 0) {
            focusIds.add(branch.turns[0].id)
          }
        }
      }
      const selectedBranch = selectedTurn && selectedTurn.kind === 'branch'
        ? branches.find((branch) => branch.id === selectedTurn.branchId)
        : null
      const selectedMain = Boolean(selectedTurn && selectedTurn.kind === 'main')
      const composerVisible = detail === 'full' && (
        Boolean(selectedBranch || selectedMain) || (!selectedTurn && mainTurns.length === 0)
      )
      const composerBusy = selectedBranch
        ? selectedBranch.turns.some((turn) => turn.status === 'streaming')
        : mainBusy
      const layerEntries = [
        ...mainTurns.map((turn) => ({ turn, kind: 'main', branchId: null, color: MAIN_COLOR, tag: t('main') })),
        ...branches.flatMap((branch) => branch.turns.map((turn) => ({
          turn,
          kind: 'branch',
          branchId: branch.id,
          color: (positions.get(branch.id) || {}).color || MAIN_COLOR,
          tag: t('branch'),
        }))),
      ].sort((left, right) => (
        (finite(right.turn.z, 0) - finite(left.turn.z, 0))
        || (finite(right.turn.createdAt, 0) - finite(left.turn.createdAt, 0))
      ))

      const updateTurn = (kind, branchId, turnId, patch) => {
        if (kind === 'main') {
          commit((previous) => ({
            ...previous,
            main: {
              ...previous.main,
              turns: previous.main.turns.map((turn) => (turn.id === turnId ? { ...turn, ...patch } : turn)),
            },
          }))
        } else {
          commit((previous) => ({
            ...previous,
            branches: previous.branches.map((branch) => (
              branch.id === branchId
                ? { ...branch, turns: branch.turns.map((turn) => (turn.id === turnId ? { ...turn, ...patch } : turn)) }
                : branch
            )),
          }))
        }
      }

      const bringToFront = (turn, kind, branchId) => {
        zCounterRef.current += 1
        updateTurn(kind, branchId, turn.id, { z: zCounterRef.current })
        saveSoon(300)
      }

      const pushHistory = (snapshot) => {
        const current = snapshot || spaceRef.current
        if (!current) return
        const stack = historyRef.current
        stack.push(JSON.parse(JSON.stringify(current)))
        if (stack.length > 30) stack.shift()
        setUndoCount(stack.length)
      }

      const undo = () => {
        const stack = historyRef.current
        if (stack.length === 0) return
        const previous = stack.pop()
        for (const controller of streamsRef.current.values()) {
          try {
            controller.abort()
          } catch (_error) {
            // Already closed.
          }
        }
        streamsRef.current.clear()
        const next = JSON.parse(JSON.stringify(previous))
        spaceRef.current = next
        setSpace(next)
        setSelectedTurn(null)
        setSelectedIds(new Set())
        setSelection(null)
        setDraft(null)
        setHover(null)
        setUndoCount(stack.length)
        saveSoon(80)
        setToast({ text: t('undone') })
      }

      const toggleMark = (turn, kind, branchId, field, value) => {
        pushHistory()
        updateTurn(kind, branchId, turn.id, { [field]: value })
        saveSoon(200)
      }

      const startTurnDrag = (event, turn, kind, branchId, baseX, baseY, rect) => {
        if (event.button !== undefined && event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        dragRef.current = {
          mode: 'move',
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          turnId: turn.id,
          kind,
          branchId,
          baseX,
          baseY,
          rect: { ...rect },
          spaceBefore: spaceRef.current,
        }
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch (_error) {
          // Pointer capture is best effort.
        }
      }

      const startTurnResize = (event, turn, kind, branchId, baseX, baseY, rect) => {
        if (event.button !== undefined && event.button !== 0) return
        event.preventDefault()
        event.stopPropagation()
        dragRef.current = {
          mode: 'resize',
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          turnId: turn.id,
          kind,
          branchId,
          baseX,
          baseY,
          rect: { ...rect },
          spaceBefore: spaceRef.current,
        }
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch (_error) {
          // Pointer capture is best effort.
        }
      }

      const moveTurnFrame = (event) => {
        const drag = dragRef.current
        if (!drag || drag.pointerId !== event.pointerId) return
        event.preventDefault()
        const dx = (event.clientX - drag.startX) / Math.max(view.zoom, 0.01)
        const dy = (event.clientY - drag.startY) / Math.max(view.zoom, 0.01)
        if (drag.mode === 'move' && Array.isArray(drag.targets)) {
          let appliedDx = dx
          let appliedDy = dy
          const snapDistance = 16 / Math.max(view.zoom, 0.01)
          for (const target of drag.targets) {
            if (target.kind !== 'main') continue
            if (layoutMode === 'horizontal') {
              const center = target.rect.y + target.rect.h / 2 + appliedDy
              const axis = target.baseY + target.rect.h / 2
              if (Math.abs(center - axis) < snapDistance) appliedDy = axis - (target.rect.y + target.rect.h / 2)
            } else {
              const center = target.rect.x + target.rect.w / 2 + appliedDx
              const axis = target.baseX + target.rect.w / 2
              if (Math.abs(center - axis) < snapDistance) appliedDx = axis - (target.rect.x + target.rect.w / 2)
            }
          }
          for (const target of drag.targets) {
            updateTurn(target.kind, target.branchId, target.turnId, {
              layout: {
                dx: target.rect.x - target.baseX + appliedDx,
                dy: target.rect.y - target.baseY + appliedDy,
                w: target.rect.w,
                h: target.rect.h,
              },
            })
          }
          saveSoon(600)
          return
        }
        const layout = drag.mode === 'resize'
          ? {
              dx: drag.rect.x - drag.baseX,
              dy: drag.rect.y - drag.baseY,
              w: clamp(drag.rect.w + dx, MIN_CARD_W, MAX_CARD_W),
              h: clamp(drag.rect.h + dy, MIN_CARD_H, MAX_CARD_H),
            }
          : {
              dx: drag.rect.x - drag.baseX + dx,
              dy: drag.rect.y - drag.baseY + dy,
              w: drag.rect.w,
              h: drag.rect.h,
            }
        updateTurn(drag.kind, drag.branchId, drag.turnId, { layout })
        saveSoon(600)
      }

      const endTurnFrame = (event) => {
        const drag = dragRef.current
        if (!drag) return
        dragRef.current = null
        if (drag.spaceBefore) pushHistory(drag.spaceBefore)
        try {
          event.currentTarget.releasePointerCapture(event.pointerId)
        } catch (_error) {
          // Already released.
        }
        saveSoon(80)
      }

      const beginDotPress = (event, turn, kind, branchId, baseX, baseY, rect) => {
        if (event.button !== undefined && event.button !== 0) return
        event.stopPropagation?.()
        const press = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          turn,
          kind,
          branchId,
          baseX,
          baseY,
          rect: { ...rect },
          spaceBefore: spaceRef.current,
          activated: false,
          moved: false,
          timer: null,
        }
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch (_error) {
          // Pointer capture is best effort.
        }
        press.timer = setTimeout(() => {
          if (!dotPressRef.current || dotPressRef.current.pointerId !== press.pointerId) return
          press.activated = true
          bringToFront(turn, kind, branchId)
          setSelectedIds(new Set([turn.id]))
          setSelectedTurn(null)
        }, 420)
        dotPressRef.current = press
      }

      const moveDotPress = (event) => {
        const press = dotPressRef.current
        if (!press || press.pointerId !== event.pointerId) return
        const dxPixels = event.clientX - press.startX
        const dyPixels = event.clientY - press.startY
        if (!press.activated) {
          if (Math.abs(dxPixels) > 6 || Math.abs(dyPixels) > 6) {
            clearTimeout(press.timer)
            press.timer = null
            press.moved = true
          }
          return
        }
        event.preventDefault?.()
        press.moved = true
        const dx = dxPixels / Math.max(view.zoom, 0.01)
        const dy = dyPixels / Math.max(view.zoom, 0.01)
        updateTurn(press.kind, press.branchId, press.turn.id, {
          layout: {
            dx: press.rect.x - press.baseX + dx,
            dy: press.rect.y - press.baseY + dy,
            w: press.rect.w,
            h: press.rect.h,
          },
        })
        saveSoon(600)
      }

      const endDotPress = (event) => {
        const press = dotPressRef.current
        if (!press || press.pointerId !== event.pointerId) return
        clearTimeout(press.timer)
        dotPressRef.current = null
        try {
          event.currentTarget.releasePointerCapture(event.pointerId)
        } catch (_error) {
          // Already released.
        }
        if (press.activated || press.moved) {
          suppressDotClickRef.current = true
          if (press.moved && press.spaceBefore) pushHistory(press.spaceBefore)
          saveSoon(80)
          setTimeout(() => {
            suppressDotClickRef.current = false
          }, 500)
        }
      }

      const dragTargetFor = (turnId) => {
        const mainIndex = mainTurns.findIndex((turn) => turn.id === turnId)
        if (mainIndex >= 0) {
          const rect = turnRects.get(turnId)
          const baseX = layoutMode === 'horizontal' ? TOP_PAD + mainIndex * MAIN_STEP_H : 0
          const baseY = layoutMode === 'horizontal' ? TOP_PAD : TOP_PAD + mainIndex * MAIN_STEP_V
          return rect ? { turnId, kind: 'main', branchId: null, baseX, baseY, rect: { ...rect } } : null
        }
        for (const position of branchPositions) {
          const index = position.branch.turns.findIndex((turn) => turn.id === turnId)
          if (index >= 0) {
            const rect = turnRects.get(turnId)
            return rect ? { turnId, kind: 'branch', branchId: position.branch.id, baseX: position.x, baseY: position.y + index * TURN_STEP, rect: { ...rect } } : null
          }
        }
        return null
      }

      const beginCardPress = (event, turn, kind, branchId, baseX, baseY, rect) => {
        if (event.button !== undefined && event.button !== 0) return
        const target = event.target
        if (target && target.closest && target.closest('.cs-grip, .cs-resize, button, input, textarea, a, label, .cs-modal, .cs-composer')) return
        const activeText = Boolean(
          selectedTurn
          && selectedTurn.turnId === turn.id
          && target
          && target.closest
          && target.closest('.cs-a')
        )
        const press = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          turn,
          kind,
          branchId,
          baseX,
          baseY,
          rect: { ...rect },
          spaceBefore: spaceRef.current,
          target: event.currentTarget,
          allowDrag: !activeText,
          activated: false,
          moved: false,
          cleanup: null,
        }
        const onGlobalUp = (pointerEvent) => {
          if (!cardPressRef.current || cardPressRef.current.pointerId !== press.pointerId) return
          if (press.activated) {
            if (dragRef.current && dragRef.current.pointerId === press.pointerId) {
              const drag = dragRef.current
              dragRef.current = null
              if (drag.spaceBefore) pushHistory(drag.spaceBefore)
              saveSoon(80)
            }
            cardPressRef.current = null
            if (press.cleanup) press.cleanup()
            return
          }
          cardPressRef.current = null
          if (press.cleanup) press.cleanup()
        }
        window.addEventListener('pointerup', onGlobalUp)
        window.addEventListener('pointercancel', onGlobalUp)
        press.cleanup = () => {
          window.removeEventListener('pointerup', onGlobalUp)
          window.removeEventListener('pointercancel', onGlobalUp)
        }
        cardPressRef.current = press
      }

      const activateCardDrag = (press) => {
        press.activated = true
        press.moved = true
        suppressCardClickRef.current = true
        setTimeout(() => {
          suppressCardClickRef.current = false
        }, 500)
        if (!selectedIds.has(press.turn.id)) {
          setSelectedIds(new Set([press.turn.id]))
          setSelectedTurn(null)
        }
        try {
          press.target.setPointerCapture(press.pointerId)
        } catch (_error) {
          // Pointer capture is best effort.
        }
        try {
          const selection = window.getSelection()
          if (selection) selection.removeAllRanges()
        } catch (_error) {
          // Selection is best effort.
        }
        const targetIds = selectedIds.has(press.turn.id) ? [...selectedIds] : [press.turn.id]
        const targets = targetIds.map((id) => dragTargetFor(id)).filter(Boolean)
        if (targets.length === 0) {
          targets.push({
            turnId: press.turn.id,
            kind: press.kind,
            branchId: press.branchId,
            baseX: press.baseX,
            baseY: press.baseY,
            rect: { ...press.rect },
          })
        }
        dragRef.current = {
          mode: 'move',
          pointerId: press.pointerId,
          startX: press.startX,
          startY: press.startY,
          targets,
          spaceBefore: press.spaceBefore,
        }
      }

      const moveCardPress = (event) => {
        const press = cardPressRef.current
        if (!press || press.pointerId !== event.pointerId) return
        if (!press.activated) {
          if (!press.allowDrag) return
          if (Math.abs(event.clientX - press.startX) <= 4 && Math.abs(event.clientY - press.startY) <= 4) return
          activateCardDrag(press)
        }
        moveTurnFrame(event)
      }

      const endCardPress = (event) => {
        const press = cardPressRef.current
        if (!press || press.pointerId !== event.pointerId) return
        if (press.cleanup) press.cleanup()
        cardPressRef.current = null
        if (press.activated) endTurnFrame(event)
      }

      const requestSummary = (turn, kind, branchId) => {
        if (turn.summary || summaryRequestsRef.current.has(turn.id)) return
        summaryRequestsRef.current.add(turn.id)
        fetch(API + '/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: turn.question, answer: turn.answer }),
        })
          .then((response) => response.json())
          .then((body) => {
            const summary = body && body.ok && typeof body.summary === 'string' ? body.summary.trim() : ''
            if (!summary) throw new Error('empty summary')
            updateTurn(kind, branchId, turn.id, { summary })
            setHover((current) => (current && current.turnId === turn.id ? { ...current, loading: false, summary } : current))
            saveSoon(300)
          })
          .catch(() => {
            setHover((current) => (current && current.turnId === turn.id ? { ...current, loading: false, summary: truncate(turn.question, 60) } : current))
          })
          .finally(() => {
            summaryRequestsRef.current.delete(turn.id)
          })
      }

      const showHover = (turn, kind, branchId, event) => {
        setHover({
          turnId: turn.id,
          x: Math.min(event.clientX + 14, Math.max(80, window.innerWidth - 320)),
          y: Math.min(event.clientY + 14, Math.max(80, window.innerHeight - 120)),
          summary: turn.summary || '',
          loading: !turn.summary,
        })
        if (!turn.summary) requestSummary(turn, kind, branchId)
      }

      const hideHover = () => setHover(null)

      const runStream = async ({ kind, branchId, turnId, payload }) => {
        const controller = new AbortController()
        streamsRef.current.set(turnId, controller)
        let answer = ''
        let finished = false
        try {
          const response = await fetch(API + '/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          })
          if (!response.ok) {
            let message = 'HTTP ' + response.status
            try {
              const body = await response.json()
              if (body && body.error) message = body.error
            } catch (_error) {
              // Keep the HTTP status.
            }
            throw new Error(message)
          }
          if (!response.body) throw new Error('当前浏览器不支持流式回答')
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          while (true) {
            const read = await reader.read()
            if (read.done) break
            buffer += decoder.decode(read.value, { stream: true })
            let boundary = buffer.indexOf('\n\n')
            while (boundary >= 0) {
              const frame = buffer.slice(0, boundary)
              buffer = buffer.slice(boundary + 2)
              const line = frame.split('\n').find((item) => item.slice(0, 6) === 'data: ')
              if (line) {
                let event
                try {
                  event = JSON.parse(line.slice(6))
                } catch (_error) {
                  event = null
                }
                if (event && event.type === 'delta' && typeof event.text === 'string') {
                  answer += event.text
                  updateTurn(kind, branchId, turnId, { answer, status: 'streaming' })
                } else if (event && event.type === 'done') {
                  finished = true
                  updateTurn(kind, branchId, turnId, { answer, status: 'completed', usage: event.usage || null, error: '' })
                } else if (event && event.type === 'error') {
                  finished = true
                  updateTurn(kind, branchId, turnId, { answer, status: 'failed', error: event.message || '回答失败' })
                } else if (event && event.type === 'aborted') {
                  finished = true
                  updateTurn(kind, branchId, turnId, { answer, status: 'cancelled' })
                }
              }
              boundary = buffer.indexOf('\n\n')
            }
          }
          if (!finished) {
            updateTurn(kind, branchId, turnId, {
              answer,
              status: answer ? 'completed' : 'failed',
              error: answer ? '' : '连接中断',
            })
          }
        } catch (error) {
          if (error && error.name === 'AbortError') {
            updateTurn(kind, branchId, turnId, { answer, status: 'cancelled' })
          } else {
            updateTurn(kind, branchId, turnId, { answer, status: 'failed', error: error && error.message ? error.message : '请求失败' })
          }
        } finally {
          streamsRef.current.delete(turnId)
          saveSoon(80)
        }
      }

      const centerOn = (worldX, worldY, zoom) => {
        const element = viewportRef.current
        if (!element) return
        const width = element.clientWidth
        const height = element.clientHeight
        const nextZoom = clamp(zoom, MIN_ZOOM, MAX_ZOOM)
        commit((previous) => ({
          ...previous,
          view: {
            zoom: nextZoom,
            x: width / 2 - worldX * nextZoom,
            y: height / 2 - worldY * nextZoom,
          },
        }))
        saveSoon(1000)
      }

      const revealAnchor = (branch) => {
        if (!branch || !branch.anchorTurnId || !branch.anchorText) return
        const current = spaceRef.current
        if (current) {
          const mainTurn = current.main.turns.find((turn) => turn.id === branch.anchorTurnId)
          if (mainTurn) {
            bringToFront(mainTurn, 'main', null)
          } else {
            const sourceBranch = current.branches.find((item) => item.turns.some((turn) => turn.id === branch.anchorTurnId))
            const sourceTurn = sourceBranch && sourceBranch.turns.find((turn) => turn.id === branch.anchorTurnId)
            if (sourceTurn) bringToFront(sourceTurn, 'branch', sourceBranch.id)
          }
        }
        setAnchorReveal({ turnId: branch.anchorTurnId, text: branch.anchorText, nonce: Date.now() })
        focusTurn(branch.anchorTurnId)
      }

      const handleCardClick = (event, turn, kind, branchId) => {
        if (suppressCardClickRef.current) {
          suppressCardClickRef.current = false
          return
        }
        const target = event && event.target
        if (target && target.closest && target.closest('button, input, textarea, a, label, .cs-resize, .cs-grip')) return
        const active = window.getSelection()
        if (active && !active.isCollapsed) return
        if (event && (event.ctrlKey || event.metaKey)) {
          setSelectedIds((previous) => {
            const next = new Set(previous)
            if (next.has(turn.id)) next.delete(turn.id)
            else next.add(turn.id)
            return next
          })
          setSelectedTurn(null)
          return
        }
        if (selectedTurn && selectedTurn.turnId === turn.id) return
        setSelectedIds(new Set([turn.id]))
        setSelectedTurn(null)
      }

      const handleCardDoubleClick = (event, turn, kind, branchId) => {
        const target = event && event.target
        if (target && target.closest && target.closest('button, input, textarea, a, label, .cs-resize, .cs-grip')) return
        if (event && (event.ctrlKey || event.metaKey)) return
        setSelectedIds(new Set([turn.id]))
        setSelectedTurn({ turnId: turn.id, kind, branchId })
        focusTurn(turn.id)
      }

      const focusTurn = (turnId) => {
        const rect = turnRects.get(turnId)
        if (!rect) return
        setSelection(null)
        const zoom = Math.max(0.9, spaceRef.current && spaceRef.current.view ? spaceRef.current.view.zoom : 1)
        centerOn(rect.x + rect.w / 2, rect.y + rect.h / 2, zoom)
        setHighlight(turnId)
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
        highlightTimerRef.current = setTimeout(() => setHighlight(null), 1800)
      }

      const resetView = () => {
        commit((previous) => ({ ...previous, view: { x: 120, y: 120, zoom: 1 } }))
        setSelection(null)
        setHover(null)
        saveSoon(400)
      }

      const fitView = () => {
        const element = viewportRef.current
        if (!element) return
        const width = element.clientWidth
        const height = element.clientHeight
        const current = layout.bounds
        const contentWidth = Math.max(1, current.maxX - current.minX)
        const contentHeight = Math.max(1, current.maxY - current.minY)
        const zoom = clamp(Math.min((width - 120) / contentWidth, (height - 120) / contentHeight, 1), MIN_ZOOM, 1)
        commit((previous) => ({
          ...previous,
          view: {
            zoom,
            x: (width - contentWidth * zoom) / 2 - current.minX * zoom,
            y: (height - contentHeight * zoom) / 2 - current.minY * zoom,
          },
        }))
        setSelection(null)
        setHover(null)
        saveSoon(500)
      }

      const focusMainLine = () => {
        const element = viewportRef.current
        if (!element) return
        const width = element.clientWidth
        const height = element.clientHeight
        const rects = mainTurns.map((turn) => turnRects.get(turn.id)).filter(Boolean)
        if (!rects.length) {
          fitView()
          return
        }
        const minX = Math.min(...rects.map((rect) => rect.x))
        const maxX = Math.max(...rects.map((rect) => rect.x + rect.w))
        const minY = Math.min(...rects.map((rect) => rect.y))
        const maxY = Math.max(...rects.map((rect) => rect.y + rect.h))
        const contentWidth = Math.max(1, maxX - minX)
        const contentHeight = Math.max(1, maxY - minY)
        const zoom = clamp(Math.min((width - 180) / contentWidth, (height - 180) / contentHeight, 1), MIN_ZOOM, 1)
        const viewX = layoutMode === 'horizontal'
          ? width / 2 - ((minX + maxX) / 2) * zoom
          : width / 2 - (MAIN_W / 2) * zoom
        const viewY = layoutMode === 'horizontal'
          ? height / 2 - (TOP_PAD + MAIN_H / 2) * zoom
          : height / 2 - ((minY + maxY) / 2) * zoom
        commit((previous) => ({ ...previous, view: { zoom, x: viewX, y: viewY } }))
        setSelection(null)
        setHover(null)
        saveSoon(500)
      }

      fitViewRef.current = focusMainLine

      const toggleLayout = () => {
        const next = layoutMode === 'horizontal' ? 'vertical' : 'horizontal'
        pushHistory()
        commit((previous) => ({
          ...previous,
          layoutMode: next,
          main: { ...previous.main, turns: previous.main.turns.map((turn) => ({ ...turn, layout: null })) },
          branches: previous.branches.map((branch) => ({ ...branch, turns: branch.turns.map((turn) => ({ ...turn, layout: null })) })),
        }))
        setTimeout(() => {
          if (fitViewRef.current) fitViewRef.current()
        }, 80)
        saveSoon(200)
      }

      const zoomBy = (factor) => {
        const element = viewportRef.current
        if (!element) return
        const width = element.clientWidth
        const height = element.clientHeight
        const viewNow = spaceRef.current && spaceRef.current.view ? spaceRef.current.view : view
        const worldX = (width / 2 - viewNow.x) / viewNow.zoom
        const worldY = (height / 2 - viewNow.y) / viewNow.zoom
        const zoom = clamp(viewNow.zoom * factor, MIN_ZOOM, MAX_ZOOM)
        if (zoom < 0.55) setSelection(null)
        if (zoom >= 0.25) setHover(null)
        commit((previous) => ({
          ...previous,
          view: {
            zoom,
            x: width / 2 - worldX * zoom,
            y: height / 2 - worldY * zoom,
          },
        }))
        saveSoon(800)
      }

      const stopTurn = (turnId) => {
        const controller = streamsRef.current.get(turnId)
        if (controller) {
          try {
            controller.abort()
          } catch (_error) {
            // Already closed.
          }
        }
      }

      const startTurn = ({ kind, branch, branchId, question, retryTurnId, branchIndex, skipHistory }) => {
        const targetBranch = kind === 'branch'
          ? (branch || (spaceRef.current ? spaceRef.current.branches.find((item) => item.id === branchId) : null))
          : null
        if (kind === 'branch' && !targetBranch) return
        if (!skipHistory) pushHistory()

        const currentTurns = kind === 'main'
          ? (spaceRef.current ? spaceRef.current.main.turns : mainTurns)
          : targetBranch.turns
        const historyTurns = currentTurns.filter((turn) => (
          turn.id !== retryTurnId && (turn.status === 'completed' || turn.status === 'cancelled')
        ))
        const history = []
        const recent = historyTurns.slice(-20)
        for (const turn of recent) {
          if (turn.question) history.push({ role: 'user', content: turn.question })
          if (turn.answer) history.push({ role: 'assistant', content: turn.answer })
        }

        let anchorText = ''
        let brief = ''
        let mainContext = []
        let anchorIndex = 0
        if (kind === 'branch') {
          anchorText = targetBranch.anchorText
          brief = targetBranch.brief
          const currentSpace = spaceRef.current
          const parentId = targetBranch.parentBranchId
            || (currentSpace ? layout.turnBranch.get(targetBranch.anchorTurnId) : null)
          const parentBranch = parentId && currentSpace
            ? currentSpace.branches.find((item) => item.id === parentId)
            : null
          const parentTurns = parentBranch
            ? parentBranch.turns
            : (currentSpace ? currentSpace.main.turns : mainTurns)
          anchorIndex = Math.max(0, parentTurns.findIndex((turn) => turn.id === targetBranch.anchorTurnId))
          if (historyTurns.length === 0) {
            mainContext = parentTurns
              .slice(Math.max(0, anchorIndex - 5), anchorIndex + 1)
              .filter((turn) => turn.status === 'completed' || turn.status === 'cancelled')
              .map((turn) => ({ question: turn.question, answer: turn.answer }))
          }
        }

        const turnId = retryTurnId || uid('turn')
        if (retryTurnId) {
          updateTurn(kind, targetBranch ? targetBranch.id : null, turnId, {
            answer: '',
            status: 'streaming',
            error: '',
            usage: null,
          })
        } else {
          zCounterRef.current += 1
          const turn = { id: turnId, question, answer: '', status: 'streaming', error: '', createdAt: Date.now(), usage: null, z: zCounterRef.current, todo: false, flag: false }
          if (kind === 'main') {
            commit((previous) => ({
              ...previous,
              main: { ...previous.main, turns: [...previous.main.turns, turn] },
            }))
          } else {
            commit((previous) => ({
              ...previous,
              branches: previous.branches.map((item) => (
                item.id === targetBranch.id ? { ...item, turns: [...item.turns, turn] } : item
              )),
            }))
          }
        }

        const currentSpace = spaceRef.current
        const branchDigest = buildBranchDigest(currentSpace)
        const mainDigest = (currentSpace ? currentSpace.main.turns : mainTurns)
          .slice(-4)
          .map((turn) => ({
            question: stringOf(turn.question).slice(0, 180),
            answer: stringOf(turn.summary || turn.answer).slice(0, 360),
          }))
        const payload = {
          kind,
          branchId: targetBranch ? targetBranch.id : null,
          question,
          history,
          anchorText,
          brief,
          mainContext,
          branchDigest,
          mainDigest,
        }
        runStream({ kind, branchId: targetBranch ? targetBranch.id : null, turnId, payload })

        if (kind === 'main') {
          const index = retryTurnId ? currentTurns.findIndex((turn) => turn.id === retryTurnId) : currentTurns.length
          setTimeout(() => centerOn(
            layoutMode === 'horizontal' ? TOP_PAD + Math.max(0, index) * MAIN_STEP_H + MAIN_W / 2 : MAIN_W / 2,
            layoutMode === 'horizontal' ? TOP_PAD + MAIN_H / 2 : TOP_PAD + Math.max(0, index) * MAIN_STEP_V + MAIN_H / 2,
            Math.max(0.85, view.zoom),
          ), 60)
        } else {
          const position = positions.get(targetBranch.id)
          const turnIndex = retryTurnId ? targetBranch.turns.findIndex((turn) => turn.id === retryTurnId) : targetBranch.turns.length
          if (position) {
            setTimeout(() => centerOn(position.x + CARD_W / 2, position.y + Math.max(0, turnIndex) * TURN_STEP + CARD_H / 2, Math.max(0.85, view.zoom)), 60)
          }
        }
      }

      const retryTurn = (kind, branchId, turnId) => {
        const current = spaceRef.current
        if (!current) return
        if (kind === 'main') {
          const turn = current.main.turns.find((item) => item.id === turnId)
          if (!turn) return
          startTurn({ kind, question: turn.question, retryTurnId: turnId })
        } else {
          const branch = current.branches.find((item) => item.id === branchId)
          if (!branch) return
          const turn = branch.turns.find((item) => item.id === turnId)
          if (!turn) return
          startTurn({ kind, branch, branchId, question: turn.question, retryTurnId: turnId })
        }
      }

      const deleteTurn = (kind, branchId, turnId) => {
        const snapshot = spaceRef.current
        if (!snapshot) return
        const removedTurns = new Set([turnId])
        const removedBranches = new Set()
        if (kind === 'branch') {
          const branch = snapshot.branches.find((item) => item.id === branchId)
          if (!branch) return
          if (branch.turns.filter((turn) => turn.id !== turnId).length === 0) removedBranches.add(branch.id)
        }
        let changed = true
        while (changed) {
          changed = false
          for (const branch of snapshot.branches) {
            if (removedBranches.has(branch.id)) {
              for (const turn of branch.turns) removedTurns.add(turn.id)
              continue
            }
            const parentRemoved = branch.parentBranchId && removedBranches.has(branch.parentBranchId)
            const anchorRemoved = removedTurns.has(branch.anchorTurnId)
            if (parentRemoved || anchorRemoved) {
              removedBranches.add(branch.id)
              changed = true
              for (const turn of branch.turns) removedTurns.add(turn.id)
            }
          }
        }
        if (removedBranches.size > 0) {
          const message = kind === 'main' ? t('confirmDeleteMain') : t('confirmDeleteBranch')
          if (!window.confirm(message)) return
        }
        pushHistory(snapshot)
        if (selectedTurn && removedTurns.has(selectedTurn.turnId)) setSelectedTurn(null)
        setSelectedIds((previous) => new Set([...previous].filter((id) => !removedTurns.has(id))))
        for (const id of removedTurns) stopTurn(id)
        let next
        if (kind === 'main') {
          next = {
            ...snapshot,
            main: { ...snapshot.main, turns: snapshot.main.turns.filter((turn) => turn.id !== turnId) },
            branches: snapshot.branches.filter((branch) => !removedBranches.has(branch.id)),
          }
        } else {
          const branch = snapshot.branches.find((item) => item.id === branchId)
          if (!branch) return
          const turns = branch.turns.filter((turn) => turn.id !== turnId)
          const nextBranches = snapshot.branches
            .filter((item) => !removedBranches.has(item.id) || item.id === branchId)
            .map((item) => (item.id === branchId ? { ...item, turns } : item))
            .filter((item) => item.id !== branchId || turns.length > 0)
          next = { ...snapshot, branches: nextBranches }
        }
        commit(() => next)
        setToast({
          text: t('deleted'),
          undo: () => {
            commit(() => snapshot)
            setToast(null)
            saveSoon(50)
          },
        })
        saveSoon(50)
      }

      const editBranchBrief = (branchId, brief) => {
        commit((previous) => ({
          ...previous,
          branches: previous.branches.map((branch) => (branch.id === branchId ? { ...branch, brief } : branch)),
        }))
        saveSoon(900)
      }

      const openDraftFor = (turnId, text, parentBranchId, anchorSource) => {
        if (!text || !text.trim()) return
        setDraft({
          anchorTurnId: turnId,
          anchorText: text,
          anchorSource: anchorSource || 'selection',
          parentBranchId: parentBranchId || null,
          question: '',
          brief: '',
        })
        setSelection(null)
      }

      const openBranchDraft = () => {
        if (!selection) return
        openDraftFor(selection.turnId, selection.text, selection.branchId)
      }

      const submitDraft = () => {
        if (!draft) return
        const question = draft.question.trim()
        if (!question) return
        const current = spaceRef.current
        if (!current) return
        const branch = {
          id: uid('branch'),
          anchorTurnId: draft.anchorTurnId,
          anchorText: draft.anchorText,
          anchorSource: draft.anchorSource || 'selection',
          parentBranchId: draft.parentBranchId || null,
          colorIndex: nextColorIndex(current.branches),
          brief: draft.brief.trim(),
          createdAt: Date.now(),
          turns: [],
        }
        pushHistory()
        commit((previous) => ({ ...previous, branches: [...previous.branches, branch] }))
        setDraft(null)
        startTurn({ kind: 'branch', branch, branchId: branch.id, question, skipHistory: true })
      }

      const handleSelection = (info) => {
        if (!info || !info.text || !info.text.trim()) return
        setSelection({
          ...info,
          x: clamp(info.x, 80, Math.max(80, window.innerWidth - 80)),
          y: Math.max(64, info.y),
        })
      }

      const collectMarqueeHits = (box) => {
        if (!box) return []
        const viewport = viewportRef.current
        const current = spaceRef.current
        if (!viewport || !current) return []
        const vr = viewport.getBoundingClientRect()
        const currentView = current.view || { x: 120, y: 120, zoom: 1 }
        const left = box.left
        const right = box.left + box.width
        const top = box.top
        const bottom = box.top + box.height
        const hits = []
        const dotMode = currentView.zoom < 0.25
        const consider = (turn, isMain) => {
          const rect = turnRects.get(turn.id)
          if (!rect) return
          const centerX = vr.left + currentView.x + (rect.x + rect.w / 2) * currentView.zoom
          const centerY = vr.top + currentView.y + (rect.y + rect.h / 2) * currentView.zoom
          const size = dotMode ? (isMain ? 24 : 15) : 0
          const sx = dotMode ? centerX - size / 2 : vr.left + currentView.x + rect.x * currentView.zoom
          const sy = dotMode ? centerY - size / 2 : vr.top + currentView.y + rect.y * currentView.zoom
          const sw = dotMode ? size : rect.w * currentView.zoom
          const sh = dotMode ? size : rect.h * currentView.zoom
          if (sx + sw >= left && sx <= right && sy + sh >= top && sy <= bottom) hits.push(turn.id)
        }
        current.main.turns.forEach((turn) => consider(turn, true))
        current.branches.forEach((branch) => branch.turns.forEach((turn) => consider(turn, false)))
        return hits
      }
      const onPointerDown = (event) => {
        const target = event.target
        if (target && target.closest && target.closest('.cs-card, .cs-composer, .cs-modal, .cs-modal-backdrop, .cs-toast, .cs-sel-toolbar, .cs-zoom, button, textarea, input, a')) return
        if (event.button === 0) {
          event.preventDefault()
          setSelection(null)
          setSelectedTurn(null)
          const additive = Boolean(event.ctrlKey || event.metaKey || event.shiftKey)
          if (!additive) setSelectedIds(new Set())
          marqueeRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            box: null,
            additive,
            active: false,
          }
          try {
            event.currentTarget.setPointerCapture(event.pointerId)
          } catch (_error) {
            // Pointer capture is best effort.
          }
          return
        }
        if (event.button !== 1) return
        event.preventDefault()
        setSelection(null)
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch (_error) {
          // Pointer capture is best effort.
        }
        const current = spaceRef.current && spaceRef.current.view ? spaceRef.current.view : view
        panRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          x: current.x,
          y: current.y,
        }
      }

      const onPointerMove = (event) => {
        const marquee = marqueeRef.current
        if (marquee && marquee.pointerId === event.pointerId) {
          const dx = event.clientX - marquee.startX
          const dy = event.clientY - marquee.startY
          if (!marquee.active && Math.abs(dx) <= 3 && Math.abs(dy) <= 3) return
          marquee.active = true
          const left = Math.min(marquee.startX, event.clientX)
          const top = Math.min(marquee.startY, event.clientY)
          const width = Math.abs(dx)
          const height = Math.abs(dy)
          marquee.box = { left, top, width, height }
          setMarquee({ left, top, width, height })
          return
        }
        const pan = panRef.current
        if (!pan || pan.pointerId !== event.pointerId) return
        const dx = event.clientX - pan.startX
        const dy = event.clientY - pan.startY
        commit((previous) => ({
          ...previous,
          view: { ...previous.view, x: pan.x + dx, y: pan.y + dy },
        }))
      }

      const endPan = (event) => {
        const marquee = marqueeRef.current
        if (marquee && marquee.pointerId === event.pointerId) {
          marqueeRef.current = null
          setMarquee(null)
          try {
            event.currentTarget.releasePointerCapture(event.pointerId)
          } catch (_error) {
            // Already released.
          }
          if (marquee.active) {
            const hits = collectMarqueeHits(marquee.box)
            setSelectedTurn(null)
            if (marquee.additive) {
              setSelectedIds((previous) => new Set([...previous, ...hits]))
            } else {
              setSelectedIds(new Set(hits))
            }
          } else if (!marquee.additive) {
            setSelectedIds(new Set())
          }
          return
        }
        if (!panRef.current) return
        panRef.current = null
        try {
          event.currentTarget.releasePointerCapture(event.pointerId)
        } catch (_error) {
          // Already released.
        }
        saveSoon(300)
      }

      const curveBetween = (a, b) => {
        const ax = a.x + a.w / 2
        const ay = a.y + a.h / 2
        const bx = b.x + b.w / 2
        const by = b.y + b.h / 2
        return `M ${ax} ${ay} C ${ax} ${ay + (by - ay) / 2}, ${bx} ${ay + (by - ay) / 2}, ${bx} ${by}`
      }

      const renderLinks = () => {
        const paths = []
        const allCardRects = [...turnRects.entries()].map(([id, rect]) => ({ id, ...rect }))
        const mainRects = mainTurns.map((turn) => turnRects.get(turn.id)).filter(Boolean)
        for (let index = 1; index < mainRects.length; index += 1) {
          paths.push(h('path', {
            key: 'main-' + index,
            className: 'cs-link-main',
            style: { stroke: MAIN_COLOR },
            d: curvePorts(
              mainRects[index - 1],
              layoutMode === 'horizontal' ? 'right' : 'bottom',
              mainRects[index],
              layoutMode === 'horizontal' ? 'left' : 'top'
            ),
          }))
        }
        for (const position of branchPositions) {
          const branch = position.branch
          const anchor = turnRects.get(branch.anchorTurnId)
          const first = branch.turns.length > 0 ? turnRects.get(branch.turns[0].id) : null
          if (anchor && first) {
            const side = position.side || 'left'
            const anchorSide = side === 'left' ? 'right' : side === 'right' ? 'left' : side === 'top' ? 'bottom' : 'top'
            const a = sidePoint(anchor, anchorSide)
            const b = sidePoint(first, side)
            const d = curvePorts(anchor, anchorSide, first, side)
            paths.push(h('path', {
              key: 'edge-' + branch.id,
              className: 'cs-link-branch',
              style: { stroke: position.color },
              d,
            }))
          }
          for (let index = 1; index < branch.turns.length; index += 1) {
            const a = turnRects.get(branch.turns[index - 1].id)
            const b = turnRects.get(branch.turns[index].id)
            if (!a || !b) continue
            paths.push(h('path', {
              key: 'spine-' + branch.id + '-' + index,
              className: 'cs-link-branch-spine',
              style: { stroke: position.color },
              d: curvePorts(a, 'bottom', b, 'top'),
            }))
          }
        }
        return h('svg', {
          className: 'cs-links',
          width: bounds.width,
          height: bounds.height,
          viewBox: `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`,
          style: { left: bounds.minX, top: bounds.minY },
          'aria-hidden': true,
        }, paths)
      }

      const renderMain = () => {
        const nodes = []
        if (mainTurns.length === 0) {
          nodes.push(h('div', { key: 'welcome', className: 'cs-node cs-welcome-node', style: { left: layoutMode === 'horizontal' ? TOP_PAD : 0, top: TOP_PAD } },
            h('div', { className: 'cs-card cs-card-welcome' },
              h('div', { className: 'cs-welcome-tag' }, t('welcome')),
              h('div', { className: 'cs-welcome-title' }, t('emptyTitle')),
              h('div', { className: 'cs-welcome-body' }, t('emptyBody'))
            )
          ))
        }
        mainTurns.forEach((turn, index) => {
          const rect = turnRects.get(turn.id)
          if (!rect) return
          const baseX = layoutMode === 'horizontal' ? TOP_PAD + index * MAIN_STEP_H : 0
          const baseY = layoutMode === 'horizontal' ? TOP_PAD : TOP_PAD + index * MAIN_STEP_V
          nodes.push(h('div', {
            key: turn.id,
            className: cx('cs-node', focusIds.has(turn.id) ? 'cs-focus-card' : ''),
            style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: turn.z || 0 },
          }, [
            detail === 'dot'
            ? h(Dot, {
                key: 'card',
                kind: 'main',
                flagged: Boolean(turn.flag),
                zoom: view.zoom,
                label: turn.summary || truncate(turn.question, 80),
                color: MAIN_COLOR,
                onClick: () => {
                  if (suppressDotClickRef.current) {
                    suppressDotClickRef.current = false
                    return
                  }
                  focusTurn(turn.id)
                },
                onHover: (event) => showHover(turn, 'main', null, event),
                onLeave: hideHover,
                onPointerDown: (event) => beginDotPress(event, turn, 'main', null, baseX, baseY, rect),
                onPointerMove: moveDotPress,
                onPointerUp: endDotPress,
                onPointerCancel: endDotPress,
              })
            : h(TurnCard, {
                key: 'card',
                t,
                turn,
                kind: 'main',
                branch: null,
                isFirst: false,
                detail,
                highlighted: highlight === turn.id,
                color: MAIN_COLOR,
                onSelection: handleSelection,
                onAskWhole: (item) => openDraftFor(item.id, item.answer, null, 'answer'),
                onDelete: (turnId) => deleteTurn('main', null, turnId),
                onRetry: (turnId) => retryTurn('main', null, turnId),
                onStop: stopTurn,
                onBackToMain: () => {},
                onFocus: () => focusTurn(turn.id),
                onBriefChange: () => {},
                selected: selectedIds.has(turn.id),
                active: Boolean(selectedTurn && selectedTurn.turnId === turn.id),
                side: 'left',
                sequence: 'M' + (index + 1),
                onToggleTodo: (value) => toggleMark(turn, 'main', null, 'todo', value),
                onToggleFlag: (value) => toggleMark(turn, 'main', null, 'flag', value),
                onCardPointerDown: (event) => beginCardPress(event, turn, 'main', null, baseX, baseY, rect),
                onCardPointerMove: moveCardPress,
                onCardPointerUp: endCardPress,
                onCardPointerCancel: endCardPress,
                onCardClick: (event) => handleCardClick(event, turn, 'main', null),
                onCardDoubleClick: (event) => handleCardDoubleClick(event, turn, 'main', null),
                onDragStart: (event) => startTurnDrag(event, turn, 'main', null, baseX, baseY, rect),
                onDragMove: moveTurnFrame,
                onDragEnd: endTurnFrame,
                onResizeStart: (event) => startTurnResize(event, turn, 'main', null, baseX, baseY, rect),
                onResizeMove: moveTurnFrame,
                onResizeEnd: endTurnFrame,
                onBringToFront: () => bringToFront(turn, 'main', null),
              }),
            ...(renderPorts(turn.id, rect, MAIN_COLOR, true) || []),
          ]))
        })
        return nodes
      }

      const renderBranches = () => branchPositions.map((position) => {
        const branch = position.branch
        const nodes = branch.turns.map((turn, index) => {
          const rect = turnRects.get(turn.id)
          if (!rect) return null
          return h('div', {
            key: turn.id,
            className: cx('cs-node', focusIds.has(turn.id) ? 'cs-focus-card' : ''),
            style: { left: rect.x - position.x, top: rect.y - position.y, width: rect.w, height: rect.h, zIndex: turn.z || 0 },
          }, [
            detail === 'dot'
            ? h(Dot, {
                key: 'card',
                kind: 'branch',
                flagged: Boolean(turn.flag),
                zoom: view.zoom,
                label: turn.summary || truncate(turn.question, 80),
                color: position.color,
                onClick: () => {
                  if (suppressDotClickRef.current) {
                    suppressDotClickRef.current = false
                    return
                  }
                  focusTurn(turn.id)
                },
                onHover: (event) => showHover(turn, 'branch', branch.id, event),
                onLeave: hideHover,
                onPointerDown: (event) => beginDotPress(event, turn, 'branch', branch.id, position.x, position.y + index * TURN_STEP, rect),
                onPointerMove: moveDotPress,
                onPointerUp: endDotPress,
                onPointerCancel: endDotPress,
              })
            : h(TurnCard, {
                key: 'card',
                t,
                turn,
                kind: 'branch',
                branch,
                isFirst: index === 0,
                detail,
                highlighted: highlight === turn.id,
                color: position.color,
                onSelection: handleSelection,
                onAskWhole: (item) => openDraftFor(item.id, item.answer, branch.id, 'answer'),
                onDelete: (turnId) => deleteTurn('branch', branch.id, turnId),
                onRetry: (turnId) => retryTurn('branch', branch.id, turnId),
                onStop: stopTurn,
                onBackToMain: () => focusTurn(branch.anchorTurnId),
                onFocus: () => focusTurn(turn.id),
                onBriefChange: (brief) => editBranchBrief(branch.id, brief),
                selected: selectedIds.has(turn.id),
                active: Boolean(selectedTurn && selectedTurn.turnId === turn.id),
                side: position.side,
                sequence: 'B' + (position.index + 1),
                onToggleTodo: (value) => toggleMark(turn, 'branch', branch.id, 'todo', value),
                onToggleFlag: (value) => toggleMark(turn, 'branch', branch.id, 'flag', value),
                onCardPointerDown: (event) => beginCardPress(event, turn, 'branch', branch.id, position.x, position.y + index * TURN_STEP, rect),
                onCardPointerMove: moveCardPress,
                onCardPointerUp: endCardPress,
                onCardPointerCancel: endCardPress,
                onCardClick: (event) => handleCardClick(event, turn, 'branch', branch.id),
                onCardDoubleClick: (event) => handleCardDoubleClick(event, turn, 'branch', branch.id),
                onLocateAnchor: () => revealAnchor(branch),
                onDragStart: (event) => startTurnDrag(event, turn, 'branch', branch.id, position.x, position.y + index * TURN_STEP, rect),
                onDragMove: moveTurnFrame,
                onDragEnd: endTurnFrame,
                onResizeStart: (event) => startTurnResize(event, turn, 'branch', branch.id, position.x, position.y + index * TURN_STEP, rect),
                onResizeMove: moveTurnFrame,
                onResizeEnd: endTurnFrame,
                onBringToFront: () => bringToFront(turn, 'branch', branch.id),
              }),
            ...(renderPorts(turn.id, rect, position.color, false) || []),
          ])
        }).filter(Boolean)
        return h('div', {
          key: branch.id,
          className: 'cs-branch-lane',
          style: { left: position.x, top: position.y },
        }, nodes)
      })

      const renderBottomComposer = () => {
        if (!composerVisible) return null
        const branch = selectedBranch
        return h('div', { className: 'cs-bottom-composer' },
          h('div', { className: 'cs-bottom-label' }, branch ? t('continueBranch') : t('continueMain')),
          h(Composer, {
            t,
            placeholder: branch ? t('branchPlaceholder') : t('mainPlaceholder'),
            busy: composerBusy,
            autoFocus: !selectedTurn && mainTurns.length === 0,
            storageKey: branch ? COMPOSER_PREFIX + 'branch:' + branch.id : COMPOSER_PREFIX + 'main',
            onSend: (question) => {
              if (branch) startTurn({ kind: 'branch', branch, branchId: branch.id, question })
              else startTurn({ kind: 'main', question })
            },
          })
        )
      }

      const renderHover = () => {
        if (!hover) return null
        return h('div', {
          className: 'cs-dot-tip',
          style: { left: hover.x, top: hover.y },
        }, hover.loading ? t('summaryLoading') : (hover.summary || t('noSummary')))
      }

      const renderSelection = () => {
        if (!selection) return null
        return h('div', {
          className: 'cs-sel-toolbar',
          style: { left: selection.x, top: selection.y },
          onMouseDown: (event) => {
            event.preventDefault()
            suppressSelectionClearRef.current = true
            setTimeout(() => {
              suppressSelectionClearRef.current = false
            }, 600)
          },
        },
          h('button', { type: 'button', className: 'cs-sel-btn', onClick: openBranchDraft }, t('followUp'))
        )
      }

      const renderLayers = () => {
        if (!layersOpen) return null
        return h('div', {
          className: 'cs-modal-backdrop',
          style: { zIndex: 3000 },
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) setLayersOpen(false)
          },
        },
          h('div', { className: 'cs-modal', role: 'dialog', 'aria-modal': 'true' },
            h('div', { className: 'cs-modal-title' }, t('layers')),
            h('div', { className: 'cs-layer-list' },
              layerEntries.map((entry) => h('button', {
                key: entry.turn.id,
                type: 'button',
                className: 'cs-layer-row',
                onClick: () => {
                  bringToFront(entry.turn, entry.kind, entry.branchId)
                  setSelectedIds(new Set([entry.turn.id]))
                  setSelectedTurn(null)
                  focusTurn(entry.turn.id)
                  setLayersOpen(false)
                },
              },
                h('span', { className: 'cs-layer-dot', style: { background: entry.color } }),
                h('span', { className: 'cs-layer-tag' }, entry.tag),
                h('span', { className: 'cs-layer-q' }, truncate(entry.turn.question, 90)),
                h('span', { className: 'cs-layer-z' }, 'z ' + finite(entry.turn.z, 0))
              ))
            ),
            h('div', { className: 'cs-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setLayersOpen(false) }, t('close'))
            )
          )
        )
      }

      const renderDraft = () => {
        if (!draft) return null
        return h('div', {
          className: 'cs-modal-backdrop',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) setDraft(null)
          },
          onKeyDown: (event) => {
            if (event.key === 'Escape') setDraft(null)
          },
        },
          h('form', {
            className: 'cs-modal',
            role: 'dialog',
            'aria-modal': 'true',
            onSubmit: (event) => {
              event.preventDefault()
              submitDraft()
            },
          },
            h('div', { className: 'cs-modal-title' }, t('followUpTitle')),
            h('blockquote', { className: 'cs-quote' }, draft.anchorText),
            h('label', { className: 'cs-field' },
              h('span', null, t('followUp')),
              h('textarea', {
                ref: draftQuestionRef,
                className: 'cs-modal-input',
                value: draft.question,
                placeholder: t('questionPlaceholder'),
                required: true,
                onChange: (event) => setDraft({ ...draft, question: event.target.value }),
                onKeyDown: (event) => {
                  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault()
                    submitDraft()
                  }
                },
              })
            ),
            h('label', { className: 'cs-field' },
              h('span', null, t('branchBrief')),
              h('input', {
                className: 'cs-modal-input',
                style: { minHeight: 38 },
                value: draft.brief,
                placeholder: t('branchBriefPlaceholder'),
                onChange: (event) => setDraft({ ...draft, brief: event.target.value }),
              })
            ),
            h('div', { className: 'cs-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setDraft(null) }, t('cancel')),
              h('button', { type: 'submit', className: 'cs-btn cs-btn-primary', disabled: !draft.question.trim() }, t('createBranch'))
            )
          )
        )
      }

      const renderToast = () => {
        if (!toast) return null
        return h('div', { className: 'cs-toast' },
          h('span', null, toast.text),
          toast.undo
            ? h('button', { type: 'button', className: 'cs-toast-btn', onClick: toast.undo }, t('undo'))
            : null
        )
      }

      return h('div', {
        className: cx('cs-root', focusIds.size > 0 ? 'cs-card-focus' : ''),
        ref: rootRef,
      },
        h('style', null, CSS),
        h('div', { className: 'cs-topbar' },
          h('div', { className: 'cs-title-wrap' },
            h('div', { className: 'cs-title' }, t('title')),
            h('div', { className: 'cs-subtitle' }, space ? space.title : t('subtitle'))
          ),
          h('div', { className: 'cs-top-actions' },
            h('span', { className: 'cs-model', title: model ? `${model.provider} / ${model.model}` : '' }, model ? `${t('model')}: ${model.model}` : t('noModel')),
            h('span', { className: cx('cs-save', saveState === 'error' ? 'cs-save-error' : '') },
              saveState === 'saving' ? t('saving') : saveState === 'saved' ? t('saved') : saveState === 'error' ? t('saveError') : ''
            ),
            typeof onBackToLibrary === 'function'
              ? h('button', { type: 'button', className: 'cs-btn', onClick: onBackToLibrary }, t('library'))
              : null,
            h('button', { type: 'button', className: 'cs-btn', disabled: undoCount === 0, onClick: undo }, t('undo')),
            h('button', {
              type: 'button',
              className: cx('cs-layout-switch', layoutMode === 'horizontal' ? 'cs-layout-horizontal' : 'cs-layout-vertical'),
              onClick: toggleLayout,
              title: t('switchLayout'),
            },
              h('span', { className: 'cs-layout-text cs-layout-v' }, t('verticalShort')),
              h('span', { className: 'cs-layout-track' }, h('span', { className: 'cs-layout-knob' })),
              h('span', { className: 'cs-layout-text cs-layout-h' }, t('horizontalShort'))
            ),
            h('button', { type: 'button', className: 'cs-btn', onClick: focusMainLine }, t('focusMain')),
            h('button', { type: 'button', className: 'cs-btn', onClick: () => setLayersOpen(true) }, t('layers')),
            typeof onBackToConversation === 'function'
              ? h('button', { type: 'button', className: 'cs-btn', onClick: onBackToConversation }, t('backToConversation'))
              : null
          )
        ),
        h('div', {
          className: 'cs-viewport',
          ref: viewportRef,
          onPointerDown,
          onPointerMove,
          onPointerUp: endPan,
          onPointerCancel: endPan,
        },
          h('div', {
            className: cx('cs-main-guide', layoutMode === 'horizontal' ? 'cs-main-guide-h' : 'cs-main-guide-v'),
            style: layoutMode === 'horizontal'
              ? { top: view.y + (TOP_PAD + MAIN_H / 2) * view.zoom }
              : { left: view.x + (MAIN_W / 2) * view.zoom },
          }),
          h('div', {
            className: 'cs-world',
            style: {
              width: bounds.width,
              height: bounds.height,
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            },
          },
                        renderLinks(),
            renderMain(),
            renderBranches()
          ),
          marquee ? h('div', {
            className: 'cs-marquee',
            style: { left: marquee.left, top: marquee.top, width: marquee.width, height: marquee.height },
          }) : null,
          renderSelection(),
          renderHover(),
          renderLayers(),
          renderBottomComposer(),
          h('div', { className: 'cs-hintbar' }, detail === 'full' ? t('selectHint') : detail === 'compact' ? t('compactHint') : t('zoomHint')),
          h('div', { className: 'cs-zoom' },
            h('button', { type: 'button', className: 'cs-zoom-btn', 'aria-label': t('zoomIn'), onClick: () => zoomBy(1.2) }, '+'),
            h('button', { type: 'button', className: 'cs-zoom-btn', 'aria-label': t('zoomOut'), onClick: () => zoomBy(1 / 1.2) }, '−'),
            h('span', { className: 'cs-zoom-label' }, Math.round(view.zoom * 100) + '%')
          ),
          renderDraft(),
          renderToast()
        )
      )
    }

    class ChatSpaceBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
        this.reset = this.reset.bind(this)
      }

      static getDerivedStateFromError(error) {
        return { error }
      }

      componentDidCatch(error, info) {
        try {
          console.error('[chat-space] render error', error, info)
        } catch (_error) {
          // Console may be unavailable.
        }
      }

      reset() {
        this.setState({ error: null })
      }

      render() {
        const t = typeof this.props.tr === 'function' ? this.props.tr : (key) => key
        if (this.state.error) {
          return h('div', { className: 'cs-root cs-center' },
            h('style', null, CSS),
            h('div', { className: 'cs-error-screen' },
              h('strong', null, t('renderError')),
              h('span', null, String((this.state.error && this.state.error.message) || this.state.error)),
              h('span', null, t('renderErrorHint')),
              h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: this.reset }, t('retry'))
            )
          )
        }
        return h(ChatSpaceRoot, this.props)
      }
    }

    const ACTIVE_KEY = 'chat-space:active'

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'chat-space: dictionaries')
      const t = ctx.locale.bind(NS)
      const panelInfo = ctx.layout.panelInfo
      const activePanel = () => {
        try {
          return panelInfo.getSnapshot().activePanelId
        } catch (_error) {
          return null
        }
      }

      let clearTimer = null
      const remember = () => {
        const active = activePanel()
        try {
          if (active === PANEL_ID) {
            sessionStorage.setItem(ACTIVE_KEY, '1')
            if (clearTimer) {
              clearTimeout(clearTimer)
              clearTimer = null
            }
          } else if (active !== null) {
            sessionStorage.removeItem(ACTIVE_KEY)
            if (clearTimer) {
              clearTimeout(clearTimer)
              clearTimer = null
            }
          } else {
            if (clearTimer) clearTimeout(clearTimer)
            clearTimer = setTimeout(() => {
              clearTimer = null
              if (activePanel() !== PANEL_ID) {
                try {
                  sessionStorage.removeItem(ACTIVE_KEY)
                } catch (_error) {
                  // Storage may be unavailable.
                }
              }
            }, 900)
          }
        } catch (_error) {
          // Panel memory is best effort.
        }
      }

      ctx.effect(() => {
        const off = panelInfo.subscribe(remember)
        remember()
        return () => {
          off()
          if (clearTimer) {
            clearTimeout(clearTimer)
            clearTimer = null
          }
        }
      }, 'chat-space: panel memory')

      const onBackToConversation = () => {
        try {
          sessionStorage.removeItem(ACTIVE_KEY)
        } catch (_error) {
          // Storage may be unavailable.
        }
        try {
          ctx.layout.selectPanel('conversation')
        } catch (_error) {
          // The conversation panel is not mounted in this composition.
        }
      }

      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        locale: NS,
        inject: () => ({
          tr: t,
          onBackToConversation,
        }),
      }, ChatSpaceBoundary))
      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 20,
        label: () => t('panel'),
        locale: NS,
      }, ChatSpaceIcon))

      // A client bundle reload briefly removes the main-panel entry; the layout
      // then falls back to Conversation. Restore the panel once the entry exists.
      const restore = (attempt) => {
        try {
          if (sessionStorage.getItem(ACTIVE_KEY) !== '1') return
        } catch (_error) {
          return
        }
        try {
          if (activePanel() !== PANEL_ID) ctx.layout.selectPanel(PANEL_ID)
        } catch (_error) {
          if (attempt < 12) setTimeout(() => restore(attempt + 1), 60)
        }
      }
      setTimeout(() => restore(0), 0)
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply,
    }
  },
})
