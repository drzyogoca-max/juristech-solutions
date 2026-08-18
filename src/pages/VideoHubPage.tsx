/**
 * VideoHubPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AI-Powered Interactive HD Animation Video & AI Voice Narration Hub
 * Covering ALL 15 Platform Services with Live Voice Speech Synthesis
 * Features:
 *   • Multilingual AI Voice Narration for all 7 platform languages (AR, EN, FR, DE, ES, ZH, TR)
 *   • 15 Animated HD Video Scenes with Canvas 3D Cyber Grids & UI Mockup Pictures
 *   • One-Click "Enable AI Voice" Audio Unlock Button
 *   • Typewriter Subtitle Sync & Speech Wave Status Bar
 *   • Speed Controls (0.5x, 1x, 1.5x, 2x), Voice Toggle, Fullscreen & Social Sharing
 */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Globe, Award, BookOpen, Shield, Lock, Zap, Users, FileText,
  Brain, CheckCircle2, Sparkles, BarChart3, RefreshCw, Maximize,
  Share2, Search, Rocket, Mic, Library, Handshake, DollarSign, Share, HardDrive, Maximize2, Facebook, Twitter, Linkedin, Loader2, Eye
} from 'lucide-react';
import SEO from '../components/SEO';

import AnimatedScene, { VideoScene } from '../components/AnimatedScene';
import VideoLanguageSync from '../components/VideoLanguageSync';
import { aiVoiceSynthesizer } from '../lib/aiVoiceSynthesizer';
import MultilingualVideoPlayer from '../components/MultilingualVideoPlayer';

