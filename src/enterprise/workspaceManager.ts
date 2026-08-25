/**
 * src/enterprise/workspaceManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Workspace & Role-Based Access Control (RBAC)
 * Specification: Task 12.2
 *
 * Manages institutional departments, workspace segregation, and role permissions.
 * Workspaces: Legal, Compliance, Procurement, Finance, HR
 * Roles: owner, admin, legal_counsel, compliance_officer, reviewer, member, viewer
 * Permissions: VIEW, CREATE, ANALYZE, APPROVE, EXPORT, ADMIN
 */

export type WorkspaceDepartment =
  | 'legal'
  | 'compliance'
  | 'procurement'
  | 'finance'
  | 'hr';

export type EnterpriseRole =
  | 'owner'
  | 'admin'
  | 'legal_counsel'
  | 'compliance_officer'
  | 'reviewer'
  | 'member'
  | 'viewer';

export type EnterprisePermission =
  | 'VIEW'
  | 'CREATE'
  | 'ANALYZE'
  | 'APPROVE'
  | 'EXPORT'
  | 'ADMIN';

export interface EnterpriseWorkspace {
  id: string;
  organizationId: string;
  name: string;
  department: WorkspaceDepartment;
  description: string;
  createdAt: string;
  memberCount: number;
  allowedJurisdictions: string[];
}

export interface WorkspaceMember {
  id: string;
  organizationId: string;
  workspaceId: string;
  email: string;
  name: string;
  role: EnterpriseRole;
  joinedAt: string;
  status: 'ACTIVE' | 'INVITED' | 'DEACTIVATED';
}

const ROLE_PERMISSIONS_MAP: Record<EnterpriseRole, EnterprisePermission[]> = {
  owner: ['VIEW', 'CREATE', 'ANALYZE', 'APPROVE', 'EXPORT', 'ADMIN'],
  admin: ['VIEW', 'CREATE', 'ANALYZE', 'APPROVE', 'EXPORT', 'ADMIN'],
  legal_counsel: ['VIEW', 'CREATE', 'ANALYZE', 'APPROVE', 'EXPORT'],
  compliance_officer: ['VIEW', 'CREATE', 'ANALYZE', 'APPROVE', 'EXPORT'],
  reviewer: ['VIEW', 'ANALYZE', 'APPROVE'],
  member: ['VIEW', 'CREATE', 'ANALYZE'],
  viewer: ['VIEW'],
};

class WorkspaceManager {
  private static instance: WorkspaceManager;
  private workspaces: Map<string, EnterpriseWorkspace> = new Map();
  private members: Map<string, WorkspaceMember> = new Map();

  private constructor() {
    this.seedDefaultWorkspaces();
  }

  public static getInstance(): WorkspaceManager {
    if (!WorkspaceManager.instance) {
      WorkspaceManager.instance = new WorkspaceManager();
    }
    return WorkspaceManager.instance;
  }

