import { test, expect } from '@playwright/test'
import { AppPage } from '../pages/AppPage'
import { RoadmapPage } from '../pages/RoadmapPage'

test.describe('Roadmap Navigation, Filtering, and Topic Drawer', () => {
  let app: AppPage
  let roadmap: RoadmapPage

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page)
    roadmap = new RoadmapPage(page)
    await app.goto()
    await app.navigateTo('Roadmap')
  })

  test('should filter roadmap by stage dropdown, target goal, and handle empty state', async ({ page }) => {
    await roadmap.verifyRoadmapHeader()

    // 1. Filter by Stage A (Analyst Basics) -> 4 phases visible
    await roadmap.selectStage('stage-a')
    await expect(page.locator('text=PHASE 01')).toBeVisible()
    await expect(page.locator('text=PHASE 04')).toBeVisible()
    await expect(page.locator('text=PHASE 05')).not.toBeVisible()

    // 2. Filter by Stage B (Strong Analyst) -> 5 phases visible
    await roadmap.selectStage('stage-b')
    await expect(page.locator('text=PHASE 05')).toBeVisible()
    await expect(page.locator('text=PHASE 09')).toBeVisible()
    await expect(page.locator('text=PHASE 01')).not.toBeVisible()

    // 3. Filter by Stage C (Analytics Engineer) -> 6 phases visible
    await roadmap.selectStage('stage-c')
    await expect(page.locator('text=PHASE 10')).toBeVisible()
    await expect(page.locator('text=PHASE 15')).toBeVisible()
    await expect(page.locator('text=PHASE 01')).not.toBeVisible()

    // 4. Filter by Stage D (Final Projects) -> 4 phases visible
    await roadmap.selectStage('stage-d')
    await expect(page.locator('text=PHASE 16')).toBeVisible()
    await expect(page.locator('text=PHASE 19')).toBeVisible()

    // 5. Filter by Target Goal
    await roadmap.selectStage('target')
    await expect(page.locator('text=PHASE 01')).toBeVisible()

    // 6. Return to All Phases
    await roadmap.selectStage('all')
    await expect(page.locator('text=PHASE 01')).toBeVisible()
    await expect(page.locator('text=19 of 19 phases visible')).toBeVisible()
  })

  test('should sort roadmap by Priority, Highest Score, Lowest Score, and Roadmap Order', async ({ page }) => {
    const sortSelect = page.locator('select[data-testid="roadmap-sort-select"]')
    await expect(sortSelect).toBeVisible()

    // 1. Sort by Priority
    await sortSelect.selectOption('priority')
    await expect(page.locator('text=PHASE 01')).toBeVisible()

    // 2. Sort by Highest Score
    await sortSelect.selectOption('competency')
    await expect(page.locator('text=Full Learning Roadmap')).toBeVisible()

    // 3. Sort by Lowest Score
    await sortSelect.selectOption('competency-asc')
    await expect(page.locator('text=Full Learning Roadmap')).toBeVisible()

    // 4. Sort back to Roadmap Order
    await sortSelect.selectOption('canonical')
    await expect(page.locator('text=PHASE 01')).toBeVisible()
  })

  test('should toggle Expand All and Collapse All on phase accordions', async ({ page }) => {
    const expandBtn = page.locator('button[data-testid="roadmap-expand-all-btn"]')
    await expect(expandBtn).toBeVisible()

    // Click Expand All
    await expandBtn.click()
    await expect(expandBtn).toHaveText('Collapse All')

    // Click Collapse All
    await expandBtn.click()
    await expect(expandBtn).toHaveText('Expand All')
  })

  test('should update Target Goal from sidebar and reflect on dashboard', async ({ page }) => {
    const targetSelect = page.locator('select[data-testid="target-goal-select"]')
    await expect(targetSelect).toBeVisible()

    // Select Data Analyst
    await targetSelect.selectOption('Data Analyst')
    await expect(page.locator('text=Target Goal updated: Data Analyst')).toBeVisible()

    // Navigate to Dashboard and verify goal reflection
    await app.navigateTo('Dashboard')
    await expect(page.locator('text=Goal: Data Analyst')).toBeVisible()
    await expect(page.locator('text=GOAL').first()).toBeVisible()

    // Switch back to Both
    await targetSelect.selectOption('Both')
    await expect(page.locator('text=Target Goal updated: Both')).toBeVisible()
  })

  test('should open topic drawer, interact with checklist, and add evidence', async ({ page }) => {
    // Open first topic row
    await roadmap.openFirstTopic()
    await roadmap.verifyTopicDrawerOpen()

    // Toggle checklist item
    await roadmap.toggleChecklistItem(0)

    // Switch to My Work tab and attach evidence
    await roadmap.switchDrawerTab('My Work')
    await roadmap.addTopicEvidence('Completed advanced queries', 'https://github.com/test/my-query')

    // Verify attached evidence appears
    await expect(page.locator('text=Completed advanced queries')).toBeVisible()

    // Switch to Notes tab and enter notes
    await roadmap.switchDrawerTab('Notes')
    const textarea = page.locator('.drawer textarea')
    await textarea.fill('Testing persistence of personal notes.')

    // Close drawer
    await roadmap.closeDrawer()
    await expect(page.locator('.drawer')).not.toBeVisible()
  })

  test('should navigate and filter roadmap when clicking Stages in sidebar', async ({ page }) => {
    // Start on Dashboard
    await app.navigateTo('Dashboard')
    await expect(page.locator('text=Your Learning Progress')).toBeVisible()

    // 1. Click "2. Strong Analyst" in sidebar Stages
    const stage2Btn = page.locator('[data-testid="sidebar-stage-stage-b"]')
    await expect(stage2Btn).toBeVisible()
    await stage2Btn.click()

    // Should switch to Roadmap view
    await roadmap.verifyRoadmapHeader()
    // Should filter to stage B (Phase 5 visible, Phase 1 not visible)
    await expect(page.locator('text=PHASE 05')).toBeVisible()
    await expect(page.locator('text=PHASE 09')).toBeVisible()
    await expect(page.locator('text=PHASE 01')).not.toBeVisible()
    // Filter chip should be visible
    await expect(page.locator('[data-testid="roadmap-clear-filter-chip"]')).toBeVisible()
    // Dropdown in roadmap should show stage-b
    await expect(page.locator('select[data-testid="roadmap-stage-filter"]')).toHaveValue('stage-b')

    // 2. Click "3. Analytics Engineer" in sidebar Stages
    const stage3Btn = page.locator('[data-testid="sidebar-stage-stage-c"]')
    await stage3Btn.click()
    await expect(page.locator('text=PHASE 10')).toBeVisible()
    await expect(page.locator('text=PHASE 15')).toBeVisible()
    await expect(page.locator('text=PHASE 05')).not.toBeVisible()

    // 3. Click "4. Final Projects" in sidebar Stages
    const stage4Btn = page.locator('[data-testid="sidebar-stage-stage-d"]')
    await stage4Btn.click()
    await expect(page.locator('text=PHASE 16')).toBeVisible()
    await expect(page.locator('text=PHASE 19')).toBeVisible()
    await expect(page.locator('text=PHASE 10')).not.toBeVisible()

    // 4. Click "1. Analyst Basics" in sidebar Stages
    const stage1Btn = page.locator('[data-testid="sidebar-stage-stage-a"]')
    await stage1Btn.click()
    await expect(page.locator('text=PHASE 01')).toBeVisible()
    await expect(page.locator('text=PHASE 04')).toBeVisible()
    await expect(page.locator('text=PHASE 16')).not.toBeVisible()

    // 5. Click "Show All" in sidebar Stages header
    const showAllBtn = page.locator('[data-testid="sidebar-clear-stage-filter"]')
    await expect(showAllBtn).toBeVisible()
    await showAllBtn.click()
    await expect(page.locator('text=19 of 19 phases visible')).toBeVisible()
    await expect(page.locator('text=PHASE 01')).toBeVisible()
    await expect(page.locator('text=PHASE 19')).toBeVisible()
  })
})

