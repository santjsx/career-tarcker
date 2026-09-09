import React from 'react'
import { useApp } from './context/AppContext'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { CommandPalette } from './components/layout/CommandPalette'
import { KeyboardShortcutsModal } from './components/layout/KeyboardShortcutsModal'
import { TopicDrawer } from './components/roadmap/TopicDrawer'
import { StudySessionModal } from './components/study/StudySessionModal'
import { FloatingStudyPill } from './components/study/FloatingStudyPill'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { MobileNavDrawer } from './components/layout/MobileNavDrawer'

// Views
import { HeroProgressCard } from './components/dashboard/HeroProgressCard'
import { NextBestActionCard } from './components/dashboard/NextBestActionCard'
import { CareerJourneyPath } from './components/dashboard/CareerJourneyPath'
import { DailyPlanCard } from './components/dashboard/DailyPlanCard'
import { PhaseQuickGrid } from './components/dashboard/PhaseQuickGrid'

import { RoadmapView } from './components/roadmap/RoadmapView'
import { PhaseDetailView } from './components/roadmap/PhaseDetailView'
import { ProjectsHub } from './components/projects/ProjectsHub'
import { ProjectDetailView } from './components/projects/ProjectDetailView'
import { SkillMatrixView } from './components/skills/SkillMatrixView'
import { CareerTrackerView } from './components/career/CareerTrackerView'
import { AnalyticsView } from './components/analytics/AnalyticsView'

export const AppContent: React.FC = () => {
  const { activeView, toastMessage } = useApp()

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Header />

        <main className="view-container">
          {activeView === 'overview' && (
            <>
              <HeroProgressCard />
              <NextBestActionCard />
              <CareerJourneyPath />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                <DailyPlanCard />
              </div>
              <PhaseQuickGrid />
            </>
          )}

          {activeView === 'roadmap' && <RoadmapView />}
          {activeView === 'phase-detail' && <PhaseDetailView />}
          {activeView === 'projects' && <ProjectsHub />}
          {activeView === 'project-detail' && <ProjectDetailView />}
          {activeView === 'skills' && <SkillMatrixView />}
          {activeView === 'career' && <CareerTrackerView />}
          {activeView === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '1.75rem',
            right: '1.75rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals & Drawers */}
      <TopicDrawer />
      <CommandPalette />
      <KeyboardShortcutsModal />
      <StudySessionModal />
      <FloatingStudyPill />

      {/* Mobile Responsive Navigation Shell */}
      <MobileBottomNav />
      <MobileNavDrawer />
    </div>
  )
}

export const App: React.FC = () => {
  return <AppContent />
}

export default App
