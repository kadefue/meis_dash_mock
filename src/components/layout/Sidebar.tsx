import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  FolderKanban, 
  Building2, 
  Target, 
  FileText, 
  Bell, 
  CheckCircle2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import type { MainTab } from '../../context/DashboardContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeTab, setActiveTab, alerts } = useDashboard();

  const unreadAlertsCount = alerts.filter(a => a.severity === 'RED').length;

  const primaryNavItems: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'frameworks', label: 'Frameworks', icon: <GitFork className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'departments', label: 'Departments', icon: <Building2 className="w-5 h-5" /> }
  ];

  const secondaryNavItems: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'cross-cutting', label: 'Cross-Framework Alignment', icon: <Target className="w-5 h-5" /> },
    { id: 'indicators', label: 'Indicators & Results', icon: <FileText className="w-5 h-5" /> },
    { id: 'alerts', label: 'Management Alerts', icon: <Bell className="w-5 h-5" />, badge: unreadAlertsCount },
    { id: 'data-quality', label: 'Data Quality & Audit', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-100 transition-all duration-300 flex flex-col justify-between border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
              <span className="text-xs font-black tracking-tighter">MoEST</span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-sm font-bold tracking-tight text-white leading-snug truncate">
                  MoEST Tanzania
                </h1>
                <p className="text-xs text-emerald-400 font-medium truncate">
                  Multiframework M&E System
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="px-3 py-4">
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
              Core Modules
            </p>
          )}
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-3 border-t border-slate-800/80 my-2"></div>

        {/* Secondary Navigation */}
        <div className="px-3 py-2">
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
              M&E Diagnostics & Reports
            </p>
          )}
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <div className="ml-3 flex items-center justify-between w-full truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / System Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        {!collapsed ? (
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">MoEST M&E Division</p>
              <p className="text-[10px] text-slate-400 truncate">MEIS Integrated System</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
