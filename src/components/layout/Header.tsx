import React from 'react';
import { 
  Search, 
  Bell, 
  Filter, 
  Calendar, 
  ChevronRight, 
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import type { MainTab } from '../../context/DashboardContext';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    filters, 
    setFilters, 
    resetFilters,
    drillDownPath,
    popDrillDown,
    resetDrillDown,
    viewMode,
    setViewMode,
    frameworks,
    departments,
    projects,
    alerts,
    setIsAlertDrawerOpen
  } = useDashboard();

  const activeAlertsCount = alerts.filter(a => a.severity === 'RED' || a.severity === 'YELLOW').length;

  const handleFrameworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, frameworkId: e.target.value as any }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, departmentId: e.target.value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, projectId: e.target.value }));
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, reportingPeriod: e.target.value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const getPageTitle = (tab: MainTab): string => {
    switch (tab) {
      case 'overview': return 'Executive Overview';
      case 'frameworks': return 'National Education Frameworks';
      case 'projects': return 'Projects & Programs';
      case 'departments': return 'Ministry Directorates & Departments';
      case 'cross-cutting': return 'Cross-Framework Alignment Matrix';
      case 'indicators': return 'Indicators & Results Registry';
      case 'alerts': return 'Management Attention & Alerts';
      case 'data-quality': return 'Data Quality & Verification Audit';
      case 'settings': return 'System Configurations & M&E Rules';
      default: return 'MoEST M&E Dashboard';
    }
  };

  // Contextual filter visibility rules:
  // Overview: FY (Period) only.
  // Frameworks: FY + Frameworks only.
  // Projects: FY + Projects only.
  // Departments: FY + Departments only.
  // Cross-Cutting & Indicators: FY + Frameworks + Projects + Departments.
  const showFrameworkFilter = activeTab === 'frameworks' || activeTab === 'cross-cutting' || activeTab === 'indicators';
  const showProjectFilter = activeTab === 'projects' || activeTab === 'cross-cutting' || activeTab === 'indicators';
  const showDepartmentFilter = activeTab === 'departments' || activeTab === 'cross-cutting' || activeTab === 'indicators';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4 border-b border-slate-100">
        
        {/* Left: Breadcrumbs & Navigation Path */}
        <div className="flex items-center space-x-3 overflow-hidden">
          {activeTab === 'frameworks' && drillDownPath.length > 1 && (
            <div className="flex items-center space-x-2 mr-2">
              <button
                onClick={popDrillDown}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Go back one level"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={resetDrillDown}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Reset drill-down to root"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          )}

          <div>
            <div className="flex items-center text-xs text-slate-500 font-medium space-x-1.5">
              <span>MoEST M&E</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize text-slate-700 font-semibold">{activeTab}</span>
              
              {/* Show drill-down breadcrumb if in TOC drill-down */}
              {activeTab === 'frameworks' && drillDownPath.length > 1 && (
                <>
                  {drillDownPath.map((node, idx) => (
                    <React.Fragment key={node.id}>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className={`truncate max-w-[150px] ${idx === drillDownPath.length - 1 ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                        {node.code}
                      </span>
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              {getPageTitle(activeTab)}
            </h1>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center max-w-md w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search indicators, projects, targets, codes..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Right: Controls, View Mode Toggle & User Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Executive vs Technical View Mode Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('executive')}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 transition-all ${
                viewMode === 'executive'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Executive</span>
            </button>
            <button
              onClick={() => setViewMode('technical')}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 transition-all ${
                viewMode === 'technical'
                  ? 'bg-slate-900 text-emerald-400 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Technical M&E</span>
            </button>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setIsAlertDrawerOpen(true)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Management Alerts"
          >
            <Bell className="w-5 h-5" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-xs">
              PS
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">Prof. Carolyne I. Nombo</p>
              <p className="text-[10px] text-slate-500 font-medium">Permanent Secretary, MoEST</p>
            </div>
          </div>

        </div>
      </div>

      {/* Filter Bar Header */}
      <div className="px-6 py-2 bg-slate-50 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Global Filters:</span>
          </div>

          {/* Financial Year / Reporting Period (Always Visible) */}
          <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1 space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">FY:</span>
            <select
              value={filters.reportingPeriod}
              onChange={handlePeriodChange}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value="2024/25">2024/25 FY</option>
              <option value="2025/26">2025/26 FY</option>
              <option value="2026/27">2026/27 FY (Current)</option>
              <option value="2027/28">2027/28 FY</option>
            </select>
          </div>

          {/* Framework Selector - Only shown in Frameworks, Cross-Cutting & Indicators views */}
          {showFrameworkFilter && (
            <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1 space-x-1">
              <span className="text-slate-500 font-medium">Framework:</span>
              <select
                value={filters.frameworkId}
                onChange={handleFrameworkChange}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all">All Frameworks</option>
                {frameworks.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                ))}
              </select>
            </div>
          )}

          {/* Project Selector - Only shown in Projects, Cross-Cutting & Indicators views */}
          {showProjectFilter && (
            <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1 space-x-1">
              <span className="text-slate-500 font-medium">Project:</span>
              <select
                value={filters.projectId}
                onChange={handleProjectChange}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code}</option>
                ))}
              </select>
            </div>
          )}

          {/* Department Selector - Only shown in Departments, Cross-Cutting & Indicators views */}
          {showDepartmentFilter && (
            <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1 space-x-1">
              <span className="text-slate-500 font-medium">Department:</span>
              <select
                value={filters.departmentId}
                onChange={handleDepartmentChange}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer max-w-[180px] truncate"
              >
                <option value="all">All Directorates</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters button if any non-default filter is active */}
          {(filters.frameworkId !== 'all' || filters.departmentId !== 'all' || filters.projectId !== 'all' || filters.searchQuery !== '') && (
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-2 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Active View Badge */}
        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Status: <strong className="text-slate-700">Operational (Q3 2026/27 Live)</strong></span>
        </div>
      </div>
    </header>
  );
};
