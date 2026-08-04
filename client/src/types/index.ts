export type FrameworkType = 'SOC 2' | 'HIPAA' | 'GDPR' | 'ISO 27001';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  industry?: string;
  teamSize?: string;
  cloudProvider?: string;
  dataTypes?: string[];
  subscriptionStatus: 'free' | 'active' | 'canceled';
}

export interface Policy {
  id: string;
  user_id: string;
  title: string;
  framework: FrameworkType;
  category: string;
  content: string;
  version: number;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published';
  compliance_tags: string[];
  // Required fields per spec
  generated_at?: string;
  model_name?: string;
  template_version?: string;
  // Legacy/additional metadata
  model_used?: string;
  tailoring_cues?: Record<string, any>;
  edit_count?: number;
  last_edited_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PolicyVersion {
  id: string;
  policy_id: string;
  version: number;
  content: string;
  model_used?: string;
  edited_by?: string;
  edited_at: string;
}

export interface Control {
  id: string;
  user_id: string;
  code: string;
  title: string;
  description?: string;
  framework: FrameworkType;
  category: string;
  status: 'Not Started' | 'In Progress' | 'Complete' | 'Needs Review';
  evidence_url?: string;
  evidence_name?: string;
  evidence_type?: string;
  assigned_role?: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  status: 'pending' | 'completed' | 'in_progress';
  auditorNotes?: string;
  code?: string;
}

export interface AuditChecklist {
  id: string;
  title: string;
  framework: string;
  completion_percentage: number;
  items: ChecklistItem[];
}

export interface ComplianceScore {
  overall_score: number;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  breakdown: Record<string, number>;
  audit_readiness: string;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedControls?: string[];
  actionItems?: string[];
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  resource_name?: string;
  details?: Record<string, any>;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

