-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION: 20260828_p0_production_rls_hardening.sql
-- JurisTech Solutions | Production Hardening P0: Sovereign Data Isolation
-- Zero breaking changes to legitimate guest onboarding or admin operations.
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. VAULT DOCUMENTS
ALTER TABLE IF EXISTS public.vault_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on vault_documents" ON public.vault_documents;
DROP POLICY IF EXISTS "Allow public insert on vault_documents" ON public.vault_documents;
DROP POLICY IF EXISTS "vault_documents_owner_select" ON public.vault_documents;
DROP POLICY IF EXISTS "vault_documents_owner_insert" ON public.vault_documents;
DROP POLICY IF EXISTS "vault_documents_insert" ON public.vault_documents;
DROP POLICY IF EXISTS "vault_documents_owner_modify" ON public.vault_documents;

-- Owner and admin SELECT only (User A cannot read User B)
CREATE POLICY "vault_documents_owner_select" ON public.vault_documents
  FOR SELECT TO authenticated
  USING (
    auth.uid()::text = user_id::text 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );

-- Legitimate client vault upload (guest/auth)
CREATE POLICY "vault_documents_insert" ON public.vault_documents
  FOR INSERT TO authenticated, anon
  WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid()::text = user_id::text
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Owner UPDATE & DELETE only
CREATE POLICY "vault_documents_owner_modify" ON public.vault_documents
  FOR ALL TO authenticated
  USING (
    auth.uid()::text = user_id::text 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  )
  WITH CHECK (
    auth.uid()::text = user_id::text 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );


-- 2. CONTRACTS
ALTER TABLE IF EXISTS public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.contracts;
DROP POLICY IF EXISTS "Allow public insert" ON public.contracts;
DROP POLICY IF EXISTS "contracts_select" ON public.contracts;
DROP POLICY IF EXISTS "contracts_insert" ON public.contracts;
DROP POLICY IF EXISTS "contracts_select_authenticated" ON public.contracts;
DROP POLICY IF EXISTS "contracts_insert_authenticated" ON public.contracts;
DROP POLICY IF EXISTS "contracts_update_owner" ON public.contracts;
DROP POLICY IF EXISTS "contracts_owner_select" ON public.contracts;
DROP POLICY IF EXISTS "contracts_owner_insert" ON public.contracts;
DROP POLICY IF EXISTS "contracts_guest_insert" ON public.contracts;
DROP POLICY IF EXISTS "contracts_owner_modify" ON public.contracts;

-- Owner and admin SELECT only (User A cannot read User B)
CREATE POLICY "contracts_owner_select" ON public.contracts
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );

-- Authenticated user creates contract for own account
CREATE POLICY "contracts_owner_insert" ON public.contracts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Guest quick generator insert (user_id must be null, cannot claim another user)
CREATE POLICY "contracts_guest_insert" ON public.contracts
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- Owner UPDATE & DELETE only
CREATE POLICY "contracts_owner_modify" ON public.contracts
  FOR ALL TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );


-- 3. RISK ASSESSMENTS
ALTER TABLE IF EXISTS public.risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_select" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_select_authenticated" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_insert_authenticated" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_owner_select" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_insert" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_owner_modify" ON public.risk_assessments;

-- Owner and admin SELECT only
CREATE POLICY "risk_assessments_owner_select" ON public.risk_assessments
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );

-- Insert policy: auth user links to self, guest creates with user_id NULL
CREATE POLICY "risk_assessments_insert" ON public.risk_assessments
  FOR INSERT TO authenticated, anon
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Owner UPDATE & DELETE only
CREATE POLICY "risk_assessments_owner_modify" ON public.risk_assessments
  FOR ALL TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );


-- 4. PAYMENTS & RECEIPTS
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow public inserts on payments" ON public.payments;
DROP POLICY IF EXISTS "payments_owner_select" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_allowed" ON public.payments;

DROP POLICY IF EXISTS "Allow public select on payment_receipts" ON public.payment_receipts;
DROP POLICY IF EXISTS "Allow public inserts on payment_receipts" ON public.payment_receipts;
DROP POLICY IF EXISTS "Users can view own receipts" ON public.payment_receipts;
DROP POLICY IF EXISTS "Users can insert own receipts" ON public.payment_receipts;
DROP POLICY IF EXISTS "receipts_owner_select" ON public.payment_receipts;
DROP POLICY IF EXISTS "receipts_insert_allowed" ON public.payment_receipts;

-- Payments SELECT: Owner or admin only (No public select)
CREATE POLICY "payments_owner_select" ON public.payments
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );

-- Payments INSERT: Allowed for checkout flow
CREATE POLICY "payments_insert_allowed" ON public.payments
  FOR INSERT TO authenticated, anon
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Receipts SELECT: Owner or admin only
CREATE POLICY "receipts_owner_select" ON public.payment_receipts
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );

-- Receipts INSERT: Allowed for manual bank receipt upload
CREATE POLICY "receipts_insert_allowed" ON public.payment_receipts
  FOR INSERT TO authenticated, anon
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );


-- 5. CHAT MESSAGES
ALTER TABLE IF EXISTS public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_messages_user_isolation" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_owner_select" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert" ON public.chat_messages;

-- Chat SELECT: Only message owner or admin
CREATE POLICY "chat_messages_owner_select" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );

-- Chat INSERT: Allowed for logged-in and guest AI interaction
CREATE POLICY "chat_messages_insert" ON public.chat_messages
  FOR INSERT TO authenticated, anon
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );


-- 6. VISITOR LOGS (TELEMETRY)
ALTER TABLE IF EXISTS public.visitor_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "visitor_logs_admin_select" ON public.visitor_logs;
DROP POLICY IF EXISTS "visitor_logs_telemetry_insert" ON public.visitor_logs;

-- Visitor logs SELECT: Admin ONLY (Visitors cannot read visitor logs)
CREATE POLICY "visitor_logs_admin_select" ON public.visitor_logs
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

-- Visitor logs INSERT: Telemetry ingestion allowed
CREATE POLICY "visitor_logs_telemetry_insert" ON public.visitor_logs
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);


-- 7. RADAR LEADS
ALTER TABLE IF EXISTS public.radar_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "radar_leads_admin_select" ON public.radar_leads;
DROP POLICY IF EXISTS "radar_leads_insert" ON public.radar_leads;

-- Radar leads SELECT: Admin ONLY (Leads cannot read competitors' leads)
CREATE POLICY "radar_leads_admin_select" ON public.radar_leads
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

-- Radar leads INSERT: Inbound lead capture allowed
CREATE POLICY "radar_leads_insert" ON public.radar_leads
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);
