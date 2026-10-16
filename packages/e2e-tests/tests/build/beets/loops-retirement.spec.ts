import { expect, test } from '@playwright/test'

const origin = 'http://localhost:3001'

for (const path of ['/loops', '/api/fly/quote', '/api/fly/transaction']) {
  test(`${path} returns 404 without redirect`, async ({ request }) => {
    const retained = await request.get(`${origin}/stake`, { maxRedirects: 0 })
    expect(retained.status()).toBe(200)

    const response = await request.get(`${origin}${path}`, {
      maxRedirects: 0,
      headers: { referer: '' },
    })
    expect(response.status()).toBe(404)
    expect(response.headers().location).toBeUndefined()
  })
}

test('desktop navigation retains staking and omits Loops', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  const response = await page.goto(`${origin}/stake`)
  expect(response?.status()).toBe(200)
  await expect(page.locator('[data-id="lst-tab-stake"]')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Stake $S', exact: true })).toBeVisible()
  await expect(page.locator('a[href="/loops"]')).toHaveCount(0)
})

test('opened mobile navigation retains staking and omits Loops', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  const response = await page.goto(`${origin}/stake`)
  expect(response?.status()).toBe(200)
  await expect(page.locator('[data-id="lst-tab-stake"]')).toBeVisible()

  const menu = page.getByRole('button').filter({ has: page.locator('svg.lucide-menu') })
  await expect(menu).toHaveCount(1)
  await expect(menu).toBeVisible()
  await menu.click()

  const drawer = page.getByRole('dialog')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('link', { name: 'Stake $S', exact: true })).toBeVisible()
  await expect(drawer.locator('a[href="/loops"]')).toHaveCount(0)
})
