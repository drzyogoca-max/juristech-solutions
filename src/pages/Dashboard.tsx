import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, AlertTriangle, Zap, ArrowRight, Globe, Users, Shield, ShieldCheck,
  Sparkles, Building2, Cpu, CheckCircle2, ShieldAlert,
  Crown, CreditCard, Lock, Scale, Key, Layers, Award
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { useAdaptiveUI } from '../hooks/useAdaptiveUI';
import { callAI } from '../lib/api';
import { useContract } from '../context/ContractContext';
import ContractAnalysisSkeleton from '../components/ContractAnalysisSkeleton';
import HeartbeatBackground from '../components/HeartbeatBackground';
import SEO from '../components/SEO';
import { useAuth } from '../lib/authContext';
import { getVisitorAnalyticsSummary } from '../lib/visitorTracker';
import { crmService } from '../services/crmService';
import { getReviewQueueItems } from '../lib/reviewQueueService';
import { getActiveGlobalTranslations } from '../lib/globalTranslations';
import { usePlatformLocale } from '../lib/universalTranslator';

import WorkflowDashboard from '../components/WorkflowDashboard';
import ErrorBoundary from '../components/ErrorBoundary';

// â”€â”€ Lazy Loaded Heavy Above-The-Fold But Non-Critical Components â”€â”€
const DashboardChatbotMagnet = lazy(() => import('../components/DashboardChatbotMagnet'));
const USCompetitorMatchBanner = lazy(() => import('../components/USCompetitorMatchBanner'));
const ExecutiveCommandBar = lazy(() => import('../components/ExecutiveCommandBar'));
const SovereignServicesCatalog = lazy(() => import('../components/SovereignServicesCatalog'));
const InstitutionalTrustBadgeBar = lazy(() => import('../components/InstitutionalTrustBadgeBar'));
const QuickAuditWidget = lazy(() => import('../components/QuickAuditWidget'));


// â”€â”€ Lazy Loaded Heavy Below-The-Fold Sections â”€â”€
const InteractiveCustomerJourneyMap = lazy(() => import('../components/InteractiveCustomerJourneyMap'));
const InteractiveSassGlobalMap = lazy(() => import('../components/InteractiveSassGlobalMap'));
const CaseStudiesSection = lazy(() => import('../components/CaseStudiesSection'));
const TwoFactorSecurityModal = lazy(() => import('../components/TwoFactorSecurityModal'));


interface ActivityItem {
  id: string;
  type: 'contract' | 'risk';
  title: string;
  details: string;
  date: string;
}

interface RiskItem {
  clause: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  vector: 'Financial' | 'Operational' | 'IP' | 'Regulatory';
  explanationAr: string;
  explanationEn: string;
  suggestedRedlineAr: string;
  suggestedRedlineEn: string;
}

interface QuickAuditResult {
  riskScore: number;
  overallAssessmentAr: string;
  overallAssessmentEn: string;
  items: RiskItem[];
}

let dashboardMetricsCache: {
  stats: {
    contracts: number;
    riskReports: number;
    aiRequests: number;
    activeUsers: number;
    totalVisits: number;
    disbursements: number;
    payingCustomers?: number;
  };
  activities: ActivityItem[];
  timestamp: number;
} | null = null;

