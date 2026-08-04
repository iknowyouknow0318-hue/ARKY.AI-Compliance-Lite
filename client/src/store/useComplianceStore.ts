import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Policy, Control, AuditChecklist, ComplianceScore, ChatMessage } from '../types';
import { api } from '../services/api';

interface ComplianceState {
  // Navigation & User State
  activeTab: 'landing' | 'onboarding' | 'dashboard' | 'policies' | 'controls' | 'checklist' | 'assistant' | 'settings' | 'logs' | 'vision';
  setActiveTab: (tab: ComplianceState['activeTab']) => void;

  // Auth & Login Gate Modal
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;

  isGateModalOpen: boolean;
  gateActionName: string;
  triggerLoginGate: (actionName: string) => boolean;
  closeGateModal: () => void;

  // Onboarding Answers — persisted to localStorage
  onboardingData: {
    companyName: string;
    industry: string;
    targetFrameworks: string[];
    cloudProvider: string;
    dataTypes: string[];
    teamSize: string;
    isComplete: boolean;
  };
  setOnboardingData: (data: Partial<ComplianceState['onboardingData']>) => void;
  completeOnboarding: () => Promise<void>;

  // Data Stores
  userProfile: UserProfile | null;
  subscriptionStatus: 'free' | 'active' | 'canceled';
  setUserProfile: (profile: UserProfile | null) => void;
  setSubscriptionStatus: (status: 'free' | 'active' | 'canceled') => void;

  policies: Policy[];
  setPolicies: (policies: Policy[]) => void;
  addPolicy: (policy: Policy) => void;
  updatePolicyInStore: (id: string, updates: Partial<Policy>) => void;

  controls: Control[];
  setControls: (controls: Control[]) => void;
  updateControl: (id: string, updates: Partial<Control>) => void;

  checklists: AuditChecklist[];
  setChecklists: (checklists: AuditChecklist[]) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  markAllChecklistItemsComplete: (checklistId: string) => void;

  score: ComplianceScore | null;
  setScore: (score: ComplianceScore) => void;

  // Step 4 export tracking
  lastExportedAt: string | null;
  setLastExportedAt: (ts: string) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
}

export const useComplianceStore = create<ComplianceState>()(
  persist(
    (set, get) => ({
      activeTab: 'landing',
      setActiveTab: (tab) => {
        const { isAuthenticated } = get();
        if (tab === 'landing' || tab === 'vision') {
          set({ activeTab: tab });
          return;
        }
        if (!isAuthenticated) {
          set({
            activeTab: tab,
            isAuthModalOpen: true
          });
          return;
        }
        set({ activeTab: tab });
      },

      isAuthModalOpen: false,
      setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
      isAuthenticated: false, // Default to false — set to true on Clerk sign-in
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),

      isGateModalOpen: false,
      gateActionName: '',
      triggerLoginGate: (actionName: string) => {
        const { isAuthenticated } = get();
        if (isAuthenticated) {
          return true; // Action proceeds normally
        }
        // Intercept protected action with Login Gate Modal
        set({
          isGateModalOpen: true,
          gateActionName: actionName,
        });
        return false; // Intercepted
      },
      closeGateModal: () => set({ isGateModalOpen: false, gateActionName: '' }),

      onboardingData: {
        companyName: '',
        industry: '',
        targetFrameworks: [],
        cloudProvider: '',
        dataTypes: [],
        teamSize: '',
        isComplete: false,
      },
      setOnboardingData: (data) =>
        set((state) => ({ onboardingData: { ...state.onboardingData, ...data } })),

      completeOnboarding: async () => {
        const { onboardingData } = get();
        // Save to server (writes to users table + audit log)
        try {
          await api.saveOnboarding({
            companyName: onboardingData.companyName,
            industry: onboardingData.industry,
            cloudProvider: onboardingData.cloudProvider,
            dataTypes: onboardingData.dataTypes,
            teamSize: onboardingData.teamSize,
            targetFrameworks: onboardingData.targetFrameworks,
          });
        } catch (err) {
          console.warn('[Store] Onboarding API save failed, continuing locally.');
        }
        set((state) => ({
          onboardingData: { ...state.onboardingData, isComplete: true },
          activeTab: 'policies', // ← Navigate to Policy Generator, not dashboard
        }));
      },

      userProfile: null,
      subscriptionStatus: 'free', // Always start as free; loaded from API on mount
      setUserProfile: (profile) => set({ userProfile: profile }),
      setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),

      policies: [],
      setPolicies: (policies) => set({ policies }),
      addPolicy: (policy) => set((state) => ({ policies: [policy, ...state.policies] })),
      updatePolicyInStore: (id, updates) =>
        set((state) => ({
          policies: state.policies.map((p) => (p.id === id ? { ...p, ...updates } : p))
        })),

      controls: [],
      setControls: (controls) => set({ controls }),
      updateControl: (id, updates) =>
        set((state) => ({
          controls: state.controls.map((c) => (c.id === id ? { ...c, ...updates } : c))
        })),

      checklists: [],
      setChecklists: (checklists) => set({ checklists }),
      toggleChecklistItem: (checklistId, itemId) =>
        set((state) => ({
          checklists: state.checklists.map((chk) => {
            if (chk.id !== checklistId) return chk;
            const updatedItems = chk.items.map((item) =>
              item.id === itemId
                ? { ...item, status: item.status === 'completed' ? ('pending' as const) : ('completed' as const) }
                : item
            );
            const completedCount = updatedItems.filter((i) => i.status === 'completed').length;
            const pct = Math.round((completedCount / updatedItems.length) * 100);
            return { ...chk, items: updatedItems, completion_percentage: pct };
          })
        })),

      markAllChecklistItemsComplete: (checklistId) =>
        set((state) => ({
          checklists: state.checklists.map((chk) => {
            if (chk.id !== checklistId) return chk;
            const updatedItems = chk.items.map((item) => ({ ...item, status: 'completed' as const }));
            return { ...chk, items: updatedItems, completion_percentage: 100 };
          })
        })),

      score: null,
      setScore: (score) => set({ score }),

      lastExportedAt: null,
      setLastExportedAt: (ts) => set({ lastExportedAt: ts }),

      chatMessages: [
        {
          id: 'msg_0',
          sender: 'assistant',
          text: 'Hello! I am your AI Compliance Copilot trained on SOC 2, HIPAA, and GDPR standards. I can reference your actual policies and controls to give you specific guidance. How can I help you prep for your audit today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relatedControls: ['SOC 2 CC6.1', 'HIPAA § 164.312'],
          actionItems: ['Generate Information Security Policy', 'Attach MFA configuration proof']
        }
      ],
      addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] }))
    }),
    {
      name: 'arky-compliance-store', // localStorage key
      partialize: (state) => ({
        // Only persist onboardingData and lastExportedAt across refreshes
        // Everything else reloads from the API
        onboardingData: state.onboardingData,
        lastExportedAt: state.lastExportedAt,
      }),
    }
  )
);
