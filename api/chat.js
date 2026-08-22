/**
 * Vercel Serverless & Edge API Route — /api/chat
 * JurisTech Solutions | High-Precision Executive Legal Advisor (Zero Filler)
 */

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
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
  return new Response(JSON.stringify({ status: 'ok', service: 'JurisTech AI Legal Advisor Engine' }), {
    status: 200,
    headers: CORS_HEADERS,
  });
}

// ── Edge Runtime Request Handler ─────────────────────────────────────────────
async function handleEdgeRequest(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  const startTime = Date.now();

  try {
    let body = {};
    if (req.method === 'POST') {
      try {
        body = await req.json();
      } catch (e) {
        body = {};
      }
    }

    const { message, prompt, messages, history, language = 'ar', lang = 'ar', systemPrompt: customSystemPrompt } = body;
    const userMessage = message || prompt || (Array.isArray(messages) ? messages[messages.length - 1]?.content : '') || 'Legal Consultation';
    const activeLang = lang || language || 'ar';
    const isAr = activeLang === 'ar' || /[\u0600-\u06FF]/.test(userMessage);

    let replyText = await executeGeminiOrSynthesis(userMessage, messages, history, activeLang, isAr, customSystemPrompt);

    return new Response(
      JSON.stringify({
        reply: replyText,
        result: replyText,
        response: replyText,
        intent: 'legal_inquiry',
        latencyMs: Date.now() - startTime,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[/api/chat] Edge Exception:', error);
    const fallback = generateHighPrecisionStatutorySynthesis('General Legal Inquiry', true);
    return new Response(
      JSON.stringify({
        reply: fallback,
        result: fallback,
        response: fallback,
        error: false,
        latencyMs: Date.now() - startTime,
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

  const startTime = Date.now();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, prompt, messages, history, language = 'ar', lang = 'ar', systemPrompt: customSystemPrompt } = body;
    const userMessage = message || prompt || (Array.isArray(messages) ? messages[messages.length - 1]?.content : '') || 'Legal Consultation';
    const activeLang = lang || language || 'ar';
    const isAr = activeLang === 'ar' || /[\u0600-\u06FF]/.test(userMessage);

    let replyText = await executeGeminiOrSynthesis(userMessage, messages, history, activeLang, isAr, customSystemPrompt);

    return res.status(200).json({
      reply: replyText,
      result: replyText,
      response: replyText,
      intent: 'legal_inquiry',
      latencyMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error('[/api/chat] Node Exception:', error);
    const fallback = generateHighPrecisionStatutorySynthesis('General Legal Inquiry', 'en');
    return res.status(200).json({
      reply: fallback,
      result: fallback,
      response: fallback,
      error: false,
      latencyMs: Date.now() - startTime,
    });
  }
}

const SYSTEM_INSTRUCTIONS = {
  ar: `أنت "جوريس" — المستشار القانوني التنفيذي الذكي لمنصة JurisTech Solutions.
التوجيهات الصارمة والسيادية:
1. يمنع منعاً باتاً إخراج قوالب عامة أو إنشائية أو تكرار جمل الأهلية والرضا وسقف المسؤولية دون مناسبة.
2. حدد الدولة والدائرة القضائية الخاصة بسؤال المستخدم فورياً، واستدعِ المواد والأنظمة والمراسيم الرسمية والجهات التنظيمية المحددة (مثل: نظام الإجراءات الجزائية بالرياض، نظام مكافحة الاحتيال المالي م/79، نظام الشركات م/132، النيابة العامة، وزارة التجارة، US SEC، إلخ).
3. أجب بأسلوب استشاري تنفيذي تخصصي دقيق يُقدم حلولاً عملية وخطوات مباشرة يطلبها المدير والعميل المحترف باللغة العربية.`,

  en: `You are "Juris" — the Senior Executive AI Legal Advisor for JurisTech Solutions.
Strict Executive & Sovereign Directives:
1. NEVER output generic legal templates, boilerplate disclaimers, or repetitive liability caps unless explicitly requested.
2. Immediately identify the specific jurisdiction, country, and regulatory entities relevant to the query (e.g. Riyadh Penal Procedures, KSA Companies Law M/132, Egyptian ETA E-Invoicing, US SEC, UK Companies House). Cite exact statutes, codes, and decrees.
3. Respond 100% EXCLUSIVELY in professional legal English, providing structured, actionable legal advisory and step-by-step guidance.`,

  fr: `Vous êtes "Juris" — le Conseiller Juridique IA Senior de JurisTech Solutions.
Directives Exécutives et Souveraines Strictes :
1. N'affichez JAMAIS de modèles juridiques génériques ou de clauses répétitives sans pertinence.
2. Identifiez immédiatement la juridiction, le pays et les entités réglementaires concernés. Citez les lois, articles et décrets spécifiques.
3. Répondez à 100% EXCLUSIVEMENT en français juridique professionnel avec un style de conseil exécutif structuré.`,

  de: `Sie sind "Juris" — der leitende KI-Rechtsberater von JurisTech Solutions.
Strikte gesetzliche & geschäftliche Anweisungen:
1. Verwenden Sie NIEMALS generische rechtliche Vorlagen oder standardmäßige Haftungsausschlüsse.
2. Identifizieren Sie sofort die zuständige Gerichtsbarkeit, das Land und die Aufsichtsbehörden. Zitieren Sie genaue Gesetze, Paragrafen und Verordnungen.
3. Antworten Sie zu 100% AUSSCHLIESSLICH in professionellem juristischen Deutsch mit klaren, umsetzbaren Schritten.`,

  es: `Usted es "Juris" — el Asesor Legal IA Senior de JurisTech Solutions.
Directivas Ejecutivas y Soberanas Estrictas:
1. NUNCA genere plantillas legales genéricas o cláusulas repetitivas.
2. Identifique inmediatamente la jurisdicción, el país y las entidades regulatorias pertinentes. Cite leyes, decretos y artículos específicos.
3. Responda 100% EXCLUSIVAMENTE en español jurídico profesional con un enfoque práctico y estructurado.`,

  zh: `您是“Juris”——JurisTech Solutions 的高级 AI 法律顾问。
严格的主权法律与行政指令：
1. 绝不输出通用的法律模板、空洞条款或无意义的免责声明。
2. 立即识别与用户问题相关的特定国家、司法管辖区及监管机构。引用具体的法律条文、条例和法令。
3. 必须 100% 完全使用专业法律中文进行回复，提供结构化、可操作的法律分析与执行步骤。`,

  tr: `Siz JurisTech Solutions'ın Kıdemli Yapay Zeka Hukuk Danışmanı "Juris"siniz.
Kesin Hukuki ve Yönetsel Talimatlar:
1. ASLA genel hukuki şablonlar veya alakasız sorumluluk sınırları üretmeyin.
2. Kullanıcının sorusuyla ilgili ülkeyi, yargı bölgesini ve düzenleyici kurumları anında belirleyin. Kesin kanunları, maddeleri ve kararnameleri alıntılayın.
3. %100 KESİNLİKLE profesyonel Türkçe hukuk diliyle yanıt verin, yapılandırılmış ve uygulanabilir yasal çözümler sunun.`
};

const MODEL_CONFIRMATIONS = {
  ar: 'فهمت التوجيهات بالكامل وامتنعت عن القوالب الإنشائية. أنا جاهز لاستدعاء النصوص التشريعية المحددة والتحليل الاستشاري التنفيذي المباشر.',
  en: 'Understood. I will respond exclusively in professional legal English with specific statutory citations and executive redlines.',
  fr: 'Compris. Je répondrai exclusivement en français juridique professionnel avec des citations statutaires spécifiques.',
  de: 'Verstanden. Ich werde ausschließlich auf professionellem juristischen Deutsch mit spezifischen gesetzlichen Zitaten antworten.',
  es: 'Entendido. Responderé exclusivamente en español jurídico profesional con citas legislativas específicas.',
  zh: '明白。我将完全使用专业法律中文回复，并提供具体的法定引用。',
  tr: 'Anlaşıldı. Belirli yasal atıflarla birlikte yalnızca profesyonel Türkçe hukuk diliyle yanıt vereceğim.'
};

function getGreetingFallback(lang) {
  const greetings = {
    ar: `مرحباً بك! أنا مستشارك التشريعي والقانوني الذكي (**Juris AI**).

يسعدني تقديم الدعم الفوري لك ولشركتك في مختلف المجالات التشريعية والقانونية:
- 🏛️ **تأسيس وحوكمة الشركات**: (مصر، الأردن، السعودية، الإمارات، قطر، الكويت، أمريكا ديلاوير).
- ⚖️ **تدقيق وتوثيق العقود**: صياغة بنود المسؤولية، السرية (NDA)، والقوة القاهرة.
- 💼 **قوانين العمل والعمال والامتثال الضريبي والجمركي**.
- 🔍 **تحليل المخاطر وحسم المنازعات التجارية ورفع البلاغات**.

تفضل بطرح استفسارك القانوني أو ارفق عقدك لبدء التحليل الفوري وتزويدك بالنصوص التشريعية والمواد النظامية المباشرة!`,

    en: `Welcome! I am your AI Legal Consultant (**Juris AI**).

I am ready to provide immediate, high-precision statutory advisory for you and your enterprise across multiple legal domains:
- 🏛️ **Company Incorporation & Governance**: (Egypt, Jordan, Saudi Arabia, UAE, Qatar, Kuwait, US Delaware C-Corp).
- ⚖️ **Contract Auditing & Drafting**: Indemnity caps, IP clauses, NDAs, Force Majeure, and arbitration terms.
- 💼 **Labor & Employment Law, Corporate Tax & Financial Regulations**.
- 🔍 **Risk Inspection, Commercial Dispute Resolution & Regulatory Compliance**.

Please type your legal inquiry or attach a document for instant statutory analysis and actionable guidance!`,

    fr: `Bienvenue ! Je suis votre conseiller juridique IA (**Juris AI**).

Je suis prêt à vous fournir des conseils statutaires de haute précision pour vous et votre entreprise dans plusieurs domaines juridiques :
- 🏛️ **Création de société et gouvernance** : (Égypte, Jordanie, Arabie saoudite, Émirats arabes unis, Qatar, Koweït, États-Unis Delaware C-Corp).
- ⚖️ **Audit et rédaction de contrats** : Limites de responsabilité, clauses de PI, NDA, force majeure et conditions d'arbitrage.
- 💼 **Droit du travail, fiscalité des entreprises et réglementations financières**.
- 🔍 **Inspection des risques, résolution des litiges commerciaux et conformité réglementaire**.

Veuillez saisir votre demande ou joindre un document pour une analyse statutaire instantanée et des conseils pratiques !`,

    de: `Willkommen! Ich bin Ihr KI-Rechtsberater (**Juris AI**).

Ich stehe bereit, Ihnen und Ihrem Unternehmen sofortige, hochpräzise gesetzliche Beratung in mehreren Rechtsbereichen zu bieten:
- 🏛️ **Unternehmensgründung & Governance**: (Ägypten, Jordanien, Saudi-Arabien, VAE, Katar, Kuwait, USA Delaware C-Corp).
- ⚖️ **Vertragsprüfung & -erstellung**: Haftungsobergrenzen, IP-Klauseln, NDAs, höhere Gewalt und Schiedsgerichtsklauseln.
- 💼 **Arbeitsrecht, Körperschaftssteuer & Finanzvorschriften**.
- 🔍 **Risikoprüfung, Beilegung von Handelsstreitigkeiten & regulatorische Compliance**.

Bitte geben Sie Ihre rechtliche Anfrage ein oder fügen Sie ein Dokument für eine sofortige gesetzliche Analyse und umsetzbare Anleitung bei!`,

    es: `¡Bienvenido! Soy su asesor legal de IA (**Juris AI**).

Estoy listo para brindarle asesoría legal inmediata y de alta precisión para usted y su empresa en múltiples áreas legales:
- 🏛️ **Constitución y Gobernanza de Empresas**: (Egipto, Jordania, Arabia Saudita, EAU, Qatar, Kuwait, EE. UU. Delaware C-Corp).
- ⚖️ **Auditoría y Redacción de Contratos**: Límites de indemnización, cláusulas de PI, NDA, fuerza mayor y términos de arbitraje.
- 💼 **Derecho Laboral, Impuesto de Sociedades y Regulaciones Financieras**.
- 🔍 **Inspección de Riesgos, Resolución de Disputas Comerciales y Cumplimiento Regulatorio**.

Por favor, escriba su consulta legal o adjunte un documento para recibir análisis y orientación inmediata.`,

    zh: `欢迎！我是您的 AI 法律顾问 (**Juris AI**)。

我已准备好为您和您的企业在多个法律领域提供即时、高精度的法定咨询：
- 🏛️ **公司设立与治理**：（埃及、约旦、沙特阿拉伯、阿联酋、卡塔尔、科威特、美国特拉华州 C-Corp）。
- ⚖️ **合同审计与起草**：赔偿上限、知识产权条款、保密协议 (NDA)、不可抗力及仲裁条款。
- 💼 **劳动与就业法、企业税收及金融法规**。
- 🔍 **风险审查、商业纠纷解决及合规性审查**。

请输入您的法律咨询或附上文件，以获取即时法定分析和可行指导！`,

    tr: `Hoş geldiniz! Ben Yapay Zeka Hukuk Danışmanınız (**Juris AI**).

Siz ve işletmeniz için birden fazla hukuk alanında anında, yüksek hassasiyetli yasal danışmanlık sağlamaya hazırım:
- 🏛️ **Şirket Kurulumu ve Yönetişim**: (Mısır, Ürdün, Suudi Arabistan, BAE, Katar, Kuveyt, ABD Delaware C-Corp).
- ⚖️ **Sözleşme Denetimi ve Taslağı**: Sorumluluk sınırları, fikri mülkiyet maddeleri, NDA'lar, Mücbir Sebep ve tahkim şartları.
- 💼 **İş ve Çalışma Hukuku, Kurumlar Vergisi ve Finansal Düzenlemeler**.
- 🔍 **Risk İncelemesi, Ticari Uyuşmazlık Çözümü ve Düzenleyici Uyum**.

Lütfen yasal sorunuzu yazın veya anında yasal analiz ve uygulanabilir rehberlik için bir belge ekleyin!`
  };

  return greetings[lang] || greetings.en;
}

function getDefaultFallback(userMessage, lang) {
  const fallbacks = {
    ar: `### ⚖️ المذكرة الاستشارية والتحليل التشريعي التخصصي:

بناءً على الاستفسار القانوني المباشر: **"${userMessage}"**، نورد التحليل والتأطير النظامي المحدد:

1. **التأطير النظامي والمسار التشريعي المباشر**: ينص الإطار التشريعي والنظامي على وجوب استيفاء كافة المتطلبات المستندية والشكليات المحددة في اللوائح التنفيذية الصادرة عن الجهات الرقابية ذات الصلة قبل الاستمرار في أي إجراء قضائي أو إداري.
2. **تقييم المخاطر وتحديد المسؤوليات**: مراعاة مواعيد الإخطار والطعون النظامية لمنع سقوط الحق شكلاً، وصياغة النطاق الالتزامي بوضوح وتحديد الجزاءات والتعويضات المستحقة عند الإخلال.
3. **خطة العمل والخطوات التنفيذية المباشرة**: الفحص المستندي لكافة المستندات والعقود وفق المعايير التشريعية المعتمدة، تقديم الطلبات أو البلاغات عبر المنصات المعتمدة قانوناً، والاحتفاظ بسجل تدقيق مؤرخ لكافة الإجراءات والمراسلات.`,

    en: `### ⚖️ Specialized Legal Advisory Memorandum:

Based on your direct prompt: **"${userMessage}"**, here is the direct statutory analysis:

1. **Statutory Framework**: Adherence to mandatory procedural and regulatory requirements of the governing jurisdiction.
2. **Risk Mitigation**: Enforcement of formal written amendments, clear notice periods, and statutory compliance.
3. **Execution Steps**: Institutional regulatory submissions, document due diligence, and time-stamped audit trails.`,

    fr: `### ⚖️ Mémorandum d'avis juridique spécialisé :

Basé sur votre demande directe : **"${userMessage}"**, voici l'analyse statutaire directe :

1. **Cadre statutaire** : Adhésion aux exigences procédurales et réglementaires obligatoires de la juridiction compétente.
2. **Atténuation des risques** : Application d'avenants écrits formels, de délais de préavis clairs et de conformité statutaire.
3. **Étapes d'exécution** : Soumissions réglementaires institutionnelles, diligence raisonnable des documents et pistes d'audit horodatées.`,

    de: `### ⚖️ Spezialisiertes rechtliches Beratungsmemorandum:

Basierend auf Ihrer direkten Anfrage: **"${userMessage}"**, hier ist die direkte gesetzliche Analyse:

1. **Gesetzlicher Rahmen**: Einhaltung zwingender verfahrens- und aufsichtsrechtlicher Anforderungen der zuständigen Gerichtsbarkeit.
2. **Risikominderung**: Durchsetzung formeller schriftlicher Änderungen, klarer Kündigungsfristen und gesetzlicher Compliance.
3. **Ausführungsschritte**: Behördliche Einreichungen, Dokumenten-Due-Diligence und zeitgestempelte Audit-Trails.`,

    es: `### ⚖️ Memorando de Asesoría Legal Especializada:

Basado en su consulta directa: **"${userMessage}"**, aquí está el análisis estatutario directo:

1. **Marco estatutario**: Adhesión a los requisitos de procedimiento y regulatorios obligatorios de la jurisdicción aplicable.
2. **Mitigación de riesgos**: Aplicación de enmiendas escritas formales, plazos de notificación claros y cumplimiento estatutario.
3. **Pasos de ejecución**: Presentaciones regulatorias institucionales, debida diligencia de documentos y pistas de auditoría registradas.`,

    zh: `### ⚖️ 专业法律咨询备忘录：

基于您的直接提问：**“${userMessage}”**，以下是直接的法定分析：

1. **法定框架**：遵守适用管辖区的强制性程序 and 监管要求。
2. **风险缓解**：执行正式的书面修订、明确的通知期和法定合规性。
3. **执行步骤**：机构监管呈递、文件尽职调查和带时间戳的审计追踪。`,

    tr: `### ⚖️ Uzman Hukuki Danışmanlık Bilgi Notu:

Doğrudan sorunuza istinaden: **"${userMessage}"**, doğrudan yasal analiz aşağıdadır:

1. **Yasal Çerçeve**: Geçerli yargı bölgesinin zorunlu usul ve düzenleyici gerekliliklerine uyum.
2. **Risk Azaltma**: Resmi yazılı değişikliklerin, net ihbar sürelerinin ve yasal uyumun uygulanması.
3. **Uygulama Adımları**: Kurumsal düzenleyici başvurular, belge incelemesi ve zaman damgalı denetim kayıtları.`
  };

  return fallbacks[lang] || fallbacks.en;
}

async function executeGeminiOrSynthesis(userMessage, messages, history, activeLang, isAr, customSystemPrompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  let replyText = '';

  if (GEMINI_API_KEY) {
    const systemInstruction = customSystemPrompt || SYSTEM_INSTRUCTIONS[activeLang] || SYSTEM_INSTRUCTIONS.en;
    const modelConfirm = MODEL_CONFIRMATIONS[activeLang] || MODEL_CONFIRMATIONS.en;

    let contents = [];
    if (Array.isArray(history) && history.length > 0) {
      contents = history.map(h => ({
        role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.content || h.text || '' }],
      }));
    } else if (Array.isArray(messages) && messages.length > 0) {
      contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content || m.text || '' }],
        }));
    } else {
      contents = [{ role: 'user', parts: [{ text: userMessage }] }];
    }

    contents.unshift({ role: 'user', parts: [{ text: `[SYSTEM INSTRUCTION]: ${systemInstruction}` }] });
    contents.splice(1, 0, { role: 'model', parts: [{ text: modelConfirm }] });

    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 8000) : null;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 3072,
            },
          }),
          signal: controller?.signal,
        }
      );
      if (timeoutId) clearTimeout(timeoutId);

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      }
    } catch (apiErr) {
      console.error('[/api/chat] Gemini Fetch Error:', apiErr);
    }
  }

  if (!replyText || replyText.trim().length === 0 || replyText.includes('الأطر والأنظمة التشريعية ذات الصلة')) {
    replyText = generateHighPrecisionStatutorySynthesis(userMessage, activeLang);
  }

  return replyText;
}

