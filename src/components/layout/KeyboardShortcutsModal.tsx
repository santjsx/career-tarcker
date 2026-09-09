import React from 'react'
import { X, Keyboard } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useApp()

  if (!isShortcutsOpen) return null

  const shortcuts = [
    { key: '⌘ / Ctrl + K', description: 'Open Global Command Palette (search everywhere)' },
    { key: '?', description: 'Toggle this keyboard shortcuts dialog' },
    { key: 'ESC', description: 'Close modals, command palette, and topic drawer' },
    { key: 'Tab / Shift + Tab', description: 'Accessible focus traversal through controls' }
  ]

  return (
    <div className="overlay" onClick={() => setIsShortcutsOpen(false)}>
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.0625rem' }}>
            <Keyboard size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{sc.description}</span>
              <kbd
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.2rem 0.5rem',
                  color: 'var(--text-primary)'
                }}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsShortcutsOpen(false)}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
