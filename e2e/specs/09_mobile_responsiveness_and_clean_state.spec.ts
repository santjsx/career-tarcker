import { test, expect } from '@playwright/test'

test.describe('Mobile Responsiveness, Thumb Navigation, and Clean Initial State', () => {
  test.use({
    viewport: { width: 390, height: 844 }, // iPhone 14 / modern smartphone viewport
    isMobile: true,
    hasTouch: true
  })

  test.beforeEach(async ({ page }) => {
    // Clear any previous storage to guarantee a fresh first-open experience
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'domcontentloaded' })
  })

  test('should display pristine clean state on first open with zero mock data', async ({ page }) => {
    // 1. Verify 0 of 70 topics completed on Roadmap
    await expect(page.locator('text=0 of 70 topics completed')).toBeVisible()

    // 2. Verify Daily Tasks starts clean (0 of 4 Done, 0-Day Streak)
    await expect(page.locator('text=0 of 4 Done')).toBeVisible()
    await expect(page.locator('text=0-Day Streak')).toBeVisible()
    await expect(page.locator('text=Start Phase 1: SQL Basics & Filtering')).toBeVisible()

    // 3. Verify 4 pillars start at 0%
    await expect(page.locator('text=0%').first()).toBeVisible()
    await expect(page.locator('text=0 of 4 projects completed')).toBeVisible()

    // 4. Verify Next Best Action dynamically suggests Phase 1 SQL topic
    await expect(page.locator('text=Recommended Next Step')).toBeVisible()
    await expect(page.locator('h3', { hasText: 'SQL Basics & Filtering' }).or(page.locator('text=SQL Syntax, SELECT'))).toBeVisible()
  })

  test('should hide desktop sidebar and display mobile bottom navigation on smartphone', async ({ page }) => {
    // 1. Desktop sidebar must be hidden
    const sidebar = page.locator('aside.sidebar')
    await expect(sidebar).toBeHidden()

    // 2. Mobile bottom navigation must be visible
    const bottomNav = page.locator('.mobile-bottom-nav')
    await expect(bottomNav).toBeVisible()

    // 3. Verify 5 core navigation tabs exist
    await expect(bottomNav.locator('button', { hasText: 'Dashboard' })).toBeVisible()
    await expect(bottomNav.locator('button', { hasText: 'Roadmap' })).toBeVisible()
    await expect(bottomNav.locator('button', { hasText: 'Projects' })).toBeVisible()
    await expect(bottomNav.locator('button', { hasText: 'Skills' })).toBeVisible()
    await expect(bottomNav.locator('button', { hasText: 'More' })).toBeVisible()
  })

  test('should navigate seamlessly using bottom navigation bar', async ({ page }) => {
    const bottomNav = page.locator('.mobile-bottom-nav')

    // 1. Navigate to Roadmap
    await bottomNav.locator('button', { hasText: 'Roadmap' }).click()
    await expect(page.locator('h2', { hasText: 'Full Learning Roadmap' })).toBeVisible()

    // 2. Navigate to Projects
    await bottomNav.locator('button', { hasText: 'Projects' }).click()
    await expect(page.locator('h2', { hasText: 'Hands-on Projects' })).toBeVisible()

    // 3. Navigate to Skills
    await bottomNav.locator('button', { hasText: 'Skills' }).click()
    await expect(page.locator('h2', { hasText: 'Skills & Practice Logs' })).toBeVisible()

    // 4. Navigate back to Dashboard
    await bottomNav.locator('button', { hasText: 'Dashboard' }).click()
    await expect(page.locator('text=Your Learning Progress')).toBeVisible()
  })

  test('should open, interact with, and dismiss the mobile navigation drawer', async ({ page }) => {
    // 1. Open mobile drawer via header hamburger button
    const hamburgerBtn = page.locator('.mobile-hamburger-btn')
    await expect(hamburgerBtn).toBeVisible()
    await hamburgerBtn.click()

    const drawer = page.locator('.mobile-nav-drawer')
    await expect(drawer).toBeVisible()

    // 2. Verify drawer contains Job Tracker and Stats & Review
    await expect(drawer.locator('button', { hasText: 'Job Tracker' })).toBeVisible()
    await expect(drawer.locator('button', { hasText: 'Stats & Review' })).toBeVisible()

    // 3. Navigate to Job Tracker from drawer
    await drawer.locator('button', { hasText: 'Job Tracker' }).click()
    await expect(drawer).not.toBeVisible()
    await expect(page.locator('h2', { hasText: 'Job Tracker & Readiness' })).toBeVisible()

    // 4. Verify clean empty state in Job Tracker
    await expect(page.locator('text=No job applications tracked yet')).toBeVisible()
    await expect(page.locator('button', { hasText: 'Track Your First Job' })).toBeVisible()

    // 5. Open drawer again and dismiss via Close (X) button
    await hamburgerBtn.click()
    await expect(drawer).toBeVisible()
    const closeBtn = drawer.locator('.mobile-nav-close-btn')
    await closeBtn.click()
    await expect(drawer).not.toBeVisible()
  })

  test('should have zero horizontal overflow across all views on mobile', async ({ page }) => {
    const views = ['overview', 'roadmap', 'projects', 'skills', 'career', 'analytics']

    for (const view of views) {
      if (view === 'overview') {
        await page.locator('.mobile-bottom-nav button', { hasText: 'Dashboard' }).click()
      } else if (view === 'roadmap') {
        await page.locator('.mobile-bottom-nav button', { hasText: 'Roadmap' }).click()
      } else if (view === 'projects') {
        await page.locator('.mobile-bottom-nav button', { hasText: 'Projects' }).click()
      } else if (view === 'skills') {
        await page.locator('.mobile-bottom-nav button', { hasText: 'Skills' }).click()
      } else {
        await page.locator('.mobile-hamburger-btn').click()
        const label = view === 'career' ? 'Job Tracker' : 'Stats & Review'
        await page.locator('.mobile-nav-drawer button', { hasText: label }).click()
      }

      await page.waitForTimeout(150)

      // Evaluate whether the document scroll width exceeds viewport width
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
      expect(isOverflowing).toBeFalsy()
    }
  })

  test('should keep mobile header fixed at top: 0 during mobile scroll and display all controls at 502px', async ({ page }) => {
    // Set 502px compact viewport (reported in screenshot)
    await page.setViewportSize({ width: 502, height: 750 })
    await page.goto('/')

    const header = page.locator('header.header')
    await expect(header).toBeVisible()
    await expect(header).toHaveCSS('position', 'fixed')

    // Verify all core header controls fit and are visible without clipping
    await expect(page.locator('.mobile-hamburger-btn')).toBeVisible()
    await expect(page.locator('header .header-brand-title')).toBeVisible()
    await expect(page.locator('[data-testid="save-status-indicator"]')).toBeVisible()
    await expect(page.locator('.header-search-btn')).toBeVisible()
    await expect(page.locator('.header-study-btn')).toBeVisible()
    await expect(page.locator('header button[aria-label="Notifications"]')).toBeVisible()
    await expect(page.locator('header button[title*="Theme"]').first()).toBeVisible()

    // Scroll down 400px
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(200)

    const box = await header.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBe(0)

    // Zero horizontal overflow at 502px
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })
    expect(isOverflowing).toBeFalsy()
  })
})
