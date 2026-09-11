import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import {
  AppState,
  Topic,
  ProjectDeliverable,
  EvidenceItem,
  JobApplication,
  InterviewSkillGap,
  ContinuousPracticeLog,
  UserPreferences,
  TopicStatus,
  Skill,
  CurrentStudySession
} from '../types'
import { getInitialState, getCleanInitialState, getSampleDemoState, CANONICAL_PHASES } from '../data/canonicalRoadmap'
import { calculateTopicCompetency } from '../services/competencyEngine'

const STORAGE_KEY = 'learning_os_career_tracker_v1'

export interface AppContextType {
  state: AppState
  activeView: string
  setActiveView: (view: string) => void
  roadmapStageFilter: string
  setRoadmapStageFilter: (filter: string) => void
  navigateToStage: (stageId: string) => void
  selectedPhaseId: number | null
  setSelectedPhaseId: (id: number | null) => void
  selectedProjectId: number | null
  setSelectedProjectId: (id: number | null) => void
  selectedTopicId: string | null
  setSelectedTopicId: (id: string | null) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  isStudyModalOpen: boolean
  setIsStudyModalOpen: (open: boolean) => void
  isShortcutsOpen: boolean
  setIsShortcutsOpen: (open: boolean) => void
  isMobileNavOpen: boolean
  setIsMobileNavOpen: (open: boolean) => void
  saveStatus: 'saved' | 'saving' | 'offline'

  // Mutators
  updateTopic: (topicId: string, updates: Partial<Topic>) => void
  validateTopic: (topicId: string) => void
  markTopicPriorKnown: (topicId: string, confidence?: number) => void
  updateChecklistItem: (topicId: string, itemKey: keyof Topic['checklist'], checked: boolean) => void
  updateTopicBreakdown: (topicId: string, key: keyof Topic['competencyBreakdown'], value: number) => void
  addEvidenceToTopic: (topicId: string, evidence: Omit<EvidenceItem, 'id' | 'dateAdded'>) => void
  removeEvidenceFromTopic: (topicId: string, evidenceId: string) => void
  
  // Projects
  updateDeliverable: (projectId: number, deliverableId: string, completed: boolean, evidenceUrl?: string) => void
  updateProjectStatus: (projectId: number, status: 'not-started' | 'in-progress' | 'completed' | 'validated') => void

  // Tool Choice (Phase 2, Phase 10)
  updatePhaseToolChoice: (phaseId: number, selectedTool: string) => void

  // Career
  addApplication: (app: Omit<JobApplication, 'id'>) => void
  updateApplicationStage: (id: string, stage: JobApplication['stage']) => void
  deleteApplication: (id: string) => void
  addInterviewGap: (gap: Omit<InterviewSkillGap, 'id' | 'createdAt'>) => void
  resolveInterviewGap: (id: string) => void

  // Continuous Practice
  addContinuousLog: (log: Omit<ContinuousPracticeLog, 'id'>) => void

  // Study Session
  startStudySession: (topicId: string, autoStart?: boolean) => void
  updateStudySession: (updates: Partial<CurrentStudySession>) => void
  pauseStudySession: () => void
  resumeStudySession: () => void
  resetStudySession: () => void
  minimizeStudySession: () => void
  completeStudySession: (durationMinutes: number, notes: string, confidence: number) => void
  cancelStudySession: () => void

