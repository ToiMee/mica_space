import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const e2eDir = path.join(root, 'tests', 'e2e')
const executablePath = process.env.MICA_CHROMIUM
  || 'C:/Users/73678/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
}

const files = new Map([
  ['/', path.join(e2eDir, 'fixture.html')],
  ['/fixture.js', path.join(e2eDir, 'fixture.js')],
  ['/boot.js', path.join(e2eDir, 'boot.js')],
  ['/vendor/react.js', path.join(root, 'node_modules', 'react', 'umd', 'react.development.js')],
  ['/vendor/react-dom.js', path.join(root, 'node_modules', 'react-dom', 'umd', 'react-dom.development.js')],
  ['/client.js', path.join(root, 'client.js')],
])

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  if (url.pathname === '/favicon.ico') {
    res.writeHead(204)
    res.end()
    return
  }
  const file = files.get(url.pathname)
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('not found')
    return
  }
  try {
    const data = fs.readFileSync(file)
    res.writeHead(200, { 'Content-Type': contentTypes[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end(String(error && error.message || error))
  }
})

const listen = () => new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))

try {
  await listen()
  const port = server.address().port
  const browser = await chromium.launch({ headless: true, executablePath })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(message.text())
  })
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__micaReady === true, null, { timeout: 10000 })

  await page.getByText('欢迎使用 E2E', { exact: true }).waitFor({ timeout: 5000 })
  await page.getByRole('button', { name: '让我试试' }).click()
  await page.getByText('Vertical E2E', { exact: true }).first().waitFor({ timeout: 5000 })

  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__micaReady === true, null, { timeout: 10000 })
  if (await page.getByText('欢迎使用 E2E', { exact: true }).count()) {
    throw new Error('welcome modal appeared again after reload despite cookie')
  }

  const verticalCard = page.locator('.cs-lib-space-card').filter({ hasText: 'Vertical E2E' }).first()
  await verticalCard.click()
  await page.locator('.cs-card-main').first().waitFor({ timeout: 5000 })
  if (!(await page.locator('.cs-card-main').count())) throw new Error('vertical main cards missing')
  if (!(await page.getByText('!1', { exact: true }).count())) throw new Error('collapsed pending badge missing')

  await page.locator('.cs-card-main').first().click({ button: 'right' })
  await page.locator('.cs-context-menu').waitFor({ timeout: 3000 })
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: /返回空间库/ }).click()
  await page.getByText('Vertical E2E', { exact: true }).first().waitFor({ timeout: 5000 })
  const horizontalCard = page.locator('.cs-lib-space-card').filter({ hasText: 'Horizontal E2E' }).first()
  await horizontalCard.click()
  await page.locator('.cs-card-main').first().waitFor({ timeout: 5000 })
  if (!(await page.locator('.cs-card-main').count())) throw new Error('horizontal main cards missing')
  await page.locator('.cs-card-main').first().click({ button: 'right' })
  await page.locator('.cs-context-menu').waitFor({ timeout: 3000 })
  await page.keyboard.press('Escape')

  const horizontalMain = page.locator('.cs-card-main').first()
  const beforeLeft = await horizontalMain.evaluate((element) => element.parentElement.style.left)
  const box = await horizontalMain.boundingBox()
  if (!box) throw new Error('horizontal card bounding box missing')
  await page.mouse.move(box.x + box.width / 2, box.y + 30)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 36, box.y + 54, { steps: 6 })
  await page.mouse.up()
  const afterLeft = await horizontalMain.evaluate((element) => element.parentElement.style.left)
  if (beforeLeft === afterLeft) throw new Error('horizontal card drag did not move the card')

  await horizontalMain.dblclick()
  const selected = await horizontalMain.evaluate((element) => element.classList.contains('cs-selected'))
  if (!selected) throw new Error('horizontal card double-click did not select')

  if (pageErrors.length) throw new Error('browser errors: ' + pageErrors.join(' | '))
  console.log('E2E passed: welcome once, vertical/horizontal cards, context menu, pending badge')
  await browser.close()
} finally {
  server.close()
}
