-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION: 20260906_global_saas_tenancy_foundation.sql
-- JurisTech Solutions | Sprint 01 Foundation (Phase 9B & Phase 9K)
-- Non-Destructive, Additive Enterprise Multi-Tenancy & Workspace Schema
-- ═══════════════════════════════════════════════════════════════════════════════

-- Ensure UUID extension is active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. ORGANIZATIONS (TENANTS) TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'company',
    primary_jurisdiction VARCHAR(10) NOT NULL DEFAULT 'GLOBAL',
    owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    seat_limit INTEGER NOT NULL DEFAULT 5,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    custom_domain VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Organization Members can read their own organization details
CREATE POLICY "organizations_member_select" ON public.organizations
    FOR SELECT TO authenticated
    USING (
        id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND status = 'ACTIVE'
        )
        OR owner_user_id = auth.uid()
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    );

-- Only Organization Owner or Platform Admin can update organization settings
CREATE POLICY "organizations_owner_update" ON public.organizations
    FOR UPDATE TO authenticated
    USING (
        owner_user_id = auth.uid()
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    )
    WITH CHECK (
        owner_user_id = auth.uid()
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    );


-- ── 2. ORGANIZATION MEMBERS (MEMBERSHIP & RBAC) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'Viewer',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (organization_id, user_id)
);

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Members can see peers in their own organization
CREATE POLICY "org_members_select_peers" ON public.organization_members
    FOR SELECT TO authenticated
    USING (
        organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND status = 'ACTIVE'
        )
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    );

-- Only Organization Owner/Admin can manage membership
CREATE POLICY "org_members_admin_modify" ON public.organization_members
    FOR ALL TO authenticated
    USING (
        organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND role IN ('Owner', 'Admin') AND status = 'ACTIVE'
        )
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    )
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND role IN ('Owner', 'Admin') AND status = 'ACTIVE'
        )
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    );


-- ── 3. WORKSPACES (DEPARTMENTAL SEGREGATION) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL DEFAULT 'general',
    description TEXT,
    allowed_jurisdictions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Workspace is visible to organization members
CREATE POLICY "workspaces_org_member_select" ON public.workspaces
    FOR SELECT TO authenticated
    USING (
        organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND status = 'ACTIVE'
        )
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    );


-- ── 4. WORKSPACE MEMBERS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'Viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (workspace_id, user_id)
);

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ws_members_select" ON public.workspace_members
    FOR SELECT TO authenticated
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE organization_id IN (
                SELECT organization_id FROM public.organization_members 
                WHERE user_id = auth.uid() AND status = 'ACTIVE'
            )
        )
        OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')
    );


-- ── 5. ADDITIVE COLUMNS ON EXISTING ASSET TABLES (100% NON-DESTRUCTIVE) ────────
-- Existing records preserve NULL organization_id, remaining subject to user-only ownership.

ALTER TABLE public.contracts 
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

ALTER TABLE public.risk_assessments 
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

ALTER TABLE public.vault_documents 
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;

ALTER TABLE public.chat_messages 
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;


-- ── 6. BACKWARD-COMPATIBLE MULTI-TENANT RLS POLICIES ─────────────────────────
-- Preserves existing user access for legacy records (organization_id IS NULL AND auth.uid() = user_id)
-- Enforces strict organization barrier for tenant records (organization_id IS NOT NULL)

-- Contracts: Organization Member Read
CREATE POLICY "contracts_organization_select" ON public.contracts
    FOR SELECT TO authenticated
    USING (
        organization_id IS NOT NULL AND organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- Risk Assessments: Organization Member Read
CREATE POLICY "risk_assessments_organization_select" ON public.risk_assessments
    FOR SELECT TO authenticated
    USING (
        organization_id IS NOT NULL AND organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- Vault Documents: Organization Member Read
CREATE POLICY "vault_documents_organization_select" ON public.vault_documents
    FOR SELECT TO authenticated
    USING (
        organization_id IS NOT NULL AND organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = auth.uid() AND status = 'ACTIVE'
        )
    );

-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 6: SAFE ROLLBACK SCRIPT
-- If needed, drops only newly added multi-tenant elements without touching legacy data:
-- DROP TABLE IF EXISTS public.workspace_members CASCADE;
-- DROP TABLE IF EXISTS public.workspaces CASCADE;
-- DROP TABLE IF EXISTS public.organization_members CASCADE;
-- DROP TABLE IF EXISTS public.organizations CASCADE;
-- ALTER TABLE public.contracts DROP COLUMN IF EXISTS organization_id, DROP COLUMN IF EXISTS workspace_id;
-- ALTER TABLE public.risk_assessments DROP COLUMN IF EXISTS organization_id, DROP COLUMN IF EXISTS workspace_id;
-- ALTER TABLE public.vault_documents DROP COLUMN IF EXISTS organization_id, DROP COLUMN IF EXISTS workspace_id;
-- ALTER TABLE public.chat_messages DROP COLUMN IF EXISTS organization_id, DROP COLUMN IF EXISTS workspace_id, DROP COLUMN IF EXISTS user_id;
-- ═══════════════════════════════════════════════════════════════════════════════
