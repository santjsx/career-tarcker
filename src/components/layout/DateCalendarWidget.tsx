import React, { useState, useEffect, useRef } from 'react'
import { Calendar as CalendarIcon, Clock, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, Bookmark } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const DateCalendarWidget: React.FC = () => {
  const { state } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Year computations
  const currentYear = currentDate.getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  const totalDaysInYear = isLeapYear(currentYear) ? 366 : 365

  const diffTime = currentDate.getTime() - startOfYear.getTime()
  const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  const daysRemaining = totalDaysInYear - dayOfYear
  const yearElapsedPercent = Math.min(100, Math.max(0, Math.round((dayOfYear / totalDaysInYear) * 100)))

  // Formatted date parts
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' })
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' })
  const dayNum = currentDate.getDate()

  // Calendar generation for viewDate month
  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()
  const viewMonthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => setViewDate(new Date(viewYear, viewMonth - 1, 1))
  const nextMonth = () => setViewDate(new Date(viewYear, viewMonth + 1, 1))

  // Find study days or review days in this month
  const studyDaysInMonth = new Set(
    state.studyLogs
      .map(log => {
        const d = new Date(log.date)
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth ? d.getDate() : null
      })
      .filter((d): d is number => d !== null)
  )

  const reviewDaysInMonth = new Set(
    Object.values(state.topics)
      .filter(t => t.nextReviewDate)
      .map(t => {
        const d = new Date(t.nextReviewDate!)
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth ? d.getDate() : null
      })
      .filter((d): d is number => d !== null)
  )

  return (
    <div className="date-calendar-widget-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="date-pill-btn"
        aria-label="View calendar and year progress"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.35rem 0.75rem',
          backgroundColor: isOpen ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
          border: isOpen ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontSize: '0.8125rem',
          transition: 'transform 160ms var(--ease-out-quad), background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
          userSelect: 'none'
        }}
        onMouseEnter={e => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'var(--border-default)'
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)'
          }
        }}
        onMouseLeave={e => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
          }
        }}
        onMouseDown={e => {
          e.currentTarget.style.transform = 'scale(0.98)'
        }}
        onMouseUp={e => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <CalendarIcon size={15} style={{ color: 'var(--accent-primary)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {dayName}, {monthName} {dayNum}, {currentYear}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <strong style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{daysRemaining}</strong>d left in {currentYear}
          </span>
        </div>

        {/* Subtle Year Meter */}
        <div
          title={`${yearElapsedPercent}% of ${currentYear} elapsed (${daysRemaining} days remaining)`}
          style={{
            width: '38px',
            height: '4px',
            backgroundColor: 'var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginLeft: '0.2rem'
          }}
        >
          <div
            style={{
              width: `${yearElapsedPercent}%`,
              height: '100%',
              backgroundColor: 'var(--accent-primary)',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>

        <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>

      {/* Dropdown Calendar Popover */}
      {isOpen && (
        <div
          className="calendar-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '320px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1.1rem',
            zIndex: 1050,
            animation: 'fadeIn 150ms ease-out'
          }}
        >
          {/* Popover Header: Year Summary */}
          <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                {currentYear} Year Progress
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {yearElapsedPercent}% Completed
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <div style={{ width: `${yearElapsedPercent}%`, height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: 'var(--radius-full)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Day {dayOfYear} of {totalDaysInYear}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{daysRemaining} Days Left</span>
            </div>
          </div>

          {/* Month Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {viewMonthName}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={prevMonth}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.2rem 0.35rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
                aria-label="Previous month"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.2rem 0.35rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
                aria-label="Next month"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
            {/* Leading empty days */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} style={{ height: '30px' }} />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1
              const isToday = day === dayNum && viewMonth === currentDate.getMonth() && viewYear === currentDate.getFullYear()
              const hasStudy = studyDaysInMonth.has(day)
              const hasReview = reviewDaysInMonth.has(day)

              return (
                <div
                  key={`day-${day}`}
                  style={{
                    height: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.75rem',
                    fontWeight: isToday ? 700 : 400,
                    backgroundColor: isToday ? 'var(--accent-subtle)' : 'transparent',
                    border: isToday ? '1px solid var(--accent-border)' : '1px solid transparent',
                    color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)',
                    position: 'relative'
                  }}
                >
                  <span>{day}</span>
                  {/* Indicator dots */}
                  <div style={{ display: 'flex', gap: '2px', position: 'absolute', bottom: '2px' }}>
                    {hasStudy && <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />}
                    {hasReview && <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
              <span>Today</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <span>Study Logged</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
              <span>Review Due</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
