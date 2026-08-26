/**
 * src/scale/enterpriseAcceptanceFramework.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Customer Acceptance (UAT) Framework
 * Specification: Task 23.3
 *
 * Manages structured User Acceptance Testing (UAT) suites and sign-off criteria
 * for sovereign government clients and multinational enterprise deployments.
 *
 * STRICT GOVERNANCE RULES:
 *  • 5-Stage UAT lifecycle.
 *  • Mandatory dual authorization (Client Counsel + JurisTech Lead) for final sign-off.
 */

export type AcceptanceStage =
  | 'SECURITY_ACCEPTANCE'
  | 'FUNCTIONAL_ACCEPTANCE'
  | 'PERFORMANCE_ACCEPTANCE'
  | 'LEGAL_SIGN_OFF'
  | 'PRODUCTION_APPROVAL';

export interface AcceptanceTestCase {
  testId: string;
  testTitleEn: string;
  testTitleAr: string;
  stage: AcceptanceStage;
  targetThreshold: string;
  achievedResult: string;
  testPassed: boolean;
  auditedEvidenceHash: string;
}

export interface EnterpriseAcceptanceSuite {
  suiteId: string;
  clientEnterpriseNameEn: string;
  clientEnterpriseNameAr: string;
  clientType: 'GOVERNMENT_MINISTRY' | 'SOVEREIGN_WEALTH_FUND' | 'FORTUNE_500_CORP';
  currentStage: AcceptanceStage;
  overallProgressPct: number;
  testCases: AcceptanceTestCase[];
  humanLegalSignOffApproved: boolean;
  lastUpdated: string;
}

class EnterpriseAcceptanceFramework {
  private static instance: EnterpriseAcceptanceFramework;
  private suites: Map<string, EnterpriseAcceptanceSuite> = new Map();

  private constructor() {
    this.seedAcceptanceSuites();
  }

  public static getInstance(): EnterpriseAcceptanceFramework {
    if (!EnterpriseAcceptanceFramework.instance) {
      EnterpriseAcceptanceFramework.instance = new EnterpriseAcceptanceFramework();
    }
    return EnterpriseAcceptanceFramework.instance;
  }

  private seedAcceptanceSuites(): void {
    const list: EnterpriseAcceptanceSuite[] = [
      {
        suiteId: 'uat_saudi_gov_justice',
        clientEnterpriseNameEn: 'Saudi Ministry & Judicial Authority Digital Transformation',
        clientEnterpriseNameAr: 'مشروع التحول الرقمي للجهات العدلية والحكومية السعودية',
        clientType: 'GOVERNMENT_MINISTRY',
        currentStage: 'LEGAL_SIGN_OFF',
        overallProgressPct: 80.0,
        humanLegalSignOffApproved: false,
        lastUpdated: '2026-02-26T08:00:00.000Z',
        testCases: [
          {
            testId: 'uat_tc_01_citation',
            testTitleEn: 'Saudi Statutory Citation Accuracy & Anti-Hallucination Grounding',
            testTitleAr: 'دقة الاستشهاد بالأنظمة السعودية ومكافحة الهلوسة القانونية',
            stage: 'FUNCTIONAL_ACCEPTANCE',
            targetThreshold: '100% Citation Grounding',
            achievedResult: '100% Grounded in Official Lexicon',
            testPassed: true,
            auditedEvidenceHash: 'uat_hash_sha512_tc01_99281a7b6c50192837465019283746',
          },
          {
            testId: 'uat_tc_02_latency',
            testTitleEn: 'Sub-20ms P95 Latency under 50 Concurrent Judicial Queries',
            testTitleAr: 'زمن استجابة P95 أقل من 20ms تحت ضغط 50 استشارة قضائية متزامنة',
            stage: 'PERFORMANCE_ACCEPTANCE',
            targetThreshold: 'P95 <= 20.0ms',
            achievedResult: 'P95 = 14.8ms',
            testPassed: true,
            auditedEvidenceHash: 'uat_hash_sha512_tc02_33491b827e10a99c88271a6b591827',
          },
          {
            testId: 'uat_tc_03_zero_retention',
            testTitleEn: 'Zero Raw Document Retention & Volatile RAM Purge Validation',
            testTitleAr: 'التحقق من انعدام تخزين الوثائق والتفريغ الفوري للذاكرة المؤقتة',
            stage: 'SECURITY_ACCEPTANCE',
            targetThreshold: '0 Bytes Persisted to Disk',
            achievedResult: '0 Bytes Persisted (RAM Only)',
            testPassed: true,
            auditedEvidenceHash: 'uat_hash_sha512_tc03_88921a837c19b02e994821a7c81920',
          },
        ],
      },
    ];

    for (const s of list) {
      this.suites.set(s.suiteId, s);
    }
  }

  public listSuites(): EnterpriseAcceptanceSuite[] {
    return Array.from(this.suites.values());
  }

  public clear(): void {
    this.suites.clear();
  }
}

export const enterpriseAcceptanceFramework = EnterpriseAcceptanceFramework.getInstance();
