export interface LegalCaseStudy {
  id: string;
  titleAr: string;
  titleEn: string;
  sectorAr: string;
  sectorEn: string;
  jurisdictionAr: string;
  jurisdictionEn: string;
  contractValue: string;
  savedAmount: string;
  resolutionTime: string;
  riskScoreBefore: number;
  riskScoreAfter: number;
  problemSummaryAr: string;
  problemSummaryEn: string;
  solutionProvidedAr: string;
  solutionProvidedEn: string;
  statutoryBasisAr: string;
  statutoryBasisEn: string;
  impactMetrics: {
    labelAr: string;
    labelEn: string;
    value: string;
  }[];
  tags: string[];
}

export const LEGAL_CASE_STUDIES: LegalCaseStudy[] = [
  {
    id: 'case_epc_energy_riyadh',
    titleAr: 'إنقاذ تحالف مقاولات طاقة وبنية تحتية من غرامات تأخير بقيمة 3.8 مليون دولار',
    titleEn: 'Preventing $3.8M Unjust Delay Penalties in a $14.2M Energy EPC Consortium',
    sectorAr: 'المقاولات والهندسة EPC والطاقة',
    sectorEn: 'Energy & Infrastructure EPC',
    jurisdictionAr: 'المملكة العربية السعودية (الرياض)',
    jurisdictionEn: 'Saudi Arabia (Riyadh)',
    contractValue: '$14,200,000 USD',
    savedAmount: '$3,800,000 USD',
    resolutionTime: '48 ساعة (عبر غرفة التفاوض)',
    riskScoreBefore: 88,
    riskScoreAfter: 14,
    problemSummaryAr: 'واجه المقاول الرئيسي مطالبة تعسفية بفرض غرامة تأخير مضاعفة بنسبة 25% من إجمالي قيمة العقد بموجب نموذج فيديك معدل، مع وجود تناقض صارخ في القانون الحاكم بين القانون الإنجليزي والأنظمة السعودية.',
    problemSummaryEn: 'The main contractor faced an aggressive 25% liquidated damages penalty under an altered FIDIC contract with conflicting governing law clauses between UK Common Law and Saudi statutory jurisprudence.',
    solutionProvidedAr: 'قام محرك الفحص الجنائي بكشف بطلان التعويض الاتفاقي المبالغ فيه استناداً للمادة 178 من نظام المعاملات المدنية السعودي (م/191)، وصياغة بند توفيقي بديل يربط التعويض بالضرر الفعلي المحقق.',
    solutionProvidedEn: 'The Forensic Radar identified penalty invalidity under Article 178 of the Saudi Civil Transactions Law, generating a balanced compromise clause capping damages to proven actual harm.',
    statutoryBasisAr: 'المادة 178 و 179 من نظام المعاملات المدنية السعودي (مرسوم ملكي م/191) وقواعد التحكيم التجاري SCCA.',
    statutoryBasisEn: 'Articles 178 & 179 of the Saudi Civil Transactions Law (Royal Decree M/191) & SCCA Arbitration Rules.',
    impactMetrics: [
      { labelAr: 'مبلغ الغرامات الموفر', labelEn: 'Direct Capital Saved', value: '$3.8M' },
      { labelAr: 'انخفاض مؤشر المخاطر', labelEn: 'Risk Index Drop', value: '-74%' },
      { labelAr: 'وقت الوصول للاتفاق', labelEn: 'Time to Agreement', value: '48h' },
    ],
    tags: ['EPC', 'FIDIC', 'Saudi Law', 'Liquidated Damages', 'Energy'],
  },
  {
    id: 'case_fintech_mna_difc',
    titleAr: 'تحصين حقوق ملكية فكرية واستحواذ تجاري بقيمة 8.5 مليون دولار في مركز دبي المالي',
    titleEn: 'Shielding $8.5M Proprietary AI IP in Cross-Border FinTech M&A (DIFC)',
    sectorAr: 'التقنية المالية والذكاء الاصطناعي (FinTech & AI)',
    sectorEn: 'FinTech & AI Venture',
    jurisdictionAr: 'مركز دبي المالي العالمي (DIFC) / الإمارات',
    jurisdictionEn: 'DIFC / Dubai, UAE',
    contractValue: '$8,500,000 USD',
    savedAmount: '$8,500,000 USD (حماية الأصل بالكامل)',
    resolutionTime: '24 ساعة',
    riskScoreBefore: 94,
    riskScoreAfter: 8,
    problemSummaryAr: 'تضمنت اتفاقية الاستحواذ (SPA) بنداً خفياً ينقل ملكية الخوارزميات والأكواد السابقة لشركة التقنية (Background IP) إلى المشتري دون أي حماية للأسرار التجارية في حال تعثر صفقات الدفع اللاحقة.',
    problemSummaryEn: 'The Share Purchase Agreement contained a predatory clause granting total background IP ownership to the buyer without escrow protections in case of earn-out defaults.',
    solutionProvidedAr: 'فصل الأصول البرمجية السابقة في ملحق مستقل، واستحداث حساب ضمان مشفر (IP Escrow)، وربط التنازل بنجاح تسليم الدفعات المالية بموجب قانون عقود مركز دبي المالي العالمي.',
    solutionProvidedEn: 'Segregated background IP assets into an escrow schedule, structuring milestone-contingent IP releases under DIFC Contract Law No. 6/2004.',
    statutoryBasisAr: 'قانون عقود مركز دبي المالي العالمي رقم 6 لسنة 2004 وقانون المعاملات التجارية الإماراتي 50/2022.',
    statutoryBasisEn: 'DIFC Contract Law No. 6/2004 & UAE Federal Commercial Transactions Law No. 50/2022.',
    impactMetrics: [
      { labelAr: 'قيمة الأصل المحمي', labelEn: 'IP Valuation Protected', value: '$8.5M' },
      { labelAr: 'نسبة الأمان القانوني', labelEn: 'Statutory Shield Level', value: '99.2%' },
      { labelAr: 'مراحل الصرف المعتمدة', labelEn: 'Milestone Tranches', value: '4 Tranches' },
    ],
    tags: ['M&A', 'IP Protection', 'DIFC', 'FinTech', 'Escrow'],
  },
  {
    id: 'case_saas_msa_delaware',
    titleAr: 'إلغاء المسؤولية غير المحدودة في عقد تزويد برمجيات سحابية لشركة Fortune 500',
    titleEn: 'Eliminating Uncapped Liability in a $3.2M Fortune 500 SaaS MSA (Delaware)',
    sectorAr: 'البرمجيات المؤسسية والخدمات السحابية B2B',
    sectorEn: 'Enterprise Cloud & SaaS',
    jurisdictionAr: 'ديلاوير، الولايات المتحدة الأمريكية (Delaware DGCL)',
    jurisdictionEn: 'Delaware, United States (DGCL)',
    contractValue: '$3,200,000 USD',
    savedAmount: 'تجنب مسؤولية كارثية غير محدودة',
    resolutionTime: '12 ساعة',
    riskScoreBefore: 91,
    riskScoreAfter: 12,
    problemSummaryAr: 'طالبت الشركة العالمية بتعويض غير مشروط عن كافة الأضرار التبعية وانقطاع الأعمال دون أي سقف مالي، مما كان سيعرض الشركة الناشئة للإفلاس التام عند أي خلل تشغيلي غير مقصود.',
    problemSummaryEn: 'The client demanded uncapped indemnification for indirect and consequential damages with no aggregate liability ceiling, risking catastrophic enterprise liquidation.',
    solutionProvidedAr: 'تطبيق الصياغة الحمائية المعيارية لتحديد سقف المسؤولية بـ 100% من الرسوم المدفوعة خلال الـ 12 شهراً السابقة، واستثناء الأضرار التبعية بموجب القانون التجاري الأمريكي الموحد (UCC).',
    solutionProvidedEn: 'Injected a bilateral liability cap of 12-month trailing contract value, excluding consequential damages under Delaware UCC standards.',
    statutoryBasisAr: 'قانون ولاية ديلاوير للشركات (DGCL) والمادة 2-719 من القانون التجاري الموحد الأمريكي (UCC).',
    statutoryBasisEn: 'Delaware General Corporation Law (DGCL) & UCC Section 2-719 (Limitation of Remedy).',
    impactMetrics: [
      { labelAr: 'سقف المسؤولية المحدد', labelEn: 'Liability Cap Enforced', value: '$3.2M Max' },
      { labelAr: 'استثناء الأضرار التبعية', labelEn: 'Consequential Waiver', value: '100% Active' },
      { labelAr: 'مدة إغلاق الصفقة', labelEn: 'Deal Cycle Speed', value: '12 Hours' },
    ],
    tags: ['SaaS', 'Delaware Law', 'Liability Cap', 'Fortune 500', 'Enterprise'],
  },
  {
    id: 'case_logistics_maritime_egypt',
    titleAr: 'معالجة اضطرابات الملاحة وسلاسل الإمداد في عقد لوجستي بقيمة 5.6 مليون دولار',
    titleEn: 'Drafting Maritime Hardship & Force Majeure in a $5.6M Logistics Contract',
    sectorAr: 'الخدمات اللوجستية وسلاسل الإمداد والشحن البحري',
    sectorEn: 'Maritime & Supply Chain',
    jurisdictionAr: 'جمهورية مصر العربية (القاهرة والإسكندرية)',
    jurisdictionEn: 'Egypt (Cairo & Alexandria)',
    contractValue: '$5,600,000 USD',
    savedAmount: '$1,450,000 USD',
    resolutionTime: '36 ساعة',
    riskScoreBefore: 85,
    riskScoreAfter: 15,
    problemSummaryAr: 'أدى إغلاق مسارات ملاحية إلى تعذر الالتزام بجداول الشحن، وحاول المستورد تسييل خطابات الضمان البنكية ومطالبة الناقل بتعويضات فورية بدعوى التقصير.',
    problemSummaryEn: 'Shipping route disruptions caused transit delays, prompting the importer to attempt bank guarantee liquidation and unilateral breach claims.',
    solutionProvidedAr: 'إعادة صياغة بند الظروف الطارئة والقوة القاهرة وفق نظرية الحوادث الطارئة بالمادة 147 من القانون المدني المصري رقم 131 لسنة 1948، وتمديد الجداول الزمنية دون غرامات.',
    solutionProvidedEn: 'Reconstructed Force Majeure & Hardship clauses under Article 147 of the Egyptian Civil Code No. 131/1948, legally compelling timeline extensions without forfeiture.',
    statutoryBasisAr: 'المادة 147 و 215 من القانون المدني المصري رقم 131 لسنة 1948 وقانون التجارة البحرية المصري رقم 8 لسنة 1990.',
    statutoryBasisEn: 'Articles 147 & 215 of the Egyptian Civil Code No. 131/1948 & Maritime Trade Law No. 8/1990.',
    impactMetrics: [
      { labelAr: 'قيمة خطابات الضمان المحمية', labelEn: 'Bank Guarantees Saved', value: '$1.45M' },
      { labelAr: 'تمديد المهلة التشغيلية', labelEn: 'Operational Extension', value: '45 Days' },
      { labelAr: 'حل النزاع دون قضاء', labelEn: 'Out-of-Court Settlement', value: '100% Success' },
    ],
    tags: ['Logistics', 'Maritime', 'Force Majeure', 'Egyptian Law', 'Supply Chain'],
  },
];
