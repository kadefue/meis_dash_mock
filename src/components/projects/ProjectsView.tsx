import React, { useState } from 'react';
import { 
  FolderKanban, 
  MapPin, 
  ShieldAlert
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
  const { projects, openIndicatorByCode, indicators } = useDashboard();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('sequip');

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Component breakdown data for chart
  const componentChartData = selectedProject.components.map(c => ({
    name: c.name.length > 25 ? c.name.substring(0, 25) + '...' : c.name,
    fullName: c.name,
    budget: c.budgetUSD / 1000000,
    expenditure: c.expenditureUSD / 1000000,
    physical: c.physicalProgress
  }));

  // Milestone donut data
  const milestoneData = [
    { name: 'Completed On Time', value: 65, color: '#10b981' },
    { name: 'In Progress / On Track', value: 25, color: '#3b82f6' },
    { name: 'Delayed / Action Needed', value: 10, color: '#ef4444' }
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
      </div>

      {/* Project Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProject.id;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
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
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Budget</p>
                  <p className="font-black text-slate-800">{formatCurrencyUSD(proj.budgetUSD)}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Physical Progress</p>
                  <p className="font-black text-blue-600">{proj.physicalProgress}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                <div style={{ width: `${proj.physicalProgress}%` }} className="bg-blue-600 h-full rounded-full"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Comprehensive Detail Dashboard */}
      {selectedProject && (
        <div className="space-y-6">

          {/* Banner & High-level KPIs */}
          <div className="dashboard-card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <FolderKanban className="w-4 h-4" />
                  <span>Project Deep Dive • {selectedProject.code}</span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedProject.fullName}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  Lead Directorate: <strong className="text-emerald-300">{selectedProject.leadDepartmentName}</strong> | Implementation Window: {selectedProject.startDate} to {selectedProject.endDate}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl text-center min-w-[110px]">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Budget Execution</p>
                  <p className="text-xl font-black text-emerald-400">{selectedProject.financialProgress}%</p>
                  <p className="text-[10px] text-slate-300">{formatCurrencyUSD(selectedProject.expenditureUSD)} / {formatCurrencyUSD(selectedProject.budgetUSD)}</p>
                </div>

                <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl text-center min-w-[110px]">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Physical Completion</p>
                  <p className="text-xl font-black text-blue-400">{selectedProject.physicalProgress}%</p>
                  <p className="text-[10px] text-slate-300">Overall Target 100%</p>
                </div>

                <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl text-center min-w-[110px]">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Risk Profile</p>
                  <p className={`text-xl font-black ${selectedProject.riskLevel === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedProject.riskLevel} Risk
                  </p>
                  <p className="text-[10px] text-slate-300">{selectedProject.delayedActivitiesCount} Delayed Tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Budget vs Expenditure Chart & Milestone Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Component Budget & Physical Progress Chart */}
            <div className="dashboard-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Component Budget & Expenditure Breakdown</h3>
                  <p className="text-xs text-slate-500">Allocated Budget vs Actual Expenditure ($ Millions USD)</p>
                </div>
                <span className="text-xs font-bold text-slate-500">{selectedProject.components.length} Components</span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={componentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="M$" />
                    <Tooltip 
                      formatter={(val: any) => [`$${val}M USD`, 'Amount']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="budget" name="Allocated Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenditure" name="Actual Expenditure" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Components Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
                {selectedProject.components.map(comp => (
                  <div key={comp.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <p className="font-bold text-slate-900 line-clamp-1">{comp.name}</p>
                    <div className="flex justify-between mt-2 text-slate-600">
                      <span>Physical: <strong className="text-blue-600">{comp.physicalProgress}%</strong></span>
                      <span>Spent: <strong className="text-slate-800">{formatCurrencyUSD(comp.expenditureUSD)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Achievement Status */}
            <div className="dashboard-card p-5">
              <h3 className="text-base font-bold text-slate-900 mb-1">Milestone Execution Status</h3>
              <p className="text-xs text-slate-500 mb-3">Project Deliverables & Verification</p>

              <div className="h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={milestoneData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {milestoneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900">{selectedProject.milestoneAchievement}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Verified</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                {milestoneData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-700 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 3: Risk Matrix & Regional Map Representation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Project Risk Matrix */}
            <div className="dashboard-card p-5">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Project Risk Matrix</h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">M&E Risk Audit</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="font-bold text-emerald-800">Low Risk</p>
                  <p className="text-[10px] text-emerald-600 mt-1">Environmental Compliance & Safeguards</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="font-bold text-amber-800">Medium Risk</p>
                  <p className="text-[10px] text-amber-600 mt-1">Contractor Civil Works Delays</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-bold text-red-800">High Risk</p>
                  <p className="text-[10px] text-red-600 mt-1">Specialized Equipment Import Customs Clearance</p>
                </div>
              </div>
            </div>

            {/* Regional Performance Distribution Map Card */}
            <div className="dashboard-card p-5">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Regional Coverage & Infrastructure Map</h3>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">26 Regions</span>
              </div>

              <div className="bg-slate-100 rounded-lg p-4 text-center border border-slate-200 flex flex-col items-center justify-center min-h-[120px]">
                <MapPin className="w-8 h-8 text-blue-600 mb-1 animate-bounce" />
                <p className="text-xs font-bold text-slate-800">Tanzania Regional Implementation Grid</p>
                <p className="text-[11px] text-slate-500 mt-0.5">High Performance in Eastern & Northern Zones; Accelerated Civil Works in Western & Southern Regions.</p>
              </div>
            </div>

          </div>

          {/* Project Linked Indicators Table */}
          <div className="dashboard-card p-5 overflow-x-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Project Key Results & Indicator Performance</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Code</th>
                  <th className="p-3">Indicator Name</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Actual</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Responsible Dept</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectIndicators.map((ind) => (
                  <tr key={ind.code} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{ind.code}</td>
                    <td className="p-3 font-bold text-slate-900">{ind.name}</td>
                    <td className="p-3 font-semibold">{ind.target} {ind.unit}</td>
                    <td className="p-3 font-bold">{ind.actual !== null ? `${ind.actual} ${ind.unit}` : 'No Data'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">On Target</span>
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
