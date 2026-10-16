import { Deep8AxisAuditReport } from '../services/contractAnalysisEngine';

export const SAMPLE_8_AXIS_REPORT: Deep8AxisAuditReport = {
  documentTitle: 'Master Enterprise Cloud & Services Agreement (Illustrative Sample Report)',
  auditTimestamp: '2026-10-16 14:30:00 UTC',
  overallScore: 42,
  overallRiskLevel: 'HIGH_EXPOSURE',
  executiveSummaryAr: 'أظهر الفحص التشريعي المعمق عبر المحاور الثمانية وجود بنود إذعان ومخاطر تعويضية جسيمة، أبرزها غياب سقف للمسؤولية المالية (Uncapped Liability Trap)، وشروط فسخ فورية غير متكافئة لصالح المورد، وثغرات في ملكية الأصول البرمجية السابقة. يلزم تطبيق الصياغات البديلة المقترحة قبل التوقيع النهائي.',
  executiveSummaryEn: 'The deep 8-axis statutory audit revealed severe contractual exposure, including an uncapped aggregate liability trap, unilateral immediate termination rights, and silent gaps in pre-existing intellectual property ownership. Adopting the protective redlines is strongly recommended prior to execution.',
  financialLiabilityCapStatus: {
    isCapped: false,
    detectedCapAr: 'لا يوجد حد أقصى للتعويضات المالية (مسؤولية مطلقة غير مقيدة تضع الشركة تحت طائلة مطالبات غير محدودة)',
    detectedCapEn: 'No aggregate liability cap detected (Uncapped exposure exposing the entity to unlimited contractual damages)',
    recommendedCapAr: 'يُحدد سقف المسؤولية بما لا يتجاوز 100% من إجمالي الأتعاب المدفوعة خلال الـ 12 شهراً السابقة للمطالبة',
    recommendedCapEn: 'Cap aggregate liability to 100% of fees actually paid in the preceding 12 months',
  },
  axes: [
    {
      axisId: 'axis-1',
      axisNameAr: 'المحور 1: الأهلية والتمثيل التجاري وسلطة التوقيع',
      axisNameEn: 'Axis 1: Signatory Authority & Capacity',
      score: 85,
      severity: 'Safe',
      statutoryBasisAr: 'نظام الشركات ولائحة التمثيل التجاري للمديرين والمفوضين بالسجل التجاري',
      statutoryBasisEn: 'Companies Law & statutory representative authority in commercial register',
      identifiedRisksAr: ['تم التحقق من صفة الموقع ولكن يلزم إرفاق مستخرج السجل التجاري المحدث'],
      identifiedRisksEn: ['Signatory capacity verified, recommended to attach current commercial registry extract'],
      executiveRedlineAr: 'يقر كل طرف بأن ممثله الموقع يمتلك كامل الأهلية والصلاحية القانونية لإلزام الطرف الآخر بموجب تفويض رسمي سارٍ.',
      executiveRedlineEn: 'Each party represents and warrants that its signatory possesses full legal capacity and corporate authority to bind the entity.',
    },
    {
      axisId: 'axis-2',
      axisNameAr: 'المحور 2: سقف المسؤولية المالية والأضرار التبعية',
      axisNameEn: 'Axis 2: Aggregate Liability Cap & Consequential Damages',
      score: 25,
      severity: 'Critical',
      statutoryBasisAr: 'المادة 172 من نظام المعاملات المدنية ومبدأ توازن الالتزامات العقدية',
      statutoryBasisEn: 'Civil Code indemnity limits & non-consequential damages doctrine',
      identifiedRisksAr: [
        'غياب سقف أعلى للتعويضات المالية يضع الشركة تحت طائلة مطالبات غير محدودة',
        'عدم استثناء الأضرار غير المباشرة أو التبعية أو خسارة الأرباح المتوقعة'
      ],
      identifiedRisksEn: [
        'Absence of monetary cap exposes the entity to unlimited contractual damages',
        'Failure to exclude indirect, consequential damages, and loss of business profit'
      ],
      executiveRedlineAr: 'لا يجوز في أي حال من الأحوال أن تتجاوز المسؤولية الإجمالية التراكمية لأي من الطرفين عن كافة المطالبات إجمالي المبالغ المدفوعة بموجب هذا العقد خلال الاثني عشر شهراً السابقة للمطالبة.',
      executiveRedlineEn: 'In no event shall either party\'s aggregate cumulative liability exceed the total fees actually paid under this Agreement during the twelve (12) months preceding the incident.',
    },
    {
      axisId: 'axis-3',
      axisNameAr: 'المحور 3: البنود التعسفية وشروط الإذعان',
      axisNameEn: 'Axis 3: Abusive Terms & Contractual Adhesion',
      score: 40,
      severity: 'High',
      statutoryBasisAr: 'نظام المعاملات المدنية (مادة 98 و149) الخاصة بفسخ أو تعديل شروط الإذعان قضائياً',
      statutoryBasisEn: 'Statutory unfair contract terms and adhesion doctrine',
      identifiedRisksAr: [
        'منح المورد حق التعديل المنفرد لأسعار ونطاق الخدمة دون موافقة العميل الخطية',
        'تقييد حق العميل في الاعتراض على الفواتير بعد انقضاء 5 أيام فقط'
      ],
      identifiedRisksEn: [
        'Unilateral right granted to vendor to alter pricing and service scope without prior written consent',
        'Unreasonable 5-day invoice objection window'
      ],
      executiveRedlineAr: 'لا يجوز تعديل الأسعار أو شروط الاتفاقية إلا بموجب ملحق كتابي موقع من الممثلين المعتمدين لكلا الطرفين.',
      executiveRedlineEn: 'No modification of prices or terms shall be effective unless made in writing and signed by authorized representatives of both parties.',
    },
    {
      axisId: 'axis-4',
      axisNameAr: 'المحور 4: شروط الفسخ والإنهاء والشرط الجزائي',
      axisNameEn: 'Axis 4: Termination Rights & Liquidated Damages',
      score: 35,
      severity: 'High',
      statutoryBasisAr: 'ضوابط الشرط الجزائي القضائية والمادة 178 من نظام المعاملات المدنية',
      statutoryBasisEn: 'Equitable liquidated damages & statutory cure notice requirements',
      identifiedRisksAr: [
        'إمكانية فسخ العقد فوراً دون منح مهلة 30 يوماً لتدارك الإخلال (Cure Period)',
        'شرط جزائي مبالغ فيه يستحق دون إثبات وقوع الضرر الفعلي'
      ],
      identifiedRisksEn: [
        'Immediate termination without standard 30-day notice and cure period',
        'Excessive liquidated damages penalty clause enforceable without proof of direct loss'
      ],
      executiveRedlineAr: 'يحق لأي من الطرفين إنهاء العقد في حال الإخلال الجوهري شريطة إخطار الطرف المخل كتابياً ومنحه مهلة لا تقل عن ثلاثين (30) يوماً لتدارك الإخلال.',
      executiveRedlineEn: 'Either party may terminate for material breach only upon providing written notice and granting thirty (30) days to cure such breach.',
    },
    {
      axisId: 'axis-5',
      axisNameAr: 'المحور 5: القوة القاهرة والظروف الطارئة (ICC 2020)',
      axisNameEn: 'Axis 5: Force Majeure & Hardship Revision',
      score: 60,
      severity: 'Medium',
      statutoryBasisAr: 'شروط غرفة التجارة الدولية باريس (ICC Force Majeure Clause 2020)',
      statutoryBasisEn: 'ICC Force Majeure & Hardship Clause 2020 standards',
      identifiedRisksAr: [
        'صياغة القوة القاهرة غير مفصلة ولا تتضمن الأوبئة وانقطاع سلاسل الإمداد العالمية',
        'غياب آلية التفاوض لإعادة التوازن المالي عند حدوث ظروف طارئة مرهقة (Hardship)'
      ],
      identifiedRisksEn: [
        'Force majeure clause lacks specific coverage for cyber-outages and statutory restrictions',
        'Absence of formal hardship renegotiation mechanism'
      ],
      executiveRedlineAr: 'عند تحقق ظرف طارئ لا يمكن توقعه يجعل تنفيذ الالتزام مرهقاً، يجتمع الطرفان للتفاوض بحسن نية لإعادة التوازن الاقتصادي للعقد.',
      executiveRedlineEn: 'If extraordinary circumstances render performance excessively onerous, the parties agree to negotiate in good faith to restore contractual equilibrium.',
    },
    {
      axisId: 'axis-6',
      axisNameAr: 'المحور 6: القانون الحاكم والتحكيم المؤسسي متعدد المستويات',
      axisNameEn: 'Axis 6: Governing Law & Multi-Tier Dispute Resolution',
      score: 50,
      severity: 'Medium',
      statutoryBasisAr: 'نظام التحكيم السعودي / لوائح مركز دبي للتحكيم الدولي DIAC / وقواعد UNCITRAL',
      statutoryBasisEn: 'UNCITRAL Model Law on International Commercial Arbitration & DIAC / SCCA Rules',
      identifiedRisksAr: [
        'تحديد محاكم أجنبية بعيدة جغرافياً مما يرفع تكاليف التقاضي والتنفيذ',
        'غياب مسار الوساطة الودية قبل اللجوء لإجراءات التحكيم'
      ],
      identifiedRisksEn: [
        'Foreign jurisdiction clause imposing substantial cross-border litigation expenses',
        'Absence of mandatory amicable mediation tier prior to arbitration'
      ],
      executiveRedlineAr: 'تخضع هذه الاتفاقية وتُفسر وفقاً للأنظمة واللوائح المعمول بها محلياً، وتُحل أي نزاعات ودياً خلال 30 يوماً ثم عبر التحكيم المؤسسي المعتمد.',
      executiveRedlineEn: 'This Agreement shall be governed by and construed under applicable local laws. Unresolved disputes shall be referred to institutional arbitration under UNCITRAL rules.',
    },
    {
      axisId: 'axis-7',
      axisNameAr: 'المحور 7: الثغرات الصامتة والملكية الفكرية وعدم المنافسة',
      axisNameEn: 'Axis 7: Silent Gaps, IP Assignment & Restrictive Covenants',
      score: 30,
      severity: 'High',
      statutoryBasisAr: 'أنظمة حماية الملكية الفكرية وحماية الأسرار التجارية',
      statutoryBasisEn: 'Trade Secrets & Intellectual Property protection frameworks',
      identifiedRisksAr: [
        'نقل كامل لحقوق الملكية الفكرية للطرف الآخر دون استثناء للأصول البرمجية السابقة (Pre-existing IP)',
        'بند عدم منافسة فضفاض وغير محدد بنطاق جغرافي أو زمني معقول'
      ],
      identifiedRisksEn: [
        'Broad assignment of IP rights without carving out pre-existing background intellectual property',
        'Overly broad non-compete covenant lacking reasonable geographic or temporal limitation'
      ],
      executiveRedlineAr: 'يحتفظ كل طرف بكامل ملكيته الفكرية السابقة للاتفاقية. تقتصر الحقوق الممنوحة للطرف الآخر على ترخيص غير حصري للاستخدام طوال مدة العقد فقط.',
      executiveRedlineEn: 'Each party retains sole ownership of its Background IP. Neither party shall acquire any right or title beyond a non-exclusive license for the term of this Agreement.',
    },
    {
      axisId: 'axis-8',
      axisNameAr: 'المحور 8: الصياغات البديلة الجاهزة للتفاوض والتحصين النهائي',
      axisNameEn: 'Axis 8: Executive Redlines & Negotiation Readiness',
      score: 55,
      severity: 'Medium',
      statutoryBasisAr: 'أدلة الصياغة التشريعية المعتمدة لغرف التجارة الدولية',
      statutoryBasisEn: 'Standard International Commercial Contract Drafting Guidelines',
      identifiedRisksAr: [
        'تتطلب النسخة الحالية تعديل 6 بنود جوهرية لضمان التوازن والحماية القانونية قبل التوقيع'
      ],
      identifiedRisksEn: [
        'Requires replacement of 6 critical clauses with balanced, enforceable counter-proposals'
      ],
      executiveRedlineAr: 'اعتماد جدول الشروط الخاصة المرفق مع استبدال كافة البنود المخالفة بالصياغات المحصنة المعتمدة في هذا التقرير.',
      executiveRedlineEn: 'Adopt the protective special conditions schedule replacing all unbalanced provisions with the fortified redlines.',
    },
  ],
  strategicDealRecommendationsAr: [
    'المطالبة الفورية بإدراج سقف المسؤولية المالية (Axis 2) كشرط غير قابل للتفاوض',
    'استبدال شرط الفسخ الفوري بمهلة تدارك خطية مدتها 30 يوماً (Axis 4)',
    'تحديد جهة التحكيم المحلية أو قواعد UNCITRAL لتجنب المحاكم الأجنبية المكلفة (Axis 6)',
    'حماية الملكية الفكرية السابقة للشركة وحصر الترخيص بفترة سريان العقد (Axis 7)'
  ],
  strategicDealRecommendationsEn: [
    'Demand immediate insertion of aggregate liability cap (Axis 2) as non-negotiable deal condition',
    'Replace unilateral termination with standard 30-day written notice and cure period (Axis 4)',
    'Designate local institutional arbitration or UNCITRAL rules to avoid foreign legal costs (Axis 6)',
    'Explicitly carve out Pre-existing Background IP with restricted license rights (Axis 7)'
  ],
  governingLawAnalysisAr: 'العقد يتطلب تحديد الاختصاص القضائي المحلي لتجنب تنازع القوانين.',
  governingLawAnalysisEn: 'The contract requires local governing law to eliminate cross-border statutory conflict.',
  disputeResolutionRecommendationAr: 'تطبيق مسار الوساطة الودية يليه التحكيم المؤسسي المعتمد.',
  disputeResolutionRecommendationEn: 'Mandate 30-day amicable negotiation followed by institutional arbitration.',
  dynamicRedlines: [],
};
