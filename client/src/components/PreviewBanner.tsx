import React from 'react';
import { Eye, Lock, ArrowRight } from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

export const PreviewBanner: React.FC = () => {
  const { isAuthenticated, activeTab, setAuthModalOpen } = useComplianceStore();

  // Show banner only when browsing demo mode pages while unauthenticated
  if (isAuthenticated || activeTab === 'landing') return null;

  return (
    <div className="bg-gradient-to-r from-brand-900/90 via-slate-900 to-emerald-950/90 border-b border-brand-500/30 px-4 py-2.5 backdrop-blur-md sticky top-0 z-40 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 font-extrabold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Eye className="w-3 h-3 text-brand-400 animate-pulse" /> Preview Mode
          </span>
          <span className="text-slate-300 font-medium">
            You are exploring <span className="text-white font-bold">Arky AI</span> in interactive demo mode. Sign in to save custom policies, upload evidence, and export auditor reports.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Sign In to Unlock</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
