import React from 'react';
import { 
  GitFork, 
  Target, 
  Globe2, 
  BookmarkCheck,
  Calendar
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { TheoryOfChangeExplorer } from './TheoryOfChangeExplorer';
import type { FrameworkId } from '../../types/dashboard';

export const FrameworksView: React.FC = () => {
  const { frameworks, filters, setFilters } = useDashboard();

  const getFrameworkIcon = (id: FrameworkId) => {
    switch (id) {
      case 'esdp': return <GitFork className="w-5 h-5 text-blue-600" />;
      case 'sp': return <Target className="w-5 h-5 text-indigo-600" />;
      case 'sdg': return <Globe2 className="w-5 h-5 text-emerald-600" />;
      case 'ccm': return <BookmarkCheck className="w-5 h-5 text-amber-600" />;
    }
  };

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
            <span className="text-blue-700 font-bold uppercase">{filters.frameworkId}</span>
          </div>
        </div>
      </div>

      {/* 4 Major Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {frameworks.map((fw) => {
          const isSelected = filters.frameworkId === fw.id;
          return (
            <div 
              key={fw.id}
              onClick={() => setFilters(prev => ({ ...prev, frameworkId: isSelected ? 'all' : fw.id }))}
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

      {/* Main Theory of Change Section */}
      <TheoryOfChangeExplorer />

    </div>
  );
};
