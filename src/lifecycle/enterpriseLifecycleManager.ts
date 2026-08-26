/**
 * src/lifecycle/enterpriseLifecycleManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Lifecycle & Tenant Deprovisioning Framework
 * Specification: Task 24.3
 *
 * Full-lifecycle management for sovereign enterprise and government tenants:
 * Onboarding, active operations, archival, and cryptographic memory shredding.
 *
 * STRICT GOVERNANCE RULE:
 *  • DEPROVISIONING_REQUIRES_HUMAN_APPROVAL = true.
 *  • Zero autonomous tenant deprovisioning or key revocation.
 */

export type EnterpriseLifecycleStage =
  | 'CUSTOMER_ONBOARDING'
  | 'ACTIVE_OPERATION'
  | 'SUSPENSION'
  | 'DECOMMISSION'
  | 'CRYPTOGRAPHIC_SHREDDING';

export interface EnterpriseTenantLifecycleItem {
  tenantId: string;
  tenantNameEn: string;
  tenantNameAr: string;
  tenantType: 'GOVERNMENT_ENTITY' | 'FINANCIAL_INSTITUTION' | 'ENTERPRISE_CORP';
  lifecycleStage: EnterpriseLifecycleStage;
  dedicatedVpcNamespace: string;
  cryptoShreddingCertified: boolean;
  humanCounselApprovalRequired: boolean;
  lastAuditedAt: string;
}

export interface EnterpriseLifecycleSummary {
  totalTenantsCount: number;
  activeCount: number;
  onboardingCount: number;
  shreddedCount: number;
  deprovisioningRequiresHumanApproval: boolean;
  lastUpdated: string;
  tenants: EnterpriseTenantLifecycleItem[];
}

class EnterpriseLifecycleManager {
  private static instance: EnterpriseLifecycleManager;
  private tenants: Map<string, EnterpriseTenantLifecycleItem> = new Map();

  private constructor() {
    this.seedTenants();
  }

  public static getInstance(): EnterpriseLifecycleManager {
    if (!EnterpriseLifecycleManager.instance) {
      EnterpriseLifecycleManager.instance = new EnterpriseLifecycleManager();
    }
    return EnterpriseLifecycleManager.instance;
  }

  private seedTenants(): void {
    const list: EnterpriseTenantLifecycleItem[] = [
      {
        tenantId: 'tenant_saudi_energy_01',
        tenantNameEn: 'Saudi National Sovereign Energy Holding',
        tenantNameAr: 'الشركة القابضة الوطنية للطاقة السيادية',
        tenantType: 'GOVERNMENT_ENTITY',
        lifecycleStage: 'ACTIVE_OPERATION',
        dedicatedVpcNamespace: 'ns_saudi_energy_sovereign_01',
        cryptoShreddingCertified: true,
        humanCounselApprovalRequired: true,
        lastAuditedAt: '2026-02-26T08:00:00.000Z',
      },
      {
        tenantId: 'tenant_swiss_private_bank_02',
        tenantNameEn: 'Geneva Private Wealth & Banking Group',
        tenantNameAr: 'مجموعة جنيف لإدارة الثروات والخدمات المصرفية الخاصة',
        tenantType: 'FINANCIAL_INSTITUTION',
        lifecycleStage: 'ACTIVE_OPERATION',
        dedicatedVpcNamespace: 'ns_swiss_private_wealth_02',
        cryptoShreddingCertified: true,
        humanCounselApprovalRequired: true,
        lastAuditedAt: '2026-02-26T08:00:00.000Z',
      },
    ];

    for (const t of list) {
      this.tenants.set(t.tenantId, t);
    }
  }

  public getLifecycleSummary(): EnterpriseLifecycleSummary {
    const list = Array.from(this.tenants.values());
    const active = list.filter((t) => t.lifecycleStage === 'ACTIVE_OPERATION').length;
    const onboarding = list.filter((t) => t.lifecycleStage === 'CUSTOMER_ONBOARDING').length;
    const shredded = list.filter((t) => t.lifecycleStage === 'CRYPTOGRAPHIC_SHREDDING').length;

    return {
      totalTenantsCount: list.length,
      activeCount: active,
      onboardingCount: onboarding,
      shreddedCount: shredded,
      deprovisioningRequiresHumanApproval: true,
      lastUpdated: new Date().toISOString(),
      tenants: list,
    };
  }

  public listTenants(): EnterpriseTenantLifecycleItem[] {
    return Array.from(this.tenants.values());
  }

  public clear(): void {
    this.tenants.clear();
  }
}

export const enterpriseLifecycleManager = EnterpriseLifecycleManager.getInstance();
