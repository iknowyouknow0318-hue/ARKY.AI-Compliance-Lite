import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Cloud, 
  Database, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

export const OnboardingPage: React.FC = () => {
  const { onboardingData, setOnboardingData, completeOnboarding } = useComplianceStore();
  const [step, setStep] = useState(1);

  const totalSteps = 5;

  const frameworksOptions = ['SOC 2 Type II', 'HIPAA Safeguards', 'GDPR Data Rights', 'ISO 27001'];
  const cloudOptions = ['Supabase + Vercel', 'AWS Cloud', 'Google Cloud Platform (GCP)', 'Microsoft Azure'];
  const dataOptions = ['Customer Auth & Email', 'Financial & Payment Tokens', 'Protected Health Info (ePHI)', 'Personal Data (PII)'];
  const teamOptions = ['1-5 (Founder + Core Eng)', '6-20 (Growth Phase)', '21-50 (Scaling Phase)'];

  const toggleFramework = (fw: string) => {
    const current = onboardingData.targetFrameworks || [];
    if (current.includes(fw)) {
      setOnboardingData({ targetFrameworks: current.filter((f) => f !== fw) });
    } else {
      setOnboardingData({ targetFrameworks: [...current, fw] });
    }
  };

  const toggleDataType = (dt: string) => {
    const current = onboardingData.dataTypes || [];
    if (current.includes(dt)) {
      setOnboardingData({ dataTypes: current.filter((d) => d !== dt) });
    } else {
      setOnboardingData({ dataTypes: [...current, dt] });
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Ensure sensible defaults if user leaves fields empty
      setOnboardingData({
        companyName: onboardingData.companyName.trim() || 'Acme SaaS Inc',
        industry: onboardingData.industry.trim() || 'B2B SaaS',
        targetFrameworks: (onboardingData.targetFrameworks && onboardingData.targetFrameworks.length > 0) 
          ? onboardingData.targetFrameworks 
          : ['SOC 2 Type II', 'HIPAA Safeguards'],
        cloudProvider: onboardingData.cloudProvider || 'Supabase + Vercel',
        dataTypes: (onboardingData.dataTypes && onboardingData.dataTypes.length > 0) 
          ? onboardingData.dataTypes 
          : ['Customer Auth & Email', 'Personal Data (PII)'],
        teamSize: onboardingData.teamSize || '1-5 (Founder + Core Eng)'
      });
      
      completeOnboarding();
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 bg-[#F0F7FF]">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl p-6 sm:p-10 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl relative overflow-hidden">
        
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="text-sky-600 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Onboarding Setup
            </span>
            <span className="font-mono text-slate-700">Step {step} of {totalSteps}</span>
          </div>
          <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Startup Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tell us about your Startup</h2>
              <p className="text-xs text-slate-600 mt-1">We customize your SOC 2 &amp; HIPAA audit policies specifically for your company model.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Startup Name</label>
                <input
                  type="text"
                  value={onboardingData.companyName}
                  onChange={(e) => setOnboardingData({ companyName: e.target.value })}
                  placeholder="e.g. Acme SaaS Inc"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-sky-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Industry Sector</label>
                <input
                  type="text"
                  value={onboardingData.industry}
                  onChange={(e) => setOnboardingData({ industry: e.target.value })}
                  placeholder="e.g. FinTech / B2B SaaS / HealthTech"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-sky-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Target Frameworks */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Select Compliance Targets</h2>
              <p className="text-xs text-slate-600 mt-1">Which certifications do your enterprise buyers or auditors require?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {frameworksOptions.map((fw) => {
                const isSelected = onboardingData.targetFrameworks?.includes(fw);
                return (
                  <div
                    key={fw}
                    onClick={() => toggleFramework(fw)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-slate-900 shadow-md shadow-sky-500/10'
                        : 'bg-white/80 border-sky-100 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className={`w-5 h-5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{fw}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Cloud Infrastructure */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Primary Infrastructure Provider</h2>
              <p className="text-xs text-slate-600 mt-1">Where is your application database and API backend hosted?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cloudOptions.map((cloud) => {
                const isSelected = onboardingData.cloudProvider === cloud;
                return (
                  <div
                    key={cloud}
                    onClick={() => setOnboardingData({ cloudProvider: cloud })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-slate-900 shadow-md shadow-sky-500/10'
                        : 'bg-white/80 border-sky-100 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Cloud className={`w-5 h-5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{cloud}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Data Sensitivity */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Data Types Processed</h2>
              <p className="text-xs text-slate-600 mt-1">Select all categories of data your system handles.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dataOptions.map((dt) => {
                const isSelected = onboardingData.dataTypes?.includes(dt);
                return (
                  <div
                    key={dt}
                    onClick={() => toggleDataType(dt)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-slate-900 shadow-md shadow-sky-500/10'
                        : 'bg-white/80 border-sky-100 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Database className={`w-5 h-5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{dt}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Team Size & Generation */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Size &amp; Access Control Scope</h2>
              <p className="text-xs text-slate-600 mt-1">Final step before AI synthesizes your custom compliance roadmap.</p>
            </div>

            <div className="space-y-3">
              {teamOptions.map((team) => {
                const isSelected = onboardingData.teamSize === team;
                return (
                  <div
                    key={team}
                    onClick={() => setOnboardingData({ teamSize: team })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-slate-900 shadow-md shadow-sky-500/10'
                        : 'bg-white/80 border-sky-100 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className={`w-5 h-5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{team}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-sky-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            className="px-7 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
          >
            <span>{step === totalSteps ? 'Generate Compliance Roadmap' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
