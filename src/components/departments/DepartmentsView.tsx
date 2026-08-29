import React, { useState } from 'react';
import { 
  Building2 
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrencyTZS } from '../../utils/performance';

export const DepartmentsView: React.FC = () => {
  const { departments, openIndicatorByCode, indicators } = useDashboard();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dpp');

  const selectedDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const deptIndicators = indicators.filter(i => i.responsibleDepartmentId === selectedDept.id);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Ministry Directorates & Departments Accountability</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational performance, budget utilization, strategic objectives, and indicators by MoEST directorate.
          </p>
        </div>
      </div>

      {/* Department Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {departments.map((dept) => {
          const isSelected = dept.id === selectedDept.id;
          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
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
                  dept.status === 'GREEN' ? 'bg-emerald-100 text-emerald-800' : dept.status === 'YELLOW' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {dept.status}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">{dept.name}</h3>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">Score:</span>
                <span className={`font-black text-sm ${
                  dept.status === 'GREEN' ? 'text-emerald-600' : dept.status === 'YELLOW' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {dept.overallPerformance}%
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

      {/* Selected Department Dashboard & Drill-Down */}
      {selectedDept && (
        <div className="space-y-6">

          {/* Department Executive Card */}
          <div className="dashboard-card p-6 bg-slate-900 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>Directorate Profile • {selectedDept.code}</span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedDept.name}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Head of Directorate: <strong className="text-emerald-300">{selectedDept.headOfDepartment}</strong> | Sector Wing: {selectedDept.directorate}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Overall Score</p>
                  <p className={`text-2xl font-black ${
                    selectedDept.status === 'GREEN' ? 'text-emerald-400' : selectedDept.status === 'YELLOW' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {selectedDept.overallPerformance}%
                  </p>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Budget Execution</p>
                  <p className="text-xl font-black text-blue-400">{selectedDept.budgetUtilizationRate}%</p>
                  <p className="text-[10px] text-slate-300">{formatCurrencyTZS(selectedDept.budgetUtilizedTZS)}</p>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">At-Risk Metrics</p>
                  <p className={`text-xl font-black ${selectedDept.atRiskIndicatorsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedDept.atRiskIndicatorsCount}
                  </p>
                  <p className="text-[10px] text-slate-300">{selectedDept.delayedActivitiesCount} Delayed Tasks</p>
                </div>
              </div>
            </div>

            {/* Department Strategic Objectives */}
            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Directorate Strategic Objectives:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-200">
                {selectedDept.strategicObjectives.map((obj, idx) => (
                  <li key={idx} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80 flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Department Results Hierarchy Drill-Down */}
          <div className="dashboard-card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Directorate Results Hierarchy Drill-Down</h3>
            <p className="text-xs text-slate-500 mb-4">
              Trace from Directorate Strategic Objectives → Functions → Activities → Outputs → Indicators
            </p>

            <div className="space-y-4">
              {selectedDept.strategicObjectives.map((obj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <span className="text-xs font-bold text-blue-700 uppercase">Strategic Objective #{idx + 1}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">On Track</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{obj}</h4>

                  {/* Level 2: Contributing Activities */}
                  <div className="mt-3 pl-4 border-l-2 border-blue-400 space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                      <p className="font-bold text-slate-800">Key Activity: Operationalize Annual Directorate Action Plan</p>
                      <div className="flex items-center justify-between mt-1 text-slate-500">
                        <span>Status: <strong className="text-emerald-600">88% Progress</strong></span>
                        <span>Budget Allocated: <strong>TZS 1.2 Billion</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Linked Indicators */}
          <div className="dashboard-card p-5 overflow-x-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Department Indicators & Targets</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Code</th>
                  <th className="p-3">Indicator Name</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Actual</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptIndicators.map((ind) => (
                  <tr key={ind.code} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{ind.code}</td>
                    <td className="p-3 font-bold text-slate-900">{ind.name}</td>
                    <td className="p-3 font-semibold">{ind.target} {ind.unit}</td>
                    <td className="p-3 font-bold">{ind.actual !== null ? `${ind.actual} ${ind.unit}` : 'No Data'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">On Target</span>
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
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
