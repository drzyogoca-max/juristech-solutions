import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Share2, Sparkles, Twitter, Linkedin, Instagram, Activity, Award, TrendingUp, Cpu, Check,
  Clock, Zap, MessageSquare, ShieldAlert, ShieldCheck, RefreshCw, BarChart2
} from 'lucide-react';
import {
  getStoredPosts, getStoredEngagements, getStoredMarketingAnalytics,
  SocialPost, AutoEngagement, MarketingAnalytics, runCampaignGeneratorWorker,
  runSocialSchedulerWorker, runAutoEngagementWorker, runSelfOptimizationLoop,
  isReviewModeActive, toggleReviewMode, approveEngagementResponse,
  editEngagementResponse, rejectEngagementResponse
} from '../lib/socialMarketing';
import { getFunnelAnalytics } from '../lib/marketingTracker';
import SEO from '../components/SEO';

export default function SocialMarketingPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [engagements, setEngagements] = useState<AutoEngagement[]>([]);
  const [analytics, setAnalytics] = useState<MarketingAnalytics | null>(null);
  const [syncing, setSyncing] = useState(false);

  const loadCampaigns = () => {
    setPosts(getStoredPosts());
    setEngagements(getStoredEngagements());
    setAnalytics(getStoredMarketingAnalytics());
  };

  useEffect(() => {
    loadCampaigns();
    // Refresh stats every 4 seconds to show live background workers updating
    const interval = setInterval(() => {
      loadCampaigns();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualTriggerSync = async () => {
    setSyncing(true);
    // Force run workers
    await runCampaignGeneratorWorker();
    await runSocialSchedulerWorker();
    await runAutoEngagementWorker();
    runSelfOptimizationLoop();
    loadCampaigns();
    setTimeout(() => setSyncing(false), 800);
  };

  const getPlatformIcon = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-400" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-cyan-400" />;
      case 'instagram':
      default:
        return <Instagram className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header and Worker Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>{isRtl ? 'منظومة التسويق الآلي الذاتي' : 'AI Autonomous Campaign Engine'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isRtl ? 'لوحة تحكم التسويق التلقائي الشامل' : 'Full-Automation Social Media System'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isRtl 
                ? 'النشر والتفاعل التلقائي بالكامل في الخلفية (LinkedIn & X & Instagram) دون تدخل بشري'
                : 'Fully autonomous content generation, publishing, and auto-engagement running via background cron jobs'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {isRtl ? 'أتمتة تويتر (X) كل ساعة: 100% نشطة' : 'Twitter (X) Hourly Automation: 100% ACTIVE'}
            </span>

            <button
              onClick={handleManualTriggerSync}
              disabled={syncing}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-400 text-xs font-black flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-cyan-500/20"
            >
              <Twitter className="w-3.5 h-3.5" />
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? (isRtl ? 'جاري نشر التغريدة...' : 'Tweeting...') : (isRtl ? 'نشر تغريدة فورية على (X)' : 'Publish Hourly Tweet (X)')}</span>
            </button>
          </div>
        </div>

        {/* Twitter X Hourly Automation Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Twitter className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FULL AUTOMATION 100%
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isRtl ? 'أتمتة منصة تويتر (X) الفورية' : 'Twitter (X) Automated Marketing Radar'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {isRtl
                  ? 'يتم توليد ونشر التغريدات والمحتوى الترويجي بذكاء اصطناعي بمعدل كل ساعة على مدار (اليوم، الأسبوع، الشهر، والسنوات) دون أي تدخل بشري.'
                  : 'AI generates and dispatches promotional tweets continuously every hour 24/7/365 without human intervention.'}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono block">{isRtl ? 'معدل التكرار النفاذ:' : 'Schedule Frequency:'}</span>
            <span className="text-xs font-mono font-black text-emerald-400">1 Tweet / Hour (Every 60m)</span>
          </div>
        </div>

        {/* Global B2B Conversion Funnels Dashboard (GA4, Meta Pixel & LinkedIn) */}
        {(() => {
          const funnel = getFunnelAnalytics();
          return (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">
                      {isRtl ? 'لوحة قياس وتتبع مسارات التحويل العالمية (B2B Conversion Funnel)' : 'Global B2B Conversion Funnel Analytics'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isRtl ? 'مؤشرات التتبع الفوري من GA4 Enhanced Ecommerce و Meta Pixel و LinkedIn Tag' : 'Live tracking signals from GA4, Meta Pixel & LinkedIn Insight Tag.'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Total Funnel Revenue: ${funnel.totalRevenue} USD
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">{isRtl ? '1. الزوار' : '1. Visitors'}</span>
                  <span className="text-xl font-black text-white">{funnel.visitors}</span>
                  <span className="text-[9px] text-slate-400 block">GA4 PageView Tag</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">{isRtl ? '2. عملاء متوقعون' : '2. Leads'}</span>
                  <span className="text-xl font-black text-cyan-400">{funnel.leads}</span>
                  <span className="text-[9px] text-slate-400 block">Meta Lead Pixel</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">{isRtl ? '3. تجربة مجانية' : '3. Trial Starts'}</span>
                  <span className="text-xl font-black text-amber-400">{funnel.trials}</span>
                  <span className="text-[9px] text-slate-400 block">LinkedIn Tag</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">{isRtl ? '4. مشتركين مسددين' : '4. Paid Clients'}</span>
                  <span className="text-xl font-black text-emerald-400">{funnel.paidSubscribers}</span>
                  <span className="text-[9px] text-slate-400 block">Purchase Conversion</span>
                </div>
              </div>
            </div>
          );
        })()}
          
        {/* Self-Optimizing Loops Telemetry & KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Live KPI Card: Total Published */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'الحملات المنشورة آلياً' : 'Automated Published Campaigns'}</span>
              <Share2 className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">{analytics?.totalPublished ?? 0}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 block">{isRtl ? 'موزعة على شبكات التواصل' : 'Distributed across social platform APIs'}</span>
          </div>

          {/* Live KPI Card: Engagement Rate */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'معدل التفاعل الوسطي' : 'Avg Engagement Velocity'}</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">%{analytics?.avgEngagementRate ?? 0}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 block">{isRtl ? 'تفاعل، مشاركات، ونقرات B2B' : 'Likes, shares, DMs, and outbound clicks'}</span>
          </div>

          {/* Self-Optimization Analytics */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'مخرجات التحسين الذاتي (AI Self-Optimization)' : 'AI Self-Optimization Loop'}</span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400 font-bold">{isRtl ? 'موضوع الاستقطاب الأمثل:' : 'Optimized Topic:'}</span>
                <span className="text-cyan-400 font-black truncate max-w-[160px]" title={analytics?.bestTopic ?? 'N/A'}>
                  {analytics?.bestTopic ?? (isRtl ? 'حوكمة الشركات' : 'Corporate Governance')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400 font-bold">{isRtl ? 'أفضل توقيت للنشر:' : 'Best Posting Time:'}</span>
                <span className="text-indigo-400 font-bold">{analytics?.bestTimeSlot ?? '10:00 AM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400 font-bold">{isRtl ? 'دورات التعلم والتقييم:' : 'Learning Cycles:'}</span>
                <span className="text-amber-400 font-bold">{analytics?.selfOptimizedCycles ?? 1} cycles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Work Grid: Queues, Active streams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Scheduled & Published Posts (2/3 Column) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                    {isRtl ? 'سجل المنشورات التلقائية المجدولة والمنشورة' : 'Scheduled & Published Campaigns Feed'}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-mono">
                  {posts.length} {isRtl ? 'إجمالي الحملات' : 'total items'}
                </span>
              </div>

              <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
                {posts.length === 0 ? (
                  <div className="p-12 text-center text-slate-550 text-xs">
                    {isRtl ? 'لا يوجد منشورات مجدولة حالياً. جاري توليد محتوى جديد...' : 'No posts in queue. Generating new marketing campaigns...'}
                  </div>
                ) : posts.map((post) => {
                  const isScheduled = post.status === 'scheduled';
                  return (
                    <div key={post.id} className="p-5 hover:bg-slate-800/30 transition-colors space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-850 flex items-center justify-center">
                            {getPlatformIcon(post.platform)}
                          </span>
                          <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400 font-bold block">{isRtl ? 'موضوع الترويج' : 'Campaign Angle'}</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{post.topic}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isScheduled ? (
                            <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {isRtl ? 'مجدول للنشر' : 'Scheduled'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              {isRtl ? 'تم النشر تلقائياً' : 'Published'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-2">
                        <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {post.content}
                        </p>
                        {post.imageUrl && (
                          <div className="relative rounded-xl overflow-hidden max-h-[140px] border border-slate-800/60 mt-2">
                            <img src={post.imageUrl} alt="AI illustration" width={400} height={140} loading="lazy" decoding="async" className="w-full h-full object-cover filter brightness-90" />

                          </div>
                        )}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {post.hashtags.map((h, i) => (
                            <span key={i} className="text-[10px] text-cyan-400/80 font-mono">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Scheduling detail / Engagement counters */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-1 pt-1">
                        {isScheduled ? (
                          <span>
                            {isRtl ? 'توقيت النشر المستهدف:' : 'Target post time:'}{' '}
                            <span className="font-mono text-cyan-400 font-bold">
                              {new Date(post.scheduledTime).toLocaleString()}
                            </span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-4 font-mono font-bold">
                            <span className="text-slate-500 dark:text-slate-400 dark:text-slate-400">{isRtl ? 'تفاعلات:' : 'Stats:'}</span>
                            <span className="text-cyan-400">{post.engagement.likes} Likes</span>
                            <span className="text-indigo-400">{post.engagement.shares} Reposts</span>
                            <span className="text-pink-400">{post.engagement.clicks} Funnel Clicks</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Auto-Engagement Inquiries & Human-in-the-Loop Approval Panel */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span>{isRtl ? 'الرد التلقائي والمراجعة البشرية' : 'Smart Auto-Engagement (DMs/Comments)'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-mono">
                        AI Intent Engine
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isRtl ? 'تصنيف النوايا تلقائياً + وضع المراجعة والموافقة قبل النشر' : 'Intent Classification & Human-in-the-Loop Review Dashboard'}
                    </p>
                  </div>
                </div>

                {/* Review Mode Toggle Switch */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-mono font-bold text-slate-300">
                    {isRtl ? 'وضع المراجعة:' : 'Review Mode:'}
                  </span>
                  <button
                    onClick={() => {
                      const current = isReviewModeActive();
                      toggleReviewMode(!current);
                      loadCampaigns();
                    }}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                      isReviewModeActive()
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-emerald-500 text-slate-950 shadow-md'
                    }`}
                  >
                    {isReviewModeActive()
                      ? (isRtl ? 'مطلوب الموافقة 🔒' : 'Review & Approve 🔒')
                      : (isRtl ? 'نشر أوتوماتيكي ⚡' : 'Auto-Publish ⚡')}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-800/60 space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {engagements.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 text-xs">
                    {isRtl ? 'في انتظار تفاعل العملاء...' : 'Waiting for inbound client questions...'}
                  </div>
                ) : engagements.map((eng) => {
                  const isBooking = eng.intent === 'BOOKING_CONSULTATION' || eng.commentText.toLowerCase().includes('schedule') || eng.commentText.includes('حجز') || eng.commentText.includes('استشارة');
                  
                  return (
                    <div key={eng.id} className="space-y-3 pt-4 first:pt-0 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0">
                      
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-cyan-400 font-mono">{eng.author}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 text-[9px] font-mono">
                            {eng.platform}
                          </span>
                        </div>

                        {/* Intent Classification Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                          isBooking
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {isBooking
                            ? (isRtl ? '📅 نية حجز موعد/استشارة' : '📅 Intent: BOOKING_CONSULTATION')
                            : (isRtl ? '⚖️ استفسار تشريعي' : '⚖️ Intent: LEGAL_INQUIRY')}
                        </span>
                      </div>

                      {/* Inbound Customer Comment */}
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold">{isRtl ? 'سؤال العميل:' : 'Inbound inquiry:'}</p>
                        <p className="text-xs text-white font-semibold">{eng.commentText}</p>
                      </div>

                      {/* AI Response Draft / Approved Reply */}
                      <div className={`p-3 rounded-2xl border space-y-1.5 ${
                        eng.reviewStatus === 'pending_approval'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-emerald-500/5 border-emerald-500/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black flex items-center gap-1.5 text-emerald-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {eng.reviewStatus === 'pending_approval'
                                ? (isRtl ? 'مسودة رد الذكاء الاصطناعي (بانتظار موافقتك):' : 'AI Draft Response (Awaiting Approval):')
                                : (isRtl ? 'الرد المعتمد والمنشور:' : 'Approved Response:')}
                            </span>
                          </p>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            eng.reviewStatus === 'pending_approval'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {eng.reviewStatus === 'pending_approval' ? 'DRAFT' : 'APPROVED'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed font-sans">{eng.replyText}</p>

                        {/* Interactive Human-in-the-Loop Approval Buttons */}
                        {eng.reviewStatus === 'pending_approval' && (
                          <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-amber-500/20">
                            <button
                              onClick={() => {
                                approveEngagementResponse(eng.id);
                                loadCampaigns();
                              }}
                              className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center gap-1 transition-all shadow-md"
                            >
                              <Check className="w-3 h-3" />
                              <span>{isRtl ? 'اعتماد ونشر فوراً' : 'Approve & Publish'}</span>
                            </button>

                            <button
                              onClick={() => {
                                const custom = prompt(isRtl ? 'تعديل رد الذكاء الاصطناعي:' : 'Edit AI Response:', eng.replyText);
                                if (custom && custom.trim()) {
                                  editEngagementResponse(eng.id, custom.trim());
                                  loadCampaigns();
                                }
                              }}
                              className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] transition-all"
                            >
                              {isRtl ? 'تعديل المسودة ✏️' : 'Edit Draft ✏️'}
                            </button>

                            <button
                              onClick={() => {
                                rejectEngagementResponse(eng.id);
                                loadCampaigns();
                              }}
                              className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-[10px] transition-all"
                            >
                              {isRtl ? 'رفض' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>

                      <span className="text-[9px] text-slate-500 block font-mono text-right">
                        {new Date(eng.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
