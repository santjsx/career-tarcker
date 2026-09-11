import React, { useMemo } from 'react'
import { Award, Briefcase, CheckCircle2, TrendingUp, Layers, FolderKanban, Route, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateCareerReadiness } from '../../services/readinessEngine'
import { calculateOverallCompetency, calculateRoadmapCompletion } from '../../services/competencyEngine'

export const HeroProgressCard: React.FC = () => {
  const { state, setActiveView, setSelectedTopicId } = useApp()

  const readiness = calculateCareerReadiness(state)
  const overallCompetency = calculateOverallCompetency(state.topics)
  const roadmapCompletion = calculateRoadmapCompletion(state.topics)

  const validatedTopicsCount = Object.values(state.topics).filter(t => t.status === 'validated' || t.status === 'mastered').length
  const totalTopicsCount = Object.keys(state.topics).length

  const completedProjectsCount = state.projects.filter(p => p.status === 'completed' || p.status === 'validated').length

  // Find next topic to work on: first incomplete topic in canonical roadmap order
  const nextIncompleteTopic = useMemo(() => {
    const sortedPhases = [...state.phases].sort((a, b) => a.number - b.number)
    for (const phase of sortedPhases) {
      const topics = Object.values(state.topics).filter(t => t.phaseId === phase.id)
      for (const topic of topics) {
        if (topic.status !== 'validated' && topic.status !== 'mastered') {
          return { topic, phase }
        }
      }
    }
    return null
  }, [state.phases, state.topics])

  const handleContinueLearning = () => {
    if (nextIncompleteTopic) {
      setSelectedTopicId(nextIncompleteTopic.topic.id)
    }
    setActiveView('roadmap')
  }

  return (
    <div
      className="card"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Your Learning Progress
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Goal: <strong style={{ color: 'var(--accent-primary)' }}>{state.user.careerTarget}</strong> • Focus:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {validatedTopicsCount === 0 && completedProjectsCount === 0
                ? 'Phase 1 (SQL Foundations) & Getting Started'
                : 'Stage 1 (Analyst Basics) & Project 1'}
            </strong>
          </p>
        </div>

        {/* Quick Goal Status */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            onClick={() => setActiveView('career')}
            style={{
              padding: '0.5rem 0.85rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: state.user.careerTarget === 'Data Analyst' ? '2px solid var(--success)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 180ms var(--ease-out-quad), box-shadow 180ms ease, border-color 180ms ease',
              userSelect: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(0, 0, 0, 0.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'scale(0.97)'
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Analyst Ready
              </span>
              {state.user.careerTarget === 'Data Analyst' && (
                <span className="badge-pulse" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--success)', backgroundColor: 'rgba(34, 197, 94, 0.15)', padding: '1px 4px', borderRadius: '3px' }}>
                  GOAL
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>
              {readiness.dataAnalyst}%
            </div>
          </div>

          <div
            onClick={() => setActiveView('career')}
            style={{
              padding: '0.5rem 0.85rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: state.user.careerTarget === 'Strong Data Analyst' ? '2px solid var(--warning)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 180ms var(--ease-out-quad), box-shadow 180ms ease, border-color 180ms ease',
              userSelect: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(0, 0, 0, 0.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'scale(0.97)'
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Strong Analyst
              </span>
              {state.user.careerTarget === 'Strong Data Analyst' && (
                <span className="badge-pulse" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--warning)', backgroundColor: 'rgba(234, 179, 8, 0.15)', padding: '1px 4px', borderRadius: '3px' }}>
                  GOAL
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning)' }}>
              {readiness.strongDataAnalyst}%
            </div>
          </div>

          <div
            onClick={() => setActiveView('career')}
            style={{
              padding: '0.5rem 0.85rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: state.user.careerTarget === 'Analytics Engineer' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 180ms var(--ease-out-quad), box-shadow 180ms ease, border-color 180ms ease',
              userSelect: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(0, 0, 0, 0.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'scale(0.97)'
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Engineer Ready
              </span>
              {state.user.careerTarget === 'Analytics Engineer' && (
                <span className="badge-pulse" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '1px 4px', borderRadius: '3px' }}>
                  GOAL
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {readiness.analyticsEngineer}%
            </div>
          </div>
        </div>
      </div>

      {/* Primary Roadmap CTA Strip */}
      <div
        style={{
          marginTop: '0.25rem',
          marginBottom: '1rem',
          padding: '0.85rem 1.15rem',
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Route size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {nextIncompleteTopic ? `Next Up: Phase ${nextIncompleteTopic.phase.number} — ${nextIncompleteTopic.phase.name}` : 'Roadmap Status'}
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {nextIncompleteTopic ? nextIncompleteTopic.topic.name : 'All 19 Phases Completed! 🎉'}
            </div>
          </div>
        </div>

        <button
          type="button"
          data-testid="hero-continue-learning-btn"
          onClick={handleContinueLearning}
          className="btn btn-primary btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1rem',
            fontWeight: 600,
            fontSize: '0.8125rem'
          }}
        >
          <span>{nextIncompleteTopic ? 'Continue Learning' : 'View Roadmap'}</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* 4 Core Pillars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          padding: '1.1rem',
          backgroundColor: 'var(--bg-app)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Metric 1: Roadmap Completion */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              1. Roadmap Done
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {roadmapCompletion}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: '5px' }}>
            <div className="progress-bar-fill" style={{ width: `${roadmapCompletion}%` }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {validatedTopicsCount} of {totalTopicsCount} topics completed
          </div>
        </div>

        {/* Metric 2: Competency Mastery */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              2. Skill Mastery
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {overallCompetency}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: '5px' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${overallCompetency}%`, backgroundColor: 'var(--accent-primary)' }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Based on practice & real work
          </div>
        </div>

        {/* Metric 3: Portfolio Coverage */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              3. Projects Built
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--warning)' }}>
              {readiness.portfolioReadiness}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: '5px' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${readiness.portfolioReadiness}%`, backgroundColor: 'var(--warning)' }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {completedProjectsCount} of 4 projects completed
          </div>
        </div>

        {/* Metric 4: Market Job Readiness */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              4. Job Readiness
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--success)' }}>
              {readiness.dataAnalyst}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: '5px' }}>
            <div
              className="progress-bar-fill success"
              style={{ width: `${readiness.dataAnalyst}%` }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Ready to apply for jobs
          </div>
        </div>
      </div>
    </div>
  )
}
