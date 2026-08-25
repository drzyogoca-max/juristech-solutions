/**
 * src/ai/generation/documentGenerator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Structured Legal Document Generation Layer
 * Specification: JURISTECH-AI-P0 Phase P0-5 & Task 5 (Part B)
 *
 * Produces structured, template-driven legal drafts grounded in statutory citations
 * from GLOBAL_LEGAL_KNOWLEDGE_BASE with human review metadata and placeholder safety.
 */

import { LegalResearchAgent } from '../agents/legalResearchAgent';
import { checkAccess } from '../security/accessControl';
import { sanitizeInput } from '../security/privacyGuard';
import type {
  Citation,
  DocumentGenerationStatus,
  GeneratedDocumentTemplateType,
  GeneratedLegalDocument,
  JurisdictionCode,
  SourceVerificationStatus,
  SupportedAILang,
  UserTier,
} from '../types';

export interface DocumentGenerationOptions {
  documentTitle?: string;
  templateType: GeneratedDocumentTemplateType;
  jurisdiction?: JurisdictionCode;
  parties?: string[];
  effectiveDate?: string;
  contractValue?: string;
  keyTerms?: string[];
  lang?: SupportedAILang;
  userTier?: UserTier;
}

export class DocumentGenerator {
  /**
   * Main Task 5 Structured Document Generation Pipeline
   */
  public static async generateLegalDraft(
    options: DocumentGenerationOptions
  ): Promise<GeneratedLegalDocument> {
    const {
      documentTitle = 'Legal Document Draft',
      templateType,
      jurisdiction = 'UNKNOWN',
      parties = [],
      effectiveDate,
      contractValue,
      keyTerms = [],
      lang = 'en',
      userTier = 'free',
    } = options;

    const isAr = lang === 'ar';
    const isRtl = lang === 'ar';

    // ── 1. Access Control Check
    const access = checkAccess('document_generator', userTier);
    if (!access.allowed) {
      return this.buildGatedDocument(documentTitle, templateType, lang, isRtl, access.reason || 'Subscription required');
    }

    // ── 2. Privacy & Placeholder Sanitization
    const cleanTerms = keyTerms.map(t => sanitizeInput(t).sanitized);

    // ── 3. Source-Grounded Statutory Research
    let citations: Citation[] = [];
    let sourceVerificationStatus: SourceVerificationStatus = 'VERIFIED';

    if (jurisdiction !== 'UNKNOWN') {
      const researchQuery = `${templateType} ${cleanTerms.join(' ')} standard covenants compliance`;
      const research = await LegalResearchAgent.executeResearch(researchQuery, {
        lang,
        forceJurisdiction: jurisdiction,
        topK: 3,
      });
      citations = research.citations;
      sourceVerificationStatus = research.sourceVerificationStatus;
    } else {
      sourceVerificationStatus = 'SOURCE_NOT_VERIFIED';
    }

    // ── 4. Standard Placeholders Construction (No fake data!)
    const placeholders: string[] = [];
    const partyA = parties[0] || '[PARTY_A_NAME]';
    const partyB = parties[1] || '[PARTY_B_NAME]';
    const dateStr = effectiveDate || '[EFFECTIVE_DATE]';
    const valueStr = contractValue || '[CONTRACT_VALUE]';
    const jurStr = jurisdiction !== 'UNKNOWN' ? jurisdiction : '[JURISDICTION]';
    const governingLawStr = jurisdiction === 'SA'
      ? (isAr ? 'الأنظمة واللوائح السارية في المملكة العربية السعودية' : 'Laws of the Kingdom of Saudi Arabia')
      : (jurisdiction === 'EG'
        ? (isAr ? 'أحكام القانون المدني والتجاري المصري' : 'Laws of the Arab Republic of Egypt')
        : (jurisdiction === 'AE'
          ? (isAr ? 'قوانين دولة الإمارات العربية المتحدة ومحاكم مركز دبي المالي' : 'Laws of the United Arab Emirates & DIFC')
          : (jurisdiction === 'GB'
            ? 'Laws of England and Wales'
            : (jurisdiction === 'US'
              ? 'Laws of the State of Delaware / US UCC'
              : '[GOVERNING_LAW]'))));

    if (!parties[0]) placeholders.push('[PARTY_A_NAME]');
    if (!parties[1]) placeholders.push('[PARTY_B_NAME]');
    if (!effectiveDate) placeholders.push('[EFFECTIVE_DATE]');
    if (!contractValue) placeholders.push('[CONTRACT_VALUE]');
    if (jurisdiction === 'UNKNOWN') placeholders.push('[JURISDICTION]');

    // ── 5. Generate Template Sections
    const sections = this.buildTemplateSections(
      templateType,
      { partyA, partyB, dateStr, valueStr, jurStr, governingLawStr, cleanTerms, citations },
      lang
    );

    // ── 6. Assemble Full Document Content
    const fullContent = sections.map(s => `## ${s.heading}\n\n${s.body}`).join('\n\n');

    // ── 7. Document Status Calculation
    let documentStatus: DocumentGenerationStatus = 'DRAFT';
    if (sourceVerificationStatus === 'VERIFIED' && citations.length > 0) {
      documentStatus = 'VERIFIED_SOURCES';
    } else if (sourceVerificationStatus === 'SOURCE_NOT_VERIFIED' || placeholders.length > 3) {
      documentStatus = 'REQUIRES_REVIEW';
    }

    const documentId = `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const nowIso = new Date().toISOString();

    return {
      documentId,
      documentTitle: `${documentTitle} (${isAr ? 'مسودة قيد المراجعة' : 'DRAFT FOR REVIEW'})`,
      templateType,
      documentStatus,
      jurisdiction,
      governingLaw: governingLawStr,
      content: fullContent,
      sections,
      placeholders,
      citations,
      sourceVerificationStatus,
      confidenceScore: sourceVerificationStatus === 'VERIFIED' ? 0.94 : 0.65,
      confidenceCalculation: 'heuristic',
      metadata: {
        generatedAt: nowIso,
        language: lang,
        jurisdiction,
        documentType: templateType,
        sourceVerificationStatus,
        confidence: sourceVerificationStatus === 'VERIFIED' ? 0.94 : 0.65,
        requiresHumanReview: true, // Safety rule: always true
        version: '1.0-draft',
      },
      lang,
      isRtl,
    };
  }

  private static buildTemplateSections(
    templateType: GeneratedDocumentTemplateType,
    ctx: {
      partyA: string;
      partyB: string;
      dateStr: string;
      valueStr: string;
      jurStr: string;
      governingLawStr: string;
      cleanTerms: string[];
      citations: Citation[];
    },
    lang: SupportedAILang
  ): Array<{ heading: string; body: string }> {
    const isAr = lang === 'ar';
    const citationNotes = ctx.citations.length > 0
      ? (isAr
        ? `\n\n**الاستناد التشريعي الموثق:**\n${ctx.citations.map(c => `- ${c.formattedCitationAr}`).join('\n')}`
        : `\n\n**Verified Statutory Basis:**\n${ctx.citations.map(c => `- ${c.formattedCitationEn}`).join('\n')}`)
      : (isAr
        ? '\n\n*(تنبيه: يتطلب هذا البند ربطاً تشريعياً إضافياً عند تحديد الولاية القضائية)*'
        : '\n\n*(Note: Requires statutory review upon governing jurisdiction finalization)*');

    switch (templateType) {
      case 'Legal Memorandum':
        return [
          {
            heading: isAr ? 'الموضوع والملخص التنفيذي' : 'Subject & Executive Summary',
            body: isAr
              ? `مذكرة قانونية استشارية مقدمة إلى ${ctx.partyA} بتاريخ ${ctx.dateStr}. تتعلق بفحص المركز القانوني والالتزامات التعاقدية تحت مظلة ${ctx.governingLawStr}.`
              : `Legal Advisory Memorandum prepared for ${ctx.partyA} on ${ctx.dateStr} concerning contractual liability and statutory positioning under ${ctx.governingLawStr}.`,
          },
          {
            heading: isAr ? 'التحليل القانوني والنظامي' : 'Legal & Statutory Analysis',
            body: (isAr
              ? `بناءً على المعطيات المقدمة، فإن الالتزامات محل الفحص تخضع للقواعد العامة في المسؤولية والوفاء.`
              : `Based on the facts submitted, the underlying obligations are governed by general doctrines of contractual performance and statutory compliance.`) + citationNotes,
          },
          {
            heading: isAr ? 'الرأي القانوني والتوصيات' : 'Legal Opinion & Recommendations',
            body: isAr
              ? `نوصي باتخاذ الإجراءات التحوطية اللازمة وتوثيق التعديلات عبر ملاحق رسمية موقعة من الطرفين.`
              : `We recommend executing formal addenda and ensuring strict adherence to the statutory limitation periods.`,
          },
        ];

      case 'Contract Draft':
        return [
          {
            heading: isAr ? 'الديباجة وأطراف العقد' : 'Preamble & Parties',
            body: isAr
              ? `إنه في يوم [DAY] الموافق ${ctx.dateStr}، تم الاتفاق بين كل من:\n1. الطرف الأول: ${ctx.partyA}\n2. الطرف الثاني: ${ctx.partyB}`
              : `This Agreement is entered into on ${ctx.dateStr}, by and between:\n1. First Party: ${ctx.partyA}\n2. Second Party: ${ctx.partyB}`,
          },
          {
            heading: isAr ? 'موضوع العقد والالتزامات' : 'Scope of Work & Consideration',
            body: isAr
              ? `يلتزم الطرف الثاني بأداء المهام المتفق عليها مقابل أتعاب إجمالية قدرها ${ctx.valueStr} تدفع وفق جدول الدفعات المحدد.`
              : `The Second Party agrees to perform the specified services in consideration for an aggregate contract sum of ${ctx.valueStr}.`,
          },
          {
            heading: isAr ? 'سقف المسؤولية المالية والتعويضات' : 'Limitation of Liability',
            body: (isAr
              ? `لا يجوز بأي حال أن تتجاوز المسؤولية الإجمالية التراكمية لأي طرف 100% من المبالغ المدفوعة فعلياً، مع استبعاد الأضرار التبعية.`
              : `In no event shall either party's cumulative liability exceed 100% of the fees actually paid, strictly excluding consequential damages.`) + citationNotes,
          },
          {
            heading: isAr ? 'القانون واجب التطبيق والتحكيم' : 'Governing Law & Dispute Resolution',
            body: isAr
              ? `يخضع هذا العقد ويفسر وفقاً لـ ${ctx.governingLawStr}. ويحال أي نزاع للتحكيم المؤسسي النهائي.`
              : `This Agreement shall be construed and governed in accordance with ${ctx.governingLawStr}, with disputes resolved by binding arbitration.`,
          },
        ];

      case 'Legal Notice':
        return [
          {
            heading: isAr ? 'بيانات الإنذار والأطراف' : 'Notice Details & Addressee',
            body: isAr
              ? `إشعار قانوني وتكليف رسمي بالوفاء موجه من: ${ctx.partyA} إلى: ${ctx.partyB} بتاريخ: ${ctx.dateStr}.`
              : `Formal Legal Demand Notice from: ${ctx.partyA} to: ${ctx.partyB} dated: ${ctx.dateStr}.`,
          },
          {
            heading: isAr ? 'الوقائع وأوجه الإخلال' : 'Statement of Default & Breach',
            body: isAr
              ? `نحيطكم علماً بحدوث إخلال جوهري في تنفيذ الالتزامات المستحقة بقيمة ${ctx.valueStr}.`
              : `You are formally advised of a material breach regarding outstanding covenants in the amount of ${ctx.valueStr}.`,
          },
          {
            heading: isAr ? 'المهلة والمطالبة القانونية' : 'Cure Period & Legal Reservation',
            body: (isAr
              ? `نمنحكم مهلة نهائية قدرها [REMEDY_PERIOD] يوماً لتدارك الإخلال، مع حفظ كافة الحقوق في اتخاذ الإجراءات القضائية وفق ${ctx.governingLawStr}.`
              : `You are granted a final cure period of [REMEDY_PERIOD] business days, reserving all rights to initiate legal action under ${ctx.governingLawStr}.`) + citationNotes,
          },
        ];

      case 'Compliance Report':
        return [
          {
            heading: isAr ? 'نطاق المراجعة التنظيمية' : 'Regulatory Scope & Baseline',
            body: isAr
              ? `تقرير امتثال تنظيمي لمؤسسة ${ctx.partyA} تحت إشراف ${ctx.governingLawStr} بتاريخ ${ctx.dateStr}.`
              : `Regulatory compliance audit for ${ctx.partyA} under ${ctx.governingLawStr} as of ${ctx.dateStr}.`,
          },
          {
            heading: isAr ? 'نتائج التدقيق والامتثال' : 'Audit Findings & Statutory Grounding',
            body: (isAr
              ? `تم فحص المتطلبات الإلزامية الخاصة بحماية البيانات، والفواتير الإلكترونية، والحوكمة المؤسسية.`
              : `Mandatory statutory requirements examined covering data privacy, e-invoicing, and corporate bylaws.`) + citationNotes,
          },
          {
            heading: isAr ? 'خطة المعالجة التنظيمية' : 'Remediation Action Plan',
            body: isAr
              ? `تنفيذ التوصيات وتحديث السجلات والسياسات الداخلية لضمان تجنب الجزاءات المالية.`
              : `Execute corrective actions and update governance policies to ensure complete penalty avoidance.`,
          },
        ];

      case 'Policy Draft':
        return [
          {
            heading: isAr ? 'الهدف والنطاق' : 'Purpose & Application Scope',
            body: isAr
              ? `وثيقة سياسة داخلية لحوكمة العمليات في ${ctx.partyA} تسري اعتباراً من ${ctx.dateStr}.`
              : `Corporate Governance & Compliance Policy for ${ctx.partyA} effective as of ${ctx.dateStr}.`,
          },
          {
            heading: isAr ? 'الضوابط والمعايير الإلزامية' : 'Mandatory Controls & Standards',
            body: (isAr
              ? `يلتزم جميع الموظفين والمسؤولين بالمعايير المقررة بموجب ${ctx.governingLawStr}.`
              : `All employees and officers must strictly adhere to the standards mandated under ${ctx.governingLawStr}.`) + citationNotes,
          },
        ];

      case 'Executive Legal Summary':
      default:
        return [
          {
            heading: isAr ? 'الملخص القانوني والتنفيذي' : 'Executive Legal Brief',
            body: isAr
              ? `إيجاز قانوني تنفيذي للإدارة العليا في ${ctx.partyA} تم إعداده بتاريخ ${ctx.dateStr} تحت مظلة ${ctx.governingLawStr}.`
              : `Executive legal briefing prepared for senior management of ${ctx.partyA} on ${ctx.dateStr} under ${ctx.governingLawStr}.`,
          },
          {
            heading: isAr ? 'المخاطر الرئيسية والتوصيات' : 'Core Risks & Statutory Guidance',
            body: (isAr
              ? `أبرز المخاطر المرصودة تتعلق بسقف المسؤولية المالية والامتثال التشريعي.`
              : `Key risks identified relate to uncapped contractual exposures and regulatory compliance.`) + citationNotes,
          },
        ];
    }
  }

  private static buildGatedDocument(
    documentTitle: string,
    templateType: GeneratedDocumentTemplateType,
    lang: SupportedAILang,
    isRtl: boolean,
    reason: string
  ): GeneratedLegalDocument {
    const text = isRtl
      ? `🔒 تتطلب ميزة توليد المستندات القانونية باقة اشتراك مدفوعة نشطة (Startup أو Pro). (${reason})`
      : `🔒 Document Generation requires an active paid subscription tier (Startup or Pro). (${reason})`;

    return {
      documentId: 'gated-doc',
      documentTitle,
      templateType,
      documentStatus: 'REQUIRES_REVIEW',
      jurisdiction: 'UNKNOWN',
      governingLaw: 'N/A',
      content: text,
      sections: [{ heading: 'Access Control', body: text }],
      placeholders: [],
      citations: [],
      sourceVerificationStatus: 'INSUFFICIENT',
      confidenceScore: 0.0,
      confidenceCalculation: 'heuristic',
      metadata: {
        generatedAt: new Date().toISOString(),
        language: lang,
        jurisdiction: 'UNKNOWN',
        documentType: templateType,
        sourceVerificationStatus: 'INSUFFICIENT',
        confidence: 0.0,
        requiresHumanReview: true,
        version: '0.0-gated',
      },
      lang,
      isRtl,
    };
  }
}
