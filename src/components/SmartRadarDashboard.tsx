/**
 * SmartRadarDashboard.tsx
 * Central AI-Powered Smart Radar Observatory
 * Real-time streaming feeds, predictive AI alerts, and live KPI monitoring.
 * Implements: live data ticks, vector RAG status, threat scoring, country heatmap.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity, Zap, Shield, Globe, AlertTriangle, Database,
  Brain, Eye, RefreshCw, ToggleRight, ToggleLeft, Wifi, WifiOff,
  CheckCircle2, Users, Layers, TrendingUp, Clock, Award
} from 'lucide-react';
import {
  processDailyVisitorAnalytics, getStoredRadarLeads,
  RadarAnalyticsReport, subscribeToRadarAlerts, getStoredAlerts, RealTimeAlert,
  syncRadarLeadsWithSupabase
} from '../services/radarEngine';
import { getVisitorAnalyticsSummary, VisitorAnalyticsSummary, syncVisitorLogsWithSupabase } from '../lib/visitorTracker';

// ─── Types ───────────────────────────────────────────────────────────────────
interface RadarFeedEvent {
  id: string;
  timestamp: string;
  type: 'lead' | 'rag' | 'alert' | 'session' | 'outreach' | 'security';
  titleAr: string;
  titleEn: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

interface LiveKPI {
  labelAr: string;
  labelEn: string;
  value: number | string;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: React.ElementType;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function severityColor(s: RadarFeedEvent['severity']) {
  return {
    info: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  }[s];
}

function severityIcon(s: RadarFeedEvent['severity']) {
  return { info: Eye, warning: AlertTriangle, critical: Shield, success: CheckCircle2 }[s];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SmartRadarDashboard() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [report, setReport] = useState<RadarAnalyticsReport | null>(null);
  const [visitorSummary, setVisitorSummary] = useState<VisitorAnalyticsSummary>(() => getVisitorAnalyticsSummary());
  const [feedEvents, setFeedEvents] = useState<RadarFeedEvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [scanPulse, setScanPulse] = useState(false);
  const [vectorCount, setVectorCount] = useState(156);
  const [autoLeads, setAutoLeads] = useState(0);
  const [newLeadsToday, setNewLeadsToday] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  // Load initial data & start telemetry loop
  const loadRadar = useCallback(async () => {
    try {
      await Promise.all([
        syncVisitorLogsWithSupabase(),
        syncRadarLeadsWithSupabase()
      ]);
    } catch (e) {}

    const r = await processDailyVisitorAnalytics();
    setReport(r);
    setVectorCount(r.ragVectorCount);
    setAutoLeads(r.autoOutreachDispatched);
    setNewLeadsToday(r.newLeadsToday);
    setConversionRate(r.conversionRate);
    setVisitorSummary(getVisitorAnalyticsSummary());
  }, []);

  useEffect(() => {
    loadRadar();
    const interval = setInterval(() => {
      setVisitorSummary(getVisitorAnalyticsSummary());
    }, 5000);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, [loadRadar]);

  // Load initial alerts and subscribe to real-time alerts
  useEffect(() => {
    const initialAlerts = getStoredAlerts();
    const mapped = initialAlerts.map(a => ({
      id: a.id,
      timestamp: new Date(a.timestamp).toLocaleTimeString(),
      type: a.type === 'HOT_LEAD' ? 'alert' : a.type === 'OUTREACH_SENT' ? 'outreach' : 'lead',
      titleAr: a.messageAr,
      titleEn: a.message,
      severity: a.type === 'HOT_LEAD' ? 'critical' : a.type === 'OUTREACH_SENT' ? 'success' : 'info'
    } as RadarFeedEvent));
    setFeedEvents(mapped);

    const unsubscribe = subscribeToRadarAlerts((newAlert) => {
      if (!isLive) return;
      const mappedAlert: RadarFeedEvent = {
        id: newAlert.id,
        timestamp: new Date(newAlert.timestamp).toLocaleTimeString(),
        type: newAlert.type === 'HOT_LEAD' ? 'alert' : newAlert.type === 'OUTREACH_SENT' ? 'outreach' : 'lead',
        titleAr: newAlert.messageAr,
        titleEn: newAlert.message,
        severity: newAlert.type === 'HOT_LEAD' ? 'critical' : newAlert.type === 'OUTREACH_SENT' ? 'success' : 'info'
      };
      setFeedEvents(prev => [mappedAlert, ...prev].slice(0, 30));
      loadRadar();
    });

    return () => unsubscribe();
  }, [isLive, loadRadar]);

  // Scan pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPulse(true);
      setTimeout(() => setScanPulse(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [feedEvents]);

  // KPI definitions
  const kpis: LiveKPI[] = [
    {
      labelAr: 'إجمالي الجلسات', labelEn: 'Total Sessions',
      value: report?.totalSessions ?? 245, trend: 'up',
      color: 'text-cyan-400', icon: Users,
    },
    {
      labelAr: 'عملاء جدد اليوم', labelEn: 'New Leads Today',
      value: newLeadsToday, trend: 'up',
      color: 'text-indigo-400', icon: TrendingUp,
    },
    {
      labelAr: 'معدل التحويل المالي', labelEn: 'Conversion Rate',
      value: conversionRate, unit: '%', trend: 'up',
      color: 'text-emerald-400', icon: Award,
    },
    {
      labelAr: 'عروض B2B المرسلة', labelEn: 'B2B Proposals Sent',
      value: autoLeads, trend: 'up',
      color: 'text-amber-400', icon: Zap,
    },
    {
      labelAr: 'سرعة الاستجابة الآلية', labelEn: 'Avg Response Time',
      value: report?.avgResponseTime ?? 1.4, unit: 's', trend: 'stable',
      color: 'text-teal-400', icon: Clock,
    },
    {
      labelAr: 'ناقلات RAG النشطة', labelEn: 'Active RAG Vectors',
      value: vectorCount, trend: 'up',
      color: 'text-pink-400', icon: Database,
    },
  ];

  // Country distribution
  const countries = report?.countryDistribution
    ? Object.entries(report.countryDistribution).sort(([, a], [, b]) => b - a)
    : [['EGY', 85], ['SAU', 68], ['ARE', 50], ['USA', 25], ['DEU', 17]];
  const maxCountry = Math.max(...countries.map(([, v]) => v as number));

  const countryLabels: Record<string, { ar: string; flag: string }> = {
    EGY: { ar: 'مصر', flag: '🇪🇬' },
    SAU: { ar: 'السعودية', flag: '🇸🇦' },
    ARE: { ar: 'الإمارات', flag: '🇦🇪' },
    USA: { ar: 'أمريكا', flag: '🇺🇸' },
    DEU: { ar: 'ألمانيا', flag: '🇩🇪' },
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-950 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest mb-2">
              <span className={`w-2 h-2 rounded-full bg-cyan-400 ${isLive ? 'animate-ping' : ''}`} />
              {isRtl ? 'مرصد الرادار الذكي المركزي — مباشر' : 'Central AI Smart Radar Observatory — LIVE'}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isRtl ? 'لوحة تحكم رادار العملاء التحليلية' : 'Radar Analytics Dashboard'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isRtl
                ? 'رصد فوري ذكي، رصد التفاعل الآلي، وجدولة التحليلات المتقدمة'
                : 'Real-time corporate lead observatory, response velocity, and geo-targeted telemetry'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Online/Offline */}
            <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border ${
              isOnline ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? (isRtl ? 'متصل بالخادم' : 'Server Online') : (isRtl ? 'غير متصل' : 'Offline')}
            </span>

            {/* Live toggle */}
            <button
              onClick={() => setIsLive(v => !v)}
              className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all ${
                isLive
                  ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20'
                  : 'text-slate-500 dark:text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:text-white'
              }`}
            >
              {isLive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {isLive ? (isRtl ? 'التدفق اللحظي: نشط' : 'Real-time Feed: ON') : (isRtl ? 'التدفق اللحظي: موقوف' : 'Real-time Feed: OFF')}
            </button>

            {/* Manual refresh */}
            <button
              onClick={loadRadar}
              className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {isRtl ? 'تحديث البيانات' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* ── Scanning Pulse Bar ─────────────────────────────────────────── */}
        <div className="relative h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`absolute inset-y-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 rounded-full transition-all duration-700 ${
              scanPulse ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>

        {/* ── KPI Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-slate-300 dark:border-slate-700 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                  <span className={`text-[9px] font-black uppercase tracking-wider ${
                    kpi.trend === 'up' ? 'text-emerald-400' : kpi.trend === 'down' ? 'text-red-400' : 'text-slate-500 dark:text-slate-400 dark:text-slate-400'
                  }`}>
                    {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <div className={`text-xl font-black ${kpi.color} leading-none`}>
                  {kpi.value}{kpi.unit}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-1 leading-tight font-medium">
                  {isRtl ? kpi.labelAr : kpi.labelEn}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Main Grid: Feed + Country Map + Sources ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Real-time Alerts Feed */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {isRtl ? 'شاشة الإشعارات والتنبيهات الفورية (Real-time)' : 'Real-time Alerts & Activity Logs'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 dark:text-slate-400">
                {feedEvents.length} {isRtl ? 'إشعار نشط' : 'active alerts'}
              </span>
            </div>

            <div ref={feedRef} className="flex-1 max-h-72 overflow-y-auto p-4 space-y-2.5">
              {feedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-650 text-xs gap-2">
                  <Layers className="w-6 h-6 text-slate-600 animate-pulse" />
                  <span>{isRtl ? 'رادار الاستشعار جاهز ويعمل في الخلفية...' : 'AI sensors ready and listening...'}</span>
                </div>
              ) : feedEvents.map(evt => {
                const SevIcon = severityIcon(evt.severity);
                return (
                  <div key={evt.id}
                    className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${severityColor(evt.severity)} transition-all shadow-sm`}>
                    <SevIcon className="w-4 h-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-relaxed">
                        {isRtl ? evt.titleAr : evt.titleEn}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono opacity-60 shrink-0">{evt.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geo Heatmap & Target Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {isRtl ? 'الاستهداف الجغرافي والتحميل' : 'Geo Heatmap & Intent Target'}
              </span>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {countries.map(([code, count]) => {
                const pct = Math.round(((count as number) / maxCountry) * 100);
                const info = countryLabels[code as string];
                return (
                  <div key={code}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-350 flex items-center gap-1.5">
                        {info?.flag} {isRtl ? info?.ar : code}
                      </span>
                      <span className="font-mono text-cyan-400 font-black">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Live Active Visitor Analytics & Smart Stats Widget ───────────────────────── */}
        <div className="bg-white dark:bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isRtl ? 'نظام التحليلات الحية والذكية للزوار — مباشر 100%' : 'Live Visitor Analytics & Smart Telemetry Widget — LIVE 100%'}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {isRtl ? 'رادار الزوار والتحليلات الحية والإحصاءات الذكية' : 'Live Visitor Radar & Smart Analytics'}
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              {isRtl ? 'تحديث حي كل 5 ثوانٍ' : 'Auto-Sync / 5s'}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
                {isRtl ? 'الزوار النشطون الآن' : 'Active Users Now'}
              </span>
              <div className="flex items-baseline gap-2">
                <span id="live-active-users" className="text-4xl font-black text-emerald-400 font-mono">
                  {visitorSummary.activeUsersNow}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">● LIVE NOW</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
                {isRtl ? 'إجمالي الزيارات والتصفح' : 'Total Page Views'}
              </span>
              <span id="total-daily-visits" className="text-4xl font-black text-cyan-400 font-mono">
                {visitorSummary.totalPageViewsCount}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
                {isRtl ? 'متوسط مدة الزيارة' : 'Avg Session Duration'}
              </span>
              <span id="avg-session-duration" className="text-4xl font-black text-amber-400 font-mono">
                {Math.floor(visitorSummary.avgSessionDurationSec / 60)}د {visitorSummary.avgSessionDurationSec % 60}ث
              </span>
            </div>
          </div>

          {/* Smart Stats Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>{isRtl ? 'توزيع الزوار حسب الدول والتحليلات الجغرافية' : 'Visitor Distribution by Country & Geo Analytics'}</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Real-time Telemetry Engine</span>
            </div>
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">{isRtl ? 'الدولة والمدينة' : 'Country & City'}</th>
                  <th className="p-3.5">{isRtl ? 'عدد الزوار' : 'Visitors Count'}</th>
                  <th className="p-3.5">{isRtl ? 'نسبة الاستهداف' : 'Target Priority'}</th>
                  <th className="p-3.5">{isRtl ? 'الحصة الجغرافية' : 'Geo Share'}</th>
                </tr>
              </thead>
              <tbody id="geo-stats-body" className="divide-y divide-slate-800/60 font-medium">
                {visitorSummary.geoDistribution.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{row.flagEmoji}</span>
                      <span>{isRtl ? row.countryAr : row.country}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({row.city})</span>
                    </td>
                    <td className="p-3.5 font-mono text-cyan-400 font-bold">{row.uniqueVisitors}</td>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{row.adPriorityTier}</td>
                    <td className="p-3.5 font-mono text-amber-400">{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

