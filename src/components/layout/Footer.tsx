import React from 'react';
import { ShieldCheck, ExternalLink, Mail, Phone, Globe } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useDashboard();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 py-8 px-6 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
        
        {/* Col 1: Government Branding */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-md">
              MoEST
            </div>
            <div>
              <h4 className="font-bold text-white leading-tight">MoEST Tanzania</h4>
              <p className="text-[11px] text-emerald-400 font-medium">Integrated M&E Platform (MEIS)</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Official Monitoring and Evaluation Information System of the Ministry of Education, Science and Technology, United Republic of Tanzania.
          </p>
        </div>

        {/* Col 2: Core Sector Frameworks */}
        <div className="space-y-2">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">Sector Frameworks</h5>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('frameworks')} className="hover:text-emerald-400 transition-colors">
                ESDP V (2025/26–2029/30)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('frameworks')} className="hover:text-emerald-400 transition-colors">
                MoEST Strategic Plan 2030
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('frameworks')} className="hover:text-emerald-400 transition-colors">
                UN SDG 4 Quality Education
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('frameworks')} className="hover:text-emerald-400 transition-colors">
                CCM Election Manifesto 2020–2030
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Major Programs */}
        <div className="space-y-2">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">Major Programs</h5>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('projects')} className="hover:text-emerald-400 transition-colors">
                SEQUIP Secondary Education ($535M)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('projects')} className="hover:text-emerald-400 transition-colors">
                HEET Higher Education ($425M)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('projects')} className="hover:text-emerald-400 transition-colors">
                EP4R Results Program ($290M)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('cross-cutting')} className="hover:text-emerald-400 transition-colors">
                Cross-Framework Alignment Matrix
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Official Contacts & Security */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">Support & Helpdesk</h5>
          <div className="space-y-1.5 text-slate-400 text-[11px]">
            <p className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Portal: <a href="https://www.moe.go.tz" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">www.moe.go.tz</a></span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>meis.support@moe.go.tz</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+255 (0) 26 2323253</span>
            </p>
          </div>
          <div className="pt-2 flex items-center space-x-2 text-[10px] text-emerald-400 bg-slate-800 p-2 rounded border border-slate-700">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Government Data Security Standard (GDSS) Compliant</span>
          </div>
        </div>

      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
        <p>© {new Date().getFullYear()} Ministry of Education, Science and Technology (MoEST), United Republic of Tanzania. All rights reserved.</p>
        <p className="flex items-center space-x-3">
          <span>MEIS v3.2.0</span>
          <span>•</span>
          <a href="https://elimu.moe.go.tz" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
            <span>Elimu Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </footer>
  );
};
