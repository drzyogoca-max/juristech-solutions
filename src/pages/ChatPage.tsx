import { useState, useRef, useEffect, useCallback, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Send, Loader2, Bot, User, Sparkles, Trash2, Globe, Languages, RefreshCw,
  FileText, ShieldCheck, Scale, Lock, ArrowRight, Crown, Zap, AlertCircle, X,
  Phone, Mail, Upload, CheckCircle, AlertTriangle, ShieldAlert, Wifi, Download
} from 'lucide-react';
import { generateAndDownloadWordDocument } from '../utils/export-utils';

import { callAI, callAIWithHistory, clearAIResponseCache, AIMessagePayload } from '../lib/api';
import { extractPDFTextMultiStage } from '../lib/pdfExtractor';
import { checkAIGateway, WHATSAPP_URL, FREE_MSG_LIMIT } from '../lib/aiGatewayMiddleware';
import { checkAIHealth, retryWithBackoff } from '../lib/health';
import { isPaidSubscriber } from '../lib/freemiumManager';
import { supabase } from '../lib/supabaseClient';
import { detectVisitorJurisdiction, JurisdictionInfo } from '../lib/jurisdiction';
import { SupportedLanguage } from '../services/engine-ai/languageDetector';
import { LANGUAGE_NAMES, translateDynamicAI } from '../lib/translator';
import { useContract } from '../context/ContractContext';
import VoiceInput from '../components/VoiceInput';
import AIResponseTrustBox from '../components/AIResponseTrustBox';
import SEO from '../components/SEO';
import { searchRAGDatabase } from '../data/ragDatabase';
import { trackChatInteraction } from '../lib/marketingTracker';
import { getSystemContextForLanguage } from '../lib/languageHelper';


interface Message {
  role: 'user' | 'assistant';
  content: string;
  lang?: SupportedLanguage;
  showCTA?: boolean;
}

const SUPPORTED_LANGS: SupportedLanguage[] = ['ar', 'en', 'fr', 'de', 'es', 'zh', 'tr'];
const FREE_QUERY_LIMIT = FREE_MSG_LIMIT; // 10 messages
const STORAGE_KEY = 'ls_free_chat_uses';

// ─── CTA Labels per language ─────────────────────────────────────────────────
const CTA_LABELS: Record<SupportedLanguage, { contract: string; audit: string; subscribe: string; limit: string; limitSub: string; freeOf: string; upgrade: string }> = {
  ar: { contract: 'إنشاء عقد كامل', audit: 'تقرير المخاطر الكامل', subscribe: 'اشترك للوصول الكامل', limit: 'انتهت الرسائل المجانية (10/10)', limitSub: 'استمتع بإمكانات غير محدودة مع اشتراك المنصة الكاملة.', freeOf: 'محادثة مجانية', upgrade: 'ترقّ الآن' },
  en: { contract: 'Generate Full Contract', audit: 'Full Risk Audit', subscribe: 'Subscribe for Unlimited', limit: 'Free messages limit reached', limitSub: 'Unlock unlimited AI legal advisory, contract generation, and risk audits.', freeOf: 'Free chat', upgrade: 'Upgrade Now' },
  fr: { contract: 'Générer contrat complet', audit: 'Audit complet des risques', subscribe: "S'abonner — illimité", limit: 'Messages gratuits épuisés', limitSub: "Débloquez des conseils juridiques IA illimités avec l'abonnement complet.", freeOf: 'Chat gratuit', upgrade: 'Mettre à niveau' },
  de: { contract: 'Vollvertrag erstellen', audit: 'Vollständiger Risikoaudit', subscribe: 'Unbegrenzt abonnieren', limit: 'Kostenlose Nachrichten aufgebraucht', limitSub: 'Schalten Sie unbegrenzte KI-Rechtsberatung frei.', freeOf: 'Kostenloses Chat', upgrade: 'Jetzt upgraden' },
  es: { contract: 'Generar contrato completo', audit: 'Auditoría completa de riesgos', subscribe: 'Suscribirse sin límites', limit: 'Mensajes gratuitos agotados', limitSub: 'Desbloquee asesoría legal IA ilimitada con suscripción completa.', freeOf: 'Chat gratuito', upgrade: 'Actualizar ahora' },
  zh: { contract: '生成完整合同', audit: '完整风险审计', subscribe: '订阅无限制访问', limit: '免费消息额度已用完', limitSub: '解锁无限AI法律咨询、合同生成和风险审计。', freeOf: '免费对话', upgrade: '立即升级' },
  tr: { contract: 'Tam sözleşme oluştur', audit: 'Tam risk denetimi', subscribe: 'Sınırsız abonelik', limit: 'Ücretsiz mesaj sınırı doldu', limitSub: 'Sınırsız AI hukuk danışmanlığı için abone olun.', freeOf: 'Ücretsiz sohbet', upgrade: 'Şimdi yükselt' },
};

