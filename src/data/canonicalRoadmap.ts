import type { Phase, Topic, Project, Skill, JobApplication, InterviewSkillGap, ContinuousPracticeLog, AppState } from '../types/index.ts'

export const CANONICAL_PHASES: Phase[] = [
  // Stage A: Data Analyst Foundation
  {
    id: 1,
    stageId: 'stage-a',
    number: 1,
    name: 'SQL Foundations',
    goal: 'Query and analyze relational data with high precision and business relevance.',
    priority: 5,
    estimatedEffortHours: 40
  },
  {
    id: 2,
    stageId: 'stage-a',
    number: 2,
    name: 'Spreadsheets',
    goal: 'Work comfortably with business data, formulas, lookups, and pivot analyses.',
    priority: 3,
    estimatedEffortHours: 25,
    toolChoice: {
      category: 'Spreadsheet Software',
      selected: 'Excel',
      options: ['Excel', 'Google Sheets']
    }
  },
  {
    id: 3,
    stageId: 'stage-a',
    number: 3,
    name: 'Statistics',
    goal: 'Interpret business data correctly, avoiding spurious correlation and biased conclusions.',
    priority: 4,
    estimatedEffortHours: 30
  },
  {
    id: 4,
    stageId: 'stage-a',
    number: 4,
    name: 'Power BI',
    goal: 'Build interactive dashboards, star schemas, DAX measures, and communicate business insights.',
    priority: 4,
    estimatedEffortHours: 45
  },

  // Stage B: Strong Data Analyst
  {
    id: 5,
    stageId: 'stage-b',
    number: 5,
    name: 'Python',
    goal: 'Write programmatic scripts for data workflows, virtual environments, and automation.',
    priority: 4,
    estimatedEffortHours: 35
  },
  {
    id: 6,
    stageId: 'stage-b',
    number: 6,
    name: 'Pandas',
    goal: 'Perform end-to-end data manipulation, cleaning, aggregation, reshaping, and feature engineering.',
    priority: 5,
    estimatedEffortHours: 40
  },
  {
    id: 7,
    stageId: 'stage-b',
    number: 7,
    name: 'APIs and JSON',
    goal: 'Extract REST API payloads, handle authentication, parse nested JSON, and load into DataFrames.',
    priority: 4,
    estimatedEffortHours: 25
  },
  {
    id: 8,
    stageId: 'stage-b',
    number: 8,
    name: 'Databases (PostgreSQL)',
    goal: 'Master relational schema architecture, constraints, indexing, transactions, and OLTP vs OLAP.',
    priority: 4,
    estimatedEffortHours: 35
  },
  {
    id: 9,
    stageId: 'stage-b',
    number: 9,
    name: 'Data Modeling',
    goal: 'Understand analytical dimensional modeling: Fact vs Dimension tables, Star schemas, and SCD Types 1 & 2.',
    priority: 5,
    estimatedEffortHours: 40
  },

  // Stage C: Analytics Engineering Specialization
  {
    id: 10,
    stageId: 'stage-c',
    number: 10,
    name: 'Data Warehouses',
    goal: 'Query and architect cloud data warehouses with columnar storage, partitioning, and cost optimization.',
    priority: 4,
    estimatedEffortHours: 30,
    toolChoice: {
      category: 'Cloud Warehouse',
      selected: 'BigQuery',
      options: ['BigQuery', 'Snowflake']
    }
  },
  {
    id: 11,
    stageId: 'stage-c',
    number: 11,
    name: 'dbt (Data Build Tool)',
    goal: 'Transform warehouse data using software engineering practices: modular models, refs, testing, and macros.',
    priority: 5,
    estimatedEffortHours: 50
  },
  {
    id: 12,
    stageId: 'stage-c',
    number: 12,
    name: 'Data Quality',
    goal: 'Enforce data contracts, validate freshness, completeness, test coverage, and alerting.',
    priority: 4,
    estimatedEffortHours: 25
  },
  {
    id: 13,
    stageId: 'stage-c',
    number: 13,
    name: 'Git & Software Engineering',
    goal: 'Apply professional developer workflows: branching, pull requests, code reviews, and README architecture.',
    priority: 4,
    estimatedEffortHours: 20
  },
  {
    id: 14,
    stageId: 'stage-c',
    number: 14,
    name: 'CI/CD for Analytics',
    goal: 'Automate model validation, pull-request slim-CI tests, and branch deployments for reliable analytics.',
    priority: 4,
    estimatedEffortHours: 25
  },
  {
    id: 15,
    stageId: 'stage-c',
    number: 15,
    name: 'Orchestration (Apache Airflow)',
    goal: 'Schedule, monitor, and manage resilient batch pipelines with DAGs, operators, retries, and task dependencies.',
    priority: 4,
    estimatedEffortHours: 40
  },

  // Stage D: Production Skills
  {
    id: 16,
    stageId: 'stage-d',
    number: 16,
    name: 'BI & Semantic Layer',
    goal: 'Connect warehouse marts to BI dashboards, creating a unified single source of truth for business metrics.',
    priority: 4,
    estimatedEffortHours: 30
  },
  {
    id: 17,
    stageId: 'stage-d',
    number: 17,
    name: 'Business Thinking',
    goal: 'Continuous practice: Translate complex business dilemmas into data requirements, models, metrics, and insights.',
    priority: 5,
    estimatedEffortHours: 50,
    isContinuous: true
  },
  {
    id: 18,
    stageId: 'stage-d',
    number: 18,
    name: 'Communication',
    goal: 'Continuous practice: Explain technical data architecture, model assumptions, and executive findings clearly.',
    priority: 4,
    estimatedEffortHours: 35,
    isContinuous: true
  },
  {
    id: 19,
    stageId: 'stage-d',
    number: 19,
    name: 'AI Tool Fluency',
    goal: 'Continuous practice: Leverage LLMs for SQL/Python acceleration while rigorously validating code, logic, and assumptions.',
    priority: 5,
    estimatedEffortHours: 30,
    isContinuous: true
  }
]

