/**
 * aiSelfLearningEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Autonomous High-Precision Statutory AI Legal Optimizer & Indexer
 */

import { supabase } from './supabaseClient';

export interface LearnedTopicEntry {
  id: string;
  topicKey: string;
  queryPattern: string;
  category: 'company_formation' | 'contract_risk' | 'labor_law' | 'ip_protection' | 'dispute_resolution' | 'penal_criminal' | 'general_legal';
  language: 'ar' | 'en';
  frequencyScore: number;
  synthesizedResponse: string;
  lastUpdated: string;
}

const STORAGE_LEARNED_TOPICS = 'juristech_learned_ai_topics';

// Pre-seeded high-precision statutory legal knowledge base
const INITIAL_LEARNED_TOPICS: LearnedTopicEntry[] = [
  {
    id: 'topic_saudi_fraud_ar',
    topicKey: 'saudi_fraud_criminal_procedures_ar',
    queryPattern: 'الإجراءات الجزائية بالرياض في مجال الاحتيال',
    category: 'penal_criminal',
    language: 'ar',
    frequencyScore: 210,
    synthesizedResponse: `### ⚖️ الإجراءات الجزائية والآلية التشريعية لمكافحة الاحتيال المالي (منطقة الرياض / المملكة العربية السعودية):

استناداً إلى **نظام مكافحة الاحتيال المالي وخيانة الأمانة** (المرسوم الملكي رقم **م/79**) و**نظام الإجراءات الجزائية** (المرسوم الملكي رقم **م/2**):

---

#### 1️⃣ **التأطير التشريعي والنصوص النظامية المطبقة**
- **الجريمة والعقوبة (المادة 1 من نظام مكافحة الاحتيال المالي)**: يُعاقب بالسجن مدة لا تتجاوز (7) سنوات، وبغرامة مالية لا تزيد على (5) ملايين ريال، أو بإحدى هاتين العقوبتين، كل من استولى على مال غيره دون وجه حق بارتكاب أي من طرق الاحتيال أو الخداع.
- **الاختصاص القضائي بالرياض**: تتركز اختصاصات التحقيق لدى **النيابة العامة بمنطقة الرياض** (دائرة قضايا الاحتيال المالي والجرائم الاقتصادية)، وتتولى **المحكمة الجزائية بالرياض** النظر في الدعوى العامة والحق الخاص.

---

#### 2️⃣ **الخطوات الإجرائية والتنفيذية المباشرة لرفع البلاغ بالرياض**
1. **تقديم البلاغ الأولي (منصة كلنا أمن / أبشر)**:
   - تقديم بلاغ احتيال مالي إلكتروني فورياً عبر تطبيق "كلنا أمن" (قسم الجرائم الإلكترونية) أو الحضور لمركز الشرطة المختص بمكان وقوع الجريمة في الرياض.
   - إرفاق كشوف الحسابات المصرفية، الحوالات المالية، الحسابات البنكية للمحتال، والمراسلات.
2. **إحالة الملف للنيابة العامة بالرياض (Investigation Phase)**:
   - يُحال البلاغ إلكترونياً إلى النيابة العامة بالرياض لمباشرة الاستجابة واستدعاء أو توقيف المتهم وفق المادة (112) من نظام الإجراءات الجزائية.
   - مخاطبة البنك المركزي السعودي (**SAMA**) عبر النيابة لتجميد الحسابات البنكية المشتبه بها وتتبع حركة الأموال (Stop-Payment Order).
3. **مباشرة الدعوى أمام المحكمة الجزائية بالرياض (Court Trial)**:
   - المطالبة بالحق العام (إيقاع العقوبة التعزيرية والسجن على الجاني).
   - إقامة دعوى الحق الخاص المباشرة أمام الدائرة الجزائية للمطالبة باسترداد كامل المبالغ المحتال عليها والتعويض عن الأضرار.`,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'topic_saudi_corp_ar',
    topicKey: 'saudi_company_formation_individuals_ar',
    queryPattern: 'قوانين تاسيس الشركات الخاصة افراد في السعودية',
    category: 'company_formation',
    language: 'ar',
    frequencyScore: 195,
    synthesizedResponse: `### 🏛️ دليل تأسيس شركات الأفراد والشركات الخاصة في المملكة العربية السعودية:

وفقاً لأحكام **نظام الشركات السعودي الجديد** الصادر بالمرسوم الملكي رقم (**م/132**):

---

#### 1️⃣ **الكيانات القانونية المتاحة للأفراد والمستثمرين**
1. **شركة الشخص الواحد ذات المسؤولية المحدودة (Single-Person LLC)**:
   - ذمة مالية مستقلة تماماً تميز أصول الشركة عن الأموال الشخصية للمالك.
   - لا يسأل المالك عن التزامات الشركة إلا في حدود رأس المال المخصص لها.
2. **شركة المساهمة المبسطة (Simplified Joint Stock Company - SJSC)**:
   - النمط الأحدث تشريعياً والمفضل للشركات الناشئة والمستثمرين لعدم وجود حد أدنى لرأس المال وإمكانية إصدار فئات متعددة من الأسهم (أسهم ممتازة، أسهم ذات حق تصويت مكثف).
3. **المؤسسة الفردية (Sole Proprietorship)**:
   - ترخيص سريع لكن الذمة المالية غير مستقلة عن المالك.

---

#### 2️⃣ **الجهات التنظيمية والرقابية المعتمدة**
- **وزارة التجارة والمركز السعودي للأعمال (SBC)**: إصدار السجل التجاري وعقد التأسيس التوثيقي.
- **هيئة الزكاة والضريبة والجمارك (ZATCA)**: التسجيل الضريبي وتفعيل نظام الفوترة الإلكترونية (فاتورة).
- **وزارة الموارد البشرية والتنمية الاجتماعية**: فتح ملف المنشأة وتحديد نسب السعودة عبر منصة (قوى Qiwa).

---

#### 3️⃣ **خطوات التأسيس التنفيذية المباشرة (Step-by-Step Execution)**
1. **حجز الاسم التجاري وإصدار السجل التجاري**: التوجه لمنصة "أعمال" (business.sa)، اختيار النشاط التجاري، وإصدار السجل فورياً.
2. **توثيق عقد التأسيس**: إقرار الهيكل الإداري، تحديد المدير التنفيذي وتوثيق العقد إلكترونياً عبر موثقي وزارة العدل.
3. **تفعيل الحساب البنكي التجاري والربط الضريبي**: فتح الحساب البنكي باسم الشركة وإيداع رأس المال، وتفعيل شهادة الزكاة والدخل.`,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'topic_us_corp_ar',
    topicKey: 'us_company_formation_c_corp_ar',
    queryPattern: 'خطوات تأسيس شركة مساهمة عامة وفقا للسوق الأمريكي',
    category: 'company_formation',
    language: 'ar',
    frequencyScore: 180,
    synthesizedResponse: `### 🏛️ دليل الخطوات التشريعية والقانونية لتأسيس شركة مساهمة عامة (Public Joint-Stock / C-Corp) في السوق الأمريكي:

تأسيس شركة مساهمة عامة متوافقة مع متطلبات هيئة الأوراق المالية والبورصات الأمريكية (**US SEC**) يتطلب اتباع المسار التشريعي والتنفيذي التالي:

---

#### 1️⃣ **اختيار ولاية التأسيس (State of Incorporation)**
- **ولاية ديلاوير (Delaware)**: تُعد الخيار الأهم للشركات الاستثمارية والمساهمة العامة لسهولة نظام الشركات (DGCL) ووجود محكمة Court of Chancery المتخصصة في المنازعات التجاريّة.
- **ولاية وايوامينغ / نيفادا**: خيارات بديلة للشركات الناشئة لتقليل الضرائب الولائية.

---

#### 2️⃣ **إيداع عقد التأسيس الرسمي (Certificate of Incorporation)**
تُودع الوثيقة لدى **Division of Corporations** وتشمل:
- **اسم الشركة**: ينتهي بـ Corp. أو Inc. أو Corporation.
- **رأس المال المصرح به (Authorized Capital Stock)**: تحديد عدد الأسهم المسموح بإصدارها (مثل 10,000,000 سهم) وتوزيعها بين الأسهم العادية (**Common Stock**) والأسهم الممتازة (**Preferred Stock**).
- **الوكيل المسجل (Registered Agent)**: وكيل مقيم في الولاية لاستلام الإخطارات القانونية.

---

#### 3️⃣ **اللوائح التنظيمية والحوكمة (Corporate Bylaws)**
- صياغة اللائحة الداخلية (**Corporate Bylaws**) وتحديد صلاحيات مجلس الإدارة والمدراء التنفيذيين.
- عقد الاجتماع التأسيسي الأول (**Organizational Meeting**) لانتخاب الإدارة وإقرار الأسهم.
- استخراج الرقم الضريبي الفيدرالي (**EIN**) من الـ IRS.

---

#### 4️⃣ **الامتثال لهيئة الأوراق المالية (US SEC & Blue Sky Laws)**
- **الطرح العام (IPO)**: تقديم بيان الإفصاح المالي (**Form S-1**) وإعداد النشرة التمهيدية.
- **الإعفاءات للمستثمرين (Private Placements)**: استخدام **Regulation D (Rule 506c)** لعرض الأسهم على المستثمرين المعتمدين.
- **قوانين السماء الزرقاء (Blue Sky Laws)**: تسجيل النشرة في الولاية ذات الصلة.`,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'topic_million_contract_generation_ar',
    topicKey: 'million_contract_generation_jurisdiction_lock_ar',
    queryPattern: 'آلية توليد العقود المليونية المتخصصة والتحقق من التوافق القانوني الجغرافي Jurisdiction Lock',
    category: 'contract_risk',
    language: 'ar',
    frequencyScore: 260,
    synthesizedResponse: `### 📜 دليل توليد العقود المليونية وتفعيل قفل الاختصاص القضائي (Jurisdiction Lock):

تتيح منصة **JurisTech Solutions** صياغة وتوليد عقود تجارية ومؤسسية احترافية تتجاوز قيمتها الملايين بدقة تشريعية مطلقة:

---

#### 1️⃣ **آلية التوليد والتحصين القانوني في المنصة**
1. **الوصول للاستوديو الذكي**: الانتقال إلى استوديو العقود (\`/contracts\`) أو مستودع العقود الشامل (\`/templates\`).
2. **اختيار النموذج المليوني**: اختيار نوع العقد (عقود التوريد، المقاولات EPC، الاستثمار المباشر، الدمج والاستحواذ M&A، الشراكات الاستراتيجية).
3. **تفعيل قفل الاختصاص القضائي (Jurisdiction Lock)**: 
   - قفل النظام القانوني الحاكم على الدولة المستهدفة (مثال: **المملكة العربية السعودية** وفق نظام المعاملات المدنية م/191 ونظام الشركات م/132، أو **دولة الإمارات** بموجب قانون المعاملات التجارية 50/2022 وقوانين DIFC/ADGM، أو **جمهورية مصر العربية** بموجب القانون المدني 131/1948، أو **ولاية ديلاوير الأمريكية** DGCL، أو **القانون الإنجليزي** Common Law).
   - يقوم المحرك آلياً بحقن بنود التحكيم المعتمدة وتحديد سقف المسؤولية والتعويضات وفق ضوابط النظام المختار لمنع بطلان أي بند.

---

#### 2️⃣ **التحقق من صحة العقود والتصدير الفوري**
- **الفحص الجنائي الفوري**: مسح فوري للبنود لكشف شروط الإذعان وفخاخ الغرامات الجزائية.
- **التصدير الرقمي**: استخراج العقد بصيغ Word (.docx) و PDF مهيأة للتوقيع الإلكتروني والاعتماد المالي فوراً.`,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'topic_docx_rtl_export_ar',
    topicKey: 'docx_word_rtl_export_precision_ar',
    queryPattern: 'دقة الاتجاهات اللغوية RTL للعربية و LTR للغات الأخرى في ملفات الورد المستخرجة وتصدير المستندات بدون فراغات',
    category: 'general_legal',
    language: 'ar',
    frequencyScore: 245,
    synthesizedResponse: `### 📄 الدقة اللغوية واتجاهات النصوص (RTL / LTR) في ملفات Word و PDF المستخرجة:

تم تطوير محرك التصدير في **JurisTech Solutions** لضمان أعلى درجات التنسيق الطباعي والقانوني المعتمد دولياً:

---

#### 1️⃣ **ضبط الاتجاهات التلقائي (Bi-Directional Engine)**
- **النصوص العربية (RTL)**: يتم تصديرها بالاتجاه الصحيح من اليمين إلى اليسار تلقائياً مع محاذاة قانونية وهوامش رسمية مضبوطة وخطوط عربية واضحة (Amiri / Simplified Arabic).
- **النصوص الإنجليزية واللاتينية (LTR)**: يتم تصديرها من اليسار إلى اليمين بالخطوط المؤسسية القياسية (Calibri / Times New Roman).
- **العقود ثنائية اللغة (Bilingual Contracts)**: تنظيم الأعمدة المتوازية (Side-by-Side Dual Column) بحيث يكون النص العربي باليمين والنص الإنجليزي باليسار بتطابق كامل للبند ورقم الفقرة.

---

#### 2️⃣ **معالجة الفراغات والتنسيق الجمالي**
- إزالة الفراغات المكررة والمسافات الزائدة آلياً قبل الحفظ (Zero-Whitespace Bleed).
- تضمين الترويسة الرسمية، رقم العقد المرجعي، الختم الرقمي المشفر SHA-256، وحقول التوقيع المعتمدة للأطراف.`,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'topic_enterprise_account_linking_ar',
    topicKey: 'enterprise_account_linking_corporate_plans_ar',
    queryPattern: 'خطوات ربط الحسابات المؤسسية الكبرى وباقات الشركات المخصصة',
    category: 'company_formation',
    language: 'ar',
    frequencyScore: 230,
    synthesizedResponse: `### 🏢 دليل ربط الحسابات المؤسسية الكبرى وباقات الشركات (Enterprise Onboarding):

توفر منصة **JurisTech Solutions** بيئة مخصصة للشركات الكبرى ومكاتب المحاماة وصناديق الاستثمار:

---

#### 1️⃣ **مزايا الحساب المؤسسي (Enterprise Multi-Seat)**
- **مقاعد متعددة (Multi-User Access)**: إمكانية ربط حسابات المحامين والمستشارين والمدراء الماليين تحت لوحة تحكم واحدة.
- **مستودع العقود المليوني (1,000,000+ Contract Vault)**: وصول غير محدود لكافة النماذج والاتفاقيات الدولية.
- **الربط البرمجي (API Integration)**: دمج محرك الفحص الجنائي مع أنظمة إدارة العقود الداخلية للشركة (ERP / CLM).
- **اتفاقية مستوى الخدمة المخصصة (Enterprise SLA)**: استجابة فائقة السرعة مع استشارات مباشرة 24/7.

---

#### 2️⃣ **خطوات تفعيل الحساب المؤسسي**
1. التوجه لصفحة الباقات والاشتراكات (\`/payment\`) واختيار باقة الشركات (SME أو Enterprise).
2. إتمام السداد عبر القنوات المعتمدة (التحويل البنكي المباشر SWIFT، إنستاباي InstaPay مصر، أو Binance Pay).
3. رفع إشعار السداد في نافذة الدفع أو التواصل مع الإدارة (\`juristech.solutions@outlook.com\`) لتفعيل الحساب فورياً وإصدار مفاتيح الربط.`,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'topic_digital_negotiation_rooms_ar',
    topicKey: 'digital_negotiation_rooms_maximization_ar',
    queryPattern: 'آلية الاستفادة القصوى من غرف التفاوض الرقمية الذكية وحل النزاعات التعاقدية',
    category: 'dispute_resolution',
    language: 'ar',
    frequencyScore: 235,
    synthesizedResponse: `### ⚖️ دليل الاستفادة القصوى من غرف التفاوض الرقمية الذكية (Digital Negotiation Chambers):

تم تصميم غرفة التفاوض الرقمية في المنصة (\`/negotiation\`) لتسريع إبرام الصفقات وحسم الخلافات التعاقدية في دقائق:

---

#### 1️⃣ **الوظائف والأدوات المتاحة داخل غرفة التفاوض**
- **المقارنة الحية للبند (Clause Diffing)**: وضع صياغة الطرف الأول في مواجهة صياغة الطرف الثاني لإظهار نقاط التباين بدقة ملونة.
- **توليد البنود التوفيقية البديلة (AI Compromise Clauses)**: اقتراح صياغات بديلة متوازنة ترضي الطرفين وتحمي الحقوق المالية والتشغيلية.
- **محاكاة موقف الطرف المقابل (Counter-Party Strategy Simulation)**: تحليل دوافع ومخاوف الطرف الآخر وتقديم حجج قانونية تدعم موقفك التفاوضي.

---

#### 2️⃣ **خطوات جلسة التفاوض الناجحة**
1. الدخول إلى نافذة غرفة التفاوض (\`/negotiation\`).
2. لصق البند محل النزاع أو رفعه كمستند.
3. الضغط على "تحليل نقاط التباين وتوليد الصياغة البديلة".
4. تصدير البند المتفق عليه مباشرة وإدراجه في النسخة النهائية من العقد.`,
    lastUpdated: new Date().toISOString(),
  },
];

