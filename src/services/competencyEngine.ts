import type { CompetencyBreakdown, Topic, Phase, AppState } from '../types/index.ts'

/**
 * Calculates competency score for a single topic using PRD Section 20 weighted formula:
 * Competency = Learning (20%) + Practice (25%) + Assessment (20%) + Real-world (25%) + Confidence (10%)
 */
export function calculateTopicCompetency(breakdown: CompetencyBreakdown): number {
  const score = (
    breakdown.learning * 0.20 +
    breakdown.practice * 0.25 +
    breakdown.assessment * 0.20 +
    breakdown.realWorld * 0.25 +
    breakdown.confidence * 0.10
  )
  return Math.min(100, Math.max(0, Math.round(score)))
}

/**
 * Calculates phase competency percentage across all its topics
 */
export function calculatePhaseCompetency(phaseId: number, topics: Record<string, Topic>): number {
  const phaseTopics = Object.values(topics).filter(t => t.phaseId === phaseId)
  if (phaseTopics.length === 0) return 0

  const totalScore = phaseTopics.reduce((acc, topic) => {
    return acc + calculateTopicCompetency(topic.competencyBreakdown)
  }, 0)

  return Math.round(totalScore / phaseTopics.length)
}

/**
 * Calculates phase completion percentage (based on status)
 */
export function calculatePhaseCompletion(phaseId: number, topics: Record<string, Topic>): number {
  const phaseTopics = Object.values(topics).filter(t => t.phaseId === phaseId)
  if (phaseTopics.length === 0) return 0

  const completedCount = phaseTopics.filter(t => 
    t.status === 'validated' || t.status === 'mastered' || t.status === 'demonstrated'
  ).length

  return Math.round((completedCount / phaseTopics.length) * 100)
}

/**
 * Calculates overall roadmap competency across all topics
 */
export function calculateOverallCompetency(topics: Record<string, Topic>): number {
  const allTopics = Object.values(topics)
  if (allTopics.length === 0) return 0

  const sum = allTopics.reduce((acc, t) => acc + calculateTopicCompetency(t.competencyBreakdown), 0)
  return Math.round(sum / allTopics.length)
}

/**
 * Calculates overall roadmap completion % (topics completed/validated)
 */
export function calculateRoadmapCompletion(topics: Record<string, Topic>): number {
  const allTopics = Object.values(topics)
  if (allTopics.length === 0) return 0

  const finished = allTopics.filter(t => 
    t.status === 'validated' || t.status === 'mastered'
  ).length

  return Math.round((finished / allTopics.length) * 100)
}

/**
 * Validates whether a topic can be promoted to 'validated'
 */
export function canValidateTopic(topic: Topic): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = []
  const comp = calculateTopicCompetency(topic.competencyBreakdown)

  if (comp < 65 && !topic.priorKnowledgeValidated) {
    reasons.push(`Skill score is ${comp}%. You need at least 65% to complete this topic.`)
  }

  if (topic.competencyBreakdown.practice < 50 && !topic.priorKnowledgeValidated) {
    reasons.push('Hands-on practice score is below 50%.')
  }

  if (topic.evidence.length === 0 && topic.competencyBreakdown.realWorld < 50 && !topic.priorKnowledgeValidated) {
    reasons.push('No project links or notes attached yet.')
  }

  return {
    allowed: reasons.length === 0 || !!topic.priorKnowledgeValidated,
    reasons
  }
}
