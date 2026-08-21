import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck, Award, ArrowUpRight, TrendingUp, CheckCircle2,
  DollarSign, Clock, Scale, Building2, ChevronRight, X, ExternalLink,
  Lock, Sparkles, Filter, AlertTriangle
} from 'lucide-react';
import { LEGAL_CASE_STUDIES, LegalCaseStudy } from '../data/legalCaseStudies';

export default function CaseStudiesSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [selectedCase, setSelectedCase] = useState<LegalCaseStudy | null>(null);
  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('all');

  const filteredCases = activeSectorFilter === 'all'
    ? LEGAL_CASE_STUDIES
    : LEGAL_CASE_STUDIES.filter(c => c.tags.some(tag => tag.toLowerCase().includes(activeSectorFilter.toLowerCase())));

  return (
    <section className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 font-sans">
      {/* 🏷️ Header & Value Proposition */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {isRtl ? 'دراسات حالة واقعية معتمدة' : 'Real-World Sovereign Case Studies'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {isRtl ? 'عقود مليونية تم إنقاذها' : 'Multimillion ROI Verified'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isRtl ? 'كيف حمى الذكاء الاصطناعي التشريعي كبرى الشركات من خسائر ملايين الدولارات؟' : 'How JurisTech AI Protected Enterprises from Multimillion-Dollar Liabilities'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            {isRtl
              ? 'نماذج واقعية لعقود تجارية وهندسية تم فحصها وإعادة صياغة بنودها المجحفة وفق أحدث التشريعات الخليجية والدولية لعام 2026.'
              : 'Empirical enterprise case studies audited and neutralized under GCC & international commercial codes.'}
          </p>
        </div>

        {/* 🎛️ Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'all', labelAr: 'الكل (4)', labelEn: 'All (4)' },
            { id: 'EPC', labelAr: 'المقاولات والطاقة', labelEn: 'EPC & Energy' },
            { id: 'M&A', labelAr: 'الاستحواذ والـ IP', labelEn: 'M&A & IP' },
            { id: 'SaaS', labelAr: 'البرمجيات السحابية', labelEn: 'SaaS & Tech' },
            { id: 'Logistics', labelAr: 'الشحن واللوجستيات', labelEn: 'Logistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSectorFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSectorFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {isRtl ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 💼 Case Study Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCases.map((study) => (
          <div
            key={study.id}
            onClick={() => setSelectedCase(study)}
            className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl hover:shadow-cyan-500/10 cursor-pointer space-y-4 group relative overflow-hidden"
          >
            {/* Top Bar: Sector & Jurisdiction */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                {isRtl ? study.sectorAr : study.sectorEn}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-slate-300 border border-slate-800">
                {isRtl ? study.jurisdictionAr : study.jurisdictionEn}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-black text-white group-hover:text-cyan-400 transition-colors leading-snug">
              {isRtl ? study.titleAr : study.titleEn}
            </h3>

            {/* Problem & Solution Summary */}
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {isRtl ? study.problemSummaryAr : study.problemSummaryEn}
            </p>

            {/* 📊 Metrics & ROI Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">{isRtl ? 'قيمة العقد' : 'Contract Value'}</span>
                <span className="text-xs font-black text-white">{study.contractValue}</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-emerald-400 block">{isRtl ? 'المال المحمي' : 'Capital Saved'}</span>
                <span className="text-xs font-black text-emerald-400">{study.savedAmount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isRtl ? 'مؤشر المخاطر' : 'Risk Shift'}</span>
                <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                  <span className="text-red-400">{study.riskScoreBefore}%</span>
                  <span>→</span>
                  <span className="text-emerald-400">{study.riskScoreAfter}%</span>
                </span>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {isRtl ? study.resolutionTime : study.resolutionTime}
              </span>
              <span className="text-xs font-black text-cyan-400 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                {isRtl ? 'عرض تفاصيل الدراسة التشريعية' : 'View Statutory Case Analysis'}
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 Deep Dive Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8 rtl:pr-0 rtl:pl-8">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {isRtl ? selectedCase.sectorAr : selectedCase.sectorEn}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {isRtl ? selectedCase.jurisdictionAr : selectedCase.jurisdictionEn}
                </span>
              </div>
              <h3 className="text-xl font-black text-white leading-tight">
                {isRtl ? selectedCase.titleAr : selectedCase.titleEn}
              </h3>
            </div>

            {/* Quantitative Impact Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              {selectedCase.impactMetrics.map((m, i) => (
                <div key={i}>
                  <span className="text-xs text-slate-400 block">{isRtl ? m.labelAr : m.labelEn}</span>
                  <span className="text-base sm:text-lg font-black text-cyan-400">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Problem & Vulnerability Analysis */}
            <div className="space-y-2 p-4 rounded-2xl bg-red-950/20 border border-red-500/30">
              <h4 className="text-xs font-black text-red-400 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-4 h-4" />
                {isRtl ? 'المشكلة التعاقدية والثغرة المكتشفة' : 'Contractual Vulnerability & Trap Identified'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {isRtl ? selectedCase.problemSummaryAr : selectedCase.problemSummaryEn}
              </p>
            </div>

            {/* Solution & Redline Generated */}
            <div className="space-y-2 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
                <ShieldCheck className="w-4 h-4" />
                {isRtl ? 'الحل التشريعي وصياغة البند البديل' : 'JurisTech Solution & Compromise Redline'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {isRtl ? selectedCase.solutionProvidedAr : selectedCase.solutionProvidedEn}
              </p>
            </div>

            {/* Statutory Articles & Legal Grounds */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-black text-cyan-400 flex items-center gap-1.5 uppercase">
                <Scale className="w-4 h-4" />
                {isRtl ? 'السند القانوني والمواد التشريعية الحاكمة' : 'Statutory Basis & Legal Articles'}
              </h4>
              <p className="text-xs font-mono text-slate-300">
                {isRtl ? selectedCase.statutoryBasisAr : selectedCase.statutoryBasisEn}
              </p>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedCase(null)}
                className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition-all shadow-lg shadow-cyan-600/20 cursor-pointer"
              >
                {isRtl ? 'إغلاق نافذة دراسة الحالة' : 'Close Case Study'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
