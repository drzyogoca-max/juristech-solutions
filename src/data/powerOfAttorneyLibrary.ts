/**
 * src/data/powerOfAttorneyLibrary.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Power of Attorney (POA) Advisory Library v1.1
 * 10 comprehensive POA drafting templates covering GCC, MENA, and International jurisdictions.
 * All templates are informational drafting frameworks with full Arabic & English text.
 * 
 * LEGAL NOTICE:
 * All templates provided herein are drafting frameworks for informational and
 * structural reference only. Execution, notarization, legalization, registration,
 * and enforceability requirements vary significantly by jurisdiction.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface POATemplate {
  id: string;
  typeKey: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  jurisdictions: string[];
  usageContextAr: string;
  usageContextEn: string;
  legalBasisAr: string;
  legalBasisEn: string;
  downloads: number;
  rating: number;
  templateAr: string;
  templateEn: string;
}

export const POA_DISCLAIMER_AR = `[إخلاء مسؤولية قانونية وإرشاد تنظيمي]
تنبيه: هذا النموذج مخصص لأغراض الصياغة القانونية والاسترشادية فقط، ولا يُعد استشارة قانونية مخصصة أو توثيقاً رسمياً منشئاً للأثر القانوني بمفرده. تختلف متطلبات التوقيع والتوثيق والتصديق والتسجيل وقابلية الإنفاذ حسب الولاية القضائية والقوانين المحلية المعمول بها لدى دوائر الكاتب العدل والجهات الحكومية المختصة. يُرجى مراجعة محامٍ مرخص واستيفاء متطلبات التوثيق الرسمية في بلد التنفيذ.`;

export const POA_DISCLAIMER_EN = `[LEGAL DISCLAIMER & REGULATORY NOTICE]
NOTICE: This document is an informational drafting template intended for structural drafting and guidance only. It does not constitute formal legal advice, representation, or notarization. Execution, notarization, legalization, registration, and enforceability requirements vary by jurisdiction and local notary public statutes. Always consult licensed legal counsel and satisfy official authentication requirements in the executing jurisdiction.`;

export const POA_LIBRARY: POATemplate[] = [
  // ── 1. GENERAL ABSOLUTE POA ───────────────────────────────────────────────
  {
    id: 'poa-general-absolute',
    typeKey: 'general',
    titleAr: 'نموذج مسودة وكالة عامة مطلقة',
    titleEn: 'Draft General Absolute Power of Attorney',
    descriptionAr: 'مسودة استرشادية لتوكيل عام يمنح الوكيل صلاحيات إدارة الشؤون القانونية والمالية والإدارية وفق الضوابط النظامية.',
    descriptionEn: 'Informational drafting template granting an attorney-in-fact broad authority over legal, financial, and administrative affairs.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'KW', 'QA', 'BH', 'GLOBAL'],
    usageContextAr: 'يُستخدم كمسودة إرشادية عند السفر لفترات طويلة أو تفويض شخص موثوق بالإدارة العامة، مع وجوب التوثيق لدى الكاتب العدل.',
    usageContextEn: 'Used as a drafting starting point for general representation during extended absence, subject to mandatory local notarization.',
    legalBasisAr: 'أحكام عقد الوكالة العامة في القانون المدني والتشريعات المنظمة لأعمال الكاتب العدل والتوثيق',
    legalBasisEn: 'Civil Code provisions governing Agency Contracts & statutory Notary Public regulations',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة عامة مطلقة (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: بيانات أطراف الوكالة
الموكِّل (الأصيل):
الاسم الكامل: [PRINCIPAL_NAME]
الصفة/الجنسية: [PRINCIPAL_NATIONALITY]
رقم الهوية الوطنية / جواز السفر: [PRINCIPAL_ID]
العنوان المختار ومحل الإقامة: [PRINCIPAL_ADDRESS]
الهاتف والبريد الإلكتروني: [PRINCIPAL_CONTACT]

الوكيل (المفوَّض):
الاسم الكامل: [AGENT_NAME]
الصفة/الجنسية: [AGENT_NATIONALITY]
رقم الهوية الوطنية / جواز السفر: [AGENT_ID]
العنوان المختار ومحل الإقامة: [AGENT_ADDRESS]
الهاتف والبريد الإلكتروني: [AGENT_CONTACT]

ثانياً: نطاق الصلاحيات الممنوحة
فوّض الموكّل الوكيل المذكور أعلاه بالقيام نيابةً عنه وبالأصالة عن نفسه بالتصرفات التالية:
1. الإدارة العامة: إدارة كافة الأموال المنقولة وغير المنقولة وإبرام العقود التشغيلية ذات الصلة.
2. المعاملات المالية والمصرفية: مراجعة البنوك وفتح وإدارة الحسابات البنكية وإجراء عمليات الإيداع والسحب والتحويل ضمن حدود الأغراض المصرح بها.
3. التمثيل والتقاضي: مراجعة الدوائر الحكومية والوزارات والبلديات، وتعيين المحامين وتمثيل الموكل أمام المحاكم بجميع درجاتها ما لم يتطلب القانون تفويضاً خاصاً.
4. التعاقدات المدنية والتجارية: التوقيع على الاتفاقيات والعقود العادية وتسلم وتسليم المراسلات والوثائق الرسمية.

ثالثاً: المدة والانتهاء
تسري هذه الوكالة اعتباراً من تاريخ توثيقها رسمياً لدى الكاتب العدل حتى تاريخ: [END_DATE] ما لم يتم إنهاؤها أو عزل الوكيل قبل ذلك كتابةً.

رابعاً: حق العزل والرجوع
تحتفظ الجهة الموكلة بحقها القانوني الكامل في عزل الوكيل أو إلغاء هذه الوكالة كلياً أو جزئياً في أي وقت، بموجب إشعار كتابي موثق ومُبلّغ رسمياً للوكيل وللجهات الرسمية ذات العلاقة، ما لم تكن الوكالة معقودة لصالح الغير وتمنع القوانين المحلية عزلها دون موافقة صاحب الحق.

خامساً: الإقرار والتوقيع
أقرّ أنا الموكّل بكامل أهليتي المعتبرة شرعاً وقانوناً بمنح التفويض الوارد أعلاه وفق الشروط المبينة فيه.

توقيع الموكِّل: _______________________    التاريخ: [DATE]
توقيع الوكيل (للقبول): __________________    التاريخ: [DATE]

سادساً: الشهود
الشاهد الأول: [WITNESS_1_NAME] | الهوية: [WITNESS_1_ID] | التوقيع: ________________
الشاهد الثاني: [WITNESS_2_NAME] | الهوية: [WITNESS_2_ID] | التوقيع: ________________

سابعاً: تصديق الكاتب العدل / الجهة المختصة
الجهة التوثيقية: [NOTARY_PUBLIC_OFFICE]
رقم وتاريخ قيد التوثيق: [REGISTRATION_NUMBER] — [NOTARIZATION_DATE]
خاتم وتوقيع الموثق الرسمي: _______________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: GENERAL ABSOLUTE POWER OF ATTORNEY
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PARTIES IDENTIFICATION
PRINCIPAL (GRANTOR):
Full Legal Name: [PRINCIPAL_NAME]
Nationality: [PRINCIPAL_NATIONALITY]
National ID / Passport No.: [PRINCIPAL_ID]
Residential / Legal Address: [PRINCIPAL_ADDRESS]
Phone & Email: [PRINCIPAL_CONTACT]

ATTORNEY-IN-FACT (AGENT):
Full Legal Name: [AGENT_NAME]
Nationality: [AGENT_NATIONALITY]
National ID / Passport No.: [AGENT_ID]
Residential / Legal Address: [AGENT_ADDRESS]
Phone & Email: [AGENT_CONTACT]

2. SCOPE OF GRANTED POWERS
The Principal hereby appoints and authorizes the Attorney-in-Fact to act in the Principal's name and on the Principal's behalf with respect to:
a. General Administration: Manage movable and immovable property and execute relevant operational agreements.
b. Banking & Financial Matters: Interact with banking institutions, open and manage bank accounts, deposit, withdraw, and transfer funds strictly within authorized operational parameters.
c. Governmental Representation & Proceedings: Represent the Principal before ministries, government departments, municipalities, and appoint legal counsel for judicial representation where permitted by applicable procedural law.
d. Commercial & Civil Agreements: Sign standard contracts, agreements, receipts, and operational covenants in furtherance of the Principal's lawful affairs.

3. TERM & TERMINATION
This Power of Attorney shall take effect upon formal notarization and remain in full force until: [END_DATE], unless terminated, revoked, or canceled earlier in writing in accordance with applicable law.

4. REVOCATION & MODIFICATION
The Principal expressly reserves the absolute right to revoke, cancel, or amend this Power of Attorney at any time by delivering written and notarized notice to the Attorney-in-Fact and relevant public registries, unless this instrument has been coupled with an interest or granted for the benefit of a third party under governing law.

5. EXECUTION & ACKNOWLEDGMENT
In witness whereof, the Principal, being of sound mind and full legal capacity, has executed this instrument on the date set forth below.

Principal Signature: _______________________    Date: [DATE]
Attorney-in-Fact Signature (Acceptance): __________________    Date: [DATE]

6. WITNESSES
Witness 1: [WITNESS_1_NAME] | ID: [WITNESS_1_ID] | Signature: ________________
Witness 2: [WITNESS_2_NAME] | ID: [WITNESS_2_ID] | Signature: ________________

7. NOTARY PUBLIC / COMPETENT AUTHORITY ATTESTATION
Notarial Authority / Office: [NOTARY_PUBLIC_OFFICE]
Authentication Reference No.: [REGISTRATION_NUMBER] — Date: [NOTARIZATION_DATE]
Official Seal & Signature: _______________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 2. REAL ESTATE SPECIAL POA ───────────────────────────────────────────
  {
    id: 'poa-real-estate',
    typeKey: 'real-estate',
    titleAr: 'نموذج مسودة وكالة عقارية خاصة',
    titleEn: 'Draft Real Estate Special Power of Attorney',
    descriptionAr: 'مسودة استرشادية لتوكيل خاص بالتصرف في عقار محدد (بيع، شراء، إفراغ، رهن، تأجير) وفق متطلبات السجل العقاري.',
    descriptionEn: 'Informational drafting template for a special power of attorney authorizing specific real estate transactions.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'QA', 'KW', 'GLOBAL'],
    usageContextAr: 'يُستخدم لصياغة تفويض بإجراء معاملة عقارية محددة مع وجوب تحديد بيانات صك الملكية والتوثيق والتسجيل العقاري الرسمي.',
    usageContextEn: 'Used to draft authorization for designated property transactions; requires deed registration and formal land department filing.',
    legalBasisAr: 'التشريعات العقارية وأنظمة التسجيل العيني وإفراغ الصكوك العقارية والتوثيق العدلي',
    legalBasisEn: 'Real Property Registration Statutes, Land Registry Title Transfer Codes & Notarial Law',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة عقارية خاصة (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: أطراف الوكالة
الموكِّل (مالك العقار):
الاسم الكامل: [PRINCIPAL_NAME] | الهوية/السجل: [PRINCIPAL_ID] | العنوان: [PRINCIPAL_ADDRESS]
الوكيل (المفوَّض بالتصرف):
الاسم الكامل: [AGENT_NAME] | الهوية/السجل: [AGENT_ID] | العنوان: [AGENT_ADDRESS]

ثانياً: التحديد الدقيق للعقار موضوع الوكالة
رقم الصك/سند الملكية: [TITLE_DEED_NUMBER]    تاريخ الصك: [DEED_DATE]
رقم القطعة/القسيمة: [PARCEL_NUMBER]    رقم الحوض/المخطط: [BASIN_BLOCK_NUMBER]
المدينة/المنطقة: [PROPERTY_LOCATION]    المساحة الإجمالية: [AREA_SQM] م²
الحدود والمعالم: [PROPERTY_BOUNDARIES]

ثالثاً: الصلاحيات العقارية المحددة حصراً
يقتصر هذا التوكيل الخاص على العقار المذكور أعلاه حصراً ويشمل فقط الصلاحيات التالية:
1. [ ] البيع ونقل الملكية والإفراغ أمام الدوائر العقارية المختصة.
2. [ ] الشراء وقبول الإفراغ والتوقيع على عقود نقل الملكية.
3. [ ] التأجير وتحصيل بدلات الإيجار وإبرام عقود الإيجار السكنية والتجارية.
4. [ ] الرهن أو فك الرهن لصالح الجهات التمويلية المعتمدة: [FINANCIAL_INSTITUTION].
5. [ ] مراجعة البلديات واستخراج رخص البناء والفرز والتوثيق الهندسي.

رابعاً: مدة الوكالة
تسري هذه الوكالة لمدة محددة تبدأ من [START_DATE] وتنتهي حكماً في [END_DATE] (مع مراعاة أي مدد نظامية تقررها لوائح التوثيق العقاري المحلية).

خامساً: حق العزل والإنهاء
يحق للموكل عزل الوكيل وإلغاء هذه الوكالة في أي وقت بإخطار خطي موثق يُسجل رسمياً لدى دائرة الأراضي والتسجيل العقاري المختصة، ما لم تكن مقترنة برهن أو حق تمويلي للغير.

سادساً: التوقيع والشهود
توقيع الموكِّل: _______________________    التاريخ: [DATE]
الشاهد الأول: [WITNESS_1] | الهوية: [W1_ID] | التوقيع: ________________
الشاهد الثاني: [WITNESS_2] | الهوية: [W2_ID] | التوقيع: ________________

سابعاً: توثيق الكاتب العدل والتسجيل العقاري
الموثق / الدائرة العقارية: [LAND_REGISTRY_NOTARY]
رقم القيد العقاري: [OFFICIAL_REG_NO]    الختم الرسمي: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: REAL ESTATE SPECIAL POWER OF ATTORNEY
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PARTIES
PRINCIPAL (PROPERTY OWNER):
Full Name: [PRINCIPAL_NAME] | National ID / Passport: [PRINCIPAL_ID] | Address: [PRINCIPAL_ADDRESS]
ATTORNEY-IN-FACT (AGENT):
Full Name: [AGENT_NAME] | National ID / Passport: [AGENT_ID] | Address: [AGENT_ADDRESS]

2. SPECIFIC PROPERTY DESCRIPTION
Title Deed / Certificate No.: [TITLE_DEED_NUMBER]    Deed Date: [DEED_DATE]
Parcel / Lot No.: [PARCEL_NUMBER]    Block / Plan No.: [BASIN_BLOCK_NUMBER]
Municipality / Location: [PROPERTY_LOCATION]    Total Area: [AREA_SQM] sqm
Boundaries & Coordinates: [PROPERTY_BOUNDARIES]

3. ENUMERATED REAL ESTATE AUTHORITIES (STRICT CONFINES)
This Special POA is strictly limited to the described property and comprises only the designated checked powers:
a. [ ] Sale, conveyance, and formal title deed transfer before competent land authorities.
b. [ ] Purchase, deed acceptance, and execution of conveyance instruments.
c. [ ] Lease agreements, tenancy management, and collection of rental proceeds.
d. [ ] Mortgage creation or discharge in favor of approved institution: [FINANCIAL_INSTITUTION].
e. [ ] Municipal filings, building permits, subdivision, and surveying approvals.

4. TERM & DURATION
This Special POA is valid from [START_DATE] until [END_DATE], subject to statutory maximum validity periods established by local land registration regulations.

5. REVOCATION & TERMINATION
The Principal reserves the right to revoke this POA at any time via written notarized notice filed with the competent Land Registry, unless coupled with an active registered security interest or lender covenant.

6. SIGNATURES & WITNESSES
Principal Signature: _______________________    Date: [DATE]
Witness 1: [WITNESS_1] | ID: [W1_ID] | Signature: ________________
Witness 2: [WITNESS_2] | ID: [W2_ID] | Signature: ________________

7. NOTARIAL & TITLE REGISTRY ATTESTATION
Notary Public / Land Registry Office: [LAND_REGISTRY_NOTARY]
Registration Record No.: [OFFICIAL_REG_NO]    Official Seal: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 3. BANKING & FINANCIAL POA ───────────────────────────────────────────
  {
    id: 'poa-banking-financial',
    typeKey: 'banking',
    titleAr: 'نموذج مسودة وكالة مصرفية ومالية',
    titleEn: 'Draft Banking & Financial Power of Attorney',
    descriptionAr: 'مسودة استرشادية لتوكيل مصرفي محدد الصلاحيات لإدارة حسابات بنكية وسحب وإيداع وتوقيع سندات.',
    descriptionEn: 'Informational drafting template authorizing designated banking transactions, account operations, and financial instruments.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'GLOBAL'],
    usageContextAr: 'يُستخدم لتفويض إدارة عمليات مالية لدى بنوك محددة، مع وجوب مراعاة متطلبات البنك المركزي واستيفاء نماذج التواقيع البنكية المعتمدة.',
    usageContextEn: 'Used to draft authorizations for specific banking institutions; subject to central bank regulations and mandatory bank-specific mandates.',
    legalBasisAr: 'قوانين المعاملات المصرفية والأوراق التجارية وتعليمات البنك المركزي ذات الصلة بمكافحة غسل الأموال وتفويض الحسابات',
    legalBasisEn: 'Banking & Commercial Paper Acts, Central Bank KYC/AML Mandates, and Financial Delegation Guidelines',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة مصرفية ومالية خاصة (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: أطراف الوكالة
الموكِّل (صاحب الحساب/الأصيل):
الاسم الكامل: [PRINCIPAL_NAME] | الهوية: [PRINCIPAL_ID] | العنوان: [PRINCIPAL_ADDRESS]
الوكيل المفوَّض:
الاسم الكامل: [AGENT_NAME] | الهوية: [AGENT_ID] | العنوان: [AGENT_ADDRESS]

ثانياً: المؤسسة المصرفية والحسابات المشمولة
اسم البنك / المؤسسة المالية: [BANK_NAME]
الفرع: [BRANCH_NAME]
أرقام الحسابات المشمولة: [ACCOUNT_NUMBERS_IBAN]

ثالثاً: حدود الصلاحيات المصرفية المحددة
1. فتح وإدارة الحسابات الجارية والاستثمارية المحددة أعلاه فقط.
2. السحب والإيداع النقدي بحد أقصى لا يتجاوز: ([TRANSACTION_LIMIT]) [CURRENCY] للمعاملة الواحدة، وسقف شهري إجمالي قدره: ([MONTHLY_LIMIT]) [CURRENCY].
3. التوقيع على الشيكات والحوالات المصرفية المباشرة نيابةً عن الموكل في إطار السقوف المحددة.
4. الحصول على كشوف الحساب والمراسلات والمصادقات المصرفية ومذكرات التسوية.
5. لا تشمل هذه الوكالة الاقتراض أو طلب التسهيلات الائتمانية أو تقديم كفالات غارمة إلا بنص خاص وصريح ومصادق عليه.

رابعاً: مدة الوكالة
تسري هذه الوكالة من تاريخ [START_DATE] وتنقضي حكماً في [END_DATE]، وتلزم مراجعة البنك لتقديم النموذج المعتمد الداخلي لديه.

خامساً: حق العزل والإنهاء
يحق للموكل إلغاء هذه الوكالة في أي وقت بإخطار خطي موجه مباشرة للبنك، ولا يُلزم البنك بالإلغاء إلا من تاريخ تسلمه الفعلي للإشعار الخطي المستوفي للشروط.

سادساً: التوقيع والمصادقة
توقيع الموكِّل: _______________________    التاريخ: [DATE]
توقيع الوكيل (نموذج التوقيع): ________________    التاريخ: [DATE]
الشاهد الأول: [WITNESS_1] | الهوية: [W1_ID] | التوقيع: ________________
الشاهد الثاني: [WITNESS_2] | الهوية: [W2_ID] | التوقيع: ________________

سابعاً: التوثيق الرسمي ومصادقة البنك
توثيق الكاتب العدل: [NOTARY_PUBLIC_REF]
استلام واعتماد البنك: [BANK_COMPLIANCE_OFFICER]    التاريخ: [RECEIVED_DATE]

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: BANKING & FINANCIAL POWER OF ATTORNEY
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PARTIES IDENTIFICATION
PRINCIPAL (ACCOUNT HOLDER):
Full Name: [PRINCIPAL_NAME] | National ID: [PRINCIPAL_ID] | Address: [PRINCIPAL_ADDRESS]
ATTORNEY-IN-FACT (AUTHORIZED SIGNATORY):
Full Name: [AGENT_NAME] | National ID: [AGENT_ID] | Address: [AGENT_ADDRESS]

2. DESIGNATED FINANCIAL INSTITUTION & ACCOUNTS
Bank / Financial Entity: [BANK_NAME]
Branch: [BRANCH_NAME]
Designated Account / IBAN Numbers: [ACCOUNT_NUMBERS_IBAN]

3. SCOPE & MONETARY LIMITATIONS
a. Access and operational management restricted strictly to the designated accounts listed above.
b. Deposits and withdrawals subject to a single transaction limit not exceeding: ([TRANSACTION_LIMIT]) [CURRENCY], and an aggregate monthly cap of: ([MONTHLY_LIMIT]) [CURRENCY].
c. Execute checks, wire instructions, and routine transfers strictly within authorized caps.
d. Request and receive periodic statements, audit balance confirmations, and transactional notices.
e. EXCLUSION: This POA does NOT grant authority to obtain loans, credit lines, or execute guarantees unless expressly conferred via a separate specific authorization instrument.

4. TERM & VALIDITY
Effective from [START_DATE] and automatically expiring on [END_DATE], subject to bank internal KYC/signature verification procedures.

5. REVOCATION & BANK NOTICE
The Principal may revoke this instrument at any time via written notice delivered to the designated Bank; revocation becomes binding upon the Bank only upon formal timestamped acknowledgment of receipt.

6. SIGNATURES & WITNESSES
Principal Signature: _______________________    Date: [DATE]
Attorney-in-Fact Signature Specimen: ________________    Date: [DATE]
Witness 1: [WITNESS_1] | ID: [W1_ID] | Signature: ________________
Witness 2: [WITNESS_2] | ID: [W2_ID] | Signature: ________________

7. NOTARIAL & BANK ACKNOWLEDGMENT
Notary Public Stamp / Ref: [NOTARY_PUBLIC_REF]
Bank Compliance Intake: [BANK_COMPLIANCE_OFFICER]    Intake Date: [RECEIVED_DATE]

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 4. LITIGATION & LEGAL PROCEEDINGS POA ─────────────────────────────────
  {
    id: 'poa-legal-litigation',
    typeKey: 'litigation',
    titleAr: 'نموذج مسودة وكالة خاصة بالتقاضي والمحاماة',
    titleEn: 'Draft Litigation & Legal Representation Power of Attorney',
    descriptionAr: 'مسودة استرشادية لتوكيل محامٍ مرخص للتمثيل أمام الهيئات القضائية والتحكيمية ومراكز الوساطة.',
    descriptionEn: 'Informational drafting template authorizing licensed legal counsel to represent the client in judicial and arbitral proceedings.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'KW', 'QA', 'GLOBAL'],
    usageContextAr: 'يُستخدم لتفويض محامٍ مرخص قانوناً بالتقاضي، مع ضرورة النص صراحةً على الصلاحيات التي تتطلب إذناً خاصاً نظاماً كالإقرار والصلح والتحكيم.',
    usageContextEn: 'Used to mandate licensed bar counsel; statutory rules require express specific authorization for settlement, confession, and arbitration.',
    legalBasisAr: 'قوانين المحاماة وأصول المحاكمات المدنية والتجارية والتشريعات المنظمة لحق الدفاع والتمثيل القضائي',
    legalBasisEn: 'Bar Association Acts, Civil and Commercial Procedure Codes, and Statutory Litigation Representation Rules',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة قضائية خاصة بالتقاضي (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: أطراف الوكالة
الموكِّل:
الاسم الكامل: [PRINCIPAL_NAME] | الهوية: [PRINCIPAL_ID] | العنوان: [PRINCIPAL_ADDRESS]
المحامي الوكيل (يجب أن يكون مرخصاً في دائرة الاختصاص):
الاسم الكامل: [ADVOCATE_NAME] | رقم القيد بنقابة المحامين/الترخيص: [BAR_LICENSE_NO]
عنوان المكتب القانوني: [LAW_FIRM_ADDRESS] | الهاتف: [CONTACT_INFO]

ثانياً: النزاع أو القضية المحددة
المحكمة / الهيئة التحكيمية المختصة: [DESIGNATED_COURT_OR_TRIBUNAL]
موضوع النزاع / رقم الدعوى إن وجد: [CASE_REFERENCE_AND_SUBJECT]
الطرف المقابل في الخصومة: [OPPOSING_PARTY_NAME]

ثالثاً: الصلاحيات القضائية الممنوحة
1. إقامة الدعاوى والطعون واللوائح والطلبات المستعجلة والمرافعة والمدافعة أمام درجات التقاضي (ابتدائي، استئناف، تمييز/نقض).
2. استلام القرارات والأحكام والإنذارات العدلية وتنفيذ الأحكام لدى دوائر التنفيذ المختصة.
3. تفويض أو إنابة محامين آخرين مرخصين للقيام ببعض الإجراءات تحت إشراف الوكيل الرئيسي.
4. الصلاحيات الخاصة المقيدة (لا تجوز إلا بالتأشير الصريح عليها بموجب القانون):
   [ ] الإقرار بالحق موضوع النزاع.
   [ ] التنازل عن الدعوى أو الخصومة أو الحق.
   [ ] إبرام الصلح والتسويات القضائية والاتفاق عليها.
   [ ] قبول التحكيم وتعيين المحكمين والتوقيع على وثائق التحكيم.
   [ ] رد القضاة أو توجيه اليمين الحاسمة أو قبولها أو ردها.

رابعاً: مدة الوكالة
تسري هذه الوكالة حتى صدور حكم بات وتنفيذه في الدعوى المذكورة أو حتى تاريخ: [EXPIRY_DATE].

خامساً: عزل المحامي أو اعتزال الوكالة
يجوز للموكل عزل المحامي وفق أحكام قانون المحاماة بشرط إخطاره رسمياً وسداد الأتعاب المستحقة نظاماً، كما يلتزم المحامي بأداء واجباته المهنية عند الاعتزال بما لا يضر بمصالح الموكل الإجرائية.

سادساً: التوقيع والتوثيق
توقيع الموكِّل: _______________________    التاريخ: [DATE]
قبول المحامي الوكيل: __________________    التاريخ: [DATE]
توثيق الكاتب العدل / رئيس قلم المحكمة: [NOTARY_OR_COURT_CLERK]
رقم التوثيق العدلي: [OFFICIAL_POA_NO]    الختم الرسمي: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: LITIGATION & LEGAL REPRESENTATION POWER OF ATTORNEY
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PARTIES IDENTIFICATION
PRINCIPAL (CLIENT):
Full Legal Name: [PRINCIPAL_NAME] | National ID/Passport: [PRINCIPAL_ID] | Address: [PRINCIPAL_ADDRESS]
ADVOCATE / LEGAL COUNSEL (MUST BE LICENSED IN THE FORUM JURISDICTION):
Full Name: [ADVOCATE_NAME] | Bar Admission / Practice License No.: [BAR_LICENSE_NO]
Law Firm Address: [LAW_FIRM_ADDRESS] | Contact: [CONTACT_INFO]

2. DESIGNATED PROCEEDING OR DISPUTE
Court / Arbitration Forum: [DESIGNATED_COURT_OR_TRIBUNAL]
Matter Reference / Case No. (if filed): [CASE_REFERENCE_AND_SUBJECT]
Opposing Party: [OPPOSING_PARTY_NAME]

3. SCOPE OF JUDICIAL AUTHORITIES
a. Representation before courts of first instance, appellate courts, and courts of cassation/supreme courts.
b. File pleadings, defenses, motions, interim measures, and execute final judgments before execution courts.
c. Retain and substitute associate admitted attorneys under primary counsel's supervision.
d. SPECIAL STATUTORY POWERS (REQUIRING EXPLICIT INDIVIDUAL AFFIRMATION BY LAW):
   [ ] Judicial confession or admission of disputed claim.
   [ ] Waiver of litigation, claim abandonment, or withdrawal of action.
   [ ] Execution of binding settlements and compromises.
   [ ] Submission to binding arbitration and selection of arbitrators.
   [ ] Recusal of judges or administration/tender of decisive oaths.

4. TERM & TERMINATION
Valid through final non-appealable judgment and enforcement in the designated matter, or until: [EXPIRY_DATE].

5. REVOCATION & WITHDRAWAL
The Principal may revoke counsel subject to statutory Bar rules regarding payment of earned fees; attorney withdrawal remains subject to ethical obligations preventing prejudice to the client's procedural standing.

6. SIGNATURES & OFFICIAL NOTARIZATION
Principal Signature: _______________________    Date: [DATE]
Advocate Acceptance Signature: __________________    Date: [DATE]
Court Clerk / Notary Public Authentication: [NOTARY_OR_COURT_CLERK]
Official Power of Attorney No.: [OFFICIAL_POA_NO]    Seal: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 5. COMPANY INCORPORATION & CORPORATE POA ─────────────────────────────
  {
    id: 'poa-company-incorporation',
    typeKey: 'corporate',
    titleAr: 'نموذج مسودة وكالة تأسيس شركات وتسجيل تجاري',
    titleEn: 'Draft Company Formation & Corporate Affairs POA',
    descriptionAr: 'مسودة استرشادية لتوكيل وكيل مؤسس لاستكمال إجراءات قيد الشركات وإصدار السجل التجاري واستيفاء التراخيص.',
    descriptionEn: 'Informational drafting template authorizing an incorporator or agent to complete commercial registration and company filings.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'KW', 'QA', 'BH', 'SG', 'GLOBAL'],
    usageContextAr: 'يُستخدم لتفويض من ينوب عن الشركاء أو المؤسسين في توقيع عقود التأسيس أمام كاتب العدل أو وزارة التجارة.',
    usageContextEn: 'Used to delegate company formation, Articles of Association execution, and commercial registry filings on behalf of founders.',
    legalBasisAr: 'قوانين الشركات التجارية ولوائح السجل التجاري وأنظمة الاستثمار والتوثيق المعتمدة',
    legalBasisEn: 'Companies Acts, Commercial Register Ordinances, and Corporate Governance Regulations',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة تأسيس شركات وتمثيل تجاري (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: بيانات المؤسس/الشريك الموكِّل
الاسم الكامل: [PRINCIPAL_NAME] | الهوية/جواز السفر: [PRINCIPAL_ID]
الجنسية: [PRINCIPAL_NATIONALITY] | العنوان: [PRINCIPAL_ADDRESS]
صفته: مؤسس / شريك بنسبة ([SHARE_PERCENTAGE]%) في الشركة المزمع تأسيسها.

ثانياً: بيانات الوكيل المفوَّض
الاسم الكامل: [AGENT_NAME] | الهوية/جواز السفر: [AGENT_ID] | العنوان: [AGENT_ADDRESS]

ثالثاً: الشركة موضوع التأسيس
الاسم المقترح للشركة: [COMPANY_NAME]
الشكل القانوني: [COMPANY_LEGAL_FORM] (مثال: شركة ذات مسؤولية محدودة / شركة مساهمة مقفلة)
رأس المال المقترح: ([CAPITAL_AMOUNT]) [CURRENCY]
الجهة الرسمية المختصة: [MINISTRY_OR_COMMERCIAL_REGISTRY]

رابعاً: الصلاحيات المحددة للتأسيس حصراً
1. استكمال إجراءات حجز الاسم التجاري والحصول على الموافقات الأمنية والتنظيمية المسبقة.
2. التوقيع نيابةً عن الموكل على عقد التأسيس والنظام الأساسي وتعديلاتهما أمام كاتب العدل أو المنصة الرسمية المعتمدة.
3. فتح الحساب البنكي المخصص تحت التأسيس وإيداع رأس المال واستخراج الشهادة المصرفية اللازمة.
4. سداد الرسوم الحكومية والغرف التجارية واستلام السجل التجاري والتراخيص البلدية والضريبية.
5. تنتهي هذه الصلاحيات تلقائياً وبقوة القانون بمجرد صدور السجل التجاري النهائي واعتماد مجلس المديرين/الإدارة.

خامساً: المدة والعزل
تسري هذه الوكالة لمدة أقصاها: [EXPIRY_DATE] وتنقضي باكتمال التأسيس أو بالإلغاء الخطي المسبق من المؤسس المسجل لدى دائرة الشركات.

سادساً: التوقيع والشهود
توقيع المؤسس الموكِّل: _______________________    التاريخ: [DATE]
الشاهد الأول: [WITNESS_1] | الهوية: [W1_ID] | التوقيع: ________________
الشاهد الثاني: [WITNESS_2] | الهوية: [W2_ID] | التوقيع: ________________

سابعاً: التوثيق لدى الكاتب العدل أو كاتب عدل الشركات
جهة التوثيق: [CORPORATE_NOTARY_OFFICE]
رقم التوثيق: [REGISTRATION_NUMBER]    الختم الرسمي: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: COMPANY FORMATION & CORPORATE AFFAIRS POA
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PRINCIPAL (FOUNDING SHAREHOLDER / INCORPORATOR)
Full Legal Name: [PRINCIPAL_NAME] | Passport / National ID: [PRINCIPAL_ID]
Nationality: [PRINCIPAL_NATIONALITY] | Address: [PRINCIPAL_ADDRESS]
Capacity: Founder holding ([SHARE_PERCENTAGE]%) equity interest in the entity to be formed.

2. ATTORNEY-IN-FACT (INCORPORATING AGENT)
Full Legal Name: [AGENT_NAME] | ID/Passport: [AGENT_ID] | Address: [AGENT_ADDRESS]

3. TARGET ENTITY SPECIFICATIONS
Proposed Corporate Name: [COMPANY_NAME]
Corporate Legal Structure: [COMPANY_LEGAL_FORM] (e.g., LLC / Private Joint Stock)
Proposed Capital: ([CAPITAL_AMOUNT]) [CURRENCY]
Competent Authority / Ministry: [MINISTRY_OR_COMMERCIAL_REGISTRY]

4. ENUMERATED INCORPORATION POWERS (STRICT CONFINES)
a. Secure trade name reservation and preliminary regulatory/foreign investment clearances.
b. Execute Articles of Association, Memorandum of Association, and foundational bylaws before the Notary Public or electronic corporate registry.
c. Open an escrow "under-formation" bank account, deposit designated capital, and procure banking capital certificates.
d. Settle statutory filing fees, chamber of commerce registration, and collect commercial registry certificates and municipal licenses.
e. AUTOMATIC EXPIRATION: Authority automatically terminates upon issuance of the final commercial registry and formal assumption of duties by the Board/Manager.

5. TERM & REVOCATION
Expires on: [EXPIRY_DATE] or upon formal completion of formation, whichever occurs first; revocable prior to execution of foundational deeds by written notice to the registry.

6. SIGNATURES & WITNESSES
Principal Signature: _______________________    Date: [DATE]
Witness 1: [WITNESS_1] | ID: [W1_ID] | Signature: ________________
Witness 2: [WITNESS_2] | ID: [W2_ID] | Signature: ________________

7. NOTARIAL OR CORPORATE REGISTRY AUTHENTICATION
Notary Public / Corporate Registrar: [CORPORATE_NOTARY_OFFICE]
Authentication No.: [REGISTRATION_NUMBER]    Official Seal: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 6. VEHICLE & CUSTOMS CLEARANCE POA ───────────────────────────────────
  {
    id: 'poa-vehicle-customs',
    typeKey: 'vehicle',
    titleAr: 'نموذج مسودة وكالة مركبات وتخليص جمركي',
    titleEn: 'Draft Vehicle & Customs Clearance Power of Attorney',
    descriptionAr: 'مسودة استرشادية لتوكيل مخلص جمركي أو وكيل لنقل ملكية مركبة أو ترخيصها أو استلام شحنات جمركية.',
    descriptionEn: 'Informational drafting template authorizing an agent or customs broker to handle vehicle transfers, licensing, and border clearance.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'GLOBAL'],
    usageContextAr: 'يُستخدم لتفويض إجراءات نقل ملكية المركبات لدى إدارات السير والمرور والتخليص الجمركي في الموانئ والمنافذ الحدودية.',
    usageContextEn: 'Used to delegate motor vehicle title registration and customs clearance before port and traffic departments.',
    legalBasisAr: 'قوانين السير والمرور وأنظمة الجمارك الموحدة ولوائح استيراد وتصدير المركبات والبضائع',
    legalBasisEn: 'Traffic & Motor Vehicle Acts, Unified Customs Law, and Port Authority Regulations',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة خاصة بالمركبات والتخليص الجمركي (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: أطراف الوكالة
الموكِّل (مالك المركبة / المستورد):
الاسم الكامل: [PRINCIPAL_NAME] | الهوية: [PRINCIPAL_ID] | العنوان: [PRINCIPAL_ADDRESS]
الوكيل (المفوَّض / المخلص الجمركي):
الاسم الكامل: [AGENT_NAME] | الهوية/رخصة التخليص: [AGENT_ID] | العنوان: [AGENT_ADDRESS]

ثانياً: بيانات المركبة أو الشحنة محل التفويض
المركبة:
نوع وصانع المركبة: [VEHICLE_MAKE_MODEL]    سنة الصنع: [MODEL_YEAR]
رقم اللوحة: [PLATE_NUMBER]    رقم الهيكل (VIN/Chassis): [CHASSIS_VIN_NO]
رقم رخصة الاقتناء/السير: [REGISTRATION_CARD_NO]
الشحنة (في حال التخليص الجمركي):
رقم بوليصة الشحن (B/L): [BILL_OF_LADING_NO]    المنفذ الجمركي: [CUSTOMS_PORT]

ثالثاً: الصلاحيات المحددة حصراً
1. [ ] الفحص الفني وتجديد رخصة المركبة لدى إدارة المرور والسير المختصة.
2. [ ] بيع المركبة وإفراغ ملكيتها واستلام الثمن أو الشراء ونقل الملكية لاسم الموكل.
3. [ ] تقديم البيانات الجمركية ودفع الرسوم والضرائب واستلام إذن التسليم والشحنات.
4. [ ] قيادة المركبة داخل الإقليم الجغرافي المحدد: [AUTHORIZED_TERRITORY].

رابعاً: المدة والانتهاء
تسري هذه الوكالة اعتباراً من [START_DATE] حتى [END_DATE] فقط.

خامساً: حق العزل
يحق للموكل عزل الوكيل وإلغاء التفويض بموجب إشعار خطي رسمي موثق يُخطر به قسم المرور أو المنفذ الجمركي المختص.

سادساً: التوقيع والشهود
توقيع الموكِّل: _______________________    التاريخ: [DATE]
الشاهد: [WITNESS_NAME] | الهوية: [WITNESS_ID] | التوقيع: ________________

سابعاً: توثيق الكاتب العدل / إدارة المرور
الدائرة التوثيقية: [NOTARY_OR_TRAFFIC_DEPT]
رقم القيد: [REGISTRATION_NUMBER]    الختم الرسمي: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: VEHICLE & CUSTOMS CLEARANCE POWER OF ATTORNEY
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PARTIES
PRINCIPAL (VEHICLE OWNER / IMPORTER):
Full Name: [PRINCIPAL_NAME] | National ID/Passport: [PRINCIPAL_ID] | Address: [PRINCIPAL_ADDRESS]
ATTORNEY-IN-FACT (AUTHORIZED AGENT / LICENSED CUSTOMS BROKER):
Full Name: [AGENT_NAME] | ID / Broker License: [AGENT_ID] | Address: [AGENT_ADDRESS]

2. VEHICLE OR SHIPMENT SPECIFICATION
Vehicle:
Make & Model: [VEHICLE_MAKE_MODEL]    Year: [MODEL_YEAR]
Plate No.: [PLATE_NUMBER]    Chassis (VIN) No.: [CHASSIS_VIN_NO]
Registration Certificate No.: [REGISTRATION_CARD_NO]
Customs Shipment (if applicable):
Bill of Lading No.: [BILL_OF_LADING_NO]    Port of Entry: [CUSTOMS_PORT]

3. ENUMERATED AUTHORITIES (STRICTLY SPECIFIED)
a. [ ] Technical inspection and vehicle registration renewal before the Department of Motor Vehicles.
b. [ ] Title transfer, conveyance, receipt of consideration, or purchase and titling in the Principal's name.
c. [ ] Customs declaration submission, duty payment, clearance documentation, and physical cargo release.
d. [ ] Vehicle operation strictly within the designated territory: [AUTHORIZED_TERRITORY].

4. TERM & DURATION
Effective strictly from [START_DATE] through [END_DATE].

5. REVOCATION
Revocable at will by the Principal via written notice delivered to the competent Traffic Authority or Port Customs Directorate.

6. SIGNATURES & WITNESS
Principal Signature: _______________________    Date: [DATE]
Witness: [WITNESS_NAME] | ID: [WITNESS_ID] | Signature: ________________

7. NOTARY PUBLIC / TRAFFIC DEPARTMENT ATTESTATION
Authority Office: [NOTARY_OR_TRAFFIC_DEPT]
Ref. Registration No.: [REGISTRATION_NUMBER]    Seal: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 7. INHERITANCE & ESTATE ADMINISTRATION POA ───────────────────────────
  {
    id: 'poa-inheritance-estate',
    typeKey: 'inheritance',
    titleAr: 'نموذج مسودة وكالة حصر إرث وتصفية تركة',
    titleEn: 'Draft Probate & Estate Administration Power of Attorney',
    descriptionAr: 'مسودة استرشادية لتوكيل أحد الورثة أو وكيلاً شرعياً لمتابعة حصر الإرث وتصفية وقسمة أعيان التركة.',
    descriptionEn: 'Informational drafting template authorizing an agent or co-heir to represent estate administration, probate, and distribution.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'KW', 'QA', 'GLOBAL'],
    usageContextAr: 'يُستخدم بين الورثة الشرعيين لتمثيلهم أمام محاكم الأحوال الشخصية والدوائر العقارية في إجراءات الإرث، مع مراعاة القيود المتعلقة بغير الرشداء.',
    usageContextEn: 'Used among lawful heirs before personal status courts and probate registries; strictly subject to minor guardianship statutory restrictions.',
    legalBasisAr: 'قوانين الأحوال الشخصية وأحكام المواريث والتركات والتشريعات المنظمة لحماية أموال القاصرين والغيّب',
    legalBasisEn: 'Personal Status Codes, Probate and Succession Laws, and Statutory Guardianship Regulations',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة خاصة بحصر الإرث وقسمة التركة (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: بيانات الوارث الموكِّل
الاسم الكامل: [PRINCIPAL_NAME] | الهوية: [PRINCIPAL_ID] | العنوان: [PRINCIPAL_ADDRESS]
صفته الشرعية: [RELATIONSHIP_TO_DECEASED] (ابن/بنت/زوجة/أخ/شريك في التركة)
بيانات المورّث المتوفى:
اسم المتوفى: [DECEASED_NAME] | تاريخ الوفاة: [DATE_OF_DEATH]
رقم حجة/صك حصر الورثة: [HEIRS_CERTIFICATE_NO] | المحكمة المصدرة: [PROBATE_COURT]

ثانياً: بيانات الوكيل المفوَّض
الاسم الكامل: [AGENT_NAME] | الهوية: [AGENT_ID] | العنوان: [AGENT_ADDRESS]

ثالثاً: الصلاحيات الممنوحة
1. استخراج الشهادات وحجج حصر الإرث والوفاة من المحاكم والدوائر المختصة.
2. حصر أعيان التركة من أموال نقدية وعقارات وأسهم وحصص في شركات ومراجعة البنوك والجهات الرسمية.
3. التوقيع على وثائق القسمة الرضائية بين الورثة البالغين الرشداء بما لا يخالف الشريعة والقانون.
4. مراجعة دوائر الأراضي والتسجيل العقاري لنقل وتسجيل نصيب الموكل الشرعي في التركة.
5. قيد هام: لا تشمل هذه الوكالة أي تصرف في أموال أو أنصبة القاصرين أو المحجور عليهم إلا بإذن صريح مسبق من محكمة التركات المختصة.

رابعاً: المدة والانتهاء
تسري هذه الوكالة من تاريخ صدورها حتى إتمام قسمة وتصفية التركة أو حتى تاريخ: [EXPIRY_DATE].

خامساً: حق العزل
يحق للموكل عزل الوكيل بإخطار خطي موجه لمحكمة التركات والكاتب العدل والجهات المعنية بحفظ الأصول.

سادساً: التوقيع والشهود
توقيع الوارث الموكِّل: _______________________    التاريخ: [DATE]
الشاهد الأول: [WITNESS_1] | الهوية: [W1_ID] | التوقيع: ________________
الشاهد الثاني: [WITNESS_2] | الهوية: [W2_ID] | التوقيع: ________________

سابعاً: توثيق المحكمة الشرعية / محكمة الأحوال الشخصية / الكاتب العدل
الجهة القضائية/التوثيقية: [PROBATE_COURT_OR_NOTARY]
رقم السجل: [PROBATE_REG_NO]    الختم الرسمي: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: PROBATE & ESTATE ADMINISTRATION POWER OF ATTORNEY
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PRINCIPAL (HEIR / BENEFICIARY)
Full Legal Name: [PRINCIPAL_NAME] | National ID: [PRINCIPAL_ID] | Address: [PRINCIPAL_ADDRESS]
Legal Status: [RELATIONSHIP_TO_DECEASED] (e.g., Son / Daughter / Surviving Spouse / Co-heir)
DECEASED DETAILS:
Full Name of Decedent: [DECEASED_NAME] | Date of Death: [DATE_OF_DEATH]
Heirship Certificate / Probate Ref No.: [HEIRS_CERTIFICATE_NO] | Issuing Court: [PROBATE_COURT]

2. ATTORNEY-IN-FACT (AGENT / REPRESENTATIVE HEIR)
Full Legal Name: [AGENT_NAME] | National ID: [AGENT_ID] | Address: [AGENT_ADDRESS]

3. ENUMERATED ESTATE POWERS
a. Obtain probate certificates, heirship declarations, and vital records from competent courts.
b. Inventory and discover estate assets (bank deposits, real estate parcels, securities, business equity).
c. Execute consensual estate partition deeds strictly among adult, legally capacitated heirs.
d. File with land registration directorates to record and convey the Principal's lawful hereditary share.
e. MANDATORY RESTRICTION: This instrument confers NO authority to alienate or compromise assets of minor heirs, incapacitated persons, or wards without express prior judicial probate court authorization.

4. TERM & TERMINATION
Effective until formal completion of estate partition or until: [EXPIRY_DATE].

5. REVOCATION
Revocable at will by the Principal via written notice filed with the competent Probate Court and Notary Public.

6. SIGNATURES & WITNESSES
Principal Signature: _______________________    Date: [DATE]
Witness 1: [WITNESS_1] | ID: [W1_ID] | Signature: ________________
Witness 2: [WITNESS_2] | ID: [W2_ID] | Signature: ________________

7. PROBATE COURT / NOTARIAL ATTESTATION
Judicial Authority: [PROBATE_COURT_OR_NOTARY]
Probate Registry No.: [PROBATE_REG_NO]    Seal: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 8. MINOR TRAVEL CONSENT & EXIT PERMIT POA ────────────────────────────
  {
    id: 'poa-travel-minor',
    typeKey: 'minor-travel',
    titleAr: 'نموذج مسودة إذن وتفويض سفر قاصر',
    titleEn: 'Draft Minor International Travel Consent & Guardian Authorization',
    descriptionAr: 'مسودة استرشادية لموافقة الولي الشرعي على سفر قاصر بصحبة مرافق مرخص لفترة ووجهة محددة.',
    descriptionEn: 'Informational drafting template for parental consent and guardian authorization for minor international travel.',
    jurisdictions: ['JO', 'SA', 'AE', 'EG', 'KW', 'GLOBAL'],
    usageContextAr: 'يُستخدم لاستيفاء اشتراطات سلطات الجوازات والحدود وشركات الطيران لسفر القاصرين دون سن الرشد بصحبة غير الولي.',
    usageContextEn: 'Used to fulfill border control, immigration, and airline requirements for accompanied minor travel.',
    legalBasisAr: 'قوانين الأحوال الشخصية ونظام وثائق السفر وتعليمات إدارات الإقامة والحدود المنظمة لسفر القاصرين',
    legalBasisEn: 'Personal Status Law (Custody/Guardianship), Passports and Border Control Acts, and International Minor Travel Regulations',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: إذن سفر قاصر وموافقة الولي الشرعي (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: بيانات الولي/الوصي الشرعي المانح للإذن
الاسم الكامل: [PARENT_GUARDIAN_NAME]
الهوية الوطنية / جواز السفر: [GUARDIAN_ID]
الصفة الشرعية: [LEGAL_CAPACITY] (أب / أم حاصلة على صك الحضانة / وصي شرعي بموجب صك رقم [COURT_ORDER_NO])
العنوان: [GUARDIAN_ADDRESS] | الهاتف: [GUARDIAN_PHONE]

ثانياً: بيانات الطفل القاصر
الاسم الكامل: [CHILD_FULL_NAME]
تاريخ الميلاد: [DOB]    الجنسية: [NATIONALITY]
رقم جواز السفر: [PASSPORT_NO]    تاريخ انتهاء الجواز: [PASSPORT_EXPIRY]

ثالثاً: بيانات المرافق المأذون له
الاسم الكامل: [COMPANION_NAME] | الهوية/الجواز: [COMPANION_ID]
صلة القرابة / الصفة: [RELATION_TO_CHILD] | هاتف المرافق: [COMPANION_PHONE]

رابعاً: تفاصيل الرحلة المصرح بها حصراً
دولة الوجهة المقصودة: [DESTINATION_COUNTRY]
تاريخ المغادرة المصرح به: [DEPARTURE_DATE]
تاريخ العودة الإلزامية: [RETURN_DATE]
وسيلة السفر / رقم الرحلة (إن وجد): [FLIGHT_DETAILS]

خامساً: الصلاحيات الممنوحة للمرافق
1. مرافقة القاصر واستكمال إجراءات الصعود والجوازات والحدود والفنادق خلال الرحلة المحددة فقط.
2. اتخاذ القرارات الإسعافية والطبية الطارئة في حال تعذر الاتصال الفوري بالولي.
3. التعهد بإعادة القاصر إلى محل إقامته المعتاد فور انتهاء المدة المصرح بها.

سادساً: التوقيع والشهود
توقيع الولي الشرعي: _______________________    التاريخ: [DATE]
تعهد وتوقيع المرافق: _____________________    التاريخ: [DATE]
الشاهد الأول: [WITNESS_1] | الهوية: [W1_ID] | التوقيع: ________________
الشاهد الثاني: [WITNESS_2] | الهوية: [W2_ID] | التوقيع: ________________

سابعاً: توثيق الكاتب العدل / قاضي التوثيقات
جهة التوثيق: [NOTARY_PUBLIC_OFFICE]
رقم القيد: [REGISTRATION_NUMBER]    الختم الرسمي: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: MINOR INTERNATIONAL TRAVEL CONSENT & GUARDIAN AUTHORIZATION
(For Drafting & Informational Guidance Purposes)
================================================================================

1. AUTHORIZING PARENT / LEGAL GUARDIAN
Full Legal Name: [PARENT_GUARDIAN_NAME]
National ID / Passport No.: [GUARDIAN_ID]
Legal Capacity: [LEGAL_CAPACITY] (Father / Custodial Mother via Court Decree No. [COURT_ORDER_NO] / Legal Guardian)
Address: [GUARDIAN_ADDRESS] | Contact: [GUARDIAN_PHONE]

2. MINOR CHILD SPECIFICATIONS
Full Name: [CHILD_FULL_NAME]
Date of Birth: [DOB]    Nationality: [NATIONALITY]
Passport No.: [PASSPORT_NO]    Passport Expiration Date: [PASSPORT_EXPIRY]

3. AUTHORIZED TRAVEL COMPANION
Full Legal Name: [COMPANION_NAME] | ID / Passport No.: [COMPANION_ID]
Relationship to Minor: [RELATION_TO_CHILD] | Phone: [COMPANION_PHONE]

4. PERMITTED TRAVEL ITINERARY
Destination Country / Jurisdiction: [DESTINATION_COUNTRY]
Authorized Departure Date: [DEPARTURE_DATE]
Mandatory Return Date: [RETURN_DATE]
Carrier / Flight Information (if scheduled): [FLIGHT_DETAILS]

5. SCOPE OF ACCOMPANYING AUTHORITY
a. Accompany the minor through airport immigration, border checkpoints, and hotel accommodations for the specific itinerary.
b. Consent to emergency pediatric care and treatment if the parent cannot be immediately contacted.
c. The companion covenants to return the minor safely to the custodial parent on or before the authorized return date.

6. SIGNATURES & WITNESSES
Parent/Guardian Signature: _______________________    Date: [DATE]
Companion Acceptance & Undertaking: __________________    Date: [DATE]
Witness 1: [WITNESS_1] | ID: [W1_ID] | Signature: ________________
Witness 2: [WITNESS_2] | ID: [W2_ID] | Signature: ________________

7. NOTARIAL OR JUDICIAL ATTESTATION
Notary Public Office: [NOTARY_PUBLIC_OFFICE]
Authentication Record No.: [REGISTRATION_NUMBER]    Official Seal: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 9. MEDICAL & HEALTHCARE PROXY POA ────────────────────────────────────
  {
    id: 'poa-medical-healthcare',
    typeKey: 'medical',
    titleAr: 'نموذج مسودة وكالة رعاية صحية وقرارات طبية',
    titleEn: 'Draft Healthcare Proxy & Medical Decision Power of Attorney',
    descriptionAr: 'مسودة استرشادية لتعيين وكيل صحي لاتخاذ القرارات الطبية في حال فقدان الأهلية أو عدم القدرة على التعبير.',
    descriptionEn: 'Informational drafting template designating a healthcare surrogate/proxy for medical decisions during incapacity.',
    jurisdictions: ['JO', 'AE', 'SA', 'US', 'GB', 'AU', 'CA', 'GLOBAL'],
    usageContextAr: 'يُستخدم لتعيين شخص موثوق لرعاية القرارات الطبية عند العجز الصحي وفق تشريعات حقوق المرضى ومحددات الأهلية الطبية.',
    usageContextEn: 'Used to designate a healthcare decision-maker in the event of medical incapacity under applicable patient rights legislation.',
    legalBasisAr: 'تشريعات المسؤولية الطبية وحقوق المريض وقوانين الولاية على النفس والأخلاقيات الحيوية المعتمدة',
    legalBasisEn: 'Healthcare Decisions Acts, Medical Consent Statutes, and Patient Self-Determination Regulations',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة رعاية صحية وتفويض طبي (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: بيانات الموكِّل (المريض/صاحب القرار)
الاسم الكامل: [PRINCIPAL_NAME] | الهوية: [PRINCIPAL_ID] | العنوان: [PRINCIPAL_ADDRESS]

ثانياً: بيانات الوكيل الصحي المفوَّض
الاسم الكامل: [HEALTHCARE_AGENT_NAME] | الهوية: [AGENT_ID]
صلة القرابة: [RELATIONSHIP] | الهاتف (على مدار الساعة): [AGENT_PHONE]
الوكيل البديل (في حال تعذر حضور الوكيل الرئيسي):
الاسم: [ALTERNATE_AGENT_NAME] | الهوية: [ALT_ID] | الهاتف: [ALT_PHONE]

ثالثاً: شرط السريان (شرط التعليق على فقدان الأهلية)
لا تُفعَّل الصلاحيات الممنوحة في هذه الوكالة إلا إذا أثبت تقرير طبي صادر عن طبيبين معالجين مرخصين أن الموكل أصبح عاجزاً صحياً أو غير قادر على فهم الخيارات الطبية والتعبير عن إرادته.

رابعاً: الصلاحيات الطبية المحددة
1. الاطلاع الكامل على الملفات والتقارير الطبية والسجلات الصحية بموجب قوانين خصوصية المرضى.
2. التشاور مع الأطباء وهيئات الرعاية الصحية وإعطاء الموافقة المستنيرة على الإجراءات الجراحية والعلاجية اللازمة لمصلحة الموكل.
3. الموافقة على نقل المريض إلى منشآت رعاية طبية متخصصة.
4. التقيد بالتوجيهات المسبقة (إن وجدت) الصادرة عن الموكل بشأن التدابير الداعمة للحياة.

خامساً: حق الإلغاء
يحق للموكل إلغاء هذه الوكالة الصحية شفهياً أو خطياً في أي وقت طالما كان متمتعاً بالأهلية العقلية المعتبرة.

سادساً: التوقيع وشهادة الشاهدين المستقلين
(يشترط في معظم التشريعات ألا يكون الشاهدان من الوكلاء المعينين أو الأطباء المعالجين أو ورثة الموكل)
توقيع الموكِّل: _______________________    التاريخ: [DATE]
الشاهد الأول (مستقل): [WITNESS_1_NAME] | الهوية: [W1_ID] | التوقيع: ________________
الشاهد الثاني (مستقل): [WITNESS_2_NAME] | الهوية: [W2_ID] | التوقيع: ________________

سابعاً: التوثيق لدى الكاتب العدل أو المنشأة الطبية
جهة التوثيق: [HEALTH_NOTARY_OR_HOSPITAL]
رقم القيد: [REGISTRATION_NUMBER]    الختم: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: HEALTHCARE PROXY & MEDICAL DECISION POWER OF ATTORNEY
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PRINCIPAL (PATIENT / GRANTOR)
Full Legal Name: [PRINCIPAL_NAME] | National ID/Passport: [PRINCIPAL_ID] | Address: [PRINCIPAL_ADDRESS]

2. DESIGNATED HEALTHCARE AGENT (SURROGATE)
Full Legal Name: [HEALTHCARE_AGENT_NAME] | National ID: [AGENT_ID]
Relationship: [RELATIONSHIP] | 24-Hour Emergency Phone: [AGENT_PHONE]
ALTERNATE HEALTHCARE AGENT (IF PRIMARY IS UNAVAILABLE OR UNWILLING):
Full Name: [ALTERNATE_AGENT_NAME] | ID: [ALT_ID] | Phone: [ALT_PHONE]

3. SPRINGING CONDITION PRECEDENT (INCAPACITY TRIGGER)
The authorities granted hereunder shall become effective ONLY if and when two licensed attending physicians certify in writing that the Principal lacks decision-making capacity to understand medical conditions and communicate treatment choices.

4. SCOPE OF MEDICAL AUTHORITIES
a. Full access to protected medical records and diagnostic summaries under applicable healthcare privacy laws.
b. Consult with treating healthcare professionals and provide informed consent or refusal for surgical, diagnostic, and palliative procedures in the Principal's best medical interests.
c. Authorize admission or transfer to specialized hospitals, rehabilitation facilities, or hospice care.
d. Honor any separate Living Will or Advance Health Directive executed by the Principal regarding life-sustaining interventions.

5. REVOCABILITY
The Principal retains the absolute right to revoke this Healthcare Proxy at any time, orally or in writing, while retaining mental capacity.

6. SIGNATURES & INDEPENDENT WITNESS ATTESTATION
(Disinterested witnesses: must not be appointed agents, attending clinicians, or beneficiaries under the Principal's estate)
Principal Signature: _______________________    Date: [DATE]
Independent Witness 1: [WITNESS_1_NAME] | ID: [W1_ID] | Signature: ________________
Independent Witness 2: [WITNESS_2_NAME] | ID: [W2_ID] | Signature: ________________

7. NOTARIAL OR MEDICAL FACILITY ACKNOWLEDGMENT
Attesting Authority / Hospital: [HEALTH_NOTARY_OR_HOSPITAL]
Record No.: [REGISTRATION_NUMBER]    Official Seal: ________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },

  // ── 10. INTELLECTUAL PROPERTY MANAGEMENT POA ──────────────────────────────
  {
    id: 'poa-intellectual-property',
    typeKey: 'ip-management',
    titleAr: 'نموذج مسودة وكالة خاصة بالملكية الفكرية وبراءات الاختراع',
    titleEn: 'Draft Intellectual Property & Patent Representation POA',
    descriptionAr: 'مسودة استرشادية لتوكيل وكيل ملكية فكرية أو محامٍ لتسجيل العلامات التجارية وبراءات الاختراع ومتابعة المنازعات.',
    descriptionEn: 'Informational drafting template authorizing an IP agent or attorney to register trademarks, patents, and manage IP enforcement.',
    jurisdictions: ['JO', 'AE', 'SA', 'US', 'GB', 'EU', 'SG', 'AU', 'CA', 'GLOBAL'],
    usageContextAr: 'يُستخدم لتفويض مكاتب الملكية الفكرية المعتمدة أمام مكاتب براءات الاختراع والعلامات الوطنية والدولية، مع مراعاة اشتراطات التصديق القنصلي أو الأبوستيل (Apostille) في المعاملات الدولية.',
    usageContextEn: 'Used to authorize accredited IP agents before national and international patent/trademark offices; subject to Apostille/consular legalization in cross-border filings.',
    legalBasisAr: 'قوانين حماية الملكية الصناعية وحق المؤلف واتفاقيات باريس وتريبس (TRIPS) ونظام معاهدة التعاون بشأن البراءات (PCT)',
    legalBasisEn: 'Patent & Trademark Acts, Paris Convention, TRIPS Agreement, and WIPO/PCT Administrative Regulations',
    downloads: 0,
    rating: 0,
    templateAr: `================================================================================
نموذج مسودة: وكالة خاصة بالملكية الفكرية (لأغراض الصياغة والاسترشاد)
================================================================================

أولاً: بيانات الموكِّل (مالك الحق الفكري / مقدم الطلب)
الاسم التجاري / الشخصي: [PRINCIPAL_NAME] | الهوية/السجل التجاري: [PRINCIPAL_ID]
الدولة المقر/الإقامة: [PRINCIPAL_COUNTRY] | العنوان: [PRINCIPAL_ADDRESS]

ثانياً: وكيل الملكية الفكرية المعتمد
اسم الوكيل / شركة المحاماة: [IP_AGENT_NAME]
رقم ترخيص وكيل الملكية الفكرية المعتمد: [IP_PRACTICE_LICENSE]
العنوان: [AGENT_ADDRESS] | البريد الإلكتروني: [AGENT_EMAIL]

ثالثاً: الأصول الفكرية المشمولة
[ ] علامات تجارية: [TRADEMARK_IDENTIFIERS]
[ ] براءات اختراع ونماذج منفعة: [PATENT_APPLICATION_TITLES]
[ ] رسوم ونماذج صناعية: [INDUSTRIAL_DESIGNS]
[ ] حقوق مؤلف ومصنفات برمجية: [COPYRIGHT_WORKS]

رابعاً: الصلاحيات المحددة
1. إعداد وتقديم ومتابعة طلبات التسجيل والفحص والتجديد أمام مكاتب الملكية الفكرية الوطنية والدولية (بما فيها WIPO).
2. استلام شهادات التسجيل ومخاطبة الفاحصين وسداد الرسوم والضرائب الرسمية.
3. تقديم الاعتراضات واللوائح والردود على قرارات الرفض ومباشرة إجراءات الشطب والتعديل.
4. قيد مشروط: لا تشمل هذه الوكالة التنازل عن ملكية الحق الفكري أو منح تراخيص حصرية ملزمة للغير إلا بموجب اتفاقية ترخيص منفصلة وموقعة مباشرة من المالك الأصيل.

خامساً: المدة والإنهاء
تسري هذه الوكالة من تاريخ توثيقها حتى إنجاز الإجراءات المطلوبة أو حتى تاريخ: [EXPIRY_DATE]، مع احتفاظ المالك بحق إلغائها بإشعار كتابي لمكتب الملكية الفكرية المختص.

سادساً: التوقيع والتوثيق والتصديق الدولي
توقيع المالك الموكِّل: _______________________    التاريخ: [DATE]
توثيق الكاتب العدل المحلي: [NOTARY_OFFICE] | المرجع: [NOTARY_REF]
(في حال الاستخدام الدولي: يُلزم التصديق القنصلي أو ختم الأبوستيل Apostille وفق اتفاقية لاهاي 1961):
ختم الأبوستيل / التصديق الدبلوماسي: _______________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_AR}
--------------------------------------------------------------------------------`,
    templateEn: `================================================================================
DRAFT TEMPLATE: INTELLECTUAL PROPERTY & PATENT REPRESENTATION POA
(For Drafting & Informational Guidance Purposes)
================================================================================

1. PRINCIPAL (IP OWNER / APPLICANT)
Full Legal / Corporate Name: [PRINCIPAL_NAME] | Commercial Reg / ID: [PRINCIPAL_ID]
Country of Domicile: [PRINCIPAL_COUNTRY] | Address: [PRINCIPAL_ADDRESS]

2. ACCREDITED IP AGENT / ATTORNEY
Agent / Firm Name: [IP_AGENT_NAME]
IP Practice / Bar Admission License No.: [IP_PRACTICE_LICENSE]
Address: [AGENT_ADDRESS] | Email: [AGENT_EMAIL]

3. COVERED IP ASSETS
[ ] Trademarks & Service Marks: [TRADEMARK_IDENTIFIERS]
[ ] Patents & Utility Models: [PATENT_APPLICATION_TITLES]
[ ] Industrial Designs: [INDUSTRIAL_DESIGNS]
[ ] Copyrights & Software Works: [COPYRIGHT_WORKS]

4. ENUMERATED IP AUTHORITIES
a. Prepare, file, prosecute, and maintain applications before national and international patent and trademark offices (including WIPO).
b. Receive registration certificates, respond to examiner office actions, and pay statutory maintenance/annuity fees.
c. File and prosecute opposition notices, cancellations, and administrative appeals.
d. EXPRESS RESERVATION: This instrument conveys NO authority to permanently assign, transfer, or encumber the underlying IP rights, which require a separate deed executed directly by the Principal.

5. TERM & REVOCATION
Valid from execution through completion of prosecution or until: [EXPIRY_DATE]; revocable at will via written notice delivered to the designated IP Registry.

6. SIGNATURES & CROSS-BORDER LEGALIZATION
Principal Signature: _______________________    Date: [DATE]
Local Notary Public Authentication: [NOTARY_OFFICE] | Ref: [NOTARY_REF]
(For Cross-Border Recognition: Apostille per Hague Convention 1961 or Consular Legalization required):
Apostille / Consular Stamp: _______________________

--------------------------------------------------------------------------------
${POA_DISCLAIMER_EN}
--------------------------------------------------------------------------------`,
  },
];

/**
 * Search POA library by keyword
 */
export function searchPOALibrary(query: string): POATemplate[] {
  if (!query.trim()) return POA_LIBRARY;
  const q = query.toLowerCase();
  return POA_LIBRARY.filter(poa =>
    poa.titleAr.toLowerCase().includes(q) ||
    poa.titleEn.toLowerCase().includes(q) ||
    poa.descriptionAr.toLowerCase().includes(q) ||
    poa.descriptionEn.toLowerCase().includes(q) ||
    poa.typeKey.toLowerCase().includes(q)
  );
}

/**
 * Get POA template by ID
 */
export function getPOAById(id: string): POATemplate | undefined {
  return POA_LIBRARY.find(poa => poa.id === id);
}

/**
 * Get POAs by jurisdiction
 */
export function getPOAsByJurisdiction(code: string): POATemplate[] {
  const upper = code.toUpperCase();
  return POA_LIBRARY.filter(poa => poa.jurisdictions.includes(upper) || poa.jurisdictions.includes('GLOBAL'));
}
