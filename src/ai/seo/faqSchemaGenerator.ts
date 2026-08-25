/**
 * src/ai/seo/faqSchemaGenerator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Legal SEO FAQ & JSON-LD Schema Generator
 * Specification: JURISTECH-AI-P0 Phase P0-5
 *
 * Generates structured Schema.org FAQPage JSON-LD microdata for regional
 * search engine rich snippet indexing (Google, Bing, Yandex).
 */

import type { JurisdictionCode, LegalDomain, LegalFAQItem } from '../types';

export interface FAQSeed {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  jurisdiction: JurisdictionCode;
  domain: LegalDomain;
}

const FAQ_DATABASE: FAQSeed[] = [
  {
    questionAr: 'ما هي شروط صحة الشرط الجزائي في العقود وفق النظام السعودي الجديد؟',
    questionEn: 'What are the validity requirements for liquidated damages under the new Saudi Civil Transactions Law?',
    answerAr: 'وفقاً للمادتين 178 و 224 من نظام المعاملات المدنية السعودي (م/191)، يجب أن يكون التعويض متناسباً مع الضرر الفعلي المباشر، ويحق للمحكمة إنقاصه إذا كان مبالغاً فيه أو إبطاله إذا لم يقع ضرر.',
    answerEn: 'Under Articles 178 and 224 of the Saudi Civil Transactions Law (M/191), damages must correspond to actual direct losses. Courts possess statutory authority to reduce disproportionate penalties or void ungrounded damages.',
    jurisdiction: 'SA',
    domain: 'contract',
  },
  {
    questionAr: 'كيف يتم توثيق عقود العمل وفترة التجربة في نظام العمل السعودي؟',
    questionEn: 'How are employment contracts and probation periods authenticated under Saudi Labor Law?',
    answerAr: 'يتم التوثيق إلكترونياً عبر منصة (قوى)، وتحدد فترة التجربة بـ (90) يوماً ويجوز تمديدها باتفاق خطي صريح بما لا يتجاوز (180) يوماً.',
    answerEn: 'Authentication is conducted electronically via the Qiwa platform. Probation is set at 90 days, extendable by mutual written agreement up to a maximum of 180 days.',
    jurisdiction: 'SA',
    domain: 'labor',
  },
  {
    questionAr: 'ما هي ضوابط نقل البيانات الشخصية خارج الدولة في نظام حماية البيانات (PDPL)؟',
    questionEn: 'What are the cross-border data transfer requirements under Saudi PDPL?',
    answerAr: 'يشترط نظام حماية البيانات الشخصية الحصول على موافقة صريحة، والتحقق من وجود مستوى حماية مماثل لدى الدولة المستقبلة، وعدم الإخلال بالأمن القومي والمصالح الحيوية.',
    answerEn: 'The KSA PDPL requires explicit consent, adequate data protection safeguards in the recipient state, and strict adherence to national security guidelines.',
    jurisdiction: 'SA',
    domain: 'compliance',
  },
  {
    questionAr: 'هل يجوز تملك الشركات الأجنبية بنسبة 100% في دولة الإمارات؟',
    questionEn: 'Is 100% foreign corporate ownership permitted in the UAE?',
    answerAr: 'نعم، أتاح المرسوم بقانون اتحادي رقم 32 لسنة 2021 التملك الأجنبي الكامل للشركات التجارية في معظم الأنشطة الاقتصادية دون الحاجة لشريك أو وكيل محلي.',
    answerEn: 'Yes, UAE Federal Decree-Law No. 32/2021 permits 100% foreign ownership of commercial companies across most economic sectors without requiring a local sponsor.',
    jurisdiction: 'AE',
    domain: 'corporate',
  },
  {
    questionAr: 'ما هي متطلبات منظومة الفاتورة الإلكترونية والإيصال الإلكتروني في مصر؟',
    questionEn: 'What are the compliance mandates for the Egyptian Tax Authority (ETA) e-Invoicing system?',
    answerAr: 'تلزم مصلحة الضرائب المصرية الشركات بالتسجيل بمنظومة الفاتورة الإلكترونية، واستخدام الختم الإلكتروني (e-Token HSM)، وتكويد السلع وفق معايير GS1/EGS.',
    answerEn: 'The Egyptian Tax Authority requires all corporate entities to integrate with the e-Invoicing portal, utilize HSM electronic digital stamps, and adopt GS1/EGS coding standards.',
    jurisdiction: 'EG',
    domain: 'tax',
  },
];

/**
 * Generates FAQ item with embedded JSON-LD Schema.org markup.
 */
export function generateFAQList(
  filterJurisdiction?: JurisdictionCode,
  filterDomain?: LegalDomain
): LegalFAQItem[] {
  let seeds = FAQ_DATABASE;
  if (filterJurisdiction && filterJurisdiction !== 'UNKNOWN') {
    seeds = seeds.filter(s => s.jurisdiction === filterJurisdiction);
  }
  if (filterDomain && filterDomain !== 'general') {
    seeds = seeds.filter(s => s.domain === filterDomain);
  }

  const now = new Date().toISOString();

  return seeds.map((s, idx) => {
    const id = `faq_${s.jurisdiction.toLowerCase()}_${idx + 1}`;
    const schemaJsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: s.questionAr,
          acceptedAnswer: {
            '@type': 'Answer',
            text: s.answerAr,
          },
        },
        {
          '@type': 'Question',
          name: s.questionEn,
          acceptedAnswer: {
            '@type': 'Answer',
            text: s.answerEn,
          },
        },
      ],
    });

    return {
      id,
      question: s.questionAr,
      answerAr: s.answerAr,
      answerEn: s.answerEn,
      jurisdiction: s.jurisdiction,
      domain: s.domain,
      schemaJsonLd,
      status: 'DRAFT',
      generatedAt: now,
    };
  });
}
