import type { AppState, Topic } from '../types/index.ts'
import { evaluateMilestone1 } from './readinessEngine.ts'
import { calculateTopicCompetency } from './competencyEngine.ts'

export interface NextBestAction {
  category: 'Review' | 'Continue Learning' | 'Practice' | 'Build' | 'Career'
  title: string
  subtitle: string
  targetId: string // topicId, projectId, or career
  priority: 'critical' | 'high' | 'medium'
  actionLabel: string
  reasoning: string
}

export function calculateNextBestAction(state: AppState): NextBestAction {
  const { topics, projects, applications, interviewGaps } = state

  // 1. Check for interview skill gaps (highest real-world urgency)
  const unresolvedGaps = interviewGaps.filter(g => !g.resolved)
  if (unresolvedGaps.length > 0) {
    const gap = unresolvedGaps[0]
    const linkedTopic = gap.linkedTopicId ? topics[gap.linkedTopicId] : null

    return {
      category: 'Review',
      title: `Practice Interview Question: ${gap.skill}`,
      subtitle: `From your ${gap.companyName} interview: ${gap.problemEncountered}`,
      targetId: gap.linkedTopicId || 'skills',
      priority: 'critical',
      actionLabel: 'Open Review',
      reasoning: `You had a question about this in your ${gap.companyName} interview. Reviewing this now will help you ace it next time.`
    }
  }

  // 2. Check for overdue spaced repetition reviews
  const reviewDueTopics = Object.values(topics).filter(t => t.needsReview || (t.nextReviewDate && new Date(t.nextReviewDate) <= new Date()))
  if (reviewDueTopics.length > 0) {
    const topic = reviewDueTopics[0]
    return {
      category: 'Review',
      title: `Quick Review: ${topic.name}`,
      subtitle: `Time for a quick refresher on ${topic.name}`,
      targetId: topic.id,
      priority: 'high',
      actionLabel: 'Start Review',
      reasoning: `Reviewing topics after a few days helps you remember them for the long term.`
    }
  }

  // 3. Check Milestone 1 blockers (if Milestone 1 is not yet unlocked)
  const m1 = evaluateMilestone1(state)
  if (!m1.isUnlocked) {
    const unsatisfiedReq = m1.requirements.find(r => !r.satisfied)
    if (unsatisfiedReq) {
      if (unsatisfiedReq.id === 'm1-proj') {
        const proj1 = projects.find(p => p.id === 1)
        const pendingDeliv = proj1?.deliverables.find(d => !d.completed)
        return {
          category: 'Build',
          title: `Next Step: Finish ${pendingDeliv?.name || 'Project 1'}`,
          subtitle: 'Finishing Project 1 will unlock your Data Analyst readiness',
          targetId: 'project-1',
          priority: 'critical',
          actionLabel: 'Go to Project 1',
          reasoning: `You are almost ready! Finishing this project task shows you can do the job and unlocks your readiness badge.`
        }
      }

      // If a foundation phase is lagging
      const phaseIdMap: Record<string, number> = {
        'm1-sql': 1,
        'm1-excel': 2,
        'm1-stats': 3,
        'm1-pbi': 4
      }
      const targetPhaseId = phaseIdMap[unsatisfiedReq.id] || 1
      const phaseTopics = Object.values(topics).filter(t => t.phaseId === targetPhaseId)
      const unfinishedTopic = phaseTopics.find(t => t.status !== 'validated' && t.status !== 'mastered')

      if (unfinishedTopic) {
        return {
          category: 'Practice',
          title: `Practice: ${unfinishedTopic.name}`,
          subtitle: `${unsatisfiedReq.label} is at ${unsatisfiedReq.currentValue} (Goal: ${unsatisfiedReq.targetValue})`,
          targetId: unfinishedTopic.id,
          priority: 'high',
          actionLabel: 'Practice Topic',
          reasoning: `Practicing ${unfinishedTopic.name} will raise your score and unlock your readiness badge.`
        }
      }
    }
  }

  // 4. In-progress phase next topic
  const activeTopics = Object.values(topics).filter(t => t.status === 'learning' || t.status === 'practicing')
  if (activeTopics.length > 0) {
    const active = activeTopics[0]
    return {
      category: 'Continue Learning',
      title: `Finish: ${active.name}`,
      subtitle: active.goal,
      targetId: active.id,
      priority: 'high',
      actionLabel: 'Continue Learning',
      reasoning: `You already started this topic. Finish the checklist and attach your notes or links to complete it.`
    }
  }

  // 5. Next unstarted topic in current active stage
  const notStarted = Object.values(topics).filter(t => t.status === 'not-started')
  if (notStarted.length > 0) {
    const next = notStarted[0]
    return {
      category: 'Continue Learning',
      title: `Start Topic: ${next.name}`,
      subtitle: next.goal,
      targetId: next.id,
      priority: 'medium',
      actionLabel: 'Start Topic',
      reasoning: `This is the next topic in your learning roadmap.`
    }
  }

  // Fallback: Career Applications
  return {
    category: 'Career',
    title: 'Apply for Jobs',
    subtitle: 'Find and save jobs to apply to, and track your interviews.',
    targetId: 'career',
    priority: 'medium',
    actionLabel: 'View Job Tracker',
    reasoning: 'The best way to succeed is to apply while you learn: Learn → Build → Apply → Improve.'
  }
}
