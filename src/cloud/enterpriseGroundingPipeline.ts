/**
 * src/cloud/enterpriseGroundingPipeline.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Enterprise Fine-Tuning & Custom Grounding Pipeline
 * Specification: Task 17.2
 *
 * Grounding pipeline for company-specific legal vocabulary, custom acronyms,
 * standardized internal fallback positions, and institutional risk thresholds.
 *
 * STRICT PRIVACY RULES: Abstract representation only; zero storage of raw customer contracts or training datasets.
 */

export interface CustomGroundingRule {
  id: string;
  organizationId: string;
  termEn: string;
  termAr: string;
  preferredStandardEn: string;
  preferredStandardAr: string;
  category: 'CUSTOM_LEXICON' | 'LIABILITY_POLICY' | 'DISPUTE_FORUM' | 'GOVERNANCE_DIRECTIVE';
  updatedAt: string;
}

class EnterpriseGroundingPipeline {
  private static instance: EnterpriseGroundingPipeline;
  private rules: Map<string, CustomGroundingRule> = new Map();

  private constructor() {
    this.seedDefaultRules();
  }

  public static getInstance(): EnterpriseGroundingPipeline {
    if (!EnterpriseGroundingPipeline.instance) {
      EnterpriseGroundingPipeline.instance = new EnterpriseGroundingPipeline();
    }
    return EnterpriseGroundingPipeline.instance;
  }

  private seedDefaultRules(): void {
    const list: CustomGroundingRule[] = [
      {
        id: 'rule_lex_01',
        organizationId: 'org_enterprise_demo_01',
        termEn: 'Confidential Information & Proprietary Data',
        termAr: 'المعلومات السرية والبيانات المملوكة',
        preferredStandardEn: 'Strict 5-year post-termination non-disclosure obligation with zero residual knowledge carveout.',
        preferredStandardAr: 'التزام صارم بالسرية لمدة 5 سنوات بعد انتهاء العقد مع استبعاد استثناء المعرفة المتبقية.',
        category: 'CUSTOM_LEXICON',
        updatedAt: '2026-02-26T08:00:00.000Z',
      },
      {
        id: 'rule_policy_02',
        organizationId: 'org_enterprise_demo_01',
        termEn: 'Aggregate Liability Super-Cap',
        termAr: 'الحد الأقصى التراكمي للمسؤولية المشددة',
        preferredStandardEn: 'Capped at 2x annual contract value for data protection and gross negligence breaches.',
        preferredStandardAr: 'سقف مقيد بـ 2x من قيمة العقد السنوية في حالات حماية البيانات والخطأ الجسيم.',
        category: 'LIABILITY_POLICY',
        updatedAt: '2026-02-26T08:00:00.000Z',
      },
      {
        id: 'rule_dispute_03',
        organizationId: 'org_enterprise_demo_01',
        termEn: 'Mandatory Institutional Arbitration Forum',
        termAr: 'مقر التحكيم المؤسسي الإلزامي',
        preferredStandardEn: 'Saudi Center for Commercial Arbitration (SCCA) in Riyadh or DIFC-LCIA in Dubai.',
        preferredStandardAr: 'المركز السعودي للتحكيم التجاري (SCCA) بالرياض أو محاكم DIFC بدبي.',
        category: 'DISPUTE_FORUM',
        updatedAt: '2026-02-26T08:00:00.000Z',
      },
    ];

    for (const r of list) {
      this.rules.set(r.id, r);
    }
  }

  public addGroundingRule(params: {
    organizationId: string;
    termEn: string;
    termAr: string;
    preferredStandardEn: string;
    preferredStandardAr: string;
    category: CustomGroundingRule['category'];
  }): CustomGroundingRule {
    const id = `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const rule: CustomGroundingRule = {
      id,
      organizationId: params.organizationId,
      termEn: params.termEn,
      termAr: params.termAr,
      preferredStandardEn: params.preferredStandardEn,
      preferredStandardAr: params.preferredStandardAr,
      category: params.category,
      updatedAt: new Date().toISOString(),
    };
    this.rules.set(id, rule);
    return rule;
  }

  public listGroundingRules(organizationId?: string): CustomGroundingRule[] {
    const all = Array.from(this.rules.values());
    if (!organizationId) return all;
    return all.filter(r => r.organizationId === organizationId);
  }

  public clear(): void {
    this.rules.clear();
  }
}

export const enterpriseGroundingPipeline = EnterpriseGroundingPipeline.getInstance();
