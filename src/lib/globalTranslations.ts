/**
 * globalTranslations.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive 7-Language Global Localization Engine for JurisTech Solutions
 * 
 * Supports 7 Global Sovereign Languages:
 *   • ar: Arabic (العربية)
 *   • en: English (US / UK / Global)
 *   • de: German (Deutsch)
 *   • fr: French (Français)
 *   • es: Spanish (Español)
 *   • zh: Chinese (中文)
 *   • tr: Turkish (Türkçe)
 */

import { SupportedLang, normalizeLanguage } from './languageHelper';

export interface GlobalUITexts {
  // Navigation & Header
  nav: {
    dashboard: string;
    chat: string;
    contracts: string;
    risk: string;
    repository: string;
    templates: string;
    vault: string;
    sovereignAiHub: string;
    companyFormation: string;
    enterpriseAudit: string;
    negotiation: string;
    leadRadar: string;
    payment: string;
    support: string;
    aboutUs: string;
    legalCompliance: string;
    more: string;
    subscribe: string;
    adminPanel: string;
    jurisdictionLaw: string;
    bookAdvisor: string;
    themeFont: string;
    security2FA: string;
    rbacRoles: string;
  };

  // Dashboard & Telemetry
  dashboard: {
    heroTitle: string;
    heroSubtitle: string;
    startConsultation: string;
    draftContract: string;
    auditRisk: string;
    statContracts: string;
    statVisitorsToday: string;
    statSubscribers: string;
    statLicensedEntities: string;
    statRiskReports: string;
    statAiQueries: string;
    servicesTitle: string;
    pricingTitle: string;
    pricingSubtitle: string;
    subscribeTier: string;
    popularBadge: string;
    startupTierName: string;
    smeTierName: string;
    enterpriseTierName: string;
    perMonth: string;
    adSponsorHeadline: string;
    adSponsorSub: string;
    reserveAdSpace: string;
  };

  // Sovereign AI Hub (5 Modules)
  aiHub: {
    title: string;
    subtitle: string;
    module1Name: string;
    module1Desc: string;
    module2Name: string;
    module2Desc: string;
    module3Name: string;
    module3Desc: string;
    module4Name: string;
    module4Desc: string;
    module5Name: string;
    module5Desc: string;
    uploadDropzone: string;
    uploadSub: string;
    jurisdictionLabel: string;
    exportWord: string;
    exportPdf: string;
    selfLearningLoop: string;
    executeAnalysis: string;
  };

  // Chat & AI Legal Advisor
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    thinking: string;
    newChat: string;
    exportWord: string;
    exportPdf: string;
    trustBoxTitle: string;
    statutoryBasis: string;
    confidenceScore: string;
  };

  // Risk Radar & Vulnerability Auditor
  risk: {
    title: string;
    subtitle: string;
    pasteOrUpload: string;
    runAudit: string;
    auditing: string;
    overallScore: string;
    criticalFlags: string;
    liabilityCap: string;
    arbitrationVenue: string;
    recommendedRedlines: string;
  };

  // Contracts Generator & Vault
  contracts: {
    title: string;
    subtitle: string;
    contractType: string;
    partyA: string;
    partyB: string;
    governingLaw: string;
    generateBtn: string;
    generating: string;
    exportWord: string;
    exportPdf: string;
  };

  // Footer & Compliance
  footer: {
    independenceDisclaimer: string;
    copyright: string;
    allRightsReserved: string;
    ammanHq: string;
  };
}

