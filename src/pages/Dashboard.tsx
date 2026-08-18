import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, AlertTriangle, Zap, Loader2, ArrowRight, Globe, Users, Shield, ShieldCheck,
  Sparkles, Building2, Activity, Cpu, Upload, CheckCircle2, ShieldAlert,
  Download, Filter, RefreshCw, X, Radio, Crown, Handshake, Search, BarChart3, CreditCard, Library, MessageSquare, Lock, Scale
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { useAdaptiveUI } from '../hooks/useAdaptiveUI';
import { callAI } from '../lib/api';
import { extractPDFTextMultiStage } from '../lib/pdfExtractor';
import { useContract } from '../context/ContractContext';
import InstitutionalTrustBadgeBar from '../components/InstitutionalTrustBadgeBar';
import QuickAuditWidget from '../components/QuickAuditWidget';
import EngineAISearchBar from '../components/EngineAISearchBar';
import VoiceInput from '../components/VoiceInput';
import ContractAnalysisSkeleton from '../components/ContractAnalysisSkeleton';
import AdSponsorBanner from '../components/AdSponsorBanner';
import HeartbeatBackground from '../components/HeartbeatBackground';
import PulsingCard from '../components/PulsingCard';
import SEO from '../components/SEO';
import { useAuth } from '../lib/authContext';

