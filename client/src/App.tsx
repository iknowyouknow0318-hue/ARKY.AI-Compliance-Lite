import React, { useEffect } from 'react';
import { useComplianceStore } from './store/useComplianceStore';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ClerkAuthModal } from './components/ClerkAuthModal';
import { PreviewBanner } from './components/PreviewBanner';
import { LoginGateModal } from './components/LoginGateModal';

import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProductVisionPage } from './pages/ProductVisionPage';
import { DashboardPage } from './pages/DashboardPage';
import { PolicyGeneratorPage } from './pages/PolicyGeneratorPage';
import { ControlDashboardPage } from './pages/ControlDashboardPage';
import { AuditChecklistPage } from './pages/AuditChecklistPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export function App() {
  const { activeTab, isAuthenticated, setAuthModalOpen } = useComplianceStore();

  useEffect(() => {
    if (!isAuthenticated && activeTab !== 'landing' && activeTab !== 'vision') {
      setAuthModalOpen(true);
    }
  }, [activeTab, isAuthenticated, setAuthModalOpen]);

  const isFullWidthPage = activeTab === 'landing' || activeTab === 'onboarding' || activeTab === 'vision';

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 font-sans flex flex-col selection:bg-sky-600 selection:text-white relative overflow-x-hidden">
      {/* ── Floating Sky Blue Blurred Mesh Orbs (Product Vision Canvas Style) ── */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-300 opacity-60 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-300 via-sky-400 to-blue-400 opacity-50 blur-[130px] pointer-events-none z-0" />

      {/* Top Notification Banner for Demo Mode */}
      <div className="relative z-10">
        <PreviewBanner />

        {/* Top Navbar */}
        <Navbar />

        {/* Auth Modals */}
        <ClerkAuthModal />
        <LoginGateModal />

        {/* Main Body View */}
        {isFullWidthPage ? (
          <main className="flex-1">
            {activeTab === 'landing' && <LandingPage />}
            {activeTab === 'onboarding' && <OnboardingPage />}
            {activeTab === 'vision' && <ProductVisionPage />}
          </main>
        ) : (
          <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
            {/* Dashboard Sidebar */}
            <Sidebar />

            {/* Platform Tab Modules */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {activeTab === 'dashboard' && <DashboardPage />}
              {activeTab === 'policies' && <PolicyGeneratorPage />}
              {activeTab === 'controls' && <ControlDashboardPage />}
              {activeTab === 'checklist' && <AuditChecklistPage />}
              {activeTab === 'assistant' && <AiAssistantPage />}
              {activeTab === 'logs' && <AuditLogsPage />}
              {activeTab === 'settings' && <SettingsPage />}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;
