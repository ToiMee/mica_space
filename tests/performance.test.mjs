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
const items = Array.from({ length: 120 }, (_, index) => ({
  turnId: 'turn-' + index,
  kind: index % 3 === 0 ? 'main' : 'branch',
  question: '问题 ' + index + ' 关于标签、缩放、分支或 PDF 的处理',
  text: '这是第 ' + index + ' 条记忆，讨论标签缩放、分支画布、PDF 文本或 CSV 数据。',
  chunks: [
    '子片段 A：标签 normalization 与训练稳定性。',
    '子片段 B：分支画布和父子级上下文。',
  ],
  sourceTurnIds: ['turn-' + index],
  embedding: embedText('问题 ' + index + ' 标签 缩放 分支 PDF CSV'),
  createdAt: now - index * 1000,
  lastUsedAt: 0,
  importance: index % 3 === 0 ? 1 : 0.7,
  pinned: index < 3,
  status: 'active',
}))
const space = { memoryMode: 'lexical', memory: { items } }

test('retrieval stays within a practical local latency baseline', () => {
  const started = performance.now()
  for (let index = 0; index < 50; index += 1) {
    const hits = buildRetrieval(space, '标签没有缩放怎么办 ' + index)
    assert.ok(Array.isArray(hits))
  }
  const elapsed = performance.now() - started
  assert.ok(elapsed < 2000, '50 queries took ' + elapsed.toFixed(1) + 'ms')
})
