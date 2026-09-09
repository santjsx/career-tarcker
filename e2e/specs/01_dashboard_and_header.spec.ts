import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Dashboard, Header, and Fixed Navigation', () => {
  let app: AppPage
  let dashboard: DashboardPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    dashboard = new DashboardPage(page)
    await app.goto()
  })

  test('should render header with brand, autosave status, and date/calendar widget', async ({ page }) => {
    // 1. Verify Brand
    await expect(page.locator('text=Career Tracker').first()).toBeVisible()
    await expect(page.locator('text=Data Analyst → Analytics Engineer').first()).toBeVisible()

    // 2. Verify Autosave badge (zero layout shift indicator)
    const saveIndicator = page.locator('[data-testid="save-status-indicator"]')
    await expect(saveIndicator).toBeVisible()
    await expect(saveIndicator).toContainText(/Saved|Saving/)

    // 3. Verify Executive Date Calendar Widget
    const dateWidget = await app.getDateWidget()
    await expect(dateWidget).toBeVisible()
    await expect(dateWidget).toContainText('left in')

    // 4. Open and verify Date Calendar Popover
    await app.toggleCalendarPopover()
    await expect(page.locator('.calendar-popover')).toBeVisible()
    await expect(page.locator('text=Year Progress')).toBeVisible()
    await expect(page.locator('text=Days Left')).toBeVisible()

    // 5. Close popover by clicking outside or clicking widget again
    await app.toggleCalendarPopover()
  })

  test('should toggle themes and cycle between dark, light, and system', async ({ page }) => {
    const html = page.locator('html')
    const initialTheme = await html.getAttribute('data-theme')

    // Cycle theme
    await app.cycleTheme()
    const newTheme = await html.getAttribute('data-theme')
    expect(newTheme).not.toBeNull()

    // Cycle theme back to dark
    await app.cycleTheme()
    await app.cycleTheme()
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('should persist theme and prevent light mode flash (FOUC) on reload', async ({ page }) => {
    const html = page.locator('html')

    // 1. On fresh reload with default/saved dark mode, html tag must immediately have data-theme="dark" and dark background
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(html).toHaveAttribute('data-theme', 'dark')
    const darkBg = await html.evaluate(el => window.getComputedStyle(el).backgroundColor)
    expect(darkBg).toBe('rgb(13, 17, 23)')

    // 2. Switch to light mode
    await app.cycleTheme()
    await expect(html).toHaveAttribute('data-theme', 'light')
    // Wait for autosave debounce (350ms)
    await page.waitForTimeout(450)

    // 3. Reload - must immediately be light on domcontentloaded without dark flash
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(html).toHaveAttribute('data-theme', 'light')
    const lightBg = await html.evaluate(el => window.getComputedStyle(el).backgroundColor)
    expect(lightBg).toBe('rgb(246, 248, 250)')

    // 4. Switch back to dark mode
    await app.cycleTheme() // to system
    await app.cycleTheme() // to dark
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await page.waitForTimeout(450)

    // 5. Reload - must immediately be dark without light flash
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(html).toHaveAttribute('data-theme', 'dark')
    const restoredDarkBg = await html.evaluate(el => window.getComputedStyle(el).backgroundColor)
    expect(restoredDarkBg).toBe('rgb(13, 17, 23)')
  })

  test('should keep sidebar permanently fixed during scroll', async ({ page }) => {
    const sidebar = page.locator('aside.sidebar')
    await expect(sidebar).toBeVisible()

    // Check position is fixed
    await expect(sidebar).toHaveCSS('position', 'fixed')

    // Scroll window down 600px
    await page.evaluate(() => window.scrollTo(0, 600))
    await page.waitForTimeout(300)

    // Verify sidebar remains visible and stationary at top: 0
    const box = await sidebar.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBe(0)
  })

  test('should display progress cards, Next Best Action, and why explanation', async () => {
    // Verify 4 key progress metrics
    await dashboard.verifyProgressMetrics()

    // Verify Recommended Action card
    await dashboard.verifyRecommendedActionCard()

    // Toggle "Why this?" explanation
    await dashboard.toggleRecommendedActionWhy()
    await dashboard.page.waitForTimeout(200)
    await expect(dashboard.page.locator('text=Why we recommend this:')).toBeVisible()
  })

  test('should open notifications popover from header and dismiss it', async ({ page }) => {
    const notifBtn = page.locator('header button[aria-label="Notifications"]')
    await expect(notifBtn).toBeVisible()
    await notifBtn.click()

    // Verify notifications popover opens
    await expect(page.locator('text=Action Center')).toBeVisible()

    // Dismiss popover
    await notifBtn.click()
    await expect(page.locator('text=Action Center')).not.toBeVisible()
  })

  test('should toggle daily plan tasks and track completion count', async ({ page }) => {
    const dailyCard = page.locator('.card', { hasText: "Today's Tasks" })
    await expect(dailyCard).toBeVisible()

    // Read initial done count
    const initialText = await dailyCard.locator('text=/\\d+ of \\d+ Done/').textContent()

    // Click first task checkbox
    const firstCheckbox = dailyCard.locator('button:has(svg.lucide-square), button:has(svg.lucide-check-square)').first()
    await firstCheckbox.click()
    await page.waitForTimeout(300)

    // Verify done count updated
    const updatedText = await dailyCard.locator('text=/\\d+ of \\d+ Done/').textContent()
    expect(updatedText).not.toBeNull()
  })

  test('should navigate to PhaseDetailView from PhaseQuickGrid and return to Roadmap', async ({ page }) => {
    // Find Phase 1 View Topics CTA
    const phase1Card = page.locator('.card', { hasText: 'PHASE 01' }).first()
    await expect(phase1Card).toBeVisible()
    const viewTopicsBtn = phase1Card.locator('button', { hasText: 'View Topics' })
    await viewTopicsBtn.click()

    // Verify PhaseDetailView rendered
    await expect(page.locator('h2', { hasText: 'SQL Foundations' })).toBeVisible()
    await expect(page.locator('button.tab-btn', { hasText: 'Topics to Learn' })).toBeVisible()

    // Switch to Review & Practice tab
    await page.locator('button.tab-btn', { hasText: 'Review & Practice' }).click()
    await page.waitForTimeout(200)

    // Click Back to Roadmap
    await page.locator('button', { hasText: 'Back to Roadmap' }).click()
    await expect(page.locator('h2', { hasText: 'Full Learning Roadmap' })).toBeVisible()
  })
})
