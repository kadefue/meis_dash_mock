import React from 'react';
import { 
  X, 
  ShieldAlert 
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const AlertsDrawer: React.FC = () => {
  const { isAlertDrawerOpen, setIsAlertDrawerOpen, alerts, openIndicatorByCode, setFilters, setActiveTab } = useDashboard();

  if (!isAlertDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-base font-black text-white">Management Attention Required</h3>
              <p className="text-xs text-slate-400">Actionable M&E exception reports & risk triggers</p>
            </div>
          </div>
          <button
            onClick={() => setIsAlertDrawerOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              onClick={() => {
                setIsAlertDrawerOpen(false);
                if (alert.targetType === 'indicator') {
                  openIndicatorByCode(alert.targetId);
                } else if (alert.targetType === 'project') {
                  setFilters(prev => ({ ...prev, projectId: alert.targetId }));
                  setActiveTab('projects');
                } else if (alert.targetType === 'department') {
                  setFilters(prev => ({ ...prev, departmentId: alert.targetId }));
                  setActiveTab('departments');
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                alert.severity === 'RED'
                  ? 'bg-red-50/80 border-red-200 hover:bg-red-100/80'
                  : alert.severity === 'YELLOW'
                  ? 'bg-amber-50/80 border-amber-200 hover:bg-amber-100/80'
                  : 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  alert.severity === 'RED' ? 'bg-red-600 text-white' : alert.severity === 'YELLOW' ? 'bg-amber-500 text-slate-900' : 'bg-blue-600 text-white'
                }`}>
                  {alert.severity} • {alert.category}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{alert.timestamp}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">{alert.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{alert.description}</p>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Responsible: <strong className="text-slate-800">{alert.responsibleEntity}</strong></span>
                <span className="font-bold text-blue-600 flex items-center gap-0.5">
                  Inspect & Drill Down →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">{alerts.length} Total Alerts</span>
          <button
            onClick={() => setIsAlertDrawerOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
