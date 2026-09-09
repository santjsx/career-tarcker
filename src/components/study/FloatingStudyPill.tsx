import React, { useState, useEffect } from 'react'
import { Play, Pause, Maximize2, X, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const FloatingStudyPill: React.FC = () => {
  const {
    state,
    isStudyModalOpen,
    setIsStudyModalOpen,
    pauseStudySession,
    resumeStudySession,
    cancelStudySession
  } = useApp()

  const session = state.currentStudySession
  const isVisible = (session.status === 'running' || session.status === 'paused') && !isStudyModalOpen

  const [displaySeconds, setDisplaySeconds] = useState(session.elapsedSeconds || 0)

  useEffect(() => {
    if (!isVisible) return

    const calculateElapsed = () => {
      const accumulated = session.accumulatedMs || 0
      const currentRun = session.status === 'running' && session.startTimestamp
        ? Date.now() - session.startTimestamp
        : 0
      return Math.floor((accumulated + currentRun) / 1000)
    }

    setDisplaySeconds(calculateElapsed())

    if (session.status === 'running') {
      const timer = setInterval(() => {
        setDisplaySeconds(calculateElapsed())
      }, 500)
      return () => clearInterval(timer)
    }
  }, [isVisible, session.status, session.startTimestamp, session.accumulatedMs])

  if (!isVisible) return null

  const topic = session.topicId ? state.topics[session.topicId] : null
  const topicName = topic?.name || 'Focused Study'

  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div
      className="card floating-study-pill"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 999,
        padding: '0.45rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '9999px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.55), 0 0 16px rgba(56, 189, 248, 0.12)',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer',
        animation: 'slideInRight 220ms var(--ease-drawer)',
        userSelect: 'none'
      }}
      onClick={() => setIsStudyModalOpen(true)}
      title="Study session in progress — click to view modal"
    >
      {/* Live Pulsing Dot */}
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: session.status === 'running' ? 'var(--success)' : 'var(--warning)',
          boxShadow: session.status === 'running' ? '0 0 8px var(--success)' : '0 0 6px var(--warning)',
          flexShrink: 0
        }}
        className={session.status === 'running' ? 'badge-pulse' : ''}
      />

      {/* Topic Title & Timer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            maxWidth: '135px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2
          }}
        >
          {topicName}
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: session.status === 'running' ? 'var(--accent-primary)' : 'var(--text-muted)',
            lineHeight: 1,
            letterSpacing: '0.02em'
          }}
        >
          {formatTime(displaySeconds)}
        </div>
      </div>

      {/* Action Controls */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.2rem' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            if (session.status === 'running') {
              pauseStudySession()
            } else {
              resumeStudySession()
            }
          }}
          className="btn btn-sm"
          style={{
            width: '28px',
            height: '28px',
            padding: 0,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label={session.status === 'running' ? 'Pause timer' : 'Resume timer'}
          title={session.status === 'running' ? 'Pause' : 'Resume'}
        >
          {session.status === 'running' ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
        </button>

        <button
          type="button"
          onClick={() => setIsStudyModalOpen(true)}
          className="btn btn-sm"
          style={{
            width: '28px',
            height: '28px',
            padding: 0,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Maximize study session"
          title="Maximize"
        >
          <Maximize2 size={13} />
        </button>

        <button
          type="button"
          onClick={() => {
            if (displaySeconds > 60) {
              if (window.confirm('Discard this study session?')) {
                cancelStudySession()
              }
            } else {
              cancelStudySession()
            }
          }}
          className="btn btn-sm"
          style={{
            width: '28px',
            height: '28px',
            padding: 0,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Cancel session"
          title="Discard"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
