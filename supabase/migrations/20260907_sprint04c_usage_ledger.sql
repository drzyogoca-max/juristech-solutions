-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION: 20260907_sprint04c_usage_ledger.sql
-- JurisTech Solutions | Sprint 04C Phase 1A: Database Foundation
-- Objects:
--   1. public.user_usage_ledger table
--   2. RLS policy (owner SELECT only, no client writes)
--   3. public.check_and_increment_usage(p_user_id, p_metric, p_limit, p_period_key)
--   4. public.check_and_increment_usage(p_user_id, p_metric, p_limit)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. CREATE USER USAGE LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.user_usage_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL,
  contracts_created INTEGER NOT NULL DEFAULT 0,
  ai_queries_executed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_usage_ledger_user_period_key UNIQUE (user_id, period_key)
);

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.user_usage_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_usage_ledger_owner_select" ON public.user_usage_ledger;
CREATE POLICY "user_usage_ledger_owner_select" ON public.user_usage_ledger
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 3. CREATE ATOMIC USAGE INCREMENT RPC (4-argument version)
CREATE OR REPLACE FUNCTION public.check_and_increment_usage(
  p_user_id UUID,
  p_metric TEXT,
  p_limit INTEGER,
  p_period_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_period_key TEXT;
  v_current_usage INTEGER := 0;
  v_allowed BOOLEAN := FALSE;
  v_ledger_id UUID;
BEGIN
  -- Validate p_user_id
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'check_and_increment_usage: p_user_id cannot be null';
  END IF;

  -- Verify user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'check_and_increment_usage: user does not exist';
  END IF;

  -- Caller identity mismatch guard for direct authenticated invocations
  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'check_and_increment_usage: unauthorized caller identity mismatch';
  END IF;

  -- Validate metric against strict allowlist
  IF p_metric IS NULL OR p_metric NOT IN ('contracts_created', 'ai_queries_executed') THEN
    RAISE EXCEPTION 'check_and_increment_usage: invalid or unapproved metric "%"', p_metric;
  END IF;

  -- Validate limit
  IF p_limit IS NULL OR p_limit < 0 THEN
    RAISE EXCEPTION 'check_and_increment_usage: p_limit must be a non-negative integer';
  END IF;

  -- Determine period_key: if supplied (e.g. 'lifetime' or 'YYYY-MM'), use it.
  -- Otherwise, default to current UTC month.
  v_period_key := COALESCE(NULLIF(TRIM(p_period_key), ''), to_char(timezone('utc'::text, now()), 'YYYY-MM'));

  -- Safe upsert to ensure row exists before row-level locking
  INSERT INTO public.user_usage_ledger (user_id, period_key, contracts_created, ai_queries_executed, updated_at)
  VALUES (p_user_id, v_period_key, 0, 0, now())
  ON CONFLICT (user_id, period_key) DO NOTHING;

  -- Atomically lock the ledger row with SELECT FOR UPDATE
  IF p_metric = 'contracts_created' THEN
    SELECT id, contracts_created
      INTO v_ledger_id, v_current_usage
      FROM public.user_usage_ledger
     WHERE user_id = p_user_id AND period_key = v_period_key
       FOR UPDATE;

    IF v_current_usage < p_limit THEN
      v_allowed := TRUE;
      UPDATE public.user_usage_ledger
         SET contracts_created = contracts_created + 1,
             updated_at = now()
       WHERE id = v_ledger_id;

      v_current_usage := v_current_usage + 1;
    ELSE
      v_allowed := FALSE;
    END IF;

  ELSIF p_metric = 'ai_queries_executed' THEN
    SELECT id, ai_queries_executed
      INTO v_ledger_id, v_current_usage
      FROM public.user_usage_ledger
     WHERE user_id = p_user_id AND period_key = v_period_key
       FOR UPDATE;

    IF v_current_usage < p_limit THEN
      v_allowed := TRUE;
      UPDATE public.user_usage_ledger
         SET ai_queries_executed = ai_queries_executed + 1,
             updated_at = now()
       WHERE id = v_ledger_id;

      v_current_usage := v_current_usage + 1;
    ELSE
      v_allowed := FALSE;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'allowed', v_allowed,
    'current_usage', v_current_usage,
    'limit', p_limit,
    'metric', p_metric,
    'period_key', v_period_key
  );
END;
$$;

-- 4. CREATE 3-ARGUMENT RPC OVERLOAD
CREATE OR REPLACE FUNCTION public.check_and_increment_usage(
  p_user_id UUID,
  p_metric TEXT,
  p_limit INTEGER
)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.check_and_increment_usage(p_user_id, p_metric, p_limit, NULL::TEXT);
$$;

-- 5. SECURE PRIVILEGES: REVOKE FROM PUBLIC, GRANT TO AUTHENTICATED AND SERVICE_ROLE
REVOKE ALL ON FUNCTION public.check_and_increment_usage(UUID, TEXT, INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(UUID, TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(UUID, TEXT, INTEGER, TEXT) TO service_role;

REVOKE ALL ON FUNCTION public.check_and_increment_usage(UUID, TEXT, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(UUID, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(UUID, TEXT, INTEGER) TO service_role;
