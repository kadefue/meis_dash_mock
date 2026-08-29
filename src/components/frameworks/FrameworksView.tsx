import React, { useState, useMemo } from 'react';
import { 
  GitFork, 
  Target, 
  Globe2, 
  BookmarkCheck,
  Calendar,
  Layers,
  Building2,
  Coins,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { TheoryOfChangeExplorer } from './TheoryOfChangeExplorer';
import { formatCurrencyTZS } from '../../utils/performance';
import type { FrameworkId, PerformanceStatus } from '../../types/dashboard';

export const FrameworksView: React.FC = () => {
  const { 
    frameworks, 
    filters, 
    setFilters, 
    filteredIndicators, 
    openIndicatorByCode 
  } = useDashboard();

  const [selectedSubsectorId, setSelectedSubsectorId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const activeFwObj = frameworks.find(f => f.id === filters.frameworkId) || frameworks[0];
  const subsectors = activeFwObj.subsectors || [];

  const getFrameworkIcon = (id: FrameworkId) => {
    switch (id) {
      case 'esdp': return <GitFork className="w-5 h-5 text-blue-600" />;
      case 'sp': return <Target className="w-5 h-5 text-indigo-600" />;
      case 'sdg': return <Globe2 className="w-5 h-5 text-emerald-600" />;
      case 'ccm': return <BookmarkCheck className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: PerformanceStatus) => {
    switch (status) {
      case 'GREEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> On Target</span>;
      case 'YELLOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-600" /> At Risk</span>;
      case 'RED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Underperforming</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">⚪ No Data</span>;
    }
  };

  // Filter indicators for selected framework, subsector, search query and status filter
  const displayIndicators = useMemo(() => {
    return filteredIndicators.filter(ind => {
      // Subsector filter
      if (selectedSubsectorId !== 'all') {
        const sub = subsectors.find(s => s.id === selectedSubsectorId);
        if (sub && !sub.indicatorCodes.includes(ind.code)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = ind.code.toLowerCase().includes(q);
        const matchName = ind.name.toLowerCase().includes(q);
        const matchDept = ind.responsibleDepartmentName.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchDept) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const ratio = ind.actual !== null 
          ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
          : null;
        const currentStatus: PerformanceStatus = ratio === null ? 'NODATA' : ratio >= 90 ? 'GREEN' : ratio >= 70 ? 'YELLOW' : 'RED';
        if (statusFilter !== currentStatus) return false;
      }

      return true;
    });
  }, [filteredIndicators, selectedSubsectorId, subsectors, searchQuery, statusFilter]);

  // Compute table statistics
  const stats = useMemo(() => {
    let greenCount = 0;
    let yellowCount = 0;
    let redCount = 0;
    let totalScore = 0;
    let scoredCount = 0;

    displayIndicators.forEach(ind => {
      const ratio = ind.actual !== null 
        ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
        : null;
      if (ratio !== null) {
        totalScore += ratio;
        scoredCount++;
        if (ratio >= 90) greenCount++;
        else if (ratio >= 70) yellowCount++;
        else redCount++;
      }
    });

    const avgScore = scoredCount > 0 ? Math.round((totalScore / scoredCount) * 10) / 10 : 0;
    return { greenCount, yellowCount, redCount, avgScore, total: displayIndicators.length };
  }, [displayIndicators]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header Intro */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">National Education Frameworks Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrated monitoring across ESDP 2025-2030, Strategic Plan, SDG 4 and CCM Manifesto commitments.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1 font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>FY: {filters.reportingPeriod}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span>Framework: </span>
            <span className="text-blue-700 font-bold uppercase">{activeFwObj.code}</span>
          </div>
        </div>
      </div>

      {/* 4 Major Framework Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {frameworks.map((fw) => {
          const isSelected = filters.frameworkId === fw.id;
          return (
            <div 
              key={fw.id}
              onClick={() => {
                setFilters(prev => ({ ...prev, frameworkId: isSelected ? 'all' : fw.id }));
                setSelectedSubsectorId('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className={`dashboard-card p-5 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-blue-600 border-blue-500 shadow-md bg-blue-50/30' 
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  {getFrameworkIcon(fw.id)}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  fw.status === 'GREEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {fw.status === 'GREEN' ? 'On Target' : 'At Risk'}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{fw.code}</span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{fw.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{fw.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">FY {filters.reportingPeriod} Score</p>
                  <p className="text-xl font-black text-slate-900">{fw.overallScore}%</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">{fw.totalIndicators} Indicators</p>
                  <p className="text-[10px] text-emerald-600 font-bold">{fw.onTargetCount} On Target</p>
                </div>
              </div>

              {/* Status Mini Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex mt-3">
                <div style={{ width: `${(fw.onTargetCount / fw.totalIndicators) * 100}%` }} className="bg-emerald-500 h-full"></div>
                <div style={{ width: `${(fw.atRiskCount / fw.totalIndicators) * 100}%` }} className="bg-amber-500 h-full"></div>
                <div style={{ width: `${(fw.underperformingCount / fw.totalIndicators) * 100}%` }} className="bg-red-500 h-full"></div>
                <div style={{ width: `${(fw.noDataCount / fw.totalIndicators) * 100}%` }} className="bg-slate-300 h-full"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED FRAMEWORK DASHBOARD & SUBSECTORS */}
      {activeFwObj && (
        <div className="space-y-6">

          {/* Framework Executive Header Banner Card */}
          <div className="dashboard-card p-6 bg-slate-900 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Framework Profile • {activeFwObj.code} (FY {filters.reportingPeriod})</span>
                </div>
                <h3 className="text-2xl font-black text-white">{activeFwObj.fullName}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  {activeFwObj.description}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">FY {filters.reportingPeriod} Score</p>
                  <p className={`text-2xl font-black ${
                    activeFwObj.status === 'GREEN' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {activeFwObj.overallScore}%
                  </p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">On Target</p>
                  <p className="text-2xl font-black text-emerald-400">{activeFwObj.onTargetCount}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">At Risk</p>
                  <p className="text-2xl font-black text-amber-400">{activeFwObj.atRiskCount}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Subsectors</p>
                  <p className="text-2xl font-black text-blue-400">{subsectors.length}</p>
                </div>
              </div>
            </div>

            {/* Quick Subsector Tag Bar */}
            <div className="pt-4 flex items-center space-x-2 overflow-x-auto text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1">Subsectors:</span>
              <button
                onClick={() => setSelectedSubsectorId('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  selectedSubsectorId === 'all' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>All Subsectors</span>
              </button>
              {subsectors.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubsectorId(selectedSubsectorId === sub.id ? 'all' : sub.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    selectedSubsectorId === sub.id 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{sub.code}</span>
                  <span className="text-[10px] opacity-80">({sub.performanceScore}%)</span>
                </button>
              ))}
            </div>
          </div>

          {/* SUBSECTOR / COMPONENT BREAKDOWN GRID */}
          {subsectors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {activeFwObj.name} Subsectors & Components Breakdown ({subsectors.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Click a subsector card to filter indicators table below
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subsectors.map((sub) => {
                  const isSelected = selectedSubsectorId === sub.id;
                  return (
                    <div 
                      key={sub.id}
                      onClick={() => setSelectedSubsectorId(isSelected ? 'all' : sub.id)}
                      className={`dashboard-card p-4 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/40 shadow-md' 
                          : 'hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-900 text-white">
                            {sub.code}
                          </span>
                          {getStatusBadge(sub.status)}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">{sub.name}</h4>

                        <div className="mt-3 space-y-1 text-xs text-slate-600">
                          <p className="flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Lead: <strong className="text-slate-800">{sub.leadDepartmentName}</strong></span>
                          </p>
                          <p className="flex items-center space-x-1">
                            <Coins className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Budget: <strong className="text-slate-800">{formatCurrencyTZS(sub.allocatedBudgetTZS)} Millions TZS</strong></span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">FY {filters.reportingPeriod} Score</p>
                          <p className={`text-lg font-black ${
                            sub.status === 'GREEN' ? 'text-emerald-600' : sub.status === 'YELLOW' ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {sub.performanceScore}%
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold rounded text-[11px]">
                            {sub.indicatorCodes.length} Linked Metrics
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HIGHLY IMPROVED SEEDED FRAMEWORK INDICATOR RESULTS TABLE */}
          <div className="dashboard-card p-5 overflow-hidden">
            
            {/* Header & Controls Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                    {activeFwObj.code} M&E Matrix
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Linked Key Performance Indicators ({displayIndicators.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time accountability tracking against {activeFwObj.fullName} targets for FY {filters.reportingPeriod}.
                </p>
              </div>

              {/* Action Filters Bar */}
              <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
                
                {/* Search Box */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search code, name, division..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Status Filter Pill Buttons */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({stats.total})
                  </button>
                  <button
                    onClick={() => setStatusFilter('GREEN')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      statusFilter === 'GREEN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    🟢 On Target ({stats.greenCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('YELLOW')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      statusFilter === 'YELLOW' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    🟡 At Risk ({stats.yellowCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('RED')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      statusFilter === 'RED' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-50'
                    }`}
                  >
                    🔴 Delayed ({stats.redCount})
                  </button>
                </div>

                {/* Subsector Filter Dropdown */}
                <div className="flex items-center space-x-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  <select
                    value={selectedSubsectorId}
                    onChange={(e) => setSelectedSubsectorId(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">All Subsectors</option>
                    {subsectors.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.code}: {sub.name}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Quick Metrics Summary Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 text-xs">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Average Achievement</span>
                  <p className="font-black text-slate-900 text-sm">{stats.avgScore}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">On Target Rate</span>
                  <p className="font-black text-emerald-600 text-sm">
                    {stats.total > 0 ? Math.round((stats.greenCount / stats.total) * 100) : 0}% ({stats.greenCount}/{stats.total})
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">At Risk Metrics</span>
                  <p className="font-black text-amber-600 text-sm">{stats.yellowCount} Indicators</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Horizon</span>
                  <p className="font-black text-purple-700 text-sm">{activeFwObj.period}</p>
                </div>
              </div>
            </div>

            {/* Table Content */}
            {displayIndicators.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm font-bold text-slate-700">No indicators match your filter criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search query or status filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); setSelectedSubsectorId('all'); }}
                  className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                      <th className="p-3">Code</th>
                      <th className="p-3">Indicator Name & Description</th>
                      <th className="p-3">{activeFwObj.name} Strategic Objective Alignment</th>
                      <th className="p-3">Baseline</th>
                      <th className="p-3">FY {filters.reportingPeriod} Target</th>
                      <th className="p-3">FY {filters.reportingPeriod} Actual</th>
                      <th className="p-3 w-36">Achievement %</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Responsible Division</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                    {displayIndicators.map((ind) => {
                      const ratio = ind.actual !== null 
                        ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
                        : null;
                      const achievementPercent = ratio !== null ? Math.round(ratio * 10) / 10 : null;
                      const achievementFormatted = ratio !== null ? `${achievementPercent}%` : 'No Data';

                      // Find framework specific alignment
                      const alignment = ind.alignedFrameworks.find(af => af.frameworkId === activeFwObj.id);
                      
                      // Resolve matching subsector name
                      const matchedSub = subsectors.find(s => s.indicatorCodes.includes(ind.code));

                      const statusType: PerformanceStatus = ratio === null ? 'NODATA' : ratio >= 90 ? 'GREEN' : ratio >= 70 ? 'YELLOW' : 'RED';

                      return (
                        <tr key={ind.code} className="hover:bg-blue-50/40 transition-colors">
                          
                          {/* Code */}
                          <td className="p-3 font-mono font-black text-blue-700 whitespace-nowrap">
                            <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded">
                              {ind.code}
                            </span>
                          </td>

                          {/* Indicator Name */}
                          <td className="p-3 max-w-xs">
                            <p className="font-bold text-slate-900 leading-snug">{ind.name}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ind.definition}</p>
                            {matchedSub && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                                {matchedSub.code}: {matchedSub.name}
                              </span>
                            )}
                          </td>

                          {/* Framework Specific Alignment */}
                          <td className="p-3 max-w-xs">
                            {alignment ? (
                              <div>
                                <p className="font-semibold text-slate-800 leading-snug">{alignment.objective}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                    alignment.contributionType === 'Direct' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {alignment.contributionType}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">Target: {alignment.target}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Sector-Wide Alignment</span>
                            )}
                          </td>

                          {/* Baseline */}
                          <td className="p-3 whitespace-nowrap font-medium text-slate-600">
                            {ind.baseline} {ind.unit} <span className="text-[10px] text-slate-400">({ind.baselineYear})</span>
                          </td>

                          {/* Target */}
                          <td className="p-3 whitespace-nowrap font-bold text-slate-700">
                            {ind.target} {ind.unit}
                          </td>

                          {/* Actual */}
                          <td className="p-3 whitespace-nowrap font-black text-slate-900">
                            {ind.actual !== null ? `${ind.actual} ${ind.unit}` : <span className="text-slate-400 italic">No Data</span>}
                          </td>

                          {/* Achievement % with Visual Progress Bar */}
                          <td className="p-3 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between font-black text-slate-900">
                                <span>{achievementFormatted}</span>
                              </div>
                              {ratio !== null && (
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                                  <div 
                                    style={{ width: `${Math.min(ratio, 100)}%` }} 
                                    className={`h-full rounded-full ${
                                      ratio >= 90 ? 'bg-emerald-500' : ratio >= 70 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3 whitespace-nowrap">
                            {getStatusBadge(statusType)}
                          </td>

                          {/* Responsible Division */}
                          <td className="p-3 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                              <Building2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                              <span className="truncate max-w-[140px]" title={ind.responsibleDepartmentName}>
                                {ind.responsibleDepartmentName}
                              </span>
                            </div>
                          </td>

                          {/* Inspect Action */}
                          <td className="p-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => openIndicatorByCode(ind.code)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 mx-auto"
                            >
                              <span>Inspect</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Main Theory of Change Section */}
      <TheoryOfChangeExplorer />

    </div>
  );
};
