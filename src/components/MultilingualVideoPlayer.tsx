import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Shield, FileText, Zap, Award, Layers, Eye, RefreshCw, Globe, Video, Bot, Users, Lock } from 'lucide-react';
import { aiVoiceSynthesizer } from '../lib/aiVoiceSynthesizer';
import FemalePresenterAvatar from './FemalePresenterAvatar';

interface Scene {
  id: number;
  titleAr: string;
  titleEn: string;
  titleDe: string;
  titleFr: string;
  titleEs: string;
  titleZh: string;
  titleTr: string;
  duration: number; // in seconds
  scriptAr: string;
  scriptEn: string;
  scriptDe: string;
  scriptFr: string;
  scriptEs: string;
  scriptZh: string;
  scriptTr: string;
  badgeAr: string;
  badgeEn: string;
  animationType: 'scan' | 'ocr' | 'signature' | 'templates' | 'swift' | 'jurisdiction' | 'meeting' | 'chatbot' | 'radar' | 'vault';
  highlights: string[];
}

const SCENES: Scene[] = [
  {
    id: 1,
    titleAr: 'الفحص الموحد الفوري وتقييم المخاطر في أقل من ثانية',
    titleEn: 'Unified Quick Audit & Sub-Second Risk Analysis',
    titleDe: 'Einheitliche KI-Vertragsprüfung & Risikoanalyse in Unter Einer Sekunde',
    titleFr: 'Audit rapide unifié et analyse de risques instantanée',
    titleEs: 'Auditoría rápida unificada y análisis de riesgo en menos de un segundo',
    titleZh: '统一快速审计与亚秒级即时风险分析',
    titleTr: 'Birleşik Hızlı Denetim ve Saniye Altı Anında Risk Analizi',
    duration: 8,
    scriptAr: 'مرحباً بكم في منصة JurisTech Solutions. قم برفع العقد لفحصه آلياً واكتشاف الثغرات في أقل من ثانية واحدة.',
    scriptEn: 'Welcome to JurisTech Solutions. Upload any contract for sub-second AI risk auditing and compliance detection.',
    scriptDe: 'Willkommen bei JurisTech Solutions. Laden Sie Verträge für eine sofortige Risikoanalyse hoch.',
    scriptFr: 'Bienvenue sur JurisTech Solutions. Téléchargez vos contrats pour un audit de risque instantané.',
    scriptEs: 'Bienvenido a JurisTech Solutions. Suba sus contratos para auditoría de riesgo instantánea.',
    scriptZh: '欢迎使用 JurisTech Solutions。上传任何合同即可进行亚秒级 AI 风险审查。',
    scriptTr: 'JurisTech Solutions\'a hoş geldiniz. Anında risk denetimi için sözleşmelerinizi yükleyin.',
    badgeAr: 'الفحص الفوري بالذكاء الاصطناعي',
    badgeEn: 'Sub-Second Risk Audit',
    animationType: 'scan',
    highlights: ['Sub-Second Audit', '15+ Jurisdictions', 'Risk Score Matrix'],
  },
  {
    id: 2,
    titleAr: 'القارئ البصري الذكي وتوليد البنود البديلة لصفر مخاطر',
    titleEn: 'Native Language Vision OCR & Zero-Risk Alternative Generator',
    titleDe: 'Native-Sprachen OCR & Null-Risiko-Klausel-Generator',
    titleFr: 'OCR visuel en langue native et générateur de clauses à zéro risque',
    titleEs: 'OCR visual en idioma nativo y generador de cláusulas de cero riesgo',
    titleZh: '原生语言视觉 OCR 与零风险替代条款生成器',
    titleTr: 'Yerel Dil OCR ve Sıfır Riskli Alternatif Madde Oluşturucu',
    duration: 8,
    scriptAr: 'استخراج نصوص العقود باللغة الأصلية بدون ترجمة قسرية، مع توليد بنود حمائية متطابقة مع التشريعات المحلية والدولية.',
    scriptEn: 'Extract contract text in verbatim native script (Arabic/English/Multi-lang) and generate protective zero-risk redline clauses.',
    scriptDe: 'Extrahieren Sie Vertragstexte in der Originalsprache und generieren Sie risikofreie Ersatzklauseln.',
    scriptFr: 'Extrayez le texte dans sa langue d\'origine et générez des clauses de remplacement sans risque.',
    scriptEs: 'Extraiga el texto en su idioma original y genere cláusulas de reemplazo sin riesgo.',
    scriptZh: '提取原生语言合同文本，并自动生成符合本地与国际法律的零风险保护条款。',
    scriptTr: 'Sözleşme metnini yerel dilde çıkarın ve risk içermeyen alternatif koruyucu maddeler oluşturun.',
    badgeAr: 'القارئ البصري بلغة العقد',
    badgeEn: 'Native Vision OCR & Redlines',
    animationType: 'ocr',
    highlights: ['Native Language Verbatim', 'Zero-Risk Redlines', 'GCC Civil Codes'],
  },
  {
    id: 3,
    titleAr: 'غرفة التحقيق المباشر والتوقيع الرقمي المشفر SHA-256',
    titleEn: 'Live Interactive AI Forensic Room & SHA-256 E-Signatures',
    titleDe: 'Interaktiver KI-Forensikraum & SHA-256 E-Signaturen',
    titleFr: 'Salle d\'enquête IA en direct et signatures électroniques SHA-256',
    titleEs: 'Sala de investigación de IA en vivo y firmas digitales SHA-256',
    titleZh: '实时 AI 现场调查取证与 SHA-256 加密电子签名',
    titleTr: 'Canlı AI İnceleme Odası ve SHA-256 Dijital İmzalar',
    duration: 8,
    scriptAr: 'استجوب الذكاء الاصطناعي بنداً ببند وشغل محاكاة المنازعات القضائية، ثم اعتمد العقد بالتوقيع الرقمي المشفر.',
    scriptEn: 'Scrutinize clauses line-by-line, run simulated court rulings, and certify agreements with SHA-256 digital seals.',
    scriptDe: 'Prüfen Sie Klauseln Zeile für Zeile und signieren Sie Verträge mit kryptografischen Siegeln.',
    scriptFr: 'Examinez les clauses ligne par ligne et signez les contrats avec des sceaux cryptographiques.',
    scriptEs: 'Examine las cláusulas línea por línea y firme contratos con sellos criptográficos.',
    scriptZh: '逐行剖析合同条款，运行模拟法庭判决，并通过 SHA-256 数字印章在线签署。',
    scriptTr: 'Maddeleri satır satır inceleyin ve SHA-256 dijital mühürlerle sözleşmeleri imzalayın.',
    badgeAr: 'التحقيق والتوقيع الرقمي',
    badgeEn: 'Forensic Investigation & E-Sign',
    animationType: 'signature',
    highlights: ['SHA-256 Digital Seal', 'Court Dispute Simulation', 'UNCITRAL Grounding'],
  },
  {
    id: 4,
    titleAr: 'مكتبة العقود الذكية للشركات والمؤسسات (150+ عقد)',
    titleEn: 'Corporate Mega-Template Hub (150+ Smart Agreements)',
    titleDe: 'Umfassende Vorlagenbibliothek für Unternehmen (150+ Verträge)',
    titleFr: 'Bibliothèque de modèles d\'entreprise (150+ contrats intelligents)',
    titleEs: 'Biblioteca de plantillas corporativas (150+ contratos inteligentes)',
    titleZh: '企业级智能合同模板库 (150+ 法律协议)',
    titleTr: 'Kurumsal Akıllı Sözleşme Şablon Kütüphanesi (150+ Sözleşme)',
    duration: 8,
    scriptAr: 'صياغة فورية لعقود التأسيس، حوكمة الشركات، الاندماج والاستحواذ، اتفاقيات السرية ان دي اي، وعقود الساس.',
    scriptEn: 'Instant drafting for corporate formation, M&A acquisitions, NDAs, SaaS SLAs, and global trade agreements.',
    scriptDe: 'Sofortige Erstellung von Gründungsverträgen, M&A, NDAs, SaaS SLAs und Lieferkettenvereinbarungen.',
    scriptFr: 'Création instantanée pour la création d\'entreprise, M&A, NDA, SaaS SLA et contrats commerciaux.',
    scriptEs: 'Creación instantánea para constitución de empresas, M&A, NDA, SaaS SLA y comercio global.',
    scriptZh: '即时生成公司成立、并购、保密协议 NDA、SaaS SLA 及跨境贸易合同。',
    scriptTr: 'Şirket kuruluşu, birleşme, NDA ve SaaS SLA sözleşmelerini anında oluşturun.',
    badgeAr: '150+ عقد ذكي معتمد',
    badgeEn: '150+ Smart Templates',
    animationType: 'templates',
    highlights: ['M&A Due Diligence', 'Corporate Governance', 'NDA & SaaS SLAs'],
  },
  {
    id: 5,
    titleAr: 'سوق الرعايات والتحويل البنكي المباشر SWIFT',
    titleEn: 'SWIFT Direct Bank Remittance & Institutional Ads Marketplace',
    titleDe: 'SWIFT Direktüberweisung & Marktplatz für Sponsoring',
    titleFr: 'Virement bancaire direct SWIFT et marché de sponsoring',
    titleEs: 'Transferencia bancaria directa SWIFT y mercado de patrocinios',
    titleZh: 'SWIFT 银行直接电汇与机构赞助广告市场',
    titleTr: 'SWIFT Doğrudan Banka Havalesi ve Sponsorluk Pazarı',
    duration: 8,
    scriptAr: 'احجز مساحاتك الإعلانية ورعايات المؤسسات مباشرة وحصرياً عبر التحويل البنكي المباشر مع استلام الفواتير الرسمية.',
    scriptEn: 'Reserve corporate sponsorships and programmatic ad space directly via SWIFT bank wire remittance with instant pro-forma invoices.',
    scriptDe: 'Buchen Sie Sponsoring-Pakete direkt per SWIFT-Banküberweisung mit automatischen Pro-Forma-Rechnungen.',
    scriptFr: 'Réservez des espaces de sponsoring directement par virement SWIFT avec factures pro-forma instantanées.',
    scriptEs: 'Reserve patrocinios directamente a través de transferencia bancaria SWIFT con facturas proforma.',
    scriptZh: '通过 SWIFT 银行电汇直接预订企业赞助与广告位，并即时生成形式发票。',
    scriptTr: 'SWIFT banka havalesi ile kurumsal sponsorluk paketlerini doğrudan rezerve edin.',
    badgeAr: 'التحويل البنكي ورعاية الشركات',
    badgeEn: 'SWIFT Bank Wire & Sponsorships',
    animationType: 'swift',
    highlights: ['SWIFT Wire Remittance', 'Pro-Forma Invoicing', 'Institutional Sponsorships'],
  },
  {
    id: 6,
    titleAr: 'التغطية التشريعية لـ 15+ دولة ونظام منع الاحتيال المالي',
    titleEn: '15+ Sovereign Jurisdiction Grounding & Anti-Fraud Suite',
    titleDe: '15+ Nationale Rechtsordnungen & Anti-Betrugs-System',
    titleFr: 'Couverture juridique de 15+ pays et système anti-fraude',
    titleEs: 'Cobertura legal en 15+ países y sistema antifraude',
    titleZh: '15+ 国家主权法律架构与反欺诈安全防护',
    titleTr: '15+ Ülke Hukuk Sistemi ve Dolandırıcılık Önleme',
    duration: 8,
    scriptAr: 'تغطية قانونية شاملة لدول الخليج، مصر، أوروبا والأمريكتين مع حظر التلاعب المالي ومكافحة غسيل الأموال.',
    scriptEn: 'Comprehensive legal coverage for GCC, Egypt, EU, UK, and US civil codes with active anti-money-laundering (AML) audit controls.',
    scriptDe: 'Umfassende rechtliche Abdeckung für GCC, Ägypten, EU, GB und USA mit aktiver Anti-Geldwäsche-Kontrolle.',
    scriptFr: 'Couverture juridique complète pour le GCC, l\'Égypte, l\'UE et les États-Unis avec contrôles anti-blanchiment.',
    scriptEs: 'Cobertura legal integral para el Golfo, Egipto, la UE y EE. UU. con controles antifraude.',
    scriptZh: '全面覆盖海湾合作委员会、埃及、欧盟与美英法律，并具备反洗钱 AML 安全审计。',
    scriptTr: 'Körfez, Mısır, AB ve ABD hukuk sistemleri için kapsamlı koruma ve dolandırıcılık önleme.',
    badgeAr: 'التغطية السيادية والأنظمة',
    badgeEn: '15+ Sovereign Jurisdictions',
    animationType: 'jurisdiction',
    highlights: ['GCC Civil Codes', 'EU GDPR & US Laws', 'AML & Anti-Fraud Audit'],
  },
  {
    id: 7,
    titleAr: 'حجز الاستشارات المباشرة عبر Zoom & Microsoft Teams',
    titleEn: 'Live Zoom & Microsoft Teams Online Consultation & AI Minutes',
    titleDe: 'Online-Konsultation über Zoom & Microsoft Teams',
    titleFr: 'Consultation en ligne via Zoom & Microsoft Teams',
    titleEs: 'Consulta en línea a través de Zoom y Microsoft Teams',
    titleZh: 'Zoom 与 Microsoft Teams 实时在线咨询与 AI 会议纪要',
    titleTr: 'Zoom ve Teams Canlı Danışmanlık ve AI Toplantı Tutanağı',
    duration: 8,
    scriptAr: 'احجز جلسات التفاوض المباشرة عبر زوم أو تيمز مع مساعد الذكاء الاصطناعي لتلخيص الالتزامات والأحكام.',
    scriptEn: 'Schedule live negotiation sessions via Zoom or Teams with AI assistant summarizing meeting minutes and legal commitments.',
    scriptDe: 'Buchen Sie Verhandlungssitzungen über Zoom oder Teams mit automatischer KI-Protokollierung.',
    scriptFr: 'Planifiez des séances de négociation via Zoom ou Teams avec procès-verbal généré par l\'IA.',
    scriptEs: 'Reserve sesiones de negociación en vivo a través de Zoom o Teams con acta generada por IA.',
    scriptZh: '通过 Zoom 或 Teams 预约实时会谈，AI 助手为您自动记录与签署加密会议纪要。',
    scriptTr: 'Zoom veya Teams üzerinden canlı görüşme yapın ve AI ile tutanak oluşturun.',
    badgeAr: 'جلسات الاجتماع أونلاين',
    badgeEn: 'Live Zoom & Teams Consultation',
    animationType: 'meeting',
    highlights: ['Zoom & Teams Integrated', 'AI Live Minutes', 'Encrypted Meeting Seal'],
  },
  {
    id: 8,
    titleAr: 'الشات بوت القانوني الخارق بلغات المنصة السبع',
    titleEn: '7-Language Native AI Legal Concierge Chatbot',
    titleDe: '7-Sprachen KI-Rechts-Chatbot für Unternehmen',
    titleFr: 'Chatbot juridique IA en 7 langues natives',
    titleEs: 'Chatbot legal de IA en 7 idiomas nativos',
    titleZh: '7 种语言原生 AI 法律智能聊天机器人',
    titleTr: '7 Dilde Yerel AI Hukuk Chatbotu',
    duration: 8,
    scriptAr: 'استجب الذكاء الاصطناعي على مدار الساعة بأي لغة من لغات المنصة السبع للحصول على إجابات قانونية عملية وفورية.',
    scriptEn: 'Ask legal questions 24/7 in any of our 7 native supported languages for instant practical statutory analysis.',
    scriptDe: 'Stellen Sie rund um die Uhr rechtliche Fragen in 7 Sprachen für eine sofortige gesetzliche Analyse.',
    scriptFr: 'Posez vos questions juridiques 24/7 en 7 langues natives pour des réponses instantanées.',
    scriptEs: 'Haga preguntas legales 24/7 en 7 idiomas nativos para análisis estatutario instantáneo.',
    scriptZh: '全天候 24/7 使用 7 种原生语言咨询法律问题，获取即时合规解答。',
    scriptTr: '7 dilde 7/24 hukuki sorularınızı sorun ve anında yanıt alın.',
    badgeAr: 'الشات بوت القانوني 24/7',
    badgeEn: '7-Lang Native AI Chatbot',
    animationType: 'chatbot',
    highlights: ['7 Languages Auto-Match', 'Instant Risk Advice', 'WhatsApp Direct Link'],
  },
  {
    id: 9,
    titleAr: 'رادار العملاء الأوتوماتيكي وطابور المراجعة البشرية المحكومة',
    titleEn: 'Automated Lead Radar Engine & Human-in-the-Loop Review Queue',
    titleDe: 'Automatisierter Lead-Radar & Menschliche Überprüfungsschlange',
    titleFr: 'Moteur Radar de Leads et queue de révision humaine',
    titleEs: 'Motor de Radar de Leads y cola de revisión humana',
    titleZh: '自动化潜客雷达与人工审核双重保障',
    titleTr: 'Otomatik Müşteri Radarı ve İnsan Onay Sırası',
    duration: 8,
    scriptAr: 'جمع إشارات الاهتمام آلياً بموافقة المستخدم مع إخضاع كل عرض ومراسلة لمراجعة واعتماد العنصر البشري قبل الإرسال.',
    scriptEn: 'Automated opt-in lead scoring with mandatory Human-in-the-Loop (HITL) review queue enforcing zero automated messaging without approval.',
    scriptDe: 'Automatisches Lead-Scoring mit obligatorischer menschlicher Freigabe vor jedem Versand.',
    scriptFr: 'Scoring automatisé des leads avec file d\'attente de révision humaine obligatoire avant envoi.',
    scriptEs: 'Calificación automatizada de leads con revisión humana obligatoria antes del envío.',
    scriptZh: '基于授权的潜客意向自动评分，所有 AI 方案必须经由人工审核队列确认后方可发送。',
    scriptTr: 'İzinli müşteri puanlama ve gönderim öncesi zorunlu insan onay mekanizması.',
    badgeAr: 'رادار العملاء والمراجعة البشرية',
    badgeEn: 'Lead Radar & Human Oversight',
    animationType: 'radar',
    highlights: ['Consent Opt-In Scoring', 'Human-in-the-Loop Queue', 'SEC-001 Approval'],
  },
];