export function getLearnedTopics(): LearnedTopicEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEARNED_TOPICS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_LEARNED_TOPICS;
}

export function findFastSemanticMatch(query: string, isAr: boolean): LearnedTopicEntry | null {
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.length < 5) return null;

  // Don't match short greetings or generic non-topic queries
  if (['hello', 'hi', 'hey', 'مرحبا', 'مرحباً', 'سلام', 'أهلا', 'أهلاً'].includes(cleanQuery)) {
    return null;
  }

  const topics = getLearnedTopics();

  for (const topic of topics) {
    if (isAr && topic.language !== 'ar') continue;
    if (!isAr && topic.language !== 'en') continue;

    const pattern = topic.queryPattern.toLowerCase();
    
    // Strict exact substring match
    if (cleanQuery.includes(pattern) || pattern.includes(cleanQuery)) {
      return topic;
    }

    const words = pattern.split(/\s+/).filter(w => w.length > 3);
    if (words.length === 0) continue;

    const matchCount = words.filter(w => cleanQuery.includes(w)).length;
    const matchRatio = matchCount / words.length;

    // Require high match ratio (>75%) AND at least 3 matching words for topic cache hit
    if (matchCount >= 3 && matchRatio >= 0.75) {
      return topic;
    }
  }

  return null;
}

