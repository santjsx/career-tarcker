import React, { useState } from 'react'
import {
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  BookOpen,
  Calendar,
  CheckSquare,
  Square,
  Award
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { TopicStatus, EvidenceType } from '../../types'
import { calculateTopicCompetency, canValidateTopic } from '../../services/competencyEngine'

export const TopicDrawer: React.FC = () => {
  const {
    selectedTopicId,
    setSelectedTopicId,
    state,
    updateTopic,
    validateTopic,
    markTopicPriorKnown,
    updateChecklistItem,
    updateTopicBreakdown,
    addEvidenceToTopic,
    removeEvidenceFromTopic,
    startStudySession
  } = useApp()

  const [activeTab, setActiveTab] = useState<'curriculum' | 'evidence' | 'notes' | 'review'>('curriculum')
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('')
  const [newEvidenceUrl, setNewEvidenceUrl] = useState('')
  const [newEvidenceType, setNewEvidenceType] = useState<EvidenceType>('github')
  const [showPriorKnowledgeModal, setShowPriorKnowledgeModal] = useState(false)

  if (!selectedTopicId || !state.topics[selectedTopicId]) return null

  const topic = state.topics[selectedTopicId]
  const phase = state.phases.find(p => p.id === topic.phaseId)
  const competencyScore = calculateTopicCompetency(topic.competencyBreakdown)
  const validationCheck = canValidateTopic(topic)

  const handleStatusChange = (status: TopicStatus) => {
    updateTopic(topic.id, { status })
  }

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvidenceTitle || !newEvidenceUrl) return
    addEvidenceToTopic(topic.id, {
      title: newEvidenceTitle,
      url: newEvidenceUrl,
      type: newEvidenceType,
      verified: true
    })
    setNewEvidenceTitle('')
    setNewEvidenceUrl('')
  }

  const handleMarkReviewed = () => {
    const next = new Date()
    next.setDate(next.getDate() + 14) // spaced interval
    updateTopic(topic.id, {
      needsReview: false,
      reviewCount: topic.reviewCount + 1,
      nextReviewDate: next.toISOString().split('T')[0]
    })
  }

  const checklistItems = [
    { key: 'understandConcept', label: '1. Understand the core concept' },
    { key: 'followExample', label: '2. Try the code example' },
    { key: 'completeExercise', label: '3. Do a practice exercise' },
    { key: 'buildImplementation', label: '4. Use it in a real project' },
    { key: 'explainWithoutReference', label: '5. Explain it in your own words' },
    { key: 'validateResult', label: '6. Test and check for mistakes' }
  ] as const

  return (
    <>
      <div className="overlay" onClick={() => setSelectedTopicId(null)} />
      <div className="drawer">
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-accent">
                Phase {phase?.number}: {phase?.name}
              </span>
              {topic.priorKnowledgeValidated && (
                <span className="badge badge-success">Already Known</span>
              )}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {topic.name}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {topic.goal}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTopicId(null)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.35rem' }}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Competency & Lifecycle Header Bar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={topic.status}
              onChange={e => handleStatusChange(e.target.value as TopicStatus)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.8125rem',
                fontWeight: 600
              }}
            >
              <option value="not-started">Not Started</option>
              <option value="learning">Learning</option>
              <option value="practicing">Practicing</option>
              <option value="demonstrated">Demonstrated</option>
              <option value="validated">Validated</option>
              <option value="mastered">Mastered</option>
              <option value="needs-review">Needs Review</option>
            </select>
          </div>

          {/* Competency Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Skill Score
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: competencyScore >= 70 ? 'var(--success)' : 'var(--accent-primary)' }}>
                {competencyScore}%
              </div>
            </div>
            <button
              type="button"
              onClick={() => startStudySession(topic.id)}
              className="btn btn-primary btn-sm"
              title="Start focused study session"
            >
              Study Topic
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ padding: '0 1.5rem', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="tabs-nav">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
              onClick={() => setActiveTab('curriculum')}
            >
              Checklist & Score
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
              onClick={() => setActiveTab('evidence')}
            >
              My Work ({topic.evidence.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              Review
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          {/* TAB 1: CURRICULUM & MASTERY */}
          {activeTab === 'curriculum' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Prior Knowledge Skip CTA */}
              {!topic.priorKnowledgeValidated && topic.status !== 'mastered' && (
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px dashed var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Already know this topic?</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Validate prior industry knowledge without fake course-watching time.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => markTopicPriorKnown(topic.id, 90)}
                    className="btn btn-secondary btn-sm"
                  >
                    I Already Know This
                  </button>
                </div>
              )}

              {/* 6-Step Verification Checklist */}
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Topic Checklist
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {checklistItems.map(item => {
                    const isChecked = topic.checklist[item.key]
                    return (
                      <div
                        key={item.key}
                        onClick={() => updateChecklistItem(topic.id, item.key, !isChecked)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          backgroundColor: isChecked ? 'var(--bg-app)' : 'var(--bg-surface-elevated)',
                          borderRadius: 'var(--radius-sm)',
                          border: isChecked ? '1px solid var(--border-subtle)' : '1px solid var(--border-default)',
                          cursor: 'pointer',
                          transition: 'background-color 160ms ease, border-color 160ms ease, transform 160ms var(--ease-out-quad)',
                          userSelect: 'none'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--border-active)'
                          e.currentTarget.style.transform = 'translateX(2px)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = isChecked ? 'var(--border-subtle)' : 'var(--border-default)'
                          e.currentTarget.style.transform = 'translateX(0)'
                        }}
                        onMouseDown={e => {
                          e.currentTarget.style.transform = 'scale(0.99)'
                        }}
                        onMouseUp={e => {
                          e.currentTarget.style.transform = 'translateX(2px)'
                        }}
                      >
                        <span style={{ color: isChecked ? 'var(--success)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}>
                          {isChecked ? <CheckSquare size={16} className="animate-check-pop" /> : <Square size={16} />}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'color 150ms ease' }}>
                          {item.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Score Breakdown Sliders */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                    How Your Score is Calculated
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weights</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { key: 'learning', label: '1. Reading & Videos', weight: '20%' },
                    { key: 'practice', label: '2. Practice Exercises', weight: '25%' },
                    { key: 'assessment', label: '3. Quizzes & Tests', weight: '20%' },
                    { key: 'realWorld', label: '4. Real Projects', weight: '25%' },
                    { key: 'confidence', label: '5. Confidence', weight: '10%' }
                  ].map(dim => {
                    const val = topic.competencyBreakdown[dim.key as keyof typeof topic.competencyBreakdown]
                    return (
                      <div key={dim.key} style={{ backgroundColor: 'var(--bg-app)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600 }}>{dim.label} ({dim.weight})</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{val}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={val}
                          onChange={e => updateTopicBreakdown(topic.id, dim.key as any, Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Complete Topic Button */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => validateTopic(topic.id)}
                  className="btn btn-primary"
                  style={{ width: '100%', gap: '0.5rem' }}
                >
                  <Award size={16} />
                  <span>Mark as Completed</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE */}
          {activeTab === 'evidence' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Portfolio Evidence
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  A competency is only truly verified when backed by real deliverables, code, or notebooks.
                </p>
              </div>

              {/* Attached Evidence List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {topic.evidence.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Type: <span style={{ textTransform: 'capitalize' }}>{ev.type}</span> • Added: {ev.dateAdded}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>View</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => removeEvidenceFromTopic(topic.id, ev.id)}
                        className="btn btn-outline-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {topic.evidence.length === 0 && (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                    No evidence attached yet. Add a GitHub link, SQL query script, or notebook below.
                  </div>
                )}
              </div>

              {/* Add Evidence Form */}
              <form onSubmit={handleAddEvidence} style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h5 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                  Attach New Evidence
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SQL Window Cohort Analysis script"
                      value={newEvidenceTitle}
                      onChange={e => setNewEvidenceTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.6rem',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.8125rem'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                        URL or Repository
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={newEvidenceUrl}
                        onChange={e => setNewEvidenceUrl(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.6rem',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.8125rem'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                        Type
                      </label>
                      <select
                        value={newEvidenceType}
                        onChange={e => setNewEvidenceType(e.target.value as EvidenceType)}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.4rem',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <option value="github">GitHub</option>
                        <option value="sql">SQL Script</option>
                        <option value="dashboard">Dashboard</option>
                        <option value="notebook">Notebook</option>
                        <option value="document">Doc</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-secondary btn-sm" style={{ marginTop: '0.25rem' }}>
                    <Plus size={14} />
                    <span>Attach Evidence</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Personal Topic Notes
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Common pitfalls, core syntax patterns, and interview takeaways.
                </p>
              </div>

              <textarea
                value={topic.notes}
                onChange={e => updateTopic(topic.id, { notes: e.target.value })}
                placeholder="Write your study takeaways, edge cases, or code snippets here... (Autosaved)"
                style={{
                  width: '100%',
                  minHeight: '260px',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* TAB 4: SPACED REVIEW */}
          {activeTab === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Knowledge Retention & Spaced Repetition
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Active recall intervals prevent forgetting and maintain career interview readiness.
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Review Count:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{topic.reviewCount} times</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Studied:</span>
                  <span>{topic.lastStudied ? new Date(topic.lastStudied).toLocaleDateString() : 'Never'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Next Review Due:</span>
                  <strong style={{ color: topic.needsReview ? 'var(--warning)' : 'var(--text-primary)' }}>
                    {topic.nextReviewDate || 'Not scheduled'}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleMarkReviewed}
                  className="btn btn-secondary"
                  style={{ flex: 1, gap: '0.4rem' }}
                >
                  <CheckCircle2 size={15} style={{ color: 'var(--success)' }} />
                  <span>Mark Reviewed Today</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateTopic(topic.id, { needsReview: true })}
                  className="btn btn-secondary"
                  style={{ flex: 1, gap: '0.4rem', color: 'var(--warning)' }}
                >
                  <RotateCcw size={15} />
                  <span>Flag Needs Review</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
