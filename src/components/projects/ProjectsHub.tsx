import React from 'react'
import { FolderKanban, Check, Minus, ArrowRight, Sparkles, ExternalLink, Code } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const ProjectsHub: React.FC = () => {
  const { state, setSelectedProjectId, setActiveView } = useApp()

  const matrixSkills = [
    { name: 'SQL', p1: true, p2: true, p3: true, p4: true },
    { name: 'Power BI / Dashboards', p1: true, p2: false, p3: true, p4: true },
    { name: 'Python ETL Scripting', p1: false, p2: true, p3: false, p4: true },
    { name: 'Pandas Data Wrangling', p1: false, p2: true, p3: false, p4: true },
    { name: 'PostgreSQL Relational DB', p1: false, p2: true, p3: false, p4: false },
    { name: 'Dimensional Data Modeling', p1: true, p2: true, p3: true, p4: true },
    { name: 'Cloud Data Warehouse (BigQuery/Snowflake)', p1: false, p2: false, p3: true, p4: true },
    { name: 'dbt Core & Testing', p1: false, p2: false, p3: true, p4: true },
    { name: 'Apache Airflow Orchestration', p1: false, p2: false, p3: false, p4: true },
    { name: 'CI/CD & Slim CI Testing', p1: false, p2: false, p3: true, p4: true },
    { name: 'Governed Semantic Layer', p1: false, p2: false, p3: false, p4: true }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <FolderKanban size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Hands-on Projects
          </h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Build 4 real-world projects to show employers you have real experience.
        </p>
      </div>

      {/* Projects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {state.projects.map(proj => {
          const completedCount = proj.deliverables.filter(d => d.completed).length
          const totalCount = proj.deliverables.length
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

          return (
            <div
              key={proj.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                borderTop: proj.status === 'validated' ? '3px solid var(--success)' : '3px solid var(--accent-primary)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    PROJECT {proj.id}
                  </span>
                  <span className={`badge ${proj.status === 'validated' ? 'badge-success' : proj.status === 'in-progress' ? 'badge-warning' : 'badge-default'}`}>
                    {proj.status === 'validated' ? 'Completed' : proj.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {proj.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                  {proj.description}
                </p>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {proj.skillsCovered.map(s => (
                    <span key={s} className="badge badge-default" style={{ fontSize: '0.6875rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Deliverables completion */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tasks Done</span>
                    <strong style={{ color: pct === 100 ? 'var(--success)' : 'var(--text-primary)' }}>
                      {completedCount} of {totalCount} ({pct}%)
                    </strong>
                  </div>
                  <div className="progress-bar-container" style={{ height: '5px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct === 100 ? 'var(--success)' : 'var(--accent-primary)'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(proj.id)
                    setActiveView('project-detail')
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>View Project</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Skills in Projects Matrix */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Skills Covered in Each Project
            </h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            See how each project proves your skills to employers.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Competency / Tool</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>P1: Sales Analysis</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>P2: Python Pipeline</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>P3: Modern AE (dbt)</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>P4: End-to-End Platform</th>
              </tr>
            </thead>
            <tbody>
              {matrixSkills.map((row, idx) => (
                <tr
                  key={row.name}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: idx % 2 === 0 ? 'var(--bg-app)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.name}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    {row.p1 ? (
                      <span style={{ color: 'var(--success)' }}><Check size={16} /></span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}><Minus size={14} /></span>
                    )}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    {row.p2 ? (
                      <span style={{ color: 'var(--success)' }}><Check size={16} /></span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}><Minus size={14} /></span>
                    )}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    {row.p3 ? (
                      <span style={{ color: 'var(--success)' }}><Check size={16} /></span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}><Minus size={14} /></span>
                    )}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    {row.p4 ? (
                      <span style={{ color: 'var(--success)' }}><Check size={16} /></span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}><Minus size={14} /></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
