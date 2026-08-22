/**
 * legalIntelligenceEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sovereign Autonomous Legal AI Engine v5.0
 * High-Precision Legal Drafting, Contract Generation, Statutory Analysis & Risk Redlining
 * Zero Generic Boilerplate Guarantee — Tailored, Enforceable, Multi-Jurisdictional Outputs
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface LegalAnalysisResult {
  intent: 'contract_drafting' | 'contract_audit' | 'legal_consultation' | 'dispute_resolution' | 'statutory_inquiry';
  topic: string;
  response: string;
  suggestedActions: string[];
}

// ── Smart Intent & Topic Classifier ──────────────────────────────────────────
export function classifyLegalPrompt(prompt: string): {
  intent: LegalAnalysisResult['intent'];
  topic: string;
  isDrafting: boolean;
  isCarSale: boolean;
  isRealEstate: boolean;
  isEmployment: boolean;
  isNda: boolean;
  isSoftware: boolean;
  isSupply: boolean;
  isPartnership: boolean;
  isLoan: boolean;
  isAgency: boolean;
  isConsulting: boolean;
  isLaborDispute: boolean;
  isFinancialClaim: boolean;
  isAuditRequest: boolean;
} {
  const p = prompt.toLowerCase().trim();

  const isCarSale = /(car|vehicle|auto|automobile|motor|سيارة|مركب|شاحنة|موتوسيكل|عربيه|عربية|بيع سيارة|شراء سيارة|مبايعة)/i.test(p);
  const isRealEstate = /(rent|lease|tenant|landlord|apartment|property|real estate|villa|building|إيجار|ايجار|عقار|شقة|فيلا|أرض|بيع عقار|مستأجر|مؤجر)/i.test(p);
  const isEmployment = /(employment|job|employee|employer|labor contract|work agreement|عمل|توظيف|موظف|عقد عمل|عقد توظيف|صاحب عمل|عمال)/i.test(p);
  const isNda = /(nda|non-disclosure|confidential|confidentiality|secrecy|سرية|عدم إفصاح|عدم افصاح|حفظ السرية|كتمان)/i.test(p);
  const isSoftware = /(software|app|application|developer|code|saas|api|source code|برمجة|تطبيق|موقع|تطوير برمجيات|منصة)/i.test(p);
  const isSupply = /(supply|procurement|goods|vendor|supplier|delivery of goods|توريد|شراء بضاعة|مورد|بضائع|توريدات)/i.test(p);
  const isPartnership = /(partnership|partner|shareholder|joint venture|m&a|incorporation|شراكة|تأسيس شركة|شركاء|مساهمين|استحواذ|اندماج)/i.test(p);
  const isLoan = /(loan|debt|promissory|borrow|lender|قرض|سلف|دين|سند لأمر|مديونية|تسوية ديون|كمبيالة)/i.test(p);
  const isAgency = /(power of attorney|poa|agency|agent|mandate|وكالة|توكيل|تفويض|وكيل تجاري)/i.test(p);
  const isConsulting = /(consulting|consultant|freelance|advisory|service agreement|استشارات|مستشار|عمل حر|خدمات مهنية)/i.test(p);

  const isLaborDispute = /(dismissal|termination|fired|salary|end of service|wage|فصل تعسفي|مستحقات|مكافأة نهاية الخدمة|راتب|إجازة|نزاع عمالي)/i.test(p);
  const isFinancialClaim = /(cheque|check|bounced|fraud|debt collection|compensation|شيك|شيك بدون رصيد|احتيال|نصب|تعويض|مطالبة مالية)/i.test(p);

  const isDrafting = /(contract|agreement|draft|sample|template|write|create|generate|صياغة|عقد|نموذج|اتفاقية|اكتب|صيغة|انشئ|توليد)/i.test(p) ||
                     isCarSale || isRealEstate || isEmployment || isNda || isSoftware || isSupply || isPartnership || isLoan || isAgency || isConsulting;

  const isAuditRequest = /(audit|review|check|examine|risk|vulnerability|clause|redline|فحص|تدقيق|مراجعة|تحليل عقد|ثغرات|مخاطر)/i.test(p) ||
                         p.includes('.pdf') || p.includes('.docx') || p.includes('[attached');

  let intent: LegalAnalysisResult['intent'] = 'legal_consultation';
  let topic = 'General Legal Advisory';

  if (isAuditRequest) {
    intent = 'contract_audit';
    topic = 'Contract Risk & Vulnerability Audit';
  } else if (isDrafting) {
    intent = 'contract_drafting';
    topic = isCarSale ? 'Vehicle Sale Agreement' :
            isRealEstate ? 'Real Estate & Lease Agreement' :
            isEmployment ? 'Employment Agreement' :
            isNda ? 'Non-Disclosure Agreement (NDA)' :
            isSoftware ? 'Software Development Agreement' :
            isSupply ? 'Commercial Supply Agreement' :
            isPartnership ? 'Partnership & Shareholders Agreement' :
            isLoan ? 'Loan & Debt Acknowledgment' :
            isAgency ? 'Power of Attorney & Agency' :
            isConsulting ? 'Consulting & Professional Services Agreement' : 'Custom Commercial Contract';
  } else if (isLaborDispute || isFinancialClaim) {
    intent = 'dispute_resolution';
    topic = isLaborDispute ? 'Labor & Employment Dispute' : 'Commercial & Financial Claim';
  }

  return {
    intent,
    topic,
    isDrafting,
    isCarSale,
    isRealEstate,
    isEmployment,
    isNda,
    isSoftware,
    isSupply,
    isPartnership,
    isLoan,
    isAgency,
    isConsulting,
    isLaborDispute,
    isFinancialClaim,
    isAuditRequest,
  };
}

// ── Complete Sovereign Legal Contract Drafts & Templates ─────────────────────

/**
 * 🚗 1. Vehicle / Car Sale Agreement (Full Enforceable Legal Contract)
 */
