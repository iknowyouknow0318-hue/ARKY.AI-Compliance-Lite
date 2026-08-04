-- =====================================================================
-- Official Clerk Third-Party Auth Integration for Supabase
-- Replaces deprecated JWT templates with native auth.uid() RLS binding
-- =====================================================================

-- 1. Performance Indexes on Tenant Columns
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_policies_user ON public.policies(user_id);
CREATE INDEX IF NOT EXISTS idx_controls_user ON public.controls(user_id);
CREATE INDEX IF NOT EXISTS idx_checklists_user ON public.checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_scores_user ON public.compliance_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);

-- 2. Drop Legacy RLS Policies
DROP POLICY IF EXISTS "Users can view and edit own profile" ON public.users;
DROP POLICY IF EXISTS "Users can manage own policies" ON public.policies;
DROP POLICY IF EXISTS "Users can manage own controls" ON public.controls;
DROP POLICY IF EXISTS "Users can manage own checklists" ON public.checklists;
DROP POLICY IF EXISTS "Users can view own compliance scores" ON public.compliance_scores;
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

DROP POLICY IF EXISTS "users_self" ON public.users;
DROP POLICY IF EXISTS "policies_self" ON public.policies;
DROP POLICY IF EXISTS "controls_self" ON public.controls;
DROP POLICY IF EXISTS "checklists_self" ON public.checklists;
DROP POLICY IF EXISTS "compliance_scores_self" ON public.compliance_scores;
DROP POLICY IF EXISTS "audit_logs_self" ON public.audit_logs;

-- 3. Enable RLS on All Tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Native auth.uid() RLS Policies (Bound directly to Clerk Third-Party OAuth Identity)
CREATE POLICY "users_self" ON public.users
  FOR ALL
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

CREATE POLICY "policies_self" ON public.policies
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "controls_self" ON public.controls
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "checklists_self" ON public.checklists
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "compliance_scores_self" ON public.compliance_scores
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "audit_logs_self" ON public.audit_logs
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- 5. Backward Compatibility Helper (for edge cases)
CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    NULLIF(current_setting('app.current_user_id', true), ''),
    auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql STABLE;
