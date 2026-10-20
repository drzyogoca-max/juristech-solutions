import { useState, useMemo, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Search, Sparkles, Download, Eye,
  Layers, Copy, Check, ArrowRight, ShieldCheck, Scale, Globe,
  Award, Landmark
} from 'lucide-react';
import SEO from '../components/SEO';
import RelatedServices from '../components/RelatedServices';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  MEGA_CATEGORIES,
  MEGA_CONTRACT_TEMPLATES,
  MegaContractTemplate,
} from '../data/contractsMegaRepository';
import {
  SOVEREIGN_JURISDICTIONS,
  SOVEREIGN_MILLION_CONTRACTS,
  SovereignContract,
} from '../data/sovereignContractsCatalog';
import { generateAndDownloadWordDocument } from '../utils/export-utils';

type ActiveLibraryTab = 'sovereign' | 'operational';

export default function TemplatesPage() {
  const { l, isRtl, formatNum } = usePlatformLocale();

  // Primary Library Tab (Defaults to Sovereign Million-Dollar Suite)
  const [activeTab, setActiveTab] = useState<ActiveLibraryTab>('sovereign');

  // Sovereign Country Filter
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');

  // Operational Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Global Search Query
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Preview Modal state
  const [previewItem, setPreviewItem] = useState<{
    id: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    templateAr: string;
    templateEn: string;
    countryFlag?: string;
    countryNameAr?: string;
    countryNameEn?: string;
    statuteAr?: string;
    statuteEn?: string;
    arbitrationVenue?: string;
    dealTier?: string;
    estimatedValue?: string;
  } | null>(null);

  const [modalLang, setModalLang] = useState<'ar' | 'en'>(isRtl ? 'ar' : 'en');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active Jurisdiction Object
  const activeJurisdiction = useMemo(() => {
    return SOVEREIGN_JURISDICTIONS.find((j) => j.code === selectedCountry) || SOVEREIGN_JURISDICTIONS[0];
  }, [selectedCountry]);

  // Filter Sovereign Contracts
  const filteredSovereignContracts = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase().trim();
    return SOVEREIGN_MILLION_CONTRACTS.filter((c) => {
      const matchesCountry = selectedCountry === 'ALL' || c.countryCode === selectedCountry;
      const matchesSearch =
        !query ||
        c.titleAr.toLowerCase().includes(query) ||
        c.titleEn.toLowerCase().includes(query) ||
        c.descriptionAr.toLowerCase().includes(query) ||
        c.descriptionEn.toLowerCase().includes(query) ||
        c.statuteCodeAr.toLowerCase().includes(query) ||
        c.statuteCodeEn.toLowerCase().includes(query) ||
        c.arbitrationVenue.toLowerCase().includes(query) ||
        c.countryNameAr.toLowerCase().includes(query) ||
        c.countryNameEn.toLowerCase().includes(query) ||
        c.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCountry && matchesSearch;
    });
  }, [selectedCountry, deferredSearchQuery]);

  // Filter Operational Templates
  const filteredOperationalTemplates = useMemo(() => {
    const query = deferredSearchQuery.toLowerCase().trim();
    return MEGA_CONTRACT_TEMPLATES.filter((tpl) => {
      const matchesCat = selectedCategory === 'all' || tpl.categoryKey === selectedCategory;
      const matchesSearch =
        !query ||
        tpl.titleAr.toLowerCase().includes(query) ||
        tpl.titleEn.toLowerCase().includes(query) ||
        tpl.descriptionAr.toLowerCase().includes(query) ||
        tpl.descriptionEn.toLowerCase().includes(query) ||
        tpl.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, deferredSearchQuery]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadWord = (title: string, body: string, lang: 'ar' | 'en') => {
    generateAndDownloadWordDocument(title, body, lang);
  };

  const openSovereignPreview = (c: SovereignContract) => {
    setModalLang(isRtl ? 'ar' : 'en');
    setPreviewItem({
      id: c.id,
      titleAr: c.titleAr,
      titleEn: c.titleEn,
      descriptionAr: c.descriptionAr,
      descriptionEn: c.descriptionEn,
      templateAr: c.templateAr,
      templateEn: c.templateEn,
      countryFlag: c.countryFlag,
      countryNameAr: c.countryNameAr,
      countryNameEn: c.countryNameEn,
      statuteAr: c.statuteCodeAr,
      statuteEn: c.statuteCodeEn,
      arbitrationVenue: c.arbitrationVenue,
      dealTier: c.dealTier,
      estimatedValue: c.estimatedValueRange,
    });
  };

  const openOperationalPreview = (tpl: MegaContractTemplate) => {
    setModalLang(isRtl ? 'ar' : 'en');
    setPreviewItem({
      id: tpl.id,
      titleAr: tpl.titleAr,
      titleEn: tpl.titleEn,
      descriptionAr: tpl.descriptionAr,
      descriptionEn: tpl.descriptionEn,
      templateAr: tpl.templateAr,
      templateEn: tpl.templateEn,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020B1A] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={l(
          'مكتبة العقود المليونية السيادية للدول 2026 | JurisTech Solutions',
          'Sovereign Million-Dollar Institutional Contracts Library | JurisTech Solutions'
        )}
        description={l(
          'مكتبة العقود والصفقات الاستثمارية المليونية مفصولة ومحصورة بالكامل بحسب الدولة (السعودية، الإمارات، قطر، الكويت، مصر، الأردن، أمريكا، بريطانيا والدولية) متوافقة مع الأنظمة الوطنية ومراكز التحكيم الدولية.',
          'Sovereign million-dollar & institutional contracts catalog isolated strictly by country (Saudi Arabia, UAE, Qatar, Kuwait, Egypt, Jordan, US Delaware, UK & UNCITRAL) with authentic statutory citations and arbitration forums.'
        )}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>
              {l(
                'مكتبة العقود المليونية والسيادية للدول 2026 — فصل حصري حسب الدولة',
                'Sovereign Million-Dollar & Institutional Library 2026 — Isolated By Country'
              )}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {l('استوديو العقود المليونية والسيادية', 'Sovereign Institutional Contracts Studio')}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {l(
              'عقود صفقات كبرى (M&A، مقاولات EPC، جولات تمويل استثماري، سلاسل إمداد دولية، واتفاقيات وكالة حصرية) محصورة ضمن دولها المستقلة وتستند مباشرة إلى الأنظمة القضائية الوطنية ومراكز التحكيم المعتمدة.',
              'High-stakes contracts ($1M to $100M+ M&A, turnkey EPC, Series A/B investments, cross-border supply chains, and master distribution) strictly segregated by sovereign jurisdiction with explicit statutory articles.'
            )}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('sovereign')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                activeTab === 'sovereign'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-950 dark:text-amber-300" />
              <span>{l('العقود المليونية والسيادية للدول', 'Sovereign Million-Dollar Suite')}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-950/20 dark:bg-slate-800 text-[11px] font-mono">
                {formatNum(SOVEREIGN_MILLION_CONTRACTS.length)}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('operational')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                activeTab === 'operational'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-cyan-500/20'
                  : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{l('مستودع النماذج العامة', 'General Operational Templates')}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-950/20 dark:bg-slate-800 text-[11px] font-mono">
                {formatNum(MEGA_CONTRACT_TEMPLATES.length)}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-3.5 w-5 h-5 text-slate-400`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'sovereign'
                ? l(
                    'ابحث في العقود المليونية (استحواذ، EPC، نظام المعاملات المدنية، SCCA، ديلاوير، DIAC)...',
                    'Search sovereign deals (M&A, EPC, Civil Transactions Law, SCCA, Delaware, DIAC)...'
                  )
                : l(
                    'ابحث في النماذج العامة (سرية، توظيف، تأسيس شركات، خدمات برمجية)...',
                    'Search operational templates (NDA, employment, bylaws, SaaS)...'
                  )
            }
            className={`w-full ${
              isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'
            } py-3 bg-white dark:bg-[#0D1F3C] border border-slate-300 dark:border-slate-700/80 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-md`}
          />
        </div>

        {/* ── SOVEREIGN SUITE MODE ────────────────────────────────────────── */}
        {activeTab === 'sovereign' && (
          <div className="space-y-6">
            {/* Country Selector Pills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold px-1">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-amber-500" />
                  {l('اختر الدولة أو الولاية القضائية المعنية:', 'Select Sovereign Jurisdiction:')}
                </span>
                <span className="text-[11px] text-amber-500/80">
                  {l('عقود معتمدة ومفصولة 100% بحسب الدولة', '100% Sovereign-Isolated Legal Frameworks')}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {SOVEREIGN_JURISDICTIONS.map((jur) => {
                  const isActive = selectedCountry === jur.code;
                  return (
                    <button
                      key={jur.code}
                      onClick={() => setSelectedCountry(jur.code)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                          : 'bg-white dark:bg-[#0D1F3C] text-slate-700 dark:text-slate-300 hover:text-white border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="text-base">{jur.flag}</span>
                      <span>{isRtl ? jur.nameAr : jur.nameEn}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-slate-950/30 text-slate-950 font-black'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {formatNum(jur.contractCount)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Jurisdiction Focus Banner */}
            {activeJurisdiction.code !== 'ALL' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0D1F3C] to-emerald-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeJurisdiction.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-white">
                        {isRtl ? activeJurisdiction.nameAr : activeJurisdiction.nameEn}
                      </h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                        {activeJurisdiction.legalSystem}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      <span className="text-slate-400">{l('النظام الحاكم:', 'Governing Statute:')}</span>{' '}
                      <span className="font-semibold text-amber-300">{activeJurisdiction.primaryStatute}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">{l('مقر وهيئة التحكيم:', 'Arbitration Forum:')}</span>
                    <span className="font-bold text-white">{activeJurisdiction.arbitrationVenue}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sovereign Contracts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSovereignContracts.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-[#0D1F3C] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-2xl hover:shadow-amber-500/5 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />

                  <div className="space-y-4">
                    {/* Top Meta Bar */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{c.countryFlag}</span>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                            {isRtl ? c.countryNameAr : c.countryNameEn}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold inline-block">
                            💎 {c.dealTier === 'HIGH_STAKES' ? l('صفقة استراتيجية كبرى', 'Strategic Deal') : l('عقد استثماري مليوني', 'Million-Dollar Deal')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 font-extrabold block">
                          {c.estimatedValueRange}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {c.clausesCount} {l('بند قضائي', 'clauses')}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {isRtl ? c.titleAr : c.titleEn}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {isRtl ? c.descriptionAr : c.descriptionEn}
                      </p>
                    </div>

                    {/* Statute & Arbitration Badges */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#142847] p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
                        <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate font-medium">{isRtl ? c.statuteCodeAr : c.statuteCodeEn}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#142847] p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
                        <Landmark className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate font-medium">{c.arbitrationVenue}</span>
                      </div>
                    </div>

                    {/* Key Clauses Preview */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        {l('أبرز البنود الحاكمة:', 'Key Statutory Clauses:')}
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {c.keyClauses.slice(0, 2).map((clause, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-tight line-clamp-1">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{clause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openSovereignPreview(c)}
                        title={l('معاينة العقد كاملاً', 'Preview Full Contract')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopyText(isRtl ? c.templateAr : c.templateEn, c.id)}
                        title={l('نسخ نص العقد', 'Copy Contract Text')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                      >
                        {copiedId === c.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadWord(isRtl ? c.titleAr : c.titleEn, isRtl ? c.templateAr : c.templateEn, isRtl ? 'ar' : 'en')}
                        title={l('تحميل كملف Word رسمي (.docx)', 'Download Official Word (.docx)')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      to={`/contracts?template=${encodeURIComponent(c.id)}&title=${encodeURIComponent(
                        isRtl ? c.titleAr : c.titleEn
                      )}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all cursor-pointer"
                    >
                      <span>{l('تخصيص بالذكاء الاصطناعي', 'AI Customize')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredSovereignContracts.length === 0 && (
              <div className="text-center py-16 bg-[#0D1F3C] rounded-3xl border border-slate-800">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  {l('لا توجد عقود تطابق بحثك في الدولة المحددة.', 'No sovereign contracts match your search.')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── OPERATIONAL TEMPLATES MODE ──────────────────────────────────── */}
        {activeTab === 'operational' && (
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                    : 'bg-white dark:bg-[#0D1F3C] text-slate-700 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{l('جميع النماذج', 'All Templates')}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {formatNum(MEGA_CONTRACT_TEMPLATES.length)}
                </span>
              </button>

              {MEGA_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                        : 'bg-white dark:bg-[#0D1F3C] text-slate-700 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span>{isRtl ? cat.nameAr : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Operational Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOperationalTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white dark:bg-[#0D1F3C] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          {tpl.pagesCount} {l('صفحات', 'Pages')}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          {tpl.clausesCount} {l('بنود', 'Clauses')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {isRtl ? tpl.titleAr : tpl.titleEn}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {isRtl ? tpl.descriptionAr : tpl.descriptionEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tpl.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-2 mt-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openOperationalPreview(tpl)}
                        title={l('معاينة النموذج', 'Preview Template')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopyText(isRtl ? tpl.templateAr : tpl.templateEn, tpl.id)}
                        title={l('نسخ نص العقد', 'Copy Template Text')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                      >
                        {copiedId === tpl.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadWord(isRtl ? tpl.titleAr : tpl.titleEn, isRtl ? tpl.templateAr : tpl.templateEn, isRtl ? 'ar' : 'en')}
                        title={l('تحميل كملف Word', 'Download Word')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      to={`/contracts?template=${encodeURIComponent(tpl.id)}&title=${encodeURIComponent(
                        isRtl ? tpl.titleAr : tpl.titleEn
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 transition-all cursor-pointer"
                    >
                      <span>{l('تخصيص بالذكاء الاصطناعي', 'AI Customize')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredOperationalTemplates.length === 0 && (
              <div className="text-center py-16 bg-[#0D1F3C] rounded-3xl border border-slate-800">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  {l('لا توجد نماذج مطابقة لبحثك.', 'No templates found matching your query.')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cross-Service Discovery */}
        <RelatedServices currentServiceId="templates" />
      </div>

      {/* Unified Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1F3C] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-[#0A1830]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {previewItem.countryFlag && <span className="text-2xl">{previewItem.countryFlag}</span>}
                  <h2 className="text-base sm:text-lg font-black text-white">
                    {modalLang === 'ar' ? previewItem.titleAr : previewItem.titleEn}
                  </h2>
                </div>
                {previewItem.statuteAr && (
                  <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span>{modalLang === 'ar' ? previewItem.statuteAr : previewItem.statuteEn}</span>
                    {previewItem.arbitrationVenue && (
                      <span className="text-slate-400"> • {previewItem.arbitrationVenue}</span>
                    )}
                  </p>
                )}
                <p className="text-xs text-slate-400 line-clamp-1">
                  {modalLang === 'ar' ? previewItem.descriptionAr : previewItem.descriptionEn}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Language Switcher inside Modal */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-0.5 flex items-center">
                  <button
                    onClick={() => setModalLang('ar')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                      modalLang === 'ar' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setModalLang('en')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                      modalLang === 'en' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  {l('إغلاق', 'Close')}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              dir={modalLang === 'ar' ? 'rtl' : 'ltr'}
              className="p-6 overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all bg-[#020B1A]/80 border-y border-slate-800"
            >
              {modalLang === 'ar' ? previewItem.templateAr : previewItem.templateEn}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0A1830] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopyText(
                      modalLang === 'ar' ? previewItem.templateAr : previewItem.templateEn,
                      previewItem.id
                    )
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 cursor-pointer border border-slate-700"
                >
                  {copiedId === previewItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{l('تم النسخ', 'Copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{l('نسخ النص', 'Copy Text')}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() =>
                    handleDownloadWord(
                      modalLang === 'ar' ? previewItem.titleAr : previewItem.titleEn,
                      modalLang === 'ar' ? previewItem.templateAr : previewItem.templateEn,
                      modalLang
                    )
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 cursor-pointer border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{l('تحميل كملف Word', 'Download Word')}</span>
                </button>
              </div>

              <Link
                to={`/contracts?template=${encodeURIComponent(previewItem.id)}&title=${encodeURIComponent(
                  modalLang === 'ar' ? previewItem.titleAr : previewItem.titleEn
                )}`}
                className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>{l('فتح في استوديو التحرير الذكي', 'Open in AI Contract Studio')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
