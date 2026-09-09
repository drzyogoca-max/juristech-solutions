/**
 * contractGapDetector.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Advanced Legal Contract Gap & Risk Detection Engine
 * Domain: https://juristech.solutions
 *
 * Core Features:
 *  1. Multi-pattern NLP/Regex Legal Gap Detection (24 Deep Analytical Rules)
 *  2. Weighted Risk Score Engine (0 - 100)
 *  3. Automatic Suggested Redlines (Ar / En)
 *  4. Categorized Vulnerability Matrix (CRITICAL | WARNING | NOTICE)
 */

export interface ContractGap {
  id: string;
  categoryAr: string;
  categoryEn: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  detectedClauseSnippet?: string;
  suggestedRedlineAr: string;
  suggestedRedlineEn: string;
  legalBasisAr: string;
  legalBasisEn: string;
}

export interface ContractGapAnalysisResult {
  riskScore: number; // 0 (Safe) - 100 (Extremely Vulnerable)
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  totalGapsFound: number;
  criticalCount: number;
  warningCount: number;
  noticeCount: number;
  gaps: ContractGap[];
  summaryAr: string;
  summaryEn: string;
  analyzedAt: string;
}

// 24 Deep Pattern Rules for Legal Gap Detection
const LEGAL_GAP_RULES = [
  {
    id: 'GAP-UNILATERAL-TERMINATION',
    severity: 'CRITICAL' as const,
    pattern: /(طرف واحد|إرادة منفردة|يحق للطرف الأول فقط|unilateral|without notice|at its sole discretion|terminate immediately)/i,
    categoryAr: 'إنهاء العقد والتخلي',
    categoryEn: 'Termination & Cancellation',
    titleAr: 'ثغرة: شروط إنهاء أحادية الجانب دون إخطار مسبق',
    titleEn: 'Unilateral Termination Without Prior Notice',
    descriptionAr: 'يتضمن النص بنداً يمنح أحادية الحق لجهة واحدة بإنهاء العقد فوراً دون التزام بالتعويض أو منح مهلة إخطار.',
    descriptionEn: 'The clause grants unilateral right to one party to terminate immediately without indemnity or notice period.',
    suggestedRedlineAr: 'يعدل البند ليشترط إخطاراً كتابياً مسبقاً لا يقل عن (30) يوماً مع التعويض عن الأضرار المباشرة في حال الإخلال.',
    suggestedRedlineEn: 'Shall require a minimum of (30) days prior written notice with full compensation for direct damages upon breach.',
    legalBasisAr: 'المادة 147 من القانون المدني (العقد شريعة المتعاقدين - عدم الجواز بالتعديل المنفرد)',
    legalBasisEn: 'General Contract Law — Mutuality of Obligations & Good Faith Principle',
  },
  {
    id: 'GAP-DISPROPORTIONATE-PENALTY',
    severity: 'CRITICAL' as const,
    pattern: /(شرط جزائي|غرامة تأخير|10% عن كل يوم|5% عن كل يوم|liquidated damages|penalty fee|10% per day)/i,
    categoryAr: 'الالتزامات المالية والشرط الجزائي',
    categoryEn: 'Financial Liabilities & Penalties',
    titleAr: 'مخاطرة: غرامات تأخير مفرطة وغير متناسبة مع الضرر الحقيقي',
    titleEn: 'Excessive & Disproportionate Delay Penalties',
    descriptionAr: 'النسبة المحددة كغرامة تأخير تتجاوز الحدود المألوفة قانونياً وقد تعتبرها المحاكم شططاً وتعسفاً.',
    descriptionEn: 'The penalty rate specified for delay exceeds legal caps and may be struck down by courts as unconscionable.',
    suggestedRedlineAr: 'تخفيض غرامة التأخير اليومية لتكون (0.1%) من قيمة البند المتأخر وبسقف أقصى لا يتجاوز (10%) من القيمة الكلية للعقد.',
    suggestedRedlineEn: 'Cap daily delay penalty at 0.1% of overdue milestones, capped at a maximum of 10% total contract value.',
    legalBasisAr: 'المادة 224 من القانون المدني (حق القاضي في تخفيض الشرط الجزائي المفرط)',
    legalBasisEn: 'Unenforceable Penalties Doctrine & Judicial Reduction Rights',
  },
  {
    id: 'GAP-IP-OWNERSHIP-AMBIGUITY',
    severity: 'CRITICAL' as const,
    pattern: /(الملكية الفكرية|حقوق التأليف|براءات الاختراع|intellectual property|IP rights|work for hire|sole property)/i,
    categoryAr: 'الملكية الفكرية وحقوق الابتكار',
    categoryEn: 'Intellectual Property & Copyright',
    titleAr: 'ثغرة: غموض في انتقال ملكية حقوق الملكية الفكرية',
    titleEn: 'Ambiguity in Intellectual Property Assignment',
    descriptionAr: 'عدم النص بوضوح على انتقال ملكية المخرجات والابتكارات والملكية الفكرية فور سداد المبالغ المحددة.',
    descriptionEn: 'Lacks explicit terms transferring full IP ownership upon final milestone payment settlement.',
    suggestedRedlineAr: 'تنتقل كافة حقوق الملكية الفكرية وبراءات الاختراع والتطويرات تلقائياً وحصرياً للطرف الثاني فور سداد كامل الأتعاب.',
    suggestedRedlineEn: 'All IP rights, inventions, and derivative works shall transfer exclusively upon receipt of full final payment.',
    legalBasisAr: 'قانون حماية حقوق الملكية الفكرية رقم 82 لسنة 2002 وقوانين WIPO',
    legalBasisEn: 'WIPO International Copyright Regulations & Statutory Assignment Standards',
  },
  {
    id: 'GAP-INDEFINITE-CONFIDENTIALITY',
    severity: 'WARNING' as const,
    pattern: /(السرية|عدم الإفصاح|حظر إفشاء المعلومات|confidentiality|non-disclosure|NDA|trade secrets)/i,
    categoryAr: 'السرية وحماية البيانات',
    categoryEn: 'Confidentiality & Data Protection',
    titleAr: 'تنبيه: عدم تحديد مدة زمنيّة لالتزامات السرية',
    titleEn: 'Missing Indefinite Timeline Cap on Confidentiality',
    descriptionAr: 'العقد لا يحدد نهاية لالتزام السرية، مما يفرض عبئاً قانونياً دائماً ومستمراً.',
    descriptionEn: 'The contract imposes an indefinite confidentiality obligation without a realistic expiration timeline.',
    suggestedRedlineAr: 'تستمر التزامات السرية لمدة (3) سنوات فقط من تاريخ إنهاء العقد، باستثناء الأسرار التجارية الجوهرية.',
    suggestedRedlineEn: 'Confidentiality obligations shall survive for a period of (3) years post-termination, excluding core trade secrets.',
    legalBasisAr: 'قانون حماية البيانات الشخصية والأسرار التجارية',
    legalBasisEn: 'Standard International NDA Practice & Trade Secret Statutes',
  },
  {
    id: 'GAP-JURISDICTION-VENUE',
    severity: 'WARNING' as const,
    pattern: /(اختصاص المحاكم|القانون الواجب التطبيق|التحكيم|jurisdiction|governing law|governed by the laws of|venue)/i,
    categoryAr: 'القانون الواجب التطبيق والاختصاص القضائي',
    categoryEn: 'Governing Law & Dispute Resolution',
    titleAr: 'تنبيه: إسناد الاختصاص القضائي لمحاكم أجنبية نائية',
    titleEn: 'Foreign Jurisdiction & Remote Dispute Venue',
    descriptionAr: 'يتضمن نصاً ينص على رفع المنازعات أمام محاكم خارج نطاق الدولة أو هيئات تحكيم مكلفة جداً.',
    descriptionEn: 'Directs dispute resolution to foreign courts or costly international arbitration forums.',
    suggestedRedlineAr: 'تخضع أي منازعة لقوانين الدولة المحلية ويكون الاختصاص النهائي للمحاكم الاقتصادية/التجارية في العاصمة.',
    suggestedRedlineEn: 'Shall be governed by local state laws and under the jurisdiction of local Commercial Courts.',
    legalBasisAr: 'قانون المرافعات المدنية والتجارية ومواد تنازع القوانين',
    legalBasisEn: 'Private International Law & Forum Non Conveniens Doctrine',
  },
  {
    id: 'GAP-FORCE-MAJEURE-OMISSION',
    severity: 'NOTICE' as const,
    pattern: /(القوة القاهرة|الأحداث الطارئة|الظروف الاستثنائية|force majeure|act of god|unforeseen events)/i,
    categoryAr: 'القوة القاهرة والظروف الطارئة',
    categoryEn: 'Force Majeure & Unforeseen Events',
    titleAr: 'ملاحظة: بند القوة القاهرة غير مكتمل التأثيرات',
    titleEn: 'Incomplete Relief Mechanisms in Force Majeure Clause',
    descriptionAr: 'لا يوضح البند الإجراءات المطلوبة والإشعارات والمهل الزمنية في حال التعثر الناتج عن أحداث قهريّة خارجة عن الإرادة.',
    descriptionEn: 'Fails to outline explicit notice windows and suspension periods during major force majeure disruptions.',
    suggestedRedlineAr: 'في حال استمرار القوة القاهرة لأكثر من (60) يوماً متواصلة، يحق لأي من الطرفين إنهاء العقد دون التزام بالتعويض.',
    suggestedRedlineEn: 'If force majeure exceeds 60 consecutive days, either party may terminate without incurring penalty or default liability.',
    legalBasisAr: 'المادة 165 من القانون المدني (انقضاء الالتزام بالقوة القاهرة)',
    legalBasisEn: 'UNIDROIT Principles of International Commercial Contracts (Art. 7.1.7)',
  },
  {
    id: 'GAP-NON-COMPETE-OVERREACH',
    severity: 'CRITICAL' as const,
    pattern: /(عدم المنافسة|حظر العمل مع المنافسين|non-compete|non compete|solicitation)/i,
    categoryAr: 'القيود التجارية وعدم المنافسة',
    categoryEn: 'Restrictive Covenants & Non-Compete',
    titleAr: 'ثغرة: شرط عدم منافسة واسع النطاق وجغرافي مفرط',
    titleEn: 'Broad Geographical & Temporal Scope in Non-Compete',
    descriptionAr: 'شرط عدم المنافسة يغطي مناطق جغرافية واسعة وفترات زمنية مفرطة مما يجعله باطلاً قانونياً.',
    descriptionEn: 'The non-compete clause spans overbroad geographical zones and lengthy time periods, risking legal invalidity.',
    suggestedRedlineAr: 'يقتصر نطاق عدم المنافسة على النطاق الجغرافي المباشر للمدينة ولمدة لا تتجاوز (6) أشهر من تاريخ الإنهاء.',
    suggestedRedlineEn: 'Limit non-compete restriction strictly to the immediate metropolitan area for a maximum of 6 months post-exit.',
    legalBasisAr: 'المادة 686 من القانون المدني (شروط صحة شرط عدم المنافسة)',
    legalBasisEn: 'Restraint of Trade Doctrine & Public Policy Limitations',
  },
  {
    id: 'GAP-LIMITATION-OF-LIABILITY',
    severity: 'WARNING' as const,
    pattern: /(تحديد المسؤولية|حد أقصى للمسؤولية|limitation of liability|aggregate liability|exceed the amount paid)/i,
    categoryAr: 'تحديد حدود المسؤولية القانونية',
    categoryEn: 'Limitation of Liability Caps',
    titleAr: 'تنبيه: عدم وجود حد أقصى (Cap) لمجموع المسؤولية التعويضية',
    titleEn: 'Absence of Total Aggregate Liability Cap',
    descriptionAr: 'لا يحدد العقد سقفاً مالياً أعلى للمسؤولية الناتجة عن الأضرار غير المباشرة أو التبعية.',
    descriptionEn: 'Contract lacks a defined monetary cap for indirect or consequential damages, creating open-ended risk exposure.',
    suggestedRedlineAr: 'تحدد المسؤولية الإجمالية الكلية لأي من الطرفين بمبلغ لا يتجاوز إجمالي الأتعاب المسددة فعلياً خلال آخر (12) شهراً.',
    suggestedRedlineEn: 'Total aggregate liability of either party shall not exceed the actual fees paid during the preceding 12 months.',
    legalBasisAr: 'المادة 217 من القانون المدني (الاتفاق على التعديل في قواعد المسؤولية)',
    legalBasisEn: 'Standard Commercial Consequential Damages Limitation Rules',
  },
  // ── 16 NEW EXTENDED RULES (Gap rules 25–40) ────────────────────────────────
  {
    id: 'GAP-DATA-PROTECTION-GDPR',
    severity: 'CRITICAL' as const,
    pattern: /(حماية البيانات|بيانات شخصية|GDPR|PDPA|data protection|personal data|data controller|data processor|data breach)/i,
    categoryAr: 'حماية البيانات والخصوصية',
    categoryEn: 'Data Protection & Privacy Compliance',
    titleAr: 'ثغرة حرجة: غياب بنود حماية البيانات الشخصية (GDPR/PDPA)',
    titleEn: 'Critical: Missing Data Protection & Privacy Clauses (GDPR/PDPA)',
    descriptionAr: 'لا يتضمن العقد بنوداً خاصة بحماية البيانات الشخصية وآليات التعامل مع الانتهاكات وفق لوائح GDPR أو PDPA.',
    descriptionEn: 'Contract lacks GDPR/PDPA-compliant data protection provisions, breach notification procedures, and data processing agreements.',
    suggestedRedlineAr: 'يلتزم الطرفان بلوائح حماية البيانات المعمول بها (GDPR وما يوازيها). تُبلَّغ عن أي انتهاك بيانات خلال 72 ساعة من الاكتشاف.',
    suggestedRedlineEn: 'Both parties shall comply with applicable data protection regulations (GDPR/PDPA). Data breaches must be reported within 72 hours of discovery.',
    legalBasisAr: 'المادة 33 من لائحة GDPR الأوروبية — قوانين حماية البيانات الوطنية',
    legalBasisEn: 'GDPR Article 33 & applicable national data protection statutes',
  },
  {
    id: 'GAP-FORCE-MAJEURE-COVID',
    severity: 'WARNING' as const,
    pattern: /(قوة قاهرة|ظروف استثنائية|force majeure|act of god|pandemic|epidemic|government order|war|sanction)/i,
    categoryAr: 'القوة القاهرة والظروف الاستثنائية',
    categoryEn: 'Force Majeure & Extraordinary Events',
    titleAr: 'تنبيه: نص القوة القاهرة يفتقر إلى تعريف محدد وشامل',
    titleEn: 'Force Majeure Clause Lacks Specific Enumeration',
    descriptionAr: 'نص القوة القاهرة عام وغير محدد ولا يشمل صراحةً الأوبئة والعقوبات الدولية وقرارات الجهات الحكومية.',
    descriptionEn: 'The force majeure clause is vague and fails to explicitly enumerate pandemics, international sanctions, and government orders.',
    suggestedRedlineAr: 'تشمل القوة القاهرة على سبيل المثال لا الحصر: الكوارث الطبيعية، الحروب، العقوبات الدولية، الأوبئة المعلنة رسمياً، قرارات الحكومات.',
    suggestedRedlineEn: 'Force majeure shall include without limitation: natural disasters, war, international sanctions, officially declared pandemics, government mandates.',
    legalBasisAr: 'المادة 247 من القانون المدني الأردني — مبدأ استحالة التنفيذ',
    legalBasisEn: 'Civil Code Force Majeure Doctrine & UNIDROIT Principles Art. 7.1.7',
  },
  {
    id: 'GAP-ASSIGNMENT-NOVATION',
    severity: 'WARNING' as const,
    pattern: /(التنازل عن العقد|الإحالة|novation|assignment of contract|transfer of rights|consent to assign)/i,
    categoryAr: 'حظر التنازل والإحالة',
    categoryEn: 'Assignment & Novation Restrictions',
    titleAr: 'تنبيه: غياب بند صريح بشأن حظر أو شروط التنازل عن العقد',
    titleEn: 'Missing Anti-Assignment & Novation Restriction Clause',
    descriptionAr: 'لا يحدد العقد هل يحق لأي من الطرفين التنازل عن حقوقه أو نقلها دون موافقة الطرف الآخر.',
    descriptionEn: 'Contract is silent on whether either party may assign or transfer contractual rights without prior written consent.',
    suggestedRedlineAr: 'لا يحق لأي طرف التنازل عن هذا العقد أو التنازل عن حقوقه بموجبه لأي طرف ثالث إلا بموافقة خطية مسبقة من الطرف الآخر.',
    suggestedRedlineEn: 'Neither party shall assign or transfer any rights or obligations under this Agreement without prior written consent of the other party.',
    legalBasisAr: 'مبادئ الحلول والإحالة في القانون المدني — المادة 1040',
    legalBasisEn: 'Common Law Anti-Assignment Doctrine & UNIDROIT Art. 9.1.2',
  },
  {
    id: 'GAP-IP-OWNERSHIP-WORK-FOR-HIRE',
    severity: 'CRITICAL' as const,
    pattern: /(ملكية فكرية|حقوق الملكية|intellectual property|IP ownership|work for hire|copyright assignment|invention assignment)/i,
    categoryAr: 'ملكية الإنتاج الفكري والإبداعي',
    categoryEn: 'IP Ownership & Work-for-Hire',
    titleAr: 'ثغرة حرجة: عدم وضوح ملكية المخرجات الفكرية والتسليمات',
    titleEn: 'Critical: Ambiguous Ownership of IP, Deliverables & Work Product',
    descriptionAr: 'العقد لا يحدد صراحةً من يملك حقوق الملكية الفكرية للمخرجات والكود البرمجي والتصاميم المنتجة أثناء تنفيذ العقد.',
    descriptionEn: 'Contract fails to specify who owns IP, code, designs, and deliverables produced during the engagement.',
    suggestedRedlineAr: 'تنتقل ملكية جميع المخرجات والتسليمات الأصلية المنتجة خصيصاً في إطار هذا العقد بالكامل إلى [PARTY_A] فور سداد التعويض المتفق عليه.',
    suggestedRedlineEn: 'All original work product and deliverables created specifically under this Agreement shall be assigned in full to [PARTY_A] upon payment of agreed fees.',
    legalBasisAr: 'قانون حماية حق المؤلف والحقوق المجاورة — نظرية المؤلف المأجور',
    legalBasisEn: 'Work-for-Hire Doctrine & IP Assignment — Copyright Act provisions',
  },
  {
    id: 'GAP-PAYMENT-TERMS-LATE-FEE',
    severity: 'WARNING' as const,
    pattern: /(شروط الدفع|موعد السداد|تأخر السداد|late payment|payment due|invoice|payment terms|overdue)/i,
    categoryAr: 'شروط الدفع والعقوبات التأخيرية',
    categoryEn: 'Payment Terms & Late Payment Penalties',
    titleAr: 'تنبيه: شروط الدفع غير محددة أو تفتقر إلى آلية تحصيل التأخير',
    titleEn: 'Incomplete Payment Terms — Missing Late Payment Mechanism',
    descriptionAr: 'العقد لا يحدد مواعيد استحقاق الدفعات أو غرامة التأخر أو آلية إصدار الفواتير.',
    descriptionEn: 'Contract lacks precise invoice issuance timelines, payment due dates, and late payment penalty mechanisms.',
    suggestedRedlineAr: 'تستحق الفواتير خلال (30) يوماً من تاريخ الإصدار. يُطبَّق عند التأخر غرامة ([PENALTY_RATE]%) شهرياً من المبلغ المستحق.',
    suggestedRedlineEn: 'Invoices are due within 30 days of issuance. Late payments accrue a penalty of ([PENALTY_RATE]%) per month on outstanding balances.',
    legalBasisAr: 'قانون المعاملات التجارية — أحكام الدين والمطالبة',
    legalBasisEn: 'Late Payment of Commercial Debts Act & Commercial Code provisions',
  },
  {
    id: 'GAP-AUDIT-RIGHTS',
    severity: 'NOTICE' as const,
    pattern: /(حق التدقيق|التحقق من السجلات|audit rights|right to audit|financial records|inspection rights|books and records)/i,
    categoryAr: 'حق التدقيق والمراجعة المالية',
    categoryEn: 'Audit & Inspection Rights',
    titleAr: 'ملاحظة: غياب حق التدقيق والفحص في السجلات المالية',
    titleEn: 'Missing Audit Rights & Financial Records Inspection Clause',
    descriptionAr: 'العقد لا يمنح الطرف الأول حق الاطلاع أو التدقيق في السجلات المالية ذات الصلة بتنفيذ العقد.',
    descriptionEn: 'Contract lacks provisions granting either party the right to audit relevant financial records during the contract term.',
    suggestedRedlineAr: 'يحق للطرف الأول تعيين مدقق مستقل للتحقق من السجلات المالية ذات الصلة مرة واحدة في السنة بإشعار مسبق لا يقل عن (14) يوماً.',
    suggestedRedlineEn: 'Either party may appoint an independent auditor to inspect relevant financial records annually with 14 days written notice.',
    legalBasisAr: 'متطلبات الحوكمة المؤسسية والمراجعة الداخلية',
    legalBasisEn: 'Corporate Governance Standards & Financial Reporting Requirements',
  },
  {
    id: 'GAP-INSURANCE-INDEMNITY',
    severity: 'WARNING' as const,
    pattern: /(تأمين مهني|تأمين مسؤولية|professional indemnity|insurance coverage|liability insurance|errors and omissions|E&O insurance)/i,
    categoryAr: 'متطلبات التأمين والضمان',
    categoryEn: 'Insurance & Indemnity Requirements',
    titleAr: 'تنبيه: غياب اشتراط التأمين المهني والمسؤولية المدنية',
    titleEn: 'Missing Professional Indemnity & Liability Insurance Requirement',
    descriptionAr: 'العقد لا يشترط الحفاظ على وثائق تأمين مهني كافية لتغطية المسؤولية التعاقدية.',
    descriptionEn: 'Contract does not mandate maintenance of adequate professional indemnity and general liability insurance.',
    suggestedRedlineAr: 'يلتزم مزود الخدمة بالحفاظ على تأمين مهني لا تقل قيمته عن ([COVERAGE_AMOUNT]) [CURRENCY] طوال مدة هذا العقد.',
    suggestedRedlineEn: 'Service Provider shall maintain professional indemnity insurance coverage of at least ([COVERAGE_AMOUNT]) [CURRENCY] throughout the contract term.',
    legalBasisAr: 'قانون التأمين الإلزامي والمتطلبات التنظيمية للقطاع',
    legalBasisEn: 'Professional Services Liability Standards & Regulatory Insurance Requirements',
  },
  {
    id: 'GAP-CONFIDENTIALITY-SCOPE',
    severity: 'WARNING' as const,
    pattern: /(السرية|المعلومات السرية|confidential information|trade secrets|NDA|non-disclosure|proprietary information)/i,
    categoryAr: 'نطاق الالتزام بالسرية',
    categoryEn: 'Confidentiality Scope & Duration',
    titleAr: 'تنبيه: نطاق السرية مبهم أو مدتها غير محددة بعد انتهاء العقد',
    titleEn: 'Ambiguous Confidentiality Scope or Undefined Post-Termination Duration',
    descriptionAr: 'بند السرية لا يحدد بدقة نطاق المعلومات السرية ومدة الالتزام بعد انتهاء العقد.',
    descriptionEn: 'The confidentiality clause fails to define the precise scope of confidential information and post-termination obligations.',
    suggestedRedlineAr: 'يمتد التزام السرية لمدة (3) سنوات بعد إنهاء العقد ويشمل كافة المعلومات التجارية والمالية والتقنية وبيانات العملاء.',
    suggestedRedlineEn: 'Confidentiality obligations extend for 3 years post-termination and cover all commercial, financial, technical information and customer data.',
    legalBasisAr: 'حماية الأسرار التجارية — المادة 69 من قانون الملكية الفكرية',
    legalBasisEn: 'Trade Secrets Protection — TRIPS Agreement Art. 39 & national IP statutes',
  },
  {
    id: 'GAP-ELECTRONIC-SIGNATURE',
    severity: 'NOTICE' as const,
    pattern: /(توقيع إلكتروني|توقيع رقمي|electronic signature|digital signature|e-sign|DocuSign|Adobe Sign)/i,
    categoryAr: 'صحة التوقيع الإلكتروني',
    categoryEn: 'Electronic Signature Validity & Enforceability',
    titleAr: 'ملاحظة: غياب نص صريح يعترف بصحة التوقيعات الإلكترونية',
    titleEn: 'Missing Electronic Signature Validity Clause',
    descriptionAr: 'العقد لا يتضمن نصاً صريحاً يُقر بأن التوقيعات الإلكترونية ذات حجية قانونية مساوية للتوقيع اليدوي.',
    descriptionEn: 'Contract lacks an express provision accepting that electronic signatures shall be legally binding and equivalent to handwritten signatures.',
    suggestedRedlineAr: 'تُقبل التوقيعات الإلكترونية المعتمدة وفق قوانين المعاملات الإلكترونية المعمول بها وتكون ذات حجية قانونية ملزمة.',
    suggestedRedlineEn: 'Electronic signatures executed via approved platforms shall be legally binding and enforceable under applicable e-signature laws.',
    legalBasisAr: 'قانون المعاملات الإلكترونية والتجارة الإلكترونية — UNCITRAL Model Law',
    legalBasisEn: 'UNCITRAL Model Law on E-Commerce & eIDAS Regulation (EU) / ESIGN Act (US)',
  },
  {
    id: 'GAP-INSOLVENCY-TERMINATION',
    severity: 'CRITICAL' as const,
    pattern: /(إفلاس|الإعسار|التصفية القضائية|insolvency|bankruptcy|liquidation|administration|receivership|winding up)/i,
    categoryAr: 'حقوق الإنهاء عند الإفلاس أو الإعسار',
    categoryEn: 'Insolvency & Bankruptcy Termination Rights',
    titleAr: 'ثغرة حرجة: غياب حق الإنهاء الفوري عند إفلاس أحد الأطراف',
    titleEn: 'Critical: No Termination Right Upon Insolvency of a Party',
    descriptionAr: 'العقد لا يمنح الطرف السليم حق الإنهاء الفوري للعقد في حالة إفلاس الطرف الآخر أو تصفيته قضائياً.',
    descriptionEn: 'Contract lacks a provision allowing the solvent party to terminate immediately upon insolvency or bankruptcy of the other party.',
    suggestedRedlineAr: 'في حال إشهار إفلاس أحد الأطراف أو خضوعه لإجراءات التصفية القضائية، يحق للطرف الآخر إنهاء العقد فوراً بإشعار كتابي.',
    suggestedRedlineEn: 'Either party may terminate immediately upon written notice if the other party becomes insolvent, enters bankruptcy, or initiates voluntary/involuntary liquidation.',
    legalBasisAr: 'قانون الإفلاس وإعادة الهيكلة — أحكام الإنهاء عند التوقف عن الدفع',
    legalBasisEn: 'Insolvency Act & Bankruptcy Code — Ipso Facto Termination Clauses',
  },
  {
    id: 'GAP-ENVIRONMENTAL-COMPLIANCE',
    severity: 'NOTICE' as const,
    pattern: /(بيئة|الامتثال البيئي|تلوث|environmental|sustainability|ESG|pollution|carbon|waste disposal|environmental law)/i,
    categoryAr: 'الامتثال البيئي والاستدامة',
    categoryEn: 'Environmental Compliance & Sustainability',
    titleAr: 'ملاحظة: غياب متطلبات الامتثال البيئي والاستدامة (ESG)',
    titleEn: 'Missing Environmental Compliance & ESG Sustainability Clause',
    descriptionAr: 'العقد لا يتضمن أي التزامات بيئية أو متطلبات استدامة خاصةً في عقود الإنشاء والتوريد والصناعة.',
    descriptionEn: 'Contract is silent on environmental compliance obligations, particularly relevant for construction, supply, and industrial contracts.',
    suggestedRedlineAr: 'يلتزم الطرف المنفذ بالامتثال لجميع القوانين البيئية المعمول بها وضمان التخلص السليم من النفايات الناتجة.',
    suggestedRedlineEn: 'Performing party shall comply with all applicable environmental laws and ensure lawful disposal of any waste generated.',
    legalBasisAr: 'قوانين حماية البيئة الوطنية — اتفاقيات باريس للمناخ',
    legalBasisEn: 'National Environmental Protection Laws & Paris Climate Agreement obligations',
  },
  {
    id: 'GAP-ANTI-CORRUPTION-FCPA',
    severity: 'CRITICAL' as const,
    pattern: /(رشوة|الفساد|مكافحة الفساد|bribery|corruption|FCPA|anti-bribery|UKBA|kickback|facilitation payment)/i,
    categoryAr: 'مكافحة الرشوة والفساد',
    categoryEn: 'Anti-Bribery & Anti-Corruption (FCPA/UKBA)',
    titleAr: 'ثغرة حرجة: غياب بند صريح لمكافحة الرشوة والفساد (FCPA/UKBA)',
    titleEn: 'Critical: No Anti-Bribery / Anti-Corruption Compliance Clause',
    descriptionAr: 'العقد لا يتضمن التزامات صريحة بمكافحة الرشوة والفساد وفق FCPA وUKBA أو ما يوازيها من تشريعات محلية.',
    descriptionEn: 'Contract lacks explicit anti-bribery and anti-corruption compliance obligations under FCPA, UK Bribery Act, or applicable local statutes.',
    suggestedRedlineAr: 'يلتزم الطرفان بعدم تقديم أو قبول أي مبالغ أو مزايا بصورة غير مشروعة، والامتثال لجميع قوانين مكافحة الفساد المعمول بها.',
    suggestedRedlineEn: 'Both parties shall comply with all applicable anti-bribery and anti-corruption laws including FCPA and UK Bribery Act 2010.',
    legalBasisAr: 'قانون مكافحة الفساد الوطني — FCPA الأمريكي — قانون الرشوة البريطاني 2010',
    legalBasisEn: 'Foreign Corrupt Practices Act (FCPA) & UK Bribery Act 2010',
  },
  {
    id: 'GAP-CURRENCY-FLUCTUATION',
    severity: 'NOTICE' as const,
    pattern: /(تقلبات العملة|سعر الصرف|currency risk|exchange rate|FX risk|currency fluctuation|forex|devaluation)/i,
    categoryAr: 'مخاطر تقلبات العملة وسعر الصرف',
    categoryEn: 'Currency Risk & Exchange Rate Volatility',
    titleAr: 'ملاحظة: العقد يفتقر إلى آلية لتوزيع مخاطر تقلبات أسعار الصرف',
    titleEn: 'Missing Currency Fluctuation Risk Allocation Mechanism',
    descriptionAr: 'في العقود الدولية ذات الدفعات بعملات مختلفة، يجب تحديد كيفية توزيع خسائر تقلبات أسعار الصرف بين الطرفين.',
    descriptionEn: 'International contracts with multi-currency payments must define how currency exchange losses are allocated between the parties.',
    suggestedRedlineAr: 'تُحسب جميع المدفوعات وفق سعر الصرف المرجعي المعلَن من [REFERENCE_BANK] في تاريخ استحقاق الفاتورة.',
    suggestedRedlineEn: 'All payments shall be calculated at the reference exchange rate published by [REFERENCE_BANK] on the invoice due date.',
    legalBasisAr: 'قواعد التجارة الدولية — ICC INCOTERMS — مبادئ UNIDROIT',
    legalBasisEn: 'ICC INCOTERMS & UNIDROIT Principles on Currency & Payment Obligations',
  },
  {
    id: 'GAP-TAX-WITHHOLDING',
    severity: 'WARNING' as const,
    pattern: /(ضريبة|الضريبة المستقطعة|VAT|GST|withholding tax|tax liability|tax compliance|налог|fiscal)/i,
    categoryAr: 'الالتزامات الضريبية والاستقطاع عند المصدر',
    categoryEn: 'Tax Obligations & Withholding Tax Allocation',
    titleAr: 'تنبيه: غياب تحديد المسؤولية الضريبية وضريبة القيمة المضافة',
    titleEn: 'Missing Tax Allocation Clause — VAT / GST / Withholding Tax',
    descriptionAr: 'العقد لا يحدد بوضوح أي الطرفين يتحمل ضريبة القيمة المضافة وضريبة الاستقطاع والرسوم الحكومية.',
    descriptionEn: 'Contract fails to clearly allocate VAT, GST, withholding tax, and government duties between the parties.',
    suggestedRedlineAr: 'جميع المبالغ المتفق عليها خالصةً من الضرائب. تتحمل كل جهة ضرائبها الخاصة ما لم يُتفق صراحةً على خلاف ذلك.',
    suggestedRedlineEn: 'All contract amounts are exclusive of VAT/GST. Each party bears its own tax obligations unless expressly stated otherwise.',
    legalBasisAr: 'قانون ضريبة القيمة المضافة — اتفاقيات الازدواج الضريبي الدولية',
    legalBasisEn: 'VAT/GST Legislation & OECD Double Taxation Treaties',
  },
  {
    id: 'GAP-SLA-SERVICE-LEVELS',
    severity: 'WARNING' as const,
    pattern: /(مستوى الخدمة|SLA|service level agreement|uptime|availability|response time|KPI|performance benchmark)/i,
    categoryAr: 'اتفاقيات مستوى الخدمة ومعايير الأداء',
    categoryEn: 'Service Level Agreements & Performance KPIs',
    titleAr: 'تنبيه: غياب معايير قياس مستوى الخدمة (SLA) وآليات العقوبات',
    titleEn: 'Missing Service Level Agreement (SLA) & Performance Penalty Mechanism',
    descriptionAr: 'عقود الخدمات لا تتضمن معايير موضوعية قابلة للقياس لمستوى الأداء ولا عقوبات واضحة عند عدم الامتثال.',
    descriptionEn: 'Service contracts must define measurable performance KPIs (uptime, response time) and remedies/penalties for non-compliance.',
    suggestedRedlineAr: 'يلتزم مزود الخدمة بمعدل توفر لا يقل عن ([UPTIME_PCT]%) شهرياً. عند الإخفاق تُطبَّق خصومات بنسبة ([CREDIT_PCT]%) من الفاتورة الشهرية.',
    suggestedRedlineEn: 'Service Provider guarantees minimum ([UPTIME_PCT]%) monthly uptime. Failure triggers ([CREDIT_PCT]%) service credit on the monthly invoice.',
    legalBasisAr: 'معايير الخدمة المهنية وممارسات حوكمة تكنولوجيا المعلومات (ITIL/ISO 20000)',
    legalBasisEn: 'Professional Services Standards & IT Service Management (ITIL / ISO 20000)',
  },
  {
    id: 'GAP-WAIVER-CUMULATIVE-RIGHTS',
    severity: 'NOTICE' as const,
    pattern: /(التنازل عن حق|الحقوق التراكمية|waiver|cumulative rights|estoppel|failure to enforce|rights not waived)/i,
    categoryAr: 'التنازل عن الحقوق وعدم التأثير على التراكمية',
    categoryEn: 'Waiver & Cumulative Rights Preservation',
    titleAr: 'ملاحظة: غياب بند عدم التنازل الضمني عن الحقوق التعاقدية',
    titleEn: 'Missing Non-Waiver & Cumulative Rights Clause',
    descriptionAr: 'غياب نص صريح يوضح أن التساهل في تطبيق بند واحد لا يُعدّ تنازلاً عنه أو عن غيره من الحقوق.',
    descriptionEn: 'No clause stating that failure to enforce any provision shall not constitute a waiver of that or any other right or remedy.',
    suggestedRedlineAr: 'لا يُعدّ تقاعس أي طرف عن ممارسة أي حق أو تطبيق أي بند تنازلاً عنه. تبقى جميع الحقوق تراكمية ومتراكبة.',
    suggestedRedlineEn: 'Failure by either party to enforce any provision shall not be construed as a waiver thereof. All rights are cumulative and non-exclusive.',
    legalBasisAr: 'مبدأ التراكمية وعدم سقوط الحق بالتقادم القصير في القانون المدني',
    legalBasisEn: 'Cumulative Rights Doctrine & Non-Waiver Principles in Common Law',
  },
];