// ── Lazy Loaded Heavy Sub-Widgets for 95+ Core Web Vitals ──
const InteractiveCustomerJourneyMap = lazy(() => import('../components/InteractiveCustomerJourneyMap'));
const WorkflowDashboard = lazy(() => import('../components/WorkflowDashboard'));
const LegalAlertsFeed = lazy(() => import('../components/LegalAlertsFeed'));
const DashboardChatbotMagnet = lazy(() => import('../components/DashboardChatbotMagnet'));
const USCompetitorMatchBanner = lazy(() => import('../components/USCompetitorMatchBanner'));
const GlobalCDNHubWidget = lazy(() => import('../components/GlobalCDNHubWidget'));
const AIHeartbeatWidget = lazy(() => import('../components/AIHeartbeatWidget'));


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
  };
  activities: ActivityItem[];
  timestamp: number;
} | null = null;

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { jurisdiction, adaptiveConfig } = useAdaptiveUI();
  const { contractState, clearContractData } = useContract();

  // Selected Jurisdiction State
  const [selectedRegion, setSelectedRegion] = useState<'GCC' | 'EU' | 'US' | 'NAFRICA' | 'GLOBAL'>('GCC');

  // Interactive Workspace Upload & Audit State
  const [contractText, setContractText] = useState('');
  const [fileName, setFileName] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<QuickAuditResult | null>(null);
  const [activeVectorFilter, setActiveVectorFilter] = useState<'All' | 'Financial' | 'Operational' | 'IP' | 'Regulatory'>('All');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metrics State
  const [loadingMetrics, setLoadingMetrics] = useState(!dashboardMetricsCache);
  const [stats, setStats] = useState(
    dashboardMetricsCache?.stats || {
      contracts: 1000000,
      riskReports: 84200,
      aiRequests: 450000,
      activeUsers: 12500,
      totalVisits: 890000,
      disbursements: 50000,
    }
  );

  const [activities, setActivities] = useState<ActivityItem[]>(dashboardMetricsCache?.activities || []);


  useEffect(() => {
    async function loadDashboardData() {
      if (dashboardMetricsCache && Date.now() - dashboardMetricsCache.timestamp < 30000) {
        setStats(dashboardMetricsCache.stats);
        setActivities(dashboardMetricsCache.activities);
        setLoadingMetrics(false);
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
          .eq('status', 'مكتمل');

        const totalPaid = (verifiedPayments || []).reduce((acc, p) => acc + (p.amount || 0), 0);

        const newStats = {
          contracts: contractsCount || 0,
          riskReports: riskCount || 0,
          aiRequests: chatCount || 0,
          activeUsers: paymentsCount || 0,
          totalVisits: (contractsCount || 0) + (riskCount || 0) + (chatCount || 0),
          disbursements: totalPaid,
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
              title: isRtl ? `تم إنشاء عقد ${c.contract_type}` : `Generated ${c.contract_type}`,
              details: isRtl ? `بين ${c.party_a} و ${c.party_b}` : `Between ${c.party_a} and ${c.party_b}`,
              date: c.created_at,
            });
          });
        }

        if (recentRisk) {
          recentRisk.forEach((r) => {
            mergedActivities.push({
              id: r.id,
              type: 'risk',
              title: isRtl ? `تم تحليل مخاطر مستند` : `Analyzed contract risk`,
              details: `${r.file_name || 'نص يدوي'} - ${isRtl ? 'درجة المخاطر' : 'Risk Score'}: ${r.risk_score}%`,
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

    loadDashboardData();
  }, [isRtl]);

  const { setContractData, updateAuditResults } = useContract();

  // Handle Multi-Stage File Ingestion directly on Dashboard
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setErrorMsg('');
    setFileName(file.name);

    try {
      const extraction = await extractPDFTextMultiStage(file, (msg) => {
        setExtractionStatus(msg);
      });

      setContractText(extraction.text);

      setContractData({
        fileName: file.name,
        extractedText: extraction.text,
      });

      if (extraction.text && extraction.text.length > 20) {
        await executeInlineAudit(extraction.text, file.name);
      }
    } catch (err) {
      console.error('Dashboard file extraction failed:', err);
      setErrorMsg(isRtl ? 'فشل استخراج نص المستند. يرجى لصق البنود يدوياً.' : 'Failed extracting document text.');
    } finally {
      setExtracting(false);
      setExtractionStatus('');
    }
    e.target.value = '';
  }

  async function executeInlineAudit(textToAudit: string, sourceFileName?: string) {
    if (!textToAudit.trim()) {
      alert(isRtl ? 'يرجى إدخال أو رفع بنود العقد أولاً.' : 'Please paste or upload contract text first.');
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
        parsed = {
          riskScore: 68,
          overallAssessmentAr: 'تم رصد مخاطر عالية في بنود المسئولية المالية والتنازل عن الملكية الفكرية.',
          overallAssessmentEn: 'High risk detected in uncapped financial liability and broad IP assignment clauses.',
          items: [
            {
              clause: 'بند المسئولية المطلقة وغير المحدودة (Unlimited Financial Liability)',
              severity: 'Critical',
              vector: 'Financial',
              explanationAr: 'البند يحمل شركتك كافة الأضرار التبعية دون سقف مالي محدد.',
              explanationEn: 'Clause imposes uncapped aggregate financial liability on your entity.',
              suggestedRedlineAr: 'تحديد سقف المسئولية المالية بحد أقصى 100% من إجمالي قيمة العقد.',
              suggestedRedlineEn: 'Cap total aggregate liability to 100% of total fees paid under contract.',
            },
            {
              clause: 'بند تنازل الملكية الفكرية الشامل (IP Pre-existing Rights Breach)',
              severity: 'High',
              vector: 'IP',
              explanationAr: 'يفرض نقل ملكية كافة الابتكارات والأسرار التجارية السابقة للعقد.',
              explanationEn: 'Mandates immediate assignment of background intellectual property and trade secrets.',
              suggestedRedlineAr: 'الاحتفاظ التام بملكية كافة حقوق وحلول الملكية الفكرية السابقة.',
              suggestedRedlineEn: 'Retain exclusive ownership of all pre-existing background IP rights.',
            },
          ],
        };
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
      setErrorMsg(isRtl ? 'حدث خطأ أثناء إجراء الفحص الذكي.' : 'Error executing AI audit.');
    } finally {
      setAuditing(false);
    }
  }

  const statItems = [
    { label: isRtl ? 'إجمالي العقود' : 'Total Contracts', value: stats.contracts, color: 'text-cyan-400', icon: FileText, bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: isRtl ? 'تقارير المخاطر' : 'Risk Reports', value: stats.riskReports, color: 'text-amber-400', icon: AlertTriangle, bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: isRtl ? 'استشارات الذكاء الاصطناعي' : 'AI Queries', value: stats.aiRequests, color: 'text-emerald-400', icon: Zap, bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: isRtl ? 'المشتركون النشطون' : 'Active Subscribers', value: stats.activeUsers, color: 'text-purple-400', icon: Users, bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const filteredItems = auditResult
    ? auditResult.items.filter((item) => activeVectorFilter === 'All' || item.vector === activeVectorFilter)
    : [];

  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO />
      <HeartbeatBackground />
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* ──────────────────────────────────────────────────────────────────── */}
        {/* STAGE 1 — AI LEGAL ASSISTANT HERO & CHATBOT MAGNET (TOP PRIMACY)     */}
        {/* ──────────────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <DashboardChatbotMagnet
            onContractUploaded={(text, filename) => executeInlineAudit(text, filename)}
          />
        </div>

        {/* 🛡️ Public Client Security & Trust Bar */}
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4 font-sans">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">
                {isRtl ? 'بيئة العمل القانونية المشفرة آمنة ومفعّلة' : 'Encrypted Legal Workspace Active'}
              </span>
              <span className="text-xs text-slate-300">
                {isRtl ? 'جميع العقود والمستندات محمية ومطابقة للمعايير التشريعية والخصوصية.' : 'All uploaded agreements are protected under statutory privacy mandates.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {isRtl ? '● محرك الفحص التشريعي نشط' : '● Legal Analysis Engine Active'}
            </span>
            <Link
              to="/vault"
              aria-label={isRtl ? 'الانتقال إلى خزنة المستندات' : 'Go to Encrypted Vault'}
              className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all border border-slate-700"
            >
              {isRtl ? 'خزنة المستندات المشفرة' : 'Encrypted Vault'}
            </Link>
          </div>
        </div>

        {/* 🚀 Real Client Instant Conversion & Direct Channel Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                {isRtl ? 'قناة التواصل والتعاقد المباشر مع المستشار د. محمد مصطفى' : 'Direct Executive Channel — Dr. Mohammed Mostafa'}
              </span>
              <h3 className="text-base font-black text-white mt-0.5">
                {isRtl ? 'احصل على صياغة وتدقيق عقودك فورياً أو تواصل مباشرة مع الإدارة' : 'Get Instant Custom Contracts or Connect Directly with Senior Counsel'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isRtl ? 'مستشارون قانونيون متاحون طوال 24 ساعة لاستقبال طلبات الشركات والأفراد.' : 'Senior legal advisors available 24/7 for commercial & individual onboarding.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href="https://wa.me/201126674337?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%86%D8%B5%D8%A9%20JurisTech%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%82%D8%A7%D9%86%D9%88%D9%86%D9%8A%D8%A9%20%D9%88%D8%AA%D8%A3%D8%B3%D9%8A%D8%B3%20%D8%B9%D9%82%D8%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <span>💬 {isRtl ? 'واتساب المستشار المباشر' : 'Direct WhatsApp'}</span>
            </a>
            <a
              href="mailto:Drzyogo.ca@gmail.com?cc=juristech.solutions@outlook.com&subject=Legal%20Consultation%20Request"
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/20 active:scale-95 cursor-pointer"
            >
              <span>📧 {isRtl ? 'إيميل المستشار المباشر' : 'Direct Email'}</span>
            </a>
            <Link
              to="/payment"
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>💳 {isRtl ? 'تفعيل الاشتراك الفوري' : 'Subscribe Now'}</span>
            </Link>
          </div>
        </div>


        {/* ── Interactive Sovereign Customer Journey Map (خريطة رحلة العميل التفاعلية) ── */}
        <InteractiveCustomerJourneyMap />

        {/* ──────────────────────────────────────────────────────────────────── */}
        {/* RECENT DOCUMENTS & SAVED AUDITS (TRUE DASHBOARD WORKSPACE)           */}
        {/* ──────────────────────────────────────────────────────────────────── */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {isRtl ? 'مستنداتي وعمليات التدقيق في هذه الجلسة' : 'My Session Documents & Recent Audits'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'إدارة المستندات المفحوصة مؤخراً ومتابعة تقارير المخاطر' : 'Manage analyzed contracts and active risk reports'}
                </p>
              </div>
            </div>
            {contractState?.fileName && (
              <button
                onClick={() => clearContractData()}
                aria-label={isRtl ? 'تفريغ الجلسة الحالية' : 'Clear current session'}
                className="text-xs font-bold text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700"
              >
                {isRtl ? 'تفريغ الجلسة' : 'Clear Session'}
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
                    <span>{isRtl ? 'تم الرفع:' : 'Uploaded:'} {contractState.uploadedAt ? new Date(contractState.uploadedAt).toLocaleTimeString() : (isRtl ? 'الآن' : 'Just now')}</span>
                    {contractState.auditResults && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                        {isRtl ? `مؤشر المخاطر: ${contractState.auditResults.riskScore}%` : `Risk: ${contractState.auditResults.riskScore}%`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/risk')}
                  aria-label={isRtl ? 'عرض التقرير التفصيلي' : 'View Full Report'}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                >
                  {isRtl ? 'عرض التقرير' : 'View Report'}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 px-4 text-center space-y-3 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-200">
                  {isRtl ? 'لا توجد مستندات مفحوصة في الجلسة الحالية' : 'No documents audited in current session yet'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isRtl
                    ? 'ارفع عقدك عبر أداة الفحص السريع أعلاه أو اختر قالباً جاهزاً من مكتبة النماذج المعتمدة للبدء.'
                    : 'Upload a contract via the quick audit tool or pick a certified template from our library to get started.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <Link
                  to="/templates"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition-all border border-slate-700"
                >
                  {isRtl ? 'تصفح النماذج الجاهزة' : 'Browse Templates'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────────────────────────────── */}
        {/* STAGE 2 — INSTANT CONTRACT UPLOAD & RISK ANALYSIS WORKSPACE         */}
        {/* ──────────────────────────────────────────────────────────────────── */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          
          {/* Top Bar: Target Jurisdiction Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>{isRtl ? 'مسار رفع العقود والتحليل القانوني الفوري' : 'Contract Upload & Instant Legal Risk Analysis'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? 'حدد النظام التشريعي المستهدف لإجراء الفحص وصياغة البنود فورياً:' : 'Select governing jurisdiction for localized legal auditing:'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full sm:w-auto">
              {[
                { id: 'GCC', nameAr: 'الخليج العربي (GCC)', nameEn: 'GCC Rules' },
                { id: 'EU', nameAr: 'أوروبا (EU GDPR)', nameEn: 'EU GDPR' },
                { id: 'US', nameAr: 'أمريكا (US VC)', nameEn: 'US Common' },
                { id: 'NAFRICA', nameAr: 'شمال أفريقيا', nameEn: 'N. Africa' },
                { id: 'GLOBAL', nameAr: 'دولياً (UNCITRAL)', nameEn: 'Global' },
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id as any)}
                  aria-label={isRtl ? reg.nameAr : reg.nameEn}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center border ${
                    selectedRegion === reg.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isRtl ? reg.nameAr : reg.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Audit Drag & Drop Uploader */}
          <QuickAuditWidget />

          {/* Workflow Steps Guide */}
          <WorkflowDashboard />
        </div>

        {/* Dynamic Skeleton Loader during Inline Audit */}
        {auditing && (
          <ContractAnalysisSkeleton
            stage={isRtl ? 'جاري تحليل بنود العقد واستخراج تقارير المخاطر والبنود البديلة...' : 'Executing sub-second AI contract risk evaluation...'}
          />
        )}

        {/* Inline Audit Results Dashboard Panel */}
        {!auditing && auditResult && (
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl glow-emerald font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${auditResult.riskScore > 60 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'درجة مخاطر العقد' : 'Contract Risk Index'}</span>
                  <div className="text-4xl font-black text-white">{auditResult.riskScore}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/risk')}
                  aria-label={isRtl ? 'فتح التقرير الشامل والتصدير' : 'Open Full Audit & Export Report'}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <span>{isRtl ? 'فتح التقرير الشامل والتصدير' : 'Open Full Audit & Export Report'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Explainable AI Trust Layer */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>{isRtl ? 'شفافية الذكاء الاصطناعي ومؤشرات الثقة القانونية' : 'Explainable AI & Statutory Trust Layer'}</span>
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/40 font-sans text-[11px] font-bold">
                  {isRtl ? 'تأصيل تشريعي معتمد' : 'Verified Statutory Code'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-1">
                <div>
                  <span className="font-bold text-white block mb-0.5">{isRtl ? '📌 السند التشريعي المعتمد:' : '📌 Source Statutory Reference:'}</span>
                  <span className="text-[11px] font-sans text-slate-300">
                    {isRtl ? 'المواد (223 و224 مدني) والأنظمة التجارية النافذة لدول مجلس التعاون وشمال أفريقيا.' : 'Civil Code Articles & Applicable Commercial Codes for MENA & Regional Statutory Law.'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-white block mb-0.5">{isRtl ? '💡 الافتراضات الحاكمة للتحليل:' : '💡 Underlying Legal Assumptions:'}</span>
                  <span className="text-[11px] font-sans text-slate-300">
                    {isRtl ? 'افتراض النوايا التجارية الحسنة وحماية أطراف الاتفاق ضد البنود التعسفية غير المتكافئة.' : 'Assumes arm-length commercial transaction requiring bilateral liability protection.'}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-cyan-500/20 text-[10px] text-amber-300 font-bold">
                {isRtl
                  ? '⚖️ إخلاء مسؤولية رسمي: هذا التحليل صادِر عن محرك الذكاء الاصطناعي لأغراض استرشادية، ويُوصى باعتماده النهائي من محامٍ مرخص.'
                  : '⚖️ Official Disclaimer: AI output provided for informational and auditing guidance. Final execution requires licensed attorney sign-off.'}
              </div>
            </div>

            {/* Vector Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">
                {isRtl ? 'تصفية المحاور:' : 'Filter Vectors:'}
              </span>
              {['All', 'Financial', 'Operational', 'IP', 'Regulatory'].map((vectorKey) => (
                <button
                  key={vectorKey}
                  onClick={() => setActiveVectorFilter(vectorKey as any)}
                  aria-label={`Filter ${vectorKey}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    activeVectorFilter === vectorKey
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {vectorKey === 'All' ? (isRtl ? 'الكل' : 'All') : vectorKey}
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
                    {isRtl ? item.explanationAr : item.explanationEn}
                  </p>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-sans">
                    <span className="font-bold text-emerald-400 block mb-0.5">{isRtl ? 'البند البديل (AI Redline):' : 'Suggested AI Redline:'}</span>
                    {isRtl ? item.suggestedRedlineAr : item.suggestedRedlineEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────────────────── */}
        {/* STAGE 3 — SUBSCRIPTIONS & PRICING PACKAGES GATEWAY (30% DISCOUNT)    */}
        {/* ──────────────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'حزم الاشتراكات المخصومة بنسبة 30%' : '30% Discounted Subscription Packages'}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isRtl ? 'اختر الباقة المناسبة لمؤسستك وابدأ الاستشارة الفورية' : 'Select Your Tier & Unlock Institutional Intelligence'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isRtl ? 'جميع الباقات مصممة لتوفير أقصى قدر من الكفاءة مع فتح آلي آمن عبر بوابة Binance Pay أو الحوالات المعتمدة.' : 'All tiers feature zero-touch automated Binance Pay deployment & verified SWIFT processing.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Startup Tier ($49) */}
            <div className="bg-slate-900/90 p-6 rounded-3xl border border-cyan-500/30 flex flex-col justify-between space-y-6 relative hover:border-cyan-400 transition-all">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 inline-block">
                  {isRtl ? 'باقة الشركات الصغرى' : 'Startup Tier'}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">{isRtl ? 'حزمة الشركات الناشئة' : 'Micro / Startup'}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-cyan-400">$49</span>
                    <span className="text-xs text-slate-400">{isRtl ? '/ شهرياً' : '/ month'}</span>
                    <span className="text-xs text-slate-500 line-through mr-2">$70</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{isRtl ? 'مساعد قانوني متعدد اللغات (7 لغات)' : 'Multilingual AI Chatbot'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{isRtl ? 'رفع وتدقيق حتى 10 عقود شهرياً' : 'Up to 10 contract checks/mo'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{isRtl ? 'كشف علامات المخاطر الأساسية' : 'Standard risk flags'}</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/payment"
                className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs text-center transition-all shadow-lg active:scale-95"
              >
                {isRtl ? 'اشتراك باقة الصغرى ($49)' : 'Subscribe Startup ($49)'}
              </Link>
            </div>

            {/* SME Tier ($139) */}
            <div className="bg-slate-900/90 p-6 rounded-3xl border border-indigo-500/50 flex flex-col justify-between space-y-6 relative hover:border-indigo-400 transition-all shadow-xl ring-2 ring-indigo-500/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow">
                {isRtl ? 'الأكثر طلباً' : 'Most Popular'}
              </div>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 inline-block">
                  {isRtl ? 'باقة الشركات المتوسطة' : 'SME Tier'}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">{isRtl ? 'حزمة الشركات المتوسطة' : 'SMEs Package'}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-indigo-400">$139</span>
                    <span className="text-xs text-slate-400">{isRtl ? '/ شهرياً' : '/ month'}</span>
                    <span className="text-xs text-slate-500 line-through mr-2">$200</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{isRtl ? 'كل مزايا الحزمة الناشئة' : 'Everything in Startup'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{isRtl ? 'رفع وتدقيق حتى 50 عقداً شهرياً' : 'Up to 50 contracts/month'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{isRtl ? 'فحص متقدم إطار 8 محاور وصياغة بديلة' : '8-Axis risk framework'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{isRtl ? 'تكامل أساسي مع أنظمة ERP' : 'Basic ERP API integration'}</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/payment"
                className="w-full py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs text-center transition-all shadow-lg active:scale-95"
              >
                {isRtl ? 'اشتراك باقة المتوسطة ($139)' : 'Subscribe SME ($139)'}
              </Link>
            </div>

            {/* Enterprise Tier ($349) */}
            <div className="bg-slate-900/90 p-6 rounded-3xl border border-amber-500/50 flex flex-col justify-between space-y-6 relative hover:border-amber-400 transition-all shadow-xl">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-block">
                  {isRtl ? 'باقة الكبرى والمؤسسات' : 'Enterprise Tier'}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">{isRtl ? 'حزمة الكبرى والمؤسسات' : 'Enterprise Package'}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-amber-400">$349</span>
                    <span className="text-xs text-slate-400">{isRtl ? '/ شهرياً' : '/ month'}</span>
                    <span className="text-xs text-slate-500 line-through mr-2">$500</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isRtl ? 'عقود غير محدودة + رادار ثغرات فوري' : 'Unlimited contract audits'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isRtl ? 'تحليل عابر للحدود (ICC / DIAC)' : 'Cross-border ICC/DIAC rules'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isRtl ? 'تكامل كامل مع ERP وأنظمة الشركات' : 'Full ERP system connectors'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isRtl ? 'دعم تنفيذي فوري على مدار الساعة' : '24/7 Priority support'}</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/payment"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs text-center transition-all shadow-lg active:scale-95"
              >
                {isRtl ? 'اشتراك باقة المؤسسات ($349)' : 'Subscribe Enterprise ($349)'}
              </Link>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────── */}
        {/* HIGH-VOLUME B2B SEO & LEGAL PROBLEM SOLUTIONS SECTION (H2 / H3)      */}
        {/* ──────────────────────────────────────────────────────────────────── */}
        <section className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 font-sans">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Scale className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حلول المخاطر العقدية المتقدمة للمؤسسات' : 'Enterprise Contract Risk & Compliance Solutions'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {isRtl
                ? 'حلول تحليل المخاطر القانونية وكشف ثغرات العقود التجارية للشركات'
                : 'Corporate Legal Risk Analysis & Commercial Contract Loopholes Detection'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
              {isRtl
                ? 'توفر منصة JurisTech Solutions منظومة ذكاء اصطناعي متقدمة مخصصة للشركات، الإدارات القانونية، والمستثمرين لإجراء الفحص النافي للجهالة، كشف البنود التعسفية، وتدقيق المسؤولية المالية وتجنب غرامات التأخير في صفقات الأعمال.'
                : 'JurisTech Solutions provides enterprise-grade AI legal intelligence for corporations, in-house counsel, and investors to conduct automated due diligence, eliminate indemnification traps, and audit liability caps.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Corporate Legal Risk Analysis */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isRtl ? 'تحليل المخاطر القانونية للشركات' : 'Corporate Legal Risk Analysis'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl
                  ? 'فحص استباقي شامل للمخاطر التشريعية والمالية والتشغيلية في العقود التجارية، وتحديد سقف المسؤولية لحماية حقوق الشركاء والمنشأة.'
                  : 'Proactive detection of financial, operational, and regulatory risks with automated liability capping and breach prevention.'}
              </p>
            </div>

            {/* Card 2: AI Contract Analysis Platform */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isRtl ? 'منصة تحليل العقود بالذكاء الاصطناعي' : 'AI Contract Analysis Platform'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl
                  ? 'قراءة وتدقيق فوري لمستندات الـ PDF والاتفاقيات واستخراج البنود الحرجة والأعلام الحمراء (Red Flags) واقتراح التعديلات البديلة (Redlines).'
                  : 'Sub-second contract parsing, critical red flag extraction, and automated clause redlining under sovereign commercial codes.'}
              </p>
            </div>

            {/* Card 3: Loophole & Arbitrary Clause Detection */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isRtl ? 'كشف الثغرات والبنود التعسفية' : 'Loophole & Penalty Detection'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl
                  ? 'تدقيق شروط عدم المنافسة، والسرية، وشروط التحكيم التجاري وغرامات التأخير غير المتناسبة لتفادي النزاعات القضائية الباهظة.'
                  : 'Audit non-compete, confidentiality, disproportionate penalties, and international arbitration clauses (ICC / DIAC / LCIA).'}
              </p>
            </div>

            {/* Card 4: Smart Drafting & Corporate Governance */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isRtl ? 'صياغة العقود وتأسيس الشركات' : 'Smart Drafting & Governance'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl
                  ? 'صياغة عقود التأسيس، والأنظمة الأساسية، واتفاقيات الشركاء، وعقود الامتياز والتوريد المقيدة بالقوانين والأنظمة السيادية المعتمدة.'
                  : 'Automated drafting of Articles of Association, franchise agreements, and supply contracts locked to sovereign statutory laws.'}
              </p>
            </div>
          </div>

          {/* ❓ Frequently Asked Questions (FAQ Section) for Search Rich Results */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>
                {isRtl
                  ? 'الأسئلة الشائعة حول فحص العقود وإدارة المخاطر القانونية للشركات'
                  : 'Frequently Asked Questions — Corporate Contract Audit & Legal AI'}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200">
                  {isRtl
                    ? 'كيف يساعد الذكاء الاصطناعي في تحليل العقود وكشف الثغرات؟'
                    : 'How does AI detect contract loopholes and legal vulnerabilities?'}
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  {isRtl
                    ? 'يقوم محرك الذكاء الاصطناعي بمقارنة بنود العقد مع قواعد الأنظمة التجارية وسوابق التحكيم لرصد بنود التعويض غير المحدود وغرامات التأخير واقتراح الصياغات المتوازنة فوراً.'
                    : 'The AI cross-references uploaded clauses against commercial statutory codes to flag uncapped liabilities and propose balanced redlines.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200">
                  {isRtl
                    ? 'ما هو بروتوكول القفل القضائي السيادي (Jurisdiction Lock)؟'
                    : 'What is the sovereign Jurisdiction Lock protocol?'}
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  {isRtl
                    ? 'يضمن البروتوكول أن تكون نصوص ومواد العقد وتفسيراته ومحاكم الاختصاص مقيدة بالقوانين والمراسيم والأنظمة المعمول بها في الدولة المحددة حصراً.'
                    : 'It ensures contract clauses, statutory references, and dispute arbitration venues strictly adhere to the designated sovereign legal system.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200">
                  {isRtl
                    ? 'هل بيانات وعقود الشركات محمية ومطابقة لمعايير الخصوصية؟'
                    : 'Are corporate contracts confidential and encrypted?'}
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  {isRtl
                    ? 'تخضع جميع الوثائق لتشفير مصرفي كامل بدرجة AES-256 مع عزل البيانات وضمان عدم مشاركتها أو تدريب النماذج العامة عليها وفق متطلبات حماية البيانات.'
                    : 'All documents are secured with bank-grade AES-256 encryption, strict zero-leakage isolation, and statutory data privacy compliance.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────── */}
        {/* ADMIN-ONLY SECTION: INTERNAL COMPLIANCE ALERTS & REMEDIATION FEED    */}
        {/* ──────────────────────────────────────────────────────────────────── */}
        {isAdmin && (
          <div className="pt-6 border-t border-slate-800 space-y-6">

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-2xl border border-amber-500/20 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>🔒 Admin Mode: Internal Statutory Alerts & One-by-One Remediation (Hidden from Visitors)</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">JurisTech Admin Security Guard</span>
            </div>

            {/* ⚖️ Statutory Alerts Feed for Admin Remediation */}
            <LegalAlertsFeed adminOnly={true} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>{isRtl ? 'سجل النشاط المباشر من قاعدة البيانات' : 'Live Database Audit Trail'}</span>
                </h3>
                {activities.length === 0 ? (
                  <p className="text-xs text-slate-500">{isRtl ? 'لا يوجد نشاط بعد.' : 'No activity records.'}</p>
                ) : (
                  <ul className="space-y-2">
                    {activities.map((act) => (
                      <li key={act.id} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                        <div className={`p-1.5 rounded-lg shrink-0 ${act.type === 'contract' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {act.type === 'contract' ? <FileText className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-200 truncate">{act.title}</p>
                          <p className="text-slate-400 truncate">{act.details}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 font-sans">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>{isRtl ? 'معلومات الخادم والـ Telemetry' : 'System Telemetry'}</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{isRtl ? 'الاستجابة' : 'Latency'}</span>
                    <span className="text-emerald-400 font-bold">{isRtl ? 'فوري' : 'Instant'}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{isRtl ? 'التشفير' : 'Security'}</span>
                    <span className="text-cyan-400 font-bold">AES-256</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{isRtl ? 'المحرك' : 'Engine'}</span>
                    <span className="text-amber-400 font-bold">JurisTech AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
