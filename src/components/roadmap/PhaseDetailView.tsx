import React, { useState } from 'react'
import {
  ArrowLeft,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculatePhaseCompetency, calculateTopicCompetency } from '../../services/competencyEngine'

export const PhaseDetailView: React.FC = () => {
  const { selectedPhaseId, setSelectedPhaseId, setActiveView, state, setSelectedTopicId, updatePhaseToolChoice } = useApp()

  const phase = state.phases.find(p => p.id === selectedPhaseId) || state.phases[0]
  const phaseTopics = Object.values(state.topics).filter(t => t.phaseId === phase.id)
  const compScore = calculatePhaseCompetency(phase.id, state.topics)

  const [activeTab, setActiveTab] = useState<'curriculum' | 'notes' | 'reviews'>('curriculum')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => {
            setSelectedPhaseId(null)
            setActiveView('roadmap')
          }}
          className="btn btn-ghost btn-sm"
          style={{ gap: '0.35rem', padding: '0.2rem 0.5rem', marginBottom: '0.5rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Roadmap</span>
        </button>

        {/* Phase Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-accent">Phase {String(phase.number).padStart(2, '0')}</span>
              <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill={i < phase.priority ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {phase.estimatedEffortHours} hrs estimated
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {phase.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '700px' }}>
              {phase.goal}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {phase.toolChoice && (
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{phase.toolChoice.category}</div>
                <select
                  value={phase.toolChoice.selected}
                  onChange={e => updatePhaseToolChoice(phase.id, e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
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

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: compScore >= 70 ? 'var(--success)' : 'var(--accent-primary)' }}>
                {compScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="tabs-nav">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
              onClick={() => setActiveTab('curriculum')}
            >
              Topics to Learn ({phaseTopics.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Review & Practice
            </button>
          </div>
        </div>

        {/* Tab 1: Curriculum List */}
        {activeTab === 'curriculum' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {phaseTopics.map(topic => {
              const comp = calculateTopicCompetency(topic.competencyBreakdown)
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        {topic.name}
                      </span>
                      <span className="badge badge-default" style={{ fontSize: '0.65rem' }}>
                        {topic.status}
                      </span>
                      {topic.priorKnowledgeValidated && (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                          Already Known
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {topic.goal}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Score</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: comp >= 70 ? 'var(--success)' : 'var(--text-primary)' }}>
                        {comp}%
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm">
                      View Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Scheduled Reviews in Phase {phase.number}</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Topics to practice again so you remember them.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {phaseTopics.filter(t => t.needsReview || t.nextReviewDate).map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Review by: {t.nextReviewDate || 'Flagged for review'}
                    </div>
                  </div>
                  <span className={`badge ${t.needsReview ? 'badge-warning' : 'badge-default'}`}>
                    {t.needsReview ? 'Review Due' : 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
