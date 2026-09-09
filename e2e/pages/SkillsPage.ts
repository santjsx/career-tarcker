import { type Page, expect } from '@playwright/test'

export class SkillsPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async verifySkillsHeader() {
    await expect(this.page.locator('h2', { hasText: 'Skills & Practice Logs' })).toBeVisible()
    await expect(this.page.locator('button', { hasText: 'All 20 Skills' })).toBeVisible()
    await expect(this.page.locator('button', { hasText: /Practice Logs/ })).toBeVisible()
  }

  async switchToPracticeLogs() {
    const logsTab = this.page.locator('button', { hasText: /Practice Logs/ })
    await logsTab.click()
    await expect(this.page.locator('h3', { hasText: 'Real-World Practice Logs' })).toBeVisible()
  }

  async addPracticeLog(title: string, question: string, insight: string) {
    const addBtn = this.page.locator('button', { hasText: 'Add Practice Entry' })
    await addBtn.click()

    const modal = this.page.locator('.card', { hasText: 'Add Practice Entry' })
    await expect(modal).toBeVisible()

    await modal.locator('input[placeholder*="Why did checkout drop" i]').fill(title)
    await modal.locator('input[placeholder*="subscription retention" i]').fill(question)
    await modal.locator('textarea[placeholder*="acquisition channels" i]').fill(insight)

    await modal.locator('button[type="submit"]', { hasText: 'Save Entry' }).click()
    await expect(modal).not.toBeVisible()
  }
}
