import React, { useState } from 'react';
import { 
  GitFork, 
  Target, 
  Globe2, 
  BookmarkCheck,
  Calendar,
  Layers,
  Building2,
  Coins,
  Filter
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 On Target</span>;
      case 'YELLOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 At Risk</span>;
      case 'RED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">🔴 Underperforming</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">⚪ No Data</span>;
    }
  };

  // Filter indicators for selected framework & optional subsector
  const displayIndicators = filteredIndicators.filter(ind => {
    if (selectedSubsectorId === 'all') return true;
    const sub = subsectors.find(s => s.id === selectedSubsectorId);
    if (!sub) return true;
    return sub.indicatorCodes.includes(ind.code);
  });

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
          <div className="dashboard-card p-6 bg-slate-900 text-white">
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

          {/* SUBSECTOR / COMPONENT BREAKDOWN GRID (Like Projects View Components) */}
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

          {/* SEEDED FRAMEWORK INDICATOR RESULTS TABLE (Like Projects View) */}
          <div className="dashboard-card p-5 overflow-x-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {activeFwObj.name} Seeded Key Performance Indicators ({displayIndicators.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed indicators matrix for {activeFwObj.fullName} • FY {filters.reportingPeriod}
                </p>
              </div>

              {/* Subsector Filter Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-slate-700">Filter Subsector:</span>
                <select
                  value={selectedSubsectorId}
                  onChange={(e) => setSelectedSubsectorId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">All Subsectors</option>
                  {subsectors.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.code}: {sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {displayIndicators.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center">No indicators found for this subsector filter.</p>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Code</th>
                    <th className="p-3">Indicator Name</th>
                    <th className="p-3">Subsector / Component</th>
                    <th className="p-3">FY {filters.reportingPeriod} Target</th>
                    <th className="p-3">FY {filters.reportingPeriod} Actual</th>
                    <th className="p-3">Achievement %</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Responsible Division</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {displayIndicators.map((ind) => {
                    const ratio = ind.actual !== null 
                      ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
                      : null;
                    const achievementFormatted = ratio !== null ? `${Math.round(ratio * 10) / 10}%` : 'N/A';

                    // Resolve matching subsector name
                    const matchedSub = subsectors.find(s => s.indicatorCodes.includes(ind.code));

                    return (
                      <tr key={ind.code} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-700">{ind.code}</td>
                        <td className="p-3 font-bold text-slate-900 max-w-xs">{ind.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold text-[11px] border border-blue-100">
                            {matchedSub ? matchedSub.code : 'General Sector'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">{ind.target} {ind.unit}</td>
                        <td className="p-3 font-bold">{ind.actual !== null ? `${ind.actual} ${ind.unit}` : 'No Data'}</td>
                        <td className="p-3 font-black text-slate-900">{achievementFormatted}</td>
                        <td className="p-3">{getStatusBadge(ratio === null ? 'NODATA' : ratio >= 90 ? 'GREEN' : ratio >= 70 ? 'YELLOW' : 'RED')}</td>
                        <td className="p-3 font-medium text-slate-600">{ind.responsibleDepartmentName}</td>
                        <td className="p-3">
                          <button
                            onClick={() => openIndicatorByCode(ind.code)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

      {/* Main Theory of Change Section */}
      <TheoryOfChangeExplorer />

    </div>
  );
};