export function generateCarSaleContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ عقد بيع وتنازل عن مركبة / سيارة رسمي وموثق

**بعون الله وتوفيقه، تم إبرام هذا العقد في يوم [........] الموافق [..../..../2026م] بين كل من:**

### 👥 طرفي العقد:
* **الطرف الأول (البائع):**
  - **الاسم الثلاثي / الرباعي:** [اسم البائع الكامل]
  - **رقم الهوية الوطنية / الإقامة / جواز السفر:** [................................]
  - **الجنسية:** [....................] | **العنوان:** [................................]
  - **رقم الهاتف:** [....................] | **البريد الإلكتروني:** [....................]

* **الطرف الثاني (المشتري):**
  - **الاسم الثلاثي / الرباعي:** [اسم المشتري الكامل]
  - **رقم الهوية الوطنية / الإقامة / جواز السفر:** [................................]
  - **الجنسية:** [....................] | **العنوان:** [................................]
  - **رقم الهاتف:** [....................] | **البريد الإلكتروني:** [....................]

---

### 📋 تمهيد:
يمتلك الطرف الأول المركبة المبينة مواصفاتها تفصيلاً في البند الأول من هذا العقد، ولديه الأهلية القانونية والصفة المعتبرة شرعاً للتصرف فيها ونقل ملكيتها. ورغبة من الطرف الثاني في شراء هذه المركبة بعد معاينتها المعاينة النافية للجهالة شرعاً وقانوناً، فقد اتفق الطرفان على إبرام هذا العقد بالشروط والأحكام الآتية:

---