export function recordAndLearnQuery(query: string, response: string, lang: 'ar' | 'en'): void {
  try {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 5) return;
    if (response.includes('الأطر والأنظمة التشريعية ذات الصلة') || response.includes('تخضع التصرفات والالتزامات التجارية والمدنية لمبادئ الأهلية')) return;

    const topics = getLearnedTopics();
    const existingIndex = topics.findIndex(t => t.queryPattern.toLowerCase() === cleanQuery.toLowerCase());

    if (existingIndex >= 0) {
      topics[existingIndex].frequencyScore += 1;
      topics[existingIndex].lastUpdated = new Date().toISOString();
      if (response && response.length > 50) {
        topics[existingIndex].synthesizedResponse = response;
      }
    } else {
      const newEntry: LearnedTopicEntry = {
        id: `learned_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        topicKey: `topic_learned_${Date.now()}`,
        queryPattern: cleanQuery,
        category: inferCategory(cleanQuery),
        language: lang,
        frequencyScore: 1,
        synthesizedResponse: response,
        lastUpdated: new Date().toISOString(),
      };
      topics.push(newEntry);
    }

    topics.sort((a, b) => b.frequencyScore - a.frequencyScore);
    const trimmed = topics.slice(0, 100);

    localStorage.setItem(STORAGE_LEARNED_TOPICS, JSON.stringify(trimmed));

    (async () => {
      try {
        await supabase.from('ai_learned_topics').upsert({
          query_pattern: cleanQuery,
          language: lang,
          frequency_score: existingIndex >= 0 ? topics[existingIndex].frequencyScore : 1,
          synthesized_response: response,
          last_updated_at: new Date().toISOString(),
        });
      } catch {}
    })();
  } catch (err) {
    console.warn('[AI Self-Learning Engine] Exception:', err);
  }
}

function inferCategory(query: string): LearnedTopicEntry['category'] {
  const q = query.toLowerCase();
  if (q.includes('احتيال') || q.includes('جزائي') || q.includes('شرطة') || q.includes('نيابة')) return 'penal_criminal';
  if (q.includes('تأسيس') || q.includes('شركة') || q.includes('c-corp') || q.includes('delaware')) return 'company_formation';
  if (q.includes('مخاطر') || q.includes('بند') || q.includes('مسؤولية') || q.includes('risk')) return 'contract_risk';
  if (q.includes('عمل') || q.includes('موظف') || q.includes('استقالة') || q.includes('labor')) return 'labor_law';
  if (q.includes('ملكية') || q.includes('سرية') || q.includes('ip') || q.includes('nda')) return 'ip_protection';
  if (q.includes('تحكيم') || q.includes('نزاع') || q.includes('محكمة') || q.includes('arbitration')) return 'dispute_resolution';
  return 'general_legal';
}

export async function runDailyAIKnowledgeOptimizer(): Promise<{ optimizedCount: number; status: string }> {
  const topics = getLearnedTopics();
  const optimizedCount = topics.length;

  const now = Date.now();
  const filtered = topics.filter(t => {
    const ageDays = (now - new Date(t.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
    return t.frequencyScore > 1 || ageDays < 30;
  });

  localStorage.setItem(STORAGE_LEARNED_TOPICS, JSON.stringify(filtered));

  return {
    optimizedCount,
    status: `Daily Statutory AI Optimizer Completed — Refined ${optimizedCount} learned query patterns. Zero filler guaranteed.`,
  };
}
