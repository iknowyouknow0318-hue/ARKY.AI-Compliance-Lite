export interface User {
  id: string; // Clerk user_id
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  industry?: string;
  team_size?: string;
  subscription_status?: 'free' | 'active' | 'canceled';
  stripe_customer_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Policy {
  id: string;
  user_id: string;
  title: string;
  framework: 'SOC 2' | 'HIPAA' | 'GDPR' | 'ISO 27001';
  category: string;
  content: string;
  version: number;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published';
  compliance_tags: string[];
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
  framework: 'SOC 2' | 'HIPAA' | 'GDPR' | 'ISO 27001';
  category: string;
  status: 'Not Started' | 'In Progress' | 'Complete' | 'Needs Review';
  evidence_url?: string;
  evidence_name?: string;
  evidence_type?: string;
  assigned_role?: string;
  created_at: string;
  updated_at: string;
}

export interface Evidence {
  id: string;
  control_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  status: 'pending' | 'completed' | 'in_progress';
  auditorNotes?: string;
  code?: string;
}

export interface Checklist {
  id: string;
  user_id: string;
  framework: string;
  title: string;
  items: ChecklistItem[];
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ComplianceScore {
  id: string;
  user_id: string;
  overall_score: number;
  breakdown: Record<string, number>;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  recommendations: string[];
  created_at: string;
  updated_at: string;
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

export interface PdfExport {
  id: string;
  user_id: string;
  framework: string;
  score_at_export: number;
  file_url?: string;
  exported_at: string;
}

