import { type Page, expect } from '@playwright/test'

export class AppPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' })
  }

  // Sidebar navigation helpers
  async navigateTo(menuName: 'Dashboard' | 'Roadmap' | 'Projects' | 'Skills' | 'Job Tracker' | 'Stats & Review') {
    const navBtn = this.page.locator('aside.sidebar nav button', { hasText: menuName })
    await expect(navBtn).toBeVisible()
    await navBtn.click()
  }

  // Date Calendar Widget helpers
  async getDateWidget() {
    return this.page.locator('button.date-pill-btn')
  }

  async toggleCalendarPopover() {
    const widget = await this.getDateWidget()
    await widget.click()
  }

  // Theme switcher helper
  async cycleTheme() {
    const themeBtn = this.page.locator('button[title*="theme" i], button:has(svg.lucide-moon), button:has(svg.lucide-sun)').first()
    await themeBtn.click()
  }

  // Command Palette helper
  async openCommandPalette() {
    await this.page.keyboard.press('Control+KeyK')
  }

  // Quick Study Timer helper
  async openStudyTimer() {
    const studyBtn = this.page.locator('button', { hasText: 'Study Mode' })
    await studyBtn.click()
  }
}
