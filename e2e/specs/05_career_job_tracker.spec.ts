import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'
import { JobTrackerPage } from '../pages/JobTrackerPage'

test.describe('Job Tracker, Milestone Gates, and Application Pipeline', () => {
  let app: AppPage
  let jobTracker: JobTrackerPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    jobTracker = new JobTrackerPage(page)
    await app.goto()
    await app.navigateTo('Job Tracker')
  })

  test('should display milestone gates with transparent criteria', async ({ page }) => {
    await jobTracker.verifyJobTrackerHeader()

    // Step 1: Junior Analyst gate criteria
    await expect(page.locator('text=SQL Skills').first()).toBeVisible()
    await expect(page.locator('text=Excel & Spreadsheets').first()).toBeVisible()
    await expect(page.locator('text=Statistics Basics').first()).toBeVisible()
    await expect(page.locator('text=Power BI Basics').first()).toBeVisible()

    // Step 2: Senior / Engineer gate criteria
    await expect(page.locator('text=Python & Pandas').first()).toBeVisible()
    await expect(page.locator('text=Data Modeling').first()).toBeVisible()
  })

  test('should log interview notes and track job applications', async ({ page }) => {
    // 1. Add new job application
    await jobTracker.addJobApplication(
      'Acme Analytics',
      'Junior Analytics Engineer',
      'Contacted hiring manager on LinkedIn'
    )

    // Verify Acme Analytics card appears in Kanban
    await expect(page.locator('text=Acme Analytics').first()).toBeVisible()

    // 2. Log an interview note
    await jobTracker.logInterviewNote(
      'Acme Analytics',
      'SQL LAG/LEAD',
      'Asked to write a running cumulative sum without window frame'
    )

    // Verify interview note appears
    await expect(page.locator('text=Acme Analytics').first()).toBeVisible()
    await expect(page.locator('text=SQL LAG/LEAD').first()).toBeVisible()

    // 3. Move application to Recruiter Screen stage
    const acmeCard = page.locator('div[style*="box-shadow"]', { hasText: 'Acme Analytics' }).first()
    const stageSelect = acmeCard.locator('select')
    await stageSelect.selectOption('recruiter')
    await page.waitForTimeout(300)
    await expect(stageSelect).toHaveValue('recruiter')

    // 4. Mark the interview feedback as done
    await jobTracker.resolveFirstInterviewGap()

    // 5. Delete job application
    const deleteBtn = acmeCard.locator('button', { hasText: 'Delete' })
    await deleteBtn.click()
    await expect(page.locator('div[style*="box-shadow"]', { hasText: 'Acme Analytics' })).not.toBeVisible()
  })
})
