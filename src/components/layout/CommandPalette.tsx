import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Search, X, Route, FolderKanban, Layers, Briefcase, ChevronRight, FileText, RotateCcw, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const CommandPalette: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    state,
    setActiveView,
    setSelectedPhaseId,
    setSelectedTopicId,
    setSelectedProjectId,
    resetToCleanSlate,
    resetToSampleState
  } = useApp()

  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isSearchOpen])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null

    const systemActions = [
      {
        id: 'act-clean',
        title: 'Clean Slate: Reset All Progress to 0%',
        subtitle: 'Wipe all 70 topics, 4 projects, 20 skills to start from scratch',
        keywords: ['clean', 'slate', 'reset', 'clear', 'wipe', 'zero', 'empty', 'new'],
        icon: RotateCcw,
        color: 'var(--danger)',
        run: () => {
          resetToCleanSlate()
          setIsSearchOpen(false)
        }
      },
      {
        id: 'act-sample',
        title: 'Load Starter Sample Data',
        subtitle: 'Restore 22 validated topics, Project 1 deliverables, and interview notes',
        keywords: ['load', 'sample', 'demo', 'example', 'starter', 'mock', 'seed'],
        icon: Sparkles,
        color: 'var(--accent-primary)',
        run: () => {
          resetToSampleState()
          setIsSearchOpen(false)
        }
      }
    ]

    const matchedActions = systemActions.filter(act =>
      act.keywords.some(k => q.includes(k) || k.includes(q)) ||
      act.title.toLowerCase().includes(q)
    )

    const matchedPhases = state.phases.filter(p =>
      p.name.toLowerCase().includes(q) || p.goal.toLowerCase().includes(q) || `phase ${p.number}`.includes(q)
    )

    const matchedTopics = Object.values(state.topics).filter(t =>
      t.name.toLowerCase().includes(q) || t.goal.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
    )

    const matchedProjects = state.projects.filter(p =>
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.architecture.toLowerCase().includes(q)
    )

    const matchedSkills = state.skills.filter(s =>
      s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    )

    const matchedApplications = state.applications.filter(a =>
      a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
    )

    return {
      actions: matchedActions,
      phases: matchedPhases,
      topics: matchedTopics.slice(0, 8),
      projects: matchedProjects,
      skills: matchedSkills,
      applications: matchedApplications
    }
  }, [query, state, resetToCleanSlate, resetToSampleState, setIsSearchOpen])

  if (!isSearchOpen) return null

  return (
    <div className="overlay" onClick={() => setIsSearchOpen(false)}>
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: 0,
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Search input bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '0.75rem'
          }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search phases, topics, projects, skills, notes... (ESC to exit)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') setIsSearchOpen(false)
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ padding: '0.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!query && (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Type a term above to search across the full 19 phases, projects, competencies, and applications.
            </div>
          )}

          {results && (
            <>
              {/* Quick Actions */}
              {results.actions.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                    Quick Actions
                  </div>
                  {results.actions.map(act => {
                    const Icon = act.icon
                    return (
                      <div
                        key={act.id}
                        onClick={act.run}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          color: 'var(--text-primary)',
                          transition: 'background-color 100ms',
                          backgroundColor: 'var(--bg-surface)'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Icon size={16} style={{ color: act.color }} />
                          <div>
                            <div style={{ fontWeight: 600, color: act.color }}>{act.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.subtitle}</div>
                          </div>
                        </div>
                        <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Execute</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Topics */}
              {results.topics.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                    Topics ({results.topics.length})
                  </div>
                  {results.topics.map(t => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTopicId(t.id)
                        setActiveView('roadmap')
                        setIsSearchOpen(false)
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                        transition: 'background-color 100ms'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phase {t.phaseId}: {t.goal}</div>
                      </div>
                      <span className="badge badge-default" style={{ fontSize: '0.65rem' }}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Phases */}
              {results.phases.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                    Phases ({results.phases.length})
                  </div>
                  {results.phases.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPhaseId(p.id)
                        setActiveView('phase-detail')
                        setIsSearchOpen(false)
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Route size={14} style={{ color: 'var(--accent-primary)' }} />
                        <span style={{ fontWeight: 600 }}>Phase {p.number}: {p.name}</span>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                    Projects
                  </div>
                  {results.projects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id)
                        setActiveView('project-detail')
                        setIsSearchOpen(false)
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FolderKanban size={14} style={{ color: 'var(--warning)' }} />
                        <span style={{ fontWeight: 600 }}>Project {p.id}: {p.title}</span>
                      </div>
                      <span className="badge badge-warning">{p.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {results.skills.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                    Skills
                  </div>
                  {results.skills.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveView('skills')
                        setIsSearchOpen(false)
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.8125rem'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={14} style={{ color: 'var(--info)' }} />
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({s.category})</span>
                      </div>
                      <span className="badge badge-default">{s.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state when no matches */}
              {results.topics.length === 0 &&
                results.phases.length === 0 &&
                results.projects.length === 0 &&
                results.skills.length === 0 &&
                results.applications.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    No items matching "{query}". Try searching for "SQL", "dbt", "Modeling", or "Power BI".
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
