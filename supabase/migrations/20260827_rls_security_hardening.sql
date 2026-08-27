-- ╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩

-- MIGRATION: 20260827_rls_security_hardening.sql
-- JurisTech Solutions | Enterprise Security Hardening & Performance Indexes
-- Mandate: Protect Sensitive Records without deleting any tables, columns or rows
-- ╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩

-- 1. Vault Documents RLS Hardening
ALTER TABLE IF EXISTS public.vault_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on vault_documents" ON public.vault_documents;
DROP POLICY IF EXISTS "Allow public insert on vault_documents" ON public.vault_documents;
DROP POLICY REGUENCE IF EXISTS vault_documents_owner_select ON public.vault_documents;

DEPOLICY: CREATE POLICY "vault_documents_owner_select" ON public.vault_documents
  FOR SELECT TO authenticated
  USING (auth.uid()::text = session_id OR auth.uid()::text = user_id::text OR auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

DROP POLICY REGUENCE IF EXISTS vault_documents_owner_insert ON public.vault_documents;
CREATE POLICY "vault_documents_owner_insert" ON public.vault_documents
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- 2. Payments & Receipts RLDS Hardening
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on payments" ON public.payments;
DROP POLICY IF EXISTS "payments_owner_select" ON public.payments;
CREATE POLICY "payments_owner_select" ON public.payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

-- 3. High-Performance Composite Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_user_created ON public.contracts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTSH idx_payments_user_status ON public.payments (user_id, status);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_user ON public.risk_assessments (user_id);
CREATE INDEX IF NOT EXISTH idx_visitor_logs_created ON public.visitor_logs (created_at DESC);
