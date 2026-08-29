import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { 
  PerformanceStatus, 
  GlobalFilters, 
  TheoryOfChangeNode, 
  IndicatorMetadata, 
  Project, 
  Department, 
  Framework,
  ManagementAlert
} from '../types/dashboard';
import { 
  mockFrameworks, 
  mockProjects, 
  mockDepartments, 
  mockIndicators, 
  mockTheoryOfChangeTrees,
  mockAlerts 
} from '../data/mockData';

export type MainTab = 
  | 'overview' 
  | 'frameworks' 
  | 'projects' 
  | 'departments' 
  | 'cross-cutting' 
  | 'indicators' 
  | 'reports' 
  | 'alerts' 
  | 'data-quality' 
  | 'settings';

export type TocVisualizationMode = 'tree' | 'chart' | 'flow' | 'table';

interface DashboardContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  resetFilters: () => void;
  
  selectedTocNode: TheoryOfChangeNode | null;
  setSelectedTocNode: (node: TheoryOfChangeNode | null) => void;
  drillDownPath: TheoryOfChangeNode[];
  drillDownToNode: (node: TheoryOfChangeNode) => void;
  popDrillDown: () => void;
  resetDrillDown: () => void;
  
  selectedIndicator: IndicatorMetadata | null;
  setSelectedIndicator: (indicator: IndicatorMetadata | null) => void;
  openIndicatorByCode: (code: string) => void;
  
  viewMode: 'executive' | 'technical';
  setViewMode: (mode: 'executive' | 'technical') => void;
  
  tocVisualization: TocVisualizationMode;
  setTocVisualization: (mode: TocVisualizationMode) => void;
  
  isAlertDrawerOpen: boolean;
  setIsAlertDrawerOpen: (open: boolean) => void;
  
  // Datasets (Dynamically computed based on selected Financial Year & Framework)
  frameworks: Framework[];
  projects: Project[];
  departments: Department[];
  indicators: IndicatorMetadata[];
  theoryOfChangeTree: TheoryOfChangeNode;
  alerts: ManagementAlert[];
  
  // Computed values
  filteredIndicators: IndicatorMetadata[];
  selectedProject: Project | null;
  selectedDepartment: Department | null;
  selectedFramework: Framework | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('overview');
  
  const [filters, setFilters] = useState<GlobalFilters>({
    reportingPeriod: '2026/27',
    financialYear: '2026/27',
    frameworkId: 'all',
    departmentId: 'all',
    projectId: 'all',
    status: 'all',
    searchQuery: ''
  });

  // Dynamically resolve indicator target & actual based on selected reportingPeriod
  const indicators = useMemo(() => {
    const period = filters.reportingPeriod;
    return mockIndicators.map(ind => {
      if (ind.periodData && ind.periodData[period]) {
        const pData = ind.periodData[period];
        return {
          ...ind,
          target: pData.target,
          actual: pData.actual
        };
      }
      return ind;
    });
  }, [filters.reportingPeriod]);

  // Dynamically resolve project progress based on selected reportingPeriod
  const projects = useMemo(() => {
    const period = filters.reportingPeriod;
    return mockProjects.map(proj => {
      if (proj.periodData && proj.periodData[period]) {
        const pData = proj.periodData[period];
        return {
          ...proj,
          physicalProgress: pData.physicalProgress,
          financialProgress: pData.financialProgress,
          milestoneAchievement: pData.milestoneAchievement,
          resultsAchievement: pData.resultsAchievement,
          overallPerformance: pData.overallPerformance,
          status: (pData.overallPerformance === 0 ? 'NODATA' : pData.overallPerformance >= 80 ? 'GREEN' : pData.overallPerformance >= 70 ? 'YELLOW' : 'RED') as PerformanceStatus
        };
      }
      return proj;
    });
  }, [filters.reportingPeriod]);

  // Dynamically compute Framework scores based on indicators for selected period
  const frameworks = useMemo(() => {
    return mockFrameworks.map(fw => {
      const fwIndicators = indicators.filter(ind => 
        ind.alignedFrameworks.some(af => af.frameworkId === fw.id)
      );
      if (fwIndicators.length === 0) return fw;

      let totalScore = 0;
      let onTarget = 0;
      let atRisk = 0;
      let underperforming = 0;
      let noData = 0;

      fwIndicators.forEach(ind => {
        if (ind.actual === null || ind.actual === undefined) {
          noData++;
        } else {
          const ratio = ind.isInverse 
            ? (ind.target / ind.actual) * 100 
            : (ind.actual / ind.target) * 100;
          totalScore += ratio;
          if (ratio >= 90) onTarget++;
          else if (ratio >= 70) atRisk++;
          else underperforming++;
        }
      });

      const validCount = fwIndicators.length - noData;
      const avgScore = validCount > 0 ? Math.round((totalScore / validCount) * 10) / 10 : 0;

      return {
        ...fw,
        overallScore: avgScore,
        onTargetCount: onTarget,
        atRiskCount: atRisk,
        underperformingCount: underperforming,
        noDataCount: noData,
        status: (validCount === 0 ? 'NODATA' : avgScore >= 80 ? 'GREEN' : avgScore >= 70 ? 'YELLOW' : 'RED') as PerformanceStatus
      };
    });
  }, [indicators]);

  // Dynamically compute Department performance based on indicators for selected period
  const departments = useMemo(() => {
    return mockDepartments.map(dept => {
      const deptIndicators = indicators.filter(ind => ind.responsibleDepartmentId === dept.id);
      if (deptIndicators.length === 0) return dept;

      let totalScore = 0;
      let atRiskCount = 0;
      let validCount = 0;

      deptIndicators.forEach(ind => {
        if (ind.actual !== null && ind.actual !== undefined) {
          const ratio = ind.isInverse 
            ? (ind.target / ind.actual) * 100 
            : (ind.actual / ind.target) * 100;
          totalScore += ratio;
          validCount++;
          if (ratio < 90) atRiskCount++;
        }
      });

      const avgScore = validCount > 0 ? Math.round((totalScore / validCount) * 10) / 10 : 0;

      return {
        ...dept,
        overallPerformance: avgScore,
        atRiskIndicatorsCount: atRiskCount,
        status: (validCount === 0 ? 'NODATA' : avgScore >= 80 ? 'GREEN' : avgScore >= 70 ? 'YELLOW' : 'RED') as PerformanceStatus
      };
    });
  }, [indicators]);

  // Dynamic Theory of Change root node resolving based on selected Framework
  const theoryOfChangeTree = useMemo(() => {
    const fwId = filters.frameworkId === 'all' ? 'esdp' : filters.frameworkId;
    const baseTree = mockTheoryOfChangeTrees[fwId] || mockTheoryOfChangeTrees.esdp;
    const fwObj = frameworks.find(f => f.id === fwId);
    const score = fwObj ? fwObj.overallScore : (baseTree.achievement ?? 0);
    return {
      ...baseTree,
      achievement: score,
      actual: score > 0 ? score : null,
      status: (fwObj?.status || 'NODATA') as PerformanceStatus
    };
  }, [filters.frameworkId, frameworks]);
  
  const [drillDownPath, setDrillDownPath] = useState<TheoryOfChangeNode[]>([theoryOfChangeTree]);
  const [selectedTocNode, setSelectedTocNodeState] = useState<TheoryOfChangeNode | null>(theoryOfChangeTree);

  // Sync drill-down path when theoryOfChangeTree changes
  useEffect(() => {
    setDrillDownPath([theoryOfChangeTree]);
    setSelectedTocNodeState(theoryOfChangeTree);
  }, [theoryOfChangeTree]);
  
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorMetadata | null>(null);
  const [viewMode, setViewMode] = useState<'executive' | 'technical'>('executive');
  const [tocVisualization, setTocVisualization] = useState<TocVisualizationMode>('tree');
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);

  const resetFilters = () => {
    setFilters({
      reportingPeriod: '2026/27',
      financialYear: '2026/27',
      frameworkId: 'all',
      departmentId: 'all',
      projectId: 'all',
      status: 'all',
      searchQuery: ''
    });
  };

  const setSelectedTocNode = (node: TheoryOfChangeNode | null) => {
    setSelectedTocNodeState(node);
  };

  const drillDownToNode = (node: TheoryOfChangeNode) => {
    setSelectedTocNodeState(node);
    const existingIndex = drillDownPath.findIndex(p => p.id === node.id);
    if (existingIndex !== -1) {
      setDrillDownPath(drillDownPath.slice(0, existingIndex + 1));
    } else {
      setDrillDownPath([...drillDownPath, node]);
    }
  };

  const popDrillDown = () => {
    if (drillDownPath.length > 1) {
      const newPath = drillDownPath.slice(0, drillDownPath.length - 1);
      setDrillDownPath(newPath);
      setSelectedTocNodeState(newPath[newPath.length - 1]);
    }
  };

  const resetDrillDown = () => {
    setDrillDownPath([theoryOfChangeTree]);
    setSelectedTocNodeState(theoryOfChangeTree);
  };

  const openIndicatorByCode = (code: string) => {
    const ind = indicators.find(i => i.code === code);
    if (ind) {
      setSelectedIndicator(ind);
    }
  };

  const filteredIndicators = useMemo(() => {
    return indicators.filter(ind => {
      if (filters.frameworkId !== 'all') {
        const hasFramework = ind.alignedFrameworks.some(af => af.frameworkId === filters.frameworkId);
        if (!hasFramework) return false;
      }
      if (filters.departmentId !== 'all' && ind.responsibleDepartmentId !== filters.departmentId) {
        return false;
      }
      if (filters.projectId !== 'all' && !ind.relatedProjectIds.includes(filters.projectId)) {
        return false;
      }
      if (filters.status !== 'all') {
        let indStatus: PerformanceStatus = 'NODATA';
        if (ind.actual !== null) {
          const ratio = ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100;
          if (ratio >= 90) indStatus = 'GREEN';
          else if (ratio >= 70) indStatus = 'YELLOW';
          else indStatus = 'RED';
        }
        if (indStatus !== filters.status) return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const match = ind.code.toLowerCase().includes(query) ||
                      ind.name.toLowerCase().includes(query) ||
                      ind.responsibleDepartmentName.toLowerCase().includes(query) ||
                      ind.definition.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [indicators, filters]);

  const selectedProject = useMemo(() => {
    if (filters.projectId === 'all') return null;
    return projects.find(p => p.id === filters.projectId) || null;
  }, [projects, filters.projectId]);

  const selectedDepartment = useMemo(() => {
    if (filters.departmentId === 'all') return null;
    return departments.find(d => d.id === filters.departmentId) || null;
  }, [departments, filters.departmentId]);

  const selectedFramework = useMemo(() => {
    if (filters.frameworkId === 'all') return null;
    return frameworks.find(f => f.id === filters.frameworkId) || null;
  }, [frameworks, filters.frameworkId]);

  return (
    <DashboardContext.Provider value={{
      activeTab,
      setActiveTab,
      filters,
      setFilters,
      resetFilters,
      selectedTocNode,
      setSelectedTocNode,
      drillDownPath,
      drillDownToNode,
      popDrillDown,
      resetDrillDown,
      selectedIndicator,
      setSelectedIndicator,
      openIndicatorByCode,
      viewMode,
      setViewMode,
      tocVisualization,
      setTocVisualization,
      isAlertDrawerOpen,
      setIsAlertDrawerOpen,
      frameworks,
      projects,
      departments,
      indicators,
      theoryOfChangeTree,
      alerts: mockAlerts,
      filteredIndicators,
      selectedProject,
      selectedDepartment,
      selectedFramework
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