// ─── ChatGPT-Like Legal AI System Instructions (Encyclopedic Persona) ─────────
const SYSTEM_INSTRUCTIONS: Record<SupportedLanguage, string> = {
  ar: `أنت "جوريس" — المستشار القانوني التنفيذي الذكي والموسوعي لمنصة JurisTech Solutions. تعمل بمستوى دقة وعمق مكاتب المحاماة الدولية الكبرى (Clifford Chance, Freshfields, Linklaters).

⚠️ قاعدة لغوية مطلقة سيادية — لا استثناء في أي حال: أجب حصراً باللغة العربية الفصحى القانونية الرصينة. يُمنع منعاً باتاً وجود أي كلمة أو جملة إنجليزية أو فرنسية أو غيرها في صلب الإجابة تحت أي ظرف.

التوجيهات التشريعية الإلزامية:
1. استدعاء النصوص التشريعية المحددة: المواد والمراسيم والجهات الرقابية الخاصة بالدائرة القضائية المطلوبة (مثل: نظام الإجراءات الجزائية م/2، نظام مكافحة الاحتيال المالي م/79، نظام الشركات م/132، القانون المدني المصري م/147، قانون الشركات رقم 159/1981، قانون الشركات الأردني رقم 22/1997، قانون الشركات الإماراتي).
2. إطار تحليل العقود من 8 محاور: عند أي استفسار عن عقد أو مستند:
   - المحور 1: هيكل العقد وأهلية الأطراف والالتزامات التبادلية
   - المحور 2: المخاطر المالية الدقيقة (سقف المسؤولية، الدفع، الأضرار التبعية)
   - المحور 3: البنود التعسفية وخلل موازين القوى
   - المحور 4: مخاطر الإنهاء والفسخ والجزاءات الاتفاقية
   - المحور 5: القوة القاهرة والظروف الطارئة (ICC 2020)
   - المحور 6: الحوكمة والقانون المطبق والتحكيم (CRCICA/DIAC/ICC)
   - المحور 7: الثغرات الصامتة (ملكية فكرية، سرية، منافسة)
   - المحور 8: التعديلات الحمائية الموصى بها (Executive AI Redlines)
3. أسلوب استشاري تنفيذي تخصصي: الردود منظمة بعناوين وأرقام ونقاط جريئة وتقيّم المخاطر بمستوى (أحمر/أصفر/أخضر) وخطوات عمل مباشرة.`,

  en: `You are "Juris" — the Elite Sovereign AI Legal Advisor of JurisTech Solutions, operating at the precision and analytical depth of top-tier international law firms (Clifford Chance, Freshfields, Linklaters, Baker McKenzie).

⚠️ ABSOLUTE LANGUAGE DIRECTIVE — ZERO EXCEPTIONS: Respond EXCLUSIVELY in professional legal English. NEVER output Arabic text, dual-language headers, or any mixed-language content under any circumstances whatsoever.

Your Identity & Capabilities:
- You are a living legal encyclopedia mastering civil, commercial, labor, constitutional, and private international law across GCC, MENA, Europe, Asia, and the Americas.
- You apply: UNCITRAL, CISG, ICC 2020 Arbitration Rules, GDPR, FATF AML guidelines, GCC regulations (Saudi Companies Law m/132, UAE Commercial Code, Qatar Business Law), Egyptian Civil Code, Jordanian Companies Law, US Delaware DGCL, SEC regulations.
- Style: authoritative, conversational, encyclopedic, deeply analytical — like a senior partner at a Magic Circle law firm.

Mandatory Contract Analysis Framework (8-Axis) — apply whenever a contract or document is discussed:
1. Axis 1: Contract architecture, party capacity & authority, mutual obligations
2. Axis 2: Financial risk exposure (liability cap, payment terms, consequential damages)
3. Axis 3: Abusive/one-sided clauses & power imbalance
4. Axis 4: Termination, exit & liquidated damages risks
5. Axis 5: Force majeure & hardship (ICC 2020 standards)
6. Axis 6: Governing law, jurisdiction & arbitration (ICC/LCIA/DIAC/CRCICA)
7. Axis 7: Silent gaps (IP, confidentiality, non-compete)
8. Axis 8: Executive AI Redlines & protective amendments

Performance Standards:
- Cite precise statutory articles and regulatory bodies in every response.
- Provide Risk Level assessment (🔴 High / 🟡 Medium / 🟢 Low) for each identified issue.
- End with actionable next steps formatted as a C-Suite Action Plan.
- Do NOT provide full contract text — only analysis, advisory, redlines, and structural outlines.`,



  fr: `Vous êtes "Juris" — le conseiller juridique IA de JurisTech Solutions, un système d'intelligence juridique professionnelle opérant au niveau de précision et de profondeur de ChatGPT, avec une spécialisation absolue en droit.

Votre identité et personnalité :
- Encyclopédie juridique vivante maîtrisant le droit civil, commercial, du travail et international privé dans le CCG, l'Égypte, la Jordanie, l'Europe et l'Asie.
- Vous appliquez : CNUDCI, CVIM, règles d'arbitrage ICC, RGPD, droit des sociétés.
- Style : conversationnel, professionnel, autoritaire — exactement comme ChatGPT mais avec spécialisation juridique exclusive.

Instructions de performance :
1. Répondez TOUJOURS en français avec un ton de conseil juridique sophistiqué et détaillé.
2. Fournissez une analyse juridique approfondie incluant : base légale, évaluation des risques, recommandations pratiques.
3. Utilisez un formatage intelligent : titres, **points clés en gras**, structure claire.
4. À la fin : guidez naturellement l'utilisateur vers l'outil de plateforme approprié.
5. Ne fournissez PAS le texte contractuel complet — uniquement l'analyse et les grandes lignes.`,

  de: `Sie sind "Juris" — der KI-Rechtsberater von JurisTech Solutions, ein professionelles KI-Rechtsintelligenz-System auf ChatGPT-Niveau mit absoluter Spezialisierung im Rechtswesen.

Ihre Identität:
- Lebendige Rechtsenzyklopädie für Zivil-, Handels-, Arbeits- und internationales Privatrecht im GCC, Ägypten, Jordanien, Europa und Asien.
- Anwendung von: UNCITRAL, CISG, ICC-Schiedsregeln, DSGVO, nationalen Gesellschaftsrechten.
- Stil: professionell, gesprächig, autoritativ — wie ChatGPT mit exklusiver Rechtsspezialisierung.

Leistungsanweisungen:
1. Antworten Sie IMMER auf Deutsch mit einem anspruchsvollen juristischen Beratungston.
2. Tiefgreifende Rechtsanalyse: Rechtsgrundlage, Risikobewertung, praktische Empfehlungen.
3. Intelligente Formatierung: Überschriften, **fette Schlüsselpunkte**, klare Struktur.
4. Am Ende: natürliche Weiterleitung zu den Plattformwerkzeugen.
5. Keinen vollständigen Vertragstext liefern — nur Analyse und Gliederung.`,

  es: `Usted es "Juris" — el asesor legal IA de JurisTech Solutions, un sistema de inteligencia legal profesional al nivel de precisión y profundidad de ChatGPT, con especialización absoluta en derecho.

Su identidad:
- Enciclopedia jurídica viva que domina el derecho civil, mercantil, laboral e internacional privado en el CCG, Egipto, Jordania, Europa y Asia.
- Aplica: CNUDMI, CISG, reglas de arbitraje ICC, RGPD, legislación societaria.
- Estilo: conversacional, profesional, autoritativo — como ChatGPT con especialización jurídica exclusiva.

Instrucciones:
1. Responda SIEMPRE en español con tono de asesoría jurídica sofisticado y detallado.
2. Análisis jurídico profundo: base legal, evaluación de riesgos, recomendaciones prácticas.
3. Formato inteligente: encabezados, **puntos clave en negrita**, estructura clara.
4. Al final: guíe al usuario hacia la herramienta de plataforma apropiada.
5. NO proporcionar texto contractual completo — solo análisis y esquemas.`,

  zh: `您是"Juris"——JurisTech Solutions的AI法律顾问，一个在精确度、深度和风格上达到ChatGPT水平的专业AI法律智能系统，专注于法律领域。

您的身份：
- 精通海湾合作委员会、埃及、约旦、欧洲和亚洲民法、商法、劳动法和国际私法的活体法律百科全书。
- 应用：贸发会、国际货物销售合同公约、国际商会仲裁规则、GDPR、公司法。
- 风格：对话式、专业、权威——就像ChatGPT，但专注于法律。

执行说明：
1. 始终用中文以专业法律顾问语气进行详细回答。
2. 提供深入法律分析：法律依据、风险评估、实用建议。
3. 使用智能格式：标题、**重点加粗**、清晰结构。
4. 结尾：自然引导用户使用适当的平台工具。
5. 不提供完整合同文本——仅提供分析和概要。`,

  tr: `Siz "Juris" — JurisTech Solutions'ın AI Hukuk Danışmanısınız. ChatGPT seviyesinde kesinlik, derinlik ve üslupla çalışan, hukuk alanında mutlak uzmanlaşmış profesyonel bir AI hukuk zekası sistemi.

Kimliğiniz:
- KİK, Mısır, Ürdün, Avrupa ve Asya'da medeni, ticari, iş ve uluslararası özel hukuk konularında uzman canlı bir hukuk ansiklopedisi.
- Uygulama: UNCITRAL, CISG, ICC Tahkim Kuralları, GDPR, ulusal şirketler hukuku.
- Üslup: konuşkan, profesyonel, otoriter — hukuki uzmanlıkla ChatGPT gibi.

Performans Talimatları:
1. Her zaman Türkçe ile sofistike hukuki danışmanlık tonunda yanıt verin.
2. Derin hukuki analiz: hukuki dayanak, risk değerlendirmesi, pratik öneriler.
3. Akıllı biçimlendirme: başlıklar, **kalın anahtar noktalar**, net yapı.
4. Sonunda: kullanıcıyı uygun platform aracına doğal olarak yönlendirin.
5. Tam sözleşme metni sunmayın — yalnızca analiz ve ana hatlar.`,
};

