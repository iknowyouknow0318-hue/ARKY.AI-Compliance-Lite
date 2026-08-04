import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  CreditCard, 
  Database, 
  ShieldCheck, 
  Key, 
  UserPlus, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { api } from '../services/api';
import { resetWalkthrough } from '../components/HowToWalkthrough';

export const SettingsPage: React.FC = () => {
  const { userProfile, onboardingData } = useComplianceStore();
  const [activeSubTab, setActiveSubTab] = useState<'team' | 'billing' | 'database'>('team');
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Auditor');
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Alex Rivera (You)', email: 'founder@acmesaas.io', role: 'Admin / CISO', status: 'Active' },
    { name: 'David Vance', email: 'auditor@big4firm.com', role: 'External Auditor', status: 'Active' }
  ]);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setTeamMembers([
      ...teamMembers,
      { name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, status: 'Pending Invite' }
    ]);
    setInviteEmail('');
  };

  const handleStripeCheckout = async (plan: string) => {
    setIsCheckoutLoading(true);
    const url = await api.createCheckoutSession(plan);
    setIsCheckoutLoading(false);
    if (url) {
      window.location.href = url;
    } else {
      console.error('[Stripe] No checkout URL returned. Please check your STRIPE_SECRET_KEY.');
    }
  };


  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Enterprise Platform Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings &amp; Team Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your team access, subscription plans, and account security settings.
          </p>
        </div>
        {/* Restart walkthrough */}
        <button
          id="restart-walkthrough-btn"
          onClick={() => {
            resetWalkthrough();
            window.location.reload();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-brand-500/40 text-slate-400 hover:text-white font-bold text-xs transition-all shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brand-400" />
          Restart walkthrough
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'team' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Members</span>
        </button>

        <button
          onClick={() => setActiveSubTab('billing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'billing' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Billing &amp; Plans</span>
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'database' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Security &amp; Data</span>
        </button>
      </div>

      {/* Subtab 1: Team & Clerk RBAC */}
      {activeSubTab === 'team' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Invite Team Member
            </h3>

            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@startup.io or auditor@firm.com"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />

              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="Auditor">External Auditor (Read-Only PDF)</option>
                <option value="Compliance Lead">Compliance Manager (Edit Controls)</option>
                <option value="Admin">Admin / Founder</option>
              </select>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
              >
                Send Invite
              </button>
            </form>
          </div>

          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Member & Email</span>
              <div className="flex gap-16">
                <span>Role</span>
                <span>Status</span>
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {teamMembers.map((m, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-12 text-xs">
                    <span className="font-semibold text-brand-400">{m.role}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Stripe Billing */}
      {activeSubTab === 'billing' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-brand-500/40 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Most Popular
              </span>
              <h3 className="text-2xl font-black text-white">Growth Plan</h3>
              <p className="text-3xl font-black text-emerald-400">$299 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Compliance Policies</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Evidence Management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Auditor Reporting</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Compliance Support</li>
              </ul>
            </div>

            <button
              onClick={() => handleStripeCheckout('growth_299')}
              disabled={isCheckoutLoading}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              {isCheckoutLoading ? 'Redirecting...' : 'Upgrade to Growth ($299/mo)'}
            </button>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30">
                Enterprise
              </span>
              <h3 className="text-2xl font-black text-white">Enterprise Plan</h3>
              <p className="text-3xl font-black text-brand-400">$999 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> White-Labeling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Dedicated Auditor Support</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Advanced API Access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> SSO Integration</li>
              </ul>
            </div>

            <button
              onClick={() => handleStripeCheckout('enterprise_999')}
              disabled={isCheckoutLoading}
              className="w-full mt-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      )}

      {/* Subtab 3: Security & Data */}
      {activeSubTab === 'database' && (
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Security & Data Protection</h3>
              <p className="text-xs text-slate-400">Your data is encrypted and protected with enterprise-grade security</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <p className="font-bold text-white">Policy Documents</p>
                <p className="text-slate-500 text-[10px]">All compliance policies are encrypted at rest</p>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Protected
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <p className="font-bold text-white">Control Evidence Files</p>
                <p className="text-slate-500 text-[10px]">Evidence uploads are access-controlled per user</p>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Protected
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <p className="font-bold text-white">Audit Logs</p>
                <p className="text-slate-500 text-[10px]">Immutable activity logs for auditor review</p>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Immutable
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Authentication</p>
                <p className="text-slate-500 text-[10px]">Secure login with optional MFA</p>
              </div>
              <span className="text-brand-400 font-bold">Active</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
