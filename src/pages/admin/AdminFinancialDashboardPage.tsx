/**
 * AdminFinancialDashboardPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Professional Financial & Subscription Management Dashboard
 * Super Admin restricted dashboard for real-time revenue, active paid users count,
 * transaction ledger, lifecycle extensions, and global production cache flushes.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DollarSign, Users, ShieldCheck, Lock, Activity, RefreshCw, Filter, Search,
  Calendar, CheckCircle2, AlertTriangle, Clock, Download, ArrowUpRight, Zap,
  Globe, Trash2, Eye, Shield, Send, CreditCard, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/authContext';
import Forbidden403Page from '../Forbidden403Page';
import AdminNavSubbar from '../../components/AdminNavSubbar';
import {
  getFinancialSummary, getStoredTransactions, getStoredSubscriptions,
  activateUserSubscription, extendSubscriptionDays, cancelSubscriptionNow,
  clearGlobalProductionCache, purgeAndSanitizeFinancialData, BillingTransaction, UserSubscription, FinancialSummary
} from '../../lib/financialGateway';
import DigitalInvoiceModal from '../../components/DigitalInvoiceModal';
import SwiftReceiptUploaderModal from '../../components/SwiftReceiptUploaderModal';
import { getFinancialRepositoryRecords, migrateHistoricalFinancialReceipts } from '../../lib/financialRepository';
import { swiftVaultService } from '../../services/swiftVaultService';

export default function AdminFinancialDashboardPage() {
  const { i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const isRtl = i18n.language === 'ar';

  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Pending' | 'Failed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [repoCount, setRepoCount] = useState(0);
  
  const [selectedInvoiceTxn, setSelectedInvoiceTxn] = useState<BillingTransaction | null>(null);
  const [showSwiftUploader, setShowSwiftUploader] = useState(false);
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [cacheFlushMessage, setCacheFlushMessage] = useState<string | null>(null);

  // Quick manual user activation modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPlan, setNewPlan] = useState<'pro' | 'enterprise'>('pro');
  const [newMethod, setNewMethod] = useState<'Bank Wire SWIFT' | 'Credit Card / Gateway' | 'Pi Network'>('Bank Wire SWIFT');

  const loadGatewayData = () => {
    purgeAndSanitizeFinancialData();
    migrateHistoricalFinancialReceipts();
    const sum = getFinancialSummary(timeframe);
    const txns = getStoredTransactions();
    const subs = getStoredSubscriptions();
    const repoRecords = getFinancialRepositoryRecords();

    setSummary(sum);
    setTransactions(txns);
    setSubscriptions(subs);
    setRepoCount(repoRecords.length);
  };

  useEffect(() => {
    loadGatewayData();
  }, [timeframe]);

  if (!isAdmin) {
    return <Forbidden403Page />;
  }

  const filteredTransactions = transactions.filter((t) => {
    let matchesStatus = false;
    if (statusFilter === 'All') matchesStatus = true;
    else if (statusFilter === 'Success') {
      matchesStatus = ['Success', 'Completed', 'Paid', 'Transferred'].includes(t.status);
    } else {
      matchesStatus = t.status === statusFilter;
    }

    const matchesSearch =
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleManualActivation = async () => {
    if (!newEmail || !newEmail.includes('@')) return;
    const amount = newPlan === 'enterprise' ? 499.99 : 49.99;
    const { transaction } = await activateUserSubscription({
      userEmail: newEmail,
      userName: newName || newEmail.split('@')[0],
      planId: newPlan,
      paymentMethod: newMethod,
      amountUSD: amount,
    });

    setShowAddUserModal(false);
    setNewEmail('');
    setNewName('');
    loadGatewayData();
    setSelectedInvoiceTxn(transaction);
  };

  const handleExtend = (email: string) => {
    extendSubscriptionDays(email, 30);
    loadGatewayData();
  };

  const handleCancel = (email: string) => {
    cancelSubscriptionNow(email);
    loadGatewayData();
  };

  const handleFlushCache = () => {
    setIsFlushingCache(true);
    setTimeout(() => {
      const res = clearGlobalProductionCache();
      setIsFlushingCache(false);
      setCacheFlushMessage(isRtl ? `تم مسح الكاش بنجاح في: ${res.timestamp}` : `Global production cache flushed at: ${res.timestamp}`);
      loadGatewayData();
      setTimeout(() => setCacheFlushMessage(null), 4000);
    }, 1000);
  };

  const activeRevenue = timeframe === 'Daily' ? summary?.dailyRevenueUSD
    : timeframe === 'Weekly' ? summary?.weeklyRevenueUSD
    : timeframe === 'Monthly' ? summary?.monthlyRevenueUSD
    : summary?.yearlyRevenueUSD;

  return (
    <>
      <AdminNavSubbar />
      <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
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
          loadGatewayData();
          setCacheFlushMessage(isRtl ? 'تم أرشفة السويفت البنكي بنجاح وتحديث الحسابات!' : 'SWIFT receipt archived successfully!');
          setTimeout(() => setCacheFlushMessage(null), 4000);
        }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Production Global Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-black uppercase tracking-wider mb-2">
              <DollarSign className="w-4 h-4" />
              <span>{isRtl ? 'لوحة الإدارة المالية وبوابة تفعيل الاشتراكات' : 'Financial & Billing Gateway Engine'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {isRtl ? 'المالية ومتابعة أداء المشتركين الحقيقيين' : 'Financial & Subscription Administration'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isRtl ? 'https://www.juristech.solutions — تتبع الإيرادات، التفعيل التلقائي، وسجل المدفوعات' : 'Real-time billing gateway, automated user activation, and revenue telemetry.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/admin/receipt-review"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 border border-amber-400/40"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{isRtl ? 'تدقيق السويفت والتحكم بالاحتيال' : 'Audit SWIFT Receipts & Fraud Control'}</span>
            </Link>

            <button
              onClick={() => setShowSwiftUploader(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 border border-cyan-400/40"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>{isRtl ? 'إرفاق سويفت بنكي جديد' : 'Upload SWIFT Wire Receipt'}</span>
            </button>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>{isRtl ? 'تفعيل مشترك يدوي جديد' : 'Manual Activate Subscriber'}</span>
            </button>

            <button
              onClick={() => {
                const res = purgeAndSanitizeFinancialData();
                setCacheFlushMessage(isRtl ? `تم تطهير وتنظيف ${res.purgedCount} معاملة وهمية بنجاح!` : `Purged ${res.purgedCount} dummy records successfully!`);
                loadGatewayData();
                setTimeout(() => setCacheFlushMessage(null), 4000);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold text-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'تطهير وتنظيف السجلات الوهمية' : 'Purge Dummy Financial Data'}</span>
            </button>

            <button
              onClick={handleFlushCache}
              disabled={isFlushingCache}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-extrabold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFlushingCache ? 'animate-spin' : ''}`} />
              <span>{isFlushingCache ? (isRtl ? 'جاري المسح...' : 'Flushing...') : (isRtl ? 'مسح الكاش والتحديث الحي' : 'Clear Cache & CDN Flush')}</span>
            </button>
          </div>
        </div>

        {cacheFlushMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{cacheFlushMessage}</span>
          </div>
        )}

        {/* Unified Sovereign Treasury & Centralized Bank Account Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                  {isRtl ? 'نظام الخزينة والتدقيق المالي الموحد' : 'CENTRALIZED TREASURY & BANK INTEGRATION'}
                </span>
                <h3 className="text-lg font-black text-white">
                  {isRtl ? 'الخزينة المالية الموحدة والربط البنكي المعتمد' : 'Unified Sovereign Treasury Ledger'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>Primary Domain: https://www.juristech.solutions</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>301 Redirect: Active</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans mb-1">{isRtl ? 'البنك الرسمي المعتمد للمحولات:' : 'Official Beneficiary Bank:'}</span>
              <span className="font-bold text-cyan-400 block font-sans text-sm">بنك البركة (Al Baraka Bank)</span>
              <span className="text-slate-400 block mt-0.5 font-sans">فرع الحديقة الدولية (Al Hadiqa Al dawlia Branch)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans mb-1">{isRtl ? 'اسم المستفيد الرسمي (Beneficiary):' : 'Official Beneficiary Name:'}</span>
              <span className="font-bold text-amber-300 block font-sans text-sm">محمد مصطفى محمد</span>
              <span className="text-slate-400 block mt-0.5">MHAMMAD MUSTAFA MHAMMAD</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans mb-1">{isRtl ? 'معلومات الآيبان والسويفت (IBAN & SWIFT):' : 'IBAN & SWIFT Coordinates:'}</span>
              <div className="text-emerald-400 font-bold">IBAN: <span className="select-all">EG310022012880211102491757001</span></div>
              <div className="text-cyan-400 font-bold mt-0.5">SWIFT: <span>ABRKEGCAXXX</span></div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf === 'Daily' ? (isRtl ? 'اليوم' : 'Daily')
                : tf === 'Weekly' ? (isRtl ? 'الأسبوع' : 'Weekly')
                : tf === 'Monthly' ? (isRtl ? 'الشهر' : 'Monthly')
                : (isRtl ? 'السنة' : 'Yearly')}
            </button>
          ))}
        </div>

        {/* Real-time KPI Financial Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Active Paid Users Count Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'عدد المشتركين الفعليين (Paid)' : 'Active Paid Users Count'}</span>
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">
              {summary?.activePaidUsersCount ?? 0}
            </span>
            <span className="text-[11px] text-emerald-400 font-mono block">
              {isRtl ? 'حسابات نشطة ومفعلة تلقائياً' : 'Automated active accounts'}
            </span>
          </div>

          {/* Revenue by Timeframe Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? `إيرادات التحصيل (${timeframe})` : `${timeframe} Revenue`}</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-emerald-400 block mt-1 font-mono">
              ${activeRevenue?.toFixed(2) ?? '0.00'} USD
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isRtl ? `مبيعات النطاق الزمني المحدد (${timeframe})` : `Calculated for ${timeframe} scope`}
            </span>
          </div>

          {/* Total Gross Revenue Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'إجمالي المبيعات التراكمية' : 'Total Gross Lifetime'}</span>
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-3xl font-black text-indigo-400 block mt-1 font-mono">
              ${summary?.totalRevenueUSD.toFixed(2) ?? '0.00'} USD
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isRtl ? 'إجمالي الحركات الناجحة' : 'Successful Lifetime Transactions'}
            </span>
          </div>

          {/* Transaction Status Telemetry Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>{isRtl ? 'حالة حركات المعاملات' : 'Transaction Telemetry'}</span>
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-bold text-emerald-400">
                ✅ {summary?.successCount} {isRtl ? 'مدفوع/مكتمل' : 'Paid'}
              </span>
              <span className="text-xs font-bold text-amber-400">
                ⏳ {summary?.pendingCount} {isRtl ? 'معلق' : 'Pending'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isRtl ? 'ربط آلي بـ Gateway & SWIFT Wire' : 'Gateway & Pi Network integrated'}
            </span>
          </div>

        </div>

        {/* Interactive SVG Financial Growth & Gateway Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? 'مخطط اتجاه الإيرادات والنمو التراكمي' : 'Revenue Growth & Settlement Trendline'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRtl ? 'تحليل مسار التحصيلات المعتمدة وتوزيع الاشتراكات.' : 'Real-time telemetry of subscription settlements.'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-cyan-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Pro ($49.99)</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Enterprise ($499.99)</span>
            </div>
          </div>

          <div className="h-44 w-full bg-slate-950/60 rounded-2xl p-4 border border-slate-800 flex items-end justify-between gap-2 overflow-hidden relative">
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 500 150">
              <path d="M 0 120 Q 100 80, 200 90 T 400 40 T 500 20 L 500 150 L 0 150 Z" fill="url(#cyanGradient)" />
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {[
              { month: 'Jan', val: 40, plan: 'pro' },
              { month: 'Feb', val: 55, plan: 'pro' },
              { month: 'Mar', val: 35, plan: 'ent' },
              { month: 'Apr', val: 70, plan: 'pro' },
              { month: 'May', val: 85, plan: 'ent' },
              { month: 'Jun', val: 65, plan: 'pro' },
              { month: 'Jul', val: 90, plan: 'ent' },
              { month: 'Aug', val: 100, plan: 'ent' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end z-10">
                <div
                  style={{ height: `${bar.val}%` }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-all hover:brightness-125 shadow-lg ${
                    bar.plan === 'ent' ? 'bg-gradient-to-t from-amber-600 to-amber-400' : 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                  }`}
                />
                <span className="text-[10px] font-mono text-slate-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Beneficiary Bank Wire Coordinates Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 shadow-2xl font-mono text-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-cyan-500/20 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block">
                  {isRtl ? 'بيانات الحساب البنكي الرسمي المعتمد للتسوية المالية' : 'Official Corporate Beneficiary Bank Wire Account'}
                </span>
                <span className="text-[10px] text-cyan-400 font-sans">
                  {isRtl ? 'حساب الاستقبال المباشر لجميع تحويلات وإيرادات منصة JurisTech Solutions' : 'Direct settlement account for all platform wire transfers'}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              ● VERIFIED ACTIVE BENEFICIARY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono pt-1">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">{isRtl ? 'اسم البنك' : 'Bank Name'}</span>
              <span className="font-bold text-cyan-400 block mt-0.5 font-sans">بنك البركة (Al Baraka Bank)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">{isRtl ? 'اسم المستفيد' : 'Beneficiary Name'}</span>
              <span className="font-bold text-white block mt-0.5 select-all">محمد مصطفى محمد</span>
              <span className="text-[9px] text-slate-400 block font-mono">Mhammad Mustafa Mhammad</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">{isRtl ? 'الفرع والعنوان' : 'Branch & Address'}</span>
              <span className="font-bold text-amber-300 block mt-0.5 font-sans">EGY, Cairo, SHAA 2</span>
              <span className="text-[9px] text-slate-400 block font-sans">فرع الحديقة الدولية (Al Hadiqa Al dawlia Branch)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">IBAN:</span>
                <span className="font-extrabold text-amber-400 block select-all text-[11px]">EG310022012880211102491757001</span>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">SWIFT:</span>
                <span className="font-extrabold text-cyan-400 block select-all text-[11px]">ABRKEGCAXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Lifecycle Monitor Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>{isRtl ? 'متابعة دورة حياة اشتراكات المستخدمين (Subscription Lifecycle)' : 'Active Subscriptions & Expiry Lifecycle'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl ? 'مراقبة التجديدات التلقائية والتاريخ المتبقي وإمكانية التمديد الفوري' : 'Monitor subscription start/end dates, days remaining, and manual extensions.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 text-left">{isRtl ? 'المشترك' : 'Subscriber'}</th>
                  <th className="p-3.5">{isRtl ? 'الباقة' : 'Tier'}</th>
                  <th className="p-3.5">{isRtl ? 'تاريخ البدء' : 'Start Date'}</th>
                  <th className="p-3.5">{isRtl ? 'تاريخ الانتهاء' : 'End Date'}</th>
                  <th className="p-3.5">{isRtl ? 'الأيام المتبقية' : 'Days Left'}</th>
                  <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5 text-left">{isRtl ? 'إجراءات الإدارة' : 'Admin Controls'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 text-left">
                      <span className="font-bold text-slate-900 dark:text-white block">{sub.userName}</span>
                      <span className="text-[11px] font-mono text-cyan-400">{sub.userEmail}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        sub.tier === 'Enterprise' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {sub.tier}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{sub.startDate}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">{sub.endDate}</td>
                    <td className="p-3.5 font-mono">
                      <span className={`font-bold ${sub.daysLeft <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {sub.daysLeft} {isRtl ? 'يوم' : 'days'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : sub.status === 'Pending Renewal' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-left">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleExtend(sub.userEmail)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all"
                          title={isRtl ? 'تمديد 30 يوم' : '+30 Days Extension'}
                        >
                          {isRtl ? 'تمديد +30' : '+30 Days'}
                        </button>
                        <button
                          onClick={() => handleCancel(sub.userEmail)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold transition-all"
                          title={isRtl ? 'إلغاء الاشتراك' : 'Cancel Subscription'}
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complete Transaction Ledger */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl p-6 space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>{isRtl ? 'سجل المعاملات المالي المكتمل (Complete Transaction Ledger)' : 'Transaction History & Receipt Log'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl ? 'سجل تفصيلي بأسماء الماليين، طريقة الدفع، المبالغ، الختم الرقمي الفوري والفواتير' : 'Comprehensive audit trail of all paid, pending, & failed client billing records.'}
              </p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={isRtl ? 'بحث باسم المشترك، البريد، الفاتورة...' : 'Search email, name, invoice...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
              >
                <option value="All">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="Success">{isRtl ? 'مدفوع ومكتمل (Paid / Completed)' : 'Paid / Transferred'}</option>
                <option value="Pending">{isRtl ? 'معلقة (Pending)' : 'Pending'}</option>
                <option value="Failed">{isRtl ? 'معطلة أو ملغاة (Failed / Cancelled)' : 'Failed'}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 text-left">{isRtl ? 'رقم الفاتورة / المعاملة' : 'Invoice / TXN ID'}</th>
                  <th className="p-3.5 text-left">{isRtl ? 'المشترك والبريد' : 'User Email & Name'}</th>
                  <th className="p-3.5">{isRtl ? 'الباقة' : 'Plan'}</th>
                  <th className="p-3.5">{isRtl ? 'المبلغ (USD)' : 'Amount USD'}</th>
                  <th className="p-3.5">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</th>
                  <th className="p-3.5">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="p-3.5 text-left">{isRtl ? 'الفاتورة' : 'Invoice'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 text-left font-mono">
                      <span className="font-bold text-cyan-400 block">{txn.invoiceId}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{txn.id}</span>
                    </td>
                    <td className="p-3.5 text-left">
                      <span className="font-bold text-slate-900 dark:text-white block">{txn.userName}</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{txn.userEmail}</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{txn.planName}</td>
                    <td className="p-3.5 font-mono font-black text-emerald-400">${txn.amountUSD.toFixed(2)}</td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{txn.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        ['Success', 'Completed', 'Paid', 'Transferred'].includes(txn.status) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : txn.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{txn.createdAt.substring(0, 10)}</td>
                    <td className="p-3.5 text-left">
                      <button
                        onClick={() => setSelectedInvoiceTxn(txn)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-400 transition-colors"
                        title={isRtl ? 'عرض الفاتورة الرسمية' : 'View Invoice'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Manual Subscriber Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">{isRtl ? 'تفعيل مشترك يدوي فوري' : 'Manual Subscriber Activation'}</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{isRtl ? 'البريد الإلكتروني للمشترك' : 'Subscriber Email'}</label>
                <input
                  type="email"
                  placeholder="subscriber@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{isRtl ? 'اسم المشترك / المؤسسة' : 'Name / Entity'}</label>
                <input
                  type="text"
                  placeholder={isRtl ? 'مثال: شركة القانون الناشئة' : 'Company or Name'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{isRtl ? 'خطة الاشتراك' : 'Subscription Tier'}</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="pro">Pro Plan ($49.99/mo)</option>
                  <option value="enterprise">Enterprise Plan ($499.99/yr)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{isRtl ? 'طريقة التحصيل' : 'Payment Channel'}</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
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
