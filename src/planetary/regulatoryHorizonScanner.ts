/**
 * src/planetary/regulatoryHorizonScanner.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Planetary Regulatory Real-Time Horizon Scanner
 * Specification: Task 20.2
 *
 * Scans forthcoming statutory drafts, parliamentary proposals, and global regulatory trends
 * (Saudi Vision 2030 legal reforms, EU digital omnibus amendments, NIST AI updates)
 * to provide institutional early-warning foresight and continuous drift remediation.
 *
 * STRICT GOVERNANCE RULE:
 *  • Predictions and horizon shifts are advisory analytical forecasts only.
 *  • Horizon scanning does NOT constitute official statutory enactment.
 */

export interface RegulatoryHorizonTrend {
  trendId: string;
  topicTitleEn: string;
  topicTitleAr: string;
  primaryJurisdiction: string;
  enactmentProbabilityPct: number;
  expectedHorizonTimelineMonths: number;
  enterpriseImpactSeverity: 'CRITICAL_HIGH' | 'MODERATE' | 'INFORMATIONAL';
  advisoryRemediationEn: string;
  advisoryRemediationAr: string;
  forecastStatus: 'HORIZON_MONITORING_ACTIVE' | 'STATUTE_ENACTED' | 'PROPOSAL_ARCHIVED';
  lastScannedAt: string;
}

class RegulatoryHorizonScanner {
  private static instance: RegulatoryHorizonScanner;
  private trends: Map<string, RegulatoryHorizonTrend> = new Map();

  private constructor() {
    this.seedDefaultTrends();
  }

  public static getInstance(): RegulatoryHorizonScanner {
    if (!RegulatoryHorizonScanner.instance) {
      RegulatoryHorizonScanner.instance = new RegulatoryHorizonScanner();
    }
    return RegulatoryHorizonScanner.instance;
  }

  private seedDefaultTrends(): void {
    const list: RegulatoryHorizonTrend[] = [
      {
        trendId: 'horizon_sa_commercial_arbitration_update',
        topicTitleEn: 'Saudi Advanced Digital & AI Commercial Arbitration Regulations',
        topicTitleAr: 'تنظيمات التحكيم التجاري الرقمي وتقنيات الذكاء الاصطناعي في المملكة',
        primaryJurisdiction: 'Kingdom of Saudi Arabia (SCCA & Ministry of Justice)',
        enactmentProbabilityPct: 92.4,
        expectedHorizonTimelineMonths: 6,
        enterpriseImpactSeverity: 'CRITICAL_HIGH',
        advisoryRemediationEn: 'Incorporate explicit digital procedural protocols and authenticated electronic evidence submissions in Standard Terms.',
        advisoryRemediationAr: 'تحديث الشروط التعاقدية العامة لتضمين بروتوكولات الإجراءات التحكيمية الرقمية وحجية البينات الإلكترونية الموثقة.',
        forecastStatus: 'HORIZON_MONITORING_ACTIVE',
        lastScannedAt: '2026-02-26T08:00:00.000Z',
      },
      {
        trendId: 'horizon_eu_ai_act_general_purpose_enforcement',
        topicTitleEn: 'EU AI Act Tiered Systemic Risk & Transparency Mandatory Enforcement',
        topicTitleAr: 'المرحلة التنفيذية الإلزامية لشفافية النماذج العامة والمخاطر النظامية (الاتحاد الأوروبي)',
        primaryJurisdiction: 'European Union (EU AI Office)',
        enactmentProbabilityPct: 98.0,
        expectedHorizonTimelineMonths: 8,
        enterpriseImpactSeverity: 'CRITICAL_HIGH',
        advisoryRemediationEn: 'Conduct continuous bias auditing and generate cryptographically verifiable zero-knowledge safety attestations.',
        advisoryRemediationAr: 'إجراء تدقيق مستمر لمكافحة الانحياز وإصدار شهادات أمان تشفيرية صفرية المعرفة مقبولة رقابياً.',
        forecastStatus: 'HORIZON_MONITORING_ACTIVE',
        lastScannedAt: '2026-02-26T08:00:00.000Z',
      },
      {
        trendId: 'horizon_gcc_unified_cross_border_data_pact',
        topicTitleEn: 'GCC Unified Cross-Border Data Transfer Framework & Mutual Adequacy',
        topicTitleAr: 'الإطار الخليجي الموحد لنقل البيانات عبر الحدود والاعتراف المتبادل بالملاءمة',
        primaryJurisdiction: 'Gulf Cooperation Council (GCC Secretariat General)',
        enactmentProbabilityPct: 87.5,
        expectedHorizonTimelineMonths: 12,
        enterpriseImpactSeverity: 'MODERATE',
        advisoryRemediationEn: 'Harmonize institutional standard contractual clauses (SCCs) across Saudi Arabia, UAE, Qatar, and Bahrain.',
        advisoryRemediationAr: 'مواءمة البنود التعاقدية القياسية لنقل البيانات بين فروع المؤسسة في السعودية والإمارات وقطر والبحرين.',
        forecastStatus: 'HORIZON_MONITORING_ACTIVE',
        lastScannedAt: '2026-02-26T08:00:00.000Z',
      },
    ];

    for (const t of list) {
      this.trends.set(t.trendId, t);
    }
  }

  public listTrends(): RegulatoryHorizonTrend[] {
    return Array.from(this.trends.values());
  }

  public clear(): void {
    this.trends.clear();
  }
}

export const regulatoryHorizonScanner = RegulatoryHorizonScanner.getInstance();
