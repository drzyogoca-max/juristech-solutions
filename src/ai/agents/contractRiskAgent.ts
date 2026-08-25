/**
 * src/ai/agents/contractRiskAgent.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Contract Risk Forensics & Clause Redlining Agent
 * Specification: JURISTECH-AI-P0 Phase P0-2
 *
 * Scans contract texts for missing mandatory clauses, predatory terms,
 * and unbalanced liabilities with automated statutory redlining.
 */

import { buildCitations } from '../retrieval/citationEngine';
import { semanticSearch } from '../retrieval/semanticSearch';
import { rankSources } from '../retrieval/sourceRanking';
import type {
  ContractRiskSummary,
  JurisdictionCode,
  RiskLevel,
  SupportedAILang,
} from '../types';

export interface ClauseAuditItem {
  clauseName: string;
  isPresent: boolean;
  riskLevel: RiskLevel;
  findingEn: string;
  findingAr: string;
  recommendedRedlineEn?: string;
  recommendedRedlineAr?: string;
}

export interface ContractAuditResult {
  summary: ContractRiskSummary;
  clauses: ClauseAuditItem[];
  missingClauseCount: number;
  highRiskCount: number;
}

const MANDATORY_CLAUSE_PATTERNS: Array<{
  name: string;
  keywords: string[];
  mandatory: boolean;
  redlineAr: string;
  redlineEn: string;
}> = [
  {
    name: 'Dispute Resolution & Arbitration',
    keywords: ['arbitration', 'dispute', 'jurisdiction', 'court', 'تحكيم', 'نزاع', 'المحكمة', 'قضاء'],
    mandatory: true,
    redlineAr: 'يتم تسوية أي نزاع ينشأ عن هذا العقد ودياً خلال (30) يوماً، وفي حال تعذر ذلك يحال النزاع للتحكيم أو المحكمة التجارية المختصة وفقاً للأنظمة المرعية.',
    redlineEn: 'Any dispute arising under this Agreement shall be settled amicably within 30 days, failing which it shall be referred to competent arbitration or commercial courts under applicable law.',
  },
  {
    name: 'Limitation of Liability & Liquidated Damages',
    keywords: ['liability', 'damages', 'cap', 'penalty', 'liquidated', 'مسؤولية', 'شرط جزائي', 'تعويض', 'سقف'],
    mandatory: true,
    redlineAr: 'لا يجوز أن يتجاوز مجموع التعويضات أو الشروط الجزائية القيمة الإجمالية الفعلية للعقد أو نسبة 10% من قيمة الالتزام المتأخر، استناداً لأحكام النظام المدني والتجاري.',
    redlineEn: 'Total aggregate liability or liquidated damages shall in no event exceed the actual direct contract value or 10% of the delayed milestone, pursuant to statutory fairness principles.',
  },
  {
    name: 'Termination & Default Notice',
    keywords: ['terminate', 'termination', 'notice', 'default', 'cure', 'إنهاء', 'فسخ', 'إشعار', 'إخلال'],
    mandatory: true,
    redlineAr: 'يحق لأي من الطرفين إنهاء العقد في حال إخلال الطرف الآخر بشرط إخطاره خطياً ومنحه مهلة تصحيحية لا تقل عن (15) يوماً.',
    redlineEn: 'Either party may terminate this Agreement upon material breach with written notice and a mandatory 15-day cure period.',
  },
  {
    name: 'Confidentiality & NDA',
    keywords: ['confidential', 'secret', 'disclosure', 'proprietary', 'سرية', 'كتمان', 'إفشاء', 'بيانات سرية'],
    mandatory: true,
    redlineAr: 'يلتزم الطرفان بالمحافظة التامة على سرية المعلومات الفنية والتجارية المتبادلة وعدم إفشائها لأي طرف ثالث طوال مدة العقد ولمدة (3) سنوات بعد انتهائه.',
    redlineEn: 'Both parties agree to maintain strict confidentiality of all disclosed technical and business information for the term of this Agreement and 3 years thereafter.',
  },
  {
    name: 'Data Protection & Privacy',
    keywords: ['data protection', 'privacy', 'pdpl', 'gdpr', 'personal data', 'بيانات شخصية', 'خصوصية', 'معالجة'],
    mandatory: true,
    redlineAr: 'يلتزم الطرفان بنظام حماية البيانات الشخصية المعتمد ولا يجوز معالجة أو نقل أي بيانات شخصية إلا بموافقة صريحة ولأغراض العقد فقط.',
    redlineEn: 'Both parties shall adhere to applicable Personal Data Protection Laws (PDPL/GDPR) and process personal data solely for legitimate contractual purposes.',
  },
  {
    name: 'Force Majeure',
    keywords: ['force majeure', 'unforeseen', 'act of god', 'ظروف طارئة', 'قوة قاهرة', 'حادث استثنائي'],
    mandatory: false,
    redlineAr: 'يعفى أي طرف من المسؤولية عن التأخير الناتج عن قوة قاهرة أو ظروف طارئة غير متوقعة خارجة عن إرادته المعقولة، مع التزام إشعار الطرف الآخر خلال (7) أيام.',
    redlineEn: 'Neither party shall be liable for delay caused by force majeure events beyond reasonable control, provided written notice is delivered within 7 business days.',
  },
  {
    name: 'Intellectual Property Ownership',
    keywords: ['intellectual property', 'ip', 'copyright', 'trademark', 'ملكية فكرية', 'حقوق مؤلف', 'علامة تجارية'],
    mandatory: false,
    redlineAr: 'تبقى كافة حقوق الملكية الفكرية السابقة مملوكة لصاحبها، وتنتقل حقوق مخرجات العمل المطورة للعميل بعد سداد كامل المستحقات المالية المتفق عليها.',
    redlineEn: 'All pre-existing intellectual property remains with the respective owner; deliverables shall transfer to the client upon full settlement of contract fees.',
  },
];

