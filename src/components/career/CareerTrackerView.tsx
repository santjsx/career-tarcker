import React, { useState } from 'react'
import {
  Briefcase,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateCareerReadiness, evaluateMilestone1, evaluateMilestone2 } from '../../services/readinessEngine'
import { ApplicationStage, JobApplication } from '../../types'

export const CareerTrackerView: React.FC = () => {
  const { state, addApplication, updateApplicationStage, deleteApplication, addInterviewGap, resolveInterviewGap, setActiveView, setSelectedTopicId } = useApp()

  const readiness = calculateCareerReadiness(state)
  const m1 = evaluateMilestone1(state)
  const m2 = evaluateMilestone2(state)

  const [showAppModal, setShowAppModal] = useState(false)
  const [showGapModal, setShowGapModal] = useState(false)

  // New Application Form State
  const [appCompany, setAppCompany] = useState('')
  const [appRole, setAppRole] = useState('')
  const [appLocation, setAppLocation] = useState('Remote')
  const [appUrl, setAppUrl] = useState('')
  const [appStage, setAppStage] = useState<ApplicationStage>('applied')
  const [appNotes, setAppNotes] = useState('')

  // New Interview Gap Form State
  const [gapCompany, setGapCompany] = useState('')
  const [gapSkill, setGapSkill] = useState('')
  const [gapProblem, setGapProblem] = useState('')
  const [gapSeverity, setGapSeverity] = useState<'low' | 'medium' | 'high'>('high')
  const [gapAction, setGapAction] = useState('')
  const [gapTopicId, setGapTopicId] = useState('t-1-9')

  const stages: { id: ApplicationStage; label: string }[] = [
    { id: 'saved', label: 'Saved' },
    { id: 'applied', label: 'Applied' },
    { id: 'recruiter', label: 'Recruiter Screen' },
    { id: 'assessment', label: 'Assessment' },
    { id: 'interview', label: 'Technical Interview' },
    { id: 'offer', label: 'Offer Received' },
    { id: 'rejected', label: 'Archived' }
  ]

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault()
    addApplication({
      company: appCompany,
      role: appRole,
      location: appLocation,
      jobUrl: appUrl,
      stage: appStage,
      dateApplied: new Date().toISOString().split('T')[0],
      resumeVersion: 'v2.4-Analyst',
      matchedSkills: ['SQL', 'Power BI'],
      missingSkills: [],
      notes: appNotes
    })
    setShowAppModal(false)
    setAppCompany('')
    setAppRole('')
    setAppNotes('')
  }

  const handleCreateGap = (e: React.FormEvent) => {
    e.preventDefault()
    addInterviewGap({
      companyName: gapCompany,
      skill: gapSkill,
      problemEncountered: gapProblem,
      severity: gapSeverity,
      actionPlan: gapAction,
      linkedTopicId: gapTopicId,
      resolved: false
    })
    setShowGapModal(false)
    setGapCompany('')
    setGapSkill('')
    setGapProblem('')
    setGapAction('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Briefcase size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Job Tracker & Readiness
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Apply while you learn: Learn → Build → Apply → Improve.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setShowGapModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem', color: 'var(--warning)' }}
          >
            <AlertTriangle size={14} />
            <span>Log Interview Note</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAppModal(true)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <Plus size={14} />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* MILESTONE GATES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {/* Milestone 1 Card */}
        <div
          className="card"
          style={{
            borderLeft: m1.isUnlocked ? '4px solid var(--success)' : '4px solid var(--accent-primary)',
            backgroundColor: m1.isUnlocked ? 'var(--success-subtle)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <span className={`badge ${m1.isUnlocked ? 'badge-success' : 'badge-accent'}`}>
                {m1.isUnlocked ? 'Unlocked!' : 'Step 1: Junior Analyst'}
              </span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {m1.title}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: m1.isUnlocked ? 'var(--success)' : 'var(--accent-primary)' }}>
                {m1.progressPercentage}%
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
            {m1.subtitle}
          </p>

          {/* Requirements Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
            {m1.requirements.map(req => (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: req.satisfied ? 'var(--success)' : 'var(--text-muted)' }}>
                    {req.satisfied ? <CheckCircle2 size={15} /> : <Lock size={14} />}
                  </span>
                  <span style={{ color: req.satisfied ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {req.label}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: req.satisfied ? 'var(--success)' : 'var(--warning)' }}>
                    {req.currentValue}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>({req.targetValue})</span>
                </div>
              </div>
            ))}
          </div>

          {m1.isUnlocked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 600, fontSize: '0.8125rem' }}>
              <Unlock size={15} />
              <span>{m1.unlockedTitle}</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Finish the remaining tasks to unlock job readiness.
            </div>
          )}
        </div>

        {/* Milestone 2 Card */}
        <div
          className="card"
          style={{
            borderLeft: m2.isUnlocked ? '4px solid var(--success)' : '4px solid var(--warning)',
            backgroundColor: m2.isUnlocked ? 'var(--success-subtle)' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <span className={`badge ${m2.isUnlocked ? 'badge-success' : 'badge-warning'}`}>
                {m2.isUnlocked ? 'Unlocked!' : 'Step 2: Senior / Engineer'}
              </span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {m2.title}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: m2.isUnlocked ? 'var(--success)' : 'var(--warning)' }}>
                {m2.progressPercentage}%
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
            {m2.subtitle}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
            {m2.requirements.map(req => (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: req.satisfied ? 'var(--success)' : 'var(--text-muted)' }}>
                    {req.satisfied ? <CheckCircle2 size={15} /> : <Lock size={14} />}
                  </span>
                  <span style={{ color: req.satisfied ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {req.label}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: req.satisfied ? 'var(--success)' : 'var(--warning)' }}>
                    {req.currentValue}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>({req.targetValue})</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Unlocking this means you are ready for advanced engineering topics.
          </div>
        </div>
      </div>

      {/* ACTIVE INTERVIEW SKILL GAPS LOOP */}
      {state.interviewGaps.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={17} style={{ color: 'var(--danger)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Interview Notes & Practice Topics
              </h3>
            </div>
            <span className="badge badge-warning">Needs Review</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {state.interviewGaps.map(gap => (
              <div
                key={gap.id}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {gap.skill} — Encountered at {gap.companyName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    <strong>What came up:</strong> {gap.problemEncountered}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
                    <strong>How to practice:</strong> {gap.actionPlan}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {gap.linkedTopicId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTopicId(gap.linkedTopicId!)
                        setActiveView('roadmap')
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Review Topic
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => resolveInterviewGap(gap.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Mark Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPLICATION PIPELINE */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Job Applications
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Track your applications and interviews step-by-step.
            </p>
          </div>
          <span className="badge badge-accent">{state.applications.length} Jobs</span>
        </div>

        {state.applications.length === 0 && (
          <div
            style={{
              padding: '1.5rem 1rem',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-default)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                No job applications tracked yet
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0.25rem auto 0 auto' }}>
                When you start applying for analytics roles, log each application here to manage interviews, track take-homes, and close skill gaps.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAppModal(true)}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Plus size={14} />
              <span>Track Your First Job</span>
            </button>
          </div>
        )}

        {/* Pipeline columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {stages.slice(0, 6).map(stage => {
            const appsInStage = state.applications.filter(a => a.stage === stage.id)

            return (
              <div
                key={stage.id}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  minHeight: '220px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {stage.label}
                  </span>
                  <span className="badge badge-default" style={{ fontSize: '0.65rem' }}>
                    {appsInStage.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  {appsInStage.map(app => (
                    <div
                      key={app.id}
                      style={{
                        padding: '0.65rem 0.75rem',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                        {app.role}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Building size={12} />
                        <span>{app.company}</span>
                      </div>
                      {app.notes && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                          {app.notes}
                        </div>
                      )}

                      {/* Stage transition buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
                        <select
                          value={app.stage}
                          onChange={e => updateApplicationStage(app.id, e.target.value as ApplicationStage)}
                          style={{
                            fontSize: '0.6875rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {stages.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => deleteApplication(app.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.6875rem', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {appsInStage.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      No jobs here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* New Application Modal */}
      {showAppModal && (
        <div className="overlay" onClick={() => setShowAppModal(false)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              Add Job Application
            </h3>

            <form onSubmit={handleCreateApplication} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe, Monzo, Spotify"
                  value={appCompany}
                  onChange={e => setAppCompany(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Junior Data Analyst"
                  value={appRole}
                  onChange={e => setAppRole(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Stage</label>
                  <select
                    value={appStage}
                    onChange={e => setAppStage(e.target.value as ApplicationStage)}
                    style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                  >
                    {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Location</label>
                  <input
                    type="text"
                    value={appLocation}
                    onChange={e => setAppLocation(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Job Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={appUrl}
                  onChange={e => setAppUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Notes</label>
                <textarea
                  placeholder="Referral name, salary range, interview date..."
                  value={appNotes}
                  onChange={e => setAppNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem', minHeight: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAppModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Interview Gap Modal */}
      {showGapModal && (
        <div className="overlay" onClick={() => setShowGapModal(false)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Add Interview Question or Topic to Review
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Save tricky questions from interviews so you can study them in your roadmap.
            </p>

            <form onSubmit={handleCreateGap} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Company</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe"
                  value={gapCompany}
                  onChange={e => setGapCompany(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Topic / Skill Area</label>
                <input
                  type="text"
                  placeholder="e.g. SQL Window Functions"
                  value={gapSkill}
                  onChange={e => setGapSkill(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>What question was asked?</label>
                <textarea
                  placeholder="Explain the difference between LAG and LEAD..."
                  value={gapProblem}
                  onChange={e => setGapProblem(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem', minHeight: '60px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Linked Roadmap Topic</label>
                <select
                  value={gapTopicId}
                  onChange={e => setGapTopicId(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem' }}
                >
                  {Object.values(state.topics).map(t => (
                    <option key={t.id} value={t.id}>Phase {t.phaseId}: {t.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowGapModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
