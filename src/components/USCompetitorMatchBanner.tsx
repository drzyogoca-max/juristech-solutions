import React, { useState } from 'react';
import { Shield, Zap, CheckCircle2, DollarSign, Award, ChevronRight, Scale, Globe, Building2, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const US_STATES = [
  { code: 'DE', name: 'Delaware', keyLaw: 'General Corporation Law (DGCL)' },
  { code: 'CA', name: 'California', keyLaw: 'California Civil Code & CCPA/CPRA' },
  { code: 'NY', name: 'New York', keyLaw: 'NY General Obligations & Commercial Code' },
  { code: 'TX', name: 'Texas', keyLaw: 'Texas Business Organizations Code (BOC)' },
  { code: 'FL', name: 'Florida', keyLaw: 'Florida Business Corporations Act' },
  { code: 'WY', name: 'Wyoming', keyLaw: 'Wyoming Limited Liability Company Act' },
  { code: 'IL', name: 'Illinois', keyLaw: 'Illinois Business Corporation Act' },
  { code: 'WA', name: 'Washington', keyLaw: 'Washington Business Corporation Act' },
];

export default function USCompetitorMatchBanner() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [selectedState, setSelectedState] = useState(US_STATES[0]);
  const [attorneyHours, setAttorneyHours] = useState(15);
  const [activeTab, setActiveTab] = useState<'comparison' | 'calculator'>('comparison');

  const hourlyRate = 450; // Average US Attorney hourly rate
  const traditionalCost = attorneyHours * hourlyRate;
  const platformCost = 49; // Monthly Pro plan
  const savings = traditionalCost - platformCost;

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 overflow-hidden relative">
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" />
              {isRtl ? 'حماية طراز 50 ولاية أمريكية' : '50 US States Jurisdiction Shield'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Award className="w-3.5 h-3.5" />
              {isRtl ? 'المطابقة الكاملة مع المنصات الأمريكية' : 'Matched with US Legal Leaders'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {isRtl
              ? 'تفوّق منظومة JurisTech & LegalShield مقارنة بالمنصات الأمريكية'
              : 'JurisTech & LegalShield vs Leading US Legal Platforms'}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            {isRtl
              ? 'مقارنة مباشرة في الكفاءة والسرعة والتكلفة مع LegalZoom و Rocket Lawyer و Ironclad و Clio مع تغطية كاملة لـ 50 ولاية أمريكية.'
              : 'Direct feature & cost match against LegalZoom, Rocket Lawyer, Ironclad, and Clio with full 50 US States regulatory compliance.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 self-stretch lg:self-auto justify-center">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'comparison'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'مصفوفة التنافسية' : 'Competitive Matrix'}
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? 'حاسبة التوفير (USD)' : 'US ROI Calculator ($)'}
          </button>
        </div>
      </div>

      {/* 50 US States Quick Selector */}
      <div className="mb-6 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/40">
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Globe className="w-4 h-4 text-indigo-400" />
            {isRtl ? 'اختر الولاية الأمريكية لتحديد القانون المباشر:' : 'Select Active US State Jurisdiction:'}
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            {selectedState.keyLaw}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {US_STATES.map((st) => (
            <button
              key={st.code}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 border ${
                selectedState.code === st.code
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-400 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <span className="font-mono font-bold text-xs text-indigo-300">{st.code}</span>
              <span className="truncate">{st.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: Comparison Matrix */}
      {activeTab === 'comparison' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">{isRtl ? 'الميزة / المعيار' : 'Feature / Criterion'}</th>
                <th className="py-3 px-4 text-indigo-400 font-extrabold bg-indigo-950/30 rounded-t-xl border-x border-t border-indigo-500/30">
                  JurisTech & LegalShield
                </th>
                <th className="py-3 px-4">LegalZoom USA</th>
                <th className="py-3 px-4">Rocket Lawyer USA</th>
                <th className="py-3 px-4">Ironclad / Clio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'زمن تدقيق العقود بالذكاء الاصطناعي' : 'AI Contract Audit Speed'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-indigo-950/20 border-x border-indigo-500/20">
                  ⚡ &lt; 1 Second (Instant)
                </td>
                <td className="py-3.5 px-4 text-slate-400">Manual / Days</td>
                <td className="py-3.5 px-4 text-slate-400">Limited AI / Hours</td>
                <td className="py-3.5 px-4 text-slate-400">Enterprise AI (Minutes)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'دعم قوانين الـ 50 ولاية أمريكية' : '50 US States Legal Engine'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-indigo-950/20 border-x border-indigo-500/20">
                  ✓ Full 50 States Built-in
                </td>
                <td className="py-3.5 px-4 text-emerald-400">✓ Yes (Extra Cost)</td>
                <td className="py-3.5 px-4 text-emerald-400">✓ Yes (Subscription)</td>
                <td className="py-3.5 px-4 text-amber-400">Partial / Custom</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'المحامي الافتراضي الذكي (24/7 Chatbot)' : '24/7 AI Virtual Lawyer'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-indigo-950/20 border-x border-indigo-500/20">
                  ✓ Juris AI (Unlimited 24/7)
                </td>
                <td className="py-3.5 px-4 text-rose-400">✗ Attorney Consultation Only</td>
                <td className="py-3.5 px-4 text-amber-400">Basic Q&A</td>
                <td className="py-3.5 px-4 text-rose-400">✗ Enterprise Search Only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'تأسيس الشركات (LLC & C-Corp Wizard)' : 'LLC & Inc Formation Wizard'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-indigo-950/20 border-x border-indigo-500/20">
                  ✓ Included Free with AI Forms
                </td>
                <td className="py-3.5 px-4 text-slate-400">$149 + State Fees</td>
                <td className="py-3.5 px-4 text-slate-400">$99 + State Fees</td>
                <td className="py-3.5 px-4 text-rose-400">✗ Not Supported</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {isRtl ? 'التكلفة الشهرية الأساسية (USD)' : 'Starting Monthly Price (USD)'}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-indigo-950/20 border-x border-b border-indigo-500/20">
                  $0 - $49/mo (Unlimited)
                </td>
                <td className="py-3.5 px-4 text-rose-400 font-mono">$39 - $299/mo</td>
                <td className="py-3.5 px-4 text-rose-400 font-mono">$39.99/mo</td>
                <td className="py-3.5 px-4 text-rose-400 font-mono">$500+/mo (Per Seat)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: US ROI Calculator */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {isRtl
                  ? `عدد الساعات القانونية المطلوبة شهرياً: (${attorneyHours} ساعة)`
                  : `Monthly Legal Hours Required: (${attorneyHours} hrs/mo)`}
              </label>
              <input
                type="range"
                min="2"
                max="50"
                value={attorneyHours}
                onChange={(e) => setAttorneyHours(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
                  {isRtl ? 'متوسط أجر المحامي الأمريكي' : 'Avg. US Attorney Hourly Rate'}
                </span>
                <p className="text-xl font-bold text-slate-200 mt-1 font-mono">${hourlyRate}/hr</p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">
                  {isRtl ? 'الولايات القضائية المشمولة' : 'States Covered'}
                </span>
                <p className="text-xl font-bold text-indigo-400 mt-1">50 US States</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/80 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 text-center space-y-4 shadow-xl">
            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
              {isRtl ? 'وفرة الميزانية القانونية السنوية المقدرة' : 'Estimated Annual Legal Savings'}
            </div>
            <div className="text-4xl md:text-5xl font-black text-emerald-400 font-mono tracking-tight">
              ${(savings * 12).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">
              {isRtl
                ? `تكلفة المحامي التقليدي: $${(traditionalCost * 12).toLocaleString()}/سنة مقابل $${(platformCost * 12).toLocaleString()}/سنة على منصتنا.`
                : `Traditional US Attorney: $${(traditionalCost * 12).toLocaleString()}/yr vs $${(platformCost * 12).toLocaleString()}/yr with JurisTech & LegalShield.`}
            </p>
            <a
              href="/payment"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              {isRtl ? 'ابدأ الخطة وفّر الميزانية الآن' : 'Claim Your LegalShield Plan'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
