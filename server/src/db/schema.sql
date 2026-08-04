-- =====================================================================
-- AI Compliance Lite - Supabase PostgreSQL Schema & RLS Setup
-- Official Clerk Third-Party Auth Integration (No Legacy JWT Templates)
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table (Synced with Clerk user_id string, e.g., 'user_2N...')
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Clerk user_id
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  industry TEXT,
  team_size TEXT,
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Policies Table
CREATE TABLE IF NOT EXISTS public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  framework TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  version INT DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Published',
  compliance_tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Controls Table
CREATE TABLE IF NOT EXISTS public.controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  framework TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Started',
  evidence_url TEXT,
  evidence_name TEXT,
  evidence_type TEXT,
  assigned_role TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Audit Checklists Table
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  framework TEXT NOT NULL,
  title TEXT NOT NULL,
  items JSONB NOT NULL,
  completion_percentage INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Compliance Scores Table
CREATE TABLE IF NOT EXISTS public.compliance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  breakdown JSONB NOT NULL,
  risk_level TEXT NOT NULL,
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Logs Table (Immutable Log)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_policies_user ON public.policies(user_id);
CREATE INDEX IF NOT EXISTS idx_controls_user ON public.controls(user_id);
CREATE INDEX IF NOT EXISTS idx_checklists_user ON public.checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_scores_user ON public.compliance_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);

-- =====================================================================
-- NATIVE CLERK THIRD-PARTY OAUTH RLS POLICIES (auth.uid())
-- =====================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_self" ON public.users
  FOR ALL USING (id = auth.uid()::text) WITH CHECK (id = auth.uid()::text);

CREATE POLICY "policies_self" ON public.policies
  FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "controls_self" ON public.controls
  FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "checklists_self" ON public.checklists
  FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "compliance_scores_self" ON public.compliance_scores
  FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "audit_logs_self" ON public.audit_logs
  FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
