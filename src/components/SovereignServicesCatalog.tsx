import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  MessageSquare,
  Building2,
  Library,
  Layers,
  Radio,
  Briefcase,
  Handshake,
  ShieldCheck,
  Scale,
  Cpu,
  Lock,
  Video,
  Share2,
  BarChart3,
  CreditCard,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'contracts' | 'corporate' | 'risk' | 'arbitration';
  descAr: string;
  descEn: string;
  route: string;
  icon: React.ElementType;
  color: string;
  badgeAr: string;
  badgeEn: string;
}

const ALL_18_SERVICES: ServiceItem[] = [
  {
    id: 'contracts-maker',
    titleAr: 'صانع ومولد العقود الذكية',
    titleEn: 'AI Smart Contract Generator',
    category: 'contracts',
    descAr: 'توليد عقود تجارية وقانونية محكمة الصياغة ومطابقة للأنظمة السيادية في ثوانٍ معدودة.',
    descEn: 'Draft institutional commercial agreements tailored to statutory frameworks in seconds.',
    route: '/contracts',
    icon: FileText,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    badgeAr: 'فوري ومعتمد',
    badgeEn: 'Instant & Certified',
  },
  {
    id: 'risk-audit',
    titleAr: 'مدقق المخاطر والبنود التعسفية',
    titleEn: 'Contract Risk & Liability Audit',
    category: 'risk',
    descAr: 'فحص بنود المسؤولية المالية، التعويضات، والملكية الفكرية واقتراح صياغات بديلة متوازنة.',
    descEn: 'Audit financial liabilities, indemnity clauses & IP exposure with automated redlines.',
    route: '/risk',
    icon: AlertTriangle,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    badgeAr: 'حماية فائقة',
    badgeEn: 'Maximum Protection',
  },
  {
    id: 'ai-consultant',
    titleAr: 'المستشار القانوني الذكي 24/7',
    titleEn: '24/7 AI Legal Copilot',
    category: 'contracts',
    descAr: 'إجابات قانونية موثقة ومؤصلة فقهياً وتشريعياً لكافة استفسارات الشركات والمؤسسات.',
    descEn: 'Authoritative, statutory-backed legal advice and statutory reasoning around the clock.',
    route: '/chat',
    icon: MessageSquare,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    badgeAr: 'متصل الآن',
    badgeEn: 'Always Active',
  },
  {
    id: 'company-formation',
    titleAr: 'تأسيس الشركات والامتثال التشريعي',
    titleEn: 'Cross-Border Company Formation',
    category: 'corporate',
    descAr: 'إجراءات تأسيس الكيانات في السعودية (MISA)، دبي (DIFC/ADGM)، ديلاوير، وبريطانيا.',
    descEn: 'End-to-end corporate setup in Saudi MISA, Dubai DIFC/ADGM, Delaware & UK.',
    route: '/company-formation',
    icon: Building2,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    badgeAr: 'توسع عالمي',
    badgeEn: 'Global Scaling',
  },
  {
    id: 'repository',
    titleAr: 'مستودع المليون عقد المؤسسي',
    titleEn: 'Mega 1M+ Contracts Repository',
    category: 'contracts',
    descAr: 'أضخم أرشيف رقمي للعقود والاتفاقيات الدولية المصنفة حسب القطاع والاختصاص.',
    descEn: 'The most comprehensive repository of multi-jurisdictional certified corporate contracts.',
    route: '/repository',
    icon: Library,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    badgeAr: '1,000,000+ عقد',
    badgeEn: '1M+ Contracts',
  },
  {
    id: 'templates',
    titleAr: 'مكتبة النماذج والاتفاقيات الجاهزة',
    titleEn: 'Verified Legal Templates Studio',
    category: 'contracts',
    descAr: 'قوالب ونماذج عقود رسمية جاهزة للتعبئة والتصدير بضيغتي Word و PDF مباشرة.',
    descEn: 'Ready-to-use institutional contract templates with one-click Word & PDF export.',
    route: '/templates',
    icon: Layers,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    badgeAr: 'تحميل مباشر',
    badgeEn: 'Instant Download',
  },
  {
    id: 'lead-radar',
    titleAr: 'رادار الشركات والفرص التعاقدية B2B',
    titleEn: 'B2B Enterprise Lead Radar',
    category: 'corporate',
    descAr: 'رصد وتحليل الاحتياجات القانونية للشركات وتقديم حلول تعاقدية مخصصة استباقياً.',
    descEn: 'Autonomous scanning of corporate compliance needs and proactive contract synthesis.',
    route: '/lead-radar',
    icon: Radio,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    badgeAr: 'ذكاء الأعمال',
    badgeEn: 'B2B Intelligence',
  },
  {
    id: 'b2b-proposals',
    titleAr: 'صانع العروض والمقترحات للشركات',
    titleEn: 'Enterprise B2B Proposals Engine',
    category: 'corporate',
    descAr: 'صياغة عروض تقديمية ومقترحات تعاقدية متكاملة لعملاء الشركات الكبرى.',
    descEn: 'Generate persuasive, legally compliant enterprise retainers and service proposals.',
    route: '/b2b-proposals',
    icon: Briefcase,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    badgeAr: 'حزم استشارية',
    badgeEn: 'Enterprise Tiers',
  },
  {
    id: 'negotiation',
    titleAr: 'مفاوض الصفقات وفض النزاعات الآلي',
    titleEn: 'AI Negotiation & Dispute Resolver',
    category: 'arbitration',
    descAr: 'اقتراح استراتيجيات تفاوض وبنود تسوية ذكية لتقليل النزاعات وتأمين مصالحك.',
    descEn: 'Algorithmic negotiation strategies and dispute mediation for commercial agreements.',
    route: '/negotiation',
    icon: Handshake,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    badgeAr: 'تسوية النزاعات',
    badgeEn: 'Dispute Mediation',
  },
  {
    id: 'enterprise-audit',
    titleAr: 'التدقيق المؤسسي الشامل والفحص النافي',
    titleEn: 'Enterprise Due Diligence Audit',
    category: 'risk',
    descAr: 'فحص نافٍ للجهالة شامل للمخاطر التشغيلية والمالية والقانونية في صفقات الاستحواذ.',
    descEn: 'Comprehensive corporate due diligence, compliance scoring, and acquisition risk audits.',
    route: '/enterprise-audit',
    icon: ShieldCheck,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    badgeAr: 'فحص M&A',
    badgeEn: 'Due Diligence',
  },
  {
    id: 'legal-compliance',
    titleAr: 'الامتثال التشريعي وحوكمة الشركات',
    titleEn: 'Regulatory Compliance & Governance',
    category: 'corporate',
    descAr: 'متابعة الامتثال للوائح حماية البيانات (PDPL & GDPR) ومكافحة غسل الأموال وتحديث الأنظمة.',
    descEn: 'Live tracking of PDPL, GDPR, AML, and local statutory regulatory governance.',
    route: '/legal-compliance',
    icon: Scale,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    badgeAr: 'حوكمة صارمة',
    badgeEn: 'Strict Governance',
  },
  {
    id: 'sovereign-ai-hub',
    titleAr: 'مركز الذكاء السيادي متعدد النماذج',
    titleEn: 'Multi-Engine Sovereign AI Hub',
    category: 'risk',
    descAr: 'تبديل فوري بين نماذج الذكاء الاصطناعي السيادية المعزولة لضمان أعلى دقة وخصوصية.',
    descEn: 'Multi-LLM arbitration across isolated proprietary sovereign models for zero data leakage.',
    route: '/sovereign-ai-hub',
    icon: Cpu,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    badgeAr: 'تشفير فائق',
    badgeEn: 'Zero Leakage',
  },
  {
    id: 'vault',
    titleAr: 'خزنة المستندات المشفرة E2EE',
    titleEn: 'Encrypted Zero-Knowledge Vault',
    category: 'arbitration',
    descAr: 'تخزين آمن ومحمي بتشفير AES-GCM 256-bit مع وصول حصري عبر مفاتيح العميل.',
    descEn: 'Zero-knowledge encrypted repository for sensitive contracts and corporate assets.',
    route: '/vault',
    icon: Lock,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    badgeAr: 'AES-256 Bit',
    badgeEn: 'Bank Grade',
  },
  {
    id: 'video-hub',
    titleAr: 'استوديو الوسائط والشرح القانوني',
    titleEn: 'Video & Audio Legal Media Studio',
    category: 'corporate',
    descAr: 'شروحات مرئية وصوتية بالذكاء الاصطناعي لكيفية صياغة وتدقيق العقود وتأسيس الشركات.',
    descEn: 'Interactive multimedia walkthroughs and AI avatars explaining complex legal frameworks.',
    route: '/video-hub',
    icon: Video,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    badgeAr: 'مرئي وتفاعلي',
    badgeEn: 'Video Studio',
  },
  {
    id: 'marketing',
    titleAr: 'التسويق القانوني التلقائي B2B',
    titleEn: 'Autonomous Legal Growth Radar',
    category: 'corporate',
    descAr: 'إطلاق حملات تفاعلية ذكية لاستهداف الإدارات القانونية ومكاتب المحاماة العالمية.',
    descEn: 'Autonomous growth engine targeting corporate legal departments across GCC & Europe.',
    route: '/marketing',
    icon: Share2,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    badgeAr: 'نمو تلقائي',
    badgeEn: 'Auto Growth',
  },
  {
    id: 'reports',
    titleAr: 'التقارير الإستراتيجية للمدراء التنفيذيين',
    titleEn: 'C-Suite Strategic Legal Reports',
    category: 'risk',
    descAr: 'مؤشرات حية وتحليلات مخاطر تعاقدية مخصصة للرؤساء التنفيذيين ومجالس الإدارة.',
    descEn: 'Executive analytics, litigation risk indices, and contractual exposure for C-Suite.',
    route: '/reports',
    icon: BarChart3,
    color: 'text-lime-400 bg-lime-500/10 border-lime-500/30',
    badgeAr: 'C-Suite Analytics',
    badgeEn: 'Executive Dash',
  },
  {
    id: 'arbitration-concierge',
    titleAr: 'التحكيم التجاري وحل النزاعات الدولية',
    titleEn: 'International Commercial Arbitration',
    category: 'arbitration',
    descAr: 'استشارات متخصصة في قواعد UNCITRAL، غرف التجارة الدولية (ICC)، ومراكز SCCA و DIAC.',
    descEn: 'Cross-border arbitration advisory under UNCITRAL, ICC Paris, SCCA, and DIAC rules.',
    route: '/chat?mode=arbitration',
    icon: Scale,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    badgeAr: 'تحكيم دولي',
    badgeEn: 'ICC / UNCITRAL',
  },
  {
    id: 'payment',
    titleAr: 'بوابة الباقات والاشتراكات المخصومة',
    titleEn: 'Subscription & Instant Checkout',
    category: 'corporate',
    descAr: 'تفعيل فوري للاشتراكات بخصم 30% مع دعم Binance Pay، إنستا باي، والحوالات البنكية.',
    descEn: 'Instant tier activation with 30% discount supporting Crypto, InstaPay & Wire Transfer.',
    route: '/payment',
    icon: CreditCard,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    badgeAr: 'خصم 30%',
    badgeEn: '30% Off',
  },
];

