import React, { useState } from 'react'
import { CalendarCheck, CheckSquare, Square, ArrowUpRight, Flame } from 'lucide-react'
import { useApp } from '../../context/AppContext'

interface DailyTask {
  id: string
  label: string
  category: 'Practice' | 'Review' | 'Project' | 'Career'
  completed: boolean
  targetId?: string
}

export const DailyPlanCard: React.FC = () => {
  const { state, setActiveView, setSelectedTopicId, setSelectedProjectId } = useApp()

  const isCleanSlate = React.useMemo(() => {
    return Object.values(state.topics).every(t => t.status === 'not-started') &&
      state.projects.every(p => p.status === 'not-started')
  }, [state.topics, state.projects])

  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({})

  const tasks: DailyTask[] = React.useMemo(() => {
    if (isCleanSlate) {
      return [
        {
          id: 'dt-clean-1',
          label: 'Start Phase 1: SQL Basics & Filtering',
          category: 'Practice',
          completed: !!completedTaskIds['dt-clean-1'],
          targetId: 't-1-1'
        },
        {
          id: 'dt-clean-2',
          label: 'Explore the 19-Phase Learning Roadmap',
          category: 'Review',
          completed: !!completedTaskIds['dt-clean-2'],
          targetId: 'roadmap'
        },
        {
          id: 'dt-clean-3',
          label: 'Inspect Project 1: E-commerce Sales Analysis',
          category: 'Project',
          completed: !!completedTaskIds['dt-clean-3'],
          targetId: 'project-1'
        },
        {
          id: 'dt-clean-4',
          label: 'Review Job Readiness checklist in Job Tracker',
          category: 'Career',
          completed: !!completedTaskIds['dt-clean-4'],
          targetId: 'career'
        }
      ]
    }

    const list: DailyTask[] = []

    const gap = state.interviewGaps.find(g => !g.resolved)
    if (gap) {
      list.push({
        id: `dt-gap-${gap.id}`,
        label: `Review ${gap.skill} question from ${gap.companyName} interview`,
        category: 'Career',
        completed: !!completedTaskIds[`dt-gap-${gap.id}`],
        targetId: 'career'
      })
    }

    const rev = Object.values(state.topics).find(t => t.needsReview)
    if (rev) {
      list.push({
        id: `dt-rev-${rev.id}`,
        label: `Review ${rev.name} (spaced repetition due)`,
        category: 'Review',
        completed: !!completedTaskIds[`dt-rev-${rev.id}`],
        targetId: rev.id
      })
    }

    const proj1 = state.projects.find(p => p.id === 1)
    const pendingDeliv = proj1?.deliverables.find(d => !d.completed)
    if (pendingDeliv) {
      list.push({
        id: `dt-proj-${pendingDeliv.id}`,
        label: `Project 1: ${pendingDeliv.name}`,
        category: 'Project',
        completed: !!completedTaskIds[`dt-proj-${pendingDeliv.id}`],
        targetId: 'project-1'
      })
    }

    const activeTopic = Object.values(state.topics).find(t => t.status === 'learning' || t.status === 'practicing') ||
      Object.values(state.topics).find(t => t.status === 'not-started')
    if (activeTopic) {
      list.push({
        id: `dt-topic-${activeTopic.id}`,
        label: `Practice: ${activeTopic.name}`,
        category: 'Practice',
        completed: !!completedTaskIds[`dt-topic-${activeTopic.id}`],
        targetId: activeTopic.id
      })
    }

    return list
  }, [isCleanSlate, state.interviewGaps, state.topics, state.projects, completedTaskIds])

  const toggleTask = (id: string) => {
    setCompletedTaskIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = tasks.filter(t => t.completed).length

  const streakDays = React.useMemo(() => {
    if (!state.studyLogs || state.studyLogs.length === 0) return 0
    return Array.from(new Set(state.studyLogs.map(l => l.date))).length
  }, [state.studyLogs])

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarCheck size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Today's Tasks (3–5 To-Dos)
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>
            <Flame size={14} fill="currentColor" />
            <span>{streakDays}-Day Streak</span>
          </div>
          <span className="badge badge-default" style={{ fontSize: '0.7rem' }}>
            {completedCount} of {tasks.length} Done
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 0.75rem',
              backgroundColor: task.completed ? 'var(--bg-app)' : 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              transition: 'background-color 160ms ease, border-color 160ms ease, transform 160ms var(--ease-out-quad), box-shadow 160ms ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.transform = 'translateX(2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flex: 1, userSelect: 'none' }}
              onClick={() => toggleTask(task.id)}
            >
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: task.completed ? 'var(--success)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 160ms var(--ease-spring), color 150ms ease'
                }}
                aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.completed ? (
                  <CheckSquare size={17} className="animate-check-pop" />
                ) : (
                  <Square size={17} />
                )}
              </button>
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  transition: 'color 180ms ease, opacity 180ms ease',
                  opacity: task.completed ? 0.75 : 1
                }}
              >
                {task.label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                className={`badge ${
                  task.category === 'Practice'
                    ? 'badge-info'
                    : task.category === 'Review'
                    ? 'badge-warning'
                    : task.category === 'Project'
                    ? 'badge-accent'
                    : 'badge-success'
                }`}
                style={{ fontSize: '0.65rem', transition: 'background-color 150ms ease' }}
              >
                {task.category}
              </span>

              {task.targetId && (
                <button
                  type="button"
                  onClick={() => {
                    if (task.targetId?.startsWith('t-')) {
                      setSelectedTopicId(task.targetId)
                      setActiveView('roadmap')
                    } else if (task.targetId === 'project-1') {
                      setSelectedProjectId(1)
                      setActiveView('project-detail')
                    } else if (task.targetId === 'career') {
                      setActiveView('career')
                    }
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '0.2rem',
                    color: 'var(--text-muted)',
                    transition: 'transform 150ms var(--ease-out-quad), color 150ms ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--accent-primary)'
                    e.currentTarget.style.transform = 'translate(1.5px, -1.5px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.transform = 'translate(0, 0)'
                  }}
                  title="Navigate to item"
                >
                  <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
