-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION: 20260808_rls_hardening.sql
-- JurisTech Solutions | Hardened Row Level Security (RLS) Policies
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Harden Contracts Table RLS Policies
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.contracts;
DROP POLICY IF EXISTS "Allow public insert" ON public.contracts;
DROP POLICY IF EXISTS "contracts_select" ON public.contracts;
DROP POLICY IF EXISTS "contracts_insert" ON public.contracts;

CREATE POLICY "contracts_select_authenticated" ON public.contracts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "contracts_insert_authenticated" ON public.contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contracts_update_owner" ON public.contracts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Harden Risk Assessments Table RLS Policies
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_select" ON public.risk_assessments;

CREATE POLICY "risk_assessments_select_authenticated" ON public.risk_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "risk_assessments_insert_authenticated" ON public.risk_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Harden Audit Trail Table RLS Policies
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.audit_trail;
DROP POLICY IF EXISTS "Allow public select" ON public.audit_trail;

CREATE POLICY "audit_trail_insert_system" ON public.audit_trail
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "audit_trail_select_admin_only" ON public.audit_trail
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

-- 4. Harden Chat Messages Table RLS Policies
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages_user_isolation" ON public.chat_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
