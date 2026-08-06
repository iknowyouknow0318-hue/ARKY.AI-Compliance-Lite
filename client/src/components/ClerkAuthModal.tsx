/**
 * ClerkAuthModal — Arky Organic Wave Enterprise Authentication Modal
 * 
 * Implements organic wave split login canvas matching high-end design reference:
 * - Left Panel: Cyber wave photography + high-impact typography & trust signals
 * - Organic SVG Wave Mask Divider between left image and right white container
 * - Right Panel: Crisp white card container with dark primary button & Google SSO
 */
import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  FileCheck,
  Users,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { SignIn, SignUp } from '@clerk/clerk-react';

type ErrorType = '' | 'invalid_code' | 'not_found' | 'rate_limit' | 'fields_required' | 'password_short';

const ERROR_COPY: Record<ErrorType, { msg: string; cta?: string }> = {
  '':               { msg: '' },
  invalid_code:     { msg: 'Invalid code. Please check and try again.', cta: 'Try again' },
  not_found:        { msg: 'Account not found. Check your email or create an account.', cta: 'Create account' },
  rate_limit:       { msg: 'Too many attempts. Try again in 2 minutes.', cta: undefined },
  fields_required:  { msg: 'Please fill in all fields.', cta: undefined },
  password_short:   { msg: 'Password must be at least 8 characters.', cta: undefined },
};

