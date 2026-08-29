import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  MapPin, 
  ShieldAlert,
  Calendar,
  Filter
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
  Cell 
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrencyUSD } from '../../utils/performance';

export const ProjectsView: React.FC = () => {
  const { projects, openIndicatorByCode, indicators, filters, setFilters } = useDashboard();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('sequip');

  // Sync internal selected project state with global filter if set
  useEffect(() => {
    if (filters.projectId !== 'all') {
      setSelectedProjectId(filters.projectId);
    }
  }, [filters.projectId]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Component breakdown data scaled dynamically by physical progress
  const componentChartData = selectedProject.components.map(c => {
    const scaleFactor = selectedProject.physicalProgress / 82.0;
    return {
      name: c.name.length > 25 ? c.name.substring(0, 25) + '...' : c.name,
      fullName: c.name,
      budget: c.budgetUSD / 1000000,
      expenditure: Math.round((c.expenditureUSD / 1000000) * scaleFactor * 10) / 10,
      physical: Math.min(100, Math.round(c.physicalProgress * scaleFactor * 10) / 10)
    };
  });

  // Dynamic Milestone donut data based on selected FY milestone achievement
  const milestoneCompleted = Math.round(selectedProject.milestoneAchievement);
  const milestoneInProgress = Math.round((100 - milestoneCompleted) * 0.7);
  const milestoneDelayed = Math.max(0, 100 - milestoneCompleted - milestoneInProgress);

  const milestoneData = [
    { name: 'Completed On Time', value: milestoneCompleted, color: '#10b981' },
    { name: 'In Progress / On Track', value: milestoneInProgress, color: '#3b82f6' },
    { name: 'Delayed / Action Needed', value: milestoneDelayed, color: '#ef4444' }
  ];

  // Filter indicators related to selected project
  const projectIndicators = indicators.filter(i => i.relatedProjectIds.includes(selectedProject.id));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Major Development Projects & Programs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical progress, financial disbursement, component breakdowns, and risk matrices for SEQUIP, HEET & EP4R.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-1 font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>FY: {filters.reportingPeriod}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            <span>Project: </span>
            <span className="text-purple-700 font-bold uppercase">{selectedProject.code}</span>
          </div>
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProject.id;
          return (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                setFilters(prev => ({ ...prev, projectId: proj.id }));
              }}
              className={`dashboard-card p-5 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/40 shadow-md' 
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-xs font-black bg-slate-900 text-white">
                  {proj.code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  proj.status === 'GREEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {proj.status === 'GREEN' ? 'On Track' : 'At Risk'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2.5 leading-snug">{proj.fullName}</h3>
              <p className="text-xs text-slate-500 mt-1">Funder: <strong className="text-slate-700">{proj.funder}</strong></p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">FY {filters.reportingPeriod} Financial</p>
                  <p className="font-black text-slate-800">{proj.financialProgress}%</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Physical Progress</p>
                  <p className="font-black text-blue-600">{proj.physicalProgress}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                <div style={{ width: `${proj.physicalProgress}%` }} className="bg-blue-600 h-full"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Dashboard & Deep Dive */}
      {selectedProject && (
        <div className="space-y-6">

          {/* Project Profile Header Card */}
          <div className="dashboard-card p-6 bg-slate-900 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <FolderKanban className="w-4 h-4" />
                  <span>Project Deep Dive • {selectedProject.code} (FY {filters.reportingPeriod})</span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedProject.fullName}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Lead Directorate: <strong className="text-emerald-300">{selectedProject.leadDepartmentName}</strong> | Funder: {selectedProject.funder}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Budget</p>
                  <p className="text-lg font-black text-emerald-400">{formatCurrencyUSD(selectedProject.budgetUSD)}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Disbursed (Total)</p>
                  <p className="text-lg font-black text-blue-400">{formatCurrencyUSD(selectedProject.disbursedUSD)}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">FY {filters.reportingPeriod} Score</p>
                  <p className={`text-2xl font-black ${
                    selectedProject.status === 'GREEN' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {selectedProject.overallPerformance}%
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Metric Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Physical Progress</p>
                <p className="text-xl font-black text-blue-400">{selectedProject.physicalProgress}%</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Financial Progress</p>
                <p className="text-xl font-black text-indigo-400">{selectedProject.financialProgress}%</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Milestone Achievement</p>
                <p className="text-xl font-black text-emerald-400">{selectedProject.milestoneAchievement}%</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Results Achievement</p>
                <p className="text-xl font-black text-amber-400">{selectedProject.resultsAchievement}%</p>
              </div>
            </div>
          </div>

          {/* Row 1 Charts: Components Budget vs Expenditure & Milestones Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Component Budget vs Expenditure Bar Chart */}
            <div className="dashboard-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Component Budget & Expenditure (USD Millions)</h3>
                  <p className="text-xs text-slate-500">Financial allocation and cumulative expenditure by project component</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                  {selectedProject.components.length} Components
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={componentChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="M" />
                    <Tooltip 
                      formatter={(val: any, name: any) => [`$${val}M USD`, name === 'budget' ? 'Allocated Budget' : 'Cumulative Expenditure']}
                      labelFormatter={(name: any, items: any) => items[0]?.payload?.fullName || name}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="budget" name="Allocated Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenditure" name="Expenditure" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Milestone Status Donut */}
            <div className="dashboard-card p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Milestone Achievement Breakdown</h3>
                <p className="text-xs text-slate-500">Milestones status for FY {filters.reportingPeriod}</p>
              </div>

              <div className="h-48 relative flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={milestoneData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {milestoneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [`${val}%`, 'Milestones']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900">{selectedProject.milestoneAchievement}%</span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Achieved</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                {milestoneData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 2: Regional Coverage Map & Risk Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Regional Implementation Coverage */}
            <div className="dashboard-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">National Regional Implementation Coverage</h3>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">26 Mainland Regions + Zanzibar</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {selectedProject.code} is currently active in all 184 Local Government Authorities (LGAs) across Tanzania.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="font-bold text-emerald-900">Eastern Zone</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">88.5% Completion</p>
                  <span className="text-[10px] font-bold text-emerald-800">Dar, Pwani, Morogoro</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="font-bold text-blue-900">Northern Zone</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">84.2% Completion</p>
                  <span className="text-[10px] font-bold text-blue-800">Arusha, Kilimanjaro, Tanga</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="font-bold text-amber-900">Lake Zone</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">76.0% Completion</p>
                  <span className="text-[10px] font-bold text-amber-800">Mwanza, Mara, Kagera</span>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="font-bold text-purple-900">Southern Highlands</p>
                  <p className="text-[11px] text-purple-700 mt-0.5">81.4% Completion</p>
                  <span className="text-[10px] font-bold text-purple-800">Mbeya, Iringa, Ruvuma</span>
                </div>
              </div>
            </div>

            {/* Risk Assessment Matrix Card */}
            <div className="dashboard-card p-5 border-l-4 border-l-amber-500">
              <div className="flex items-center space-x-2 mb-3 border-b border-slate-100 pb-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Project Risk Assessment</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Procurement Bottlenecks</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Medium Risk</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Delayed clearance of specialized lab equipment for 4 secondary schools.</p>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Contractor Execution Capacity</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Low Risk</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">82% of LGA force-account contractors are meeting quality standards.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Linked Project Indicators Table */}
          <div className="dashboard-card p-5 overflow-x-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Linked Key Performance Indicators ({selectedProject.code})</h3>
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
                {projectIndicators.map((ind) => {
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
          </div>

        </div>
      )}

    </div>
  );
};
