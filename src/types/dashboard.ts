export type FrameworkId = 'esdp' | 'sp' | 'sdg' | 'ccm';

export type PerformanceStatus = 'GREEN' | 'YELLOW' | 'RED' | 'NODATA';

export type TocNodeType = 
  | 'FRAMEWORK' 
  | 'STRATEGIC_PRIORITY' 
  | 'OUTCOME' 
  | 'INTERMEDIATE_OUTCOME' 
  | 'OUTPUT' 
  | 'ACTIVITY' 
  | 'INDICATOR';

export interface IndicatorMetadata {
  code: string;
  name: string;
  definition: string;
  unit: string;
  baseline: number;
  baselineYear: string;
  target: number;
  targetYear: string;
  actual: number | null;
  previousActual?: number;
  isInverse?: boolean; // Lower is better (e.g. Dropout rate, Pupil-Teacher ratio)
  reportingFrequency: 'Quarterly' | 'Bi-Annually' | 'Annually';
  dataSource: string;
  responsibleDepartmentId: string;
  responsibleDepartmentName: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Audited';
  lastUpdated: string;
  relatedProjectIds: string[];
  alignedFrameworks: {
    frameworkId: FrameworkId;
    frameworkName: string;
    objective: string;
    target: string;
    contributionType: 'Direct' | 'Contributing';
  }[];
  historicalTrend: {
    year: string;
    planned: number;
    actual: number | null;
  }[];
  regionalPerformance?: {
    region: string;
    actual: number;
    target: number;
    status: PerformanceStatus;
  }[];
  riskFactors?: string[];
  recommendedActions?: string[];
  contributingOutputIds?: string[];
}

export interface TheoryOfChangeNode {
  id: string;
  parentId: string | null;
  frameworkId: FrameworkId;
  type: TocNodeType;
  code: string;
  name: string;
  description: string;
  departmentId: string;
  departmentName: string;
  projectIds: string[];
  indicatorIds: string[];
  target: number;
  actual: number | null;
  achievement: number | null; // Percentage 0 - 100+
  status: PerformanceStatus;
  indicatorCount: number;
  children?: TheoryOfChangeNode[];
}

export interface Framework {
  id: FrameworkId;
  code: string;
  name: string;
  fullName: string;
  period: string;
  description: string;
  overallScore: number;
  status: PerformanceStatus;
  onTargetCount: number;
  atRiskCount: number;
  underperformingCount: number;
  noDataCount: number;
  totalIndicators: number;
  trend: 'Up' | 'Stable' | 'Down';
  keyObjectivesCount: number;
  strategiesCount: number;
}

export interface ProjectComponent {
  id: string;
  name: string;
  budgetUSD: number;
  expenditureUSD: number;
  physicalProgress: number; // %
  status: PerformanceStatus;
  subcomponentsCount: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  fullName: string;
  funder: string;
  budgetUSD: number;
  disbursedUSD: number;
  expenditureUSD: number;
  overallPerformance: number; // %
  physicalProgress: number; // %
  financialProgress: number; // %
  milestoneAchievement: number; // %
  resultsAchievement: number; // %
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: PerformanceStatus;
  delayedActivitiesCount: number;
  totalIndicators: number;
  completionPercentage: number;
  leadDepartmentId: string;
  leadDepartmentName: string;
  startDate: string;
  endDate: string;
  components: ProjectComponent[];
}

export interface Department {
  id: string;
  code: string;
  name: string;
  directorate: string;
  headOfDepartment: string;
  overallPerformance: number;
  status: PerformanceStatus;
  indicatorsCount: number;
  targetsCount: number;
  activitiesCount: number;
  projectsCount: number;
  budgetAllocatedTZS: number; // Millions TZS
  budgetUtilizedTZS: number; // Millions TZS
  budgetUtilizationRate: number; // %
  delayedActivitiesCount: number;
  atRiskIndicatorsCount: number;
  strategicObjectives: string[];
}

export interface ManagementAlert {
  id: string;
  severity: 'RED' | 'YELLOW' | 'INFO';
  title: string;
  description: string;
  category: 'Indicator' | 'Project' | 'Department' | 'Data Quality';
  targetId: string;
  targetType: 'indicator' | 'project' | 'department';
  timestamp: string;
  responsibleEntity: string;
}

export interface GlobalFilters {
  reportingPeriod: string;
  financialYear: string;
  frameworkId: FrameworkId | 'all';
  departmentId: string | 'all';
  projectId: string | 'all';
  status: PerformanceStatus | 'all';
  searchQuery: string;
}
