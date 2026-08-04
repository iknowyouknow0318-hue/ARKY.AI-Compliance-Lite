import React from 'react';
import {
  LayoutDashboard,
  FileCode2,
  CheckSquare,
  ListTodo,
  Bot,
  Settings,
  ShieldAlert,
  Layers,
  Building2,
  History,
  User,
  FileText,
  Trophy,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

// Critical control codes for step-3 completion check
const CRITICAL_CONTROL_CODES = ['CC6.1', 'CC6.6', 'CC8.1', '164.312(a)', 'GDPR-Art32'];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, score, onboardingData, policies, controls, lastExportedAt, subscriptionStatus } = useComplianceStore();

  // ── Step completion ────────────────────────────────────────────────────
  const step1Done = Boolean(onboardingData.isComplete && onboardingData.companyName);
  const step2Done = policies.length > 0;
  const criticalDone = controls.filter(c => CRITICAL_CONTROL_CODES.includes(c.code) && c.status === 'Complete' && c.evidence_url).length;
  const step3Done = criticalDone >= 5;
  const step4Done = Boolean(lastExportedAt);
  const stepsComplete = [step1Done, step2Done, step3Done, step4Done].filter(Boolean).length;

  const menuItems = [
    { id: 'dashboard',  label: 'Command Center',       icon: LayoutDashboard, badge: 'Overview'   },
    { id: 'policies',   label: 'AI Policy Generator',   icon: FileCode2,       badge: 'AI Engine'  },
    { id: 'controls',   label: 'Control Matrix',        icon: CheckSquare,     badge: 'Evidence'   },
    { id: 'checklist',  label: 'Audit Checklist',       icon: ListTodo,        badge: 'PDF Export' },
    { id: 'assistant',  label: 'AI Copilot Q&A',        icon: Bot,             badge: 'Ask AI'     },
    { id: 'logs',       label: 'Audit Trail',           icon: History,         badge: 'Logs'       },
    { id: 'settings',   label: 'Settings & Team',       icon: Settings,        badge: 'Account'    },
  ];

  // Journey step summary
  const journeySteps = [
    { label: 'Onboarding', done: step1Done, tab: 'onboarding' as const },
    { label: 'Policy',     done: step2Done, tab: 'policies' as const   },
    { label: 'Controls',   done: step3Done, tab: 'controls' as const   },
    { label: 'Score/PDF',  done: step4Done, tab: 'checklist' as const  },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#F8FAFC]/90 backdrop-blur-xl border-r border-sky-100/80 p-4 flex flex-col gap-4 hidden md:flex min-h-[calc(100vh-65px)] overflow-y-auto">

      {/* Company Context Badge */}
      <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{onboardingData.companyName || 'Your Company'}</h4>
            <p className="text-[10px] text-slate-500 truncate">{onboardingData.industry || 'Set up your profile'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-sky-100">
          <span className={`w-2 h-2 rounded-full ${subscriptionStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-[10px] text-slate-600 font-bold">
            {subscriptionStatus === 'active' ? 'Growth Plan Active' : 'Free Plan — Upgrade'}
          </span>
        </div>
      </div>

      {/* 4-Step Journey Mini Tracker */}
      <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Journey Progress</span>
          <span className="text-[10px] text-sky-600 font-extrabold">{stepsComplete}/4</span>
        </div>
        <div className="space-y-1.5">
          {journeySteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(step.tab)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                step.done ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 border ${
                step.done ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'border-slate-300 text-slate-400'
              }`}>
                {step.done ? '✓' : idx + 1}
              </div>
              <span className="text-[10px] font-bold">{step.label}</span>
            </button>
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-2.5 w-full bg-sky-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-sky-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${(stepsComplete / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">PLATFORM MODULES</p>
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Parameters<typeof setActiveTab>[0])}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/25 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                  isActive ? 'bg-white/20 text-white' : 'bg-sky-100/80 text-sky-700'
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* How to Use Arky — Inline Card */}
      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">How to Use Arky</span>
        </div>
        <ol className="space-y-1">
          {[
            { step: '1', label: 'Onboarding', tab: 'onboarding' as const },
            { step: '2', label: 'Generate Policies', tab: 'policies' as const },
            { step: '3', label: 'Controls & Evidence', tab: 'controls' as const },
            { step: '4', label: 'Score & PDF Export', tab: 'checklist' as const },
          ].map((s) => (
            <li key={s.step}>
              <button
                onClick={() => setActiveTab(s.tab)}
                className="w-full flex items-center gap-2 text-[10px] text-slate-400 hover:text-slate-200 transition-colors text-left py-0.5"
              >
                <span className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-[9px] flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Audit Score Widget */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            Audit Score
          </span>
          <span className="text-xs font-black text-emerald-400">{score?.overall_score ?? 0}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${score?.overall_score ?? 0}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          {score
            ? `${score.risk_level} — ${score.overall_score}% audit ready.`
            : 'Complete Step 2–3 to calculate your score.'}
        </p>
      </div>

    </aside>
  );
};