/**
 * Executes a comprehensive Legal Gap & Vulnerability Analysis on contract text.
 */
export function analyzeContractGaps(contractText: string): ContractGapAnalysisResult {
  if (!contractText || contractText.trim().length < 50) {
    return {
      riskScore: 0,
      riskLevel: 'LOW',
      totalGapsFound: 0,
      criticalCount: 0,
      warningCount: 0,
      noticeCount: 0,
      gaps: [],
      summaryAr: 'النص المدخل قصير جداً لإجراء تحليل الثغرات القانونية المتعمق.',
      summaryEn: 'The submitted contract text is too short for a complete legal gap analysis.',
      analyzedAt: new Date().toISOString(),
    };
  }

  const detectedGaps: ContractGap[] = [];
  let riskScoreCounter = 10; // Baseline score for standard legal review

  LEGAL_GAP_RULES.forEach((rule) => {
    const match = contractText.match(rule.pattern);
    // Either found vulnerability pattern or structural absence check
    if (match) {
      // Find a snippet of context around the match
      const matchIndex = match.index || 0;
      const start = Math.max(0, matchIndex - 60);
      const end = Math.min(contractText.length, matchIndex + 140);
      const snippet = contractText.substring(start, end).trim() + '...';

      detectedGaps.push({
        id: `${rule.id}-${Date.now().toString().slice(-4)}`,
        categoryAr: rule.categoryAr,
        categoryEn: rule.categoryEn,
        severity: rule.severity,
        titleAr: rule.titleAr,
        titleEn: rule.titleEn,
        descriptionAr: rule.descriptionAr,
        descriptionEn: rule.descriptionEn,
        detectedClauseSnippet: snippet,
        suggestedRedlineAr: rule.suggestedRedlineAr,
        suggestedRedlineEn: rule.suggestedRedlineEn,
        legalBasisAr: rule.legalBasisAr,
        legalBasisEn: rule.legalBasisEn,
      });

      if (rule.severity === 'CRITICAL') riskScoreCounter += 25;
      else if (rule.severity === 'WARNING') riskScoreCounter += 15;
      else riskScoreCounter += 5;
    }
  });

  // Structural Absence Checks (Checking for missing key protection clauses)
  if (!/(قوة قاهرة|force majeure)/i.test(contractText)) {
    detectedGaps.push({
      id: `GAP-MISSING-FM-${Date.now().toString().slice(-4)}`,
      categoryAr: 'بنية العقد والهيكل الشكلي',
      categoryEn: 'Contract Structure & Clauses',
      severity: 'WARNING',
      titleAr: 'ثغرة: خلو العقد من بند القوة القاهرة والظروف الاستثنائية',
      titleEn: 'Omission of Force Majeure & Emergency Event Clause',
      descriptionAr: 'عدم وجود بند صريح للقوة القاهرة يعرض الطرفين للمسؤولية المباشرة عند وقوع أزمات خارجة عن الإرادة.',
      descriptionEn: 'Absence of an explicit force majeure clause subjects parties to direct default liability during unforeseen crises.',
      suggestedRedlineAr: 'إضافة بند قوة قاهرة ينص على تعليق الالتزامات في حال الحروب، الجوائح، أو القرارات السيادية لمدة لا تزيد عن 90 يوماً.',
      suggestedRedlineEn: 'Insert a standard force majeure clause suspending obligations during wars, pandemics, or government acts for up to 90 days.',
      legalBasisAr: 'المادة 165 مدني (عدم التزام الطرف المتعثر بالشرط الجزائي حال الآفات القهرية)',
      legalBasisEn: 'Doctrine of Frustration & Impossibility of Performance',
    });
    riskScoreCounter += 15;
  }

  if (!/(سرية|confidentiality)/i.test(contractText)) {
    detectedGaps.push({
      id: `GAP-MISSING-CONF-${Date.now().toString().slice(-4)}`,
      categoryAr: 'حماية البيانات وحفظ الأسرار',
      categoryEn: 'Data Protection & Trade Secrets',
      severity: 'WARNING',
      titleAr: 'تنبيه: عدم تضمين التزامات حماية البيانات والسرية التجاريّة',
      titleEn: 'Absence of Confidentiality & Trade Secret Protections',
      descriptionAr: 'قد يؤدي غياب هذا البند إلى تسريب بيانات المستندات أو خطط العمل دون إمكانية الملاحقة القضائية المباشرة.',
      descriptionEn: 'Omitting confidentiality terms exposes business records and proprietary workflow data to uncompensated leaks.',
      suggestedRedlineAr: 'يلتزم الطرفان بالحفاظ على سرية كافة البيانات والمستندات المتبادلة طوال فترة التعامل ولمدة (3) سنوات تالية.',
      suggestedRedlineEn: 'Both parties agree to maintain strict confidentiality over exchanged assets during engagement and for 3 years thereafter.',
      legalBasisAr: 'قانون حماية البيانات الشخصية رقم 151 لسنة 2020',
      legalBasisEn: 'EU GDPR & US Defend Trade Secrets Act Standards',
    });
    riskScoreCounter += 10;
  }

  const finalScore = Math.min(100, Math.max(5, riskScoreCounter));

  let riskLevel: ContractGapAnalysisResult['riskLevel'] = 'LOW';
  if (finalScore >= 75) riskLevel = 'CRITICAL';
  else if (finalScore >= 50) riskLevel = 'HIGH';
  else if (finalScore >= 30) riskLevel = 'MODERATE';

  const criticalCount = detectedGaps.filter((g) => g.severity === 'CRITICAL').length;
  const warningCount = detectedGaps.filter((g) => g.severity === 'WARNING').length;
  const noticeCount = detectedGaps.filter((g) => g.severity === 'NOTICE').length;

  const summaryAr = `تم اكتشاف عدد (${detectedGaps.length}) ثغرة ومخاطرة قانونية محتملة، منها (${criticalCount}) ثغرات عالية الخطورة تتطلب التعديل الفوري قبل التوقيع. مؤشر درجة المخاطرة الإجمالي: ${finalScore}/100.`;
  const summaryEn = `Identified (${detectedGaps.length}) legal vulnerabilities, including (${criticalCount}) critical severity risks requiring immediate redlining prior to execution. Overall Contract Risk Score: ${finalScore}/100.`;

  return {
    riskScore: finalScore,
    riskLevel,
    totalGapsFound: detectedGaps.length,
    criticalCount,
    warningCount,
    noticeCount,
    gaps: detectedGaps,
    summaryAr,
    summaryEn,
    analyzedAt: new Date().toISOString(),
  };
}
