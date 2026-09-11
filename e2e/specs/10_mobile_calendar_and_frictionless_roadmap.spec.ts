import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'

test.describe('Mobile Calendar and Frictionless Roadmap Experience', () => {
  let app: AppPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    await app.goto()
  })

  test('should display date/calendar widget on mobile viewport and allow opening modal', async ({ page }) => {
    // Set viewport to mobile device (iPhone SE / standard mobile)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    // 1. Verify mobile date pill button is visible in header
    const datePillBtn = page.locator('button[data-testid="header-date-pill-btn"]')
    await expect(datePillBtn).toBeVisible()

    // 2. Click the date pill to open calendar
    await datePillBtn.click()

    // 3. Verify calendar popover and backdrop appear
    const calendarPopover = page.locator('[data-testid="calendar-popover"]')
    await expect(calendarPopover).toBeVisible()
    await expect(page.locator('.calendar-backdrop')).toBeVisible()

    // 4. Verify calendar content: days and close button
    await expect(page.locator('.calendar-day-cell').first()).toBeVisible()
    const closeBtn = page.locator('button[data-testid="calendar-close-btn"]')
    await expect(closeBtn).toBeVisible()

    // 5. Close calendar modal
    await closeBtn.click()
    await expect(calendarPopover).not.toBeVisible()

    // 6. Test opening calendar via Mobile Navigation Drawer
    const hamburgerBtn = page.locator('button[data-testid="mobile-hamburger-btn"]')
    await expect(hamburgerBtn).toBeVisible()
    await hamburgerBtn.click()

    const drawerCalendarBtn = page.locator('button[data-testid="mobile-drawer-calendar-btn"]')
    await expect(drawerCalendarBtn).toBeVisible()
    await drawerCalendarBtn.click()

    // Verify calendar opened from drawer
    await expect(calendarPopover).toBeVisible()
    await closeBtn.click()
    await expect(calendarPopover).not.toBeVisible()
  })

  test('should provide 1-click topic completion with instant auto-scoring on roadmap', async ({ page }) => {
    await app.navigateTo('Roadmap')

    // Find the first topic toggle button (t-1-1)
    const topicToggle = page.locator('[data-testid="topic-toggle-t-1-1"]')
    await expect(topicToggle).toBeVisible()

    // 1-Click complete / toggle
    await topicToggle.click()

    // Verify topic now has completed state
    await expect(topicToggle).toHaveClass(/completed/)

    // Click on the topic row to open details
    const topicRow = page.locator('.topic-table-row', { hasText: 'SQL Basics' })
    await topicRow.click()

    const drawer = page.locator('[data-testid="topic-drawer"]')
    await expect(drawer).toBeVisible()

    // Verify drawer header shows Done state
    const drawerToggleBtn = page.locator('[data-testid="drawer-toggle-complete-btn"]')
    await expect(drawerToggleBtn).toContainText(/Done|Completed/)

    // Verify 5 breakdown sliders are collapsed in details accordion
    const scoringDetails = page.locator('.advanced-scoring-details')
    await expect(scoringDetails).toBeVisible()

    // Close drawer
    await page.locator('button[aria-label="Close drawer"]').click()
  })

  test('should filter topics using in-page keyword search and clear cleanly', async ({ page }) => {
    await app.navigateTo('Roadmap')

    const searchInput = page.locator('input[data-testid="roadmap-search-input"]')
    await expect(searchInput).toBeVisible()

    // Search for "SQL" -> Phase 1 visible
    await searchInput.fill('SQL')
    await expect(page.locator('text=PHASE 01')).toBeVisible()

    // Search for specific query e.g. "Git" -> Phase 13 visible, Phase 1 hidden
    await searchInput.fill('Git')
    await expect(page.locator('text=PHASE 13')).toBeVisible()
    await expect(page.locator('text=PHASE 01')).not.toBeVisible()

    // Clear search
    await page.locator('button[aria-label="Clear search"]').click()
    await expect(page.locator('text=PHASE 01')).toBeVisible()
    await expect(page.locator('text=19 of 19 phases visible')).toBeVisible()
  })

  test('should allow deep-linking from Hero Progress Card "Continue Learning" button to roadmap', async ({ page }) => {
    await app.navigateTo('Dashboard')

    // Verify Continue Learning button exists
    const continueBtn = page.locator('[data-testid="hero-continue-learning-btn"]')
    await expect(continueBtn).toBeVisible()

    // Click Continue Learning
    await continueBtn.click()

    // Should navigate to Roadmap view
    await expect(page.locator('h2:has-text("Full Learning Roadmap")')).toBeVisible()

    // Topic drawer should automatically open for the next topic
    const drawer = page.locator('[data-testid="topic-drawer"]')
    await expect(drawer).toBeVisible()
  })
})
