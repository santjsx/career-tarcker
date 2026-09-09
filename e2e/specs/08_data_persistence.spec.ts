import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'

test.describe('Data Persistence Controls (Backup, Restore, Clean Slate, Load Sample)', () => {
  let app: AppPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    await app.goto()
  })

  test('Clean Slate should wipe all topic, project, skill, and daily plan progress to 0%', async ({ page }) => {
    // Click Clean Slate in sidebar
    const cleanSlateBtn = page.locator('aside.sidebar button', { hasText: 'Clean Slate' })
    await expect(cleanSlateBtn).toBeVisible()
    await cleanSlateBtn.click()

    // Confirm in in-app modal
    const confirmBtn = page.locator('#confirm-clean-slate-btn')
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    // 1. Verify roadmap completion is 0 of 70 topics completed
    await expect(page.locator('text=0 of 70 topics completed')).toBeVisible()

    // 2. Verify Daily Plan card shows clean state (0 of 4 Done, 0-Day Streak)
    await expect(page.locator('text=0 of 4 Done')).toBeVisible()
    await expect(page.locator('text=0-Day Streak')).toBeVisible()
    await expect(page.locator('text=Start Phase 1: SQL Basics & Filtering')).toBeVisible()

    // 3. Navigate to Skills Matrix and verify all scores are 0%
    await app.navigateTo('Skills')
    await expect(page.locator('h2', { hasText: 'Skills & Practice Logs' })).toBeVisible()
    // Look for Novice badge or 0%
    await expect(page.locator('text=0%').first()).toBeVisible()

    // 4. Navigate to Stats & Review and verify zeroed metrics and clean retrospective
    await app.navigateTo('Stats & Review')
    await expect(page.locator('text=0.0 hrs')).toBeVisible()
    await expect(page.locator('text=No topics or practice logs completed yet')).toBeVisible()
  })

  test('Load Sample should restore realistic starter data', async ({ page }) => {
    // First clean slate
    await page.locator('aside.sidebar button', { hasText: 'Clean Slate' }).click()
    await page.locator('#confirm-clean-slate-btn').click()

    // Then Load Sample
    const loadSampleBtn = page.locator('aside.sidebar button', { hasText: 'Load Sample' })
    await expect(loadSampleBtn).toBeVisible()
    await loadSampleBtn.click()
    await page.locator('#confirm-load-sample-btn').click()

    // Verify sample progress is restored (22 of 70 topics)
    await expect(page.locator('text=22 of 70 topics completed')).toBeVisible()
  })

  test('Backup should download a valid JSON export of application state', async ({ page }) => {
    const backupBtn = page.locator('aside.sidebar button', { hasText: 'Backup' })
    await expect(backupBtn).toBeVisible()

    // Wait for download event
    const downloadPromise = page.waitForEvent('download')
    await backupBtn.click()
    const download = await downloadPromise

    // Verify filename pattern
    expect(download.suggestedFilename()).toMatch(/career-os-backup-.*\.json/)

    // Read download content and parse JSON
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    const jsonContent = JSON.parse(Buffer.concat(chunks).toString('utf-8'))

    // Verify required state keys exist
    expect(jsonContent).toHaveProperty('topics')
    expect(jsonContent).toHaveProperty('projects')
    expect(jsonContent).toHaveProperty('phases')
    expect(jsonContent).toHaveProperty('user')
  })

  test('Restore should successfully import saved state from a JSON backup file', async ({ page }) => {
    // 1. Download clean backup to get valid JSON state
    const backupBtn = page.locator('aside.sidebar button', { hasText: 'Backup' })
    const downloadPromise = page.waitForEvent('download')
    await backupBtn.click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    const stateJson = Buffer.concat(chunks)

    // 2. Wipe state via Clean Slate
    await page.locator('aside.sidebar button', { hasText: 'Clean Slate' }).click()
    await page.locator('#confirm-clean-slate-btn').click()
    await expect(page.locator('text=0 of 70 topics completed')).toBeVisible()

    // 3. Trigger Restore with file chooser
    page.once('dialog', dialog => dialog.accept()) // handles alert('Career OS state successfully imported!')
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.locator('aside.sidebar button', { hasText: 'Restore' }).click()
    const fileChooser = await fileChooserPromise

    // Upload backup buffer
    await fileChooser.setFiles({
      name: 'restore-test.json',
      mimeType: 'application/json',
      buffer: stateJson
    })

    // 4. Verify progress is restored
    await expect(page.locator('text=22 of 70 topics completed')).toBeVisible()
  })
})
