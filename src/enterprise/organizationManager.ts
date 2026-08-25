/**
 * src/enterprise/organizationManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Multi-Tenant Organization Manager
 * Specification: Task 12.1
 *
 * Manages institutional customer accounts (Companies, Law Firms, Legal Departments, Enterprise Groups).
 * STRICT RULES:
 *  • Zero legal document / contract text storage
 *  • Zero modifications to financial / payment systems
 *  • Isolated multi-tenant organization boundary
 */

export type OrganizationType =
  | 'company'
  | 'law_firm'
  | 'legal_department'
  | 'enterprise_group';

export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';

export interface EnterpriseOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  industry: string;
  country: string;
  ownerId: string;
  createdAt: string;
  status: OrganizationStatus;
  seatLimit: number;
  activeSeats: number;
  primaryJurisdiction: string;
  customDomain?: string;
}

class OrganizationManager {
  private static instance: OrganizationManager;
  private organizations: Map<string, EnterpriseOrganization> = new Map();

  private constructor() {
    // Seed default baseline enterprise structure for immediate institutional readiness
    this.seedDefaultOrganizations();
  }

  public static getInstance(): OrganizationManager {
    if (!OrganizationManager.instance) {
      OrganizationManager.instance = new OrganizationManager();
    }
    return OrganizationManager.instance;
  }

  private seedDefaultOrganizations(): void {
    const demoOrgs: EnterpriseOrganization[] = [
      {
        id: 'org_enterprise_demo_01',
        name: 'Al-Tamimi & Partners Legal Group',
        type: 'law_firm',
        industry: 'Legal Services & Arbitration',
        country: 'SA',
        ownerId: 'usr_owner_lawyer_01',
        createdAt: '2026-01-15T08:00:00.000Z',
        status: 'ACTIVE',
        seatLimit: 50,
        activeSeats: 18,
        primaryJurisdiction: 'SA',
      },
      {
        id: 'org_enterprise_demo_02',
        name: 'Aramco Gulf Holdings Legal Dept',
        type: 'legal_department',
        industry: 'Energy & Infrastructure',
        country: 'SA',
        ownerId: 'usr_owner_corporate_02',
        createdAt: '2026-02-01T10:30:00.000Z',
        status: 'ACTIVE',
        seatLimit: 100,
        activeSeats: 42,
        primaryJurisdiction: 'SA',
      },
      {
        id: 'org_enterprise_demo_03',
        name: 'Emirates Tech Ventures Legal Counsel',
        type: 'company',
        industry: 'Venture Capital & Fintech',
        country: 'AE',
        ownerId: 'usr_owner_fintech_03',
        createdAt: '2026-02-20T12:00:00.000Z',
        status: 'ACTIVE',
        seatLimit: 25,
        activeSeats: 12,
        primaryJurisdiction: 'AE',
      },
    ];

    for (const org of demoOrgs) {
      this.organizations.set(org.id, org);
    }
  }

  /**
   * Register a new Enterprise Organization
   */
  public createOrganization(params: {
    name: string;
    type: OrganizationType;
    industry: string;
    country: string;
    ownerId: string;
    seatLimit?: number;
    primaryJurisdiction?: string;
  }): EnterpriseOrganization {
    const orgId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newOrg: EnterpriseOrganization = {
      id: orgId,
      name: params.name.trim(),
      type: params.type,
      industry: params.industry.trim(),
      country: params.country,
      ownerId: params.ownerId,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      seatLimit: params.seatLimit || 10,
      activeSeats: 1,
      primaryJurisdiction: params.primaryJurisdiction || params.country,
    };

    this.organizations.set(orgId, newOrg);
    return newOrg;
  }

  /**
   * Get organization by ID
   */
  public getOrganization(id: string): EnterpriseOrganization | null {
    return this.organizations.get(id) || null;
  }

  /**
   * List all registered organizations
   */
  public listOrganizations(): EnterpriseOrganization[] {
    return Array.from(this.organizations.values());
  }

  /**
   * Update organization status or seat limits
   */
  public updateOrganization(
    id: string,
    updates: Partial<Omit<EnterpriseOrganization, 'id' | 'createdAt' | 'ownerId'>>
  ): EnterpriseOrganization | null {
    const org = this.organizations.get(id);
    if (!org) return null;

    const updated: EnterpriseOrganization = {
      ...org,
      ...updates,
    };

    this.organizations.set(id, updated);
    return updated;
  }

  /**
   * Verify organization existence and status
   */
  public isOrganizationActive(id: string): boolean {
    const org = this.organizations.get(id);
    return org ? org.status === 'ACTIVE' : false;
  }

  public clear(): void {
    this.organizations.clear();
  }
}

export const organizationManager = OrganizationManager.getInstance();