  private seedDefaultWorkspaces(): void {
    const demoWorkspaces: EnterpriseWorkspace[] = [
      {
        id: 'ws_legal_corp_01',
        organizationId: 'org_enterprise_demo_01',
        name: 'Corporate & M&A Legal Group',
        department: 'legal',
        description: 'Cross-border M&A transactions, corporate formation and restructuring',
        createdAt: '2026-01-15T08:30:00.000Z',
        memberCount: 8,
        allowedJurisdictions: ['SA', 'AE', 'GB', 'US'],
      },
      {
        id: 'ws_compliance_01',
        organizationId: 'org_enterprise_demo_01',
        name: 'Regulatory & Data Privacy Desk',
        department: 'compliance',
        description: 'PDPL, GDPR, and ZATCA Phase 2 compliance auditing',
        createdAt: '2026-01-15T08:45:00.000Z',
        memberCount: 4,
        allowedJurisdictions: ['SA', 'EU'],
      },
      {
        id: 'ws_procurement_02',
        organizationId: 'org_enterprise_demo_02',
        name: 'Global Vendor & Procurement Contracts',
        department: 'procurement',
        description: 'Vendor master agreements and supply chain liability screening',
        createdAt: '2026-02-01T11:00:00.000Z',
        memberCount: 15,
        allowedJurisdictions: ['SA', 'KW', 'QA', 'OM'],
      },
    ];

    for (const ws of demoWorkspaces) {
      this.workspaces.set(ws.id, ws);
    }

    const demoMembers: WorkspaceMember[] = [
      {
        id: 'mem_01',
        organizationId: 'org_enterprise_demo_01',
        workspaceId: 'ws_legal_corp_01',
        email: 'counsel.lead@altamimi-demo.com',
        name: 'Tariq Al-Mansoor',
        role: 'owner',
        joinedAt: '2026-01-15T09:00:00.000Z',
        status: 'ACTIVE',
      },
      {
        id: 'mem_02',
        organizationId: 'org_enterprise_demo_01',
        workspaceId: 'ws_compliance_01',
        email: 'dpo.officer@altamimi-demo.com',
        name: 'Sarah Al-Ghamdi',
        role: 'compliance_officer',
        joinedAt: '2026-01-16T10:00:00.000Z',
        status: 'ACTIVE',
      },
      {
        id: 'mem_03',
        organizationId: 'org_enterprise_demo_02',
        workspaceId: 'ws_procurement_02',
        email: 'procurement.head@aramco-demo.com',
        name: 'Fahad Al-Otaibi',
        role: 'admin',
        joinedAt: '2026-02-01T11:30:00.000Z',
        status: 'ACTIVE',
      },
    ];

    for (const m of demoMembers) {
      this.members.set(m.id, m);
    }
  }

  /**
   * Create a new departmental workspace
   */
  public createWorkspace(params: {
    organizationId: string;
    name: string;
    department: WorkspaceDepartment;
    description?: string;
    allowedJurisdictions?: string[];
  }): EnterpriseWorkspace {
    const wsId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const workspace: EnterpriseWorkspace = {
      id: wsId,
      organizationId: params.organizationId,
      name: params.name.trim(),
      department: params.department,
      description: params.description?.trim() || '',
      createdAt: new Date().toISOString(),
      memberCount: 0,
      allowedJurisdictions: params.allowedJurisdictions || ['SA'],
    };

    this.workspaces.set(wsId, workspace);
    return workspace;
  }

  /**
   * Add a member with designated role
   */
  public addMember(params: {
    organizationId: string;
    workspaceId: string;
    email: string;
    name: string;
    role: EnterpriseRole;
  }): WorkspaceMember {
    const memberId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const member: WorkspaceMember = {
      id: memberId,
      organizationId: params.organizationId,
      workspaceId: params.workspaceId,
      email: params.email.trim().toLowerCase(),
      name: params.name.trim(),
      role: params.role,
      joinedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };

    this.members.set(memberId, member);

    // Update workspace member count
    const ws = this.workspaces.get(params.workspaceId);
    if (ws) {
      ws.memberCount += 1;
      this.workspaces.set(ws.id, ws);
    }

    return member;
  }

  /**
   * Check if a role possesses a specific permission
   */
  public hasPermission(role: EnterpriseRole, permission: EnterprisePermission): boolean {
    const allowed = ROLE_PERMISSIONS_MAP[role] || [];
    return allowed.includes(permission);
  }

  /**
   * Check if a member can execute an action
   */
  public canMemberExecute(memberId: string, permission: EnterprisePermission): boolean {
    const member = this.members.get(memberId);
    if (!member || member.status !== 'ACTIVE') return false;
    return this.hasPermission(member.role, permission);
  }

  /**
   * List workspaces by organization
   */
  public listWorkspacesByOrg(orgId: string): EnterpriseWorkspace[] {
    return Array.from(this.workspaces.values()).filter(ws => ws.organizationId === orgId);
  }

  /**
   * List members by workspace
   */
  public listMembersByWorkspace(workspaceId: string): WorkspaceMember[] {
    return Array.from(this.members.values()).filter(m => m.workspaceId === workspaceId);
  }

  public clear(): void {
    this.workspaces.clear();
    this.members.clear();
  }
}

export const workspaceManager = WorkspaceManager.getInstance();
