import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ExecutiveOverview } from './components/overview/ExecutiveOverview';
import { FrameworksView } from './components/frameworks/FrameworksView';
import { ProjectsView } from './components/projects/ProjectsView';
import { DepartmentsView } from './components/departments/DepartmentsView';
import { CrossFrameworkView } from './components/shared/CrossFrameworkView';
import { IndicatorDetailModal } from './components/shared/IndicatorDetailModal';
import { AlertsDrawer } from './components/shared/AlertsDrawer';

const MainContent: React.FC = () => {
  const { activeTab } = useDashboard();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col justify-between">
      <div>
        {activeTab === 'overview' && <ExecutiveOverview />}
        {activeTab === 'frameworks' && <FrameworksView />}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'departments' && <DepartmentsView />}
        {activeTab === 'cross-cutting' && <CrossFrameworkView />}
        {activeTab === 'indicators' && <CrossFrameworkView />}
        {activeTab === 'alerts' && <ExecutiveOverview />}
        {activeTab === 'data-quality' && <CrossFrameworkView />}
        {activeTab === 'settings' && <ExecutiveOverview />}
      </div>
      <Footer />
    </main>
  );
};

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-800 overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Area */}
        <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <Header />
          <MainContent />
        </div>

        {/* Global Modals / Drawers */}
        <IndicatorDetailModal />
        <AlertsDrawer />
      </div>
    </DashboardProvider>
  );
}
