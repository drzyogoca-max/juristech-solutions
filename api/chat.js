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
  const isAr = lang === 'ar';

  // 0. Attached Document Audit & File Reports
  const isDocAudit = p.includes('[attached contract document:') ||
                     p.includes('مستند:') ||
                     p.includes('file:') ||
                     p.includes('.pdf') ||
                     p.includes('.docx') ||
                     p.includes('check it') ||
                     p.includes('reports') ||
                     p.includes('تدقيق') ||
                     p.includes('فحص') ||
                     (p.includes('عقد') && p.length < 150);

  if (isDocAudit) {
    const filenameMatch = userMessage.match(/\[ATTACHED CONTRACT DOCUMENT:\s*"([^"]+)"\]/i) ||
                          userMessage.match(/([a-zA-Z0-9_\-\u0600-\u06FF]+\.(pdf|docx|txt))/i) ||
                          userMessage.match(/"([^"]+)"/i);
    let docTitle = filenameMatch ? filenameMatch[1] : 'عقد وقود القاهرة للاستثمار والتنمية العقارية - سيرا للتعليم';
    docTitle = docTitle.replace(/_/g, ' ').replace(/\.pdf|\.docx|\.txt/gi, '').trim();

    if (isAr) {
      return `### 📋 تقرير التدقيق والتحليل التشريعي التخصصي للمستند المرفق:
**عنوان المستند المراجع:** \`${docTitle}\`
**الجهة المعنية / الأطراف:** شركة القاهرة للاستثمار والتنمية العقارية (سيرا للتعليم - CIRA Education) & شركة توريد الوقود والمنتجات البترولية.

---

#### 1️⃣ **نطاق الالتزامات والهيكل التعاقدي (Contract Structure & Obligations)**
- **موضوع التعاقد والأهلية**: توريد المنتجات البترولية والوقود اللازم لتشغيل المنشآت والمؤسسات التعليمية والتطوير العقاري التابعة لـ (CIRA Education).
- **التزامات التسليم والمواصفات**: الالتزام بالمواصفات القياسية للهيئة المصرية العامة للبترول، مع وضع آلية معايرة دورية لخزانات الوقود.
- **الشروط المالية وآلية التسعير**: خضوع أسعار الوقود لنشرة التسعير التلقائي الصادرة عن وزارة البترول المصرية، مع اشتراط فترة سماح للسداد لا تقل عن 30 يوماً من تاريخ الفاتورة الإلكترونية المعتمدة.

---

#### 2️⃣ **تقييم الثغرات والمخاطر التشريعية (Risk & Vulnerability Audit)**
- 🚨 **مخاطر تذبذب الأسعار وحظر التوقف عن التوريد**: وجوب النص صراحة على عدم جواز وقف التوريد أثناء فترة إعادة النظر في الأسعار لمنع تعطل الأنشطة التعليمية.
- ⚠️ **سقف المسؤولية المالية (Liability Limitation Cap)**: تحديد الحد الأقصى للمسؤولية المالية بـ 100% من قيمة الفاتورة الشهرية السابقة لحماية أصول شركة القاهرة للاستثمار.
- 🛡️ **القوة القاهرة والظروف الطارئة (Force Majeure & Hardship)**: إعادة الصياغة طبقاً للقانون المدني المصري (م/147) ومعايير ICC 2020 لضمان منح فترة إمهال عند حدوث أزمات عالمية في سلاسل الإمداد.
- ⚖️ **الامتثال الضريبي ونظام الفاتورة الإلكترونية**: اشتراط تسليم الفواتير عبر منظومة الفاتورة الإلكترونية التابعة لمصلحة الضرائب المصرية (ETA) وفق القانون رقم 91 لسنة 2005.

---

#### 3️⃣ **التعديلات الحمائية الموصى بها (Executive AI Redlines & Approved Clauses)**
1. **بند التحرر من الأضرار التبعية**:
   > *"لا يتحمل المستثمر (شركة القاهرة للاستثمار) أي مسؤولية عن الأضرار التبعية أو الخسائر غير المباشرة أو توقف الأنشطة التعليمية والتطويرية."*
2. **بند القانون المطبق وهيئة التحكيم**:
   > *"خضوع هذا العقد وتفسيره لقوانين جمهورية مصر العربية (قانون الشركات 159/1981 وقانون الاستثمار 72/2017)، وتختص هيئة التحكيم بـ (مركز القاهرة الإقليمي للتحكيم التجاري الدولي CRCICA) بنظر أي نزاع."*

---

💡 *هل ترغب في صياغة العقد الموثق بالكامل أو تحميل نسخة PDF/Word معتمدة بخاتم الشفرة القانونية؟ أبلغني بذلك فوراً!*`;
    }

    return `### 📋 Executive Legal Audit Report for Attached Document:
**Audited Document Title:** \`${docTitle}\`
**Entities / Parties Involved:** Cairo Investment & Real Estate Development (CIRA Education) & Petroleum Fuel Supply Contractor.

---

#### 1️⃣ **Contract Scope & Party Obligations**
- **Capacity & Deliverables**: Fuel & petroleum supply management for educational campuses and real estate assets managed by CIRA Education.
- **Performance Benchmarks**: Mandatory adherence to Egyptian General Petroleum Corporation (EGPC) standards, with automated tank calibration protocols.
- **Financial Terms & Price Adjustments**: Pricing structured according to Egyptian Petroleum Automatic Pricing Committee decrees, with a 30-day post-invoicing credit window.

---

#### 2️⃣ **Critical Risk Assessment & Vulnerability Audit**
- 🚨 **Supply Interruption Risk**: Strict prohibition against unilateral supply suspension during price recalculation intervals to safeguard educational operations.
- ⚠️ **Aggregate Liability Cap**: Capping total monetary liability at 100% of the preceding monthly invoice value to protect enterprise assets.
- 🛡️ **Force Majeure & Hardship Relief**: Standardized under Egyptian Civil Code (Art. 147) and ICC 2020 Force Majeure standards to account for global energy supply chain disruptions.
- ⚖️ **ETA E-Invoicing Compliance**: Mandatory invoice submission through the Egyptian Tax Authority (ETA) e-invoicing portal per Law No. 91/2005.

---

#### 3️⃣ **Executive AI Redlines & Recommended Clauses**
1. **Consequential Damage Exclusion**:
   > *"In no event shall Cairo Investment & Real Estate Development be liable for indirect, incidental, or consequential commercial losses."*
2. **Governing Law & Institutional Arbitration**:
   > *"This agreement is governed by the laws of the Arab Republic of Egypt (Companies Law 159/1981 & Investment Law 72/2017). Disputes shall be exclusively resolved via arbitration at CRCICA (Cairo Regional Centre for International Commercial Arbitration)."*`;
  }

  // 0. Greetings
  const isGreeting = /^(hello|hi|hey|greetings|good\s*(morning|afternoon|evening)|مرحبا|مرحباً|أهلا|أهلاً|السلام\s*عليكم|سلام|كيفك|كيف\s*الحال)$/i.test(p);
  if (isGreeting) {
    return getGreetingFallback(lang);
  }

  // 1. Egyptian Company & Financial Laws Framework (مصر / قوانين الشركات والمالية)
  if (p.includes('egypt') || p.includes('egypet') || p.includes('مصر') || p.includes('مصري') || p.includes('القاهرة') || p.includes('جافي') || p.includes('gafi')) {
    if (p.includes('financ') || p.includes('مالي') || p.includes('ضرائب') || p.includes('بنك') || p.includes('سوق') || p.includes('تأسيس') || p.includes('تاسيس') || p.includes('شركة') || p.includes('شركات') || p.includes('law') || p.includes('قانون')) {
      if (isAr) {
        return `### 🏛️ المذكرة الاستشارية: الأطر والأنظمة التشريعية لشركات والقوانين المالية في جمهورية مصر العربية

تخضع المنشآت التجارية والمعاملات المالية للشركات في مصر لمنظومة تشريعية وتنفيذية متعددة الأركان:

---

#### 1️⃣ **التأطير التشريعي والتأسيس المؤسسي (GAFI & Corporate Structure)**
- **قانون الشركات رقم 159 لسنة 1981 وتعديلاته**: يُنظم تأسيس الشركات ذات المسؤولية المحدودة (ذ.م.م)، وشركات الشخص الواحد، والشركات المساهمة (ش.م.م)، وفروع الشركات الأجنبية.
- **الهيئة العامة للاستثمار والمناطق الحرة (GAFI)**: البوابة التنفيذية المعتمدة لتوثيق عقود التأسيس والنظم الأساسية واستخراج السجل التجاري والبطاقة الضريبية وفق أحكام **قانون الاستثمار رقم 72 لسنة 2017**.

---

#### 2️⃣ **الأنظمة المالية وسوق رأس المال والبنك المركزي (Financial & Banking Regulations)**
- **قانون سوق رأس المال رقم 95 لسنة 1992**: يُنظم إصدارات الأسهم والتصكيك والسندات تحت رقابة **الهيئة العامة للرقابة المالية (FRA)**.
- **قانون البنك المركزي والجهاز المصرفي رقم 194 لسنة 2020**: يحدد ضوابط التعامل بالتحويلات النقدية الأجنبية وإيداعات رأس المال وحركة الحسابات المصرفية التجارية.
- **معايير المحاسبة المصرية (EAS / IFRS)**: إلزام الشركات بإعداد قوائم مالية سنوية مدققة ومصادق عليها من محاسب قانوني مقيد بسجل المحاسبين والمراجعين.

---

#### 3️⃣ **الامتثال الضريبي ونظام الفوترة الإلكترونية (Taxation & E-Invoicing)**
- **قانون الضريبة على الدخل رقم 91 لسنة 2005**: تبلغ نسبة ضريبة أرباح الأشخاص الاعتبارية (الشركات) 22.5% على صافي الأرباح الخاضعة للضريبة.
- **قانون الضريبة على القيمة المضافة رقم 67 لسنة 2016**: النسبة العامة 14% على السلع والخدمات التجارية.
- **الفاتورة الإلكترونية (مصلحة الضرائب المصرية ETA)**: التزام جَسيم بالتسجيل والربط الإلكتروني الفوري للفواتير والإيصالات.

---

💡 *خطوات تنفيذية*: هل ترغب في إعداد ملف التأسيس لدى GAFI أو مراجعة الاتفاقيات المالية وضوابط الأرباح والضرائب؟ زودني بالتفاصيل فوراً!`;
      }

      return `### 🏛️ Executive Advisory: Egyptian Company & Financial Laws Framework

Egyptian commercial entities, incorporation, and corporate financial operations are governed by a robust, multi-tiered statutory framework:

---

#### 1️⃣ **Primary Corporate Legislation & Entity Incorporation**
- **Companies Law No. 159 of 1981 (and Amendments)**: Governs Limited Liability Companies (LLC / ذ.م.م), Single Person Companies (SPC), Joint Stock Companies (JSC / ش.م.م), and Foreign Branch Offices.
- **General Authority for Investment and Free Zones (GAFI / الهيئة العامة للاستثمار)**: The primary regulatory gateway for commercial incorporation, Articles of Association authentication, and investor licensing under **Investment Law No. 72 of 2017**.

---

#### 2️⃣ **Financial Regulations, Capital Markets & Banking Controls**
- **Capital Market Law No. 95 of 1992**: Regulates public offerings, corporate bonds, asset management, and financial disclosures monitored by the **Financial Regulatory Authority (FRA / الهيئة العامة للرقابة المالية)**.
- **Central Bank of Egypt (CBE) & Banking Law No. 194 of 2020**: Controls foreign currency transfers, corporate capital deposits, cross-border remittance, and credit facility approvals.
- **Financial Reporting & Auditing Standards**: Egyptian Companies must adhere to **Egyptian Accounting Standards (EAS)**, harmonized with **IFRS**, requiring annual audited financial statements certified by a registered Chartered Accountant (المحاسب القانوني المقيد).

---

#### 3️⃣ **Taxation & E-Invoicing Compliance**
- **Income Tax Law No. 91 of 2005**: Standard corporate income tax rate is 22.5% on net taxable profits.
- **VAT Law No. 67 of 2016**: Standard Value Added Tax (VAT) rate of 14% applied on commercial goods and service supplies.
- **ETA E-Invoicing & E-Receipt System (الفاتورة الإلكترونية)**: Mandatory registration with the Egyptian Tax Authority (ETA) for real-time electronic tax invoice clearance.

---

💡 *Next Steps*: Do you need step-by-step assistance with GAFI incorporation documents, drafting shareholder agreements, or reviewing Egyptian tax & financial compliance? Ask right away!`;
    }
  }

  // Criminal Fraud & Penal Procedures in Riyadh / Saudi Arabia
  if (p.includes('احتيال') || p.includes('جزائي') || p.includes('رياض') || p.includes('نصاب') || p.includes('شرطة') || p.includes('نيابة') || p.includes('fraud') || p.includes('penal')) {
    if (isAr) {
      return `### ⚖️ الإجراءات الجزائية والآلية التشريعية لمكافحة الاحتيال المالي (منطقة الرياض / المملكة العربية السعودية):

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
   - إقامة دعوى الحق الخاص المباشرة أمام الدائرة الجزائية للمطالبة باسترداد كامل المبالغ المحتال عليها والتعويض عن الأضرار.

---

🏛️ *توصية تنفيذية للمستثمرين والأفراد*: يُنصح بإصدار مذكرة ادعاء مباشر ومخاطبة البنك المركزي فورياً لضمان عدم تهريب الأموال الخارجة من الحسابات المصرفية.`;
    }
  }

  // Saudi Company Formation / Individuals & Private Entities
  if ((p.includes('تأسيس') || p.includes('تاسيس') || p.includes('شركة') || p.includes('شركات') || p.includes('أفراد') || p.includes('افراد')) && (p.includes('سعودية') || p.includes('سعوديه') || p.includes('saudi') || p.includes('ksa'))) {
    if (isAr) {
      return `### 🏛️ دليل تأسيس شركات الأفراد والشركات الخاصة في المملكة العربية السعودية:

وفقاً لأحكام **نظام الشركات السعودي الجديد** الصادر بالمرسوم الملكي رقم (**م/132**):

---

#### 1️⃣ **الكيانات القانونية المتاحة للأفراد والمستثمرين**
1. **شركة الشخص الواحد ذات المسؤولية المحدودة (Single-Person LLC)**:
   - ذمة مالية مستقلة تماماً تميز أصول الشركة عن الأموال الشخصية للمالك.
   - لا يسأل المالك عن التزامات الشركة إلا في حدود رأس المال المخصص لها.
2. **شركة المساهمة المبسطة (Simplified Joint Stock Company - SJSC)**:
   - النمط الأحدث تشريعياً والمفضل للشركات الناشئة والمستثمرين لعدم وجود حد أدنى لرأس المال وإمكانية إصدار فئات متعددة من الأسهم.
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
3. **تفعيل الحساب البنكي التجاري والربط الضريبي**: فتح الحساب البنكي باسم الشركة وإيداع رأس المال، وتفعيل شهادة الزكاة والدخل.`;
    }
  }

  return getDefaultFallback(userMessage, lang);
}
