import React, { useState, useMemo } from 'react'
import {
  Route,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  RotateCcw,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Topic, Phase } from '../../types'
import { calculatePhaseCompetency, calculateTopicCompetency } from '../../services/competencyEngine'

export const RoadmapView: React.FC = () => {
  const { state, setSelectedTopicId, setSelectedPhaseId, setActiveView, updatePhaseToolChoice } = useApp()

  const [stageFilter, setStageFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'canonical' | 'priority' | 'competency' | 'competency-asc' | 'reviews'>('canonical')
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true
  })

  const togglePhaseExpand = (phaseId: number) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }))
  }

  // Filter phases by stage
  const filteredPhases = useMemo(() => {
    let list = state.phases

    if (stageFilter === 'stage-a') list = list.filter(p => p.stageId === 'stage-a')
    else if (stageFilter === 'stage-b') list = list.filter(p => p.stageId === 'stage-b')
    else if (stageFilter === 'stage-c') list = list.filter(p => p.stageId === 'stage-c')
    else if (stageFilter === 'stage-d') list = list.filter(p => p.stageId === 'stage-d')
    else if (stageFilter === 'target') {
      const target = state.user.careerTarget
      if (target === 'Data Analyst') list = list.filter(p => p.stageId === 'stage-a')
      else if (target === 'Strong Data Analyst') list = list.filter(p => p.stageId === 'stage-a' || p.stageId === 'stage-b')
      else if (target === 'Analytics Engineer') list = list.filter(p => p.stageId === 'stage-c' || p.stageId === 'stage-d')
      // if 'Both', show all 19
    } else if (stageFilter === 'needs-review') {
      const reviewPhaseIds = new Set(
        Object.values(state.topics)
          .filter(t => t.needsReview)
          .map(t => t.phaseId)
      )
      list = list.filter(p => reviewPhaseIds.has(p.id))
    }

    if (sortBy === 'priority') {
      list = [...list].sort((a, b) => b.priority - a.priority)
    } else if (sortBy === 'competency') {
      list = [...list].sort((a, b) => calculatePhaseCompetency(b.id, state.topics) - calculatePhaseCompetency(a.id, state.topics))
    } else if (sortBy === 'competency-asc') {
      list = [...list].sort((a, b) => calculatePhaseCompetency(a.id, state.topics) - calculatePhaseCompetency(b.id, state.topics))
    } else {
      list = [...list].sort((a, b) => a.number - b.number)
    }

    return list
  }, [state.phases, state.topics, state.user.careerTarget, stageFilter, sortBy])

  const allFilteredIds = useMemo(() => filteredPhases.map(p => p.id), [filteredPhases])
  const areAllExpanded = allFilteredIds.length > 0 && allFilteredIds.every(id => expandedPhases[id])

  const toggleExpandAll = () => {
    if (areAllExpanded) {
      setExpandedPhases(prev => {
        const next = { ...prev }
        allFilteredIds.forEach(id => { next[id] = false })
        return next
      })
    } else {
      setExpandedPhases(prev => {
        const next = { ...prev }
        allFilteredIds.forEach(id => { next[id] = true })
        return next
      })
    }
  }

  const handleStageFilterChange = (newFilter: string) => {
    setStageFilter(newFilter)
    if (newFilter !== 'all') {
      setExpandedPhases(prev => {
        const next = { ...prev }
        state.phases.forEach(p => { next[p.id] = true })
        return next
      })
    }
  }

  const stageLabels: Record<string, string> = {
    'stage-a': 'Stage A: Data Analyst Foundation (Phases 1–4)',
    'stage-b': 'Stage B: Strong Data Analyst (Phases 5–9)',
    'stage-c': 'Stage C: Analytics Engineering Specialization (Phases 10–15)',
    'stage-d': 'Stage D: Production Skills & Capstone (Phases 16–19)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Route size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Full Learning Roadmap
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Learn step-by-step from beginner analyst to analytics engineer ({filteredPhases.length} of 19 phases visible)
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Stage Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              data-testid="roadmap-stage-filter"
              value={stageFilter}
              onChange={e => handleStageFilterChange(e.target.value)}
              style={{
                padding: '0.35rem 0.65rem',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Phases</option>
              <option value="target">Target: {state.user.careerTarget}</option>
              <option value="stage-a">1. Analyst Basics</option>
              <option value="stage-b">2. Strong Analyst</option>
              <option value="stage-c">3. Analytics Engineer</option>
              <option value="stage-d">4. Final Projects</option>
              <option value="needs-review">Needs Review</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              data-testid="roadmap-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{
                padding: '0.35rem 0.65rem',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              <option value="canonical">Roadmap Order</option>
              <option value="priority">Priority</option>
              <option value="competency">Highest Score</option>
              <option value="competency-asc">Lowest Score</option>
            </select>
          </div>

          {/* Expand / Collapse All Toggle */}
          {filteredPhases.length > 0 && (
            <button
              type="button"
              data-testid="roadmap-expand-all-btn"
              onClick={toggleExpandAll}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              {areAllExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          )}
        </div>
      </div>

      {/* Phases Accordions or Empty State */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredPhases.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--bg-surface)' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--success)', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              {stageFilter === 'needs-review' ? 'No Topics Need Review Right Now!' : 'No Phases Match Your Selected Filter'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {stageFilter === 'needs-review'
                ? 'All topics in your roadmap are retained in good standing with zero review flags.'
                : 'Try switching to All Phases or selecting another filter option.'}
            </p>
            <button
              type="button"
              onClick={() => handleStageFilterChange('all')}
              className="btn btn-secondary btn-sm"
              style={{ margin: '0 auto' }}
            >
              Show All 19 Phases
            </button>
          </div>
        ) : (
          filteredPhases.map(phase => {
          const phaseTopics = Object.values(state.topics).filter(t => t.phaseId === phase.id)
          const compScore = calculatePhaseCompetency(phase.id, state.topics)
          const isExpanded = !!expandedPhases[phase.id]

          return (
            <div
              key={phase.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                border: isExpanded ? '1px solid var(--border-default)' : '1px solid var(--border-subtle)'
              }}
            >
              {/* Phase Header Bar */}
              <div
                onClick={() => togglePhaseExpand(phase.id)}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                      transition: 'transform 200ms var(--ease-out-quad), color 150ms ease'
                    }}
                    aria-label={isExpanded ? 'Collapse phase' : 'Expand phase'}
                  >
                    <ChevronDown size={18} />
                  </button>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        PHASE {String(phase.number).padStart(2, '0')}
                      </span>
                      {phase.isContinuous && (
                        <span className="badge badge-accent">Continuous Practice</span>
                      )}
                      <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            fill={i < phase.priority ? 'currentColor' : 'none'}
                            stroke="currentColor"
                          />
                        ))}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {phase.name}
                    </h3>
                  </div>
                </div>

                {/* Right Header Stats & Tool Choice */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Tool Choice if applicable */}
                  {phase.toolChoice && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--bg-app)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <SlidersHorizontal size={12} style={{ color: 'var(--text-muted)' }} />
                      <select
                        value={phase.toolChoice.selected}
                        onChange={e => updatePhaseToolChoice(phase.id, e.target.value)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-primary)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {phase.toolChoice.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Score Pill */}
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Score</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: compScore >= 70 ? 'var(--success)' : 'var(--accent-primary)' }}>
                      {compScore}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Topics Table */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1fr 100px 90px 80px',
                      padding: '0.5rem 1.25rem',
                      backgroundColor: 'var(--bg-app)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <span>Status</span>
                    <span>Topic</span>
                    <span style={{ textAlign: 'center' }}>Score</span>
                    <span style={{ textAlign: 'center' }}>Projects</span>
                    <span style={{ textAlign: 'right' }}>Details</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {phaseTopics.map(topic => {
                      const topicComp = calculateTopicCompetency(topic.competencyBreakdown)

                      const statusBadge = {
                        'not-started': { label: 'Not Started', badge: 'badge-default' },
                        'learning': { label: 'Learning', badge: 'badge-accent' },
                        'practicing': { label: 'Practicing', badge: 'badge-info' },
                        'demonstrated': { label: 'Demonstrated', badge: 'badge-warning' },
                        'validated': { label: 'Validated', badge: 'badge-success' },
                        'mastered': { label: 'Mastered', badge: 'badge-success' },
                        'needs-review': { label: 'Needs Review', badge: 'badge-danger' }
                      }[topic.status]

                      return (
                        <div
                          key={topic.id}
                          onClick={() => setSelectedTopicId(topic.id)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '130px 1fr 100px 90px 80px',
                            padding: '0.75rem 1.25rem',
                            borderBottom: '1px solid var(--border-subtle)',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color var(--transition-fast)'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div>
                            <span className={`badge ${statusBadge?.badge || 'badge-default'}`} style={{ fontSize: '0.7rem' }}>
                              {statusBadge?.label}
                            </span>
                          </div>

                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                              {topic.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {topic.goal}
                            </div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: topicComp >= 70 ? 'var(--success)' : 'var(--text-primary)' }}>
                              {topicComp}%
                            </span>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            {topic.evidence.length > 0 ? (
                              <span className="badge badge-default" style={{ fontSize: '0.6875rem' }}>
                                {topic.evidence.length} file{topic.evidence.length > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                            )}
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTopicId(topic.id)
                              }}
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        }))}
      </div>
    </div>
  )
}
