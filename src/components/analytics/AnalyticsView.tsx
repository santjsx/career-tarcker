import React from 'react'
import {
  BarChart3,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Briefcase
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateOverallCompetency, calculateRoadmapCompletion } from '../../services/competencyEngine'
import { calculateCareerReadiness } from '../../services/readinessEngine'

export const AnalyticsView: React.FC = () => {
  const { state } = useApp()

  const overallComp = calculateOverallCompetency(state.topics)
  const roadmapComp = calculateRoadmapCompletion(state.topics)
  const readiness = calculateCareerReadiness(state)

  const validatedTopics = Object.values(state.topics).filter(t => t.status === 'validated' || t.status === 'mastered')
  const topicsNeedingReview = Object.values(state.topics).filter(t => t.needsReview)

  const totalStudyMinutes = state.studyLogs.reduce((acc, log) => acc + log.durationMinutes, 0)
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1)

  // Sort skills to find strongest and weakest
  const sortedSkills = [...state.skills].sort((a, b) => b.practiceScore - a.practiceScore)
  const strongestSkills = sortedSkills.slice(0, 4)
  const weakestSkills = sortedSkills.slice(-4).reverse()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Study Stats & Weekly Summary
          </h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          See your study hours, completed topics, skill scores, and job applications.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Hours Studied</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {totalStudyHours} hrs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Goal: {state.user.weeklyHoursCapacity} hrs/week
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Award size={16} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Completed Topics</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
            {validatedTopics.length} / {Object.keys(state.topics).length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {roadmapComp}% of roadmap done
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <TrendingUp size={16} style={{ color: 'var(--warning)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Average Skill Score</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)' }}>
            {overallComp}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Overall score across all skills
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Briefcase size={16} style={{ color: 'var(--info)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Jobs in Pipeline</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--info)' }}>
            {state.applications.length} Jobs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {state.applications.filter(a => a.stage === 'interview' || a.stage === 'assessment').length} Active interviews / tests
          </div>
        </div>
      </div>

      {/* Strongest vs Weakest Skills Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Strongest Skills */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Your Strongest Skills</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {strongestSkills.map(skill => (
              <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 600 }}>{skill.name}</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>{skill.practiceScore}%</span>
                </div>
                <div className="progress-bar-container" style={{ height: '5px' }}>
                  <div className="progress-bar-fill success" style={{ width: `${skill.practiceScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weakest / Focus Areas */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Skills to Practice More</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {weakestSkills.map(skill => (
              <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 600 }}>{skill.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{skill.practiceScore}%</span>
                </div>
                <div className="progress-bar-container" style={{ height: '5px' }}>
                  <div className="progress-bar-fill" style={{ width: `${skill.practiceScore}%`, backgroundColor: 'var(--warning)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WEEKLY RETROSPECTIVE */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>
            Weekly Summary & Next Steps
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              1. What You Finished This Week
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0 }}>
              {validatedTopics.length === 0 && state.continuousLogs.length === 0
                ? 'No topics or practice logs completed yet. Start your first topic in Phase 1 to begin!'
                : `${validatedTopics.length} topics validated, ${state.continuousLogs.length} practice notes recorded, and project deliverables updated.`}
            </p>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              2. Your Progress
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0 }}>
              {readiness.dataAnalyst === 0
                ? 'Data Analyst readiness is at 0%. Complete Phase 1 and Project 1 to build readiness.'
                : `Data Analyst readiness is currently at ${readiness.dataAnalyst}%.`}
            </p>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              3. Topics to Review
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0 }}>
              {(() => {
                const unresolvedGaps = state.interviewGaps.filter(g => !g.resolved)
                if (topicsNeedingReview.length === 0 && unresolvedGaps.length === 0) {
                  return 'All skills in good standing. No overdue topics or interview gaps flagged.'
                }
                const parts: string[] = []
                if (topicsNeedingReview.length > 0) {
                  parts.push(`${topicsNeedingReview.length} topic${topicsNeedingReview.length > 1 ? 's' : ''} due for spaced repetition (${topicsNeedingReview.map(t => t.name).slice(0, 2).join(', ')})`)
                }
                if (unresolvedGaps.length > 0) {
                  parts.push(`${unresolvedGaps.length} interview gap${unresolvedGaps.length > 1 ? 's' : ''} (${unresolvedGaps.map(g => `${g.companyName}: ${g.skill}`).slice(0, 2).join(', ')})`)
                }
                return parts.join('; ') + '.'
              })()}
            </p>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--info)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              4. Plan for Next Week
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0 }}>
              {readiness.dataAnalyst < 75
                ? 'Focus on Phase 1 SQL foundations, Excel formulas, and Project 1 to unlock your Analyst Readiness.'
                : 'Polish portfolio artifacts, practice mock interviews, and apply for target analytics roles.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
