import { readFile } from 'node:fs/promises'

export const resourceUri = 'ui://mica-space/canvas.html'
export const resourceMimeType = 'text/html;profile=mcp-app'

export async function buildWidget() {
  const scripts = await Promise.all([
    '../node_modules/react/umd/react.production.min.js',
    '../node_modules/react-dom/umd/react-dom.production.min.js',
    './bridge.js', '../client.js', './mount.js',
  ].map(file => readFile(new URL(file, import.meta.url), 'utf8')))
  return [
    '<!doctype html><html lang="zh"><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Mica Space</title>',
    '<style>html,body,#root{width:100%;height:100%;margin:0}body{overflow:hidden;font:14px system-ui,sans-serif}</style>',
    '<div id="root" aria-live="polite">正在打开 Mica Space…</div>',
    ...scripts.map(script => '<script>' + script.replace(/<\/script/gi, '<\\/script') + '</script>'),
    '</html>',
  ].join('\n')
}
