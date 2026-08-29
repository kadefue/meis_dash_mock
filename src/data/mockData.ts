import type { 
  Framework, 
  Project, 
  Department, 
  IndicatorMetadata, 
  TheoryOfChangeNode, 
  ManagementAlert 
} from '../types/dashboard';

export const mockFrameworks: Framework[] = [
  {
    id: 'esdp',
    code: 'ESDP-V',
    name: 'ESDP',
    fullName: 'Education Sector Development Plan (2025/26–2029/30)',
    period: '2025/26–2029/30',
    description: 'The national umbrella education roadmap focused on equitable access, learning quality, STEM digital transformation, and governance.',
    overallScore: 82.4,
    status: 'GREEN',
    onTargetCount: 22,
    atRiskCount: 6,
    underperformingCount: 4,
    noDataCount: 1,
    totalIndicators: 33,
    trend: 'Up',
    keyObjectivesCount: 5,
    strategiesCount: 18
  },
  {
    id: 'sp',
    code: 'SP-2030',
    name: 'Strategic Plan',
    fullName: 'MoEST Strategic Plan (2025/26–2029/30)',
    period: '2025/26–2029/30',
    description: 'Internal Ministry institutional strategic plan driving Ministerial directorates, budget execution, and operational targets.',
    overallScore: 76.8,
    status: 'YELLOW',
    onTargetCount: 18,
    atRiskCount: 8,
    underperformingCount: 5,
    noDataCount: 2,
    totalIndicators: 33,
    trend: 'Stable',
    keyObjectivesCount: 6,
    strategiesCount: 24
  },
  {
    id: 'sdg',
    code: 'SDG-4',
    name: 'SDGs (SDG 4)',
    fullName: 'UN Sustainable Development Goal 4: Quality Education',
    period: '2030 Horizon',
    description: 'Global benchmark ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all.',
    overallScore: 79.1,
    status: 'YELLOW',
    onTargetCount: 16,
    atRiskCount: 6,
    underperformingCount: 3,
    noDataCount: 1,
    totalIndicators: 26,
    trend: 'Up',
    keyObjectivesCount: 7,
    strategiesCount: 14
  },
  {
    id: 'ccm',
    code: 'CCM-MANIFESTO',
    name: 'CCM Manifesto',
    fullName: 'CCM Election Manifesto Education Commitments (2020–2025/2030)',
    period: '2020–2030',
    description: 'Ruling party high-level political commitments including Fee-Free Education expansion, VETA in every district, and university infrastructure.',
    overallScore: 84.5,
    status: 'GREEN',
    onTargetCount: 19,
    atRiskCount: 4,
    underperformingCount: 2,
    noDataCount: 0,
    totalIndicators: 25,
    trend: 'Up',
    keyObjectivesCount: 4,
    strategiesCount: 12
  }
];

export const mockProjects: Project[] = [
  {
    id: 'sequip',
    code: 'SEQUIP',
    name: 'SEQUIP',
    fullName: 'Secondary Education Quality Improvement Project',
    funder: 'World Bank (IDA)',
    budgetUSD: 535000000,
    disbursedUSD: 412000000,
    expenditureUSD: 388500000,
    overallPerformance: 85.2,
    physicalProgress: 82.0,
    financialProgress: 72.6,
    milestoneAchievement: 88.0,
    resultsAchievement: 84.5,
    riskLevel: 'Low',
    status: 'GREEN',
    delayedActivitiesCount: 2,
    totalIndicators: 18,
    completionPercentage: 78.5,
    leadDepartmentId: 'dse',
    leadDepartmentName: 'Directorate of Secondary Education',
    startDate: '2020-06-01',
    endDate: '2026-12-31',
    components: [
      {
        id: 'sequip-c1',
        name: 'Component 1: Expanding Access & Girls Education',
        budgetUSD: 240000000,
        expenditureUSD: 198000000,
        physicalProgress: 86.5,
        status: 'GREEN',
        subcomponentsCount: 3
      },
      {
        id: 'sequip-c2',
        name: 'Component 2: Quality Teaching and Learning Infrastructure',
        budgetUSD: 210000000,
        expenditureUSD: 145000000,
        physicalProgress: 78.0,
        status: 'YELLOW',
        subcomponentsCount: 4
      },
      {
        id: 'sequip-c3',
        name: 'Component 3: Management, M&E and Institutional Capacity',
        budgetUSD: 85000000,
        expenditureUSD: 45500000,
        physicalProgress: 81.2,
        status: 'GREEN',
        subcomponentsCount: 2
      }
    ]
  },
  {
    id: 'heet',
    code: 'HEET',
    name: 'HEET Project',
    fullName: 'Higher Education for Economic Transformation Project',
    funder: 'World Bank (IDA)',
    budgetUSD: 425000000,
    disbursedUSD: 285000000,
    expenditureUSD: 240000000,
    overallPerformance: 74.8,
    physicalProgress: 68.4,
    financialProgress: 56.4,
    milestoneAchievement: 72.0,
    resultsAchievement: 76.2,
    riskLevel: 'Medium',
    status: 'YELLOW',
    delayedActivitiesCount: 5,
    totalIndicators: 15,
    completionPercentage: 62.0,
    leadDepartmentId: 'dhe',
    leadDepartmentName: 'Directorate of Higher Education',
    startDate: '2021-05-15',
    endDate: '2026-07-31',
    components: [
      {
        id: 'heet-c1',
        name: 'Component 1: Strengthening Capacity of Priority Public Universities',
        budgetUSD: 330000000,
        expenditureUSD: 185000000,
        physicalProgress: 65.0,
        status: 'YELLOW',
        subcomponentsCount: 4
      },
      {
        id: 'heet-c2',
        name: 'Component 2: University-Industry Linkages & Innovation Hubs',
        budgetUSD: 65000000,
        expenditureUSD: 40000000,
        physicalProgress: 72.5,
        status: 'GREEN',
        subcomponentsCount: 2
      },
      {
        id: 'heet-c3',
        name: 'Component 3: Higher Education System Governance & M&E',
        budgetUSD: 30000000,
        expenditureUSD: 15000000,
        physicalProgress: 84.0,
        status: 'GREEN',
        subcomponentsCount: 2
      }
    ]
  },
  {
    id: 'ep4r',
    code: 'EP4R',
    name: 'EP4R Program',
    fullName: 'Education Program for Results (PO-RALG & MoEST Joint Program)',
    funder: 'FCDO, Sida, KOICA, GPE',
    budgetUSD: 290000000,
    disbursedUSD: 240000000,
    expenditureUSD: 232000000,
    overallPerformance: 88.6,
    physicalProgress: 89.2,
    financialProgress: 80.0,
    milestoneAchievement: 91.5,
    resultsAchievement: 87.8,
    riskLevel: 'Low',
    status: 'GREEN',
    delayedActivitiesCount: 1,
    totalIndicators: 12,
    completionPercentage: 84.0,
    leadDepartmentId: 'dbe',
    leadDepartmentName: 'Directorate of Basic Education',
    startDate: '2019-01-01',
    endDate: '2025-12-31',
    components: [
      {
        id: 'ep4r-c1',
        name: 'DLR 1: Equitable Teacher Distribution & Retention',
        budgetUSD: 110000000,
        expenditureUSD: 95000000,
        physicalProgress: 91.0,
        status: 'GREEN',
        subcomponentsCount: 2
      },
      {
        id: 'ep4r-c2',
        name: 'DLR 2: School Quality Assurance & Capitation Grants',
        budgetUSD: 120000000,
        expenditureUSD: 102000000,
        physicalProgress: 88.4,
        status: 'GREEN',
        subcomponentsCount: 3
      },
      {
        id: 'ep4r-c3',
        name: 'DLR 3: Learning Assessment & Remedial Teaching',
        budgetUSD: 60000000,
        expenditureUSD: 35000000,
        physicalProgress: 87.0,
        status: 'GREEN',
        subcomponentsCount: 2
      }
    ]
  }
];

