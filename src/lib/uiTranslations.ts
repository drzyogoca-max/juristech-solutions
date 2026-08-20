/**
 * src/lib/uiTranslations.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive Multilingual UI & Modal Localization Dictionary for JurisTech Solutions
 * 
 * Supports:
 *   • ar (العربية)
 *   • en (English)
 *   • fr (Français)
 *   • de (Deutsch)
 *   • es (Español)
 *   • zh (中文)
 *   • tr (Türkçe)
 */

export type AppLang = 'ar' | 'en' | 'fr' | 'de' | 'es' | 'zh' | 'tr';

export interface ModalTranslations {
  leadCapture: {
    welcomeTitle: string;
    welcomeSub: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    skipBtn: string;
    closeTooltip: string;
  };
  jurisdiction: {
    advisorBadge: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    arbitration: string;
    grounding: string;
    close: string;
    closeAria: string;
  };
  consultation: {
    badge: string;
    headerBadge: string;
    title: string;
    subtitle: string;
    selectAdvisor: string;
    consultationType: string;
    typeEmail: string;
    typeVideo: string;
    typeAudit: string;
    fullName: string;
    email: string;
    phone: string;
    company: string;
    preferredDate: string;
    preferredTime: string;
    subjectDetails: string;
    subjectPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successSub: string;
    bookingRef: string;
    closeBtn: string;
    closeAria: string;
    confirmedTitle: string;
    confirmedDesc: string;
    doneBtn: string;
  };
  chatbot: {
    triggerBtn: string;
    headerTitle: string;
    connectedStatus: string;
    inputPlaceholder: string;
    sendTooltip: string;
    attachTooltip: string;
    nextStepTitle: string;
    nextStepDesc: string;
    bookConsultationBtn: string;
    upgradePlanBtn: string;
    signContractBtn: string;
    quickQueriesTitle: string;
    typingIndicator: string;
    extractingDoc: string;
    docReady: string;
    actionRiskAudit: string;
    actionLiability: string;
    actionArbitration: string;
    actionRedlines: string;
    qRiskAudit: string;
    qLiability: string;
    qArbitration: string;
    qRedlines: string;
    pills: { label: string; query: string }[];
  };
  companyProfile: {
    badge: string;
    title: string;
    subtitle: string;
    tabGeneral: string;
    tabSignatory: string;
    tabTax: string;
    companyName: string;
    crNumber: string;
    taxNumber: string;
    jurisdiction: string;
    signatoryName: string;
    signatoryTitle: string;
    signatoryEmail: string;
    saveBtn: string;
    savedSuccess: string;
    closeBtn: string;
  };
  binancePay: {
    badge: string;
    title: string;
    subtitle: string;
    networkLabel: string;
    addressLabel: string;
    copyAddress: string;
    copied: string;
    txIdLabel: string;
    txIdPlaceholder: string;
    uploadProof: string;
    confirmBtn: string;
    confirmingBtn: string;
    securityNote: string;
    successTitle: string;
    successSub: string;
    closeBtn: string;
  };
  themeFont: {
    title: string;
    subtitle: string;
    themeLabel: string;
    fontLabel: string;
    previewText: string;
    applyBtn: string;
    resetBtn: string;
    closeBtn: string;
  };
  liveMeeting: {
    badge: string;
    title: string;
    subtitle: string;
    roomIdLabel: string;
    copyLink: string;
    linkCopied: string;
    joinBtn: string;
    closeBtn: string;
  };
}

