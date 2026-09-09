import assert from 'node:assert'
import { calculateTopicCompetency, canValidateTopic, calculatePhaseCompetency } from '../src/services/competencyEngine.ts'
import { calculateCareerReadiness, evaluateMilestone1, evaluateMilestone2 } from '../src/services/readinessEngine.ts'
import { calculateNextBestAction } from '../src/services/recommendationEngine.ts'
import { getInitialState } from '../src/data/canonicalRoadmap.ts'

console.log('--- STARTING AUTOMATED ENGINE VERIFICATION TESTS ---')

// TEST 1: PRD Weighted Competency Model
console.log('Test 1: PRD Weighted Competency Model Verification...')
const studyOnlyScore = calculateTopicCompetency({
  learning: 100,
  practice: 0,
  assessment: 0,
  realWorld: 0,
  confidence: 0
})
assert.strictEqual(studyOnlyScore, 20, '100% studied with 0% practice should yield exactly 20% competency')

const balancedScore = calculateTopicCompetency({
  learning: 100, // 20
  practice: 80,  // 20
  assessment: 75, // 15
  realWorld: 60,  // 15
  confidence: 80  // 8
})
assert.strictEqual(balancedScore, 78, 'Balanced topic score should equal 78%')
console.log('✓ PRD Weighted formula (0.20L + 0.25P + 0.20A + 0.25R + 0.10C) passed!')

// TEST 2: Validation Gatekeeper
console.log('Test 2: Validation Gatekeeper Verification...')
const unreadyTopic = {
  id: 'test-1',
  phaseId: 1,
  name: 'Test',
  goal: 'Test',
  order: 1,
  required: true,
  priority: 5 as const,
  status: 'learning' as const,
  competencyBreakdown: { learning: 100, practice: 30, assessment: 40, realWorld: 20, confidence: 40 },
  checklist: { understandConcept: true, followExample: false, completeExercise: false, buildImplementation: false, explainWithoutReference: false, validateResult: false },
  evidence: [],
  notes: '',
  reviewCount: 0,
  needsReview: false
}
const checkResult = canValidateTopic(unreadyTopic)
assert.strictEqual(checkResult.allowed, false, 'Should block validation when practice and real-world criteria are missing')
assert.ok(checkResult.reasons.length >= 2, 'Should provide transparent failure reasons')
console.log('✓ Validation gatekeeper passed!')

// TEST 3: Multi-Role Independent Readiness
console.log('Test 3: Multi-Role Independent Readiness Calculation...')
const sampleState = getInitialState()
const readiness = calculateCareerReadiness(sampleState)

assert.ok(readiness.dataAnalyst > readiness.strongDataAnalyst, 'DA readiness should exceed Strong DA readiness in early stage')
assert.ok(readiness.strongDataAnalyst > readiness.analyticsEngineer, 'Strong DA readiness should exceed AE readiness in early stage')
assert.ok(readiness.portfolioReadiness >= 0 && readiness.portfolioReadiness <= 100, 'Portfolio readiness must be within 0-100')
console.log(`✓ Role readiness scores verified: DA=${readiness.dataAnalyst}%, Strong DA=${readiness.strongDataAnalyst}%, AE=${readiness.analyticsEngineer}%, Portfolio=${readiness.portfolioReadiness}%`)

// TEST 4: Milestone 1 Gate
console.log('Test 4: Milestone 1 Gate Transparency...')
const m1 = evaluateMilestone1(sampleState)
assert.strictEqual(m1.requirements.length, 5, 'Milestone 1 must have exactly 5 transparent gate criteria')
assert.ok(m1.requirements.some(r => r.id === 'm1-proj'), 'Milestone 1 must require Project 1 deliverables')
console.log(`✓ Milestone 1 gate checked: isUnlocked=${m1.isUnlocked}, progress=${m1.progressPercentage}%`)

// TEST 5: Next Best Action Strategy & Explanation
console.log('Test 5: Next Best Action Prioritization & Rationale...')
const action = calculateNextBestAction(sampleState)
assert.ok(action.title.length > 0, 'Action title must not be empty')
assert.ok(action.reasoning.length > 20, 'Action must have detailed reasoning')
assert.ok(action.actionLabel.length > 0, 'Action must provide immediate CTA')
console.log(`✓ Next Best Action verified: [${action.category}] ${action.title} -> Why: "${action.reasoning}"`)

console.log('--- ALL 5 ENGINE TESTS PASSED SUCCESFULLY! ---')
