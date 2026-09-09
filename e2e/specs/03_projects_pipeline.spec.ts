import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'
import { ProjectsPage } from '../pages/ProjectsPage'

test.describe('Projects Hub, Skills Matrix, and Capstone Pipeline', () => {
  let app: AppPage
  let projects: ProjectsPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    projects = new ProjectsPage(page)
    await app.goto()
    await app.navigateTo('Projects')
  })

  test('should display 4 production projects and skills coverage matrix', async ({ page }) => {
    await projects.verifyProjectsHub()

    // Verify matrix
    await expect(page.locator('text=Skills Covered in Each Project')).toBeVisible()
    await expect(page.locator('text=P1: Sales Analysis')).toBeVisible()
    await expect(page.locator('text=P2: Python Pipeline')).toBeVisible()
    await expect(page.locator('text=P3: Modern AE (dbt)')).toBeVisible()
    await expect(page.locator('text=P4: End-to-End Platform')).toBeVisible()
  })

  test('should drill into project details, verify pipeline steps, and complete tasks', async ({ page }) => {
    // Drill into Project 1
    await projects.drillIntoProject(0)
    await projects.verifyProjectSteps()

    // Verify tasks checklist section
    await expect(page.locator('text=Project Tasks & Checklist')).toBeVisible()

    // Toggle first task completion checkbox
    await projects.toggleTaskCheckbox(0)

    // Attach GitHub / Live dashboard link
    await projects.attachDeliverableLink(0, 'https://github.com/myuser/ecommerce-analytics')

    // Verify Open link button appears
    await expect(page.locator('a:has-text("Open")').first()).toBeVisible()
  })
})
