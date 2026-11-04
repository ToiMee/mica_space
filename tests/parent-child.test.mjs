import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function loadRetrieval() {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    function splitAnswerChunks')
  const end = source.indexOf('    function branchSide', start)
  assert.ok(start >= 0 && end > start, 'memory/retrieval helpers not found')
  const factory = new Function(
    "const stringOf = (value) => typeof value === 'string' ? value : '';\n" +
    "const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;\n" +
    source.slice(start, end) +
    '\nreturn { buildRetrieval, splitAnswerChunks, embedText }'
  )
  return factory()
}

const { buildRetrieval, splitAnswerChunks, embedText } = loadRetrieval()

test('long answers are split into bounded child chunks', () => {
  const answer = Array.from({ length: 30 }, (_, index) => '第' + (index + 1) + '段：这是一段用于测试 chunk 的内容，包含标签、缩放和训练细节。').join('\n\n')
  const chunks = splitAnswerChunks(answer)
  assert.ok(chunks.length > 1)
  assert.ok(chunks.length <= 6)
  assert.ok(chunks.every((chunk) => chunk.length <= 800))
})

test('a child chunk hit carries its parent turn context', () => {
  const chunk = '后面这一段说明标签没有缩放会导致 loss 异常，需要先做 normalization。'
  const space = {
    memoryMode: 'lexical',
    memory: {
      items: [
        {
          turnId: 'turn-label',
          kind: 'main',
          question: '标签未缩放的隐患',
          text: '主线卡：讨论 PyTorch 标签未缩放。',
          chunks: [chunk],
          sourceTurnIds: ['turn-label'],
          embedding: embedText('标签未缩放 PyTorch'),
          createdAt: Date.now(),
          lastUsedAt: 0,
          importance: 1,
          pinned: true,
          status: 'active',
        },
        {
          turnId: 'turn-csv',
          kind: 'branch',
          question: '怎么读 CSV',
          text: 'pandas 读取 CSV。',
          chunks: [],
          sourceTurnIds: ['turn-csv'],
          embedding: embedText('pandas CSV 表格'),
          createdAt: Date.now(),
          lastUsedAt: 0,
          importance: 0.7,
          pinned: false,
          status: 'active',
        },
      ],
    },
  }
  const hits = buildRetrieval(space, '标签没有缩放会怎么样')
  assert.equal(hits.length > 0, true)
  assert.equal(hits[0].parentTurnId, 'turn-label')
  assert.match(hits[0].summary, /主线卡/)
  assert.match(hits[0].chunk, /标签没有缩放/)
})
