-- JurisTech Solutions | 2026-09-15 Security Closure
-- Non-destructive policy hardening for sensitive audit/vault tables.
-- Payment/contract/Risk policies are already closed by 20260828 + later migrations.

ALTER TABLE IF EXISTS public.audit_trail ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public inserts on audit_trail" ON public.audit_trail;
DROP POLICY IF EXISTS "Allow authenticated select on audit_trail" ON public.audit_trail;
DROP POLICY IF EXISTS "audit_trail_owner_insert" ON public.audit_trail;
DROP POLICY IF EXISTS "audit_trail_admin_select" ON public.audit_trail;

CREATE POLICY "audit_trail_owner_insert"
  ON public.audit_trail FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

CREATE POLICY "audit_trail_admin_select"
  ON public.audit_trail FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

REVOKE INSERT, UPDATE, DELETE ON TABLE public.audit_trail FROM anon;
REVOKE SELECT ON TABLE public.audit_trail FROM anon;
GRANT INSERT ON TABLE public.audit_trail TO authenticated;
GRANT SELECT ON TABLE public.audit_trail TO authenticated;
GRANT ALL ON TABLE public.audit_trail TO service_role;

ALTER TABLE IF EXISTS public.swift_vault ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on swift_vault" ON public.swift_vault;
DROP POLICY IF EXISTS "Restrict select on swift_vault to financial admins" ON public.swift_vault;
DROP POLICY IF EXISTS "swift_vault_financial_select" ON public.swift_vault;

CREATE POLICY "swift_vault_financial_select"
  ON public.swift_vault FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'financial_admin');

REVOKE INSERT, UPDATE, DELETE, SELECT ON TABLE public.swift_vault FROM anon, authenticated;
GRANT SELECT ON TABLE public.swift_vault TO authenticated;
GRANT ALL ON TABLE public.swift_vault TO service_role;

-- Defense-in-depth: prevent browser roles from reading telemetry/lead stores.
ALTER TABLE IF EXISTS public.visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.radar_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "visitor_logs_telemetry_insert" ON public.visitor_logs;
DROP POLICY IF EXISTS "radar_leads_insert" ON public.radar_leads;

CREATE POLICY "visitor_logs_telemetry_insert" ON public.visitor_logs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "radar_leads_insert" ON public.radar_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

REVOKE SELECT, UPDATE, DELETE ON TABLE public.visitor_logs FROM anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON TABLE public.radar_leads FROM anon, authenticated;
GRANT INSERT ON TABLE public.visitor_logs TO anon, authenticated;
GRANT INSERT ON TABLE public.radar_leads TO anon, authenticated;
GRANT ALL ON TABLE public.visitor_logs, public.radar_leads TO service_role;
