import test from 'node:test'
import assert from 'node:assert/strict'
import { buildMessages, buildSystemPrompt } from '../index.js'

const base = { provider: 'test-provider', model: 'test-model' }

test('keeps only the last 24 history messages and appends the current question', () => {
  const history = Array.from({ length: 30 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant',
    content: 'message-' + index,
  }))
  const messages = buildMessages({ ...base, history, question: 'current?', attachments: [] })
  assert.equal(messages.length, 25)
  assert.equal(messages[0].content[0].text, 'message-6')
  assert.equal(messages[messages.length - 1].content[0].text, 'current?')
})

test('truncates each history item to 6000 characters', () => {
  const messages = buildMessages({
    ...base,
    history: [{ role: 'user', content: 'x'.repeat(7000) }],
    question: 'current?',
    attachments: [],
  })
  assert.equal(messages[0].content[0].text.length, 6000)
})

test('adds image and file attachment blocks in order', () => {
  const messages = buildMessages({
    ...base,
    history: [],
    question: 'with files',
    attachments: [
      { kind: 'image', attachment: { attachmentId: 'sha256:image', name: 'a.png', bytes: 3, mediaType: 'image/png' } },
      { kind: 'file', attachment: { attachmentId: 'sha256:file', name: 'a.txt', bytes: 3 } },
    ],
  })
  const content = messages[0].content
  assert.equal(content[0].type, 'text')
  assert.equal(content[1].type, 'image')
  assert.equal(content[2].type, 'file')
})

test('appends extracted file text as a bounded text block', () => {
  const messages = buildMessages({
    ...base,
    history: [],
    question: 'read this',
    attachments: [],
    fileTexts: [{ name: 'notes.txt', text: 'hello from file' }],
  })
  const content = messages[0].content
  assert.match(content[content.length - 1].text, /\[File: notes\.txt\]/)
  assert.match(content[content.length - 1].text, /hello from file/)
})
test('puts main memory before branch memory and includes retrieval', () => {
  const prompt = buildSystemPrompt({
    kind: 'branch',
    anchorText: '',
    brief: '',
    mainContext: [],
    branchDigest: [],
    mainDigest: [],
    branchId: 'b1',
    memory: { main: 'MAIN-MEMORY', branches: { b1: 'BRANCH-MEMORY' } },
    retrieved: [{ kind: 'main', question: 'old question', summary: 'old answer' }],
  })
  assert.ok(prompt.indexOf('MAIN-MEMORY') < prompt.indexOf('BRANCH-MEMORY'))
  assert.match(prompt, /old question/)
  assert.match(prompt, /old answer/)
})