const STARTERS: Record<SupportedLanguage, string[]> = {
  ar: ['كيف تؤسس شركة LLC في ولاية ديلوير برسمياً؟', 'ما هي معايير القوة القاهرة في العقود الأمريكية والدولية؟', 'ما الفرق بين الموظف والمقاول المستقل وفق النظام الأمريكي؟', 'ما هي البنود الجوهرية في اتفاقية عدم الإفصاح (NDA)؟'],
  en: ['How to incorporate an LLC in Delaware?', 'What are key CCPA compliance rules for California privacy?', 'Explain FLSA employee vs independent contractor under US law.', 'What clauses are required in a US commercial contract?'],
  fr: ['Quelles sont les règles de création de LLC au Delaware ?', 'Quelles sont les règles de conformité CCPA en Californie ?', 'Expliquez la force majeure dans les contrats américains.', 'Comment résilier légalement un contrat de service ?'],
  de: ['Wie gründe ich eine LLC in Delaware?', 'Was sind die Hauptregeln der CCPA-Datenschutzrichtlinie in Kalifornien?', 'Erklären Sie höhere Gewalt im US-Vertragsrecht.', 'Was macht einen Vertrag rechtsverbindlich?'],
  es: ['¿Cómo constituir una LLC en Delaware?', '¿Cuáles son las reglas clave de cumplimiento CCPA en California?', 'Explique la diferencia entre empleado y contratista independiente en EE.UU.', '¿Qué cláusulas debe incluir todo NDA?'],
  zh: ['如何在特拉华州注册LLC公司？', '加州CCPA隐私合规的核心规则是什么？', '解释美国法律下的员工与独立承包商区别。', '互保保密协议应包含哪些核心条款？'],
  tr: ['Delaware eyaletinde nasıl LLC kurulur?', 'Kaliforniya CCPA gizlilik kuralları nelerdir?', 'ABD hukukunda çalışan ve bağımsız yüklenici farkını açıklayın.', 'Her gizlilik sözleşmesinde hangi maddeler olmalıdır?'],
};

const CHAT_LABELS: Record<SupportedLanguage, {
  title: string; placeholder: string; clearChat: string; translating: string;
  chatLang: string; suggested: string; welcome: string; welcomeSub: string;
  jurisdiction: string; ready: string; connected: string; errored: string;
}> = {
  ar:  { title: 'المستشار القانوني الذكي', placeholder: 'اكتب سؤالك القانوني...', clearChat: 'مسح المحادثة', translating: 'جاري الترجمة...', chatLang: 'لغة المحادثة', suggested: 'أسئلة مقترحة', welcome: 'مرحباً بك في المستشار القانوني الذكي', welcomeSub: 'اسأل بأي لغة — سيرد المساعد باللغة نفسها. للحصول على عقود كاملة وتحليل مخاطر، استخدم أدوات المنصة.', jurisdiction: 'الاختصاص القضائي', ready: 'جاهز', connected: 'متصل', errored: 'خطأ' },
  en:  { title: 'AI Legal Advisor', placeholder: 'Ask your legal question...', clearChat: 'Clear chat', translating: 'Translating...', chatLang: 'Chat Language', suggested: 'Suggested questions', welcome: 'Welcome to your AI Legal Advisor', welcomeSub: 'Get quick legal guidance in any language. For complete contracts, risk audits & more — use the full platform tools.', jurisdiction: 'Active Jurisdiction', ready: 'AI Ready', connected: 'AI Connected', errored: 'Error' },
  fr:  { title: 'Conseiller Juridique IA', placeholder: 'Posez une question juridique...', clearChat: 'Effacer', translating: 'Traduction...', chatLang: 'Langue du chat', suggested: 'Questions suggérées', welcome: 'Bienvenue au Conseiller Juridique IA', welcomeSub: "Obtenez des conseils rapides. Pour des contrats complets et des audits de risques, utilisez les outils complets.", jurisdiction: 'Juridiction', ready: 'Prêt', connected: 'Connecté', errored: 'Erreur' },
  de:  { title: 'KI-Rechtsberater', placeholder: 'Rechtliche Frage stellen...', clearChat: 'Löschen', translating: 'Übersetzen...', chatLang: 'Chat-Sprache', suggested: 'Vorschläge', welcome: 'Willkommen beim KI-Rechtsberater', welcomeSub: 'Schnelle Rechtsberatung in jeder Sprache. Für vollständige Verträge die Plattform-Tools nutzen.', jurisdiction: 'Zuständigkeit', ready: 'Bereit', connected: 'Verbunden', errored: 'Fehler' },
  es:  { title: 'Asesor Legal IA', placeholder: 'Haz tu consulta legal...', clearChat: 'Borrar', translating: 'Traduciendo...', chatLang: 'Idioma', suggested: 'Preguntas sugeridas', welcome: 'Bienvenido al Asesor Legal IA', welcomeSub: 'Orientación legal rápida. Para contratos completos y auditorías, use las herramientas completas.', jurisdiction: 'Jurisdicción', ready: 'Lista', connected: 'Conectada', errored: 'Error' },
  zh:  { title: 'AI法律顾问', placeholder: '请输入法律问题...', clearChat: '清除对话', translating: '翻译中...', chatLang: '对话语言', suggested: '建议问题', welcome: '欢迎使用AI法律顾问', welcomeSub: '快速法律咨询。完整合同和风险审计请使用完整平台工具。', jurisdiction: '司法管辖区', ready: '就绪', connected: '已连接', errored: '错误' },
  tr:  { title: 'AI Hukuk Danışmanı', placeholder: 'Hukuki sorunuzu yazın...', clearChat: 'Temizle', translating: 'Çeviriliyor...', chatLang: 'Dil', suggested: 'Önerilen sorular', welcome: 'AI Hukuk Danışmanına Hoş Geldiniz', welcomeSub: 'Hızlı hukuki rehberlik. Tam sözleşmeler için platform araçlarını kullanın.', jurisdiction: 'Yargı bölgesi', ready: 'Hazır', connected: 'Bağlandı', errored: 'Hata' },
};