export const CANONICAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'E-commerce Sales Analysis',
    stage: 'Data Analyst Foundation Milestone Project',
    description: 'Analyze multi-channel e-commerce transactions, calculate unit economics, and build an interactive Power BI executive dashboard.',
    architecture: 'Dataset → Data Cleaning → SQL Analysis → KPI Calculation → Power BI Dashboard → Business Insights → GitHub Documentation',
    status: 'in-progress',
    skillsCovered: ['SQL', 'Power BI', 'Spreadsheets', 'Statistics', 'Business Analysis'],
    pipeline: [
      { id: 'p1-1', name: 'Raw Dataset', description: 'Acquire & inspect raw multi-table e-commerce data', status: 'completed' },
      { id: 'p1-2', name: 'Data Cleaning', description: 'Address anomalies, missing values, duplicates', status: 'completed' },
      { id: 'p1-3', name: 'SQL Analytics', description: 'Window functions, cohorts, and aggregate revenue queries', status: 'completed' },
      { id: 'p1-4', name: 'KPI Definition', description: 'AOV, CLV, Gross Margin, Repeat Rate modeling', status: 'completed' },
      { id: 'p1-5', name: 'Power BI Dashboard', description: 'Star schema, DAX measures, time-intelligence slicers', status: 'active' },
      { id: 'p1-6', name: 'Executive Insights', description: 'Written analysis & stakeholder recommendations', status: 'pending' },
      { id: 'p1-7', name: 'GitHub Repo', description: 'Structured README, SQL scripts, and pbix documentation', status: 'pending' }
    ],
    deliverables: [
      {
        id: 'd1-1',
        name: 'Realistic Dataset Ingestion & Validation',
        description: 'Source and validate transaction, customer, and product catalog data.',
        acceptanceCriteria: ['Multi-table relationship verified', 'No orphaned foreign keys', 'Documented data dictionary'],
        completed: true,
        status: 'validated'
      },
      {
        id: 'd1-2',
        name: 'Data Cleaning & Preprocessing Script',
        description: 'Filter test orders, resolve duplicate customer records, standardise date timestamps.',
        acceptanceCriteria: ['Documented cleaning rules', 'Zero null customer identifiers', 'Zero negative order totals'],
        completed: true,
        status: 'validated'
      },
      {
        id: 'd1-3',
        name: 'Comprehensive SQL Analysis Script',
        description: 'Perform cohort analysis, monthly recurring revenue, retention curves, and product basket mix.',
        acceptanceCriteria: ['Uses CTEs and window functions', 'Monthly growth metrics computed', 'Tested and verified against raw totals'],
        completed: true,
        status: 'validated'
      },
      {
        id: 'd1-4',
        name: 'Power BI Executive Dashboard',
        description: 'Star-schema visual model with interactive filters, drill-throughs, and DAX time intelligence.',
        acceptanceCriteria: ['Dedicated Date dimension table', 'At least 8 dynamic DAX measures', 'Clear visual hierarchy with drill-through'],
        completed: false,
        status: 'in-progress'
      },
      {
        id: 'd1-5',
        name: 'Business Findings & Stakeholder Deck',
        description: 'Document key drivers of churn and revenue concentration with strategic recommendations.',
        acceptanceCriteria: ['3 actionable business recommendations', 'Executive summary format', 'Quantified financial impact'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd1-6',
        name: 'Documented GitHub Repository',
        description: 'Public repository with clean folder structure, README with dashboard screenshots, and reproducible code.',
        acceptanceCriteria: ['Polished README.md', 'Embedded dashboard previews', 'Clear setup and execution instructions'],
        completed: false,
        status: 'pending'
      }
    ]
  },
  {
    id: 2,
    title: 'Python Data Pipeline',
    stage: 'Strong Data Analyst Milestone Project',
    description: 'Build an automated Python ETL pipeline fetching API records, transforming with Pandas, loading into PostgreSQL, and generating SQL analytics.',
    architecture: 'REST API → Python (Requests) → Pandas (Cleaning & Transformation) → PostgreSQL (Relational Warehouse) → SQL Reporting Queries',
    status: 'not-started',
    skillsCovered: ['Python', 'Pandas', 'APIs', 'PostgreSQL', 'Data Modeling', 'SQL'],
    pipeline: [
      { id: 'p2-1', name: 'REST API Extraction', description: 'Paginated extraction with authentication and retry logic', status: 'pending' },
      { id: 'p2-2', name: 'JSON Parsing', description: 'Flatten nested responses into structured records', status: 'pending' },
      { id: 'p2-3', name: 'Pandas Transformations', description: 'Type validation, deduplication, vector calculations', status: 'pending' },
      { id: 'p2-4', name: 'PostgreSQL Loading', description: 'Upsert into relational schema with constraints', status: 'pending' },
      { id: 'p2-5', name: 'Analytical SQL Views', description: 'Build aggregations and summary views directly in Postgres', status: 'pending' },
      { id: 'p2-6', name: 'Documentation & GitHub', description: 'Virtualenv requirements, configuration, and execution docs', status: 'pending' }
    ],
    deliverables: [
      {
        id: 'd2-1',
        name: 'API Extraction Module with Error Handling',
        description: 'Python script handling HTTP auth, rate limiting, and paginated response streams.',
        acceptanceCriteria: ['Status code validation (200 OK, 429 backoff)', 'JSON schema verification', 'Logging enabled'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd2-2',
        name: 'Pandas Cleaning and Reshaping Engine',
        description: 'Parse nested JSON structures, cast data types, handle missing coordinates or dates.',
        acceptanceCriteria: ['Vectorized operations (no slow row iterrows)', 'Validated data types', 'Deduplication by natural keys'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd2-3',
        name: 'PostgreSQL Relational Storage Schema',
        description: 'DDL scripts defining tables, primary/foreign keys, indices, and check constraints.',
        acceptanceCriteria: ['Proper primary and foreign keys', 'Index on query timestamp and entity IDs', 'Idempotent loading script'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd2-4',
        name: 'Automated Pipeline Orchestration Script',
        description: 'Single command execution pipeline logging row counts and execution metrics.',
        acceptanceCriteria: ['CLI argument support', 'Execution summary logged', 'requirements.txt included'],
        completed: false,
        status: 'pending'
      }
    ]
  },
  {
    id: 3,
    title: 'Modern Analytics Engineering Project',
    stage: 'Analytics Engineering Specialization Capstone',
    description: 'Design and deploy a modern warehouse analytics stack: staging, intermediate, and marts models using dbt with schema testing and docs.',
    architecture: 'Raw Data → Cloud Warehouse (BigQuery/Snowflake) → dbt Core → Staging → Intermediate → Marts → Tests & Docs → Power BI',
    status: 'not-started',
    skillsCovered: ['Data Warehouse', 'dbt', 'Data Modeling', 'Data Quality', 'Git', 'Power BI'],
    pipeline: [
      { id: 'p3-1', name: 'Raw Warehouse Load', description: 'Load raw events and dimensions into warehouse schema', status: 'pending' },
      { id: 'p3-2', name: 'dbt Staging Models', description: 'Clean, rename, and standardize source columns with sources.yml', status: 'pending' },
      { id: 'p3-3', name: 'Intermediate Business Logic', description: 'Sessionization, window computations, and join logic', status: 'pending' },
      { id: 'p3-4', name: 'Marts Dimensional Models', description: 'Fact and Dimension star schemas for business self-service', status: 'pending' },
      { id: 'p3-5', name: 'Automated dbt Tests', description: 'Unique, not_null, relationship, and accepted_values tests', status: 'pending' },
      { id: 'p3-6', name: 'dbt Docs & Lineage', description: 'Auto-generated data catalog with dependency DAG', status: 'pending' },
      { id: 'p3-7', name: 'BI Marts Connection', description: 'Point Power BI directly at pre-aggregated mart views', status: 'pending' }
    ],
    deliverables: [
      {
        id: 'd3-1',
        name: 'Warehouse Ingestion & Schemas',
        description: 'Set up warehouse dataset with partitioned raw tables and clustering keys.',
        acceptanceCriteria: ['Partitioned by date', 'Clustered by customer/entity ID', 'Documented storage costs'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd3-2',
        name: 'Modular dbt Project Architecture',
        description: 'Create standardized staging, intermediate, and marts layer using ref and source macros.',
        acceptanceCriteria: ['Strict layer separation', 'Ref functions used exclusively for downstream joins', 'DRY Jinja macros where applicable'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd3-3',
        name: 'Comprehensive Data Quality Test Suite',
        description: 'Implement generic and singular tests for primary keys, foreign integrity, and freshness.',
        acceptanceCriteria: ['100% of mart models have primary key tests', 'Custom singular test for business logic', 'Freshness threshold defined'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd3-4',
        name: 'Lineage Graph & Documented Data Catalog',
        description: 'Generate dbt documentation with model descriptions, column definitions, and lineage DAG.',
        acceptanceCriteria: ['All marts documented in schema.yml', 'DAG visual preview in README', 'Hosted or downloadable documentation preview'],
        completed: false,
        status: 'pending'
      }
    ]
  },
  {
    id: 4,
    title: 'End-to-End Analytics Platform',
    stage: 'Final Analytics Engineer Capstone',
    description: 'Production-grade enterprise platform orchestrating API extraction, warehouse ELT via dbt, Airflow scheduling, CI/CD testing, and semantic metrics.',
    architecture: 'API → Python Extractor → Cloud Warehouse → dbt Transforms → Data Quality Tests → Airflow DAGs → CI/CD Pull Request Validation → Power BI Semantic Layer',
    status: 'not-started',
    skillsCovered: ['Python', 'Data Warehouse', 'dbt', 'Airflow', 'CI/CD', 'Git', 'Data Quality', 'Semantic Layer', 'Communication'],
    pipeline: [
      { id: 'p4-1', name: 'Modular Extractor', description: 'Containerized Python script extracting batch payloads', status: 'pending' },
      { id: 'p4-2', name: 'ELT Pipeline', description: 'Load raw stage into Cloud Warehouse', status: 'pending' },
      { id: 'p4-3', name: 'dbt Transformations', description: 'Full staging → intermediate → marts dimensional layer', status: 'pending' },
      { id: 'p4-4', name: 'Quality & Contracts', description: 'dbt tests + Great Expectations validation checks', status: 'pending' },
      { id: 'p4-5', name: 'Airflow Orchestration', description: 'Production DAG with task dependencies, retries, and failure alerts', status: 'pending' },
      { id: 'p4-6', name: 'CI/CD Automation', description: 'GitHub Actions running dbt build on pull requests', status: 'pending' },
      { id: 'p4-7', name: 'Semantic BI Layer', description: 'Governed metrics layer connected to executive dashboard', status: 'pending' },
      { id: 'p4-8', name: 'Architecture Review Deck', description: 'System diagrams, tradeoff analyses, and runbooks', status: 'pending' }
    ],
    deliverables: [
      {
        id: 'd4-1',
        name: 'Production Airflow DAG Implementation',
        description: 'Orchestrate extraction, warehouse loading, dbt run, dbt test, and notification triggers.',
        acceptanceCriteria: ['Task retry policies configured', 'Slack or email alerting on failure', 'Clean DAG code structure'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd4-2',
        name: 'GitHub Actions CI/CD Pipeline',
        description: 'Automated PR workflow compiling dbt, executing tests against temporary staging environment.',
        acceptanceCriteria: ['Linting with SQLFluff', 'Slim-CI dbt build against modified models', 'Blocked merge on test failure'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd4-3',
        name: 'Production Semantic Metric Layer',
        description: 'Standardized metric definitions consumable by business reporting tools.',
        acceptanceCriteria: ['Single source of truth for revenue and retention', 'Documented business logic', 'Consumer dashboard integrated'],
        completed: false,
        status: 'pending'
      },
      {
        id: 'd4-4',
        name: 'Enterprise Portfolio Repository & Runbook',
        description: 'Portfolio repository containing system architecture diagrams, disaster recovery steps, and technical explanations.',
        acceptanceCriteria: ['Architectural flow diagram in README', 'Detailed setup runbook', 'Discussion of engineering tradeoffs'],
        completed: false,
        status: 'pending'
      }
    ]
  }
]

export const CANONICAL_SKILLS: Skill[] = [
  { id: 'sql', name: 'SQL', category: 'Foundation', learningScore: 90, practiceScore: 85, evidenceCount: 4, confidence: 4, status: 'Competent', associatedTopics: ['t-1-1', 't-1-2', 't-1-5', 't-1-8', 't-1-10'] },
  { id: 'excel', name: 'Spreadsheets (Excel/Sheets)', category: 'Foundation', learningScore: 85, practiceScore: 80, evidenceCount: 2, confidence: 4, status: 'Competent', associatedTopics: ['t-2-1', 't-2-7', 't-2-12'] },
  { id: 'stats', name: 'Statistics & Probability', category: 'Foundation', learningScore: 75, practiceScore: 65, evidenceCount: 1, confidence: 3, status: 'Learning', associatedTopics: ['t-3-1', 't-3-8', 't-3-10'] },
  { id: 'powerbi', name: 'Power BI & DAX', category: 'Foundation', learningScore: 70, practiceScore: 60, evidenceCount: 2, confidence: 3, status: 'Learning', associatedTopics: ['t-4-5', 't-4-7', 't-4-10'] },
  { id: 'python', name: 'Python Programming', category: 'Programming', learningScore: 40, practiceScore: 30, evidenceCount: 0, confidence: 2, status: 'Novice', associatedTopics: ['t-5-1', 't-5-5', 't-5-8'] },
  { id: 'pandas', name: 'Pandas Data Wrangling', category: 'Programming', learningScore: 35, practiceScore: 25, evidenceCount: 0, confidence: 2, status: 'Novice', associatedTopics: ['t-6-1', 't-6-4', 't-6-12'] },
  { id: 'apis', name: 'APIs & JSON', category: 'Programming', learningScore: 30, practiceScore: 20, evidenceCount: 0, confidence: 2, status: 'Novice', associatedTopics: ['t-7-1', 't-7-5', 't-7-8'] },
  { id: 'postgres', name: 'PostgreSQL Relational DB', category: 'Engineering', learningScore: 25, practiceScore: 20, evidenceCount: 0, confidence: 2, status: 'Novice', associatedTopics: ['t-8-1', 't-8-6', 't-8-9'] },
  { id: 'modeling', name: 'Dimensional Data Modeling', category: 'Engineering', learningScore: 30, practiceScore: 15, evidenceCount: 0, confidence: 2, status: 'Novice', associatedTopics: ['t-9-1', 't-9-6', 't-9-13'] },
  { id: 'warehouse', name: 'Cloud Data Warehouse (BigQuery/Snowflake)', category: 'Engineering', learningScore: 15, practiceScore: 10, evidenceCount: 0, confidence: 1, status: 'Novice', associatedTopics: ['t-10-1', 't-10-5', 't-10-9'] },
  { id: 'dbt', name: 'dbt Core & Modeling', category: 'Engineering', learningScore: 10, practiceScore: 0, evidenceCount: 0, confidence: 1, status: 'Novice', associatedTopics: ['t-11-1', 't-11-6', 't-11-12'] },
  { id: 'quality', name: 'Data Quality & Testing', category: 'Engineering', learningScore: 10, practiceScore: 0, evidenceCount: 0, confidence: 1, status: 'Novice', associatedTopics: ['t-12-1', 't-12-5', 't-12-10'] },
  { id: 'git', name: 'Git & GitHub Collaboration', category: 'Engineering', learningScore: 40, practiceScore: 35, evidenceCount: 1, confidence: 3, status: 'Novice', associatedTopics: ['t-13-1', 't-13-4', 't-13-8'] },
  { id: 'cicd', name: 'CI/CD Analytics Automation', category: 'Engineering', learningScore: 0, practiceScore: 0, evidenceCount: 0, confidence: 1, status: 'Novice', associatedTopics: ['t-14-1', 't-14-4'] },
  { id: 'airflow', name: 'Apache Airflow Orchestration', category: 'Engineering', learningScore: 0, practiceScore: 0, evidenceCount: 0, confidence: 1, status: 'Novice', associatedTopics: ['t-15-1', 't-15-4', 't-15-8'] },
  { id: 'semantic', name: 'Semantic Layer & BI Governance', category: 'Production', learningScore: 15, practiceScore: 0, evidenceCount: 0, confidence: 1, status: 'Novice', associatedTopics: ['t-16-1', 't-16-4'] },
  { id: 'business', name: 'Business Thinking & Analysis', category: 'Production', learningScore: 65, practiceScore: 60, evidenceCount: 2, confidence: 3, status: 'Learning', associatedTopics: ['t-17-1', 't-17-2'] },
  { id: 'communication', name: 'Technical Communication & Storytelling', category: 'Production', learningScore: 60, practiceScore: 55, evidenceCount: 1, confidence: 3, status: 'Learning', associatedTopics: ['t-18-1', 't-18-3'] },
  { id: 'ai-fluency', name: 'AI Tool Fluency & Code Verification', category: 'Production', learningScore: 75, practiceScore: 70, evidenceCount: 3, confidence: 4, status: 'Competent', associatedTopics: ['t-19-1', 't-19-2'] },
  { id: 'documentation', name: 'Architecture Documentation & READMEs', category: 'Production', learningScore: 50, practiceScore: 45, evidenceCount: 1, confidence: 3, status: 'Novice', associatedTopics: ['t-13-8', 't-11-16'] }
]

export function generateSeedTopics(): Record<string, Topic> {
  const topics: Record<string, Topic> = {}

  const addTopic = (
    id: string,
    phaseId: number,
    name: string,
    goal: string,
    order: number,
    priority: 1 | 2 | 3 | 4 | 5,
    status: Topic['status'],
    breakdown: Topic['competencyBreakdown'],
    checklistOverrides?: Partial<Topic['checklist']>,
    evidence?: Topic['evidence'],
    notes?: string,
    dependencies?: string[]
  ) => {
    topics[id] = {
      id,
      phaseId,
      name,
      goal,
      order,
      required: true,
      priority,
      status,
      competencyBreakdown: breakdown,
      checklist: {
        understandConcept: checklistOverrides?.understandConcept ?? (status !== 'not-started'),
        followExample: checklistOverrides?.followExample ?? (status !== 'not-started'),
        completeExercise: checklistOverrides?.completeExercise ?? (status === 'practicing' || status === 'demonstrated' || status === 'validated' || status === 'mastered'),
        buildImplementation: checklistOverrides?.buildImplementation ?? (status === 'demonstrated' || status === 'validated' || status === 'mastered'),
        explainWithoutReference: checklistOverrides?.explainWithoutReference ?? (status === 'validated' || status === 'mastered'),
        validateResult: checklistOverrides?.validateResult ?? (status === 'validated' || status === 'mastered')
      },
      evidence: evidence || [],
      notes: notes || '',
      reviewCount: status === 'mastered' ? 4 : status === 'validated' ? 2 : 0,
      needsReview: false,
      dependencies
    }
  }

  // Phase 1: SQL Foundations (Priority 5/5)
  addTopic('t-1-1', 1, 'SQL Basics & Filtering', 'Select, Where, Comparison & Logical Operators', 1, 5, 'mastered', { learning: 100, practice: 100, assessment: 100, realWorld: 100, confidence: 95 }, {}, [{ id: 'e-1', title: 'SQL LeetCode Solutions', type: 'github', url: 'https://github.com/analyst/sql-practice', dateAdded: '2026-08-15', verified: true }])
  addTopic('t-1-2', 1, 'Aggregations & Grouping', 'COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING', 2, 5, 'mastered', { learning: 100, practice: 100, assessment: 90, realWorld: 95, confidence: 90 })
  addTopic('t-1-3', 1, 'CASE WHEN & Conditional Aggregation', 'Custom bucketing, pivot counts, conditional flags', 3, 5, 'validated', { learning: 100, practice: 90, assessment: 85, realWorld: 90, confidence: 85 })
  addTopic('t-1-4', 1, 'Joins & Relational Integrity', 'INNER, LEFT, RIGHT, FULL, CROSS joins and duplicate pitfalls', 4, 5, 'validated', { learning: 100, practice: 95, assessment: 90, realWorld: 85, confidence: 90 })
  addTopic('t-1-5', 1, 'Duplicate Detection & Resolution', 'Identify duplicate records using COUNT(*) and ROW_NUMBER()', 5, 4, 'validated', { learning: 90, practice: 90, assessment: 80, realWorld: 85, confidence: 85 })
  addTopic('t-1-6', 1, 'Subqueries & Derived Tables', 'Scalar, correlated, and inline table subqueries', 6, 4, 'validated', { learning: 85, practice: 80, assessment: 80, realWorld: 75, confidence: 80 })
  addTopic('t-1-7', 1, 'Common Table Expressions (CTEs)', 'Modular query structuring with readable WITH clauses', 7, 5, 'validated', { learning: 100, practice: 90, assessment: 90, realWorld: 90, confidence: 90 })
  addTopic('t-1-8', 1, 'UNION & UNION ALL', 'Set operations, schema alignment, deduplication overhead', 8, 3, 'validated', { learning: 90, practice: 85, assessment: 85, realWorld: 80, confidence: 85 })
  addTopic('t-1-9', 1, 'Window Functions', 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, running totals over partitions', 9, 5, 'practicing', { learning: 90, practice: 70, assessment: 60, realWorld: 65, confidence: 70 }, {}, [], 'LAG vs LEAD partition orders need review for interview readiness.')
  addTopic('t-1-10', 1, 'Business-Oriented SQL Problems', 'Solve real cohort retention, rolling average, and churn queries', 10, 5, 'practicing', { learning: 80, practice: 65, assessment: 60, realWorld: 60, confidence: 65 })

  // Phase 2: Spreadsheets
  addTopic('t-2-1', 2, 'Sorting, Filtering & Tables', 'Structured Excel tables, freeze panes, multi-level sorting', 1, 3, 'mastered', { learning: 100, practice: 100, assessment: 100, realWorld: 100, confidence: 95 })
  addTopic('t-2-2', 2, 'Basic & Logical Formulas', 'IF, AND, OR, SUMIFS, COUNTIFS, nested conditionals', 2, 4, 'mastered', { learning: 100, practice: 95, assessment: 95, realWorld: 90, confidence: 90 })
  addTopic('t-2-3', 2, 'Lookup Functions (XLOOKUP, INDEX/MATCH)', 'Modern dynamic lookups vs legacy VLOOKUP limitations', 3, 5, 'validated', { learning: 100, practice: 90, assessment: 90, realWorld: 85, confidence: 90 })
  addTopic('t-2-4', 2, 'Text & Date Cleaning', 'LEFT, RIGHT, MID, TRIM, TEXT, DATEVALUE, standardizing dirty feeds', 4, 3, 'validated', { learning: 90, practice: 85, assessment: 80, realWorld: 85, confidence: 85 })
  addTopic('t-2-5', 2, 'Pivot Tables & Dynamic Aggregations', 'Multi-dimensional slicing, calculated fields, group by dates', 5, 5, 'validated', { learning: 95, practice: 90, assessment: 90, realWorld: 90, confidence: 90 })
  addTopic('t-2-6', 2, 'Visual Charts & Conditional Formatting', 'Heatmaps, waterfall charts, formatting rules for KPI alerting', 6, 3, 'validated', { learning: 90, practice: 85, assessment: 85, realWorld: 85, confidence: 85 })

  // Phase 3: Statistics
  addTopic('t-3-1', 3, 'Descriptive Statistics & Distributions', 'Mean, median, mode, variance, standard deviation, skewness', 1, 4, 'validated', { learning: 95, practice: 85, assessment: 85, realWorld: 80, confidence: 85 })
  addTopic('t-3-2', 3, 'Outliers & Percentiles', 'IQR, Z-score, trimming vs capping outlier values', 2, 4, 'validated', { learning: 90, practice: 80, assessment: 80, realWorld: 75, confidence: 80 })
  addTopic('t-3-3', 3, 'Probability & Sampling', 'Sample distributions, Central Limit Theorem, representative sampling', 3, 4, 'learning', { learning: 80, practice: 50, assessment: 40, realWorld: 30, confidence: 50 })
  addTopic('t-3-4', 3, 'Hypothesis Testing & Confidence Intervals', 'Null hypothesis, p-values, t-test, Type I & Type II errors', 4, 5, 'learning', { learning: 75, practice: 40, assessment: 40, realWorld: 30, confidence: 45 }, {}, [], 'Review hypothesis testing — retention due today!')
  addTopic('t-3-5', 3, 'Correlation vs Causation & Confounding', 'Identify spurious correlations, Simpson paradox, selection bias', 5, 5, 'validated', { learning: 90, practice: 85, assessment: 85, realWorld: 80, confidence: 85 })

  // Phase 4: Power BI (Priority 4/5)
  addTopic('t-4-1', 4, 'Data Ingestion & Power Query ETL', 'Import CSV/Excel/DB, apply transformations, M language basics', 1, 4, 'validated', { learning: 90, practice: 85, assessment: 80, realWorld: 80, confidence: 85 })
  addTopic('t-4-2', 4, 'Data Relationships & Star Schemas', '1-to-many, bidirectional filter cautions, bridge tables', 2, 5, 'validated', { learning: 95, practice: 85, assessment: 85, realWorld: 85, confidence: 85 })
  addTopic('t-4-3', 4, 'DAX Measures & Calculated Columns', 'Row context vs filter context, CALCULATE, SUMX, FILTER', 3, 5, 'practicing', { learning: 85, practice: 70, assessment: 60, realWorld: 65, confidence: 65 })
  addTopic('t-4-4', 4, 'Date Tables & Time Intelligence', 'Dedicated calendar table, YTD, YoY, rolling 30-day measures', 4, 5, 'practicing', { learning: 80, practice: 65, assessment: 60, realWorld: 60, confidence: 60 })
  addTopic('t-4-5', 4, 'Visualizations, Filters & Slicers', 'Card KPIs, decomposition trees, matrix tables, cross-filtering', 5, 4, 'validated', { learning: 90, practice: 80, assessment: 80, realWorld: 75, confidence: 80 })
  addTopic('t-4-6', 4, 'Drill-Through, Trends & Actionable Insights', 'Context drill-through pages, tooltip reports, anomaly detection', 6, 4, 'practicing', { learning: 75, practice: 60, assessment: 50, realWorld: 55, confidence: 60 })

  // Phase 5: Python
  addTopic('t-5-1', 5, 'Python Basics & Data Structures', 'Variables, primitives, lists, dictionaries, tuples, sets', 1, 4, 'learning', { learning: 60, practice: 40, assessment: 30, realWorld: 20, confidence: 40 })
  addTopic('t-5-2', 5, 'Control Flow & Functions', 'if/elif/else, for/while loops, list comprehensions, def args/kwargs', 2, 4, 'learning', { learning: 55, practice: 35, assessment: 30, realWorld: 20, confidence: 35 })
  addTopic('t-5-3', 5, 'File Handling & Environments', 'open(), CSV reading, virtual environments (venv), pip, requirements.txt', 3, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 6: Pandas (Priority 5/5)
  addTopic('t-6-1', 6, 'DataFrames, Reading & Inspection', 'pd.read_csv, head, info, describe, dtypes, memory usage', 1, 5, 'not-started', { learning: 20, practice: 10, assessment: 0, realWorld: 0, confidence: 15 })
  addTopic('t-6-2', 6, 'Cleaning, Missing Values & Duplicates', 'dropna, fillna, duplicated, drop_duplicates, astype', 2, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-6-3', 6, 'Indexing with loc & iloc', 'Label-based vs position-based slicing and conditional masks', 3, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-6-4', 6, 'Apply, Map, Lambdas & Vectorization', 'Element-wise transformations vs vector operations', 4, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-6-5', 6, 'Groupby, Aggregation & Reshaping', 'groupby, agg, merge, join, concat, pivot_table, melt', 5, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 7: APIs and JSON
  addTopic('t-7-1', 7, 'HTTP Protocols & REST API Architecture', 'GET/POST, headers, query params, status codes (200, 401, 429)', 1, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-7-2', 7, 'Parsing Nested JSON into DataFrames', 'json.loads, pd.json_normalize, handling nested arrays', 2, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-7-3', 7, 'Authentication & Python Requests', 'API keys, bearer tokens, request pagination & backoff', 3, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 8: Databases (PostgreSQL)
  addTopic('t-8-1', 8, 'PostgreSQL Schema & Constraints', 'CREATE TABLE, PRIMARY KEY, FOREIGN KEY, CHECK, NOT NULL, UNIQUE', 1, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-8-2', 8, 'Indexes & Query Optimization', 'B-tree, composite indexes, EXPLAIN ANALYZE execution plans', 2, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-8-3', 8, 'Transactions, ACID & Normalization', 'BEGIN, COMMIT, ROLLBACK, 1NF to 3NF, OLTP vs OLAP workloads', 3, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 9: Data Modeling (Priority 5/5)
  addTopic('t-9-1', 9, 'Fact & Dimension Tables', 'Events vs context, grain determination, additive vs non-additive facts', 1, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-9-2', 9, 'Star vs Snowflake Schemas', 'Dimensional design tradeoffs, denormalization for query velocity', 2, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-9-3', 9, 'Surrogate Keys vs Natural Keys', 'Surrogate generation, handling upstream natural key collisions', 3, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-9-4', 9, 'Slowly Changing Dimensions (SCD Type 1 & 2)', 'Track historical attribute transitions with valid_from/valid_to dates', 4, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 10: Data Warehouses
  addTopic('t-10-1', 10, 'Cloud Warehouse Architecture', 'Columnar storage, MPP execution, BigQuery / Snowflake engines', 1, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-10-2', 10, 'Partitioning & Clustering', 'Date partitioning, clustering keys, query slot/credit minimization', 2, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-10-3', 10, 'Warehouse Loading & Cost Optimization', 'Batch loading, external tables, storage tiers, query cache', 3, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 11: dbt (Priority 5/5)
  addTopic('t-11-1', 11, 'dbt Project Setup & Warehouse Connection', 'dbt_project.yml, profiles.yml, virtual environments, warehouse auth', 1, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-11-2', 11, 'Modular Layering (Staging, Int, Marts)', 'Staging cleanup, intermediate business logic, final dim & fct marts', 2, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-11-3', 11, 'dbt Testing & Schema Validation', 'not_null, unique, relationships, accepted_values, singular SQL tests', 3, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-11-4', 11, 'Jinja Macros & Dry SQL', 'Custom macros, surrogate_key helpers, cross-database adapters', 4, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-11-5', 11, 'Incremental Models & Snapshots', 'is_incremental() logic, watermark timestamps, snapshot SCD2', 5, 5, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-11-6', 11, 'dbt Docs & Automated Lineage DAG', 'Generating documentation catalogs and visual dependencies graph', 6, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 12: Data Quality
  addTopic('t-12-1', 12, 'Data Quality Dimensions & SLA Checks', 'Completeness, accuracy, consistency, uniqueness, freshness, validity', 1, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-12-2', 12, 'Pipeline Alerting & Great Expectations', 'Failure thresholds, silent bug detection, incident response runbooks', 2, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 13: Git & SWE
  addTopic('t-13-1', 13, 'Git Branching, PRs & Code Review', 'Feature branches, meaningful commits, conflict resolution, GitHub reviews', 1, 4, 'practicing', { learning: 75, practice: 65, assessment: 60, realWorld: 55, confidence: 60 })
  addTopic('t-13-2', 13, 'Architecture Documentation & Clean Code', 'README standards, system diagrams, reproducible environment configs', 2, 4, 'practicing', { learning: 70, practice: 60, assessment: 50, realWorld: 50, confidence: 55 })

  // Phase 14: CI/CD
  addTopic('t-14-1', 14, 'Automated Analytics Pull-Request Testing', 'GitHub Actions workflow, dbt compile, SQL linting with SQLFluff', 1, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-14-2', 14, 'Slim CI & Automated Deployment', 'Testing state-modified models only, zero-downtime blue/green schema swaps', 2, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 15: Orchestration (Airflow)
  addTopic('t-15-1', 15, 'Airflow DAG Architecture & Operators', 'DAG schedule_interval, BashOperator, PythonOperator, task flows', 1, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-15-2', 15, 'Retries, Task Dependencies & Failure Hooks', 'Upstream/downstream dependencies, exponential backoff, Slack alerting', 2, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Stage D: Production Skills
  // Phase 16: BI & Semantic Layer
  addTopic('t-16-1', 16, 'Semantic Layers & Governed Metrics', 'Metric definition standards, single source of truth across tools', 1, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })
  addTopic('t-16-2', 16, 'Connecting Warehouse Marts to Power BI', 'DirectQuery vs Import mode, composite models, star schema consumption', 2, 4, 'not-started', { learning: 0, practice: 0, assessment: 0, realWorld: 0, confidence: 0 })

  // Phase 17: Business Thinking (Continuous)
  addTopic('t-17-1', 17, 'Translating Business Questions to Metrics', 'Root-cause analysis, revenue levers, cohort behavior modeling', 1, 5, 'practicing', { learning: 70, practice: 65, assessment: 60, realWorld: 60, confidence: 65 })
  addTopic('t-17-2', 17, 'Executive Insights & ROI Impact', 'Executive summaries, trade-off analysis, actionable business proposals', 2, 5, 'practicing', { learning: 70, practice: 60, assessment: 55, realWorld: 60, confidence: 60 })

  // Phase 18: Communication (Continuous)
  addTopic('t-18-1', 18, 'Explaining Architecture & Limitations', 'Articulate technical debt, data lineage, edge case caveats to non-tech leaders', 1, 4, 'practicing', { learning: 65, practice: 60, assessment: 55, realWorld: 55, confidence: 60 })
  addTopic('t-18-2', 18, 'Technical Storytelling for Stakeholders', 'Data presentation rhythm, chart hygiene, conversational insights delivery', 2, 4, 'practicing', { learning: 65, practice: 55, assessment: 50, realWorld: 55, confidence: 60 })

  // Phase 19: AI Tool Fluency (Continuous & Verification)
  addTopic('t-19-1', 19, 'AI-Assisted Query & Pipeline Generation', 'Effective prompting for SQL optimization, regex, and Python pipelines', 1, 5, 'validated', { learning: 85, practice: 80, assessment: 80, realWorld: 80, confidence: 85 })
  addTopic('t-19-2', 19, 'Rigor: Code & Assumption Verification', 'Systematic verification of AI outputs: edge cases, joins, aggregations, precision', 2, 5, 'validated', { learning: 90, practice: 85, assessment: 85, realWorld: 80, confidence: 85 })

  return topics
}

export const CANONICAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Data Analyst, Growth & Monetization',
    location: 'Remote / US',
    stage: 'interview',
    dateApplied: '2026-08-28',
    resumeVersion: 'v2.4-Analyst-Core',
    matchedSkills: ['SQL', 'Power BI', 'Spreadsheets', 'Statistics'],
    missingSkills: ['Python ETL', 'dbt'],
    notes: 'Technical screen passed. Round 2 case study on conversion drop scheduled for Sep 12.',
    followUpDate: '2026-09-12'
  },
  {
    id: 'app-2',
    company: 'Monzo',
    role: 'Product Data Analyst',
    location: 'Remote / UK',
    stage: 'assessment',
    dateApplied: '2026-09-02',
    resumeVersion: 'v2.4-Analyst-Core',
    matchedSkills: ['SQL', 'Product Analytics', 'Spreadsheets'],
    missingSkills: ['dbt', 'BigQuery'],
    notes: 'Take-home SQL test received. Due in 4 days.',
    followUpDate: '2026-09-14'
  },
  {
    id: 'app-3',
    company: 'Shopify',
    role: 'Associate Analytics Engineer',
    location: 'Remote',
    stage: 'applied',
    dateApplied: '2026-09-06',
    resumeVersion: 'v2.5-AnalyticsEngineer-Targeted',
    matchedSkills: ['SQL', 'Data Modeling', 'Git'],
    missingSkills: ['dbt Core', 'Airflow', 'Snowflake'],
    notes: 'Applied via employee referral.'
  }
]

export const CANONICAL_INTERVIEW_GAPS: InterviewSkillGap[] = [
  {
    id: 'gap-1',
    applicationId: 'app-1',
    companyName: 'Stripe',
    skill: 'SQL Window Functions',
    problemEncountered: 'Struggled to explain the exact partitioning difference between LAG and LEAD with running window bounds.',
    severity: 'high',
    actionPlan: 'Review window functions in Phase 1 and complete 3 business-oriented partition exercises.',
    linkedTopicId: 't-1-9',
    resolved: false,
    createdAt: '2026-09-03'
  }
]

export const CANONICAL_CONTINUOUS_LOGS: ContinuousPracticeLog[] = [
  {
    id: 'clog-1',
    type: 'business-thinking',
    title: 'Subscription Churn Cohort Breakdown',
    date: '2026-09-01',
    businessQuestion: 'Why did 90-day subscription retention drop by 4.2% in Q2?',
    dataRequirement: 'Customer billing history joined with onboarding activity flags and support ticket volume.',
    modelArchitecture: 'dim_customer → fct_subscription_events → fct_support_tickets',
    sqlQueryOrMetric: 'Retention Rate % at Day 30, Day 60, Day 90 grouped by acquisition marketing channel.',
    insightDerived: 'Q2 paid marketing campaign attracted lower-intent discount users with 2x higher cancellation within first 30 days.',
    learnings: 'Always segment retention by customer acquisition source before asserting product flaw.'
  },
  {
    id: 'clog-2',
    type: 'ai-verification',
    title: 'LLM SQL Window Query Cross-Validation',
    date: '2026-09-05',
    aiToolUsed: 'Claude 3.5 Sonnet',
    promptOrTask: 'Generate a SQL query calculating rolling 7-day active customers.',
    verificationChecks: 'Identified that generated query used unbounded preceding without proper date gap handling, causing skewed numbers on inactive days.',
    learnings: 'LLM queries must always be tested against datasets with missing date rows.'
  }
]

export function getInitialState(): AppState {
  return {
    user: {
      theme: 'dark',
      careerTarget: 'Both',
      weeklyHoursCapacity: 12,
      currentStage: 'stage-a'
    },
    phases: CANONICAL_PHASES,
    topics: generateSeedTopics(),
    projects: CANONICAL_PROJECTS,
    skills: CANONICAL_SKILLS,
    applications: CANONICAL_APPLICATIONS,
    interviewGaps: CANONICAL_INTERVIEW_GAPS,
    continuousLogs: CANONICAL_CONTINUOUS_LOGS,
    studyLogs: [
      {
        id: 'slog-1',
        topicId: 't-1-9',
        topicName: 'Window Functions',
        date: '2026-09-08',
        durationMinutes: 45,
        notes: 'Practiced ROW_NUMBER and running sum with OVER (PARTITION BY customer_id ORDER BY order_date).',
        confidenceRating: 4,
        nextReviewDate: '2026-09-15'
      }
    ],
    currentStudySession: {
      isActive: false,
      elapsedSeconds: 0
    }
  }
}
