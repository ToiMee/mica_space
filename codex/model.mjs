import { readFile } from 'node:fs/promises'
import path from 'node:path'

const imageTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])

export function createModelAdapter(workspace, env = process.env, fetchModel = fetch) {
  const model = env.MICA_MODEL?.trim()
  const base = (env.MICA_API_BASE || 'https://api.openai.com/v1').replace(/\/+$/, '')
  const key = env.MICA_API_KEY || (base === 'https://api.openai.com/v1' ? env.OPENAI_API_KEY : undefined)
  const endpoint = new URL(base + '/chat/completions')
  if (!['http:', 'https:'].includes(endpoint.protocol)) throw new Error('MICA_API_BASE requires HTTP or HTTPS.')

  return {
    currentSelection: () => model ? { provider: 'compatible', model } : null,
    async resolveModelInfo() {
      return {
        context: { contextWindow: Number(env.MICA_CONTEXT_WINDOW) || 32000 },
        ...(env.MICA_IMAGE_INPUT === '0' ? { inputModalities: ['text'] } : {}),
      }
    },
    async *stream({ system, messages, signal, maxTokens }) {
      if (!model) throw new Error('请先在插件目录的 .env 中设置 MICA_MODEL。')
      if (!key && endpoint.origin === 'https://api.openai.com') throw new Error('请先设置 MICA_API_KEY。')
      const outgoing = [{ role: 'system', content: system }]
      for (const message of messages) {
        const content = []
        for (const block of message.content) {
          if (block.type === 'text') content.push({ type: 'text', text: block.text })
          if (block.type === 'image') {
            const ref = block.attachment
            if (ref?.storage !== 'mica' || !imageTypes.has(ref.mediaType) || !/^[a-z0-9_-]+\.[a-z0-9]+$/i.test(ref.file || '')) {
              throw new Error('图片引用无效，请重新上传。')
            }
            const data = await readFile(path.join(workspace, '.chat-space', 'attachments', ref.file))
            content.push({ type: 'image_url', image_url: { url: 'data:' + ref.mediaType + ';base64,' + data.toString('base64') } })
          }
          // The reused host extracts supported document types into text blocks.
        }
        if (content.length) {
          outgoing.push({
            role: message.role,
            content: content.every(block => block.type === 'text') ? content.map(block => block.text).join('\n') : content,
          })
        }
      }
      const response = await fetchModel(endpoint, {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json', ...(key ? { Authorization: 'Bearer ' + key } : {}) },
        body: JSON.stringify({
          model, messages: outgoing, stream: true,
          ...(env.MICA_STREAM_USAGE === '0' ? {} : { stream_options: { include_usage: true } }),
          ...(maxTokens ? { [env.MICA_MAX_TOKEN_FIELD || (endpoint.origin === 'https://api.openai.com' ? 'max_completion_tokens' : 'max_tokens')]: maxTokens } : {}),
        }),
      })
      if (!response.ok || !response.body) throw new Error('模型请求失败（HTTP ' + response.status + '）。请检查模型名称、凭据及兼容接口设置。')

      let buffer = ''
      let completed = false
      const decoder = new TextDecoder()
      for await (const bytes of response.body) {
        buffer += decoder.decode(bytes, { stream: true })
        let newline
        while ((newline = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, newline).trim()
          buffer = buffer.slice(newline + 1)
          if (!line.startsWith('data:')) continue
          const payload = line.slice(5).trim()
          if (payload === '[DONE]') {
            yield { type: 'finish' }
            return
          }
          const chunk = JSON.parse(payload)
          if (chunk.error) throw new Error('模型在生成过程中返回错误。')
          const choice = chunk.choices?.[0]
          const delta = choice?.delta?.content
          if (typeof delta === 'string' && delta) yield { type: 'text-delta', text: delta }
          if (choice?.finish_reason) completed = true
          if (chunk.usage) yield {
            type: 'usage',
            usage: {
              inputTokens: chunk.usage.prompt_tokens,
              outputTokens: chunk.usage.completion_tokens,
              totalTokens: chunk.usage.total_tokens,
            },
          }
        }
      }
      if (!completed) throw new Error('模型连接在生成完成前中断。')
      yield { type: 'finish' }
    },
  }
}