const TOTAL_VIDEO_DURATION = SCENES.reduce((acc, s) => acc + s.duration, 0); // Total 72 seconds

interface MultilingualVideoPlayerProps {
  activeModuleId?: number;
}

export default function MultilingualVideoPlayer({ activeModuleId }: MultilingualVideoPlayerProps = {}) {
  const { i18n } = useTranslation();
  const activeLang = (i18n.language || 'ar') as 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'tr';

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState<'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'tr'>(activeLang);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external activeModuleId if passed from VideoHubPage
  useEffect(() => {
    if (activeModuleId != null && activeModuleId >= 1 && activeModuleId <= SCENES.length) {
      setCurrentSceneIndex(activeModuleId - 1);
      setSceneProgress(0);
      setIsPlaying(true);
    }
  }, [activeModuleId]);

  const currentScene = SCENES[currentSceneIndex] || SCENES[0];

  useEffect(() => {
    if (['ar', 'en', 'fr', 'es', 'de', 'zh', 'tr'].includes(i18n.language)) {
      setSelectedLang(i18n.language as any);
    }
  }, [i18n.language]);

  /**
   * Guaranteed Multi-language Speech Synthesis with Arabic Fallback
   */
  function speakSceneScript(text: string, langCode: string) {
    if (isVoiceMuted) {
      aiVoiceSynthesizer.stop();
      setIsSpeaking(false);
      return;
    }

    aiVoiceSynthesizer.speak({
      lang: langCode,
      text: text,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }

  useEffect(() => {
    if (isPlaying) {
      const script = getSceneScript(currentScene, selectedLang);
      speakSceneScript(script, selectedLang);
    } else {
      aiVoiceSynthesizer.stop();
      setIsSpeaking(false);
    }
  }, [currentSceneIndex, isPlaying, selectedLang, isVoiceMuted]);


  // Main unified video timeline clock
  useEffect(() => {
    let timer: any;
    const intervalMs = 100;
    const sceneTotalMs = currentScene.duration * 1000;

    if (isPlaying) {
      timer = setInterval(() => {
        setSceneProgress((prev) => {
          const next = prev + (intervalMs / sceneTotalMs) * 100;
          if (next >= 100) {
            if (currentSceneIndex < SCENES.length - 1) {
              setCurrentSceneIndex((idx) => idx + 1);
            } else {
              setCurrentSceneIndex(0);
            }
            return 0;
          }
          return next;
        });

        // Compute overall timeline progress (0% to 100%)
        const elapsedPriorScenes = SCENES.slice(0, currentSceneIndex).reduce((acc, s) => acc + s.duration, 0);
        const currentElapsed = (sceneProgress / 100) * currentScene.duration;
        const totalElapsed = elapsedPriorScenes + currentElapsed;
        setTotalProgress((totalElapsed / TOTAL_VIDEO_DURATION) * 100);

      }, intervalMs);
    }

    return () => clearInterval(timer);
  }, [isPlaying, currentScene.duration, currentSceneIndex, sceneProgress]);

  function getSceneTitle(s: Scene, lang: string): string {
    switch (lang) {
      case 'ar': return s.titleAr;
      case 'de': return s.titleDe;
      case 'fr': return s.titleFr;
      case 'es': return s.titleEs;
      case 'zh': return s.titleZh;
      case 'tr': return s.titleTr;
      default: return s.titleEn;
    }
  }

  function getSceneScript(s: Scene, lang: string): string {
    switch (lang) {
      case 'ar': return s.scriptAr;
      case 'de': return s.scriptDe;
      case 'fr': return s.scriptFr;
      case 'es': return s.scriptEs;
      case 'zh': return s.scriptZh;
      case 'tr': return s.scriptTr;
      default: return s.scriptEn;
    }
  }

  function getSceneBadge(s: Scene, lang: string): string {
    return lang === 'ar' ? s.badgeAr : s.badgeEn;
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function handleNextScene() {
    window.speechSynthesis?.cancel();
    setSceneProgress(0);
    if (currentSceneIndex < SCENES.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      setCurrentSceneIndex(0);
    }
  }

  function handlePrevScene() {
    window.speechSynthesis?.cancel();
    setSceneProgress(0);
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    } else {
      setCurrentSceneIndex(SCENES.length - 1);
    }
  }

  function toggleFullscreen() {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl space-y-0 relative group font-sans"
      dir={selectedLang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Unified Animated Motion Canvas Screen */}
      <div className="relative aspect-video bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
        
        {/* Dynamic Scene Background Gradients */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            currentScene.animationType === 'scan'
              ? 'bg-gradient-to-tr from-slate-950 via-cyan-950/70 to-slate-950'
              : currentScene.animationType === 'ocr'
              ? 'bg-gradient-to-tr from-slate-950 via-amber-950/70 to-slate-950'
              : currentScene.animationType === 'signature'
              ? 'bg-gradient-to-tr from-slate-950 via-emerald-950/70 to-slate-950'
              : currentScene.animationType === 'templates'
              ? 'bg-gradient-to-tr from-slate-950 via-indigo-950/70 to-slate-950'
              : currentScene.animationType === 'swift'
              ? 'bg-gradient-to-tr from-slate-950 via-purple-950/70 to-slate-950'
              : currentScene.animationType === 'jurisdiction'
              ? 'bg-gradient-to-tr from-slate-950 via-blue-950/70 to-slate-950'
              : currentScene.animationType === 'meeting'
              ? 'bg-gradient-to-tr from-slate-950 via-sky-950/70 to-slate-950'
              : currentScene.animationType === 'chatbot'
              ? 'bg-gradient-to-tr from-slate-950 via-teal-950/70 to-slate-950'
              : currentScene.animationType === 'radar'
              ? 'bg-gradient-to-tr from-slate-950 via-pink-950/70 to-slate-950'
              : 'bg-gradient-to-tr from-slate-950 via-yellow-950/70 to-slate-950'
          }`}
        />

        {/* Animated Grid & Glow Particle Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Scene Top Info Bar with AI Avatar Narrator Badge & Waveform Indicator */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CLIENT TUTORIAL — MODULE {currentScene.id < 10 ? `0${currentScene.id}` : currentScene.id} / 09</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>AI Digital Narrator | الراوي الرقمي الذكي</span>
              {isSpeaking && (
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                  <span className="w-1 h-4 bg-amber-300 animate-bounce rounded-full" />
                  <span className="w-1 h-2 bg-amber-400 animate-pulse rounded-full" />
                </span>
              )}
            </div>
          </div>

          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5 font-mono shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{getSceneBadge(currentScene, selectedLang)}</span>
          </span>
        </div>

        {/* Interactive Scene Motion Graphics Overlay */}
        <div className="relative z-10 my-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight animate-in fade-in zoom-in duration-500">
                {getSceneTitle(currentScene, selectedLang)}
              </h2>

              {/* Live Interactive Feature Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {currentScene.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1 shadow"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Animated Visual Motion Graphics Card */}
            <div className="hidden md:flex md:col-span-5 items-center justify-center">
              <div className="w-full bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden group-hover:border-cyan-400 transition-all">
                <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-bounce">
                  {currentScene.animationType === 'scan' && <Shield className="w-10 h-10" />}
                  {currentScene.animationType === 'ocr' && <Eye className="w-10 h-10" />}
                  {currentScene.animationType === 'signature' && <Award className="w-10 h-10" />}
                  {currentScene.animationType === 'templates' && <Layers className="w-10 h-10" />}
                  {currentScene.animationType === 'swift' && <RefreshCw className="w-10 h-10" />}
                  {currentScene.animationType === 'jurisdiction' && <Globe className="w-10 h-10" />}
                  {currentScene.animationType === 'meeting' && <Video className="w-10 h-10" />}
                  {currentScene.animationType === 'chatbot' && <Bot className="w-10 h-10" />}
                  {currentScene.animationType === 'radar' && <Users className="w-10 h-10" />}
                  {currentScene.animationType === 'vault' && <Lock className="w-10 h-10" />}
                </div>
                <span className="text-xs font-mono font-black text-slate-900 dark:text-white text-center">
                  {currentScene.badgeEn}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  ACTIVE AI ENGINE
                </span>
              </div>
            </div>
          </div>

          {/* Animated Female AI Presenter Girl (Sarah) Explaining the Platform */}
          <FemalePresenterAvatar
            isSpeaking={isSpeaking}
            selectedLang={selectedLang}
            currentScript={getSceneScript(currentScene, selectedLang)}
          />

        </div>

        {/* Master Single Continuous Timeline Progress Bar */}
        <div className="relative z-10 space-y-2">
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-100 ease-linear rounded-full shadow-lg"
              style={{ width: `${totalProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <span>Overall Walkthrough: {Math.round(totalProgress)}%</span>
            <span>Module {currentSceneIndex + 1} of {SCENES.length} ({currentScene.duration}s)</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md flex items-center gap-1.5 text-xs active:scale-98"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? (selectedLang === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (selectedLang === 'ar' ? 'تشغيل الفيديو' : 'Play Video')}</span>
          </button>

          <button onClick={handlePrevScene} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
            <ChevronLeft className={`w-4 h-4 ${selectedLang === 'ar' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={handleNextScene} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
            <ChevronRight className={`w-4 h-4 ${selectedLang === 'ar' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => {
              setIsVoiceMuted(!isVoiceMuted);
              window.speechSynthesis?.cancel();
            }}
            className={`p-2.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
              !isVoiceMuted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-red-400 border-slate-300 dark:border-slate-700'
            }`}
          >
            {!isVoiceMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{!isVoiceMuted ? (selectedLang === 'ar' ? 'الصوت مفعل' : 'Voice ON') : (selectedLang === 'ar' ? 'كتم الصوت' : 'Voice OFF')}</span>
          </button>
        </div>

        {/* 7-Language Voice Audio Track Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-300 dark:border-slate-700 overflow-x-auto no-scrollbar">
            {[
              { code: 'ar', label: 'العربية' },
              { code: 'en', label: 'English' },
              { code: 'fr', label: 'Français' },
              { code: 'de', label: 'Deutsch' },
              { code: 'es', label: 'Español' },
              { code: 'zh', label: '中文' },
              { code: 'tr', label: 'Türkçe' },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  setSelectedLang(code as any);
                  setSceneProgress(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLang === code ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button onClick={toggleFullscreen} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Unified Video Timeline Chapter Selector */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => {
                setCurrentSceneIndex(idx);
                setSceneProgress(0);
                setIsPlaying(true);
              }}
              className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2 ${
                currentSceneIndex === idx ? 'bg-white dark:bg-slate-900 border-cyan-500/60 shadow-lg' : 'bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700'
              }`}
            >
              <span className={`w-6 h-6 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                currentSceneIndex === idx ? 'bg-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {scene.id < 10 ? `0${scene.id}` : scene.id}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {getSceneTitle(scene, selectedLang)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
