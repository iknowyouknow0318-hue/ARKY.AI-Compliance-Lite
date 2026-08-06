import React from 'react';
import { ShieldCheck, Sparkles, UserCheck, Lock, ExternalLink, Menu, ChevronRight } from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { UserButton, useUser } from '@clerk/clerk-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, setAuthModalOpen, isAuthenticated, score, userProfile } = useComplianceStore();
  const { isSignedIn, user } = useUser();

  const isUserLoggedIn = isSignedIn || isAuthenticated;
  const currentScore = score?.overall_score ?? 85;

  const rawUser = user as any;
  const rawProfile = userProfile as any;
  const displayName = rawUser?.fullName || rawUser?.firstName || rawUser?.primaryEmailAddress?.emailAddress?.split('@')[0] || rawProfile?.firstName || rawProfile?.email?.split('@')[0] || rawProfile?.companyName || 'Compliance Officer';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-sky-100/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-sky-900/10 group-hover:scale-105 transition-all">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                Arky<span className="text-sky-600">.ai</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-700 border border-sky-500/20 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> 2026 ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">SOC 2 • HIPAA • GDPR Compliance Suite</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-sky-50/80 p-1.5 rounded-full border border-sky-100 shadow-inner">
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'vision'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Product Vision
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              ['dashboard', 'policies', 'controls', 'checklist', 'assistant', 'settings', 'logs'].includes(activeTab)
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30 ring-2 ring-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            Compliance Suite
          </button>

          <button
            onClick={() => setActiveTab('onboarding')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'onboarding'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            5-Min Onboarding
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Live Auditor Readiness Score Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50/80 border border-sky-100 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500">Readiness:</span>
            <span className="font-mono text-sky-700 font-extrabold">{currentScore}%</span>
          </div>

          {/* Welcome User Badge after login */}
          {isUserLoggedIn && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-sky-50 via-blue-50 to-sky-100/80 px-4 py-1.5 rounded-full border border-sky-200/90 shadow-sm animate-fadeIn">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-black shadow-md">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-extrabold text-slate-800">
                Welcome back, <span className="text-sky-700 font-black">{displayName}</span>! 👋
              </span>
            </div>
          )}

          {isUserLoggedIn ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-4.5 py-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-sky-600/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Go to Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-4.5 py-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-sky-600/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