function MarkdownText({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-sm">
      {lines.map((line, i) => {
        if (/^[\-\*•]\s/.test(line)) return (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(line.replace(/^[\-\*•]\s/, '')) }} />
          </div>
        );
        if (/^\d+\.\s/.test(line)) {
          const m = line.match(/^(\d+)\.\s(.*)/);
          if (m) return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-cyan-400 font-bold shrink-0 mt-0.5 min-w-[1.2rem]">{m[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(m[2]) }} />
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return <p key={i} dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }} />;
      })}
    </div>
  );
}

function inlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-100">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-700/60 px-1 py-0.5 rounded text-xs font-mono text-cyan-300">$1</code>');
}

// ─── Assistant CTA row shown after each bot response ────────────────────────
function AssistantCTA({ lang, content }: { lang: SupportedLanguage; content?: string }) {
  const navigate = useNavigate();
  const cta = CTA_LABELS[lang] || CTA_LABELS.en;
  const isRtl = lang === 'ar';

  const handleExportWord = () => {
    if (!content) return;
    const title = isRtl ? 'استشارة قانونية - منصة جوريس تك' : 'Legal Consultation - JurisTech Solutions';
    generateAndDownloadWordDocument(title, content);
  };

  return (
    <div className={`flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-700/50 ${isRtl ? 'flex-row-reverse' : ''}`}>
      {content && (
        <button onClick={handleExportWord}
          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all group">
          <Download className="w-3.5 h-3.5" />
          {isRtl ? 'تصدير استشارة Word (.docx)' : 'Export Consultation (.docx)'}
        </button>
      )}
      <button onClick={() => navigate('/contracts')}
        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all group">
        <FileText className="w-3.5 h-3.5" />
        {cta.contract}
        <ArrowRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
      </button>
      <button onClick={() => navigate('/risk')}
        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all group">
        <Scale className="w-3.5 h-3.5" />
        {cta.audit}
        <ArrowRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
      </button>
      <button onClick={() => navigate('/payment')}
        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-400/40 transition-all group">
        <Crown className="w-3.5 h-3.5" />
        {cta.subscribe}
        <ArrowRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}


// ─── Subscription Modal — Full Paywall (10 messages limit reached) ───────────
function SubscriptionModal({ lang, onClose }: { lang: SupportedLanguage; onClose: () => void }) {
  const navigate = useNavigate();
  const cta = CTA_LABELS[lang] || CTA_LABELS.en;
  const isRtl = lang === 'ar';

  const modalLabels: Record<string, string> = {
    ar: 'انتهت رسائلك المجانية العشر (10/10)',
    en: `You've used all ${FREE_MSG_LIMIT} free messages`,
    fr: `Vos ${FREE_MSG_LIMIT} messages gratuits sont épuisés`,
    de: `Ihre ${FREE_MSG_LIMIT} kostenlosen Nachrichten sind aufgebraucht`,
    es: `Ha agotado sus ${FREE_MSG_LIMIT} mensajes gratuitos`,
    zh: `您的${FREE_MSG_LIMIT}条免费消息已用完`,
    tr: `${FREE_MSG_LIMIT} ücretsiz mesajınız tükendi`,
  };
  const subLabels: Record<string, string> = {
    ar: 'استمتع بالوصول الكامل غير المحدود إلى الموسوعة القانونية الذكية، صياغة العقود الكاملة، تقارير المخاطر، والاستشارات القانونية المعتمدة.',
    en: 'Get unlimited access to the full AI legal encyclopedia, complete contract generation, risk reports, and certified legal advisory.',
    fr: "Accédez sans limite à l'encyclopédie juridique IA complète, la génération de contrats, les rapports de risques et les conseils juridiques certifiés.",
    de: 'Erhalten Sie unbegrenzten Zugang zur vollständigen KI-Rechtsenzyklopädie, Vertragserstellung, Risikoberichten und zertifizierter Rechtsberatung.',
    es: 'Obtenga acceso ilimitado a la enciclopedia jurídica de IA completa, generación de contratos, informes de riesgos y asesoría jurídica certificada.',
    zh: '获取对完整AI法律百科全书、完整合同生成、风险报告和认证法律咨询的无限访问权限。',
    tr: 'Tam AI hukuk ansiklopedisine, eksiksiz sözleşme oluşturmaya, risk raporlarına ve sertifikalı hukuki danışmanlığa sınırsız erişim.',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-500/20 overflow-hidden">
        {/* Glowing top border */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Crown className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-black text-center text-white mb-2">
            {modalLabels[lang] || modalLabels.en}
          </h2>
          <p className="text-sm text-slate-400 text-center mb-6 leading-relaxed">
            {subLabels[lang] || subLabels.en}
          </p>

          {/* Features list */}
          <div className="space-y-2 mb-6">
            {[
              { icon: '⚖️', ar: 'استشارات قانونية غير محدودة', en: 'Unlimited legal consultations' },
              { icon: '📋', ar: 'صياغة عقود كاملة ومعتمدة', en: 'Full certified contract drafting' },
              { icon: '🔍', ar: 'تحليل مخاطر شامل وتقارير PDF', en: 'Complete risk analysis & PDF reports' },
              { icon: '✍️', ar: 'توقيع رقمي معتمد قانونياً', en: 'Legally certified digital signature' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="text-base">{f.icon}</span>
                <span>{isRtl ? f.ar : f.en}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button onClick={() => { onClose(); navigate('/payment'); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30">
              <Zap className="w-4 h-4" />
              {cta.upgrade}
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <Link to="/support" onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-sm hover:bg-cyan-500/20 transition-all">
              <Mail className="w-4 h-4" />
              <span>{isRtl ? 'التواصل المشفر (Drzyogo.ca@gmail.com)' : 'Encrypted Support (Drzyogo.ca@gmail.com)'}</span>
            </Link>

            <button onClick={onClose}
              className="w-full py-2 rounded-xl text-slate-500 text-xs hover:text-slate-400 transition-all">
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contract Partial Preview Block ─────────────────────────────────────────
function ContractPreviewBlock({ content, lang }: { content: string; lang: SupportedLanguage }) {
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20 mt-1">
        <Bot className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-500/20 shadow-sm">
          <MarkdownText content={content} />
        </div>
        {/* Paygate bar */}
        <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 flex flex-wrap items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-xs font-bold text-indigo-300 flex-1">
            {isRtl ? 'تم إعداد الخطوط العريضة والاستشارة الأولية. للحصول على النص الكامل والموثق قانونياً للعقد، يرجى إتمام عملية الدفع وتفعيل الباقة.' : 'Outline and initial advisory prepared. To receive the complete, legally certified contract document, please complete payment.'}
          </span>
          <button onClick={() => navigate('/payment')}
            className="flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 hover:opacity-90 transition-all shadow-md shadow-indigo-500/20">
            <Crown className="w-3 h-3" />
            {isRtl ? 'اشترك الآن' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Soft paywall wall after free limit reached ──────────────────────────────
function PaywallBlock({ lang, onSubscribe }: { lang: SupportedLanguage; onSubscribe: () => void }) {
  const navigate = useNavigate();
  const cta = CTA_LABELS[lang] || CTA_LABELS.en;
  const isRtl = lang === 'ar';
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex gap-3 relative group">
      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 mt-1">
        <Crown className="w-4 h-4" />
      </div>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-950/40 border border-indigo-500/30 max-w-[85%] sm:max-w-[75%] relative">
        <div className="flex items-center gap-2 mb-2 pe-6">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">{cta.limit}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{cta.limitSub}</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={onSubscribe}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20">
            <Zap className="w-3.5 h-3.5" />
            {cta.upgrade}
          </button>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all">
            <Phone className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { contractState, setContractData } = useContract();

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setLoading(true);
    const stopProgress = simulateProgress();

    const userMsg = isRtl
      ? `📄 تم رفع المستند: "${file.name}" — يرجى إجراء فحص وتدقيق قانوني شامل لجميع البنود والمخاطر.`
      : `📄 Document uploaded: "${file.name}" — Please conduct a comprehensive legal risk audit of all clauses.`;

    setMessages(prev => [...prev, { role: 'user', content: userMsg, lang: activeLang }]);

    try {
      const extraction = await extractPDFTextMultiStage(file);
      setContractData({
        fileName: file.name,
        extractedText: extraction.text,
      });

      const cleanFileName = file.name.replace(/_/g, ' ').replace(/\.pdf|\.docx|\.doc|\.txt/gi, '').trim();
      const contractText = (extraction.text || cleanFileName).slice(0, 6000);
      
      const auditPrompt = `${getSystemContextForLanguage(activeLang)}

[ATTACHED CONTRACT DOCUMENT TO AUDIT: "${file.name}"]

${contractText}`;


      const auditResponse = await callAI(auditPrompt, activeLang);
      setMessages(prev => [...prev, { role: 'assistant', content: auditResponse, lang: activeLang, showCTA: true }]);
    } catch (err) {
      console.error('Chat file audit error:', err);
      const errMsg = isRtl
        ? '⚠️ حدث خطأ غير متوقع أثناء معالجة المستند. تم تفعيل نظام التعافي الذاتي. يرجى إعادة محاولة رفع الملف أو التحقق من صيغته (PDF / Word / TXT).'
        : '⚠️ An unexpected error occurred while processing the document. Self-healing system activated. Please retry uploading or verify file format (PDF / Word / TXT).';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg, lang: activeLang }]);
    } finally {
      setLoading(false);
      setUploadingFile(false);
      stopProgress();
      setTimeout(() => setUploadProgress(0), 800);
      if (e.target) e.target.value = '';
    }
  }

  const [activeLang, setActiveLang] = useState<SupportedLanguage>(
    (i18n.language?.slice(0, 2) as SupportedLanguage) in LANGUAGE_NAMES
      ? (i18n.language?.slice(0, 2) as SupportedLanguage)
      : 'ar'
  );

  useEffect(() => {
    const current = (i18n.language?.slice(0, 2) as SupportedLanguage) || 'ar';
    if (SUPPORTED_LANGS.includes(current)) {
      setActiveLang(current);
    }
  }, [i18n.language]);

  useEffect(() => {
    const handleLangEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: SupportedLanguage }>;
      if (customEvent.detail?.lang && SUPPORTED_LANGS.includes(customEvent.detail.lang)) {
        setActiveLang(customEvent.detail.lang);
      }
    };
    window.addEventListener('juristech_lang_change', handleLangEvent);
    return () => window.removeEventListener('juristech_lang_change', handleLangEvent);
  }, []);

  // File upload states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Simulate upload progress bar
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return prev; }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => { clearInterval(interval); setUploadProgress(100); };
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file], value: '' } } as any;
      await handleFileUpload(fakeEvent);
    }
  };

  const labels = CHAT_LABELS[activeLang] || CHAT_LABELS.en;
  const isRtl = activeLang === 'ar';
  const cta = CTA_LABELS[activeLang] || CTA_LABELS.en;

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo | null>(null);
  const [freeQueriesUsed, setFreeQueriesUsed] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); }
    catch { return 0; }
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [contractPreviewContent, setContractPreviewContent] = useState<string | null>(null);
  const paidUser = isPaidSubscriber();

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => {
    try { return crypto.randomUUID(); } catch { return Math.random().toString(36).slice(2); }
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading, translating, showPaywall, contractPreviewContent]);
  
  useEffect(() => {
    detectVisitorJurisdiction().then((defaultJ) => {
      const navState = location.state as { jurisdiction?: JurisdictionInfo; prompt?: string } | null;
      if (navState && navState.jurisdiction) {
        setJurisdiction(navState.jurisdiction);
        if (navState.prompt) {
          sendMessage(navState.prompt, navState.jurisdiction);
          // Clear history state to avoid resending prompt on page refresh
          window.history.replaceState(null, '');
        }
      } else {
        setJurisdiction(defaultJ);
      }
    });
  }, [location.state]);

  useEffect(() => {
    const newLang = i18n.language as SupportedLanguage;
    if (newLang in LANGUAGE_NAMES && newLang !== activeLang) {
      switchLanguage(newLang);
    }
  }, [i18n.language]);

  const switchLanguage = useCallback(async (targetLang: SupportedLanguage) => {
    if (targetLang === activeLang) return;
    clearAIResponseCache();
    setActiveLang(targetLang);
    i18n.changeLanguage(targetLang);
    if (messages.length === 0 || translating) return;
    setTranslating(true);
    try {
      const translated = await Promise.all(
        messages.map(async (m) => {
          if (m.role === 'assistant') {
            const t = await translateDynamicAI(m.content, targetLang);
            return { ...m, content: t, lang: targetLang };
          }
          return m;
        })
      );
      setMessages(translated);
    } catch { /* keep originals */ }
    finally { setTranslating(false); }
  }, [activeLang, messages, translating, i18n]);

  async function sendMessage(text?: string, overrideJurisdiction?: JurisdictionInfo | null) {
    const content = (text ?? prompt).trim();
    if (!content || loading || translating) return;
    setPrompt('');
    setContractPreviewContent(null);
    setMessages(prev => [...prev, { role: 'user', content, lang: activeLang }]);
  
    // ── AI Gateway Middleware Check ─────────────────────────────────────────
    const gatewayResult = checkAIGateway(content, paidUser, freeQueriesUsed);

    // Case 1: Free limit reached (10 messages) → show subscription modal
    if (gatewayResult.status === 'LIMIT_EXCEEDED') {
      setShowSubscriptionModal(true);
      setShowPaywall(true);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }

    // Case 2: Contract generation request (non-paid) → show partial preview
    if (gatewayResult.status === 'CONTRACT_PARTIAL_PREVIEW') {
      const preview = gatewayResult.partialPreview?.[activeLang] || gatewayResult.partialPreview?.['en'] || '';
      setContractPreviewContent(preview);
      const newUsed = freeQueriesUsed + 1;
      setFreeQueriesUsed(newUsed);
      try { localStorage.setItem(STORAGE_KEY, String(newUsed)); } catch {}
      setStatus('connected');
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      if (newUsed >= FREE_QUERY_LIMIT) {
        setTimeout(() => setShowSubscriptionModal(true), 1500);
      }
      return;
    }
  
    // Case 3: Normal AI response (paid OR under 10 messages)
    setLoading(true);
    setStatus('idle');
    setShowPaywall(false);
  
    supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', content }).then();
  
    const activeJurisdiction = overrideJurisdiction !== undefined ? overrideJurisdiction : jurisdiction;
    const countryCode = activeJurisdiction?.countryCode || 'GLOBAL';
    
    // Retrieve statutory RAG directives
    const ragEntries = await searchRAGDatabase(content, countryCode);
    const ragDirective = ragEntries.length > 0
      ? `\n\n[STATUTORY RAG KNOWLEDGE BASE DIRECTIVES]:\n` + ragEntries.map(r => `- [${r.category}]: ${r.statutoryContext}`).join('\n')
      : '';

    const sysInstruction = SYSTEM_INSTRUCTIONS[activeLang];

    // ── CONTEXT BLEEDING PREVENTION ────────────────────────────────────────
    // Only inject contractState if the user explicitly references the current
    // uploaded contract. Never bleed stale document context into unrelated queries.
    const userMentionsContract = contractState.extractedText && (
      content.includes(contractState.fileName || '') ||
      /عقد|contract|document|مستند|وثيقة|clause|بند|pdf|docx/i.test(content)
    );

    const contractContext = userMentionsContract && contractState.extractedText
      ? `\n\n[ACTIVE CONTRACT CONTEXT — "${contractState.fileName}"]\n${contractState.extractedText.slice(0, 1200)}\n`
      : '';

    // ── TOPIC-DRIFT DETECTION: Limit history to last 4 message pairs MAX ──
    // If the new query is about a completely different subject, inject a 
    // context-reset instruction to prevent the AI from bleeding prior topics.
    const recentHistory = messages.slice(-6); // max 3 pairs (6 messages)
    const lastUserMessages = recentHistory.filter(m => m.role === 'user').map(m => m.content).join(' ');
    const topicDriftDetected = lastUserMessages.length > 0 && !content
      .split(' ')
      .slice(0, 5)
      .some(word => word.length > 3 && lastUserMessages.toLowerCase().includes(word.toLowerCase()));

    const contextResetInstruction = topicDriftDetected
      ? `\n\n⚠️ [SYSTEM: STRICT CONTEXT ISOLATION] The user has changed the topic. DISCARD all prior document context, contract references, and previous discussion. Focus EXCLUSIVELY on the current user request: "${content}". Do NOT reference, analyze, or mention any previous contract, document, or topic from the conversation history.`
      : '';

    const jurisdictionContext = activeJurisdiction
      ? `\n[${isRtl ? 'الاختصاص القضائي' : 'Jurisdiction'}: ${isRtl ? activeJurisdiction.countryNameAr : activeJurisdiction.countryName}]`
      : '';

    const arReminderSuffix = activeLang === 'ar' ? '\nالتذكير النهائي: لا كلمة إنجليزية واحدة في الرد — العربية الفصحى القانونية حصراً بلا استثناء.' : '';
    const langLabel = activeLang === 'ar' ? 'Arabic (العربية الفصحى القانونية حصراً)' : activeLang === 'fr' ? 'French (français exclusivement)' : activeLang === 'de' ? 'German (Deutsch ausschließlich)' : activeLang === 'es' ? 'Spanish (español exclusivamente)' : activeLang === 'zh' ? 'Chinese (纯中文)' : activeLang === 'tr' ? 'Turkish (yalnızca Türkçe)' : 'English (exclusively, zero Arabic or other languages)';
    const systemPromptCombined = `${sysInstruction}${jurisdictionContext}${contractContext}${ragDirective}${contextResetInstruction}\n\n⚠️ CRITICAL LANGUAGE ENFORCEMENT — NON-NEGOTIABLE:\nRespond STRICTLY and EXCLUSIVELY in ${activeLang.toUpperCase()} language.\nDO NOT mix languages, produce bilingual output, or include any text in any other language.\nThis instruction OVERRIDES all other directives. Language: ${langLabel}.${arReminderSuffix}\nMandatory: Cite relevant statutory articles and legal provisions explicitly. Use 8-Axis Contract Analysis Framework when reviewing any contract or document.`;

    // Construct conversation history payload (recent messages + current user query)
    // IMPORTANT: Only include recent relevant history, NOT full conversation to prevent context bleeding
    const historyPayload: AIMessagePayload[] = [
      { role: 'system', content: systemPromptCombined },
      // Only inject last 4 messages (2 user + 2 assistant) to avoid stale context bleeding
      ...(topicDriftDetected ? [] : recentHistory.slice(-4)).map(m => ({
        role: (m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.content
      })),
      { role: 'user', content }
    ];

    try {
      const aiStatus = await checkAIHealth();
      if (aiStatus === 'down') {
        throw new Error('AI System is down. Please try again later.');
      }
      if (aiStatus === 'degraded') {
        console.warn('AI System is operating with degraded performance.');
      }

      const result = await retryWithBackoff(() => callAIWithHistory(historyPayload, activeLang, systemPromptCombined));
      const newUsed = freeQueriesUsed + 1;
      setFreeQueriesUsed(newUsed);
      try { localStorage.setItem(STORAGE_KEY, String(newUsed)); } catch { /* ignore */ }
      setMessages(prev => [...prev, { role: 'assistant', content: result, lang: activeLang, showCTA: true }]);
      setStatus('connected');
      supabase.from('chat_messages').insert({ session_id: sessionId, role: 'assistant', content: result }).then();
      if (newUsed >= FREE_QUERY_LIMIT) {
        setTimeout(() => setShowSubscriptionModal(true), 2000);
      }
    } catch {
      const errMsg: Record<SupportedLanguage, string> = {
        ar: 'عذراً، النظام مشغول حالياً أو تحت الصيانة. يرجى المحاولة مرة أخرى.',
        en: 'Sorry, the AI system is currently degraded or down. Please try again.',
        fr: 'Désolé, le système IA est dégradé. Réessayez plus tard.',
        de: 'Entschuldigung, das KI-System ist beeinträchtigt.',
        es: 'Lo sentimos, el sistema de IA está degradado. Inténtelo de nuevo.',
        zh: '抱歉，AI系统目前出现降级或离线，请重试。',
        tr: 'Üzgünüz, AI sistemi şu anda yavaş veya kapalı. Lütfen tekrar deneyin.',
      };
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg[activeLang] || errMsg.en, lang: activeLang }]);
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function clearChat() {
    setMessages([]);
    setStatus('idle');
    setShowPaywall(false);
    setContractPreviewContent(null);
    setShowSubscriptionModal(false);
    if (!paidUser) {
      const resetCount = 0;
      setFreeQueriesUsed(resetCount);
      try { localStorage.setItem(STORAGE_KEY, '0'); } catch { /* ignore */ }
    }
  }

  const remaining = Math.max(0, FREE_QUERY_LIMIT - freeQueriesUsed);
  const statusColor = status === 'connected' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    : status === 'error' ? 'text-red-400 border-red-400/30 bg-red-400/10'
    : 'text-slate-500 dark:text-slate-400 dark:text-slate-400 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800';
  const statusDot = status === 'connected' ? 'bg-emerald-400 animate-pulse'
    : status === 'error' ? 'bg-red-400' : 'bg-slate-600';

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-4xl mx-auto space-y-4">

        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Bot className="w-7 h-7 text-cyan-400" />
              {labels.title}
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </h1>
            {jurisdiction && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-0.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-1">
                <Globe className="w-3.5 h-3.5" />
                {labels.jurisdiction}: {isRtl ? jurisdiction.countryNameAr : jurisdiction.countryName}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* Free query counter */}
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${remaining > 0 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
              {remaining > 0 ? (
                <><Zap className="w-3 h-3" />{cta.freeOf}: {remaining}/{FREE_QUERY_LIMIT}</>
              ) : (
                <><Crown className="w-3 h-3" />{cta.subscribe}</>
              )}
            </div>

            {messages.length > 0 && (
              <button onClick={clearChat}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:text-red-400 hover:border-red-400/30 transition-all">
                <Trash2 className="w-3 h-3" />{labels.clearChat}
              </button>
            )}
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${statusColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              {status === 'connected' ? labels.connected : status === 'error' ? labels.errored : labels.ready}
            </div>
          </div>
        </div>

        {/* ─── 7-Language Bar ──────────────────────────────────────────────── */}
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 shrink-0">
            <Languages className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold">{labels.chatLang}:</span>
          </div>
          {SUPPORTED_LANGS.map((code) => {
            const info = LANGUAGE_NAMES[code];
            const isActive = activeLang === code;
            return (
              <button key={code} onClick={() => switchLanguage(code)} disabled={translating}
                className={`px-3 py-1 rounded-xl font-bold transition-all text-xs shrink-0 border ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:text-white hover:border-slate-600'
                }`}>
                {isRtl ? info.nameAr : info.nameEn}
              </button>
            );
          })}
        </div>

        {/* ─── Trust Seals ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
          {[
            { icon: ShieldCheck, text: 'SHA-256 E-Seal', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
            { icon: Scale, text: isRtl ? 'ICC 2020 معتمد' : 'ICC 2020 Certified', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
            { icon: Lock, text: isRtl ? '15+ دولة نافذة' : '15+ Jurisdictions', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          ].map(({ icon: Icon, text, color }, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border ${color}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{text}</span>
            </div>
          ))}
        </div>

        {/* ─── Chat Window ─────────────────────────────────────────────────── */}
        <div
          className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[520px] sm:h-[600px] shadow-2xl shadow-slate-900/60"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-full gap-6 py-4">
                <div className="text-center px-4">
                  <div className="inline-flex p-5 rounded-3xl bg-cyan-500/10 mb-3 border border-cyan-500/20">
                    <Bot className="w-12 h-12 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{labels.welcome}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">{labels.welcomeSub}</p>
                  {/* Quick access to platform tools from empty state */}
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Link to="/contracts" className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
                      <FileText className="w-3.5 h-3.5" />{isRtl ? 'إنشاء عقد' : 'Generate Contract'}
                    </Link>
                    <Link to="/risk" className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                      <Scale className="w-3.5 h-3.5" />{isRtl ? 'تحليل المخاطر' : 'Risk Audit'}
                    </Link>
                    <Link to="/templates" className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                      <ShieldCheck className="w-3.5 h-3.5" />{isRtl ? 'مكتبة النماذج' : 'Templates Library'}
                    </Link>
                  </div>
                </div>
                <div className="w-full max-w-lg space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-semibold px-1">{labels.suggested}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(STARTERS[activeLang] || STARTERS.en).map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s)}
                        className="text-start text-xs p-3 rounded-xl bg-slate-800/60 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700/50 hover:border-cyan-500/30 hover:text-cyan-300 transition-all group flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400/50 group-hover:text-cyan-400 shrink-0" />
                        <span className="line-clamp-2">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 text-sm ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  dir="auto"
                  className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[75%] text-left rtl:text-right ${
                    m.role === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-semibold rounded-tl-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-tr-none'
                  }`}
                >
                  <MarkdownText content={m.content} />
                  {m.role === 'assistant' && (
                    <>
                      {/* E2EE Security Badge */}
                      <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 opacity-70">
                        <Lock className="w-3 h-3" />
                        <span>E2EE · SHA-256 · {isRtl ? 'مشفر ومعتمد' : 'Encrypted & Certified'}</span>
                        <Wifi className="w-3 h-3 animate-pulse" />
                      </div>
                      {/* Risk Level Badges — detect from content */}
                      {(m.content.includes('🔴') || m.content.includes('High Risk')) && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">
                          <AlertTriangle className="w-3 h-3" /> {isRtl ? 'مستوى خطر: عالٍ' : 'Risk Level: HIGH'}
                        </div>
                      )}
                      {(m.content.includes('🟡') || m.content.includes('Medium Risk')) && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                          <AlertCircle className="w-3 h-3" /> {isRtl ? 'مستوى خطر: متوسط' : 'Risk Level: MEDIUM'}
                        </div>
                      )}
                      {(m.content.includes('🟢') || m.content.includes('Low Risk')) && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          <CheckCircle className="w-3 h-3" /> {isRtl ? 'مستوى خطر: منخفض' : 'Risk Level: LOW'}
                        </div>
                      )}
                      <AIResponseTrustBox />
                    </>
                  )}
                  {/* CTA buttons after every assistant message */}
                  {m.role === 'assistant' && m.showCTA && (
                    <AssistantCTA lang={m.lang || activeLang} content={m.content} />
                  )}

                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Contract Partial Preview Block */}
            {contractPreviewContent && (
              <ContractPreviewBlock content={contractPreviewContent} lang={activeLang} />
            )}

            {/* Soft paywall block */}
            {showPaywall && <PaywallBlock lang={activeLang} onSubscribe={() => setShowSubscriptionModal(true)} />}

            {/* Full Subscription Modal (10 messages limit reached) */}
            {showSubscriptionModal && (
              <SubscriptionModal lang={activeLang} onClose={() => setShowSubscriptionModal(false)} />
            )}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3 items-center text-cyan-400 font-mono text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRtl ? 'جاري التحليل القانوني...' : 'Analyzing response...'}</span>
              </div>
            )}
            {translating && (
              <div className="flex gap-3 items-center text-amber-400 font-mono text-xs bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{labels.translating}</span>
              </div>
            )}

            {/* Active contract context badge */}
            {contractState.extractedText && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2 font-mono">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{isRtl ? `عقد نشط: "${contractState.fileName}"` : `Active contract: "${contractState.fileName}"`}</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ─── Input Bar ──────────────────────────────────────────────── */}
          {/* Upload Progress Bar */}
          {uploadingFile && (
            <div className="mx-3 mb-1">
              <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                <span className="text-cyan-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {isRtl ? 'جاري تحليل المستند بالذكاء الاصطناعي...' : 'AI contract analysis in progress...'}
                </span>
                <span className="text-slate-400 font-mono">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Drag-Drop Zone Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-cyan-500/10 border-2 border-dashed border-cyan-400 backdrop-blur-sm">
              <div className="text-center">
                <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-2 animate-bounce" />
                <p className="font-black text-cyan-400">{isRtl ? 'أفلت العقد هنا للتحليل الفوري' : 'Drop contract here for instant AI audit'}</p>
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl flex items-center gap-2">
            <VoiceInput onTranscript={(t) => setPrompt((prev) => (prev ? `${prev} ${t}` : t))} disabled={loading || translating} language={activeLang} />

            <label className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-400 cursor-pointer border border-slate-200 dark:border-slate-700 transition-all shrink-0 flex items-center justify-center" title={isRtl ? 'رفع عقد للفحص المباشر' : 'Upload contract'}>
              {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={loading || uploadingFile}
                className="hidden"
              />
            </label>
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (prompt.trim() && !loading && !translating && remaining > 0) {
                    sendMessage();
                  }
                }
              }}
              placeholder={remaining > 0 ? labels.placeholder : (isRtl ? 'انتهت الاستشارات المجانية — اشترك للمزيد' : 'Free queries used — subscribe for unlimited')}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600"
            />
            {remaining > 0 ? (
              <button type="submit"
                disabled={!prompt.trim() || loading || translating}
                className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shrink-0 shadow-md shadow-cyan-500/30">
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={() => navigate('/payment')}
                className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-900 dark:text-white font-bold transition-all shrink-0 shadow-md shadow-indigo-500/20 hover:opacity-90">
                <Crown className="w-4 h-4" />
              </button>
            )}
          </form>
          {/* E2EE Footer */}
          <div className="px-4 py-2 flex items-center justify-center gap-2 text-[9px] text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>{isRtl ? 'محادثتك مشفرة بالكامل · AES-256 · SHA-256 · غير قابلة للاختراق' : 'All conversations encrypted · AES-256 · SHA-256 · Tamper-proof'}</span>
          </div>
        </div>

        {/* ─── Bottom Platform Navigation Strip ───────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { to: '/contracts', icon: FileText, labelAr: 'إنشاء عقود', labelEn: 'Contract Generator', color: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400' },
            { to: '/risk', icon: Scale, labelAr: 'تحليل المخاطر', labelEn: 'Risk Audit', color: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400' },
            { to: '/templates', icon: ShieldCheck, labelAr: 'مكتبة النماذج', labelEn: 'Templates', color: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-400' },
            { to: '/payment', icon: Crown, labelAr: 'اشترك الآن', labelEn: 'Subscribe Now', color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400' },
          ].map(({ to, icon: Icon, labelAr, labelEn, color }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br border ${color} hover:brightness-125 transition-all group`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold">{isRtl ? labelAr : labelEn}</span>
              <ArrowRight className={`w-3 h-3 ml-auto group-hover:translate-x-0.5 transition-transform opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
