import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function loadSemanticFunctions() {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    const EMBEDDING_DIMS = 96')
  const end = source.indexOf('    function buildContextMemory', start)
  assert.ok(start >= 0, 'embedding helper not found')
  assert.ok(end > start, 'embedding helper end not found')
  const factory = new Function("const stringOf = (value) => typeof value === 'string' ? value : '';\n" + source.slice(start, end) + "\nreturn { embedText, cosineSimilarity, semanticTokens, buildCooccurrenceVectors, semanticQueryVector, EMBEDDING_DIMS }")
  return factory()
}

const { cosineSimilarity, buildCooccurrenceVectors, semanticQueryVector, EMBEDDING_DIMS } = loadSemanticFunctions()

const items = [
  { turnId: 'label', question: '', text: '标签 label 没有缩放 normalization 会出问题' },
  { turnId: 'train', question: '', text: '训练 loss 梯度 反向传播 学习率' },
  { turnId: 'canvas', question: '', text: '分支 canvas 画布 主线 连接' },
  { turnId: 'csv', question: '', text: 'pandas 读取 CSV 表格 数据' },
]

test('co-occurrence vectors are normalized and semantic mode ranks domain terms', () => {
  const { termVectors, itemVectors } = buildCooccurrenceVectors(items)
  for (const vector of itemVectors.values()) {
    assert.equal(vector.length, EMBEDDING_DIMS)
    assert.ok(Math.abs(vector.reduce((sum, value) => sum + value * value, 0) - 1) < 0.000001)
  }
  const label = semanticQueryVector('标签', termVectors)
  const ranking = items
    .map((item) => ({ id: item.turnId, score: cosineSimilarity(label, itemVectors.get(item.turnId)) }))
    .sort((left, right) => right.score - left.score)
  assert.equal(ranking[0].id, 'label')
})
