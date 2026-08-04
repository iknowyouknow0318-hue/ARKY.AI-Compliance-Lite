import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ClipboardList,
  BarChart3,
  CreditCard,
  ScrollText,
  Sparkles,
  Zap,
  Shield,
  SkipForward,
  BookOpen,
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

const STORAGE_KEY = 'arky_walkthrough_v1';

interface WalkthroughState {
  currentStep: number;
  completed: boolean;
}

function loadState(): WalkthroughState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { currentStep: 0, completed: false };
}

function saveState(s: WalkthroughState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function resetWalkthrough() {
  localStorage.removeItem(STORAGE_KEY);
}

interface Step {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  badge: string;
  title: string;
  helper: string;
  detail: string;
  cta: string;
  tab?: 'assistant' | 'landing' | 'onboarding' | 'dashboard' | 'policies' | 'controls' | 'checklist' | 'settings' | 'logs';
}

const STEPS: Step[] = [
  {
    id: 'onboarding',
    icon: Sparkles,
    iconColor: 'text-brand-400',
    badge: 'Step 1 of 6',
    title: 'Tell us about your company',
    helper: 'We tailor your policies and roadmap to your specific stack and industry.',
    detail:
      'Answer 5 quick questions — company name, industry, data types, cloud provider, and team size. Each answer shapes the AI so your policies feel hand-written, not generic.',
    cta: 'Go to Onboarding',
    tab: 'onboarding',
  },
  {
    id: 'policies',
    icon: Zap,
    iconColor: 'text-emerald-400',
    badge: 'Step 2 of 6',
    title: 'Generate your first policy',
    helper: 'Get an auditor-ready SOC 2 or HIPAA policy in about 30 seconds.',
    detail:
      'Pick a framework, choose a category (e.g. Access Control), and hit Generate. The AI uses your company profile to write a policy that matches your actual environment.',
    cta: 'Generate Policy (SOC 2)',
    tab: 'policies',
  },
  {
    id: 'checklist',
    icon: ClipboardList,
    iconColor: 'text-indigo-400',
    badge: 'Step 3 of 6',
    title: 'Complete a control',
    helper: 'Track required controls and attach evidence — just like an auditor expects.',
    detail:
      'Each control shows a plain-English description. Attach evidence (screenshots, exports, configs) and mark it complete. Example evidence: "AWS IAM screenshot", "Encryption-at-rest toggle".',
    cta: 'Mark First Control Complete',
    tab: 'checklist',
  },
  {
    id: 'score',
    icon: BarChart3,
    iconColor: 'text-brand-400',
    badge: 'Step 4 of 6',
    title: 'Check your compliance score',
    helper: 'See your 0-100 readiness score and export an auditor binder instantly.',
    detail:
      "Your score breaks down across Policies, Controls, and Evidence. The 'What to improve next' panel shows your top 3 gaps. When ready, export a full PDF auditor binder.",
    cta: 'Export Auditor PDF',
    tab: 'controls',
  },
  {
    id: 'billing',
    icon: CreditCard,
    iconColor: 'text-amber-400',
    badge: 'Step 5 of 6',
    title: 'Unlock the full platform',
    helper: 'Start the $299/mo plan — cancel anytime, no hidden fees.',
    detail:
      'Pro unlocks: unlimited AI policy generation, multi-framework support (SOC 2 + HIPAA + GDPR), team collaboration seats, and priority auditor export. No contracts — cancel in one click.',
    cta: 'Start $299/mo Plan',
    tab: 'settings',
  },
  {
    id: 'audit',
    icon: ScrollText,
    iconColor: 'text-slate-300',
    badge: 'Step 6 of 6',
    title: 'Review your audit trail',
    helper: 'Every key action is logged so auditors can see who did what, when.',
    detail:
      'The Audit Trail shows a timestamped table: date, action, and resource. Use Export CSV to share the log with an auditor or compliance team.',
    cta: 'Export CSV',
    tab: 'logs',
  },
];

const StepDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`rounded-full transition-all duration-300 ${
          i === current
            ? 'w-6 h-2 bg-brand-500'
            : i < current
            ? 'w-2 h-2 bg-brand-700'
            : 'w-2 h-2 bg-slate-700'
        }`}
      />
    ))}
  </div>
);

interface HowToWalkthroughProps {
  onClose?: () => void;
}

export const HowToWalkthrough: React.FC<HowToWalkthroughProps> = ({ onClose }) => {
  const { setActiveTab } = useComplianceStore();
  const [state, setState] = useState<WalkthroughState>(loadState);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => { saveState(state); }, [state]);

  const currentStep = STEPS[state.currentStep];
  const isFirst = state.currentStep === 0;
  const isLast = state.currentStep === STEPS.length - 1;

  const handleNext = useCallback(() => {
    if (state.currentStep < STEPS.length - 1) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } else {
      setState((prev) => ({ ...prev, completed: true }));
      setIsVisible(false);
      onClose?.();
    }
  }, [state.currentStep, onClose]);

  const handlePrev = useCallback(() => {
    if (state.currentStep > 0)
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  }, [state.currentStep]);

  const handleCta = useCallback(() => {
    if (currentStep.tab) setActiveTab(currentStep.tab);
    handleNext();
  }, [currentStep, setActiveTab, handleNext]);

  const handleSkip = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  if (!isVisible) return null;

  const Icon = currentStep.icon;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm pointer-events-none" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Walkthrough: ${currentStep.title}`}
        className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] animate-slideUp"
      >
        <div className="relative bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-emerald-400 to-brand-600" />

          <div className="flex items-center justify-between px-5 pt-5 pb-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span className="text-[10px] font-extrabold text-brand-400 uppercase tracking-widest">Platform Tour</span>
            </div>
            <button onClick={handleSkip} id="walkthrough-close" aria-label="Close walkthrough"
              className="p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-5 pt-4 pb-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${currentStep.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{currentStep.badge}</span>
                <h2 className="text-sm font-extrabold text-white leading-snug mt-0.5">{currentStep.title}</h2>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-400">{currentStep.helper}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{currentStep.detail}</p>
            </div>

            <StepDots current={state.currentStep} total={STEPS.length} />

            <div className="flex items-center gap-2 pt-1">
              {!isFirst && (
                <button onClick={handlePrev} id="walkthrough-prev" aria-label="Previous step"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button onClick={handleCta} id={`walkthrough-cta-${currentStep.id}`}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5">
                {isLast ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" />{currentStep.cta}</>
                ) : (
                  <>{currentStep.cta}<ChevronRight className="w-3.5 h-3.5" /></>
                )}
              </button>
              {!isLast && (
                <button onClick={handleNext} id="walkthrough-next" aria-label="Skip this step" title="Skip this step"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 flex items-center justify-center transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <button onClick={handleSkip} id="walkthrough-skip-all"
                className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                <SkipForward className="w-3 h-3" />
                Skip tour
              </button>
              <span className="text-[10px] text-slate-700">{state.currentStep + 1} / {STEPS.length}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const WalkthroughTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} id="walkthrough-trigger"
    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-brand-500/40 text-slate-300 hover:text-white font-bold text-xs transition-all group">
    <Shield className="w-3.5 h-3.5 text-brand-400 group-hover:text-brand-300" />
    Show me how
  </button>
);


