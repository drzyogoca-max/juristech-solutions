/**
 * src/singularity/disputeSimulationEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Global Autonomous Dispute Resolution Simulation Chamber
 * Specification: Task 18.4
 *
 * Simulates commercial dispute scenarios, mock arbitrations, settlement outcome probabilities,
 * and damage exposure brackets across institutional arbitration centers (SCCA, LCIA, ICC, DIAC, SIAC).
 *
 * STRICT ETHICAL RULE: AUTONOMOUS FINAL JUDGMENT STRICTLY PROHIBITED.
 * Simulations are probabilistic decision-support models for counsel and corporate leadership.
 */

export interface DisputeSimulationResult {
  simulationId: string;
  matterTitleEn: string;
  matterTitleAr: string;
  arbitralForum: 'SCCA_RIYADH' | 'DIFC_LCIA' | 'ICC_PARIS' | 'SIAC_SINGAPORE' | 'COMMERCIAL_COURT';
  claimantWinProbabilityPct: number;
  settlementProbabilityPct: number;
  respondentWinProbabilityPct: number;
  estimatedSettlementBracketUSD: { min: number; optimal: number; max: number };
  criticalRiskFactorsEn: string[];
  criticalRiskFactorsAr: string[];
  simulationDate: string;
  governanceComplianceStatus: 'PROBABILISTIC_SIMULATION_ONLY';
}

class DisputeSimulationEngine {
  private static instance: DisputeSimulationEngine;
  private simulations: Map<string, DisputeSimulationResult> = new Map();

  private constructor() {
    this.seedDefaultSimulations();
  }

  public static getInstance(): DisputeSimulationEngine {
    if (!DisputeSimulationEngine.instance) {
      DisputeSimulationEngine.instance = new DisputeSimulationEngine();
    }
    return DisputeSimulationEngine.instance;
  }

  private seedDefaultSimulations(): void {
    const list: DisputeSimulationResult[] = [
      {
        simulationId: 'sim_dispute_mega_project_01',
        matterTitleEn: 'EPC Delay & Liquidated Damages Penalty Assessment (Cross-GCC Infrastructure)',
        matterTitleAr: 'تقييم غرامات التأخير والتعويض الاتفاقي في عقود المقاولات والمشاريع الكبرى',
        arbitralForum: 'SCCA_RIYADH',
        claimantWinProbabilityPct: 28.4,
        settlementProbabilityPct: 62.1,
        respondentWinProbabilityPct: 9.5,
        estimatedSettlementBracketUSD: { min: 2500000, optimal: 3800000, max: 5000000 },
        criticalRiskFactorsEn: [
          'Concurrent delay evidence under SCL Protocol methodology.',
          'Saudi Civil Transactions Law Art. 174 judicial reduction of punitive liquidated damages.',
        ],
        criticalRiskFactorsAr: [
          'أدلة التأخير المتزامن وفق بروتوكول جمعية قانون الإنشاءات (SCL).',
          'سلطة المحكمة في إنقاص التعويض الاتفاقي المبالغ فيه بموجب المادة 174 من نظام المعاملات المدنية.',
        ],
        simulationDate: '2026-02-26T08:00:00.000Z',
        governanceComplianceStatus: 'PROBABILISTIC_SIMULATION_ONLY',
      },
      {
        simulationId: 'sim_dispute_software_license_02',
        matterTitleEn: 'SaaS Software License Breach & Cross-Border IP Infringement',
        matterTitleAr: 'الإخلال باتفاقية ترخيص البرمجيات السحابية والتعدي على الملكية الفكرية',
        arbitralForum: 'DIFC_LCIA',
        claimantWinProbabilityPct: 54.0,
        settlementProbabilityPct: 41.0,
        respondentWinProbabilityPct: 5.0,
        estimatedSettlementBracketUSD: { min: 600000, optimal: 850000, max: 1200000 },
        criticalRiskFactorsEn: [
          'Audit trail verification of excess seats usage.',
          'Limitation of liability exclusion for deliberate willful misconduct.',
        ],
        criticalRiskFactorsAr: [
          'سجلات التدقيق التشفيرية لإثبات تجاوز عدد التراخيص المسموحة.',
          'بطلان تحديد المسؤولية في حالات الخطأ العمدي والتقصير الجسيم.',
        ],
        simulationDate: '2026-02-26T08:00:00.000Z',
        governanceComplianceStatus: 'PROBABILISTIC_SIMULATION_ONLY',
      },
    ];

    for (const s of list) {
      this.simulations.set(s.simulationId, s);
    }
  }

  public runDisputeSimulation(params: {
    matterTitleEn: string;
    matterTitleAr: string;
    arbitralForum: DisputeSimulationResult['arbitralForum'];
    estimatedClaimUSD: number;
  }): DisputeSimulationResult {
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const optimal = Math.round(params.estimatedClaimUSD * 0.65);
    const result: DisputeSimulationResult = {
      simulationId,
      matterTitleEn: params.matterTitleEn,
      matterTitleAr: params.matterTitleAr,
      arbitralForum: params.arbitralForum,
      claimantWinProbabilityPct: 45.0,
      settlementProbabilityPct: 48.0,
      respondentWinProbabilityPct: 7.0,
      estimatedSettlementBracketUSD: {
        min: Math.round(optimal * 0.75),
        optimal,
        max: Math.round(optimal * 1.25),
      },
      criticalRiskFactorsEn: ['Statutory limitation periods', 'Judicial mitigation of contractual penalties'],
      criticalRiskFactorsAr: ['مدد التقادم النظامية', 'سلطة تعديل الشروط الجزائية التعاقدية'],
      simulationDate: new Date().toISOString(),
      governanceComplianceStatus: 'PROBABILISTIC_SIMULATION_ONLY',
    };
    this.simulations.set(simulationId, result);
    return result;
  }

  public listSimulations(): DisputeSimulationResult[] {
    return Array.from(this.simulations.values());
  }

  public clear(): void {
    this.simulations.clear();
  }
}

export const disputeSimulationEngine = DisputeSimulationEngine.getInstance();