export default function SovereignServicesCatalog() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'contracts' | 'corporate' | 'risk' | 'arbitration'>('all');

  const filteredServices = ALL_18_SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch =
      service.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.descAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.descEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl space-y-6 font-sans">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-sky-400">
              {isRtl ? 'دليل الخدمات والحلول السيادية الشامل' : '18 Sovereign Legal Services Directory'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {isRtl ? 'استعرض وانتقل لأي خدمة قانونية بضغطة زر واحدة' : 'Explore All 18 Institutional Services & AI Engines'}
          </h2>
          <p className="text-xs text-slate-300">
            {isRtl ? 'جميع الأدوات مدعومة بالذكاء الاصطناعي ومطابقة للأنظمة القضائية المحلية والدولية.' : 'All tools are AI-powered, statutory compliant, and continuously updated.'}
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث في الخدمات...' : 'Search services...'}
            className="w-full py-2.5 px-4 ps-10 pe-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', labelAr: 'جميع الخدمات (18)', labelEn: 'All Services (18)' },
          { id: 'contracts', labelAr: '📜 صياغة العقود والنماذج', labelEn: 'Contracts Studio' },
          { id: 'corporate', labelAr: '🏢 تأسيس الشركات والحوكمة', labelEn: 'Corporate & M&A' },
          { id: 'risk', labelAr: '🔍 تدقيق المخاطر والتحري', labelEn: 'Risk & Audit' },
          { id: 'arbitration', labelAr: '⚖️ التحكيم والخزنة المشفرة', labelEn: 'Arbitration & Vault' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-md scale-105'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isRtl ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Services Grid (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              to={service.route}
              className="bg-slate-950/80 hover:bg-slate-900/90 rounded-2xl p-5 border border-slate-800/90 hover:border-sky-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 group no-underline shadow-md hover:shadow-xl hover:scale-[1.01]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl border ${service.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800 group-hover:border-sky-500/30">
                    {isRtl ? service.badgeAr : service.badgeEn}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    {t(`Nav.${service.id}`) !== `Nav.${service.id}` ? t(`Nav.${service.id}`) : (isRtl ? service.titleAr : service.titleEn)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {isRtl ? service.descAr : service.descEn}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] font-bold text-sky-400 group-hover:text-sky-300">
                <span>{isRtl ? 'بدء الاستخدام الفوري' : 'Launch Service'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform`} />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-slate-400 space-y-2">
          <p className="text-sm font-bold">{isRtl ? 'لا توجد خدمات مطابقة لبحثك.' : 'No services found matching your search.'}</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs font-bold text-sky-400 hover:underline"
          >
            {isRtl ? 'إعادة ضبط البحث' : 'Reset search filter'}
          </button>
        </div>
      )}
    </div>
  );
}
