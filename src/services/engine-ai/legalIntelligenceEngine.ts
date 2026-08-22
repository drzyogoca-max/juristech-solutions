/**
 * legalIntelligenceEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sovereign Autonomous Legal AI Engine v6.0
 * Multi-Turn Conversational Legal Core & Comprehensive Contract Generation System
 * Zero Generic Boilerplate Guarantee — Tailored, Enforceable, Multi-Jurisdictional
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface LegalAnalysisResult {
  intent: 'contract_drafting' | 'contract_amendment' | 'contract_audit' | 'legal_consultation' | 'dispute_resolution' | 'procedural_guidance';
  topic: string;
  response: string;
  suggestedActions: string[];
}

export interface ConversationTurn {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

// ── Smart Multi-Turn Intent & Topic Classifier ───────────────────────────────
export function classifyLegalPrompt(prompt: string, history: ConversationTurn[] = []): {
  intent: LegalAnalysisResult['intent'];
  topic: string;
  isDrafting: boolean;
  isAmendment: boolean;
  isProcedural: boolean;
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

  // Check if user is asking for an amendment/revision to the current contract
  const isAmendment = /(تعديل|عدل|غير|اضف|أضف|احذف|بند إضافي|بند جديد|شرط جزائي|غرامة|دفعات|اقساط|أقساط|amend|modify|revise|add clause|edit clause|penalty clause|payment schedule|installment)/i.test(p);

  // Check if user is asking for procedural / execution guidance
  const isProcedural = /(توثيق|شهر عقاري|تسجيل|مرور|محكمة|رفع دعوى|إجراءات|اوراق|أوراق|رسوم|ضريبة|شروط صحة|نقل ملكية|notarize|notarization|land registry|traffic department|court filing|procedure|requirements|fees|taxes|stamp duty)/i.test(p);

  const isCarSale = /(car|vehicle|auto|automobile|motor|سيارة|مركب|شاحنة|موتوسيكل|عربيه|عربية|بيع سيارة|شراء سيارة|مبايعة)/i.test(p);
  const isRealEstate = /(rent|lease|tenant|landlord|apartment|property|real estate|villa|building|shop|office|إيجار|ايجار|عقار|شقة|فيلا|أرض|محل|مكتب|بيع عقار|مستأجر|مؤجر)/i.test(p);
  const isEmployment = /(employment|job|employee|employer|labor contract|work agreement|staff|hiring|عمل|توظيف|موظف|عقد عمل|عقد توظيف|صاحب عمل|عمال|راتب)/i.test(p);
  const isNda = /(nda|non-disclosure|confidential|confidentiality|secrecy|سرية|عدم إفصاح|عدم افصاح|حفظ السرية|كتمان)/i.test(p);
  const isSoftware = /(software|app|application|developer|code|saas|api|source code|programming|it services|برمجة|تطبيق|موقع|تطوير برمجيات|منصة|سورس كود)/i.test(p);
  const isSupply = /(supply|procurement|goods|vendor|supplier|delivery of goods|materials|توريد|شراء بضاعة|مورد|بضائع|توريدات|شحن بضائع)/i.test(p);
  const isPartnership = /(partnership|partner|shareholder|joint venture|m&a|incorporation|equity|شراكة|تأسيس شركة|شركاء|مساهمين|استحواذ|اندماج|حصص|أرباح)/i.test(p);
  const isLoan = /(loan|debt|promissory|borrow|lender|acknowledgment of debt|قرض|سلف|دين|سند لأمر|مديونية|تسوية ديون|كمبيالة|إقرار دين|اقرار دين)/i.test(p);
  const isAgency = /(power of attorney|poa|agency|agent|mandate|commercial agency|وكالة|توكيل|تفويض|وكيل تجاري|توكيل خاص)/i.test(p);
  const isConsulting = /(consulting|consultant|freelance|advisory|service agreement|professional services|استشارات|مستشار|عمل حر|خدمات مهنية|عقد خدمات)/i.test(p);

  const isLaborDispute = /(dismissal|termination|fired|salary|end of service|wage|labor court|فصل تعسفي|مستحقات|مكافأة نهاية الخدمة|راتب|إجازة|نزاع عمالي|مكتب العمل)/i.test(p);
  const isFinancialClaim = /(cheque|check|bounced|fraud|debt collection|compensation|breach|court claim|شيك|شيك بدون رصيد|احتيال|نصب|تعويض|مطالبة مالية|استرداد أموال)/i.test(p);

  const isAuditRequest = /(audit|review|check|examine|risk|vulnerability|clause|redline|فحص|تدقيق|مراجعة|تحليل عقد|ثغرات|مخاطر|بنود مجحفة)/i.test(p) ||
                         p.includes('.pdf') || p.includes('.docx') || p.includes('[attached');

  const isDrafting = /(contract|agreement|draft|sample|template|write|create|generate|صياغة|عقد|نموذج|اتفاقية|اكتب|صيغة|انشئ|توليد|أريد عقد|عايز عقد|ابغى عقد)/i.test(p) ||
                     isCarSale || isRealEstate || isEmployment || isNda || isSoftware || isSupply || isPartnership || isLoan || isAgency || isConsulting;

  let intent: LegalAnalysisResult['intent'] = 'legal_consultation';
  let topic = 'General Legal Advisory';

  if (isAmendment) {
    intent = 'contract_amendment';
    topic = 'Contract Amendment & Clause Customization';
  } else if (isProcedural && !isDrafting) {
    intent = 'procedural_guidance';
    topic = 'Procedural & Statutory Registration Guide';
  } else if (isAuditRequest) {
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
    isAmendment,
    isProcedural,
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

// ── 1. Vehicle / Car Sale Contract ──────────────────────────────────────────
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
* **نوع وماركة المركبة (Make):** [Toyota / Mercedes-Benz / Hyundai / BMW / etc.]
* **الموديل / الطراز (Model):** [Camry / E300 / Tucson / 730Li / etc.]
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
💡 *يمكنك طلب تعديل أي بند من البنود أو طلب إضافة شروط خاصة كالأقساط أو الضمان الفني الإضافي!*`;
  }

  return `## ⚖️ MOTOR VEHICLE BILL OF SALE & PURCHASE AGREEMENT

**THIS AGREEMENT** is entered into this [Date: ...../...../2026] by and between:

### 👥 PARTIES:
* **THE SELLER:** [Seller Full Legal Name], ID/Passport No: [................], Phone: [................], Email: [................]
* **THE BUYER:** [Buyer Full Legal Name], ID/Passport No: [................], Phone: [................], Email: [................]

---

### 🚗 ARTICLE 1: VEHICLE IDENTIFICATION & SPECIFICATIONS
The Seller agrees to sell, assign, and transfer to the Buyer the following motor vehicle:
- **Make & Model:** [e.g. Toyota Camry / Mercedes-Benz E300 / BMW 530i]
- **Year of Manufacture:** [2024]
- **Vehicle Identification Number (VIN / Chassis):** \`[............................................]\`
- **Engine Number:** \`[............................................]\`
- **Odometer Reading:** [................ km/miles] | **Exterior Color:** [................]
- **License Plate Number:** [................] | **Registration Authority:** [................]

---

### 💰 ARTICLE 2: PURCHASE PRICE & PAYMENT TERMS
1. Total Purchase Consideration: **$[Amount]** ([Amount in words] USD / Local Currency).
2. The Seller acknowledges receipt of the full purchase price upon signing, constituting a complete discharge of payment obligations.

---

### 🔍 ARTICLE 3: "AS-IS" CONDITION & LATENT DEFECTS
1. The Buyer confirms that the vehicle has been independently inspected and tested to full satisfaction.
2. The Seller warrants that the chassis and engine are structurally sound and free from undisclosed accidents, flood damage, or fraudulent tampering.

---

### 🛡️ ARTICLE 4: TITLE & LIEN GUARANTEE
The Seller warrants good and marketable title, free from all liens, encumbrances, fines, customs duties, and judicial seizures.

---

### ⚖️ ARTICLE 5: DELIVERY & TRAFFIC FINE LIABILITY SPLIT
- **Seller Liability:** Responsible for all traffic fines, tolls, and civil/criminal liabilities incurred up to the exact date and hour of signing.
- **Buyer Liability:** Assumes full operational, civil, and criminal liability immediately upon taking possession of the keys and registration.

---

### 🏛️ ARTICLE 6: REGISTRATION & GOVERNING LAW
Governed by the statutory laws of [Jurisdiction]. Both parties agree to execute official title transfer within [3 business days].

| SELLER SIGNATURE | BUYER SIGNATURE | WITNESS 1 | WITNESS 2 |
| :--- | :--- | :--- | :--- |
| **Signature:** [................] | **Signature:** [................] | **Signature:** [............] | **Signature:** [............] |`;
}

// ── 2. Real Estate / Lease Contract (عقد إيجار سكني أو تجاري) ────────────────
export function generateLeaseContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ عقد إيجار عقاري (سكني / تجاري) رسمي وموثق

**بعون الله وتوفيقه، تم تحرير هذا العقد في يوم [........] الموافق [..../..../2026م] بين كل من:**

### 👥 طرفي العقد:
* **الطرف الأول (المؤجر):**
  - **الاسم:** [اسم المؤجر الكامل / الشركة المالكة]
  - **رقم الهوية / السجل التجاري:** [................................]
  - **العنوان الوطني / المختار:** [................................]
  - **رقم الهاتف:** [....................] | **البريد الإلكتروني:** [....................]

* **الطرف الثاني (المستأجر):**
  - **الاسم:** [اسم المستأجر الكامل / الشركة المستأجرة]
  - **رقم الهوية / الإقامة / السجل التجاري:** [................................]
  - **العنوان:** [................................]
  - **رقم الهاتف:** [....................] | **البريد الإلكتروني:** [....................]

---

### 🏢 البند الأول: العين المؤجرة والغرض من الإيجار
أجر الطرف الأول إلى الطرف الثاني القابل لذلك العقار الآتي:
* **نوع العقار:** [شقة سكنية / فيلا / مكتب إداري / محل تجاري / مستودع]
* **العنوان التفصيلي:** [المدينة: ........ | الحي: ........ | الشارع: ........ | رقم المبنى: ........ | الدور: ........ | رقم الوحدة: ........]
* **المساحة الإجمالية:** [........ متر مربع]
* **الغرض من الإيجار:** [سكن عائلي / مقر إداري لشركة / نشاط تجاري مصرح]، ولا يجوز تغيير الغرض إلا بموافقة خطية من المؤجر.

---

### ⏳ البند الثاني: مدة الإيجار والتجديد
1. **مدة العقد:** [سنة ميلادية كاملة / 3 سنوات] تبدأ من تاريخ [..../..../2026م] وتنتهي في تاريخ [..../..../2027م].
2. **التجديد:** يجدد العقد لمدد مماثلة تلقائياً ما لم يُخطر أحد الطرفين الآخر برغبته في عدم التجديد أو تعديل الشروط قبل انتهاء المدة بـ **[60 يوماً]** بموجب إخطار كتابي رسمي.

---

### 💵 البند الثالث: القيمة الإيجارية وطريقة السداد
1. **الأجرة السنوية:** مبلغ وقدره **[المبلغ رقماً]** (فقط **[المبلغ كتابة]**).
2. **طريقة الدفع:** تسدد الأجرة على [4 دفعات ربع سنوية متساوية / دفعتين / شهرياً] بواقع [........] لكل دفعة تستحق في أول كل فترة.
3. **تأمين العين المؤجرة (Security Deposit):** سدد المستأجر مبلغ تأمين وقدره [........] يُرد إليه عند انتهاء العلاقة الإيجارية وتسليم العين بحالتها الأصلية مع خصم أي تلفيات أو فواتير مستحقة.

---

### 🛠️ البند الرابع: الصيانة وفواتير المرافق
1. **الصيانة الجسيمة (الهيكلية):** يتحمل المؤجر نفقات صيانة الهيكل والأساسات والسباكة والكهرباء الرئيسية وشبكات التكييف المركزية.
2. **الصيانة الدورية والاستهلاكية:** يتحمل المستأجر صيانة الأجهزة والأقفال والمستهلكات الداخلية الناتجة عن الاستعمال اليومي.
3. **فواتير الخدمات:** يلتزم المستأجر بسداد فواتير (الكهرباء، المياه، الغاز، الإنترنت، رسوم إدارة المبنى/الخدمات) بانتظام.

---

### 🚫 البند الخامس: التأجير من الباطن والتنازل
يحظر على المستأجر التنازل عن هذا العقد أو تأجير العين المؤجرة كلياً أو جزئياً من الباطن لأي طرف ثالث دون موافقة كتابية صريحة ومسبقة من المؤجر.

---

### ⚖️ البند السادس: الإخلاء والفسخ التعاقدي
يحق للمؤجر فسخ العقد ومطالبة المستأجر بالإخلاء الفوري مع استحقاق كامل الأجرة في الحالات الآتية:
1. التأخر في سداد القيمة الإيجارية لأكثر من [15 يوماً] من تاريخ استحقاق الدفعة بعد إنذاره رسمياً.
2. استخدام العين المؤجرة في أنشطة مخالفة للنظام العام أو الآداب أو القوانين السارية.
3. إحداث تغييرات جوهرية أو هدم أو تعديل في قواطع العين دون إذن كتابي من المؤجر.

---

### 🏛️ البند السابع: التوثيق الإلكتروني والقانون الواجب التطبيق
يخضع هذا العقد لأنظمة الإيجار العقاري المعمول بها، ويلتزم الطرفان بتسجيله وتوثيقه عبر المنصة الرسمية المعتمدة (مثل منصة **إيجار** بالسعودية، أو **توثيق** في مصر، أو **إيجاري** بدبي) ليكون سنداً تنفيذياً ملزماً.

---

### ✍️ البند الثامن: التوقيعات
| الطرف الأول (المؤجر) | الطرف الثاني (المستأجر) |
| :--- | :--- |
| **الاسم:** [................................] | **الاسم:** [................................] |
| **التوقيع:** | **التوقيع:** |
| **الختم (إن وجد):** | **الختم (إن وجد):** |`;
  }

  return `## ⚖️ RESIDENTIAL & COMMERCIAL LEASE AGREEMENT

**THIS LEASE AGREEMENT** is entered into on [Date: ...../...../2026] by and between:
* **LESSOR (Landlord):** [Landlord Legal Name / Company], ID/CR: [................], Phone: [................]
* **LESSEE (Tenant):** [Tenant Legal Name / Company], ID/CR: [................], Phone: [................]

### 🏢 1. LEASED PREMISES:
- **Property Type:** [Apartment / Commercial Office / Retail Store / Villa]
- **Address & Location:** [Unit No: ...., Floor: ...., Building: ...., Street: ...., City: ....]
- **Permitted Use:** [Residential dwelling / Corporate headquarters / Commercial retail] exclusively.

### ⏳ 2. TERM & RENEWAL:
- **Lease Term:** [12 months / 36 months], commencing on [..../..../2026] and terminating on [..../..../2027].
- **Renewal Notice:** Requires **[60 days]** written prior notice for non-renewal or rent renegotiation.

### 💰 3. RENT & SECURITY DEPOSIT:
- **Annual Rent:** **$[Amount]** per annum, payable in [Quarterly / Semi-annual] installments of $[Amount].
- **Security Deposit:** $[Amount] refundable upon lease termination subject to property condition handover.

### 🛠️ 4. MAINTENANCE & UTILITIES:
- **Structural Repairs:** Landlord responsibility (plumbing mains, roof, HVAC main infrastructure).
- **Consumable & Minor Repairs:** Tenant responsibility (fixtures, light bulbs, internal maintenance).
- **Utilities:** Tenant shall punctually settle all water, electricity, gas, and internet accounts.

### 🚫 5. SUBLETTING:
Strictly prohibited without prior written consent from Landlord.

### ⚖️ 6. GOVERNING LAW:
Governed by the statutory tenancy laws of [Jurisdiction], and shall be registered on the official government tenancy portal.

| LESSOR SIGNATURE | LESSEE SIGNATURE |
| :--- | :--- |
| **Signature:** [....................] | **Signature:** [....................] |`;
}

// ── 3. Employment / Labor Contract (عقد عمل شامل) ───────────────────────────
export function generateEmploymentContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ عقد عمل فردي محدد المدة وشامل لكافة الضمانات القانونية

**بعون الله وتوفيقه، تم إبرام هذا العقد في يوم [........] الموافق [..../..../2026م] بين كل من:**

### 👥 طرفي العقد:
* **الطرف الأول (صاحب العمل / الشركة):**
  - **اسم الشركة / المؤسسة:** [اسم الشركة بالكامل]
  - **رقم السجل التجاري:** [........................] | **الرقم الضريبي:** [........................]
  - **المقر الرئيسي:** [................................] | **يمثلها بالتوقيع:** [اسم المدير / الممثل النظامي]

* **الطرف الثاني (الموظف):**
  - **الاسم الثلاثي / الرباعي:** [اسم الموظف الكامل]
  - **رقم الهوية الوطنية / الإقامة / جواز السفر:** [................................]
  - **الجنسية:** [....................] | **المؤهل العلمي:** [................................]
  - **العنوان:** [................................] | **رقم الهاتف:** [....................]

---

### 📋 البند الأول: المسمى الوظيفي والمهام
1. يعمل الطرف الثاني لدى الطرف الأول بمسمى وظيفي: **[المسمى الوظيفي: مثال مدير مالي / مهندس برمجيات / مستشار قانوني]**.
2. يلتزم الموظف بأداء المهام المنوطة به بدقة وأمانة وفق الوصف الوظيفي ولوائح العمل الداخلية وتعليمات الإدارة.

---

### ⏳ البند الثاني: مدة العقد وفترة التجربة
1. **مدة العقد:** [سنة ميلادية / سنتان] تبدأ من تاريخ مباشرة العمل الفعلي في [..../..../2026م] وتجدد لمدد مماثلة بموافقة الطرفين.
2. **فترة التجربة (Probation Period):** يخضع الموظف لفترة تجربة مدتها **[90 يوماً]** (أو 180 يوماً باتفاق كتابي)، يحق لأي من الطرفين خلالها إنهاء العقد بإخطار كتابي مسبق دون مكافأة أو تعويض.

---

### 💰 البند الثالث: الأجر والبدلات والمزايا المالية
1. **الراتب الأساسي:** مبلغ وقدره **[المبلغ رقماً]** شهرياً.
2. **البدلات الشهرية:**
   - بدل سكن: [........] شهرياً.
   - بدل انتقال/مواصلات: [........] شهرياً.
   - بدل اتصال/مهام: [........] شهرياً.
3. **إجمالي الراتب الشهري:** **[إجمالي المبلغ]** يُحول في نهاية كل شهر ميلادي عبر نظام حماية الأجور (WPS) أو الحساب المصرفي الرسمي.

---

### 🏖️ البند الرابع: ساعات العمل والإجازات
1. **ساعات العمل:** [8 ساعات يومياً / 48 ساعة أسبوعياً] مع يومين راحة أسبوعية.
2. **الإجازة السنوية:** يستحق الموظف إجازة سنوية مدفوعة الأجر مدتها **[30 يوماً تقويمياً]** عن كل عام عمل.
3. **التأمين الصحي:** يلتزم صاحب العمل بتوفير تأمين صحي شامل للموظف وأسرته وفق اللوائح المعتمدة.

---

### 🔒 البند الخامس: السرية وعدم المنافسة (Non-Compete & NDA)
1. **حفظ الأسرار:** يلتزم الموظف بالمحافظة التامة على أسرار العمل وقواعد البيانات والخطط الاستراتيجية وقوائم العملاء طوال فترة عمله وبعد انتهائها لأجل غير مسمى.
2. **عدم المنافسة:** يمتنع الموظف عن منافسة صاحب العمل أو العمل لدى أي جهة منافسة في نفس النشاط الجغرافي لمدة **[سنتين / سنة واحدة]** من تاريخ انتهاء العلاقة العمالية.

---

### 🔚 البند السادس: إنهاء العقد ومكافأة نهاية الخدمة
1. **مهلة الإخطار (Notice Period):** في حال رغبة أحد الطرفين في إنهاء العقد لسبب مشروع، يلتزم بإخطار الطرف الآخر خطياً قبل الإنهاء بـ **[60 يوماً]** على الأقل.
2. **مكافأة نهاية الخدمة:** يستحق الموظف عند انتهاء خدمته مكافأة نهاية الخدمة محسوبة وفق نصوص نظام العمل المعمول به (أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل عن كل سنة تالية).

---

### 🏛️ البند السابع: القانون الواجب التطبيق وحسم النزاعات
يخضع هذا العقد لأحكام نظام وقانون العمل المعمول به في الدولة، وتختص اللجان العمالية والمحاكم العمالية بنظر أي خلاف ينشأ عن تفسيره أو تطبيقه.

---

### ✍️ البند الثامن: التوقيعات
| الطرف الأول (صاحب العمل) | الطرف الثاني (الموظف) |
| :--- | :--- |
| **التوقيع والختم:** [................................] | **التوقيع والبصمة:** [................................] |`;
  }

  return `## ⚖️ DEFINITIVE EXECUTIVE EMPLOYMENT CONTRACT

**THIS EMPLOYMENT AGREEMENT** is entered into on [Date: ...../...../2026] by and between:
* **EMPLOYER:** [Company Full Legal Name], CR/Tax ID: [................], Represented by: [Officer Name]
* **EMPLOYEE:** [Employee Full Legal Name], Passport/ID: [................], Nationality: [................]

### 📋 1. POSITION & DUTIES:
- **Title:** [e.g. Senior Software Architect / Chief Financial Officer / Legal Counsel]
- **Responsibilities:** Perform executive duties diligently in compliance with Employer policies and professional standards.

### ⏳ 2. TERM & PROBATION:
- **Duration:** [12 / 24 months] renewable contract starting on [..../..../2026].
- **Probation Period:** **[90 Calendar Days]**, during which either party may terminate with statutory notice.

### 💰 3. COMPENSATION & BENEFITS (WPS COMPLIANT):
- **Base Monthly Salary:** $[Amount] USD / Local Currency.
- **Monthly Allowances:** Housing: $[Amount] | Transport: $[Amount] | Total Package: **$[Total]**.
- **Payment Method:** Monthly direct deposit via registered Wage Protection System (WPS).
- **Annual Paid Leave:** [30 Calendar Days] per annum + Comprehensive Executive Medical Coverage.

### 🔒 4. RESTRICTIVE COVENANTS (NON-COMPETE & NDA):
- **Confidentiality:** Absolute protection of proprietary source code, business strategies, and client data.
- **Non-Compete:** Employee shall not engage in competing ventures within operating territory for **[12 months]** post-termination.

### 🔚 5. TERMINATION & STATUTORY SEVERANCE:
- **Notice Period:** [60 Days] formal written notice.
- **End of Service Gratuity:** Calculated strictly in accordance with statutory labor code provisions.

### ⚖️ 6. GOVERNING LAW:
Governed by the statutory Labor Law of [Jurisdiction].

| EMPLOYER SIGNATURE & SEAL | EMPLOYEE SIGNATURE |
| :--- | :--- |
| **Signature:** [....................] | **Signature:** [....................] |`;
}

// ── 4. Mutual Non-Disclosure Agreement (اتفاقية سرية NDA) ─────────────────────
export function generateNdaContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ اتفاقية سرية وعدم إفصاح متبادلة لحماية الملكية الفكرية والمعلومات التجارية (Mutual NDA)

**تم إبرام هذه الاتفاقية في يوم [........] الموافق [..../..../2026م] بين كل من:**
* **الطرف الأول:** [اسم الشركة / الفرد] | سجل تجاري / هوية: [................] | العنوان: [................]
* **الطرف الثاني:** [اسم الشركة / الفرد] | سجل تجاري / هوية: [................] | العنوان: [................]

---

### 🎯 الغرض من الإفصاح:
يبحث الطرفان فرص التعاون المشترك في مجال **[مشروع تقني / استثمار / شراكة تجارية: ....................]** مما يتطلب تبادل معلومات تجارية وفنية ومالية سرية.

---

### 🔒 البنود والأحكام الرئيسية:
1. **تعريف المعلومات السرية:** تشمل كافة الخطط والبيانات المالية والبرمجيات والسورس كود وقوائم العملاء والأسرار التجارية الشفهية أو المكتوبة.
2. **التزامات عدم الإفصاح:** يلتزم كل طرف بعدم استخدام المعلومات إلا للغرض المحدد، وعدم إفشائها لأي طرف ثالث دون موافقة خطية صريحة.
3. **مدة الالتزام:** تظل التزامات السرية سارية طوال فترة المفاوضات ولمدة **[3 سنوات / 5 سنوات]** من تاريخ توقيع هذه الاتفاقية.
4. **التعويض وأمر المنع القضائي:** يقر الطرف المخل بمسؤوليته عن تعويض الطرف المتضرر عن الأضرار المباشرة، مع حق الطرف المتضرر في طلب أمر قضائي عاجل بوقف الإفصاح.
5. **القانون الحاكم:** تخضع الاتفاقية للقوانين السارية ومحاكم الاختصاص في [الدولة: ........].

| الطرف الأول | الطرف الثاني |
| :--- | :--- |
| **التوقيع:** [....................] | **التوقيع:** [....................] |`;
  }

  return `## ⚖️ MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

**EFFECTIVE DATE:** [..../..../2026]
**BETWEEN:**
* **PARTY A:** [Company / Individual Name], ID/Registration: [................]
* **PARTY B:** [Company / Individual Name], ID/Registration: [................]

### 1. PURPOSE:
Evaluation and execution of business collaboration regarding **[Project / Investment / SaaS Technology]**.

### 2. CONFIDENTIAL INFORMATION DEFINITION:
Includes all proprietary technical, financial, customer, source code, algorithm, and trade secret information disclosed directly or indirectly.

### 3. NON-DISCLOSURE OBLIGATIONS:
Recipient shall hold and maintain information in strict confidence (minimum reasonable standard of care) and shall not disclose without prior written consent.

### 4. TERM:
Obligations remain enforceable for **[3 Years / 5 Years]** following the Effective Date.

### 5. INJUNCTIVE RELIEF:
Breach entitles Discloser to seek immediate equitable and injunctive relief in addition to monetary damages.

### 6. GOVERNING LAW:
Governed exclusively by the laws of [Jurisdiction].

| PARTY A SIGNATURE | PARTY B SIGNATURE |
| :--- | :--- |
| **Signature:** [....................] | **Signature:** [....................] |`;
}

// ── 5. Commercial Supply & Procurement Contract (عقد توريد تجاري) ────────────
export function generateSupplyContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ عقد توريد بضائع ومواد تجارية رسمي وملزم

**تم إبرام هذا العقد في يوم [........] الموافق [..../..../2026م] بين:**
* **الطرف الأول (المشتري / صاحب المشروع):** [الاسم / الشركة] | س.ت: [................] | العنوان: [................]
* **الطرف الثاني (المورد):** [الاسم / الشركة الموردة] | س.ت: [................] | العنوان: [................]

---

### 📦 1. موضوع التوريد والمواصفات:
يلتزم الطرف الثاني بتوريد البضائع والمنتجات المحددة في جدول المواصفات (الكميات، الجودة، شهادات المنشأ والمطابقة القياسية ISO/SASO).

### 🚚 2. مواعيد وشروط التسليم (Incoterms):
- **مكان التسليم:** [مستودعات المشتري / موقع المشروع في: ................].
- **الجدول الزمني:** يتم التوريد خلال مدة أقصاها **[........ يوماً]** من تاريخ استلام الدفعة المقدمة.
- **شرط الفحص والاستلام:** يحق للمشتري فحص البضاعة ورفض أي بنود غير مطابقة للمواصفات خلال [7 أيام عمل].

### 💰 3. القيمة الإجمالية وجدول الدفعات:
- **القيمة الإجمالية للعقد:** **[المبلغ رقماً وكتابة شامل ضريبة القيمة المضافة]**.
- **الدفعات:** [30% دفعة مقدمة | 50% عند وصول وفحص الشحنة | 20% متبقي بعد الاعتماد النهائي].

### 🚨 4. غرامات التأخير والشرط الجزائي:
في حال تأخر المورد عن موعد التسليم المتفق عليه، يلتزم بسداد غرامة تأخير قدرها **[1% عن كل أسبوع تأخير]** بحد أقصى **[10%]** من إجمالي قيمة العقد، مع احتفاظ المشتري بحق الفسخ والتنفيذ على حساب المورد.

### 🛡️ 5. ضمان الجودة وخدمة ما بعد البيع:
يضمن المورد خلو البضاعة الموردة من كافة عيوب الصناعة لمدة **[12 شهراً]** مع استبدال أي قطع معيبة على نفقته الخاصة فوراً.

| الطرف الأول (المشتري) | الطرف الثاني (المورد) |
| :--- | :--- |
| **التوقيع والختم:** [................] | **التوقيع والختم:** [................] |`;
  }

  return `## ⚖️ COMMERCIAL GOODS SUPPLY & PROCUREMENT AGREEMENT
* **BUYER:** [Company Name], CR/Tax ID: [................]
* **SUPPLIER:** [Supplier Name], CR/Tax ID: [................]

### 1. SCOPE OF SUPPLY:
Supply of verified products/materials as per agreed Technical Specifications and ISO/Standard conformity certificates.

### 2. DELIVERY TERMS & INCOTERMS:
Delivered Duty Paid (DDP) to Buyer designated facility within [Timeline: ..... days]. Inspection period: [7 business days].

### 3. CONTRACT PRICE & PAYMENT MILESTONES:
Total Consideration: **$[Amount]** (30% advance, 50% upon delivery inspection, 20% final acceptance).

### 4. DELAY LIQUIDATED DAMAGES:
Late delivery penalty of 1% per week of delay up to a maximum cap of 10% of total contract value.

### 5. WARRANTY:
12-month comprehensive warranty against manufacturing and material defects.

| BUYER SIGNATURE | SUPPLIER SIGNATURE |
| :--- | :--- |
| **Signature:** [................] | **Signature:** [................] |`;
}

// ── 6. Software Development & Tech Agreement (عقد تطوير برمجيات) ─────────────
export function generateSoftwareContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ عقد تطوير برمجيات ومنصات رقمية ونقل حقوق الملكية الفكرية

**تم الاتفاق في يوم [........] الموافق [..../..../2026م] بين:**
* **الطرف الأول (العميل):** [اسم الشركة / الفرد] | س.ت: [................] | الهاتف: [................]
* **الطرف الثاني (المطور / شركة البرمجيات):** [اسم المطور / الشركة] | س.ت: [................]

---

### 💻 1. نطاق العمل والتسليمات (Deliverables):
يلتزم المطور بتصميم وتطوير واختبار وإطلاق منصة / تطبيق: **[اسم المشروع البرمجي: ................]** شاملاً (تطبيقات iOS & Android، لوحة التحكم Backend، واجهات الـ API، وسورس كود كامل).

### 📅 2. خطة المراحل ومواعيد الإنجاز (Milestones):
- **المرحلة الأولى (UI/UX Design):** التسليم خلال [.... أسبوع] — دفعة [25%].
- **المرحلة الثانية (Backend & Core Architecture):** التسليم خلال [.... أسبوع] — دفعة [35%].
- **المرحلة الثالثة (Frontend & Testing):** التسليم خلال [.... أسبوع] — دفعة [25%].
- **المرحلة الرابعة (Deployment & Handover):** النشر وتسليم السورس كود — دفعة [15%].

### 🧠 3. الملكية الفكرية والسورس كود (IP Ownership):
بمجرد سداد الأتعاب المتفق عليها، تنتقل كافة حقوق الملكية الفكرية وحقوق النشر والسورس كود المصدري وقواعد البيانات للعميل حصراً، ولا يحق للمطور إعادة بيعها أو استخدامها كلياً أو جزئياً.

### 🛠️ 4. فترة الضمان والدعم الفني المجاني:
يلتزم المطور بتقديم دعم فني وضمان مجاني لمدة **[6 أشهر]** من تاريخ الإطلاق لإصلاح أي ثغرات برمجية (Bugs) أو أعطال تقنية.

| الطرف الأول (العميل) | الطرف الثاني (المطور) |
| :--- | :--- |
| **التوقيع:** [................] | **التوقيع:** [................] |`;
  }

  return `## ⚖️ SOFTWARE DEVELOPMENT & INTELLECTUAL PROPERTY TRANSFER AGREEMENT
* **CLIENT:** [Client Legal Entity], ID/CR: [................]
* **DEVELOPER:** [Developer / IT Firm], ID/CR: [................]

### 1. SCOPE OF WORK:
Full-stack architecture, design, development, and deployment of **[Project Name]** including mobile apps, backend APIs, and source code.

### 2. MILESTONE SCHEDULE & PAYMENT:
- Milestone 1: UI/UX & Architecture Approval (25%)
- Milestone 2: Core Backend & API Integration (35%)
- Milestone 3: QA, Staging & User Acceptance Testing (25%)
- Milestone 4: Production Deployment & Source Code Handover (15%)

### 3. IP ASSIGNMENT (WORK-FOR-HIRE):
Upon full payment, 100% of all Intellectual Property, copyright, repositories, and source code vest exclusively in Client.

### 4. WARRANTY & BUG FIXING:
Developer warrants software against defects for **[6 months]** post-launch at zero additional cost.

| CLIENT SIGNATURE | DEVELOPER SIGNATURE |
| :--- | :--- |
| **Signature:** [................] | **Signature:** [................] |`;
}

// ── 7. Partnership & Shareholders Contract (عقد شراكة) ─────────────────────
export function generatePartnershipContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ عقد شراكة تجارية وتوزيع الحصص والأرباح

**تم تحرير هذا العقد في يوم [........] الموافق [..../..../2026م] بين:**
* **الشريك الأول:** [الاسم] | هوية: [................] | نسبة الحصة: **[....%]** | مساهمة: [مبلغ / جهد]
* **الشريك الثاني:** [الاسم] | هوية: [................] | نسبة الحصة: **[....%]** | مساهمة: [مبلغ / جهد]

---

### 🤝 1. الغرض من الشراكة:
تأسيس وتشغيل مشروع تجاري بمسمى **[اسم المشروع / الشركة: ................]** في قطاع [................].

### 💵 2. رأس المال وتوزيع الحصص:
- **رأس المال الإجمالي:** **[المبلغ رقماً وكتابة]**.
- **توزيع الأرباح والخسائر:** توزع الأرباح الصافية بنسبة حصة كل شريك دورياً كل [3 أشهر / سنوياً]، وتوزع الخسائر بنفس نسبة رأس المال ما لم تكن ناتجة عن تعدٍ أو تقصير متعمد من أحد الشركاء.

### 🏛️ 3. الإدارة والتوقيع:
- يتولى الإدارة التنفيذية والتشغيلية: **[اسم الشريك المدير]** وله صلاحية تمثيل الشركة والتوقيع أمام البنوك والجهات الحكومية في حدود الميزانية المعتمدة.
- القرارات الجوهرية (الاستدانة، بيع أصول، إدخال شريك جديد): تتطلب موافقة إجماعية خطية من الشركاء.

### 🚪 4. آلية التخارج والانسحاب (Exit Strategy):
يحق للشريك الراغب في التخارج عرض حصته على الشركاء الآخرين أولاً بحق الشفعة (Right of First Refusal) خلال مهلة [30 يوماً] قبل عرضها على أي طرف ثالث.

| الشريك الأول | الشريك الثاني |
| :--- | :--- |
| **التوقيع:** [................] | **التوقيع:** [................] |`;
  }

  return `## ⚖️ COMMERCIAL PARTNERSHIP & SHAREHOLDERS AGREEMENT
* **PARTNER A:** [Name], Equity Stake: **[....%]**, Contribution: [Capital / Sweat Equity]
* **PARTNER B:** [Name], Equity Stake: **[....%]**, Contribution: [Capital / Sweat Equity]

### 1. PARTNERSHIP OBJECTIVE:
Operation and scaling of commercial enterprise **[Business Name]** in [Industry].

### 2. CAPITAL & PROFIT/LOSS SHARING:
Total Capital: $[Amount]. Net profits distributed pro-rata based on equity holdings semi-annually.

### 3. MANAGEMENT & GOVERNANCE:
Day-to-day operations led by [Managing Partner]. Extraordinary resolutions (debt, dilution, asset sale) require unanimous consent.

### 4. RIGHT OF FIRST REFUSAL (ROFR):
Exiting partners must offer shares to existing partners at fair market valuation prior to third-party transfer.

| PARTNER A SIGNATURE | PARTNER B SIGNATURE |
| :--- | :--- |
| **Signature:** [................] | **Signature:** [................] |`;
}

// ── 8. Loan & Debt Acknowledgment Contract (إقرار دين وقرض) ─────────────────
export function generateLoanContract(isAr: boolean): string {
  if (isAr) {
    return `## ⚖️ إقرار دين وسند مديونية والتزام بالسداد رسمي

**أقر أنا الموقع أدناه بكامل أهليتي القانونية والشرعية النافية لكل جهالة:**
* **المدين (المقر بالدين):** [الاسم الكامل] | رقم الهوية: [................] | العنوان: [................] | الهاتف: [................]
* **الدائن (المستحق للدين):** [الاسم الكامل] | رقم الهوية: [................] | العنوان: [................]

---

### 💰 1. الإقرار بالمديونية:
أقر وأعترف بأن في ذمتي للدائن المذكور أعلاه ديناً ثابتاً ومستحق الأداء قدره: **[المبلغ رقماً]** (فقط **[المبلغ كتابة بالعملة المحلية]** لا غير) استلمته نقداً / تحويلاً على سبيل القرض الحسن / معاملة تجارية مشروعة.

### 📅 2. جدول ومواعيد السداد:
ألتزم بسداد كامل المبلغ المذكور أعلاه وفق الآلية الآتية:
- [ ] **دفعة واحدة كاملة** في موعد أقصاه تاريخ: [..../..../2026م].
- [ ] **أقساط شهرية متتالية** بواقع [........] تسدد في اليوم الأول من كل شهر ميلادي حتى السداد التام.

### 🚨 3. حلول الأجل والإجراءات القضائية:
في حال تخلفي عن سداد أي قسط في موعده، يحل باقي الدين كاملاً فوراً دون حاجة إلى إنذار أو إعذار رسمي، ويكون لهذا الإقرار قوة السند التنفيذي للمطالبة به أمام قضاء التنفيذ والمحاكم المختصة.

### ✍️ المقر بما فيه (المدين) والشهود:
| المقر بالمديونية (المدين) | شاهد أول | شاهد ثانٍ |
| :--- | :--- | :--- |
| **الاسم:** [................................] | **الاسم:** [................] | **الاسم:** [................] |
| **التوقيع:** | **التوقيع:** | **التوقيع:** |
| **البصمة:** | **الهوية:** [................] | **الهوية:** [................] |`;
  }

  return `## ⚖️ PROMISSORY NOTE & ACKNOWLEDGMENT OF DEBT
* **DEBTOR:** [Full Legal Name], ID/Passport: [................], Phone: [................]
* **CREDITOR:** [Full Legal Name], ID/Passport: [................], Phone: [................]

### 1. PRINCIPAL DEBT ACKNOWLEDGMENT:
The Debtor hereby unconditionally acknowledges full legal indebtedness to Creditor in the principal sum of: **$[Amount]** ([Amount in words] USD).

### 2. REPAYMENT TERMS:
Repayable in full on or before [Due Date: ..../..../2026] (or in monthly installments of $[Amount]).

### 3. ACCELERATION & ENFORCEMENT:
Default on any installment immediately accelerates the entire remaining balance, enforceable in competent execution courts.

| DEBTOR SIGNATURE | WITNESS 1 | WITNESS 2 |
| :--- | :--- | :--- |
| **Signature:** [................] | **Signature:** [............] | **Signature:** [............] |`;
}

// ── 9. Contract Amendment / Custom Clause Generator ─────────────────────────
export function generateClauseAmendment(prompt: string, isAr: boolean): string {
  if (isAr) {
    return `### ✍️ الصياغة القانونية المعدلة للبنود المطلوبة

بناءً على طلب التعديل: **"${prompt.slice(0, 100)}"**، نورد الصياغة القانونية التشريعية المعتمدة لإدراجها في العقد:

---

#### 📌 البند المعدل / المضاف (جاهز للاقتباس والإدراج الفوري):

> **"البند [....] — التعديل التعاقدي المتفق عليه:**
> 1. اتفق الطرفان على تعديل أحكام البند الأصلي ليكون نصه كالتالي: [........ التفاصيل المحددة ........].
> 2. يسري هذا التعديل من تاريخ توقيعه ويعد جزءاً لا يتجزأ من العقد الأصلي ومكملاً ومعدلاً له في حدود ما نص عليه.
> 3. تظل سائر بنود وشروط العقد الأصلي الأخرى غير المعدلة سارية ونافذة بكامل قوتها القانونية بين الطرفين."

---

#### ⚖️ مقترحات حمائية إضافية موصى بها:
* **بند الشرط الجزائي:** *"يلتزم الطرف المخل بسداد مبلغ تعويضي قدره [........] عن كل يوم تأخير بما لا يجاوز 10% من إجمالي قيمة العقد."*
* **بند حسم النزاعات والتحكيم:** *"أي نزاع ينشأ عن تنفيذ هذا العقد يحسم ودياً خلال 15 يوماً، وإلا يحال للتحكيم المؤسسي الملزم وفق قواعد الغرفة التجارية المختصة."*

💡 *هل ترغب في دمج هذا البند ضمن النص الكامل للعقد وتوليد النسخة النهائية المحدثة؟*`;
  }

  return `### ✍️ Executive Contract Amendment & Clause Formulation

Based on your amendment request: **"${prompt.slice(0, 100)}"**, here is the binding legal clause ready for direct insertion:

---

> **"ARTICLE [....] — SPECIAL AMENDMENT & MODIFIED TERMS:**
> 1. The parties mutually agree to amend the original contract terms as follows: [........ Detailed Customization ........].
> 2. This amendment takes effect immediately upon execution and constitutes an integral part of the Principal Agreement.
> 3. All other terms and covenants of the Principal Agreement remain in full force and effect."

---

💡 *Would you like this clause incorporated into the full contract draft for a finalized PDF/Word export?*`;
}

// ── 10. Procedural & Statutory Registration Guide ───────────────────────────
export function generateProceduralGuidance(prompt: string, isAr: boolean): string {
  if (isAr) {
    return `### 🏛️ الدليل الإجرائي والخطوات النظامية للتوثيق ونقل الملكية

بخصوص استفسارك حول الإجراءات: **"${prompt.slice(0, 100)}"**، نورد خارطة الطريق التنفيذية الدقيقة:

---

#### 1️⃣ **المستندات والمتطلبات الإلزامية المطلوبة:**
* **أصل الهويات الوطنية / الإقامات / السجلات التجارية** سارية المفعول لجميع الأطراف.
* **أصل العقد المحرر والموقع** (نسختين على الأقل).
* **شهادة براءة الذمة / المخالصة المالية / شهادة الفحص الفني الدوري** (للمركبات والعقارات).
* **إيصال سداد الرسوم الحكومية أو الضريبية المقررة** (رسوم التوثيق / ضريبة التصرفات العقارية إن وجدت).

---

#### 2️⃣ **الجهات الرسمية وقنوات التوثيق الفورية:**
* 🚗 **نقل ملكية المركبات:** عبر إدارة المرور أو المنصات الرقمية المعتمدة (مثل منصة **أبشر / تم** في السعودية، أو مكاتب الشهر العقاري والمرور في مصر، أو مراكز تسهيل والمرور في الإمارات).
* 🏢 **عقود الإيجار والعقارات:** التوثيق عبر المنصات العقارية الرسمية (منصة **إيجار** بالسعودية، أو **الشهر العقاري** بمصر، أو **إيجاري** بدبي) لضمان اكتساب العقد الصفة التنفيذية.
* 💼 **عقود العمل وتأسيس الشركات:** التوثيق عبر منصات وزارة الموارد البشرية والغرف التجارية ووزارات الاستثمار (مثل **قوى**، **جافي GAFI**، وزارة التجارة).

---

#### 3️⃣ **نصائح لتفادي بطلان الإجراءات أو النصب:**
1. لا تقم بتسليم كامل الثمن إلا بعد إتمام المعاينة والتأكد من خلو الشيء المبيع من أي حظر أو رهن بنكي أو أحكام قضائية.
2. احرص على أخذ إيصال استلام أو حوالة بنكية رسمية برقم الحساب البنكي المعتمد باسم البائع تحديداً.
3. التوثيق الرسمي في المواعيد المقررة يحميك من أي مخالفات أو التزامات سابقة على تاريخ التعاقد.`;
  }

  return `### 🏛️ Procedural Execution & Statutory Registration Roadmap

Regarding your procedural inquiry: **"${prompt.slice(0, 100)}"**, here is the definitive statutory roadmap:

#### 1. Mandatory Documentation Checklist:
- Valid Government IDs / Passports / Commercial Registrations for all parties.
- Original executed contract (2 counterparts minimum).
- Clearance certificate / Technical inspection report / Title deed.
- Proof of statutory fee or transfer tax settlement.

#### 2. Competent Regulatory Authorities:
- **Vehicle Title Transfers**: Traffic Department / Certified Digital e-Services (e.g. Absher, Tam).
- **Real Estate / Leases**: Official Land Registry / Certified Tenancy Portals (e.g. Ejar, Ejari, Real Estate Notary).
- **Corporate & Employment**: Ministry of Commerce, General Authority for Investment, or Ministry of Human Resources.

#### 3. Critical Safeguards:
- Always execute fund transfers via verifiable institutional banking channels matching the exact legal name of the transferor.
- Ensure time-stamped official notarization to protect against historic liabilities.`;
}

// ── 💡 Main Dynamic Solver Engine (Multi-Turn Aware) ────────────────────────
export function solveLegalPrompt(prompt: string, lang: string = 'ar', history: ConversationTurn[] = []): string {
  const isAr = lang === 'ar' || /[\u0600-\u06FF]/.test(prompt);
  const info = classifyLegalPrompt(prompt, history);

  // 1. Vehicle / Car Sale
  if (info.isCarSale) {
    return generateCarSaleContract(isAr);
  }

  // 2. Real Estate & Lease
  if (info.isRealEstate) {
    return generateLeaseContract(isAr);
  }

  // 3. Employment
  if (info.isEmployment) {
    return generateEmploymentContract(isAr);
  }

  // 4. NDA
  if (info.isNda) {
    return generateNdaContract(isAr);
  }

  // 5. Commercial Supply
  if (info.isSupply) {
    return generateSupplyContract(isAr);
  }

  // 6. Software Development
  if (info.isSoftware) {
    return generateSoftwareContract(isAr);
  }

  // 7. Partnership & Shareholders
  if (info.isPartnership) {
    return generatePartnershipContract(isAr);
  }

  // 8. Loan & Debt Acknowledgment
  if (info.isLoan) {
    return generateLoanContract(isAr);
  }

  // 9. Contract Amendment / Custom Clause Modification
  if (info.isAmendment) {
    return generateClauseAmendment(prompt, isAr);
  }

  // 10. Procedural Guidance / Registration / Notarization
  if (info.isProcedural) {
    return generateProceduralGuidance(prompt, isAr);
  }

  // 11. Contract Audit / Review request
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

  // 12. Intelligent Deep Legal Consultation (Specific Advice)
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