// Multilingual narration scripts covering ALL 15 platform services across 7 languages
const MULTILINGUAL_SCRIPTS: Record<number, Record<string, string>> = {
  1: {
    ar: 'مرحباً بك في JurisTech Solutions — خريطة العمل الشاملة تبدأ بإدخال العقد، ثم الفحص التشريعي الفوري، وتوليد البنود الحمائية، والتوقيع المشفر، والحفظ بالخزنة.',
    en: 'Welcome to JurisTech Solutions — the end-to-end legal process begins with input, sub-second AI auditing, clause redlining, e-signing, and encrypted vault storage.',
    fr: 'Bienvenue sur JurisTech Solutions — le processus complet commence par le téléchargement, l’audit IA, la rédaction de clauses et le coffre-fort.',
    de: 'Willkommen bei JurisTech Solutions — der End-to-End-Prozess beginnt mit der Eingabe, KI-Vertragsprüfung, Redlining und Tresorspeicherung.',
    es: 'Bienvenido a JurisTech Solutions — el proceso completo comienza con la carga, auditoría IA, redacción de cláusulas y bóveda.',
    zh: '欢迎来到 JurisTech Solutions — 完整的法律流程包含文件上传、AI审查、条款协商、电子签名与保险库存储。',
    tr: 'JurisTech Solutions’a hoş geldiniz — uçtan uca hukuki süreç yükleme, AI denetimi, madde düzenleme ve şifreli kasa ile başlar.',
  },
  2: {
    ar: 'خدمة المستشار القانوني الذكي AI Legal Concierge — إجابات وتشريعات مخصصة لتأسيس الشركات والقوانين المدنية والعمالية.',
    en: 'AI Legal Concierge Service — tailored answers for LLC company incorporation (Jordan CCD, KSA, UAE, Egypt), labor law, and civil codes.',
    fr: 'Service de conseiller juridique IA — réponses personnalisées pour la création de sociétés, le droit du travail et le code civil.',
    de: 'KI-Rechtsberater-Dienst — maßgeschneiderte Antworten für Unternehmensgründung, Arbeitsrecht und Zivilrecht.',
    es: 'Servicio de Asesor Legal IA — respuestas personalizadas para constitución de empresas, derecho laboral y civil.',
    zh: 'AI 法律顾问服务 — 针对公司成立（约旦 CCD、沙特、阿联酋、埃及）、劳动法与民法提供定制化解答。',
    tr: 'Yapay Zeka Hukuk Danışmanı Hizmeti — şirket kuruluşu, iş hukuku ve borçlar hukuku için özel yanıtlar.',
  },
  3: {
    ar: 'خدمة منشئ العقود الذكي Contract Generator — أكثر من 150 قالب قانوني مع صياغة آمنة وموثقة لجميع القطاعات.',
    en: 'AI Contract Generator Service — 150+ legal templates with automated clause drafting for corporate & commercial deals.',
    fr: 'Générateur de contrats IA — plus de 150 modèles juridiques avec rédaction automatisée.',
    de: 'KI-Vertragsgenerator-Dienst — 150+ Rechtsvorlagen mit automatisierter Klauselextraktion.',
    es: 'Generador de contratos IA — más de 150 plantillas legales con redacción automatizada.',
    zh: 'AI合同生成器服务 — 包含150多个法律模板与自动条款起草。',
    tr: 'Yapay Zeka Sözleşme Oluşturucu — otomatik madde taslağı özellikli 150’den fazla şablon.',
  },
  4: {
    ar: 'خدمة تدقيق ومسح المخاطر Smart Audit — تدقيق تشريعي فوري في أقل من 90 ملي ثانية للبث والنقاط الحساسة.',
    en: 'Smart Risk Audit Service — sub-second statutory compliance verification and risk analysis in < 90ms.',
    fr: 'Service d’audit de risques — vérification instantanée de la conformité et analyse des risques en < 90ms.',
    de: 'Smart Risk Audit Dienst — sofortige Überprüfung der Einhaltung und Risikoanalyse in < 90ms.',
    es: 'Servicio de Auditoría de Riesgos — verificación de cumplimiento e inspección al instante.',
    zh: '智能风险审查服务 — 亚秒级合规性验证与风险分析（< 90毫秒）。',
    tr: 'Akıllı Risk Denetim Hizmeti — 90ms altında anında uyumluluk doğrulaması ve risk analizi.',
  },
  5: {
    ar: 'خدمة الخزنة المشفرة Encrypted Vault — حفظ وتشفير عقودك بمعيار AES-256 مع تتبع تلقائي للمواعيد والانتهاء.',
    en: 'AES-256 Encrypted Vault Service — secure contract storage with automated expiry tracking.',
    fr: 'Service de coffre-fort chiffré AES-256 — stockage sécurisé de contrats avec suivi d’expiration.',
    de: 'AES-256 verschlüsselter Tresordienst — sichere Vertragsspeicherung mit Ablaufüberwachung.',
    es: 'Servicio de Bóveda Cifrada AES-256 — almacenamiento seguro de contratos con seguimiento.',
    zh: 'AES-256加密保险库服务 — 文档安全存储与到期自动追踪。',
    tr: 'AES-256 Şifreli Kasa Hizmeti — otomatik son kullanma tarihi takipli güvenli depolama.',
  },
  6: {
    ar: 'خدمة المحقق وفاحص الأدلة AI Inspector — فحص وتحليل المستندات والأدلة الرقمية عبر القارئ البصري الذكي.',
    en: 'AI Inspector Service — thorough document examination and native language OCR evidence analysis.',
    fr: 'Service d’inspection IA — examen approfondi des documents et preuves juridiques par OCR.',
    de: 'KI-Inspektor-Dienst — gründliche Dokumentenprüfung und Beweisanalyse per OCR.',
    es: 'Servicio de Inspección IA — examen exhaustivo de documentos y pruebas legales.',
    zh: 'AI检查员服务 — 深入的文件检查与原生语言 OCR 法律证据分析。',
    tr: 'Yapay Zeka Denetçi Hizmeti — OCR ile kapsamlı belge incelemesi ve kanıt analizi.',
  },
  7: {
    ar: 'مكتبة النماذج القانونية Legal Templates — مكتبة متكاملة للنماذج وعقود التأسيس والـ NDA والـ SaaS.',
    en: 'Legal Templates Library Service — complete library of corporate agreements, NDAs, and SaaS SLAs.',
    fr: 'Bibliothèque de modèles juridiques — collection complète d’accords prêts à l’emploi.',
    de: 'Rechtsvorlagen-Bibliothek — vollständige Sammlung von vertragsbereiten Vereinbarungen.',
    es: 'Biblioteca de plantillas legales — colección completa de acuerdos listos para usar.',
    zh: '法律模板库服务 — 包含公司章程、NDA 与 SaaS 协议的全能法律库。',
    tr: 'Hukuki Şablonlar Kütüphanesi Hizmeti — kullanıma hazır sözleşme koleksiyonu.',
  },
  8: {
    ar: 'بوابة التفاوض الرقمية Negotiation Portal — إدارة التفاوض وحسم البنود أونلاين بين الأطراف.',
    en: 'Digital Negotiation Portal Service — online clause resolution and live contract redlining.',
    fr: 'Portail de négociation numérique — résolution de clauses et négociation en ligne.',
    de: 'Digitales Verhandlungsportal — Online-Klauselauflösung und Vertragsverhandlung.',
    es: 'Portal de negociación digital — resolución de cláusulas y negociación en línea.',
    zh: '数字谈判门户服务 — 在线条款协商与实时合同谈判。',
    tr: 'Dijital Müzakere Portalı Hizmeti — çevrim içi madde çözümü ve müzakere.',
  },
  9: {
    ar: 'فاحص صفقات الاندماج والاستحواذ M&A Audit — تحليل شامل ودقيق للمخاطر المالية والتقييم وتأمينات W&I.',
    en: 'M&A Due Diligence Audit Service — comprehensive financial and legal risk analysis for deal acquisitions.',
    fr: 'Service d’audit M&A — analyse complète des risques financiers et juridiques.',
    de: 'M&A Due Diligence Dienst — umfassende finanzielle und rechtliche Risikoanalyse.',
    es: 'Servicio M&A Due Diligence — análisis integral de riesgos financieros y legales.',
    zh: '并购尽职调查审查服务 — 综合财务与法律风险分析。',
    tr: 'M&A Denetim Hizmeti — kapsamlı mali ve hukuki risk analizi.',
  },
  10: {
    ar: 'سوق الرعايات والإعلانات Sponsors Marketplace — ربط منصتك مع الشركات والرعاة مع الدفع البنكي المباشر SWIFT.',
    en: 'Sponsorships & Ads Marketplace Service — connect your business with global sponsors via SWIFT wire.',
    fr: 'Marché de parrainage et publicités — connectez votre entreprise avec des sponsors globaux.',
    de: 'Sponsoring & Anzeigen-Marktplatz — verbinden Sie Ihr Unternehmen mit Sponsoren.',
    es: 'Mercado de patrocinio y anuncios — conecta tu negocio con patrocinadores globales.',
    zh: '赞助与广告市场服务 — 通过 SWIFT 电汇连接您的业务与全球赞助商。',
    tr: 'Sponsorluk Pazarı Hizmeti — işinizi küresel sponsorlarla buluşturun.',
  },
  11: {
    ar: 'رادار العملاء الذكي B2B Lead Radar — مرصد استباقي لرصد وتتبع الفرص التجارية والفرص الاستثمارية.',
    en: 'B2B Lead Radar Service — proactive monitoring and tracking of commercial leads & opportunities.',
    fr: 'Radar de prospects B2B — surveillance proactive et suivi des opportunités commerciales.',
    de: 'B2B Lead Radar Dienst — proaktive Überwachung und Verfolgung von Vertriebschancen.',
    es: 'Radar de clientes B2B — monitoreo proactivo y seguimiento de oportunidades comerciales.',
    zh: 'B2B线索雷达服务 — 主动监控与商业机会追踪。',
    tr: 'B2B Müşteri Radarı Hizmeti — ticari fırsatların proaktif izlenmesi ve takibi.',
  },
  12: {
    ar: 'مركز الفيديو التفاعلي الناطق Video Hub — دليل تعليمي متحرك مدعوم بالذكاء الاصطناعي بـ 7 لغات.',
    en: 'Interactive Talking Video Hub Service — AI-powered visual educational guide in 7 global languages.',
    fr: 'Centre vidéo interactif — guide éducatif visuel propulsé par l’IA en 7 langues.',
    de: 'Interaktives Video-Zentrum — KI-gestützter visueller Bildungsleitfaden in 7 Sprachen.',
    es: 'Centro de video interactivo — guía educativa visual impulsada por IA en 7 idiomas.',
    zh: '交互式语音视频中心服务 — 支持7种语言的 AI 视觉教育指南。',
    tr: 'İnteraktif Konuşan Video Merkezi — 7 dilde yapay zeka destekli rehber.',
  },
  13: {
    ar: 'دليل تأسيس الشركات (الأردن، السعودية، الإمارات، مصر، أمريكا) — مواءمة تشريعية كاملة واستخراج السجل والترخيص.',
    en: 'LLC Business Incorporation & Compliance (Jordan CCD, KSA, UAE, Egypt, US) — statutory filing & registry.',
    fr: 'Service de création et conformité d’entreprise — alignement complet avec les lois locales et internationales.',
    de: 'Gründung & Compliance (Jordanien, VAE, KSA, USA) — vollständige Abstimmung mit lokalem Recht.',
    es: 'Servicio de constitución de empresas — alineación completa con leyes locales e internacionales.',
    zh: '公司注册与合规服务（约旦 CCD、沙特、阿联酋、埃及、美国）— 完全符合主权法律。',
    tr: 'Şirket Kuruluşu ve Uyumluluk — yerel ve uluslararası yasalarla tam uyum.',
  },
  14: {
    ar: 'التسويق الرقمي Legal Marketing — أتمتة الحملات والحضور الرقمي القانوني للمكاتب والشركات.',
    en: 'Legal Marketing Service — automated campaign management and digital brand presence for law firms.',
    fr: 'Service de marketing juridique — gestion automatisée des campagnes numériques.',
    de: 'Rechtsmarketing-Dienst — automatisiertes Kampagnenmanagement.',
    es: 'Servicio de marketing legal — gestión automatizada de campañas y presencia digital.',
    zh: '法律数字营销服务 — 律所与企业自动化营销活动与品牌推广。',
    tr: 'Hukuki Dijital Pazarlama Hizmeti — otomatik kampanya yönetimi.',
  },
  15: {
    ar: 'التقارير التنفيذية والبدء الآن — انضم إلى ثورة الذكاء الاصطناعي القانوني واستفد من جميع الخدمات الـ 15.',
    en: 'Executive Reports & AI Revolution — join the legal AI revolution and unlock all 15 services.',
    fr: 'Rapports exécutifs et révolution IA — rejoignez la révolution et débloquez les 15 services.',
    de: 'Führungsberichte & KI-Revolution — treten Sie der Rechtsrevolution bei und nutzen Sie alle 15 Dienste.',
    es: 'Informes ejecutivos y Revolución IA — únete a la revolución legal y accede a los 15 servicios.',
    zh: '执行报告与AI革命 — 立即加入法律人工智能革命，解锁全部15项服务。',
    tr: 'Yönetici Raporları ve Yapay Zeka Devrimi — yapay zeka devrimine katılın ve tüm 15 hizmeti açın.',
  },
};

