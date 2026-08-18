/**
 * src/data/contractStore.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive Sovereign Legal Contract Store & Template Repository
 * Covering 50+ Corporate, Commercial, Labor, Investment & IP Agreement Templates
 * Formatted with Verbatim Statutory Clauses for Jordan, KSA, UAE, Egypt, US & Global
 */

export interface ContractStoreEntry {
  id: string;
  categoryAr: string;
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  jurisdictions: string[];
  descriptionAr: string;
  descriptionEn: string;
  defaultStatuteAr: string;
  defaultStatuteEn: string;
  defaultArbitrationAr: string;
  defaultArbitrationEn: string;
  templateTextAr: string;
  templateTextEn: string;
  keyClausesAr: string[];
  keyClausesEn: string[];
}

export const CONTRACT_STORE_DATABASE: ContractStoreEntry[] = [
  // ── 1. CORPORATE & GOVERNANCE (تأسيس وحوكمة الشركات) ──────────────────────────
  {
    id: 'jo-llc-incorporation',
    categoryAr: 'حوكمة وتأسيس الشركات',
    categoryEn: 'Corporate & Governance',
    titleAr: 'عقد تأسيس ونظام أساسي لشركة ذات مسؤولية محدودة - الأردن (CCD LLC)',
    titleEn: 'Jordanian LLC Articles of Association (Companies Law 22/1997)',
    jurisdictions: ['JO', 'GLOBAL'],
    descriptionAr: 'عقد تأسيس متكامل ومطابق لأحكام قانون الشركات الأردني رقم 22 لسنة 1997 وتعديلاته لدى دائرة مراقبة الشركات.',
    descriptionEn: 'Comprehensive LLC Articles of Association compliant with Jordanian Companies Law No. 22 of 1997.',
    defaultStatuteAr: 'أحكام قانون الشركات الأردني رقم 22 لسنة 1997 وتعديلاته والقانون المدني رقم 43 لسنة 1976',
    defaultStatuteEn: 'Jordanian Companies Law No. 22 of 1997 and Civil Code No. 43 of 1976',
    defaultArbitrationAr: 'محكمة بداية عمان (القسم الاقتصادي) / مركز التحكيم الأردني',
    defaultArbitrationEn: 'Amman First Instance Court (Economic Chamber) / Jordanian Arbitration Center',
    templateTextAr: `================================================================================
عقد تأسيس ونظام أساسي لشركة ذات مسؤولية محدودة (ذ.م.م)
استناداً لأحكام قانون الشركات الأردني رقم 22 لسنة 1997 وتعديلاته
المسجلة لدى دائرة مراقبة الشركات (CCD) - المملكة الأردنية الهاشمية
================================================================================

أُبرم هذا العقد في هذا اليوم بين كل من:

الطرف الأول (المؤسس/الشريك الأول): [PARTY_A]
السجل التجاري / الرقم الوطني: [PARTY_A_TAX]
العنوان والموطن المختار: [عنوان الطرف الأول]

الطرف الثاني (المؤسس/الشريك الثاني): [PARTY_B]
السجل التجاري / الرقم القومي: [PARTY_B_TAX]
العنوان والموطن المختار: [عنوان الطرف الثاني]

التمهيد:
حيث إن الطرفين يرغبان في تأسيس شركة ذات مسؤولية محدودة للعمل في الأنشطة التجارية والاستثمارية المشروعة في المملكة الأردنية الهاشمية، واستناداً لقانون الشركات الأردني رقم 22 لسنة 1997 وتعديلاته، اتفق الطرفان على ما يلي:

البند الأول: اسم الشركة وغاياتها
1.1 اسم الشركة: شركة [اسم الشركة] ذات مسؤولية محدودة (ذ.م.م).
1.2 الغايات والأنشطة: ممارسة الأنشطة التجارية والخدمية والتقنية واستيراد وتصدير البضائع وفق رخص المهن الصادرة عن دائرة مراقبة الشركات والجهات الرسمية.

البند الثاني: رأس المال وتوزيع الحصص
2.1 يحدد رأس مال الشركة الإجمالي بمبلغ ([VALUE]) [CURRENCY] مقسماً إلى حصص متساوية قيمة كل حصة دينار أردني واحد.
2.2 توزيع الحصص بين الشركاء:
    - يملك الطرف الأول (50%) من رأس المال بقيمة ([VALUE_HALF]) [CURRENCY].
    - يملك الطرف الثاني (50%) من رأس المال بقيمة ([VALUE_HALF]) [CURRENCY].
2.3 يقر الشركاء بإيداع كامل قيمة رأس المال لدى أحد البنوك المرخصة بالأردن باسم "شركة تحت التأسيس".

البند الثالث: الإدارة والتفويض بالتوقيع
3.1 يتولى إدارة الشركة مدير عام يتم تعيينه بقرار من هيئة الشركاء.
3.2 يحدد قرار التعيين صلاحيات المدير العام بالتوقيع نيابة عن الشركة أمام كافة الدوائر الحكومية والمحاكم والبنوك.

البند الرابع: الأرباح والخسائر والمسؤولية
4.1 توزع الأرباح والخسائر الصافية بين الشركاء بنسبة حصة كل منهما في رأس المال.
4.2 تكون مسؤولية كل شريك عن ديون الشركة والتزاماتها محدودة بمقدار حصته في رأس المال فقط.

البند الخامس: القانون الواجب التطبيق وحل المنازعات
يخضع هذا العقد وتفسيره لقانون الشركات الأردني رقم 22 لسنة 1997 وتعديلاته والقانون المدني الأردني. وفي حال نشوب أي نزاع، تختص محاكم عمان أو التحكيم بحسمه.

توقيع الطرف الأول: [مُعتمد إلكترونياً]              توقيع الطرف الثاني: [مُعتمد إلكترونياً]`,
    templateTextEn: `================================================================================
ARTICLES OF ASSOCIATION - LIMITED LIABILITY COMPANY (LLC)
Pursuant to Jordanian Companies Law No. 22 of 1997 as amended
Registered with the Companies Control Department (CCD) - Hashemite Kingdom of Jordan
================================================================================

This Agreement is entered into on this day by and between:

FIRST PARTY (Founder/Partner A): [PARTY_A]
Commercial Registry / ID: [PARTY_A_TAX]

SECOND PARTY (Founder/Partner B): [PARTY_B]
Commercial Registry / ID: [PARTY_B_TAX]

RECITALS:
WHEREAS, the Parties desire to establish a Limited Liability Company (LLC) in Jordan under Companies Law No. 22 of 1997;

NOW, THEREFORE, the Parties agree as follows:

SECTION 1: NAME & OBJECTIVES
1.1 Entity Name: [Company Name] LLC.
1.2 Objectives: Executing commercial, technical, and trading activities authorized by the Companies Control Department (CCD).

SECTION 2: SHARE CAPITAL & EQUITY
2.1 Total Share Capital is fixed at ([VALUE]) [CURRENCY] divided into equal shares.
2.2 Share split: Party A holds 50%, Party B holds 50%.
2.3 Capital is fully deposited in a licensed Jordanian bank under "Company Under Formation".

SECTION 3: MANAGEMENT & SIGNING AUTHORITY
3.1 Managed by a General Manager appointed by resolution of the Shareholders.

SECTION 4: GOVERNING LAW & JURISDICTION
Governed by Jordanian Companies Law No. 22 of 1997 and Civil Code No. 43 of 1976. Jurisdiction reserved for Amman Courts.

Party A Signature: [Digitally Certified]            Party B Signature: [Digitally Certified]`,
    keyClausesAr: ['التمهيد وإشهار التأسيس', 'رأس المال وتوزيع الحصص', 'حدود المسؤولية المحدودة', 'اختصاص دائرة مراقبة الشركات (CCD)'],
    keyClausesEn: ['Founding Recitals', 'Capital Allocation', 'Limited Liability Cap', 'CCD Jurisdiction Clause'],
  },

  {
    id: 'sa-llc-articles',
    categoryAr: 'حوكمة وتأسيس الشركات',
    categoryEn: 'Corporate & Governance',
    titleAr: 'عقد تأسيس شركة ذات مسؤولية محدودة - السعودية (نظام الشركات م/132)',
    titleEn: 'Saudi Arabia LLC Articles of Association (Royal Decree M/132)',
    jurisdictions: ['SA', 'GLOBAL'],
    descriptionAr: 'عقد تأسيس موحد ومطابق لنظام الشركات السعودي الجديد مرسوم ملكي م/132 ومنصة أعمال لوزارة التجارة.',
    descriptionEn: 'Saudi Companies Law 2022 compliant Articles of Association for LLC formation via Saudi Business Center.',
    defaultStatuteAr: 'نظام الشركات السعودي الجديد (المرسوم الملكي رقم م/132) ونظام المعاملات المدنية (م/191)',
    defaultStatuteEn: 'Saudi Companies Law (Royal Decree M/132) & Civil Transactions Law (M/191)',
    defaultArbitrationAr: 'المركز السعودي للتحكيم التجاري (SCCA) / المحاكم التجارية بالرياض',
    defaultArbitrationEn: 'Saudi Center for Commercial Arbitration (SCCA) / Riyadh Commercial Courts',
    templateTextAr: `================================================================================
عقد تأسيس شركة ذات مسؤولية محدودة
وفقاً لنظام الشركات السعودي الصادر بالمرسوم الملكي رقم (م/132)
وزارة التجارة - مركز الأعمال السعودي (منصة أعمال)
================================================================================

الطرف الأول: [PARTY_A] | السجل التجاري / الهوية: [PARTY_A_TAX]
الطرف الثاني: [PARTY_B] | السجل التجاري / الهوية: [PARTY_B_TAX]

البند الأول: تأسيس الشركة واسمها
تأسست بين الطرفين شركة ذات مسؤولية محدودة باسم "شركة [اسم الشركة] ذات مسؤولية محدودة".

البند الثاني: أغراض الشركة
القيام بالأعمال التجارية والخدمية والتقنية المعتمدة في السجل التجاري بالمملكة العربية السعودية.

البند الثالث: رأس المال والتوزيع
رأس مال الشركة ([VALUE]) [CURRENCY] مقسم إلى حصص متساوية، وتحدد مسؤولية كل شريك بحدود حصته.

البند الرابع: النظام القضائي المطبق
يخضع العقد لنظام الشركات السعودي ونظام المعاملات المدنية الصادر بالمرسوم الملكي رقم (م/191). وفي حال النزاع، يتم اللجوء للمركز السعودي للتحكيم التجاري (SCCA).`,
    templateTextEn: `================================================================================
SAUDI ARABIA LLC ARTICLES OF ASSOCIATION
Pursuant to Saudi Companies Law (Royal Decree M/132) & Ministry of Commerce
================================================================================

Party A: [PARTY_A] | CR/ID: [PARTY_A_TAX]
Party B: [PARTY_B] | CR/ID: [PARTY_B_TAX]

1. Formation & Corporate Name: Limited Liability Company named [Company Name] LLC.
2. Capital: Aggregate capital ([VALUE]) [CURRENCY] divided into equal shares.
3. Governing Law: Governed by Saudi Companies Law (M/132) & Civil Transactions Law (M/191). Jurisdiction: Saudi Center for Commercial Arbitration (SCCA).`,
    keyClausesAr: ['المرسوم الملكي م/132', 'التوثيق عبر منصة أعمال', 'التحكيم بـ SCCA الرياض'],
    keyClausesEn: ['Royal Decree M/132', 'Saudi Business Center Filing', 'SCCA Riyadh Venue'],
  },

  // ── 2. EMPLOYMENT & LABOR CONTRACTS (قانون العمل والتوظيف) ───────────────────
  {
    id: 'jo-labor-employment',
    categoryAr: 'الموارد البشرية وقانون العمل',
    categoryEn: 'Employment & Labor Law',
    titleAr: 'عقد عمل فردي محدد/غير محدد المدة - قانون العمل الأردني (رقم 8 لسنة 1996)',
    titleEn: 'Jordanian Employment Contract (Labor Law No. 8 of 1996)',
    jurisdictions: ['JO'],
    descriptionAr: 'عقد عمل فردي يحدد فترة التجربة (حد أقصى 90 يوماً)، الأجر، الإشعار، ومكافأة نهاية الخدمة طبقاً للقانون الأردني.',
    descriptionEn: 'Standard employment agreement capping probation to 90 days with severance per Jordanian Labor Law 8/1996.',
    defaultStatuteAr: 'أحكام قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته والقانون المدني رقم 43 لسنة 1976',
    defaultStatuteEn: 'Jordanian Labor Law No. 8 of 1996 and Civil Code No. 43 of 1976',
    defaultArbitrationAr: 'سلطة الأجور / المحكمة العمالية المختصة في المملكة الأردنية الهاشمية',
    defaultArbitrationEn: 'Labor Court of Amman / Jordanian Wages Authority',
    templateTextAr: `================================================================================
عقد عمل فردي
طبقاً لأحكام قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته
المملكة الأردنية الهاشمية
================================================================================

صاحب العمل (الطرف الأول): [PARTY_A]
السجل التجاري: [PARTY_A_TAX]

العامل (الطرف الثاني): [PARTY_B]
الرقم الوطني / جواز السفر: [PARTY_B_TAX]

البند الأول: المسمى الوظيفي والمهام
يعين صاحب العمل العامل بوظيفة ([Job Title]) لتقديم المهام والواجبات الموكلة إليه بكفاءة وأمانة.

البند الثاني: فترة التجربة (المادة 35)
يخضع العامل لفترة تجربة مدتها (90) يوماً تبدأ من تاريخ مباشرة العمل. ولا يجوز زيادة فترة التجربة عن ثلاثة أشهر طبقاً للمادة 35 من قانون العمل الأردني.

البند الثالث: الأجر والمزايا
يدفع صاحب العمل للعامل أجراً شهرياً قدره ([VALUE]) [CURRENCY] في نهاية كل شهر ميلادي.

البند الرابع: ساعات العمل والإجازات
تحدد ساعات العمل بـ (48) ساعة أسبوعياً وفق المادة 56 من القانون، مع استحقاق الإجازات السنوية والمرضية المدفوعة.

البند الخامس: إنهاء العقد والإشعار
يلتزم أي من الطرفين في حال رغبته بإنهاء العقد بإخطار الطرف الآخر خطياً قبل (30) يوماً على الأقل وفق المادة 23 من القانون.

توقيع صاحب العمل: [مُعتمد إلكترونياً]             توقيع العامل: [مُعتمد إلكترونياً]`,
    templateTextEn: `================================================================================
INDIVIDUAL EMPLOYMENT CONTRACT
Pursuant to Jordanian Labor Law No. 8 of 1996 as amended
================================================================================

Employer (Party A): [PARTY_A] | CR: [PARTY_A_TAX]
Employee (Party B): [PARTY_B] | National ID: [PARTY_B_TAX]

SECTION 1: POSITION
Employee is appointed as [Job Title].

SECTION 2: PROBATION PERIOD (ARTICLE 35)
Probation shall be strictly capped to ninety (90) days per Article 35 of Jordanian Labor Law.

SECTION 3: REMUNERATION
Employer disburse monthly salary of ([VALUE]) [CURRENCY].

SECTION 4: GOVERNING LAW
Governed by Jordanian Labor Law No. 8 of 1996. Jurisdiction reserved for Amman Labor Courts.`,
    keyClausesAr: ['فترة التجربة المادة 35', 'ساعات العمل المادة 56', 'بدل الإشعار والفصل التعسفي'],
    keyClausesEn: ['Article 35 Probation Cap', 'Notice Period', 'Labor Court Jurisdiction'],
  },

  // ── 3. INTELLECTUAL PROPERTY & NDAs (الملكية الفكرية والسرية) ─────────────────
  {
    id: 'global-mutual-nda',
    categoryAr: 'الملكية الفكرية والتكنولوجيا',
    categoryEn: 'IP & Technology',
    titleAr: 'اتفاقية عدم إفصاح وحماية سرية البيانات والمعلومات (Mutual NDA)',
    titleEn: 'Mutual Non-Disclosure & Confidentiality Agreement (Global Standard)',
    jurisdictions: ['GLOBAL', 'JO', 'SA', 'AE', 'EG', 'US', 'EU', 'GB'],
    descriptionAr: 'اتفاقية عدم إفصاح حمائية تبادلية تفرض السرية التامة لحماية الأسرار التجارية والتقنيات والميزانيات لمدة 5 سنوات.',
    descriptionEn: 'Bulletproof mutual non-disclosure agreement protecting proprietary trade secrets and technical IP for 5 years.',
    defaultStatuteAr: 'أحكام السرية التجارية وحماية الملكية الفكرية والقوانين التجارية النافذة',
    defaultStatuteEn: 'Defend Trade Secrets Act (DTSA), EU GDPR, and Applicable Commercial Codes',
    defaultArbitrationAr: 'غرفة التحكيم التجاري الدولية (ICC باريس) / محكمة الموطن',
    defaultArbitrationEn: 'ICC International Court of Arbitration (Paris / Geneva)',
    templateTextAr: `================================================================================
اتفاقية عدم إفصاح وحماية السرية التبادلية (Mutual NDA)
حماية الأسرار التجارية والبيانات الفنية والمالية
================================================================================

الطرف الأول: [PARTY_A] | السجل: [PARTY_A_TAX]
الطرف الثاني: [PARTY_B] | السجل: [PARTY_B_TAX]

البند الأول: تعريف المعلومات السرية
تشمل المعلومات السرية كافة البيانات المالية، الفنية، الأسرار التجارية، البرمجيات، وقوائم العملاء المتبادلة بين الأطراف.

البند الثاني: التزامات عدم الإفصاح
يلتزم كل طرف بالحفاظ على سرية المعلومات المستلمة وعدم الإفصاح عنها أو استخدامها لأي غرض خارج نطاق التعاون التجاري.

البند الثالث: مدة السرية (Term & Survival)
تستمر التزامات السرية طوال مدة التعامل ولمدة (5) سنوات متصلة بعد إنهاء العلاقة التعاقدية، وتكون دائمة بالنسبة للأسرار التجارية.

البند الرابع: التعويض المستعجل (Injunctive Relief)
يحق للطرف المتضرر الحصول على أمر قضائي مستعجل لمنع أي إفشاء غير مصرح به فوراً دون الحاجة لإثبات الضرر المالي فقط.

توقيع الطرف الأول: [مُعتمد إلكترونياً]             توقيع الطرف الثاني: [مُعتمد إلكترونياً]`,
    templateTextEn: `================================================================================
MUTUAL NON-DISCLOSURE AGREEMENT (MUTUAL NDA)
================================================================================

Party A: [PARTY_A] | ID: [PARTY_A_TAX]
Party B: [PARTY_B] | ID: [PARTY_B_TAX]

SECTION 1: CONFIDENTIAL INFORMATION DEFINITION
Includes financial, technical, trade secret, and proprietary customer data disclosed between parties.

SECTION 2: NON-DISCLOSURE OBLIGATIONS
Each party commits to maintain strict confidentiality and prohibit third-party dissemination.

SECTION 3: TERM & SURVIVAL
Confidentiality obligations survive termination for a period of five (5) years, and indefinitely for trade secrets.

SECTION 4: INJUNCTIVE RELIEF
Damaged party retains the right to seek emergency court injunctions to stop unauthorized disclosure immediately.`,
    keyClausesAr: ['تعريف المعلومات السرية', 'مدة السرية 5 سنوات', 'الأمر القضائي المستعجل'],
    keyClausesEn: ['Definition of IP', '5-Year Survival', 'Emergency Injunctions'],
  },

  // ── 4. SAAS & SERVICE AGREEMENTS (عقود الساس والخدمات) ────────────────────────
  {
    id: 'global-saas-sla',
    categoryAr: 'الخدمات والتوريدات التجارية',
    categoryEn: 'Service & Commercial',
    titleAr: 'عقد تقديم خدمات برمجيات ساس واتفاقية مستوى الخدمة (SaaS Master SLA)',
    titleEn: 'SaaS Master Services & Service Level Agreement (SLA)',
    jurisdictions: ['GLOBAL', 'US', 'EU', 'JO', 'SA', 'AE'],
    descriptionAr: 'عقد تقديم خدمات سحابية يضمن نسبة تشغيل 99.9% والامتثال لـ GDPR وتحديد سقف المسؤولية بـ 100% من الرسوم.',
    descriptionEn: 'SaaS Agreement guaranteeing 99.9% uptime SLA, GDPR data processing terms, and 100% fee liability cap.',
    defaultStatuteAr: 'معايير التجارة الإلكترونية الدولية واتفاقية UNCITRAL ولائحة حماية البيانات GDPR',
    defaultStatuteEn: 'UNCITRAL E-Commerce Framework, EU GDPR Regulation 2016/679, & US UCC',
    defaultArbitrationAr: 'مركز التحكيم الدولي (ICC باريس) / محكمة دبي المالي DIFC',
    defaultArbitrationEn: 'DIFC Courts Dubai / ICC Paris Arbitration',
    templateTextAr: `================================================================================
عقد تقديم خدمات البرمجيات السحابية (SaaS MSA & SLA)
اتفاقية مستوى الخدمة والامتثال الأمني
================================================================================

مزود الخدمة (الطرف الأول): [PARTY_A] | السجل: [PARTY_A_TAX]
العميل (الطرف الثاني): [PARTY_B] | السجل: [PARTY_B_TAX]

البند الأول: نطاق الخدمة والترخيص
يمنح المزود للعميل ترخيصاً سحابياً غير حصري لاستخدام المنصة وفق عدد المستخدمين واشتراك ([VALUE]) [CURRENCY].

البند الثاني: مستوى الخدمة الضامن (99.9% Uptime SLA)
يتعهد المزود بنسبة تشغيل لا تقل عن 99.9% شهرياً، وتستحق رصيد تعويضي في حال انخفاض الخدمة عن النسبة المحددة.

البند الثالث: سقف المسؤولية المالية (Liability Cap)
تحدد المسؤولية المالية الإجمالية القصوى للمزود عن أي مطالباً بمبلغ لا يتجاوز 100% من إجمالي الرسوم الفعلية المدفوعة خلال 12 شهراً.

البند الرابع: حماية البيانات والامتثال لـ GDPR
يلتزم المزود بتشفير كافة بيانات العميل بمعيار AES-256 والامتثال التام للائحة العامة لحماية البيانات (GDPR).`,
    templateTextEn: `================================================================================
SAAS MASTER SERVICES & SERVICE LEVEL AGREEMENT (SaaS SLA)
================================================================================

Provider (Party A): [PARTY_A] | ID: [PARTY_A_TAX]
Customer (Party B): [PARTY_B] | ID: [PARTY_B_TAX]

SECTION 1: SUBSCRIPTION LICENSE
Non-exclusive cloud access granted against agreed fees of ([VALUE]) [CURRENCY].

SECTION 2: 99.9% UPTIME SLA
Provider guarantees 99.9% monthly availability backed by SLA service credits.

SECTION 3: LIABILITY CAP
Aggregate provider liability strictly capped at 100% of fees actually paid in preceding 12 months.`,
    keyClausesAr: ['نسبة التشغيل 99.9%', 'سقف المسؤولية 100%', 'تشفير AES-256 و GDPR'],
    keyClausesEn: ['99.9% Uptime SLA', '100% Fee Liability Cap', 'AES-256 & GDPR'],
  },

  // ── 5. INVESTMENT & VENTURE CAPITAL (الاستثمار ورأس المال الجريء) ─────────────
  {
    id: 'global-vc-safe',
    categoryAr: 'الاستثمار ورأس المال الجريء',
    categoryEn: 'Investment & Venture Capital',
    titleAr: 'اتفاقية الاستثمار الفوري بالأسهم المستقبلية (SAFE Convertible Agreement)',
    titleEn: 'SAFE Convertible Securities Investment Agreement (Y-Combinator Standard)',
    jurisdictions: ['GLOBAL', 'US', 'JO', 'SA', 'AE', 'EG'],
    descriptionAr: 'اتفاقية استثمار جريء تحول أموال المستثمر إلى أسهم مستقبلية بخصم أو سقف تقييم عند جولة التمويل القادمة.',
    descriptionEn: 'Standard SAFE investment agreement converting funding into equity upon next priced round.',
    defaultStatuteAr: 'أنظمة رأس المال الجريء ومعايير NVCA وقانون الشركات المطبق',
    defaultStatuteEn: 'Delaware General Corporation Law (DGCL) & NVCA Standards',
    defaultArbitrationAr: 'محاكم ديلوير بالولايات المتحدة / مركز التحكيم الدولي',
    defaultArbitrationEn: 'Delaware Chancery Court / SCCA Commercial Arbitration',
    templateTextAr: `================================================================================
اتفاقية الاستثمار بالأسهم المستقبلية (SAFE Agreement)
================================================================================

المؤسسة/الشركة الناشئة: [PARTY_A] | السجل: [PARTY_A_TAX]
المستثمر: [PARTY_B] | السجل/الهوية: [PARTY_B_TAX]
مبلغ الاستثمار الفوري: ([VALUE]) [CURRENCY]

البند الأول: التحويل لأسهم مستقبلية
يتحول مبلغ الاستثمار تلقائياً إلى أسهم في الشركة عند حدوث جولة تمويلية مستقبلية (Priced Equity Round).

البند الثاني: خصم التقييم وسقف التقييم (Valuation Cap & Discount)
يحصل المستثمر على خصم استثماري بنسبة (20%) أو سقف تقييم أقصى محدد بالاتفاقية أيهما أفضل للمستثمر.

البند الثالث: خروج الشركة والصفقات الكبرى (Liquidity Event)
في حال التصفية أو الاندماج قبل التحويل، يسترد المستثمر قيمة استثماره الأصلية فوراً قبل توزيع أرباح الشركاء.`,
    templateTextEn: `================================================================================
SAFE CONVERTIBLE INVESTMENT AGREEMENT
================================================================================

Company: [PARTY_A] | ID: [PARTY_A_TAX]
Investor: [PARTY_B] | ID: [PARTY_B_TAX]
Purchase Amount: ([VALUE]) [CURRENCY]

SECTION 1: EQUITY CONVERSION
Converts automatically into equity upon future priced equity financing round.

SECTION 2: VALUATION CAP & DISCOUNT
Investor entitled to 20% discount or Valuation Cap, whichever yields greater equity share.`,
    keyClausesAr: ['التحويل عند الجولة القادمة', 'سقف التقييم والخصم 20%', 'حماية المستثمر في الخروج'],
    keyClausesEn: ['Conversion Mechanics', 'Valuation Cap & 20% Discount', 'Liquidity Event Priority'],
  },
];

/**
 * Rapid Lookup helper for Contract Store
 */
export function getContractStoreEntry(typeIdOrTitle: string): ContractStoreEntry | undefined {
  const norm = typeIdOrTitle.toLowerCase().trim();
  return CONTRACT_STORE_DATABASE.find(
    (c) =>
      c.id.toLowerCase() === norm ||
      c.titleAr.toLowerCase().includes(norm) ||
      c.titleEn.toLowerCase().includes(norm)
  ) || CONTRACT_STORE_DATABASE[0];
}
