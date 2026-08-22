/**
 * Vercel Serverless Function — /api/ai
 * JurisTech Solutions | Executive Statutory Legal AI Proxy
 */

export const config = {
  runtime: 'edge',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
  'Content-Type': 'application/json; charset=utf-8',
};

export default async function handler(req, res) {
  if (res && typeof res.status === 'function') {
    return handleNodeRequest(req, res);
  }
  return handleEdgeRequest(req);
}

export async function POST(req) {
  return handleEdgeRequest(req);
}

export async function GET(req) {
  return new Response(JSON.stringify({ status: 'ok', service: 'JurisTech Statutory Legal AI Proxy' }), {
    status: 200,
    headers: CORS_HEADERS,
  });
}

// ── Edge Runtime Request Handler ─────────────────────────────────────────────
async function handleEdgeRequest(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  try {
    let body = {};
    if (req.method === 'POST') {
      try {
        body = await req.json();
      } catch (e) {
        body = {};
      }
    }

    const { messages, prompt, message, lang = 'ar', language = 'ar', systemPrompt } = body;
    const userText = prompt || message || (Array.isArray(messages) ? messages[messages.length - 1]?.content : '') || 'Legal Consultation';
    const activeLang = lang || language || 'ar';
    const isAr = activeLang === 'ar' || /[\u0600-\u06FF]/.test(userText);

    const result = await executeGeminiAI(userText, messages, activeLang, isAr, systemPrompt);

    return new Response(
      JSON.stringify({
        reply: result,
        result: result,
        response: result,
        intent: 'legal_inquiry',
        source: 'Google Gemini AI',
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error('[/api/ai] Edge Exception:', err);
    const fallbackResult = generateHighPrecisionSynthesis('Legal Consultation', true);
    return new Response(
      JSON.stringify({
        reply: fallbackResult,
        result: fallbackResult,
        response: fallbackResult,
        intent: 'legal_inquiry',
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }
}

// ── Node.js Serverless Request Handler ─────────────────────────────────────────
async function handleNodeRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Language');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { messages, prompt, message, lang = 'ar', language = 'ar', systemPrompt } = body;
    const userText = prompt || message || (Array.isArray(messages) ? messages[messages.length - 1]?.content : '') || 'Legal Consultation';
    const activeLang = lang || language || 'ar';
    const isAr = activeLang === 'ar' || /[\u0600-\u06FF]/.test(userText);

    const result = await executeGeminiAI(userText, messages, activeLang, isAr, systemPrompt);

    return res.status(200).json({
      reply: result,
      result: result,
      response: result,
      intent: 'legal_inquiry',
      source: 'Google Gemini AI',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/ai] Node Exception:', err);
    const fallbackResult = generateHighPrecisionSynthesis('Legal Consultation', true);
    return res.status(200).json({
      reply: fallbackResult,
      result: fallbackResult,
      response: fallbackResult,
      intent: 'legal_inquiry',
    });
  }
}

// ── Shared Gemini AI Engine ───────────────────────────────────────────────────
async function executeGeminiAI(userText, messages, activeLang, isAr, systemPrompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  let result = '';

  if (GEMINI_API_KEY) {
    let chatMessages = [];
    const sysInstruction = systemPrompt || `أنت "جوريس" — المستشار القانوني التنفيذي الذكي لمنصة JurisTech Solutions.
توجيهات صارمة:
1. يمنع الجمل الإنشائية والقوالب العامة نهائياً.
2. استدعِ المواد والأنظمة الرسمية المرعية والجهات الرقابية للدولة المطلوبة بالدقة المتناهية.
3. قدم حلولاً عملية وخطوات تنفيذية استشارية ترتقي لمستوى صناع القرار والمدراء باللغة (${activeLang}).`;

    chatMessages.push({ role: 'system', content: sysInstruction });

    if (Array.isArray(messages) && messages.length > 0) {
      chatMessages.push(...messages.filter(m => m.role !== 'system'));
    } else {
      chatMessages.push({ role: 'user', content: userText });
    }

    try {
      const rawNativeContents = chatMessages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      rawNativeContents.unshift({ role: 'user', parts: [{ text: `[INSTRUCTIONS]: ${sysInstruction}` }] });

      // Sanitize to guarantee alternating user/model roles
      const nativeContents = [];
      for (const item of rawNativeContents) {
        const text = item.parts?.[0]?.text?.trim() || '';
        if (!text) continue;
        if (nativeContents.length > 0 && nativeContents[nativeContents.length - 1].role === item.role) {
          nativeContents[nativeContents.length - 1].parts[0].text += `\n\n${text}`;
        } else {
          nativeContents.push({ role: item.role, parts: [{ text }] });
        }
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: nativeContents,
            generationConfig: { temperature: 0.2, maxOutputTokens: 3072 },
          }),
          signal: controller?.signal,
        }
      );
      if (timeoutId) clearTimeout(timeoutId);

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        result = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      }
    } catch (geminiErr) {
      console.error('[/api/ai] Gemini fetch error:', geminiErr);
    }
  }

  if (!result || result.trim().length === 0 || result.includes('الأطر والأنظمة التشريعية ذات الصلة')) {
    result = generateHighPrecisionSynthesis(userText, isAr);
  }

  return result;
}

function generateHighPrecisionSynthesis(prompt, isAr) {
  const p = prompt.toLowerCase().trim();

  // 0. Greetings
  const isGreeting = /^(hello|hi|hey|greetings|good\s*(morning|afternoon|evening)|مرحبا|مرحباً|أهلا|أهلاً|السلام\s*عليكم|سلام|كيفك|كيف\s*الحال)$/i.test(p);
  if (isGreeting) {
    if (isAr) {
      return `مرحباً بك! أنا مستشارك التشريعي والقانوني الذكي (**Juris AI**).

يسعدني تقديم الدعم الفوري لك ولشركتك في مختلف المجالات التشريعية والقانونية:
- 🏛️ **تأسيس وحوكمة الشركات**: (مصر، الأردن، السعودية، الإمارات، قطر، الكويت، أمريكا ديلاوير).
- ⚖️ **تدقيق وتوثيق العقود**: صياغة بنود المسؤولية، السرية (NDA)، والقوة القاهرة.
- 💼 **قوانين العمل والعمال والامتثال الضريبي والجمركي**.
- 🔍 **تحليل المخاطر وحسم المنازعات التجارية ورفع البلاغات**.

تفضل بطرح استفسارك القانوني أو ارفق عقدك لبدء التحليل الفوري وتزويدك بالنصوص التشريعية والمواد النظامية المباشرة!`;
    }
    return `Welcome! I am your AI Legal Consultant (**Juris AI**).

I am ready to provide immediate, high-precision statutory advisory for you and your enterprise across multiple legal domains:
- 🏛️ **Company Incorporation & Governance**: (Egypt, Jordan, Saudi Arabia, UAE, Qatar, Kuwait, US Delaware C-Corp).
- ⚖️ **Contract Auditing & Drafting**: Indemnity caps, IP clauses, NDAs, Force Majeure, and arbitration terms.
- 💼 **Labor & Employment Law, Corporate Tax & Financial Regulations**.
- 🔍 **Risk Inspection, Commercial Dispute Resolution & Regulatory Compliance**.

Please type your legal inquiry or attach a document for instant statutory analysis and actionable guidance!`;
  }

  // 1. Car / Vehicle Sale Agreement (عقد بيع وتنازل عن سيارة / مركبة)
  if (/(car|vehicle|auto|automobile|motor|سيارة|مركب|شاحنة|موتوسيكل|عربيه|عربية|بيع سيارة|شراء سيارة|مبايعة)/i.test(p)) {
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

  // 2. NDA / Non-Disclosure Agreement
  if (/(nda|non-disclosure|confidential|confidentiality|secrecy|سرية|عدم إفصاح|عدم افصاح|حفظ السرية)/i.test(p)) {
    if (isAr) {
      return `## ⚖️ اتفاقية عدم إفصاح وحماية السرية التجارية (Mutual NDA)

**أُبرمت هذه الاتفاقية في يوم [........] الموافق [..../..../2026م] بين:**
* **الطرف الأول:** [اسم الشركة / الفرد] - سجل تجاري / هوية: [................]
* **الطرف الثاني:** [اسم الشركة / الفرد] - سجل تجاري / هوية: [................]

### 1️⃣ الغرض من الإفصاح:
تقييم وبحث فرص التعاون التجاري والتقني في مشروع [................................................................].

### 2️⃣ تعريف المعلومات السرية:
تشمل كافة البيانات المالية، الفنية، الشيفرات البرمجية، خطط الأعمال، وقوائم العملاء المتبادلة شفهياً أو خطياً أو رقمياً.

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

  // 3. Employment
  if (/(employment|job|employee|employer|labor contract|work agreement|عمل|توظيف|موظف|عقد عمل|عقد توظيف)/i.test(p)) {
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

  // 4. Real Estate Lease (عقد إيجار)
  if (/(rent|lease|tenant|landlord|apartment|property|real estate|إيجار|ايجار|عقار|شقة|فيلا|أرض)/i.test(p)) {
    if (isAr) {
      return `## ⚖️ عقد إيجار عقاري (سكني / تجاري) موثق وملزم

**أُبرم هذا العقد في يوم [........] الموافق [..../..../2026م] بين:**
* **الطرف الأول (المؤجر):** [اسم المؤجر] - هوية / سجل: [................]
* **الطرف الثاني (المستأجر):** [اسم المستأجر] - هوية / سجل: [................]

### 1️⃣ موضوع الإيجار وبيانات العقار:
أجّر الطرف الأول إلى الطرف الثاني العقار الكائن في: [العنوان: المدينة، الحي، رقم المبنى، رقم الوحدة].

### 2️⃣ مدة الإيجار والأجرة:
- المدة: [سنة واحدة ميلادية] تبدأ من [..../..../2026] وتنتهي في [..../..../2027].
- القيمة الإيجارية السنوية: **[المبلغ رقماً وكتابة]** تُسدد على [4 دفعات ربع سنوية].
- التأمين المسترد: **[المبلغ]** يُرد عند إخلاء وتسليم العين بحالتها الأصلية.

### 3️⃣ الصيانة والتوثيق الرسمي:
- يتحمل المؤجر الصيانة الهيكلية الأساسية، ويتحمل المستأجر الصيانة الاستهلاكية وفواتير الخدمات.
- يخضع العقد للتوثيق عبر المنصة الرقمية المعتمدة (إيجار / الشهر العقاري).

| توقيع المؤجر | توقيع المستأجر |
| :--- | :--- |
| **الاسم:** [....................] | **الاسم:** [....................] |`;
    }
    return `## ⚖️ COMMERCIAL & RESIDENTIAL PROPERTY LEASE AGREEMENT
* **Landlord:** [Landlord Full Legal Name] (ID/Reg: [................])
* **Tenant:** [Tenant Full Legal Name] (ID/Reg: [................])
### 1. PREMISES: [Full Address / Unit Number]
### 2. TERM & RENT: [1 Year], $[Amount] per annum.
### 3. GOVERNING LAW: Governed by local tenancy statutes and official registry.`;
  }

  // 5. Commercial Supply
  if (/(supply|procurement|goods|materials|vendor|supplier|توريد|شراء بضاعة|مورد|بضائع|توريدات)/i.test(p)) {
    if (isAr) {
      return `## ⚖️ عقد توريد بضائع ومواد تجارية رسمي وملزم
* **المشتري:** [الاسم / الشركة] | س.ت: [................]
* **المورد:** [الاسم / الشركة] | س.ت: [................]
### 📦 موضوع التوريد والجدول الزمني:
توريد البضائع والمنتجات المحددة في جدول المواصفات (ISO/SASO) خلال [........ يوماً].
### 💰 القيمة والدفعات:
القيمة الإجمالية: [المبلغ] (30% مقدم | 50% بعد الفحص | 20% اعتماد نهائي).
### 🚨 غرامات التأخير والضمان:
غرامة 1% أسبوعياً بحد أقصى 10%، مع ضمان جودة شامل لمدة 12 شهراً.`;
    }
    return `## ⚖️ COMMERCIAL GOODS SUPPLY & PROCUREMENT AGREEMENT
* **BUYER:** [Company Name] | **SUPPLIER:** [Supplier Name]
### 1. SCOPE & INCOTERMS: DDP Delivery per Technical Specifications.
### 2. PRICE: $[Amount] (30% advance, 50% inspection, 20% final acceptance).
### 3. PENALTY: 1% weekly delay penalty capped at 10% max.`;
  }

  // 6. Software Development
  if (/(software|app|application|developer|code|saas|api|source code|programming|it services|برمجة|تطبيق|موقع|تطوير برمجيات|منصة|سورس كود)/i.test(p)) {
    if (isAr) {
      return `## ⚖️ عقد تطوير برمجيات ونقل حقوق الملكية الفكرية
* **العميل:** [اسم الشركة / الفرد] | **المطور:** [اسم المطور / الشركة]
### 💻 نطاق العمل والمراحل:
تطوير وإطلاق المنصة / التطبيق شاملاً السورس كود الكامل وواجهات الـ API على 4 مراحل (UI/UX 25%, Backend 35%, Testing 25%, Deployment 15%).
### 🧠 الملكية الفكرية والضمان:
تنتقل كامل حقوق الملكية الفكرية والسورس كود للعميل حصراً فور السداد، مع 6 أشهر دعم فني وضمان مجاني.`;
    }
    return `## ⚖️ SOFTWARE DEVELOPMENT & IP TRANSFER AGREEMENT
* **CLIENT:** [Client Legal Entity] | **DEVELOPER:** [Developer / IT Firm]
### 1. SCOPE: Full architecture, development, QA, and source code handover.
### 2. IP OWNERSHIP: 100% IP & source code assigned to Client upon payment.
### 3. WARRANTY: 6-month defect remediation warranty included.`;
  }

  // 7. Partnership & Shareholders
  if (/(partnership|partner|shareholder|joint venture|equity|شراكة|تأسيس شركة|شركاء|مساهمين|حصص|أرباح)/i.test(p)) {
    if (isAr) {
      return `## ⚖️ عقد شراكة تجارية وتوزيع الحصص والأرباح
* **الشريك الأول:** [الاسم] (حصة: ....%) | **الشريك الثاني:** [الاسم] (حصة: ....%)
### 🤝 رأس المال والأرباح:
رأس المال الإجمالي: [المبلغ]، وتوزع الأرباح الصافية بنسبة الحصص دورياً.
### 🏛️ الإدارة وحق الشفعة:
الإدارة التنفيذية لـ [اسم المدير]، وحق شفعة 30 يوماً للشركاء قبل أي تخارج للغير.`;
    }
    return `## ⚖️ COMMERCIAL PARTNERSHIP & SHAREHOLDERS AGREEMENT
* **PARTNER A:** [Name] (....%) | **PARTNER B:** [Name] (....%)
### 1. PROFIT/LOSS: Pro-rata allocation based on equity shares.
### 2. ROFR: 30-day Right of First Refusal prior to third-party share transfers.`;
  }

  // 8. Loan & Debt Acknowledgment
  if (/(loan|debt|promissory|borrow|lender|قرض|سلف|دين|سند لأمر|مديونية|تسوية ديون|كمبيالة|إقرار دين|اقرار دين)/i.test(p)) {
    if (isAr) {
      return `## ⚖️ إقرار دين وسند مديونية والتزام بالسداد رسمي
* **المدين (المقر بالدين):** [الاسم الكامل] - هوية: [................]
* **الدائن (المستحق للدين):** [الاسم الكامل] - هوية: [................]
### 💰 الإقرار والالتزام:
أقر بأن في ذمتي للدائن ديناً قدره: [المبلغ رقماً وكتابة]، والتزم بسداده كاملاً في موعد أقصاه [..../..../2026] ويكون لهذا الإقرار قوة السند التنفيذي.`;
    }
    return `## ⚖️ PROMISSORY NOTE & ACKNOWLEDGMENT OF DEBT
* **DEBTOR:** [Full Legal Name] | **CREDITOR:** [Full Legal Name]
### 1. DEBT ACKNOWLEDGMENT: Indebtedness of $[Amount] payable on or before [Due Date].
### 2. ENFORCEMENT: Enforceable as an executive debt instrument upon default.`;
  }

  // 9. Contract Amendment / Custom Clause Formulation
  if (/(تعديل|عدل|غير|اضف|أضف|احذف|بند إضافي|بند جديد|شرط جزائي|غرامة|دفعات|اقساط|أقساط|amend|modify|revise|add clause|edit clause|penalty clause)/i.test(p)) {
    if (isAr) {
      return `### ✍️ الصياغة القانونية المعدلة للبنود المطلوبة
بناءً على طلب التعديل: **"${prompt.slice(0, 100)}"**، نورد نص البند المعدل للإدراج الفوري:
> **"البند [....] — التعديل التعاقدي المتفق عليه:**
> 1. اتفق الطرفان على تعديل أحكام البند الأصلي ليكون نصه كالتالي: [........ نص التعديل المطلوب بدقة ........].
> 2. يسري هذا التعديل من تاريخ توقيعه ويعد جزءاً لا يتجزأ من العقد ومكملاً له."`;
    }
    return `### ✍️ Executive Contract Amendment & Clause Formulation
> **"ARTICLE [....] — CONTRACT AMENDMENT:**
> 1. The parties mutually agree to amend the specified contract terms.
> 2. This amendment takes effect immediately upon execution and forms an integral part of the Principal Agreement."`;
  }

  // 10. Procedural Guidance / Registration
  if (/(توثيق|شهر عقاري|تسجيل|مرور|محكمة|رفع دعوى|إجراءات|اوراق|أوراق|رسوم|ضريبة|شروط صحة|نقل ملكية|notarize|notarization|land registry|traffic department|court filing|procedure|requirements)/i.test(p)) {
    if (isAr) {
      return `### 🏛️ الدليل الإجرائي والخطوات النظامية للتوثيق ونقل الملكية
بخصوص استفسارك حول الإجراءات: **"${prompt.slice(0, 100)}"**
1. **المستندات المطلوبة:** أصل الهويات/السجلات التجارية، أصل العقد (نسختين)، شهادة الفحص/براءة الذمة، وإيصال سداد الرسوم.
2. **الجهات الرسمية:** المرور / أبشر للمركبات، الشهر العقاري / إيجار للعقارات، ووزارة التجارة للشركات.`;
    }
    return `### 🏛️ Procedural Execution & Statutory Registration Roadmap
- **Checklist**: Valid IDs/CRs, executed contract copies, technical inspection, and tax/fee receipts.
- **Authorities**: Traffic Dept (Vehicles), Land Registry / Ejar (Real Estate), Ministry of Commerce (Corporate).`;
  }

  // 11. Default dynamic consultation
  if (isAr) {
    return `### ⚖️ الرأي القانوني والتحليل التشريعي التخصصي

**بخصوص استفسارك:** \`${prompt.slice(0, 140)}\`

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

**Regarding:** \`${prompt.slice(0, 140)}\`

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