// 15 Scene Definitions matching all 15 Platform Services
const SCENES: VideoScene[] = [
  {
    id: 1,
    durationSec: 10,
    titleAr: '1. خريطة العمل الكاملة للمنصة في 5 خطوات آلمية',
    titleEn: '1. Complete 5-Step End-to-End Platform Process Workflow',
    scriptAr: MULTILINGUAL_SCRIPTS[1].ar,
    scriptEn: MULTILINGUAL_SCRIPTS[1].en,
    icon: Rocket,
    bgGradient: 'from-slate-950 via-cyan-950 to-indigo-950',
    accentColor: 'text-cyan-400',
    visualType: 'workflow',
    features: [
      { ar: '1. إدخال أو رفع العقد', en: '1. Input Query / Upload' },
      { ar: '2. فحص تشريعي < 90ms', en: '2. Sub-Second AI Audit' },
      { ar: '3. بنود بديلة وتفاوض', en: '3. Redline & Negotiation' },
      { ar: '4. توقيع وتغيير مشفر', en: '4. SHA-256 E-Sign' },
      { ar: '5. حفظ وتتبع رادار', en: '5. Vault & B2B Radar' },
    ],
  },
  { id: 2, durationSec: 9, titleAr: '2. المستشار القانوني الذكي (تأسيس الشركات والقوانين)', titleEn: '2. AI Legal Concierge (Company Formation & Civil Law)', scriptAr: MULTILINGUAL_SCRIPTS[2].ar, scriptEn: MULTILINGUAL_SCRIPTS[2].en, icon: Brain, bgGradient: 'from-slate-900 via-indigo-950 to-slate-900', accentColor: 'text-indigo-400', visualType: 'brain', features: [{ ar: 'تأسيس شركات الأردن والسعودية ومصر', en: 'Jordan, KSA, Egypt LLC Formation' }] },
  { id: 3, durationSec: 10, titleAr: '3. منشئ العقود الذكي (+150 قالب)', titleEn: '3. AI Contract Generator (150+ Templates)', scriptAr: MULTILINGUAL_SCRIPTS[3].ar, scriptEn: MULTILINGUAL_SCRIPTS[3].en, icon: FileText, bgGradient: 'from-cyan-950 via-slate-900 to-indigo-950', accentColor: 'text-cyan-400', visualType: 'contract', features: [{ ar: '+150 قالب قانوني معتمد', en: '150+ Approved Templates' }] },
  { id: 4, durationSec: 9, titleAr: '4. تدقيق ومسح المخاطر التشريعية', titleEn: '4. Smart Risk Audit Engine (< 90ms)', scriptAr: MULTILINGUAL_SCRIPTS[4].ar, scriptEn: MULTILINGUAL_SCRIPTS[4].en, icon: BarChart3, bgGradient: 'from-slate-900 via-red-950/30 to-slate-900', accentColor: 'text-amber-400', visualType: 'risk', features: [{ ar: 'فحص مخاطر في < 90ms', en: 'Risk Scan < 90ms' }] },
  { id: 5, durationSec: 9, titleAr: '5. الخزنة المشفرة AES-256 وتتبع المواعيد', titleEn: '5. AES-256 Encrypted Vault & Expiry Tracking', scriptAr: MULTILINGUAL_SCRIPTS[5].ar, scriptEn: MULTILINGUAL_SCRIPTS[5].en, icon: Lock, bgGradient: 'from-slate-900 via-emerald-950/30 to-slate-900', accentColor: 'text-emerald-400', visualType: 'vault', features: [{ ar: 'تشفير AES-256 وحماية البيانات', en: 'AES-256 Full Data Vault' }] },
  { id: 6, durationSec: 8, titleAr: '6. المحقق وفاحص الأدلة والقارئ البصري', titleEn: '6. AI Inspector & Native Vision OCR', scriptAr: MULTILINGUAL_SCRIPTS[6].ar, scriptEn: MULTILINGUAL_SCRIPTS[6].en, icon: Search, bgGradient: 'from-indigo-950 via-slate-900 to-purple-950', accentColor: 'text-indigo-400', visualType: 'search', features: [{ ar: 'فحص الأدلة الرقمية بالـ OCR', en: 'Digital OCR Evidence Audit' }] },
  { id: 7, durationSec: 8, titleAr: '7. مكتبة النماذج وعقود التأسيس والـ NDA', titleEn: '7. Corporate Mega-Templates & NDAs', scriptAr: MULTILINGUAL_SCRIPTS[7].ar, scriptEn: MULTILINGUAL_SCRIPTS[7].en, icon: Library, bgGradient: 'from-slate-900 via-cyan-950/30 to-slate-900', accentColor: 'text-cyan-400', visualType: 'contract', features: [{ ar: 'نماذج جاهزة للتخصيص', en: 'Customizable Templates' }] },
  { id: 8, durationSec: 8, titleAr: '8. بوابة التفاوض الرقمية وحسم البنود', titleEn: '8. Digital Negotiation Portal & Online Redlines', scriptAr: MULTILINGUAL_SCRIPTS[8].ar, scriptEn: MULTILINGUAL_SCRIPTS[8].en, icon: Handshake, bgGradient: 'from-purple-950 via-slate-900 to-indigo-950', accentColor: 'text-purple-400', visualType: 'network', features: [{ ar: 'حسم البنود أونلاين في الوقت الفعلي', en: 'Real-time Online Redlines' }] },
  { id: 9, durationSec: 9, titleAr: '9. فاحص صفقات الاندماج والاستحواذ M&A', titleEn: '9. M&A Due Diligence & Financial Audit', scriptAr: MULTILINGUAL_SCRIPTS[9].ar, scriptEn: MULTILINGUAL_SCRIPTS[9].en, icon: Search, bgGradient: 'from-slate-900 via-red-950/30 to-slate-900', accentColor: 'text-red-400', visualType: 'search', features: [{ ar: 'تدقيق صفقات الاستحواذ والتقييم', en: 'M&A Acquisition Audit' }] },
  { id: 10, durationSec: 8, titleAr: '10. سوق الرعايات والتحويل البنكي المباشر SWIFT', titleEn: '10. Sponsorships & Direct SWIFT Wire Remittance', scriptAr: MULTILINGUAL_SCRIPTS[10].ar, scriptEn: MULTILINGUAL_SCRIPTS[10].en, icon: DollarSign, bgGradient: 'from-amber-950/30 via-slate-900 to-slate-900', accentColor: 'text-amber-400', visualType: 'sparkle', features: [{ ar: 'تحويلات SWIFT وفواتير رسمية', en: 'SWIFT Wire & Pro-Forma Invoice' }] },
  { id: 11, durationSec: 8, titleAr: '11. رادار العملاء والفرص التجارية B2B', titleEn: '11. B2B Commercial Lead Radar', scriptAr: MULTILINGUAL_SCRIPTS[11].ar, scriptEn: MULTILINGUAL_SCRIPTS[11].en, icon: Users, bgGradient: 'from-slate-900 via-teal-950/30 to-slate-900', accentColor: 'text-teal-400', visualType: 'network', features: [{ ar: 'رصد الفرص التجارية الاستباقية', en: 'Commercial Lead Tracker' }] },
  { id: 12, durationSec: 8, titleAr: '12. مركز الفيديو التفاعلي الناطق بـ 7 لغات', titleEn: '12. Interactive Talking Video Hub (7 Languages)', scriptAr: MULTILINGUAL_SCRIPTS[12].ar, scriptEn: MULTILINGUAL_SCRIPTS[12].en, icon: Sparkles, bgGradient: 'from-cyan-950 via-indigo-950 to-slate-900', accentColor: 'text-cyan-400', visualType: 'sparkle', features: [{ ar: 'دليل ناطق بـ 7 لغات عالمية', en: '7-Lang AI Voice Guide' }] },
  { id: 13, durationSec: 9, titleAr: '13. تأسيس الشركات ذات المسؤولية المحدودة (Jordan CCD, KSA, UAE, Egypt)', titleEn: '13. LLC Business Incorporation (Jordan CCD, KSA, UAE, Egypt, US)', scriptAr: MULTILINGUAL_SCRIPTS[13].ar, scriptEn: MULTILINGUAL_SCRIPTS[13].en, icon: Globe, bgGradient: 'from-purple-950 via-slate-900 to-indigo-950', accentColor: 'text-purple-400', visualType: 'incorporation', features: [{ ar: 'تأسيس شركات وسجل تجاري وترخيص', en: 'LLC Statutory Registration & License' }] },
  { id: 14, durationSec: 8, titleAr: '14. التسويق الرقمي القانوني والحضور الإلكتروني', titleEn: '14. Legal Digital Marketing & Automation', scriptAr: MULTILINGUAL_SCRIPTS[14].ar, scriptEn: MULTILINGUAL_SCRIPTS[14].en, icon: Share, bgGradient: 'from-indigo-950 via-slate-900 to-cyan-950', accentColor: 'text-indigo-400', visualType: 'sync', features: [{ ar: 'أتمتة الحضور الرقمي للمكاتب', en: 'Law Firm Digital Presence' }] },
  { id: 15, durationSec: 8, titleAr: '15. التقارير التنفيذية والاشتراك الشامل', titleEn: '15. Executive Board Reports & Full Platform Access', scriptAr: MULTILINGUAL_SCRIPTS[15].ar, scriptEn: MULTILINGUAL_SCRIPTS[15].en, icon: Award, bgGradient: 'from-cyan-950 via-indigo-950 to-slate-900', accentColor: 'text-amber-400', visualType: 'sparkle', features: [{ ar: 'وصول شامل لجميع خدمات المنصة', en: 'Full Access to All 15 Services' }] },
];