export const mockDepartments: Department[] = [
  {
    id: 'dpp',
    code: 'DPP',
    name: 'Directorate of Policy & Planning',
    directorate: 'Policy & Sector Coordination',
    headOfDepartment: 'Dr. Charles M. Mwanri',
    overallPerformance: 88.5,
    status: 'GREEN',
    indicatorsCount: 14,
    targetsCount: 18,
    activitiesCount: 32,
    projectsCount: 3,
    budgetAllocatedTZS: 14500,
    budgetUtilizedTZS: 12900,
    budgetUtilizationRate: 88.9,
    delayedActivitiesCount: 1,
    atRiskIndicatorsCount: 1,
    strategicObjectives: [
      'Enhance evidence-based education sector policy formulation',
      'Lead national ESDP monitoring and donor coordination',
      'Integrate Education Management Information System (EMIS)'
    ]
  },
  {
    id: 'dse',
    code: 'DSE',
    name: 'Directorate of Secondary Education',
    directorate: 'General Education',
    headOfDepartment: 'Madam Grace K. Njau',
    overallPerformance: 82.1,
    status: 'GREEN',
    indicatorsCount: 16,
    targetsCount: 22,
    activitiesCount: 45,
    projectsCount: 2,
    budgetAllocatedTZS: 48000,
    budgetUtilizedTZS: 41200,
    budgetUtilizationRate: 85.8,
    delayedActivitiesCount: 2,
    atRiskIndicatorsCount: 3,
    strategicObjectives: [
      'Expand secondary school infrastructure via SEQUIP',
      'Improve secondary mathematics and science learning outcomes',
      'Ensure 100% transition rate from Form 4 to Form 5 / TVET'
    ]
  },
  {
    id: 'dbe',
    code: 'DBE',
    name: 'Directorate of Basic Education',
    directorate: 'General Education',
    headOfDepartment: 'Mr. Emmanuel P. Sospeter',
    overallPerformance: 86.4,
    status: 'GREEN',
    indicatorsCount: 15,
    targetsCount: 20,
    activitiesCount: 38,
    projectsCount: 2,
    budgetAllocatedTZS: 62000,
    budgetUtilizedTZS: 55800,
    budgetUtilizationRate: 90.0,
    delayedActivitiesCount: 1,
    atRiskIndicatorsCount: 2,
    strategicObjectives: [
      'Enforce Fee-Free Basic Education capitation grants delivery',
      'Improve 3Rs (Reading, Writing, Arithmetic) at Grade 2 & 3',
      'Promote inclusive education for children with special needs'
    ]
  },
  {
    id: 'dhe',
    code: 'DHE',
    name: 'Directorate of Higher Education',
    directorate: 'Higher Education & Research',
    headOfDepartment: 'Prof. James H. Bakari',
    overallPerformance: 73.6,
    status: 'YELLOW',
    indicatorsCount: 12,
    targetsCount: 16,
    activitiesCount: 28,
    projectsCount: 1,
    budgetAllocatedTZS: 89000,
    budgetUtilizedTZS: 64000,
    budgetUtilizationRate: 71.9,
    delayedActivitiesCount: 4,
    atRiskIndicatorsCount: 4,
    strategicObjectives: [
      'Oversee HEET project execution across 14 public universities',
      'Increase higher education enrollment in STEM fields',
      'Modernize university research labs and digital lecture halls'
    ]
  },
  {
    id: 'dtvet',
    code: 'DTVET',
    name: 'Directorate of Technical & Vocational Education',
    directorate: 'Technical Education & VETA',
    headOfDepartment: 'Eng. Peter J. Masanja',
    overallPerformance: 84.0,
    status: 'GREEN',
    indicatorsCount: 11,
    targetsCount: 15,
    activitiesCount: 30,
    projectsCount: 2,
    budgetAllocatedTZS: 32000,
    budgetUtilizedTZS: 27500,
    budgetUtilizationRate: 85.9,
    delayedActivitiesCount: 2,
    atRiskIndicatorsCount: 2,
    strategicObjectives: [
      'Construct VETA vocational centers in all uncovered districts',
      'Align TVET curricula with industrial and regional labor market demand',
      'Expand dual apprenticeship and workplace training programs'
    ]
  },
  {
    id: 'dte',
    code: 'DTE',
    name: 'Directorate of Teacher Education',
    directorate: 'Teacher Quality & Professional Development',
    headOfDepartment: 'Dr. Rehema N. Mtangi',
    overallPerformance: 67.4,
    status: 'RED',
    indicatorsCount: 10,
    targetsCount: 14,
    activitiesCount: 24,
    projectsCount: 2,
    budgetAllocatedTZS: 21000,
    budgetUtilizedTZS: 13800,
    budgetUtilizationRate: 65.7,
    delayedActivitiesCount: 6,
    atRiskIndicatorsCount: 5,
    strategicObjectives: [
      'Roll out mandatory Continuous Professional Development (CPD)',
      'Digitalize Teachers College learning modules',
      'Upgrade primary and secondary teacher qualification standards'
    ]
  },
  {
    id: 'dsti',
    code: 'DSTI',
    name: 'Directorate of Science, Technology & Innovation',
    directorate: 'Higher Education & Research',
    headOfDepartment: 'Dr. Amos K. Mashalla',
    overallPerformance: 79.5,
    status: 'YELLOW',
    indicatorsCount: 9,
    targetsCount: 12,
    activitiesCount: 20,
    projectsCount: 1,
    budgetAllocatedTZS: 18500,
    budgetUtilizedTZS: 14200,
    budgetUtilizationRate: 76.8,
    delayedActivitiesCount: 2,
    atRiskIndicatorsCount: 2,
    strategicObjectives: [
      'Fund national high-impact science and technology research projects',
      'Promote patenting and commercialization of academic innovations',
      'Establish National Science and Innovation Parks'
    ]
  },
  {
    id: 'sqa',
    code: 'SQA',
    name: 'Department of School Quality Assurance',
    directorate: 'Quality Standards & Inspection',
    headOfDepartment: 'Madam Agnes R. Lyimo',
    overallPerformance: 89.2,
    status: 'GREEN',
    indicatorsCount: 8,
    targetsCount: 10,
    activitiesCount: 18,
    projectsCount: 1,
    budgetAllocatedTZS: 16000,
    budgetUtilizedTZS: 14800,
    budgetUtilizationRate: 92.5,
    delayedActivitiesCount: 0,
    atRiskIndicatorsCount: 0,
    strategicObjectives: [
      'Digitalize school quality assurance inspections nationwide',
      'Ensure at least 75% of schools receive full inspection annually',
      'Publish public school quality inspection evaluation reports'
    ]
  },
  {
    id: 'dahrm',
    code: 'DAHRM',
    name: 'Administration & Human Resource Management',
    directorate: 'Administration & Support',
    headOfDepartment: 'Mr. Salum T. Kibwana',
    overallPerformance: 85.0,
    status: 'GREEN',
    indicatorsCount: 6,
    targetsCount: 8,
    activitiesCount: 16,
    projectsCount: 0,
    budgetAllocatedTZS: 12000,
    budgetUtilizedTZS: 10500,
    budgetUtilizationRate: 87.5,
    delayedActivitiesCount: 1,
    atRiskIndicatorsCount: 1,
    strategicObjectives: [
      'Optimize Ministry staff deployment and performance appraisal',
      'Enhance staff capacity building and institutional governance'
    ]
  },
  {
    id: 'ict',
    code: 'ICT',
    name: 'ICT & Educational Technology Unit',
    directorate: 'Policy & Sector Coordination',
    headOfDepartment: 'Eng. Happiness A. Mlowe',
    overallPerformance: 91.0,
    status: 'GREEN',
    indicatorsCount: 7,
    targetsCount: 10,
    activitiesCount: 22,
    projectsCount: 2,
    budgetAllocatedTZS: 15500,
    budgetUtilizedTZS: 14600,
    budgetUtilizationRate: 94.2,
    delayedActivitiesCount: 0,
    atRiskIndicatorsCount: 0,
    strategicObjectives: [
      'Maintain the central MoEST Integrated M&E Portal (MEIS)',
      'Connect all secondary schools and colleges to broadband fiber',
      'Implement digital learning management systems across institutions'
    ]
  }
];

