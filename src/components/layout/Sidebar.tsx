import React, { useState } from 'react'
import {
  LayoutDashboard,
  Route,
  FolderKanban,
  Layers,
  Briefcase,
  BarChart3,
  ChevronRight,
  Sparkles,
  Download,
  Upload,
  RefreshCcw,
  RotateCcw,
  AlertTriangle,
  Target
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const Sidebar: React.FC = () => {
  const [confirmModal, setConfirmModal] = useState<'clean' | 'sample' | null>(null)
  const {
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

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Route, badge: '19' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: '4' },
    { id: 'skills', label: 'Skills', icon: Layers, badge: '20' },
    { id: 'career', label: 'Job Tracker', icon: Briefcase, badge: `${state.applications.length}` },
    { id: 'analytics', label: 'Stats & Review', icon: BarChart3 }
  ]

  const handleExport = () => {
    const json = exportStateJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career-os-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
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
              alert('Career OS state successfully imported!')
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
    <aside className="sidebar">
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '0.65rem'
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.875rem'
          }}
        >
          CT
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Career Tracker
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Analyst to Engineer
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, padding: '0 0.5rem 0.5rem 0.5rem' }}>
            Menu
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveView(item.id)
                    if (item.id === 'roadmap') {
                      setRoadmapStageFilter('all')
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease, color 150ms ease, transform 160ms var(--ease-out-quad), box-shadow 150ms ease',
                    textAlign: 'left',
                    boxShadow: isActive ? 'inset 3px 0 0 var(--accent-primary)' : 'none',
                    userSelect: 'none'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'
                      e.currentTarget.style.transform = 'translateX(2px)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }
                  }}
                  onMouseDown={e => {
                    e.currentTarget.style.transform = 'scale(0.98)'
                  }}
                  onMouseUp={e => {
                    e.currentTarget.style.transform = isActive ? 'translateX(0)' : 'translateX(2px)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={16} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', transition: 'color 150ms ease' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? 'var(--accent-subtle)' : 'var(--border-subtle)',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Career Stages Quick Jump */}
        <div>
          <div style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            fontWeight: 600,
            padding: '0 0.5rem 0.5rem 0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Stages</span>
            {activeView === 'roadmap' && roadmapStageFilter !== 'all' && (
              <button
                type="button"
                data-testid="sidebar-clear-stage-filter"
                onClick={() => setRoadmapStageFilter('all')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: 0,
                  textTransform: 'none'
                }}
                title="Show all phases in roadmap"
              >
                Show All
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.75rem' }}>
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
                  data-testid={`sidebar-stage-${stage.stageId}`}
                  onClick={() => navigateToStage(stage.stageId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: isStageActive ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: isStageActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isStageActive ? 600 : 500,
                    boxShadow: isStageActive ? 'inset 3px 0 0 var(--accent-primary)' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease, color 150ms ease, transform 150ms var(--ease-out-quad), box-shadow 150ms ease'
                  }}
                  onMouseEnter={e => {
                    if (!isStageActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                      e.currentTarget.style.transform = 'translateX(2px)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isStageActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }
                  }}
                  onMouseDown={e => {
                    e.currentTarget.style.transform = 'scale(0.98)'
                  }}
                  onMouseUp={e => {
                    e.currentTarget.style.transform = isStageActive ? 'translateX(0)' : 'translateX(2px)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {isStageActive && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-primary)',
                          display: 'inline-block'
                        }}
                      />
                    )}
                    <span>{stage.num}. {stage.label}</span>
                  </span>
                  <span className={`badge ${stage.variant}`} style={{ fontSize: '0.65rem' }}>{stage.badge}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Career Target Selector */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <Target size={13} style={{ color: 'var(--accent-primary)' }} />
            <span>Target Goal</span>
          </div>
          <select
            data-testid="target-goal-select"
            value={state.user.careerTarget}
            onChange={(e) => {
              const val = e.target.value as any
              setCareerTarget(val)
              showToast(`Target Goal updated: ${val}`)
            }}
            style={{
              width: '100%',
              padding: '0.35rem 0.5rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <option value="Both">Both (Full Journey)</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Strong Data Analyst">Strong Data Analyst</option>
            <option value="Analytics Engineer">Analytics Engineer</option>
          </select>
        </div>
      </div>

      {/* Footer / Data Controls */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={handleExport}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
            title="Export state to JSON file"
          >
            <Download size={12} />
            <span>Backup</span>
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
            title="Import state from JSON file"
          >
            <Upload size={12} />
            <span>Restore</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.25rem' }}>
          <button
            type="button"
            data-testid="clean-slate-sidebar-btn"
            onClick={() => setConfirmModal('clean')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.6875rem', cursor: 'pointer', padding: '2px 4px' }}
          >
            Clean Slate
          </button>
          <button
            type="button"
            data-testid="load-sample-sidebar-btn"
            onClick={() => setConfirmModal('sample')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.6875rem', cursor: 'pointer', fontWeight: 500, padding: '2px 4px' }}
          >
            Load Sample
          </button>
        </div>
      </div>

      {/* IN-APP CLEAN SLATE CONFIRMATION MODAL */}
      {confirmModal === 'clean' && (
        <div className="overlay" style={{ zIndex: 1200 }} onClick={() => setConfirmModal(null)}>
          <div
            className="card"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '440px',
              width: '92%',
              margin: 'auto',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Reset to Clean Slate?
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Wipe all progress back to 0%
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              This will reset all <strong>70 topics</strong>, <strong>4 projects</strong>, <strong>20 skills</strong>, study logs, and job applications so you can start completely fresh from zero.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-clean-slate-btn"
                onClick={() => {
                  resetToCleanSlate()
                  setConfirmModal(null)
                }}
                className="btn btn-danger"
                style={{
                  backgroundColor: 'var(--danger)',
                  color: '#ffffff',
                  padding: '0.5rem 1.25rem',
                  fontWeight: 600
                }}
              >
                Yes, Reset to 0%
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP LOAD SAMPLE CONFIRMATION MODAL */}
      {confirmModal === 'sample' && (
        <div className="overlay" style={{ zIndex: 1200 }} onClick={() => setConfirmModal(null)}>
          <div
            className="card"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '440px',
              width: '92%',
              margin: 'auto',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Load Starter Sample Data?
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Restore realistic sample milestones
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              This loads 22 completed topics, Project 1 deliverables, 20 skill ratings, and interview notes to demonstrate the full application experience.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-load-sample-btn"
                onClick={() => {
                  resetToSampleState()
                  setConfirmModal(null)
                }}
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontWeight: 600
                }}
              >
                Load Sample Data
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