export const ClerkAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    setIsAuthenticated,
    userProfile,
    setUserProfile,
  } = useComplianceStore();

  const [authMode, setAuthMode]         = useState<'signin' | 'signup'>('signin');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(true);
  const [isLoading, setIsLoading]       = useState(false);
  const [errorType, setErrorType]       = useState<ErrorType>('');

  const clerkKey =
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!isAuthModalOpen) return null;

  /* Fallback form submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorType('');

    if (!email || !password) { setErrorType('fields_required'); return; }
    if (password.length < 8)  { setErrorType('password_short'); return; }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsAuthenticated(true);
    if (userProfile) setUserProfile({ ...userProfile, email });
    setIsLoading(false);
    setAuthModalOpen(false);
  };

  const switchMode = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setErrorType('');
    setEmail('');
    setPassword('');
  };

  const isSignIn = authMode === 'signin';
  const errorInfo = ERROR_COPY[errorType];

  /* Clerk appearance tokens for white card container */
  const clerkAppearance = {
    variables: {
      colorPrimary: '#0f172a',
      colorBackground: '#ffffff',
      colorText: '#0f172a',
      colorTextSecondary: '#475569',
      colorInputBackground: '#f8fafc',
      colorInputText: '#0f172a',
      colorTextOnPrimaryBackground: '#ffffff',
    },
    elements: {
      rootBox: 'w-full',
      card: 'bg-white shadow-none border-0 p-0 w-full',
      headerTitle: 'hidden',
      headerSubtitle: 'hidden',
      socialButtonsBlockButton:
        'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl py-3 shadow-sm text-sm transition-all',
      socialButtonsIconButton:
        'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50',
      dividerLine: 'bg-slate-200',
      dividerText: 'text-slate-400 text-xs font-semibold uppercase tracking-wider',
      formFieldLabel: 'text-slate-700 text-xs font-bold uppercase tracking-wider mb-1',
      formFieldInput:
        'bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all py-3 px-4',
      formButtonPrimary:
        'bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all text-sm py-3.5',
      footer: 'hidden',
      footerAction: 'hidden',
      footerActionLink: 'text-slate-900 font-bold hover:underline',
      footerActionText: 'text-slate-600 text-xs',
      identityPreviewText: 'text-slate-900',
      identityPreviewEditButton: 'text-slate-900 font-bold',
      devModeBadge: 'hidden',
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) setAuthModalOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="arky-auth-title"
    >
      <div className="relative w-full max-w-4xl min-h-[540px] flex rounded-3xl shadow-2xl overflow-hidden border border-sky-100/90 my-6 animate-slideUp bg-white">

        {/* ══ LEFT VISUAL PANEL (LIGHT BLUE BRANDING) ══ */}
        <div className="relative hidden md:flex flex-col justify-between w-[44%] shrink-0 overflow-hidden bg-slate-900 p-8 lg:p-10 text-white border-r border-sky-100/20">
          {/* Cyber photography background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transform scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/90" />

          {/* Top Brand Logo */}
          <div className="relative z-20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-lg tracking-tight text-white leading-none">
                Arky<span className="text-sky-400">AI</span>
              </p>
              <p className="text-[9px] text-sky-200 font-bold tracking-wider uppercase mt-0.5">
                Compliance Vault
              </p>
            </div>
          </div>

          {/* Center High-Impact Display Headline */}
          <div className="relative z-20 my-auto py-6 pr-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 inline-block mb-4">
              SOC 2 · HIPAA · GDPR · ISO 27001
            </span>
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Enterprise AI Compliance &amp; Audit Vault
            </h2>
            <p className="text-xs text-sky-100/80 leading-relaxed max-w-xs">
              Automate policy synthesis, control mapping, and evidence binders with instant 1-click auditor PDF exports.
            </p>
          </div>

          {/* Bottom Social Links & Activity Tags */}
          <div className="relative z-20 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-sky-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Big-4 Approved Reports</span>
            </div>
            <span className="flex items-center gap-1 text-sky-400 font-bold hover:underline cursor-pointer">
              Our Features <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ══ RIGHT WHITE FORM PANEL (CLEAN ALIGNMENT) ══ */}
        <div className="flex-1 bg-white text-slate-900 flex flex-col justify-between p-6 sm:p-10 relative z-20 overflow-y-auto">
          {/* Close Modal Button */}
          <button
            onClick={() => setAuthModalOpen(false)}
            id="arky-auth-modal-close"
            aria-label="Close login modal"
            className="absolute top-5 right-5 z-30 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-sky-50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-md w-full mx-auto my-auto py-2">
            {/* Header */}
            <div className="mb-6 text-left">
              <h1 id="arky-auth-title" className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isSignIn ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {isSignIn
                  ? 'Sign in to your compliance workspace and pick up where you left off.'
                  : 'Start your 5-minute audit readiness setup.'}
              </p>
            </div>

            {/* ── Clerk Native Auth or Custom Form ── */}
            {clerkKey ? (
              <div className="w-full">
                {isSignIn ? (
                  <SignIn
                    routing="virtual"
                    appearance={clerkAppearance}
                    afterSignInUrl="/dashboard"
                  />
                ) : (
                  <SignUp
                    routing="virtual"
                    appearance={clerkAppearance}
                    afterSignUpUrl="/onboarding"
                  />
                )}
              </div>
            ) : (
              /* Custom Form matching exact white card layout */
              <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Sign in form">
                {/* Email */}
                <div>
                  <label htmlFor="arky-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="arky-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-required="true"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="arky-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="arky-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete={isSignIn ? 'current-password' : 'new-password'}
                      aria-required="true"
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      id="arky-toggle-password"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    Remember me
                  </label>
                  {isSignIn && (
                    <button
                      type="button"
                      className="text-xs text-slate-700 hover:text-slate-900 font-bold hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="arky-auth-submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer transform active:scale-95"
                >
                  {isLoading ? (
                    <span>Signing in…</span>
                  ) : (
                    <span>{isSignIn ? 'Sign in' : 'Create Account'}</span>
                  )}
                </button>

                {/* Or Divider */}
                <div className="flex items-center gap-3 my-2" role="separator" aria-hidden="true">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  id="arky-google-oauth"
                  className="w-full py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </form>
            )}

            {/* Toggle sign-in / sign-up */}
            <p className="mt-6 text-center text-xs text-slate-600 font-medium">
              {isSignIn ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => switchMode(isSignIn ? 'signup' : 'signin')}
                id="arky-auth-toggle"
                className="text-slate-900 font-extrabold hover:underline transition-colors"
              >
                {isSignIn ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