const LANG_LABELS: Record<string, { label: string; nativeName: string }> = {
  ar: { label: 'AR', nativeName: 'العربية' },
  en: { label: 'EN', nativeName: 'English' },
  fr: { label: 'FR', nativeName: 'Français' },
  de: { label: 'DE', nativeName: 'Deutsch' },
  es: { label: 'ES', nativeName: 'Español' },
  zh: { label: 'ZH', nativeName: '中文' },
  tr: { label: 'TR', nativeName: 'Türkçe' },
};

export default function VideoHubPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'ar');
  const [showCTA, setShowCTA] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>(undefined);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const scene = SCENES[currentScene];

  // Trigger AI Voice Narration when playing or scene/language changes
  useEffect(() => {
    if (!isPlaying || muted) {
      aiVoiceSynthesizer.stop();
      setIsSpeaking(false);
      return;
    }

    const narrationText =
      MULTILINGUAL_SCRIPTS[scene.id]?.[selectedLang] ||
      (isRtl ? scene.scriptAr : scene.scriptEn);

    aiVoiceSynthesizer.speak({
      lang: selectedLang,
      text: narrationText,
      rate: playbackSpeed,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    return () => {
      aiVoiceSynthesizer.stop();
    };
  }, [isPlaying, currentScene, selectedLang, muted, playbackSpeed, isRtl, scene]);

  // Handle player playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const totalMs = scene.durationSec * 1000;
    const tickMs = 100;
    let elapsed = (progress / 100) * totalMs;

    intervalRef.current = setInterval(() => {
      elapsed += tickMs * playbackSpeed;
      const newProgress = Math.min(100, (elapsed / totalMs) * 100);
      setProgress(newProgress);

      if (elapsed >= totalMs) {
        if (currentScene < SCENES.length - 1) {
          setCurrentScene((c) => c + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
          setProgress(100);
          setShowCTA(true);
          aiVoiceSynthesizer.stop();
          setIsSpeaking(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentScene, scene.durationSec, playbackSpeed]);

  function handleStartAudioAndPlay() {
    aiVoiceSynthesizer.unlockAudio();
    setAudioUnlocked(true);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }

  function goToScene(idx: number) {
    aiVoiceSynthesizer.unlockAudio();
    setCurrentScene(idx);
    setProgress(0);
  }

  function handlePlayPause() {
    aiVoiceSynthesizer.unlockAudio();
    setAudioUnlocked(true);
    setIsPlaying((p) => !p);
  }

  function toggleMute() {
    const nextMute = !muted;
    setMuted(nextMute);
    aiVoiceSynthesizer.setMuted(nextMute);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  function handleShare() {
    const url = new URL(window.location.href);
    url.searchParams.set('scene', (currentScene + 1).toString());
    navigator.clipboard.writeText(url.toString());
    alert(isRtl ? 'تم نسخ الرابط!' : 'Link copied to clipboard!');
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest mb-2">
              <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              {isRtl ? 'مركز الفيديو الناطق لـ 15 خدمة قانونية' : 'Interactive Video Hub — All 15 Platform Services'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isRtl ? 'الدليل التدريبي التفاعلي الناطق بالذكاء الاصطناعي' : 'AI-Powered Interactive Talking Video Guide'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isRtl
                ? `${SCENES.length} مشاهد أنيميشن ورسوم توضيحية • تعليق صوتي بـ 7 لغات`
                : `${SCENES.length} Animated HD scenes with UI Mockups • Live AI Voice in 7 languages`}
            </p>
          </div>

          {/* Multilingual Voice Switcher Ribbon */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.entries(LANG_LABELS).map(([code, { label, nativeName }]) => (
              <button
                key={code}
                onClick={() => {
                  setSelectedLang(code);
                  i18n.changeLanguage(code);
                  aiVoiceSynthesizer.unlockAudio();
                }}
                title={nativeName}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  selectedLang === code
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-900 dark:text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:text-white hover:border-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Interactive HD Animated Video Player Container (Sole Official Video) */}
        <div
          ref={playerRef}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${scene.bgGradient} border border-slate-700/60 shadow-2xl aspect-video flex flex-col mb-8`}
        >
          {/* Animated Video Canvas & Visual UI Mockup Picture Component */}
          <AnimatedScene scene={scene} isActive={true} isRtl={isRtl} language={selectedLang} />

          {/* Typewriter Subtitle Sync Overlay */}
          <VideoLanguageSync
            scenes={SCENES}
            currentScene={currentScene}
            currentProgress={progress}
            language={selectedLang}
            isRtl={isRtl}
            isSpeaking={isSpeaking}
          />

          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-700/50 backdrop-blur-md">
              {isRtl ? `الخدمة ${currentScene + 1} من ${SCENES.length}` : `Service ${currentScene + 1} of ${SCENES.length}`}
            </span>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Playback speed menu */}
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-slate-950/80 text-cyan-400 border border-slate-700/50 rounded-xl text-xs font-mono px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1.0x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2.0x</option>
              </select>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-950/80 border border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-all"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-12 left-0 right-0 h-1.5 bg-slate-800/80 z-30">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Player Bottom Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl px-5 py-2.5 flex items-center justify-between gap-4 z-30 border-t border-slate-800/80">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToScene(Math.max(0, currentScene - 1))}
                disabled={currentScene === 0}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white disabled:opacity-30 transition-all"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 text-slate-900 dark:text-white transition-all shadow-lg shadow-cyan-500/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={() => goToScene(Math.min(SCENES.length - 1, currentScene + 1))}
                disabled={currentScene === SCENES.length - 1}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white disabled:opacity-30 transition-all"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Voice Mute Toggle */}
              <button
                onClick={toggleMute}
                className={`p-2 rounded-xl border transition-all ${
                  muted
                    ? 'text-red-400 bg-red-500/10 border-red-500/20'
                    : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                }`}
                title={muted ? 'Unmute AI Voice' : 'Mute AI Voice'}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Current Scene Title & Status */}
            <div className="text-xs text-slate-700 dark:text-slate-300 font-mono hidden sm:flex items-center gap-2">
              <span className="font-bold">{isRtl ? scene.titleAr : scene.titleEn}</span>
              <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400">•</span>
              <span className="text-cyan-400 font-bold">{scene.durationSec}s</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scene Selector Thumbnails (All 15 Platform Services) */}
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-15 gap-1.5">
          {SCENES.map((s, idx) => {
            const SIcon = s.icon;
            const active = idx === currentScene;
            return (
              <button
                key={s.id}
                onClick={() => goToScene(idx)}
                className={`p-2 rounded-2xl border transition-all text-center flex flex-col items-center gap-1 ${
                  active
                    ? 'bg-white dark:bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-105'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <SIcon className={`w-4 h-4 ${active ? s.accentColor : 'text-slate-500 dark:text-slate-400 dark:text-slate-400'}`} />
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* CTA Banner after completion */}
        {showCTA && (
          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-cyan-500/5 to-slate-900 border border-indigo-500/20 text-center space-y-4">
            <Award className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isRtl ? '🎉 لقد أكملت الاستعراض الناطق لجميع خدمات المنصة الـ 15!' : '🎉 You completed the talking guide for all 15 platform services!'}
            </h3>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/payment"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-900 dark:text-white font-black text-sm shadow-lg shadow-cyan-500/20"
              >
                {isRtl ? 'اشترك الآن للوصول الكامل' : 'Subscribe Now for Full Access'}
              </a>
              <button
                onClick={() => {
                  setCurrentScene(0);
                  setProgress(0);
                  setShowCTA(false);
                  setIsPlaying(true);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                {isRtl ? 'إعادة العرض' : 'Replay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
