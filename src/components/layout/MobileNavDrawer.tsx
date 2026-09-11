import React, { useState } from 'react'
import {
  X,
  LayoutDashboard,
  Route,
  FolderKanban,
  Layers,
  Briefcase,
  BarChart3,
  Download,
  Upload,
  RefreshCcw,
  RotateCcw,
  AlertTriangle,
  Target
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const MobileNavDrawer: React.FC = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    activeView,
    setActiveView,
    state,
    setCareerTarget,
    resetToCleanSlate,
    resetToSampleState,
    exportStateJson,
    importStateJson,
    showToast,
    roadmapStageFilter,
    setRoadmapStageFilter,
    navigateToStage
  } = useApp()

  const [confirmModal, setConfirmModal] = useState<'clean' | 'sample' | null>(null)

  if (!isMobileNavOpen) return null

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Route, badge: '19' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: '4' },
    { id: 'skills', label: 'Skills', icon: Layers, badge: '20' },
    { id: 'career', label: 'Job Tracker', icon: Briefcase, badge: `${state.applications.length}` },
    { id: 'analytics', label: 'Stats & Review', icon: BarChart3 }
  ]

  const handleNavigate = (viewId: string) => {
    setActiveView(viewId)
    if (viewId === 'roadmap') {
      setRoadmapStageFilter('all')
    }
    setIsMobileNavOpen(false)
  }

  const handleExport = () => {
    const json = exportStateJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career-os-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('State backup exported successfully!')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          if (content) {
            const success = importStateJson(content)
            if (success) {
              showToast('Career OS state successfully imported!')
              setIsMobileNavOpen(false)
            } else {
              alert('Failed to import JSON state. Ensure the file format is valid.')
            }
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="mobile-nav-overlay"
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Header */}
        <div className="mobile-nav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9375rem'
              }}
            >
              CT
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                Career Tracker
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Analyst to Engineer
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close navigation menu"
            className="mobile-nav-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="mobile-nav-body">
          {/* Main Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, padding: '0 0.5rem 0.5rem 0.5rem' }}>
              Navigation
            </div>
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeView === item.id || (item.id === 'roadmap' && activeView === 'phase-detail') || (item.id === 'projects' && activeView === 'project-detail')

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                    <span style={{ fontSize: '0.9375rem', fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="badge badge-default" style={{ fontSize: '0.7rem' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.5rem 0' }} />

          {/* Career Stages Quick Jump */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              fontWeight: 600,
              padding: '0 0.5rem 0.25rem 0.5rem'
            }}>
              <span>Stages</span>
              {activeView === 'roadmap' && roadmapStageFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    setRoadmapStageFilter('all')
                    setIsMobileNavOpen(false)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: 0
                  }}
                >
                  Show All
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {[
                { num: '1', label: 'Analyst Basics', badge: 'P1–4', variant: 'badge-success', stageId: 'stage-a' },
                { num: '2', label: 'Strong Analyst', badge: 'P5–9', variant: 'badge-warning', stageId: 'stage-b' },
                { num: '3', label: 'Analytics Engineer', badge: 'P10–15', variant: 'badge-info', stageId: 'stage-c' },
                { num: '4', label: 'Final Projects', badge: 'P16–19', variant: 'badge-default', stageId: 'stage-d' }
              ].map(stage => {
                const isStageActive = activeView === 'roadmap' && roadmapStageFilter === stage.stageId
                return (
                  <button
                    key={stage.num}
                    type="button"
                    onClick={() => {
                      navigateToStage(stage.stageId)
                      setIsMobileNavOpen(false)
                    }}
                    className={`mobile-nav-link ${isStageActive ? 'active' : ''}`}
                    style={{
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {isStageActive && (
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-primary)',
                          display: 'inline-block'
                        }} />
                      )}
                      <span>{stage.num}. {stage.label}</span>
                    </span>
                    <span className={`badge ${stage.variant}`} style={{ fontSize: '0.65rem' }}>{stage.badge}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.5rem 0' }} />

          {/* Target Goal Switcher */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, padding: '0 0.5rem 0.5rem 0.5rem' }}>
              <Target size={13} style={{ color: 'var(--accent-primary)' }} />
              <span>Target Role</span>
            </div>
            <div style={{ padding: '0 0.5rem' }}>
              <select
                value={state.user.careerTarget}
                onChange={e => {
                  const target = e.target.value as any
                  setCareerTarget(target)
                  showToast(`Target Goal updated: ${target}`)
                }}
                className="mobile-nav-select"
                aria-label="Select Target Career Role"
              >
                <option value="Data Analyst">Data Analyst (Phase 1–9 + Project 1–2)</option>
                <option value="Analytics Engineer">Analytics Engineer (Phase 1–15 + Project 3)</option>
                <option value="Both">Both (Complete 19-Phase Curriculum)</option>
              </select>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.5rem 0' }} />

          {/* Data Controls */}
          <div>
            <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, padding: '0 0.5rem 0.5rem 0.5rem' }}>
              Data & Persistence
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleExport}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem', justifyContent: 'center' }}
                >
                  <Download size={13} />
                  <span>Backup</span>
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem', justifyContent: 'center' }}
                >
                  <Upload size={13} />
                  <span>Restore</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setConfirmModal('clean')}
                  className="btn btn-outline-danger btn-sm"
                  style={{ gap: '0.35rem', justifyContent: 'center' }}
                >
                  <RotateCcw size={12} />
                  <span>Clean Slate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmModal('sample')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem', justifyContent: 'center', color: 'var(--accent-primary)', borderColor: 'var(--accent-border)' }}
                >
                  <RefreshCcw size={12} />
                  <span>Load Sample</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Slate Confirmation Modal */}
      {confirmModal === 'clean' && (
        <div className="overlay" style={{ zIndex: 1200 }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--danger-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Reset to Clean Slate?</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>This will reset all progress to 0%.</p>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
              All topics, checklists, test results, and study sessions will start fresh with zero mock data.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setConfirmModal(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  resetToCleanSlate()
                  setConfirmModal(null)
                  setIsMobileNavOpen(false)
                }}
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Sample Confirmation Modal */}
      {confirmModal === 'sample' && (
        <div className="overlay" style={{ zIndex: 1200 }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCcw size={20} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Load Sample Data?</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Restore realistic sample progress.</p>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
              This will populate realistic sample data (22 completed topics, mock applications, and study logs) for demonstration purposes.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setConfirmModal(null)} className="btn btn-secondary btn-sm">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  resetToSampleState()
                  setConfirmModal(null)
                  setIsMobileNavOpen(false)
                }}
                className="btn btn-primary btn-sm"
              >
                Yes, Load Sample
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
