import React, { useState } from 'react'
import { Sparkles, HelpCircle, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateNextBestAction } from '../../services/recommendationEngine'

export const NextBestActionCard: React.FC = () => {
  const { state, setActiveView, setSelectedTopicId, setSelectedProjectId } = useApp()
  const [showReasoning, setShowReasoning] = useState(false)

  const action = calculateNextBestAction(state)

  const handleAction = () => {
    if (action.targetId.startsWith('t-')) {
      setSelectedTopicId(action.targetId)
      setActiveView('roadmap')
    } else if (action.targetId === 'project-1') {
      setSelectedProjectId(1)
      setActiveView('project-detail')
    } else if (action.targetId === 'career') {
      setActiveView('career')
    } else if (action.targetId === 'skills') {
      setActiveView('skills')
    } else {
      setActiveView('roadmap')
    }
  }

  const categoryBadgeClass: Record<string, string> = {
    'Review': 'badge-warning',
    'Continue Learning': 'badge-accent',
    'Practice': 'badge-info',
    'Build': 'badge-warning',
    'Career': 'badge-success'
  }

  return (
    <div
      className="card"
      style={{
        borderLeft: '4px solid var(--accent-primary)',
        backgroundColor: 'var(--bg-surface-elevated)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-primary)' }}>
              Recommended Next Step
            </span>
            <span className={`badge ${categoryBadgeClass[action.category] || 'badge-default'}`}>
              {action.category}
            </span>
          </div>

          <h3 style={{ fontSize: '1.1875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {action.title}
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {action.subtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowReasoning(prev => !prev)}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.75rem', gap: '0.3rem' }}
            title="Why is this recommended?"
          >
            <HelpCircle size={14} />
            <span>Why this?</span>
            <ChevronDown size={13} style={{ transform: showReasoning ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
          </button>

          <button
            type="button"
            onClick={handleAction}
            className="btn btn-primary"
            style={{ gap: '0.4rem', padding: '0.5rem 1rem' }}
          >
            <span>{action.actionLabel}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Expandable "Why This?" Rationale */}
      {showReasoning && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            animation: 'fadeIn 150ms ease-out'
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>Why we recommend this:</span>
          </div>
          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
            {action.reasoning}
          </p>
        </div>
      )}
    </div>
  )
}