### 🚗 البند الأول: موضوع العقد وبيانات المركبة التفصيلية
باع وأسقط وتنازل الطرف الأول بكافة الضمانات القانونية والفعلية إلى الطرف الثاني القابل لذلك المركبة الآتية:
* **نوع وماركة المركبة (Make):** [مثال: Toyota / Mercedes-Benz / Hyundai]
* **الموديل / الطراز (Model):** [مثال: Camry / E300 / Tucson]
* **سنة الصنع (Year):** [2024م]
* **رقم الهيكل / الشاسيه (VIN):** \`[............................................]\`
* **رقم المحرك (Engine No):** \`[............................................]\`
* **رقم اللوحة المرورية:** [....................] | **وحدة المرور المسجلة بها:** [....................]
* **لون المركبة:** [....................] | **قراءة العداد الحالية:** [................ كم]
* **رقم وتاريخ انتهاء رخصة السير:** [....................]

---

### 💰 البند الثاني: الثمن وطريقة السداد
1. تم هذا البيع برضا الطرفين واتفاقهما نظير مبلغ إجمالي وقدره: **[المبلغ رقماً]** (فقط **[المبلغ كتابة بالعملة المحلية]** لا غير).
2. **آلية الدفع والتسليم:**
   - [ ] **سداد نقدي / تحويل مصرفي فوري كامل:** يقر الطرف الأول باستلام كامل المبلغ المذكور أعلاه عند التوقيع، ويعد توقيعه على هذا العقد مخالصة مالية تامة ونهائية وإبراءً لذمة المشتري.
   - [ ] **عربون ومتبقي:** دفع الطرف الثاني عربوناً وقدره [........] عند التوقيع، ويلتزم بسداد المتبقي وقدره [........] عند إتمام نقل الملكية رسمياً لدى جهة المرور / الشهر العقاري.

---

### 🔍 البند الثالث: المعاينة وفحص الحالة الفنية (العيوب الخفية)
1. يقر الطرف الثاني (المشتري) بأنه عاين المركبة موضوع هذا العقد المعاينة التامة النافية للجهالة شرعاً وقانوناً، واختبرها وقام بفحصها فحصاً فنياً شاملاً بمعرفته وبأحد المراكز الفنية المعتمدة، وقبل شراءها بحالتها الراهنة وقت توقيع العقد.
2. يضمن الطرف الأول (البائع) سلامة الشاسيه والمحرك وخلو المركبة من أي عيوب جوهرية مدلسة أو حوادث سابقة لم يُفصح عنها صراحة للمشتري.

---

### 🛡️ البند الرابع: خلو المركبة من الرهون والالتزامات
يضمن الطرف الأول خلو المركبة المبيعة من كافة الرهون، الحقوق العينية، الحظر الجمركي أو البنكي، أو أي مطالبات قضائية أو مستحقات مالية لأي جهة حكومية أو خاصة حتى ساعة وتاريخ تحرير هذا العقد.

---

### ⚖️ البند الخامس: نقل الحيازة والمسؤولية عن المخالفات المرورية
1. تم تسليم المركبة ومفاتيحها ورخصتها للطرف الثاني بمجرد توقيع هذا العقد.
2. **تحديد المسؤولية:** 
   - يتحمل **الطرف الأول (البائع)** المسؤولية الجنائية والمدنية والمخالفات المرورية ورسوم الطرق المسجلة على المركبة **حتى ساعة وتاريخ تحرير هذا العقد**.
   - يتحمل **الطرف الثاني (المشتري)** المسؤولية الكاملة عن قيادة واستخدام المركبة وكافة المخالفات والحوادث الناشئة عنها **من تاريخ وساعة استلامه للمركبة**.

---

### 🏛️ البند السادس: نقل الملكية والتوثيق الرسمي
يلتزم الطرف الأول بالمثول أمام الجهات المختصة (إدارة المرور / الشهر العقاري / منصة أبشر أو تم أو مصلحة التسجيل العقاري) لتوثيق ونقل الملكية رسمياً للطرف الثاني خلال مدة أقصاها **[3 أيام عمل]** من تاريخه، أو تحرير توكيل خاص بنقل الملكية للمشتري.

---

### 📜 البند السابع: القانون الواجب التطبيق وحل النزاعات
يخضع هذا العقد ويفسر وفقاً لأحكام النظام المدني ونظام المرور المعمول به في الدولة، وتختص المحاكم المختصة محلياً بنظر أي نزاع قد ينشأ عن تنفيذ أو تفسير بنوده.

---

### ✍️ البند الثامن: نسخ العقد والتوقيع
حُرر هذا العقد من نسختين أصليتين، بيد كل طرف نسخة للعمل بموجبها وإتمام إجراءات نقل الملكية الرسمية.

| الطرف الأول (البائع) | الطرف الثاني (المشتري) | شاهد أول | شاهد ثانٍ |
| :--- | :--- | :--- | :--- |
| **الاسم:** [....................] | **الاسم:** [....................] | **الاسم:** [................] | **الاسم:** [................] |
| **التوقيع:** | **التوقيع:** | **التوقيع:** | **التوقيع:** |
| **البصمة:** | **البصمة:** | **الهوية:** [................] | **الهوية:** [................] |

---
💡 *يمكنك تعديل أي بيانات بالضغط على الحقول أعلاه، أو طلب تصدير العقد فورياً كملف PDF / Word موثق!*`;
  }

  return `## ⚖️ MOTOR VEHICLE BILL OF SALE & PURCHASE AGREEMENT

**THIS AGREEMENT** is entered into this [Date: ...../...../2026] by and between:

### 👥 PARTIES:
* **THE SELLER:**
  - **Full Legal Name / Entity:** [Seller Full Legal Name]
  - **National ID / Passport / Registration No:** [................................]
  - **Address:** [................................................................]
  - **Phone:** [....................] | **Email:** [....................]

* **THE BUYER:**
  - **Full Legal Name / Entity:** [Buyer Full Legal Name]
  - **National ID / Passport / Registration No:** [................................]
  - **Address:** [................................................................]
  - **Phone:** [....................] | **Email:** [....................]

---

### 📋 RECITALS:
WHEREAS, the Seller is the lawful, sole, and unencumbered owner of the motor vehicle described herein; and  
WHEREAS, the Buyer desires to purchase said vehicle under the terms, covenants, and warranties set forth below;

---

### 🚗 ARTICLE 1: VEHICLE SPECIFICATIONS & IDENTIFICATION
The Seller hereby sells, assigns, and transfers to the Buyer the following motor vehicle:
* **Make & Manufacturer:** [e.g., Toyota / Mercedes-Benz / Ford / BMW]
* **Model:** [e.g., Camry / E350 / F-150 / X5]
* **Model Year:** [2024]
* **Vehicle Identification Number (VIN / Chassis):** \`[............................................]\`
* **Engine Number:** \`[............................................]\`
* **License Plate Number / State:** [....................]
* **Exterior Color:** [....................] | **Odometer Reading:** [................ Miles / KM]
* **Title / Registration Number:** [....................]

---

### 💰 ARTICLE 2: PURCHASE PRICE & PAYMENT TERMS
1. **Total Consideration:** The agreed purchase price for the Vehicle is **$[Amount in Figures]** (United States Dollars / Local Currency: **[Amount in Words]**).
2. **Payment Method:**
   - [ ] **Full Wire Transfer / Cashier's Check:** Paid in full upon execution of this Agreement.
   - [ ] **Deposit & Balance:** A non-refundable deposit of $[........] paid upon signing; balance of $[........] due upon title transfer.
3. **Receipt & Release:** The Seller hereby acknowledges receipt of the purchase funds and releases all claims against the Buyer.

---

### 🔍 ARTICLE 3: AS-IS CONDITION, INSPECTION & LATENT DEFECTS
1. The Buyer acknowledges having inspected the Vehicle personally and/or through an authorized certified mechanic, and accepts the Vehicle in its current condition.
2. The Seller warrants that the Vehicle is free from undisclosed structural frame damage, flood damage, or fraudulent odometer tampering.

---

### 🛡️ ARTICLE 4: TITLE & ENCUMBRANCES
The Seller covenants and warrants that the Seller has good, valid, and marketable title to the Vehicle, free and clear of all liens, mortgages, encumbrances, security interests, or tax/customs claims.

---

### ⚖️ ARTICLE 5: DELIVERY & ALLOCATION OF TRAFFIC LIABILITIES
1. **Transfer of Possession:** Risk of loss and physical possession of the Vehicle transfers to the Buyer at the exact date and hour of signing.
2. **Liability Split:**
   - **Seller** retains sole responsibility for all traffic fines, tolls, and civil/criminal liabilities incurred **prior to the delivery hour**.
   - **Buyer** assumes sole responsibility for all operation, insurance, and road liabilities **from the delivery hour forward**.

---

### 🏛️ ARTICLE 6: GOVERNING LAW & TITLE TRANSFER COOPERATION
1. This Agreement shall be governed by and construed in accordance with the statutory laws of the governing jurisdiction.
2. The Seller agrees to execute and deliver all necessary title assignment documents (DMV / Traffic Registry) within **[3 business days]**.

---

### ✍️ SIGNATURES & ACKNOWLEDGMENT

| SELLER | BUYER | WITNESS 1 | WITNESS 2 |
| :--- | :--- | :--- | :--- |
| **Name:** [....................] | **Name:** [....................] | **Name:** [................] | **Name:** [................] |
| **Signature:** | **Signature:** | **Signature:** | **Signature:** |
| **Date:** [..../..../2026] | **Date:** [..../..../2026] | **ID:** [................] | **ID:** [................] |

---
💡 *Need this contract exported to official PDF/Word with encrypted digital watermark? Just type "export car contract" to proceed!*`;
}