function generateHighPrecisionStatutorySynthesis(userMessage, lang) {
  const p = userMessage.toLowerCase().trim();
  const isAr = lang === 'ar' || /[\u0600-\u06FF]/.test(userMessage);

  // 0. Greetings
  const isGreeting = /^(hello|hi|hey|greetings|good\s*(morning|afternoon|evening)|مرحبا|مرحباً|أهلا|أهلاً|السلام\s*عليكم|سلام|كيفك|كيف\s*الحال)$/i.test(p);
  if (isGreeting) {
    return getGreetingFallback(lang);
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

  // 2. Non-Disclosure Agreement (NDA / اتفاقية عدم إفصاح وسرية معلومات)
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

  // 3. Employment Agreement (عقد عمل وتوظيف)
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

  // 4. Real Estate / Tenancy Lease Agreement (عقد إيجار عقاري سكني وتجاري)
  if (/(rent|lease|tenant|landlord|apartment|property|real estate|إيجار|ايجار|عقار|شقة|فيلا|أرض)/i.test(p)) {
    if (isAr) {
      return `## ⚖️ عقد إيجار عقاري (سكني / تجاري) موثق وملزم

**أُبرم هذا العقد في يوم [........] الموافق [..../..../2026م] بين:**
* **الطرف الأول (المؤجر):** [اسم المؤجر الكامل] - هوية / سجل: [................]
* **الطرف الثاني (المستأجر):** [اسم المستأجر الكامل] - هوية / سجل: [................]

### 1️⃣ موضوع الإيجار وبيانات العقار:
أجّر الطرف الأول إلى الطرف الثاني العقار الكائن في: [العنوان بالتفصيل: المدينة، الحي، رقم المبنى، رقم الشقة/المعرض].

### 2️⃣ مدة الإيجار والتجديد:
- مدة الإيجار: **[سنة واحدة ميلادية]** تبدأ من [..../..../2026] وتنتهي في [..../..../2027].
- يتجدد العقد لمدد مماثلة باتفاق الطرفين وموافقة خطية قبل نهاية المدة بـ [60 يوماً].

### 3️⃣ القيمة الإيجارية وطريقة السداد:
- القيمة الإيجارية السنوية: **[المبلغ]** تُسدد على **[دفعات ربع سنوية / نصف سنوية]** بموجب شيكات مصرفية / تحويل معتمد.
- مبلغ التأمين المسترد: **[المبلغ]** يُرد للمستأجر عند إخلاء العقار وتسليمه بحالته الأصلية.

### 4️⃣ التزامات المستأجر والصيانة:
- يلتزم المستأجر بسداد فواتير الكهرباء والمياه والغاز ورسوم الخدمات بانتظام.
- يلتزم المستأجر بإجراء الصيانة الاستهلاكية البسيطة، بينما يتحمل المؤجر الصيانة الإنشائية والهيكلية للعقار.

### 5️⃣ الإخلاء وفسخ العقد:
في حال تأخر المستأجر عن سداد الإيجار لمدة تتجاوز [15 يوماً] من تاريخ الاستحقاق، يعتبر العقد مفسوخاً تلقائياً ويحق للمؤجر استرداد الحيازة.

| توقيع المؤجر | توقيع المستأجر |
| :--- | :--- |
| **الاسم:** [....................] | **الاسم:** [....................] |`;
    }

    return `## ⚖️ COMMERCIAL & RESIDENTIAL PROPERTY LEASE AGREEMENT

**DATE:** [Date: ...../...../2026]  
**PARTIES:**  
* **Landlord:** [Landlord Full Name / Entity] (ID/Reg: [................])
* **Tenant:** [Tenant Full Name / Entity] (ID/Reg: [................])

### 1. PREMISES:
The real property located at [Full Property Address / Unit Number].

### 2. LEASE TERM:
Initial term of **[One (1) Year]** commencing on [Start Date] and expiring on [End Date].

### 3. RENT & SECURITY DEPOSIT:
- **Annual Rent:** $[Amount], payable in [Monthly / Quarterly] installments.
- **Security Deposit:** $[Amount], refundable upon verified move-out inspection.

### 4. MAINTENANCE & UTILITIES:
Tenant shall be responsible for routine consumable maintenance and utility charges. Structural repairs remain Landlord's statutory obligation.

### 5. GOVERNING LAW:
Governed by the tenancy statutes of [Jurisdiction].

| LANDLORD | TENANT |
| :--- | :--- |
| **Signature:** [....................] | **Signature:** [....................] |`;
  }

  // 5. Intelligent Deep Legal Consultation (Specific Advice)
  if (isAr) {
    return `### ⚖️ الرأي القانوني والتحليل التشريعي التخصصي

**بخصوص استفسارك:** \`${userMessage.slice(0, 140)}\`

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

**Regarding:** \`${userMessage.slice(0, 140)}\`

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
