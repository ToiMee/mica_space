window.__ModuleLoader__.load({
  id: '@local/dsh-chat-space',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo, useRef, useCallback } = React

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
      panel: 'Mica空间',
      library: '空间库',
      backToLibrary: '返回空间库',
      libraryTitle: 'Mica空间',
      librarySubtitle: 'Mica Space - 让一个话题长成可回溯的对话地图',
      newSpace: '新建空间',
      searchSpaces: '搜索空间',
      searchResults: '搜索结果',
      noSearchResults: '没有匹配的空间',
      noSearchResultsHint: '换个关键词，或清空搜索。',
      export: '导出',
      trash: '回收站',
      privacy: '隐私',
      settings: '设置',
      privacySettingsDesc: '数据、模型和附件隐私说明',
      backupSettingsDesc: '本地 git 提交和可选私有 remote',
      importSettingsDesc: '导入整个空间库',
      exportSettingsDesc: '导出整个空间库 JSON',
      recovery: '数据恢复',
      recoveryHint: '这是备份恢复，不是回收站。它会用所选备份覆盖当前数据；恢复前会先把当前文件保存为 .before-restore。只有数据损坏、升级失败或误操作导致打不开时才使用。',
      recoverySettingsDesc: '慎用：从备份覆盖当前数据',
      recoveryFailed: '恢复失败',
      noBackups: '没有找到备份',
      libraryBackup: '空间库备份',
      confirmRestore: '用这个备份覆盖当前数据？当前数据会先复制为 .before-restore。',
      restoreDone: '恢复完成',
      restore: '恢复',
      privacyBody: 'Mica Space 的数据默认保存在当前工作区的 .chat-space 目录。\n\n轻量记忆和本地语义模式不会访问网络。你正常提问时，问题、上下文、附件和抽取出的文件文本会发送给 DSH 当前配置的模型提供商。\n\n附件由 DSH attachment 服务保存；Git 备份只有在你填写 remote 并点击备份时才会 push。插件本身不包含遥测，也不包含作者的 API key。',
      backup: 'Git 备份',
      backupHint: '备份库数据到本地 git；填私有仓库地址后同时 push。附件文件不包含在 git 里。',
      backupRemote: '远程仓库（可选）',
      backupBranch: '分支',
      backupNow: '立即备份',
      backupDone: '备份完成',
      backupPushed: '已 push',
      backupLocalOnly: '仅本地提交',
      backupConfigSaved: '备份配置已保存',
      backupFailed: '备份失败',
      exportLibrary: '导出库',
      importLibrary: '导入库',
      exportFailed: '导出失败',
      importFailed: '导入失败',
      importDone: '导入完成，放在“导入”文件夹里',
      duplicate: '复制',
      copied: '已复制',
      copyQuestion: '复制问题',
      copyAnswer: '复制回答',
      copyBoth: '复制问答',
      contextQuote: '从这里继续追问',
      contextFront: '置于最前',
      trashEmpty: '回收站是空的',
      restore: '恢复',
      deleteForever: '永久删除',
      confirmDeleteForever: '永久删除这个空间？此操作不可撤销。',
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
      createInFolder: '创建在',
      upOneLevel: '上一级',
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
      title: 'Mica空间',
      subtitle: '主线向前，追问向两侧生长',
      main: '主线',
      branch: '分支',
      subBranch: '子分支',
      followUp: '从这里追问',
      quoteFollowUp: '引用追问',
      quotePlaceholder: '针对这段引用继续问…',
      removeQuote: '移除引用',
      continueFollowUp: '继续追问',
      continueMain: '继续主线',
      continueBranch: '继续这条分支',
      locateOriginal: '📌 定位原文',
      wholeAnswer: '整段回答',
      todo: '待追问',
      todoOn: '待追问',
      markTodo: '标记待追问',
      clearTodo: '取消待追问',
      markFlag: '标记红旗',
      clearFlag: '取消红旗',
      copyMarkdown: '复制为 Markdown',
      pendingCount: '{n} 张待追问',
      collapseBranch: '折叠分支',
      expandBranch: '展开分支',
      branchColor: '分支颜色',
      branchTag: '分支标签',
      copySelected: '复制选中的卡片',
      deleteSelected: '删除选中的卡片',
      deleteOne: '只删除这张卡',
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
      toggleLayout: '切换横竖',
      verticalShort: '竖',
      horizontalShort: '横',
      switchLayout: '切换竖向/横向布局',
      layers: '列表',
      memory: '记忆',
      memoryHint: '默认零配置。语义增强使用当前空间内的词语共现向量，不调用外部 API。',
      memoryLexical: '轻量（默认）',
      memoryLexicalHint: '关键词 + 字符 n-gram 哈希向量；零配置、最快。',
      memorySemantic: '本地语义增强',
      memorySemanticHint: '在当前空间的词共现上构建语义向量；零配置、无需 embedding API。',
      summaryFrequency: '自动摘要频率',
      summaryEvery: '每轮',
      summaryEvery3: '每 3 轮',
      summaryOff: '关闭',
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
      attachFile: '上传图片/文件',
      uploading: '上传中…',
      uploadFailed: '上传失败',
      fileTooLarge: '文件太大（最大 20MB）',
      attachmentLimit: '最多 6 个附件',
      attachmentQuestion: '请查看附件',
      removeAttachment: '移除附件',
      attachments: '个附件',
      sending: '正在回答…',
      thinking: '正在思考…',
      loading: '正在打开 Mica空间…',
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
      renderError: 'Mica空间出错了',
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
      panel: 'Mica Space',
      library: 'Library',
      backToLibrary: 'Back to library',
      libraryTitle: 'Mica Space',
      librarySubtitle: 'Mica Space - Grow a topic into a traceable conversation map',
      newSpace: 'New space',
      searchSpaces: 'Search spaces',
      searchResults: 'Search results',
      noSearchResults: 'No matching spaces',
      noSearchResultsHint: 'Try another keyword or clear the search.',
      export: 'Export',
      trash: 'Trash',
      privacy: 'Privacy',
      settings: 'Settings',
      privacySettingsDesc: 'Data, model, and attachment privacy',
      backupSettingsDesc: 'Local git commit and optional private remote',
      importSettingsDesc: 'Import the whole library',
      exportSettingsDesc: 'Export the whole library as JSON',
      recovery: 'Recovery',
      recoveryHint: 'This restores an old snapshot, not the trash. It overwrites current data with the selected backup; the current file is copied to .before-restore first. Use it only when data is corrupted, an upgrade failed, or the app cannot open.',
      recoverySettingsDesc: 'Advanced: overwrite current data from a backup',
      recoveryFailed: 'Recovery failed',
      noBackups: 'No backups found',
      libraryBackup: 'Library backup',
      confirmRestore: 'Overwrite current data with this backup? Current data will be copied to .before-restore first.',
      restoreDone: 'Restore complete',
      restore: 'Restore',
      privacyBody: 'Mica Space stores data in .chat-space under the current workspace.\n\nLightweight and local semantic memory do not use the network. When you ask, the question, context, attachments, and extracted file text are sent to the model provider configured in DSH.\n\nAttachments are stored by the DSH attachment service. Git backup pushes only when you configure a remote and click backup. The plugin contains no telemetry and no author API key.',
      backup: 'Git backup',
      backupHint: 'Commit library data to a local git repo; set a private remote to push. Attachments are not included.',
      backupRemote: 'Remote repository (optional)',
      backupBranch: 'Branch',
      backupNow: 'Backup now',
      backupDone: 'Backup complete',
      backupPushed: 'pushed',
      backupLocalOnly: 'local commit only',
      backupConfigSaved: 'Backup config saved',
      backupFailed: 'Backup failed',
      exportLibrary: 'Export library',
      importLibrary: 'Import library',
      exportFailed: 'Export failed',
      importFailed: 'Import failed',
      importDone: 'Imported into the Import folder',
      duplicate: 'Duplicate',
      copied: 'Copied',
      copyQuestion: 'Copy question',
      copyAnswer: 'Copy answer',
      copyBoth: 'Copy Q&A',
      contextQuote: 'Continue from this answer',
      contextFront: 'Bring to front',
      trashEmpty: 'Trash is empty',
      restore: 'Restore',
      deleteForever: 'Delete forever',
      confirmDeleteForever: 'Delete this space forever? This cannot be undone.',
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
      createInFolder: 'Create in',
      upOneLevel: 'Up one level',
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
      title: 'Mica Space',
      subtitle: 'A main line that continues, branches that grow sideways',
      main: 'Main',
      branch: 'Branch',
      subBranch: 'Sub-branch',
      followUp: 'Ask from here',
      quoteFollowUp: 'Ask with quote',
      quotePlaceholder: 'Continue with this quote…',
      removeQuote: 'Remove quote',
      continueFollowUp: 'Continue asking',
      continueMain: 'Continue main line',
      continueBranch: 'Continue this branch',
      locateOriginal: '📌 Locate original',
      wholeAnswer: 'Whole answer',
      todo: 'Follow-up',
      todoOn: 'Follow-up',
      markTodo: 'Mark follow-up',
      clearTodo: 'Clear follow-up',
      markFlag: 'Mark red flag',
      clearFlag: 'Clear red flag',
      copyMarkdown: 'Copy as Markdown',
      pendingCount: '{n} pending follow-ups',
      collapseBranch: 'Collapse branch',
      expandBranch: 'Expand branch',
      branchColor: 'Branch color',
      branchTag: 'Branch tag',
      copySelected: 'Copy selected',
      deleteSelected: 'Delete selected',
      deleteOne: 'Delete this card only',
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
      toggleLayout: 'Toggle layout',
      verticalShort: 'V',
      horizontalShort: 'H',
      switchLayout: 'Switch layout direction',
      layers: 'List',
      memory: 'Memory',
      memoryHint: 'Zero-config by default. Semantic mode uses local co-occurrence vectors, with no external embedding API.',
      memoryLexical: 'Lightweight (default)',
      memoryLexicalHint: 'Keywords plus character n-gram hashing; zero config and fastest.',
      memorySemantic: 'Local semantic',
      memorySemanticHint: 'Builds distributional vectors from term co-occurrence inside this space; no API.',
      summaryFrequency: 'Auto summary',
      summaryEvery: 'Every turn',
      summaryEvery3: 'Every 3 turns',
      summaryOff: 'Off',
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
      attachFile: 'Upload image/file',
      uploading: 'Uploading…',
      uploadFailed: 'Upload failed',
      fileTooLarge: 'File too large (max 20 MB)',
      attachmentLimit: 'Up to 6 attachments',
      attachmentQuestion: 'Please look at the attachment',
      removeAttachment: 'Remove attachment',
      attachments: 'attachments',
      sending: 'Answering…',
      thinking: 'Thinking…',
      loading: 'Opening Mica Space…',
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
      renderError: 'Mica Space hit an error',
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
.cs-title-brand { min-width: 0; display: flex; align-items: center; gap: 10px; }
.cs-logo-mark { flex-shrink: 0; display: block; background: transparent; object-fit: contain; filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .22)); }
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
.cs-composer-dragging { outline: 2px dashed var(--cs-accent); outline-offset: -4px; background: color-mix(in srgb, var(--cs-accent) 8%, var(--cs-panel)); }
.cs-composer { height: auto; }
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
.cs-composer-quote { display: flex; align-items: flex-start; gap: 8px; padding: 7px 9px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); color: var(--cs-muted); font-size: 12px; line-height: 1.55; }
.cs-quote-line { flex-shrink: 0; width: 3px; align-self: stretch; border-radius: 2px; background: var(--cs-accent); }
.cs-composer-quote-text { flex: 1; min-width: 0; max-height: 52px; overflow: hidden; white-space: pre-wrap; overflow-wrap: anywhere; }
.cs-composer-quote-remove { flex-shrink: 0; width: 18px; height: 18px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--cs-muted); cursor: pointer; font-size: 13px; line-height: 18px; }
.cs-composer-quote-remove:hover { background: var(--cs-hover); color: var(--cs-text); }
.cs-composer { width: 100%; display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid var(--cs-border); border-radius: var(--cs-radius); background: var(--cs-panel); box-shadow: var(--cs-shadow); }
.cs-input { width: 100%; min-height: 64px; max-height: 180px; resize: vertical; overscroll-behavior: contain; border: none; outline: none; background: transparent; color: var(--cs-text); font: inherit; font-size: 13px; line-height: 1.6; }
.cs-input::placeholder { color: var(--cs-muted); }
.cs-composer-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.cs-add-btn { flex-shrink: 0; width: 30px; height: 30px; padding: 0; border: 1px solid var(--cs-border); border-radius: 50%; background: var(--cs-bg); color: var(--cs-muted); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.cs-add-btn:hover { background: var(--cs-hover); color: var(--cs-text); border-color: var(--cs-border-strong); }
.cs-add-btn:disabled { opacity: .55; cursor: default; }
.cs-add-icon { display: block; font-size: 20px; font-weight: 300; line-height: 1; transform: translateY(-1px); }
.cs-composer-attachments { display: flex; flex-wrap: wrap; gap: 6px; max-height: 84px; overflow: auto; }
.cs-composer-attachment { display: inline-flex; align-items: center; gap: 5px; max-width: 210px; padding: 3px 5px; border: 1px solid var(--cs-border); border-radius: 7px; background: var(--cs-bg); }
.cs-composer-attachment img { width: 38px; height: 38px; object-fit: cover; border-radius: 5px; display: block; }
.cs-composer-file-icon { flex-shrink: 0; font-size: 18px; }
.cs-composer-attachment-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--cs-muted); }
.cs-composer-remove { flex-shrink: 0; width: 18px; height: 18px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--cs-muted); cursor: pointer; font-size: 13px; line-height: 18px; }
.cs-composer-remove:hover { background: var(--cs-hover); color: var(--cs-text); }
.cs-upload-error { color: #d9534f; font-size: 11px; line-height: 1.4; }
.cs-attachments { flex-shrink: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.cs-attachment-image { display: block; width: 88px; height: 88px; overflow: hidden; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); }
.cs-attachment-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cs-attachment-missing::after { content: '附件不可用'; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 4px; color: var(--cs-muted); font-size: 10px; text-align: center; }
.cs-attachment-file { display: inline-flex; align-items: center; gap: 6px; max-width: 260px; padding: 6px 8px; border: 1px solid var(--cs-border); border-radius: 7px; background: var(--cs-bg); color: var(--cs-text); text-decoration: none; font-size: 11px; }
.cs-attachment-file:hover { border-color: var(--cs-accent); }
.cs-attachment-icon { flex-shrink: 0; font-size: 14px; }
.cs-attachment-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-attachment-size { flex-shrink: 0; color: var(--cs-muted); }
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
.cs-node > .cs-dot-wrap { position: absolute; inset: 0; opacity: 0; transform: scale(.62); pointer-events: none; transition: opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1); }
.cs-node > .cs-card { position: absolute; inset: 0; opacity: 1; transform: scale(1); pointer-events: auto; transition: opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1); }
.cs-detail-dot > .cs-dot-wrap { opacity: 1; transform: scale(1); pointer-events: auto; }
.cs-detail-dot > .cs-card { opacity: 0; transform: scale(.94); pointer-events: none; }
.cs-detail-full > .cs-dot-wrap { opacity: 0; transform: scale(.62); pointer-events: none; }
.cs-detail-full > .cs-card { opacity: 1; transform: scale(1); pointer-events: auto; }
.cs-dot-wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.cs-dot-ring { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 2px solid; border-radius: 50%; pointer-events: none; box-shadow: 0 0 8px color-mix(in srgb, currentColor 35%, transparent); }
.cs-dot-badge { position: absolute; display: flex; align-items: center; justify-content: center; border-style: solid; border-radius: 50%; font-weight: 800; line-height: 1; pointer-events: none; z-index: 4; box-shadow: 0 2px 8px rgba(0,0,0,.45); }
.cs-dot-badge-flag { background: #e5484d; color: #fff; border-color: #ffe1e1; }
.cs-dot-badge-pending { background: #ffd23f; color: #241d0c; border-color: #fff6c9; box-shadow: 0 0 0 3px rgba(255,210,63,.22), 0 2px 8px rgba(0,0,0,.45); }
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
.cs-lib-search { width: 180px; height: 30px; box-sizing: border-box; padding: 0 9px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); color: var(--cs-text); font: inherit; font-size: 12px; outline: none; }
.cs-lib-search:focus { border-color: var(--cs-accent); }
.cs-lib-body { flex: 1; min-height: 0; display: flex; }
.cs-lib-side { width: 230px; flex-shrink: 0; padding: 12px 8px; border-right: 1px solid var(--cs-border); overflow: auto; }
.cs-lib-side-title { padding: 0 10px 8px; color: var(--cs-muted); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
.cs-lib-folder { display: flex; align-items: center; gap: 6px; min-height: 30px; padding: 5px 8px; border-radius: 7px; color: var(--cs-text); cursor: pointer; font-size: 13px; }
.cs-lib-folder:hover { background: var(--cs-hover); }
.cs-lib-folder.cs-drop-over { background: color-mix(in srgb, var(--cs-accent) 14%, transparent); outline: 1px dashed var(--cs-accent); outline-offset: -1px; }
.cs-lib-folder-active { background: color-mix(in srgb, var(--cs-accent) 12%, transparent); color: var(--cs-accent); }
.cs-lib-folder-icon { flex-shrink: 0; width: 14px; height: 14px; color: var(--cs-muted); display: inline-flex; align-items: center; justify-content: center; }
.cs-lib-back { display: inline-flex; align-items: center; align-self: flex-start; margin-bottom: 5px; padding: 2px 6px; border: 1px solid var(--cs-border); border-radius: 6px; background: var(--cs-bg); color: var(--cs-muted); cursor: pointer; font: inherit; font-size: 11px; }
.cs-lib-back:hover { color: var(--cs-text); border-color: var(--cs-border-strong); }
.cs-lib-main-title-wrap { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
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
.cs-lib-main-actions { display: flex; align-items: center; gap: 8px; }
.cs-lib-main-title { font-size: 17px; font-weight: 600; }
.cs-lib-main-sub { margin-top: 3px; color: var(--cs-muted); font-size: 12px; }
.cs-lib-subfolders { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin-bottom: 12px; }
.cs-lib-subfolder { display: flex; align-items: center; gap: 8px; min-height: 38px; padding: 8px 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-panel); color: var(--cs-text); cursor: pointer; font: inherit; font-size: 12px; text-align: left; }
.cs-lib-subfolder:hover { border-color: var(--cs-accent); }
.cs-lib-subfolder-icon { flex-shrink: 0; color: var(--cs-muted); }
.cs-lib-subfolder-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-lib-subfolder-count { flex-shrink: 0; color: var(--cs-muted); font-size: 11px; }
.cs-lib-fixed-parent { padding: 7px 9px; border: 1px solid var(--cs-border); border-radius: 7px; background: var(--cs-bg); color: var(--cs-muted); font-size: 12px; }
.cs-lib-spaces { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.cs-lib-space-card { display: flex; flex-direction: column; gap: 9px; min-height: 154px; padding: 13px; border: 1px solid var(--cs-border); border-radius: 10px; background: var(--cs-panel); box-shadow: 0 1px 2px rgba(0,0,0,.03); cursor: pointer; transition: border-color .15s ease, transform .15s ease, box-shadow .15s ease; }
.cs-lib-space-card:hover { border-color: color-mix(in srgb, var(--cs-accent) 55%, var(--cs-border)); box-shadow: var(--cs-shadow); transform: translateY(-1px); }
.cs-lib-space-card[draggable="true"] { cursor: grab; }
.cs-lib-space-card[draggable="true"]:active { cursor: grabbing; }
.cs-lib-space-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.cs-lib-space-title { min-width: 0; display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; }
.cs-lib-space-title-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-space-icon { flex-shrink: 0; color: var(--cs-muted); }
.cs-folder-icon { flex-shrink: 0; }
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
.cs-lib-trash-modal { width: min(620px, calc(100vw - 48px)); }
.cs-backup-modal { width: min(520px, calc(100vw - 48px)); }
.cs-privacy-modal { width: min(620px, calc(100vw - 48px)); }
.cs-settings-modal { width: min(560px, calc(100vw - 48px)); }
.cs-settings-list { display: flex; flex-direction: column; gap: 5px; }
.cs-settings-row { display: flex; flex-direction: column; gap: 3px; width: 100%; padding: 10px 12px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); color: var(--cs-text); font: inherit; text-align: left; cursor: pointer; }
.cs-settings-row:hover { border-color: var(--cs-accent); }
.cs-settings-label { font-size: 12px; font-weight: 600; }
.cs-settings-desc { color: var(--cs-muted); font-size: 10px; }
.cs-settings-divider { height: 1px; margin: 5px 4px; background: var(--cs-border); }
.cs-recovery-modal { width: min(640px, calc(100vw - 48px)); }
.cs-recovery-note { padding: 9px 10px; border: 1px solid color-mix(in srgb, #e8b84a 45%, var(--cs-border)); border-radius: 8px; background: color-mix(in srgb, #e8b84a 10%, var(--cs-bg)); color: var(--cs-text); font-size: 11px; line-height: 1.6; }
.cs-recovery-list { display: flex; flex-direction: column; gap: 6px; max-height: min(420px, calc(100vh - 260px)); overflow: auto; }
.cs-recovery-row { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); }
.cs-recovery-info { flex: 1; min-width: 0; }
.cs-recovery-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 600; }
.cs-recovery-meta { margin-top: 2px; color: var(--cs-muted); font-size: 10px; }
.cs-privacy-body { max-height: min(420px, calc(100vh - 260px)); overflow: auto; color: var(--cs-muted); font-size: 12px; line-height: 1.7; }
.cs-privacy-body p { margin: 0 0 10px; }
.cs-backup-note { margin-top: 4px; color: var(--cs-muted); font-size: 11px; line-height: 1.6; }
.cs-backup-field { display: flex; flex-direction: column; gap: 5px; color: var(--cs-muted); font-size: 11px; }
.cs-backup-result { max-height: 120px; overflow: auto; white-space: pre-wrap; padding: 8px 9px; border: 1px solid var(--cs-border); border-radius: 7px; background: var(--cs-bg); color: var(--cs-text); font-size: 11px; }
.cs-lib-trash-list { display: flex; flex-direction: column; gap: 6px; max-height: min(420px, calc(100vh - 260px)); overflow: auto; }
.cs-lib-trash-row { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: var(--cs-bg); }
.cs-lib-trash-info { flex: 1; min-width: 0; }
.cs-lib-trash-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 600; }
.cs-lib-trash-meta { margin-top: 2px; color: var(--cs-muted); font-size: 11px; }
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
.cs-todo { position: relative; display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: transparent; color: var(--cs-muted); font: inherit; font-size: 10px; cursor: pointer; }
.cs-todo-text { color: var(--cs-accent); font-size: 9px; }
.cs-todo input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.cs-todo-box { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border: 1.5px solid var(--cs-border-strong); border-radius: 3px; color: #fff; font-size: 10px; line-height: 1; }
.cs-todo-on .cs-todo-box { background: #e8b84a; border-color: #e8b84a; color: #1d1a12; font-weight: 800; }
.cs-todo-on .cs-todo-text { color: #e8b84a; }
.cs-pending-layer { position: absolute; inset: 0; z-index: 7; pointer-events: none; }
.cs-pending-marker { position: absolute; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; padding: 0; border: 2px solid #fff3c4; border-radius: 50%; background: #e8b84a; color: #241d0c; box-shadow: 0 0 0 3px rgba(232,184,74,.22), 0 7px 18px rgba(0,0,0,.35); transform: translate(-50%,-50%); font: inherit; font-size: 14px; font-weight: 800; cursor: pointer; pointer-events: auto; animation: cs-pending-pulse 1.8s ease-in-out infinite; }
.cs-pending-marker:hover { transform: translate(-50%,-50%) scale(1.12); }
.cs-pending-count { position: absolute; top: -6px; right: -6px; min-width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; padding: 0 3px; border-radius: 8px; background: #1d1a12; color: #ffe7a3; font-size: 9px; font-weight: 700; }
@keyframes cs-pending-pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(232,184,74,.22), 0 7px 18px rgba(0,0,0,.35); } 50% { box-shadow: 0 0 0 7px rgba(232,184,74,.10), 0 7px 18px rgba(0,0,0,.35); } }
.cs-flag { padding: 0 2px; border: 0; background: transparent; color: var(--cs-muted); font-size: 14px; line-height: 1; cursor: pointer; }
.cs-flag-on { color: #e5484d; }
.cs-layer-list { display: flex; flex-direction: column; gap: 4px; max-height: min(520px, calc(100vh - 220px)); overflow: auto; }
.cs-context-layer { position: fixed; inset: 0; z-index: 4200; }
.cs-context-menu { position: fixed; min-width: 190px; padding: 4px; border: 1px solid var(--cs-border); border-radius: 9px; background: var(--cs-panel); box-shadow: 0 12px 36px rgba(0,0,0,.35); }
.cs-context-menu button { display: block; width: 100%; padding: 7px 10px; border: 0; border-radius: 6px; background: transparent; color: var(--cs-text); font: inherit; font-size: 12px; text-align: left; cursor: pointer; }
.cs-context-menu button:hover { background: var(--cs-hover); }
.cs-context-danger { color: var(--cs-danger) !important; }
.cs-context-divider { height: 1px; margin: 4px 6px; background: var(--cs-border); }
.cs-context-label { padding: 5px 8px 3px; color: var(--cs-muted); font-size: 10px; }
.cs-context-swatches { display: flex; gap: 6px; padding: 3px 8px 6px; }
.cs-context-swatch { width: 18px; height: 18px; padding: 0; border: 2px solid transparent; border-radius: 50%; cursor: pointer; }
.cs-context-swatch:hover { border-color: var(--cs-text); }
.cs-card-tag { flex-shrink: 0; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 1px 5px; border: 1px solid var(--cs-border); border-radius: 4px; color: var(--cs-muted); font-size: 9px; }
.cs-collapse { padding: 1px 5px; }
.cs-layer-modal { width: min(560px, calc(100vw - 48px)); }
.cs-memory-modal { width: min(520px, calc(100vw - 48px)); }
.cs-memory-note { margin-top: 4px; color: var(--cs-muted); font-size: 11px; line-height: 1.6; }
.cs-memory-option { display: flex; flex-direction: column; gap: 4px; width: 100%; padding: 10px 12px; border: 1px solid var(--cs-border); border-radius: 9px; background: var(--cs-bg); color: var(--cs-text); font: inherit; text-align: left; cursor: pointer; }
.cs-memory-option span { color: var(--cs-muted); font-size: 11px; line-height: 1.5; }
.cs-memory-option:hover { border-color: var(--cs-accent); }
.cs-memory-active { border-color: var(--cs-accent); background: color-mix(in srgb, var(--cs-accent) 10%, var(--cs-bg)); }
.cs-memory-section { display: flex; flex-direction: column; gap: 6px; color: var(--cs-muted); font-size: 11px; }
.cs-memory-chips { display: flex; gap: 6px; }
.cs-memory-chip { padding: 6px 9px; border: 1px solid var(--cs-border); border-radius: 7px; background: var(--cs-bg); color: var(--cs-text); font: inherit; font-size: 11px; cursor: pointer; }
.cs-memory-chip:hover { border-color: var(--cs-accent); }
.cs-layer-tree { display: flex; flex-direction: column; gap: 2px; }
.cs-layer-root { padding: 4px 8px 6px; color: var(--cs-muted); font-size: 10px; font-weight: 600; letter-spacing: .08em; }
.cs-layer-children { display: flex; flex-direction: column; gap: 2px; margin-left: 10px; padding-left: 10px; border-left: 1px solid var(--cs-border); }
.cs-layer-tree-group { position: relative; }
.cs-layer-tree-row { position: relative; display: flex; align-items: center; gap: 7px; width: 100%; padding: 5px 8px; border: 0; border-radius: 6px; background: transparent; color: var(--cs-text); font: inherit; font-size: 12px; text-align: left; cursor: pointer; }
.cs-layer-tree-row::before { content: ''; position: absolute; left: -10px; top: 50%; width: 8px; border-top: 1px solid var(--cs-border); }
.cs-layer-tree-row:hover { background: var(--cs-hover); }
.cs-layer-branch-row { color: var(--cs-muted); }
.cs-layer-seq { flex-shrink: 0; color: var(--cs-muted); font-size: 10px; font-variant-numeric: tabular-nums; }
.cs-layer-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 10px; border: 1px solid var(--cs-border); border-radius: 8px; background: transparent; color: var(--cs-text); font: inherit; font-size: 12px; text-align: left; cursor: pointer; }
.cs-layer-row:hover { background: var(--cs-hover); }
.cs-layer-dot { flex-shrink: 0; width: 9px; height: 9px; border-radius: 50%; }
.cs-layer-tag { flex-shrink: 0; min-width: 28px; color: var(--cs-muted); font-size: 10px; }
.cs-layer-q { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-layer-z { flex-shrink: 0; color: var(--cs-muted); font-size: 10px; }
.cs-root ::-webkit-scrollbar { width: 8px; height: 8px; }
.cs-root ::-webkit-scrollbar-thumb { background: var(--cs-border-strong); border-radius: 999px; }
.cs-root ::-webkit-scrollbar-track { background: transparent; }
@media (max-width: 760px) {
  .cs-topbar { height: auto; min-height: 58px; flex-wrap: wrap; align-items: flex-start; padding: 8px 10px; gap: 8px; }
  .cs-top-actions { flex-wrap: wrap; gap: 6px; }
  .cs-topbar .cs-btn { font-size: 11px; padding: 5px 7px; }
  .cs-lib-header { flex-wrap: wrap; padding: 10px 12px; gap: 8px; }
  .cs-lib-body { flex-direction: column; }
  .cs-lib-side { width: 100%; max-height: 30vh; border-right: 0; border-bottom: 1px solid var(--cs-border); padding: 8px; }
  .cs-lib-main { padding: 12px; }
  .cs-lib-spaces, .cs-lib-subfolders { grid-template-columns: 1fr; }
  .cs-bottom-composer { width: calc(100% - 24px); bottom: 10px; }
  .cs-hintbar { display: none; }
  .cs-modal { max-width: calc(100vw - 24px); }
  .cs-context-menu { max-width: calc(100vw - 16px); }
}
@media (max-width: 520px) {
  .cs-lib-search { width: 100%; }
  .cs-top-actions { width: 100%; }
  .cs-composer { padding: 9px; }
  .cs-composer-bar { gap: 6px; }
  .cs-zoom { right: 8px; bottom: 8px; }
}
@media (pointer: coarse) {
  .cs-lib-folder { min-height: 40px; }
  .cs-btn, .cs-mini, .cs-lib-mini { min-height: 32px; }
}

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
      const attachments = Array.isArray(turn.attachments)
        ? turn.attachments
            .filter((item) => item && item.attachment && typeof item.attachment === 'object')
            .slice(0, 6)
            .map((item) => ({ kind: item.kind === 'image' ? 'image' : 'file', attachment: item.attachment }))
        : []
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
        attachments,
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
              collapsed: Boolean(branch.collapsed),
              tag: stringOf(branch.tag).slice(0, 20),
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
        memoryMode: raw.memoryMode === 'semantic' ? 'semantic' : 'lexical',
        summaryMode: raw.summaryMode === 'every3' ? 'every3' : raw.summaryMode === 'off' ? 'off' : 'every',
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

    function boundedMemory(lines, maxChars, head, tail) {
      const text = lines.join('\n')
      if (text.length <= maxChars) return text
      const selected = [...lines.slice(0, head), '…', ...lines.slice(-tail)]
      return selected.join('\n').slice(0, maxChars)
    }

    const MEMORY_ITEMS_LIMIT = 120
    const MEMORY_SUPPRESSED_LIMIT = 500

    function memoryNormalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 120)
    }

    function splitAnswerChunks(answer) {
      const text = String(answer || '').replace(/\r\n/g, '\n').trim()
      if (text.length <= 700) return []
      const parts = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
      const chunks = []
      let current = ''
      for (const part of parts) {
        if (current && current.length + part.length + 2 > 800) {
          chunks.push(current)
          current = part
          if (chunks.length >= 6) break
        } else {
          current = current ? current + '\n\n' + part : part
        }
      }
      if (current && chunks.length < 6) chunks.push(current)
      if (chunks.length === 0) {
        for (let start = 0; start < text.length && chunks.length < 6; start += 700) {
          chunks.push(text.slice(start, start + 800))
        }
      }
      return chunks.filter(Boolean).slice(0, 6)
    }

    function memoryTurnText(turn) {
      return stringOf(turn.summary) || stringOf(turn.answer).slice(0, 240) || stringOf(turn.question)
    }

    function memoryItemScore(item) {
      const ageDays = Math.max(0, (Date.now() - finite(item.createdAt, Date.now())) / 86400000)
      const recency = 1 / (1 + ageDays / 45)
      const usage = item.lastUsedAt ? 1 / (1 + Math.max(0, Date.now() - item.lastUsedAt) / 86400000 / 30) : 0
      return (item.pinned ? 1000 : 0) + (finite(item.importance, 0.5) * 100) + recency * 10 + usage * 5
    }

    const EMBEDDING_DIMS = 96
    const EMBEDDING_VERSION = 1

    function embeddingHash(value, seed) {
      let hash = (2166136261 ^ seed) >>> 0
      const text = String(value || '')
      for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index)
        hash = Math.imul(hash, 16777619) >>> 0
      }
      return hash >>> 0
    }

    function embedText(value) {
      const text = String(value || '').toLowerCase().replace(/\s+/g, ' ').trim()
      const vector = new Array(EMBEDDING_DIMS).fill(0)
      if (!text) return vector
      const features = []
      const words = text.match(/[\p{L}\p{N}_-]{2,}/gu) || []
      for (const word of words) features.push('w:' + word)
      for (let index = 0; index < text.length; index += 1) {
        const char = text[index]
        if (!/[\p{L}\p{N}]/u.test(char)) continue
        features.push('c:' + char)
        if (index + 1 < text.length) {
          const next = text[index + 1]
          if (/[\p{L}\p{N}]/u.test(next)) features.push('b:' + char + next)
        }
      }
      for (const feature of features) {
        const slot = embeddingHash(feature, 0) % EMBEDDING_DIMS
        const sign = (embeddingHash(feature, 17) & 1) === 0 ? 1 : -1
        vector[slot] += sign
      }
      let norm = 0
      for (const valueItem of vector) norm += valueItem * valueItem
      norm = Math.sqrt(norm) || 1
      for (let index = 0; index < vector.length; index += 1) vector[index] = vector[index] / norm
      return vector
    }

    function cosineSimilarity(left, right) {
      if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return 0
      let dot = 0
      let leftNorm = 0
      let rightNorm = 0
      for (let index = 0; index < left.length; index += 1) {
        dot += left[index] * right[index]
        leftNorm += left[index] * left[index]
        rightNorm += right[index] * right[index]
      }
      if (!leftNorm || !rightNorm) return 0
      return dot / Math.sqrt(leftNorm * rightNorm)
    }

    function semanticTokens(value) {
      const text = String(value || '').toLowerCase().replace(/\s+/g, ' ').trim()
      const tokens = []
      for (const word of (text.match(/[\p{L}\p{N}_-]{2,}/gu) || [])) tokens.push('w:' + word)
      for (let index = 0; index < text.length; index += 1) {
        const char = text[index]
        if (!/[\p{L}\p{N}]/u.test(char)) continue
        if (index + 1 < text.length) {
          const next = text[index + 1]
          if (/[\p{L}\p{N}]/u.test(next)) tokens.push('b:' + char + next)
        }
      }
      return tokens
    }

    function normalizeVector(vector) {
      let norm = 0
      for (const value of vector) norm += value * value
      norm = Math.sqrt(norm) || 1
      for (let index = 0; index < vector.length; index += 1) vector[index] /= norm
      return vector
    }

    function buildCooccurrenceVectors(items) {
      const termVectors = new Map()
      const itemTokens = new Map()
      const ensure = (token) => {
        if (!termVectors.has(token)) termVectors.set(token, new Array(EMBEDDING_DIMS).fill(0))
        return termVectors.get(token)
      }
      for (const item of items) {
        const tokens = semanticTokens(stringOf(item.question) + ' ' + stringOf(item.text))
        itemTokens.set(item.turnId, tokens)
        for (let index = 0; index < tokens.length; index += 1) {
          const vector = ensure(tokens[index])
          for (let offset = -4; offset <= 4; offset += 1) {
            if (offset === 0) continue
            const other = tokens[index + offset]
            if (!other) continue
            const slot = embeddingHash(other, 3) % EMBEDDING_DIMS
            const sign = (embeddingHash(other + ':' + offset, 5) & 1) === 0 ? 1 : -1
            vector[slot] += sign / Math.abs(offset)
          }
        }
      }
      for (const vector of termVectors.values()) normalizeVector(vector)
      const itemVectors = new Map()
      for (const item of items) {
        const tokens = itemTokens.get(item.turnId) || []
        const vector = new Array(EMBEDDING_DIMS).fill(0)
        for (const token of tokens) {
          const term = termVectors.get(token)
          if (!term) continue
          for (let index = 0; index < EMBEDDING_DIMS; index += 1) vector[index] += term[index]
        }
        itemVectors.set(item.turnId, normalizeVector(vector))
      }
      return { termVectors, itemVectors }
    }

    function semanticQueryVector(question, termVectors) {
      const tokens = semanticTokens(question)
      const vector = new Array(EMBEDDING_DIMS).fill(0)
      for (const token of tokens) {
        const term = termVectors.get(token)
        if (!term) continue
        for (let index = 0; index < EMBEDDING_DIMS; index += 1) vector[index] += term[index]
      }
      const normalized = normalizeVector(vector)
      return normalized.some((value) => Math.abs(value) > 0.000001) ? normalized : embedText(question)
    }

    function buildContextMemory(space) {
      if (!space) return { version: 2, main: '', branches: {}, items: [], suppressed: [], updatedAt: Date.now() }
      const previous = space.memory && typeof space.memory === 'object' ? space.memory : {}
      const existingItems = Array.isArray(previous.items) ? previous.items : []
      const byTurn = new Map()
      for (const item of existingItems) {
        if (item && typeof item.turnId === 'string') byTurn.set(item.turnId, item)
      }
      const suppressed = new Set(Array.isArray(previous.suppressed) ? previous.suppressed : [])
      const mainTurns = Array.isArray(space.main && space.main.turns) ? space.main.turns : []
      const branches = Array.isArray(space.branches) ? space.branches : []
      const entries = [
        ...mainTurns.map((turn, index) => ({ turn, kind: 'main', branchId: null, index })),
        ...branches.flatMap((branch) => (Array.isArray(branch.turns) ? branch.turns : []).map((turn, index) => ({ turn, kind: 'branch', branchId: branch.id, index }))),
      ]
      const rawItems = []
      for (const entry of entries) {
        const turn = entry.turn
        if (!turn || !turn.id) continue
        const prior = byTurn.get(turn.id)
        if (!prior && suppressed.has(turn.id)) continue
        const text = (stringOf(turn.summary) || stringOf(turn.answer).slice(0, 600) || stringOf(turn.question)).slice(0, 600)
        const chunks = splitAnswerChunks(turn.answer)
        const pinned = Boolean(prior && prior.pinned) || (entry.kind === 'main' && entry.index < 3) || Boolean(turn.flag || turn.todo)
        const importance = Math.max(
          finite(prior && prior.importance, entry.kind === 'main' ? 1 : 0.72),
          turn.flag ? 0.95 : 0,
          turn.todo ? 0.85 : 0,
        )
        rawItems.push({
          id: prior && prior.id ? prior.id : 'mem-' + turn.id,
          turnId: turn.id,
          kind: entry.kind,
          branchId: entry.branchId,
          question: stringOf(turn.question).slice(0, 240),
          text: text.slice(0, 600),
          chunks,
          sourceTurnIds: [turn.id],
          createdAt: finite(prior && prior.createdAt, finite(turn.createdAt, Date.now())),
          updatedAt: Date.now(),
          lastUsedAt: finite(prior && prior.lastUsedAt, 0),
          importance,
          pinned,
          status: prior && prior.status ? prior.status : 'active',
        })
      }

      const deduped = []
      const byText = new Map()
      for (const item of rawItems) {
        const key = memoryNormalize(item.text)
        if (!key) continue
        const existing = byText.get(key)
        if (!existing) {
          byText.set(key, item)
          deduped.push(item)
          continue
        }
        existing.sourceTurnIds = [...new Set([...existing.sourceTurnIds, ...item.sourceTurnIds])]
        existing.importance = Math.max(existing.importance, item.importance)
        existing.pinned = existing.pinned || item.pinned
        existing.createdAt = Math.min(existing.createdAt, item.createdAt)
        existing.updatedAt = Math.max(existing.updatedAt, item.updatedAt)
        existing.lastUsedAt = Math.max(existing.lastUsedAt, item.lastUsedAt)
      }

      let items = deduped.map((item) => ({
        ...item,
        embedding: embedText(stringOf(item.question) + ' ' + stringOf(item.text)),
        embeddingVersion: EMBEDDING_VERSION,
      }))
      if (items.length > MEMORY_ITEMS_LIMIT) {
        items = [...items].sort((left, right) => memoryItemScore(right) - memoryItemScore(left))
        const dropped = items.slice(MEMORY_ITEMS_LIMIT)
        for (const item of dropped) suppressed.add(item.turnId)
        items = items.slice(0, MEMORY_ITEMS_LIMIT)
      }

      const mainLines = mainTurns.map((turn, index) => {
        const detail = memoryTurnText(turn)
        return 'M' + (index + 1) + ' ' + stringOf(turn.question).slice(0, 90) + ' → ' + detail.slice(0, 220)
      })
      const branchMemory = {}
      for (const branch of branches) {
        const turns = Array.isArray(branch.turns) ? branch.turns : []
        const lines = turns.map((turn, index) => {
          const detail = memoryTurnText(turn)
          return 'B' + (index + 1) + ' ' + stringOf(turn.question).slice(0, 70) + ' → ' + detail.slice(0, 150)
        })
        branchMemory[branch.id] = boundedMemory(lines, 1000, 2, 6)
      }
      return {
        version: 2,
        main: boundedMemory(mainLines, 3000, 4, 12),
        branches: branchMemory,
        items,
        suppressed: [...suppressed].slice(-MEMORY_SUPPRESSED_LIMIT),
        updatedAt: Date.now(),
      }
    }

    function buildRetrieval(space, question) {
      if (!space) return []
      const queryTerms = [...new Set(semanticTokens(question))].slice(0, 16)
      if (queryTerms.length === 0) return []
      let items = space.memory && Array.isArray(space.memory.items) ? space.memory.items : []
      if (items.length === 0) {
        const mainTurns = Array.isArray(space.main && space.main.turns) ? space.main.turns : []
        items = mainTurns.map((turn, index) => ({
          turnId: turn.id,
          kind: 'main',
          question: stringOf(turn.question),
          text: memoryTurnText(turn),
          chunks: splitAnswerChunks(turn.answer),
          sourceTurnIds: [turn.id],
          embedding: embedText(turn.question + ' ' + memoryTurnText(turn)),
          embeddingVersion: EMBEDDING_VERSION,
          createdAt: finite(turn.createdAt, Date.now()),
          lastUsedAt: 0,
          importance: 1,
          pinned: index < 3,
          status: 'active',
        }))
        for (const branch of Array.isArray(space.branches) ? space.branches : []) {
          for (const turn of (Array.isArray(branch.turns) ? branch.turns : [])) {
            items.push({
              turnId: turn.id,
              kind: 'branch',
              question: stringOf(turn.question),
              text: memoryTurnText(turn),
              chunks: splitAnswerChunks(turn.answer),
              sourceTurnIds: [turn.id],
              embedding: embedText(turn.question + ' ' + memoryTurnText(turn)),
              embeddingVersion: EMBEDDING_VERSION,
              createdAt: finite(turn.createdAt, Date.now()),
              lastUsedAt: 0,
              importance: 0.72,
              pinned: false,
              status: 'active',
            })
          }
        }
      }
      const units = []
      for (const item of items) {
        if (!item || item.status === 'outdated' || item.status === 'superseded') continue
        units.push({ item, unitId: item.turnId, parent: true, text: item.text, question: item.question })
        const chunks = Array.isArray(item.chunks) ? item.chunks.slice(0, 6) : []
        chunks.forEach((chunk, index) => {
          if (!chunk) return
          units.push({ item, unitId: item.turnId + ':chunk:' + index, parent: false, text: chunk, question: item.question })
        })
      }
      if (units.length === 0) return []
      const docs = units.map((unit) => semanticTokens(stringOf(unit.question) + ' ' + stringOf(unit.text)))
      const documentFrequency = new Map()
      let totalLength = 0
      for (const tokens of docs) {
        totalLength += tokens.length
        for (const token of new Set(tokens)) documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1)
      }
      const averageLength = totalLength / Math.max(1, docs.length)
      const k1 = 1.2
      const b = 0.75
      const bm25 = units.map((_unit, index) => {
        const tokens = docs[index]
        const counts = new Map()
        for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1)
        let score = 0
        for (const term of queryTerms) {
          const count = counts.get(term) || 0
          if (count === 0) continue
          const df = documentFrequency.get(term) || 0
          const idf = Math.log(1 + (units.length - df + 0.5) / (df + 0.5))
          const lengthNorm = 1 - b + b * (tokens.length / Math.max(1, averageLength))
          score += idf * ((count * (k1 + 1)) / (count + k1 * lengthNorm))
        }
        return score
      })
      const maxBm25 = Math.max(...bm25, 0.000001)
      const semantic = space.memoryMode === 'semantic'
        ? buildCooccurrenceVectors(units.map((unit) => ({ turnId: unit.unitId, question: unit.question, text: unit.text })))
        : null
      const queryVector = semantic
        ? semanticQueryVector(String(question || ''), semantic.termVectors)
        : embedText(String(question || ''))
      const bestByTurn = new Map()
      units.forEach((unit, index) => {
        const item = unit.item
        const vector = semantic
          ? (semantic.itemVectors.get(unit.unitId) || embedText(stringOf(unit.question) + ' ' + stringOf(unit.text)))
          : (unit.parent
              ? (Array.isArray(item.embedding) ? item.embedding : embedText(stringOf(item.question) + ' ' + stringOf(item.text)))
              : embedText(stringOf(unit.question) + ' ' + stringOf(unit.text)))
        const vectorScore = cosineSimilarity(queryVector, vector)
        const ageDays = Math.max(0, (Date.now() - finite(item.createdAt, Date.now())) / 86400000)
        const recency = 1 / (1 + ageDays / 45)
        const usedDays = item.lastUsedAt ? Math.max(0, (Date.now() - item.lastUsedAt) / 86400000) : 365
        const usage = 1 / (1 + usedDays / 30)
        const score = (bm25[index] / maxBm25) * 2 + vectorScore * 2 + recency + usage * 0.5 + finite(item.importance, 0.5) + (item.kind === 'main' ? 0.25 : 0)
        const current = bestByTurn.get(item.turnId)
        if (!current || score > current.score) bestByTurn.set(item.turnId, { unit, score })
      })
      return [...bestByTurn.values()]
        .sort((left, right) => right.score - left.score)
        .slice(0, 4)
        .map(({ unit }) => ({
          kind: unit.item.kind,
          question: stringOf(unit.item.question).slice(0, 220),
          summary: stringOf(unit.item.text).slice(0, 500),
          chunk: unit.parent ? '' : stringOf(unit.text).slice(0, 900),
          parentTurnId: unit.item.turnId,
          sourceTurnIds: Array.isArray(unit.item.sourceTurnIds) ? unit.item.sourceTurnIds.slice(0, 4) : [],
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

    function Dot({ kind, zoom, label, color, selected, flagged, pending, onClick, onHover, onLeave, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }) {
      const edge = kind === 'main'
        ? Math.max(10, 24 / Math.max(zoom, 0.01))
        : Math.max(8, 15 / Math.max(zoom, 0.01))
      const safeZoom = Math.max(zoom, 0.01)
      const badge = 18 / safeZoom
      const offset = edge / 2 + badge / 2 - 2 / safeZoom
      const badgeStyle = (side) => ({
        width: badge,
        height: badge,
        fontSize: badge * 0.8,
        borderWidth: 2 / safeZoom,
        left: '50%',
        top: '50%',
        transform: side === 'flag'
          ? 'translate(calc(-50% - ' + offset + 'px), calc(-50% - ' + offset + 'px))'
          : 'translate(calc(-50% + ' + offset + 'px), calc(-50% - ' + offset + 'px))',
      })
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
        }),
        flagged
          ? h('span', { className: 'cs-dot-badge cs-dot-badge-flag', style: badgeStyle('flag'), title: label }, '⚑')
          : null,
        pending
          ? h('span', { className: 'cs-dot-badge cs-dot-badge-pending', style: badgeStyle('pending'), title: label }, '!')
          : null
      )
    }

    const MICA_LOGO_SRC = 'data:image/png;base64,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'

    function FolderIcon({ size }) {
      const dimension = size || 14
      return h('svg', {
        width: dimension,
        height: dimension,
        viewBox: '0 0 24 24',
        className: 'cs-folder-icon',
        'aria-hidden': true,
      },
        h('path', {
          d: 'M3.5 7.2a2 2 0 0 1 2-2h4.4l2 2h6.6a2 2 0 0 1 2 2v7.6a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinejoin: 'round',
        })
      )
    }

    function SpaceIcon({ size }) {
      const dimension = size || 14
      return h('svg', {
        width: dimension,
        height: dimension,
        viewBox: '0 0 24 24',
        className: 'cs-space-icon',
        'aria-hidden': true,
      },
        h('path', { d: 'M7 5.5v13', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' }),
        h('circle', { cx: 7, cy: 7, r: 1.7, fill: 'currentColor' }),
        h('circle', { cx: 7, cy: 17, r: 1.7, fill: 'currentColor' }),
        h('path', { d: 'M7 12h5.5a3 3 0 0 1 3 3v2', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        h('circle', { cx: 15.5, cy: 18, r: 1.5, fill: 'currentColor' })
      )
    }

    function MicaLogo({ size }) {
      const dimension = size || 28
      return h('img', {
        src: MICA_LOGO_SRC,
        width: dimension,
        height: dimension,
        className: 'cs-logo-mark',
        alt: '',
        draggable: false,
      })
    }

    function attachmentHref(item, download) {
      const kind = item && item.kind === 'image' ? 'image' : 'file'
      const ref = item && item.attachment && typeof item.attachment === 'object' ? item.attachment : {}
      return API + '/attachment?kind=' + kind + '&ref=' + encodeURIComponent(JSON.stringify(ref)) + (download ? '&download=1' : '')
    }

    function formatBytes(value) {
      const bytes = Number(value) || 0
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1024 / 1024).toFixed(1) + ' MB'
    }

    function readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = String(reader.result || '')
          const comma = result.indexOf(',')
          resolve(comma >= 0 ? result.slice(comma + 1) : result)
        }
        reader.onerror = () => reject(reader.error || new Error('read file failed'))
        reader.readAsDataURL(file)
      })
    }

    function Composer({ t, placeholder, onSend, busy, autoFocus, storageKey }) {
      const [value, setValue] = useState(() => readTextStorage(storageKey))
      const [attachments, setAttachments] = useState([])
      const [uploading, setUploading] = useState(false)
      const [error, setError] = useState('')
      const [dragging, setDragging] = useState(false)
      const fileInputRef = useRef(null)

      useEffect(() => {
        writeTextStorage(storageKey, value)
      }, [storageKey, value])

      const uploadFiles = async (fileList) => {
        const files = Array.from(fileList || [])
        if (!files.length) return
        const room = Math.max(0, 6 - attachments.length)
        if (room === 0) {
          setError(t('attachmentLimit'))
          if (fileInputRef.current) fileInputRef.current.value = ''
          return
        }
        setUploading(true)
        setError('')
        const added = []
        try {
          for (const file of files.slice(0, room)) {
            if (file.size > 20 * 1024 * 1024) throw new Error(t('fileTooLarge'))
            const data = await readFileAsBase64(file)
            const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
            const kind = imageTypes.indexOf(file.type) >= 0 ? 'image' : 'file'
            const response = await fetch(API + '/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ kind, name: file.name, mediaType: file.type, data }),
            })
            const body = await response.json()
            if (!response.ok || !body || body.ok === false) {
              throw new Error(body && body.error ? body.error : t('uploadFailed'))
            }
            added.push({ kind: body.kind, attachment: body.attachment })
          }
          setAttachments((previous) => previous.concat(added).slice(0, 6))
        } catch (uploadError) {
          setError(uploadError && uploadError.message ? uploadError.message : t('uploadFailed'))
        } finally {
          setUploading(false)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
      }

      const addFiles = (event) => {
        const files = Array.from((event.target && event.target.files) || [])
        uploadFiles(files)
      }

      const removeAttachment = (index) => {
        setAttachments((previous) => previous.filter((_item, itemIndex) => itemIndex !== index))
      }

      const submit = () => {
        const question = value.trim()
        if ((!question && attachments.length === 0) || busy || uploading) return
        const content = question || t('attachmentQuestion')
        setValue('')
        setAttachments([])
        onSend(content, attachments)
      }

      const keyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault()
          submit()
        }
      }

      return h('div', {
        className: cx('cs-composer', dragging ? 'cs-composer-dragging' : ''),
        onDragOver: (event) => {
          if (!event.dataTransfer || !Array.from(event.dataTransfer.types || []).includes('Files')) return
          event.preventDefault()
          event.stopPropagation()
          event.dataTransfer.dropEffect = 'copy'
          setDragging(true)
        },
        onDragLeave: (event) => {
          if (event.currentTarget && event.currentTarget.contains(event.relatedTarget)) return
          setDragging(false)
        },
        onDrop: (event) => {
          event.preventDefault()
          event.stopPropagation()
          setDragging(false)
          const files = Array.from((event.dataTransfer && event.dataTransfer.files) || [])
          if (files.length) uploadFiles(files)
        },
      },
        h('input', {
          ref: fileInputRef,
          type: 'file',
          multiple: true,
          style: { display: 'none' },
          onChange: addFiles,
        }),
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
        attachments.length > 0
          ? h('div', { className: 'cs-composer-attachments' },
              attachments.map((item, index) => h('div', { key: index, className: 'cs-composer-attachment' },
                item.kind === 'image'
                  ? h('img', { src: attachmentHref(item, false), alt: item.attachment && item.attachment.name || 'image' })
                  : h('span', { className: 'cs-composer-file-icon' }, '📎'),
                h('span', { className: 'cs-composer-attachment-name', title: item.attachment && item.attachment.name || '' },
                  item.attachment && item.attachment.name || (item.kind === 'image' ? 'image' : 'file')
                ),
                h('button', { type: 'button', className: 'cs-composer-remove', title: t('removeAttachment'), onClick: () => removeAttachment(index) }, '×')
              ))
            )
          : null,
        error ? h('div', { className: 'cs-upload-error' }, error) : null,
        h('div', { className: 'cs-composer-bar' },
          h('button', {
            type: 'button',
            className: 'cs-add-btn',
            title: t('attachFile'),
            'aria-label': t('attachFile'),
            disabled: busy || uploading,
            onClick: () => { if (fileInputRef.current) fileInputRef.current.click() },
          }, h('span', { className: 'cs-add-icon', 'aria-hidden': true }, '+')),
          h('span', { className: 'cs-hint' },
            uploading ? t('uploading') : busy ? t('sending') : attachments.length > 0 ? attachments.length + ' ' + t('attachments') : t('composerHint')
          ),
          h('button', {
            type: 'button',
            className: 'cs-btn cs-btn-primary',
            disabled: busy || uploading || (!value.trim() && attachments.length === 0),
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
      onContextMenu, tag, collapsed, hiddenCount, onToggleCollapse,
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
        onContextMenu: (event) => {
          const target = event.target
          if (target && target.closest && target.closest('input, textarea, [contenteditable="true"]')) return
          if (onContextMenu) onContextMenu(event)
        },
      },
        h('div', { className: 'cs-card-head' },
          h('div', { className: 'cs-card-tags' },
            sequence ? h('span', { className: 'cs-seq' }, sequence) : null,
            h('span', {
              className: cx('cs-tag', kind === 'main' ? 'cs-tag-main' : 'cs-tag-branch'),
              style: { background: color + '22', color },
            }, t(kind === 'main' ? 'main' : 'branch')),
            h('button', {
              type: 'button',
              className: cx('cs-todo', turn.todo ? 'cs-todo-on' : ''),
              title: t('todo'),
              'aria-pressed': Boolean(turn.todo),
              onClick: (event) => { event.stopPropagation(); onToggleTodo(!turn.todo) },
            },
              h('span', { className: 'cs-todo-box' }, turn.todo ? '!' : ''),
              h('span', { className: 'cs-todo-text' }, t('todo'))
            ),
            h('button', {
              type: 'button',
              className: cx('cs-flag', turn.flag ? 'cs-flag-on' : ''),
              title: t('important'),
              onClick: () => onToggleFlag(!turn.flag),
            }, '⚑'),
            tag ? h('span', { className: 'cs-card-tag' }, tag) : null,
            kind === 'branch' && isFirst && hiddenCount > 0
              ? h('button', { type: 'button', className: 'cs-mini cs-collapse', title: collapsed ? t('expandBranch') : t('collapseBranch'), onClick: (event) => { event.stopPropagation(); onToggleCollapse() } }, collapsed ? '+' + hiddenCount : '−')
              : null,
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
          turn.attachments && turn.attachments.length > 0
            ? h('div', { className: 'cs-attachments' },
                turn.attachments.map((item, index) => item.kind === 'image'
                  ? h('a', {
                      key: 'att-' + index,
                      className: 'cs-attachment-image',
                      href: attachmentHref(item, false),
                      target: '_blank',
                      rel: 'noreferrer',
                      onPointerDown: (event) => event.stopPropagation(),
                      onClick: (event) => event.stopPropagation(),
                    }, h('img', {
                        src: attachmentHref(item, false),
                        alt: item.attachment && item.attachment.name || 'image',
                        loading: 'lazy',
                        decoding: 'async',
                        onError: (event) => {
                          const img = event.currentTarget
                          img.style.display = 'none'
                          if (img.parentElement) {
                            img.parentElement.classList.add('cs-attachment-missing')
                            img.parentElement.title = '附件不可用'
                          }
                        },
                      }))
                  : h('a', {
                      key: 'att-' + index,
                      className: 'cs-attachment-file',
                      href: attachmentHref(item, true),
                      download: item.attachment && item.attachment.name || true,
                      onPointerDown: (event) => event.stopPropagation(),
                      onClick: (event) => event.stopPropagation(),
                    },
                      h('span', { className: 'cs-attachment-icon' }, '📎'),
                      h('span', { className: 'cs-attachment-name' }, item.attachment && item.attachment.name || 'file'),
                      h('span', { className: 'cs-attachment-size' }, formatBytes(item.attachment && item.attachment.bytes))
                    )
                )
              )
            : null,
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

    function spaceToMarkdown(space) {
      const title = String(space.title || 'Mica Space')
      const lines = ['# ' + title, '']
      lines.push('## ' + 'Main line')
      const mainTurns = Array.isArray(space.main && space.main.turns) ? space.main.turns : []
      mainTurns.forEach((turn, index) => {
        lines.push('')
        lines.push('### M' + (index + 1) + ' · ' + String(turn.question || ''))
        lines.push('')
        lines.push(String(turn.answer || ''))
      })
      const branches = Array.isArray(space.branches) ? space.branches : []
      branches.forEach((branch, index) => {
        lines.push('')
        lines.push('## Branch B' + (index + 1))
        if (branch.anchorText) {
          lines.push('')
          lines.push('> ' + String(branch.anchorText).replace(/\n/g, '\n> '))
        }
        if (branch.brief) lines.push('', String(branch.brief))
        const turns = Array.isArray(branch.turns) ? branch.turns : []
        turns.forEach((turn, turnIndex) => {
          lines.push('')
          lines.push('### B' + (index + 1) + '.' + (turnIndex + 1) + ' · ' + String(turn.question || ''))
          lines.push('')
          lines.push(String(turn.answer || ''))
        })
      })
      return lines.join('\n')
    }

    function ChatSpaceRoot({ tr, t: slotT, onBackToConversation }) {
      const t = typeof tr === 'function' ? tr : typeof slotT === 'function' ? slotT : (key) => key
      const [library, setLibrary] = useState(null)
      const [loadState, setLoadState] = useState('loading')
      const [loadError, setLoadError] = useState('')
      const [activeId, setActiveId] = useState(() => readTextStorage(LAST_SPACE_KEY) || null)
      const [selectedFolder, setSelectedFolder] = useState('all')
      const [search, setSearch] = useState('')
      const [trashOpen, setTrashOpen] = useState(false)
      const [privacyOpen, setPrivacyOpen] = useState(false)
      const [settingsOpen, setSettingsOpen] = useState(false)
      const [recoveryOpen, setRecoveryOpen] = useState(false)
      const [recoveryItems, setRecoveryItems] = useState([])
      const [recoveryLoading, setRecoveryLoading] = useState(false)
      const [trashItems, setTrashItems] = useState([])
      const [trashLoading, setTrashLoading] = useState(false)
      const libraryImportRef = useRef(null)
      const [dragOverFolder, setDragOverFolder] = useState(null)
      const [backupOpen, setBackupOpen] = useState(false)
      const [backupRemote, setBackupRemote] = useState('')
      const [backupBranch, setBackupBranch] = useState('main')
      const [backupBusy, setBackupBusy] = useState(false)
      const [backupResult, setBackupResult] = useState('')
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
          const nextLibrary = body.library || { folders: [], spaces: [] }
          setLibrary(nextLibrary)
          setActiveId((current) => {
            if (current && !(nextLibrary.spaces || []).some((space) => space.id === current)) {
              writeTextStorage(LAST_SPACE_KEY, '')
              return null
            }
            return current
          })
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
      const isDescendantFolder = (folder, ancestorId) => {
        let current = folder
        while (current && current.parentId && folderById.has(current.parentId)) {
          if (current.parentId === ancestorId) return true
          current = folderById.get(current.parentId)
        }
        return false
      }
      const folderSpaceCount = (folderId) => spaces.filter((space) => (
        space.folderId === folderId || isDescendantFolder(folderById.get(space.folderId), folderId)
      )).length
      const searchActive = Boolean(search.trim())
      const query = search.trim().toLowerCase()
      const selectedName = searchActive
        ? t('searchResults')
        : selectedFolder === 'all'
          ? t('allSpaces')
          : selectedFolder === 'none'
            ? t('uncategorized')
            : (folderById.get(selectedFolder) && folderById.get(selectedFolder).name) || t('allSpaces')
      const visibleSpaces = spaces
        .filter((space) => {
          if (searchActive) {
            return [space.title, space.firstSummary, space.lastQuestion].some((value) => String(value || '').toLowerCase().includes(query))
          }
          if (selectedFolder === 'all') return true
          if (selectedFolder === 'none') return !space.folderId
          return space.folderId === selectedFolder
        })
        .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))
      const visibleFolders = !searchActive && selectedFolder !== 'all' && selectedFolder !== 'none'
        ? childrenOf(selectedFolder)
        : []
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
        ...flatFolders.map(({ folder, depth }) => h('option', { key: folder.id, value: folder.id }, '　'.repeat(depth) + '📁 ' + folder.name)),
      ]
      const openSpace = (id) => {
        writeTextStorage(LAST_SPACE_KEY, id)
        setActiveId(id)
      }

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
        if (data.space && data.space.id) {
          writeTextStorage(LAST_SPACE_KEY, data.space.id)
          setActiveId(data.space.id)
        }
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

      const moveFolder = (folder, parentId) => run(async () => {
        const data = await post('/folder/update', { id: folder.id, parentId: parentId || null })
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

      const openBackup = async () => {
        setBackupOpen(true)
        setBackupResult('')
        try {
          const response = await fetch(API + '/backup', { headers: { Accept: 'application/json' } })
          const body = await response.json()
          if (response.ok && body && body.config) {
            setBackupRemote(body.config.remote || '')
            setBackupBranch(body.config.branch || 'main')
          }
        } catch (_error) {
          // The modal still opens; saving config will create it.
        }
      }

      const saveBackupConfig = async () => {
        setBackupBusy(true)
        setBackupResult('')
        try {
          const data = await post('/backup/config', { remote: backupRemote, branch: backupBranch })
          if (data.config) {
            setBackupRemote(data.config.remote || '')
            setBackupBranch(data.config.branch || 'main')
          }
          setBackupResult(t('backupConfigSaved'))
        } catch (error) {
          setBackupResult(error && error.message ? error.message : t('backupFailed'))
        } finally {
          setBackupBusy(false)
        }
      }

      const runBackup = async () => {
        setBackupBusy(true)
        setBackupResult('')
        try {
          const data = await post('/backup/run', {})
          const result = data.result || {}
          setBackupResult(
            t('backupDone') + ' · ' + (result.pushed ? t('backupPushed') : t('backupLocalOnly')) +
            (result.commit ? ' · ' + String(result.commit).slice(0, 12) : '')
          )
        } catch (error) {
          setBackupResult(error && error.message ? error.message : t('backupFailed'))
        } finally {
          setBackupBusy(false)
        }
      }

      const openRecovery = async () => {
        setRecoveryOpen(true)
        setRecoveryLoading(true)
        setNotice('')
        try {
          const response = await fetch(API + '/maintenance/backups', { headers: { Accept: 'application/json' } })
          const body = await response.json()
          if (!response.ok || !body || body.ok === false) throw new Error(body && body.error ? body.error : t('recoveryFailed'))
          setRecoveryItems(Array.isArray(body.items) ? body.items : [])
        } catch (error) {
          setNotice(error && error.message ? error.message : t('recoveryFailed'))
        } finally {
          setRecoveryLoading(false)
        }
      }

      const restoreRecovery = async (item) => {
        if (!window.confirm(t('confirmRestore'))) return
        try {
          const data = await post('/maintenance/restore', { kind: item.kind, id: item.id, source: item.source })
          if (data.library) setLibrary(data.library)
          setRecoveryOpen(false)
          setNotice(t('restoreDone'))
        } catch (error) {
          setNotice(error && error.message ? error.message : t('recoveryFailed'))
        }
      }

      const exportLibrary = async () => {
        setNotice('')
        try {
          const bundle = { version: 1, exportedAt: new Date().toISOString(), library, spaces: {} }
          for (const meta of library.spaces || []) {
            const response = await fetch(API + '/space?id=' + encodeURIComponent(meta.id), { headers: { Accept: 'application/json' } })
            const body = await response.json().catch(() => null)
            if (response.ok && body && body.ok !== false && body.space) bundle.spaces[meta.id] = body.space
          }
          const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'mica-space-library-' + new Date().toISOString().slice(0, 10) + '.json'
          document.body.appendChild(link)
          link.click()
          link.remove()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch (error) {
          setNotice(error && error.message ? error.message : t('exportFailed'))
        }
      }

      const importLibraryFile = async (event) => {
        const file = event.target && event.target.files && event.target.files[0]
        if (!file) return
        setNotice('')
        try {
          const parsed = JSON.parse(await file.text())
          const data = await post('/import', { bundle: parsed })
          if (data.library) setLibrary(data.library)
          setNotice(t('importDone'))
        } catch (error) {
          setNotice(error && error.message ? error.message : t('importFailed'))
        } finally {
          if (libraryImportRef.current) libraryImportRef.current.value = ''
        }
      }

      const duplicateSpace = (space) => run(async () => {
        const data = await post('/space/duplicate', { id: space.id })
        if (data.library) setLibrary(data.library)
      })

      const openTrash = async () => {
        setTrashOpen(true)
        setTrashLoading(true)
        setNotice('')
        try {
          const response = await fetch(API + '/trash', { headers: { Accept: 'application/json' } })
          const body = await response.json()
          if (!response.ok || !body || body.ok === false) throw new Error(body && body.error ? body.error : '读取回收站失败')
          setTrashItems(Array.isArray(body.items) ? body.items : [])
        } catch (error) {
          setNotice(error && error.message ? error.message : '读取回收站失败')
        } finally {
          setTrashLoading(false)
        }
      }

      const restoreTrashItem = (item) => run(async () => {
        const data = await post('/trash/restore', { file: item.file })
        if (data.library) setLibrary(data.library)
        setTrashItems((previous) => previous.filter((entry) => entry.file !== item.file))
        setTrashOpen(false)
      })

      const deleteTrashItem = (item) => run(async () => {
        if (!window.confirm(t('confirmDeleteForever'))) return
        const data = await post('/trash/delete', { file: item.file })
        if (Array.isArray(data.items)) setTrashItems(data.items)
      })

      const exportSpace = (space) => run(async () => {
        const response = await fetch(API + '/space?id=' + encodeURIComponent(space.id), { headers: { Accept: 'application/json' } })
        const body = await response.json()
        if (!response.ok || !body || body.ok === false || !body.space) throw new Error(body && body.error ? body.error : '导出失败')
        const markdown = spaceToMarkdown(body.space)
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = String(body.space.title || 'Mica Space').replace(/[\\/:*?"<>|]/g, '_') + '.md'
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      })

      const openNewSpace = () => {
        setNewSpaceTitle('')
        setNewSpaceLayout('vertical')
        setNewSpaceFolder(selectedFolder !== 'all' && selectedFolder !== 'none' ? selectedFolder : '')
        setNewSpaceOpen(true)
      }

      const goUpFolder = () => {
        if (selectedFolder === 'all' || selectedFolder === 'none') return
        const folder = folderById.get(selectedFolder)
        setSelectedFolder(folder && folder.parentId ? folder.parentId : 'all')
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
          className: cx('cs-lib-folder', selectedFolder === folder.id ? 'cs-lib-folder-active' : '', dragOverFolder === folder.id ? 'cs-drop-over' : ''),
          style: { paddingLeft: 10 + depth * 14 },
          draggable: true,
          onDragStart: (event) => {
            event.stopPropagation()
            event.dataTransfer.setData('application/x-mica-folder', folder.id)
            event.dataTransfer.effectAllowed = 'move'
          },
          onClick: () => setSelectedFolder(folder.id),
          onDragOver: (event) => {
            if (!event.dataTransfer || (!Array.from(event.dataTransfer.types || []).includes('application/x-mica-space') && !Array.from(event.dataTransfer.types || []).includes('application/x-mica-folder'))) return
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            setDragOverFolder(folder.id)
          },
          onDragLeave: () => setDragOverFolder((current) => (current === folder.id ? null : current)),
          onDrop: (event) => {
            event.preventDefault()
            setDragOverFolder(null)
            const folderId = event.dataTransfer.getData('application/x-mica-folder')
            if (folderId && folderId !== folder.id) {
              const child = folderById.get(folderId)
              if (child) moveFolder(child, folder.id)
              return
            }
            const id = event.dataTransfer.getData('application/x-mica-space')
            const target = spaces.find((space) => space.id === id)
            if (target) moveSpace(target, folder.id)
          },
        },
          h('span', { className: 'cs-lib-folder-icon' }, h(FolderIcon, { size: 13 })),
          h('span', { className: 'cs-lib-folder-name' }, folder.name),
          h('span', { className: 'cs-lib-folder-count' }, folderSpaceCount(folder.id) || ''),
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
          draggable: true,
          onDragStart: (event) => {
            event.stopPropagation()
            event.dataTransfer.setData('application/x-mica-space', space.id)
            event.dataTransfer.effectAllowed = 'move'
          },
          onClick: () => openSpace(space.id),
        },
          h('div', { className: 'cs-lib-space-head' },
            h('div', { className: 'cs-lib-space-title', title: space.title },
              h(SpaceIcon, { size: 14 }),
              h('span', { className: 'cs-lib-space-title-text' }, space.title)
            ),
            h('span', { className: 'cs-lib-layout-badge' }, layoutLabel)
          ),
          h('div', { className: 'cs-lib-space-question' }, space.firstSummary || space.lastQuestion || t('emptySpace')),
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
            h('button', { type: 'button', className: 'cs-lib-mini', onClick: (event) => { event.stopPropagation(); duplicateSpace(space) } }, t('duplicate')),
            h('button', { type: 'button', className: 'cs-lib-mini', onClick: (event) => { event.stopPropagation(); exportSpace(space) } }, t('export')),
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
            writeTextStorage(LAST_SPACE_KEY, '')
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
          h('div', { className: 'cs-title-brand' },
            h(MicaLogo, { size: 28 }),
            h('div', { className: 'cs-lib-heading' },
              h('div', { className: 'cs-title' }, t('libraryTitle')),
              h('div', { className: 'cs-subtitle' }, t('librarySubtitle'))
            )
          ),
          h('div', { className: 'cs-top-actions' },
            h('button', { type: 'button', className: 'cs-btn', onClick: openTrash }, t('trash')),
            h('button', { type: 'button', className: 'cs-btn', onClick: () => setSettingsOpen(true) }, t('settings')),
            h('input', { ref: libraryImportRef, type: 'file', accept: '.json,application/json', style: { display: 'none' }, onChange: importLibraryFile }),
            h('input', {
              className: 'cs-lib-search',
              type: 'search',
              value: search,
              placeholder: t('searchSpaces'),
              onChange: (event) => setSearch(event.target.value),
            }),
            h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: openNewSpace }, t('newSpace')),
          )
        ),
        notice ? h('div', { className: 'cs-lib-notice' }, notice) : null,
        h('div', { className: 'cs-lib-body' },
          h('aside', { className: 'cs-lib-side' },
            h('div', { className: 'cs-lib-side-title' }, t('folders')),
            h('div', {
              className: cx('cs-lib-folder', selectedFolder === 'all' ? 'cs-lib-folder-active' : '', dragOverFolder === 'all' ? 'cs-drop-over' : ''),
              onClick: () => setSelectedFolder('all'),
              onDragOver: (event) => { event.preventDefault(); setDragOverFolder('all') },
              onDragLeave: () => setDragOverFolder(null),
              onDrop: (event) => {
                event.preventDefault()
                setDragOverFolder(null)
                const folderId = event.dataTransfer.getData('application/x-mica-folder')
                if (folderId) { const child = folderById.get(folderId); if (child) moveFolder(child, null); return }
                const id = event.dataTransfer.getData('application/x-mica-space')
                const target = spaces.find((space) => space.id === id)
                if (target) moveSpace(target, null)
              },
            },
              h('span', { className: 'cs-lib-folder-icon' }, '◆'),
              h('span', { className: 'cs-lib-folder-name' }, t('allSpaces')),
              h('span', { className: 'cs-lib-folder-count' }, spaces.length)
            ),
            h('div', {
              className: cx('cs-lib-folder', selectedFolder === 'none' ? 'cs-lib-folder-active' : '', dragOverFolder === 'none' ? 'cs-drop-over' : ''),
              onClick: () => setSelectedFolder('none'),
              onDragOver: (event) => { event.preventDefault(); setDragOverFolder('none') },
              onDragLeave: () => setDragOverFolder(null),
              onDrop: (event) => {
                event.preventDefault()
                setDragOverFolder(null)
                const folderId = event.dataTransfer.getData('application/x-mica-folder')
                if (folderId) { const child = folderById.get(folderId); if (child) moveFolder(child, null); return }
                const id = event.dataTransfer.getData('application/x-mica-space')
                const target = spaces.find((space) => space.id === id)
                if (target) moveSpace(target, null)
              },
            },
              h('span', { className: 'cs-lib-folder-icon' }, '·'),
              h('span', { className: 'cs-lib-folder-name' }, t('uncategorized')),
              h('span', { className: 'cs-lib-folder-count' }, spaces.filter((space) => !space.folderId).length)
            ),
            renderFolderTree(null, 0),
          ),
          h('section', { className: 'cs-lib-main' },
            h('div', { className: 'cs-lib-main-head' },
              h('div', { className: 'cs-lib-main-title-wrap' },
                selectedFolder !== 'all' && selectedFolder !== 'none'
                  ? h('button', { type: 'button', className: 'cs-lib-back', onClick: goUpFolder }, '← ' + t('upOneLevel'))
                  : null,
                h('div', null,
                  h('div', { className: 'cs-lib-main-title' }, selectedName),
                  h('div', { className: 'cs-lib-main-sub' },
                    visibleSpaces.length + ' ' + t('spaces') + (visibleFolders.length > 0 ? ' · ' + visibleFolders.length + ' ' + t('folders') : '')
                  )
                )
              ),
              h('div', { className: 'cs-lib-main-actions' },
                h('button', { type: 'button', className: 'cs-btn', onClick: openNewFolder }, '+ ' + t('newFolder')),
                h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: openNewSpace }, '+ ' + t('newSpace'))
              )
            ),
            visibleFolders.length > 0
              ? h('div', { className: 'cs-lib-subfolders' },
                  visibleFolders.map((folder) => h('button', {
                    key: folder.id,
                    type: 'button',
                    className: 'cs-lib-subfolder',
                    onClick: () => setSelectedFolder(folder.id),
                  },
                    h('span', { className: 'cs-lib-subfolder-icon' }, h(FolderIcon, { size: 14 })),
                    h('span', { className: 'cs-lib-subfolder-name' }, folder.name),
                    h('span', { className: 'cs-lib-subfolder-count' }, folderSpaceCount(folder.id) + ' ' + t('spaces'))
                  ))
                )
              : null,
            visibleSpaces.length > 0
              ? h('div', { className: 'cs-lib-spaces' }, visibleSpaces.map(renderSpaceCard))
              : null,
            visibleSpaces.length === 0 && visibleFolders.length === 0
              ? h('div', { className: 'cs-lib-empty' },
                  h('div', { className: 'cs-lib-empty-title' }, searchActive ? t('noSearchResults') : t('emptyLibrary')),
                  h('div', { className: 'cs-lib-empty-text' }, searchActive ? t('noSearchResultsHint') : t('emptyLibraryHint')),
                  h('button', { type: 'button', className: 'cs-btn cs-btn-primary', onClick: openNewSpace }, t('newSpace'))
                )
              : null
          )
        ),
        settingsOpen ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setSettingsOpen(false) },
          h('div', { className: 'cs-lib-modal cs-settings-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('settings')),
            h('div', { className: 'cs-settings-list' },
              h('button', { type: 'button', className: 'cs-settings-row', onClick: () => { setSettingsOpen(false); setPrivacyOpen(true) } },
                h('span', { className: 'cs-settings-label' }, t('privacy')),
                h('span', { className: 'cs-settings-desc' }, t('privacySettingsDesc'))
              ),
              h('button', { type: 'button', className: 'cs-settings-row', onClick: () => { setSettingsOpen(false); openBackup() } },
                h('span', { className: 'cs-settings-label' }, t('backup')),
                h('span', { className: 'cs-settings-desc' }, t('backupSettingsDesc'))
              ),
              h('button', { type: 'button', className: 'cs-settings-row', onClick: () => { setSettingsOpen(false); openRecovery() } },
                h('span', { className: 'cs-settings-label' }, t('recovery')),
                h('span', { className: 'cs-settings-desc' }, t('recoverySettingsDesc'))
              ),
              h('div', { className: 'cs-settings-divider' }),
              h('button', { type: 'button', className: 'cs-settings-row', onClick: () => { if (libraryImportRef.current) libraryImportRef.current.click() } },
                h('span', { className: 'cs-settings-label' }, t('importLibrary')),
                h('span', { className: 'cs-settings-desc' }, t('importSettingsDesc'))
              ),
              h('button', { type: 'button', className: 'cs-settings-row', onClick: exportLibrary },
                h('span', { className: 'cs-settings-label' }, t('exportLibrary')),
                h('span', { className: 'cs-settings-desc' }, t('exportSettingsDesc'))
              )
            ),
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setSettingsOpen(false) }, t('close'))
            )
          )
        ) : null,
        recoveryOpen ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setRecoveryOpen(false) },
          h('div', { className: 'cs-lib-modal cs-recovery-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('recovery')),
            h('div', { className: 'cs-recovery-note' }, t('recoveryHint')),
            recoveryLoading
              ? h('div', { className: 'cs-lib-empty-text' }, t('loading'))
              : recoveryItems.length === 0
                ? h('div', { className: 'cs-lib-empty-text' }, t('noBackups'))
                : h('div', { className: 'cs-recovery-list' }, recoveryItems.map((item) => h('div', { key: item.kind + item.id + item.source, className: 'cs-recovery-row' },
                    h('div', { className: 'cs-recovery-info' },
                      h('div', { className: 'cs-recovery-title' }, item.kind === 'library' ? t('libraryBackup') : item.title),
                      h('div', { className: 'cs-recovery-meta' }, item.source + ' · ' + formatDate(item.modifiedAt) + ' · ' + formatBytes(item.bytes))
                    ),
                    h('button', { type: 'button', className: 'cs-lib-mini', onClick: () => restoreRecovery(item) }, t('restore'))
                  ))),
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setRecoveryOpen(false) }, t('close'))
            )
          )
        ) : null,
        privacyOpen ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setPrivacyOpen(false) },
          h('div', { className: 'cs-lib-modal cs-privacy-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('privacy')),
            h('div', { className: 'cs-privacy-body' },
              String(t('privacyBody')).split('\n\n').map((paragraph, index) => h('p', { key: 'privacy-' + index }, paragraph))
            ),
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setPrivacyOpen(false) }, t('close'))
            )
          )
        ) : null,
        backupOpen ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setBackupOpen(false) },
          h('div', { className: 'cs-lib-modal cs-backup-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('backup')),
            h('div', { className: 'cs-backup-note' }, t('backupHint')),
            h('label', { className: 'cs-backup-field' },
              h('span', null, t('backupRemote')),
              h('input', { className: 'cs-lib-input', value: backupRemote, placeholder: 'git@github.com:you/mica-space-backup.git', onChange: (event) => setBackupRemote(event.target.value) })
            ),
            h('label', { className: 'cs-backup-field' },
              h('span', null, t('backupBranch')),
              h('input', { className: 'cs-lib-input', value: backupBranch, placeholder: 'main', onChange: (event) => setBackupBranch(event.target.value) })
            ),
            backupResult ? h('div', { className: 'cs-backup-result' }, backupResult) : null,
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', disabled: backupBusy, onClick: saveBackupConfig }, t('save')),
              h('button', { type: 'button', className: 'cs-btn cs-btn-primary', disabled: backupBusy, onClick: runBackup }, t('backupNow')),
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setBackupOpen(false) }, t('close'))
            )
          )
        ) : null,
        trashOpen ? h('div', { className: 'cs-lib-modal-backdrop', onClick: () => setTrashOpen(false) },
          h('div', { className: 'cs-lib-modal cs-lib-trash-modal', onClick: (event) => event.stopPropagation() },
            h('div', { className: 'cs-lib-modal-title' }, t('trash')),
            h('div', { className: 'cs-lib-trash-list' },
              trashLoading
                ? h('div', { className: 'cs-lib-empty-text' }, t('loading'))
                : trashItems.length === 0
                  ? h('div', { className: 'cs-lib-empty-text' }, t('trashEmpty'))
                  : trashItems.map((item) => h('div', { key: item.file, className: 'cs-lib-trash-row' },
                      h('div', { className: 'cs-lib-trash-info' },
                        h('div', { className: 'cs-lib-trash-title' }, item.title || t('untitledSpace')),
                        h('div', { className: 'cs-lib-trash-meta' },
                          (item.deletedAt ? formatDate(item.deletedAt) : '') +
                          (item.folderId && folderById.get(item.folderId) ? ' · ' + folderById.get(item.folderId).name : '')
                        )
                      ),
                      h('button', { type: 'button', className: 'cs-lib-mini', disabled: busy, onClick: () => restoreTrashItem(item) }, t('restore')),
                      h('button', { type: 'button', className: 'cs-lib-mini cs-lib-mini-danger', disabled: busy, onClick: () => deleteTrashItem(item) }, t('deleteForever'))
                    ))
            ),
            h('div', { className: 'cs-lib-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setTrashOpen(false) }, t('close'))
            )
          )
        ) : null,
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
            h('div', { className: 'cs-lib-fixed-parent' },
              t('createInFolder') + '：' + (
                selectedFolder !== 'all' && selectedFolder !== 'none'
                  ? ((folderById.get(selectedFolder) && folderById.get(selectedFolder).name) || t('rootFolder'))
                  : t('rootFolder')
              )
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
      const [memoryOpen, setMemoryOpen] = useState(false)
      const [marquee, setMarquee] = useState(null)
      const [selectedTurn, setSelectedTurn] = useState(null)
      const [contextMenu, setContextMenu] = useState(null)
      useEffect(() => {
        const closeContext = (event) => {
          if (!contextMenu) return
          const target = event.target
          if (target && target.closest && target.closest('.cs-context-menu')) return
          setContextMenu(null)
        }
        const onEscape = (event) => {
          if (event.key !== 'Escape') return
          setSelectedIds(new Set())
          setSelectedTurn(null)
          setMarquee(null)
          setSelection(null)
          setContextMenu(null)
        }
        window.addEventListener('pointerdown', closeContext, true)
        window.addEventListener('keydown', onEscape)
        return () => {
          window.removeEventListener('pointerdown', closeContext, true)
          window.removeEventListener('keydown', onEscape)
        }
      }, [contextMenu])
      const [quoteDraft, setQuoteDraft] = useState(null)
      const [selectedIds, setSelectedIds] = useState(() => new Set())
      const [anchorReveal, setAnchorReveal] = useState(null)
      const [undoCount, setUndoCount] = useState(0)
      const layoutTurns = space && space.main ? space.main.turns : null
      const layoutBranches = space ? space.branches : null
      const layoutModeForMemo = space && space.layoutMode === 'horizontal' ? 'horizontal' : 'vertical'
      const memoryMode = space && space.memoryMode === 'semantic' ? 'semantic' : 'lexical'
      const summaryMode = space && space.summaryMode === 'every3' ? 'every3' : space && space.summaryMode === 'off' ? 'off' : 'every'
      const layoutMemo = useMemo(
        () => (layoutTurns ? buildPositions(layoutTurns, layoutBranches || [], layoutModeForMemo) : null),
        [layoutTurns, layoutBranches, layoutModeForMemo]
      )

      const spaceRef = useRef(null)
      const viewportRef = useRef(null)
      const rootRef = useRef(null)
      const saveTimerRef = useRef(null)
      const streamsRef = useRef(new Map())
      const loadedRef = useRef(false)
      const panRef = useRef(null)
      const marqueeRef = useRef(null)
      const touchPointersRef = useRef(new Map())
      const pinchRef = useRef(null)
      const fitViewRef = useRef(null)
      const alignedSpaceRef = useRef('')
      const highlightTimerRef = useRef(null)
      const draftQuestionRef = useRef(null)
      const suppressSelectionClearRef = useRef(false)
      const dragRef = useRef(null)
      const summaryRequestsRef = useRef(new Set())
      const zCounterRef = useRef(0)
      const historyRef = useRef([])
      const undoRef = useRef(null)
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
          const snapshot = spaceRef.current
          const savedSpace = { ...snapshot, id: spaceId || snapshot.id, memory: buildContextMemory(snapshot) }
          const response = await fetch(API + '/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ space: savedSpace, spaceId: spaceId || snapshot.id }),
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
        if (loadState !== 'ready' || !spaceRef.current) return
        if (alignedSpaceRef.current === spaceId) return
        const element = viewportRef.current
        if (!element) return
        const width = element.clientWidth
        const height = element.clientHeight
        if (!width || !height) return
        const current = spaceRef.current
        const currentView = current.view || { x: 120, y: 120, zoom: 1 }
        const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentView.zoom || 1))
        let x = currentView.x
        let y = currentView.y
        if (current.layoutMode === 'horizontal') {
          const axisY = TOP_PAD + MAIN_H / 2
          y = height / 2 - axisY * zoom
          const guideY = y + axisY * zoom
          const dotY = 12 + Math.round((guideY - 12) / 24) * 24
          y += dotY - guideY
        } else {
          const axisX = MAIN_W / 2
          x = width / 2 - axisX * zoom
          const guideX = x + axisX * zoom
          const dotX = 12 + Math.round((guideX - 12) / 24) * 24
          x += dotX - guideX
        }
        alignedSpaceRef.current = spaceId
        if (Math.abs(x - currentView.x) < 0.1 && Math.abs(y - currentView.y) < 0.1) return
        commit((previous) => ({ ...previous, view: { ...currentView, x, y } }))
        saveSoon(500)
      }, [loadState, spaceId, commit, saveSoon])

      useEffect(() => {
        writeJsonStorage(DRAFT_KEY, draft)
      }, [draft])

      useEffect(() => {
        const onUndoKey = (event) => {
          if (!(event.ctrlKey || event.metaKey) || event.shiftKey) return
          if (String(event.key || '').toLowerCase() !== 'z') return
          const target = event.target
          const tag = target && target.tagName ? String(target.tagName).toLowerCase() : ''
          if (tag === 'input' || tag === 'textarea' || (target && target.isContentEditable)) return
          if (!undoRef.current) return
          event.preventDefault()
          undoRef.current()
        }
        window.addEventListener('keydown', onUndoKey)
        return () => window.removeEventListener('keydown', onUndoKey)
      }, [])

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
          if (!event.altKey && selectedTurn && card && card.getAttribute('data-turn-id') === selectedTurn.turnId) {
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
      const layout = layoutMemo || buildPositions(mainTurns, branches, layoutMode)
      const lineZoom = Math.max(0.01, Math.min(1, view.zoom))
      const mainLineWidth = 5 + (1 - lineZoom) * 5
      const branchLineWidth = 2 + (1 - lineZoom) * 3
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
        const visibleTurns = branch.collapsed ? branch.turns.slice(0, 1) : branch.turns
        const first = visibleTurns.length > 0 ? visibleTurns[0] : null
        if (first) {
          const side = position.side || 'left'
          const anchorSide = side === 'left' ? 'right' : side === 'right' ? 'left' : side === 'top' ? 'bottom' : 'top'
          addPort(branch.anchorTurnId, anchorSide)
          addPort(first.id, side)
        }
        for (let index = 1; index < visibleTurns.length; index += 1) {
          addPort(visibleTurns[index - 1].id, 'bottom')
          addPort(visibleTurns[index].id, 'top')
        }
      }
      const detail = view.zoom >= 0.25 ? 'full' : 'dot'
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
        Boolean(quoteDraft || selectedBranch || selectedMain) || (!selectedTurn && mainTurns.length === 0)
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
      undoRef.current = undo


      const copyText = async (text) => {
        try {
          await navigator.clipboard.writeText(text)
        } catch (_error) {
          const area = document.createElement('textarea')
          area.value = text
          area.style.position = 'fixed'
          area.style.opacity = '0'
          document.body.appendChild(area)
          area.select()
          try { document.execCommand('copy') } catch (_copyError) {}
          area.remove()
        }
        setToast({ text: t('copied') })
      }

      const openCardContextMenu = (event, turn, kind, branchId) => {
        event.preventDefault()
        event.stopPropagation()
        const menuWidth = 210
        const menuHeight = 300
        const ids = selectedIds.has(turn.id) && selectedIds.size > 1 ? [...selectedIds] : [turn.id]
        setSelectedIds(new Set(ids))
        setSelectedTurn(null)
        setContextMenu({
          turn,
          kind,
          branchId,
          ids,
          x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth)),
          y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight)),
        })
      }

      const contextCopySelected = () => {
        if (!contextMenu) return
        const entries = []
        for (const turn of mainTurns) entries.push({ turn, kind: 'main', branchId: null })
        for (const branch of branches) for (const turn of branch.turns) entries.push({ turn, kind: 'branch', branchId: branch.id })
        const selected = entries.filter((entry) => contextMenu.ids.indexOf(entry.turn.id) >= 0)
        const markdown = selected.map((entry) => '## ' + String(entry.turn.question || '') + '\n\n' + String(entry.turn.answer || '')).join('\n\n---\n\n')
        setContextMenu(null)
        copyText(markdown)
      }

      const contextDeleteSelected = () => {
        if (!contextMenu) return
        const snapshot = spaceRef.current
        if (!snapshot) return
        const keep = new Set(contextMenu.ids)
        const removedTurns = new Set(keep)
        const removedBranches = new Set()
        let changed = true
        while (changed) {
          changed = false
          for (const branch of snapshot.branches) {
            if (removedBranches.has(branch.id)) {
              for (const turn of branch.turns) removedTurns.add(turn.id)
              continue
            }
            const allTurnsRemoved = branch.turns.length > 0 && branch.turns.every((turn) => removedTurns.has(turn.id))
            const parentRemoved = branch.parentBranchId && removedBranches.has(branch.parentBranchId)
            const anchorRemoved = removedTurns.has(branch.anchorTurnId)
            if (allTurnsRemoved || parentRemoved || anchorRemoved) {
              removedBranches.add(branch.id)
              for (const turn of branch.turns) removedTurns.add(turn.id)
              changed = true
            }
          }
        }
        if (removedBranches.size > 0 && !window.confirm(t('confirmDeleteBranch'))) return
        pushHistory(snapshot)
        setSelectedTurn(null)
        setSelectedIds(new Set())
        for (const id of removedTurns) stopTurn(id)
        const next = {
          ...snapshot,
          main: { ...snapshot.main, turns: snapshot.main.turns.filter((turn) => !removedTurns.has(turn.id)) },
          branches: snapshot.branches
            .filter((branch) => !removedBranches.has(branch.id))
            .map((branch) => ({ ...branch, turns: branch.turns.filter((turn) => !removedTurns.has(turn.id)) })),
        }
        setContextMenu(null)
        commit(next)
        saveSoon(80)
        setToast({ text: t('deleted') })
      }

      const contextToggleCollapse = () => {
        if (!contextMenu || !contextMenu.branchId) return
        const branchId = contextMenu.branchId
        setContextMenu(null)
        toggleBranchCollapse(branchId)
      }

      const contextSetColor = (colorIndex) => {
        if (!contextMenu || !contextMenu.branchId) return
        const branchId = contextMenu.branchId
        setContextMenu(null)
        setBranchColor(branchId, colorIndex)
      }

      const contextSetTag = () => {
        if (!contextMenu || !contextMenu.branchId) return
        const branch = branches.find((item) => item.id === contextMenu.branchId)
        if (!branch) return
        const next = window.prompt(t('branchTag'), branch.tag || '')
        if (next === null) return
        setContextMenu(null)
        setBranchTag(branch.id, next)
      }

      const contextToggle = (field) => {
        if (!contextMenu) return
        const { turn, kind, branchId } = contextMenu
        setContextMenu(null)
        toggleMark(turn, kind, branchId, field, !turn[field])
      }

      const contextRetry = () => {
        if (!contextMenu) return
        const { turn, kind, branchId } = contextMenu
        setContextMenu(null)
        retryTurn(kind, branchId, turn.id)
      }

      const contextCopy = (mode) => {
        if (!contextMenu) return
        const { turn } = contextMenu
        const question = String(turn.question || '')
        const answer = String(turn.answer || '')
        const markdown = mode === 'markdown'
          ? ('## Question\n\n' + question + '\n\n## Answer\n\n' + answer)
          : ('Q: ' + question + '\n\nA: ' + answer)
        setContextMenu(null)
        copyText(mode === 'question' ? question : mode === 'answer' ? answer : markdown)
      }

      const contextQuote = () => {
        if (!contextMenu) return
        const { turn, kind, branchId } = contextMenu
        setContextMenu(null)
        openDraftFor(turn.id, turn.answer || '', kind === 'branch' ? branchId : null, 'answer')
      }

      const contextDelete = () => {
        if (!contextMenu) return
        const { turn, kind, branchId } = contextMenu
        setContextMenu(null)
        deleteTurn(kind, branchId, turn.id)
      }

      const toggleBranchCollapse = (branchId) => {
        pushHistory()
        commit((previous) => ({
          ...previous,
          branches: previous.branches.map((branch) => (
            branch.id === branchId ? { ...branch, collapsed: !branch.collapsed } : branch
          )),
        }))
        saveSoon(100)
      }

      const setBranchColor = (branchId, colorIndex) => {
        pushHistory()
        commit((previous) => ({
          ...previous,
          branches: previous.branches.map((branch) => (
            branch.id === branchId ? { ...branch, colorIndex } : branch
          )),
        }))
        saveSoon(100)
      }

      const touchRetrievedMemory = (retrieved) => {
        const ids = new Set((Array.isArray(retrieved) ? retrieved : []).flatMap((item) => (
          Array.isArray(item && item.sourceTurnIds) ? item.sourceTurnIds : []
        )))
        if (ids.size === 0) return
        commit((previous) => {
          if (!previous.memory || !Array.isArray(previous.memory.items)) return previous
          const now = Date.now()
          return {
            ...previous,
            memory: {
              ...previous.memory,
              items: previous.memory.items.map((item) => (
                item && ids.has(item.turnId) ? { ...item, lastUsedAt: now } : item
              )),
            },
          }
        })
        saveSoon(250)
      }

      const setBranchTag = (branchId, tag) => {
        pushHistory()
        commit((previous) => ({
          ...previous,
          branches: previous.branches.map((branch) => (
            branch.id === branchId ? { ...branch, tag: String(tag || '').slice(0, 20) } : branch
          )),
        }))
        saveSoon(100)
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
          snapped: kind === 'main' && Math.abs((layoutMode === 'horizontal' ? rect.y + rect.h / 2 : rect.x + rect.w / 2) - (layoutMode === 'horizontal' ? TOP_PAD + MAIN_H / 2 : MAIN_W / 2)) * Math.max(view.zoom, 0.01) <= 3,
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
          snapped: kind === 'main' && Math.abs((layoutMode === 'horizontal' ? rect.y + rect.h / 2 : rect.x + rect.w / 2) - (layoutMode === 'horizontal' ? TOP_PAD + MAIN_H / 2 : MAIN_W / 2)) * Math.max(view.zoom, 0.01) <= 3,
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
              const axis = TOP_PAD + MAIN_H / 2
              if (Math.abs(center - axis) < snapDistance) appliedDy = axis - (target.rect.y + target.rect.h / 2)
            } else {
              const center = target.rect.x + target.rect.w / 2 + appliedDx
              const axis = MAIN_W / 2
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
        const resizedW = clamp(drag.rect.w + dx, MIN_CARD_W, MAX_CARD_W)
        const resizedH = clamp(drag.rect.h + dy, MIN_CARD_H, MAX_CARD_H)
        const layout = drag.mode === 'resize'
          ? {
              dx: drag.rect.x - drag.baseX,
              dy: drag.rect.y - drag.baseY,
              w: resizedW,
              h: resizedH,
            }
          : {
              dx: drag.rect.x - drag.baseX + dx,
              dy: drag.rect.y - drag.baseY + dy,
              w: drag.rect.w,
              h: drag.rect.h,
            }
        if (drag.mode === 'resize') drag.lastResize = { ...layout }
        updateTurn(drag.kind, drag.branchId, drag.turnId, { layout })
        saveSoon(600)
      }

      const endTurnFrame = (event) => {
        const drag = dragRef.current
        if (!drag) return
        dragRef.current = null
        if (drag.mode === 'resize' && drag.kind === 'main' && drag.lastResize) {
          const layout = { ...drag.lastResize }
          if (layoutMode === 'horizontal') {
            const axis = TOP_PAD + MAIN_H / 2
            layout.dy += axis - (drag.baseY + layout.dy + layout.h / 2)
          } else {
            const axis = MAIN_W / 2
            layout.dx += axis - (drag.baseX + layout.dx + layout.w / 2)
          }
          updateTurn('main', null, drag.turnId, { layout })
        }
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
                  if (summaryMode === 'every' || (summaryMode === 'every3' && (() => {
                    const currentTurns = [
                      ...(spaceRef.current && spaceRef.current.main ? spaceRef.current.main.turns : []),
                      ...(spaceRef.current && Array.isArray(spaceRef.current.branches) ? spaceRef.current.branches.flatMap((branch) => branch.turns) : []),
                    ]
                    return (currentTurns.filter((turn) => turn.status === 'completed' || turn.status === 'cancelled').length + 1) % 3 === 0
                  })())) {
                    requestSummary({ id: turnId, question: payload.question, answer, summary: '' }, kind, branchId)
                  }
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


      const setSummaryMode = (mode) => {
        pushHistory()
        commit((previous) => ({
          ...previous,
          summaryMode: mode === 'every3' ? 'every3' : mode === 'off' ? 'off' : 'every',
        }))
        saveSoon(120)
      }

      const setMemoryMode = (mode) => {
        pushHistory()
        commit((previous) => ({
          ...previous,
          memoryMode: mode === 'semantic' ? 'semantic' : 'lexical',
        }))
        setMemoryOpen(false)
        saveSoon(120)
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

      const startTurn = ({ kind, branch, branchId, question, attachments, retryTurnId, branchIndex, skipHistory }) => {
        const targetBranch = kind === 'branch'
          ? (branch || (spaceRef.current ? spaceRef.current.branches.find((item) => item.id === branchId) : null))
          : null
        if (kind === 'branch' && !targetBranch) return
        if (!skipHistory) pushHistory()

        const currentTurns = kind === 'main'
          ? (spaceRef.current ? spaceRef.current.main.turns : mainTurns)
          : targetBranch.turns
        const previousTurn = retryTurnId ? currentTurns.find((turn) => turn.id === retryTurnId) : null
        const turnAttachments = Array.isArray(attachments)
          ? attachments
          : (previousTurn && Array.isArray(previousTurn.attachments) ? previousTurn.attachments : [])
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
            attachments: turnAttachments,
          })
        } else {
          zCounterRef.current += 1
          const turn = { id: turnId, question, answer: '', status: 'streaming', error: '', createdAt: Date.now(), usage: null, z: zCounterRef.current, todo: false, flag: false, attachments: turnAttachments }
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
        const memory = buildContextMemory(currentSpace)
        const retrieved = buildRetrieval(currentSpace, question)
        touchRetrievedMemory(retrieved)
        const payload = {
          kind,
          branchId: targetBranch ? targetBranch.id : null,
          question,
          history,
          memory,
          retrieved,
          anchorText,
          brief,
          mainContext,
          branchDigest,
          mainDigest,
          attachments: turnAttachments,
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
          startTurn({ kind, question: turn.question, retryTurnId: turnId, attachments: turn.attachments })
        } else {
          const branch = current.branches.find((item) => item.id === branchId)
          if (!branch) return
          const turn = branch.turns.find((item) => item.id === turnId)
          if (!turn) return
          startTurn({ kind, branchId, question: turn.question, retryTurnId: turnId, attachments: turn.attachments })
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
        setQuoteDraft({
          anchorTurnId: turnId,
          anchorText: text,
          anchorSource: anchorSource || 'selection',
          parentBranchId: parentBranchId || null,
        })
        setDraft(null)
        setSelection(null)
      }

      const openBranchDraft = () => {
        if (!selection) return
        openDraftFor(selection.turnId, selection.text, selection.branchId)
      }

      const submitQuote = (question, attachments) => {
        if (!quoteDraft) return
        const text = String(question || '').trim()
        if (!text) return
        const current = spaceRef.current
        if (!current) return
        const branch = {
          id: uid('branch'),
          anchorTurnId: quoteDraft.anchorTurnId,
          anchorText: quoteDraft.anchorText,
          anchorSource: quoteDraft.anchorSource || 'selection',
          parentBranchId: quoteDraft.parentBranchId || null,
          colorIndex: nextColorIndex(current.branches),
          brief: '',
          createdAt: Date.now(),
          turns: [],
        }
        pushHistory()
        setQuoteDraft(null)
        commit((previous) => ({ ...previous, branches: [...previous.branches, branch] }))
        startTurn({ kind: 'branch', branch, branchId: branch.id, question: text, attachments, skipHistory: true })
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
        if (event.pointerType === 'touch') {
          event.preventDefault()
          setSelection(null)
          setSelectedTurn(null)
          touchPointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
          try { event.currentTarget.setPointerCapture(event.pointerId) } catch (_error) {}
          if (touchPointersRef.current.size === 1) {
            const current = spaceRef.current && spaceRef.current.view ? spaceRef.current.view : view
            panRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: current.x, y: current.y }
            marqueeRef.current = null
          } else if (touchPointersRef.current.size === 2) {
            const points = [...touchPointersRef.current.values()]
            const current = spaceRef.current && spaceRef.current.view ? spaceRef.current.view : view
            const viewport = event.currentTarget.getBoundingClientRect()
            const distance = Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y))
            const center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 }
            panRef.current = null
            marqueeRef.current = null
            pinchRef.current = {
              distance,
              startZoom: current.zoom,
              center,
              viewport,
              worldX: (center.x - viewport.left - current.x) / current.zoom,
              worldY: (center.y - viewport.top - current.y) / current.zoom,
            }
          }
          return
        }
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
        if (event.pointerType === 'touch' && touchPointersRef.current.has(event.pointerId)) {
          touchPointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
          const pinch = pinchRef.current
          if (pinch && touchPointersRef.current.size >= 2) {
            event.preventDefault()
            const points = [...touchPointersRef.current.values()].slice(0, 2)
            const distance = Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y))
            const center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 }
            const zoom = clamp(pinch.startZoom * (distance / pinch.distance), MIN_ZOOM, MAX_ZOOM)
            commit((previous) => ({
              ...previous,
              view: {
                ...previous.view,
                zoom,
                x: center.x - pinch.viewport.left - pinch.worldX * zoom,
                y: center.y - pinch.viewport.top - pinch.worldY * zoom,
              },
            }))
            return
          }
        }
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
        if (event.pointerType === 'touch') {
          touchPointersRef.current.delete(event.pointerId)
          if (touchPointersRef.current.size < 2) pinchRef.current = null
          if (touchPointersRef.current.size === 0) {
            panRef.current = null
            saveSoon(300)
          }
          try { event.currentTarget.releasePointerCapture(event.pointerId) } catch (_error) {}
          return
        }
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
        const dotMode = view.zoom < 0.25
        const centerOf = (rect) => ({ x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 })
        const centerPath = (left, right) => {
          const a = centerOf(left)
          const b = centerOf(right)
          return 'M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y
        }
        const allCardRects = [...turnRects.entries()].map(([id, rect]) => ({ id, ...rect }))
        const mainRects = mainTurns.map((turn) => turnRects.get(turn.id)).filter(Boolean)
        for (let index = 1; index < mainRects.length; index += 1) {
          paths.push(h('path', {
            key: 'main-' + index,
            className: 'cs-link-main',
            style: { stroke: MAIN_COLOR, strokeWidth: mainLineWidth },
            d: dotMode
              ? centerPath(mainRects[index - 1], mainRects[index])
              : curvePorts(
                  mainRects[index - 1],
                  layoutMode === 'horizontal' ? 'right' : 'bottom',
                  mainRects[index],
                  layoutMode === 'horizontal' ? 'left' : 'top'
                ),
          }))
        }
        for (const position of branchPositions) {
          const branch = position.branch
          const visibleTurns = branch.collapsed ? branch.turns.slice(0, 1) : branch.turns
          const anchor = turnRects.get(branch.anchorTurnId)
          const first = visibleTurns.length > 0 ? turnRects.get(visibleTurns[0].id) : null
          if (anchor && first) {
            const side = position.side || 'left'
            const anchorSide = side === 'left' ? 'right' : side === 'right' ? 'left' : side === 'top' ? 'bottom' : 'top'
            const a = sidePoint(anchor, anchorSide)
            const b = sidePoint(first, side)
            const d = dotMode ? centerPath(anchor, first) : curvePorts(anchor, anchorSide, first, side)
            paths.push(h('path', {
              key: 'edge-' + branch.id,
              className: 'cs-link-branch',
              style: { stroke: position.color, strokeWidth: branchLineWidth },
              d,
            }))
          }
          for (let index = 1; index < visibleTurns.length; index += 1) {
            const a = turnRects.get(visibleTurns[index - 1].id)
            const b = turnRects.get(visibleTurns[index].id)
            if (!a || !b) continue
            paths.push(h('path', {
              key: 'spine-' + branch.id + '-' + index,
              className: 'cs-link-branch-spine',
              style: { stroke: position.color, strokeWidth: branchLineWidth },
              d: dotMode ? centerPath(a, b) : curvePorts(a, 'bottom', b, 'top'),
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
            className: cx('cs-node', detail === 'dot' ? 'cs-detail-dot' : 'cs-detail-full', focusIds.has(turn.id) ? 'cs-focus-card' : ''),
            style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: turn.z || 0 },
          }, [
            h(Dot, {
                key: 'dot',
                kind: 'main',
                flagged: Boolean(turn.flag),
                pending: Boolean(turn.todo),
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
              }),
            h(TurnCard, {
                key: 'card',
                t,
                turn,
                kind: 'main',
                branch: null,
                isFirst: false,
                detail: 'full',
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
                onContextMenu: (event) => openCardContextMenu(event, turn, 'main', null),
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
        const visibleTurns = branch.collapsed ? branch.turns.slice(0, 1) : branch.turns
        const hiddenCount = branch.turns.length - visibleTurns.length
        const nodes = visibleTurns.map((turn, index) => {
          const rect = turnRects.get(turn.id)
          if (!rect) return null
          return h('div', {
            key: turn.id,
            className: cx('cs-node', detail === 'dot' ? 'cs-detail-dot' : 'cs-detail-full', focusIds.has(turn.id) ? 'cs-focus-card' : ''),
            style: { left: rect.x - position.x, top: rect.y - position.y, width: rect.w, height: rect.h, zIndex: turn.z || 0 },
          }, [
            h(Dot, {
                key: 'dot',
                kind: 'branch',
                flagged: Boolean(turn.flag),
                pending: Boolean(turn.todo),
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
              }),
            h(TurnCard, {
                key: 'card',
                t,
                turn,
                kind: 'branch',
                branch,
                isFirst: index === 0,
                detail: 'full',
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
                tag: branch.tag,
                collapsed: Boolean(branch.collapsed),
                hiddenCount,
                onToggleCollapse: () => toggleBranchCollapse(branch.id),
                onToggleTodo: (value) => toggleMark(turn, 'branch', branch.id, 'todo', value),
                onToggleFlag: (value) => toggleMark(turn, 'branch', branch.id, 'flag', value),
                onCardPointerDown: (event) => beginCardPress(event, turn, 'branch', branch.id, position.x, position.y + index * TURN_STEP, rect),
                onCardPointerMove: moveCardPress,
                onCardPointerUp: endCardPress,
                onCardPointerCancel: endCardPress,
                onCardClick: (event) => handleCardClick(event, turn, 'branch', branch.id),
                onCardDoubleClick: (event) => handleCardDoubleClick(event, turn, 'branch', branch.id),
                onContextMenu: (event) => openCardContextMenu(event, turn, 'branch', branch.id),
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
        const quote = quoteDraft
        return h('div', { className: 'cs-bottom-composer' },
          h('div', { className: 'cs-bottom-label' }, quote ? t('quoteFollowUp') : branch ? t('continueBranch') : t('continueMain')),
          quote
            ? h('div', { className: 'cs-composer-quote' },
                h('span', { className: 'cs-quote-line', 'aria-hidden': true }),
                h('span', { className: 'cs-composer-quote-text', title: quote.anchorText }, truncate(quote.anchorText, 260)),
                h('button', {
                  type: 'button',
                  className: 'cs-composer-quote-remove',
                  title: t('removeQuote'),
                  onClick: () => setQuoteDraft(null),
                }, '×')
              )
            : null,
          h(Composer, {
            t,
            placeholder: quote ? t('quotePlaceholder') : branch ? t('branchPlaceholder') : t('mainPlaceholder'),
            busy: composerBusy,
            autoFocus: Boolean(quote) || (!selectedTurn && mainTurns.length === 0),
            storageKey: quote ? COMPOSER_PREFIX + 'quote' : branch ? COMPOSER_PREFIX + 'branch:' + branch.id : COMPOSER_PREFIX + 'main',
            onSend: (question, attachments) => {
              if (quote) {
                submitQuote(question, attachments)
                return
              }
              if (branch) startTurn({ kind: 'branch', branch, branchId: branch.id, question, attachments })
              else startTurn({ kind: 'main', question, attachments })
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

      const renderPendingMarkers = () => {
        const viewport = viewportRef.current
        if (!viewport) return null
        const width = viewport.clientWidth
        const height = viewport.clientHeight
        if (width <= 0 || height <= 0) return null
        const padding = 24
        const entries = [
          ...mainTurns.map((turn) => ({ turn, kind: 'main', branchId: null })),
          ...branches.flatMap((branch) => branch.turns
            .filter((turn, index) => !branch.collapsed || index === 0)
            .map((turn) => ({ turn, kind: 'branch', branchId: branch.id }))),
        ]
        const groups = new Map()
        for (const entry of entries) {
          if (!entry.turn.todo) continue
          const rect = turnRects.get(entry.turn.id)
          if (!rect) continue
          const left = view.x + rect.x * view.zoom
          const top = view.y + rect.y * view.zoom
          const right = left + rect.w * view.zoom
          const bottom = top + rect.h * view.zoom
          if (right >= 0 && left <= width && bottom >= 0 && top <= height) continue
          const cardX = left + (rect.w * view.zoom) / 2
          const cardY = top + (rect.h * view.zoom) / 2
          const dx = cardX - width / 2
          const dy = cardY - height / 2
          if (dx === 0 && dy === 0) continue
          let side
          let coord
          if (Math.abs(dx) >= Math.abs(dy)) {
            side = dx > 0 ? 'right' : 'left'
            coord = cardY
          } else {
            side = dy > 0 ? 'bottom' : 'top'
            coord = cardX
          }
          if (!groups.has(side)) groups.set(side, [])
          groups.get(side).push({ entry, coord })
        }
        const markers = []
        for (const [side, items] of groups) {
          items.sort((left, right) => left.coord - right.coord)
          const count = items.length
          const average = items.reduce((sum, item) => sum + item.coord, 0) / count
          let markerX = width / 2
          let markerY = height / 2
          if (side === 'top' || side === 'bottom') {
            markerX = Math.max(padding, Math.min(width - padding, average))
            markerY = side === 'top' ? padding : height - padding
          } else {
            markerX = side === 'left' ? padding : width - padding
            markerY = Math.max(padding, Math.min(height - padding, average))
          }
          const titles = items.map((item) => truncate(item.entry.turn.question, 50)).join(' / ')
          markers.push(h('button', {
            key: 'pending-' + side,
            type: 'button',
            className: 'cs-pending-marker',
            style: { left: markerX, top: markerY },
            title: (count > 1 ? t('pendingCount').replace('{n}', String(count)) + '：' : t('todo') + '：') + titles,
            onPointerDown: (event) => event.stopPropagation(),
            onClick: (event) => { event.stopPropagation(); focusTurn(items[0].entry.turn.id) },
          },
            h('span', null, '!'),
            count > 1 ? h('span', { className: 'cs-pending-count' }, String(count)) : null
          ))
        }
        return markers.length > 0 ? h('div', { className: 'cs-pending-layer' }, markers) : null
      }

      const renderContextMenu = () => {
        if (!contextMenu) return null
        return h('div', {
          className: 'cs-context-layer',
          onMouseDown: () => setContextMenu(null),
          onContextMenu: (event) => event.preventDefault(),
        },
          h('div', {
            className: 'cs-context-menu',
            style: { left: contextMenu.x, top: contextMenu.y },
            onMouseDown: (event) => event.stopPropagation(),
          },
            contextMenu.ids.length > 1
              ? h('button', { type: 'button', onClick: contextCopySelected }, t('copySelected') + ' (' + contextMenu.ids.length + ')')
              : null,
            h('button', { type: 'button', onClick: () => contextCopy('question') }, t('copyQuestion')),
            h('button', { type: 'button', onClick: () => contextCopy('answer') }, t('copyAnswer')),
            h('button', { type: 'button', onClick: () => contextCopy('both') }, t('copyBoth')),
            h('button', { type: 'button', onClick: () => contextCopy('markdown') }, t('copyMarkdown')),
            h('div', { className: 'cs-context-divider' }),
            contextMenu.turn.status === 'failed'
              ? h('button', { type: 'button', onClick: contextRetry }, t('retry'))
              : null,
            h('button', { type: 'button', onClick: () => contextToggle('todo') }, contextMenu.turn.todo ? t('clearTodo') : t('markTodo')),
            h('button', { type: 'button', onClick: () => contextToggle('flag') }, contextMenu.turn.flag ? t('clearFlag') : t('markFlag')),
            contextMenu.branchId
              ? h('button', { type: 'button', onClick: contextToggleCollapse }, (branches.find((branch) => branch.id === contextMenu.branchId) || {}).collapsed ? t('expandBranch') : t('collapseBranch'))
              : null,
            contextMenu.branchId
              ? h('div', null,
                  h('div', { className: 'cs-context-label' }, t('branchColor')),
                  h('div', { className: 'cs-context-swatches' },
                    MINERAL_COLORS.map((color, index) => h('button', {
                      key: 'color-' + index,
                      type: 'button',
                      className: 'cs-context-swatch',
                      style: { background: color },
                      title: t('branchColor') + ' ' + (index + 1),
                      onClick: () => contextSetColor(index),
                    }))
                  )
                )
              : null,
            contextMenu.branchId
              ? h('button', { type: 'button', onClick: contextSetTag }, t('branchTag'))
              : null,
            h('button', { type: 'button', onClick: contextQuote }, t('contextQuote')),
            h('div', { className: 'cs-context-divider' }),
            contextMenu.ids.length > 1
              ? h('button', { type: 'button', className: 'cs-context-danger', onClick: contextDeleteSelected }, t('deleteSelected') + ' (' + contextMenu.ids.length + ')')
              : null,
            h('button', { type: 'button', className: 'cs-context-danger', onClick: contextDelete }, contextMenu.ids.length > 1 ? t('deleteOne') : t('delete'))
          )
        )
      }

      const renderMemorySettings = () => {
        if (!memoryOpen) return null
        return h('div', {
          className: 'cs-modal-backdrop',
          style: { zIndex: 3100 },
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) setMemoryOpen(false)
          },
        },
          h('div', { className: 'cs-modal cs-memory-modal', role: 'dialog', 'aria-modal': 'true' },
            h('div', { className: 'cs-modal-title' }, t('memory')),
            h('div', { className: 'cs-memory-note' }, t('memoryHint')),
            h('button', {
              type: 'button',
              className: cx('cs-memory-option', memoryMode === 'lexical' ? 'cs-memory-active' : ''),
              onClick: () => setMemoryMode('lexical'),
            },
              h('strong', null, t('memoryLexical')),
              h('span', null, t('memoryLexicalHint'))
            ),
            h('button', {
              type: 'button',
              className: cx('cs-memory-option', memoryMode === 'semantic' ? 'cs-memory-active' : ''),
              onClick: () => setMemoryMode('semantic'),
            },
              h('strong', null, t('memorySemantic')),
              h('span', null, t('memorySemanticHint'))
            ),
            h('div', { className: 'cs-memory-section' },
              h('strong', null, t('summaryFrequency')),
              h('div', { className: 'cs-memory-chips' },
                h('button', { type: 'button', className: cx('cs-memory-chip', summaryMode === 'every' ? 'cs-memory-active' : ''), onClick: () => setSummaryMode('every') }, t('summaryEvery')),
                h('button', { type: 'button', className: cx('cs-memory-chip', summaryMode === 'every3' ? 'cs-memory-active' : ''), onClick: () => setSummaryMode('every3') }, t('summaryEvery3')),
                h('button', { type: 'button', className: cx('cs-memory-chip', summaryMode === 'off' ? 'cs-memory-active' : ''), onClick: () => setSummaryMode('off') }, t('summaryOff'))
              )
            ),
            h('div', { className: 'cs-modal-actions' },
              h('button', { type: 'button', className: 'cs-btn', onClick: () => setMemoryOpen(false) }, t('close'))
            )
          )
        )
      }

      const renderLayers = () => {
        if (!layersOpen) return null
        const branchesByAnchor = new Map()
        for (const branch of branches) {
          const key = branch.anchorTurnId
          if (!branchesByAnchor.has(key)) branchesByAnchor.set(key, [])
          branchesByAnchor.get(key).push(branch)
        }
        const branchNumber = new Map(branches.map((branch, index) => [branch.id, index + 1]))
        const jumpToLayerTurn = (turn, kind, branchId) => {
          bringToFront(turn, kind, branchId)
          setSelectedIds(new Set([turn.id]))
          setSelectedTurn(null)
          focusTurn(turn.id)
          setLayersOpen(false)
        }
        const renderLayerTurn = (turn, kind, branchId, sequence) => {
          const children = branchesByAnchor.get(turn.id) || []
          const color = kind === 'main' ? MAIN_COLOR : ((positions.get(branchId) || {}).color || MAIN_COLOR)
          return h('div', { key: 'layer-turn-' + turn.id, className: 'cs-layer-tree-group' },
            h('button', {
              type: 'button',
              className: 'cs-layer-tree-row',
              onClick: () => jumpToLayerTurn(turn, kind, branchId),
            },
              h('span', { className: 'cs-layer-dot', style: { background: color } }),
              h('span', { className: 'cs-layer-tag' }, kind === 'main' ? t('main') : t('branch')),
              sequence ? h('span', { className: 'cs-layer-seq' }, sequence) : null,
              h('span', { className: 'cs-layer-q' }, truncate(turn.question, 90))
            ),
            children.length > 0
              ? h('div', { className: 'cs-layer-children' },
                  children.map((branch) => renderLayerBranch(branch, kind !== 'main')))
              : null
          )
        }
        const renderLayerBranch = (branch, isSub) => {
          const color = (positions.get(branch.id) || {}).color || MAIN_COLOR
          const first = branch.turns[0]
          const number = branchNumber.get(branch.id) || '?'
          return h('div', { key: 'layer-branch-' + branch.id, className: 'cs-layer-tree-group' },
            h('button', {
              type: 'button',
              className: 'cs-layer-tree-row cs-layer-branch-row',
              onClick: first ? () => jumpToLayerTurn(first, 'branch', branch.id) : undefined,
            },
              h('span', { className: 'cs-layer-dot', style: { background: color } }),
              h('span', { className: 'cs-layer-tag' }, isSub ? t('subBranch') : t('branch')),
              h('span', { className: 'cs-layer-seq' }, 'B' + number),
              h('span', { className: 'cs-layer-q' }, truncate(branch.brief || branch.anchorText || t('branch'), 70))
            ),
            h('div', { className: 'cs-layer-children' },
              branch.turns.map((turn, index) => renderLayerTurn(turn, 'branch', branch.id, 'B' + number + '.' + (index + 1)))
            )
          )
        }
        return h('div', {
          className: 'cs-modal-backdrop',
          style: { zIndex: 3000 },
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) setLayersOpen(false)
          },
        },
          h('div', { className: 'cs-modal cs-layer-modal', role: 'dialog', 'aria-modal': 'true' },
            h('div', { className: 'cs-modal-title' }, t('layers')),
            h('div', { className: 'cs-layer-list' },
              h('div', { className: 'cs-layer-tree' },
                h('div', { className: 'cs-layer-root' }, t('main')),
                h('div', { className: 'cs-layer-children' },
                  mainTurns.map((turn, index) => renderLayerTurn(turn, 'main', null, 'M' + (index + 1)))
                )
              )
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
          h('div', { className: 'cs-title-brand' },
            h(MicaLogo, { size: 28 }),
            h('div', { className: 'cs-title-wrap' },
              h('div', { className: 'cs-title' }, t('title')),
              h('div', { className: 'cs-subtitle' }, space ? space.title : t('subtitle'))
            )
          ),
          h('div', { className: 'cs-top-actions' },
            h('span', { className: 'cs-model', title: model ? `${model.provider} / ${model.model}` : '' }, model ? `${t('model')}: ${model.model}` : t('noModel')),
            h('span', { className: cx('cs-save', saveState === 'error' ? 'cs-save-error' : '') },
              saveState === 'saving' ? t('saving') : saveState === 'saved' ? t('saved') : saveState === 'error' ? t('saveError') : ''
            ),

            h('button', { type: 'button', className: 'cs-btn', disabled: undoCount === 0, onClick: undo, title: 'Ctrl+Z' }, t('undo')),

            h('button', { type: 'button', className: 'cs-btn', onClick: focusMainLine }, t('focusMain')),
            h('button', {
              type: 'button',
              className: 'cs-btn',
              onClick: toggleLayout,
              title: t('toggleLayout'),
            }, layoutMode === 'horizontal' ? t('verticalShort') : t('horizontalShort')),
            h('button', { type: 'button', className: 'cs-btn', onClick: () => setMemoryOpen(true) }, t('memory')),
            h('button', { type: 'button', className: 'cs-btn', onClick: () => setLayersOpen(true) }, t('layers')),
            typeof onBackToLibrary === 'function'
              ? h('button', { type: 'button', className: 'cs-btn', onClick: onBackToLibrary }, t('backToLibrary'))
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
          onMouseDownCapture: (event) => { if (event.button === 1) event.preventDefault() },
          onAuxClick: (event) => { if (event.button === 1) event.preventDefault() },
          onPointerDownCapture: (event) => {
            if (event.button !== 1) return
            event.preventDefault()
            event.stopPropagation()
            setSelection(null)
            try { event.currentTarget.setPointerCapture(event.pointerId) } catch (_error) {}
            const current = spaceRef.current && spaceRef.current.view ? spaceRef.current.view : view
            panRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: current.x, y: current.y }
          },
        },
          h('div', {
            className: 'cs-world',
            style: {
              width: bounds.width,
              height: bounds.height,
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            },
          },
            view.zoom >= 0.25
              ? (() => {
                  const guideZoom = Math.max(0.01, view.zoom)
                  const thickness = 3 / guideZoom
                  const offset = 1.5 / guideZoom
                  const dash = 14 / guideZoom
                  const gap = 30 / guideZoom
                  return h('div', {
                    className: cx('cs-main-guide', layoutMode === 'horizontal' ? 'cs-main-guide-h' : 'cs-main-guide-v'),
                    style: layoutMode === 'horizontal'
                      ? {
                          top: TOP_PAD + MAIN_H / 2 - offset,
                          left: -100000,
                          width: 200000,
                          height: thickness,
                          backgroundImage: 'repeating-linear-gradient(to right, var(--cs-accent) 0 ' + dash + 'px, transparent ' + dash + 'px ' + gap + 'px)',
                        }
                      : {
                          left: MAIN_W / 2 - offset,
                          top: -100000,
                          width: thickness,
                          height: 200000,
                          backgroundImage: 'repeating-linear-gradient(to bottom, var(--cs-accent) 0 ' + dash + 'px, transparent ' + dash + 'px ' + gap + 'px)',
                        },
                  })
                })()
              : null,
            renderLinks(),
            renderMain(),
            renderBranches()
          ),
          renderPendingMarkers(),
          marquee ? h('div', {
            className: 'cs-marquee',
            style: { left: marquee.left, top: marquee.top, width: marquee.width, height: marquee.height },
          }) : null,
          renderSelection(),
          renderHover(),
          renderContextMenu(),
          renderMemorySettings(),
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
    const LAST_SPACE_KEY = 'chat-space:last-space'

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