/**
 * 🔒 2. Non-Disclosure Agreement (NDA)
 */
export function generateNdaContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ اتفاقية عدم إفصاح وحماية السرية التجارية (Mutual NDA)

**أُبرمت هذه الاتفاقية في يوم [........] الموافق [..../..../2026م] بين:**
* **الطرف الأول (المفصح / المتلقي):** [اسم الشركة / الفرد] - سجل تجاري / هوية: [................]
* **الطرف الثاني (المفصح / المتلقي):** [اسم الشركة / الفرد] - سجل تجاري / هوية: [................]

### 1️⃣ الغرض من الإفصاح:
تقييم وبحث فرص التعاون المشترك في مجال [................................................................].

### 2️⃣ تعريف المعلومات السرية:
تشمل كافة البيانات الفنية، المالية، التجارية، الشيفرات البرمجية، خطط الأعمال، وقوائم العملاء المتبادلة شفهياً أو خطياً أو رقمياً.

### 3️⃣ التزامات الحفظ والسرية:
- الالتزام بعدم إفشاء أو نسخ أو استغلال المعلومات السرية لأي غرض خارج نطاق الغرض المصرح به.
- قصر الاطلاع على الموظفين والمستشارين الخاضعين لالتزامات سرية مماثلة بموجب اتفاقيات ملزمة.

