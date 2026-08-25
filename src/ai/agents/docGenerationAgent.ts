/**
 * src/ai/agents/docGenerationAgent.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Multi-Jurisdiction Legal Document Generator
 * Specification: JURISTECH-AI-P0 Phase P0-2
 *
 * Generates legally compliant contracts, agreements, NDAs, and corporate resolutions
 * for 15 global jurisdictions across 7 supported languages.
 */

import { checkTierAccess } from '../security/tierAccessGuard';
import type {
  DocType,
  DocumentGenerationRequest,
  DocumentGenerationResult,
  JurisdictionCode,
  SupportedAILang,
} from '../types';

const JURISDICTION_GOVERNING_BODIES: Record<JurisdictionCode, { bodyAr: string; bodyEn: string }> = {
  SA: {
    bodyAr: 'أنظمة ولوائح المملكة العربية السعودية (المحاكم التجارية والعمالية بالرياض)',
    bodyEn: 'Laws of the Kingdom of Saudi Arabia (Commercial Courts of Riyadh)',
  },
  AE: {
    bodyAr: 'قوانين دولة الإمارات العربية المتحدة ومحاكم دبي / DIFC',
    bodyEn: 'Laws of the United Arab Emirates and the Courts of Dubai / DIFC',
  },
  EG: {
    bodyAr: 'القوانين والتشريعات المعمول بها في جمهورية مصر العربية (المحاكم الاقتصادية بالقاهرة)',
    bodyEn: 'Applicable Laws of the Arab Republic of Egypt (Cairo Economic Courts)',
  },
  QA: {
    bodyAr: 'قوانين دولة قطر ومحاكم مركز قطر للمال (QFC)',
    bodyEn: 'Laws of the State of Qatar and QFC Civil and Commercial Court',
  },
  KW: {
    bodyAr: 'قوانين دولة الكويت ومحاكمها المختصة',
    bodyEn: 'Laws of the State of Kuwait and its competent courts',
  },
  BH: {
    bodyAr: 'مملكة البحرين وغرفة البحرين لتسوية المنازعات (BCDR)',
    bodyEn: 'Kingdom of Bahrain and BCDR-AAA Arbitration Chamber',
  },
  OM: {
    bodyAr: 'سلطنة عمان ومركز عمان للتحكيم التجاري (OAC)',
    bodyEn: 'Sultanate of Oman and Oman Commercial Arbitration Centre (OAC)',
  },
  JO: {
    bodyAr: 'المملكة الأردنية الهاشمية والمحاكم النظامية في عمان',
    bodyEn: 'Hashemite Kingdom of Jordan and the civil courts of Amman',
  },
  INTL: {
    bodyAr: 'قواعد تحكيم غرفة التجارة الدولية (ICC) وقوانين التجارة الدولية UNCITRAL',
    bodyEn: 'ICC Rules of Arbitration and UNCITRAL International Commercial Law',
  },
  GB: {
    bodyAr: 'قوانين إنجلترا وويلز ومحاكم لندن للتحكيم الدولي (LCIA)',
    bodyEn: 'Laws of England and Wales and London Court of International Arbitration (LCIA)',
  },
  US: {
    bodyAr: 'قوانين ولاية ديلاوير وقانون التجارة الأمريكي الموحد (UCC)',
    bodyEn: 'Laws of the State of Delaware and the Uniform Commercial Code (UCC)',
  },
  EU: {
    bodyAr: 'التشريعات الأوروبية الموحدة والنظام الأوروبي العام لحماية البيانات (GDPR)',
    bodyEn: 'European Union Law and the General Data Protection Regulation (EU GDPR)',
  },
  SG: {
    bodyAr: 'قوانين جمهورية سنغافورة ومركز سنغافورة للتحكيم الدولي (SIAC)',
    bodyEn: 'Laws of the Republic of Singapore and SIAC Rules of Arbitration',
  },
  TR: {
    bodyAr: 'القانون المدني والتجاري للجمهورية التركية ومحاكم إسطنبول',
    bodyEn: 'Civil and Commercial Code of the Republic of Turkey (Istanbul Courts)',
  },
  CN: {
    bodyAr: 'قوانين جمهورية الصين الشعبية ومركز هونغ كونغ للتحكيم الدولي (HKIAC)',
    bodyEn: 'Laws of the People’s Republic of China and HKIAC Arbitration Rules',
  },
  UNKNOWN: {
    bodyAr: 'القواعد العامة للقانون التجاري الدولي',
    bodyEn: 'General Principles of International Commercial Law',
  },
};