export const UI_TRANSLATIONS: Record<AppLang, ModalTranslations> = {
  ar: {
    leadCapture: {
      welcomeTitle: 'مرحباً بك في منصة JurisTech',
      welcomeSub: 'سجّل بريدك الرسمي للحصول على استشارات ذكية مجانية وتحديثات العقود، أو تابع التصفح واستكشاف الأدوات بحرية.',
      fullNameLabel: 'الاسم الكامل',
      fullNamePlaceholder: 'مثال: د. محمد مصطفى',
      emailLabel: 'البريد الإلكتروني الرسمي',
      emailPlaceholder: 'name@company.com',
      submitBtn: 'تسجيل وبدء الاستخدام',
      submittingBtn: 'جارٍ تسجيل البيانات...',
      skipBtn: '← تخطي ومتابعة التصفح كزائر مجاناً',
      closeTooltip: 'إغلاق ومتابعة كزائر',
    },
    jurisdiction: {
      advisorBadge: 'المستشار التشريعي الدولي المباشر (35+ دولة)',
      title: 'اختر الاختصاص القضائي والنظام القانوني',
      description: 'حدد الدولة أو الولاية لتكييف صياغة العقود وتدقيق المخاطر والتحكيم وفق نصوصها القانونية المعتمدة.',
      searchPlaceholder: 'بحث حسب اسم الدولة، القانون، أو العملة (مثال: مصر، Saudi, AED, USD)...',
      arbitration: 'مقر وهيئة التحكيم',
      grounding: 'تأصيل قانوني معتمد ومحدث لعام 2026',
      close: 'إغلاق',
      closeAria: 'إغلاق نافذة اختيار الدولة',
    },
    consultation: {
      badge: 'حجز جلسات الاستشارة عبر البريد والمستشار القانوني',
      headerBadge: 'حجز استشارة قانونية مع المستشار المتخصص',
      title: 'طلب استشارة استراتيجية وحوكمة مخاطر مخصصة',
      subtitle: 'تواصل مباشرة مع المستشار الاستراتيجي لحوكمة الصفقات وتدقيق المخاطر القانونية والنزاعات الدولية.',
      selectAdvisor: 'المستشار القانوني المعتمد',
      consultationType: 'نوع الاستشارة المطلوبة',
      typeEmail: '📧 رأي ومذكرة قانونية مكتوبة وموثقة',
      typeVideo: '📹 جلسة فيديو مباشرة واستراتيجية (45 دقيقة)',
      typeAudit: '⚡ تدقيق فوري ومراجعة بنود صفقة طارئة',
      fullName: 'الاسم الكامل للمستفيد',
      email: 'البريد الإلكتروني المؤسسي',
      phone: 'رقم الهاتف / الواتساب',
      company: 'اسم الشركة / المؤسسة',
      preferredDate: 'التاريخ المفضل للجلسة',
      preferredTime: 'الوقت المفضل',
      subjectDetails: 'ملخص موضوع الاستشارة أو العقد محل المراجعة',
      subjectPlaceholder: 'اشرح بإيجاز طبيعة الاستفسار أو الأطراف المعنية أو البنود المراد تدقيقها...',
      submitBtn: 'تأكيد وإرسال طلب الاستشارة الرسمية',
      submittingBtn: 'جارٍ إرسال الطلب وحجز الموعد...',
      successTitle: 'تم استلام طلب الاستشارة بنجاح!',
      successSub: 'تم تسجيل موعدك وسيتم التواصل معك مباشرة عبر البريد الإلكتروني والواتساب لتزويدك بالمذكرة والرابط.',
      bookingRef: 'رقم المرجع:',
      closeBtn: 'إغلاق النافذة',
      closeAria: 'إغلاق نافذة حجز الاستشارة',
      confirmedTitle: 'تم تأكيد حجز الجلسة وإرسال الإشعار المباشر!',
      confirmedDesc: 'تم إرسال تفاصيل الطلب مباشرة إلى البريد الإلكتروني الرسمي وبريد العميل. سيتم الرد المباشر بتقرير الرأي القانوني.',
      doneBtn: 'تم',
    },
    chatbot: {
      triggerBtn: 'المساعد التشريعي المباشر',
      headerTitle: 'المساعد التشريعي المباشر',
      connectedStatus: 'Gemini AI متصل ويعمل مباشرة',
      inputPlaceholder: 'اكتب استفسارك القانوني بأي لغة...',
      sendTooltip: 'إرسال الاستفسار',
      attachTooltip: 'إرفاق عقد أو مستند (PDF / DOCX / TXT)',
      nextStepTitle: 'الخطوة التالية للتحليل القانوني:',
      nextStepDesc: 'يمكنك الآن الانتقال لحجز استشارة قانونية مخصصة، ترقية خطتك للوصول غير المحدود، أو تصدير وتوقيع عقدك الموثق.',
      bookConsultationBtn: '⚡ حجز استشارة قانونية مخصصة',
      upgradePlanBtn: 'ترقية الاشتراك',
      signContractBtn: 'توقيع العقد',
      quickQueriesTitle: '💡 استفسارات قانونية شائعة:',
      typingIndicator: 'جاري التحليل القانوني المعمق وصياغة الرد الاحترافي...',
      extractingDoc: 'جاري قراءة واستخراج المستند...',
      docReady: 'جاهز للتدقيق',
      actionRiskAudit: '🔍 تدقيق شامل للمخاطر',
      actionLiability: '💰 فحص سقف المسؤولية',
      actionArbitration: '⚖️ التحكيم والقانون الحاكم',
      actionRedlines: '📝 صياغة بنود بديلة حمائية',
      qRiskAudit: 'يرجى إجراء تدقيق شامل لكافة مخاطر هذا العقد وكشف الثغرات والشروط المجحفة.',
      qLiability: 'يرجى فحص سقف المسؤولية والشرط الجزائي والتعويضات بهذا العقد.',
      qArbitration: 'يرجى مراجعة شرط فض النزاعات والتحكيم والقانون الحاكم وتوافقه مع المعايير الدولية.',
      qRedlines: 'يرجى تزويدي بصياغات بديلة وحمائية للبنود الخطرة في هذا العقد لتعديلها فوراً.',
      pills: [
        { label: '📄 توافق ملفات Word والاتجاهات', query: 'هل ملفات الورد (Word .docx) المستخرجة متوافقة مع الاتجاهات اللغوية (RTL/LTR) وخالية من الفراغات؟' },
        { label: '💳 تفعيل اشتراك الشركات SWIFT', query: 'كيف أفعّل اشتراك الشركات الكبرى والتحويل البنكي المباشر SWIFT؟' },
        { label: '🏢 تأسيس شركة LLC', query: 'ما هي المتطلبات القانونية والخطوات لتأسيس شركة ذات مسؤولية محدودة؟' },
        { label: '🛡️ شرط القوة القاهرة', query: 'كيف أصيغ بند القوة القاهرة والظروف الطارئة وفق معايير ICC 2020؟' },
        { label: '💼 إنهاء عقد العمل', query: 'ما هي الإجراءات القانونية الصحيحة لإنهاء عقد العمل دون تعويضات تعسفية؟' },
        { label: '🔒 اتفاقية السرية NDA', query: 'ما هي البنود الجوهرية في اتفاقية عدم الإفصاح وحماية الأسرار التجارية؟' },
      ],
    },
    companyProfile: {
      badge: 'ملف المنشأة والتوثيق',
      title: 'بيانات الشركة والملف القانوني',
      subtitle: 'سجّل بيانات شركتك لدمجها تلقائياً في ديباجة العقود والفواتير والتوقيعات الرقمية.',
      tabGeneral: 'البيانات العامة',
      tabSignatory: 'المفوض بالتوقيع',
      tabTax: 'البيانات الضريبية',
      companyName: 'اسم الشركة الرسمي',
      crNumber: 'رقم السجل التجاري',
      taxNumber: 'الرقم الضريبي (VAT)',
      jurisdiction: 'دولة التأسيس والقانون الحاكم',
      signatoryName: 'اسم المفوض بالتوقيع',
      signatoryTitle: 'الصفة / المنصب',
      signatoryEmail: 'البريد الإلكتروني المعتمد للمفوض',
      saveBtn: 'حفظ وتحديث ملف الشركة',
      savedSuccess: 'تم حفظ وتحديث بيانات الشركة بنجاح!',
      closeBtn: 'إغلاق',
    },
    binancePay: {
      badge: 'دفع مشفر آمن وسريع',
      title: 'الدفع عبر العملات الرقمية المشفرة (Binance Pay / USDT)',
      subtitle: 'اختر الشبكة المناسبة وحوّل المبلغ المطلوب ثم أدخل رقم المعاملة (TxID) للتفعيل الفوري.',
      networkLabel: 'الشبكة المعتمدة (Network)',
      addressLabel: 'عنوان المحفظة (Wallet Address)',
      copyAddress: 'نسخ العنوان',
      copied: 'تم النسخ!',
      txIdLabel: 'رقم المعاملة / الهاش (Transaction Hash / TxID)',
      txIdPlaceholder: 'أدخل رقم المعاملة من منصة بينانس أو محفظتك...',
      uploadProof: 'إرفاق صورة إشعار التحويل (اختياري)',
      confirmBtn: 'تأكيد عملية التحويل وتفعيل الباقة',
      confirmingBtn: 'جارٍ التحقق من التحويل وتفعيل الحساب...',
      securityNote: 'يتم التحقق من الحوالات آلياً خلال دقائق وتفعيل حسابك والاشتراك فوراً.',
      successTitle: 'تم تسجيل عملية الدفع بنجاح!',
      successSub: 'تم تفعيل حسابك وإرسال إشعار التأكيد، يمكنك الآن استخدام كافة أدوات المنصة.',
      closeBtn: 'إغلاق النافذة',
    },
    themeFont: {
      title: 'تخصيص المظهر ونمط الخطوط',
      subtitle: 'اختر السمة البصرية والخط المفضل لك لتخصيص تجربة القراءة وتصفح المستندات.',
      themeLabel: 'السمة البصرية (Color Palette)',
      fontLabel: 'نمط الخط (Typography)',
      previewText: 'معاينة: منصة JurisTech Solutions للذكاء الاصطناعي القانوني وصياغة العقود وتدقيق المخاطر.',
      applyBtn: 'تطبيق الإعدادات',
      resetBtn: 'استعادة الافتراضي',
      closeBtn: 'إغلاق',
    },
    liveMeeting: {
      badge: 'غرفة استشارات مباشرة مشفرة',
      title: 'جلسة استشارة ومفاوضات مرئية مباشرة',
      subtitle: 'انضم لغرفة الاجتماع المرئي المشفرة مع المستشار القانوني لمراجعة وتوقيع العقود لحظياً.',
      roomIdLabel: 'معرّف غرفة الاجتماع (Room ID)',
      copyLink: 'نسخ رابط الغرفة',
      linkCopied: 'تم نسخ الرابط بنجاح!',
      joinBtn: '🚀 الانضمام إلى الاجتماع الآن',
      closeBtn: 'إغلاق',
    },
  },

  en: {
    leadCapture: {
      welcomeTitle: 'Welcome to JurisTech Platform',
      welcomeSub: 'Register your official email for free smart consultations & contract updates, or continue exploring the platform.',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g. Dr. Mohammed Mostafa',
      emailLabel: 'Official Email',
      emailPlaceholder: 'name@company.com',
      submitBtn: 'Register & Get Started',
      submittingBtn: 'Registering...',
      skipBtn: '← Skip and continue exploring as guest',
      closeTooltip: 'Close and explore as guest',
    },
    jurisdiction: {
      advisorBadge: 'International Legislative Advisor (>35 Countries)',
      title: 'Select Jurisdiction & Legal Framework',
      description: 'Choose your governing country or US state to tailor contract drafting, statutory risk audits, and arbitration to local law.',
      searchPlaceholder: 'Search by country name, code, or currency (e.g. Saudi, Egypt, EUR, USD)...',
      arbitration: 'Arbitration Seat & Body',
      grounding: 'Verified & Certified 2026 Statutory Framework',
      close: 'Close',
      closeAria: 'Close jurisdiction modal',
    },
    consultation: {
      badge: 'Advisor Email & Live Consultation Booking',
      headerBadge: 'Advisor Email & Live Consultation Booking',
      title: 'Strategic Legal Consultation & Risk Governance Request',
      subtitle: 'Connect directly with senior strategic advisors for cross-border deal structuring, regulatory risk audits, and dispute resolution.',
      selectAdvisor: 'Certified Legal Advisor',
      consultationType: 'Consultation Format',
      typeEmail: '📧 Formal Written Legal Memorandum & Audit',
      typeVideo: '📹 Live Strategic Video Session (45 Minutes)',
      typeAudit: '⚡ Emergency Deal Term-Sheet & Redline Audit',
      fullName: 'Client Full Name',
      email: 'Corporate Email',
      phone: 'Phone / WhatsApp',
      company: 'Company / Organization',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time',
      subjectDetails: 'Consultation Brief & Document Context',
      subjectPlaceholder: 'Briefly describe your legal inquiry, parties involved, or key contract clauses to audit...',
      submitBtn: 'Confirm & Submit Consultation Request',
      submittingBtn: 'Dispatching request and booking slot...',
      successTitle: 'Consultation Request Received!',
      successSub: 'Your booking has been registered. You will receive direct confirmation via email & WhatsApp with the meeting link.',
      bookingRef: 'Reference ID:',
      closeBtn: 'Close Window',
      closeAria: 'Close booking modal',
      confirmedTitle: 'Consultation Booking Confirmed & Dispatched!',
      confirmedDesc: 'Booking details dispatched to official inbox and client email. The advisor will review your case and respond directly.',
      doneBtn: 'Done',
    },
    chatbot: {
      triggerBtn: 'Live AI Legal Assistant',
      headerTitle: 'JurisTech Live AI Concierge',
      connectedStatus: 'Gemini AI Connected & Live',
      inputPlaceholder: 'Type your legal query in any language...',
      sendTooltip: 'Send Query',
      attachTooltip: 'Attach Document (PDF / DOCX / TXT)',
      nextStepTitle: 'Next Action for Legal Audit:',
      nextStepDesc: 'Proceed to book a dedicated legal consultation, upgrade to an unlimited plan, or export and sign your certified contract.',
      bookConsultationBtn: '⚡ Book Legal Consultation',
      upgradePlanBtn: 'Upgrade Plan',
      signContractBtn: 'Sign Contract',
      quickQueriesTitle: '💡 Quick Legal Queries:',
      typingIndicator: 'Deep legal analysis & drafting response...',
      extractingDoc: 'Extracting Document Text...',
      docReady: 'Ready for Audit',
      actionRiskAudit: '🔍 Full Risk Audit',
      actionLiability: '💰 Liability & Penalties',
      actionArbitration: '⚖️ Arbitration & Law',
      actionRedlines: '📝 Redlines & Rewrites',
      qRiskAudit: 'Please perform a comprehensive risk audit on this contract and reveal hidden loopholes and unfair clauses.',
      qLiability: 'Please inspect liability caps, liquidated damages, and indemnification terms in this agreement.',
      qArbitration: 'Please review dispute resolution, governing law, and arbitration clauses against international standards.',
      qRedlines: 'Please provide protective alternative redline clauses for all risky provisions in this contract.',
      pills: [
        { label: '📄 Word Export & RTL/LTR Precision', query: 'Are Word (.docx) file downloads 100% compliant with language direction (RTL/LTR) and zero whitespace gaps?' },
        { label: '💳 Enterprise Subscriptions & SWIFT', query: 'How do I activate Enterprise subscriptions and direct SWIFT wire transfers?' },
        { label: '🏢 LLC Incorporation', query: 'What are the legal steps and statutory requirements to incorporate an LLC?' },
        { label: '🛡️ Force Majeure Clause', query: 'How do I draft a robust Force Majeure & Hardship clause under ICC 2020 rules?' },
        { label: '💼 Employment Termination', query: 'What are the lawful procedures for employee termination without unjust dismissal liability?' },
        { label: '🔒 Non-Disclosure (NDA)', query: 'What are the essential protective clauses in a mutual Non-Disclosure Agreement?' },
      ],
    },
    companyProfile: {
      badge: 'Corporate Profile & Verification',
      title: 'Company Details & Legal Profile',
      subtitle: 'Save your corporate metadata to automatically populate contracts, invoices, and digital signatures.',
      tabGeneral: 'General Info',
      tabSignatory: 'Signatory',
      tabTax: 'Tax & VAT',
      companyName: 'Official Legal Entity Name',
      crNumber: 'Commercial Registration (CR / Reg No.)',
      taxNumber: 'Tax ID / VAT Registration',
      jurisdiction: 'Incorporation Country & Governing Law',
      signatoryName: 'Authorized Signatory Name',
      signatoryTitle: 'Designation / Title',
      signatoryEmail: 'Signatory Official Email',
      saveBtn: 'Save & Update Profile',
      savedSuccess: 'Company profile updated successfully!',
      closeBtn: 'Close',
    },
    binancePay: {
      badge: 'Fast & Secure Crypto Payment',
      title: 'Pay via Cryptocurrency (Binance Pay / USDT)',
      subtitle: 'Select network, transfer the designated amount, and enter your Transaction Hash (TxID) for instant activation.',
      networkLabel: 'Supported Network',
      addressLabel: 'Wallet Address',
      copyAddress: 'Copy Address',
      copied: 'Copied!',
      txIdLabel: 'Transaction Hash / TxID',
      txIdPlaceholder: 'Paste TxID from Binance or wallet...',
      uploadProof: 'Upload Payment Receipt (Optional)',
      confirmBtn: 'Confirm Payment & Activate Plan',
      confirmingBtn: 'Verifying transaction and activating...',
      securityNote: 'Transfers are verified automatically within minutes, activating your full platform subscription.',
      successTitle: 'Payment Recorded Successfully!',
      successSub: 'Your account has been activated and a confirmation notice has been sent. You now have unlimited access.',
      closeBtn: 'Close Window',
    },
    themeFont: {
      title: 'Customize Theme & Typography',
      subtitle: 'Select your preferred visual style and reading font for tailored legal document inspection.',
      themeLabel: 'Visual Theme',
      fontLabel: 'Typography Style',
      previewText: 'Preview: JurisTech Solutions Sovereign AI Legal Intelligence & Risk Audit Platform.',
      applyBtn: 'Apply Settings',
      resetBtn: 'Reset to Default',
      closeBtn: 'Close',
    },
    liveMeeting: {
      badge: 'Encrypted Live Consultation Room',
      title: 'Live Video Negotiation & Advisory Room',
      subtitle: 'Join the end-to-end encrypted video session with senior legal counsel to review and execute agreements in real time.',
      roomIdLabel: 'Meeting Room ID',
      copyLink: 'Copy Meeting Link',
      linkCopied: 'Link copied successfully!',
      joinBtn: '🚀 Join Live Meeting Now',
      closeBtn: 'Close',
    },
  },

  fr: {
    leadCapture: {
      welcomeTitle: 'Bienvenue sur JurisTech Solutions',
      welcomeSub: 'Enregistrez votre e-mail officiel pour des consultations IA gratuites et des mises à jour juridiques, ou continuez votre visite.',
      fullNameLabel: 'Nom complet',
      fullNamePlaceholder: 'ex. Dr. Mohammed Mostafa',
      emailLabel: 'E-mail professionnel',
      emailPlaceholder: 'nom@entreprise.com',
      submitBtn: 'S’inscrire et commencer',
      submittingBtn: 'Enregistrement en cours...',
      skipBtn: '← Ignorer et explorer en tant qu’invité',
      closeTooltip: 'Fermer et explorer en tant qu’invité',
    },
    jurisdiction: {
      advisorBadge: 'Conseiller Législatif International (35+ pays)',
      title: 'Sélectionner la juridiction et le cadre légal',
      description: 'Choisissez votre pays ou état régissant pour adapter la rédaction des contrats et l’audit des risques aux lois en vigueur.',
      searchPlaceholder: 'Rechercher par pays, code ou devise (ex. France, Suisse, EUR, USD)...',
      arbitration: 'Siège & Chambre d’arbitrage',
      grounding: 'Ancrage juridique certifié 2026',
      close: 'Fermer',
      closeAria: 'Fermer le sélecteur de juridiction',
    },
    consultation: {
      badge: 'Réservation de Consultation Juridique Stratégique',
      title: 'Demande de consultation et gouvernance des risques',
      subtitle: 'Échangez directement avec des conseillers stratégiques pour la structuration de vos accords et la gestion des litiges internationaux.',
      selectAdvisor: 'Conseiller Juridique Agréé',
      consultationType: 'Format de consultation',
      typeEmail: '📧 Mémorandum juridique formel écrit et certifié',
      typeVideo: '📹 Session vidéo stratégique en direct (45 minutes)',
      typeAudit: '⚡ Audit d’urgence et révision des clauses critiques',
      fullName: 'Nom complet du bénéficiaire',
      email: 'E-mail professionnel',
      phone: 'Téléphone / WhatsApp',
      company: 'Société / Organisation',
      preferredDate: 'Date souhaitée',
      preferredTime: 'Heure souhaitée',
      subjectDetails: 'Contexte et objet de la consultation',
      subjectPlaceholder: 'Décrivez brièvement votre demande, les parties concernées ou les clauses à examiner...',
      submitBtn: 'Confirmer et envoyer la demande',
      submittingBtn: 'Envoi de la demande et réservation...',
      successTitle: 'Demande de consultation reçue !',
      successSub: 'Votre rendez-vous a été enregistré. Une confirmation vous sera transmise par e-mail et WhatsApp avec le lien d’accès.',
      bookingRef: 'Référence :',
      closeBtn: 'Fermer la fenêtre',
      closeAria: 'Fermer la fenêtre de réservation',
      headerBadge: 'Réservation de Consultation Juridique en direct',
      confirmedTitle: 'Réservation confirmée et envoyée !',
      confirmedDesc: 'Les détails ont été transmis à notre boîte officielle et au client. Le conseiller examinera votre dossier et répondra directement.',
      doneBtn: 'Terminé',
    },
    chatbot: {
      triggerBtn: 'Assistant Juridique IA en direct',
      headerTitle: 'JurisTech Concierge IA en direct',
      connectedStatus: 'Gemini IA connecté et actif',
      inputPlaceholder: 'Posez votre question juridique en toute langue...',
      sendTooltip: 'Envoyer la question',
      attachTooltip: 'Joindre un document (PDF / DOCX / TXT)',
      nextStepTitle: 'Action suivante pour l’audit juridique :',
      nextStepDesc: 'Réservez une consultation dédiée, passez au forfait illimité ou exportez et signez votre contrat certifié.',
      bookConsultationBtn: '⚡ Réserver une consultation',
      upgradePlanBtn: 'Mettre à niveau',
      signContractBtn: 'Signer le contrat',
      quickQueriesTitle: '💡 Requêtes juridiques rapides :',
      typingIndicator: 'Analyse juridique approfondie et rédaction de la réponse en cours...',
      extractingDoc: 'Extraction du texte du document...',
      docReady: 'Prêt pour l’audit',
      actionRiskAudit: '🔍 Audit complet des risques',
      actionLiability: '💰 Responsabilité et pénalités',
      actionArbitration: '⚖️ Arbitrage et loi applicable',
      actionRedlines: '📝 Clauses protectrices alternatives',
      qRiskAudit: 'Veuillez effectuer un audit complet des risques sur ce contrat et déceler les failles et clauses abusives.',
      qLiability: 'Veuillez inspecter les plafonds de responsabilité, clauses pénales et indemnités dans cet accord.',
      qArbitration: 'Veuillez réviser les clauses de règlement des différends, droit applicable et arbitrage aux normes internationales.',
      qRedlines: 'Veuillez fournir des rédactions de clauses alternatives et protectrices pour ce contrat.',
      pills: [
        { label: '🏢 Création de Société (SAS/SARL)', query: 'Quelles sont les démarches légales et obligations pour créer une société ?' },
        { label: '🛡️ Clause de Force Majeure', query: 'Comment rédiger une clause de force majeure et imprévision conforme à la CCI 2020 ?' },
        { label: '💼 Rupture de Contrat de Travail', query: 'Quelles sont les procédures légales de rupture sans indemnités abusives ?' },
        { label: '🔒 Accord de Confidentialité (NDA)', query: 'Quelles sont les clauses indispensables dans un accord de non-divulgation ?' },
      ],
    },
    companyProfile: {
      badge: 'Profil d’Entreprise et Vérification',
      title: 'Coordonnées de l’entreprise et profil juridique',
      subtitle: 'Enregistrez les informations de votre société pour les insérer automatiquement dans vos contrats et factures.',
      tabGeneral: 'Informations Générales',
      tabSignatory: 'Signataire Autorisé',
      tabTax: 'Fiscalité & TVA',
      companyName: 'Raison sociale officielle',
      crNumber: 'Numéro SIREN / Registre du commerce',
      taxNumber: 'Numéro de TVA intracommunautaire',
      jurisdiction: 'Pays d’immatriculation et droit applicable',
      signatoryName: 'Nom du signataire autorisé',
      signatoryTitle: 'Fonction / Titre',
      signatoryEmail: 'E-mail officiel du signataire',
      saveBtn: 'Enregistrer et mettre à jour',
      savedSuccess: 'Profil d’entreprise mis à jour avec succès !',
      closeBtn: 'Fermer',
    },
    binancePay: {
      badge: 'Paiement Crypto Sécurisé',
      title: 'Paiement par Cryptomonnaie (Binance Pay / USDT)',
      subtitle: 'Sélectionnez le réseau, transférez le montant indiqué et saisissez le hash de transaction (TxID) pour activation immédiate.',
      networkLabel: 'Réseau pris en charge',
      addressLabel: 'Adresse du portefeuille',
      copyAddress: 'Copier l’adresse',
      copied: 'Copié !',
      txIdLabel: 'Hash de Transaction / TxID',
      txIdPlaceholder: 'Collez le TxID depuis Binance ou votre portefeuille...',
      uploadProof: 'Joindre le reçu de paiement (Facultatif)',
      confirmBtn: 'Confirmer le paiement et activer',
      confirmingBtn: 'Vérification de la transaction...',
      securityNote: 'Les transferts sont vérifiés automatiquement en quelques minutes pour activer votre accès.',
      successTitle: 'Paiement enregistré avec succès !',
      successSub: 'Votre compte a été activé. Vous bénéficiez désormais d’un accès complet.',
      closeBtn: 'Fermer la fenêtre',
    },
    themeFont: {
      title: 'Personnaliser le Thème et la Typographie',
      subtitle: 'Choisissez votre thème visuel et police de lecture pour l’examen des contrats.',
      themeLabel: 'Thème Visuel',
      fontLabel: 'Style Typographique',
      previewText: 'Aperçu : Plateforme d’Intelligence Juridique IA et d’Audit Contractuel JurisTech Solutions.',
      applyBtn: 'Appliquer les réglages',
      resetBtn: 'Rétablir par défaut',
      closeBtn: 'Fermer',
    },
    liveMeeting: {
      badge: 'Salle de Consultation Chiffrée',
      title: 'Session Vidéo et Négociation en Direct',
      subtitle: 'Rejoignez la réunion vidéo chiffrée de bout en bout avec le conseiller juridique pour réviser et signer vos contrats.',
      roomIdLabel: 'Identifiant de la salle',
      copyLink: 'Copier le lien',
      linkCopied: 'Lien copié avec succès !',
      joinBtn: '🚀 Rejoindre la réunion',
      closeBtn: 'Fermer',
    },
  },

  de: {
    leadCapture: {
      welcomeTitle: 'Willkommen bei JurisTech Solutions',
      welcomeSub: 'Registrieren Sie Ihre offizielle E-Mail für kostenlose KI-Rechtsberatung und Vertrags-Updates oder setzen Sie Ihren Besuch fort.',
      fullNameLabel: 'Vollständiger Name',
      fullNamePlaceholder: 'z.B. Dr. Mohammed Mostafa',
      emailLabel: 'Offizielle E-Mail',
      emailPlaceholder: 'name@unternehmen.de',
      submitBtn: 'Registrieren & Starten',
      submittingBtn: 'Registrierung läuft...',
      skipBtn: '← Überspringen und als Gast erkunden',
      closeTooltip: 'Schließen und als Gast erkunden',
    },
    jurisdiction: {
      advisorBadge: 'Internationaler Rechtsberater (35+ Länder)',
      title: 'Gerichtsstand & Rechtsrahmen auswählen',
      description: 'Wählen Sie das maßgebliche Land oder den US-Bundesstaat zur Anpassung der Vertragserstellung und Risikoanalyse.',
      searchPlaceholder: 'Nach Land, Code oder Währung suchen (z.B. Deutschland, Schweiz, EUR, USD)...',
      arbitration: 'Schiedsort & Institution',
      grounding: 'Zertifizierter Rechtsrahmen 2026',
      close: 'Schließen',
      closeAria: 'Gerichtsstands-Auswahl schließen',
    },
    consultation: {
      badge: 'Strategische Rechtsberatung & Risiko-Governance',
      headerBadge: 'Strategische Rechtsberatung & Audit buchen',
      title: 'Strategische Rechtsberatung & Audit anfordern',
      subtitle: 'Verbinden Sie sich direkt mit leitenden Rechtsberatern für grenzüberschreitende Vertragsgestaltung und Streitbeilegung.',
      selectAdvisor: 'Zertifizierter Rechtsberater',
      consultationType: 'Beratungsformat',
      typeEmail: '📧 Schriftliches, zertifiziertes Rechtsgutachten',
      typeVideo: '📹 Live-Videositzung (45 Minuten)',
      typeAudit: '⚡ Dringlichkeitsprüfung von Vertragsklauseln',
      fullName: 'Vollständiger Name',
      email: 'Geschäftliche E-Mail',
      phone: 'Telefon / WhatsApp',
      company: 'Unternehmen / Organisation',
      preferredDate: 'Wunschdatum',
      preferredTime: 'Wunschzeit',
      subjectDetails: 'Sachverhalt & Vertragsdetails',
      subjectPlaceholder: 'Beschreiben Sie kurz Ihr Anliegen, die Parteien oder zu prüfende Klauseln...',
      submitBtn: 'Anfrage bestätigen & absenden',
      submittingBtn: 'Anfrage wird übermittelt...',
      successTitle: 'Beratungsanfrage erfolgreich erhalten!',
      successSub: 'Ihr Termin wurde registriert. Sie erhalten eine Bestätigung per E-Mail und WhatsApp mit dem Einwahllink.',
      bookingRef: 'Referenz-ID:',
      closeBtn: 'Fenster schließen',
      closeAria: 'Buchungsfenster schließen',
      confirmedTitle: 'Beratungsbuchung bestätigt und gesendet!',
      confirmedDesc: 'Die Buchungsdetails wurden an unseren Posteingang und den Kunden übermittelt. Der Berater wird Ihren Fall prüfen und direkt antworten.',
      doneBtn: 'Fertig',
    },
    chatbot: {
      triggerBtn: 'Live-KI-Rechtsassistent',
      headerTitle: 'JurisTech Live-KI-Concierge',
      connectedStatus: 'Gemini KI verbunden & aktiv',
      inputPlaceholder: 'Rechtsfrage in beliebiger Sprache eingeben...',
      sendTooltip: 'Frage senden',
      attachTooltip: 'Dokument anhängen (PDF / DOCX / TXT)',
      nextStepTitle: 'Nächster Schritt für den Rechtsaudit:',
      nextStepDesc: 'Buchen Sie eine persönliche Beratung, wechseln Sie zum unbegrenzten Tarif oder unterzeichnen Sie Ihren Vertrag.',
      bookConsultationBtn: '⚡ Rechtsberatung buchen',
      upgradePlanBtn: 'Tarif upgraden',
      signContractBtn: 'Vertrag signieren',
      quickQueriesTitle: '💡 Schnelle Rechtsfragen:',
      typingIndicator: 'Eingehende Rechtsanalyse und Formulierung der Antwort...',
      extractingDoc: 'Dokumententext wird extrahiert...',
      docReady: 'Bereit zur Prüfung',
      actionRiskAudit: '🔍 Vollständiger Risikoaudit',
      actionLiability: '💰 Haftung & Vertragsstrafen',
      actionArbitration: '⚖️ Schiedsgerichtsbarkeit & Recht',
      actionRedlines: '📝 Schutzklauseln & Überarbeitung',
      qRiskAudit: 'Bitte führen Sie einen umfassenden Risikoaudit für diesen Vertrag durch und decken Sie Fallstricke auf.',
      qLiability: 'Bitte prüfen Sie Haftungsbeschränkungen, Vertragsstrafen und Freistellungsklauseln.',
      qArbitration: 'Bitte überprüfen Sie Streitbeilegungs-, Rechtswahl- und Schiedsklauseln nach internationalen Standards.',
      qRedlines: 'Bitte stellen Sie schützende Alternativklauseln für alle riskanten Klauseln dieses Vertrags bereit.',
      pills: [
        { label: '🏢 GmbH-Gründung', query: 'Was sind die gesetzlichen Schritte und Voraussetzungen zur Gründung einer GmbH?' },
        { label: '🛡️ Höhere Gewalt Klausel', query: 'Wie formuliere ich eine rechtssichere Klausel für Höhere Gewalt nach ICC 2020?' },
        { label: '💼 Kündigung Arbeitsvertrag', query: 'Was sind die rechtssicheren Schritte für eine ordnungsgemäße Kündigung?' },
        { label: '🔒 Geheimhaltungsvertrag (NDA)', query: 'Welche Schutzklauseln sind in einer Geheimhaltungsvereinbarung unerlässlich?' },
      ],
    },
    companyProfile: {
      badge: 'Unternehmensprofil & Verifizierung',
      title: 'Unternehmensdaten & Rechtsprofil',
      subtitle: 'Speichern Sie Ihre Firmendaten zur automatischen Übernahme in Verträge und Rechnungen.',
      tabGeneral: 'Allgemeine Daten',
      tabSignatory: 'Zeichnungsberechtigter',
      tabTax: 'Steuer & USt-IdNr.',
      companyName: 'Offizieller Firmenname',
      crNumber: 'Handelsregisternummer (HRB)',
      taxNumber: 'Umsatzsteuer-Identifikationsnummer (USt-IdNr.)',
      jurisdiction: 'Gründungsland & anwendbares Recht',
      signatoryName: 'Name des Zeichnungsberechtigten',
      signatoryTitle: 'Funktion / Position',
      signatoryEmail: 'Offizielle E-Mail des Unterzeichners',
      saveBtn: 'Profil speichern & aktualisieren',
      savedSuccess: 'Unternehmensprofil erfolgreich aktualisiert!',
      closeBtn: 'Schließen',
    },
    binancePay: {
      badge: 'Sichere Krypto-Zahlung',
      title: 'Zahlung per Kryptowährung (Binance Pay / USDT)',
      subtitle: 'Netzwerk wählen, Betrag überweisen und Transaktions-Hash (TxID) zur sofortigen Freischaltung eingeben.',
      networkLabel: 'Unterstütztes Netzwerk',
      addressLabel: 'Wallet-Adresse',
      copyAddress: 'Adresse kopieren',
      copied: 'Kopiert!',
      txIdLabel: 'Transaktions-Hash / TxID',
      txIdPlaceholder: 'TxID aus Binance oder Wallet einfügen...',
      uploadProof: 'Zahlungsnachweis hochladen (Optional)',
      confirmBtn: 'Zahlung bestätigen & Zugang freischalten',
      confirmingBtn: 'Transaktion wird verifiziert...',
      securityNote: 'Überweisungen werden innerhalb von Minuten automatisch geprüft und freigeschaltet.',
      successTitle: 'Zahlung erfolgreich erfasst!',
      successSub: 'Ihr Konto wurde freigeschaltet. Sie haben nun unbegrenzten Zugriff auf alle Tools.',
      closeBtn: 'Fenster schließen',
    },
    themeFont: {
      title: 'Design & Typografie anpassen',
      subtitle: 'Wählen Sie Ihr bevorzugtes Farbschema und Schriftart zur Prüfung von Verträgen.',
      themeLabel: 'Farbschema',
      fontLabel: 'Schriftart',
      previewText: 'Vorschau: JurisTech Solutions KI-Rechtsintelligenz- und Risikoanalyseplattform.',
      applyBtn: 'Einstellungen anwenden',
      resetBtn: 'Auf Standard zurücksetzen',
      closeBtn: 'Schließen',
    },
    liveMeeting: {
      badge: 'Verschlüsselter Konferenzraum',
      title: 'Live-Videoverhandlung & Rechtsberatung',
      subtitle: 'Treten Sie der Ende-zu-Ende verschlüsselten Sitzung mit dem Rechtsberater bei, um Verträge in Echtzeit zu prüfen.',
      roomIdLabel: 'Konferenzraum-ID',
      copyLink: 'Link kopieren',
      linkCopied: 'Link erfolgreich kopiert!',
      joinBtn: '🚀 Jetzt beitreten',
      closeBtn: 'Schließen',
    },
  },

  es: {
    leadCapture: {
      welcomeTitle: 'Bienvenido a JurisTech Solutions',
      welcomeSub: 'Registre su correo electrónico oficial para recibir asesoría jurídica de IA gratuita o continúe explorando la plataforma.',
      fullNameLabel: 'Nombre completo',
      fullNamePlaceholder: 'ej. Dr. Mohammed Mostafa',
      emailLabel: 'Correo electrónico oficial',
      emailPlaceholder: 'nombre@empresa.es',
      submitBtn: 'Registrarse y Comenzar',
      submittingBtn: 'Registrando...',
      skipBtn: '← Omitir y explorar como invitado',
      closeTooltip: 'Cerrar y explorar como invitado',
    },
    jurisdiction: {
      advisorBadge: 'Asesor Legislativo Internacional (35+ países)',
      title: 'Seleccionar jurisdicción y marco legal',
      description: 'Elija el país o estado aplicable para adaptar la redacción contractual y la auditoría de riesgos a la normativa vigente.',
      searchPlaceholder: 'Buscar por país, código o moneda (ej. España, México, EUR, USD)...',
      arbitration: 'Sede y Órgano de Arbitraje',
      grounding: 'Marco legal certificado 2026',
      close: 'Cerrar',
      closeAria: 'Cerrar selector de jurisdicción',
    },
    consultation: {
      badge: 'Reserva de Asesoría Legal Estratégica',
      headerBadge: 'Reserva de Consulta Legal en Vivo',
      title: 'Solicitud de Asesoría Legal y Gobernanza de Riesgos',
      subtitle: 'Conéctese directamente con asesores sénior para estructuración de contratos y resolución de controversias internacionales.',
      selectAdvisor: 'Asesor Legal Certificado',
      consultationType: 'Formato de consulta',
      typeEmail: '📧 Dictamen legal escrito formal y certificado',
      typeVideo: '📹 Sesión estratégica en video en vivo (45 minutos)',
      typeAudit: '⚡ Auditoría urgente de términos contractuales',
      fullName: 'Nombre completo del cliente',
      email: 'Correo corporativo',
      phone: 'Teléfono / WhatsApp',
      company: 'Empresa / Organización',
      preferredDate: 'Fecha preferida',
      preferredTime: 'Hora preferida',
      subjectDetails: 'Resumen del asunto y contexto legal',
      subjectPlaceholder: 'Describa brevemente su consulta, las partes involucradas o las cláusulas a auditar...',
      submitBtn: 'Confirmar y enviar solicitud',
      submittingBtn: 'Enviando solicitud y reservando turno...',
      successTitle: '¡Solicitud recibida con éxito!',
      successSub: 'Su cita ha sido registrada. Recibirá confirmación por correo electrónico y WhatsApp con el enlace de acceso.',
      bookingRef: 'Referencia:',
      closeBtn: 'Cerrar ventana',
      closeAria: 'Cerrar ventana de reserva',
      confirmedTitle: '¡Reserva confirmada y enviada!',
      confirmedDesc: 'Los detalles de su reserva han sido enviados a nuestra bandeja oficial y al cliente. El asesor revisará su caso y responderá directamente.',
      doneBtn: 'Listo',
    },
    chatbot: {
      triggerBtn: 'Asistente Legal IA en vivo',
      headerTitle: 'JurisTech Asistente Legal IA',
      connectedStatus: 'Gemini IA conectado y activo',
      inputPlaceholder: 'Escriba su consulta legal en cualquier idioma...',
      sendTooltip: 'Enviar consulta',
      attachTooltip: 'Adjuntar documento (PDF / DOCX / TXT)',
      nextStepTitle: 'Próxima acción para la auditoría legal:',
      nextStepDesc: 'Reserve una asesoría personalizada, actualice al plan ilimitado o exporte y firme su contrato certificado.',
      bookConsultationBtn: '⚡ Reservar asesoría legal',
      upgradePlanBtn: 'Actualizar plan',
      signContractBtn: 'Firmar contrato',
      quickQueriesTitle: '💡 Consultas legales rápidas:',
      typingIndicator: 'Análisis legal profundo y redacción de respuesta en curso...',
      extractingDoc: 'Extrayendo texto del documento...',
      docReady: 'Listo para auditoría',
      actionRiskAudit: '🔍 Auditoría integral de riesgos',
      actionLiability: '💰 Responsabilidad e indemnizaciones',
      actionArbitration: '⚖️ Arbitraje y ley aplicable',
      actionRedlines: '📝 Cláusulas protectoras alternativas',
      qRiskAudit: 'Por favor, realice una auditoría integral de riesgos sobre este contrato y detecte cláusulas abusivas.',
      qLiability: 'Por favor, revise los límites de responsabilidad, cláusulas penales e indemnizaciones.',
      qArbitration: 'Por favor, revise la cláusula de arbitraje, resolución de disputas y ley aplicable.',
      qRedlines: 'Por favor, proporcione redacciones de cláusulas alternativas protectoras para los puntos de riesgo.',
      pills: [
        { label: '🏢 Constitución de Sociedad (SL/SA)', query: '¿Cuáles son los pasos y requisitos legales para constituir una sociedad mercantil?' },
        { label: '🛡️ Cláusula de Fuerza Mayor', query: '¿Cómo redactar una cláusula de fuerza mayor conforme a las reglas ICC 2020?' },
        { label: '💼 Despido y Contrato Laboral', query: '¿Cuáles son los procedimientos legales para extinción de contrato sin indemnizaciones improcedentes?' },
        { label: '🔒 Acuerdo de Confidencialidad (NDA)', query: '¿Qué cláusulas esenciales debe contener un acuerdo de no divulgación?' },
      ],
    },
    companyProfile: {
      badge: 'Perfil Corporativo y Verificación',
      title: 'Datos de la Empresa y Perfil Legal',
      subtitle: 'Guarde los datos de su empresa para integrarlos automáticamente en contratos y facturas.',
      tabGeneral: 'Datos Generales',
      tabSignatory: 'Firmante Autorizado',
      tabTax: 'Fiscalidad y CIF/NIF',
      companyName: 'Razón social oficial',
      crNumber: 'Número de Registro Mercantil / CIF',
      taxNumber: 'Número de Identificación Fiscal (NIF / IVA)',
      jurisdiction: 'País de constitución y ley aplicable',
      signatoryName: 'Nombre del firmante autorizado',
      signatoryTitle: 'Cargo / Puesto',
      signatoryEmail: 'Correo electrónico oficial del firmante',
      saveBtn: 'Guardar y actualizar perfil',
      savedSuccess: '¡Perfil de empresa actualizado con éxito!',
      closeBtn: 'Cerrar',
    },
    binancePay: {
      badge: 'Pago Cripto Rápido y Seguro',
      title: 'Pagar con Criptomonedas (Binance Pay / USDT)',
      subtitle: 'Seleccione la red, transfiera el monto indicado e ingrese el hash de transacción (TxID) para activación inmediata.',
      networkLabel: 'Red compatible',
      addressLabel: 'Dirección de la billetera',
      copyAddress: 'Copiar dirección',
      copied: '¡Copiado!',
      txIdLabel: 'Hash de Transacción / TxID',
      txIdPlaceholder: 'Pegue el TxID desde Binance o su billetera...',
      uploadProof: 'Subir comprobante de pago (Opcional)',
      confirmBtn: 'Confirmar pago y activar plan',
      confirmingBtn: 'Verificando transacción...',
      securityNote: 'Las transferencias se verifican automáticamente en pocos minutos para activar su suscripción.',
      successTitle: '¡Pago registrado con éxito!',
      successSub: 'Su cuenta ha sido activada y ahora dispone de acceso ilimitado.',
      closeBtn: 'Cerrar ventana',
    },
    themeFont: {
      title: 'Personalizar Tema y Tipografía',
      subtitle: 'Seleccione su estilo visual y fuente preferida para la revisión de contratos.',
      themeLabel: 'Tema Visual',
      fontLabel: 'Tipografía',
      previewText: 'Vista previa: Plataforma de Inteligencia Jurídica IA y Auditoría de Riesgos JurisTech Solutions.',
      applyBtn: 'Aplicar ajustes',
      resetBtn: 'Restablecer por defecto',
      closeBtn: 'Cerrar',
    },
    liveMeeting: {
      badge: 'Sala de Consulta Cifrada',
      title: 'Sesión de Video y Negociación en Vivo',
      subtitle: 'Únase a la reunión de video cifrada con el asesor legal para revisar y firmar contratos en tiempo real.',
      roomIdLabel: 'ID de la sala',
      copyLink: 'Copiar enlace',
      linkCopied: '¡Enlace copiado con éxito!',
      joinBtn: '🚀 Unirse a la reunión',
      closeBtn: 'Cerrar',
    },
  },

  zh: {
    leadCapture: {
      welcomeTitle: '欢迎来到 JurisTech Solutions 平台',
      welcomeSub: '注册您的官方企业邮箱以获取免费的AI法律咨询与合同更新，或继续以访客身份浏览。',
      fullNameLabel: '全名',
      fullNamePlaceholder: '例如：Dr. Mohammed Mostafa',
      emailLabel: '企业官方邮箱',
      emailPlaceholder: 'name@company.com',
      submitBtn: '注册并开始使用',
      submittingBtn: '正在注册...',
      skipBtn: '← 跳过并以访客身份继续',
      closeTooltip: '关闭并以访客身份探索',
    },
    jurisdiction: {
      advisorBadge: '国际法律顾问体系（覆盖 35+ 个国家）',
      title: '选择司法管辖区与法律体系',
      description: '选择适用的国家或美国州别，以便按照当地法定条款定制合同起草、合规审查与仲裁条款。',
      searchPlaceholder: '按国家名称、代码或货币搜索（例如：中国、新加坡、USD、CNY）...',
      arbitration: '仲裁地与仲裁机构',
      grounding: '2026年权威认证法律依据',
      close: '关闭',
      closeAria: '关闭管辖区选择窗口',
    },
    consultation: {
      badge: '战略法律顾问与风险治理预约',
      title: '申请专属战略法律咨询与合规审计',
      subtitle: '直接与资深战略法律顾问对接，进行跨境交易架构设计、监管风险审计与国际争议解决。',
      selectAdvisor: '认证法律顾问',
      consultationType: '咨询形式',
      typeEmail: '📧 正式书面法律备忘录与审计报告',
      typeVideo: '📹 实时战略视频会谈（45分钟）',
      typeAudit: '⚡ 紧急交易条款审查与修改建议',
      fullName: '申请人全名',
      email: '企业邮箱',
      phone: '电话 / 微信 / WhatsApp',
      company: '公司 / 机构名称',
      preferredDate: '期望会谈日期',
      preferredTime: '期望时间',
      subjectDetails: '咨询事项概述与合同背景',
      subjectPlaceholder: '请简要说明您的法律咨询需求、涉及主体或需要重点审查的合同条款...',
      submitBtn: '确认并提交正式咨询申请',
      submittingBtn: '正在提交申请并锁定预约...',
      successTitle: '咨询申请已成功接收！',
      successSub: '您的预约已登记，我们将通过电子邮件和 WhatsApp/微信直接与您联系，提供会议链接。',
      bookingRef: '预约参考编号：',
      closeBtn: '关闭窗口',
      closeAria: '关闭预约窗口',
      headerBadge: '法律咨询预约',
      confirmedTitle: '预约已确认并已发送！',
      confirmedDesc: '预约详情已发送至官方邮箱及客户邮件。顾问将审阅您的案例并直接回复。',
      doneBtn: '完成',
    },
    chatbot: {
      triggerBtn: '实时 AI 法律助理',
      headerTitle: 'JurisTech 实时 AI 法律顾问',
      connectedStatus: 'Gemini AI 已连接并实时在线',
      inputPlaceholder: '请以任何语言输入您的法律问题...',
      sendTooltip: '发送问题',
      attachTooltip: '上传合同或文件 (PDF / DOCX / TXT)',
      nextStepTitle: '法律审计后续操作：',
      nextStepDesc: '您可以预约专属法律咨询、升级至无限版方案，或导出并签署您的认证合同。',
      bookConsultationBtn: '⚡ 预约专属法律咨询',
      upgradePlanBtn: '升级订阅方案',
      signContractBtn: '在线签署合同',
      quickQueriesTitle: '💡 常用法律咨询：',
      typingIndicator: '正在进行深度法律分析并撰写专业回复...',
      extractingDoc: '正在提取文件文本...',
      docReady: '准备审计',
      actionRiskAudit: '🔍 全面风险审计',
      actionLiability: '💰 责任上限与违约金',
      actionArbitration: '⚖️ 适用法律与仲裁',
      actionRedlines: '📝 替代性保护条款',
      qRiskAudit: '请对该合同进行全面风险审计，指出潜在漏洞及不平等霸王条款。',
      qLiability: '请审查本协议中的责任限制、违约金及赔偿条款。',
      qArbitration: '请审查争议解决、适用法律及仲裁条款是否符合国际标准。',
      qRedlines: '请为本合同中存在风险的条款提供保护性修改建议。',
      pills: [
        { label: '🏢 公司注册设立 (LLC)', query: '设立有限责任公司有哪些法定流程与合规要求？' },
        { label: '🛡️ 不可抗力条款', query: '如何依据 ICC 2020 规则起草严密的不可抗力与情势变更条款？' },
        { label: '💼 劳动合同解除', query: '合法解除劳动关系且避免违法解雇赔偿金的法定程序是什么？' },
        { label: '🔒 保密协议 (NDA)', query: '双方保密协议必须包含哪些核心保护条款？' },
      ],
    },
    companyProfile: {
      badge: '企业档案与认证',
      title: '企业法定信息与法律档案',
      subtitle: '保存您的企业元数据，以便自动填入合同、发票和电子签名中。',
      tabGeneral: '基本信息',
      tabSignatory: '授权签字人',
      tabTax: '税务与税号',
      companyName: '公司法定全称',
      crNumber: '统一社会信用代码 / 商业登记号',
      taxNumber: '纳税人识别号 (VAT / Tax ID)',
      jurisdiction: '注册国家及适用法律',
      signatoryName: '授权签字人姓名',
      signatoryTitle: '职位 / 头衔',
      signatoryEmail: '签字人官方邮箱',
      saveBtn: '保存并更新档案',
      savedSuccess: '企业档案更新成功！',
      closeBtn: '关闭',
    },
    binancePay: {
      badge: '安全快速加密支付',
      title: '加密货币支付 (Binance Pay / USDT)',
      subtitle: '选择网络，转入指定金额，并输入交易哈希 (TxID) 即可立即激活。',
      networkLabel: '支持网络',
      addressLabel: '钱包地址',
      copyAddress: '复制地址',
      copied: '已复制！',
      txIdLabel: '交易哈希 / TxID',
      txIdPlaceholder: '请粘贴币安或钱包中的交易哈希...',
      uploadProof: '上传支付凭据（可选）',
      confirmBtn: '确认支付并开通服务',
      confirmingBtn: '正在验证交易并开通...',
      securityNote: '系统将在数分钟内自动核实转账并立即激活您的全部平台权限。',
      successTitle: '支付记录成功！',
      successSub: '您的账户已成功激活，现在可以无限使用所有平台工具。',
      closeBtn: '关闭窗口',
    },
    themeFont: {
      title: '个性化主题与字体设置',
      subtitle: '选择您喜爱的视觉风格与阅读字体，以获得舒适的合同审查体验。',
      themeLabel: '视觉主题',
      fontLabel: '字体样式',
      previewText: '预览：JurisTech Solutions 主权 AI 法律智能与合同风险审计平台。',
      applyBtn: '应用设置',
      resetBtn: '恢复默认',
      closeBtn: '关闭',
    },
    liveMeeting: {
      badge: '端到端加密在线会议室',
      title: '实时视频谈判与法律顾问会谈',
      subtitle: '加入端到端加密的高清视频会议室，与资深法律顾问实时审查并签署合同。',
      roomIdLabel: '会议室编号',
      copyLink: '复制会议链接',
      linkCopied: '链接已成功复制！',
      joinBtn: '🚀 立即加入视频会谈',
      closeBtn: '关闭',
    },
  },

  tr: {
    leadCapture: {
      welcomeTitle: 'JurisTech Solutions Platformuna Hoş Geldiniz',
      welcomeSub: 'Ücretsiz AI hukuki danışmanlığı ve sözleşme güncellemeleri almak için resmi e-postanızı kaydedin veya misafir olarak keşfetmeye devam edin.',
      fullNameLabel: 'Ad Soyad',
      fullNamePlaceholder: 'örn. Dr. Mohammed Mostafa',
      emailLabel: 'Kurumsal E-posta',
      emailPlaceholder: 'ad@sirket.com.tr',
      submitBtn: 'Kaydol ve Başla',
      submittingBtn: 'Kaydediliyor...',
      skipBtn: '← Atla ve misafir olarak keşfet',
      closeTooltip: 'Kapat ve misafir olarak devam et',
    },
    jurisdiction: {
      advisorBadge: 'Uluslararası Hukuk Danışmanı (35+ Ülke)',
      title: 'Yargı Alanı ve Hukuk Sistemini Seçin',
      description: 'Sözleşme taslağı oluşturma ve risk denetimini yerel kanunlara uyarlamak için geçerli ülkeyi seçin.',
      searchPlaceholder: 'Ülke, kod veya para birimi ile arayın (örn. Türkiye, Almanya, TRY, USD)...',
      arbitration: 'Tahkim Yeri ve Kurumu',
      grounding: '2026 Onaylı Mevzuat Dayanağı',
      close: 'Kapat',
      closeAria: 'Yargı alanı seçimini kapat',
    },
    consultation: {
      badge: 'Stratejik Hukuk Danışmanlığı ve Risk Yönetimi',
      title: 'Stratejik Hukuki Danışmanlık ve Denetim Talebi',
      subtitle: 'Sözleşme yapılandırması ve uluslararası uyuşmazlık yönetimi için doğrudan kıdemli hukuk danışmanlarıyla görüşün.',
      selectAdvisor: 'Sertifikalı Hukuk Danışmanı',
      consultationType: 'Danışmanlık Formatı',
      typeEmail: '📧 Resmi Yazılı Hukuki Mütalaa ve Rapor',
      typeVideo: '📹 Canlı Stratejik Video Görüşmesi (45 Dakika)',
      typeAudit: '⚡ Acil Sözleşme Maddeleri İncelemesi',
      fullName: 'Danışan Adı Soyadı',
      email: 'Kurumsal E-posta',
      phone: 'Telefon / WhatsApp',
      company: 'Şirket / Kurum Adı',
      preferredDate: 'Tercih Edilen Tarih',
      preferredTime: 'Tercih Edilen Saat',
      subjectDetails: 'Danışmanlık Konusu ve Belge Özeti',
      subjectPlaceholder: 'Talebinizi, ilgili tarafları veya denetlenecek maddeleri kısaca açıklayın...',
      submitBtn: 'Onayla ve Randevu Talebini Gönder',
      submittingBtn: 'Talep iletiliyor ve randevu alınıyor...',
      successTitle: 'Danışmanlık Talebi Başarıyla Alındı!',
      successSub: 'Randevunuz kaydedildi. Erişim bağlantısı e-posta ve WhatsApp üzerinden doğrudan iletilecektir.',
      bookingRef: 'Referans No:',
      closeBtn: 'Pencereyi Kapat',
      closeAria: 'Rezervasyon penceresini kapat',
      headerBadge: 'Hukuki Danışmanlık Rezervasyonu',
      confirmedTitle: 'Danışmanlık Rezervasyonu Onaylandı ve Gönderildi!',
      confirmedDesc: 'Rezervasyon detayları resmi gelen kutusuna ve müşteriye iletildi. Danışman vakanızı inceleyerek doğrudan yanıt verecektir.',
      doneBtn: 'Tamam',
    },
    chatbot: {
      triggerBtn: 'Canlı AI Hukuk Danışmanı',
      headerTitle: 'JurisTech Canlı AI Concierge',
      connectedStatus: 'Gemini AI Bağlı ve Canlı',
      inputPlaceholder: 'Hukuki sorunuzu herhangi bir dilde yazın...',
      sendTooltip: 'Soruyu Gönder',
      attachTooltip: 'Belge Ekle (PDF / DOCX / TXT)',
      nextStepTitle: 'Hukuki Denetim Sonrası Adımlar:',
      nextStepDesc: 'Özel danışmanlık randevusu alın, sınırsız plana yükseltin veya onaylı sözleşmenizi imzalayın.',
      bookConsultationBtn: '⚡ Hukuki Danışmanlık Al',
      upgradePlanBtn: 'Planı Yükselt',
      signContractBtn: 'Sözleşmeyi İmzala',
      quickQueriesTitle: '💡 Hızlı Hukuki Sorular:',
      typingIndicator: 'Derinlemesine hukuki analiz yapılıyor ve yanıt hazırlanıyor...',
      extractingDoc: 'Belge metni çıkarılıyor...',
      docReady: 'Denetime Hazır',
      actionRiskAudit: '🔍 Kapsamlı Risk Denetimi',
      actionLiability: '💰 Sorumluluk ve Cezai Şartlar',
      actionArbitration: '⚖️ Tahkim ve Uygulanacak Hukuk',
      actionRedlines: '📝 Koruyucu Alternatif Maddeler',
      qRiskAudit: 'Lütfen bu sözleşme üzerinde kapsamlı bir risk denetimi yapın ve haksız şartları ortaya çıkarın.',
      qLiability: 'Lütfen bu sözleşmedeki sorumluluk sınırlarını ve cezai şartları inceleyin.',
      qArbitration: 'Lütfen uyuşmazlık çözümü, uygulanacak hukuk ve tahkim maddelerini uluslararası standartlara göre inceleyin.',
      qRedlines: 'Lütfen bu sözleşmedeki riskli maddeler için koruyucu alternatif yazımlar önerin.',
      pills: [
        { label: '🏢 Limited Şirket Kuruluşu', query: 'Limited şirket kuruluşu için yasal süreçler ve şartlar nelerdir?' },
        { label: '🛡️ Mücbir Sebep Maddesi', query: 'ICC 2020 kurallarına göre mücbir sebep ve aşırı ifa güçlüğü maddesi nasıl yazılır?' },
        { label: '💼 İş Sözleşmesi Feshi', query: 'Haksız fesih tazminatı doğurmadan iş sözleşmesini feshetmenin yasal prosedürleri nelerdir?' },
        { label: '🔒 Gizlilik Sözleşmesi (NDA)', query: 'Gizlilik sözleşmesinde bulunması gereken zorunlu koruyucu maddeler nelerdir?' },
      ],
    },
    companyProfile: {
      badge: 'Kurumsal Profil ve Doğrulama',
      title: 'Şirket Bilgileri ve Hukuki Profil',
      subtitle: 'Sözleşmelerinize ve faturalarınıza otomatik eklenmesi için şirket bilgilerinizi kaydedin.',
      tabGeneral: 'Genel Bilgiler',
      tabSignatory: 'İmza Yetkilisi',
      tabTax: 'Vergi & KDV',
      companyName: 'Resmi Şirket Unvanı',
      crNumber: 'Ticaret Sicil No (MERSİS / Sicil)',
      taxNumber: 'Vergi Kimlik Numarası (VKN / KDV)',
      jurisdiction: 'Kuruluş Ülkesi ve Uygulanacak Hukuk',
      signatoryName: 'Yetkili İmzacının Adı Soyadı',
      signatoryTitle: 'Görevi / Unvanı',
      signatoryEmail: 'İmzacının Kurumsal E-postası',
      saveBtn: 'Profili Kaydet ve Güncelle',
      savedSuccess: 'Şirket profili başarıyla güncellendi!',
      closeBtn: 'Kapat',
    },
    binancePay: {
      badge: 'Hızlı ve Güvenli Kripto Ödeme',
      title: 'Kripto Para ile Öde (Binance Pay / USDT)',
      subtitle: 'Ağı seçin, belirtilen tutarı transfer edin ve anında aktivasyon için İşlem Kodunu (TxID) girin.',
      networkLabel: 'Desteklenen Ağ',
      addressLabel: 'Cüzdan Adresi',
      copyAddress: 'Adresi Kopyala',
      copied: 'Kopyalandı!',
      txIdLabel: 'İşlem Kodu / TxID Hash',
      txIdPlaceholder: 'Binance veya cüzdanınızdaki TxID kodunu yapıştırın...',
      uploadProof: 'Ödeme Dekontu Yükle (İsteğe bağlı)',
      confirmBtn: 'Ödemeyi Onayla ve Paketi Başlat',
      confirmingBtn: 'İşlem doğrulanıyor ve paket başlatılıyor...',
      securityNote: 'Transferler dakikalar içinde otomatik olarak doğrulanır ve aboneliğiniz aktif edilir.',
      successTitle: 'Ödeme Başarıyla Kaydedildi!',
      successSub: 'Hesabınız aktif edildi. Artık tüm platform araçlarını sınırsız kullanabilirsiniz.',
      closeBtn: 'Pencereyi Kapat',
    },
    themeFont: {
      title: 'Görünüm ve Yazı Tipini Özelleştir',
      subtitle: 'Sözleşme incelemesi için tercih ettiğiniz renk paletini ve yazı tipini seçin.',
      themeLabel: 'Görsel Tema',
      fontLabel: 'Yazı Tipi Stili',
      previewText: 'Önizleme: JurisTech Solutions AI Hukuk Zekası ve Sözleşme Risk Analiz Platformu.',
      applyBtn: 'Ayarları Uygula',
      resetBtn: 'Varsayılana Sıfırla',
      closeBtn: 'Kapat',
    },
    liveMeeting: {
      badge: 'Uçtan Uca Şifreli Görüşme Odası',
      title: 'Canlı Video Müzakere ve Danışmanlık Odası',
      subtitle: 'Sözleşmeleri gerçek zamanlı incelemek ve imzalamak için hukuk danışmanıyla şifreli video oturumuna katılın.',
      roomIdLabel: 'Toplantı Oda Numarası',
      copyLink: 'Bağlantıyı Kopyala',
      linkCopied: 'Bağlantı başarıyla kopyalandı!',
      joinBtn: '🚀 Görüşmeye Şimdi Katıl',
      closeBtn: 'Kapat',
    },
  },
};

export function getUITranslations(lang?: string): ModalTranslations {
  if (!lang) return UI_TRANSLATIONS.ar;
  const clean = lang.toLowerCase().slice(0, 2) as AppLang;
  return UI_TRANSLATIONS[clean] || UI_TRANSLATIONS.en;
}
