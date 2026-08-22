import React, { useState } from 'react';
import { Shield, Zap, CheckCircle2, DollarSign, Award, ChevronRight, Scale, Globe, Building2, FileText, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { Link } from 'react-router-dom';

export const TARGET_MARKETS = [
  { code: 'US', flag: '🇺🇸', nameAr: 'السوق الأمريكي (50 ولاية)', nameEn: 'US Market (50 States)', keyLaw: 'Delaware DGCL, UCC & CCPA', avgHourlyRate: 450, currency: '$' },
  { code: 'UK', flag: '🇬🇧', nameAr: 'السوق البريطاني (المملكة المتحدة)', nameEn: 'UK Market (London & Wales)', keyLaw: 'UK Companies Act 2006 & LCIA', avgHourlyRate: 380, currency: '£' },
  { code: 'DE', flag: '🇩🇪', nameAr: 'السوق الألماني (ألمانيا / DACH)', nameEn: 'German Market (DACH Region)', keyLaw: 'BGB, HGB & DSGVO GDPR', avgHourlyRate: 350, currency: '€' },
  { code: 'TR', flag: '🇹🇷', nameAr: 'السوق التركي (تركيا / ISTAC)', nameEn: 'Turkish Market (Turkey & ISTAC)', keyLaw: 'TTK, TBK & ISTAC Arbitration', avgHourlyRate: 220, currency: '$' },
  { code: 'CN', flag: '🇨🇳', nameAr: 'السوق الصيني (الصين / CIETAC)', nameEn: 'Chinese Market (China / APAC)', keyLaw: 'PRC Civil Code 2021 & CIETAC', avgHourlyRate: 280, currency: '$' },
  { code: 'ES', flag: '🇪🇸', nameAr: 'السوق الإسباني (إسبانيا / LATAM)', nameEn: 'Spanish Market (Spain & LATAM)', keyLaw: 'Código Civil Español & LSC', avgHourlyRate: 260, currency: '€' },
  { code: 'GCC', flag: '🇸🇦🇦🇪🇶🇦', nameAr: 'أسواق الخليج العربي (GCC)', nameEn: 'Gulf & GCC Markets (GCC)', keyLaw: 'Saudi M/191, UAE Commercial & DIFC/ADGM', avgHourlyRate: 400, currency: '$' },
];

export default function USCompetitorMatchBanner() {
  const { isRtl, formatNum } = usePlatformLocale();
  const [selectedMarket, setSelectedMarket] = useState(TARGET_MARKETS[0]);
  const [attorneyHours, setAttorneyHours] = useState(15);
  const [activeTab, setActiveTab] = useState<'comparison' | 'calculator'>('comparison');

  const hourlyRate = selectedMarket.avgHourlyRate;
  const traditionalCost = attorneyHours * hourlyRate;
  const platformCost = 49; // Monthly Pro plan
  const savings = traditionalCost - platformCost;

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 overflow-hidden relative font-sans">
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 🚀 TODAY HIGH-GROWTH CONVERSION BANNER FOR TOP 7 MARKETS */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-cyan-500/10 to-indigo-500/20 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0 font-bold">
            <Flame className="w-5 h-5 fill-current animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                {isRtl ? 'عرض الانضمام الفوري للعملاء الجدد (خصم 50% اليوم)' : 'TODAY SPECIAL 50% CLIENT ACQUISITION OFFER'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                LIMITED TODAY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-bold mt-0.5">
              {isRtl
                ? 'استهدف الأنظمة القانونية في (أمريكا، بريطانيا، ألمانيا، تركيا، الصين، إسبانيا، ودول الخليج) واحصل على باقة المؤسسات بخصم حصري ومباشر!'
                : 'Targeting US, UK, Germany, Turkey, China, Spain & Gulf markets with institutional legal protection!'}
            </p>
          </div>
        </div>

        <Link
          to="/payment?plan=pro"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shrink-0 transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isRtl ? 'اشترك الآن واحصل على العرض' : 'Claim Today Special Plan'}</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" />
              {isRtl ? 'تغطية 7 أسواق دولية ورئيسية' : '7 Global High-Paying Target Markets'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Award className="w-3.5 h-3.5" />
              {isRtl ? 'مطابقة القوانين والتشريعات المعتمدة' : 'Statutory Code Compliance Certified'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {isRtl
              ? 'حلول الهندسة القانونية للأسواق العالمية والخليجية'
              : 'JurisTech Global Legal AI for High-Paying International Markets'}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            {isRtl
              ? 'منظومة حماية واستشارات وتدقيق عقود متكاملة مخصصة للشركات والمنشآت في أمريكا، بريطانيا، ألمانيا، تركيا، الصين، إسبانيا، ودول الخليج العربي.'
              : 'Enterprise legal automation tailored for corporate entities across US, UK, Germany, Turkey, China, Spain, and GCC states.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 self-stretch lg:self-auto justify-center">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'comparison'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'مصفوفة الأسواق العالمية' : 'Global Market Matrix'}
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'calculator'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'حاسبة التوفير العالمية ($)' : 'Global ROI Calculator ($)'}
          </button>
        </div>
      </div>

      {/* 7 Global Markets Quick Selector Bar */}
      <div className="mb-6 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/40">
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
            <Globe className="w-4 h-4 text-cyan-400" />
            {isRtl ? 'اختر السوق المستهدف لتحديد النظام القانوني النافذ:' : 'Select Target Market Statutory System:'}
          </div>
          <span className="text-xs text-slate-300 font-bold bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            {selectedMarket.keyLaw}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {TARGET_MARKETS.map((m) => (
            <button
              key={m.code}
              onClick={() => setSelectedMarket(m)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 border ${
                selectedMarket.code === m.code
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{m.flag}</span>
              <span className="truncate">{isRtl ? m.nameAr.split(' ')[1] || m.nameAr : m.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: Comparison Matrix */}
      {activeTab === 'comparison' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">{isRtl ? 'الميزة / المعيار التشريعي' : 'Feature / Market Standard'}</th>
                <th className="py-3 px-4 text-cyan-400 font-extrabold bg-cyan-950/40 rounded-t-xl border-x border-t border-cyan-500/40">
                  JurisTech Solutions ({selectedMarket.flag} {selectedMarket.code})
                </th>
                <th className="py-3 px-4">{isRtl ? 'المكاتب القانونية التقليدية' : 'Traditional Law Firms'}</th>
                <th className="py-3 px-4">{isRtl ? 'المنصات الأمريكية (Ironclad/LegalZoom)' : 'US Enterprise Legal Tech'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'سرعة فحص العقود وكشف الثغرات' : 'Contract Audit & Redflag Speed'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-cyan-950/20 border-x border-cyan-500/20">
                  ⚡ &lt; 1 Second (Instant AI)
                </td>
                <td className="py-3.5 px-4 text-slate-400">3 - 7 Days</td>
                <td className="py-3.5 px-4 text-slate-400">Minutes to Hours</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'التطابق مع قوانين السوق المختارة' : 'Statutory Code Alignment'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-cyan-950/20 border-x border-cyan-500/20">
                  ✓ {selectedMarket.keyLaw}
                </td>
                <td className="py-3.5 px-4 text-emerald-400">✓ Yes (High Fees)</td>
                <td className="py-3.5 px-4 text-amber-400">Partial US Focus Only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'المساعد القانوني التفاعلي 24/7' : '24/7 AI Legal Concierge'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-cyan-950/20 border-x border-cyan-500/20">
                  ✓ Included 24/7 (7 Languages)
                </td>
                <td className="py-3.5 px-4 text-rose-400">✗ Billable Hours Only</td>
                <td className="py-3.5 px-4 text-rose-400">✗ Enterprise Search Only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'التكلفة الفعالة للمؤسسات' : 'Starting Monthly Price'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-cyan-950/20 border-x border-b border-cyan-500/20">
                  $49 - $139/mo (Unlimited)
                </td>
                <td className="py-3.5 px-4 text-rose-400 font-mono font-bold">$3,000 - $15,000 / deal</td>
                <td className="py-3.5 px-4 text-rose-400 font-mono font-bold">$300 - $1,200 / user / mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Global ROI Calculator */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {isRtl
                  ? `عدد الساعات القانونية المطلوبة شهرياً في ${selectedMarket.nameAr}: (${attorneyHours} ساعة)`
                  : `Monthly Legal Hours Required in ${selectedMarket.nameEn}: (${attorneyHours} hrs/mo)`}
              </label>
              <input
                type="range"
                min="2"
                max="50"
                value={attorneyHours}
                onChange={(e) => setAttorneyHours(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                <span>2 hrs</span>
                <span>25 hrs</span>
                <span>50 hrs</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">
                  {isRtl ? `متوسط ساعة المحامي في ${selectedMarket.nameAr}` : `Hourly Rate in ${selectedMarket.nameEn}`}
                </span>
                <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{selectedMarket.currency}{hourlyRate}/hr</p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">
                  {isRtl ? 'النظام التشريعي المعتمد' : 'Governing Law'}
                </span>
                <p className="text-xs font-bold text-cyan-400 mt-1 truncate">{selectedMarket.keyLaw}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-cyan-950/80 to-slate-900 p-6 rounded-2xl border border-cyan-500/30 text-center space-y-4 shadow-xl">
            <div className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
              {isRtl ? 'المبلغ الموفر سنوياً لمؤسستك' : 'Estimated Annual Enterprise Savings'}
            </div>
            <div className="text-4xl md:text-5xl font-black text-emerald-400 font-mono tracking-tight">
              ${formatNum(savings * 12)}
            </div>
            <p className="text-xs text-slate-400">
              {isRtl
                ? `تكلفة المحامي التقليدي: $${formatNum(traditionalCost * 12)}/سنة مقابل $${formatNum(platformCost * 12)}/سنة على المنصة.`
                : `Traditional Law Firm: $${formatNum(traditionalCost * 12)}/yr vs $${formatNum(platformCost * 12)}/yr with JurisTech Solutions.`}
            </p>
            <Link
              to="/payment?plan=pro"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isRtl ? 'اشترك الآن واحصل على الحماية الفورية' : 'Claim Your Plan & Protect Enterprise'}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
