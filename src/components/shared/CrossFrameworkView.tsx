import React from 'react';
import { 
  Target 
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const CrossFrameworkView: React.FC = () => {
  const { filteredIndicators, openIndicatorByCode, filters, setFilters } = useDashboard();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase mb-1">
            <Target className="w-4 h-4" />
            <span>Integrated Sector Architecture</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Cross-Framework Indicator Alignment Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrating how a single M&E indicator simultaneously delivers on ESDP 2025-2030, Strategic Plan, SDG 4, and CCM Manifesto goals.
          </p>
        </div>
      </div>

      {/* Cross-Cutting Universal Filters Panel */}
      <div className="dashboard-card p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-emerald-400">Universal Filters:</span>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="bg-slate-800 text-white border border-slate-700 rounded-md px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Performance Statuses</option>
            <option value="GREEN">🟢 On Target (≥90%)</option>
            <option value="YELLOW">🟡 At Risk (70-89%)</option>
            <option value="RED">🔴 Underperforming (&lt;70%)</option>
            <option value="NODATA">⚪ No Data</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-semibold">
          Showing <span className="text-white font-bold">{filteredIndicators.length}</span> aligned indicators
        </div>
      </div>

      {/* Matrix Table */}
      <div className="dashboard-card p-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3">Code & Name</th>
              <th className="p-3 text-center">ESDP 2025-30</th>
              <th className="p-3 text-center">Strategic Plan</th>
              <th className="p-3 text-center">SDG 4</th>
              <th className="p-3 text-center">CCM Manifesto</th>
              <th className="p-3">Current Performance</th>
              <th className="p-3">Responsible Dept</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredIndicators.map((ind) => {
              const esdpMatch = ind.alignedFrameworks.find(f => f.frameworkId === 'esdp');
              const spMatch = ind.alignedFrameworks.find(f => f.frameworkId === 'sp');
              const sdgMatch = ind.alignedFrameworks.find(f => f.frameworkId === 'sdg');
              const ccmMatch = ind.alignedFrameworks.find(f => f.frameworkId === 'ccm');

              return (
                <tr key={ind.code} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 max-w-xs">
                    <span className="font-mono font-bold text-blue-700 block">{ind.code}</span>
                    <span className="font-bold text-slate-900 leading-tight">{ind.name}</span>
                  </td>

                  {/* ESDP */}
                  <td className="p-3 text-center">
                    {esdpMatch ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 block">
                        Direct
                      </span>
                    ) : <span className="text-slate-300">-</span>}
                  </td>

                  {/* SP */}
                  <td className="p-3 text-center">
                    {spMatch ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 block">
                        Direct
                      </span>
                    ) : <span className="text-slate-300">-</span>}
                  </td>

                  {/* SDG 4 */}
                  <td className="p-3 text-center">
                    {sdgMatch ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 block">
                        {sdgMatch.contributionType}
                      </span>
                    ) : <span className="text-slate-300">-</span>}
                  </td>

                  {/* CCM */}
                  <td className="p-3 text-center">
                    {ccmMatch ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 block">
                        Direct
                      </span>
                    ) : <span className="text-slate-300">-</span>}
                  </td>

                  {/* Performance */}
                  <td className="p-3">
                    <div className="font-bold text-slate-900">
                      {ind.actual !== null ? `${ind.actual} ${ind.unit}` : 'No Data'}
                    </div>
                    <div className="text-[10px] text-slate-500">Target: {ind.target} {ind.unit}</div>
                  </td>

                  <td className="p-3 font-medium text-slate-600 max-w-[140px] truncate">
                    {ind.responsibleDepartmentName}
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
  );
};