export default function Dashboard() {
  const { l, isRtl, gt, t, i18n, formatNum, formatCurr } = usePlatformLocale();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { jurisdiction, adaptiveConfig } = useAdaptiveUI();
  const { contractState, clearContractData, setContractData, updateAuditResults } = useContract();

  // Selected Jurisdiction State
  const [selectedRegion, setSelectedRegion] = useState<'GCC' | 'EU' | 'US' | 'NAFRICA' | 'GLOBAL'>('GCC');

  // Interactive Workspace Upload & Audit State
  const [fileName, setFileName] = useState('');
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<QuickAuditResult | null>(null);
  const [activeVectorFilter, setActiveVectorFilter] = useState<'All' | 'Financial' | 'Operational' | 'IP' | 'Regulatory'>('All');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Metrics State
  const [loadingMetrics, setLoadingMetrics] = useState(!dashboardMetricsCache);
  const [stats, setStats] = useState(
    dashboardMetricsCache?.stats || {
      contracts: 0,
      riskReports: 0,
      aiRequests: 0,
      activeUsers: 0,
      totalVisits: 0,
      disbursements: 0,
    }
  );

  const [activities, setActivities] = useState<ActivityItem[]>(dashboardMetricsCache?.activities || []);

  // Deferred non-critical widgets â€” mount after FCP to keep TBT low
  const [showDeferredWidgets, setShowDeferredWidgets] = useState(false);

  useEffect(() => {
    let liveTickTimer: ReturnType<typeof setInterval> | null = null;

    async function loadDashboardData() {
      if (dashboardMetricsCache && Date.now() - dashboardMetricsCache.timestamp < 30000) {
        setStats(dashboardMetricsCache.stats);
        setActivities(dashboardMetricsCache.activities);
        setLoadingMetrics(false);
        return;
      }

      try {
        const [
          { count: contractsCount },
          { count: riskCount },
          { count: chatCount },
          { count: paymentsCount },
        ] = await Promise.all([
          supabase.from('contracts').select('*', { count: 'exact', head: true }),
          supabase.from('risk_assessments').select('*', { count: 'exact', head: true }),
          supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
          supabase.from('payments').select('*', { count: 'exact', head: true }),
        ]);

        const { data: verifiedPayments } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'Ù…ÙƒØªÙ…Ù„');

        const visitorSummary = getVisitorAnalyticsSummary();
        const crmLeads = crmService.getLeads();
        const archivedLeads = crmService.getArchivedLeads();
        const reviewQueue = getReviewQueueItems();

        const verifiedReceiptsCount = reviewQueue.filter(q => q.status === 'approved').length;
        const totalSubscribersCount = crmLeads.length + archivedLeads.length;
        const totalPayingCustomersCount = (verifiedPayments || []).length + verifiedReceiptsCount;
        const totalVisitsCount = visitorSummary.totalPageViewsCount || 0;
        const totalPaidAmount = (verifiedPayments || []).reduce((acc, p) => acc + (p.amount || 0), 0);

        const newStats = {
          contracts: contractsCount || 0,
          riskReports: riskCount || 0,
          aiRequests: chatCount || 0,
          activeUsers: totalSubscribersCount,
          totalVisits: totalVisitsCount,
          disbursements: totalPaidAmount,
          payingCustomers: totalPayingCustomersCount,
        };

        const { data: recentContracts } = await supabase
          .from('contracts')
          .select('id, contract_type, party_a, party_b, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        const { data: recentRisk } = await supabase
          .from('risk_assessments')
          .select('id, file_name, risk_score, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        const mergedActivities: ActivityItem[] = [];

        if (recentContracts) {
          recentContracts.forEach((c) => {
            mergedActivities.push({
              id: c.id,
              type: 'contract',
              title: isRtl ? `ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø¹Ù‚Ø¯ ${c.contract_type}` : `Generated ${c.contract_type}`,
              details: isRtl ? `Ø¨ÙŠÙ† ${c.party_a} Ùˆ ${c.party_b}` : `Between ${c.party_a} and ${c.party_b}`,
              date: c.created_at,
            });
          });
        }

        if (recentRisk) {
          recentRisk.forEach((r) => {
            mergedActivities.push({
              id: r.id,
              type: 'risk',
              title: isRtl ? `ØªÙ… ØªØ­Ù„ÙŠÙ„ Ù…Ø®Ø§Ø·Ø± Ù…Ø³ØªÙ†Ø¯` : `Analyzed contract risk`,
              details: `${r.file_name || 'Ù†Øµ ÙŠØ¯ÙˆÙŠ'} - ${isRtl ? 'Ø¯Ø±Ø¬Ø© Ø§Ù„Ù…Ø®Ø§Ø·Ø±' : 'Risk Score'}: ${r.risk_score}%`,
              date: r.created_at,
            });
          });
        }

        mergedActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const finalActivities = mergedActivities.slice(0, 5);

        setStats(newStats);
        setActivities(finalActivities);

        dashboardMetricsCache = {
          stats: newStats,
          activities: finalActivities,
          timestamp: Date.now(),
        };
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
      } finally {
        setLoadingMetrics(false);
      }
    }

    // Defer all data loading + non-critical widget mounting to after first paint
    const scheduleWork = () => {
      setShowDeferredWidgets(true);
      loadDashboardData();
      // Live Telemetry Tick â€” starts after data load, pauses on hidden tab
      liveTickTimer = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return;
        const summary = getVisitorAnalyticsSummary();
        const leadsCount = crmService.getLeads().length + crmService.getArchivedLeads().length;
        setStats(prev => ({
          ...prev,
          totalVisits: summary.totalPageViewsCount || prev.totalVisits,
          activeUsers: leadsCount,
        }));
      }, 10000);
    };

    let idleHandle: number | null = null;
    if ('requestIdleCallback' in window) {
      idleHandle = (window as any).requestIdleCallback(scheduleWork, { timeout: 2000 });
    } else {
      idleHandle = setTimeout(scheduleWork, 500) as unknown as number;
    }

    return () => {
      if ('requestIdleCallback' in window && idleHandle !== null) {
        (window as any).cancelIdleCallback(idleHandle);
      } else if (idleHandle !== null) {
        clearTimeout(idleHandle as unknown as ReturnType<typeof setTimeout>);
      }
      if (liveTickTimer !== null) clearInterval(liveTickTimer);
    };
  }, [isRtl]);

  async function executeInlineAudit(textToAudit: string, sourceFileName?: string) {
    if (!textToAudit.trim()) {
      alert(isRtl ? 'ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø£Ùˆ Ø±ÙØ¹ Ø¨Ù†ÙˆØ¯ Ø§Ù„Ø¹Ù‚Ø¯ Ø£ÙˆÙ„Ø§Ù‹.' : 'Please paste or upload contract text first.');
      return;
    }

    setAuditing(true);
    setErrorMsg('');

    const regionPromptMap = {
      GCC: 'Under Saudi Companies Law & UAE Federal Commercial Statutes',
      EU: 'Under EU Law & GDPR Regulations',
      US: 'Under US Delaware & Federal Commercial Code',
      NAFRICA: 'Under North African Statutory Civil Code',
      GLOBAL: 'Under UNCITRAL International Commercial Standards',
    };

    const prompt = `Deeply audit this legal contract for risk vectors (Financial, Operational, IP, Regulatory) ${regionPromptMap[selectedRegion]}.\nReturn ONLY a JSON object with keys: riskScore (0-100), overallAssessmentAr, overallAssessmentEn, items (array of objects with clause, severity ['Critical'|'High'|'Medium'|'Low'], vector ['Financial'|'Operational'|'IP'|'Regulatory'], explanationAr, explanationEn, suggestedRedlineAr, suggestedRedlineEn).\n\nContract Content:\n${textToAudit}`;

    try {
      const raw = await callAI(prompt);
      let parsed: QuickAuditResult;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      } catch {
        throw new Error('AI_RESPONSE_INVALID_JSON');
      }

      setAuditResult(parsed);

      updateAuditResults({
        riskScore: parsed.riskScore,
        overallAssessmentAr: parsed.overallAssessmentAr,
        overallAssessmentEn: parsed.overallAssessmentEn,
        docLanguage: isRtl ? 'ar' : 'en',
        items: parsed.items,
      });

      supabase.from('risk_assessments').insert({
        file_name: sourceFileName || fileName || 'Quick_Audit',
        risk_score: parsed.riskScore,
        missing_clauses: parsed.items.map((i) => i.clause),
        recommendations: parsed.items.map((i) => (isRtl ? i.suggestedRedlineAr : i.suggestedRedlineEn)),
      });
    } catch (err) {
      console.error('Audit execution error:', err);
      setErrorMsg(isRtl ? 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø¥Ø¬Ø±Ø§Ø¡ Ø§Ù„ÙØ­Øµ Ø§Ù„Ø°ÙƒÙŠ.' : 'Error executing AI audit.');
    } finally {
      setAuditing(false);
    }
  }

  const statItems = [
    { label: gt.dashboard.statContracts, value: stats.contracts, color: 'text-cyan-400', icon: FileText, bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: gt.dashboard.statVisitorsToday, value: stats.totalVisits, color: 'text-blue-400', icon: Globe, bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: gt.dashboard.statSubscribers, value: stats.activeUsers, color: 'text-purple-400', icon: Users, bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: gt.dashboard.statLicensedEntities, value: stats.payingCustomers || 0, color: 'text-emerald-400', icon: CreditCard, bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: gt.dashboard.statRiskReports, value: stats.riskReports, color: 'text-amber-400', icon: AlertTriangle, bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: gt.dashboard.statAiQueries, value: stats.aiRequests, color: 'text-indigo-400', icon: Zap, bg: 'bg-indigo-500/10 border-indigo-500/20' },
  ];

  const filteredItems = auditResult
    ? auditResult.items.filter((item) => activeVectorFilter === 'All' || item.vector === activeVectorFilter)
    : [];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-100 font-sans w-full max-w-full overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <HeartbeatBackground />
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10 w-full max-w-full overflow-x-hidden">

        {/* ðŸ“Š 1. TELEMETRY & LIVE PERFORMANCE METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-sans">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-3.5 rounded-2xl backdrop-blur-xl border ${item.bg} shadow-lg space-y-1.5 transition-all hover:scale-[1.02]`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 block truncate">{item.label}</span>
                  <div className={`p-1.5 rounded-lg bg-slate-900/60 ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-lg sm:text-xl font-black ${item.color}`}>
                    {formatNum(item.value)}
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ðŸŽ›ï¸ 3. INSTANT SECTION NAVIGATOR (SMOOTH SCROLL TO ALL 5 CORE SECTIONS) */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xl sticky top-4 z-40">
          {[
            { targetId: 'sec-map', labelAr: 'ðŸ—ºï¸ Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ø§Ù„ØªÙØ§Ø¹Ù„ÙŠØ© ÙˆØ§Ù„Ø£Ù†Ø¸Ù…Ø©', labelEn: 'ðŸ—ºï¸ Global SaaS Map' },
            { targetId: 'sec-studio', labelAr: 'âš¡ Ø§Ø³ØªÙˆØ¯ÙŠÙˆ Ø§Ù„Ø¹Ù‚ÙˆØ¯ ÙˆØ§Ù„ØªØ¯Ù‚ÙŠÙ‚', labelEn: 'âš¡ Contract Studio' },
            { targetId: 'sec-services', labelAr: 'ðŸ›ï¸ Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ© (18)', labelEn: 'ðŸ›ï¸ 18 Services Directory' },
            { targetId: 'sec-cases', labelAr: 'ðŸ’¼ Ø¯Ø±Ø§Ø³Ø§Øª Ø§Ù„Ø­Ø§Ù„Ø© ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø±', labelEn: 'ðŸ’¼ Case Studies & Pricing' },
            { targetId: 'sec-security', labelAr: 'ðŸ” Ø§Ù„Ø£Ù…Ø§Ù† ÙˆØ§Ù„Ø§Ù…ØªØ«Ø§Ù„ ÙˆØ§Ù„ØªØ­Ù‚Ù‚', labelEn: 'ðŸ” Security & Governance' },
          ].map((nav, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSection(nav.targetId)}
              className="flex-1 min-w-[170px] sm:min-w-[190px] py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-950/60 border border-slate-800/80 cursor-pointer shadow-sm active:scale-95"
            >
              <span>{l(nav.labelAr, nav.labelEn)}</span>
            </button>
          ))}
        </div>

        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* SECTION 1: ðŸ—ºï¸ GLOBAL INTERACTIVE SAAS MAP & CUSTOMER JOURNEY         */}
        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="sec-map" className="space-y-6 pt-2 min-h-[580px] overflow-hidden" style={{ contain: 'layout style' }}>
          {/* World-Class SaaS Interactive Map â€” wrapped in ErrorBoundary & Suspense to prevent page crash */}
          <Suspense fallback={<div className="min-h-[580px] w-full rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800 flex items-center justify-center text-slate-500 text-xs font-mono">Loading Global SaaS Map...</div>}>
            <ErrorBoundary>
              <InteractiveSassGlobalMap />
            </ErrorBoundary>

            {/* 5-Stage Customer Journey Roadmap */}
            <ErrorBoundary>
              <InteractiveCustomerJourneyMap />
            </ErrorBoundary>
          </Suspense>
        </section>


        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* SECTION 2: âš¡ AI CONTRACT STUDIO & INSTANT RISK RADAR WORKSPACE       */}
        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="sec-studio" className="space-y-6 pt-2">

          {/* Top AI Chatbot Magnet â€” deferred after first paint */}
          {showDeferredWidgets && (
            <Suspense fallback={null}>
              <DashboardChatbotMagnet
                onContractUploaded={(text, filename) => executeInlineAudit(text, filename)}
              />
            </Suspense>
          )}

          {/* Session Workspace & Recent Audits Card */}
          <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {l('Ù…Ø³ØªÙ†Ø¯Ø§ØªÙŠ ÙˆØ¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ØªØ¯Ù‚ÙŠÙ‚ ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ø¬Ù„Ø³Ø©', 'My Session Documents & Recent Audits')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {l('Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø³ØªÙ†Ø¯Ø§Øª Ø§Ù„Ù…ÙØ­ÙˆØµØ© Ù…Ø¤Ø®Ø±Ø§Ù‹ ÙˆÙ…ØªØ§Ø¨Ø¹Ø© ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…Ø®Ø§Ø·Ø±', 'Manage analyzed contracts and active risk reports')}
                  </p>
                </div>
              </div>
              {contractState?.fileName && (
                <button
                  onClick={() => clearContractData()}
                  aria-label={l('ØªÙØ±ÙŠØº Ø§Ù„Ø¬Ù„Ø³Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©', 'Clear current session')}
                  className="text-xs font-bold text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer"
                >
                  {l('ØªÙØ±ÙŠØº Ø§Ù„Ø¬Ù„Ø³Ø©', 'Clear Session')}
                </button>
              )}
            </div>

            {contractState?.fileName ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{contractState.fileName}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{l('ØªÙ… Ø§Ù„Ø±ÙØ¹:', 'Uploaded:')} {contractState.uploadedAt ? new Date(contractState.uploadedAt).toLocaleTimeString() : l('Ø§Ù„Ø¢Ù†', 'Just now')}</span>
                      {contractState.auditResults && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                          {l(`Ù…Ø¤Ø´Ø± Ø§Ù„Ù…Ø®Ø§Ø·Ø±: ${contractState.auditResults.riskScore}%`, `Risk: ${contractState.auditResults.riskScore}%`)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/risk')}
                    aria-label={l('Ø¹Ø±Ø¶ Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„ØªÙØµÙŠÙ„ÙŠ', 'View Full Report')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    {l('Ø¹Ø±Ø¶ Ø§Ù„ØªÙ‚Ø±ÙŠØ±', 'View Report')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 px-4 text-center space-y-2 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800">
                <p className="text-xs text-slate-400">
                  {l(
                    'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø³ØªÙ†Ø¯Ø§Øª Ù…ÙØ­ÙˆØµØ© ÙÙŠ Ø§Ù„Ø¬Ù„Ø³Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©. Ø§Ø±ÙØ¹ Ø¹Ù‚Ø¯Ùƒ Ø¹Ø¨Ø± Ø§Ù„Ø£Ø¯Ø§Ø© Ø£Ø¯Ù†Ø§Ù‡ Ù„Ù„Ø¨Ø¯Ø¡ Ø§Ù„ÙÙˆØ±ÙŠ.',
                    'No documents audited in current session yet. Upload contract below to get started.'
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Instant Contract Upload & Risk Analysis Workspace */}
          <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            
            {/* Target Jurisdiction Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>{l('Ù…Ø³Ø§Ø± Ø±ÙØ¹ Ø§Ù„Ø¹Ù‚ÙˆØ¯ ÙˆØ§Ù„ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ø§Ù„ÙÙˆØ±ÙŠ', 'Contract Upload & Instant Legal Risk Analysis')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {l('Ø­Ø¯Ø¯ Ø§Ù„Ù†Ø¸Ø§Ù… Ø§Ù„ØªØ´Ø±ÙŠØ¹ÙŠ Ø§Ù„Ù…Ø³ØªÙ‡Ø¯Ù Ù„Ø¥Ø¬Ø±Ø§Ø¡ Ø§Ù„ÙØ­Øµ ÙˆØµÙŠØ§ØºØ© Ø§Ù„Ø¨Ù†ÙˆØ¯ ÙÙˆØ±ÙŠØ§Ù‹:', 'Select governing jurisdiction for localized legal auditing:')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full sm:w-auto">
                {[
                  { id: 'GCC', nameAr: 'Ø§Ù„Ø®Ù„ÙŠØ¬ Ø§Ù„Ø¹Ø±Ø¨ÙŠ (GCC)', nameEn: 'GCC Rules' },
                  { id: 'EU', nameAr: 'Ø£ÙˆØ±ÙˆØ¨Ø§ (EU GDPR)', nameEn: 'EU GDPR' },
                  { id: 'US', nameAr: 'Ø£Ù…Ø±ÙŠÙƒØ§ (US VC)', nameEn: 'US Common' },
                  { id: 'NAFRICA', nameAr: 'Ø´Ù…Ø§Ù„ Ø£ÙØ±ÙŠÙ‚ÙŠØ§', nameEn: 'N. Africa' },
                  { id: 'GLOBAL', nameAr: 'Ø¯ÙˆÙ„ÙŠØ§Ù‹ (UNCITRAL)', nameEn: 'Global' },
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id as any)}
                    aria-label={l(reg.nameAr, reg.nameEn)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                      selectedRegion === reg.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold scale-105'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {l(reg.nameAr, reg.nameEn)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Audit Drag & Drop Uploader â€” deferred after first paint */}
            {showDeferredWidgets ? (
              <Suspense fallback={null}>
                <QuickAuditWidget />
              </Suspense>
            ) : (
              <div className="h-32 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            )}

            {/* Workflow Steps Guide */}
            <WorkflowDashboard />
          </div>

          {/* Dynamic Skeleton Loader during Inline Audit */}
          {auditing && (
            <ContractAnalysisSkeleton
              stage={l('Ø¬Ø§Ø±ÙŠ ØªØ­Ù„ÙŠÙ„ Ø¨Ù†ÙˆØ¯ Ø§Ù„Ø¹Ù‚Ø¯ ÙˆØ§Ø³ØªØ®Ø±Ø§Ø¬ ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…Ø®Ø§Ø·Ø± ÙˆØ§Ù„Ø¨Ù†ÙˆØ¯ Ø§Ù„Ø¨Ø¯ÙŠÙ„Ø©...', 'Executing sub-second AI contract risk evaluation...')}
            />
          )}

          {/* Inline Audit Results Dashboard Panel */}
          {!auditing && auditResult && (
            <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl font-sans">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${auditResult.riskScore > 60 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{l('Ø¯Ø±Ø¬Ø© Ù…Ø®Ø§Ø·Ø± Ø§Ù„Ø¹Ù‚Ø¯', 'Contract Risk Index')}</span>
                    <div className="text-4xl font-black text-white">{auditResult.riskScore}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/risk')}
                    aria-label={l('ÙØªØ­ Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø´Ø§Ù…Ù„ ÙˆØ§Ù„ØªØµØ¯ÙŠØ±', 'Open Full Audit & Export Report')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>{l('ÙØªØ­ Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø´Ø§Ù…Ù„ ÙˆØ§Ù„ØªØµØ¯ÙŠØ±', 'Open Full Audit & Export Report')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Explainable AI Trust Layer */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{l('Ø´ÙØ§ÙÙŠØ© Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙˆÙ…Ø¤Ø´Ø±Ø§Øª Ø§Ù„Ø«Ù‚Ø© Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ©', 'Explainable AI & Statutory Trust Layer')}</span>
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/40 font-sans text-[11px] font-bold">
                    {l('ØªØ£ØµÙŠÙ„ ØªØ´Ø±ÙŠØ¹ÙŠ Ù…Ø¹ØªÙ…Ø¯', 'Verified Statutory Code')}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-1">
                  <div>
                    <span className="font-bold text-white block mb-0.5">{l('ðŸ“Œ Ø§Ù„Ø³Ù†Ø¯ Ø§Ù„ØªØ´Ø±ÙŠØ¹ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯:', 'ðŸ“Œ Source Statutory Reference:')}</span>
                    <span className="text-[11px] font-sans text-slate-300">
                      {l('Ø§Ù„Ù…ÙˆØ§Ø¯ (223 Ùˆ224 Ù…Ø¯Ù†ÙŠ) ÙˆØ§Ù„Ø£Ù†Ø¸Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© Ø§Ù„Ù†Ø§ÙØ°Ø© Ù„Ø¯ÙˆÙ„ Ù…Ø¬Ù„Ø³ Ø§Ù„ØªØ¹Ø§ÙˆÙ† ÙˆØ´Ù…Ø§Ù„ Ø£ÙØ±ÙŠÙ‚ÙŠØ§.', 'Civil Code Articles & Applicable Commercial Codes for MENA & Regional Statutory Law.')}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">{l('ðŸ’¡ Ø§Ù„Ø§ÙØªØ±Ø§Ø¶Ø§Øª Ø§Ù„Ø­Ø§ÙƒÙ…Ø© Ù„Ù„ØªØ­Ù„ÙŠÙ„:', 'ðŸ’¡ Underlying Legal Assumptions:')}</span>
                    <span className="text-[11px] font-sans text-slate-300">
                      {l('Ø§ÙØªØ±Ø§Ø¶ Ø§Ù„Ù†ÙˆØ§ÙŠØ§ Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© Ø§Ù„Ø­Ø³Ù†Ø© ÙˆØ­Ù…Ø§ÙŠØ© Ø£Ø·Ø±Ø§Ù Ø§Ù„Ø§ØªÙØ§Ù‚ Ø¶Ø¯ Ø§Ù„Ø¨Ù†ÙˆØ¯ Ø§Ù„ØªØ¹Ø³ÙÙŠØ© ØºÙŠØ± Ø§Ù„Ù…ØªÙƒØ§ÙØ¦Ø©.', 'Assumes arm-length commercial transaction requiring bilateral liability protection.')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vector Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">
                  {l('ØªØµÙÙŠØ© Ø§Ù„Ù…Ø­Ø§ÙˆØ±:', 'Filter Vectors:')}
                </span>
                {['All', 'Financial', 'Operational', 'IP', 'Regulatory'].map((vectorKey) => (
                  <button
                    key={vectorKey}
                    onClick={() => setActiveVectorFilter(vectorKey as any)}
                    aria-label={`Filter ${vectorKey}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      activeVectorFilter === vectorKey
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {vectorKey === 'All' ? l('Ø§Ù„ÙƒÙ„', 'All') : vectorKey}
                  </button>
                ))}
              </div>

              {/* Severity Items Grid */}
              <div className="space-y-4">
                {filteredItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-bold text-sm text-slate-100">{item.clause}</h4>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {l(item.explanationAr, item.explanationEn)}
                    </p>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-sans">
                      <span className="font-bold text-emerald-400 block mb-0.5">{l('Ø§Ù„Ø¨Ù†Ø¯ Ø§Ù„Ø¨Ø¯ÙŠÙ„ (AI Redline):', 'Suggested AI Redline:')}</span>
                      {l(item.suggestedRedlineAr, item.suggestedRedlineEn)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* SECTION 3: ðŸ›ï¸ 18 SOVEREIGN LEGAL SERVICES DIRECTORY                  */}
        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="sec-services" className="space-y-6 pt-2">
          {/* Complete 18 Services Catalog â€” deferred after first paint */}
          {showDeferredWidgets ? (
            <Suspense fallback={<div className="h-64 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />}>
              <SovereignServicesCatalog />
            </Suspense>
          ) : (
            <div className="h-64 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          )}

          {/* US Competitor Match Banner â€” deferred after first paint */}
          {showDeferredWidgets && (
            <Suspense fallback={null}>
              <USCompetitorMatchBanner />
            </Suspense>
          )}
        </section>

        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* SECTION 4: ðŸ’¼ REAL CASE STUDIES & SUBSCRIPTION TIERS (30% DISCOUNT)  */}
        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="sec-cases" className="space-y-6 pt-2" style={{ contain: 'layout style' }}>
          {/* Real-World Multimillion Dollar Dispute Case Studies */}
          <Suspense fallback={<div className="min-h-[300px] w-full rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800" />}>
            <CaseStudiesSection />
          </Suspense>

          {/* Subscriptions & Pricing Packages Gateway */}
          <div className="card-lawtech-lux p-6 sm:p-10 rounded-3xl border border-sky-500/30 shadow-2xl space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{l('Ø­Ø²Ù… Ø§Ù„Ø§Ø´ØªØ±Ø§ÙƒØ§Øª Ø§Ù„Ù…Ø®ØµÙˆÙ…Ø© Ø¨Ù†Ø³Ø¨Ø© 30%', '30% Discounted Subscription Packages')}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {l('Ø§Ø®ØªØ± Ø§Ù„Ø¨Ø§Ù‚Ø© Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù…Ø¤Ø³Ø³ØªÙƒ ÙˆØ§Ø¨Ø¯Ø£ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø© Ø§Ù„ÙÙˆØ±ÙŠØ©', 'Select Your Tier & Unlock Institutional Intelligence')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {l('Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¨Ø§Ù‚Ø§Øª Ù…ØµÙ…Ù…Ø© Ù„ØªÙˆÙÙŠØ± Ø£Ù‚ØµÙ‰ Ù‚Ø¯Ø± Ù…Ù† Ø§Ù„ÙƒÙØ§Ø¡Ø© Ù…Ø¹ ÙØªØ­ Ø¢Ù„ÙŠ Ø¢Ù…Ù† Ø¹Ø¨Ø± Ø¨ÙˆØ§Ø¨Ø© Binance Pay Ø£Ùˆ Ø§Ù„Ø­ÙˆØ§Ù„Ø§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø© Ø£Ùˆ Ø¥Ù†Ø³ØªØ§ Ø¨Ø§ÙŠ.', 'All tiers feature zero-touch automated Binance Pay deployment, SWIFT & InstaPay processing.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Startup Tier ($49) */}
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-sky-500/30 flex flex-col justify-between space-y-6 relative hover:border-sky-400 transition-all">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30 inline-block">
                    {l('Ø¨Ø§Ù‚Ø© Ø§Ù„Ø´Ø±ÙƒØ§Øª Ø§Ù„ØµØºØ±Ù‰', 'Startup Tier')}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{l('Ø­Ø²Ù…Ø© Ø§Ù„Ø´Ø±ÙƒØ§Øª Ø§Ù„Ù†Ø§Ø´Ø¦Ø©', 'Micro / Startup')}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-sky-400">$49</span>
                      <span className="text-xs text-slate-400">{l('/ Ø´Ù‡Ø±ÙŠØ§Ù‹', '/ month')}</span>
                      <span className="text-xs text-slate-500 line-through mr-2">$70</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{l('Ù…Ø³ØªØ´Ø§Ø± Google Gemini Pro Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (7 Ù„ØºØ§Øª)', 'Google Gemini Pro Sovereign Advisor')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{l('Ø±ÙØ¹ ÙˆØªØ¯Ù‚ÙŠÙ‚ Ø­ØªÙ‰ 10 Ø¹Ù‚ÙˆØ¯ Ø´Ù‡Ø±ÙŠØ§Ù‹ (PDF, Word)', 'Up to 10 contract checks (PDF, Word)')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{l('ØªØµØ¯ÙŠØ± ÙˆØ«Ø§Ø¦Ù‚ Ù…Ø¹ØªÙ…Ø¯Ø© Ø¨ØµÙŠØº Word (.docx) Ùˆ PDF', 'Certified Word (.docx) & PDF Export')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{l('ØªØºØ·ÙŠØ© ØªØ´Ø±ÙŠØ¹ÙŠØ© Ø¥Ù‚Ù„ÙŠÙ…ÙŠØ© (Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©ØŒ Ø§Ù„Ø¥Ù…Ø§Ø±Ø§ØªØŒ Ù…ØµØ±ØŒ Ø§Ù„Ø£Ø±Ø¯Ù†)', 'Regional Coverage (KSA, UAE, EG, JO)')}</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/payment"
                  className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs text-center transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  {l('Ø§Ø´ØªØ±Ø§Ùƒ Ø¨Ø§Ù‚Ø© Ø§Ù„ØµØºØ±Ù‰ ($49)', 'Subscribe Startup ($49)')}
                </Link>
              </div>

              {/* SME Tier ($139) */}
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-indigo-500/50 flex flex-col justify-between space-y-6 relative hover:border-indigo-400 transition-all shadow-xl ring-2 ring-indigo-500/30">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow">
                  {l('Ø§Ù„Ø£ÙƒØ«Ø± Ø·Ù„Ø¨Ø§Ù‹', 'Most Popular')}
                </div>
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 inline-block">
                    {l('Ø¨Ø§Ù‚Ø© Ø§Ù„Ø´Ø±ÙƒØ§Øª Ø§Ù„Ù…ØªÙˆØ³Ø·Ø© ÙˆØ§Ù„Ù†Ù…Ùˆ', 'SME & Growth Tier')}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{l('Ø­Ø²Ù…Ø© Ø§Ù„Ø´Ø±ÙƒØ§Øª Ø§Ù„Ù…ØªÙˆØ³Ø·Ø©', 'SMEs Package')}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-indigo-400">$139</span>
                      <span className="text-xs text-slate-400">{l('/ Ø´Ù‡Ø±ÙŠØ§Ù‹', '/ month')}</span>
                      <span className="text-xs text-slate-500 line-through mr-2">$200</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{l('Ù…Ø­Ø±Ùƒ Google AI Pro Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠ (Gemini Ultra)', 'Google AI Pro Sovereign Core (Gemini Ultra)')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{l('ÙˆÙƒÙ„Ø§Ø¡ Ø§Ù„ØªÙØ§ÙˆØ¶ Ø§Ù„Ø¢Ù„ÙŠ + Ø§Ù„Ù…Ø­Ø§ÙƒØ§Ø© Ø§Ù„Ù‚Ø¶Ø§Ø¦ÙŠØ© Ù„Ù„Ù†Ø²Ø§Ø¹Ø§Øª', 'Autonomous AI Negotiation & Court Simulation')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{l('Ø±ÙØ¹ ÙˆØªØ¯Ù‚ÙŠÙ‚ Ø­ØªÙ‰ 50 Ø¹Ù‚Ø¯Ø§Ù‹ Ø´Ù‡Ø±ÙŠØ§Ù‹ Ù…Ø¹ ØªØµØ¯ÙŠØ± Word Ùˆ PDF', 'Up to 50 contracts/month with Word/PDF export')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{l('ØªØºØ·ÙŠØ© ØªØ´Ø±ÙŠØ¹ÙŠØ© Ù„Ù€ 9 Ø¯ÙˆÙ„ (Ø§Ù„Ø®Ù„ÙŠØ¬ØŒ Ø¨Ø±ÙŠØ·Ø§Ù†ÙŠØ§ØŒ Ø£Ù…Ø±ÙŠÙƒØ§ØŒ ÙˆØ§Ù„Ø§ØªØ­Ø§Ø¯ Ø§Ù„Ø£ÙˆØ±ÙˆØ¨ÙŠ)', 'Full 9-Jurisdiction Statutory Coverage (GCC, UK, US, EU)')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{l('ØªØ´ÙÙŠØ± Ù…ØªÙ‚Ø¯Ù… AES-256 ÙˆØ§Ù„Ù…ØµØ§Ø¯Ù‚Ø© Ø§Ù„Ø«Ù†Ø§Ø¦ÙŠØ© 2FA TOTP', 'Advanced AES-256 + 2FA TOTP Security')}</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/payment"
                  className="w-full py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs text-center transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  {l('Ø§Ø´ØªØ±Ø§Ùƒ Ø¨Ø§Ù‚Ø© Ø§Ù„Ù…ØªÙˆØ³Ø·Ø© ($139)', 'Subscribe SME ($139)')}
                </Link>
              </div>

              {/* Enterprise Tier ($349) */}
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-amber-500/50 flex flex-col justify-between space-y-6 relative hover:border-amber-400 transition-all shadow-xl">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-block">
                    {l('Ø¨Ø§Ù‚Ø© Ø§Ù„ÙƒØ¨Ø±Ù‰ ÙˆØ§Ù„Ù…Ø¤Ø³Ø³Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø¯ÙŠØ©', 'Enterprise Sovereign Tier')}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{l('Ø­Ø²Ù…Ø© Ø§Ù„Ø´Ø±ÙƒØ§Øª Ø§Ù„ÙƒØ¨Ø±Ù‰ ÙˆØ§Ù„Ù…Ø¤Ø³Ø³Ø§Øª', 'Enterprise Package')}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-amber-400">$349</span>
                      <span className="text-xs text-slate-400">{l('/ Ø´Ù‡Ø±ÙŠØ§Ù‹', '/ month')}</span>
                      <span className="text-xs text-slate-500 line-through mr-2">$500</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{l('Ø§Ù„Ø§Ø³ØªØ­ÙˆØ§Ø° Ø§Ù„Ø°ÙƒÙŠ Ø§Ù„ØªÙ†Ø¨Ø¤ÙŠ M&A ÙˆØªÙ‚ÙŠÙŠÙ… ØµÙÙ‚Ø§Øª EBITDA', 'Predictive M&A Intelligence & EBITDA Valuations')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{l('ÙƒØ´Ù Ø§Ù„ØªØ²ÙˆÙŠØ± ÙˆØ§Ù„Ø§Ø­ØªÙŠØ§Ù„ Ø¨Ø§Ù„Ù‚ÙŠØ§Ø³ Ø§Ù„Ù†ØµÙŠ Ø§Ù„Ø­ÙŠÙˆÙŠ (Forensic Fraud)', 'Stylometric Fraud & Tampering Forensics')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{l('Ø§Ù„Ø§Ù…ØªØ«Ø§Ù„ Ø§Ù„ØªØ´Ø±ÙŠØ¹ÙŠ Ø§Ù„Ø¹Ø§Ø¨Ø± Ù„Ù„Ø­Ø¯ÙˆØ¯ (GDPR, EU AI Act, PDPL)', 'Cross-Border Statutory Compliance & Sanctions')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{l('Ø¹Ù‚ÙˆØ¯ ØºÙŠØ± Ù…Ø­Ø¯ÙˆØ¯Ø© + Ø®Ø²Ù†Ø© E2EE Ù…Ø´ÙØ±Ø© + ØªÙƒØ§Ù…Ù„ ÙƒØ§Ù…Ù„ ERP', 'Unlimited contracts, E2EE Vault & Full ERP APIs')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{l('Ø¯Ø¹Ù… ØªÙ†ÙÙŠØ°ÙŠ Ù…Ø¨Ø§Ø´Ø± 24/7 Ù…Ø¹ Ø§Ù„Ù…Ø³ØªØ´Ø§Ø± Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ø¯. Ù…Ø­Ù…Ø¯ Ù…ØµØ·ÙÙ‰', '24/7 Dedicated Senior Counsel Concierge (Dr. Mohammad Mustafa)')}</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/payment"
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs text-center transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  {l('Ø§Ø´ØªØ±Ø§Ùƒ Ø¨Ø§Ù‚Ø© Ø§Ù„Ù…Ø¤Ø³Ø³Ø§Øª ($349)', 'Subscribe Enterprise ($349)')}
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {/* SECTION 5: ðŸ” SECURITY GOVERNANCE & ENCRYPTION CERTIFICATIONS       */}
        {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="sec-security" className="space-y-6 pt-2">
          <div className="card-lawtech-lux rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                    {l('Ø­ÙˆÙƒÙ…Ø© Ø§Ù„Ø£Ù…Ø§Ù† ÙˆØ§Ù„ØªØ´ÙÙŠØ± Ø§Ù„Ø¨Ù†ÙƒÙŠ', 'Bank-Grade E2EE & Statutory Governance')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {l('Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„Ø§Øª Ø­Ù…Ø§ÙŠØ© Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù‚ÙˆØ¯ ÙˆØ§Ù„Ø§Ù…ØªØ«Ø§Ù„ Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠ', 'End-to-End Encryption & Privacy Protocol')}
                </h2>
                <p className="text-xs text-slate-300">
                  {l('ØªØ´ÙÙŠØ± ÙƒØ§Ù…Ù„ Ø¹Ù„Ù‰ Ø¬Ø§Ù†Ø¨ Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙŠØ¶Ù…Ù† Ø¹Ø¯Ù… ÙˆØµÙˆÙ„ Ø£ÙŠ Ø·Ø±Ù Ø«Ø§Ù„Ø« Ø¥Ù„Ù‰ Ù†ØµÙˆØµ ÙˆÙ…Ø³ØªÙ†Ø¯Ø§Øª Ø£Ø¹Ù…Ø§Ù„Ùƒ.', 'Zero-knowledge client-side encryption ensuring total privacy and statutory confidentiality.')}
                </p>
              </div>

              <button
                onClick={() => setShowSecurityModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{l('Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…ØµØ§Ø¯Ù‚Ø© Ø§Ù„Ø«Ù†Ø§Ø¦ÙŠØ© 2FA', 'Setup 2FA TOTP')}</span>
              </button>
            </div>

            {/* Security Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Lock className="w-4 h-4" />
                  <span>{l('ØªØ´ÙÙŠØ± AES-GCM 256-bit', 'AES-256 Bit Encryption')}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {l('ØªØ´ÙÙŠØ± ÙÙˆØ±ÙŠ Ù„ÙƒØ§ÙØ© Ø§Ù„Ù…Ù„ÙØ§Øª ÙˆØ§Ù„Ø¹Ù‚ÙˆØ¯ Ù‚Ø¨Ù„ Ø±ÙØ¹Ù‡Ø§ Ù„Ù„Ø®ÙˆØ§Ø¯Ù… Ø§Ù„Ù…Ø´ÙØ±Ø©.', 'Military-grade encryption applied to every document prior to secure transit.')}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                  <Shield className="w-4 h-4" />
                  <span>{l('Ø§Ù„Ø§Ù…ØªØ«Ø§Ù„ Ù„Ù„Ø§Ø¦Ø­Ø© GDPR & PDPL', 'GDPR & PDPL Compliance')}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {l('Ù…Ø·Ø§Ø¨Ù‚Ø© ØªØ§Ù…Ø© Ù„Ù†Ø¸Ø§Ù… Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø´Ø®ØµÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠ ÙˆØ§Ù„Ø£ÙˆØ±ÙˆØ¨ÙŠ.', 'Strict adherence to Saudi PDPL and European GDPR data protection laws.')}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                  <span>{l('Ø¹Ø²Ù„ Ù†Ù…Ø§Ø°Ø¬ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ', 'Isolated AI Processing')}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {l('Ø¶Ù…Ø§Ù† Ø¹Ø¯Ù… ØªØ¯Ø±ÙŠØ¨ Ø£ÙŠ Ù†Ù…Ø§Ø°Ø¬ Ø¹Ø§Ù…Ø© Ø¹Ù„Ù‰ Ø¨ÙŠØ§Ù†Ø§Øª Ø£Ùˆ ØµÙÙ‚Ø§Øª Ø£Ùˆ Ø¹Ù‚ÙˆØ¯ Ø´Ø±ÙƒØªÙƒ.', 'Zero AI training on proprietary customer data, contracts or business clauses.')}
                </p>
              </div>
            </div>

            {/* Link to Vault */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-sky-400" />
                <span className="text-xs font-bold text-white">
                  {l('Ù‡Ù„ ØªØ±ØºØ¨ ÙÙŠ Ø­ÙØ¸ Ù…Ø³ØªÙ†Ø¯Ø§ØªÙƒ ÙÙŠ Ø§Ù„Ø®Ø²Ù†Ø© Ø§Ù„Ù…Ø´ÙØ±Ø©ØŸ', 'Access your encrypted sovereign vault?')}
                </span>
              </div>
              <Link
                to="/vault"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all"
              >
                {l('ÙØªØ­ Ø§Ù„Ø®Ø²Ù†Ø© Ø§Ù„Ù…Ø´ÙØ±Ø©', 'Open Vault')}
              </Link>
            </div>
          </div>

          {/* ðŸ‘‘ EXECUTIVE COMMAND BAR â€” deferred after first paint */}
          {showDeferredWidgets && (
            <div className="pt-4">
              <Suspense fallback={null}>
                <ExecutiveCommandBar onOpenSecurity={() => setShowSecurityModal(true)} />
              </Suspense>
            </div>
          )}

          {/* Institutional Trust Badges â€” deferred after first paint */}
          {showDeferredWidgets && (
            <Suspense fallback={null}>
              <InstitutionalTrustBadgeBar />
            </Suspense>
          )}

        </section>

      </div>

      {/* 2FA Security Modal */}
      {showSecurityModal && (
        <Suspense fallback={null}>
          <TwoFactorSecurityModal isOpen={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
        </Suspense>
      )}
    </main>
  );
}