import React, { useState } from 'react'
import { Search, Sun, Moon, Laptop, Bell, Play, CheckCircle2, Cloud, Keyboard, HelpCircle, RefreshCcw, AlertTriangle, Menu } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DateCalendarWidget } from './DateCalendarWidget'

export const Header: React.FC = () => {
  const {
    state,
    setTheme,
    setIsSearchOpen,
    setIsShortcutsOpen,
    startStudySession,
    setIsStudyModalOpen,
    saveStatus,
    setActiveView,
    setIsMobileNavOpen
  } = useApp()

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Compute live notifications from real data
  const overdueReviews = Object.values(state.topics).filter(t => t.needsReview || (t.nextReviewDate && new Date(t.nextReviewDate) <= new Date()))
  const unresolvedGaps = state.interviewGaps.filter(g => !g.resolved)

  const notificationsCount = overdueReviews.length + unresolvedGaps.length

  const currentTheme = state.user.theme
  const cycleTheme = () => {
    if (currentTheme === 'dark') setTheme('light')
    else if (currentTheme === 'light') setTheme('system')
    else setTheme('dark')
  }

  return (
    <header className="header">
      {/* Left: Brand & Autosave */}
      <div className="header-left-section">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          data-testid="mobile-hamburger-btn"
          onClick={() => setIsMobileNavOpen(true)}
          className="mobile-hamburger-btn"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-brand-info">
          <span className="header-brand-title">
            Career Tracker
          </span>
          <span className="header-brand-subtitle">
            Data Analyst → Analytics Engineer
          </span>
        </div>

        {/* Save Indicator with Rigid Lock (Zero Layout Shift - CLS = 0) */}
        <div
          className="header-save-indicator"
          data-testid="save-status-indicator"
          aria-label={saveStatus === 'saved' ? 'Saved to LocalStorage' : saveStatus === 'saving' ? 'Saving...' : 'Offline'}
          title={
            saveStatus === 'saved'
              ? 'Saved to LocalStorage (all changes persistent)'
              : saveStatus === 'saving'
              ? 'Saving changes to local storage...'
              : 'Local storage unavailable or full'
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '0.35rem',
            width: '86px',
            minWidth: '86px',
            maxWidth: '86px',
            height: '24px',
            minHeight: '24px',
            maxHeight: '24px',
            padding: '0 0.45rem',
            fontSize: '0.6875rem',
            fontWeight: 500,
            color:
              saveStatus === 'saved'
                ? 'var(--text-muted)'
                : saveStatus === 'saving'
                ? 'var(--accent-primary)'
                : 'var(--danger)',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)',
            marginLeft: '0.35rem',
            flexShrink: 0,
            flexGrow: 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transition: 'color 0.15s ease, border-color 0.15s ease'
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '13px',
              height: '13px',
              flexShrink: 0
            }}
          >
            {saveStatus === 'saved' ? (
              <Cloud size={12} style={{ color: 'var(--success)' }} />
            ) : saveStatus === 'saving' ? (
              <RefreshCcw size={11} className="spin" style={{ color: 'var(--accent-primary)' }} />
            ) : (
              <AlertTriangle size={11} style={{ color: 'var(--danger)' }} />
            )}
          </span>
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'clip',
              lineHeight: 1,
              letterSpacing: '0.01em'
            }}
          >
            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Center: Professional Date, Calendar & Year Horizon Widget */}
      <div className="header-center-section">
        <DateCalendarWidget />
      </div>

      {/* Right: Actions */}
      <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {/* Cmd+K Search trigger */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="btn btn-secondary btn-sm header-search-btn"
          style={{ gap: '0.5rem', padding: '0.35rem 0.65rem', flexShrink: 0 }}
          title="Search anything (Cmd+K)"
          aria-label="Search"
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="header-search-label" style={{ color: 'var(--text-secondary)' }}>Search...</span>
          <kbd
            className="header-search-kbd"
            style={{
              fontSize: '0.65rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.1rem 0.35rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Focused Study Session Trigger / Active State Pill */}
        {(() => {
          const isRunning = state.currentStudySession.status === 'running'
          const isPaused = state.currentStudySession.status === 'paused'
          const isActive = isRunning || isPaused

          if (isActive) {
            return (
              <button
                type="button"
                onClick={() => setIsStudyModalOpen(true)}
                className="btn btn-sm header-study-btn"
                title={isRunning ? 'Active study session in progress (click to view)' : 'Study session paused (click to resume)'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isRunning ? 'var(--success-subtle)' : 'var(--warning-subtle)',
                  border: `1px solid ${isRunning ? 'var(--success-border)' : 'var(--warning-border)'}`,
                  color: isRunning ? 'var(--success)' : 'var(--warning)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  boxShadow: isRunning
                    ? '0 0 14px rgba(52, 211, 153, 0.18)'
                    : '0 0 14px rgba(251, 191, 36, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = isRunning
                    ? 'rgba(52, 211, 153, 0.22)'
                    : 'rgba(251, 191, 36, 0.22)'
                  e.currentTarget.style.borderColor = isRunning
                    ? 'var(--success)'
                    : 'var(--warning)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = isRunning
                    ? 'var(--success-subtle)'
                    : 'var(--warning-subtle)'
                  e.currentTarget.style.borderColor = isRunning
                    ? 'var(--success-border)'
                    : 'var(--warning-border)'
                }}
              >
                <span
                  className={isRunning ? 'badge-pulse' : ''}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: isRunning ? 'var(--success)' : 'var(--warning)',
                    boxShadow: isRunning ? '0 0 8px var(--success)' : 'none',
                    flexShrink: 0
                  }}
                />
                <span className="header-study-active-text" style={{ letterSpacing: '0.01em' }}>
                  {isRunning ? 'Study Active' : 'Study Paused'}
                </span>
              </button>
            )
          }

          return (
            <button
              type="button"
              onClick={() => startStudySession(state.currentStudySession.topicId || 't-1-9')}
              className="btn btn-primary btn-sm header-study-btn"
              title="Open study timer"
              style={{ gap: '0.4rem', flexShrink: 0 }}
            >
              <Play size={13} fill="currentColor" />
              <span className="header-study-label">Study Mode</span>
            </button>
          )
        })()}

        {/* Notifications Popover */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="btn btn-ghost btn-sm"
            style={{ position: 'relative', padding: '0.45rem', flexShrink: 0 }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {notificationsCount > 0 && (
              <span
                className="badge-pulse"
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)'
                }}
              />
            )}
          </button>

          {isNotificationsOpen && (
            <div
              className="calendar-popover"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '300px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                  Action Center
                </span>
                <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>
                  {notificationsCount} New
                </span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {unresolvedGaps.map(g => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setIsNotificationsOpen(false)
                      setActiveView('career')
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      transition: 'background-color 150ms ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--danger)', marginBottom: '2px' }}>
                      Interview Gap: {g.skill} ({g.companyName})
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>{g.problemEncountered}</div>
                  </div>
                ))}

                {overdueReviews.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setIsNotificationsOpen(false)
                      setActiveView('roadmap')
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      transition: 'background-color 150ms ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--warning)', marginBottom: '2px' }}>
                      Spaced Review Due: {t.name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>Phase {t.phaseId} reinforcement ready</div>
                  </div>
                ))}

                {notificationsCount === 0 && (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    All reviews and action items are up to date!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts helper button */}
        <button
          type="button"
          onClick={() => setIsShortcutsOpen(true)}
          className="btn btn-ghost btn-sm header-shortcuts-btn"
          style={{ padding: '0.45rem', flexShrink: 0 }}
          title="Keyboard shortcuts (?)"
        >
          <Keyboard size={16} />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={cycleTheme}
          className="btn btn-ghost btn-sm"
          style={{ padding: '0.45rem', transition: 'transform 180ms var(--ease-spring)', flexShrink: 0 }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'rotate(15deg) scale(1.05)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'rotate(30deg) scale(0.92)'
          }}
          title={`Theme: ${currentTheme}. Click to cycle.`}
        >
          {currentTheme === 'dark' && <Moon size={16} />}
          {currentTheme === 'light' && <Sun size={16} />}
          {currentTheme === 'system' && <Laptop size={16} />}
        </button>
      </div>
    </header>
  )
}
