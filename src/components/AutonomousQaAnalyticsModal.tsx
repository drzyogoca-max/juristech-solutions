import React, { useState } from 'react';
import { ShieldCheck, Server, Cpu, Globe, CheckCircle2, AlertTriangle, Lock, RefreshCw, X, Zap, Activity, Users, FileText, Ban, Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { autonomousQaEngine, QATestResult, GeoVisitorAnalytics, ServerPerformanceState } from '../services/autonomousQaEngine';

interface AutonomousQaAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AutonomousQaAnalyticsModal({ isOpen, onClose }: AutonomousQaAnalyticsModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [qaResults, setQaResults] = useState<QATestResult[]>(autonomousQaEngine.getQAResults());
  const [geoAnalytics, setGeoAnalytics] = useState<GeoVisitorAnalytics>(autonomousQaEngine.getGeoAnalytics());
  const [serverPerf, setServerPerf] = useState<ServerPerformanceState>(autonomousQaEngine.getServerPerformance());
  const [isRunningQA, setIsRunningQA] = useState(false);
  const [newHostileInput, setNewHostileInput] = useState('');

  if (!isOpen) return null;

  function handleReRunQA() {
    setIsRunningQA(true);
    setTimeout(() => {
      setQaResults(autonomousQaEngine.runFullAutonomousQASuite());
      setServerPerf(autonomousQaEngine.getServerPerformance());
      setIsRunningQA(false);
    }, 1000);
  }

  function handleAddHostileBlock() {
    if (!newHostileInput.trim()) return;
    autonomousQaEngine.blockHostileDomain(newHostileInput.trim());
    setGeoAnalytics(autonomousQaEngine.getGeoAnalytics());
    setNewHostileInput('');
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.92)', backdropFilter: 'blur(12px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  {isRtl ? 'لوحة التحليلات الجغرافية واختبارات QA المؤتمتة' : 'Autonomous QA & Geo-Visitor Intelligence'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  ZERO-HUMAN QA ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isRtl ? 'تتبع الزوار (يومي، أسبوعي، شهري، سنوي)، ذروة الزيارات، وتدريب نماذج الذكاء الاصطناعي التكيفي' : 'Track Visitor Traffic (Daily, Weekly, Monthly, Yearly), Peak Hours & AI Model Self-Tuning'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Periodic Traffic Breakdown (Daily, Weekly, Monthly, Yearly) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{isRtl ? 'إحصائيات حركة الزوار والعملاء المثبتة (يومي، أسبوعي، شهري، سنوي)' : 'Persistent Periodic Visitor Traffic Breakdown'}</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-1">
                <div className="text-[11px] text-cyan-400 font-bold">{isRtl ? 'زوار اليوم (Daily)' : 'Daily Visitors'}</div>
                <div className="text-2xl font-black text-white">{geoAnalytics.visitorsDaily.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-bold">✓ {isRtl ? 'مثبت ومحدث تلقائياً' : 'Persistent & Tracked'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-1">
                <div className="text-[11px] text-indigo-400 font-bold">{isRtl ? 'زوار الأسبوع (Weekly)' : 'Weekly Visitors'}</div>
                <div className="text-2xl font-black text-white">{geoAnalytics.visitorsWeekly.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-bold">✓ {isRtl ? 'إجمالي الأسبوع الحالي' : 'Current Week Total'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-1">
                <div className="text-[11px] text-purple-400 font-bold">{isRtl ? 'زوار الشهر (Monthly)' : 'Monthly Visitors'}</div>
                <div className="text-2xl font-black text-white">{geoAnalytics.visitorsMonthly.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-bold">✓ {isRtl ? 'إجمالي الشهر الحالي' : 'Current Month Total'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-1">
                <div className="text-[11px] text-amber-400 font-bold">{isRtl ? 'زوار السنة (Yearly)' : 'Yearly Visitors'}</div>
                <div className="text-2xl font-black text-white">{geoAnalytics.visitorsYearly.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-bold">✓ {isRtl ? 'إجمالي السنة الحالية' : 'Current Year Total'}</div>
              </div>
            </div>
          </div>

          {/* Peak Traffic Hours & Top Visiting Cities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'أوقات ذروة الزيارات (Peak Traffic Hours)' : 'Peak Traffic Hours'}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                {isRtl ? geoAnalytics.peakTrafficHoursAr : geoAnalytics.peakTrafficHoursEn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? 'أكثر المدن زيارة وحضوراً' : 'Top Visiting Cities'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                {(isRtl ? geoAnalytics.topVisitingCitiesAr : geoAnalytics.topVisitingCitiesEn).map((city, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Geo Analytics */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? 'التوزيع الجغرافي لحركة الزوار (الخليج، مصر والشام، أوروبا وأمريكا)' : 'Regional Geo-Visitor Traffic Distribution'}</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">{isRtl ? 'تغطية عالمية' : 'Global Coverage'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GCC */}
              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-indigo-300">{isRtl ? 'دول الخليج العربي (GCC)' : 'GCC Countries'}</span>
                  <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-black">{geoAnalytics.regionalBreakdown.gcc.percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {geoAnalytics.regionalBreakdown.gcc.countries.join(' • ')}
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  {geoAnalytics.regionalBreakdown.gcc.count.toLocaleString()} {isRtl ? 'زيارة اليوم' : 'Visits Today'}
                </div>
              </div>

              {/* Egypt & Levant */}
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-300">{isRtl ? 'مصر والشام (Egypt & Levant)' : 'Egypt & Levant'}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-black">{geoAnalytics.regionalBreakdown.egyptAndLevant.percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {geoAnalytics.regionalBreakdown.egyptAndLevant.countries.join(' • ')}
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  {geoAnalytics.regionalBreakdown.egyptAndLevant.count.toLocaleString()} {isRtl ? 'زيارة اليوم' : 'Visits Today'}
                </div>
              </div>

              {/* Europe & US */}
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-amber-300">{isRtl ? 'أوروبا والأمريكتين (Europe & US)' : 'Europe & US'}</span>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-black">{geoAnalytics.regionalBreakdown.europeAndUS.percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {geoAnalytics.regionalBreakdown.europeAndUS.countries.join(' • ')}
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  {geoAnalytics.regionalBreakdown.europeAndUS.count.toLocaleString()} {isRtl ? 'زيارة اليوم' : 'Visits Today'}
                </div>
              </div>
            </div>
          </div>

          {/* QA Test Suite List */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? 'نتائج قائمة الفحص والتوافق المؤتمتة (QA Test Suite)' : 'Automated QA Test Suite Results'}</span>
              </h3>

              <button
                onClick={handleReRunQA}
                disabled={isRunningQA}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningQA ? 'animate-spin' : ''}`} />
                <span>{isRtl ? 'إعادة الفحص الآن' : 'Run Full QA Suite'}</span>
              </button>
            </div>

            <div className="space-y-2 font-mono">
              {qaResults.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">{isRtl ? t.testNameAr : t.testNameEn}</div>
                      <div className="text-[10px] text-slate-400">{t.details}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{t.latencyMs}ms</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hostile Domain Blocking Security Wall */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-red-400 flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-400" />
              <span>{isRtl ? 'جدار حظر النطاقات والتهديدات المعادية (Hostile Threat Firewall)' : 'Hostile Domain Defense Firewall'}</span>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newHostileInput}
                onChange={(e) => setNewHostileInput(e.target.value)}
                placeholder={isRtl ? 'إضافة نطاق معادي للحظر المباشر (مثال: hostile-bot.com)...' : 'Add domain to blocklist (e.g. hostile-bot.com)...'}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button
                onClick={handleAddHostileBlock}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                {isRtl ? 'حظر النطاق' : 'Block Domain'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {geoAnalytics.hostileDomainsBlockedList.map((domain, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-[10px] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-400" />
                  <span>{domain}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{isRtl ? 'النظام يعمل بالتطوير والتكيف الذاتي المستمر 24/7 دون تدخل بشري' : 'Continuous AI Autonomous Training & Self-Healing Active 24/7'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            {isRtl ? 'إغلاق اللوحة' : 'Close Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
