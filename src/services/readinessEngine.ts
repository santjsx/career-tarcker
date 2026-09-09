import type { AppState, MilestoneGate } from '../types/index.ts'
import { calculatePhaseCompetency } from './competencyEngine.ts'

export interface MilestoneRequirementStatus {
  id: string
  label: string
  satisfied: boolean
  currentValue: string
  targetValue: string
  explanation: string
}

export interface EvaluatedMilestone {
  id: string
  title: string
  subtitle: string
  isUnlocked: boolean
  progressPercentage: number
  requirements: MilestoneRequirementStatus[]
  unlockedTitle: string
  unlockedCta: string
}

export interface CareerReadinessScores {
  dataAnalyst: number
  strongDataAnalyst: number
  analyticsEngineer: number
  portfolioReadiness: number
}

/**
 * Calculates independent readiness scores for the 3 career stages and portfolio coverage
 */
export function calculateCareerReadiness(state: AppState): CareerReadinessScores {
  const { topics, projects } = state

  // 1. Data Analyst Readiness (Phases 1-4 + Project 1)
  const p1Comp = calculatePhaseCompetency(1, topics) // SQL
  const p2Comp = calculatePhaseCompetency(2, topics) // Spreadsheets
  const p3Comp = calculatePhaseCompetency(3, topics) // Stats
  const p4Comp = calculatePhaseCompetency(4, topics) // Power BI

  const proj1 = projects.find(p => p.id === 1)
  const proj1Delivs = proj1 ? proj1.deliverables : []
  const proj1Completed = proj1Delivs.filter(d => d.completed).length
  const proj1Score = proj1Delivs.length > 0 ? (proj1Completed / proj1Delivs.length) * 100 : 0

  // DA weight: SQL 30%, Spreadsheets 15%, Stats 15%, Power BI 20%, Project 1 20%
  const daScore = Math.round(
    p1Comp * 0.30 +
    p2Comp * 0.15 +
    p3Comp * 0.15 +
    p4Comp * 0.20 +
    proj1Score * 0.20
  )

  // 2. Strong Data Analyst Readiness (Phases 1-9 + Project 1 & 2)
  const p5Comp = calculatePhaseCompetency(5, topics) // Python
  const p6Comp = calculatePhaseCompetency(6, topics) // Pandas
  const p7Comp = calculatePhaseCompetency(7, topics) // APIs
  const p8Comp = calculatePhaseCompetency(8, topics) // DB Postgres
  const p9Comp = calculatePhaseCompetency(9, topics) // Data Modeling

  const proj2 = projects.find(p => p.id === 2)
  const proj2Delivs = proj2 ? proj2.deliverables : []
  const proj2Completed = proj2Delivs.filter(d => d.completed).length
  const proj2Score = proj2Delivs.length > 0 ? (proj2Completed / proj2Delivs.length) * 100 : 0

  const strongDaScore = Math.round(
    daScore * 0.35 +
    p5Comp * 0.10 +
    p6Comp * 0.15 +
    p7Comp * 0.10 +
    p8Comp * 0.10 +
    p9Comp * 0.10 +
    proj2Score * 0.10
  )

  // 3. Analytics Engineer Readiness (Phases 10-19 + Project 3 & 4)
  const p10Comp = calculatePhaseCompetency(10, topics) // Warehouse
  const p11Comp = calculatePhaseCompetency(11, topics) // dbt
  const p12Comp = calculatePhaseCompetency(12, topics) // Quality
  const p13Comp = calculatePhaseCompetency(13, topics) // Git
  const p14Comp = calculatePhaseCompetency(14, topics) // CI/CD
  const p15Comp = calculatePhaseCompetency(15, topics) // Airflow
  const p16Comp = calculatePhaseCompetency(16, topics) // Semantics
  const p17Comp = calculatePhaseCompetency(17, topics) // Business
  const p18Comp = calculatePhaseCompetency(18, topics) // Comm
  const p19Comp = calculatePhaseCompetency(19, topics) // AI

  const proj3 = projects.find(p => p.id === 3)
  const proj3Completed = proj3 ? proj3.deliverables.filter(d => d.completed).length : 0
  const proj3Score = proj3 && proj3.deliverables.length > 0 ? (proj3Completed / proj3.deliverables.length) * 100 : 0

  const proj4 = projects.find(p => p.id === 4)
  const proj4Completed = proj4 ? proj4.deliverables.filter(d => d.completed).length : 0
  const proj4Score = proj4 && proj4.deliverables.length > 0 ? (proj4Completed / proj4.deliverables.length) * 100 : 0

  const aeScore = Math.round(
    strongDaScore * 0.25 +
    p10Comp * 0.08 +
    p11Comp * 0.18 +
    p12Comp * 0.06 +
    p13Comp * 0.05 +
    p14Comp * 0.05 +
    p15Comp * 0.08 +
    p16Comp * 0.05 +
    ((p17Comp + p18Comp + p19Comp) / 3) * 0.08 +
    proj3Score * 0.06 +
    proj4Score * 0.06
  )

  // 4. Portfolio Readiness (% of all project deliverables completed)
  const allDeliverables = projects.flatMap(p => p.deliverables)
  const allCompleted = allDeliverables.filter(d => d.completed).length
  const portfolioScore = allDeliverables.length > 0 ? Math.round((allCompleted / allDeliverables.length) * 100) : 0

  return {
    dataAnalyst: Math.min(100, Math.max(0, daScore)),
    strongDataAnalyst: Math.min(100, Math.max(0, strongDaScore)),
    analyticsEngineer: Math.min(100, Math.max(0, aeScore)),
    portfolioReadiness: portfolioScore
  }
}

/**
 * Evaluates Milestone 1: Data Analyst Foundation
 */
