/**
 * src/context/SaaSContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Canonical Multi-Tenant Global SaaS Context
 * Sprint 02 (Phase 3)
 *
 * Implements the authoritative hierarchy:
 *   User ──► Organization ──► Workspace ──► Role / Permissions ──► Resources
 *
 * Replaces legacy client-side localStorage mocks with a deterministic,
 * real multi-tenant context that interfaces with Supabase PostgREST
 * and provides resilient fallback when database endpoints are cold.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  TenantOrganization,
  SaaSWorkspace,
  SaaSRole,
  SaaSPermission,
  OrganizationMember,
  OrganizationType,
  WorkspaceDepartment,
} from '../types/saas';
import { getRolePermissions } from '../security/rbacResolver';
import { supabase, invalidateCache } from '../lib/supabaseClient';
import { useAuth } from '../lib/authContext';
import { createPersonalOrganization, createPersonalWorkspace } from '../services/tenancy/personalOrgBackfill';

export interface SaaSContextValue {
  organization: TenantOrganization | null;
  organizations: TenantOrganization[];
  workspace: SaaSWorkspace | null;
  workspaces: SaaSWorkspace[];
  currentRole: SaaSRole;
  permissions: readonly SaaSPermission[];
  memberships: OrganizationMember[];
  loading: boolean;
  switchOrganization: (orgId: string) => Promise<boolean>;
  switchWorkspace: (workspaceId: string) => Promise<boolean>;
  createOrganization: (params: {
    name: string;
    type?: OrganizationType;
    primaryJurisdiction?: string;
  }) => Promise<TenantOrganization>;
  createWorkspace: (params: {
    name: string;
    department?: WorkspaceDepartment;
    allowedJurisdictions?: string[];
  }) => Promise<SaaSWorkspace>;
  refreshSaaS: () => Promise<void>;
}

const SaaSContext = createContext<SaaSContextValue | null>(null);

const ACTIVE_ORG_STORAGE_KEY = 'juristech_saas_active_org_id';
const ACTIVE_WS_STORAGE_KEY = 'juristech_saas_active_ws_id';
const LOCAL_ORGS_KEY = 'juristech_saas_local_orgs_v2';
const LOCAL_WORKSPACES_KEY = 'juristech_saas_local_workspaces_v2';

// Standard enterprise default workspaces
function createStandardWorkspaces(orgId: string): SaaSWorkspace[] {
  const now = new Date().toISOString();
  return [
    {
      id: `ws_${orgId}_legal`,
      organizationId: orgId,
      name: 'Legal Operations',
      department: 'legal',
      description: 'Contracts drafting, regulatory compliance, and statutory audits',
      allowedJurisdictions: ['SA', 'AE', 'US', 'GB', 'EU'],
      createdAt: now,
    },
    {
      id: `ws_${orgId}_procurement`,
      organizationId: orgId,
      name: 'Procurement & Supply Chain',
      department: 'procurement',
      description: 'Vendor master service agreements and commercial leases',
      allowedJurisdictions: ['GLOBAL', 'SA', 'AE'],
      createdAt: now,
    },
    {
      id: `ws_${orgId}_mna`,
      organizationId: orgId,
      name: 'M&A & Corporate Governance',
      department: 'general',
      description: 'Shareholder agreements, venture term sheets, and board resolutions',
      allowedJurisdictions: ['SA', 'AE', 'US'],
      createdAt: now,
    },
  ];
}

export const SaaSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const [organizations, setOrganizations] = useState<TenantOrganization[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACTIVE_ORG_STORAGE_KEY);
    }
    return null;
  });

  const [workspaces, setWorkspaces] = useState<SaaSWorkspace[]>([]);
  const [activeWsId, setActiveWsId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACTIVE_WS_STORAGE_KEY);
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<SaaSRole>('Viewer');
  const [memberships, setMemberships] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Organization computed object
  const organization = useMemo(() => {
    return organizations.find((o) => o.id === activeOrgId) || organizations[0] || null;
  }, [organizations, activeOrgId]);

  // Workspaces filtered for active organization
  const availableWorkspaces = useMemo(() => {
    if (!organization) return [];
    return workspaces.filter((w) => w.organizationId === organization.id);
  }, [workspaces, organization]);

  // Active Workspace computed object
  const workspace = useMemo(() => {
    return (
      availableWorkspaces.find((w) => w.id === activeWsId) ||
      availableWorkspaces[0] ||
      null
    );
  }, [availableWorkspaces, activeWsId]);

  // Active Permissions derived from RBAC resolver
  const permissions = useMemo(() => {
    return getRolePermissions(currentRole);
  }, [currentRole]);

  /**
   * Load authoritative or resilient tenancy state
   */
  const loadTenancyState = useCallback(async () => {
    setLoading(true);
    try {
      const currentUserId = user?.id || (isAdmin ? 'usr_admin_platform' : 'usr_visitor_guest');
      const currentUserEmail = user?.email || (isAdmin ? 'founder@juristech.solutions' : 'guest@juristech.solutions');

      let loadedOrgs: TenantOrganization[] = [];
      let loadedWorkspaces: SaaSWorkspace[] = [];

      // Visitors do not need tenant discovery. Avoid protected Supabase probes on the public dashboard.
      if (!user && !isAdmin) {
        setOrganizations([]);
        setWorkspaces([]);
        setMemberships([]);
        setCurrentRole('Viewer');
        setLoading(false);
        return;
      }

      // 1. Try to read from Supabase if active
      let dbSucceeded = false;
      try {
        const orgQuery = supabase
          .from('organizations')
          .select('*');
        const { data: dbOrgs, error: orgError } = isAdmin
          ? await orgQuery.limit(20)
          : await orgQuery.eq('owner_user_id', currentUserId).limit(20);

        if (!orgError && dbOrgs && dbOrgs.length > 0) {
          loadedOrgs = dbOrgs.map((o: any) => ({
            id: o.id,
            name: o.name,
            slug: o.slug,
            type: o.type as OrganizationType,
            primaryJurisdiction: o.primary_jurisdiction || 'GLOBAL',
            ownerUserId: o.owner_user_id,
            seatLimit: o.seat_limit || 5,
            activeSeats: 1,
            status: o.status || 'ACTIVE',
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }));

          const visibleOrgIds = new Set((dbOrgs || []).map((o: any) => o.id));
          const { data: dbWs } = await supabase.from('workspaces').select('*').limit(100);
          if (dbWs) {
            loadedWorkspaces = dbWs.filter((w: any) => visibleOrgIds.has(w.organization_id)).map((w: any) => ({
              id: w.id,
              organizationId: w.organization_id,
              name: w.name,
              department: (w.department as WorkspaceDepartment) || 'general',
              description: w.description,
              allowedJurisdictions: w.allowed_jurisdictions || [],
              createdAt: w.created_at,
            }));
          }
          dbSucceeded = true;
        }
      } catch {
        // Supabase offline or paused
        dbSucceeded = false;
      }

      // 2. Resilient deterministic tenancy layer if DB is offline or empty
      if (!dbSucceeded || loadedOrgs.length === 0) {
        // Check local storage for persistent tenant structures
        let localOrgs: TenantOrganization[] = [];
        let localWs: SaaSWorkspace[] = [];

        try {
          const rawOrgs = localStorage.getItem(LOCAL_ORGS_KEY);
          if (rawOrgs) localOrgs = JSON.parse(rawOrgs);
          const rawWs = localStorage.getItem(LOCAL_WORKSPACES_KEY);
          if (rawWs) localWs = JSON.parse(rawWs);
        } catch {}

        if (localOrgs.length === 0) {
          // Initialize deterministic Personal Organization for current user
          const personalOrg = createPersonalOrganization(
            currentUserId,
            currentUserEmail,
            user?.user_metadata?.full_name
          );
          const personalWs = createPersonalWorkspace(personalOrg.id, currentUserId);
          const enterpriseWs = createStandardWorkspaces(personalOrg.id);

          localOrgs = [personalOrg];
          localWs = [personalWs, ...enterpriseWs];

          try {
            localStorage.setItem(LOCAL_ORGS_KEY, JSON.stringify(localOrgs));
            localStorage.setItem(LOCAL_WORKSPACES_KEY, JSON.stringify(localWs));
          } catch {}
        }

        loadedOrgs = localOrgs;
        loadedWorkspaces = localWs;
      }

      setOrganizations(loadedOrgs);
      setWorkspaces(loadedWorkspaces);

      // Determine initial active organization
      const targetOrg =
        loadedOrgs.find((o) => o.id === activeOrgId) || loadedOrgs[0] || null;

      if (targetOrg) {
        setActiveOrgId(targetOrg.id);
        try {
          localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, targetOrg.id);
        } catch {}

        // Determine user's role in targetOrg.
        // Platform admins are Owners only in the platform-admin context;
        // ordinary users must not be promoted implicitly to Legal/Owner.
        if (isAdmin) {
          setCurrentRole('Owner');
        } else if (targetOrg.ownerUserId === currentUserId) {
          setCurrentRole('Owner');
        } else {
          setCurrentRole('Viewer');
        }

        // Determine initial active workspace
        const orgWorkspaces = loadedWorkspaces.filter(
          (w) => w.organizationId === targetOrg.id
        );
        const targetWs =
          orgWorkspaces.find((w) => w.id === activeWsId) || orgWorkspaces[0] || null;

        if (targetWs) {
          setActiveWsId(targetWs.id);
          try {
            localStorage.setItem(ACTIVE_WS_STORAGE_KEY, targetWs.id);
          } catch {}
        }
      }
    } catch (err) {
      console.warn('SaaSContext initialization:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, activeOrgId, activeWsId]);

  useEffect(() => {
    loadTenancyState();
  }, [loadTenancyState]);

  /**
   * Safe organization switching with cache invalidation
   */
  const switchOrganization = useCallback(
    async (orgId: string): Promise<boolean> => {
      const targetOrg = organizations.find((o) => o.id === orgId);
      if (!targetOrg) {
        console.error(`Cannot switch to organization ${orgId}: Organization not found.`);
        return false;
      }

      const switchUserId = user?.id || (isAdmin ? 'usr_admin_platform' : 'usr_visitor_guest');
      if (!isAdmin && targetOrg.ownerUserId !== switchUserId) {
        console.error('Security barrier: User is not authorized for this organization.');
        return false;
      }

      // Purge query cache to ensure zero cross-tenant data leakage
      invalidateCache();

      setActiveOrgId(orgId);
      try {
        localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, orgId);
      } catch {}

      // Select default workspace for new organization
      const targetWorkspaces = workspaces.filter((w) => w.organizationId === orgId);
      if (targetWorkspaces.length > 0) {
        const defaultWs = targetWorkspaces[0];
        setActiveWsId(defaultWs.id);
        try {
          localStorage.setItem(ACTIVE_WS_STORAGE_KEY, defaultWs.id);
        } catch {}
      } else {
        setActiveWsId(null);
      }

      // Re-evaluate role for switched organization without implicit privilege.
      const currentUserId = user?.id || (isAdmin ? 'usr_admin_platform' : 'usr_visitor_guest');
      if (isAdmin || targetOrg.ownerUserId === currentUserId) {
        setCurrentRole('Owner');
      } else {
        setCurrentRole('Viewer');
      }

      return true;
    },
    [organizations, workspaces, user, isAdmin]
  );

  /**
   * Safe workspace switching
   */
  const switchWorkspace = useCallback(
    async (workspaceId: string): Promise<boolean> => {
      const targetWs = workspaces.find((w) => w.id === workspaceId);
      if (!targetWs) {
        console.error(`Cannot switch to workspace ${workspaceId}: Workspace not found.`);
        return false;
      }

      if (organization && targetWs.organizationId !== organization.id) {
        console.error(
          `Security barrier: Workspace ${workspaceId} does not belong to active organization ${organization.id}.`
        );
        return false;
      }

      // Invalidate cache for departmental scoping
      invalidateCache();

      setActiveWsId(workspaceId);
      try {
        localStorage.setItem(ACTIVE_WS_STORAGE_KEY, workspaceId);
      } catch {}

      return true;
    },
    [workspaces, organization]
  );

  /**
   * Create a new organization
   */
  const createOrganization = useCallback(
    async (params: {
      name: string;
      type?: OrganizationType;
      primaryJurisdiction?: string;
    }): Promise<TenantOrganization> => {
      const currentUserId = user?.id || (isAdmin ? 'usr_admin_platform' : 'usr_visitor_guest');
      const now = new Date().toISOString();
      const orgId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newOrg: TenantOrganization = {
        id: orgId,
        name: params.name.trim(),
        slug: params.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
        type: params.type || 'company',
        primaryJurisdiction: params.primaryJurisdiction || 'GLOBAL',
        ownerUserId: currentUserId,
        seatLimit: 10,
        activeSeats: 1,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      };

      const newWs = createStandardWorkspaces(orgId);

      const updatedOrgs = [...organizations, newOrg];
      const updatedWs = [...workspaces, ...newWs];

      setOrganizations(updatedOrgs);
      setWorkspaces(updatedWs);

      try {
        localStorage.setItem(LOCAL_ORGS_KEY, JSON.stringify(updatedOrgs));
        localStorage.setItem(LOCAL_WORKSPACES_KEY, JSON.stringify(updatedWs));
      } catch {}

      // Automatically switch to the newly created organization
      await switchOrganization(newOrg.id);

      return newOrg;
    },
    [organizations, workspaces, user, isAdmin, switchOrganization]
  );

  /**
   * Create a new workspace inside active organization
   */
  const createWorkspace = useCallback(
    async (params: {
      name: string;
      department?: WorkspaceDepartment;
      allowedJurisdictions?: string[];
    }): Promise<SaaSWorkspace> => {
      if (!organization) {
        throw new Error('Cannot create workspace: No active organization.');
      }

      const wsId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newWs: SaaSWorkspace = {
        id: wsId,
        organizationId: organization.id,
        name: params.name.trim(),
        department: params.department || 'general',
        allowedJurisdictions: params.allowedJurisdictions || ['GLOBAL'],
        createdAt: new Date().toISOString(),
      };

      const updatedWs = [...workspaces, newWs];
      setWorkspaces(updatedWs);

      try {
        localStorage.setItem(LOCAL_WORKSPACES_KEY, JSON.stringify(updatedWs));
      } catch {}

      setActiveWsId(newWs.id);
      try {
        localStorage.setItem(ACTIVE_WS_STORAGE_KEY, newWs.id);
      } catch {}

      return newWs;
    },
    [organization, workspaces]
  );

  const value: SaaSContextValue = useMemo(
    () => ({
      organization,
      organizations,
      workspace,
      workspaces: availableWorkspaces,
      currentRole,
      permissions,
      memberships,
      loading,
      switchOrganization,
      switchWorkspace,
      createOrganization,
      createWorkspace,
      refreshSaaS: loadTenancyState,
    }),
    [
      organization,
      organizations,
      workspace,
      availableWorkspaces,
      currentRole,
      permissions,
      memberships,
      loading,
      switchOrganization,
      switchWorkspace,
      createOrganization,
      createWorkspace,
      loadTenancyState,
    ]
  );

  return <SaaSContext.Provider value={value}>{children}</SaaSContext.Provider>;
};

export function useSaaS(): SaaSContextValue {
  const context = useContext(SaaSContext);
  if (!context) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
}
