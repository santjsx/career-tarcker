export type CareerStageId = 'stage-a' | 'stage-b' | 'stage-c' | 'stage-d'

export type TopicStatus = 
  | 'not-started'
  | 'learning'
  | 'practicing'
  | 'demonstrated'
  | 'validated'
  | 'mastered'
  | 'needs-review'

export interface CompetencyBreakdown {
  learning: number // 0-100, weight 20%
  practice: number // 0-100, weight 25%
  assessment: number // 0-100, weight 20%
  realWorld: number // 0-100, weight 25%
  confidence: number // 0-100, weight 10%
}

export type EvidenceType = 'github' | 'dashboard' | 'notebook' | 'sql' | 'document' | 'notes'

export interface EvidenceItem {
  id: string
  title: string
  type: EvidenceType
  url: string
  dateAdded: string
  notes?: string
  verified: boolean
}

export interface TopicChecklist {
  understandConcept: boolean
  followExample: boolean
  completeExercise: boolean
  buildImplementation: boolean
  explainWithoutReference: boolean
  validateResult: boolean
}

export interface Topic {
  id: string
  phaseId: number
  name: string
  goal: string
  order: number
  required: boolean
  status: TopicStatus
  competencyBreakdown: CompetencyBreakdown
  checklist: TopicChecklist
  evidence: EvidenceItem[]
  notes: string
  lastStudied?: string
  nextReviewDate?: string
  reviewCount: number
  needsReview: boolean
  priority: 1 | 2 | 3 | 4 | 5
  dependencies?: string[] // topic IDs that are prerequisites
  priorKnowledgeValidated?: boolean
}

export interface Phase {
  id: number
  stageId: CareerStageId
  number: number
  name: string
  goal: string
  priority: 1 | 2 | 3 | 4 | 5
  estimatedEffortHours: number
  isContinuous?: boolean // for Phase 17, 18, 19
  toolChoice?: {
    category: string
    selected: string
    options: string[]
  }
}

export interface ProjectDeliverable {
  id: string
  name: string
  description: string
  acceptanceCriteria: string[]
  completed: boolean
  evidenceUrl?: string
  status: 'pending' | 'in-progress' | 'completed' | 'validated'
}

export interface PipelineStage {
  id: string
  name: string
  description: string
  status: 'pending' | 'active' | 'completed'
}

export interface Project {
  id: number
  title: string
  stage: string
  description: string
  architecture: string
  pipeline: PipelineStage[]
  deliverables: ProjectDeliverable[]
  githubUrl?: string
  liveDemoUrl?: string
  status: 'not-started' | 'in-progress' | 'completed' | 'validated'
  skillsCovered: string[]
}

export interface MilestoneGate {
  id: string
  title: string
  subtitle: string
  requiredStage: CareerStageId
  requirements: {
    id: string
    label: string
    isSatisfied: (state: AppState) => boolean
    explanation: string
  }[]
  unlockedTitle: string
  unlockedCta: string
}

export interface Skill {
  id: string
  name: string
  category: 'Foundation' | 'Programming' | 'Engineering' | 'Production' | 'Soft Skills'
  learningScore: number // 0-100
  practiceScore: number // 0-100
  evidenceCount: number
  confidence: number // 1-5
  status: 'Novice' | 'Learning' | 'Competent' | 'Validated' | 'Mastered'
  associatedTopics: string[]
}

export type ApplicationStage = 
  | 'saved'
  | 'applied'
  | 'recruiter'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  jobUrl?: string
  stage: ApplicationStage
  dateApplied: string
  resumeVersion: string
  matchedSkills: string[]
  missingSkills: string[]
  notes: string
  followUpDate?: string
  outcome?: string
}

export interface InterviewSkillGap {
  id: string
  applicationId?: string
  companyName: string
  skill: string
  problemEncountered: string
  severity: 'low' | 'medium' | 'high'
  actionPlan: string
  linkedTopicId?: string
  resolved: boolean
  createdAt: string
}

export interface ContinuousPracticeLog {
  id: string
  type: 'business-thinking' | 'communication' | 'ai-verification'
  title: string
  date: string
  businessQuestion?: string
  dataRequirement?: string
  modelArchitecture?: string
  sqlQueryOrMetric?: string
  insightDerived?: string
  communicationSummary?: string
  targetAudience?: string
  aiToolUsed?: string
  promptOrTask?: string
  verificationChecks?: string
  learnings: string
}

export interface StudySessionLog {
  id: string
  topicId: string
  topicName: string
  date: string
  durationMinutes: number
  notes: string
  confidenceRating: number // 1-5
  nextReviewDate: string
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system'
  careerTarget: 'Data Analyst' | 'Strong Data Analyst' | 'Analytics Engineer' | 'Both'
  weeklyHoursCapacity: number
  currentStage: CareerStageId
}

export interface CurrentStudySession {
  isActive: boolean
  status?: 'idle' | 'running' | 'paused'
  topicId?: string
  startTime?: string
  startTimestamp?: number | null
  elapsedSeconds: number
  accumulatedMs?: number
  targetMinutes?: number
  notes?: string
  confidence?: number
}

export interface AppState {
  user: UserPreferences
  phases: Phase[]
  topics: Record<string, Topic>
  projects: Project[]
  skills: Skill[]
  applications: JobApplication[]
  interviewGaps: InterviewSkillGap[]
  continuousLogs: ContinuousPracticeLog[]
  studyLogs: StudySessionLog[]
  currentStudySession: CurrentStudySession
}
