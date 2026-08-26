/**
 * src/cloud/enterpriseRoleHierarchy.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Tenant Role Hierarchy Engine
 * Specification: Task 17.3
 *
 * Implements a hierarchical enterprise RBAC model with granular delegation gates,
 * financial signing authority thresholds, and separation of legal duties.
 */

export type EnterpriseLegalRole =
  | 'GENERAL_COUNSEL'
  | 'SENIOR_COUNSEL'
  | 'LEGAL_OPS_LEAD'
  | 'STAFF_ATTORNEY'
  | 'COMPLIANCE_OFFICER'
  | 'ENTERPRISE_USER';

export interface RoleHierarchyNode {
  role: EnterpriseLegalRole;
  rankLevel: number; // 1 to 6
  titleEn: string;
  titleAr: string;
  maxSigningAuthorityUSD: number;
  canAuthorizeExternalDispatch: boolean;
  canManageSovereignVpc: boolean;
  canIssueAuditCertificates: boolean;
  canDelegateDuties: boolean;
}

class EnterpriseRoleHierarchyEngine {
  private static instance: EnterpriseRoleHierarchyEngine;
  private roleMatrix: Map<EnterpriseLegalRole, RoleHierarchyNode> = new Map();

  private constructor() {
    this.seedRoleMatrix();
  }

  public static getInstance(): EnterpriseRoleHierarchyEngine {
    if (!EnterpriseRoleHierarchyEngine.instance) {
      EnterpriseRoleHierarchyEngine.instance = new EnterpriseRoleHierarchyEngine();
    }
    return EnterpriseRoleHierarchyEngine.instance;
  }

  private seedRoleMatrix(): void {
    const list: RoleHierarchyNode[] = [
      {
        role: 'GENERAL_COUNSEL',
        rankLevel: 6,
        titleEn: 'General Counsel / Chief Legal Officer',
        titleAr: 'المستشار القانوني العام / رئيس الشؤون القانونية',
        maxSigningAuthorityUSD: 1000000000, // Unlimited
        canAuthorizeExternalDispatch: true,
        canManageSovereignVpc: true,
        canIssueAuditCertificates: true,
        canDelegateDuties: true,
      },
      {
        role: 'SENIOR_COUNSEL',
        rankLevel: 5,
        titleEn: 'Senior Legal Counsel / Partner',
        titleAr: 'مستشار قانوني أول / شريك قانوني',
        maxSigningAuthorityUSD: 1000000, // $1M USD
        canAuthorizeExternalDispatch: true,
        canManageSovereignVpc: false,
        canIssueAuditCertificates: true,
        canDelegateDuties: true,
      },
      {
        role: 'LEGAL_OPS_LEAD',
        rankLevel: 4,
        titleEn: 'Legal Operations Lead / Director',
        titleAr: 'مدير العمليات القانونية والتقنية',
        maxSigningAuthorityUSD: 250000, // $250k USD
        canAuthorizeExternalDispatch: true,
        canManageSovereignVpc: true,
        canIssueAuditCertificates: false,
        canDelegateDuties: false,
      },
      {
        role: 'STAFF_ATTORNEY',
        rankLevel: 3,
        titleEn: 'Staff Attorney / Legal Associate',
        titleAr: 'محامٍ ممارس / مستشار قانوني مشارك',
        maxSigningAuthorityUSD: 50000, // $50k USD
        canAuthorizeExternalDispatch: false,
        canManageSovereignVpc: false,
        canIssueAuditCertificates: false,
        canDelegateDuties: false,
      },
      {
        role: 'COMPLIANCE_OFFICER',
        rankLevel: 3,
        titleEn: 'Corporate Compliance Officer / DPO',
        titleAr: 'مسؤول الامتثال المؤسسي وحماية البيانات',
        maxSigningAuthorityUSD: 50000,
        canAuthorizeExternalDispatch: false,
        canManageSovereignVpc: false,
        canIssueAuditCertificates: true,
        canDelegateDuties: false,
      },
      {
        role: 'ENTERPRISE_USER',
        rankLevel: 1,
        titleEn: 'Enterprise Business User / Contract Requester',
        titleAr: 'مستخدم أعمال مؤسسي / طالب العقد',
        maxSigningAuthorityUSD: 0,
        canAuthorizeExternalDispatch: false,
        canManageSovereignVpc: false,
        canIssueAuditCertificates: false,
        canDelegateDuties: false,
      },
    ];

    for (const r of list) {
      this.roleMatrix.set(r.role, r);
    }
  }

  public getRoleNode(role: EnterpriseLegalRole): RoleHierarchyNode | undefined {
    return this.roleMatrix.get(role);
  }

  public listAllRoles(): RoleHierarchyNode[] {
    return Array.from(this.roleMatrix.values());
  }

  public verifySigningAuthority(role: EnterpriseLegalRole, matterValueUSD: number): boolean {
    const node = this.roleMatrix.get(role);
    if (!node) return false;
    return matterValueUSD <= node.maxSigningAuthorityUSD;
  }

  public clear(): void {
    this.roleMatrix.clear();
  }
}

export const enterpriseRoleHierarchyEngine = EnterpriseRoleHierarchyEngine.getInstance();
