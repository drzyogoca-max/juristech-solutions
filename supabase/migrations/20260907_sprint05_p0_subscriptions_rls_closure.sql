-- ═══════════════════════════════════════════════════════════════════════════════
-- JurisTech Solutions — Sprint 05 Phase 1B: Subscriptions Table RLS Write Lockdown
-- Migration: 20260907_sprint05_p0_subscriptions_rls_closure.sql
--
-- Target Security Model:
--   1. Anonymous (anon):
--      - SELECT = DENY
--      - INSERT = DENY
--      - UPDATE = DENY
--      - DELETE = DENY
--   2. Authenticated Customer (authenticated):
--      - SELECT own subscription only (auth.uid() = user_id)
--      - SELECT another user's subscription = DENY
--      - INSERT = DENY (no write policy)
--      - UPDATE = DENY (no write policy)
--      - DELETE = DENY (no write policy)
--   3. Privileged Operations:
--      - admin_approve_receipt_and_activate (SECURITY DEFINER) retains full write
--      - service_role (backend webhooks & resolver) retains full write & read
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Ensure Row Level Security is strictly enabled
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Drop all historical permissive and customer-write policies
DROP POLICY IF EXISTS "Allow public upsert on subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow public select on subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can upsert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_owner_select" ON public.subscriptions;

-- 3. Create single strict owner SELECT policy for authenticated customers
CREATE POLICY "subscriptions_owner_select"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
  );

-- 4. Explicitly revoke any write privileges on the table from client roles
REVOKE INSERT, UPDATE, DELETE ON TABLE public.subscriptions FROM anon, authenticated, public;
GRANT SELECT ON TABLE public.subscriptions TO authenticated;

-- 5. Ensure service_role retains full access for authoritative server workflows
GRANT ALL ON TABLE public.subscriptions TO service_role;