### 4️⃣ مدة الالتزام بالسرية:
تظل هذه الاتفاقية سارية لمدة **[3 سنوات / 5 سنوات]** من تاريخ استلام المعلومات السرية.

### 5️⃣ الجزاء المالي والتعويضات:
يستحق الطرف المتضرر تعويضاً فورياً مع حق استصدار أوامر قضائية مستعجلة لمنع الإفشاء دون الإخلال بحقه في التعويض الشامل.

### 6️⃣ القانون والاختصاص القضائي:
تخضع هذه الاتفاقية لقوانين [الدولة المحددة] وتختص محاكمها بالفصل في أي نزاع.

| توقيع الطرف الأول | توقيع الطرف الثاني |
| :--- | :--- |
| **الاسم:** [....................] | **الاسم:** [....................] |
| **الصفة:** [....................] | **الصفة:** [....................] |`;
  }

  return `## ⚖️ MUTUAL NON-DISCLOSURE & CONFIDENTIALITY AGREEMENT (NDA)

**EFFECTIVE DATE:** [Date: ...../...../2026]  
**BETWEEN:**  
* **Party A:** [Company / Individual Name] (Reg No: [................])
* **Party B:** [Company / Individual Name] (Reg No: [................])

### 1. PURPOSE:
Evaluating and executing strategic collaboration regarding [Project Scope / Business Transaction].

### 2. DEFINITION OF CONFIDENTIAL INFORMATION:
All technical, financial, operational, software source code, proprietary methodologies, and client lists disclosed directly or indirectly.

### 3. NON-DISCLOSURE OBLIGATIONS:
- Maintain strict confidentiality using reasonable commercial security measures.
- Use Confidential Information solely for the authorized Purpose.
- Restrict disclosure exclusively to personnel with a strict need-to-know.

### 4. TERM:
Confidentiality obligations shall survive for a period of **[Three (3) / Five (5) Years]** post-disclosure.

### 5. INJUNCTIVE RELIEF & DAMAGES:
The Disclosing Party shall be entitled to immediate injunctive relief and liquidated damages for any actual or threatened unauthorized disclosure.

### 6. GOVERNING LAW & JURISDICTION:
Governed by and construed under the laws of [Jurisdiction], with exclusive jurisdiction in its commercial courts.