  // Preferences & Data Management
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  setCareerTarget: (target: UserPreferences['careerTarget']) => void
  resetToCleanSlate: () => void
  resetToSampleState: () => void
  exportStateJson: () => string
  importStateJson: (json: string) => boolean
  toastMessage: string | null
  showToast: (msg: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

const safeLocalStorageSet = (key: string, value: any): boolean => {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (err: any) {
    console.warn('LocalStorage write failed:', err)
    return false
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          const initial = getInitialState()
          return {
            ...initial,
            ...parsed,
            user: { ...initial.user, ...(parsed.user || {}) },
            phases: CANONICAL_PHASES,
            topics: { ...initial.topics, ...(parsed.topics || {}) },
            projects: initial.projects.map(initProj => {
              const savedProj = Array.isArray(parsed.projects)
                ? parsed.projects.find((p: any) => p && p.id === initProj.id)
                : null
              if (!savedProj) return initProj
              return {
                ...initProj,
                ...savedProj,
                deliverables: Array.isArray(savedProj.deliverables) ? savedProj.deliverables : initProj.deliverables,
                pipeline: Array.isArray(savedProj.pipeline) ? savedProj.pipeline : initProj.pipeline
              }
            }),
            skills: initial.skills.map(initSkill => {
              const savedSkill = Array.isArray(parsed.skills)
                ? parsed.skills.find((s: any) => s && s.id === initSkill.id)
                : null
              if (!savedSkill) return initSkill
              return {
                ...initSkill,
                ...savedSkill
              }
            }),
            applications: Array.isArray(parsed.applications) ? parsed.applications : [],
            interviewGaps: Array.isArray(parsed.interviewGaps) ? parsed.interviewGaps : [],
            continuousLogs: Array.isArray(parsed.continuousLogs) ? parsed.continuousLogs : [],
            studyLogs: Array.isArray(parsed.studyLogs) ? parsed.studyLogs : [],
            currentStudySession: parsed.currentStudySession || initial.currentStudySession
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse saved state, using initial', e)
    }
    return getInitialState()
  })

  const [activeView, setActiveView] = useState<string>('overview')
  const [roadmapStageFilter, setRoadmapStageFilter] = useState<string>('all')

  const navigateToStage = useCallback((stageId: string) => {
    setRoadmapStageFilter(stageId)
    setActiveView('roadmap')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const mainEl = document.querySelector('main')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isStudyModalOpen, setIsStudyModalOpen] = useState<boolean>(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'offline'>('saved')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimerRef = React.useRef<any>(null)
  const isFirstRender = React.useRef<boolean>(true)
  const isRemoteUpdate = React.useRef<boolean>(false)
  const stateRef = React.useRef<AppState>(state)
  stateRef.current = state

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(msg)
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500)
  }, [])

