import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function loadEmbeddingFunctions() {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    const EMBEDDING_DIMS = 96')
  const end = source.indexOf('    function buildContextMemory', start)
  assert.ok(start >= 0, 'embedding helper not found')
  assert.ok(end > start, 'embedding helper end not found')
  const factory = new Function(source.slice(start, end) + '\nreturn { embedText, cosineSimilarity, EMBEDDING_DIMS }')
  return factory()
}

const { embedText, cosineSimilarity, EMBEDDING_DIMS } = loadEmbeddingFunctions()

const items = [
  { id: 'label', text: 'PyTorch 数据集标签没有缩放，训练时会出问题' },
  { id: 'csv', text: 'pandas 读取 CSV 表格数据的方法' },
  { id: 'canvas', text: 'Mica Space 分支对话画布和主线结构' },
  { id: 'pdf', text: 'PDF 扫描版需要 OCR 才能抽取文本' },
]

function retrieve(question) {
  const query = embedText(question)
  return items
    .map((item) => ({ id: item.id, score: cosineSimilarity(query, embedText(item.text)) }))
    .sort((left, right) => right.score - left.score)
}

test('embedding vectors are deterministic and normalized', () => {
  const left = embedText('一个测试句子')
  const right = embedText('一个测试句子')
  assert.equal(left.length, EMBEDDING_DIMS)
  assert.deepEqual(left, right)
  assert.ok(Math.abs(left.reduce((sum, value) => sum + value * value, 0) - 1) < 0.000001)
  assert.ok(Math.abs(cosineSimilarity(left, right) - 1) < 0.000001)
})

test('local n-gram embedding ranks the intended spaces first', () => {
  assert.equal(retrieve('标签没有缩放怎么办')[0].id, 'label')
  assert.equal(retrieve('怎么读取 CSV 表格')[0].id, 'csv')
  assert.equal(retrieve('分支支线在画布上怎么连接')[0].id, 'canvas')
  assert.equal(retrieve('扫描 PDF 怎么提取文字')[0].id, 'pdf')
})
