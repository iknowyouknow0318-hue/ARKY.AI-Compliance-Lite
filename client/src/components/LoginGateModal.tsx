import React from 'react';
import { ShieldCheck, Lock, Sparkles, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

export const LoginGateModal: React.FC = () => {
  const { isGateModalOpen, closeGateModal, gateActionName, setAuthModalOpen } = useComplianceStore();

  if (!isGateModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) closeGateModal(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white border border-sky-100 rounded-3xl p-8 shadow-2xl animate-slideUp overflow-hidden">
        {/* Glowing Ambient Backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeGateModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-sky-50 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg mb-5">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>

        {/* Title */}
        <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight mb-2">
          Sign in to {gateActionName || 'Continue'}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          You are currently exploring <span className="text-slate-900 font-bold">Arky AI</span>. Create a free account or sign in to execute protected compliance workflows.
        </p>

        {/* Feature Unlocks List */}
        <div className="space-y-2.5 mb-7 p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
          {[
            'Generate custom framework policies',
            'Attach screenshot & configuration evidence',
            'Track daily compliance matrix & checklists',
            'Export Big-4 auditor PDF binders with SHA-256 digests',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              closeGateModal();
              setAuthModalOpen(true);
            }}
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={closeGateModal}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Continue Exploring in Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
};
