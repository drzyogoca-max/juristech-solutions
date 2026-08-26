/**
 * src/strategic/enterpriseRiskForecasting.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Risk Forecasting
 * Specification: Task 25.2
 *
 * Systemic legal risk modeling, cross-border regulatory friction forecasting,
 * and early-warning indicators for enterprise legal operations.
 *
 * STRICT GOVERNANCE RULES:
 *  • SIMULATION_AND_FORECAST_ONLY = true.
 *  • Zero autonomous mutations or policy overrides.
 */

export type RiskVectorType =
  | 'REGULATORY_FRICTION_INDEX'
  | 'CROSS_BORDER_DISPUTE_PROBABILITY'
  | 'CONTRACTUAL_LIABILITY_EXPOSURE_TREND';

export interface EnterpriseRiskVector {
  vectorId: string;
  vectorType: RiskVectorType;
  titleEn: string;
  titleAr: string;
  forecastScore: number; // e.g. 12.4 (Low Friction) on 0-100 scale
  trendDirection: 'STABLE' | 'DECREASING' | 'INCREASING';
  earlyWarningTriggered: boolean;
  mitigationStrategyEn: string;
  mitigationStrategyAr: string;
  simulationHash: string;
  lastSimulatedAt: string;
}

export interface EnterpriseRiskForecastingSummary {
  overallSystemicRiskScore: number; // 0-100
  activeEarlyWarningsCount: number;
  simulationOnlyEnforced: boolean;
  riskVectors: EnterpriseRiskVector[];
  lastUpdated: string;
}

class EnterpriseRiskForecasting {
  private static instance: EnterpriseRiskForecasting;
  private vectors: Map<string, EnterpriseRiskVector> = new Map();

  private constructor() {
    this.seedRiskVectors();
  }

  public static getInstance(): EnterpriseRiskForecasting {
    if (!EnterpriseRiskForecasting.instance) {
      EnterpriseRiskForecasting.instance = new EnterpriseRiskForecasting();
    }
    return EnterpriseRiskForecasting.instance;
  }

  private seedRiskVectors(): void {
    const list: EnterpriseRiskVector[] = [
      {
        vectorId: 'risk_reg_friction_sa_eu',
        vectorType: 'REGULATORY_FRICTION_INDEX',
        titleEn: 'Saudi-EU Cross-Border Regulatory Friction Index',
        titleAr: 'مؤشر الاحتكاك التنظيمي لنقل البيانات بين السعودية والاتحاد الأوروبي',
        forecastScore: 11.8, // Low risk
        trendDirection: 'STABLE',
        earlyWarningTriggered: false,
        mitigationStrategyEn: 'Maintain zero-retention air-gapped sovereign execution for all bilateral transactions.',
        mitigationStrategyAr: 'الحفاظ على التنفيذ السيادي المعزول وانعدام التخزين لجميع المعاملات الثنائية.',
        simulationHash: 'risk_sim_hash_sha512_friction_01_99182736450192837465',
        lastSimulatedAt: '2026-02-26T08:00:00.000Z',
      },
      {
        vectorId: 'risk_dispute_prob_energy',
        vectorType: 'CROSS_BORDER_DISPUTE_PROBABILITY',
        titleEn: 'Cross-Border Arbitration & Dispute Exposure',
        titleAr: 'احتمالية النزاعات والتحكيم التجاري الدولي للقطاعات السيادية',
        forecastScore: 8.5,
        trendDirection: 'DECREASING',
        earlyWarningTriggered: false,
        mitigationStrategyEn: 'Utilize automated 8-axis contract risk scanning to eliminate silent liability gaps.',
        mitigationStrategyAr: 'استخدام فحص المخاطر التعاقدية ثماني المحاور لإغلاق الثغرات الصامتة.',
        simulationHash: 'risk_sim_hash_sha512_dispute_02_33491b827e10a99c8827',
        lastSimulatedAt: '2026-02-26T08:00:00.000Z',
      },
      {
        vectorId: 'risk_liability_trend',
        vectorType: 'CONTRACTUAL_LIABILITY_EXPOSURE_TREND',
        titleEn: 'Enterprise Liability Cap Compliance Trend',
        titleAr: 'مؤشر الالتزام بحدود المسؤولية التعاقدية المؤسسية',
        forecastScore: 6.2,
        trendDirection: 'DECREASING',
        earlyWarningTriggered: false,
        mitigationStrategyEn: 'Enforce statutory liability cap validations in all commercial templates.',
        mitigationStrategyAr: 'فرض التحقق النظامي من سقوف المسؤولية في كافة النماذج التجارية.',
        simulationHash: 'risk_sim_hash_sha512_liability_03_88921a837c19b02e9948',
        lastSimulatedAt: '2026-02-26T08:00:00.000Z',
      },
    ];

    for (const v of list) {
      this.vectors.set(v.vectorId, v);
    }
  }

  public getRiskForecastingSummary(): EnterpriseRiskForecastingSummary {
    const list = Array.from(this.vectors.values());
    const avgScore = list.length > 0
      ? list.reduce((acc, curr) => acc + curr.forecastScore, 0) / list.length
      : 10.0;
    const warnings = list.filter((v) => v.earlyWarningTriggered).length;

    return {
      overallSystemicRiskScore: Math.round(avgScore * 10) / 10,
      activeEarlyWarningsCount: warnings,
      simulationOnlyEnforced: true,
      riskVectors: list,
      lastUpdated: new Date().toISOString(),
    };
  }

  public listRiskVectors(): EnterpriseRiskVector[] {
    return Array.from(this.vectors.values());
  }

  public clear(): void {
    this.vectors.clear();
  }
}

export const enterpriseRiskForecasting = EnterpriseRiskForecasting.getInstance();
