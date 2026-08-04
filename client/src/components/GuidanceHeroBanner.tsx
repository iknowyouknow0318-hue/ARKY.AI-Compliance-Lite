import React from 'react';
import { ShieldCheck, Calendar, User, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

export interface GuidanceHeroBannerProps {
  category?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  date?: string;
  onExplore?: () => void;
}

export const GuidanceHeroBanner: React.FC<GuidanceHeroBannerProps> = ({
  category = '2026 Compliance Standard',
  title = 'National Regulatory Framework & AI Audit Enforcement Guidelines',
  subtitle = 'Deputies and enterprise security boards reach unified standard on automated SOC 2, HIPAA, and GDPR safeguards, promising 90% time reduction for SaaS startups.',
  author = 'Arky AI Compliance Board',
  date = 'March 2026 Edition',
  onExplore,
}) => {
  const { setActiveTab } = useComplianceStore();

  const handleAction = () => {
    if (onExplore) {
      onExplore();
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 my-6 group">
      {/* Full-bleed Architectural / Enterprise Photo Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1400')`,
        }}
      />

      {/* Dark Multi-layer Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="absolute inset-0 bg-brand-950/30 mix-blend-overlay" />

      {/* Hero Content Container */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col justify-end min-h-[360px] text-white">
        
        {/* Category Pill Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-600 text-white shadow-md shadow-brand-600/30 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-white" />
            {category}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            🟢 Official Guidance
          </span>
        </div>

        {/* High-Impact Headline */}
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug mb-3 max-w-4xl drop-shadow-md">
          {title}
        </h1>

        {/* Subheadline Summary */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mb-6 font-medium drop-shadow">
          {subtitle}
        </p>

        {/* Footer Meta & CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" />
              {author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {date}
            </span>
          </div>

          <button
            onClick={handleAction}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore Guidance Matrix</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  );
};
