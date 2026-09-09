import { type Page, expect } from '@playwright/test'

export class RoadmapPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async verifyRoadmapHeader() {
    await expect(this.page.locator('h2', { hasText: 'Full Learning Roadmap' })).toBeVisible()
    await expect(this.page.locator('text=beginner analyst to analytics engineer')).toBeVisible()
  }

  async selectStage(stageValue: string) {
    const stageSelect = this.page.locator('main select').first()
    await stageSelect.selectOption(stageValue)
  }

  async openFirstTopic() {
    const detailsBtn = this.page.locator('button', { hasText: 'Details' }).first()
    await expect(detailsBtn).toBeVisible()
    await detailsBtn.click()
  }

  async verifyTopicDrawerOpen() {
    const drawer = this.page.locator('.drawer')
    await expect(drawer).toBeVisible()
    await expect(drawer.locator('h3')).toBeVisible()
  }

  async toggleChecklistItem(index: number = 0) {
    const drawer = this.page.locator('.drawer')
    const item = drawer.locator('div[style*="cursor: pointer"]', { hasText: /^\d\./ }).nth(index)
    await item.click()
  }

  async switchDrawerTab(tabName: 'Checklist & Score' | 'My Work' | 'Notes' | 'Review') {
    const drawer = this.page.locator('.drawer')
    const tabBtn = drawer.locator('button.tab-btn', { hasText: tabName })
    await tabBtn.click()
  }

  async addTopicEvidence(title: string, url: string) {
    const drawer = this.page.locator('.drawer')
    await this.switchDrawerTab('My Work')
    await drawer.locator('input[type="text"]').first().fill(title)
    await drawer.locator('input[type="url"]').first().fill(url)
    await drawer.locator('button', { hasText: 'Attach Evidence' }).click()
  }

  async closeDrawer() {
    const closeBtn = this.page.locator('.drawer button[aria-label="Close drawer"]').first()
    await closeBtn.click()
  }
}