/**
 * Analyzes a contract text and generates risk breakdown & redlines.
 */
export function auditContractText(
  contractText: string,
  options: {
    jurisdiction?: JurisdictionCode;
    lang?: SupportedAILang;
  } = {}
): ContractAuditResult {
  const { jurisdiction = 'SA', lang = 'ar' } = options;
  const isAr = lang === 'ar';
  const lowerText = contractText.toLowerCase();

  const clauseAudits: ClauseAuditItem[] = [];
  const missingClauses: string[] = [];
  const topRisks: string[] = [];
  const recommendedActions: string[] = [];

  let riskScore = 15; // Base baseline

  for (const item of MANDATORY_CLAUSE_PATTERNS) {
    const isPresent = item.keywords.some(kw => lowerText.includes(kw.toLowerCase()));

    if (!isPresent) {
      if (item.mandatory) {
        riskScore += 18;
        missingClauses.push(item.name);
        clauseAudits.push({
          clauseName: item.name,
          isPresent: false,
          riskLevel: 'HIGH',
          findingEn: `Missing mandatory clause: ${item.name}. Exposes the contract to unilateral interpretation and legal vulnerability.`,
          findingAr: `بند إلزامي مفقود: (${item.name}). يعرض العقد لغموض قانوني ومخاطر عالية في حال حدوث نزاع.`,
          recommendedRedlineEn: item.redlineEn,
          recommendedRedlineAr: item.redlineAr,
        });
      } else {
        riskScore += 8;
        clauseAudits.push({
          clauseName: item.name,
          isPresent: false,
          riskLevel: 'MEDIUM',
          findingEn: `Recommended clause omitted: ${item.name}.`,
          findingAr: `بند وقائي مستحسن غير مدرج: (${item.name}).`,
          recommendedRedlineEn: item.redlineEn,
          recommendedRedlineAr: item.redlineAr,
        });
      }
    } else {
      clauseAudits.push({
        clauseName: item.name,
        isPresent: true,
        riskLevel: 'LOW',
        findingEn: `Clause present: ${item.name}. Verify balance of terms.`,
        findingAr: `البند مدرج: (${item.name}). يوصى بالتحقق من التوازن التعاقدي وسقوف المسؤولية.`,
      });
    }
  }

  // Check for dangerous predatory phrases
  const predatoryChecks = [
    {
      regex: /unlimited liability|دون أي حد أقصى للمسؤولية|مسؤولية غير محدودة/i,
      risk: isAr ? 'خطر جسيم: وجود مسؤولية غير محدودة على أحد الأطراف' : 'Critical: Unlimited liability clause detected.',
      penalty: 25,
    },
    {
      regex: /without prior notice|دون إشعار مسبق|إنهاء فوري دون سبب/i,
      risk: isAr ? 'خطر مرتفع: إمكانية الإنهاء الفوري دون مهلة تصحيحية' : 'High Risk: Immediate termination without cure period.',
      penalty: 15,
    },
    {
      regex: /compounding penalty|غرامة مركبة|فائدة تأخير|interest of/i,
      risk: isAr ? 'خطر نظامي: فوائد تأخير أو غرامات مركبة قد تبطل نظاماً' : 'Statutory Risk: Compounding penalties or usurious interest.',
      penalty: 20,
    },
  ];

  for (const p of predatoryChecks) {
    if (p.regex.test(contractText)) {
      riskScore += p.penalty;
      topRisks.push(p.risk);
    }
  }

  // Clamp score
  const finalRiskScore = Math.min(99, Math.max(10, riskScore));
  let overallRisk: RiskLevel = 'LOW';
  let riskLabel = isAr ? 'منخفض المخاطر' : 'Low Risk';

  if (finalRiskScore >= 75) {
    overallRisk = 'HIGH';
    riskLabel = isAr ? 'مرتفع المخاطر (يتطلب تعديلاً فورياً)' : 'High Risk (Immediate Redlining Required)';
  } else if (finalRiskScore >= 45) {
    overallRisk = 'MEDIUM';
    riskLabel = isAr ? 'متوسط المخاطر (يوصى بالمراجعة)' : 'Medium Risk (Review Recommended)';
  }

  // Retrieve matching legal sources for backing
  const searchResults = semanticSearch(contractText.slice(0, 300), {
    jurisdiction,
    domain: 'contract',
    topK: 4,
  });
  const ranked = rankSources(searchResults, jurisdiction);
  const citations = buildCitations(ranked);

  // Recommendations
  if (missingClauses.length > 0) {
    recommendedActions.push(
      isAr
        ? `إدراج البنود الإلزامية المفقودة فوراً: (${missingClauses.join('، ')}).`
        : `Insert missing mandatory clauses immediately: (${missingClauses.join(', ')}).`
    );
  }
  recommendedActions.push(
    isAr
      ? 'تطبيق التعديلات المقترحة (Redlines) لضمان الامتثال للأنظمة وتفادي الشروط التعسفية.'
      : 'Apply proposed redlines to ensure statutory alignment and mitigate one-sided liabilities.'
  );

  return {
    summary: {
      overallRisk,
      riskScore: finalRiskScore,
      riskLabel,
      missingClauses,
      topRisks,
      recommendedActions,
      confidenceScore: 0.92,
      sources: citations,
    },
    clauses: clauseAudits,
    missingClauseCount: missingClauses.length,
    highRiskCount: clauseAudits.filter(c => c.riskLevel === 'HIGH').length,
  };
}