export const mockIndicators: IndicatorMetadata[] = [
  {
    code: 'IND-SEC-01',
    name: 'Net Enrolment Rate (NER) in Secondary Education (Lower Secondary)',
    definition: 'Percentage of official secondary school-age population (14–17 years) enrolled in lower secondary school (Forms 1–4).',
    unit: '%',
    baseline: 42.5,
    baselineYear: '2022',
    target: 65.0,
    targetYear: '2027',
    actual: 58.4,
    previousActual: 52.1,
    isInverse: false,
    reportingFrequency: 'Annually',
    dataSource: 'BEST / Basic Education Statistics Tanzania & SEQUIP M&E',
    responsibleDepartmentId: 'dse',
    responsibleDepartmentName: 'Directorate of Secondary Education',
    verificationStatus: 'Verified',
    lastUpdated: '2026-06-30',
    relatedProjectIds: ['sequip', 'ep4r'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Objective 2: Expand Equitable Secondary Access', target: '65.0%', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 1: Increase Secondary Intake', target: '65.0%', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.1: Free, Equitable & Quality Secondary', target: '70.0%', contributionType: 'Contributing' },
      { frameworkId: 'ccm', frameworkName: 'CCM Manifesto', objective: 'Commitment 3: Secondary School Construction', target: '65.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 42.5, actual: 42.5 },
      { year: '2023', planned: 46.0, actual: 47.2 },
      { year: '2024', planned: 51.0, actual: 52.1 },
      { year: '2025', planned: 56.0, actual: 55.8 },
      { year: '2026', planned: 61.0, actual: 58.4 },
      { year: '2027', planned: 65.0, actual: null }
    ],
    regionalPerformance: [
      { region: 'Dar es Salaam', actual: 72.4, target: 65.0, status: 'GREEN' },
      { region: 'Arusha', actual: 66.8, target: 65.0, status: 'GREEN' },
      { region: 'Mwanza', actual: 61.2, target: 65.0, status: 'YELLOW' },
      { region: 'Dodoma', actual: 57.5, target: 65.0, status: 'YELLOW' },
      { region: 'Tabora', actual: 44.1, target: 65.0, status: 'RED' },
      { region: 'Kigoma', actual: 41.8, target: 65.0, status: 'RED' }
    ],
    riskFactors: [
      'Long distance to secondary schools in rural ward boundaries',
      'Delayed completion of 120 ward secondary school classrooms under SEQUIP'
    ],
    recommendedActions: [
      'Accelerate contractor payments for ward secondary school construction under SEQUIP Component 1',
      'Deploy targeted transport capitation allowances for marginalized rural students'
    ],
    contributingOutputIds: ['out-sequip-01', 'out-dse-02']
  },
  {
    code: 'IND-SEC-02',
    name: 'Percentage of Girls Completing Secondary Education (Form 4)',
    definition: 'Percentage of female cohort enrolled in Form 1 who successfully complete Form 4.',
    unit: '%',
    baseline: 61.0,
    baselineYear: '2022',
    target: 80.0,
    targetYear: '2027',
    actual: 76.5,
    previousActual: 71.8,
    isInverse: false,
    reportingFrequency: 'Annually',
    dataSource: 'NECTA Examinations Registry & SEQUIP Gender Unit',
    responsibleDepartmentId: 'dse',
    responsibleDepartmentName: 'Directorate of Secondary Education',
    verificationStatus: 'Verified',
    lastUpdated: '2026-06-30',
    relatedProjectIds: ['sequip'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Objective 2: Gender Parity & Retention in Secondary', target: '80.0%', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.5: Gender Equality in Education', target: '85.0%', contributionType: 'Direct' },
      { frameworkId: 'ccm', frameworkName: 'CCM Manifesto', objective: 'Commitment 4: Girls Protection & Re-entry', target: '80.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 61.0, actual: 61.0 },
      { year: '2023', planned: 65.0, actual: 66.4 },
      { year: '2024', planned: 70.0, actual: 71.8 },
      { year: '2025', planned: 75.0, actual: 74.0 },
      { year: '2026', planned: 78.0, actual: 76.5 },
      { year: '2027', planned: 80.0, actual: null }
    ]
  },
  {
    code: 'IND-TCH-01',
    name: 'Percentage of Teachers Completing Targeted Continuous Professional Development (CPD)',
    definition: 'Percentage of primary and secondary school teachers who successfully complete the required 40 annual hours of accredited CPD in core subjects.',
    unit: '%',
    baseline: 38.0,
    baselineYear: '2022',
    target: 85.0,
    targetYear: '2027',
    actual: 61.2,
    previousActual: 58.0,
    isInverse: false,
    reportingFrequency: 'Quarterly',
    dataSource: 'Teacher Continuous Professional Development (TCPD) Database',
    responsibleDepartmentId: 'dte',
    responsibleDepartmentName: 'Directorate of Teacher Education',
    verificationStatus: 'Pending Verification',
    lastUpdated: '2026-07-15',
    relatedProjectIds: ['sequip', 'ep4r'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 1: Learning Quality & Teacher Development', target: '85.0%', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 3: Upgrading Teacher Competency', target: '85.0%', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.c: Qualified and Trained Teachers', target: '90.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 38.0, actual: 38.0 },
      { year: '2023', planned: 48.0, actual: 44.5 },
      { year: '2024', planned: 60.0, actual: 58.0 },
      { year: '2025', planned: 72.0, actual: 60.1 },
      { year: '2026', planned: 80.0, actual: 61.2 },
      { year: '2027', planned: 85.0, actual: null }
    ],
    riskFactors: [
      'Limited offline digital modules for remote rural teachers in Lindi and Katavi',
      'Delayed release of regional training budgets from PO-RALG'
    ],
    recommendedActions: [
      'Transition CPD modules to mobile offline LMS app funded by EP4R',
      'Conduct fast-track weekend cluster workshops in 15 underperforming councils'
    ]
  },
  {
    code: 'IND-TCH-02',
    name: 'Pupil-Teacher Ratio (PTR) in Public Secondary Schools',
    definition: 'Average number of enrolled secondary school pupils per qualified secondary school teacher.',
    unit: 'Pupils/Teacher',
    baseline: 48.0,
    baselineYear: '2022',
    target: 35.0,
    targetYear: '2027',
    actual: 38.2,
    previousActual: 41.5,
    isInverse: true,
    reportingFrequency: 'Annually',
    dataSource: 'PO-RALG School Information System (SIS) & BEST',
    responsibleDepartmentId: 'dte',
    responsibleDepartmentName: 'Directorate of Teacher Education',
    verificationStatus: 'Verified',
    lastUpdated: '2026-06-15',
    relatedProjectIds: ['ep4r', 'sequip'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 1: Quality Teaching Workforce', target: '≤ 35.0', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.c: Qualified Teachers', target: '≤ 35.0', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 48.0, actual: 48.0 },
      { year: '2023', planned: 45.0, actual: 44.2 },
      { year: '2024', planned: 42.0, actual: 41.5 },
      { year: '2025', planned: 39.0, actual: 39.8 },
      { year: '2026', planned: 37.0, actual: 38.2 },
      { year: '2027', planned: 35.0, actual: null }
    ]
  },
  {
    code: 'IND-HED-01',
    name: 'Higher Education Enrolment in STEM and Priority Economic Disciplines',
    definition: 'Total undergraduate and postgraduate students enrolled in Science, Technology, Engineering, Mathematics, Agriculture, and Health sciences in higher education institutions.',
    unit: 'Students',
    baseline: 85000,
    baselineYear: '2022',
    target: 150000,
    targetYear: '2027',
    actual: 122400,
    previousActual: 108000,
    isInverse: false,
    reportingFrequency: 'Annually',
    dataSource: 'Tanzania Commission for Universities (TCU) & HEET M&E System',
    responsibleDepartmentId: 'dhe',
    responsibleDepartmentName: 'Directorate of Higher Education',
    verificationStatus: 'Verified',
    lastUpdated: '2026-07-01',
    relatedProjectIds: ['heet'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 3: Higher Education Transformation', target: '150,000', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 4: Strengthen STEM & Industrial Skills', target: '150,000', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.3: Equal Access to Technical & Higher Ed', target: '160,000', contributionType: 'Contributing' },
      { frameworkId: 'ccm', frameworkName: 'CCM Manifesto', objective: 'Commitment 8: Modernizing Universities', target: '150,000', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 85000, actual: 85000 },
      { year: '2023', planned: 98000, actual: 96500 },
      { year: '2024', planned: 112000, actual: 108000 },
      { year: '2025', planned: 128000, actual: 118000 },
      { year: '2026', planned: 140000, actual: 122400 },
      { year: '2027', planned: 150000, actual: null }
    ],
    riskFactors: [
      'Delay in completion of HEET Component 1 laboratory construction at UDSM and MUST',
      'Inadequate specialized academic staff with PhD degrees in artificial intelligence and biotechnology'
    ],
    recommendedActions: [
      'Issue fast-track procurement approval for laboratory scientific equipment under HEET',
      'Expand academic staff PhD scholarship bond funding'
    ]
  },
  {
    code: 'IND-HED-02',
    name: 'Percentage of Academic Staff in Public Universities Holding PhD Degrees',
    definition: 'Percentage of full-time academic teaching staff in public universities holding a recognized PhD or equivalent doctoral degree.',
    unit: '%',
    baseline: 32.0,
    baselineYear: '2022',
    target: 55.0,
    targetYear: '2027',
    actual: 44.8,
    previousActual: 40.2,
    isInverse: false,
    reportingFrequency: 'Bi-Annually',
    dataSource: 'TCU Higher Education Information System (HEIS)',
    responsibleDepartmentId: 'dhe',
    responsibleDepartmentName: 'Directorate of Higher Education',
    verificationStatus: 'Verified',
    lastUpdated: '2026-06-30',
    relatedProjectIds: ['heet'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 3: Higher Education Quality & Staffing', target: '55.0%', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 4: Academic Excellence', target: '55.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 32.0, actual: 32.0 },
      { year: '2023', planned: 36.0, actual: 36.5 },
      { year: '2024', planned: 41.0, actual: 40.2 },
      { year: '2025', planned: 47.0, actual: 43.1 },
      { year: '2026', planned: 51.0, actual: 44.8 },
      { year: '2027', planned: 55.0, actual: null }
    ]
  },
  {
    code: 'IND-TVET-01',
    name: 'Enrolment in Accredited Technical and Vocational Training (VETA & NACTVET)',
    definition: 'Total annual student intake in fully accredited technical colleges, vocational training centers, and VETA institutes nationwide.',
    unit: 'Students',
    baseline: 115000,
    baselineYear: '2022',
    target: 250000,
    targetYear: '2027',
    actual: 218500,
    previousActual: 192000,
    isInverse: false,
    reportingFrequency: 'Annually',
    dataSource: 'NACTVET Admission Portal & VETA Management Information System',
    responsibleDepartmentId: 'dtvet',
    responsibleDepartmentName: 'Directorate of Technical & Vocational Education',
    verificationStatus: 'Verified',
    lastUpdated: '2026-07-05',
    relatedProjectIds: ['ep4r'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 2: Vocational & Skills Transformation', target: '250,000', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 2: Expand TVET Access', target: '250,000', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.3: Equal Access to Technical Education', target: '250,000', contributionType: 'Direct' },
      { frameworkId: 'ccm', frameworkName: 'CCM Manifesto', objective: 'Commitment 6: VETA in Every District', target: '250,000', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 115000, actual: 115000 },
      { year: '2023', planned: 140000, actual: 142000 },
      { year: '2024', planned: 170000, actual: 175000 },
      { year: '2025', planned: 200000, actual: 192000 },
      { year: '2026', planned: 225000, actual: 218500 },
      { year: '2027', planned: 250000, actual: null }
    ]
  },
  {
    code: 'IND-TVET-02',
    name: 'Employment / Self-Employment Rate of TVET Graduates Within 6 Months',
    definition: 'Percentage of VETA/NACTVET diploma and certificate graduates gaining formal employment, wage employment, or launching registered micro-enterprises within 6 months of graduation.',
    unit: '%',
    baseline: 54.0,
    baselineYear: '2022',
    target: 78.0,
    targetYear: '2027',
    actual: 71.4,
    previousActual: 66.8,
    isInverse: false,
    reportingFrequency: 'Annually',
    dataSource: 'National TVET Graduate Tracer Study & NACTVET',
    responsibleDepartmentId: 'dtvet',
    responsibleDepartmentName: 'Directorate of Technical & Vocational Education',
    verificationStatus: 'Verified',
    lastUpdated: '2026-05-20',
    relatedProjectIds: ['heet'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 2: Employability & Skills Alignment', target: '78.0%', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.4: Relevant Skills for Employment', target: '80.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 54.0, actual: 54.0 },
      { year: '2023', planned: 59.0, actual: 61.2 },
      { year: '2024', planned: 65.0, actual: 66.8 },
      { year: '2025', planned: 71.0, actual: 69.5 },
      { year: '2026', planned: 75.0, actual: 71.4 },
      { year: '2027', planned: 78.0, actual: null }
    ]
  },
  {
    code: 'IND-SQA-01',
    name: 'Percentage of Schools Meeting Minimum Learning Environment Standards',
    definition: 'Percentage of primary and secondary schools evaluated by SQA that meet or exceed statutory minimum physical infrastructure, WASH facilities, and safety guidelines.',
    unit: '%',
    baseline: 48.0,
    baselineYear: '2022',
    target: 85.0,
    targetYear: '2027',
    actual: 72.0,
    previousActual: 65.4,
    isInverse: false,
    reportingFrequency: 'Quarterly',
    dataSource: 'Electronic School Quality Assurance System (e-SQAS)',
    responsibleDepartmentId: 'sqa',
    responsibleDepartmentName: 'Department of School Quality Assurance',
    verificationStatus: 'Verified',
    lastUpdated: '2026-07-20',
    relatedProjectIds: ['sequip', 'ep4r'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 4: School Quality Assurance & Governance', target: '85.0%', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.a: Safe & Effective Learning Environments', target: '90.0%', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 5: Governance & Standards Enforcement', target: '85.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 48.0, actual: 48.0 },
      { year: '2023', planned: 56.0, actual: 57.2 },
      { year: '2024', planned: 65.0, actual: 65.4 },
      { year: '2025', planned: 74.0, actual: 69.8 },
      { year: '2026', planned: 80.0, actual: 72.0 },
      { year: '2027', planned: 85.0, actual: null }
    ],
    riskFactors: [
      'Inadequate clean water supply connection in 31% of rural schools in Simiyu and Mara regions',
      'Overcrowding in urban secondary schools in Mwanza and Dar es Salaam'
    ],
    recommendedActions: [
      'Prioritize WASH infrastructure grants under EP4R DLR 2 for water-stressed councils',
      'Construct additional classroom blocks under SEQUIP phase 2 emergency budget'
    ]
  },
  {
    code: 'IND-STI-01',
    name: 'Number of National High-Impact Research Grants Awarded in Priority Sectors',
    definition: 'Total competitively awarded research grants funded by MoEST and COSTECH focusing on health, climate change, agriculture, digital economy, and industrial manufacturing.',
    unit: 'Grants',
    baseline: 35,
    baselineYear: '2022',
    target: 120,
    targetYear: '2027',
    actual: 92,
    previousActual: 75,
    isInverse: false,
    reportingFrequency: 'Annually',
    dataSource: 'COSTECH Research Portal & DSTI Monitoring System',
    responsibleDepartmentId: 'dsti',
    responsibleDepartmentName: 'Directorate of Science, Technology & Innovation',
    verificationStatus: 'Verified',
    lastUpdated: '2026-06-10',
    relatedProjectIds: ['heet'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 3: Research & Commercial Innovation', target: '120 Grants', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 4: Science & Technology Advancement', target: '120 Grants', contributionType: 'Direct' },
      { frameworkId: 'ccm', frameworkName: 'CCM Manifesto', objective: 'Commitment 9: National Research Fund Expansion', target: '120 Grants', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 35, actual: 35 },
      { year: '2023', planned: 50, actual: 52 },
      { year: '2024', planned: 70, actual: 75 },
      { year: '2025', planned: 90, actual: 84 },
      { year: '2026', planned: 105, actual: 92 },
      { year: '2027', planned: 120, actual: null }
    ]
  },
  {
    code: 'IND-BAS-01',
    name: 'Fee-Free Basic Education Capitation Grants Disbursed on Time to Schools',
    definition: 'Percentage of quarterly capitation grant disbursements delivered to primary and lower secondary school accounts within 10 business days of quarter start.',
    unit: '%',
    baseline: 82.0,
    baselineYear: '2022',
    target: 98.0,
    targetYear: '2027',
    actual: 95.8,
    previousActual: 92.4,
    isInverse: false,
    reportingFrequency: 'Quarterly',
    dataSource: 'MoFP Treasury System & MoEST Finance Department',
    responsibleDepartmentId: 'dbe',
    responsibleDepartmentName: 'Directorate of Basic Education',
    verificationStatus: 'Audited',
    lastUpdated: '2026-07-30',
    relatedProjectIds: ['ep4r'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 1: Universal Equitable Access', target: '98.0%', contributionType: 'Direct' },
      { frameworkId: 'ccm', frameworkName: 'CCM Manifesto', objective: 'Commitment 1: Fee-Free Basic Education Execution', target: '100.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 82.0, actual: 82.0 },
      { year: '2023', planned: 88.0, actual: 89.1 },
      { year: '2024', planned: 92.0, actual: 92.4 },
      { year: '2025', planned: 95.0, actual: 94.8 },
      { year: '2026', planned: 97.0, actual: 95.8 },
      { year: '2027', planned: 98.0, actual: null }
    ]
  },
  {
    code: 'IND-ICT-01',
    name: 'Percentage of Public Secondary Schools Connected to High-Speed Internet',
    definition: 'Percentage of public secondary schools equipped with broadband internet connection of at least 10 Mbps for learning.',
    unit: '%',
    baseline: 12.0,
    baselineYear: '2022',
    target: 60.0,
    targetYear: '2027',
    actual: 48.5,
    previousActual: 36.2,
    isInverse: false,
    reportingFrequency: 'Quarterly',
    dataSource: 'MoEST ICT Unit & e-GA Broadband Tracker',
    responsibleDepartmentId: 'ict',
    responsibleDepartmentName: 'ICT & Educational Technology Unit',
    verificationStatus: 'Verified',
    lastUpdated: '2026-07-10',
    relatedProjectIds: ['sequip', 'heet'],
    alignedFrameworks: [
      { frameworkId: 'esdp', frameworkName: 'ESDP', objective: 'Strategic Priority 5: Digital Transformation & ICT Infrastructure', target: '60.0%', contributionType: 'Direct' },
      { frameworkId: 'sp', frameworkName: 'Strategic Plan', objective: 'SO 6: ICT Infrastructure Expansion', target: '60.0%', contributionType: 'Direct' },
      { frameworkId: 'sdg', frameworkName: 'SDG 4', objective: 'Target 4.a: Digital Education Infrastructure', target: '65.0%', contributionType: 'Direct' }
    ],
    historicalTrend: [
      { year: '2022', planned: 12.0, actual: 12.0 },
      { year: '2023', planned: 22.0, actual: 24.0 },
      { year: '2024', planned: 34.0, actual: 36.2 },
      { year: '2025', planned: 45.0, actual: 44.0 },
      { year: '2026', planned: 53.0, actual: 48.5 },
      { year: '2027', planned: 60.0, actual: null }
    ]
  }
];

