/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AI GATEWAY MIDDLEWARE — JurisTech Solutions v9.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * Enforces Freemium Gating Rules:
 *  1. 10-message free trial limit per session (localStorage persisted)
 *  2. Contract gating — full contracts only for paid subscribers
 *  3. Subscription modal trigger on quota exhaustion
 *  4. WhatsApp escalation integration (+201126674337)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export const FREE_MSG_LIMIT = 10;
export const STORAGE_KEY_CHAT = 'ls_free_chat_uses';
export const OFFICIAL_SUPPORT_EMAIL = 'Drzyogo.ca@gmail.com';
export const EMERGENCY_BUSINESS_LINE = '+1 (800) JURIS-TECH';
export const SUPPORT_TICKET_URL = '/support';
export const WHATSAPP_URL = '/support';
export const WHATSAPP_NUMBER = 'Drzyogo.ca@gmail.com';

// ── Contract detection keywords (Arabic + English + French + German + Spanish + Chinese + Turkish)
const CONTRACT_KEYWORDS_GENERATE = [
  // Arabic
  'صياغة عقد', 'أنشئ عقد', 'اكتب عقد', 'اصنع عقد', 'ولّد عقد', 'اعمل عقد', 'حرر عقد',
  'صياغة اتفاقية', 'أنشئ اتفاقية', 'اكتب اتفاقية', 'ولّد اتفاقية',
  'عقد كامل', 'نص العقد', 'نص الاتفاقية', 'صيغة عقد', 'مسودة عقد',
  // English
  'generate contract', 'draft contract', 'create contract', 'write contract', 'full contract',
  'generate agreement', 'draft agreement', 'create agreement', 'write agreement',
  'contract template', 'contract document', 'full agreement text',
  // French / German / Spanish / Turkish
  'rédiger contrat', 'créer contrat', 'vertrag erstellen', 'contrato redactar', 'sözleşme oluştur',
];

const CONTRACT_KEYWORDS_MENTION = [
  'عقد', 'اتفاقية', 'وثيقة قانونية', 'بند', 'مسودة',
  'contract', 'agreement', 'clause', 'legal document', 'draft',
  'contrat', 'vereinbarung', 'contrato', 'sözleşme', '合同',
];

// ── Result types
export type GatewayStatus =
  | 'ALLOWED'
  | 'LIMIT_EXCEEDED'
  | 'CONTRACT_PARTIAL_PREVIEW';

export interface GatewayResult {
  status: GatewayStatus;
  /** If ALLOWED, proceed with full AI call */
  allowed: boolean;
  /** If CONTRACT_PARTIAL_PREVIEW, use this canned response */
  partialPreview?: Record<string, string>;
  /** Human-readable message for UI display */
  message?: Record<string, string>;
}

/**
 * Main AI Gateway check — call BEFORE every chat message send.
 *
 * @param userQuery      Raw user input text
 * @param isPaidUser     Whether user has an active paid subscription
 * @param messageCount   Number of messages already sent this session
 */
