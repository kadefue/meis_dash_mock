import React, { useState, useEffect } from 'react';
import { 
  Building2,
  Calendar,
  Filter
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrencyTZS } from '../../utils/performance';

export const DepartmentsView: React.FC = () => {
  const { departments, openIndicatorByCode, indicators, filters, setFilters } = useDashboard();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dpp');

  // Sync internal selected dept state with global filter if set
  useEffect(() => {
    if (filters.departmentId !== 'all') {
      setSelectedDeptId(filters.departmentId);
    }
  }, [filters.departmentId]);

  const selectedDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const deptIndicators = indicators.filter(i => i.responsibleDepartmentId === selectedDept.id);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Ministry Divisions & Departments Accountability</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational performance, budget utilization, strategic objectives, and indicators by MoEST division.
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
            <span>Division: </span>
            <span className="text-indigo-700 font-bold uppercase">{selectedDept.code}</span>
          </div>
        </div>
      </div>

      {/* Department Grid Cards */}
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
                  dept.status === 'GREEN' ? 'bg-emerald-100 text-emerald-800' : dept.status === 'YELLOW' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {dept.status}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">{dept.name}</h3>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">FY {filters.reportingPeriod}:</span>
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
                    selectedDept.status === 'GREEN' ? 'text-emerald-400' : selectedDept.status === 'YELLOW' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {selectedDept.overallPerformance}%
                  </p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Budget Utilization</p>
                  <p className="text-lg font-black text-blue-400">{selectedDept.budgetUtilizationRate}%</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl text-center min-w-[110px] border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">At Risk Indicators</p>
                  <p className="text-lg font-black text-amber-400">{selectedDept.atRiskIndicatorsCount}</p>
                </div>
              </div>
            </div>

            {/* Strategic Objectives List */}
            <div className="pt-5">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Division Strategic Objectives:</p>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {selectedDept.strategicObjectives.map((obj, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-200 font-medium">
                    • {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Budget Execution Summary */}
          <div className="dashboard-card p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Annual Allocated Budget</p>
              <p className="text-base font-black text-slate-900">{formatCurrencyTZS(selectedDept.budgetAllocatedTZS)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Budget Utilized to Date</p>
              <p className="text-base font-black text-blue-600">{formatCurrencyTZS(selectedDept.budgetUtilizedTZS)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Execution Efficiency</p>
              <p className="text-base font-black text-emerald-600">{selectedDept.budgetUtilizationRate}%</p>
            </div>
          </div>

          {/* Department Linked Indicators Table */}
          <div className="dashboard-card p-5 overflow-x-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Linked Division Indicators ({selectedDept.code})</h3>
            {deptIndicators.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center">No indicators directly assigned to this division.</p>
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
