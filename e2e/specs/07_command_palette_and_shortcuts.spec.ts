import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'

test.describe('Command Palette, Keyboard Shortcuts, and Global Modals', () => {
  let app: AppPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    await app.goto()
  })

  test('should open command palette and navigate via search results', async ({ page }) => {
    // 1. Open search via header search button
    const searchBtn = page.locator('header button[title*="Search" i], header button:has(svg.lucide-search)').first()
    await searchBtn.click()

    const searchInput = page.locator('.overlay input[placeholder*="Search phases" i]')
    await expect(searchInput).toBeVisible()

    // 2. Type "Sales"
    await searchInput.fill('Sales')

    // 3. Click on Project 1 result
    const projectItem = page.locator('.overlay div[style*="cursor: pointer"]', { hasText: 'Project 1:' }).first()
    await expect(projectItem).toBeVisible()
    await projectItem.click()

    // 4. Verify navigated to Project Detail view
    await expect(page.locator('h2', { hasText: 'Project 1:' })).toBeVisible()
  })

  test('should open keyboard shortcuts modal and dismiss it', async ({ page }) => {
    // 1. Open shortcuts modal via header keyboard icon
    const keyboardBtn = page.locator('header button[title*="Keyboard" i], header button:has(svg.lucide-keyboard)').first()
    await keyboardBtn.click()

    const modal = page.locator('.overlay .card', { hasText: 'Keyboard Shortcuts' })
    await expect(modal).toBeVisible()
    await expect(modal.locator('text=Open Global Command Palette')).toBeVisible()

    // 2. Dismiss modal via 'Got it' button
    const gotItBtn = modal.locator('button', { hasText: 'Got it' })
    await gotItBtn.click()
    await expect(modal).not.toBeVisible()
  })
})
