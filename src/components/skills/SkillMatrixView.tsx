import React, { useState } from 'react'
import { Layers, Sparkles, Plus, CheckCircle2, MessageSquare, Brain, ShieldCheck, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ContinuousPracticeLog } from '../../types'

export const SkillMatrixView: React.FC = () => {
  const { state, addContinuousLog } = useApp()

  const [activeTab, setActiveTab] = useState<'matrix' | 'continuous'>('matrix')
  const [showLogModal, setShowLogModal] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')

  const filteredSkills = state.skills.filter(s =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(skillSearch.toLowerCase())
  )

  // Continuous Log Form state
  const [logType, setLogType] = useState<ContinuousPracticeLog['type']>('business-thinking')
  const [logTitle, setLogTitle] = useState('')
  const [businessQuestion, setBusinessQuestion] = useState('')
  const [dataRequirement, setDataRequirement] = useState('')
  const [modelArch, setModelArch] = useState('')
  const [metricUsed, setMetricUsed] = useState('')
  const [insightDerived, setInsightDerived] = useState('')
  const [learnings, setLearnings] = useState('')

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault()
    addContinuousLog({
      type: logType,
      title: logTitle || 'Continuous Practice Entry',
      date: new Date().toISOString().split('T')[0],
      businessQuestion,
      dataRequirement,
      modelArchitecture: modelArch,
      sqlQueryOrMetric: metricUsed,
      insightDerived,
      learnings
    })
    setShowLogModal(false)
    // reset form
    setLogTitle('')
    setBusinessQuestion('')
    setDataRequirement('')
    setModelArch('')
    setMetricUsed('')
    setInsightDerived('')
    setLearnings('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Layers size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Skills & Practice Logs
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            See all 20 skills, your practice scores, and notes from real work.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('matrix')}
          >
            All 20 Skills
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'continuous' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('continuous')}
          >
            Practice Logs ({state.continuousLogs.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: 20-SKILL MATRIX */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search bar */}
          <div
            style={{
              position: 'relative',
              maxWidth: '380px',
              width: '100%'
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search skills by name or category..."
              value={skillSearch}
              onChange={e => setSkillSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                outline: 'none'
              }}
              data-testid="skills-search-input"
            />
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Skill & Area</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Reading</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Practice</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Proof Attached</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Confidence</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkills.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No skills match &quot;{skillSearch}&quot;
                      </td>
                    </tr>
                  ) : (
                    filteredSkills.map((skill, idx) => (
                  <tr
                    key={skill.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-app)'
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{skill.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{skill.category}</div>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', width: '140px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                        <span>Theory</span>
                        <span>{skill.learningScore}%</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '4px' }}>
                        <div className="progress-bar-fill" style={{ width: `${skill.learningScore}%` }} />
                      </div>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', width: '140px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                        <span>Hands-On</span>
                        <span>{skill.practiceScore}%</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '4px' }}>
                        <div className="progress-bar-fill" style={{ width: `${skill.practiceScore}%`, backgroundColor: 'var(--warning)' }} />
                      </div>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <span className="badge badge-default" style={{ fontSize: '0.7rem' }}>
                        {skill.evidenceCount} {skill.evidenceCount === 1 ? 'link' : 'links'}
                      </span>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <span style={{ fontWeight: 600, color: skill.confidence >= 4 ? 'var(--success)' : 'var(--text-secondary)' }}>
                        {skill.confidence} / 5
                      </span>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <span
                        className={`badge ${
                          skill.status === 'Mastered' || skill.status === 'Validated'
                            ? 'badge-success'
                            : skill.status === 'Competent'
                            ? 'badge-accent'
                            : skill.status === 'Learning'
                            ? 'badge-warning'
                            : 'badge-default'
                        }`}
                      >
                        {skill.status}
                      </span>
                    </td>
                  </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CONTINUOUS PRACTICE LOGS */}
      {activeTab === 'continuous' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Real-World Practice Logs
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Log business questions, team chats, and AI checks as you work.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogModal(true)}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <Plus size={14} />
              <span>Add Practice Entry</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
            {state.continuousLogs.map(log => (
              <div
                key={log.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  borderTop:
                    log.type === 'business-thinking'
                      ? '3px solid var(--accent-primary)'
                      : log.type === 'communication'
                      ? '3px solid var(--info)'
                      : '3px solid var(--success)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    className={`badge ${
                      log.type === 'business-thinking'
                        ? 'badge-accent'
                        : log.type === 'communication'
                        ? 'badge-info'
                        : 'badge-success'
                    }`}
                  >
                    {log.type === 'business-thinking' ? 'Business Question' : log.type === 'communication' ? 'Team Chat' : 'AI Check'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.date}</span>
                </div>

                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {log.title}
                </h4>

                {log.type === 'business-thinking' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Business Question:</strong> {log.businessQuestion}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Data Used:</strong> {log.dataRequirement}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Tables / Structure:</strong> <code>{log.modelArchitecture}</code>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Key Finding:</strong> {log.insightDerived}
                    </div>
                  </div>
                )}

                {log.type === 'ai-verification' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>AI Tool:</strong> {log.aiToolUsed}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Task:</strong> {log.promptOrTask}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>How You Checked It:</strong> {log.verificationChecks}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    padding: '0.5rem 0.65rem',
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    marginTop: 'auto'
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>What I Learned:</strong> {log.learnings}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Entry Modal */}
      {showLogModal && (
        <div className="overlay" onClick={() => setShowLogModal(false)}>
          <div
            className="card"
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-surface-elevated)' }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              Add Practice Entry
            </h3>

            <form onSubmit={handleCreateLog} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Practice Type
                </label>
                <select
                  value={logType}
                  onChange={e => setLogType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.8125rem'
                  }}
                >
                  <option value="business-thinking">Business Question & Answer</option>
                  <option value="communication">Explaining Data to Others</option>
                  <option value="ai-verification">AI Tools & Testing</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Why did checkout drop this week?"
                  value={logTitle}
                  onChange={e => setLogTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.8125rem'
                  }}
                  required
                />
              </div>

              {logType === 'business-thinking' ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Business Question
                    </label>
                    <input
                      type="text"
                      placeholder="Why did 90-day subscription retention fall?"
                      value={businessQuestion}
                      onChange={e => setBusinessQuestion(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.8125rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Data Used
                    </label>
                    <input
                      type="text"
                      placeholder="Customer billing joined with onboarding flags"
                      value={dataRequirement}
                      onChange={e => setDataRequirement(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.8125rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Key Finding
                    </label>
                    <textarea
                      placeholder="Discount acquisition channels caused 2x higher early churn."
                      value={insightDerived}
                      onChange={e => setInsightDerived(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.8125rem',
                        minHeight: '60px'
                      }}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Notes & What You Did
                  </label>
                  <textarea
                    placeholder="Describe how you tested or explained the data..."
                    value={learnings}
                    onChange={e => setLearnings(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.8125rem',
                      minHeight: '80px'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
