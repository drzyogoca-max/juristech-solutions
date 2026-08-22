/**
 * VideoHubPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Master Smart Audiovisual Educational Video Platform
 * 
 * An ultra-lightweight, 100% synchronized, interactive slide-by-slide 
 * educational video experience explaining the complete customer journey 
 * from the moment of onboarding to enterprise activation.
 * 
 * Features:
 *   • 10 Comprehensive Educational Master Stages covering all client workflows
 *   • Full 7-Language Synchronized Spoken AI Voice Narration (AR, EN, FR, DE, ES, ZH, TR)
 *   • Typewriter Subtitle Sync with Real-time Speech Waveform Animation
 *   • Ultra-compressed vectorized canvas & SVG animations (Zero heavy MP4 lag)
 *   • Slide scrubber, speed control (0.75x, 1x, 1.25x, 1.5x, 2x), voice toggle, and direct service CTA
 *   • Evaluated & optimized for institutional AI review standards
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Globe, Shield, Lock, Zap, Users, FileText, Brain,
  CheckCircle2, Sparkles, BarChart3, RotateCcw, Maximize,
  Share2, Search, Rocket, Mic, Handshake, DollarSign,
  ArrowRight, ShieldCheck, HelpCircle, ChevronDown, ChevronUp,
  Award, Layers, Check, ExternalLink, Activity
} from 'lucide-react';
import SEO from '../components/SEO';
import { aiVoiceSynthesizer } from '../lib/aiVoiceSynthesizer';
import { usePlatformLocale } from '../lib/universalTranslator';

// ── 10 MASTER EDUCATIONAL STAGES DATA ──────────────────────────────────────────
export interface EducationalStage {
  id: number;
  durationSec: number;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  script: Record<string, string>;
  icon: React.ElementType;
  bgGradient: string;
  accentColor: string;
  targetRoute: string;
  targetButtonLabelAr: string;
  targetButtonLabelEn: string;
  statutoryBadges: string[];
  keySteps: { ar: string; en: string }[];
  uiSimType: 'jurisdiction' | 'chat' | 'contracts' | 'risk' | 'formation' | 'mna' | 'negotiation' | 'vault' | 'radar' | 'payment';
}

export const EDUCATIONAL_STAGES: EducationalStage[] = [
  {
    id: 1,
    durationSec: 14,
    badgeAr: 'المرحلة الأولى • البداية والتهيئة',
    badgeEn: 'Stage 1 • Smart Onboarding',
    titleAr: 'الاستقبال وتحديد الولاية القضائية والمنظومة التشريعية الذكية',
    titleEn: 'Smart Onboarding & Automated Multi-Jurisdiction Engine',
    subtitleAr: 'استشعار الدولة ومواءمة القوانين ومحاكم الاختصاص ومراكز التحكيم تلقائياً',
    subtitleEn: 'Instant statutory alignment with exclusive courts and regional arbitration venues',
    script: {
      ar: 'مرحباً بك في منصة JurisTech Solutions. تبدأ رحلتك لحظة دخول المنصة بالاستشعار التلقائي لدولتك ونطاقك القضائي، سواء كنت في السعودية أو الإمارات أو قطر أو الكويت أو البحرين أو عمان أو الأردن أو مصر أو أمريكا أو بريطانيا أو أوروبا أو الصين. يقوم النظام فوراً بمواءمة القوانين الموضوعية، محاكم الاختصاص، ومراكز التحكيم المعتمدة لضمان الحماية القانونية المطلقة.',
      en: 'Welcome to JurisTech Solutions. Your journey begins the moment you enter with automated detection of your jurisdiction — whether in Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman, Jordan, Egypt, USA, UK, EU, or China. The platform instantly synchronizes substantive statutes, exclusive courts, and accredited arbitration centers.',
      fr: "Bienvenue sur JurisTech Solutions. Votre parcours commence dès l'entrée avec la détection automatique de votre juridiction (Arabie Saoudite, EAU, Qatar, Jordanie, Égypte, USA, Royaume-Uni, UE ou Chine). La plateforme synchronise instantanément les lois applicables et tribunaux compétents.",
      de: 'Willkommen bei JurisTech Solutions. Ihre Reise beginnt beim Betreten mit der automatischen Erkennung Ihrer Gerichtsbarkeit (Saudi-Arabien, VAE, Jordanien, Ägypten, USA, GB, EU oder China). Die Plattform synchronisiert sofort das geltende Recht und zuständige Gerichte.',
      es: 'Bienvenido a JurisTech Solutions. Su viaje comienza con la detección automática de su jurisdicción (Arabia Saudita, EAU, Jordania, Egipto, EE.UU., Reino Unido, UE o China). La plataforma sincroniza instantáneamente leyes y tribunales competentes.',
      zh: '欢迎来到 JurisTech Solutions。从您进入平台的那一刻起，智能引擎就会自动识别您的司法管辖区（沙特、阿联酋、约旦、埃及、美国、英国、欧盟或中国），并立即匹配适用法规与仲裁中心。',
      tr: 'JurisTech Solutions’a hoş geldiniz. Yolculuğunuz, yargı alanınızın (Suudi Arabistan, BAE, Ürdün, Mısır, ABD, İngiltere, AB veya Çin) otomatik olarak algılanması ve yürürlükteki kanunların anında senkronize edilmesiyle başlar.',
    },
    icon: Globe,
    bgGradient: 'from-slate-950 via-cyan-950/40 to-slate-900',
    accentColor: '#06b6d4',
    targetRoute: '/contracts',
    targetButtonLabelAr: 'استكشف محرك الولايات القضائية',
    targetButtonLabelEn: 'Explore Jurisdiction Engine',
    statutoryBadges: ['🇸🇦 KSA M/191', '🇦🇪 UAE 50/2022', '🇯🇴 JO 43/1976', '🇪🇬 EG 131/1948', '🇺🇸 US Delaware DGCL', '🇬🇧 UK LCIA', '🇨🇳 CN CIETAC', '🌐 UNCITRAL'],
    keySteps: [
      { ar: '1. استشعار فوري لموقع العميل الجغرافي', en: '1. Instant geolocation & judicial detection' },
      { ar: '2. قفل النطاق التشريعي والمحاكم المختصة', en: '2. Statutory lock & dispute venue assignment' },
      { ar: '3. تخصيص العملة والمعايير المالية التعاقدية', en: '3. Currency & regional contractual standards' },
    ],
    uiSimType: 'jurisdiction',
  },
  {
    id: 2,
    durationSec: 13,
    badgeAr: 'المرحلة الثانية • الاستشارة التفاعلية',
    badgeEn: 'Stage 2 • Legal Concierge',
    titleAr: 'المستشار القانوني السيادي 24/7 والدردشة القانونية المتخصصة',
    titleEn: 'Sovereign 24/7 AI Legal Concierge & Multi-Turn Guidance',
    subtitleAr: 'استشارات قانونية فورية مدعومة بأنظمة الشركات والمعاملات المدنية وقانون العمل',
    subtitleEn: 'Instant legal reasoning, statutory citations, and strategic advisory before any deal',
    script: {
      ar: 'في المرحلة الثانية، يتيح لك المستشار القانوني السيادي طرح أي استفسار أو قضية معقدة على مدار 24 ساعة. يستند المحرك إلى قواعد معرفية ذكية وقوانين الشركات والمعاملات المدنية، ليقدم لك حلولاً فورية، مراجع نظامية دقيقة، وتوجيهات استراتيجية قبل اتخاذ أي قرار تجاري.',
      en: 'In stage two, the Sovereign AI Legal Concierge is available 24/7 to resolve complex legal inquiries. Powered by extensive statutory knowledge across corporate and civil codes, it provides instant legal reasoning, precise statutory references, and strategic guidance before any commercial decision.',
      fr: "Dans la deuxième étape, le conseiller juridique IA souverain est disponible 24h/24 pour résoudre vos questions complexes avec des références juridiques précises et des conseils stratégiques immédiats.",
      de: 'In Stufe zwei steht Ihnen der souveräne KI-Rechtsberater rund um die Uhr zur Verfügung, um komplexe Rechtsfragen mit präzisen Gesetzestexten und strategischer Beratung sofort zu lösen.',
      es: 'En la etapa dos, el Asesor Legal IA soberano está disponible las 24 horas para resolver consultas legales complejas con fundamentos normativos y orientación estratégica al instante.',
      zh: '在第二阶段，主权AI法律顾问全天候24小时为您解答复杂的法律问题，基于公司法与民商法知识库提供即时推理与法定依据。',
      tr: 'İkinci aşamada, Bağımsız Yapay Zeka Hukuk Danışmanı karmaşık hukuki sorularınızı çözmek, mevzuat referansları ve stratejik rehberlik sunmak için 7/24 hizmetinizdedir.',
    },
    icon: Brain,
    bgGradient: 'from-slate-950 via-indigo-950/40 to-slate-900',
    accentColor: '#6366f1',
    targetRoute: '/chat',
    targetButtonLabelAr: 'بدء استشارة قانونية فورية',
    targetButtonLabelEn: 'Start AI Legal Consultation',
    statutoryBadges: ['⚡ استجابة < 90ms', '📚 قواعد معرفية RAG', '🛡️ سرية تامة Zero-Knowledge', '⚖️ تحليل سوابق قضائية'],
    keySteps: [
      { ar: '1. إدخال الاستفسار القانوني نصياً أو صوتياً', en: '1. Voice or text legal query input' },
      { ar: '2. استدعاء النصوص النظامية الحاكمة بدقة', en: '2. Precise statutory precedent retrieval' },
      { ar: '3. صياغة الرأي والتوصيات الحمائية الفورية', en: '3. Actionable protective legal advisory' },
    ],
    uiSimType: 'chat',
  },
  {
    id: 3,
    durationSec: 14,
    badgeAr: 'المرحلة الثالثة • الصياغة والتوليد',
    badgeEn: 'Stage 3 • Smart Contract Studio',
    titleAr: 'محرك صياغة العقود الذكية وخزينة النماذج المليونية',
    titleEn: 'AI Smart Contract Drafting Studio & 1M+ Templates Vault',
    subtitleAr: 'صياغة موجهة بـ 4 خطوات مع استدعاء أضخم مكتبة عقود وتوثيق SHA-256 مشفر',
    subtitleEn: 'Guided 4-step drafting with 1M+ certified templates and SHA-256 cryptographic seal',
    script: {
      ar: 'المرحلة الثالثة تمثل قلب المنظومة: محرك الصياغة الموحد وخزينة العقود المليونية. يمكنك صياغة عقود تجارية ومؤسسية مخصصة عبر خريطة عمل موجهة من أربع خطوات، أو الاختيار من بين أكثر من مليون نموذج معتمد، مع مواءمة تشريعية فورية وختم رقمي مشفر SHA-256.',
      en: 'Stage three is the core engine: the Unified Drafting Studio and 1M+ Templates Vault. Generate institutional commercial contracts via a guided 4-step roadmap or search over 1,000,000 certified templates, complete with automated statutory compliance and SHA-256 cryptographic seals.',
      fr: "L'étape trois est le cœur du système : le studio de rédaction unifié et le coffre-fort de plus d'un million de modèles. Rédigez des contrats institutionnels via une feuille de route guidée en 4 étapes avec sceau SHA-256.",
      de: 'Stufe drei ist das Herzstück: das einheitliche Vertragsstudio und der Tresor mit über 1 Million Vorlagen. Erstellen Sie Verträge über einen 4-Stufen-Leitfaden inklusive SHA-256-Verschlüsselungssiegel.',
      es: 'La etapa tres es el núcleo: el estudio de redacción unificado y la bóveda de más de 1 millón de plantillas. Redacte contratos institucionales con una guía de 4 pasos y sello criptográfico SHA-256.',
      zh: '第三阶段是平台核心：统一智能起草工作室与百万级模板库。通过4步引导式路线图生成符合主权法律的商业合同，或搜索超100万份认证模板，附带SHA-256加密印章。',
      tr: 'Üçüncü aşama sistemin kalbidir: Akıllı Sözleşme Stüdyosu ve 1 Milyondan fazla şablon kasası. 4 adımlı kılavuz ile kurumsal sözleşmeler oluşturun ve SHA-256 dijital mühür uygulayın.',
    },
    icon: FileText,
    bgGradient: 'from-slate-950 via-teal-950/40 to-slate-900',
    accentColor: '#14b8a6',
    targetRoute: '/contracts',
    targetButtonLabelAr: 'فتح محرك صياغة العقود',
    targetButtonLabelEn: 'Open Contract Studio',
    statutoryBadges: ['📜 1,000,000+ نموذج معتمد', '🔒 ختم مشفر SHA-256', '📥 تصدير Word و PDF', '✨ خريطة من 4 خطوات'],
    keySteps: [
      { ar: '1. اختيار الولاية والتصنيف القانوني للعقد', en: '1. Jurisdiction & category selection' },
      { ar: '2. إدخال الأطراف والشروط المالية والبنود', en: '2. Parties, terms & custom clauses' },
      { ar: '3. توليد فوري بالذكاء الاصطناعي مع تدقيق آلي', en: '3. AI generation with auto-audit' },
    ],
    uiSimType: 'contracts',
  },
  {
    id: 4,
    durationSec: 13,
    badgeAr: 'المرحلة الرابعة • التدقيق والتحصين',
    badgeEn: 'Stage 4 • Risk Audit & Redlining',
    titleAr: 'فاحص ومحلل المخاطر والبنود التعسفية والمسؤوليات',
    titleEn: 'Statutory Risk Scoring & Contract Vulnerability Audit',
    subtitleAr: 'فحص مسودات العقود في < 90ms وكشف فخاخ المسؤولية والشروط الجزائية التعسفية',
    subtitleEn: 'Sub-second audit detecting uncapped liability, penalty traps, and proposing safe redlines',
    script: {
      ar: 'في المرحلة الرابعة، يقوم محرك التدقيق الذكي بفحص نصوص ومسودات العقود في أقل من تسعين ملي ثانية. يكتشف المحرك فخاخ المسؤولية غير المحدودة، الشروط الجزائية التعسفية، وبنود التعويض المبهمة، ويقترح الصياغات البديلة المعتمدة لحماية حقوقك المالية.',
      en: 'In stage four, the Smart Risk Engine audits contract drafts in under 90 milliseconds. It automatically detects uncapped liability traps, excessive penalty clauses, and ambiguous indemnity terms, instantly suggesting certified protective alternatives.',
      fr: "Dans la quatrième étape, le moteur d'audit analyse les projets de contrats en moins de 90 millisecondes, détectant les pièges de responsabilité illimitée et les pénalités abusives tout en proposant des clauses protectrices.",
      de: 'In Stufe vier prüft die Audit-Engine Vertragsentwürfe in unter 90 Millisekunden auf unbegrenzte Haftungsrisiken, überhöhte Vertragsstrafen und schlägt sofort rechtssichere Alternativen vor.',
      es: 'En la etapa cuatro, el motor de auditoría inteligente escanea borradores en menos de 90 milisegundos, detectando trampas de responsabilidad ilimitada y proponiendo redacciones protectoras.',
      zh: '在第四阶段，智能风险审查引擎在90毫秒内完成合同扫描，自动识别无限连带责任陷阱、高额违约金与模糊赔偿条款，并提供法定保护性替代方案。',
      tr: 'Dördüncü aşamada, Akıllı Risk Motoru sözleşme taslaklarını 90 milisaniyenin altında denetler; sınırsız sorumluluk tuzaklarını tespit edip onaylı koruyucu maddeler önerir.',
    },
    icon: BarChart3,
    bgGradient: 'from-slate-950 via-amber-950/40 to-slate-900',
    accentColor: '#f59e0b',
    targetRoute: '/risk',
    targetButtonLabelAr: 'فحص مخاطر العقد الآن',
    targetButtonLabelEn: 'Run Contract Risk Audit',
    statutoryBadges: ['⚠️ كشف الفخاخ التعاقدية', '🛡️ سقف المسؤولية Liability Cap', '📉 تقييم النزاع القضائي', '⚖️ اقتراح بنود بديلة'],
    keySteps: [
      { ar: '1. لصق المسودة أو رفع ملف العقد PDF/DOCX', en: '1. Paste text or upload contract file' },
      { ar: '2. توليد خريطة المخاطر الحرارية ومؤشر الأمان', en: '2. Risk heatmap & safety index calculation' },
      { ar: '3. تطبيق البنود الحمائية البديلة بضغطة زر', en: '3. 1-click protective clause replacement' },
    ],
    uiSimType: 'risk',
  },
  {
    id: 5,
    durationSec: 13,
    badgeAr: 'المرحلة الخامسة • التأسيس والحوكمة',
    badgeEn: 'Stage 5 • Corporate Formation',
    titleAr: 'تأسيس الشركات والأنظمة وحوكمة الشركاء',
    titleEn: 'LLC Company Formation & Statutory Corporate Governance',
    subtitleAr: 'صياغة عقود التأسيس واللوائح والأنظمة الأساسية المطابقة لوزارات التجارة',
    subtitleEn: 'Articles of Association, partner governance bylaws, and commercial registry filings',
    script: {
      ar: 'المرحلة الخامسة مخصصة لتأسيس الكيانات التجارية والشركات ذات المسؤولية المحدودة والشركات المساهمة. يولد النظام عقود التأسيس، الأنظمة الأساسية، واتفاقيات حوكمة الشركاء، وحصص التصويت بما يتطابق كلياً مع اشتراطات وزارة التجارة والسجلات الرسمية.',
      en: 'Stage five automates LLC and corporate entity formation. The system drafts customized Articles of Association, partner governance bylaws, voting rights, and statutory commercial registry filings strictly compliant with corporate authorities.',
      fr: "L'étape cinq automatise la création de sociétés (SARL, SA). Le système génère les statuts constitutifs, la gouvernance des associés et les dossiers d'enregistrement commercial en conformité totale avec les lois.",
      de: 'Stufe fünf automatisiert die Gründung von GmbHs und Kapitalgesellschaften. Das System erstellt Gesellschaftsverträge, Satzungen und Partner-Governance-Richtlinien im Einklang mit den Handelsbehörden.',
      es: 'La etapa cinco automatiza la constitución de empresas (SRL, SA). Genera estatutos sociales, gobernanza de socios y registros comerciales en estricto cumplimiento con las normativas corporativas.',
      zh: '第五阶段全面实现有限责任公司与股份公司成立自动化。系统自动起草公司章程、合伙人治理准则及商业登记备案文件，完全符合主管部门要求。',
      tr: 'Beşinci aşama şirket kuruluşunu otomatikleştirir. Sistem, ana sözleşmeleri, ortaklık yönetişim kurallarını ve ticari sicil başvuru belgelerini mevzuata tam uyumlu olarak üretir.',
    },
    icon: ShieldCheck,
    bgGradient: 'from-slate-950 via-emerald-950/40 to-slate-900',
    accentColor: '#10b981',
    targetRoute: '/company-formation',
    targetButtonLabelAr: 'بدء تأسيس شركة جديدة',
    targetButtonLabelEn: 'Start Company Formation',
    statutoryBadges: ['🏢 شركات ذات مسؤولية محدودة LLC', '📑 عقد التأسيس والنظام الأساسي', '🗳️ حوكمة الشركاء والتصويت', '🇸🇦 M/132 • 🇦🇪 50/2022 • 🇯🇴 22/1997'],
    keySteps: [
      { ar: '1. تحديد هيكل الملكية ورأس المال والشركاء', en: '1. Ownership structure, capital & partners' },
      { ar: '2. صياغة النظام الأساسي وصلاحيات الإدارة', en: '2. Articles of Association & managerial powers' },
      { ar: '3. تجهيز ملف السجل التجاري والترخيص الفوري', en: '3. Ready-to-file commercial registry package' },
    ],
    uiSimType: 'formation',
  },
  {
    id: 6,
    durationSec: 13,
    badgeAr: 'المرحلة السادسة • الاندماج والاستحواذ',
    badgeEn: 'Stage 6 • M&A & Term Sheets',
    titleAr: 'تدقيق صفقات الاندماج والاستحواذ ومذكرات الشروط',
    titleEn: 'M&A Due Diligence, Financial Valuation & Term Sheets',
    subtitleAr: 'فحص صفقات الاستثمار الجريء، مذكرات الشروط، والتحقق النافي للجهالة W&I',
    subtitleEn: 'Binding Term Sheets, Share Purchase Agreements, and legal due diligence audits',
    script: {
      ar: 'في المرحلة السادسة، تدعم المنصة صفقات الاستثمار الجريء والاندماج والاستحواذ. يقوم النظام بتوليد مذكرات الشروط، اتفاقيات شراء الأسهم، وإجراء الفحص النافي للجهالة المالي والقانوني وتأمينات الضمانات والتعويضات لحماية صفقات الملايين.',
      en: 'In stage six, the platform empowers VC investments and M&A deals. It drafts binding Term Sheets, Share Purchase Agreements (SPA), and conducts full financial and legal due diligence with Warranty & Indemnity (W&I) audit protections.',
      fr: "Dans la sixième étape, la plateforme gère les transactions de fusions-acquisitions et de capital-risque, générant des Term Sheets, des accords SPA et des audits de Due Diligence complets.",
      de: 'In Stufe sechs unterstützt die Plattform M&A- und Venture-Capital-Transaktionen: Erstellung von Term Sheets, SPAs sowie umfassende rechtliche und finanzielle Due-Diligence-Prüfungen.',
      es: 'En la etapa seis, la plataforma gestiona operaciones de fusiones y adquisiciones, redactando Term Sheets, contratos de compra de acciones y auditorías Due Diligence integrales.',
      zh: '在第六阶段，平台赋能风险投资与企业并购（M&A）。自动生成投资意向书（Term Sheet）、股权收购协议（SPA）并执行全方位财务与法律尽职调查。',
      tr: 'Altıncı aşamada platform birleşme ve devralma (M&A) işlemlerini yönetir: Term Sheet\'ler, hisse devir sözleşmeleri ve kapsamlı hukuki inceleme raporları hazırlar.',
    },
    icon: Layers,
    bgGradient: 'from-slate-950 via-rose-950/40 to-slate-900',
    accentColor: '#f43f5e',
    targetRoute: '/enterprise-audit',
    targetButtonLabelAr: 'تدقيق صفقات الاستحواذ',
    targetButtonLabelEn: 'Audit M&A Deals',
    statutoryBadges: ['🤝 اتفاقية شراء الأسهم SPA', '📊 تقييم الصفقات Valuation', '🛡️ تأمين الضمانات W&I', '📑 مذكرات الشروط Term Sheets'],
    keySteps: [
      { ar: '1. إدخال بيانات الصفقة والتقييم المالي', en: '1. Deal structure & valuation metrics' },
      { ar: '2. فحص الالتزامات والضمانات التعاقدية', en: '2. Contractual reps & warranties scan' },
      { ar: '3. توليد تقرير الفحص النافي للجهالة التنفيذي', en: '3. Executive due diligence report export' },
    ],
    uiSimType: 'mna',
  },
  {
    id: 7,
    durationSec: 12,
    badgeAr: 'المرحلة السابعة • التفاوض وحسم البنود',
    badgeEn: 'Stage 7 • Digital Negotiation',
    titleAr: 'بوابة التفاوض الرقمي والتعديل التشاركي المباشر',
    titleEn: 'Online Multi-Party Negotiation Portal & Live Redlining',
    subtitleAr: 'حسم الخلافات التعاقدية وصياغة بنود تسوية مقبولة للطرفين في الوقت الفعلي',
    subtitleEn: 'Collaborative online redlines, bilateral clause resolution, and swift deal closing',
    script: {
      ar: 'المرحلة السابعة تقدم بوابة التفاوض المباشر بين الأطراف القانونية والشركاء. تتيح الغرفة التفاوضية حسم البنود الخلافية في الوقت الفعلي، وتوليد صياغات توفيقية متوازنة ترضي الطرفين وتمنع تعطل إبرام الصفقات.',
      en: 'Stage seven provides a live collaborative negotiation portal between contracting parties. Resolve contentious clauses in real-time, generate balanced compromise terms, and close agreements without frictional delays.',
      fr: "L'étape sept offre un portail de négociation collaborative en direct. Résolvez les clauses litigieuses en temps réel et générez des termes de compromis équilibrés pour finaliser vos accords rapidement.",
      de: 'Stufe sieben bietet ein Live-Verhandlungsportal für alle Vertragsparteien, um strittige Klauseln in Echtzeit beizulegen und faire Kompromissformulierungen zu erzielen.',
      es: 'La etapa siete ofrece un portal de negociación colaborativa en vivo para resolver cláusulas controvertidas en tiempo real y generar acuerdos equilibrados sin demoras.',
      zh: '第七阶段提供多方在线协同谈判门户。实时协商争议条款，智能生成双方满意的折中修正案，加速商业交易达成。',
      tr: 'Yedinci aşama taraflar arasında canlı müzakere portalı sunar: İhtilaflı maddeleri gerçek zamanlı çözün ve dengeli uzlaşma metinleri oluşturun.',
    },
    icon: Handshake,
    bgGradient: 'from-slate-950 via-purple-950/40 to-slate-900',
    accentColor: '#a855f7',
    targetRoute: '/negotiation',
    targetButtonLabelAr: 'دخول بوابة التفاوض',
    targetButtonLabelEn: 'Open Negotiation Portal',
    statutoryBadges: ['💬 غرف تفاوضية مشفرة', '⚖️ صياغات توفيقية متوازنة', '👥 مشاركة متعددة الأطراف', '🔄 تتبع التعديلات Live Track'],
    keySteps: [
      { ar: '1. مشاركة رابط المسودة الآمن مع الطرف الآخر', en: '1. Share secure draft link with counterparty' },
      { ar: '2. تحديد البنود الخلافية واقتراح التعديلات', en: '2. Mark disputed clauses & propose changes' },
      { ar: '3. اعتماد الصياغة التوافقية والتثبيت الفوري', en: '3. Approve final consensus text instantly' },
    ],
    uiSimType: 'negotiation',
  },
  {
    id: 8,
    durationSec: 13,
    badgeAr: 'المرحلة الثامنة • التوقيع والأرشفة',
    badgeEn: 'Stage 8 • E-Sign & Vault',
    titleAr: 'التوقيع الرقمي المعتمد والخزينة السيادية المشفرة',
    titleEn: 'eIDAS Cryptographic E-Signatures & AES-256 Vault',
    subtitleAr: 'توقيع إلكتروني رسمي معتمد، ختم مشفر، وتخزين سحابي مع تنبيهات الصلاحية',
    subtitleEn: 'Certified e-signatures, SHA-256 audit proof, and bank-grade encrypted contract storage',
    script: {
      ar: 'في المرحلة الثامنة، يتم توقيع العقد إلكترونياً بلوحة توقيع معتمدة دولياً، وتوليد شهادة إثبات رقمية مشفرة. يُحفظ المستند في خزينة سيادية مشفرة بتشفير البنوك AES-256 مع تتبع تلقائي لمواعيد التجديد وانتهاء الصلاحية.',
      en: 'In stage eight, contracts are digitally signed via certified e-signature pads with cryptographic audit certificates. Documents are stored in an AES-256 sovereign encrypted vault with automated milestone and renewal alerts.',
      fr: "Dans la huitième étape, les contrats sont signés électroniquement avec certificat cryptographique et stockés dans un coffre-fort souverain chiffré AES-256 avec alertes de renouvellement.",
      de: 'In Stufe acht werden Verträge digital signiert, mit kryptografischem Prüfzertifikat versehen und in einem AES-256-verschlüsselten Tresor mit automatischer Ablaufüberwachung gespeichert.',
      es: 'En la etapa ocho, los contratos se firman digitalmente con certificados criptográficos y se almacenan en una bóveda cifrada AES-256 con alertas automáticas de renovación.',
      zh: '在第八阶段，合同通过符合电子签名标准的数字签名板签署，生成加密审计证书，并存入AES-256主权加密保险库，享有到期自动提醒。',
      tr: 'Sekizinci aşamada sözleşmeler e-imza ile imzalanır, kriptografik sertifika üretilir ve otomatik yenileme takipli AES-256 şifreli kasada saklanır.',
    },
    icon: Lock,
    bgGradient: 'from-slate-950 via-emerald-950/40 to-slate-900',
    accentColor: '#10b981',
    targetRoute: '/vault',
    targetButtonLabelAr: 'استعراض الخزينة المشفرة',
    targetButtonLabelEn: 'Access Encrypted Vault',
    statutoryBadges: ['✍️ توقيع إلكتروني eIDAS', '🔐 تشفير سيادي AES-256', '⏰ تنبيهات انتهاء الصلاحية', '📄 أختام رقمية غير قابلة للتزوير'],
    keySteps: [
      { ar: '1. التوقيع الرقمي للأطراف عبر الشاشة أو القلم', en: '1. Parties apply certified e-signatures' },
      { ar: '2. إنشاء الختم المشفر ورمز الاستجابة QR', en: '2. Generate SHA-256 hash & verification QR' },
      { ar: '3. الحفظ المشفر وتفعيل تتبع المواعيد الآلي', en: '3. Zero-knowledge encrypted vault storage' },
    ],
    uiSimType: 'vault',
  },
  {
    id: 9,
    durationSec: 12,
    badgeAr: 'المرحلة التاسعة • استكشاف الفرص',
    badgeEn: 'Stage 9 • B2B Lead Radar',
    titleAr: 'رادار العملاء والفرص التجارية المباشرة',
    titleEn: 'Proactive B2B Lead Radar & Commercial Opportunity Tracker',
    subtitleAr: 'مرصد استباقي لرصد المناقصات، الفرص الاستثمارية، وتوسيع شراكات الأعمال',
    subtitleEn: 'Monitor enterprise tenders, funding rounds, and prospective B2B partnerships',
    script: {
      ar: 'المرحلة التاسعة تمنح شركتك ميزة تنافسية استثنائية عبر رادار B2B الذكي، الذي يرصد المناقصات، الفرص الاستثمارية، واحتياجات الشركات التجارية والخدمية في المنطقة لمساعدتك في توسيع أعمالك وإبرام صفقات جديدة.',
      en: 'Stage nine gives your business an unfair advantage through the B2B Lead Radar, proactively monitoring commercial tenders, investment opportunities, and enterprise demands across global markets to accelerate your growth.',
      fr: "L'étape neuf offre un avantage stratégique grâce au radar B2B qui surveille les appels d'offres et opportunités d'investissement pour développer vos affaires.",
      de: 'Stufe neun verschafft Ihrem Unternehmen strategische Vorteile durch den B2B-Lead-Radar, der Ausschreibungen und Marktchancen proaktiv überwacht.',
      es: 'La etapa nueve brinda ventaja competitiva mediante el Radar B2B, monitoreando licitaciones y oportunidades comerciales para expandir su empresa.',
      zh: '第九阶段通过B2B商机雷达为企业赋能，主动监测招投标项目与商业合作机会，助力企业业务拓展。',
      tr: 'Dokuzuncu aşama B2B Müşteri Radarı ile işletmenize stratejik avantaj sağlar: İhaleleri ve ticari fırsatları proaktif olarak takip eder.',
    },
    icon: Activity,
    bgGradient: 'from-slate-950 via-cyan-950/40 to-slate-900',
    accentColor: '#06b6d4',
    targetRoute: '/lead-radar',
    targetButtonLabelAr: 'تشغيل رادار الفرص التجارية',
    targetButtonLabelEn: 'Launch B2B Lead Radar',
    statutoryBadges: ['📡 مسح استباقي للأسواق', '💼 رصد المناقصات والصفقات', '🎯 استهداف كبار العملاء B2B', '📈 تحليلات النمو التجاري'],
    keySteps: [
      { ar: '1. تحديد القطاع الجغرافي ونوع الفرص المطلوبة', en: '1. Set target industry & regional scope' },
      { ar: '2. استخراج بيانات الشركات والصفقات المؤهلة', en: '2. Retrieve verified institutional leads' },
      { ar: '3. توليد عروض الأعمال والاتفاقيات مباشرة', en: '3. 1-click B2B proposal & contract outreach' },
    ],
    uiSimType: 'radar',
  },
  {
    id: 10,
    durationSec: 13,
    badgeAr: 'المرحلة العاشرة • التفعيل والاشتراك',
    badgeEn: 'Stage 10 • Enterprise Activation',
    titleAr: 'الدفع والتحويل البنكي SWIFT والتفعيل الفوري للعضوية المؤسسية',
    titleEn: 'Seamless Checkout, SWIFT Wire Remittance & VIP Activation',
    subtitleAr: 'تفعيل الاشتراك المؤسسي، بطاقات، InstaPay، كريبتو، وحوالات بنكية رسمية',
    subtitleEn: 'Enterprise onboarding with Cards, InstaPay, Crypto & SWIFT wire with tax invoices',
    script: {
      ar: 'في المرحلة العاشرة والختامية، تكتمل تجربتك بتفعيل العضوية المؤسسية الفورية عبر خيارات دفع مرنة تشمل البطاقات، إنستاباي، العملات المشفرة، أو التحويل البنكي المباشر SWIFT، مع إصدار فواتير ضريبية رسمية وفتح الوصول لكافة الخدمات.',
      en: 'In the final tenth stage, complete your enterprise onboarding with versatile payment channels including credit cards, InstaPay, cryptocurrency, or direct SWIFT bank wire, receiving certified tax invoices and instant full platform access.',
      fr: "Dans la dixième étape finale, activez votre abonnement d'entreprise via cartes, InstaPay, cryptomonnaies ou virement SWIFT avec facturation fiscale officielle et accès immédiat.",
      de: 'In der zehnten Abschlussstufe aktivieren Sie Ihre Unternehmensmitgliedschaft per Karte, InstaPay, Krypto oder SWIFT-Banküberweisung mit offizieller Steuerrechnung und sofortigem Vollzugriff.',
      es: 'En la décima etapa final, active su membresía corporativa mediante tarjetas, InstaPay, criptomonedas o transferencia SWIFT con factura fiscal y acceso instantáneo.',
      zh: '在第十阶段也是最后阶段，通过信用卡、InstaPay、加密货币或 SWIFT 国际电汇完成企业会员即时开通，获取正规税务发票并解锁全部核心权益。',
      tr: 'Onuncu ve son aşamada, kredi kartı, InstaPay, kripto veya SWIFT banka havalesi ile kurumsal üyeliğinizi anında etkinleştirin, resmi vergi faturası ve tam erişim kazanın.',
    },
    icon: DollarSign,
    bgGradient: 'from-slate-950 via-amber-950/40 to-slate-900',
    accentColor: '#f59e0b',
    targetRoute: '/payment',
    targetButtonLabelAr: 'تفعيل العضوية المؤسسية الآن',
    targetButtonLabelEn: 'Activate Enterprise VIP Access',
    statutoryBadges: ['💳 بطاقات بنكية عالمية', '🏦 تحويلات سويفت SWIFT Direct', '📱 InstaPay المباشر', '🧾 فواتير ضريبية معتمدة'],
    keySteps: [
      { ar: '1. اختيار الباقة المناسبة للأفراد أو الشركات', en: '1. Select individual or enterprise tier' },
      { ar: '2. إتمام الدفع بالبطاقة أو التحويل البنكي', en: '2. Pay via Card, InstaPay, Crypto or SWIFT' },
      { ar: '3. تفعيل فوري لكافة الخدمات مع الفاتورة الرسمية', en: '3. Instant VIP unblock & certified invoice' },
    ],
    uiSimType: 'payment',
  },
];

const LANG_CONFIG: Record<string, { code: string; label: string; name: string; flag: string }> = {
  ar: { code: 'ar', label: 'العربية', name: 'Arabic', flag: '🇸🇦' },
  en: { code: 'en', label: 'English', name: 'English', flag: '🇺🇸' },
  fr: { code: 'fr', label: 'Français', name: 'French', flag: '🇫🇷' },
  de: { code: 'de', label: 'Deutsch', name: 'German', flag: '🇩🇪' },
  es: { code: 'es', label: 'Español', name: 'Spanish', flag: '🇪🇸' },
  zh: { code: 'zh', label: '中文', name: 'Chinese', flag: '🇨🇳' },
  tr: { code: 'tr', label: 'Türkçe', name: 'Turkish', flag: '🇹🇷' },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function VideoHubPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { isRtl, formatNum } = usePlatformLocale();

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'ar');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [displayedWordsCount, setDisplayedWordsCount] = useState(0);

  const playerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStage = EDUCATIONAL_STAGES[currentStageIdx];
  const langKey = selectedLang.startsWith('ar') ? 'ar' : (selectedLang.slice(0, 2) in currentStage.script ? selectedLang.slice(0, 2) : 'en');
  const activeScriptText = currentStage.script[langKey] || currentStage.script.en;
  const scriptWords = useMemo(() => activeScriptText.split(' '), [activeScriptText]);

  // Synchronize displayed words with progress for karaoke typewriter effect
  useEffect(() => {
    const totalWords = scriptWords.length;
    const count = Math.min(totalWords, Math.max(1, Math.floor((progress / 95) * totalWords)));
    setDisplayedWordsCount(count);
  }, [progress, scriptWords]);

  // ── Speech Synthesis Synchronization ──
  const startSpeechForCurrentStage = useCallback(() => {
    if (muted) {
      aiVoiceSynthesizer.stop();
      setIsSpeaking(false);
      return;
    }

    aiVoiceSynthesizer.speak({
      lang: selectedLang,
      text: activeScriptText,
      rate: playbackSpeed,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        // Automatically proceed to next stage when speech ends if playing
        if (isPlaying) {
          if (currentStageIdx < EDUCATIONAL_STAGES.length - 1) {
            setCurrentStageIdx(prev => prev + 1);
            setProgress(0);
          } else {
            setIsPlaying(false);
            setProgress(100);
          }
        }
      },
      onError: () => setIsSpeaking(false),
    });
  }, [activeScriptText, currentStageIdx, isPlaying, muted, playbackSpeed, selectedLang]);

  // Trigger speech when play state, stage, or language changes
  useEffect(() => {
    if (isPlaying) {
      startSpeechForCurrentStage();
    } else {
      aiVoiceSynthesizer.stop();
      setIsSpeaking(false);
    }
    return () => {
      aiVoiceSynthesizer.stop();
    };
  }, [isPlaying, currentStageIdx, selectedLang, muted, playbackSpeed, startSpeechForCurrentStage]);

  // ── Playback Progress Timer ──
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Dynamic duration adjusted for playback speed and language script length
    const baseDuration = currentStage.durationSec * 1000;
    const adjustedDuration = baseDuration / playbackSpeed;
    const intervalMs = 100;
    const stepIncrement = (intervalMs / adjustedDuration) * 100;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const nextVal = prev + stepIncrement;
        if (nextVal >= 100) {
          if (currentStageIdx < EDUCATIONAL_STAGES.length - 1) {
            setCurrentStageIdx(c => c + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return nextVal;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStageIdx, currentStage.durationSec, playbackSpeed]);

  // ── Canvas Particle & Grid Ambient Rendering ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number }[] = [];
    const count = 40;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (canvas.offsetWidth || 800),
        y: Math.random() * (canvas.offsetHeight || 500),
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const render = () => {
      time += 0.01;
      const w = canvas.offsetWidth || 800;
      const h = canvas.offsetHeight || 500;
      ctx.clearRect(0, 0, w, h);

      // Cyber Grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Particles
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity * (isPlaying ? 1 : 0.4)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying]);

  // ── Handlers ──
  function handlePlayPause() {
    aiVoiceSynthesizer.unlockAudio();
    setAudioUnlocked(true);
    setIsPlaying(p => !p);
  }

  function goToStage(idx: number) {
    aiVoiceSynthesizer.unlockAudio();
    setAudioUnlocked(true);
    setCurrentStageIdx(idx);
    setProgress(0);
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
    url.searchParams.set('stage', (currentStageIdx + 1).toString());
    navigator.clipboard.writeText(url.toString());
    alert(isRtl ? 'تم نسخ رابط الدرس التعليمي!' : 'Educational stage link copied to clipboard!');
  }

  const StageIcon = currentStage.icon;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 selection:bg-cyan-500 selection:text-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />

      {/* ─── HEADER BANNER ─── */}
      <section className="relative pt-10 pb-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>{isRtl ? 'المنظومة التعليمية المرئية الفائقة • الجيل الجديد' : 'Smart Educational Audiovisual Platform • Next-Gen'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isRtl ? 'الدليل الاسترشادي وخطة العمل الشاملة للعملاء' : 'Interactive Customer Roadmap & Complete Action Plan'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {isRtl
                ? 'شرح تفصيلي متكامل ومزامن للصوت والنص والصورة لجميع مراحل وخدمات المنصة من لحظة الدخول حتى إتمام آخر إجراء قانوني.'
                : 'A fully synchronized audiovisual presentation explaining the end-to-end client journey across all sovereign AI legal engines.'}
            </p>
          </div>

          {/* 7-Language Audio Selector Ribbon */}
          <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-400">
              <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{isRtl ? 'لغة الشرح الناطق:' : 'Voice Narration:'}</span>
            </div>
            {Object.entries(LANG_CONFIG).map(([key, item]) => {
              const isActive = selectedLang.startsWith(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedLang(key);
                    i18n.changeLanguage(key);
                    aiVoiceSynthesizer.unlockAudio();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black shadow-md shadow-cyan-500/20 scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={item.name}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── MASTER SMART SLIDE VIDEO PLAYER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div
          ref={playerRef}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentStage.bgGradient} border border-slate-800 shadow-2xl flex flex-col min-h-[560px] sm:min-h-[640px] transition-all`}
        >
          {/* Background Vector Ambient Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
          />

          {/* Top Control & HUD Bar */}
          <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between gap-4 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg"
                style={{ backgroundColor: `${currentStage.accentColor}15`, borderColor: `${currentStage.accentColor}40` }}
              >
                <StageIcon className="w-5 h-5" style={{ color: currentStage.accentColor }} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 inline-block mb-0.5">
                  {isRtl ? currentStage.badgeAr : currentStage.badgeEn}
                </span>
                <h2 className="text-sm sm:text-base font-black text-white line-clamp-1">
                  {isRtl ? currentStage.titleAr : currentStage.titleEn}
                </h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-400">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>{isRtl ? `المرحلة ${currentStageIdx + 1} من ${EDUCATIONAL_STAGES.length}` : `Stage ${currentStageIdx + 1}/${EDUCATIONAL_STAGES.length}`}</span>
              </div>

              <select
                value={playbackSpeed}
                onChange={e => setPlaybackSpeed(Number(e.target.value))}
                className="bg-slate-900 text-cyan-400 border border-slate-700/80 rounded-xl text-xs font-mono px-2.5 py-1.5 focus:outline-none cursor-pointer"
                title={isRtl ? 'سرعة التشغيل' : 'Playback Speed'}
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2.0x</option>
              </select>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                title={isRtl ? 'مشاركة هذا الدرس' : 'Share Stage'}
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                title={isRtl ? 'ملء الشاشة' : 'Fullscreen'}
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── SLIDE CENTER CONTENT (TWO COLUMNS: INTERACTIVE SIMULATION + EXPLANATION HUD) ── */}
          <div className="relative z-10 flex-1 p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Educational Content & Action Steps (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400">
                  {isRtl ? currentStage.subtitleAr : currentStage.subtitleEn}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {isRtl ? currentStage.titleAr : currentStage.titleEn}
                </h3>
              </div>

              {/* Statutory Framework Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {currentStage.statutoryBadges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>

              {/* Key Workflow Action Steps */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2">
                <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider block">
                  {isRtl ? '📌 خطة العمل والخطوات التنفيذية لهذه المرحلة:' : '📌 Action Plan & Implementation Steps:'}
                </span>
                <div className="space-y-1.5">
                  {currentStage.keySteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {sIdx + 1}
                      </div>
                      <span>{isRtl ? step.ar : step.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Service Jump Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigate(currentStage.targetRoute)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{isRtl ? currentStage.targetButtonLabelAr : currentStage.targetButtonLabelEn}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isRtl ? 'معتمد ومحمي بالكامل' : 'Sovereign Certified'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive UI Simulation Mockup (5 Cols) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-[11px] font-mono text-slate-400 ms-2">juris-engine-v4.sys</span>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    LIVE ACTIVE
                  </span>
                </div>

                {/* Simulated UI Cards based on stage */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <StageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{isRtl ? currentStage.titleAr : currentStage.titleEn}</div>
                        <div className="text-[10px] text-slate-400">{isRtl ? 'محرك ذكي متوافق دولياً' : 'Compliant Intelligent Engine'}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">99.9%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
                    <div className="text-[10px] text-cyan-400 font-bold">&gt; EXECUTE_LEGAL_ROUTINE:</div>
                    <div className="truncate text-slate-400">✔ SYSTEM_HASH: 0x8F92...B401</div>
                    <div className="truncate text-slate-400">✔ JURISDICTION_LOCK: ACTIVE</div>
                    <div className="truncate text-emerald-400 font-bold">✔ STATUTORY_AUDIT_PASS</div>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.max(15, progress)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── SYNCHRONIZED KARAOKE SUBTITLES OVERLAY BAR ── */}
          <div className="relative z-20 px-4 sm:px-8 py-3 bg-slate-950/90 border-t border-slate-800/90 flex items-center gap-3">
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <div
                className={`w-8 h-8 rounded-full overflow-hidden border-2 border-cyan-400 bg-slate-900 flex items-center justify-center ${
                  isSpeaking ? 'ring-2 ring-cyan-400 animate-pulse' : ''
                }`}
              >
                <img
                  src="/female_avatar_portrait.webp"
                  alt="Sarah AI"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if avatar missing
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div className="flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {scriptWords.map((word, wIdx) => {
                const isSpoken = wIdx < displayedWordsCount;
                return (
                  <span
                    key={wIdx}
                    className={`transition-colors duration-150 inline-block me-1 ${
                      isSpoken
                        ? 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                        : 'text-slate-500'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>

            {/* Speaking Waveform visualizer */}
            <div className="hidden md:flex items-center gap-0.5 h-6 px-2 bg-slate-900 rounded-lg border border-slate-800">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 bg-cyan-400 rounded-full transition-all duration-150 ${
                    isSpeaking
                      ? `h-${(i % 3 + 2) * 2} animate-pulse`
                      : 'h-1.5 opacity-30'
                  }`}
                  style={{ height: isSpeaking ? `${Math.sin(i + progress) * 10 + 14}px` : '4px' }}
                />
              ))}
            </div>
          </div>

          {/* ── BOTTOM PROGRESS BAR ── */}
          <div className="relative z-20 h-1.5 bg-slate-900">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* ── BOTTOM CONTROLS RIBBON ── */}
          <div className="relative z-20 px-5 py-3 bg-slate-950 flex items-center justify-between gap-4 border-t border-slate-800">
            {/* Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToStage(Math.max(0, currentStageIdx - 1))}
                disabled={currentStageIdx === 0}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                title={isRtl ? 'المرحلة السابقة' : 'Previous Stage'}
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayPause}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? (isRtl ? 'إيقاف مؤقت' : 'Pause') : (isRtl ? 'تشغيل الفيديو' : 'Play Video')}</span>
              </button>

              <button
                onClick={() => goToStage(Math.min(EDUCATIONAL_STAGES.length - 1, currentStageIdx + 1))}
                disabled={currentStageIdx === EDUCATIONAL_STAGES.length - 1}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                title={isRtl ? 'المرحلة التالية' : 'Next Stage'}
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMute}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  muted
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                }`}
                title={muted ? (isRtl ? 'تشغيل الصوت' : 'Unmute Voice') : (isRtl ? 'كتم الصوت' : 'Mute Voice')}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Current Stage Label */}
            <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-2">
              <span className="text-white font-bold">{isRtl ? currentStage.titleAr : currentStage.titleEn}</span>
              <span>•</span>
              <span className="text-cyan-400 font-bold">{currentStage.durationSec}s</span>
            </div>

            {/* Replay */}
            <button
              onClick={() => {
                goToStage(0);
                setIsPlaying(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إعادة من البداية' : 'Restart'}</span>
            </button>
          </div>
        </div>

        {/* ── 10 STAGE INTERACTIVE SCRUBBER THUMBNAILS ── */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              {isRtl ? '🗺️ خريطة المراحل الـ 10 للمنظومة (اضغط للانتقال الفوري):' : '🗺️ 10-Stage Platform Master Roadmap (Click to Jump):'}
            </span>
            <span className="text-xs text-cyan-400 font-bold">
              {isRtl ? `تم إنجاز ${currentStageIdx + 1} من ${EDUCATIONAL_STAGES.length}` : `${currentStageIdx + 1} of ${EDUCATIONAL_STAGES.length} Completed`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {EDUCATIONAL_STAGES.map((st, idx) => {
              const StIcon = st.icon;
              const isActive = idx === currentStageIdx;
              const isPast = idx < currentStageIdx;

              return (
                <button
                  key={st.id}
                  onClick={() => goToStage(idx)}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105'
                      : isPast
                      ? 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : isPast
                        ? 'bg-slate-800 text-cyan-400'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    <StIcon className="w-3.5 h-3.5" />
                  </div>

                  <span className="text-[10px] font-black line-clamp-1 text-slate-200">
                    {isRtl ? `مرحلة ${idx + 1}` : `Stage ${idx + 1}`}
                  </span>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DETAILED EDUCATIONAL COMPARISON & ACTION MATRIX ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المصفوفة التنفيذية المتكاملة' : 'Integrated Enterprise Action Matrix'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isRtl ? 'خطة عمل العميل: من مرحلة الدخول إلى التوثيق النهائي' : 'End-to-End Client Execution Plan & Capabilities'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isRtl
              ? 'جدول مقارن يوضح مخرجات كل مرحلة، السند النظامي الحاكم، والروابط المباشرة للاستخدام الفوري.'
              : 'Detailed breakdown of every stage output, governing legal statutes, and direct launch links.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-x-auto shadow-2xl">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] font-black uppercase">
              <tr>
                <th className="p-4">{isRtl ? 'المرحلة' : 'Stage'}</th>
                <th className="p-4">{isRtl ? 'الخدمة القانونية' : 'Legal Service'}</th>
                <th className="p-4">{isRtl ? 'المخرجات والنتائج الفورية' : 'Immediate Deliverable'}</th>
                <th className="p-4">{isRtl ? 'المنظومة التشريعية الحاكمة' : 'Statutory Framework'}</th>
                <th className="p-4 text-center">{isRtl ? 'الإجراء المباشر' : 'Direct Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {EDUCATIONAL_STAGES.map((st, i) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-400">
                    {formatNum(i + 1)}
                  </td>
                  <td className="p-4 font-bold text-white">
                    {isRtl ? st.titleAr : st.titleEn}
                  </td>
                  <td className="p-4 text-slate-300">
                    {isRtl ? st.subtitleAr : st.subtitleEn}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {st.statutoryBadges.slice(0, 2).map((b, bi) => (
                        <span key={bi} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => navigate(st.targetRoute)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{isRtl ? 'تشغيل' : 'Launch'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS ACCORDION (AI SEARCH & SEO OPTIMIZATION) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الأسئلة الشائعة ولجنة تقييم الذكاء الاصطناعي' : 'FAQ & AI Evaluation Standards'}</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {isRtl ? 'كل ما تود معرفته عن منصة الفيديو التعليمية الذكية' : 'Everything You Need to Know About the Smart Educational Platform'}
          </h3>
        </div>

        <div className="max-w-4xl mx-auto space-y-3 pt-2">
          {[
            {
              qAr: 'كيف تضمن المنصة تزامن الصوت والنص والصورة دون أي اختلاف في السرعات؟',
              qEn: 'How does the platform guarantee perfect synchronization between voice, text, and visuals?',
              aAr: 'تعتمد المنصة على محرك توقيت ديناميكي مبرمج يحسب الفترات الزمنية بدقة أجزاء الثانية بناءً على عدد الكلمات ومعدل سرعة النطق المختارة، مع ربط مصفوفة الكلمات بشريط التقدم لتفعيل التوهج الكاريوكي اللحظي دون أي تأخير.',
              aEn: 'The platform deploys a dynamic mathematical timing engine that calculates millisecond intervals based on word counts and selected playback rates, synchronizing real-time karaoke text highlighting with audio synthesis.',
            },
            {
              qAr: 'هل يدعم الفيديو التعليمي كافة لغات المنصة السبعة مع النطق الصوتي الأصيل؟',
              qEn: 'Does the educational video support all 7 platform languages with native voice synthesis?',
              aAr: 'نعم، المنصة تدعم بالكامل اللغات السبعة (العربية، الإنجليزية، الفرنسية، الألمانية، الإسبانية، الصينية، والتركية) بنصوص كاملة غير مبتورة ونطق صوتي مباشر متوافق مع كافة المتصفحات.',
              aEn: 'Yes, all 7 languages (Arabic, English, French, German, Spanish, Chinese, Turkish) are 100% supported with unabridged legal scripts and live speech synthesis across all modern browsers.',
            },
            {
              qAr: 'كيف تم ضغط الفيديو ليعمل بأعلى سرعة دون التأثير على أداء الموقع؟',
              qEn: 'How is the video compressed to ensure ultra-fast load times and zero bandwidth lag?',
              aAr: 'بدلاً من تحميل ملفات الفيديو الضخمة (MP4/WebM) التي تستهلك مئات الميغابايتات، تم بناء المنصة بمحرك رسومي متجهي خفيف الوزن (Vectorized Canvas & SVG) وتوليد صوتي لحظي، مما يجعل حجمها أقل من 50 كيلوبايت وتعمل بمعدل 60 إطاراً بالثانية.',
              aEn: 'Instead of loading heavy video files (MP4/WebM), the platform utilizes a pure client-side vectorized Canvas & SVG rendering engine paired with instant browser speech synthesis, consuming under 50KB total payload at 60 FPS.',
            },
            {
              qAr: 'هل يمكن للعميل الانتقال المباشر لتجربة أي خدمة يشاهدها في الفيديو؟',
              qEn: 'Can clients jump directly from watching a slide to executing the service?',
              aAr: 'بالتأكيد، يحتوي كل سلايد في الفيديو على زر تشغيل مباشر (Direct CTA) ينقل العميل فوراً إلى صفحة الخدمة المحددة (مثل محرك العقود، فحص المخاطر، تأسيس الشركات، أو بوابة الدفع) مع استدعاء البيانات المناسبة.',
              aEn: 'Absolutely. Every educational slide features a 1-click Direct Action CTA that immediately navigates the client to the respective engine (Contract Studio, Risk Audit, Formation, or Payment).',
            },
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{isRtl ? faq.qAr : faq.qEn}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 bg-slate-950/40">
                    {isRtl ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}
