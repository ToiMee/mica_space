import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function loadRetrieval() {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    function splitAnswerChunks')
  const end = source.indexOf('    function branchSide', start)
  assert.ok(start >= 0 && end > start, 'retrieval helpers not found')
  return new Function(
    "const stringOf = (value) => typeof value === 'string' ? value : '';\n" +
    "const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;\n" +
    source.slice(start, end) +
    '\nreturn { buildRetrieval, embedText }'
  )()
}

const { buildRetrieval, embedText } = loadRetrieval()
const now = Date.now()
const fixtures = [
  ['label', 'main', '标签没有缩放会怎样', 'PyTorch 标签 label normalization 未缩放'],
  ['csv', 'branch', 'pandas 怎么读取 CSV', 'pandas CSV 表格 读取 数据'],
  ['canvas', 'main', '分支画布怎么连接', 'Mica 分支 画布 主线 支线 连接'],
  ['pdf', 'branch', '扫描 PDF 怎么提取文字', 'PDF 扫描 OCR 文本 提取'],
  ['loss', 'branch', 'loss 不下降怎么办', '训练 loss 梯度 学习率 反向传播'],
  ['sql', 'branch', 'SQL 去重', 'SQL DISTINCT GROUP BY 去重'],
  ['react', 'main', 'React hook 顺序', 'React hooks 顺序 渲染'],
  ['file', 'branch', 'Word 文件抽取', 'docx 文件 文本 抽取 XML'],
].map(([turnId, kind, question, text]) => ({
  turnId,
  kind,
  question,
  text,
  chunks: [],
  sourceTurnIds: [turnId],
  embedding: embedText(question + ' ' + text),
  createdAt: now,
  lastUsedAt: 0,
  importance: kind === 'main' ? 1 : 0.7,
  pinned: false,
  status: 'active',
}))

const space = { memoryMode: 'lexical', memory: { items: fixtures } }
const queries = [
  ['标签没有归一化', 'label'],
  ['读取表格文件', 'csv'],
  ['支线怎么画出来', 'canvas'],
  ['扫描件文字识别', 'pdf'],
  ['训练不收敛', 'loss'],
  ['SQL 查询重复数据', 'sql'],
  ['hook 渲染顺序', 'react'],
  ['docx 文本抽取', 'file'],
]

test('lightweight retrieval eval fixture reports hit@1', () => {
  const results = queries.map(([query, expected]) => {
    const hits = buildRetrieval(space, query)
    return { query, expected, got: hits[0] && hits[0].parentTurnId }
  })
  const hits = results.filter((item) => item.got === item.expected).length
  assert.ok(hits >= 6, JSON.stringify(results, null, 2))
})
