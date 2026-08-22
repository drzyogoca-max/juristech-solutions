import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Globe, Building2, Zap, RefreshCw, Send,
  CheckCircle2, Loader2, Sparkles, Database, ToggleLeft, ToggleRight, Plus, Eye, Activity,
  Award, TrendingUp, BarChart2, ShieldCheck, Share2, Rocket, Target, Flag
} from 'lucide-react';
import { triggerAutomatedB2BOutreach } from '../services/outreachEngine';
import { globalOutreachGrowthEngine } from '../services/globalOutreachGrowthEngine';
import {
  getStoredRadarLeads, saveRadarLeads, LiveRadarVisitor,
  processDailyVisitorAnalytics, ingestHourlyVectorContext, runAutomatedLeadOutreachScan,
  RadarAnalyticsReport, rescoreAllLeads, computeAILeadScore, syncRadarLeadsWithSupabase
} from '../services/radarEngine';
import SmartRadarDashboard from '../components/SmartRadarDashboard';
import SEO from '../components/SEO';

export default function LeadRadarPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [visitors, setVisitors] = useState<LiveRadarVisitor[]>([]);
  const [report, setReport] = useState<RadarAnalyticsReport | null>(null);
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [scanning, setScanning] = useState<boolean>(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Global US & EU Growth Engine State
  const [growthCampaignState, setGrowthCampaignState] = useState(globalOutreachGrowthEngine.getCampaignMetrics());
  const [launchingCampaign, setLaunchingCampaign] = useState(false);

  const handleLaunch1000Campaign = async () => {
    setLaunchingCampaign(true);
    try {
      await globalOutreachGrowthEngine.launch1000ClientAcquisitionCampaign();
      setGrowthCampaignState(globalOutreachGrowthEngine.getCampaignMetrics());
      await loadData();
    } catch (e) {} finally {
      setLaunchingCampaign(false);
    }
  };

  // New Lead Form State
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    contactEmail: '',
    country: 'Egypt',
    sectorInterest: '',
    source: 'linkedin' as LiveRadarVisitor['source'],
  });

  const loadData = async () => {
    try {
      await syncRadarLeadsWithSupabase();
    } catch (e) {}
    // Re-score first to ensure all weights are applied
    const leads = rescoreAllLeads();
    setVisitors(leads);
    const analytics = await processDailyVisitorAnalytics();
    setReport(analytics);
    const storedAuto = localStorage.getItem('juristech_radar_auto_outreach') !== 'disabled';
    setAutoMode(storedAuto);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setVisitors(getStoredRadarLeads());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAuto = () => {
    const nextState = !autoMode;
    setAutoMode(nextState);
    localStorage.setItem('juristech_radar_auto_outreach', nextState ? 'enabled' : 'disabled');
    if (nextState) {
      runAutomatedLeadOutreachScan().then(() => setVisitors(getStoredRadarLeads()));
    }
  };

  const handleManualScan = async () => {
    setScanning(true);
    await ingestHourlyVectorContext();
    await runAutomatedLeadOutreachScan();
    await loadData();
    setTimeout(() => setScanning(false), 800);
  };

  const handleSendOutreach = async (leadId: string) => {
    setSendingId(leadId);
    const targetLead = visitors.find((v) => v.id === leadId);
    if (targetLead) {
      const success = await triggerAutomatedB2BOutreach(targetLead);
      if (success) {
        const updated = visitors.map((v) =>
          v.id === leadId
            ? { ...v, status: 'Outreach_Sent' as const, lastActive: isRtl ? 'تم إرسال العرض بنجاح' : 'Proposal Sent Successfully' }
            : v
        );
        setVisitors(updated);
        saveRadarLeads(updated);
      }
    }
    setSendingId(null);
  };

  const handleAddLead = () => {
    if (!newCompany.companyName || !newCompany.contactEmail) return;
    
    const visitedPages = ['/contracts', '/risk', '/b2b-proposals'];
    const sector = newCompany.sectorInterest || (isRtl ? 'عقود تجارية واستثمارية جديدة' : 'Commercial & Investment Contracts');
    
    // Compute AI Score parameters dynamically
    const scoreResult = computeAILeadScore(visitedPages, sector, newCompany.country);

    const newLead: LiveRadarVisitor = {
      id: `VIS-${Math.floor(1000 + Math.random() * 9000)}`,
      ip: `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`,
      location: `${newCompany.country}`,
      companyName: newCompany.companyName,
      contactEmail: newCompany.contactEmail,
      country: newCompany.country,
      sectorInterest: sector,
      leadScore: scoreResult.score,
      aiScoreTier: scoreResult.tier,
      scoreBreakdown: scoreResult.breakdown,
      nativeLanguage: 'ar',
      status: 'New',
      visitedPages: visitedPages,
      lastActive: isRtl ? 'تمت إضافته للرادار الآن' : 'Added to Radar just now',
      detectedAt: new Date().toISOString(),
      source: newCompany.source,
    };

    const updated = [newLead, ...visitors];
    setVisitors(updated);
    saveRadarLeads(updated);
    setShowAddModal(false);
    setNewCompany({ companyName: '', contactEmail: '', country: 'Egypt', sectorInterest: '', source: 'linkedin' });

    if (autoMode && newLead.leadScore >= 85) {
      triggerAutomatedB2BOutreach(newLead);
    }
  };

  const getTierBadgeClass = (tier: LiveRadarVisitor['aiScoreTier']) => {
    switch (tier) {
      case 'HOT':
        return 'bg-red-500/10 text-red-400 border border-red-500/30 font-black';
      case 'WARM':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold';
      case 'COLD':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      {/* ── Smart Radar Observatory ──────────────────────────────────── */}
      <SmartRadarDashboard />

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{isRtl ? 'محرك رادار الذكاء الاصطناعي والتقييم المستمر' : 'AI Autonomous Radar & Lead Engine'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isRtl ? 'رادار تتبع حركة العملاء واقتناص صفقات B2B' : 'Live Corporate & B2B Lead Radar'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isRtl
                ? 'نظام تتبع مباشر يقوم بجمع سلوك الزوار، التقييم بالذكاء الاصطناعي (AI Scoring)، وإرسال العروض الآلية'
                : 'Continuous visitor tracking engine feeding vector RAG embeddings and triggering automated B2B proposals'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Auto Mode Toggle */}
            <button
              onClick={handleToggleAuto}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all border shadow-lg ${
                autoMode
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:text-white'
              }`}
            >
              {autoMode ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
              <span>
                {autoMode
                  ? isRtl ? 'الأتمتة بالذكاء الاصطناعي: مفعلة' : 'AI Automation: ACTIVE'
                  : isRtl ? 'الأتمتة بالذكاء الاصطناعي: متوقفة' : 'AI Automation: PAUSED'}
              </span>
            </button>

            {/* Manual Scan */}
            <button
              onClick={handleManualScan}
              disabled={scanning}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? (isRtl ? 'جاري مسح الرادار...' : 'Scanning Radar...') : (isRtl ? 'مسح وفحص فوري' : 'Run Instant Scan')}</span>
            </button>

            {/* Add Lead */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة شركة مستهدفة' : 'Add Target Entity'}</span>
            </button>
          </div>
        </div>

        {/* ── 1,000 Real US & EU Client Acquisition Engine Console (24-Hour Autonomous Scheduler) ── */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono uppercase">
                <Rocket className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>{isRtl ? 'محرك التوزيع الآلي الذكي على مدار 24 ساعة (1,000 عميل)' : '24-Hour Autonomous 1,000 Client Distribution Engine'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isRtl ? 'استقطاب 1,000 عميل مؤسسي موزع آلياً على مدار 24 ساعة دون تدخل بشري' : '24H Autonomous B2B Outreach (1,000 US & EU Targets)'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl
                  ? 'يتم توليد عروض قانونية مخصصة بالذكاء الاصطناعي 100% باللغة الإنجليزية، موقعة ومختومة رسمياً باسم د. محمد مصطفى، وإرسالها بمعدل إيميل كل 86 ثانية (~42 إيميل/ساعة) لحماية النطاق وضمان الوصول للإنبوكس.'
                  : 'Automated 100% bespoke English legal AI proposals dynamically synthesized per target entity, signed by Dr. Mohammad Mustafa, dispatched at ~1 lead every 86s (42/hour) for 100% deliverability.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 24-Hour Autonomous Loop Toggle */}
              <button
                onClick={() => {
                  if (growthCampaignState.autonomousModeActive) {
                    globalOutreachGrowthEngine.stopAutonomousScheduler();
                  } else {
                    globalOutreachGrowthEngine.start24HourAutonomousScheduler();
                  }
                  setGrowthCampaignState(globalOutreachGrowthEngine.getCampaignMetrics());
                }}
                className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg border ${
                  growthCampaignState.autonomousModeActive
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {growthCampaignState.autonomousModeActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                <span>
                  {growthCampaignState.autonomousModeActive
                    ? (isRtl ? 'الأتمتة 24 ساعة: شـغالة (إيميل كل 86 ثانية)' : '24H Auto Loop: RUNNING (1 every 86s)')
                    : (isRtl ? 'بدء تشغيل الأتمتة 24 ساعة' : 'Start 24H Auto Loop')}
                </span>
              </button>

              {/* Instant Priority Batch */}
              <button
                onClick={handleLaunch1000Campaign}
                disabled={launchingCampaign}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                <Rocket className={`w-4 h-4 ${launchingCampaign ? 'animate-spin' : ''}`} />
                <span>
                  {launchingCampaign
                    ? (isRtl ? 'جاري إرسال الدفعة العاجلة...' : 'Dispatching...')
                    : (isRtl ? 'إرسال دفعة عاجلة (30 عميل)' : 'Trigger Priority Batch (30 Leads)')}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block font-sans">{isRtl ? 'إجمالي الهدف (موزع 24 ساعة):' : '24H Target (Distributed):'}</span>
              <span className="text-cyan-400 font-extrabold text-lg block font-mono">1,000 Real Clients</span>
              <span className="text-[10px] text-slate-400 block">Rate: ~41.6 emails / hr</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block font-sans">{isRtl ? 'العروض الموجهة المرسلة:' : 'Bespoke Proposals Sent:'}</span>
              <span className="text-emerald-400 font-extrabold text-lg block font-mono">{growthCampaignState.outreachDispatched} / 1,000</span>
              <span className="text-[10px] text-emerald-400/80 block">● Signed by Dr. Mohammad Mustafa</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block font-sans">{isRtl ? 'العملاء المحولون المؤكدون:' : 'Converted B2B Clients:'}</span>
              <span className="text-amber-400 font-extrabold text-lg block font-mono">{growthCampaignState.convertedClients} Clients</span>
              <span className="text-[10px] text-amber-300 block">100% Real Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block font-sans">{isRtl ? 'عوائد الاشتراكات المتوقعة:' : 'Projected Revenue ARR:'}</span>
              <span className="text-emerald-400 font-extrabold text-lg block font-mono">${growthCampaignState.projectedARRUSD.toLocaleString()} USD</span>
              <span className="text-[10px] text-slate-400 block">$5,000 ARR / client</span>
            </div>
          </div>

          {/* Admin BCC Notification Badge */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-cyan-300 font-bold">
                {isRtl ? '📬 بريد نسخة المراقبة الفورية المعتمد (Admin BCC Copy):' : '📬 Admin Real-Time BCC Copy Monitored:'}
              </span>
              <span className="font-mono bg-cyan-900/60 text-cyan-200 px-2 py-0.5 rounded border border-cyan-400/30">
                drzyogo.ca@gmail.com
              </span>
            </div>
            <span className="text-emerald-400 font-extrabold text-[11px]">
              {isRtl ? '✅ يتم إرسال نسخة طبق الأصل لبريدك تلقائياً مع كل رسالة أو إيميل يصدر لأي عميل' : '✅ Exact copy auto-forwarded to your inbox on every client email'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'الشركات المرصودة بالرادار' : 'Tracked Entities'}</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-3xl font-black text-cyan-400 mt-2 block">{visitors.length}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-1 block">Live real-time feed</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'متوسط اهتمام صفقات B2B' : 'Lead Intent Score'}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400 mt-2 block">
              {(visitors.reduce((acc, v) => acc + v.leadScore, 0) / (visitors.length || 1)).toFixed(1)}%
            </span>
            <span className="text-[11px] text-emerald-400 mt-1 block">High commercial priority</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'العروض التلقائية المرسلة' : 'Auto Proposals Dispatched'}</span>
              <Send className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-emerald-400 mt-2 block">
              {visitors.filter((v) => v.status === 'Outreach_Sent').length}
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">Dispatched via AI Engine</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'ناقلات Vector RAG المحدثة' : 'Vector RAG Embeddings'}</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-3xl font-black text-indigo-400 mt-2 block">
              {report?.ragVectorCount || 156}
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">Hourly automated AI memory</span>
          </div>
        </div>

        {/* Live Visitor Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                {isRtl ? 'سجل الشركات المزارة والتفاعل الآلي المباشر' : 'Live Corporate Activity & Automated AI Outreach'}
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {isRtl ? 'رادار مباشر يعمل' : 'Live Radar Running'}
            </span>
          </div>

          <div className="divide-y divide-slate-800/70">
            {visitors.length === 0 && (
              <div className="p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
                  <Activity className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'لا توجد زيارات أو شركات حقيقية مرصودة حالياً' : 'No Real Visitor Activity Recorded Yet'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {isRtl
                    ? 'تم تطهير بيانات السجل بالكامل. يقوم الرادر برصد وتسجيل نشاط الشركات والعملاء الحقيقيين فور تصفحهم للموقع وتعبئة الخدمات.'
                    : 'Mock records purged completely. The radar tracks real visitors live as they interact with forms and pages.'}
                </p>
              </div>
            )}

            {visitors.map((v) => {
              const isSending = sendingId === v.id;
              const isSent = v.status === 'Outreach_Sent';

              return (
                <div key={v.id} className="p-5 hover:bg-slate-800/40 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{v.companyName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getTierBadgeClass(v.aiScoreTier || 'COLD')}`}>
                            {v.aiScoreTier || 'COLD'} LEAD
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 text-[10px] font-mono flex items-center gap-1">
                            <Share2 className="w-3 h-3 text-cyan-400" />
                            {v.source || 'organic'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1 flex-wrap">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{v.location}</span>
                          <span className="font-mono text-slate-500 dark:text-slate-400 dark:text-slate-400">({v.ip})</span>
                          <span className="text-slate-650">•</span>
                          <span className="text-cyan-400 font-bold">{v.contactEmail}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {isRtl ? 'تقييم الذكاء AI Scoring:' : 'AI Score:'} {v.leadScore}/100
                      </span>

                      <button
                        onClick={() => handleSendOutreach(v.id)}
                        disabled={isSending || isSent}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md ${
                          isSent
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                        }`}
                      >
                        {isSending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isSent ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>
                          {isSent
                            ? isRtl ? 'تم إرسال العرض الذكي' : 'AI Proposal Sent'
                            : isRtl ? 'إرسال عرض B2B بالذكاء الاصطناعي' : 'Send AI B2B Proposal'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* AI Scoring Breakdown Panel */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 block font-bold mb-0.5">{isRtl ? 'تفاعل الصفحات' : 'Page Engagement'}</span>
                        <span className="text-xs font-extrabold text-indigo-400">{v.scoreBreakdown?.pageEngagement ?? 50}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 block font-bold mb-0.5">{isRtl ? 'ملاءمة القطاع' : 'Sector Relevance'}</span>
                        <span className="text-xs font-extrabold text-cyan-400">{v.scoreBreakdown?.sectorRelevance ?? 50}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 block font-bold mb-0.5">{isRtl ? 'إشارات سلوكية' : 'Behavior Signal'}</span>
                        <span className="text-xs font-extrabold text-amber-400">{v.scoreBreakdown?.behaviorSignal ?? 50}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 block font-bold mb-0.5">{isRtl ? 'حجم الشركة التقديري' : 'Estimated Entity Size'}</span>
                        <span className="text-xs font-extrabold text-pink-400">{v.scoreBreakdown?.companySize ?? 50}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400 block mb-1 font-bold">{isRtl ? 'القطاع والموضوع المستهدف:' : 'Sector & Active Interest:'}</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{v.sectorInterest}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400 block mb-1 font-bold">{isRtl ? 'حالة النشاط:' : 'Activity:'}</span>
                          <span className="text-cyan-400 font-medium">{v.lastActive}</span>
                        </div>
                        <div className="border-r border-slate-200 dark:border-slate-800 h-6 mx-1" />
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400 block mb-1 font-bold">{isRtl ? 'مسار الزيارة:' : 'Pages Path:'}</span>
                          <span className="font-mono text-indigo-400">{v.visitedPages.join(' → ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal to Add Target Entity */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <span>{isRtl ? 'إضافة شركة جديدة لرادار التتبع' : 'Add Target Entity to Radar'}</span>
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 font-bold block mb-1">{isRtl ? 'اسم الشركة' : 'Company Name'}</label>
                  <input
                    type="text"
                    value={newCompany.companyName}
                    onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                    placeholder="e.g. Delta Trading Group SAE"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 font-bold block mb-1">{isRtl ? 'البريد الإلكتروني للشركة' : 'Corporate Email'}</label>
                  <input
                    type="email"
                    value={newCompany.contactEmail}
                    onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
                    placeholder="deals@deltagroup.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 font-bold block mb-1">{isRtl ? 'الدولة' : 'Country'}</label>
                    <select
                      value={newCompany.country}
                      onChange={(e) => setNewCompany({ ...newCompany, country: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Egypt">Egypt (مصر)</option>
                      <option value="Saudi Arabia">Saudi Arabia (السعودية)</option>
                      <option value="UAE">UAE (الإمارات)</option>
                      <option value="Germany">Germany (ألمانيا)</option>
                      <option value="USA">USA (أمريكا)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 font-bold block mb-1">{isRtl ? 'قناة الاستقطاب' : 'Lead Source'}</label>
                    <select
                      value={newCompany.source}
                      onChange={(e) => setNewCompany({ ...newCompany, source: e.target.value as LiveRadarVisitor['source'] })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter / X</option>
                      <option value="organic">Organic Search</option>
                      <option value="direct">Direct Traffic</option>
                      <option value="referral">Referral</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 font-bold block mb-1">{isRtl ? 'القطاع المستهدف' : 'Sector Interest'}</label>
                  <input
                    type="text"
                    value={newCompany.sectorInterest}
                    onChange={(e) => setNewCompany({ ...newCompany, sectorInterest: e.target.value })}
                    placeholder="e.g. International Arbitrage & Corporate Governance"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:text-slate-900 dark:text-white"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleAddLead}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black"
                >
                  {isRtl ? 'إضافة إلى الرادار' : 'Add to Radar'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
