import React, { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ExternalLink,
  CheckSquare,
  Square,
  Sparkles,
  Link2,
  ChevronRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const ProjectDetailView: React.FC = () => {
  const { selectedProjectId, setSelectedProjectId, setActiveView, state, updateDeliverable } = useApp()

  const project = state.projects.find(p => p.id === selectedProjectId) || state.projects[0]
  const [evidenceInputs, setEvidenceInputs] = useState<Record<string, string>>({})

  const completedDeliverables = project.deliverables.filter(d => d.completed).length
  const totalDeliverables = project.deliverables.length
  const projectProgress = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back button & Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={() => {
            setSelectedProjectId(null)
            setActiveView('projects')
          }}
          className="btn btn-ghost btn-sm"
          style={{ gap: '0.35rem', padding: '0.2rem 0.5rem', marginBottom: '0.5rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Projects</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-accent">{project.stage}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Project {project.id}: {project.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {project.description}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Tasks</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: projectProgress === 100 ? 'var(--success)' : 'var(--warning)' }}>
              {projectProgress}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {completedDeliverables} of {totalDeliverables} done
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pipeline Visualizer */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Project Steps
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {project.pipeline.map((stage, idx) => {
            const isCompleted = stage.status === 'completed'
            const isActive = stage.status === 'active'

            return (
              <React.Fragment key={stage.id}>
                <div
                  style={{
                    flex: '0 0 160px',
                    padding: '0.75rem 0.85rem',
                    backgroundColor: isActive
                      ? 'var(--bg-surface-elevated)'
                      : isCompleted
                      ? 'var(--success-subtle)'
                      : 'var(--bg-app)',
                    border: isActive
                      ? '1px solid var(--accent-primary)'
                      : isCompleted
                      ? '1px solid var(--success-border)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      STEP {idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                    ) : isActive ? (
                      <span className="badge badge-accent" style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>Active</span>
                    ) : (
                      <Circle size={12} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {stage.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {stage.description}
                  </div>
                </div>

                {idx < project.pipeline.length - 1 && (
                  <ChevronRight size={16} style={{ color: 'var(--border-default)', flexShrink: 0 }} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Structured Deliverables & Acceptance Criteria */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Project Tasks & Checklist
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Check off each task and attach your links to prove your work.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {project.deliverables.map((deliv, index) => (
            <div
              key={deliv.id}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => updateDeliverable(project.id, deliv.id, !deliv.completed)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: '2px', color: deliv.completed ? 'var(--success)' : 'var(--text-muted)' }}
                  >
                    {deliv.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>

                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: deliv.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: deliv.completed ? 'line-through' : 'none' }}>
                      Task {index + 1}: {deliv.name}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {deliv.description}
                    </p>
                  </div>
                </div>

                <span className={`badge ${deliv.completed ? 'badge-success' : 'badge-default'}`}>
                  {deliv.completed ? 'Completed' : 'In Progress'}
                </span>
              </div>

              {/* Acceptance Criteria */}
              <div style={{ paddingLeft: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Checklist to Complete:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {deliv.acceptanceCriteria.map((ac, i) => (
                    <li key={i} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: 'var(--accent-primary)' }}>•</span>
                      <span>{ac}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* GitHub Link / Evidence URL Input */}
              <div style={{ paddingLeft: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link2 size={13} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="url"
                  placeholder="Paste your GitHub repository or live dashboard link here..."
                  value={evidenceInputs[deliv.id] !== undefined ? evidenceInputs[deliv.id] : (deliv.evidenceUrl || '')}
                  onChange={e => setEvidenceInputs(prev => ({ ...prev, [deliv.id]: e.target.value }))}
                  onBlur={() => {
                    if (evidenceInputs[deliv.id] !== undefined) {
                      updateDeliverable(project.id, deliv.id, deliv.completed, evidenceInputs[deliv.id])
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.3rem 0.5rem',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.75rem'
                  }}
                />
                {deliv.evidenceUrl && (
                  <a
                    href={deliv.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                  >
                    <ExternalLink size={12} />
                    <span>Open</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
