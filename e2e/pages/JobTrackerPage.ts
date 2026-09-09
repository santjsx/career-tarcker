import { type Page, expect } from '@playwright/test'

export class JobTrackerPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async verifyJobTrackerHeader() {
    await expect(this.page.locator('h2', { hasText: 'Job Tracker & Readiness' })).toBeVisible()
    await expect(this.page.locator('text=Step 1: Junior Analyst')).toBeVisible()
    await expect(this.page.locator('text=Step 2: Senior / Engineer')).toBeVisible()
  }

  async addJobApplication(company: string, role: string, notes: string = '') {
    const addJobBtn = this.page.locator('button', { hasText: 'Add Job' })
    await addJobBtn.click()

    const modal = this.page.locator('.card', { hasText: 'Add Job Application' })
    await expect(modal).toBeVisible()

    await modal.locator('input[placeholder*="Stripe" i]').fill(company)
    await modal.locator('input[placeholder*="Junior Data Analyst" i]').fill(role)
    if (notes) {
      await modal.locator('textarea[placeholder*="Referral" i]').fill(notes)
    }

    await modal.locator('button[type="submit"]', { hasText: 'Save Job' }).click()
    await expect(modal).not.toBeVisible()
  }

  async logInterviewNote(company: string, skill: string, question: string) {
    const logBtn = this.page.locator('button', { hasText: 'Log Interview Note' })
    await logBtn.click()

    const modal = this.page.locator('.card', { hasText: 'Add Interview Question' })
    await expect(modal).toBeVisible()

    await modal.locator('input[placeholder*="Stripe" i]').fill(company)
    await modal.locator('input[placeholder*="Window Functions" i]').fill(skill)
    await modal.locator('textarea[placeholder*="difference between" i]').fill(question)

    await modal.locator('button[type="submit"]', { hasText: 'Save Note' }).click()
    await expect(modal).not.toBeVisible()
  }

  async resolveFirstInterviewGap() {
    const markDoneBtn = this.page.locator('button', { hasText: 'Mark Done' }).first()
    if (await markDoneBtn.isVisible()) {
      await markDoneBtn.click()
    }
  }
}