export const mockTheoryOfChangeTree: TheoryOfChangeNode = {
  id: 'toc-esdp-root',
  parentId: null,
  frameworkId: 'esdp',
  type: 'FRAMEWORK',
  code: 'ESDP 2025-2030',
  name: 'Education Sector Development Plan (ESDP 2025/26–2029/30)',
  description: 'National Theory of Change driving equitable access, quality learning, STEM, TVET, and systemic governance.',
  departmentId: 'dpp',
  departmentName: 'Directorate of Policy & Planning',
  projectIds: ['sequip', 'heet', 'ep4r'],
  indicatorIds: ['IND-SEC-01', 'IND-TCH-01', 'IND-HED-01', 'IND-TVET-01'],
  target: 100,
  actual: 82.4,
  achievement: 82.4,
  status: 'GREEN',
  indicatorCount: 33,
  children: [
    {
      id: 'toc-sp1',
      parentId: 'toc-esdp-root',
      frameworkId: 'esdp',
      type: 'STRATEGIC_PRIORITY',
      code: 'PRIORITY 1',
      name: 'Priority 1: Equitable Access & Retention in General Education',
      description: 'Expand secondary and basic education infrastructure, ensure gender parity, and eliminate barriers to completion.',
      departmentId: 'dse',
      departmentName: 'Directorate of Secondary Education',
      projectIds: ['sequip', 'ep4r'],
      indicatorIds: ['IND-SEC-01', 'IND-SEC-02', 'IND-BAS-01'],
      target: 100,
      actual: 83.5,
      achievement: 83.5,
      status: 'GREEN',
      indicatorCount: 12,
      children: [
        {
          id: 'toc-sp1-out1',
          parentId: 'toc-sp1',
          frameworkId: 'esdp',
          type: 'OUTCOME',
          code: 'OUTCOME 1.1',
          name: 'Outcome 1.1: Improved Learning Quality & Retention in Secondary Schools',
          description: 'Students complete secondary education with verified proficiency in STEM, language, and core competencies.',
          departmentId: 'dse',
          departmentName: 'Directorate of Secondary Education',
          projectIds: ['sequip'],
          indicatorIds: ['IND-SEC-01', 'IND-SEC-02'],
          target: 100,
          actual: 76.5,
          achievement: 76.5,
          status: 'YELLOW',
          indicatorCount: 6,
          children: [
            {
              id: 'toc-sp1-out1-inter1',
              parentId: 'toc-sp1-out1',
              frameworkId: 'esdp',
              type: 'INTERMEDIATE_OUTCOME',
              code: 'INT-OUT 1.1.1',
              name: 'Intermediate Outcome 1.1.1: Enhanced Classroom Teacher Competency & STEM Support',
              description: 'Teachers master student-centered pedagogy and digital laboratory instruction.',
              departmentId: 'dte',
              departmentName: 'Directorate of Teacher Education',
              projectIds: ['sequip', 'ep4r'],
              indicatorIds: ['IND-TCH-01', 'IND-TCH-02'],
              target: 100,
              actual: 71.8,
              achievement: 71.8,
              status: 'YELLOW',
              indicatorCount: 4,
              children: [
                {
                  id: 'toc-sp1-out1-inter1-output1',
                  parentId: 'toc-sp1-out1-inter1',
                  frameworkId: 'esdp',
                  type: 'OUTPUT',
                  code: 'OUTPUT 1.1.1.A',
                  name: 'Output 1.1.1.A: In-Service Teacher Continuous Professional Development (CPD) Delivered',
                  description: 'Annual training workshops conducted for secondary science, mathematics, and language teachers.',
                  departmentId: 'dte',
                  departmentName: 'Directorate of Teacher Education',
                  projectIds: ['sequip'],
                  indicatorIds: ['IND-TCH-01'],
                  target: 85,
                  actual: 61.2,
                  achievement: 72.0,
                  status: 'YELLOW',
                  indicatorCount: 2,
                  children: [
                    {
                      id: 'toc-act-cpd-rollout',
                      parentId: 'toc-sp1-out1-inter1-output1',
                      frameworkId: 'esdp',
                      type: 'ACTIVITY',
                      code: 'ACT 1.1.1.A.1',
                      name: 'Activity: Roll out TCPD modules to 184 Local Government Authorities',
                      description: 'Distribute physical and digital TCPD training guides and conduct cluster master trainer seminars.',
                      departmentId: 'dte',
                      departmentName: 'Directorate of Teacher Education',
                      projectIds: ['sequip'],
                      indicatorIds: ['IND-TCH-01'],
                      target: 184,
                      actual: 112,
                      achievement: 60.8,
                      status: 'RED',
                      indicatorCount: 1,
                      children: [
                        {
                          id: 'toc-ind-node-tch01',
                          parentId: 'toc-act-cpd-rollout',
                          frameworkId: 'esdp',
                          type: 'INDICATOR',
                          code: 'IND-TCH-01',
                          name: 'Percentage of Teachers Completing CPD Training',
                          description: 'Target: 85% | Actual: 61.2% (72.0% Achievement - At Risk)',
                          departmentId: 'dte',
                          departmentName: 'Directorate of Teacher Education',
                          projectIds: ['sequip'],
                          indicatorIds: ['IND-TCH-01'],
                          target: 85,
                          actual: 61.2,
                          achievement: 72.0,
                          status: 'YELLOW',
                          indicatorCount: 1
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'toc-sp1-out1-inter1-output2',
                  parentId: 'toc-sp1-out1-inter1',
                  frameworkId: 'esdp',
                  type: 'OUTPUT',
                  code: 'OUTPUT 1.1.1.B',
                  name: 'Output 1.1.1.B: Secondary School Science Laboratories & Digital Centers Constructed',
                  description: 'Fully equipped physics, chemistry, biology labs and ICT hubs established in ward secondary schools.',
                  departmentId: 'dse',
                  departmentName: 'Directorate of Secondary Education',
                  projectIds: ['sequip'],
                  indicatorIds: ['IND-SEC-01', 'IND-ICT-01'],
                  target: 100,
                  actual: 88.0,
                  achievement: 88.0,
                  status: 'YELLOW',
                  indicatorCount: 2
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'toc-sp2',
      parentId: 'toc-esdp-root',
      frameworkId: 'esdp',
      type: 'STRATEGIC_PRIORITY',
      code: 'PRIORITY 2',
      name: 'Priority 2: Vocational & Skills Transformation (TVET)',
      description: 'Modernize VETA centers, align curriculum with labor market demand, and expand dual apprenticeship programs.',
      departmentId: 'dtvet',
      departmentName: 'Directorate of Technical & Vocational Education',
      projectIds: ['ep4r'],
      indicatorIds: ['IND-TVET-01', 'IND-TVET-02'],
      target: 100,
      actual: 87.4,
      achievement: 87.4,
      status: 'GREEN',
      indicatorCount: 8,
      children: [
        {
          id: 'toc-sp2-out1',
          parentId: 'toc-sp2',
          frameworkId: 'esdp',
          type: 'OUTCOME',
          code: 'OUTCOME 2.1',
          name: 'Outcome 2.1: Expanded Technical & Vocational Skills for Employment',
          description: 'Youth gain accredited technical, industrial, and entrepreneurial competencies for the modern economy.',
          departmentId: 'dtvet',
          departmentName: 'Directorate of Technical & Vocational Education',
          projectIds: ['ep4r'],
          indicatorIds: ['IND-TVET-01', 'IND-TVET-02'],
          target: 100,
          actual: 87.4,
          achievement: 87.4,
          status: 'GREEN',
          indicatorCount: 4
        }
      ]
    },
    {
      id: 'toc-sp3',
      parentId: 'toc-esdp-root',
      frameworkId: 'esdp',
      type: 'STRATEGIC_PRIORITY',
      code: 'PRIORITY 3',
      name: 'Priority 3: Higher Education & Research Excellence',
      description: 'Transform public universities via HEET, upgrade research laboratories, and increase STEM graduate output.',
      departmentId: 'dhe',
      departmentName: 'Directorate of Higher Education',
      projectIds: ['heet'],
      indicatorIds: ['IND-HED-01', 'IND-HED-02', 'IND-STI-01'],
      target: 100,
      actual: 78.2,
      achievement: 78.2,
      status: 'YELLOW',
      indicatorCount: 9,
      children: [
        {
          id: 'toc-sp3-out1',
          parentId: 'toc-sp3',
          frameworkId: 'esdp',
          type: 'OUTCOME',
          code: 'OUTCOME 3.1',
          name: 'Outcome 3.1: Quality Higher Education Aligned with Economic Priorities',
          description: 'Public universities produce high-skilled graduates, impactful research, and commercial technology patents.',
          departmentId: 'dhe',
          departmentName: 'Directorate of Higher Education',
          projectIds: ['heet'],
          indicatorIds: ['IND-HED-01', 'IND-HED-02'],
          target: 100,
          actual: 78.2,
          achievement: 78.2,
          status: 'YELLOW',
          indicatorCount: 5
        }
      ]
    },
    {
      id: 'toc-sp4',
      parentId: 'toc-esdp-root',
      frameworkId: 'esdp',
      type: 'STRATEGIC_PRIORITY',
      code: 'PRIORITY 4',
      name: 'Priority 4: Quality Assurance, Governance & Digitalization',
      description: 'Digitalize school inspections, strengthen EMIS data integrity, and guarantee efficient budget execution.',
      departmentId: 'sqa',
      departmentName: 'Department of School Quality Assurance',
      projectIds: ['ep4r', 'sequip'],
      indicatorIds: ['IND-SQA-01', 'IND-ICT-01'],
      target: 100,
      actual: 89.6,
      achievement: 89.6,
      status: 'GREEN',
      indicatorCount: 4
    }
  ]
};

export const mockAlerts: ManagementAlert[] = [
  {
    id: 'alt-01',
    severity: 'RED',
    title: 'CPD Training Completion Rate Below Target',
    description: 'Directorate of Teacher Education: CPD completion is at 61.2% against annual target of 80.0% (72% Achievement - At Risk). 65 Local Government Authorities have delayed rollout.',
    category: 'Indicator',
    targetId: 'IND-TCH-01',
    targetType: 'indicator',
    timestamp: '2026-08-25',
    responsibleEntity: 'Directorate of Teacher Education (DTE)'
  },
  {
    id: 'alt-02',
    severity: 'RED',
    title: 'HEET Component 1 Infrastructure Delay',
    description: 'Higher Education for Economic Transformation: Construction of STEM laboratories at 3 public universities is 3 months behind schedule due to delayed contractor payments.',
    category: 'Project',
    targetId: 'heet',
    targetType: 'project',
    timestamp: '2026-08-22',
    responsibleEntity: 'Directorate of Higher Education (DHE) & HEET PIU'
  },
  {
    id: 'alt-03',
    severity: 'YELLOW',
    title: 'Net Secondary Enrolment Lagging in Rural Western Zone',
    description: 'Tabora and Kigoma regions report lower secondary NER below 45%, reducing nationwide secondary enrolment rate achievement to 89.8%.',
    category: 'Indicator',
    targetId: 'IND-SEC-01',
    targetType: 'indicator',
    timestamp: '2026-08-20',
    responsibleEntity: 'Directorate of Secondary Education (DSE)'
  },
  {
    id: 'alt-04',
    severity: 'YELLOW',
    title: 'Department of Higher Education Budget Utilization At Risk',
    description: 'DHE budget utilization stands at 71.9% at Q3 end. Procurement for specialized engineering equipment requires fast-tracking.',
    category: 'Department',
    targetId: 'dhe',
    targetType: 'department',
    timestamp: '2026-08-18',
    responsibleEntity: 'Directorate of Higher Education (DHE)'
  },
  {
    id: 'alt-05',
    severity: 'INFO',
    title: 'EP4R Disbursement Results Verified',
    description: 'Independent Verification Agent (IVA) completed auditing EP4R DLR 2. Capitation grant timely disbursement reached 95.8%.',
    category: 'Data Quality',
    targetId: 'ep4r',
    targetType: 'project',
    timestamp: '2026-08-15',
    responsibleEntity: 'Directorate of Basic Education (DBE)'
  }
];

