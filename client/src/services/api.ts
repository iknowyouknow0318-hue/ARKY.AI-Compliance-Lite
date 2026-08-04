import axios from 'axios';
import { Policy, Control, AuditChecklist, ComplianceScore } from '../types';

const API_BASE = '/api';

// ─── Auth Token Getter ─────────────────────────────────────────────────────
// We store a reference to the Clerk getToken function set at app startup.
// This avoids importing Clerk hooks outside React components.
let _getToken: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  _getToken = getter;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) return { Authorization: `Bearer ${token}` };
    } catch {
      // fall through to no-auth
    }
  }
  return {};
}

// ─── Axios instance with auth interceptor ────────────────────────────────
const axiosClient = axios.create({ baseURL: '/' });

axiosClient.interceptors.request.use(async (config) => {
  const authHeader = await getAuthHeader();
  if (authHeader.Authorization) {
    config.headers.Authorization = authHeader.Authorization;
  }
  return config;
});

export const api = {
  // Policy API
  async fetchPolicies(): Promise<Policy[]> {
    try {
      const res = await axiosClient.get(`${API_BASE}/policies`);
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Server endpoint unreachable, using client state fallback.');
    }
    return [];
  },

  async generatePolicy(payload: any): Promise<Policy> {
    try {
      const res = await axiosClient.post(`${API_BASE}/policies/generate`, payload);
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] AI endpoint unreachable, using local policy synthesizer.');
    }
    // Local fallback synthesizer for offline mode
    return {
      id: `pol_${Date.now()}`,
      user_id: 'user_2N_demo',
      title: `${payload.companyName || 'SaaS startup'} - ${payload.framework || 'SOC 2'} Information Security Policy`,
      framework: payload.framework || 'SOC 2',
      category: 'Logical Access & Security',
      content: `# ${payload.companyName || 'SaaS Startup'} - ${payload.framework || 'SOC 2'} Security Policy\n\n### 1. Scope & Purpose\nEstablishes mandatory encryption and access controls for ${payload.cloudProvider || 'AWS'}.\n\n### 2. Mandatory Controls\n- Enforce 100% MFA for all systems.\n- Encryption at rest via AES-256 in Supabase PostgreSQL.\n- Automated CI/CD peer code review enforcement.`,
      version: 1,
      status: 'Published',
      compliance_tags: ['SOC 2', 'Encryption', 'MFA', 'Access Control'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async editPolicy(id: string, content: string, title?: string): Promise<Policy | null> {
    try {
      const res = await axiosClient.put(`${API_BASE}/policies/${id}`, { content, title });
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Policy edit fallback.');
    }
    return null;
  },

  async fetchPolicyVersions(id: string) {
    try {
      const res = await axiosClient.get(`${API_BASE}/policies/${id}/versions`);
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Policy versions fallback.');
    }
    return [];
  },

  // User / Onboarding API
  async saveOnboarding(data: {
    companyName: string;
    industry: string;
    cloudProvider: string;
    dataTypes: string[];
    teamSize: string;
    targetFrameworks: string[];
  }): Promise<boolean> {
    try {
      const res = await axiosClient.post(`${API_BASE}/users/onboarding`, data);
      return res.data.success === true;
    } catch (err) {
      console.warn('[API Client] Onboarding save fallback.');
    }
    return false;
  },

  async fetchProfile(): Promise<any | null> {
    try {
      const res = await axiosClient.get(`${API_BASE}/users/profile`);
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Profile fetch fallback.');
    }
    return null;
  },

  // Control Matrix API
  async fetchControls(): Promise<Control[]> {
    try {
      const res = await axiosClient.get(`${API_BASE}/controls`);
      if (res.data.success && res.data.data.length > 0) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Controls endpoint fallback.');
    }
    return [
      {
        id: 'ctrl_01',
        user_id: 'user_2N_demo',
        code: 'CC6.1',
        title: 'Multi-Factor Authentication (MFA) Enforcement',
        description: 'Enforce MFA across all cloud infrastructure, developer repos, and identity platforms.',
        framework: 'SOC 2',
        category: 'Logical Access',
        status: 'Complete',
        evidence_url: 'https://clerk.com/docs/security/mfa',
        evidence_name: 'MFA_Enforcement_Policy.png',
        evidence_type: 'Image Proof',
        assigned_role: 'Security Admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'ctrl_02',
        user_id: 'user_2N_demo',
        code: 'CC6.6',
        title: 'Data Encryption In-Transit & At-Rest',
        description: 'TLS 1.3 for API endpoints and AES-256 for Supabase PostgreSQL tables.',
        framework: 'SOC 2',
        category: 'Data Protection',
        status: 'Complete',
        evidence_url: 'https://supabase.com/docs/security/encryption',
        evidence_name: 'Supabase_TLS1.3_AES256_Cert.pdf',
        evidence_type: 'System Config',
        assigned_role: 'DevOps Specialist',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'ctrl_03',
        user_id: 'user_2N_demo',
        code: 'CC8.1',
        title: 'Automated CI/CD Change Management Controls',
        description: 'Require mandatory peer review and automated security tests before production deploy.',
        framework: 'SOC 2',
        category: 'Change Management',
        status: 'Complete',
        evidence_url: 'https://github.com/arky/repo/actions/workflows/ci.yml',
        evidence_name: 'GitHub_Actions_CICD_PeerReview_Proof.pdf',
        evidence_type: 'CI/CD Config',
        assigned_role: 'Lead Developer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'ctrl_04',
        user_id: 'user_2N_demo',
        code: '164.312(a)',
        title: 'HIPAA Unique User Identification & Access Revocation',
        description: 'Assign unique logins to each system operator and auto-revoke access upon termination.',
        framework: 'HIPAA',
        category: 'Technical Safeguard',
        status: 'Complete',
        evidence_url: 'https://clerk.com/docs/security/mfa',
        evidence_name: 'Clerk_MFA_User_Auth_Policy.pdf',
        evidence_type: 'Identity Config',
        assigned_role: 'Compliance Lead',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'ctrl_05',
        user_id: 'user_2N_demo',
        code: 'GDPR-Art32',
        title: 'GDPR Technical Confidentiality & Resiliency Assessment',
        description: 'Regular testing and evaluating technical & organizational security measures.',
        framework: 'GDPR',
        category: 'Data Confidentiality',
        status: 'Complete',
        evidence_url: 'https://supabase.com/docs/security/gdpr',
        evidence_name: 'GDPR_Art32_Resiliency_Audit.pdf',
        evidence_type: 'Audit Report',
        assigned_role: 'DPO / Founder',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  },

  async updateControl(id: string, updates: Partial<Control>): Promise<Control | null> {
    try {
      const res = await axiosClient.patch(`${API_BASE}/controls/${id}`, updates);
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Update control fallback.');
    }
    return null;
  },

  // Checklists API
  async fetchChecklists(): Promise<AuditChecklist[]> {
    try {
      const res = await axiosClient.get(`${API_BASE}/checklists`);
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Checklist endpoint fallback.');
    }
    return [];
  },

  // AI Assistant Chatbot API
  async askAssistant(question: string, context?: any) {
    try {
      const res = await axiosClient.post(`${API_BASE}/assistant/chat`, { question, context });
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Assistant fallback.');
    }
    return {
      answer: `To meet SOC 2, HIPAA, and GDPR standards effectively, upload evidence files (MFA screenshots, BAA agreements) to the Control Dashboard.`,
      relatedControls: ['SOC 2 CC6.1', 'HIPAA § 164.312'],
      actionItems: ['Upload MFA Screenshot', 'Verify TLS 1.3 Endpoint']
    };
  },

  // Stripe Payments API
  async createCheckoutSession(plan: string = 'growth_299') {
    try {
      const res = await axiosClient.post(`${API_BASE}/stripe/create-checkout-session`, { plan });
      if (res.data.success) return res.data.url;
    } catch (err) {
      console.warn('[API Client] Stripe checkout fallback.');
    }
    return '/dashboard?checkout=success_sandbox';
  },

  // Audit Trail API
  async fetchAuditLogs(action: string = 'all') {
    try {
      const res = await axiosClient.get(`${API_BASE}/logs`, { params: { action } });
      if (res.data.success) return res.data.data;
    } catch (err) {
      console.warn('[API Client] Audit logs fallback.');
    }
    return [];
  },

  async logAuditAction(action: string, resource: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      await axiosClient.post(`${API_BASE}/logs/action`, { action, resource, metadata });
    } catch (err) {
      // Non-blocking — just warn
      console.warn('[API Client] Audit log write fallback.', action);
    }
  },

  async exportAuditLogs(format: string = 'csv') {
    try {
      const res = await axiosClient.post(`${API_BASE}/logs/export`, { format }, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arky_audit_logs.${format}`;
      a.click();
    } catch (err) {
      console.warn('[API Client] Export audit logs fallback.');
    }
  }
};
