import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Star,
  Minimize2,
  Flame,
  Target,
  Clock,
  Sparkles
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const PRESET_DURATIONS = [
  { label: 'Free Flow', minutes: 0 },
  { label: '15m Sprint', minutes: 15 },
  { label: '25m Pomodoro', minutes: 25 },
  { label: '45m Deep Work', minutes: 45 },
  { label: '60m Mastery', minutes: 60 }
]

const CONFIDENCE_DESCRIPTIONS = [
  '',
  '1/5 - Still confusing, need to revisit basics',
  '2/5 - Need more practice and hands-on drills',
  '3/5 - Getting the hang of it, comfortable with core ideas',
  '4/5 - Confident & comfortable with realistic problems',
  '5/5 - Mastered & interview-ready!'
]

export const StudySessionModal: React.FC = () => {
  const {
    isStudyModalOpen,
    state,
    pauseStudySession,
    resumeStudySession,
    resetStudySession,
    minimizeStudySession,
    completeStudySession,
    cancelStudySession,
    updateStudySession
  } = useApp()

  const session = state.currentStudySession
  const topicId = session.topicId || 't-1-9'
  const topic = state.topics[topicId] || Object.values(state.topics)[0]
  const phase = state.phases.find(p => p.id === topic?.phaseId)

  // Session state from AppContext
  const status = session.status || 'idle' // 'idle' | 'running' | 'paused'
  const targetMinutes = session.targetMinutes !== undefined ? session.targetMinutes : 25
  const [sessionNotes, setSessionNotes] = useState(session.notes || '')
  const [confidence, setConfidence] = useState(session.confidence || 4)

  // Display seconds calculation using millisecond-accurate timestamps
  const [displaySeconds, setDisplaySeconds] = useState(0)

  // Sync internal notes/confidence to AppContext if modal was opened
  useEffect(() => {
    if (session.notes !== undefined) {
      setSessionNotes(session.notes)
    }
    if (session.confidence !== undefined) {
      setConfidence(session.confidence)
    }
  }, [session.notes, session.confidence])

  const calculateTrueElapsedSeconds = useCallback(() => {
    const accumulated = session.accumulatedMs || 0
    const currentRun = status === 'running' && session.startTimestamp
      ? Date.now() - session.startTimestamp
      : 0
    return Math.floor((accumulated + currentRun) / 1000)
  }, [session.accumulatedMs, session.startTimestamp, status])

  // Timer tick interval & visibility-change listener to eliminate background tab drift
  useEffect(() => {
    if (!isStudyModalOpen) return

    // Immediately calculate upon render
    setDisplaySeconds(calculateTrueElapsedSeconds())

    let intervalId: any = null
    if (status === 'running') {
      intervalId = setInterval(() => {
        setDisplaySeconds(calculateTrueElapsedSeconds())
      }, 250) // 250ms for smooth, responsive counter
    }

    const handleVisibilityOrFocus = () => {
      setDisplaySeconds(calculateTrueElapsedSeconds())
    }

    document.addEventListener('visibilitychange', handleVisibilityOrFocus)
    window.addEventListener('focus', handleVisibilityOrFocus)

    return () => {
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      window.removeEventListener('focus', handleVisibilityOrFocus)
    }
  }, [isStudyModalOpen, status, calculateTrueElapsedSeconds])

  // Keyboard controls: Space to Start/Pause/Resume, Esc to Minimize
  useEffect(() => {
    if (!isStudyModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        if (status === 'running') {
          pauseStudySession()
        } else if (status === 'paused') {
          resumeStudySession()
        } else {
          resumeStudySession() // Starts from idle
        }
      } else if (e.code === 'KeyR' && status === 'paused') {
        e.preventDefault()
        resetStudySession()
      } else if (e.code === 'Escape') {
        e.preventDefault()
        minimizeStudySession()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isStudyModalOpen, status, pauseStudySession, resumeStudySession, resetStudySession, minimizeStudySession])

  if (!isStudyModalOpen || !topic) return null

  // Formatting helper
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Handlers
  const handleStartOrResume = () => {
    resumeStudySession()
  }

  const handlePause = () => {
    pauseStudySession()
  }

  const handleReset = () => {
    resetStudySession()
    setDisplaySeconds(0)
  }

  const handleFinish = () => {
    const minutes = Math.max(1, Math.round(displaySeconds / 60))
    completeStudySession(minutes, sessionNotes, confidence)
  }

  const handleCancelWithCheck = () => {
    if (displaySeconds > 60) {
      if (window.confirm(`You have ${Math.round(displaySeconds / 60)} minutes of study time tracked. Discard this session?`)) {
        cancelStudySession()
      }
    } else {
      cancelStudySession()
    }
  }

  const handleNotesChange = (text: string) => {
    setSessionNotes(text)
    updateStudySession({ notes: text })
  }

  const handleConfidenceChange = (val: number) => {
    setConfidence(val)
    updateStudySession({ confidence: val })
  }

  const handlePresetSelect = (minutes: number) => {
    updateStudySession({ targetMinutes: minutes })
  }

  // Progress towards target
  const targetSeconds = targetMinutes * 60
  const progressPercent = targetSeconds > 0
    ? Math.min(100, Math.round((displaySeconds / targetSeconds) * 100))
    : 0
  const isTargetReached = targetMinutes > 0 && displaySeconds >= targetSeconds

  return (
    <div
      className="overlay"
      style={{ backgroundColor: 'rgba(5, 8, 12, 0.85)', padding: '1rem', backdropFilter: 'blur(4px)' }}
      onClick={minimizeStudySession}
    >
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem 1.4rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          animation: 'popoverScaleIn 180ms var(--ease-out-quad)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              className="badge badge-accent"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
            >
              <Clock size={11} />
              Study Timer
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Phase {phase?.number}: {phase?.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <button
              type="button"
              onClick={minimizeStudySession}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.3rem',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Minimize to background (Esc)"
              aria-label="Minimize timer"
            >
              <Minimize2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleCancelWithCheck}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.3rem',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close or cancel study session"
              aria-label="Close study session"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Topic Title & Goal */}
        <div style={{ textAlign: 'center', padding: '0.1rem 0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem', lineHeight: 1.25 }}>
            {topic.name}
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.35 }}>
            Goal: {topic.goal}
          </p>
        </div>

        {/* Compact Stopwatch Display Console */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}
        >
          {/* Status Indicator Chip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.18rem 0.55rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '0.4rem'
            }}
          >
            <span
              style={{
                width: '6.5px',
                height: '6.5px',
                borderRadius: '50%',
                backgroundColor:
                  status === 'running'
                    ? 'var(--success)'
                    : status === 'paused'
                    ? 'var(--warning)'
                    : 'var(--text-muted)',
                boxShadow: status === 'running' ? '0 0 6px var(--success)' : 'none'
              }}
              className={status === 'running' ? 'badge-pulse' : ''}
            />
            <span style={{ color: status === 'running' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {status === 'running'
                ? 'Study in Progress'
                : status === 'paused'
                ? 'Session Paused'
                : 'Ready to Start'}
            </span>
          </div>

          {/* Time Display */}
          <div
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              color: status === 'running' ? 'var(--accent-primary)' : 'var(--text-primary)',
              lineHeight: 1,
              marginBottom: '0.55rem',
              transition: 'color 200ms ease'
            }}
            aria-live="polite"
          >
            {formatTime(displaySeconds)}
          </div>

          {/* Target Progress Bar (if target set) */}
          {targetMinutes > 0 && (
            <div style={{ width: '100%', maxWidth: '280px', marginBottom: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                <span>Target: {targetMinutes} min</span>
                <span>{progressPercent}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-pill)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    backgroundColor: isTargetReached ? 'var(--success)' : 'var(--accent-primary)',
                    transition: 'width 300ms ease'
                  }}
                />
              </div>
              {isTargetReached && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 600, color: 'var(--success)', marginTop: '0.25rem' }}>
                  <Sparkles size={11} />
                  <span>Target reached! Great focus.</span>
                </div>
              )}
            </div>
          )}

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {status === 'running' ? (
              <button
                type="button"
                onClick={handlePause}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem', minWidth: '95px', justifyContent: 'center' }}
              >
                <Pause size={13} />
                <span>Pause</span>
              </button>
            ) : status === 'paused' ? (
              <button
                type="button"
                onClick={handleStartOrResume}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem', minWidth: '95px', justifyContent: 'center' }}
              >
                <Play size={13} fill="currentColor" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartOrResume}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem', minWidth: '95px', justifyContent: 'center' }}
              >
                <Play size={13} fill="currentColor" />
                <span>Start</span>
              </button>
            )}

            {/* Reset Button (stops and clears back to 00:00) */}
            {(status === 'paused' || status === 'running' || displaySeconds > 0) && (
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost btn-sm"
                style={{ gap: '0.3rem', color: 'var(--text-muted)' }}
                title="Reset timer to 00:00 and stop (R)"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Quick Target Preset Selectors */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              marginTop: '0.75rem'
            }}
          >
            {PRESET_DURATIONS.map(preset => {
              const isSelected = targetMinutes === preset.minutes
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset.minutes)}
                  style={{
                    background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontSize: '0.675rem',
                    fontWeight: 600,
                    padding: '0.18rem 0.5rem',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Focus Notes */}
        <div>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
            What You Learned (Notes save automatically)
          </label>
          <textarea
            placeholder="Write quick notes, shortcuts, or things to remember..."
            value={sessionNotes}
            onChange={e => handleNotesChange(e.target.value)}
            style={{
              width: '100%',
              height: '54px',
              minHeight: '46px',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.65rem',
              fontSize: '0.8rem',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Post-Session Wrap-Up: Confidence 1-5 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            backgroundColor: 'var(--bg-app)',
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              How confident do you feel?
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleConfidenceChange(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '3px',
                    color: star <= confidence ? 'var(--warning)' : 'var(--text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 160ms var(--ease-spring), color 150ms ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.22)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  aria-label={`Rate confidence ${star} of 5`}
                >
                  <Star size={16} fill={star <= confidence ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          {confidence > 0 && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {CONFIDENCE_DESCRIPTIONS[confidence]}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.1rem' }}>
          <button
            type="button"
            onClick={minimizeStudySession}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-muted)', fontSize: '0.72rem', padding: '0.35rem 0.5rem' }}
            title="Keep timer running while browsing app"
          >
            Minimize to background
          </button>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={handleCancelWithCheck}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <CheckCircle2 size={15} />
              <span>Finish & Save Time</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
