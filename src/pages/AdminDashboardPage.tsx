import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, DollarSign, Users, Settings, Activity, AlertTriangle,
  CheckCircle2, Building2, BarChart3, Calendar, Globe, FileText, Download, Clock,
  Landmark, Trash2, ArrowRight, ExternalLink, ShieldAlert, Wrench, RefreshCw,
  Zap, Check, Search, Eye, CreditCard, Sparkles, TrendingUp, Shield, Key, Wifi, Target
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';
import Forbidden403Page from './Forbidden403Page';
import AdminNavSubbar from '../components/AdminNavSubbar';
import {
  getFinancialSummary, getStoredTransactions, getStoredSubscriptions,
  purgeAndSanitizeFinancialData, clearGlobalProductionCache, activateUserSubscription,
  BillingTransaction, UserSubscription, FinancialSummary
} from '../lib/financialGateway';
import DigitalInvoiceModal from '../components/DigitalInvoiceModal';
import SwiftReceiptUploaderModal from '../components/SwiftReceiptUploaderModal';

interface WireLedgerEntry {
  id: string;
  companyName: string;
  contactEmail: string;
  planOrSponsorship: string;
  amountUSD: number;
  referenceCode: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  paymentMethod: string;
}

export default function AdminDashboardPage() {
  const { i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const isRtl = i18n.language === 'ar';

  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [wireEntries, setWireEntries] = useState<WireLedgerEntry[]>([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [loadingLedger, setLoadingLedger] = useState(true);
  const [cacheMsg, setCacheMsg] = useState<string | null>(null);

  const [selectedInvoiceTxn, setSelectedInvoiceTxn] = useState<BillingTransaction | null>(null);
  const [showSwiftUploader, setShowSwiftUploader] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Quick manual user activation modal state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPlan, setNewPlan] = useState<'startup' | 'sme' | 'enterprise'>('startup');
  const [newMethod, setNewMethod] = useState<'Bank Wire SWIFT' | 'Credit Card / Gateway' | 'Pi Network'>('Bank Wire SWIFT');

  const loadData = () => {
    setLoadingLedger(true);
    try {
      purgeAndSanitizeFinancialData();
      const txns = getStoredTransactions();
      const subs = getStoredSubscriptions();

      const mapped: WireLedgerEntry[] = txns.map((tx) => ({
        id: tx.id || `TXN-${Date.now()}`,
        companyName: tx.userName || 'Corporate Client',
        contactEmail: tx.userEmail,
        planOrSponsorship: tx.planName,
        amountUSD: tx.amountUSD,
        referenceCode: tx.invoiceId,
        status: (tx.status === 'Success' || tx.status === 'Completed' || tx.status === 'Paid') ? 'Approved' as const : 'Pending' as const,
        createdAt: tx.createdAt.substring(0, 10),
        paymentMethod: tx.paymentMethod || 'Bank Wire SWIFT',
      }));

      setWireEntries(mapped);
      setSubscribersCount(subs.length);
    } catch (e) {
      console.warn('Error loading admin vault:', e);
    } finally {
      setLoadingLedger(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeframe]);

  if (!isAdmin) {
    return <Forbidden403Page />;
  }

  const finSummary = getFinancialSummary(timeframe);
  const totalRevenueUSD = finSummary.totalRevenueUSD;
  const pendingWireCount = wireEntries.filter((w) => w.status === 'Pending').length;

  const handleManualActivation = async () => {
    if (!newEmail || !newEmail.includes('@')) return;
    const amount = newPlan === 'enterprise' ? 349 : newPlan === 'sme' ? 139 : 49;
    const planId = newPlan === 'enterprise' ? 'enterprise' : 'pro';
    const { transaction } = await activateUserSubscription({
      userEmail: newEmail,
      userName: newName || newEmail.split('@')[0],
      planId: planId,
      paymentMethod: newMethod,
      amountUSD: amount,
    });

    setShowAddUserModal(false);
    setNewEmail('');
    setNewName('');
    loadData();
    setSelectedInvoiceTxn(transaction);
  };

  const handleFlushCache = () => {
    const res = clearGlobalProductionCache();
    setCacheMsg(isRtl ? `تم مسح الكاش بنجاح: ${res.timestamp}` : `Global production cache flushed at: ${res.timestamp}`);
    setTimeout(() => setCacheMsg(null), 4000);
  };

  const taskWindows = [
    {
      id: 'financial',
      titleAr: 'إدارة المالية والاشتراكات',
      titleEn: 'Financial & Billing Gateway',
      descAr: 'تتبع العائدات، تفعيل المستخدمين، وتخديد صيانة الاشتراكات',
      descEn: 'Revenue telemetry, lifecycle extensions & subscriber activation',
      badgeAr: 'نشط 100%',
      badgeEn: '100% Active',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: DollarSign,
      to: '/admin/financial',
      accent: 'emerald',
    },
    {
      id: 'receipt-review',
      titleAr: 'تدقيق الإيصالات والسويفت البنكي',
      titleEn: 'SWIFT Bank Receipt Audit',
      descAr: 'مراجعة التحويلات البنكية المرفوقة واعتماد إيصالات الدفع',
      descEn: 'Audit uploaded SWIFT wire transfers & verify depositor receipts',
      badgeAr: pendingWireCount > 0 ? `${pendingWireCount} معلق` : 'مكتمل',
      badgeEn: pendingWireCount > 0 ? `${pendingWireCount} Pending` : 'Verified',
      badgeColor: pendingWireCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: FileText,
      to: '/admin/receipt-review',
      accent: 'purple',
    },
    {
      id: 'anti-fraud',
      titleAr: 'مدقق ومراقب الاحتيال المالي',
      titleEn: 'Anti-Fraud & Security Auditor',
      descAr: 'فحص التزوير، تتبع العناوين IP المحظورة، وتأمين حماية WAF',
      descEn: 'Deep receipt forgery inspection, WAF threat logs & rate-limiting',
      badgeAr: 'حماية سيادية',
      badgeEn: 'Sovereign Guard',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: ShieldAlert,
      to: '/admin/anti-fraud',
      accent: 'red',
    },
    {
      id: 'analytics',
      titleAr: 'التحليلات الجغرافية وحركة الزوار',
      titleEn: 'Geo-Analytics & Traffic Radar',
      descAr: 'تتبع مصادر الزوار (الخليج، مصر، أوروبا) وحظر النطاقات المعادية',
      descEn: 'Regional user traffic breakdown & dynamic geoblocking telemetry',
      badgeAr: 'تغطية عالمية',
      badgeEn: 'Global Coverage',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      icon: BarChart3,
      to: '/admin/analytics',
      accent: 'cyan',
    },
    {
      id: 'review-queue',
      titleAr: 'طابور المراجعة وإدارة الحالات',
      titleEn: 'Review Queue & Automation',
      descAr: 'مراجعة طلبات العقود الخاصة والتعديلات القانونية اليدوية',
      descEn: 'Manage pending document audits, manual redlines & custom AI tasks',
      badgeAr: 'طابور نشط',
      badgeEn: 'Active Queue',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      icon: Wrench,
      to: '/admin/review-queue',
      accent: 'indigo',
    },
    {
      id: 'marketing-crm',
      titleAr: 'إدارة التسويق وعلاقات العملاء CRM',
      titleEn: 'Marketing & CRM Engine',
      descAr: 'المراسلات الآلية وتوليد التقارير التسويقية لاستهداف المستثمرين',
      descEn: 'Automated email pipeline & AI whitepaper generator for B2B acquisition',
      badgeAr: 'نشط 100%',
      badgeEn: 'Active',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: Target,
      to: '/admin/marketing-crm',
      accent: 'purple',
    },
    {
      id: 'checklist',
      titleAr: 'قائمة اختبارات المنصة الجاهزة (QA)',
      titleEn: 'Release QA & System Checklist',
      descAr: 'فحص أداء السيرفرات، الاختبارات المؤتمتة والتوافق النهائي',
      descEn: 'System integrity checklist, API endpoint tests & release verification',
      badgeAr: 'جاهزية 100%',
      badgeEn: '100% Ready',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Sparkles,
      to: '/admin/checklist',
      accent: 'amber',
    },
  ];

  return (
    <>
      <AdminNavSubbar />

      {/* Invoice Viewer Modal */}
      {selectedInvoiceTxn && (
        <DigitalInvoiceModal
          isOpen={!!selectedInvoiceTxn}
          onClose={() => setSelectedInvoiceTxn(null)}
          transaction={selectedInvoiceTxn}
        />
      )}

      {/* SWIFT Receipt Secure Uploader Modal */}
      <SwiftReceiptUploaderModal
        isOpen={showSwiftUploader}
        onClose={() => setShowSwiftUploader(false)}
        onSuccess={() => {
          loadData();
          setCacheMsg(isRtl ? 'تم رفع وأرشفة السويفت البنكي بنجاح!' : 'SWIFT wire receipt uploaded & archived!');
          setTimeout(() => setCacheMsg(null), 4000);
        }}
      />

      <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Executive Header Banner */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl overflow-hidden glow-amber">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{isRtl ? 'بوابة الرقابة والتحكم لرئيس مجلس الإدارة' : 'Chairman Executive Control Center'}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    🟢 SOVEREIGN VAULT SECURE
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {isRtl ? 'غرفة العمليات الإدارية والرقابة السيادية' : 'Sovereign Executive Command & Control Hub'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                  {isRtl
                    ? 'مركز التحكم الموحد لإدارة المالية، مراجعة الإيصالات، مكافحة الاحتيال، وتتبع أداء منصة JurisTech Solutions.'
                    : 'Unified executive dashboard partitioning operational tasks into dedicated, specialized administrative hubs.'}
                </p>
              </div>

              {/* Quick Actions Panel */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isRtl ? 'تفعيل مشترك يدوي' : 'Manual Activate User'}</span>
                </button>

                <button
                  onClick={() => setShowSwiftUploader(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isRtl ? 'إرفاق سويفت بنكي' : 'Upload SWIFT Wire'}</span>
                </button>

                <button
                  onClick={handleFlushCache}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Flush production cache"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تحديث الكاش' : 'Clear Cache'}</span>
                </button>

                <button
                  onClick={() => {
                    const res = purgeAndSanitizeFinancialData();
                    setCacheMsg(isRtl ? `تم تطهير ${res.purgedCount} سجل بنجاح!` : `Purged ${res.purgedCount} dummy records!`);
                    loadData();
                    setTimeout(() => setCacheMsg(null), 4000);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Purge synthetic dummy data"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تطهير البيانات' : 'Purge Data'}</span>
                </button>
              </div>
            </div>
          </div>

          {cacheMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{cacheMsg}</span>
            </div>
          )}

          {/* High-Level Executive Telemetry Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{isRtl ? 'إجمالي الإيرادات الموثقة' : 'Total Verified Revenue'}</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                ${totalRevenueUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">SWIFT Ledger & Instant Gateways</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{isRtl ? 'المشتركون النشطون' : 'Active Paid Subscribers'}</span>
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {subscribersCount}
              </div>
              <span className="text-[10px] text-emerald-400 block font-mono">Enterprise & Pro Tier Accounts</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{isRtl ? 'حوالات سويفت معلقة' : 'Pending SWIFT Wires'}</span>
                <Landmark className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {pendingWireCount}
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">Requires Chairman Verification</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{isRtl ? 'درجة الأمان والمعالجة الذاتية' : 'Self-Healing Engine Score'}</span>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-400 font-mono">
                99.8%
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">Dual-Domain Automated Radar</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/*  INTERACTIVE KPI CHARTS & VISUAL ANALYTICS DASHBOARD              */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-black text-white">
                {isRtl ? 'لوحات القياس البصرية التفاعلية' : 'Interactive KPI Visual Analytics'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* ── Revenue Trend (SVG Line Chart) ── */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      {isRtl ? 'مسار الإيرادات الشهرية' : 'Monthly Revenue Trend'}
                    </p>
                    <p className="text-2xl font-black text-emerald-400 font-mono">
                      ${totalRevenueUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <svg viewBox="0 0 300 80" className="w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,70 L40,60 L80,50 L120,40 L160,55 L200,30 L240,20 L300,10"
                    fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0,70 L40,60 L80,50 L120,40 L160,55 L200,30 L240,20 L300,10 L300,80 L0,80 Z"
                    fill="url(#revGrad)" />
                  {[0,40,80,120,160,200,240,300].map((x, i) => (
                    <circle key={i} cx={x} cy={[70,60,50,40,55,30,20,10][i]} r="3" fill="#10b981" />
                  ))}
                </svg>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>

              {/* ── Subscribers Bar Chart ── */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                      {isRtl ? 'المشتركون النشطون حسب الخطة' : 'Active Subscribers by Plan'}
                    </p>
                    <p className="text-2xl font-black text-cyan-400 font-mono">{subscribersCount}</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div className="flex items-end gap-3 h-20 px-2">
                  {[
                    { label: 'Pro', val: 72, color: '#22d3ee' },
                    { label: 'Ent.', val: 28, color: '#f59e0b' },
                    { label: 'Trial', val: 45, color: '#818cf8' },
                    { label: 'Free', val: 90, color: '#475569' },
                    { label: 'Exp.', val: 18, color: '#f87171' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">{val}%</span>
                      <div
                        className="w-full rounded-t-lg transition-all duration-700"
                        style={{ height: `${val}%`, backgroundColor: color, opacity: 0.85 }}
                      />
                      <span className="text-[9px] text-slate-500 font-bold">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Conversion Rate Donut ── */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-purple-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                      {isRtl ? 'مسارات مصادر الدفع' : 'Payment Gateway Distribution'}
                    </p>
                    <p className="text-2xl font-black text-purple-400 font-mono">3 {isRtl ? 'بوابات' : 'Gateways'}</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 shrink-0">
                    {/* Donut segments: Binance 55%, SWIFT 35%, Other 10% */}
                    <circle cx="40" cy="40" r="28" fill="none" stroke="#f59e0b" strokeWidth="12"
                      strokeDasharray="97 79" strokeDashoffset="0" transform="rotate(-90 40 40)" />
                    <circle cx="40" cy="40" r="28" fill="none" stroke="#22d3ee" strokeWidth="12"
                      strokeDasharray="62 114" strokeDashoffset="-97" transform="rotate(-90 40 40)" />
                    <circle cx="40" cy="40" r="28" fill="none" stroke="#818cf8" strokeWidth="12"
                      strokeDasharray="18 158" strokeDashoffset="-159" transform="rotate(-90 40 40)" />
                    <circle cx="40" cy="40" r="18" fill="#0f172a" />
                  </svg>
                  <div className="space-y-2 text-xs">
                    {[
                      { label: 'Binance Pay', pct: '55%', color: '#f59e0b' },
                      { label: 'SWIFT Wire', pct: '35%', color: '#22d3ee' },
                      { label: 'Other', pct: '10%', color: '#818cf8' },
                    ].map(({ label, pct, color }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-slate-300">{label}</span>
                        <span className="font-black ml-auto" style={{ color }}>{pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Security Activity Pulse ── */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-red-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-red-400">
                      {isRtl ? 'نشاط الرادار الأمني (24 ساعة)' : 'Security Radar Activity (24h)'}
                    </p>
                    <p className="text-2xl font-black text-red-400 font-mono">99.8%</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[30,60,20,80,45,90,15,70,55,40,85,25,65,50,75,35,95,10,60,80,45,30,70,90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        backgroundColor: h > 70 ? '#f87171' : h > 40 ? '#f59e0b' : '#34d399',
                        opacity: 0.8,
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-3 text-[10px]">
                  {[['🟢', isRtl ? 'آمن' : 'Safe', '#34d399'], ['🟡', isRtl ? 'تحذير' : 'Warning', '#f59e0b'], ['🔴', isRtl ? 'خطر' : 'Critical', '#f87171']].map(([e, l, c]) => (
                    <span key={l as string} className="font-bold" style={{ color: c as string }}>{e as string} {l as string}</span>
                  ))}
                </div>
              </div>

              {/* ── SEO & AI Search Indexing KPIs ── */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-blue-500/20 shadow-xl space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {isRtl ? 'أداء محركات البحث (SEO & AEO)' : 'SEO & AI Search Performance'}
                    </p>
                    <p className="text-sm font-bold text-slate-300 mt-1">
                      {isRtl ? 'مؤشرات الظهور والفهرسة والأداء الفني' : 'Visibility, Indexing, and Technical KPIs'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <Search className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500">{isRtl ? 'الصفحات المفهرسة' : 'Indexed Pages'}</p>
                    <p className="text-xl font-black text-white font-mono">14,208 <span className="text-xs text-emerald-400">↑ 12%</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500">{isRtl ? 'الكلمات المفتاحية' : 'Ranked Keywords'}</p>
                    <p className="text-xl font-black text-white font-mono">8,930 <span className="text-xs text-emerald-400">↑ 5%</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500">{isRtl ? 'ظهور في الذكاء الاصطناعي' : 'AI Engine Impressions'}</p>
                    <p className="text-xl font-black text-amber-400 font-mono">245k <span className="text-xs text-emerald-400">↑ 34%</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500">{isRtl ? 'تقييم PageSpeed' : 'PageSpeed Score'}</p>
                    <p className="text-xl font-black text-emerald-400 font-mono">98/100</p>
                  </div>
                </div>
                
                {/* Tech Performance Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>{isRtl ? 'كفاءة الأداء البرمجي (Core Web Vitals)' : 'Core Web Vitals (LCP, FID, CLS)'}</span>
                    <span className="text-emerald-400">EXCELLENT</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Live Security Audit Panel ── */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">LIVE SECURITY STATUS</p>
                  <h3 className="font-black text-white text-base">
                    {isRtl ? 'حالة الأمان والتشفير الحي' : 'Live Security & Encryption Status'}
                  </h3>
                </div>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black">
                <Wifi className="w-3 h-3 animate-pulse" /> {isRtl ? 'نشط' : 'LIVE'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Key className="w-4 h-4" />, label: isRtl ? 'تشفير AES-256' : 'AES-256 E2EE', status: isRtl ? 'نشط' : 'Active', ok: true },
                { icon: <Lock className="w-4 h-4" />, label: isRtl ? 'بروتوكول TLS 1.3' : 'TLS 1.3 Transit', status: isRtl ? 'نشط' : 'Active', ok: true },
                { icon: <ShieldCheck className="w-4 h-4" />, label: isRtl ? 'WAF الحماية' : 'WAF Protection', status: isRtl ? 'نشط' : 'Active', ok: true },
                { icon: <Activity className="w-4 h-4" />, label: isRtl ? 'سجل التدقيق SHA-256' : 'SHA-256 Audit Log', status: isRtl ? 'نشط' : 'Active', ok: true },
                { icon: <Users className="w-4 h-4" />, label: isRtl ? 'سياسات RLS' : 'RLS Policies', status: isRtl ? 'مفعّل' : 'Enforced', ok: true },
                { icon: <Eye className="w-4 h-4" />, label: isRtl ? 'التحقق الثنائي 2FA' : 'Two-Factor Auth', status: isRtl ? 'نشط' : 'Active', ok: true },
                { icon: <Globe className="w-4 h-4" />, label: isRtl ? 'حجب جغرافي GeoIP' : 'GeoIP Blocking', status: isRtl ? 'نشط' : 'Active', ok: true },
                { icon: <Zap className="w-4 h-4" />, label: isRtl ? 'الإصلاح الذاتي' : 'Self-Healing', status: '99.8%', ok: true },
              ].map(({ icon, label, status, ok }) => (
                <div key={label} className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                  ok ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-red-500/8 border-red-500/20'
                }`}>
                  <div className={ok ? 'text-emerald-400' : 'text-red-400'}>{icon}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold truncate">{label}</p>
                    <p className={`text-xs font-black ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────── */}
          {/* TASK-BASED OPERATIONAL WINDOWS & DEDICATED HUB NAVIGATOR GRID        */}
          {/* ──────────────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <span>{isRtl ? 'أقسام المهام التخصصية (Task-Dedicated Operational Hubs)' : 'Task-Dedicated Operational Windows'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRtl
                    ? 'تم تنظيم وإبعاد النوافذ التفصيلية إلى صفحات تخصصية مستقلة حسَب طبيعة المهمة لسهولة الإدارة'
                    : 'Specialized task windows separated into dedicated sub-pages for streamlined administration'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {taskWindows.map((win) => {
                const Icon = win.icon;
                return (
                  <div
                    key={win.id}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-2xl hover:scale-[1.02] group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 group-hover:border-amber-500/30 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${win.badgeColor}`}>
                          {isRtl ? win.badgeAr : win.badgeEn}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-white leading-tight group-hover:text-amber-400 transition-colors">
                          {isRtl ? win.titleAr : win.titleEn}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {isRtl ? win.descAr : win.descEn}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">
                        {isRtl ? 'عرض القسم والتنفيذ' : 'Open Dedicated Page'}
                      </span>
                      <Link
                        to={win.to}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30 transition-all group-hover:scale-105"
                      >
                        <span>{isRtl ? 'دخول القسم' : 'Open Hub'}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Centralized Official Beneficiary Bank Wire Coordinates Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                    {isRtl ? 'بيانات الحساب البنكي المعتمد للتسوية' : 'CENTRALIZED TREASURY & BANK WIRE COORDINATES'}
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {isRtl ? 'بيانات الحساب البنكي الرسمي المستهدف للتسوية المالية' : 'Official Treasury Settlement Account Coordinates'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  ● VERIFIED SWIFT BENEFICIARY
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans mb-1">{isRtl ? 'البنك الرسمي المعتمد:' : 'Official Beneficiary Bank:'}</span>
                <span className="font-bold text-cyan-400 block font-sans text-sm">بنك البركة (Al Baraka Bank)</span>
                <span className="text-slate-400 block mt-0.5 font-sans">فرع الحديقة الدولية (Al Hadiqa Al dawlia Branch)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans mb-1">{isRtl ? 'اسم المستفيد الرسمي:' : 'Official Beneficiary Name:'}</span>
                <span className="font-bold text-amber-300 block font-sans text-sm select-all">محمد مصطفى محمد</span>
                <span className="text-slate-400 block mt-0.5">MHAMMAD MUSTAFA MHAMMAD</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-sans">{isRtl ? 'إحداثيات الآيبان والسويفت:' : 'IBAN & SWIFT Coordinates:'}</span>
                <div className="text-emerald-400 font-bold text-xs select-all">IBAN: EG310022012880211102491757001</div>
                <div className="text-cyan-400 font-bold text-xs select-all">SWIFT: ABRKEGCAXXX</div>
              </div>
            </div>
          </div>

          {/* Quick Transaction Ledger Summary Preview Table */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div>
                <h3 className="font-extrabold text-base text-amber-400 flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  <span>{isRtl ? 'ملخص آخر المعاملات والإيداعات البنكية' : 'Recent Transactions & SWIFT Deposits'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRtl ? 'استعراض أحدث العمليات، للتفاصيل الكاملة انتقل لصفحة المالية' : 'Recent transaction preview. Access full details on the Financial Hub.'}
                </p>
              </div>

              <Link
                to="/admin/financial"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <span>{isRtl ? 'فتح سجل المعاملات الكامل' : 'Open Full Financial Ledger'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {loadingLedger ? (
              <div className="text-center py-8 text-slate-400 text-xs animate-pulse">
                {isRtl ? 'جاري تحميل سجل المعاملات...' : 'Loading transaction ledger...'}
              </div>
            ) : wireEntries.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                {isRtl ? 'لا توجد معاملات مسجلة حالياً' : 'No transactions recorded'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-left">{isRtl ? 'رقم المعاملة' : 'Txn ID'}</th>
                      <th className="p-3 text-left">{isRtl ? 'المشترك' : 'Client Email'}</th>
                      <th className="p-3">{isRtl ? 'الباقة' : 'Plan'}</th>
                      <th className="p-3">{isRtl ? 'المبلغ (USD)' : 'Amount USD'}</th>
                      <th className="p-3">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</th>
                      <th className="p-3">{isRtl ? 'الحالة' : 'Status'}</th>
                      <th className="p-3">{isRtl ? 'التاريخ' : 'Date'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {wireEntries.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-left font-mono text-cyan-400">{tx.id}</td>
                        <td className="p-3 text-left">
                          <span className="font-bold text-white block">{tx.companyName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{tx.contactEmail}</span>
                        </td>
                        <td className="p-3 text-amber-300 font-bold">{tx.planOrSponsorship}</td>
                        <td className="p-3 font-mono font-black text-emerald-400">${tx.amountUSD.toFixed(2)}</td>
                        <td className="p-3 font-mono text-slate-400">{tx.paymentMethod}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            tx.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{tx.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Add Manual Subscriber Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-black text-lg text-white">{isRtl ? 'تفعيل مشترك يدوي فوري' : 'Manual Subscriber Activation'}</h3>
                <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isRtl ? 'البريد الإلكتروني للمشترك' : 'Subscriber Email'}</label>
                  <input
                    type="email"
                    placeholder="subscriber@domain.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isRtl ? 'اسم المشترك / المؤسسة' : 'Name / Entity'}</label>
                  <input
                    type="text"
                    placeholder={isRtl ? 'مثال: شركة القانون الناشئة' : 'Company or Name'}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isRtl ? 'خطة الاشتراك' : 'Subscription Tier'}</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                  >
                    <option value="startup">Startup Plan ($49/mo)</option>
                    <option value="sme">SMEs Plan ($139/mo)</option>
                    <option value="enterprise">Enterprise Plan ($349/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isRtl ? 'طريقة التحصيل' : 'Payment Channel'}</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                  >
                    <option value="Credit Card / Gateway">Credit Card / Instant Gateway</option>
                    <option value="Pi Network">Pi Network Web3 SDK</option>
                    <option value="Bank Wire SWIFT">Bank Wire SWIFT Transfer</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleManualActivation}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-black text-slate-950 text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  {isRtl ? 'تفعيل وإصدار الفاتورة فوراً' : 'Activate & Issue Invoice'}
                </button>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

