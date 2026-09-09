import { type Page, expect } from '@playwright/test'

export class ProjectsPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async verifyProjectsHub() {
    await expect(this.page.locator('h2', { hasText: 'Hands-on Projects' })).toBeVisible()
    await expect(this.page.locator('text=Build 4 real-world projects')).toBeVisible()
  }

  async drillIntoProject(index: number = 0) {
    const viewDetailsBtn = this.page.locator('button', { hasText: 'View Project' }).nth(index)
    await viewDetailsBtn.click()
  }

  async verifyProjectSteps() {
    await expect(this.page.locator('text=Project Steps')).toBeVisible()
    await expect(this.page.locator('text=STEP 1')).toBeVisible()
  }

  async toggleTaskCheckbox(index: number = 0) {
    const taskCheckbox = this.page.locator('button:has(svg.lucide-square), button:has(svg.lucide-check-square)').nth(index)
    await taskCheckbox.click()
  }

  async attachDeliverableLink(index: number = 0, url: string) {
    const linkInput = this.page.locator('input[placeholder*="Paste your GitHub" i]').nth(index)
    await linkInput.fill(url)
    await linkInput.blur()
  }
}