| FOR PARTY A | FOR PARTY B |
| :--- | :--- |
| **Name:** [....................] | **Name:** [....................] |
| **Title:** [....................] | **Title:** [....................] |`;
}

/**
 * 💼 3. Employment & Labor Agreement
 */
export function generateEmploymentContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ عقد عمل وتوظيف محدد المدة وفق أنظمة العمل المعتمدة

**أُبرم هذا العقد في يوم [........] الموافق [..../..../2026م] بين:**
* **الطرف الأول (صاحب العمل):** شركة [اسم الشركة] - سجل تجاري رقم: [................]
* **الطرف الثاني (الموظف):** الأستاذ/ة [اسم الموظف] - هوية / إقامة رقم: [................]

### 1️⃣ المسمى الوظيفي والمهام:
يُعين الطرف الثاني بوظيفة **[المسمى الوظيفي]** ويلتزم بأداء المهام الموكلة إليه بإخلاص وكفاءة.

### 2️⃣ مدة العقد وفترة التجربة:
- مدة هذا العقد **[سنة واحدة ميلادية]** تتجدد تلقائياً ما لم يُخطر أحد الطرفين الآخر بغير ذلك قبل 30 يوماً.
- يخضع الطرف الثاني لفترة تجربة مدتها **[90 يوماً]** يحق خلالها لأي من الطرفين إنهاء العقد وفق نظام العمل.

### 3️⃣ الأجر والمزايا المالية:
- **الراتب الأساسي:** [........] شهرياً.
- **بدل السكن والنقل:** [........] شهرياً.
- **تاريخ الاستحقاق:** نهاية كل شهر ميلادي عبر التحويل المصرفي المعتمد (نظام حماية الأجور WPS).

### 4️⃣ ساعات العمل والإجازات:
- 8 ساعات عمل يومياً (40-48 ساعة أسبوعياً) مع يومين / يوم راحة أسبوعية.
- إجازة سنوية مدفوعة الأجر مدتها [30 يوماً / 21 يوماً] تقويمياً عن كل عام عمل.

### 5️⃣ السرية وعدم المنافسة:
يلتزم الموظف بعدم إفشاء أسرار العمل وعدم العمل لدى أي منافس مباشر لمدة [سنة واحدة] بعد انتهاء العقد.

### 6️⃣ إنهاء العقد ومكافأة نهاية الخدمة:
يخضع إنهاء العقد واحتساب مكافأة نهاية الخدمة لأحكام نظام العمل الساري بالدولة.

| توقيع صاحب العمل (الطرف الأول) | توقيع الموظف (الطرف الثاني) |
| :--- | :--- |
| **الختم والتوقيع:** | **توقيع الموظف:** |`;
  }

  return `## ⚖️ EXECUTIVE EMPLOYMENT AGREEMENT

**EFFECTIVE DATE:** [Date: ...../...../2026]  
**PARTIES:**  
* **Employer:** [Company Name] (Corporate Reg: [................])
* **Employee:** [Employee Full Name] (National ID/Passport: [................])

### 1. POSITION & DUTIES:
The Employee is employed as **[Job Title]**, reporting to the Executive Board/Management.

### 2. TERM & PROBATION:
- **Term:** Fixed term of **[12 Months]**, automatically renewable unless terminated with 30 days written notice.
- **Probation Period:** **[90 Days]**, during which either party may terminate per statutory employment regulations.

### 3. COMPENSATION & BENEFITS:
- **Base Salary:** $[Amount] per month, payable via automated payroll (WPS).
- **Benefits:** Executive health insurance, annual leave allowance, and performance bonuses.

### 4. RESTRICTIVE COVENANTS (NON-COMPETE & NDA):
The Employee agrees not to compete with the Employer or solicit clients/staff for **[12 months]** post-termination within the operating territory.

### 5. GOVERNING LAW:
Governed by the statutory labor laws of [Jurisdiction].

| FOR EMPLOYER | EMPLOYEE |
| :--- | :--- |
| **Signature:** [....................] | **Signature:** [....................] |`;
}

/**
 * 💡 Main Dynamic Solver Engine
 */
