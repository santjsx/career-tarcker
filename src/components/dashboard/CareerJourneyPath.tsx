import React from 'react'
import { Check, ChevronRight, Lock, Sparkles, ArrowRight, Briefcase } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { evaluateMilestone1, evaluateMilestone2 } from '../../services/readinessEngine'

export const CareerJourneyPath: React.FC = () => {
  const { state, setActiveView, setSelectedProjectId } = useApp()

  const m1 = evaluateMilestone1(state)
  const m2 = evaluateMilestone2(state)

  const steps = [
    {
      id: 'step-1',
      title: '1. Analyst Basics',
      subtitle: 'SQL, Excel, Stats, Power BI',
      status: m1.isUnlocked ? 'completed' : 'active',
      onClick: () => setActiveView('roadmap')
    },
    {
      id: 'step-2',
      title: '2. Project 1',
      subtitle: 'E-commerce Sales Dashboard',
      status: state.projects[0].status === 'validated' ? 'completed' : 'active',
      onClick: () => {
        setSelectedProjectId(1)
        setActiveView('project-detail')
      }
    },
    {
      id: 'step-3',
      title: '3. Start Applying',
      subtitle: 'Apply for Junior Analyst Roles',
      status: m1.isUnlocked ? 'unlocked' : 'pending',
      highlight: true,
      onClick: () => setActiveView('career')
    },
    {
      id: 'step-4',
      title: '4. Python & DBs',
      subtitle: 'Python, Pandas, PostgreSQL',
      status: m2.isUnlocked ? 'completed' : m1.isUnlocked ? 'active' : 'subdued',
      onClick: () => setActiveView('roadmap')
    },
    {
      id: 'step-5',
      title: '5. Project 2',
      subtitle: 'Automated Python Pipeline',
      status: state.projects[1].status === 'validated' ? 'completed' : 'subdued',
      onClick: () => {
        setSelectedProjectId(2)
        setActiveView('project-detail')
      }
    },
    {
      id: 'step-6',
      title: '6. Engineer Tools',
      subtitle: 'dbt, Warehouses, Airflow',
      status: 'subdued',
      onClick: () => setActiveView('roadmap')
    },
    {
      id: 'step-7',
      title: '7. Project 3',
      subtitle: 'Modern Analytics (dbt)',
      status: 'subdued',
      onClick: () => {
        setSelectedProjectId(3)
        setActiveView('project-detail')
      }
    },
    {
      id: 'step-8',
      title: '8. Final Capstone',
      subtitle: 'End-to-End Data Platform',
      status: 'subdued',
      onClick: () => {
        setSelectedProjectId(4)
        setActiveView('project-detail')
      }
    }
  ]

  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Your Career Path
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Learn the basics → Build real projects → Apply for jobs
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveView('roadmap')}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.75rem', gap: '0.25rem' }}
        >
          <span>View All Phases</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Horizontal Step Pipeline with scroll on overflow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isActive = step.status === 'active'
          const isUnlocked = step.status === 'unlocked'

          return (
            <div
              key={step.id}
              onClick={step.onClick}
              style={{
                flex: '0 0 175px',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive
                  ? 'var(--bg-surface-elevated)'
                  : isCompleted
                  ? 'var(--success-subtle)'
                  : isUnlocked
                  ? 'var(--accent-subtle)'
                  : 'var(--bg-app)',
                border: isActive
                  ? '1px solid var(--accent-border)'
                  : isCompleted
                  ? '1px solid var(--success-border)'
                  : isUnlocked
                  ? '1px solid var(--accent-primary)'
                  : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: step.status === 'subdued' ? 0.65 : 1
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Step {index + 1}
                  </span>
                  {isCompleted && (
                    <span style={{ color: 'var(--success)' }}>
                      <Check size={14} />
                    </span>
                  )}
                  {isActive && (
                    <span className="badge badge-accent" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>
                      Current
                    </span>
                  )}
                  {isUnlocked && (
                    <span className="badge badge-success" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>
                      Ready
                    </span>
                  )}
                  {step.status === 'subdued' && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <Lock size={12} />
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: isActive ? 'var(--accent-primary)' : isCompleted ? 'var(--success)' : 'var(--text-primary)',
                    lineHeight: 1.25,
                    marginBottom: '0.25rem'
                  }}
                >
                  {step.title}
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {step.subtitle}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