  // Theme synchronization with DOM (synchronous pre-paint with useLayoutEffect)
  useLayoutEffect(() => {
    const applyTheme = (theme: 'dark' | 'light' | 'system') => {
      let resolved = theme
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      document.documentElement.setAttribute('data-theme', resolved)
      document.documentElement.style.colorScheme = resolved
    }
    applyTheme(state.user.theme)

    if (state.user.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [state.user.theme])

  // Resilient Autosave to LocalStorage with debounce & error handling
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false
      setSaveStatus('saved')
      return
    }

    setSaveStatus('saving')
    const timer = setTimeout(() => {
      const ok = safeLocalStorageSet(STORAGE_KEY, state)
      setSaveStatus(ok ? 'saved' : 'offline')
    }, 350)

    return () => clearTimeout(timer)
  }, [state])

  // Synchronous flush on window unload / pagehide / visibilitychange to prevent data loss on tab close
  useEffect(() => {
    const flushSave = () => {
      safeLocalStorageSet(STORAGE_KEY, stateRef.current)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushSave()
      }
    }

    window.addEventListener('beforeunload', flushSave)
    window.addEventListener('pagehide', flushSave)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', flushSave)
      window.removeEventListener('pagehide', flushSave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed && typeof parsed === 'object' && parsed.topics && parsed.projects) {
            isRemoteUpdate.current = true
            setState(prev => ({
              ...prev,
              ...parsed,
              phases: CANONICAL_PHASES
            }))
            setSaveStatus('saved')
          }
        } catch (err) {
          console.error('Failed to sync from storage event', err)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
        return
      }

      // If typing in input or textarea, don't capture navigation keys
      const activeTag = document.activeElement?.tagName.toLowerCase()
      if (activeTag === 'input' || activeTag === 'textarea') return

      if (e.key === '?') {
        setIsShortcutsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const updateTopic = useCallback((topicId: string, updates: Partial<Topic>) => {
    setState(prev => {
      const topic = prev.topics[topicId]
      if (!topic) return prev

      const updatedTopic = {
        ...topic,
        ...updates,
        lastStudied: new Date().toISOString()
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: updatedTopic
        }
      }
    })
  }, [])

  const validateTopic = useCallback((topicId: string) => {
    setState(prev => {
      const topic = prev.topics[topicId]
      if (!topic) return prev

      const updated: Topic = {
        ...topic,
        status: 'validated',
        lastStudied: new Date().toISOString(),
        needsReview: false,
        competencyBreakdown: {
          ...topic.competencyBreakdown,
          assessment: Math.max(topic.competencyBreakdown.assessment, 85),
          practice: Math.max(topic.competencyBreakdown.practice, 85),
          realWorld: Math.max(topic.competencyBreakdown.realWorld, 80)
        }
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: updated
        }
      }
    })
  }, [])

  const markTopicPriorKnown = useCallback((topicId: string, confidence: number = 90) => {
    setState(prev => {
      const topic = prev.topics[topicId]
      if (!topic) return prev

      const updated: Topic = {
        ...topic,
        status: 'validated',
        priorKnowledgeValidated: true,
        lastStudied: new Date().toISOString(),
        needsReview: false,
        competencyBreakdown: {
          learning: 100,
          practice: 90,
          assessment: 90,
          realWorld: 85,
          confidence
        },
        checklist: {
          understandConcept: true,
          followExample: true,
          completeExercise: true,
          buildImplementation: true,
          explainWithoutReference: true,
          validateResult: true
        }
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: updated
        }
      }
    })
  }, [])

  const updateChecklistItem = useCallback((topicId: string, itemKey: keyof Topic['checklist'], checked: boolean) => {
    setState(prev => {
      const topic = prev.topics[topicId]
      if (!topic) return prev

      const newChecklist = {
        ...topic.checklist,
        [itemKey]: checked
      }

      // Auto-compute status progression if checklist items are ticked
      const checkedCount = Object.values(newChecklist).filter(Boolean).length
      let newStatus: TopicStatus = topic.status
      if (checkedCount === 6 && topic.status !== 'mastered') {
        newStatus = 'validated'
      } else if (checkedCount >= 4 && (topic.status === 'not-started' || topic.status === 'learning')) {
        newStatus = 'practicing'
      } else if (checkedCount >= 1 && topic.status === 'not-started') {
        newStatus = 'learning'
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...topic,
            checklist: newChecklist,
            status: newStatus,
            lastStudied: new Date().toISOString()
          }
        }
      }
    })
  }, [])

  const updateTopicBreakdown = useCallback((topicId: string, key: keyof Topic['competencyBreakdown'], value: number) => {
    setState(prev => {
      const topic = prev.topics[topicId]
      if (!topic) return prev

      const newBreakdown = {
        ...topic.competencyBreakdown,
        [key]: Math.min(100, Math.max(0, value))
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...topic,
            competencyBreakdown: newBreakdown,
            lastStudied: new Date().toISOString()
          }
        }
      }
    })
  }, [])

  const addEvidenceToTopic = useCallback((topicId: string, evidence: Omit<EvidenceItem, 'id' | 'dateAdded'>) => {
    setState(prev => {
      const topic = prev.topics[topicId]
      if (!topic) return prev

      const newItem: EvidenceItem = {
        ...evidence,
        id: `ev-${Date.now()}`,
        dateAdded: new Date().toISOString().split('T')[0]
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...topic,
            evidence: [...topic.evidence, newItem],
            competencyBreakdown: {
              ...topic.competencyBreakdown,
              realWorld: Math.min(100, topic.competencyBreakdown.realWorld + 20)
            }
          }
        }
      }
    })
  }, [])

  const removeEvidenceFromTopic = useCallback((topicId: string, evidenceId: string) => {
    setState(prev => {
      const topic = prev.topics[topicId]
      if (!topic) return prev

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...topic,
            evidence: topic.evidence.filter(e => e.id !== evidenceId)
          }
        }
      }
    })
  }, [])

  const updateDeliverable = useCallback((projectId: number, deliverableId: string, completed: boolean, evidenceUrl?: string) => {
    setState(prev => {
      const updatedProjects = prev.projects.map(proj => {
        if (proj.id !== projectId) return proj

        const updatedDeliverables = proj.deliverables.map(deliv => {
          if (deliv.id !== deliverableId) return deliv
          return {
            ...deliv,
            completed,
            evidenceUrl: evidenceUrl !== undefined ? evidenceUrl : deliv.evidenceUrl,
            status: completed ? ('validated' as const) : ('in-progress' as const)
          }
        })

        const allDone = updatedDeliverables.every(d => d.completed)
        const anyDone = updatedDeliverables.some(d => d.completed)
        const newProjStatus = allDone ? ('validated' as const) : anyDone ? ('in-progress' as const) : ('not-started' as const)

        return {
          ...proj,
          deliverables: updatedDeliverables,
          status: newProjStatus
        }
      })

      return {
        ...prev,
        projects: updatedProjects
      }
    })
  }, [])

  const updateProjectStatus = useCallback((projectId: number, status: 'not-started' | 'in-progress' | 'completed' | 'validated') => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, status } : p)
    }))
  }, [])

  const updatePhaseToolChoice = useCallback((phaseId: number, selectedTool: string) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.map(ph => {
        if (ph.id !== phaseId || !ph.toolChoice) return ph
        return {
          ...ph,
          toolChoice: {
            ...ph.toolChoice,
            selected: selectedTool
          }
        }
      })
    }))
  }, [])

  const addApplication = useCallback((app: Omit<JobApplication, 'id'>) => {
    const newApp: JobApplication = {
      ...app,
      id: `app-${Date.now()}`
    }
    setState(prev => ({
      ...prev,
      applications: [newApp, ...prev.applications]
    }))
  }, [])

  const updateApplicationStage = useCallback((id: string, stage: JobApplication['stage']) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a => a.id === id ? { ...a, stage } : a)
    }))
  }, [])

  const deleteApplication = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.filter(a => a.id !== id)
    }))
  }, [])

  const addInterviewGap = useCallback((gap: Omit<InterviewSkillGap, 'id' | 'createdAt'>) => {
    const newGap: InterviewSkillGap = {
      ...gap,
      id: `gap-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setState(prev => {
      // If linked to a topic, mark that topic as needing review
      let updatedTopics = prev.topics
      if (gap.linkedTopicId && prev.topics[gap.linkedTopicId]) {
        updatedTopics = {
          ...prev.topics,
          [gap.linkedTopicId]: {
            ...prev.topics[gap.linkedTopicId],
            needsReview: true
          }
        }
      }

      return {
        ...prev,
        topics: updatedTopics,
        interviewGaps: [newGap, ...prev.interviewGaps]
      }
    })
  }, [])

  const resolveInterviewGap = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      interviewGaps: prev.interviewGaps.map(g => g.id === id ? { ...g, resolved: true } : g)
    }))
  }, [])

  const addContinuousLog = useCallback((log: Omit<ContinuousPracticeLog, 'id'>) => {
    const newLog: ContinuousPracticeLog = {
      ...log,
      id: `clog-${Date.now()}`
    }
    setState(prev => ({
      ...prev,
      continuousLogs: [newLog, ...prev.continuousLogs]
    }))
  }, [])

  const startStudySession = useCallback((topicId: string, autoStart = false) => {
    setState(prev => {
      const isSameTopic = prev.currentStudySession.topicId === topicId
      const isOngoing = prev.currentStudySession.status === 'running' || prev.currentStudySession.status === 'paused'

      if (isSameTopic && isOngoing) {
        return prev
      }

      return {
        ...prev,
        currentStudySession: {
          isActive: autoStart,
          status: autoStart ? 'running' : 'idle',
          topicId,
          startTime: new Date().toISOString(),
          startTimestamp: autoStart ? Date.now() : null,
          elapsedSeconds: 0,
          accumulatedMs: 0,
          targetMinutes: 25,
          notes: '',
          confidence: 4
        }
      }
    })
    setIsStudyModalOpen(true)
  }, [])

  const updateStudySession = useCallback((updates: Partial<CurrentStudySession>) => {
    setState(prev => ({
      ...prev,
      currentStudySession: {
        ...prev.currentStudySession,
        ...updates
      }
    }))
  }, [])

  const pauseStudySession = useCallback(() => {
    setState(prev => {
      const session = prev.currentStudySession
      if (session.status !== 'running') return prev

      const now = Date.now()
      const additionalMs = session.startTimestamp ? now - session.startTimestamp : 0
      const newAccumulatedMs = (session.accumulatedMs || 0) + additionalMs
      const newElapsedSeconds = Math.floor(newAccumulatedMs / 1000)

      return {
        ...prev,
        currentStudySession: {
          ...session,
          isActive: false,
          status: 'paused',
          startTimestamp: null,
          accumulatedMs: newAccumulatedMs,
          elapsedSeconds: newElapsedSeconds
        }
      }
    })
  }, [])

  const resumeStudySession = useCallback(() => {
    setState(prev => {
      const session = prev.currentStudySession
      return {
        ...prev,
        currentStudySession: {
          ...session,
          isActive: true,
          status: 'running',
          startTimestamp: Date.now()
        }
      }
    })
  }, [])

  const resetStudySession = useCallback(() => {
    setState(prev => {
      const session = prev.currentStudySession
      return {
        ...prev,
        currentStudySession: {
          ...session,
          isActive: false,
          status: 'idle',
          startTimestamp: null,
          accumulatedMs: 0,
          elapsedSeconds: 0
        }
      }
    })
  }, [])

  const minimizeStudySession = useCallback(() => {
    setIsStudyModalOpen(false)
  }, [])

  const completeStudySession = useCallback((durationMinutes: number, notes: string, confidence: number) => {
    setState(prev => {
      const topicId = prev.currentStudySession.topicId
      if (!topicId || !prev.topics[topicId]) {
        return {
          ...prev,
          currentStudySession: { isActive: false, status: 'idle', elapsedSeconds: 0, accumulatedMs: 0 }
        }
      }

      const topic = prev.topics[topicId]
      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + 7)

      const studyLog = {
        id: `slog-${Date.now()}`,
        topicId,
        topicName: topic.name,
        date: new Date().toISOString().split('T')[0],
        durationMinutes,
        notes,
        confidenceRating: confidence,
        nextReviewDate: nextReview.toISOString().split('T')[0]
      }

      const updatedTopic: Topic = {
        ...topic,
        lastStudied: new Date().toISOString(),
        reviewCount: topic.reviewCount + 1,
        needsReview: false,
        nextReviewDate: nextReview.toISOString().split('T')[0],
        competencyBreakdown: {
          ...topic.competencyBreakdown,
          learning: Math.min(100, topic.competencyBreakdown.learning + 15),
          practice: Math.min(100, topic.competencyBreakdown.practice + 20),
          confidence: Math.round((confidence / 5) * 100)
        }
      }

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: updatedTopic
        },
        studyLogs: [studyLog, ...prev.studyLogs],
        currentStudySession: { isActive: false, status: 'idle', elapsedSeconds: 0, accumulatedMs: 0 }
      }
    })
    setIsStudyModalOpen(false)
    showToast(`Study Session Completed: ${durationMinutes} min logged!`)
  }, [showToast])

  const cancelStudySession = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStudySession: { isActive: false, status: 'idle', elapsedSeconds: 0, accumulatedMs: 0 }
    }))
    setIsStudyModalOpen(false)
  }, [])

  const setTheme = useCallback((theme: 'dark' | 'light' | 'system') => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, theme }
    }))
  }, [])

  const setCareerTarget = useCallback((careerTarget: UserPreferences['careerTarget']) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, careerTarget }
    }))
  }, [])

  const resetToCleanSlate = useCallback(() => {
    const cleanState = getCleanInitialState()
    stateRef.current = cleanState
    safeLocalStorageSet(STORAGE_KEY, cleanState)
    setState(cleanState)
    setSaveStatus('saved')
    showToast('Clean Slate applied! All progress reset to 0%')
  }, [showToast])

  const resetToSampleState = useCallback(() => {
    const sampleState = getSampleDemoState()
    stateRef.current = sampleState
    safeLocalStorageSet(STORAGE_KEY, sampleState)
    setState(sampleState)
    setSaveStatus('saved')
    showToast('Sample starter data loaded with realistic progress')
  }, [showToast])

  const exportStateJson = useCallback(() => {
    return JSON.stringify(stateRef.current, null, 2)
  }, [])

  const importStateJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString)
      if (parsed && typeof parsed === 'object' && parsed.topics && parsed.projects) {
        const initial = getInitialState()
        const merged: AppState = {
          ...initial,
          ...parsed,
          user: { ...initial.user, ...(parsed.user || {}) },
          phases: CANONICAL_PHASES,
          topics: { ...initial.topics, ...(parsed.topics || {}) },
          projects: Array.isArray(parsed.projects) ? parsed.projects : initial.projects,
          skills: Array.isArray(parsed.skills) ? parsed.skills : initial.skills,
          applications: Array.isArray(parsed.applications) ? parsed.applications : [],
          interviewGaps: Array.isArray(parsed.interviewGaps) ? parsed.interviewGaps : [],
          continuousLogs: Array.isArray(parsed.continuousLogs) ? parsed.continuousLogs : [],
          studyLogs: Array.isArray(parsed.studyLogs) ? parsed.studyLogs : [],
          currentStudySession: parsed.currentStudySession || initial.currentStudySession
        }
        stateRef.current = merged
        safeLocalStorageSet(STORAGE_KEY, merged)
        setState(merged)
        setSaveStatus('saved')
        showToast('State successfully imported from backup file!')
        return true
      }
    } catch (e) {
      console.error('Failed to import state JSON', e)
    }
    return false
  }, [showToast])

  return (
    <AppContext.Provider
      value={{
        state,
        activeView,
        setActiveView,
        roadmapStageFilter,
        setRoadmapStageFilter,
        navigateToStage,
        selectedPhaseId,
        setSelectedPhaseId,
        selectedProjectId,
        setSelectedProjectId,
        selectedTopicId,
        setSelectedTopicId,
        isSearchOpen,
        setIsSearchOpen,
        isStudyModalOpen,
        setIsStudyModalOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,
        saveStatus,

        updateTopic,
        validateTopic,
        markTopicPriorKnown,
        updateChecklistItem,
        updateTopicBreakdown,
        addEvidenceToTopic,
        removeEvidenceFromTopic,

        updateDeliverable,
        updateProjectStatus,
        updatePhaseToolChoice,

        addApplication,
        updateApplicationStage,
        deleteApplication,
        addInterviewGap,
        resolveInterviewGap,

        addContinuousLog,

        startStudySession,
        updateStudySession,
        pauseStudySession,
        resumeStudySession,
        resetStudySession,
        minimizeStudySession,
        completeStudySession,
        cancelStudySession,

        setTheme,
        setCareerTarget,
        resetToCleanSlate,
        resetToSampleState,
        exportStateJson,
        importStateJson,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
