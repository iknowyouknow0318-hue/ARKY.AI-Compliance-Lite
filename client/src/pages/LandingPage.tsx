import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Lock, 
  Database, 
  ChevronRight,
  TrendingUp,
  FileCheck,
  Bot,
  Layers,
  FileText,
  Check,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Terminal,
  Activity,
  Cpu,
  Download,
  Share2,
  Eye,
  CheckSquare,
  Server,
  Cloud,
  FileCode,
  Award,
  Users,
  User,
  Search,
  Shield
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useComplianceStore();
  const [dealValue, setDealValue] = useState(120000); // $120K deal size
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(1);
  const [activeDemoFramework, setActiveDemoFramework] = useState<'SOC2' | 'HIPAA' | 'GDPR'>('SOC2');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const consultantCost = 50000;
  const aiCost = 299 * 12; // $3,588/yr

  const scrollToSteps = () => {
    const el = document.getElementById('step-by-step-guide');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 flex flex-col selection:bg-sky-600 font-sans relative overflow-x-hidden">
      
      {/* Top Announcement Banner */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-sky-100 px-4 py-2.5 text-center text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 relative z-20">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 text-[10px] font-extrabold uppercase tracking-wider border border-sky-500/20 font-mono">
          <Sparkles className="w-3 h-3 text-sky-600 animate-pulse" /> 2026 Release
        </span>
        <span>AI Policy Synthesizer now supports 2026 SOC 2, HIPAA &amp; GDPR Standards</span>
        <button 
          onClick={() => setActiveTab('onboarding')}
          className="underline font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 ml-2 transition-colors cursor-pointer"
        >
          Start Onboarding <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ══ ELEGANT LIGHT BLUE DREAMY HERO CANVAS ══ */}
      <section className="relative w-full min-h-[580px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden my-4 rounded-3xl max-w-[1400px] mx-auto bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl">
        {/* Floating Gradient Orbs Canvas */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-300/40 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-200/40 blur-[100px] pointer-events-none" />

        {/* ── 1. Top Translucent Floating Navigation Bar ── */}
        <div className="relative z-20 flex items-center justify-between gap-4">
          {/* Brand Emblem Left */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-xl text-slate-900 tracking-tight">
              Arky<span className="text-sky-600 font-mono">.ai</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
              2026 Engine
            </span>
          </div>

          {/* Center Translucent Dropdown Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-6 bg-sky-50/80 backdrop-blur-xl border border-sky-100 rounded-2xl px-6 py-2.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider shadow-sm">
            <button onClick={() => setActiveTab('controls')} className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <span>Frameworks</span> <span className="text-[10px] text-sky-600">∨</span>
            </button>
            <button onClick={() => setActiveTab('policies')} className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <span>Policies</span> <span className="text-[10px] text-sky-600">∨</span>
            </button>
            <button onClick={() => setActiveTab('controls')} className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <span>Controls</span> <span className="text-[10px] text-sky-600">∨</span>
            </button>
            <button onClick={() => setActiveTab('checklist')} className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <span>Evidence</span> <span className="text-[10px] text-sky-600">∨</span>
            </button>
            <button onClick={() => setActiveTab('checklist')} className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <span>Auditor PDF</span> <span className="text-[10px] text-sky-600">∨</span>
            </button>
          </nav>

          {/* Right Action Button */}
          <button
            onClick={() => setActiveTab('onboarding')}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            Start 5-Min Onboarding →
          </button>
        </div>

        {/* ── 2. Center Capsule Search Bar & Main Hero Headline ── */}
        <div className="relative z-20 my-auto py-8">
          {/* Capsule Search Input */}
          <div className="max-w-md w-full mb-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SOC 2 CC6.1 controls, policies, or evidence..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-sky-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Display Headline & Watch Video Widget */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.05] mb-6">
                Enterprise AI Compliance &amp; Audit Binders
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed font-medium">
                Automated SOC 2, HIPAA &amp; GDPR compliance platform—generating custom policies, tracking controls evidence, and compiling auditor-ready binders in 4 simple steps.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className="px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  START COMPLIANCE PROGRAM
                </button>
                <button
                  onClick={scrollToSteps}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Explore Feature Walkthrough ↓
                </button>
              </div>
            </div>

            {/* Right Video Play Card Widget */}
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-sky-100 shadow-xl max-w-sm shrink-0">
              <button
                onClick={() => setIsVideoOpen(true)}
                className="w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0 shadow-lg shadow-sky-500/30"
                aria-label="Play video demo"
              >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-white ml-1"></div>
              </button>
              <div>
                <h3 className="font-display font-extrabold text-sm text-slate-900">Watch Platform Demo</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  See how SaaS startups go from zero compliance docs to an auditor-ready binder in 4 steps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Bottom Row: About Summary ── */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-sky-100">
          <div className="max-w-md">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 mb-1 font-mono">
              ABOUT ARKY PLATFORM
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Arky guides SaaS startups through SOC 2, HIPAA, and GDPR prep without five-figure consulting fees. Answer questions about your stack, generate custom policies, and export clean proof.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Shield className="w-4 h-4 hover:text-sky-600 transition-colors cursor-pointer" />
            <CheckCircle2 className="w-4 h-4 hover:text-sky-600 transition-colors cursor-pointer" />
            <FileText className="w-4 h-4 hover:text-sky-600 transition-colors cursor-pointer" />
            <Lock className="w-4 h-4 hover:text-sky-600 transition-colors cursor-pointer" />
          </div>
        </div>
      </section>

      {/* ══ STEP-BY-STEP FEATURE WALKTHROUGH GUIDE (USER REQUEST) ══ */}
      <section id="step-by-step-guide" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 text-xs font-extrabold uppercase tracking-wider mb-3 font-mono">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Interactive Platform Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How to Use All Arky Features (Step-by-Step)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Click each step below to see exactly how Arky automates every phase of your compliance audit lifecycle.
          </p>
        </div>

        {/* Step Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { id: 1, title: 'Step 1: 5-Min Onboarding', tab: 'onboarding' as const, icon: User },
            { id: 2, title: 'Step 2: AI Policy Synthesizer', tab: 'policies' as const, icon: FileText },
            { id: 3, title: 'Step 3: Control Matrix & Evidence', tab: 'controls' as const, icon: CheckSquare },
            { id: 4, title: 'Step 4: PDF Binder & Copilot', tab: 'checklist' as const, icon: Download },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeFeatureTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFeatureTab(item.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/25 scale-105'
                    : 'bg-white border border-sky-100 text-slate-600 hover:text-slate-900 hover:border-sky-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step Feature Card Content */}
        <div className="bg-white/90 rounded-3xl p-6 sm:p-10 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl">
          {activeFeatureTab === 1 && (
            <div className="grid lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="lg:col-span-7 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
                  Step 1 • Onboarding Scope Setup
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">Define Your Company Infrastructure &amp; Target Frameworks</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  In less than 5 minutes, answer key questions about your startup identity, cloud provider (AWS, GCP, Supabase), processed data sensitivity, and required audit frameworks (<strong className="text-slate-900">SOC 2 Type II, HIPAA, GDPR</strong>).
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automatically filters out irrelevant compliance bloat for your stack.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Establishes your baseline database profile stored with Clerk RLS isolation.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Launch 5-Min Onboarding Wizard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-500 text-[11px] pb-2 border-b border-sky-200">
                  <span>ONBOARDING INPUT PREVIEW</span>
                  <span className="text-sky-600 font-bold">STATUS: READY</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-sky-100">
                  <span className="text-[10px] text-slate-400 block">COMPANY NAME</span>
                  <span className="font-bold text-slate-900">Acme SaaS Technologies</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-sky-100">
                  <span className="text-[10px] text-slate-400 block">TARGET FRAMEWORKS</span>
                  <span className="font-bold text-sky-600">SOC 2 Type II • HIPAA • GDPR</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-sky-100">
                  <span className="text-[10px] text-slate-400 block">CLOUD INFRASTRUCTURE</span>
                  <span className="font-bold text-slate-900">AWS KMS + Supabase PostgreSQL</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 2 && (
            <div className="grid lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="lg:col-span-7 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
                  Step 2 • AI Policy Synthesizer
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">Draft Custom, Auditor-Approved Security Policies in Seconds</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Stop copying outdated templates from random repos. Arky’s AI engine drafts complete, custom security policies (Access Control, Encryption, Data Retention, Incident Response) tailored specifically to your stack inputs.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Edit, refine, and approve policy versions directly in your browser.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Written in clear, Big-4 audit-tested language ready for publication.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('policies')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Open AI Policy Synthesizer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-500 text-[11px] pb-2 border-b border-sky-200">
                  <span>GENERATED POLICY DOC PREVIEW</span>
                  <span className="text-emerald-600 font-bold">v1.0 PUBLISHED</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-sky-100 space-y-1">
                  <span className="font-bold text-slate-900 block">Information Security &amp; Access Control</span>
                  <span className="text-[11px] text-slate-500 block">Framework: SOC 2 CC6.1 • Scope: Acme SaaS</span>
                  <p className="text-[10px] text-slate-600 italic">"Mandates 100% MFA enforcement on Clerk &amp; GitHub root accounts..."</p>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 3 && (
            <div className="grid lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="lg:col-span-7 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
                  Step 3 • Control Matrix &amp; Evidence Linking
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">Attach Evidence &amp; Track Real-Time Posture Gauges</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Link your operational evidence screenshots, KMS encryption JSON policies, and Datadog log exports directly to official framework criteria (<strong className="text-slate-900">CC6.1, CC6.6, CC7.2, HIPAA §164.312</strong>).
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dynamic SVG Donut Chart automatically updates as evidence is verified.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Organized central evidence repository with zero scattered spreadsheets.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('controls')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Inspect Control Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-500 text-[11px] pb-2 border-b border-sky-200">
                  <span>CONTROL EVIDENCE MATRIX</span>
                  <span className="text-sky-600 font-bold">24 PROOFS ATTACHED</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-sky-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-sky-600">CC6.1 Logical Access</span>
                    <span className="text-emerald-600 font-bold">COMPLETE</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">mfa_config_screenshot.png</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-sky-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-sky-600">CC6.6 Data Encryption</span>
                    <span className="text-emerald-600 font-bold">COMPLETE</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">kms_policy_export.json</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 4 && (
            <div className="grid lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="lg:col-span-7 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
                  Step 4 • PDF Auditor Binder &amp; AI Copilot
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">Export SHA-256 Validated Binders &amp; Ask AI Copilot</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Compile your entire compliance posture into a 13-section vector PDF binder with embedded SHA-256 cryptographic verification seal. Use the AI Copilot chat assistant to answer buyer security questionnaires instantly.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant 1-click export generated on server-side `pdf-lib` vector engine.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI Assistant explains complex audit jargon and recommends remediation tasks.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Export Auditor PDF Binder</span>
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4 text-sky-400" />
                    <span>Ask AI Copilot</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-500 text-[11px] pb-2 border-b border-sky-200">
                  <span>AUDITOR BINDER EXPORT</span>
                  <span className="text-emerald-600 font-bold">SHA-256 STAMPED</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-sky-100 space-y-1">
                  <span className="font-bold text-slate-900 block">Arky_Auditor_Binder_2026.pdf</span>
                  <span className="text-[10px] text-slate-500 block">Size: 1.4 MB • 13 Structural Sections</span>
                  <span className="text-[9px] text-sky-600 block">Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Compliance Metrics Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Framework Support</span>
                <span className="text-2xl font-black text-emerald-600">3 Frameworks</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">SOC 2, HIPAA, GDPR</span>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-600/60" />
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">AI Policy Synthesizer</span>
                <span className="text-2xl font-black text-sky-600">100% Automated</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Big-4 Auditor Ready</span>
              </div>
              <FileText className="w-8 h-8 text-sky-600/60" />
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Verified Evidence</span>
                <span className="text-2xl font-black text-indigo-600">24 Proofs</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">SHA-256 Digest Validated</span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-indigo-600/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center border-t border-sky-100">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight mb-8">
          Compliance shouldn’t be an open-ended tax on your momentum—<span className="text-sky-600">Arky makes it finite, clear, and done.</span>
        </h2>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="px-9 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-base shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
        >
          <Zap className="w-5 h-5 fill-current text-white" />
          <span>Start in 5 minutes</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-sky-100 py-10 px-4 text-center text-xs text-slate-500 space-y-3 bg-white/60">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span className="font-bold text-slate-900">AI Compliance Lite (Arky)</span>
          <span>— SOC 2, HIPAA &amp; GDPR Automation for SaaS Startups</span>
        </div>
        <p>© 2026 AI Compliance Lite Inc. Built for SaaS Founders, Not Lawyers.</p>
      </footer>

      {/* Video Platform Demo Modal Overlay */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-sky-100 bg-sky-50/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-3 font-mono text-xs font-bold text-slate-700">Arky Platform Walkthrough — SOC 2, HIPAA &amp; GDPR Automation</span>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="text-slate-600 hover:text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-100 transition-colors"
              >
                Close ✕
              </button>
            </div>
            {/* Interactive Video Container */}
            <div className="relative aspect-video bg-sky-50 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-sky-500/10 border-2 border-sky-500 flex items-center justify-center mb-4 animate-pulse">
                <ShieldCheck className="w-10 h-10 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Arky Compliance Suite Walkthrough</h3>
              <p className="text-xs text-slate-600 max-w-lg mb-6 leading-relaxed">
                Watch how SaaS founders generate auditor-approved policies, link AWS &amp; Supabase controls, and export SHA-256 validated PDF compliance binders in 4 simple steps.
              </p>
              <button
                onClick={() => {
                  setIsVideoOpen(false);
                  setActiveTab('onboarding');
                }}
                className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Launch Onboarding Wizard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
