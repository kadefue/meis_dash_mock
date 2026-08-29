import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  GitFork, 
  ShieldAlert 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { calculateAchievement, calculatePerformanceStatus, calculateVariance, getStatusText } from '../../utils/performance';

export const IndicatorDetailModal: React.FC = () => {
  const { selectedIndicator, setSelectedIndicator } = useDashboard();
  const [activeTab, setActiveTab] = useState<'overview' | 'red-analysis' | 'trace-upward' | 'regional' | 'alignment'>('overview');

  if (!selectedIndicator) return null;

  const ind = selectedIndicator;
  const achievement = calculateAchievement(ind.target, ind.actual, ind.isInverse);
  const status = calculatePerformanceStatus(achievement);
  const variance = calculateVariance(ind.target, ind.actual, ind.isInverse);

  const isUnderperformingOrRisk = status === 'RED' || status === 'YELLOW';

  // Regional chart data
  const regionalData = ind.regionalPerformance || [
    { region: 'Dar es Salaam', actual: ind.actual ? ind.actual * 1.15 : 80, target: ind.target, status: 'GREEN' },
    { region: 'Arusha', actual: ind.actual ? ind.actual * 1.05 : 75, target: ind.target, status: 'GREEN' },
    { region: 'Mwanza', actual: ind.actual ? ind.actual * 0.95 : 68, target: ind.target, status: 'YELLOW' },
    { region: 'Dodoma', actual: ind.actual ? ind.actual * 0.88 : 62, target: ind.target, status: 'YELLOW' },
    { region: 'Tabora', actual: ind.actual ? ind.actual * 0.72 : 50, target: ind.target, status: 'RED' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-1 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-black bg-blue-600 text-white">
                {ind.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                status === 'GREEN' ? 'bg-emerald-500 text-white' : status === 'YELLOW' ? 'bg-amber-500 text-slate-900' : 'bg-red-500 text-white'
              }`}>
                {getStatusText(status)}
              </span>
              {ind.isInverse && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-400/30">
                  Inverse Logic (Lower is Better)
                </span>
              )}
            </div>
            <h2 className="text-lg font-black text-white leading-snug">{ind.name}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">{ind.definition}</p>
          </div>
          <button
            onClick={() => setSelectedIndicator(null)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center space-x-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Performance Overview
          </button>
          
          {isUnderperformingOrRisk && (
            <button
              onClick={() => setActiveTab('red-analysis')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'red-analysis' ? 'bg-red-600 text-white shadow-xs font-bold' : 'text-red-700 bg-red-50 hover:bg-red-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Why Is This Indicator Red?</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('trace-upward')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'trace-upward' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-blue-500" />
            <span>Trace Upward Result Chain</span>
          </button>

          <button
            onClick={() => setActiveTab('alignment')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'alignment' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cross-Framework Alignment
          </button>

          <button
            onClick={() => setActiveTab('regional')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'regional' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regional Comparison
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Baseline ({ind.baselineYear})</p>
                  <p className="text-xl font-black text-slate-700 mt-1">{ind.baseline} {ind.unit}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Annual Target ({ind.targetYear})</p>
                  <p className="text-xl font-black text-blue-700 mt-1">{ind.target} {ind.unit}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Current Value</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{ind.actual !== null ? `${ind.actual} ${ind.unit}` : 'No Data'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Achievement %</p>
                  <p className={`text-xl font-black mt-1 ${
                    status === 'GREEN' ? 'text-emerald-600' : status === 'YELLOW' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {achievement !== null ? `${achievement}%` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Historical Trend Line Chart */}
              <div className="dashboard-card p-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Historical & Forecast Trend</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ind.historicalTrend} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="planned" name="Planned Target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
                      <Line type="monotone" dataKey="actual" name="Actual Achievement" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Metadata Table */}
              <div className="dashboard-card p-4 text-xs space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Technical Metadata</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div><span className="text-slate-400">Responsible Dept:</span> <p className="font-bold text-slate-800">{ind.responsibleDepartmentName}</p></div>
                  <div><span className="text-slate-400">Data Source:</span> <p className="font-bold text-slate-800">{ind.dataSource}</p></div>
                  <div><span className="text-slate-400">Reporting Frequency:</span> <p className="font-bold text-slate-800">{ind.reportingFrequency}</p></div>
                  <div><span className="text-slate-400">Verification Status:</span> <p className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">{ind.verificationStatus}</p></div>
                  <div><span className="text-slate-400">Last Updated:</span> <p className="font-bold text-slate-800">{ind.lastUpdated}</p></div>
                  <div><span className="text-slate-400">Related Projects:</span> <p className="font-bold text-purple-700">{ind.relatedProjectIds.join(', ').toUpperCase()}</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'red-analysis' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center space-x-2 text-red-800 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>Diagnostic Root Cause Analysis: Underperforming / At-Risk Metric</span>
                </div>
                <p className="text-xs text-red-700 mt-1">
                  Performance is currently at <strong className="font-black">{achievement}%</strong> of target (Variance: {variance?.formatted}). Below are verified risk factors and recommended interventions.
                </p>
              </div>

              {/* Risk Factors */}
              <div className="dashboard-card p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Verified Bottlenecks & Risk Factors:</h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {ind.riskFactors ? (
                    ind.riskFactors.map((rf, i) => (
                      <li key={i} className="flex items-start space-x-2 p-2 bg-slate-50 rounded border border-slate-100">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{rf}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-slate-500">Delay in regional rollout and offline digital content distribution.</li>
                  )}
                </ul>
              </div>

              {/* Recommended Management Actions */}
              <div className="dashboard-card p-4 bg-emerald-50/50 border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Recommended Executive Interventions:</h4>
                <ul className="space-y-2 text-xs text-slate-800">
                  {ind.recommendedActions ? (
                    ind.recommendedActions.map((ra, i) => (
                      <li key={i} className="flex items-start space-x-2 p-2 bg-white rounded border border-emerald-200 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{ra}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-slate-700">Reallocate emergency technical assistance funds to accelerate local capacity building.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'trace-upward' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <h4 className="font-bold text-blue-900 text-sm mb-1">Upward Result Chain Traceability</h4>
                <p className="text-blue-800">
                  Understanding why this indicator matters and which national frameworks and strategic objectives it delivers on.
                </p>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-dashed border-blue-400">
                <div className="p-3 bg-slate-900 text-white rounded-xl text-xs">
                  <span className="text-[10px] font-black text-emerald-400 uppercase">National Framework Level</span>
                  <p className="font-bold text-sm mt-0.5">ESDP 2025/26–2029/30 & MoEST Strategic Plan</p>
                </div>
                <div className="p-3 bg-indigo-900 text-white rounded-xl text-xs">
                  <span className="text-[10px] font-black text-indigo-300 uppercase">Strategic Priority Level</span>
                  <p className="font-bold text-sm mt-0.5">Priority 1: Quality Teaching & Learning Infrastructure</p>
                </div>
                <div className="p-3 bg-teal-900 text-white rounded-xl text-xs">
                  <span className="text-[10px] font-black text-teal-300 uppercase">Outcome Level</span>
                  <p className="font-bold text-sm mt-0.5">Outcome 1.1: Improved Classroom Learning Quality & Retention</p>
                </div>
                <div className="p-3 bg-blue-600 text-white rounded-xl text-xs font-bold">
                  <span className="text-[10px] font-black text-blue-200 uppercase">Indicator Metric</span>
                  <p className="text-sm mt-0.5">{ind.name}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alignment' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Multiframework Mapping Matrix</h4>
              <p className="text-xs text-slate-500">How this single indicator simultaneously contributes to 4 national frameworks:</p>

              <div className="space-y-2.5">
                {ind.alignedFrameworks.map((af, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white">{af.frameworkName}</span>
                      <p className="font-bold text-slate-900 mt-1">{af.objective}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">Target: {af.target}</span>
                      <p className="text-[10px] text-emerald-700 font-semibold">{af.contributionType} Contribution</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'regional' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Regional Variance Breakdown</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="actual" name="Regional Performance" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {regionalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.actual >= ind.target ? '#10b981' : entry.actual >= ind.target * 0.8 ? '#f59e0b' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">MEIS Verification ID: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{ind.code}-VERIFIED</code></span>
          <button
            onClick={() => setSelectedIndicator(null)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
          >
            Close Detail Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
