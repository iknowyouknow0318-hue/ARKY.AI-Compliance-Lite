import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Zap, Lock, CheckCircle2, FileText } from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

export const ProductVisionPage: React.FC = () => {
  const { setActiveTab } = useComplianceStore();

  return (
    <div className="relative min-h-screen bg-[#F0F7FF] text-slate-900 overflow-hidden font-sans selection:bg-sky-500 selection:text-white flex flex-col justify-between p-6 sm:p-12 lg:p-20">
      
      {/* ── Light Blue Dreamy Blurred Gradient Mesh Orb (Right Side) ── */}
      <div className="absolute top-1/2 right-[-10%] lg:right-[5%] -translate-y-1/2 w-[340px] sm:w-[480px] lg:w-[620px] h-[340px] sm:h-[480px] lg:h-[620px] rounded-full bg-gradient-to-tr from-sky-400 via-blue-600 to-teal-300 opacity-80 blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-black text-xl text-slate-900 tracking-tight block">
              Arky<span className="text-sky-600">.ai</span>
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">SOC 2 • HIPAA • GDPR Vision</span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-2xl my-auto py-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-700 border border-sky-500/20 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Product Vision</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.08] mb-6">
          Dreamy Gradient.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed mb-8 max-w-lg">
          Get unique blurred and adjustable light blue gradient assets for your next enterprise compliance project.
        </p>

        {/* Social / Author Tag */}
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 mb-10">
          <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
          </svg>
          <span className="text-slate-900 font-bold">@arkycompliance</span>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/90 border border-sky-100/90 shadow-sm backdrop-blur-md hover:shadow-md transition-shadow">
            <Zap className="w-5 h-5 text-sky-600 mb-2" />
            <h3 className="font-display font-extrabold text-sm text-slate-900">Zero Chaos</h3>
            <p className="text-xs text-slate-500 mt-1">Structured 4-step setup replaces 6-month consulting engagements.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/90 border border-sky-100/90 shadow-sm backdrop-blur-md hover:shadow-md transition-shadow">
            <Lock className="w-5 h-5 text-blue-600 mb-2" />
            <h3 className="font-display font-extrabold text-sm text-slate-900">Auditor Proof</h3>
            <p className="text-xs text-slate-500 mt-1">SHA-256 cryptographic digests ensure Big-4 sign-off confidence.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/90 border border-sky-100/90 shadow-sm backdrop-blur-md hover:shadow-md transition-shadow">
            <FileText className="w-5 h-5 text-teal-600 mb-2" />
            <h3 className="font-display font-extrabold text-sm text-slate-900">AI Synthesizer</h3>
            <p className="text-xs text-slate-500 mt-1">Generates custom SOC 2 &amp; HIPAA policies in under 60 seconds.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/90 border border-sky-100/90 shadow-sm backdrop-blur-md hover:shadow-md transition-shadow">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
            <h3 className="font-display font-extrabold text-sm text-slate-900">1-Click PDF Export</h3>
            <p className="text-xs text-slate-500 mt-1">Bundles all policies &amp; control evidence into a clean auditor binder.</p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-slate-400 border-t border-sky-200/60 pt-6">
        <span>Arky Compliance Engine v2.0</span>
        <span>SOC 2 · HIPAA · GDPR Safeguards</span>
      </div>
    </div>
  );
};