export function checkAIGateway(
  userQuery: string,
  isPaidUser: boolean,
  messageCount: number
): GatewayResult {
  // ── 1. Paid users bypass all gates
  if (isPaidUser) {
    return { status: 'ALLOWED', allowed: true };
  }

  // ── 2. Free message limit check
  if (messageCount >= FREE_MSG_LIMIT) {
    return {
      status: 'LIMIT_EXCEEDED',
      allowed: false,
      message: {
        ar: `لقد استنفذت الحد المجاني (${FREE_MSG_LIMIT} رسائل). يرجى إتمام الاشتراك للاستمرار والاستفادة من الموسوعة القانونية الكاملة دون أي قيود.`,
        en: `You have used all ${FREE_MSG_LIMIT} free messages. Please subscribe to continue with unlimited AI legal advisory, contract generation, and risk audits.`,
        fr: `Vous avez utilisé vos ${FREE_MSG_LIMIT} messages gratuits. Abonnez-vous pour un accès illimité.`,
        de: `Sie haben Ihre ${FREE_MSG_LIMIT} kostenlosen Nachrichten aufgebraucht. Bitte abonnieren Sie für unbegrenzten Zugang.`,
        es: `Ha agotado sus ${FREE_MSG_LIMIT} mensajes gratuitos. Suscríbase para acceso ilimitado.`,
        zh: `您已使用完${FREE_MSG_LIMIT}条免费消息。请订阅以获取无限访问权限。`,
        tr: `${FREE_MSG_LIMIT} ücretsiz mesajınızı tükettiniz. Sınırsız erişim için lütfen abone olun.`,
      },
    };
  }

  // ── 3. Contract generation gating (partial preview only for free users)
  const queryLower = userQuery.toLowerCase();
  const isContractGenerationRequest = CONTRACT_KEYWORDS_GENERATE.some(kw =>
    queryLower.includes(kw.toLowerCase())
  );

  if (isContractGenerationRequest) {
    return {
      status: 'CONTRACT_PARTIAL_PREVIEW',
      allowed: false,
      partialPreview: {
        ar: buildContractPreviewAr(userQuery),
        en: buildContractPreviewEn(userQuery),
        fr: buildContractPreviewFr(userQuery),
        de: buildContractPreviewDe(userQuery),
        es: buildContractPreviewEs(userQuery),
        zh: buildContractPreviewZh(userQuery),
        tr: buildContractPreviewTr(userQuery),
      },
    };
  }

  // ── 4. Allow (within free limit, no contract generation)
  return { status: 'ALLOWED', allowed: true };
}

/**
 * Detect if user query is about contract drafting (for system prompt injection)
 */
export function isContractMentionQuery(query: string): boolean {
  const lower = query.toLowerCase();
  return CONTRACT_KEYWORDS_MENTION.some(kw => lower.includes(kw.toLowerCase()));
}

/**
 * Get remaining free messages count
 */
