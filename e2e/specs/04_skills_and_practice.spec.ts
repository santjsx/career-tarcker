import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'
import { SkillsPage } from '../pages/SkillsPage'

test.describe('Skills Matrix and Continuous Practice Logs', () => {
  let app: AppPage
  let skills: SkillsPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    skills = new SkillsPage(page)
    await app.goto()
    await app.navigateTo('Skills')
  })

  test('should display 20 skills table with theory and hands-on progress bars', async ({ page }) => {
    await skills.verifySkillsHeader()

    // Verify key columns
    await expect(page.locator('th:has-text("Skill & Area")')).toBeVisible()
    await expect(page.locator('th:has-text("Reading")')).toBeVisible()
    await expect(page.locator('th:has-text("Practice")')).toBeVisible()
    await expect(page.locator('th:has-text("Proof Attached")')).toBeVisible()
    await expect(page.locator('th:has-text("Level")')).toBeVisible()

    // Verify skills rows
    await expect(page.locator('td:has-text("SQL")').first()).toBeVisible()
    await expect(page.locator('td:has-text("Python")').first()).toBeVisible()
    await expect(page.locator('td:has-text("dbt")').first()).toBeVisible()
  })

  test('should switch to practice logs and add a new entry', async ({ page }) => {
    await skills.switchToPracticeLogs()

    // Add new practice entry
    await skills.addPracticeLog(
      'Cart Dropoff Analysis',
      'Why did checkout drop 15% on mobile safari?',
      'Identified Apple Pay token timeout bug in checkout v2.'
    )

    // Verify new card rendered
    await expect(page.locator('text=Cart Dropoff Analysis')).toBeVisible()
    await expect(page.locator('text=Identified Apple Pay token timeout bug')).toBeVisible()
  })

  test('should filter skills table via search bar and handle empty search results', async ({ page }) => {
    const searchInput = page.locator('[data-testid="skills-search-input"]')
    await expect(searchInput).toBeVisible()

    // Filter by "SQL"
    await searchInput.fill('SQL')
    await expect(page.locator('td', { hasText: 'SQL' }).first()).toBeVisible()
    await expect(page.locator('td', { hasText: 'Python Programming' })).not.toBeVisible()

    // Filter by unmatched term
    await searchInput.fill('NonExistentSkillXYZ')
    await expect(page.locator('text=No skills match "NonExistentSkillXYZ"')).toBeVisible()

    // Clear search
    await searchInput.fill('')
    await expect(page.locator('td', { hasText: 'Python Programming' })).toBeVisible()
  })
})
