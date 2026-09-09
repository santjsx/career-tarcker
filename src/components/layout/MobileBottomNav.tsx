import React from 'react'
import { LayoutDashboard, Route, FolderKanban, Layers, Menu } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, isMobileNavOpen, setIsMobileNavOpen, state } = useApp()

  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: activeView === 'overview'
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: Route,
      badge: '19',
      isActive: activeView === 'roadmap' || activeView === 'phase-detail'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      badge: '4',
      isActive: activeView === 'projects' || activeView === 'project-detail'
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Layers,
      badge: '20',
      isActive: activeView === 'skills'
    },
    {
      id: 'more',
      label: 'More',
      icon: Menu,
      badge: state.applications.length > 0 ? `${state.applications.length}` : undefined,
      isActive: isMobileNavOpen || activeView === 'career' || activeView === 'analytics'
    }
  ]

  const handleSelect = (item: typeof navItems[0]) => {
    if (item.id === 'more') {
      setIsMobileNavOpen(!isMobileNavOpen)
    } else {
      setIsMobileNavOpen(false)
      setActiveView(item.id)
    }
  }

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      role="navigation"
    >
      <div className="mobile-bottom-nav-inner">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={`mobile-bottom-nav-item ${item.isActive ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.isActive && <span className="mobile-bottom-active-pill" />}
              <div className="mobile-bottom-icon-container">
                <Icon size={20} />
                {item.badge && (
                  <span className="mobile-bottom-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-bottom-label">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
