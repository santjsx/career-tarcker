import React from 'react'
import { Star, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculatePhaseCompetency, calculatePhaseCompletion } from '../../services/competencyEngine'

export const PhaseQuickGrid: React.FC = () => {
  const { state, setActiveView, setSelectedPhaseId } = useApp()

  // We show the first 6 active / current phases on dashboard quick grid
  const displayPhases = state.phases.slice(0, 6)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Active Topics to Learn
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Track your progress and practice step-by-step
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveView('roadmap')}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem' }}
        >
          <span>All 19 Phases</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem'
        }}
      >
        {displayPhases.map(phase => {
          const phaseTopics = Object.values(state.topics).filter(t => t.phaseId === phase.id)
          const compScore = calculatePhaseCompetency(phase.id, state.topics)
          const completion = calculatePhaseCompletion(phase.id, state.topics)

          const validatedCount = phaseTopics.filter(t => t.status === 'validated' || t.status === 'mastered').length
          const reviewCount = phaseTopics.filter(t => t.needsReview).length

          const phaseStatus = compScore >= 80 ? 'Mastered' : compScore >= 50 ? 'In Progress' : 'Not Started'

          return (
            <div
              key={phase.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                {/* Header: Phase # & Priority */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    PHASE {String(phase.number).padStart(2, '0')}
                  </span>
                  
                  {/* Priority Stars */}
                  <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }} title={`Priority: ${phase.priority}/5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < phase.priority ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                </div>

                {/* Title & Goal */}
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {phase.name}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, minHeight: '2.8rem' }}>
                  {phase.goal}
                </p>
              </div>

              <div>
                {/* Progress & Competency Split */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Skill Score</span>
                    <strong style={{ color: compScore >= 70 ? 'var(--success)' : 'var(--accent-primary)' }}>
                      {compScore}%
                    </strong>
                  </div>
                  <div className="progress-bar-container" style={{ height: '5px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${compScore}%`,
                        backgroundColor: compScore >= 70 ? 'var(--success)' : 'var(--accent-primary)'
                      }}
                    />
                  </div>
                </div>

                {/* Micro Stats */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem'
                  }}
                >
                  <span>{validatedCount} of {phaseTopics.length} Done</span>
                  {reviewCount > 0 ? (
                    <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <RotateCcw size={11} /> {reviewCount} Need Review
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>All Good</span>
                  )}
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhaseId(phase.id)
                    setActiveView('phase-detail')
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>View Topics</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
