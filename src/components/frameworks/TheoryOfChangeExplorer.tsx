import React, { useState } from 'react';
import { 
  GitFork, 
  Layers, 
  Table, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  ArrowRight, 
  Target, 
  FolderKanban
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import type { TheoryOfChangeNode } from '../../types/dashboard';

export const TheoryOfChangeExplorer: React.FC = () => {
  const { 
    selectedTocNode, 
    drillDownPath, 
    drillDownToNode, 
    popDrillDown, 
    resetDrillDown,
    tocVisualization,
    setTocVisualization,
    openIndicatorByCode,
    indicators
  } = useDashboard();

  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>({
    'toc-esdp-root': true,
    'toc-sp1': true,
    'toc-sp1-out1': true
  });

  const toggleNodeExpansion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentNode = selectedTocNode || drillDownPath[drillDownPath.length - 1];

  // Helper badge color for status
  const getStatusBadge = (status: string) => {
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

  // Helper level styling
  const getNodeLevelTag = (type: string) => {
    switch (type) {
      case 'FRAMEWORK': return { bg: 'bg-blue-600', text: 'Framework Goal' };
      case 'STRATEGIC_PRIORITY': return { bg: 'bg-indigo-600', text: 'Strategic Priority' };
      case 'OUTCOME': return { bg: 'bg-emerald-600', text: 'Outcome' };
      case 'INTERMEDIATE_OUTCOME': return { bg: 'bg-teal-600', text: 'Intermediate Outcome' };
      case 'OUTPUT': return { bg: 'bg-amber-600', text: 'Output' };
      case 'ACTIVITY': return { bg: 'bg-purple-600', text: 'Activity / Intervention' };
      case 'INDICATOR': return { bg: 'bg-slate-700', text: 'Indicator Metric' };
      default: return { bg: 'bg-slate-600', text: type };
    }
  };

  // Recursive Tree Node component
  const RenderTreeNode: React.FC<{ node: TheoryOfChangeNode; depth: number }> = ({ node, depth }) => {
    const isSelected = selectedTocNode?.id === node.id;
    const isExpanded = expandedNodeIds[node.id] ?? (depth < 2);
    const hasChildren = node.children && node.children.length > 0;
    const levelInfo = getNodeLevelTag(node.type);

    return (
      <div className="relative my-2">
        {/* Node Card */}
        <div 
          onClick={() => drillDownToNode(node)}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            isSelected 
              ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-2.5">
              {hasChildren && (
                <button
                  onClick={(e) => toggleNodeExpansion(node.id, e)}
                  className="mt-0.5 p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-1 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${levelInfo.bg}`}>
                    {node.code} • {levelInfo.text}
                  </span>
                  {getStatusBadge(node.status)}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{node.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{node.description}</p>

                <div className="flex items-center space-x-4 mt-2.5 text-xs text-slate-600 flex-wrap gap-y-1">
                  <span className="flex items-center space-x-1 font-semibold text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Owner: {node.departmentName}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Target className="w-3.5 h-3.5 text-slate-400" />
                    <span>{node.indicatorCount} Indicators</span>
                  </span>
                  {node.projectIds && node.projectIds.length > 0 && (
                    <span className="flex items-center space-x-1 font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                      <FolderKanban className="w-3 h-3 text-purple-600" />
                      <span>{node.projectIds.join(', ').toUpperCase()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="text-right flex-shrink-0">
              <span className={`text-base font-black ${
                node.status === 'GREEN' ? 'text-emerald-600' : node.status === 'YELLOW' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {node.achievement !== null ? `${node.achievement}%` : 'N/A'}
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Achievement</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  drillDownToNode(node);
                }}
                className="mt-1.5 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1 justify-end ml-auto"
              >
                <span>Drill Down</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Children Recursion */}
        {hasChildren && isExpanded && (
          <div className="pl-6 ml-4 border-l-2 border-slate-200 space-y-2 mt-2">
            {node.children!.map((child) => (
              <RenderTreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Explorer Controls & View Switcher Bar */}
      <div className="dashboard-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <GitFork className="w-4 h-4" />
            <span>Theory of Change Interactive Engine</span>
          </div>
          <h2 className="text-lg font-black text-white mt-0.5">
            Education Sector Results Architecture
          </h2>
          <p className="text-xs text-slate-300">
            Click any node below to dynamically open the next level: <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300 font-mono">Priority → Outcome → Output → Activity → Indicator</code>
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setTocVisualization('tree')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
              tocVisualization === 'tree' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Tree View</span>
          </button>
          <button
            onClick={() => setTocVisualization('flow')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
              tocVisualization === 'flow' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flow View</span>
          </button>
          <button
            onClick={() => setTocVisualization('table')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
              tocVisualization === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Indicator Table</span>
          </button>
        </div>
      </div>

      {/* Active Drill-Down Path Breadcrumbs Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs flex-wrap gap-2">
        <div className="flex items-center space-x-2 overflow-x-auto text-xs py-1">
          <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1">Drill-Down Path:</span>
          {drillDownPath.map((node, idx) => (
            <React.Fragment key={node.id}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
              <button
                onClick={() => drillDownToNode(node)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
                  idx === drillDownPath.length - 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{node.code}</span>
                <span className="text-[10px] opacity-80">({node.achievement !== null ? `${node.achievement}%` : 'N/A'})</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        {drillDownPath.length > 1 && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={popDrillDown}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              ← Back 1 Level
            </button>
            <button
              onClick={resetDrillDown}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
            >
              Reset to Root
            </button>
          </div>
        )}
      </div>

      {/* Selected Node Header Card */}
      {currentNode && (
        <div className="dashboard-card p-5 bg-gradient-to-br from-blue-50/60 to-white border-blue-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-xs font-black bg-blue-600 text-white">
                  {currentNode.code}
                </span>
                {getStatusBadge(currentNode.status)}
              </div>
              <h3 className="text-lg font-black text-slate-900">{currentNode.name}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{currentNode.description}</p>
            </div>
            <div className="text-left md:text-right bg-white p-3 rounded-lg border border-slate-200 flex-shrink-0">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Overall Node Performance</p>
              <p className={`text-2xl font-black ${
                currentNode.status === 'GREEN' ? 'text-emerald-600' : currentNode.status === 'YELLOW' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {currentNode.achievement !== null ? `${currentNode.achievement}%` : 'N/A'}
              </p>
              <p className="text-xs text-slate-500 font-medium">{currentNode.indicatorCount} Contributing Indicators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-500">Responsible Department:</span>
              <p className="font-bold text-slate-900">{currentNode.departmentName}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Associated Projects:</span>
              <p className="font-bold text-purple-700">{currentNode.projectIds.join(', ').toUpperCase() || 'Sector-Wide'}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Framework Alignment:</span>
              <p className="font-bold text-blue-700">ESDP 2025/26–2029/30</p>
            </div>
          </div>
        </div>
      )}

      {/* Main View Renderer based on selected TOC visualization */}
      {tocVisualization === 'tree' && (
        <div className="dashboard-card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Hierarchical Tree Structure</h3>
          <p className="text-xs text-slate-500 mb-4">Click cards to expand lower levels or inspect contributing indicators.</p>
          <RenderTreeNode node={drillDownPath[0]} depth={0} />
        </div>
      )}

      {tocVisualization === 'flow' && (
        <div className="dashboard-card p-6 overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Results Pipeline Flow (Inputs → Impact)</h3>
          <p className="text-xs text-slate-500 mb-4">Horizontal Theory of Change progression</p>
          
          <div className="flex items-stretch space-x-4 min-w-[900px] py-4">
            
            {/* Stage 1: Framework Goal */}
            <div className="w-64 p-4 rounded-xl bg-blue-900 text-white flex flex-col justify-between flex-shrink-0 shadow-md">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-700 text-blue-100">STEP 1 • GOAL</span>
                <h4 className="text-sm font-bold mt-2">National Education Goal</h4>
                <p className="text-xs text-slate-200 mt-1">ESDP 2025-2030</p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-800 text-xs">
                <span className="text-emerald-400 font-bold">82.4% Achievement</span>
              </div>
            </div>

            <div className="flex items-center text-slate-400"><ArrowRight className="w-5 h-5" /></div>

            {/* Stage 2: Strategic Priority */}
            <div className="w-64 p-4 rounded-xl bg-indigo-900 text-white flex flex-col justify-between flex-shrink-0 shadow-md">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-700 text-indigo-100">STEP 2 • PRIORITY</span>
                <h4 className="text-sm font-bold mt-2">Priority 1: General Education</h4>
                <p className="text-xs text-slate-200 mt-1">Secondary & Girls Retention</p>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-800 text-xs">
                <span className="text-emerald-400 font-bold">83.5% Achievement</span>
              </div>
            </div>

            <div className="flex items-center text-slate-400"><ArrowRight className="w-5 h-5" /></div>

            {/* Stage 3: Outcome */}
            <div className="w-64 p-4 rounded-xl bg-teal-900 text-white flex flex-col justify-between flex-shrink-0 shadow-md">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-700 text-teal-100">STEP 3 • OUTCOME</span>
                <h4 className="text-sm font-bold mt-2">Learning Quality Improvement</h4>
                <p className="text-xs text-slate-200 mt-1">Outcome 1.1</p>
              </div>
              <div className="mt-4 pt-3 border-t border-teal-800 text-xs">
                <span className="text-amber-400 font-bold">76.5% Achievement</span>
              </div>
            </div>

            <div className="flex items-center text-slate-400"><ArrowRight className="w-5 h-5" /></div>

            {/* Stage 4: Output / Activity */}
            <div className="w-64 p-4 rounded-xl bg-purple-900 text-white flex flex-col justify-between flex-shrink-0 shadow-md">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-700 text-purple-100">STEP 4 • INTERVENTION</span>
                <h4 className="text-sm font-bold mt-2">Teacher CPD Training Rollout</h4>
                <p className="text-xs text-slate-200 mt-1">184 LGA Modules</p>
              </div>
              <div className="mt-4 pt-3 border-t border-purple-800 text-xs">
                <span className="text-red-400 font-bold">60.8% Achievement</span>
              </div>
            </div>

            <div className="flex items-center text-slate-400"><ArrowRight className="w-5 h-5" /></div>

            {/* Stage 5: Indicator */}
            <div className="w-64 p-4 rounded-xl bg-slate-900 text-white flex flex-col justify-between flex-shrink-0 shadow-md">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-700 text-slate-200">STEP 5 • INDICATOR</span>
                <h4 className="text-sm font-bold mt-2">CPD Completion Rate</h4>
                <p className="text-xs text-slate-300 mt-1">IND-TCH-01</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
                <span className="text-amber-400 font-bold">61.2% Actual (Target 85%)</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {tocVisualization === 'table' && (
        <div className="dashboard-card p-5 overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Linked Key Performance Indicators</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Code</th>
                <th className="p-3">Indicator Name</th>
                <th className="p-3">Target</th>
                <th className="p-3">Actual</th>
                <th className="p-3">Achievement</th>
                <th className="p-3">Status</th>
                <th className="p-3">Department</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {indicators.map((ind) => {
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
        </div>
      )}

    </div>
  );
};
