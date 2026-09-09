import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'

test.describe('Study Timer Modal and Stats & Review Analytics', () => {
  let app: AppPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    await app.goto()
  })

  test('should run study session timer, record notes, rate confidence, and update stats', async ({ page }) => {
    // 1. Launch Study Timer from header
    await app.openStudyTimer()

    const modal = page.locator('.overlay .card', { hasText: 'Study Timer' })
    await expect(modal).toBeVisible()

    // 2. Verify Stopwatch opens in clean Ready state (00:00, NOT auto-running)
    await expect(modal.locator('text=00:00')).toBeVisible()
    await expect(modal.locator('text=Ready to Start')).toBeVisible()
    const startBtn = modal.locator('button', { hasText: 'Start' })
    await expect(startBtn).toBeVisible()

    // 3. Click Start -> Timer is actively running
    await startBtn.click()
    const pauseBtn = modal.locator('button', { hasText: 'Pause' })
    await expect(pauseBtn).toBeVisible()
    await page.waitForTimeout(1100)

    // 4. Click Pause -> Timer pauses and shows Resume & Reset
    await pauseBtn.click()
    const resumeBtn = modal.locator('button', { hasText: 'Resume' })
    await expect(resumeBtn).toBeVisible()
    const resetBtn = modal.locator('button', { hasText: 'Reset' })
    await expect(resetBtn).toBeVisible()

    // 5. Test Reset -> resets to 00:00, stops completely, returns to Start
    await resetBtn.click()
    await expect(modal.locator('text=00:00')).toBeVisible()
    await expect(modal.locator('text=Ready to Start')).toBeVisible()
    await expect(modal.locator('button', { hasText: 'Start' })).toBeVisible()

    // 6. Start fresh session for recording
    await modal.locator('button', { hasText: 'Start' }).click()
    await page.waitForTimeout(1000)

    // 4. Enter takeaways
    const notesInput = modal.locator('textarea')
    await notesInput.fill('Deep dive into CTE recursions and memory optimizations.')

    // 5. Rate confidence
    const starBtn = modal.locator('button:has(svg.lucide-star)').nth(4)
    await starBtn.click()

    // 6. Complete and save
    const finishBtn = modal.locator('button', { hasText: 'Finish & Save Time' })
    await finishBtn.click()
    await expect(modal).not.toBeVisible()

    // 7. Navigate to Stats & Review
    await app.navigateTo('Stats & Review')
    await expect(page.locator('h2', { hasText: 'Study Stats & Weekly Summary' })).toBeVisible()
    await expect(page.locator('.card', { hasText: 'Hours Studied' })).toBeVisible()
    await expect(page.locator('.card', { hasText: 'Completed Topics' })).toBeVisible()
    await expect(page.locator('.card', { hasText: 'Average Skill Score' })).toBeVisible()
    await expect(page.locator('.card', { hasText: 'Jobs in Pipeline' })).toBeVisible()
    await expect(page.locator('text=Weekly Summary & Next Steps')).toBeVisible()
  })

  test('should minimize active study session to floating pill and restore it seamlessly', async ({ page }) => {
    // 1. Launch Study Timer from header
    await app.openStudyTimer()
    const modal = page.locator('.overlay .card', { hasText: 'Study Timer' })
    await expect(modal).toBeVisible()

    // 2. Click Start to begin study
    await modal.locator('button', { hasText: 'Start' }).click()
    await page.waitForTimeout(600)

    // 3. Click Minimize to background
    const minimizeBtn = modal.locator('button', { hasText: 'Minimize to background' })
    await minimizeBtn.click()
    await expect(modal).not.toBeVisible()

    // 4. Verify Floating Study Pill appears in bottom-right corner
    const floatingPill = page.locator('.card[style*="fixed"][style*="bottom"]')
    await expect(floatingPill).toBeVisible()
    await expect(floatingPill.locator('text=Window Functions')).toBeVisible()

    // 5. Click Floating Pill to restore full modal
    await floatingPill.click()
    await expect(modal).toBeVisible()

    // 6. Pause and cancel session
    const pauseBtn = modal.locator('button', { hasText: 'Pause' })
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click()
    }
    await modal.locator('button', { hasText: 'Cancel' }).click()
    await expect(modal).not.toBeVisible()
  })
})