export function getRemainingFreeMessages(): number {
  try {
    const used = parseInt(localStorage.getItem(STORAGE_KEY_CHAT) || '0', 10);
    return Math.max(0, FREE_MSG_LIMIT - used);
  } catch {
    return FREE_MSG_LIMIT;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Partial Contract Preview Builders (per language)
// ─────────────────────────────────────────────────────────────────────────────

function buildContractPreviewAr(query: string): string {
  return `📋 **الخطوط العريضة والاستشارة الأولية للعقد المطلوب**

بناءً على طلبك، إليك الهيكل القانوني الأساسي والمبادئ الحاكمة للعقد:

**🏛️ البنية الجوهرية للعقد:**
- **التمهيد وتعريف الأطراف**: تحديد هوية الطرفين وصفتهما القانونية والأهلية التعاقدية الكاملة.
- **موضوع العقد والالتزامات**: تفصيل النطاق، المهام، والمخرجات المتفق عليها.
- **المقابل المالي وآلية الدفع**: الأسعار، الجدول الزمني، والضمانات المالية.
- **السرية وحقوق الملكية الفكرية (NDA & IP)**: حماية الأسرار التجارية والملكية الفكرية.
- **القوة القاهرة والظروف الطارئة**: وفق معايير ICC 2020 والمادة 147/2 مدني.
- **إنهاء العقد والتبعات القانونية**: شروط الفسخ، التعويضات، والإخطار المسبق.
- **القانون الواجب التطبيق وتسوية النزاعات**: الاختصاص القضائي والتحكيم التجاري الدولي.

**⚖️ المخاطر القانونية الرئيسية التي يجب مراعاتها:**
- تحديد سقف المسؤولية المالية الإجمالية.
- حماية الملكية الفكرية السابقة للتعاقد.
- آلية تسوية النزاعات (CRCICA / SCCA / ICC).

---
🔒 **تم إعداد الخطوط العريضة والاستشارة الأولية.**
للحصول على **النص الكامل والموثق قانونياً للعقد** بصيغة Word/PDF مع التوقيع الرقمي المعتمد، يرجى إتمام عملية الدفع وتفعيل الباقة.

💬 للتواصل الفوري والتذاكر المشفرة: [البريد الرسمي للدعم: Drzyogo.ca@gmail.com](mailto:Drzyogo.ca@gmail.com)`;
}

function buildContractPreviewEn(query: string): string {
  return `📋 **Contract Outline & Initial Legal Advisory**

Based on your request, here is the foundational legal structure and governing principles:

**🏛️ Core Contract Architecture:**
- **Preamble & Party Identification**: Full legal identification, capacity, and authority of contracting parties.
- **Subject Matter & Obligations**: Detailed scope, deliverables, timelines, and performance standards.
- **Consideration & Payment Terms**: Pricing schedule, payment milestones, and financial guarantees.
- **Confidentiality & IP Rights (NDA & IP)**: Trade secret protection and intellectual property ownership.
- **Force Majeure & Hardship**: Per ICC 2020 guidelines and applicable civil code.
- **Termination & Legal Consequences**: Rescission conditions, penalties, and prior notice requirements.
- **Governing Law & Dispute Resolution**: Jurisdiction and institutional arbitration (CRCICA / ICC / SCCA).

**⚖️ Key Legal Risks to Address:**
- Cap aggregate financial liability at 100% of total consideration.
- Retain pre-existing background IP and trade secrets.
- Designate institutional arbitration tribunal for cross-border disputes.

---
🔒 **Outline and initial advisory prepared.**
To receive the **complete, legally certified contract document** in Word/PDF format with certified digital signature, please complete payment and activate your subscription.

💬 Instant escalation & encrypted support: [Drzyogo.ca@gmail.com](mailto:Drzyogo.ca@gmail.com)`;
}

function buildContractPreviewFr(query: string): string {
  return `📋 **Aperçu du contrat et conseil juridique initial**

Voici la structure juridique fondamentale pour le contrat demandé :

**🏛️ Architecture contractuelle principale :**
- **Préambule et identification des parties** : Identification légale complète et capacité contractuelle.
- **Objet et obligations** : Portée, livrables, délais et normes de performance.
- **Contrepartie et modalités de paiement** : Calendrier de paiement et garanties financières.
- **Confidentialité et droits de propriété intellectuelle** : Protection des secrets commerciaux.
- **Force majeure** : Conformément aux directives ICC 2020.
- **Résiliation et conséquences juridiques** : Conditions de résiliation et préavis.
- **Droit applicable et résolution des litiges** : Arbitrage institutionnel (CCI / CRCICA).

---
🔒 **Aperçu et conseil initial préparés.**
Pour obtenir le **document contractuel complet et certifié** en Word/PDF avec signature numérique certifiée, veuillez finaliser le paiement et activer votre abonnement.

💬 Contact immédiat : [WhatsApp +201126674337](https://wa.me/201126674337)`;
}

function buildContractPreviewDe(query: string): string {
  return `📋 **Vertragsentwurf & rechtliche Erstberatung**

Hier ist die grundlegende Rechtsstruktur für den angeforderten Vertrag:

**🏛️ Vertragliche Kernarchitektur:**
- **Präambel & Parteiidentifikation**: Vollständige rechtliche Identifikation und Vertragsfähigkeit.
- **Vertragsgegenstand & Verpflichtungen**: Umfang, Liefergegenstände und Leistungsstandards.
- **Vergütung & Zahlungsbedingungen**: Zahlungsplan und finanzielle Garantien.
- **Vertraulichkeit & geistiges Eigentum**: Schutz von Geschäftsgeheimnissen.
- **Höhere Gewalt**: Gemäß ICC 2020-Richtlinien.
- **Kündigung & Rechtsfolgen**: Kündigungsbedingungen und Vorankündigungsfristen.
- **Anwendbares Recht & Streitbeilegung**: Institutionelle Schiedsgerichtsbarkeit.

---
🔒 **Entwurf und Erstberatung vorbereitet.**
Für den **vollständigen, rechtlich zertifizierten Vertrag** in Word/PDF bitte Zahlung abschließen und Abonnement aktivieren.

💬 Sofortkontakt: [WhatsApp +201126674337](https://wa.me/201126674337)`;
}

function buildContractPreviewEs(query: string): string {
  return `📋 **Esquema del contrato y asesoría jurídica inicial**

Aquí está la estructura jurídica fundamental para el contrato solicitado:

**🏛️ Arquitectura contractual principal:**
- **Preámbulo e identificación de las partes**: Identificación legal completa y capacidad contractual.
- **Objeto y obligaciones**: Alcance, entregables y estándares de rendimiento.
- **Contraprestación y condiciones de pago**: Calendario de pagos y garantías financieras.
- **Confidencialidad y propiedad intelectual**: Protección de secretos comerciales.
- **Fuerza mayor**: Según directrices ICC 2020.
- **Rescisión y consecuencias legales**: Condiciones de terminación y preaviso.
- **Ley aplicable y resolución de disputas**: Arbitraje institucional.

---
🔒 **Esquema y asesoría inicial preparados.**
Para el **documento contractual completo y certificado** en Word/PDF con firma digital, complete el pago y active su suscripción.

💬 Contacto inmediato: [WhatsApp +201126674337](https://wa.me/201126674337)`;
}

function buildContractPreviewZh(query: string): string {
  return `📋 **合同概要与初步法律建议**

以下是所请求合同的基本法律结构：

**🏛️ 核心合同架构：**
- **前言及当事人身份确认**：完整的法律身份确认和缔约能力。
- **合同标的及义务**：范围、可交付成果和履行标准。
- **对价及付款条款**：付款计划和财务担保。
- **保密及知识产权**：商业秘密保护和知识产权归属。
- **不可抗力**：依据ICC 2020指引。
- **终止及法律后果**：解约条件和提前通知要求。
- **适用法律及争议解决**：机构仲裁（CRCICA/ICC/SCCA）。

---
🔒 **概要及初步建议已准备完毕。**
如需获得Word/PDF格式的**完整法律认证合同文件**及经认证的数字签名，请完成付款并激活订阅。

💬 即时联系: [WhatsApp +201126674337](https://wa.me/201126674337)`;
}

function buildContractPreviewTr(query: string): string {
  return `📋 **Sözleşme Taslağı & İlk Hukuki Danışmanlık**

Talep edilen sözleşme için temel hukuki yapı:

**🏛️ Temel Sözleşme Mimarisi:**
- **Giriş & Taraf Kimliği**: Tarafların tam hukuki kimliği ve sözleşme ehliyeti.
- **Konu & Yükümlülükler**: Kapsam, teslimler ve performans standartları.
- **Bedel & Ödeme Koşulları**: Ödeme takvimi ve finansal garantiler.
- **Gizlilik & Fikri Mülkiyet**: Ticari sır koruması.
- **Mücbir Sebep**: ICC 2020 yönergelerine göre.
- **Fesih & Hukuki Sonuçlar**: Fesih koşulları ve önceden bildirim.
- **Uygulanacak Hukuk & Uyuşmazlık Çözümü**: Kurumsal tahkim.

---
🔒 **Taslak ve ilk danışmanlık hazırlandı.**
**Eksiksiz, hukuken onaylı sözleşme belgesini** Word/PDF formatında almak için lütfen ödemeyi tamamlayın ve aboneliğinizi etkinleştirin.

💬 Anlık iletişim: [WhatsApp +201126674337](https://wa.me/201126674337)`;
}
