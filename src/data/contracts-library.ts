export interface ContractTemplate {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'Corporate' | 'Investment' | 'Technology' | 'RealEstate' | 'IP';
  riskLevel: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  descriptionAr: string;
  descriptionEn: string;
  essentialClauses: string[];
  jurisdictionRules: Record<string, string>;
}

export const ENTERPRISE_CONTRACTS_LIBRARY: ContractTemplate[] = [
  {
    id: 'corp-shareholders-v1',
    titleAr: 'اتفاقية المساهمين وحوكمة الشركاء (Shareholders Agreement)',
    titleEn: 'Enterprise Shareholders & Governance Agreement',
    category: 'Corporate',
    riskLevel: 'CRITICAL',
    descriptionAr: 'اتفاقية حوكمة قانونية شاملة تنظم توزيع الحصص، حقوق التصويت، شروط التخارج (Drag-Along/Tag-Along)، وحل النزاعات بين المساهمين.',
    descriptionEn: 'Comprehensive governance agreement covering equity distribution, voting rights, Drag-Along/Tag-Along clauses, and dispute resolution.',
    essentialClauses: [
      'شروط وأحكام نقل الملكية وحظر التصرف (Lock-up Period)',
      'حق الشفعة وأولية الشراء (Right of First Refusal)',
      'آلية التخارج الإجباري والانضمام (Drag-Along & Tag-Along)',
      'صلاحيات مجلس الإدارة والقرارات السيادية المحجوزة (Reserved Matters)'
    ],
    jurisdictionRules: {
      GCC: 'تتوافق مع أنظمة الشركات التجارية الحديثة ولوائح الهيئات الاستثمارية.',
      GLOBAL: 'Compliant with International UNCITRAL Commercial Arbitration Standards.'
    }
  },
  {
    id: 'inv-term-sheet-v1',
    titleAr: 'مذكرة الشروط والأحكام الاستثمارية (Venture Capital Term Sheet)',
    titleEn: 'Venture Capital Investment Term Sheet',
    category: 'Investment',
    riskLevel: 'HIGH',
    descriptionAr: 'عقد استثماري هيكلي صارم لتقييم الجولات الاستثمارية (Seed / Series A)، تحديد التقييم، وتوزيع التفضيلات عند التصفية.',
    descriptionEn: 'Structured investment framework for funding rounds, valuation terms, and liquidation preferences.',
    essentialClauses: [
      'التقييم قبل وبعد الاستثمار (Pre-money vs Post-money Valuation)',
      'تفضيلات التصفية (Liquidation Preference 1x Non-Participating)',
      'أحكام منع تخفيض الملكية (Anti-Dilution Protection)',
      'ممثلي المستثمر في مجلس الإدارة وشروط الفيتو'
    ],
    jurisdictionRules: {
      GCC: 'متوافقة مع جولات الاستثمار الجريء والشركات الاستثمارية المباشرة.',
      GLOBAL: 'Standardized against NVCA (National Venture Capital Association) guidelines.'
    }
  },
  {
    id: 'tech-sla-saas-v1',
    titleAr: 'عقد تقديم الخدمات السحابية واتفاقية مستوى الخدمة (SLA & Tech Services)',
    titleEn: 'International SaaS & Enterprise SLA Agreement',
    category: 'Technology',
    riskLevel: 'HIGH',
    descriptionAr: 'اتفاقية تقنية عالية الدقة تنظم تقديم البرمجيات كخدمة، الضمانات التشغيلية، حدود المسؤولية المالية، وحماية البيانات.',
    descriptionEn: 'High-precision agreement regulating SaaS uptime guarantees, operational warranties, and limitation of liability.',
    essentialClauses: [
      'نسبة الجاهزية والتشغيل (Uptime SLA 99.9%) واستحقاق التعويضات',
      'ملكية البيانات وحقوق الملكية الفكرية للبرمجيات',
      'حدود المسؤولية المالية والتعويضات (Limitation of Liability Caps)',
      'معالجة البيانات والنسخ الاحتياطي والأمن السيبراني'
    ],
    jurisdictionRules: {
      EU: 'Strict compliance with European Union GDPR Regulations.',
      GCC: 'تتوافق مع ضوابط الأمن السيبراني وحماية البيانات الشخصية.'
    }
  },
  {
    id: 'ip-nda-comprehensive-v1',
    titleAr: 'اتفاقية عدم الإفشاء وحماية السرية التجارية والملكية الفكرية (NDI & IP Protection)',
    titleEn: 'Mutual NDA & Proprietary Intellectual Property Agreement',
    category: 'IP',
    riskLevel: 'MEDIUM',
    descriptionAr: 'عقد ملزن لحماية الأسرار التجارية، الشفرات المصدريّة، الخوارزميات، والبيانات الحساسة أثناء المفاوضات الاستثمارية أو التشغيلية.',
    descriptionEn: 'Enforceable contract shielding trade secrets, algorithms, source code, and proprietary assets during deals.',
    essentialClauses: [
      'تعريف نطاق المعلومات السرية والأسرار التجارية (Definition of Confidential Info)',
      'التزامات الاستخدام المحصور والمنع من المنافسة غير المشروعة',
      'مدة الاستمرار بالسرية بعد انتهاء الاتفاقية (Survival Period)',
      'الجزاءات والتعويضات الفورية عن الخرق (Injunctive Relief)'
    ],
    jurisdictionRules: {
      GLOBAL: 'Universal cross-border IP protection framework.'
    }
  }
];