export const GLOBAL_TRANSLATIONS: Record<SupportedLang, GlobalUITexts> = {
  ar: {
    nav: {
      dashboard: 'الرئيسية',
      chat: 'المستشار الذكي',
      contracts: 'صانع العقود',
      risk: 'فحص المخاطر',
      repository: 'مستودع العقود',
      templates: 'استوديو النماذج',
      vault: 'الخزنة المشفرة',
      sovereignAiHub: '⭐ محرك Google AI Pro',
      companyFormation: 'تأسيس الشركات',
      enterpriseAudit: 'تدقيق الاستحواذ M&A',
      negotiation: 'محاكي التفاوض',
      leadRadar: 'مرصد رادار الشركات',
      payment: 'باقات الاشتراك',
      support: 'الدعم الفني',
      aboutUs: 'من نحن',
      legalCompliance: 'الامتثال والحوكمة',
      more: 'المزيد',
      subscribe: 'الاشتراك',
      adminPanel: '👑 لوحة الأدمن',
      jurisdictionLaw: 'النظام القضائي',
      bookAdvisor: 'حجز المستشار',
      themeFont: 'المظهر والخطوط',
      security2FA: 'المصادقة الثنائية 2FA',
      rbacRoles: 'إدارة الصلاحيات RBAC',
    },
    dashboard: {
      heroTitle: 'منصة تحليل العقود بالذكاء الاصطناعي وإدارة المخاطر القانونية للشركات',
      heroSubtitle: 'المنصة الذكية الأولى المتخصصة في كشف الثغرات والبنود التعسفية، صياغة الاتفاقيات، وتأسيس الشركات وحوكمة الالتزامات المالية.',
      startConsultation: 'بدء استشارة فورية 24/7',
      draftContract: 'صياغة عقد تجاري',
      auditRisk: 'فحص مخاطر عقدك',
      statContracts: 'إجمالي العقود بالنظام',
      statVisitorsToday: 'الزوار الفعليون اليوم',
      statSubscribers: 'المشتركون والعملاء',
      statLicensedEntities: 'العملاء والشركات المرخصة',
      statRiskReports: 'تقارير المخاطر المنجزة',
      statAiQueries: 'استشارات الذكاء الاصطناعي',
      servicesTitle: 'دليل الخدمات والأنظمة القانونية السيادية الكاملة',
      pricingTitle: 'باقات الاشتراك المخصصة للمؤسسات والشركات',
      pricingSubtitle: 'وفر حتى 30% مع خطط الاشتراك السنوية والشهرية المحدثة لعام 2026',
      subscribeTier: 'اشتراك الباقة',
      popularBadge: '⭐ الأكثر طلباً',
      startupTierName: 'باقة الشركات الصغرى والناشئة',
      smeTierName: 'باقة الشركات المتوسطة والنمو',
      enterpriseTierName: 'باقة المؤسسات والشركات الكبرى',
      perMonth: '/ شهرياً',
      adSponsorHeadline: 'مساحة مخصصة لرعايات الشركات وإعلانات الحلول الرقمية والتقنية القانونية',
      adSponsorSub: 'لحجز مساحات إعلانية وشراكات استراتيجية لشركات الدعاية والإعلان',
      reserveAdSpace: 'حجز مساحة إعلانية ↗',
    },
    aiHub: {
      title: 'مركز حلول الذكاء الاصطناعي السيادي | Google AI Pro',
      subtitle: 'محرك التحليل القانوني والتنبؤ القضائي المتقدم مع دعم 9 اختصاصات قضائية وتصدير Word و PDF المعتمد.',
      module1Name: '1. الاستحواذ التنبؤي M&A وتقييم الصفقات',
      module1Desc: 'تقييم مضاعفات EBITDA، كشف الالتزامات الضريبية والعمالية الخفية، ونمذجة سيناريوهات ما بعد الاستحواذ.',
      module2Name: '2. وكلاء التفاوض الآلي والصياغة البديلة',
      module2Desc: 'صياغة ردود تفاوضية ذكية واقتراح بنود حمائية متوازنة لكسر الجمود التعاقدي.',
      module3Name: '3. المحاكاة القضائية وتوقع نسب كسب القضايا',
      module3Desc: 'محاكاة مرافعات أمام محاكم ديلاوير، DIFC، والرياض مع تحليل السوابق القضائية وتوقع نسب الكسب.',
      module4Name: '4. كشف التزوير والاحتيال بالقياس النصي الحيوي',
      module4Desc: 'تحليل البصمة الأسلوبية (Stylometry Forensics) لكشف البنود المدسوسة والتعديلات غير المصرح بها.',
      module5Name: '5. الامتثال التشريعي العابر للحدود وقوائم العقوبات',
      module5Desc: 'مطابقة فورية مع قوانين حماية البيانات (GDPR/PDPL)، قانون الذكاء الاصطناعي الأوروبي، ولوائح غسل الأموال.',
      uploadDropzone: 'اسحب وأفلت عقدك أو مستندك هنا (PDF, Word .docx, TXT, صور)',
      uploadSub: 'استخراج فوري متقدم عبر تقنية OCR متعددة المراحل مع تشفير كامل AES-256',
      jurisdictionLabel: 'اختر الاختصاص القضائي المطبق:',
      exportWord: 'تصدير تقرير Word معتمد (.docx)',
      exportPdf: 'تصدير وثيقة PDF رسمية مختومة',
      selfLearningLoop: 'نظام التعلم والتطوير الذاتي المستمر (RLHF Active)',
      executeAnalysis: 'تنفيذ التحليل الذكي الفوري بالذكاء الاصطناعي',
    },
    chat: {
      title: 'المستشار القانوني الذكي للشركات',
      subtitle: 'استشارات قانونية فورية وتأصيل تشريعي دقيق 24/7',
      placeholder: 'اكتب استفسارك القانوني بأي لغة...',
      send: 'إرسال',
      thinking: 'جاري التحليل واستدعاء النصوص التشريعية...',
      newChat: 'محادثة جديدة',
      exportWord: 'تصدير Word',
      exportPdf: 'تصدير PDF',
      trustBoxTitle: 'صندوق الشفافية والموثوقية القانونية',
      statutoryBasis: 'السند والنص التشريعي:',
      confidenceScore: 'نسبة الدقة والموثوقية:',
    },
    risk: {
      title: 'رادار فحص المخاطر وكشف الثغرات العقدية',
      subtitle: 'فحص استباقي كاشف للشروط الجزائية والمسؤوليات غير المحدودة والبنود التعسفية',
      pasteOrUpload: 'الصق نص العقد أو ارفع ملف PDF / Word للتدقيق الفوري...',
      runAudit: 'بدء فحص المخاطر الشامل',
      auditing: 'جاري فحص العقد على 8 محاور قانونية...',
      overallScore: 'مؤشر سلامة العقد:',
      criticalFlags: 'البنود الحرجة عالية المخاطر',
      liabilityCap: 'سقف المسؤولية المالية والتعويضات',
      arbitrationVenue: 'مقر وقانون وهيئة التحكيم',
      recommendedRedlines: 'الصياغات البديلة الموصى بها',
    },
    contracts: {
      title: 'صانع ومولد العقود التجارية السيادية',
      subtitle: 'صياغة عقود تجارية مخصصة محكمة مع قفل الاختصاص القضائي وتصدير فوري',
      contractType: 'نوع العقد أو الاتفاقية',
      partyA: 'الطرف الأول (الاسم والصفة)',
      partyB: 'الطرف الثاني (الاسم والصفة)',
      governingLaw: 'القانون الحاكم والاختصاص القضائي',
      generateBtn: 'توليد العقد الذكي المعتمد',
      generating: 'جاري استدعاء قواعد RAG وصياغة العقد...',
      exportWord: 'تحميل العقد بصيغة Word (.docx)',
      exportPdf: 'تحميل العقد بصيغة PDF',
    },
    footer: {
      independenceDisclaimer: 'إشعار واستقلالية قانونية رسمية: منصة JurisTech Solutions هي كيان تقني مستقل 100% يدار ومسجل في المملكة الأردنية الهاشمية (عمّان). المنصة ليست فرعاً أو مرتبطة بشركة LegalShield USA أو علامات تجارية أخرى.',
      copyright: 'جميع الحقوق محفوظة قانونياً — حلول التقنية القانونية السيادية.',
      allRightsReserved: 'جميع الحقوق محفوظة',
      ammanHq: 'المقر الإقليمي: المملكة الأردنية الهاشمية - عمّان',
    },
  },

  en: {
    nav: {
      dashboard: 'Dashboard',
      chat: 'AI Legal Advisor',
      contracts: 'Contract Generator',
      risk: 'Risk Radar',
      repository: 'Contracts Repository',
      templates: 'Templates Studio',
      vault: 'Encrypted Vault',
      sovereignAiHub: '⭐ Google AI Pro',
      companyFormation: 'Company Formation',
      enterpriseAudit: 'M&A Audit',
      negotiation: 'AI Negotiation',
      leadRadar: 'B2B Lead Radar',
      payment: 'Pricing & Plans',
      support: 'Helpdesk & Support',
      aboutUs: 'About Us',
      legalCompliance: 'Compliance & Governance',
      more: 'More Tools',
      subscribe: 'Subscribe',
      adminPanel: '👑 Admin Panel',
      jurisdictionLaw: 'Jurisdiction Law',
      bookAdvisor: 'Book Advisor',
      themeFont: 'Themes & Fonts',
      security2FA: '2FA Security',
      rbacRoles: 'User Roles (RBAC)',
    },
    dashboard: {
      heroTitle: 'Autonomous AI Legal Intelligence & Contract Risk Governance',
      heroSubtitle: 'The premier AI platform specialized in discovering liability gaps, abusive terms, and institutional contract drafting.',
      startConsultation: 'Start Live Consultation 24/7',
      draftContract: 'Draft Commercial Contract',
      auditRisk: 'Audit Contract Risk',
      statContracts: 'Total System Contracts',
      statVisitorsToday: 'Real Visitors Today',
      statSubscribers: 'Active Subscribers',
      statLicensedEntities: 'Licensed Corporate Clients',
      statRiskReports: 'Completed Risk Audits',
      statAiQueries: 'AI Legal Queries',
      servicesTitle: 'Complete Sovereign Legal & AI Services Directory',
      pricingTitle: 'Enterprise & Institutional Subscription Plans',
      pricingSubtitle: 'Save up to 30% with updated 2026 Sovereign AI monthly & annual packages',
      subscribeTier: 'Subscribe Plan',
      popularBadge: '⭐ Most Popular',
      startupTierName: 'Startup & Micro Tier',
      smeTierName: 'SME & Growth Tier',
      enterpriseTierName: 'Enterprise Sovereign Tier',
      perMonth: '/ month',
      adSponsorHeadline: 'Reserved Corporate Sponsorship & Media Partnership Showcase',
      adSponsorSub: 'For enterprise advertising, sponsored placements & corporate media partnerships',
      reserveAdSpace: 'Reserve Ad Space ↗',
    },
    aiHub: {
      title: 'Sovereign AI Solutions Hub | Google AI Pro',
      subtitle: 'Advanced predictive legal intelligence across 9 global statutory jurisdictions with dual Word & PDF export.',
      module1Name: '1. Predictive M&A Intelligence & Deal Valuation',
      module1Desc: 'EBITDA multiple adjustments, latent tax/labor liability exposure, and post-merger governance modeling.',
      module2Name: '2. Autonomous AI Negotiation Agents & Redlines',
      module2Desc: 'Strategic counter-proposals and balanced protective redlines to unlock deadlock contract terms.',
      module3Name: '3. Virtual Litigation & Dispute Win-Probability',
      module3Desc: 'Trial simulation before Delaware, DIFC, and Riyadh courts with judicial precedent win-rate analytics.',
      module4Name: '4. Stylometric Fraud, Forgery & Tampering Forensics',
      module4Desc: 'Biometric stylometry text analysis to detect inserted clauses, fabricated signatures, and metadata anomalies.',
      module5Name: '5. Cross-Border Statutory Compliance & Sanctions',
      module5Desc: 'Instant screening against GDPR, Saudi PDPL, EU AI Act 2024, and international OFAC/FATF AML sanctions.',
      uploadDropzone: 'Drag and drop your contract or document here (PDF, Word .docx, TXT, OCR Images)',
      uploadSub: 'High-precision multi-stage OCR extraction with AES-256 zero-knowledge encryption',
      jurisdictionLabel: 'Select Active Legal Jurisdiction:',
      exportWord: 'Export Certified Word Report (.docx)',
      exportPdf: 'Export Official Sealed PDF',
      selfLearningLoop: 'Autonomous RLHF Continuous Self-Learning Active',
      executeAnalysis: 'Execute Deep AI Sovereign Analysis',
    },
    chat: {
      title: 'Senior Executive AI Legal Copilot',
      subtitle: 'Instant statutory answers and cross-border commercial analysis 24/7',
      placeholder: 'Ask your legal question in any language...',
      send: 'Send',
      thinking: 'Analyzing statutory codes and judicial precedents...',
      newChat: 'New Consultation',
      exportWord: 'Export Word',
      exportPdf: 'Export PDF',
      trustBoxTitle: 'AI Trust & Transparency Box',
      statutoryBasis: 'Statutory Citation & Legal Basis:',
      confidenceScore: 'Reliability & Confidence Index:',
    },
    risk: {
      title: 'Contract Risk Radar & Liability Vulnerability Auditor',
      subtitle: 'Preemptive detection of liquidated damages, unilateral termination, and abusive liability clauses',
      pasteOrUpload: 'Paste contract text or upload PDF/Word document for instant audit...',
      runAudit: 'Execute Full 8-Axis Risk Audit',
      auditing: 'Auditing contract across 8 legal risk vectors...',
      overallScore: 'Contract Health Score:',
      criticalFlags: 'Critical High-Risk Clauses',
      liabilityCap: 'Liability Cap & Indemnity Threshold',
      arbitrationVenue: 'Arbitration Seat & Governing Law',
      recommendedRedlines: 'Recommended Protective Redlines',
    },
    contracts: {
      title: 'Sovereign Commercial Contract Generator',
      subtitle: 'Custom institutional contract drafting with jurisdiction lock and instant export',
      contractType: 'Contract Type / Agreement',
      partyA: 'Party A (Name & Legal Capacity)',
      partyB: 'Party B (Name & Legal Capacity)',
      governingLaw: 'Governing Law & Legal Venue',
      generateBtn: 'Generate Certified Smart Contract',
      generating: 'Retrieving statutory RAG context & drafting...',
      exportWord: 'Download Word (.docx)',
      exportPdf: 'Download PDF',
    },
    footer: {
      independenceDisclaimer: 'Official Notice & Trademark Independence: JurisTech Solutions is a 100% sovereign, independent technology platform headquartered in Amman, Jordan. Not affiliated with LegalShield USA or other trademark entities.',
      copyright: 'All Rights Reserved — Sovereign LegalTech Software.',
      allRightsReserved: 'All Rights Reserved',
      ammanHq: 'Regional HQ: Amman, Hashemite Kingdom of Jordan',
    },
  },

  de: {
    nav: {
      dashboard: 'Dashboard',
      chat: 'KI-Rechtsberater',
      contracts: 'Vertragsgenerator',
      risk: 'Risiko-Radar',
      repository: 'Vertragstresor',
      templates: 'Vorlagen-Studio',
      vault: 'Verschlüsselter Tresor',
      sovereignAiHub: '⭐ Google AI Pro',
      companyFormation: 'Unternehmensgründung',
      enterpriseAudit: 'M&A-Prüfung',
      negotiation: 'KI-Verhandlung',
      leadRadar: 'B2B-Unternehmensradar',
      payment: 'Preise & Tarife',
      support: 'Helpdesk & Support',
      aboutUs: 'Über uns',
      legalCompliance: 'Rechtskonformität & DSGVO',
      more: 'Mehr Tools',
      subscribe: 'Abonnieren',
      adminPanel: '👑 Admin-Panel',
      jurisdictionLaw: 'Rechtsordnung',
      bookAdvisor: 'Berater buchen',
      themeFont: 'Design & Schriftart',
      security2FA: '2FA-Sicherheit',
      rbacRoles: 'Rollenverwaltung (RBAC)',
    },
    dashboard: {
      heroTitle: 'Autonome KI-Rechtsintelligenz & Vertragsrisiko-Governance',
      heroSubtitle: 'Die führende KI-Plattform zur Aufdeckung von Haftungsrisiken, missbräuchlichen Klauseln und rechtssicheren Verträgen.',
      startConsultation: 'Live-Beratung starten 24/7',
      draftContract: 'Vertrag erstellen',
      auditRisk: 'Vertragsrisiko prüfen',
      statContracts: 'Gesamtverträge im System',
      statVisitorsToday: 'Reale Besucher heute',
      statSubscribers: 'Aktive Abonnenten',
      statLicensedEntities: 'Lizenzierte Unternehmen',
      statRiskReports: 'Abgeschlossene Risikoaudits',
      statAiQueries: 'KI-Rechtsanfragen',
      servicesTitle: 'Vollständiges Verzeichnis souveräner Rechtsdienste',
      pricingTitle: 'Abonnementtarife für Unternehmen und Kanzleien',
      pricingSubtitle: 'Sparen Sie bis zu 30% mit den aktualisierten Souveränen KI-Tarifen 2026',
      subscribeTier: 'Tarif abonnieren',
      popularBadge: '⭐ Meistgewählt',
      startupTierName: 'Startup- & Kleinunternehmertarif',
      smeTierName: 'Mittelstands- & Wachstumstarif',
      enterpriseTierName: 'Enterprise-Sovereign-Tarif',
      perMonth: '/ Monat',
      adSponsorHeadline: 'Reservierter Bereich für Unternehmenssponsoring & Medienpartnerschaften',
      adSponsorSub: 'Für Unternehmenswerbung, gesponserte Platzierungen und Medienkooperationen',
      reserveAdSpace: 'Werbefläche anfragen ↗',
    },
    aiHub: {
      title: 'Souveränes KI-Lösungszentrum | Google AI Pro',
      subtitle: 'Erweiterte prädiktive Rechtsanalyse nach BGB, HGB, EU AI Act und 9 internationalen Rechtsordnungen.',
      module1Name: '1. Prädiktive M&A-Analyse & Deal-Bewertung',
      module1Desc: 'EBITDA-Bewertungen, steuerliche und arbeitsrechtliche Haftungsrisiken sowie Post-Merger-Governance.',
      module2Name: '2. Autonome KI-Verhandlungsagenten & Redlines',
      module2Desc: 'Strategische Gegenvorschläge und ausgewogene Schutzklauseln zur Auflösung von Verhandlungssackgassen.',
      module3Name: '3. Gerichtssimulation & Prozesserfolgsprognose',
      module3Desc: 'Verhandlungssimulation vor Gerichten in Frankfurt, DIFC und Delaware mit präzedenzfallbasierter Erfolgsquote.',
      module4Name: '4. Forensische Betrugs- & Fälschungserkennung',
      module4Desc: 'Biometrische Stilanalyse (Stylometry) zur Erkennung manipulierter Klauseln und unbefugter Änderungen.',
      module5Name: '5. Grenzüberschreitende Compliance & Sanktionsprüfung',
      module5Desc: 'Sofortiger Abgleich mit DSGVO, EU AI Act 2024 und internationalen FATF/OFAC-Geldwäschelisten.',
      uploadDropzone: 'Vertrag oder Dokument hier ablegen (PDF, Word .docx, TXT, OCR-Scans)',
      uploadSub: 'Hochpräzise mehrstufige OCR-Textextraktion mit AES-256-Verschlüsselung',
      jurisdictionLabel: 'Rechtsordnung auswählen:',
      exportWord: 'Zertifizierten Word-Bericht exportieren (.docx)',
      exportPdf: 'Offizielles gesiegeltes PDF exportieren',
      selfLearningLoop: 'Kontinuierliches autonomes RLHF-Lernsystem aktiv',
      executeAnalysis: 'Tiefgehende KI-Analyse ausführen',
    },
    chat: {
      title: 'Leitender KI-Rechtsberater für Unternehmen',
      subtitle: 'Fundierte Rechtsberatung und Auslegung nach BGB/HGB und internationalem Recht 24/7',
      placeholder: 'Stellen Sie Ihre rechtliche Frage in beliebiger Sprache...',
      send: 'Senden',
      thinking: 'Rechtsvorschriften und Urteile werden analysiert...',
      newChat: 'Neue Beratung',
      exportWord: 'Word-Export',
      exportPdf: 'PDF-Export',
      trustBoxTitle: 'KI-Transparenz- & Vertrauensbox',
      statutoryBasis: 'Gesetzliche Grundlage & Paragraphen:',
      confidenceScore: 'Präzisions- & Zuverlässigkeitsgrad:',
    },
    risk: {
      title: 'Vertragsrisiko-Radar & Haftungsprüfer',
      subtitle: 'Frühzeitige Erkennung von Vertragsstrafen, Haftungsfallen und unzulässigen Klauseln',
      pasteOrUpload: 'Vertragstext einfügen oder PDF/Word-Datei zur Sofortprüfung hochladen...',
      runAudit: 'Vollständige 8-Achsen-Risikoprüfung starten',
      auditing: 'Vertrag wird auf 8 Risikovektoren analysiert...',
      overallScore: 'Vertragssicherheitsindex:',
      criticalFlags: 'Kritische Risikoklauseln',
      liabilityCap: 'Haftungsbeschränkung & Schadensersatz',
      arbitrationVenue: 'Gerichtsstand & anwendbares Recht',
      recommendedRedlines: 'Empfohlene Schutzklauseln (Redlines)',
    },
    contracts: {
      title: 'Souveräner Generator für Handelsverträge',
      subtitle: 'Rechtssichere Vertragserstellung mit Gerichtsstandsfixierung und Direkt-Export',
      contractType: 'Vertragsart / Vereinbarung',
      partyA: 'Partei A (Name & Rechtsform)',
      partyB: 'Partei B (Name & Rechtsform)',
      governingLaw: 'Anwendbares Recht & Gerichtsstand',
      generateBtn: 'Zertifizierten Smart Contract erstellen',
      generating: 'RAG-Rechtskontext wird geladen & Vertrag erstellt...',
      exportWord: 'Word herunterladen (.docx)',
      exportPdf: 'PDF herunterladen',
    },
    footer: {
      independenceDisclaimer: 'Offizieller Hinweis zur Unabhängigkeit: JurisTech Solutions ist eine 100% unabhängige Technologieplattform mit Hauptsitz in Amman, Jordanien. Keine Verbindung zu LegalShield USA oder Drittmarken.',
      copyright: 'Alle Rechte vorbehalten — Souveräne LegalTech-Software.',
      allRightsReserved: 'Alle Rechte vorbehalten',
      ammanHq: 'Regionaler Hauptsitz: Amman, Haschemitisches Königreich Jordanien',
    },
  },

  fr: {
    nav: {
      dashboard: 'Tableau de bord',
      chat: 'Conseiller Juridique IA',
      contracts: 'Générateur de Contrats',
      risk: 'Radar des Risques',
      repository: 'Répertoire de Contrats',
      templates: 'Studio de Modèles',
      vault: 'Coffre-fort Crypté',
      sovereignAiHub: '⭐ Google AI Pro',
      companyFormation: 'Création d’Entreprise',
      enterpriseAudit: 'Audit Fusions-Acquisitions',
      negotiation: 'Négociation IA',
      leadRadar: 'Radar Entreprises B2B',
      payment: 'Tarifs & Abonnements',
      support: 'Assistance & Support',
      aboutUs: 'À Propos',
      legalCompliance: 'Conformité & RGPD',
      more: 'Plus d’Outils',
      subscribe: "S'abonner",
      adminPanel: '👑 Panneau Admin',
      jurisdictionLaw: 'Juridiction & Droit',
      bookAdvisor: 'Réserver un Conseiller',
      themeFont: 'Thèmes & Polices',
      security2FA: 'Sécurité 2FA',
      rbacRoles: 'Gestion des Rôles (RBAC)',
    },
    dashboard: {
      heroTitle: 'Intelligence Juridique IA Autonome & Gouvernance des Risques',
      heroSubtitle: 'La plateforme IA d’élite spécialisée dans la détection des failles de responsabilité et la rédaction contractuelle certifiée.',
      startConsultation: 'Démarrer consultation en direct 24/7',
      draftContract: 'Rédiger un contrat',
      auditRisk: 'Auditer les risques contractuels',
      statContracts: 'Contrats au système',
      statVisitorsToday: 'Visiteurs réels aujourd’hui',
      statSubscribers: 'Abonnés actifs',
      statLicensedEntities: 'Entreprises licenciées',
      statRiskReports: 'Audits de risques complétés',
      statAiQueries: 'Consultations juridiques IA',
      servicesTitle: 'Répertoire complet des services juridiques souverains',
      pricingTitle: 'Forfaits d’abonnement pour entreprises et cabinets',
      pricingSubtitle: 'Économisez jusqu’à 30% avec les forfaits souverains 2026',
      subscribeTier: 'Souscrire au forfait',
      popularBadge: '⭐ Le plus demandé',
      startupTierName: 'Forfait Startup & TPE',
      smeTierName: 'Forfait PME & Croissance',
      enterpriseTierName: 'Forfait Entreprise Souveraine',
      perMonth: '/ mois',
      adSponsorHeadline: 'Espace réservé aux partenariats d’entreprises et sponsors médias',
      adSponsorSub: 'Pour la publicité d’entreprise, les placements sponsorisés et partenariats',
      reserveAdSpace: 'Réserver un espace ↗',
    },
    aiHub: {
      title: 'Centre de Solutions IA Souveraines | Google AI Pro',
      subtitle: 'Analyse juridique prédictive avancée selon le Code Civil, le RGPD et 9 juridictions internationales.',
      module1Name: '1. Intelligence Prédictive M&A & Évaluation',
      module1Desc: 'Évaluation des multiples d’EBITDA, détection des passifs fiscaux/sociaux et gouvernance post-acquisition.',
      module2Name: '2. Agents de Négociation IA & Clauses Protectrices',
      module2Desc: 'Contre-propositions stratégiques et clauses protectrices équilibrées pour débloquer les impasses.',
      module3Name: '3. Simulation de Procès & Probabilité de Gain',
      module3Desc: 'Simulation d’audiences devant les tribunaux internationaux avec analyse prédictive des taux de succès.',
      module4Name: '4. Détection des Fraudes & Stylométrie Forensique',
      module4Desc: 'Analyse stylométrique biométrique pour identifier les clauses insérées et altérations non autorisées.',
      module5Name: '5. Conformité Réglementaire & Filtrage des Sanctions',
      module5Desc: 'Conformité instantanée RGPD, loi européenne sur l’IA 2024 et listes antiblanchiment GAFI/OFAC.',
      uploadDropzone: 'Glissez-déposez votre contrat ici (PDF, Word .docx, TXT, images OCR)',
      uploadSub: 'Extraction OCR multi-étapes de haute précision avec cryptage AES-256',
      jurisdictionLabel: 'Sélectionner la juridiction applicable :',
      exportWord: 'Exporter rapport Word certifié (.docx)',
      exportPdf: 'Exporter PDF officiel scellé',
      selfLearningLoop: 'Apprentissage continu autonome RLHF actif',
      executeAnalysis: 'Lancer l’analyse IA approfondie',
    },
    chat: {
      title: 'Conseiller Juridique IA Senior pour Entreprises',
      subtitle: 'Conseils juridiques instantanés et analyse réglementaire 24/7',
      placeholder: 'Posez votre question juridique dans n’importe quelle langue...',
      send: 'Envoyer',
      thinking: 'Analyse des textes de loi et précédents jurisprudentiels...',
      newChat: 'Nouvelle consultation',
      exportWord: 'Exporter Word',
      exportPdf: 'Exporter PDF',
      trustBoxTitle: 'Boîte de Confiance & Transparence IA',
      statutoryBasis: 'Base légale & Références législatives :',
      confidenceScore: 'Indice de précision & fiabilité :',
    },
    risk: {
      title: 'Radar des Risques & Détecteur de Clauses Abusives',
      subtitle: 'Détection préventive des pénalités excessives, plafonds de responsabilité et clauses d’adhésion',
      pasteOrUpload: 'Collez le texte du contrat ou déposez un fichier PDF/Word...',
      runAudit: 'Lancer l’audit de risque sur 8 axes',
      auditing: 'Audit en cours sur 8 vecteurs juridiques...',
      overallScore: 'Indice de conformité contractuelle :',
      criticalFlags: 'Clauses critiques à haut risque',
      liabilityCap: 'Plafond de responsabilité financière',
      arbitrationVenue: 'Siège d’arbitrage & droit applicable',
      recommendedRedlines: 'Clauses alternatives recommandées',
    },
    contracts: {
      title: 'Générateur Souverain de Contrats Commerciaux',
      subtitle: 'Rédaction contractuelle sur mesure avec verrouillage de juridiction et export immédiat',
      contractType: 'Type de contrat / Accord',
      partyA: 'Partie A (Nom & Qualité juridique)',
      partyB: 'Partie B (Nom & Qualité juridique)',
      governingLaw: 'Droit applicable & Tribunal compétent',
      generateBtn: 'Générer le Smart Contract certifié',
      generating: 'Extraction du contexte RAG & rédaction...',
      exportWord: 'Télécharger Word (.docx)',
      exportPdf: 'Télécharger PDF',
    },
    footer: {
      independenceDisclaimer: 'Avis officiel d’indépendance : JurisTech Solutions est une plateforme technologique souveraine et indépendante à 100%, basée à Amman, Jordanie. Aucune affiliation avec LegalShield USA.',
      copyright: 'Tous droits réservés — Logiciel LegalTech Souverain.',
      allRightsReserved: 'Tous droits réservés',
      ammanHq: 'Siège régional : Amman, Royaume hachémite de Jordanie',
    },
  },

  es: {
    nav: {
      dashboard: 'Panel Principal',
      chat: 'Asesor Legal IA',
      contracts: 'Generador de Contratos',
      risk: 'Radar de Riesgos',
      repository: 'Repositorio de Contratos',
      templates: 'Estudio de Plantillas',
      vault: 'Bóveda Cifrada',
      sovereignAiHub: '⭐ Google AI Pro',
      companyFormation: 'Constitución de Empresas',
      enterpriseAudit: 'Auditoría M&A',
      negotiation: 'Negociación IA',
      leadRadar: 'Radar de Clientes B2B',
      payment: 'Precios y Planes',
      support: 'Soporte y Ayuda',
      aboutUs: 'Quiénes Somos',
      legalCompliance: 'Cumplimiento Legal y LOPD',
      more: 'Más Herramientas',
      subscribe: 'Suscribirse',
      adminPanel: '👑 Panel de Admin',
      jurisdictionLaw: 'Jurisdicción y Ley',
      bookAdvisor: 'Reservar Asesor',
      themeFont: 'Temas y Fuentes',
      security2FA: 'Seguridad 2FA',
      rbacRoles: 'Gestión de Roles (RBAC)',
    },
    dashboard: {
      heroTitle: 'Inteligencia Jurídica IA Autónoma y Gobernanza de Riesgos',
      heroSubtitle: 'La plataforma líder en detección de riesgos contractuales, cláusulas abusivas y redacción mercantil certificada.',
      startConsultation: 'Iniciar consulta en vivo 24/7',
      draftContract: 'Redactar contrato',
      auditRisk: 'Auditar riesgo contractual',
      statContracts: 'Contratos en el sistema',
      statVisitorsToday: 'Visitantes reales hoy',
      statSubscribers: 'Suscriptores activos',
      statLicensedEntities: 'Empresas licenciadas',
      statRiskReports: 'Auditorías de riesgo completadas',
      statAiQueries: 'Consultas jurídicas IA',
      servicesTitle: 'Directorio completo de servicios jurídicos soberanos',
      pricingTitle: 'Planes de suscripción para empresas y despachos',
      pricingSubtitle: 'Ahorre hasta un 30% con los planes soberanos de IA 2026',
      subscribeTier: 'Suscribirse al plan',
      popularBadge: '⭐ Más Popular',
      startupTierName: 'Plan Startups y Emprendedores',
      smeTierName: 'Plan Pymes y Crecimiento',
      enterpriseTierName: 'Plan Empresa Soberana',
      perMonth: '/ mes',
      adSponsorHeadline: 'Espacio reservado para patrocinios corporativos y medios',
      adSponsorSub: 'Para publicidad corporativa, patrocinios y alianzas estratégicas',
      reserveAdSpace: 'Solicitar espacio publicitario ↗',
    },
    aiHub: {
      title: 'Centro de Soluciones IA Soberanas | Google AI Pro',
      subtitle: 'Análisis jurídico predictivo avanzado conforme al Código Civil, LOPD y 9 jurisdicciones internacionales.',
      module1Name: '1. Inteligencia Predictiva M&A y Valoración',
      module1Desc: 'Evaluación de múltiplos EBITDA, detección de pasivos laborales/fiscales y gobernanza post-adquisición.',
      module2Name: '2. Agentes de Negociación IA y Cláusulas Protectoras',
      module2Desc: 'Contrapropuestas estratégicas y redacción alternativa equilibrada para desbloquear negociaciones.',
      module3Name: '3. Simulación Judicial y Probabilidad de Éxito',
      module3Desc: 'Simulación de litigios con análisis predictivo de precedentes judiciales y tasas de victoria.',
      module4Name: '4. Detección Forense de Fraude y Estilometría',
      module4Desc: 'Análisis estilométrico biométrico para detectar cláusulas manipuladas y firmas alteradas.',
      module5Name: '5. Cumplimiento Normativo y Filtrado de Sanciones',
      module5Desc: 'Cumplimiento instantáneo con RGPD, Ley Europea de IA 2024 y listas antiblanqueo GAFI/OFAC.',
      uploadDropzone: 'Arrastre su contrato aquí (PDF, Word .docx, TXT, imágenes OCR)',
      uploadSub: 'Extracción OCR multietapa de alta precisión con cifrado AES-256',
      jurisdictionLabel: 'Seleccionar jurisdicción aplicable:',
      exportWord: 'Exportar informe Word certificado (.docx)',
      exportPdf: 'Exportar PDF oficial sellado',
      selfLearningLoop: 'Sistema de autoaprendizaje continuo RLHF activo',
      executeAnalysis: 'Ejecutar análisis profundo con IA',
    },
    chat: {
      title: 'Asesor Legal IA Senior para Empresas',
      subtitle: 'Respuestas legales inmediatas y análisis normativo 24/7',
      placeholder: 'Escriba su consulta legal en cualquier idioma...',
      send: 'Enviar',
      thinking: 'Analizando normativas y precedentes judiciales...',
      newChat: 'Nueva consulta',
      exportWord: 'Exportar Word',
      exportPdf: 'Exportar PDF',
      trustBoxTitle: 'Caja de Transparencia y Confianza IA',
      statutoryBasis: 'Base Legal y Fundamentos Normativos:',
      confidenceScore: 'Índice de precisión y fiabilidad:',
    },
    risk: {
      title: 'Radar de Riesgos Contractuales y Cláusulas Abusivas',
      subtitle: 'Detección preventiva de penalizaciones, límites de responsabilidad y desequilibrios contractuales',
      pasteOrUpload: 'Pegue el texto del contrato o suba un archivo PDF/Word...',
      runAudit: 'Ejecutar auditoría de riesgo en 8 ejes',
      auditing: 'Auditando contrato en 8 vectores legales...',
      overallScore: 'Índice de salud contractual:',
      criticalFlags: 'Cláusulas críticas de alto riesgo',
      liabilityCap: 'Límite de responsabilidad e indemnización',
      arbitrationVenue: 'Sede de arbitraje y ley aplicable',
      recommendedRedlines: 'Redacciones alternativas recomendadas',
    },
    contracts: {
      title: 'Generador Soberano de Contratos Mercantiles',
      subtitle: 'Redacción de contratos a medida con bloqueo jurisdiccional y exportación instantánea',
      contractType: 'Tipo de contrato / Acuerdo',
      partyA: 'Parte A (Nombre y representación)',
      partyB: 'Parte B (Nombre y representación)',
      governingLaw: 'Ley aplicable y fuero judicial',
      generateBtn: 'Generar Smart Contract certificado',
      generating: 'Extrayendo contexto RAG y redactando...',
      exportWord: 'Descargar Word (.docx)',
      exportPdf: 'Descargar PDF',
    },
    footer: {
      independenceDisclaimer: 'Aviso oficial de independencia: JurisTech Solutions es una plataforma tecnológica 100% independiente con sede en Ammán, Jordania. Sin relación con LegalShield USA.',
      copyright: 'Todos los derechos reservados — Software LegalTech Soberano.',
      allRightsReserved: 'Todos los derechos reservados',
      ammanHq: 'Sede regional: Ammán, Reino Hachemita de Jordania',
    },
  },

  zh: {
    nav: {
      dashboard: '控制面板',
      chat: 'AI法律顾问',
      contracts: '合同生成器',
      risk: '风险雷达',
      repository: '合同知识库',
      templates: '模板工作室',
      vault: '加密保险库',
      sovereignAiHub: '⭐ Google AI Pro',
      companyFormation: '公司设立',
      enterpriseAudit: '并购尽调 (M&A)',
      negotiation: 'AI谈判模拟',
      leadRadar: 'B2B企业雷达',
      payment: '价格与方案',
      support: '技术支持',
      aboutUs: '关于我们',
      legalCompliance: '合规与治理',
      more: '更多工具',
      subscribe: '立即订阅',
      adminPanel: '👑 管理面板',
      jurisdictionLaw: '管辖法律',
      bookAdvisor: '预约法律顾问',
      themeFont: '主题与字体',
      security2FA: '2FA双重验证',
      rbacRoles: '权限管理 (RBAC)',
    },
    dashboard: {
      heroTitle: '自主AI法律智能与合同风险合规治理平台',
      heroSubtitle: '专注于发现合同漏洞、霸王条款及机构级合同起草的领先AI平台。',
      startConsultation: '开始24/7在线咨询',
      draftContract: '起草商业合同',
      auditRisk: '审计合同风险',
      statContracts: '系统合同总数',
      statVisitorsToday: '今日真实访问量',
      statSubscribers: '活跃订阅用户',
      statLicensedEntities: '授权企业客户',
      statRiskReports: '已完成风险报告',
      statAiQueries: 'AI法律咨询量',
      servicesTitle: '主权级法律服务与AI工具全景目录',
      pricingTitle: '企业与机构订阅方案',
      pricingSubtitle: '选择2026年全新主权AI年付与月付方案，立省高达30%',
      subscribeTier: '订阅方案',
      popularBadge: '⭐ 最受欢迎',
      startupTierName: '初创与微型企业方案',
      smeTierName: '中小企业与成长方案',
      enterpriseTierName: '主权级企业专属方案',
      perMonth: '/ 月',
      adSponsorHeadline: '企业赞助与媒体战略合作伙伴专属展位',
      adSponsorSub: '用于企业广告推广、赞助席位与战略媒体合作',
      reserveAdSpace: '申请广告位 ↗',
    },
    aiHub: {
      title: '主权AI解决方案中心 | Google AI Pro',
      subtitle: '支持9个国际法域的高级法律预测分析引擎，支持Word与PDF双重认证导出。',
      module1Name: '1. 并购尽调预测智能与估值分析 (M&A)',
      module1Desc: 'EBITDA倍数调整、潜在税务与劳工负债识别以及并购后治理结构建模。',
      module2Name: '2. 自主AI谈判代理人与修正条款起草',
      module2Desc: '生成战略性反制方案与平衡保护性条款，快速化解合同僵局。',
      module3Name: '3. 模拟法庭审理与胜诉率预测分析',
      module3Desc: '模拟在国际法庭及仲裁庭的抗辩流程，结合历史判例深度预测胜诉概率。',
      module4Name: '4. 文本生物计量防伪与篡改司法鉴定',
      module4Desc: '采用文本计量学 (Stylometry) 取证技术，识别恶意插入条款与篡改签名。',
      module5Name: '5. 跨国法律合规审查与制裁名单筛查',
      module5Desc: '即时筛查欧盟AI法案2024、GDPR数据保护法及国际FATF反洗钱制裁名单。',
      uploadDropzone: '将合同或文档拖放到此处（支持PDF、Word .docx、TXT、OCR扫描件）',
      uploadSub: '高精度多阶段OCR文本提取，全流程采用AES-256零知识加密',
      jurisdictionLabel: '选择适用法律管辖区：',
      exportWord: '导出认证Word报告 (.docx)',
      exportPdf: '导出官方盖印PDF文档',
      selfLearningLoop: '自主RLHF持续自我强化学习系统已激活',
      executeAnalysis: '执行深度AI主权分析',
    },
    chat: {
      title: '企业高级AI法律顾问',
      subtitle: '基于权威法典与国际商事法律的24/7即时法律咨询',
      placeholder: '请使用任意语言输入您的法律问题...',
      send: '发送',
      thinking: '正在检索法定条款与司法判例...',
      newChat: '新建咨询',
      exportWord: '导出Word',
      exportPdf: '导出PDF',
      trustBoxTitle: 'AI可信度与透明度分析框',
      statutoryBasis: '法定依据与法条索引：',
      confidenceScore: '准确度与置信度指标：',
    },
    risk: {
      title: '合同风险雷达与责任漏洞审计',
      subtitle: '前瞻性识别违约金陷阱、无限责任及不平等霸王条款',
      pasteOrUpload: '粘贴合同文本或上传PDF/Word文件进行即时审计...',
      runAudit: '执行全方位8轴风险审计',
      auditing: '正在对合同进行8个法律维度的全面审查...',
      overallScore: '合同健康度指数：',
      criticalFlags: '严重高风险条款',
      liabilityCap: '责任上限与赔偿阈值',
      arbitrationVenue: '仲裁地与管辖法律',
      recommendedRedlines: '推荐保护性替代条款',
    },
    contracts: {
      title: '主权级商事合同智能生成器',
      subtitle: '定制化机构合同起草，支持管辖权锁定与即时双格式导出',
      contractType: '合同类型 / 协议名称',
      partyA: '甲方（主体名称与法定资质）',
      partyB: '乙方（主体名称与法定资质）',
      governingLaw: '适用法律与管辖法院',
      generateBtn: '生成认证智能合同',
      generating: '正在提取RAG法定上下文并起草...',
      exportWord: '下载Word文档 (.docx)',
      exportPdf: '下载PDF文档',
    },
    footer: {
      independenceDisclaimer: '官方独立声明：JurisTech Solutions 是一家总部设在约旦安曼的100%独立主权科技平台。与美国LegalShield公司或其他商标实体无任何关联。',
      copyright: '版权所有 — 主权法律科技软件系统。',
      allRightsReserved: '版权所有',
      ammanHq: '区域总部：约旦哈希姆王国 - 安曼',
    },
  },

  tr: {
    nav: {
      dashboard: 'Kontrol Paneli',
      chat: 'Yapay Zeka Hukuk Danışmanı',
      contracts: 'Sözleşme Oluşturucu',
      risk: 'Risk Radarı',
      repository: 'Sözleşme Deposu',
      templates: 'Şablon Stüdyosu',
      vault: 'Şifreli Kasa',
      sovereignAiHub: '⭐ Google AI Pro',
      companyFormation: 'Şirket Kuruluşu',
      enterpriseAudit: 'Şirket Birleşme Denetimi (M&A)',
      negotiation: 'Yapay Zeka Müzakere',
      leadRadar: 'B2B Şirket Radarı',
      payment: 'Fiyatlandırma & Paketler',
      support: 'Destek & Yardım',
      aboutUs: 'Hakkımızda',
      legalCompliance: 'Uyumluluk & KVKK',
      more: 'Diğer Araçlar',
      subscribe: 'Abone Ol',
      adminPanel: '👑 Yönetici Paneli',
      jurisdictionLaw: 'Yargı Yetkisi & Hukuk',
      bookAdvisor: 'Danışman Randevusu',
      themeFont: 'Tema & Yazı Tipleri',
      security2FA: '2FA Güvenlik',
      rbacRoles: 'Rol Yönetimi (RBAC)',
    },
    dashboard: {
      heroTitle: 'Otonom Yapay Zeka Hukuk Zekası ve Sözleşme Risk Yönetimi',
      heroSubtitle: 'Sözleşme açıklarını, haksız şartları ve kurumsal sözleşme taslaklarını tespit eden lider yapay zeka platformu.',
      startConsultation: '7/24 Canlı Danışmanlık Başlat',
      draftContract: 'Ticari Sözleşme Hazırla',
      auditRisk: 'Sözleşme Riskini Denetle',
      statContracts: 'Sistemdeki Toplam Sözleşme',
      statVisitorsToday: 'Bugünkü Gerçek Ziyaretçiler',
      statSubscribers: 'Aktif Aboneler',
      statLicensedEntities: 'Lisanslı Şirketler',
      statRiskReports: 'Tamamlanan Risk Raporları',
      statAiQueries: 'Yapay Zeka Hukuk Sorguları',
      servicesTitle: 'Eksiksiz Hukuk Hizmetleri ve Araçları Dizini',
      pricingTitle: 'Kurumsal Abonelik Paketleri',
      pricingSubtitle: 'Güncellenen 2026 Egemen Yapay Zeka paketleriyle %30’a varan tasarruf sağlayın',
      subscribeTier: 'Pakete Abone Ol',
      popularBadge: '⭐ En Popüler',
      startupTierName: 'Girişim & Mikro Paket',
      smeTierName: 'KOBİ & Büyüme Paketi',
      enterpriseTierName: 'Kurumsal Egemen Paket',
      perMonth: '/ ay',
      adSponsorHeadline: 'Kurumsal Sponsorluk ve Medya Ortaklığı Alanı',
      adSponsorSub: 'Kurumsal reklamlar, sponsorluk yerleşimleri ve medya iş birlikleri için',
      reserveAdSpace: 'Reklam Alanı Talep Et ↗',
    },
    aiHub: {
      title: 'Egemen Yapay Zeka Çözüm Merkezi | Google AI Pro',
      subtitle: '9 uluslararası yargı yetkisinde gelişmiş hukuki analiz ve Word/PDF onaylı dışa aktarma.',
      module1Name: '1. Tahmine Dayalı M&A ve Şirket Değerleme',
      module1Desc: 'FAVÖK çarpan analizleri, gizli vergi ve iş hukuku yükümlülükleri tespiti ve birleşme sonrası yönetişim.',
      module2Name: '2. Otonom Yapay Zeka Müzakere ve Koruyucu Maddeler',
      module2Desc: 'Sözleşme kilitlenmelerini aşmak için stratejik karşı teklifler ve dengeli koruyucu maddeler.',
      module3Name: '3. Mahkeme Simülasyonu ve Dava Kazanma Olasılığı',
      module3Desc: 'Uluslararası mahkemelerde duruşma simülasyonu ve emsal kararlara dayalı kazanma oranı analizi.',
      module4Name: '4. Adli Sahtecilik ve Metin Biyometrisi Tespiti',
      module4Desc: 'İzinsiz eklenen maddeleri ve değiştirilmiş imzaları tespit etmek için biyometrik stilometri analizi.',
      module5Name: '5. Sınır Ötesi Mevzuat Uyumu ve Yaptırım Taraması',
      module5Desc: 'KVKK, GDPR, AB Yapay Zeka Yasası 2024 ve uluslararası FATF/OFAC kara para aklama listelerine uyum.',
      uploadDropzone: 'Sözleşmenizi veya belgenizi buraya sürükleyin (PDF, Word .docx, TXT, OCR)',
      uploadSub: 'AES-256 uçtan uca şifreleme ile yüksek hassasiyetli çok aşamalı OCR çıkarma',
      jurisdictionLabel: 'Geçerli Hukuk Sistemini Seçin:',
      exportWord: 'Onaylı Word Raporu İndir (.docx)',
      exportPdf: 'Resmi Mühürlü PDF İndir',
      selfLearningLoop: 'Otonom RLHF Sürekli Kendi Kendine Öğrenme Sistemi Aktif',
      executeAnalysis: 'Derin Yapay Zeka Analizini Başlat',
    },
    chat: {
      title: 'Kurumsal Kıdemli Yapay Zeka Hukuk Danışmanı',
      subtitle: 'Türk Hukuku (TTK, TBK) ve uluslararası mevzuata dayalı 7/24 anlık hukuki danışmanlık',
      placeholder: 'Hukuki sorunuzu dilediğiniz dilde yazın...',
      send: 'Gönder',
      thinking: 'Mevzuat ve yargı kararları taranıyor...',
      newChat: 'Yeni Danışmanlık',
      exportWord: 'Word İndir',
      exportPdf: 'PDF İndir',
      trustBoxTitle: 'Yapay Zeka Güven ve Şeffaflık Kutusu',
      statutoryBasis: 'Yasal Dayanak ve Madde Referansları:',
      confidenceScore: 'Doğruluk ve Güvenilirlik Endeksi:',
    },
    risk: {
      title: 'Sözleşme Risk Radarı ve Sorumluluk Açığı Denetimi',
      subtitle: 'Cezai şartlar, sınırsız sorumluluklar ve haksız şartların önceden tespiti',
      pasteOrUpload: 'Sözleşme metnini yapıştırın veya PDF/Word dosyası yükleyin...',
      runAudit: '8 Eksenli Risk Denetimini Başlat',
      auditing: 'Sözleşme 8 hukuki risk vektöründe denetleniyor...',
      overallScore: 'Sözleşme Sağlık Skoru:',
      criticalFlags: 'Kritik Yüksek Riskli Maddeler',
      liabilityCap: 'Sorumluluk Sınırı ve Tazminat Eşiği',
      arbitrationVenue: 'Tahkim Yeri ve Uygulanacak Hukuk',
      recommendedRedlines: 'Önerilen Koruyucu Düzeltmeler',
    },
    contracts: {
      title: 'Egemen Ticari Sözleşme Oluşturucu',
      subtitle: 'Yargı yetkisi kilitlemeli ve anında dışa aktarmalı özel kurumsal sözleşme hazırlama',
      contractType: 'Sözleşme Türü / Anlaşma',
      partyA: 'Taraf A (Ad ve Sıfat)',
      partyB: 'Taraf B (Ad ve Sıfat)',
      governingLaw: 'Uygulanacak Hukuk ve Yetkili Mahkeme',
      generateBtn: 'Onaylı Akıllı Sözleşmeyi Oluştur',
      generating: 'RAG mevzuat bağlamı alınıyor ve taslak hazırlanıyor...',
      exportWord: 'Word İndir (.docx)',
      exportPdf: 'PDF İndir',
    },
    footer: {
      independenceDisclaimer: 'Resmi Bağımsızlık Bildirimi: JurisTech Solutions, merkezi Ürdün’ün Amman kentinde bulunan %100 bağımsız egemen bir teknoloji platformudur. LegalShield USA ile hiçbir bağı yoktur.',
      copyright: 'Tüm Hakları Saklıdır — Egemen LegalTech Yazılımı.',
      allRightsReserved: 'Tüm Hakları Saklıdır',
      ammanHq: 'Bölgesel Merkez: Amman, Ürdün Haşimi Krallığı',
    },
  },
};

/**
 * Hook to retrieve current 7-language localized UI dictionary with instantaneous reactivity
 */
export function getActiveGlobalTranslations(lang?: string): GlobalUITexts {
  const code = normalizeLanguage(lang);
  return GLOBAL_TRANSLATIONS[code] || GLOBAL_TRANSLATIONS.en;
}
