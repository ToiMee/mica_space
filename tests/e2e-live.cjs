const { chromium } = require('playwright-core')

const url = process.env.MICA_URL || 'http://127.0.0.1:60167'
const executablePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

;(async () => {
  const browser = await chromium.launch({ executablePath, headless: true })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2500)
  const body = await page.locator('body').innerText()
  if (/authentication required/i.test(body)) {
    console.log('SKIP: DSH Web requires an authenticated URL. Set MICA_URL to the URL printed by `dsh web`.')
    await browser.close()
    return
  }
  const entry = page.locator('text=/Mica\\s*(空间|Space)/i').first()
  if (await entry.count()) {
    await entry.click()
    await page.waitForTimeout(1200)
  }
  const settings = page.locator('button', { hasText: /设置|settings/i }).first()
  if (await settings.count()) {
    await settings.click()
    await page.waitForTimeout(300)
  }
  console.log('E2E page:', url)
  console.log('Mica entry found:', await entry.count() > 0)
  console.log('Settings visible:', await settings.count() > 0)
  await browser.close()
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
