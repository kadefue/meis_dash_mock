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
  FolderKanban,
  Coins,
  Wrench,
  PackageCheck,
  TrendingUp,
  Award,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Search,
  ArrowUpRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import type { TheoryOfChangeNode, PerformanceStatus } from '../../types/dashboard';

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
    filteredIndicators,
    filters,
    frameworks,
    theoryOfChangeTree
  } = useDashboard();

  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>({
    'toc-esdp-root': true,
    'toc-sp-root': true,
    'toc-sdg-root': true,
    'toc-ccm-root': true,
    'toc-sp1': true,
    'toc-sp1-out1': true
  });

  // Flow chain priority filter state
  const [selectedChainPriorityId, setSelectedChainPriorityId] = useState<string>('all');
  
  // Table search & status filter state
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('all');

  const toggleNodeExpansion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentNode = selectedTocNode || drillDownPath[drillDownPath.length - 1];
  const activeFwObj = frameworks.find(f => f.id === filters.frameworkId) || frameworks[0];

  // Helper badge color for status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GREEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> On Target</span>;
      case 'YELLOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-600" /> At Risk</span>;
      case 'RED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-600" /> Underperforming</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1"><Info className="w-3 h-3 text-slate-400" /> No Data</span>;
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
                {node.achievement !== null && node.achievement > 0 ? `${node.achievement}%` : 'N/A'}
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

  // Derive active priority chain children for Results Pipeline
  const availablePriorities = theoryOfChangeTree.children || [];
  const selectedPriorityNode = selectedChainPriorityId === 'all' 
    ? availablePriorities[0] 
    : (availablePriorities.find(p => p.id === selectedChainPriorityId) || availablePriorities[0]);

  const selectedOutcomeNode = selectedPriorityNode?.children?.[0];
  const selectedInterventionNode = selectedOutcomeNode?.children?.[0];

  return (
    <div className="space-y-6">

      {/* Explorer Controls & View Switcher Bar */}
      <div className="dashboard-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <GitFork className="w-4 h-4" />
            <span>Theory of Change Engine • {activeFwObj.name} ({activeFwObj.code})</span>
          </div>
          <h2 className="text-lg font-black text-white mt-0.5">
            {activeFwObj.fullName} Results Architecture
          </h2>
          <p className="text-xs text-slate-300">
            Dynamically filtered for <strong className="text-blue-300">{activeFwObj.name}</strong> • FY <strong className="text-emerald-300">{filters.reportingPeriod}</strong>
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
            <span>Flow View (6-Stage Chain)</span>
          </button>
          <button
            onClick={() => setTocVisualization('table')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
              tocVisualization === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Indicator Table ({filteredIndicators.length})</span>
          </button>
        </div>
      </div>

      {/* Active Drill-Down Path Breadcrumbs Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs flex-wrap gap-2">
        <div className="flex items-center space-x-2 overflow-x-auto text-xs py-1">
          <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1">Active Path:</span>
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
                <span className="text-[10px] opacity-80">({node.achievement !== null && node.achievement > 0 ? `${node.achievement}%` : 'N/A'})</span>
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
                {currentNode.achievement !== null && currentNode.achievement > 0 ? `${currentNode.achievement}%` : 'N/A'}
              </p>
              <p className="text-xs text-slate-500 font-medium">{currentNode.indicatorCount} Contributing Indicators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-500">Responsible Division:</span>
              <p className="font-bold text-slate-900">{currentNode.departmentName}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Associated Projects:</span>
              <p className="font-bold text-purple-700">{currentNode.projectIds.join(', ').toUpperCase() || 'Sector-Wide'}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Active Framework Alignment:</span>
              <p className="font-bold text-blue-700">{activeFwObj.fullName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tree View */}
      {tocVisualization === 'tree' && (
        <div className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{activeFwObj.name} Hierarchical Tree Structure</h3>
              <p className="text-xs text-slate-500">Click cards to expand lower levels or inspect contributing indicators.</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">
              {activeFwObj.code}
            </span>
          </div>
          <RenderTreeNode node={theoryOfChangeTree} depth={0} />
        </div>
      )}

      {/* FULL 6-STAGE RESULTS PIPELINE FLOW GRAPH */}
      {tocVisualization === 'flow' && (
        <div className="dashboard-card p-6 space-y-6">
          
          {/* Header & Sub-Chain Filter */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>Full M&E Results Pipeline (Inputs ➔ Activities ➔ Outputs ➔ Intermediate Outcomes ➔ Strategic Outcomes ➔ Impact)</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Complete Results Chain for {activeFwObj.fullName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect how financial and operational inputs convert through activities, outputs, and outcomes to achieve long-term national impact.
              </p>
            </div>

            {/* Priority Selector */}
            {availablePriorities.length > 0 && (
              <div className="flex items-center space-x-2 flex-shrink-0 text-xs">
                <span className="font-bold text-slate-700">Priority Chain:</span>
                <select
                  value={selectedChainPriorityId}
                  onChange={(e) => setSelectedChainPriorityId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">All Strategic Priorities</option>
                  {availablePriorities.map(p => (
                    <option key={p.id} value={p.id}>{p.code}: {p.name.split(':')[1] || p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Horizontal 6-Stage Scrollable Chain Visualizer */}
          <div className="overflow-x-auto pb-4 pt-2">
            <div className="flex items-stretch space-x-4 min-w-[1400px]">
              
              {/* STAGE 1: INPUTS */}
              <div className="w-64 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between flex-shrink-0 shadow-lg border border-slate-700">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-700 text-slate-100 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>STAGE 1 • INPUTS</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Resource Allocation</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Financial & Human Inputs</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    National M&E budget allocation, development partner financing, and personnel deployment.
                  </p>
                  
                  <div className="mt-4 space-y-2 text-xs bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Ministry Budget:</span>
                      <strong className="text-emerald-400">TZS 358.0B</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Project Grants:</span>
                      <strong className="text-purple-300">$1.25 Billion</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Key Projects:</span>
                      <strong className="text-blue-300">SEQUIP, HEET, EP4R</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-slate-300 flex items-center justify-between font-medium">
                  <span>Owner: MoEST & Treasury</span>
                  <span className="text-emerald-400 font-bold">100% Funds Committed</span>
                </div>
              </div>

              {/* Arrow Connection */}
              <div className="flex items-center text-slate-400 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-blue-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Deploys</span>
                </div>
              </div>

              {/* STAGE 2: ACTIVITIES / INTERVENTIONS */}
              <div className="w-64 p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-800 text-white flex flex-col justify-between flex-shrink-0 shadow-lg border border-indigo-700">
                <div>
                  <div className="flex items-center justify-between border-b border-indigo-700 pb-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-700 text-indigo-100 flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-indigo-300" />
                      <span>STAGE 2 • ACTIVITIES</span>
                    </span>
                    <span className="text-[10px] text-indigo-200 font-mono">Implementation</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Interventions & Operations</h4>
                  <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
                    {selectedInterventionNode ? selectedInterventionNode.name : 'Core operational training, civil works, and module rollouts.'}
                  </p>

                  <div className="mt-4 space-y-2 text-xs bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-800">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-200">Execution Rate:</span>
                      <strong className="text-emerald-300">82.0%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-200">Division Lead:</span>
                      <strong className="text-indigo-100 text-[11px] truncate">{selectedPriorityNode?.departmentName || 'Division of Secondary Ed'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-200">Ongoing Activities:</span>
                      <strong className="text-indigo-200">24 Major Tasks</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-700 text-[11px] text-indigo-200 flex items-center justify-between font-medium">
                  <span>Status: Operational</span>
                  <span className="text-emerald-400 font-bold">82% Delivery Rate</span>
                </div>
              </div>

              {/* Arrow Connection */}
              <div className="flex items-center text-slate-400 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-indigo-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Delivers</span>
                </div>
              </div>

              {/* STAGE 3: OUTPUTS */}
              <div className="w-64 p-4 rounded-xl bg-gradient-to-br from-amber-900 to-amber-800 text-white flex flex-col justify-between flex-shrink-0 shadow-lg border border-amber-700">
                <div>
                  <div className="flex items-center justify-between border-b border-amber-700 pb-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-700 text-amber-100 flex items-center gap-1">
                      <PackageCheck className="w-3 h-3 text-amber-300" />
                      <span>STAGE 3 • OUTPUTS</span>
                    </span>
                    <span className="text-[10px] text-amber-200 font-mono">Delivered Goods</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Direct Delivered Products</h4>
                  <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                    Infrastructure constructed, teachers trained, and capitation grants disbursed.
                  </p>

                  <div className="mt-4 space-y-2 text-xs bg-amber-950/60 p-2.5 rounded-lg border border-amber-800">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-200">Ward Schools Built:</span>
                      <strong className="text-emerald-300">120 Schools</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-200">TCPD Modules:</span>
                      <strong className="text-amber-300">112 LGAs Completed</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-200">Capitation Grants:</span>
                      <strong className="text-emerald-300">95.8% Disbursed</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-700 text-[11px] text-amber-200 flex items-center justify-between font-medium">
                  <span>Output Verification</span>
                  <span className="text-amber-300 font-bold">78.5% Target Achieved</span>
                </div>
              </div>

              {/* Arrow Connection */}
              <div className="flex items-center text-slate-400 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-amber-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Leads To</span>
                </div>
              </div>

              {/* STAGE 4: INTERMEDIATE OUTCOMES */}
              <div className="w-64 p-4 rounded-xl bg-gradient-to-br from-teal-900 to-teal-800 text-white flex flex-col justify-between flex-shrink-0 shadow-lg border border-teal-700">
                <div>
                  <div className="flex items-center justify-between border-b border-teal-700 pb-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-700 text-teal-100 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-teal-300" />
                      <span>STAGE 4 • INT. OUTCOMES</span>
                    </span>
                    <span className="text-[10px] text-teal-200 font-mono">System Upgrades</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Capacity & Competency Upgrades</h4>
                  <p className="text-xs text-teal-100 mt-1 leading-relaxed">
                    {selectedOutcomeNode ? selectedOutcomeNode.name : 'Enhanced teacher competency, school environment, and PhD academic staff ratios.'}
                  </p>

                  <div className="mt-4 space-y-2 text-xs bg-teal-950/60 p-2.5 rounded-lg border border-teal-800">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-200">Pupil-Teacher Ratio:</span>
                      <strong className="text-emerald-300">38.2 Pupils/Tch</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-200">Teacher CPD Cert:</span>
                      <strong className="text-amber-300">61.2% (At Risk)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-200">Uni PhD Staff:</span>
                      <strong className="text-emerald-300">44.8%</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-teal-700 text-[11px] text-teal-200 flex items-center justify-between font-medium">
                  <span>Outcome Progress</span>
                  <span className="text-amber-400 font-bold">{selectedOutcomeNode?.achievement ? `${selectedOutcomeNode.achievement}%` : '76.5%'} Score</span>
                </div>
              </div>

              {/* Arrow Connection */}
              <div className="flex items-center text-slate-400 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-teal-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Drives</span>
                </div>
              </div>

              {/* STAGE 5: STRATEGIC OUTCOMES */}
              <div className="w-64 p-4 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-800 text-white flex flex-col justify-between flex-shrink-0 shadow-lg border border-emerald-700">
                <div>
                  <div className="flex items-center justify-between border-b border-emerald-700 pb-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-700 text-emerald-100 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-300" />
                      <span>STAGE 5 • OUTCOMES</span>
                    </span>
                    <span className="text-[10px] text-emerald-200 font-mono">Sector Results</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Strategic Sector Performance</h4>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    {selectedPriorityNode ? selectedPriorityNode.name : 'Equitable access, retention, STEM enrolment, and vocational employment rates.'}
                  </p>

                  <div className="mt-4 space-y-2 text-xs bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200">Secondary NER:</span>
                      <strong className="text-emerald-300">58.4% Enrolled</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200">Girls Completion:</span>
                      <strong className="text-emerald-300">76.5% Completed</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200">TVET Intake:</span>
                      <strong className="text-emerald-300">218,500 Students</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-700 text-[11px] text-emerald-200 flex items-center justify-between font-medium">
                  <span>Priority Achievement</span>
                  <span className="text-emerald-400 font-bold">{selectedPriorityNode?.achievement ? `${selectedPriorityNode.achievement}%` : '83.5%'} Score</span>
                </div>
              </div>

              {/* Arrow Connection */}
              <div className="flex items-center text-slate-400 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Fulfills</span>
                </div>
              </div>

              {/* STAGE 6: NATIONAL IMPACT */}
              <div className="w-64 p-4 rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white flex flex-col justify-between flex-shrink-0 shadow-xl border border-blue-600 ring-2 ring-blue-500/20">
                <div>
                  <div className="flex items-center justify-between border-b border-blue-700 pb-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white flex items-center gap-1">
                      <Globe2 className="w-3 h-3 text-blue-200" />
                      <span>STAGE 6 • IMPACT</span>
                    </span>
                    <span className="text-[10px] text-blue-200 font-mono">National Goal</span>
                  </div>
                  <h4 className="text-sm font-black text-white">{activeFwObj.name} National Goal</h4>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Long-term national economic transformation, industrial skills development, and UN SDG 4 achievement.
                  </p>

                  <div className="mt-4 space-y-2 text-xs bg-blue-950/80 p-2.5 rounded-lg border border-blue-700">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Framework Code:</span>
                      <strong className="text-blue-200 font-mono">{activeFwObj.code}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Aligned Framework:</span>
                      <strong className="text-emerald-300">{activeFwObj.name}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Reporting Horizon:</span>
                      <strong className="text-amber-300">{activeFwObj.period}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-700 text-[11px] text-blue-100 flex items-center justify-between font-bold">
                  <span>Overall Sector Score</span>
                  <span className="text-emerald-400 text-sm font-black">{activeFwObj.overallScore}%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Results Chain Legend & Summary Note */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center space-x-4 flex-wrap gap-y-2">
              <span className="font-bold text-slate-800">Results Chain Stages:</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block"></span> 1. Inputs</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-indigo-700 inline-block"></span> 2. Activities</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-700 inline-block"></span> 3. Outputs</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-teal-700 inline-block"></span> 4. Int. Outcomes</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span> 5. Outcomes</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-blue-800 inline-block"></span> 6. Impact</span>
            </div>
            <div className="text-slate-500 italic">
              * Click any card in Tree View or Indicator Table to inspect lower-level metrics.
            </div>
          </div>

        </div>
      )}

      {/* Indicator Table View */}
      {tocVisualization === 'table' && (() => {
        // Filter indicators by search query and status filter
        const tableFilteredIndicators = filteredIndicators.filter(ind => {
          if (tableSearchQuery.trim()) {
            const q = tableSearchQuery.toLowerCase();
            const matchCode = ind.code.toLowerCase().includes(q);
            const matchName = ind.name.toLowerCase().includes(q);
            const matchDept = ind.responsibleDepartmentName.toLowerCase().includes(q);
            if (!matchCode && !matchName && !matchDept) return false;
          }

          if (tableStatusFilter !== 'all') {
            const ratio = ind.actual !== null 
              ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
              : null;
            const currentStatus: PerformanceStatus = ratio === null ? 'NODATA' : ratio >= 90 ? 'GREEN' : ratio >= 70 ? 'YELLOW' : 'RED';
            if (tableStatusFilter !== currentStatus) return false;
          }

          return true;
        });

        // Compute summary counts
        let greenCount = 0;
        let yellowCount = 0;
        let redCount = 0;
        let totalScore = 0;
        let scoredCount = 0;

        tableFilteredIndicators.forEach(ind => {
          const ratio = ind.actual !== null 
            ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
            : null;
          if (ratio !== null) {
            totalScore += ratio;
            scoredCount++;
            if (ratio >= 90) greenCount++;
            else if (ratio >= 70) yellowCount++;
            else redCount++;
          }
        });

        const avgScore = scoredCount > 0 ? Math.round((totalScore / scoredCount) * 10) / 10 : 0;

        return (
          <div className="dashboard-card p-5 overflow-hidden">
            
            {/* Header and Filter Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                    {activeFwObj.code} Linked Indicators
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Results Indicators Matrix ({tableFilteredIndicators.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Displaying Key Performance Indicators aligned to {activeFwObj.fullName} • FY {filters.reportingPeriod}
                </p>
              </div>

              {/* Action Filters Bar */}
              <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
                
                {/* Search Box */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    placeholder="Search code, metric, division..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Status Filter Pill Buttons */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setTableStatusFilter('all')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                      tableStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({tableFilteredIndicators.length})
                  </button>
                  <button
                    onClick={() => setTableStatusFilter('GREEN')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                      tableStatusFilter === 'GREEN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    🟢 On Target ({greenCount})
                  </button>
                  <button
                    onClick={() => setTableStatusFilter('YELLOW')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                      tableStatusFilter === 'YELLOW' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    🟡 At Risk ({yellowCount})
                  </button>
                  <button
                    onClick={() => setTableStatusFilter('RED')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                      tableStatusFilter === 'RED' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-50'
                    }`}
                  >
                    🔴 Delayed ({redCount})
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Metrics Summary Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 text-xs">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Average Achievement</span>
                  <p className="font-black text-slate-900 text-sm">{avgScore}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">On Target Rate</span>
                  <p className="font-black text-emerald-600 text-sm">
                    {tableFilteredIndicators.length > 0 ? Math.round((greenCount / tableFilteredIndicators.length) * 100) : 0}% ({greenCount}/{tableFilteredIndicators.length})
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">At Risk Metrics</span>
                  <p className="font-black text-amber-600 text-sm">{yellowCount} Indicators</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Framework Plan</span>
                  <p className="font-black text-purple-700 text-sm">{activeFwObj.name} ({activeFwObj.period})</p>
                </div>
              </div>
            </div>

            {tableFilteredIndicators.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 italic">No indicators found matching the search criteria.</p>
                <button
                  onClick={() => { setTableSearchQuery(''); setTableStatusFilter('all'); }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                      <th className="p-3">Code</th>
                      <th className="p-3">Indicator Name & Description</th>
                      <th className="p-3">{activeFwObj.name} Objective Alignment</th>
                      <th className="p-3">Baseline</th>
                      <th className="p-3">FY {filters.reportingPeriod} Target</th>
                      <th className="p-3">FY {filters.reportingPeriod} Actual</th>
                      <th className="p-3 w-36">Achievement %</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Division</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                    {tableFilteredIndicators.map((ind) => {
                      const ratio = ind.actual !== null 
                        ? (ind.isInverse ? (ind.target / ind.actual) * 100 : (ind.actual / ind.target) * 100)
                        : null;
                      const achievementPercent = ratio !== null ? Math.round(ratio * 10) / 10 : null;
                      const achievementFormatted = ratio !== null ? `${achievementPercent}%` : 'No Data';

                      // Find framework specific alignment
                      const alignment = ind.alignedFrameworks.find(af => af.frameworkId === activeFwObj.id);

                      const statusType: PerformanceStatus = ratio === null ? 'NODATA' : ratio >= 90 ? 'GREEN' : ratio >= 70 ? 'YELLOW' : 'RED';

                      return (
                        <tr key={ind.code} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3 font-mono font-black text-blue-700 whitespace-nowrap">
                            <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded">
                              {ind.code}
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <p className="font-bold text-slate-900 leading-snug">{ind.name}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ind.definition}</p>
                          </td>
                          <td className="p-3 max-w-xs">
                            {alignment ? (
                              <div>
                                <p className="font-semibold text-slate-800 leading-snug">{alignment.objective}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                    alignment.contributionType === 'Direct' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {alignment.contributionType}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">Target: {alignment.target}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Sector-Wide Alignment</span>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap font-medium text-slate-600">
                            {ind.baseline} {ind.unit} <span className="text-[10px] text-slate-400">({ind.baselineYear})</span>
                          </td>
                          <td className="p-3 whitespace-nowrap font-bold text-slate-700">
                            {ind.target} {ind.unit}
                          </td>
                          <td className="p-3 whitespace-nowrap font-black text-slate-900">
                            {ind.actual !== null ? `${ind.actual} ${ind.unit}` : <span className="text-slate-400 italic">No Data</span>}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between font-black text-slate-900">
                                <span>{achievementFormatted}</span>
                              </div>
                              {ratio !== null && (
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                                  <div 
                                    style={{ width: `${Math.min(ratio, 100)}%` }} 
                                    className={`h-full rounded-full ${
                                      ratio >= 90 ? 'bg-emerald-500' : ratio >= 70 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {getStatusBadge(statusType)}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                              <Building2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                              <span className="truncate max-w-[140px]" title={ind.responsibleDepartmentName}>
                                {ind.responsibleDepartmentName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => openIndicatorByCode(ind.code)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 mx-auto"
                            >
                              <span>Inspect</span>
                              <ArrowUpRight className="w-3 h-3" />
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
      })()}

    </div>
  );
};