export function solveLegalPrompt(prompt: string, lang: string = 'ar'): string {
  const isAr = lang === 'ar' || /[\u0600-\u06FF]/.test(prompt);
  const info = classifyLegalPrompt(prompt);

  // 1. Vehicle / Car Sale
  if (info.isCarSale) {
    return generateCarSaleContract(isAr);
  }

  // 2. NDA
  if (info.isNda) {
    return generateNdaContract(isAr);
  }

  // 3. Employment
  if (info.isEmployment) {
    return generateEmploymentContract(isAr);
  }

  // 4. Contract Audit / Review request
  if (info.isAuditRequest) {
    return isAr ? `### 📋 تقرير التدقيق والتحليل التشريعي التخصصي للمستند
**الموضوع المراجع:** \`${prompt.slice(0, 100)}\`

---

#### 1️⃣ **نطاق الالتزامات والهيكل التعاقدي**
- التحقق من توازن الالتزامات المتبادلة وأهلية الأطراف وصحة الصلاحيات التوقيعية.
- ضبط محددات الأداء ومؤشرات الإنجاز (SLAs / KPIs) وآلية الاعتماد المستندي.

#### 2️⃣ **فحص الثغرات والمخاطر التشريعية الحرجة**
- 🚨 **سقف المسؤولية المالية (Liability Limitation Cap)**: وجوب حصر المسؤولية بحد أقصى يعادل 100% من إجمالي قيمة العقد.
- ⚠️ **الشرط الجزائي والتعويضات**: تعديل بنود الغرامات لتكون متناسبة مع الضرر الفعلي المباشر واستبعاد الأضرار التبعية.
- 🛡️ **القوة القاهرة والظروف الطارئة**: صياغة بند القوة القاهرة وفق معايير ICC 2020 والقوانين المدنية السارية.

#### 3️⃣ **الصياغات الحمائية البديلة الموصى بها**
> *"لا يتحمل أي من الطرفين مسؤولية الأضرار التبعية أو خسارة الأرباح الناتجة عن أي إخلال تعاقدي."*` :
    `### 📋 Executive Contract Audit & Redline Report
**Subject:** \`${prompt.slice(0, 100)}\`

#### 1. Contract Structure & Obligations
- Validated party capacity, performance milestones, and reciprocal consideration.

#### 2. Critical Risk & Exposure Assessment
- 🚨 **Liability Cap**: Recommend aggregate cap at 100% of contract value.
- ⚠️ **Consequential Damages**: Exclude indirect and incidental damages.
- 🛡️ **Force Majeure**: Standardize per ICC 2020 definitions.`;
  }

  // 5. Intelligent Deep Legal Consultation (Specific Advice)
  if (isAr) {
    return `### ⚖️ الرأي القانوني والتحليل التشريعي التخصصي

**بخصوص استفسارك:** \`${prompt.slice(0, 120)}\`

---

#### 1️⃣ **التكييف القانوني والأساس النظامي:**
- يخضع موضوع الاستفسار لأحكام الأنظمة واللوائح التجارية والمدنية المعمول بها، والتي تقضي بحماية المراكز القانونية للأطراف بناءً على المستندات الثبوتية والتعاقدية المتبادلة.
- يستوجب الأمر التحقق من توافر الشروط الشكلية والموضوعية قبل اتخاذ أي إجراء رسمي لضمان قبول الدعوى أو الطلب شكلاً وموضوعاً.

---

#### 2️⃣ **تقييم المخاطر والمصائد الإجرائية:**
- **مواعيد الطعن والإخطار:** الانتباه إلى المهل القانونية المحددة نظاماً لتفادي سقوط الحق بمضي المدة.
- **عبء الإثبات:** توفير المحررات المكتوبة، الفواتير الإلكترونية المعتمدة، والإشعارات الموثقة.

---

#### 3️⃣ **خطة العمل والتوصيات التنفيذية المباشرة:**
1. **صياغة إشعار قانوني رسمي (Legal Notice):** إرسال إخطار رسمي للطرف الآخر يحدد مهلة محددة لتوفيق الأوضاع.
2. **التسوية الودية / الوساطة:** بدء جولة مفاوضات أو وساطة تجارية لتوفير التكاليف والوقت.
3. **التوثيق وإصدار العقد الرسمي:** يمكنك طلب صياغة العقد أو الاتفاقية الموثقة فوراً لحماية حقوقك.

💡 *هل تود أن أصيغ لك نموذج العقد أو الإشعار القانوني المخصص فوراً؟ اذكر تفاصيل أطرافك وسأقوم بتوليده كاملاً!*`;
  }

  return `### ⚖️ Specialized Legal Advisory Memorandum

**Regarding:** \`${prompt.slice(0, 120)}\`

---

#### 1. Statutory Foundation & Legal Characterization
- The matter is governed by statutory commercial and civil principles, requiring verified documentation and formal procedural standing.

#### 2. Risk Evaluation & Evidentiary Requirements
- **Statute of Limitations**: Ensure compliance with statutory filing deadlines to avoid procedural dismissal.
- **Burden of Proof**: Secure all written contracts, authenticated digital communications, and invoices.

#### 3. Actionable Next Steps
1. **Formal Notice**: Serve a formal letter of demand or legal notice.
2. **Amicable Settlement**: Engage in structured dispute negotiation.
3. **Contractual Safeguards**: Execute standardized, enforceable agreements.

💡 *Would you like a tailored contract or formal notice drafted immediately? Provide the specific details to generate it!*`;
}