export function evaluateMilestone1(state: AppState): EvaluatedMilestone {
  const p1 = calculatePhaseCompetency(1, state.topics)
  const p2 = calculatePhaseCompetency(2, state.topics)
  const p3 = calculatePhaseCompetency(3, state.topics)
  const p4 = calculatePhaseCompetency(4, state.topics)

  const proj1 = state.projects.find(p => p.id === 1)
  const proj1CompletedCount = proj1 ? proj1.deliverables.filter(d => d.completed).length : 0
  const proj1RequiredCount = 5

  const reqs: MilestoneRequirementStatus[] = [
    {
      id: 'm1-sql',
      label: 'SQL Skills',
      satisfied: p1 >= 75,
      currentValue: `${p1}%`,
      targetValue: '≥ 75%',
      explanation: 'Basic queries, grouping, joins, and window functions.'
    },
    {
      id: 'm1-excel',
      label: 'Excel & Spreadsheets',
      satisfied: p2 >= 70,
      currentValue: `${p2}%`,
      targetValue: '≥ 70%',
      explanation: 'Formulas, XLOOKUP, pivot tables, and charts.'
    },
    {
      id: 'm1-stats',
      label: 'Statistics Basics',
      satisfied: p3 >= 60,
      currentValue: `${p3}%`,
      targetValue: '≥ 60%',
      explanation: 'Averages, distributions, and understanding patterns in numbers.'
    },
    {
      id: 'm1-pbi',
      label: 'Power BI Basics',
      satisfied: p4 >= 65,
      currentValue: `${p4}%`,
      targetValue: '≥ 65%',
      explanation: 'Building data models, charts, and interactive dashboards.'
    },
    {
      id: 'm1-proj',
      label: 'Project 1: Sales Analysis',
      satisfied: proj1CompletedCount >= proj1RequiredCount,
      currentValue: `${proj1CompletedCount}/${proj1 ? proj1.deliverables.length : 6} tasks done`,
      targetValue: `${proj1RequiredCount}+ tasks done`,
      explanation: 'Finished and documented project with links and dashboard.'
    }
  ]

  const satisfiedCount = reqs.filter(r => r.satisfied).length
  const progressPercentage = Math.round((satisfiedCount / reqs.length) * 100)

  return {
    id: 'milestone-1',
    title: 'Step 1: Ready to Apply for Analyst Roles',
    subtitle: 'Complete these 5 requirements to be ready for junior data analyst jobs.',
    isUnlocked: satisfiedCount === reqs.length,
    progressPercentage,
    requirements: reqs,
    unlockedTitle: 'YOU ARE READY TO APPLY FOR ANALYST JOBS!',
    unlockedCta: 'Open Job Tracker'
  }
}

/**
 * Evaluates Milestone 2: Strong Data Analyst
 */
export function evaluateMilestone2(state: AppState): EvaluatedMilestone {
  const m1 = evaluateMilestone1(state)
  const p5 = calculatePhaseCompetency(5, state.topics) // Python
  const p6 = calculatePhaseCompetency(6, state.topics) // Pandas
  const p7 = calculatePhaseCompetency(7, state.topics) // APIs
  const p8 = calculatePhaseCompetency(8, state.topics) // DB
  const p9 = calculatePhaseCompetency(9, state.topics) // Data Modeling

  const proj2 = state.projects.find(p => p.id === 2)
  const proj2CompletedCount = proj2 ? proj2.deliverables.filter(d => d.completed).length : 0

  const reqs: MilestoneRequirementStatus[] = [
    {
      id: 'm2-m1',
      label: 'Step 1 (Analyst Basics) Completed',
      satisfied: m1.isUnlocked,
      currentValue: m1.isUnlocked ? 'Completed' : 'Incomplete',
      targetValue: 'Unlocked',
      explanation: 'All 5 beginner requirements are completed.'
    },
    {
      id: 'm2-python-pandas',
      label: 'Python & Pandas',
      satisfied: p5 >= 65 && p6 >= 65,
      currentValue: `Py: ${p5}%, Pandas: ${p6}%`,
      targetValue: '≥ 65% each',
      explanation: 'Cleaning data, grouping, and writing scripts with Python.'
    },
    {
      id: 'm2-apis-db',
      label: 'APIs & Database Storage',
      satisfied: p7 >= 60 && p8 >= 60,
      currentValue: `API: ${p7}%, DB: ${p8}%`,
      targetValue: '≥ 60% each',
      explanation: 'Pulling data from the web and storing it in a database.'
    },
    {
      id: 'm2-modeling',
      label: 'Data Modeling',
      satisfied: p9 >= 70,
      currentValue: `${p9}%`,
      targetValue: '≥ 70%',
      explanation: 'Organizing tables so data is fast and easy to analyze.'
    },
    {
      id: 'm2-proj2',
      label: 'Project 2: Python Data Pipeline',
      satisfied: proj2CompletedCount >= 3,
      currentValue: `${proj2CompletedCount}/${proj2 ? proj2.deliverables.length : 4} tasks done`,
      targetValue: '3+ tasks done',
      explanation: 'Automated data pipeline from API to database.'
    }
  ]

  const satisfiedCount = reqs.filter(r => r.satisfied).length
  const progressPercentage = Math.round((satisfiedCount / reqs.length) * 100)

  return {
    id: 'milestone-2',
    title: 'Step 2: Ready for Senior Analyst & Engineer Topics',
    subtitle: 'Unlocks advanced engineering topics and senior analyst roles.',
    isUnlocked: satisfiedCount === reqs.length,
    progressPercentage,
    requirements: reqs,
    unlockedTitle: 'YOU ARE READY FOR ANALYTICS ENGINEERING!',
    unlockedCta: 'Start Advanced Engineering'
  }
}
