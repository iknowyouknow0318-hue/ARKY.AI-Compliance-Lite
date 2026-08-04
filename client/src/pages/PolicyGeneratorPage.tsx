import React, { useState } from 'react';
import {
  Sparkles,
  FileCode2,
  Eye,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Layers,
  X
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { PolicyViewModal } from '../components/PolicyViewModal';
import { api } from '../services/api';
import { Policy } from '../types';

export const PolicyGeneratorPage: React.FC = () => {
  const { policies, addPolicy, onboardingData, setActiveTab } = useComplianceStore();

  const [selectedFramework, setSelectedFramework] = useState<'SOC 2' | 'HIPAA' | 'GDPR'>('SOC 2');
  const [companyName, setCompanyName] = useState(onboardingData.companyName || 'Acme SaaS Inc');
  const [industry, setIndustry] = useState(onboardingData.industry || 'FinTech & B2B SaaS');
  const [cloudProvider, setCloudProvider] = useState(onboardingData.cloudProvider || 'AWS / Supabase');
  const [teamSize, setTeamSize] = useState(onboardingData.teamSize || '1-15');

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeViewPolicy, setActiveViewPolicy] = useState<Policy | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [lastGeneratedTitle, setLastGeneratedTitle] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowSuccessBanner(false);

    try {
      const generated = await api.generatePolicy({
        framework: selectedFramework,
        companyName,
        industry,
        cloudProvider,
        teamSize,
        dataTypes: onboardingData.dataTypes || ['Customer Email', 'Auth Tokens', 'Financial Records']
      });

      addPolicy(generated);
      setLastGeneratedTitle(generated.title);
      setShowSuccessBanner(true);
      setActiveViewPolicy(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">

      {/* ── Success Banner ───────────────────────────────────────────────── */}
      {showSuccessBanner && (
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Policy created successfully!</p>
              <p className="text-xs text-slate-300 mt-0.5 truncate max-w-lg">{lastGeneratedTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('controls')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-colors"
            >
              <span>Next: Review Controls</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Top Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Multi-LLM Prompt Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Compliance Policy Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesize audit-ready SOC 2, HIPAA, and GDPR policies tailored to your cloud architecture in seconds.
          </p>
        </div>
      </div>

      {/* ── Generator Form & Active Policies Grid ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Generator Form Panel */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">Policy Parameters</h3>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Compliance Framework
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['SOC 2', 'HIPAA', 'GDPR'] as const).map((fw) => (
                  <button
                    key={fw}
                    type="button"
                    onClick={() => setSelectedFramework(fw)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedFramework === fw
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/20'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {fw}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Cloud Provider
              </label>
              <input
                type="text"
                value={cloudProvider}
                onChange={(e) => setCloudProvider(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Team Size Scope
              </label>
              <input
                type="text"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Policy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Generate Audit-Ready Policy</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Generated Policies List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Generated Policies ({policies.length})
            </h3>
            <span className="text-xs text-slate-400">Stored with Supabase RLS</span>
          </div>

          {policies.length === 0 ? (
            <div className="glass-card p-10 rounded-3xl border border-dashed border-slate-700 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No policies generated yet</p>
              <p className="text-xs text-slate-500">Select a framework and click Generate to create your first policy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {policies.map((pol) => (
                <div
                  key={pol.id}
                  className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                        {pol.framework}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{pol.category}</span>
                      <span className="text-[10px] text-slate-400">v{pol.version}.0</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{pol.title}</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pol.compliance_tags?.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-medium text-slate-400 border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveViewPolicy(pol)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-400" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Policy View Modal */}
      <PolicyViewModal
        policy={activeViewPolicy}
        onClose={() => setActiveViewPolicy(null)}
      />

    </div>
  );
};
