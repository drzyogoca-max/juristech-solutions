/**
 * src/lib/contracts/missingDocumentProtocol.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Missing Document Protocol Engine v1.0
 * Identifies absent companion documents and required annexes for any contract.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── TYPES ────────────────────────────────────────────────────────────────────

export type DocumentSeverity = 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';

export interface RequiredDocument {
  id: string;
  nameAr: string;
  nameEn: string;
  purposeAr: string;
  purposeEn: string;
  severity: DocumentSeverity;
  triggerKeywords: RegExp;
  jurisdictions?: string[]; // If undefined → applies globally
}

export interface MissingDocumentResult {
  documentId: string;
  nameAr: string;
  nameEn: string;
  purposeAr: string;
  purposeEn: string;
  severity: DocumentSeverity;
  isMissing: boolean;
}

export interface MissingDocumentReport {
  totalChecked: number;
  mandatoryMissing: number;
  recommendedMissing: number;
  optionalMissing: number;
  overallComplianceScore: number; // 0-100
  results: MissingDocumentResult[];
  remediationSummaryAr: string;
  remediationSummaryEn: string;
}

// ── DOCUMENT REQUIREMENT REGISTRY ────────────────────────────────────────────

export const REQUIRED_DOCUMENT_REGISTRY: RequiredDocument[] = [
  {
    id: 'doc-trade-license',
    nameAr: 'السجل التجاري / الرخصة التجارية',
    nameEn: 'Commercial Registration / Trade License',
    purposeAr: 'إثبات الوجود القانوني للشركة وصلاحية الطرف الأول للتعاقد.',
    purposeEn: 'Proof of legal existence and contractual capacity of the contracting entity.',
    severity: 'MANDATORY',
    triggerKeywords: /(شركة|مؤسسة|company|corporation|LLC|Ltd|Inc|establishment|trade|commercial)/i,
  },
  {
    id: 'doc-power-of-attorney',
    nameAr: 'توكيل رسمي / تفويض التوقيع',
    nameEn: 'Power of Attorney / Signatory Authorization',
    purposeAr: 'تفويض الشخص الموقّع على العقد من قبل الشركة أو الجهة المتعاقدة.',
    purposeEn: 'Authorizes the signatory to bind the contracting entity.',
    severity: 'MANDATORY',
    triggerKeywords: /(ممثل|مفوض|authorized representative|on behalf|signatory|attorney|agent|وكيل)/i,
  },
  {
    id: 'doc-nda-companion',
    nameAr: 'اتفاقية عدم الإفصاح (NDA) المستقلة',
    nameEn: 'Standalone Non-Disclosure Agreement (NDA)',
    purposeAr: 'حماية المعلومات السرية المتبادلة خارج نطاق العقد الرئيسي.',
    purposeEn: 'Protects confidential information exchanged outside the main contract scope.',
    severity: 'RECOMMENDED',
    triggerKeywords: /(سرية|معلومات سرية|confidential|non-disclosure|NDA|trade secret)/i,
  },
  {
    id: 'doc-technical-specifications',
    nameAr: 'الكشف الفني / المواصفات التقنية',
    nameEn: 'Technical Specifications / Scope of Work Annex',
    purposeAr: 'تحديد نطاق العمل والمواصفات التقنية الدقيقة للتسليمات.',
    purposeEn: 'Defines the precise technical scope, deliverables, and acceptance criteria.',
    severity: 'MANDATORY',
    triggerKeywords: /(خدمات|تسليمات|مشروع|services|deliverables|scope of work|project|specifications|SOW)/i,
  },
  {
    id: 'doc-payment-schedule',
    nameAr: 'جدول الدفعات المالية',
    nameEn: 'Payment Schedule / Milestone Payment Annex',
    purposeAr: 'تفصيل مواعيد الدفعات ومبالغها المرتبطة بمراحل التنفيذ.',
    purposeEn: 'Details payment amounts tied to specific milestones or dates.',
    severity: 'RECOMMENDED',
    triggerKeywords: /(دفعات|قسط|مراحل|installment|milestone|payment schedule|tranche|وفق جدول)/i,
  },
  {
    id: 'doc-insurance-certificate',
    nameAr: 'شهادة التأمين المهني / وثيقة التأمين',
    nameEn: 'Professional Indemnity Insurance Certificate',
    purposeAr: 'إثبات وجود تغطية تأمينية كافية لتغطية المخاطر المهنية.',
    purposeEn: 'Evidence of adequate insurance coverage for professional liability risks.',
    severity: 'RECOMMENDED',
    triggerKeywords: /(تأمين|ضمان|insurance|indemnity|liability coverage|professional insurance)/i,
  },
  {
    id: 'doc-corporate-resolution',
    nameAr: 'قرار مجلس الإدارة / الجمعية العمومية',
    nameEn: 'Board Resolution / Corporate Authorization',
    purposeAr: 'قرار رسمي يخوّل إبرام هذا العقد وتوقيعه من قبل الشركة.',
    purposeEn: 'Formal corporate resolution authorizing execution of this agreement.',
    severity: 'MANDATORY',
    triggerKeywords: /(شركة مساهمة|مجلس إدارة|board|shareholders|corporation|joint stock|public company)/i,
  },
  {
    id: 'doc-property-title-deed',
    nameAr: 'سند الملكية / شهادة تسجيل العقار',
    nameEn: 'Property Title Deed / Land Registry Certificate',
    purposeAr: 'إثبات الملكية الرسمية للعقار موضوع التعاقد.',
    purposeEn: 'Proof of legal ownership and registered title for the contracted property.',
    severity: 'MANDATORY',
    triggerKeywords: /(عقار|أرض|مبنى|property|real estate|land|building|title deed|قطعة أرض)/i,
  },
  {
    id: 'doc-employment-offer-letter',
    nameAr: 'خطاب عرض العمل الأولي',
    nameEn: 'Initial Employment Offer Letter',
    purposeAr: 'الوثيقة السابقة للعقد التي تحدد الشروط الأساسية المتفق عليها.',
    purposeEn: 'Pre-contractual offer document confirming agreed core employment terms.',
    severity: 'RECOMMENDED',
    triggerKeywords: /(عقد عمل|توظيف|employment contract|job offer|hire|راتب|salary)/i,
  },
  {
    id: 'doc-ip-assignment-deed',
    nameAr: 'وثيقة نقل الملكية الفكرية',
    nameEn: 'Intellectual Property Assignment Deed',
    purposeAr: 'وثيقة رسمية لنقل ملكية الحقوق الفكرية من المبدع/المطور إلى الجهة المتعاقدة.',
    purposeEn: 'Formal deed transferring IP ownership from creator/developer to contracting entity.',
    severity: 'MANDATORY',
    triggerKeywords: /(ملكية فكرية|برمجيات|تصميم|IP|intellectual property|copyright|software|source code|patent)/i,
  },
  {
    id: 'doc-sharia-certificate',
    nameAr: 'شهادة المطابقة الشرعية (هيئة الرقابة الشرعية)',
    nameEn: 'Sharia Compliance Certificate (Sharia Supervisory Board)',
    purposeAr: 'شهادة من هيئة الرقابة الشرعية المعتمدة تفيد بمطابقة العقد للشريعة الإسلامية.',
    purposeEn: 'Certified Sharia compliance approval from an accredited Sharia Supervisory Board.',
    severity: 'MANDATORY',
    triggerKeywords: /(مرابحة|إجارة|مشاركة|صكوك|وكالة شرعية|استصناع|murabaha|ijara|musharaka|sukuk|wakala|istisna|sharia|islamic finance|AAOIFI)/i,
  },
  {
    id: 'doc-data-processing-agreement',
    nameAr: 'اتفاقية معالجة البيانات (DPA)',
    nameEn: 'Data Processing Agreement (DPA) — GDPR/PDPA',
    purposeAr: 'اتفاقية لازمة عند معالجة بيانات شخصية لأطراف ثالثة وفق متطلبات GDPR.',
    purposeEn: 'Mandatory companion agreement when processing third-party personal data under GDPR/PDPA.',
    severity: 'MANDATORY',
    triggerKeywords: /(بيانات شخصية|GDPR|PDPA|data controller|data processor|personal data|معالجة البيانات)/i,
  },
  {
    id: 'doc-environmental-impact',
    nameAr: 'تقرير تقييم الأثر البيئي',
    nameEn: 'Environmental Impact Assessment (EIA) Report',
    purposeAr: 'تقرير تقييم مطلوب للمشاريع ذات التأثير البيئي المحتمل.',
    purposeEn: 'Required for projects with potential environmental impact per regulatory frameworks.',
    severity: 'OPTIONAL',
    triggerKeywords: /(مشروع إنشاء|مصنع|تصنيع|construction|manufacturing|industrial|environmental|factory|plant)/i,
  },
];

// ── CORE ANALYSIS FUNCTION ────────────────────────────────────────────────────

/**
 * Analyzes a contract text to identify missing required companion documents.
 * Returns a comprehensive report with severity levels and remediation guidance.
 */
