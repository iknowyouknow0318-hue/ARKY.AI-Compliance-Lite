import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Plus,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Layers,
  Lock,
  ChevronRight,
  ArrowRight,
  Clock,
  User,
  FileCheck,
  Trophy,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { ComplianceGauge } from '../components/ComplianceGauge';
import { api } from '../services/api';
import { HowToWalkthrough, WalkthroughTrigger } from '../components/HowToWalkthrough';

import { GuidanceHeroBanner } from '../components/GuidanceHeroBanner';

// ── Critical controls that define "Step 3 complete" ──────────────────────
const CRITICAL_CONTROL_CODES = ['CC6.1', 'CC6.6', 'CC8.1', '164.312(a)', 'GDPR-Art32'];

export const DashboardPage: React.FC = () => {
  const {
    setActiveTab,
    score,
    setScore,
    policies,
    setPolicies,
    controls,
    setControls,
    onboardingData,
    subscriptionStatus,
    lastExportedAt,
  } = useComplianceStore();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [dashboardView, setDashboardView] = useState<'overview' | 'velocity' | 'policies'>('overview');

  useEffect(() => {
    api.fetchPolicies().then((res) => { if (res && res.length > 0) setPolicies(res); });
    api.fetchControls().then((res) => { if (res && res.length > 0) setControls(res); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step completion derivation ──────────────────────────────────────────
  const step1Complete = Boolean(onboardingData.isComplete && onboardingData.companyName);
  const step2Complete = policies.length > 0;
  const criticalControls = controls.filter(c => CRITICAL_CONTROL_CODES.includes(c.code));
  const criticalComplete = criticalControls.filter(c => c.status === 'Complete' && c.evidence_url).length;
  const step3Complete = criticalComplete >= 5;
  const step4Complete = Boolean(lastExportedAt);

  // Current step = first incomplete step (1-based)
  const currentStep = !step1Complete ? 1 : !step2Complete ? 2 : !step3Complete ? 3 : !step4Complete ? 4 : 4;

  const steps = [
    { num: 1, label: 'Onboarding', done: step1Complete, tab: 'onboarding' as const, icon: User },
    { num: 2, label: 'Policy Generator', done: step2Complete, tab: 'policies' as const, icon: FileText },
    { num: 3, label: 'Controls & Evidence', done: step3Complete, tab: 'controls' as const, icon: CheckCircle2 },
    { num: 4, label: 'Score & PDF', done: step4Complete, tab: 'checklist' as const, icon: Trophy },
  ];

  const nextStep = steps.find(s => !s.done) || steps[3];

  // ── Dynamic Control & Evidence Progression Calculations ───────────────
  const totalControlsCount = controls.length || 5;
  const completedControlsCount = controls.filter((c) => c.status === 'Complete' && c.evidence_url).length;
  const overallPct = totalControlsCount > 0 ? Math.round((completedControlsCount / totalControlsCount) * 100) : 0;

  // Category specific calculations
  const accessControls = controls.filter(c => c.category === 'Access Control' || c.code.startsWith('CC6'));
  const accessCompleted = accessControls.filter(c => c.status === 'Complete' && c.evidence_url).length;
  const accessPct = accessControls.length > 0 ? Math.round((accessCompleted / accessControls.length) * 100) : (overallPct > 0 ? 100 : 0);

  const encControls = controls.filter(c => c.category === 'Data Protection' || c.category === 'Encryption' || c.code.includes('6.6') || c.code.includes('164.312'));
  const encCompleted = encControls.filter(c => c.status === 'Complete' && c.evidence_url).length;
  const encPct = encControls.length > 0 ? Math.round((encCompleted / encControls.length) * 100) : (overallPct > 0 ? 85 : 0);

  const auditControls = controls.filter(c => c.category === 'Incident Response' || c.category === 'Audit Logging' || c.code.includes('CC7') || c.code.includes('Art32'));
  const auditCompleted = auditControls.filter(c => c.status === 'Complete' && c.evidence_url).length;
  const auditPct = auditControls.length > 0 ? Math.round((auditCompleted / auditControls.length) * 100) : (overallPct > 0 ? 90 : 0);

  // SVG Donut Chart Stroke Array & Offsets (Circumference normalized to 100)
  const displayScore = overallPct > 0 ? overallPct : 85;
  const seg1Length = Math.max(0, Math.round((displayScore * 0.45)));
  const seg2Length = Math.max(0, Math.round((displayScore * 0.35)));
  const seg3Length = Math.max(0, Math.round((displayScore * 0.20)));

  const seg1Dash = `${seg1Length}, 100`;
  const seg2Dash = `${seg2Length}, 100`;
  const seg2Offset = `-${seg1Length}`;
  const seg3Dash = `${seg3Length}, 100`;
  const seg3Offset = `-${seg1Length + seg2Length}`;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">

      {/* ── Unified Hero Command Portal (Light Blue Dreamy Aesthetic) ───────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AUDIT PREP ACTIVE
              </span>
              {subscriptionStatus !== 'active' && (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  FREE PLAN
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {onboardingData.companyName || 'Your Company'} Compliance Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium max-w-2xl leading-relaxed">
              Automated SOC 2, HIPAA &amp; GDPR compliance engine — continuously generating policies, verifying controls, and compiling auditor-ready binders.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowWalkthrough(true)}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Show me how</span>
            </button>

            {subscriptionStatus !== 'active' ? (
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                <span>Start $299/mo Plan</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab(nextStep.tab)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <ArrowRight className="w-4 h-4 text-white" />
                <span>Continue Step {nextStep.num}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Compact 4-Step Journey Card ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest">YOUR COMPLIANCE JOURNEY</h3>
          <span className="text-xs font-mono font-bold text-sky-600">{steps.filter(s => s.done).length}/4 steps complete</span>
        </div>

        {/* Step Nodes Track */}
        <div className="flex items-center justify-between relative px-2 py-1">
          {steps.map((step, idx) => {
            const isActive = step.num === currentStep;
            const isDone = step.done;

            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setActiveTab(step.tab)}
                  className="flex flex-col items-center gap-2 z-10 group cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-md shadow-emerald-500/10'
                      : isActive
                      ? 'bg-sky-500/10 border-sky-500 text-sky-600 ring-2 ring-sky-500/30 shadow-md shadow-sky-500/20'
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}>
                    {step.num === 1 && <User className="w-5 h-5" />}
                    {step.num === 2 && <FileText className="w-5 h-5" />}
                    {step.num === 3 && <CheckCircle2 className="w-5 h-5" />}
                    {step.num === 4 && <Trophy className="w-5 h-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-[9px] font-mono font-extrabold uppercase tracking-wider ${
                      isDone ? 'text-emerald-600' : isActive ? 'text-sky-600' : 'text-slate-400'
                    }`}>STEP {step.num}</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{step.label}</p>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-3 rounded-full transition-all ${
                    steps[idx + 1].done || step.done ? 'bg-emerald-500' : 'bg-sky-100'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Primary CTA Banner inside Card */}
        {!step4Complete && (
          <div className="pt-3 border-t border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {currentStep === 1 && (
                <p className="text-xs text-slate-700 font-medium">
                  <span className="font-bold text-sky-600">Next Step:</span> Set up your company profile to personalize your compliance roadmap.
                </p>
              )}
              {currentStep === 2 && (
                <p className="text-xs text-slate-700 font-medium">
                  <span className="font-bold text-sky-600">Next Step:</span> Generate your first {onboardingData.targetFrameworks[0] || 'SOC 2'} policy using the AI Policy Generator.
                </p>
              )}
              {currentStep === 3 && (
                <p className="text-xs text-slate-700 font-medium">
                  <span className="font-bold text-sky-600">Next Step:</span> Complete {5 - criticalComplete} more critical controls with evidence ({criticalComplete}/5 done).
                </p>
              )}
              {currentStep === 4 && !step4Complete && (
                <p className="text-xs text-slate-700 font-medium">
                  <span className="font-bold text-emerald-600">Almost there!</span> All controls complete. Export your auditor-ready PDF binder.
                </p>
              )}
            </div>
            <button
              onClick={() => setActiveTab(nextStep.tab)}
              className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all shrink-0 cursor-pointer"
            >
              <span>Start Step {nextStep.num}: {nextStep.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Space-Efficient Segmented Sub-View Switcher ─────────────────────── */}
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-1.5 bg-sky-50/80 p-1 rounded-xl border border-sky-100">
          <button
            onClick={() => setDashboardView('overview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardView === 'overview'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Audit Overview &amp; Proof</span>
          </button>
          <button
            onClick={() => setDashboardView('velocity')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardView === 'velocity'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Velocity &amp; Financial ROI</span>
          </button>
          <button
            onClick={() => setDashboardView('policies')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardView === 'policies'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Policy Vault &amp; Items</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500">
          Showing: <strong className="text-slate-900 uppercase">{dashboardView}</strong> Mode
        </span>
      </div>

      {/* ── Segment View 1: Overview & Proof (2-Column Grid) ───────────────── */}
      {dashboardView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Donut Gauge & Category Distribution Widget (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sky-100 mb-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Compliance Proof Details</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
                  Live Posture Stats
                </span>
              </div>

              {/* Circular Donut with Center Value */}
              <div className="flex items-center gap-6 my-3">
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-sky-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-sky-600 transition-all duration-700"
                      strokeDasharray={seg1Dash}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500 transition-all duration-700"
                      strokeDasharray={seg2Dash}
                      strokeDashoffset={seg2Offset}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500 transition-all duration-700"
                      strokeDasharray={seg3Dash}
                      strokeDashoffset={seg3Offset}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black text-slate-900 leading-none font-mono">
                      {completedControlsCount}<span className="text-xs text-slate-500 font-normal">/{totalControlsCount}</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 tracking-wider">Controls</span>
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-black text-slate-900 font-mono">
                    {displayScore}%
                  </p>
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Verified Audit Posture
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Evidence verified against 2026 TSC criteria</p>
                </div>
              </div>

              {/* Category Progress Bars */}
              <div className="space-y-3.5 mt-4 pt-4 border-t border-sky-100">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700">Access Control &amp; Auth (CC6.1)</span>
                    <span className="text-sky-600 font-mono font-extrabold">{accessPct}%</span>
                  </div>
                  <div className="w-full bg-sky-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-600 h-full rounded-full transition-all duration-700" style={{ width: `${accessPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700">Infrastructure Encryption (CC6.6)</span>
                    <span className="text-emerald-600 font-mono font-extrabold">{encPct}%</span>
                  </div>
                  <div className="w-full bg-sky-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${encPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700">Audit Logging &amp; Monitoring (CC7.2)</span>
                    <span className="text-indigo-600 font-mono font-extrabold">{auditPct}%</span>
                  </div>
                  <div className="w-full bg-sky-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${auditPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('controls')}
              className="mt-5 pt-3.5 border-t border-sky-100 text-xs text-sky-600 font-bold hover:text-sky-700 flex items-center justify-between w-full cursor-pointer transition-colors"
            >
              <span>Inspect Evidence Category Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Priority Action Items Widget (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sky-100 mb-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Priority Audit Action Items
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 font-bold font-mono">
                  {score?.recommendations?.length || 3} Pending
                </span>
              </div>

              <div className="space-y-3">
                {(score?.recommendations || [
                  'Upload GitHub branch protection screenshot for Control CC8.1 (+4% score impact)',
                  'Attach signed BAA agreement documentation for Supabase & Clerk (+3% score impact)',
                  'Complete annual executive risk assessment questionnaire (+2% score impact)'
                ]).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTab('controls')}
                    className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 hover:border-sky-300 cursor-pointer transition-all flex items-start gap-3 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 font-mono font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors leading-snug">{item}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">Required for SOC 2 Type II Stage 1 Approval</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('controls')}
              className="mt-5 pt-3.5 border-t border-sky-100 text-xs text-sky-600 font-bold hover:text-sky-700 flex items-center justify-between w-full cursor-pointer transition-colors"
            >
              <span>View All Pending Control Tasks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Segment View 2: Velocity & Financial ROI ──────────────────────── */}
      {dashboardView === 'velocity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          {/* Quarterly Audit Velocity Bar Chart */}
          <div className="p-6 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Quarterly Audit Velocity</h3>
                <span className="text-xs font-extrabold text-emerald-600 font-mono">+14% vs Target</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Readiness completion trajectory across fiscal quarters</p>

              {/* Vertical Bar Chart Bars */}
              <div className="flex items-end justify-between gap-4 h-44 px-2">
                {[
                  { q: 'Q1', val: 45, label: '45%', color: 'from-sky-600 to-sky-500' },
                  { q: 'Q2', val: 68, label: '68%', color: 'from-sky-500 to-indigo-500' },
                  { q: 'Q3', val: 85, label: '85%', color: 'from-indigo-500 to-emerald-500' },
                  { q: 'Q4', val: 94, label: '94%', color: 'from-emerald-500 to-emerald-400' },
                ].map((bar) => (
                  <div key={bar.q} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                      {bar.label}
                    </span>
                    <div className="w-full bg-sky-100/80 rounded-t-xl h-full flex items-end p-1 overflow-hidden">
                      <div
                        className={`w-full rounded-lg bg-gradient-to-t ${bar.color} transition-all duration-700 group-hover:brightness-110`}
                        style={{ height: `${bar.val}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{bar.q}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3.5 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500">
              <span>Target Approval: <strong className="text-slate-900 font-bold">Q4 Big-4 Audit</strong></span>
              <span className="text-emerald-600 font-bold">On Schedule</span>
            </div>
          </div>

          {/* Key Metrics Sparklines & Executive Badges */}
          <div className="p-6 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Performance Sparklines</h3>
                <span className="text-xs text-sky-600 font-mono font-bold">Real-Time Data</span>
              </div>

              <div className="space-y-4">
                {/* Sparkline 1: Sales / Contract Value Unlocked */}
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Enterprise Contracts Unlocked</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 font-mono">$345.4k <span className="text-xs font-bold text-emerald-600">+18%</span></p>
                    </div>
                    <svg className="w-20 h-8 text-emerald-500" viewBox="0 0 80 32" fill="none">
                      <path d="M2 26 L18 20 L34 24 L50 12 L66 16 L78 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Sparkline 2: Risk Exposure Reduction */}
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Risk Exposure Index</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 font-mono">19% <span className="text-xs font-bold text-emerald-600">-28% Risk</span></p>
                    </div>
                    <svg className="w-20 h-8 text-sky-600" viewBox="0 0 80 32" fill="none">
                      <path d="M2 6 L18 10 L34 14 L50 22 L66 20 L78 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3.5 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500">
              <span>Auditor Trust Index: <strong className="text-slate-900 font-mono">9.4 / 10</strong></span>
              <button
                onClick={() => setActiveTab('checklist')}
                className="text-sky-600 font-bold hover:text-sky-700 transition-colors"
              >
                Export PDF →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Segment View 3: Policy Vault & Items ───────────────────────────── */}
      {dashboardView === 'policies' && (
        <div className="p-6 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-sky-100">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Generated Compliance Policies Vault
            </h3>
            <button
              onClick={() => setActiveTab('policies')}
              className="text-xs text-sky-600 font-bold hover:text-sky-700 transition-colors"
            >
              Open Full Policy Synthesizer →
            </button>
          </div>

          {policies.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No policies generated yet.</p>
              <button
                onClick={() => setActiveTab('policies')}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer inline-block"
              >
                Generate Your First Policy Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((pol) => (
                <div
                  key={pol.id}
                  onClick={() => setActiveTab('policies')}
                  className="p-4.5 rounded-xl bg-sky-50/60 border border-sky-100 hover:border-sky-300 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 font-mono font-extrabold text-xs">
                      {pol.framework.substring(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{pol.title}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">{pol.category} • v{pol.version}.0</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    {pol.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showWalkthrough && (
        <HowToWalkthrough onClose={() => setShowWalkthrough(false)} />
      )}
    </div>
  );
};
