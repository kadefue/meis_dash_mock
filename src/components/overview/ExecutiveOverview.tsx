import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Building2, 
  FolderKanban, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';

export const ExecutiveOverview: React.FC = () => {
  const { 
    frameworks, 
    projects, 
    departments, 
    indicators, 
    alerts,
    filters,
    setActiveTab, 
    setFilters,
    openIndicatorByCode
  } = useDashboard();

  // Calculate dynamic aggregated statistics for active reporting period
  const totalIndicators = indicators.length;
  const onTargetCount = indicators.filter(i => {
    if (!i.actual) return false;
    const ratio = i.isInverse ? (i.target / i.actual) * 100 : (i.actual / i.target) * 100;
    return ratio >= 90;
  }).length;
  const atRiskCount = indicators.filter(i => {
    if (!i.actual) return false;
    const ratio = i.isInverse ? (i.target / i.actual) * 100 : (i.actual / i.target) * 100;
    return ratio >= 70 && ratio < 90;
  }).length;
  const underperformingCount = indicators.filter(i => {
    if (!i.actual) return false;
    const ratio = i.isInverse ? (i.target / i.actual) * 100 : (i.actual / i.target) * 100;
    return ratio < 70;
  }).length;
  const noDataCount = indicators.filter(i => i.actual === null).length;

  const onTargetPct = Math.round((onTargetCount / totalIndicators) * 100);
  const atRiskPct = Math.round((atRiskCount / totalIndicators) * 100);
  const underperformingPct = Math.round((underperformingCount / totalIndicators) * 100);

  const overallAvgScore = Math.round(
    frameworks.reduce((acc, f) => acc + f.overallScore, 0) / frameworks.length * 10
  ) / 10;

  // Framework chart data
  const frameworkChartData = frameworks.map(f => ({
    name: f.name,
    code: f.code,
    score: f.overallScore,
    status: f.status
  }));

  // Pie chart data
  const pieData = [
    { name: 'On Target / Above', value: onTargetCount, color: '#10b981' },
    { name: 'At Risk', value: atRiskCount, color: '#f59e0b' },
    { name: 'Underperforming', value: underperformingCount, color: '#ef4444' },
    { name: 'No Updated Data', value: noDataCount, color: '#94a3b8' },
  ];

  // Dynamic Line chart trend data across all seeded Financial Years (2024/25 - 2027/28)
  const periodsList = ['2024/25', '2025/26', '2026/27', '2027/28'];
  const lineTrendData = periodsList.map(p => {
    let periodTotalScore = 0;
    let periodCount = 0;
    indicators.forEach(ind => {
      if (ind.periodData && ind.periodData[p] && ind.periodData[p].actual !== null) {
        const target = ind.periodData[p].target;
        const actual = ind.periodData[p].actual!;
        const ratio = ind.isInverse ? (target / actual) * 100 : (actual / target) * 100;
        periodTotalScore += ratio;
        periodCount++;
      }
    });
    const avg = periodCount > 0 ? Math.round((periodTotalScore / periodCount) * 10) / 10 : 80;
    const plannedMap: Record<string, number> = {
      '2024/25': 75.0,
      '2025/26': 80.0,
      '2026/27': 85.0,
      '2027/28': 90.0
    };
    return {
      year: p,
      planned: plannedMap[p],
      actual: avg
    };
  });

  // Top departments sorted
  const sortedDepartments = [...departments].sort((a, b) => b.overallPerformance - a.overallPerformance);
  const topDepartments = sortedDepartments.slice(0, 4);
  const attentionDepartments = sortedDepartments.slice(-3).reverse();

  // Projects comparative data
  const projectsComparisonData = projects.map(p => ({
    name: p.code,
    physical: p.physicalProgress,
    financial: p.financialProgress,
    milestone: p.milestoneAchievement,
    results: p.resultsAchievement
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Dynamic Executive Narrative Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-blue-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-4xl">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Executive Performance Insight • FY {filters.reportingPeriod}</span>
          </div>
          <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
            <strong>MoEST is performing at {overallAvgScore}% across national frameworks in FY {filters.reportingPeriod}.</strong>{' '}
            <span className="text-emerald-400 font-semibold">{onTargetPct}% of indicators are on/above target</span>,{' '}
            <span className="text-amber-400 font-semibold">{atRiskPct}% are at risk</span> and{' '}
            <span className="text-red-400 font-semibold">{underperformingPct}% are underperforming</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => setActiveTab('frameworks')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Explore Theory of Change</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        {/* Overall Score */}
        <div className="dashboard-card p-4 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Score</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{overallAvgScore}%</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              FY {filters.reportingPeriod}
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* On Target */}
        <div className="dashboard-card p-4 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On Target</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{onTargetPct}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{onTargetCount} of {totalIndicators} indicators</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-emerald-600">
            <span className="text-[10px] font-semibold">Target ≥ 90%</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* At Risk */}
        <div className="dashboard-card p-4 flex flex-col justify-between border-l-4 border-l-amber-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">At Risk</p>
            <p className="text-2xl font-black text-amber-500 mt-1">{atRiskPct}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{atRiskCount} indicators</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-amber-600">
            <span className="text-[10px] font-semibold">70% - 89%</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        {/* Underperforming */}
        <div className="dashboard-card p-4 flex flex-col justify-between border-l-4 border-l-red-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Underperforming</p>
            <p className="text-2xl font-black text-red-600 mt-1">{underperformingPct}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{underperformingCount} indicators</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-red-600">
            <span className="text-[10px] font-semibold">&lt; 70% Target</span>
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        {/* Without Data */}
        <div className="dashboard-card p-4 flex flex-col justify-between border-l-4 border-l-slate-400">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No Data</p>
            <p className="text-2xl font-black text-slate-600 mt-1">{noDataCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Pending update</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-semibold">Unreported</span>
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>

        {/* Projects Status */}
        <div className="dashboard-card p-4 flex flex-col justify-between border-l-4 border-l-blue-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {projects.filter(p => p.status === 'GREEN').length} / {projects.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">On Track</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-blue-600">
            <span className="text-[10px] font-semibold">Major Projects</span>
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>

        {/* Departments Status */}
        <div className="dashboard-card p-4 flex flex-col justify-between border-l-4 border-l-indigo-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departments</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {departments.filter(d => d.status === 'GREEN').length} / {departments.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">On Target</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-indigo-600">
            <span className="text-[10px] font-semibold">Divisions</span>
            <Building2 className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Framework Performance Bar Chart */}
        <div className="dashboard-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Performance by National Framework (FY {filters.reportingPeriod})</h2>
              <p className="text-xs text-slate-500">Comparative achievement percentage across official MoEST frameworks</p>
            </div>
            <button 
              onClick={() => setActiveTab('frameworks')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frameworkChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="code" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, 'Overall Score']}
                  labelFormatter={(code: any) => {
                    const fw = frameworks.find(f => f.code === code);
                    return fw ? fw.fullName : code;
                  }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {frameworkChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#10b981' : entry.score >= 70 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-2 text-center">
            {frameworks.map(f => (
              <div key={f.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500">{f.code}</p>
                <p className="text-sm font-black text-slate-800">{f.overallScore}%</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                  f.status === 'GREEN' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart - Indicator Status Distribution */}
        <div className="dashboard-card p-5">
          <div className="mb-2">
            <h2 className="text-base font-bold text-slate-900">Indicator Status Breakdown</h2>
            <p className="text-xs text-slate-500">Status distribution for FY {filters.reportingPeriod}</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val} Indicators`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">{totalIndicators}</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Indicators</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} ({Math.round((item.value/totalIndicators)*100)}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Performance Trend Line Chart & Project Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dynamic Multi-Year Performance Trend Line Chart */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">National Sector Performance Trajectory</h2>
              <p className="text-xs text-slate-500">Seeded overall performance across Financial Years (2024/25–2027/28)</p>
            </div>
            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              Active: FY {filters.reportingPeriod}
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="planned" name="Planned Target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="actual" name="Actual Performance" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Comparison Chart */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Project Performance (FY {filters.reportingPeriod})</h2>
              <p className="text-xs text-slate-500">SEQUIP ($535M), HEET ($425M) & EP4R ($290M) metrics</p>
            </div>
            <button 
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Projects Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsComparisonData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 700 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="physical" name="Physical Progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="financial" name="Financial Progress" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="results" name="Results Achievement" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Departmental Performance Rankings & Management Alerts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Performing Departments */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Top Performing Departments</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">FY {filters.reportingPeriod}</span>
          </div>
          <div className="space-y-3">
            {topDepartments.map((dept) => (
              <div 
                key={dept.id}
                onClick={() => {
                  setFilters(prev => ({ ...prev, departmentId: dept.id }));
                  setActiveTab('departments');
                }}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{dept.code} - {dept.name}</p>
                  <p className="text-[11px] text-slate-500">{dept.indicatorsCount} Indicators • Utilization: {dept.budgetUtilizationRate}%</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-600">{dept.overallPerformance}%</span>
                  <p className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-1.5 py-0.2 rounded mt-0.5">On Target</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments Requiring Management Attention */}
        <div className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Requires Attention</h3>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Action Needed</span>
          </div>
          <div className="space-y-3">
            {attentionDepartments.map((dept) => (
              <div 
                key={dept.id}
                onClick={() => {
                  setFilters(prev => ({ ...prev, departmentId: dept.id }));
                  setActiveTab('departments');
                }}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{dept.code} - {dept.name}</p>
                  <p className="text-[11px] text-slate-500">{dept.atRiskIndicatorsCount} At-Risk Indicators • {dept.delayedActivitiesCount} Delayed</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-black ${dept.status === 'RED' ? 'text-red-600' : 'text-amber-600'}`}>
                    {dept.overallPerformance}%
                  </span>
                  <p className={`text-[10px] font-semibold px-1.5 py-0.2 rounded mt-0.5 ${
                    dept.status === 'RED' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'
                  }`}>
                    {dept.status === 'RED' ? 'Underperforming' : 'At Risk'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Management Alerts Panel */}
        <div className="dashboard-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900">Priority Management Alerts</h3>
            </div>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-[11px] font-bold text-red-600 hover:text-red-800"
            >
              View All ({alerts.length})
            </button>
          </div>
          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((alert) => (
              <div 
                key={alert.id}
                onClick={() => {
                  if (alert.targetType === 'indicator') {
                    openIndicatorByCode(alert.targetId);
                  } else if (alert.targetType === 'project') {
                    setFilters(prev => ({ ...prev, projectId: alert.targetId }));
                    setActiveTab('projects');
                  }
                }}
                className="p-2.5 rounded-lg bg-red-50/70 border border-red-100 hover:bg-red-100/70 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                    {alert.severity} • {alert.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">{alert.title}</p>
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
