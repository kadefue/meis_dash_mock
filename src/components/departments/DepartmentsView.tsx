import React, { useState, useEffect } from 'react';
import { 
  Building2,
  Calendar,
  Filter,
  BarChart3,
  Coins,
  AlertTriangle,
  Award,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrencyTZS } from '../../utils/performance';

type ComparisonMetric = 'performance' | 'budget' | 'risk';

export const DepartmentsView: React.FC = () => {
  const { departments, openIndicatorByCode, indicators, filters, setFilters } = useDashboard();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dpp');
  const [comparisonMetric, setComparisonMetric] = useState<ComparisonMetric>('performance');

  // Sync internal selected dept state with global filter if set
  useEffect(() => {
    if (filters.departmentId !== 'all') {
      setSelectedDeptId(filters.departmentId);
    }
  }, [filters.departmentId]);

  const selectedDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const deptIndicators = indicators.filter(i => i.responsibleDepartmentId === selectedDept.id);

  // Data formatting for Recharts comparisons
  const performanceData = departments.map(d => ({
    name: d.code,
    fullName: d.name,
    score: d.overallPerformance,
    status: d.status,
    budgetRate: d.budgetUtilizationRate,
    atRisk: d.atRiskIndicatorsCount,
    delayed: d.delayedActivitiesCount
  }));

  const budgetData = departments.map(d => ({
    name: d.code,
    fullName: d.name,
    allocated: Math.round(d.budgetAllocatedTZS / 1000 * 10) / 10, // Billions TZS
    utilized: Math.round(d.budgetUtilizedTZS / 1000 * 10) / 10,   // Billions TZS
    utilizationRate: d.budgetUtilizationRate
  }));

  const riskData = departments.map(d => ({
    name: d.code,
    fullName: d.name,
    totalActivities: d.activitiesCount,
    delayedActivities: d.delayedActivitiesCount,
    atRiskIndicators: d.atRiskIndicatorsCount
  }));

  const getBarColor = (score: number, status: string) => {
    if (status === 'NODATA' || score === 0) return '#94a3b8';
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Ministry Divisions & Departments Accountability</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational performance, comparative analytics, budget utilization, and indicators by MoEST division.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1 font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>FY: {filters.reportingPeriod}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Active Division: </span>
            <span className="text-indigo-700 font-bold uppercase">{selectedDept.code}</span>
          </div>
        </div>
      </div>

      {/* Department Grid Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {departments.map((dept) => {
          const isSelected = dept.id === selectedDept.id;
          return (
            <div
              key={dept.id}
              onClick={() => {
                setSelectedDeptId(dept.id);
                setFilters(prev => ({ ...prev, departmentId: dept.id }));
              }}
              className={`dashboard-card p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/40 shadow-md' 
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-white">
                  {dept.code}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  dept.status === 'GREEN' ? 'bg-emerald-100 text-emerald-800' : dept.status === 'YELLOW' ? 'bg-amber-100 text-amber-800' : dept.status === 'RED' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {dept.status === 'GREEN' ? 'On Target' : dept.status === 'YELLOW' ? 'At Risk' : dept.status === 'RED' ? 'Underperforming' : 'No Data'}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">{dept.name}</h3>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">FY {filters.reportingPeriod}:</span>
                <span className={`font-black text-sm ${
                  dept.status === 'GREEN' ? 'text-emerald-600' : dept.status === 'YELLOW' ? 'text-amber-600' : dept.status === 'RED' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {dept.overallPerformance > 0 ? `${dept.overallPerformance}%` : 'N/A'}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>Budget Util:</span>
                <span className="font-semibold text-slate-800">{dept.budgetUtilizationRate}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW: DIVISIONS COMPARATIVE ANALYTICS SECTION */}
      <div className="dashboard-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-0.5">
              <BarChart3 className="w-4 h-4" />
              <span>Comparative Analytics Engine • FY {filters.reportingPeriod}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Inter-Division Comparative Benchmarks
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side comparative analysis of MoEST divisions across performance scores, budget execution, and operational risks.
            </p>
          </div>

          {/* Metric Switcher Controls */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setComparisonMetric('performance')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
                comparisonMetric === 'performance' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Overall Performance (%)</span>
            </button>
            <button
              onClick={() => setComparisonMetric('budget')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
                comparisonMetric === 'budget' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Budget Execution (Billion TZS)</span>
            </button>
            <button
              onClick={() => setComparisonMetric('risk')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
                comparisonMetric === 'risk' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Risks & Delays</span>
            </button>
          </div>
        </div>

        {/* CHART 1: PERFORMANCE SCORE COMPARISON */}
        {comparisonMetric === 'performance' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Division Overall Performance Benchmark (%)</h4>
              <span className="text-[11px] text-slate-500 italic">Target threshold: 80.0% (Green)</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip 
                    formatter={(val: any) => [`${val ?? 0}%`, 'Overall Performance Score']}
                    labelFormatter={(label) => {
                      const item = performanceData.find(p => p.name === label);
                      return `${label} • ${item?.fullName || ''}`;
                    }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.score, entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 2: BUDGET ALLOCATION VS EXPENDITURE */}
        {comparisonMetric === 'budget' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Allocated vs Utilized Budget by Division (Billion TZS)</h4>
              <span className="text-[11px] text-slate-500 italic">Total Allocated: TZS 358.0 Billion</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="B" />
                  <Tooltip 
                    formatter={(val: any, name: any) => [
                      `TZS ${val ?? 0} Billion`, 
                      name === 'allocated' ? 'Budget Allocated' : 'Budget Utilized'
                    ]}
                    labelFormatter={(label) => {
                      const item = budgetData.find(b => b.name === label);
                      return `${label} • ${item?.fullName || ''} (${item?.utilizationRate}% Utilized)`;
                    }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="allocated" name="Budget Allocated (TZS B)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilized" name="Budget Utilized (TZS B)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 3: RISKS & DELAYS COMPARISON */}
        {comparisonMetric === 'risk' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Operational Tasks vs Delayed Activities & At-Risk Indicators</h4>
              <span className="text-[11px] text-slate-500 italic">Identified bottlenecks across division portfolios</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="totalActivities" name="Total Planned Activities" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delayedActivities" name="Delayed Activities" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="atRiskIndicators" name="At-Risk Indicators" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Selected Department Dashboard & Drill-Down */}
      {selectedDept && (
        <div className="space-y-6">

          {/* Department Executive Card */}
          <div className="dashboard-card p-6 bg-slate-900 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>Division Profile • {selectedDept.code} (FY {filters.reportingPeriod})</span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedDept.name}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Head of Division: <strong className="text-emerald-300">{selectedDept.headOfDepartment}</strong> | Sector Wing: {selectedDept.division}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">FY {filters.reportingPeriod} Score</p>
                  <p className={`text-2xl font-black ${
                    selectedDept.status === 'GREEN' ? 'text-emerald-400' : selectedDept.status === 'YELLOW' ? 'text-amber-400' : selectedDept.status === 'RED' ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {selectedDept.overallPerformance > 0 ? `${selectedDept.overallPerformance}%` : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Budget Utilized</p>
                  <p className="text-2xl font-black text-white">{selectedDept.budgetUtilizationRate}%</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">At Risk Metrics</p>
                  <p className="text-2xl font-black text-amber-400">{selectedDept.atRiskIndicatorsCount}</p>
                </div>
              </div>
            </div>

            {/* Division Key Objectives */}
            <div className="pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Division Strategic Objectives</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedDept.strategicObjectives.map((obj, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-xs text-slate-200 flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Division Financial & Operational Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="dashboard-card p-4 flex items-center space-x-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Budget Allocated</p>
                <p className="text-lg font-black text-slate-900">{formatCurrencyTZS(selectedDept.budgetAllocatedTZS)}</p>
                <p className="text-[11px] text-slate-500 font-medium">TZS Millions</p>
              </div>
            </div>

            <div className="dashboard-card p-4 flex items-center space-x-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Budget Utilized</p>
                <p className="text-lg font-black text-slate-900">{formatCurrencyTZS(selectedDept.budgetUtilizedTZS)}</p>
                <p className="text-[11px] text-emerald-600 font-bold">{selectedDept.budgetUtilizationRate}% Utilization</p>
              </div>
            </div>

            <div className="dashboard-card p-4 flex items-center space-x-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Planned Activities</p>
                <p className="text-lg font-black text-slate-900">{selectedDept.activitiesCount} Tasks</p>
                <p className="text-[11px] text-amber-600 font-bold">{selectedDept.delayedActivitiesCount} Delayed</p>
              </div>
            </div>

            <div className="dashboard-card p-4 flex items-center space-x-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Active Projects</p>
                <p className="text-lg font-black text-slate-900">{selectedDept.projectsCount} Programs</p>
                <p className="text-[11px] text-slate-500 font-medium">{selectedDept.indicatorsCount} Indicators</p>
              </div>
            </div>
          </div>

          {/* Division Indicators Table */}
          <div className="dashboard-card p-5 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedDept.name} Indicators ({deptIndicators.length})</h3>
                <p className="text-xs text-slate-500">Key metrics owned by {selectedDept.code} for FY {filters.reportingPeriod}</p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded border border-indigo-100">
                {selectedDept.code}
              </span>
            </div>

            {deptIndicators.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center">No indicators assigned to this division.</p>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Code</th>
                    <th className="p-3">Indicator Name</th>
                    <th className="p-3">FY {filters.reportingPeriod} Target</th>
                    <th className="p-3">FY {filters.reportingPeriod} Actual</th>
                    <th className="p-3">Achievement</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {deptIndicators.map((ind) => {
                    const ratio = ind.actual !== null 
                      ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
                      : null;
                    const achievementFormatted = ratio !== null ? `${Math.round(ratio * 10) / 10}%` : 'N/A';
                    
                    return (
                      <tr key={ind.code} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-700">{ind.code}</td>
                        <td className="p-3 font-bold text-slate-900 max-w-xs">{ind.name}</td>
                        <td className="p-3 font-semibold">{ind.target} {ind.unit}</td>
                        <td className="p-3 font-bold">{ind.actual !== null ? `${ind.actual} ${ind.unit}` : 'No Data'}</td>
                        <td className="p-3 font-black text-slate-900">{achievementFormatted}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ratio === null ? 'bg-slate-100 text-slate-700' : ratio >= 90 ? 'bg-emerald-100 text-emerald-800' : ratio >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {ratio === null ? 'No Data' : ratio >= 90 ? 'On Target' : ratio >= 70 ? 'At Risk' : 'Underperforming'}
                          </span>
                        </td>
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

    </div>
  );
};