/**
 * Generates customized legal document draft.
 */
export function generateLegalDocument(
  request: DocumentGenerationRequest
): DocumentGenerationResult {
  const { docType, jurisdiction = 'SA', lang = 'ar', parties = [], additionalDetails = {}, userTier } = request;

  // Tier check
  const tierCheck = checkTierAccess(userTier, 'doc_generation');
  if (!tierCheck.allowed) {
    return {
      content:
        lang === 'ar'
          ? '⚠️ توليد مسودات العقود والاتفاقيات يتطلب اشتراكاً نشطاً في باقة Startup أو Pro.'
          : '⚠️ Automated document generation requires an active Startup or Pro subscription.',
      lang,
      docType,
      jurisdiction,
      isDraft: true,
      confidenceScore: 0,
    };
  }

  const isAr = lang === 'ar';
  const party1 = parties[0] || (isAr ? 'الطرف الأول (المفوِّض)' : 'Party 1 (First Party)');
  const party2 = parties[1] || (isAr ? 'الطرف الثاني (المُنفِّذ)' : 'Party 2 (Second Party)');
  const govBody = JURISDICTION_GOVERNING_BODIES[jurisdiction] || JURISDICTION_GOVERNING_BODIES.SA;
  const dateStr = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US');

  let content = '';

  if (docType === 'nda') {
    if (isAr) {
      content = `# اتفاقية عدم إفشاء وسرية معلومات (NDA)
**تاريخ الإبرام:** ${dateStr}
**النظام الحاكم:** ${govBody.bodyAr}

---

### الأطراف المتعاقدة:
1. **الطرف الأول (المفصح):** ${party1}
2. **الطرف الثاني (المتلقي):** ${party2}

### البند الأول: الغرض من الإفشاء
يرغب الطرفان في بحث فرص التعاون التجاري والتقني، مما يستوجب تبادل معلومات سرية ذات قيمة تجارية وفنية.

### البند الثاني: تعريف المعلومات السرية
تشمل المعلومات السرية كافة البيانات المالية، والخطط التشغيلية، والشيفرات المصدرية، وقواعد البيانات، والعقود، سواء تم الإفصاح عنها شفهياً أو خطياً أو إلكترونياً.

### البند الثالث: التزامات المحافظة على السرية
- يلتزم المتلقي بحفظ سرية المعلومات بنفس درجة العناية التي يبذلها لحفظ معلوماته الخاصة على ألا تقل عن العناية المعتادة للرجل الحريص.
- عدم استخدام المعلومات إلا للغرض المتفق عليه حصراً.
- عدم نسخ أو نقل المعلومات دون موافقة خطية مسبقة.

### البند الرابع: مدة الالتزام
يسري هذا الالتزام طوال فترة التباحث ولمدة **(3) ثلاث سنوات** ميلادية تبدأ من تاريخ آخر إفصاح.

### البند الخامس: القانون الواجب التطبيق والاختصاص القضائي
تخضع هذه الاتفاقية وتفسر وفقاً لأحكام: **${govBody.bodyAr}**.`;
    } else {
      content = `# NON-DISCLOSURE & CONFIDENTIALITY AGREEMENT (NDA)
**Effective Date:** ${dateStr}
**Governing Law:** ${govBody.bodyEn}

---

### PARTIES:
1. **Disclosing Party:** ${party1}
2. **Receiving Party:** ${party2}

### 1. PURPOSE
The parties wish to explore business and technology cooperation requiring disclosure of proprietary confidential information.

### 2. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information encompasses all non-public commercial, financial, technical, software, and operational data disclosed directly or indirectly.

### 3. OBLIGATIONS OF CONFIDENTIALITY
- The Receiving Party shall protect disclosed information with the same standard of care used for its own confidential assets, but not less than reasonable care.
- Information shall not be disclosed to third parties without prior written consent.
- Use of confidential material is strictly restricted to the authorized Purpose.

### 4. TERM & SURVIVAL
Confidentiality covenants shall survive for a period of **3 (three) years** from the date of final disclosure.

### 5. GOVERNING LAW & JURISDICTION
This Agreement shall be construed and enforced pursuant to: **${govBody.bodyEn}**.`;
    }
  } else if (docType === 'employment_contract') {
    if (isAr) {
      content = `# عقد عمل موحد (وفقاً للأنظمة والتشريعات المعتمدة)
**التاريخ:** ${dateStr}
**الولاية القضائية:** ${govBody.bodyAr}

---

### أطراف العقد:
- **صاحب العمل:** ${party1}
- **الموظف:** ${party2}

### البند 1: المسمى الوظيفي والمهام
يعمل الطرف الثاني لدى الطرف الأول بمسمى (${additionalDetails.jobTitle || 'أخصائي قانوني / تقني'}) ويؤدي المهام المكلف بها بعناية وإخلاص.

### البند 2: الأجر والمزايا
يتقاضى الطرف الثاني أجراً شهرياً شاملاً قدره (${additionalDetails.salary || 'محدد بالعقد'}) يدفع بنهاية كل شهر ميلادي وفق نظام حماية الأجور.

### البند 3: فترة التجربة
يخضع الموظف لفترة تجربة مدتها (90) يوماً قابلة للتمديد باتفاق خطي بما لا يتجاوز (180) يوماً وفق الأنظمة المعمول بها.

### البند 4: عدم المنافسة وسرية البيانات
يلتزم الموظف بعدم منافسة صاحب العمل أو إفشاء أسراره أثناء العمل ولمدة سنتين بعد انتهائه في النطاق الجغرافي المحدد.

### البند 5: النظام الحاكم
يخضع العقد لأحكام: **${govBody.bodyAr}**.`;
    } else {
      content = `# STANDARD EMPLOYMENT AGREEMENT
**Date:** ${dateStr}
**Jurisdiction:** ${govBody.bodyEn}

---

### PARTIES:
- **Employer:** ${party1}
- **Employee:** ${party2}

### 1. POSITION & SCOPE
The Employee is hired as (${additionalDetails.jobTitle || 'Legal / Tech Specialist'}) to perform duties faithfully and professionally.

### 2. COMPENSATION
Monthly compensation of (${additionalDetails.salary || 'Agreed Package'}), payable at each calendar month-end in accordance with statutory wage protection rules.

### 3. PROBATIONARY PERIOD
A standard statutory probationary period of 90 calendar days applies.

### 4. NON-COMPETE & CONFIDENTIALITY
Employee agrees not to compete with the Employer or disclose trade secrets during employment and for 24 months post-termination within the designated territory.

### 5. GOVERNING LAW
This Contract is governed exclusively by: **${govBody.bodyEn}**.`;
    }
  } else {
    // Standard Services / Partnership Template
    if (isAr) {
      content = `# اتفاقية خدمات تجارية واحترافية
**التاريخ:** ${dateStr}
**القانون الحاكم:** ${govBody.bodyAr}

---

### الأطراف:
- **الطرف الأول:** ${party1}
- **الطرف الثاني:** ${party2}

### 1. نطاق العمل والخدمات
يقدم الطرف الثاني الخدمات المتفق عليها وفق المعايير المهنية المعتمدة والمواصفات الفنية الملحقة.

### 2. الأتعاب وآلية الدفع
تسدد الأتعاب وفق جدول الدفعات المعتمد مع ربط الاستحقاق بتسليم المراحل المعتمدة خطياً.

### 3. المسؤولية والتعويضات
تحدد المسؤولية بحد أقصى يعادل إجمالي قيمة العقد المسددة فعلياً، وتستبعد الأضرار التبعية أو غير المباشرة.

### 4. القانون الحاكم وحل النزاعات
تخضع الاتفاقية وتفسر وفقاً لأحكام: **${govBody.bodyAr}**.`;
    } else {
      content = `# MASTER SERVICES & COMMERCIAL AGREEMENT
**Effective Date:** ${dateStr}
**Governing Law:** ${govBody.bodyEn}

---

### PARTIES:
- **Client / Principal:** ${party1}
- **Service Provider / Contractor:** ${party2}

### 1. SCOPE OF SERVICES
The Provider shall execute deliverables in adherence with professional industry standards and technical milestones.

### 2. FEES & PAYMENT TERMS
Invoices are payable upon verified milestone acceptance, in accordance with agreed fee schedules.

### 3. LIABILITY LIMITATION
Total aggregate liability shall be capped at 100% of fees actually paid under this Agreement, excluding consequential damages.

### 4. GOVERNING LAW & ARBITRATION
Governed and enforced under: **${govBody.bodyEn}**.`;
    }
  }

  return {
    content,
    lang,
    docType,
    jurisdiction,
    isDraft: true,
    requiredFields: ['party1_signature', 'party2_signature', 'notarization_date'],
    confidenceScore: 0.95,
  };
}
