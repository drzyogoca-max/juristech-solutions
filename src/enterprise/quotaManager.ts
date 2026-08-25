/**
 * src/enterprise/quotaManager.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — AI Usage Quotas & Enterprise Billing Intelligence
 * Specification: Task 12.3
 *
 * Tracks, meters, and projects institutional AI quota consumption across:
 *  • Monthly AI Queries
 *  • 8-Axis Contract Risk Audits
 *  • Statutory Compliance Scans
 *  • Structured Document Generations
 *
 * STRICT RULE ZERO: Zero modifications to Paddle, Stripe, or financial ledger tables.
 */

export type QuotaMetricType =
  | 'monthlyRequests'
  | 'contractAnalyses'
  | 'complianceScans'
  | 'documentsGenerated';

export interface AIQuota {
  organizationId: string;
  monthlyRequestsLimit: number;
  contractAnalysesLimit: number;
  complianceScansLimit: number;
  documentsGeneratedLimit: number;
  currentUsage: {
    monthlyRequests: number;
    contractAnalyses: number;
    complianceScans: number;
    documentsGenerated: number;
  };
  periodStart: string;
  periodEnd: string;
  isExceeded: boolean;
}

export interface QuotaCheckResult {
  allowed: boolean;
  metric: QuotaMetricType;
  current: number;
  limit: number;
  remaining: number;
  utilizationPercentage: number;
  reason?: string;
}

class QuotaManager {
  private static instance: QuotaManager;
  private quotas: Map<string, AIQuota> = new Map();

  private constructor() {
    this.seedDefaultQuotas();
  }

  public static getInstance(): QuotaManager {
    if (!QuotaManager.instance) {
      QuotaManager.instance = new QuotaManager();
    }
    return QuotaManager.instance;
  }

  private seedDefaultQuotas(): void {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const demoQuotas: AIQuota[] = [
      {
        organizationId: 'org_enterprise_demo_01',
        monthlyRequestsLimit: 10000,
        contractAnalysesLimit: 1000,
        complianceScansLimit: 500,
        documentsGeneratedLimit: 400,
        currentUsage: {
          monthlyRequests: 3420,
          contractAnalyses: 248,
          complianceScans: 94,
          documentsGenerated: 78,
        },
        periodStart,
        periodEnd,
        isExceeded: false,
      },
      {
        organizationId: 'org_enterprise_demo_02',
        monthlyRequestsLimit: 25000,
        contractAnalysesLimit: 3000,
        complianceScansLimit: 1500,
        documentsGeneratedLimit: 1200,
        currentUsage: {
          monthlyRequests: 11840,
          contractAnalyses: 940,
          complianceScans: 410,
          documentsGenerated: 320,
        },
        periodStart,
        periodEnd,
        isExceeded: false,
      },
      {
        organizationId: 'org_enterprise_demo_03',
        monthlyRequestsLimit: 5000,
        contractAnalysesLimit: 500,
        complianceScansLimit: 250,
        documentsGeneratedLimit: 200,
        currentUsage: {
          monthlyRequests: 1200,
          contractAnalyses: 90,
          complianceScans: 45,
          documentsGenerated: 30,
        },
        periodStart,
        periodEnd,
        isExceeded: false,
      },
    ];

    for (const q of demoQuotas) {
      this.quotas.set(q.organizationId, q);
    }
  }

  /**
   * Get quota details for an organization
   */
  public getQuota(organizationId: string): AIQuota {
    let quota = this.quotas.get(organizationId);
    if (!quota) {
      // Create standard baseline quota
      const now = new Date();
      quota = {
        organizationId,
        monthlyRequestsLimit: 2000,
        contractAnalysesLimit: 200,
        complianceScansLimit: 100,
        documentsGeneratedLimit: 80,
        currentUsage: {
          monthlyRequests: 0,
          contractAnalyses: 0,
          complianceScans: 0,
          documentsGenerated: 0,
        },
        periodStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        periodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
        isExceeded: false,
      };
      this.quotas.set(organizationId, quota);
    }
    return quota;
  }

  /**
   * Check if organization has remaining quota for a metric
   */
  public checkQuota(organizationId: string, metric: QuotaMetricType, amount = 1): QuotaCheckResult {
    const quota = this.getQuota(organizationId);
    const current = quota.currentUsage[metric] || 0;
    const limit = this.getMetricLimit(quota, metric);
    const remaining = Math.max(0, limit - current);
    const allowed = (current + amount) <= limit;
    const utilizationPercentage = limit > 0 ? Number(((current / limit) * 100).toFixed(1)) : 0;

    return {
      allowed,
      metric,
      current,
      limit,
      remaining,
      utilizationPercentage,
      reason: allowed ? undefined : `Organization AI quota for '${metric}' exceeded (${current}/${limit}). Upgrade enterprise plan.`,
    };
  }

  /**
   * Consume quota upon successful AI operation
   */
  public consumeQuota(organizationId: string, metric: QuotaMetricType, amount = 1): QuotaCheckResult {
    const check = this.checkQuota(organizationId, metric, amount);
    if (!check.allowed) return check;

    const quota = this.getQuota(organizationId);
    quota.currentUsage[metric] += amount;
    
    // Check if total monthly requests exceed limit
    if (quota.currentUsage.monthlyRequests >= quota.monthlyRequestsLimit) {
      quota.isExceeded = true;
    }

    this.quotas.set(organizationId, quota);

    const updatedCurrent = quota.currentUsage[metric];
    const updatedLimit = this.getMetricLimit(quota, metric);

    return {
      allowed: true,
      metric,
      current: updatedCurrent,
      limit: updatedLimit,
      remaining: Math.max(0, updatedLimit - updatedCurrent),
      utilizationPercentage: Number(((updatedCurrent / updatedLimit) * 100).toFixed(1)),
    };
  }

  private getMetricLimit(quota: AIQuota, metric: QuotaMetricType): number {
    switch (metric) {
      case 'monthlyRequests':
        return quota.monthlyRequestsLimit;
      case 'contractAnalyses':
        return quota.contractAnalysesLimit;
      case 'complianceScans':
        return quota.complianceScansLimit;
      case 'documentsGenerated':
        return quota.documentsGeneratedLimit;
    }
  }

  public clear(): void {
    this.quotas.clear();
  }
}

export const quotaManager = QuotaManager.getInstance();
