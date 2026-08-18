-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION: 20260814_make_views_public.sql
-- Allow public select and insert for risk assessments, subscriptions and contracts
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Risk Assessments: allow public select and inserts
DROP POLICY IF EXISTS "risk_assessments_select_authenticated" ON public.risk_assessments;
DROP POLICY IF EXISTS "risk_assessments_insert_authenticated" ON public.risk_assessments;
DROP POLICY IF EXISTS "Allow public select on risk_assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Allow public inserts on risk_assessments" ON public.risk_assessments;

CREATE POLICY "Allow public select on risk_assessments" 
  ON public.risk_assessments FOR SELECT 
  USING (true);

CREATE POLICY "Allow public inserts on risk_assessments" 
  ON public.risk_assessments FOR INSERT 
  WITH CHECK (true);


-- 2. Subscriptions: allow public select and upserts
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can upsert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow public select on subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow public upsert on subscriptions" ON public.subscriptions;

CREATE POLICY "Allow public select on subscriptions" 
  ON public.subscriptions FOR SELECT 
  USING (true);

CREATE POLICY "Allow public upsert on subscriptions" 
  ON public.subscriptions FOR ALL 
  USING (true);


-- 3. Contracts: allow public select and inserts (to prevent similar issues with contracts)
DROP POLICY IF EXISTS "contracts_select_authenticated" ON public.contracts;
DROP POLICY IF EXISTS "contracts_insert_authenticated" ON public.contracts;
DROP POLICY IF EXISTS "contracts_update_owner" ON public.contracts;
DROP POLICY IF EXISTS "Allow public select on contracts" ON public.contracts;
DROP POLICY IF EXISTS "Allow public inserts on contracts" ON public.contracts;

CREATE POLICY "Allow public select on contracts" 
  ON public.contracts FOR SELECT 
  USING (true);

CREATE POLICY "Allow public inserts on contracts" 
  ON public.contracts FOR INSERT 
  WITH CHECK (true);
