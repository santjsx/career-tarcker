import { type Page, expect } from '@playwright/test'

export class DashboardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async verifyProgressMetrics() {
    await expect(this.page.locator('text=Your Learning Progress')).toBeVisible()
    await expect(this.page.locator('text=Roadmap Done')).toBeVisible()
    await expect(this.page.locator('text=Skill Mastery')).toBeVisible()
    await expect(this.page.locator('text=Projects Built')).toBeVisible()
    await expect(this.page.locator('text=Job Readiness')).toBeVisible()
  }

  async toggleRecommendedActionWhy() {
    const whyBtn = this.page.locator('button', { hasText: 'Why this?' })
    await expect(whyBtn).toBeVisible()
    await whyBtn.click()
  }

  async verifyRecommendedActionCard() {
    await expect(this.page.locator('text=Recommended Next Step')).toBeVisible()
  }

  async checkDailyPlanItem(index: number = 0) {
    const taskCheckbox = this.page.locator('button:has(svg.lucide-square)').nth(index)
    if (await taskCheckbox.isVisible()) {
      await taskCheckbox.click()
    }
  }

  async getCareerJourneySteps() {
    return this.page.locator('text=Career Roadmap Milestones')
  }
}