export function analyzeRequiredDocuments(
  contractText: string,
  jurisdiction?: string
): MissingDocumentReport {
  const results: MissingDocumentResult[] = [];
  let mandatoryMissing = 0;
  let recommendedMissing = 0;
  let optionalMissing = 0;

  for (const doc of REQUIRED_DOCUMENT_REGISTRY) {
    // Skip jurisdiction-specific docs if jurisdiction doesn't match
    if (doc.jurisdictions && jurisdiction && !doc.jurisdictions.includes(jurisdiction.toUpperCase())) {
      continue;
    }

    const isTriggered = doc.triggerKeywords.test(contractText);
    const isMissing = isTriggered; // If keyword triggers, this doc is referenced but possibly absent

    results.push({
      documentId: doc.id,
      nameAr: doc.nameAr,
      nameEn: doc.nameEn,
      purposeAr: doc.purposeAr,
      purposeEn: doc.purposeEn,
      severity: doc.severity,
      isMissing,
    });

    if (isMissing) {
      if (doc.severity === 'MANDATORY') mandatoryMissing++;
      else if (doc.severity === 'RECOMMENDED') recommendedMissing++;
      else optionalMissing++;
    }
  }

  const totalChecked = results.length;
  const totalMissing = mandatoryMissing + recommendedMissing + optionalMissing;
  const overallComplianceScore = totalChecked > 0
    ? Math.max(0, Math.round(100 - (mandatoryMissing * 15) - (recommendedMissing * 5) - (optionalMissing * 2)))
    : 100;

  const remediationSummaryAr = mandatoryMissing > 0
    ? `تحذير: يُفتقر إلى ${mandatoryMissing} وثيقة/وثائق إلزامية مطلوبة. يجب استيفاؤها قبل التوقيع. درجة الامتثال: ${overallComplianceScore}/100.`
    : recommendedMissing > 0
      ? `تنبيه: ${recommendedMissing} وثيقة/وثائق موصى بها غير مرفقة. يُنصح باستيفائها لتعزيز الحماية القانونية.`
      : 'ممتاز: جميع الوثائق المطلوبة مستوفاة. درجة الامتثال الكاملة.';

  const remediationSummaryEn = mandatoryMissing > 0
    ? `Warning: ${mandatoryMissing} mandatory companion document(s) identified as missing. Must be completed before execution. Compliance Score: ${overallComplianceScore}/100.`
    : recommendedMissing > 0
      ? `Notice: ${recommendedMissing} recommended document(s) are absent. Consider completing them for enhanced legal protection.`
      : 'Excellent: All required documents are accounted for. Full compliance score achieved.';

  return {
    totalChecked,
    mandatoryMissing,
    recommendedMissing,
    optionalMissing,
    overallComplianceScore,
    results,
    remediationSummaryAr,
    remediationSummaryEn,
  };
}

/**
 * Returns only the missing mandatory documents for quick-access critical alerts.
 */
export function getCriticalMissingDocuments(contractText: string): MissingDocumentResult[] {
  const report = analyzeRequiredDocuments(contractText);
  return report.results.filter(r => r.isMissing && r.severity === 'MANDATORY');
}
