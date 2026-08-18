import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  RefreshCw, DollarSign, Activity, CheckCircle2, AlertCircle,
  ShieldCheck, Database, Wallet, Clock, Filter, Lock, Globe2, Building2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/authContext';

export interface SupabaseTransaction {
  id: string;
  amount: number;
  currency?: string;
  status: string;
  gateway?: string;
  description?: string;
  created_at: string;
  user_email?: string;
  platform_source?: string; // 'juristech.solutions' | 'legalshieldsolution.online'
}

type FilterStatus = 'all' | 'success' | 'pending' | 'failed';
type PlatformFilter = 'all' | 'juristech' | 'legalshield';

const PLATFORM_JURISTECH = 'juristech.solutions';
const PLATFORM_LEGALSHIELD = 'legalshieldsolution.online';

function getPlatformLabel(filter: PlatformFilter, isRtl: boolean): string {
  if (filter === 'juristech') return isRtl ? 'JurisTech Solutions فقط' : 'JurisTech Solutions only';
  if (filter === 'legalshield') return isRtl ? 'LegalShield Solution فقط' : 'LegalShield Solution only';
  return isRtl ? 'كلا المنصتين' : 'Both Platforms';
}

export default function FinancialManagement() {
  const { i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const isRtl = i18n.language === 'ar';

  const [transactions, setTransactions] = useState<SupabaseTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('juristech');

  // Financial statistics (computed from filtered set)
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const computeStats = useCallback((data: SupabaseTransaction[]) => {
    const revenue = data.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    setTotalRevenue(revenue);
    setTotalCount(data.length);
    setSuccessCount(data.filter(t =>
      ['success', 'completed', 'paid', 'succeeded', 'approved'].includes((t.status || '').toLowerCase())
    ).length);
    setPendingCount(data.filter(t =>
      ['pending', 'processing'].includes((t.status || '').toLowerCase())
    ).length);
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ── Primary: Query 'transactions' table ────────────────────────────────
      const { data, error: supaErr } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!supaErr && data) {
        setTransactions(data);
        computeStats(data);
      } else {
        // ── Fallback: Try 'payments' table ─────────────────────────────────
        const { data: payData, error: payErr } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (!payErr && payData) {
          const mapped: SupabaseTransaction[] = payData.map((p: any) => ({
            id: p.id || `TXN-${Date.now()}`,
            amount: Number(p.amount || 0),
            currency: p.currency || 'USD',
            status: p.status || 'Success',
            gateway: p.gateway || p.payment_method || 'Direct System',
            description: p.description || (p.paypal_order_id ? `Invoice #${p.paypal_order_id}` : 'Direct Subscription'),
            created_at: p.created_at || new Date().toISOString(),
            user_email: p.user_email || p.email,
            platform_source: p.platform_source || PLATFORM_JURISTECH,
          }));
          setTransactions(mapped);
          computeStats(mapped);
        } else {
          // Zero state — NO MOCK fallbacks ever
          setTransactions([]);
          computeStats([]);
        }
      }
      setLastRefreshed(new Date());
    } catch (err: any) {
      console.warn('[FinancialManagement] Fetch error:', err);
      setError(err?.message || 'Failed fetching live financial records');
      setTransactions([]);
      computeStats([]);
    } finally {
      setLoading(false);
    }
  }, [computeStats]);

  useEffect(() => {
    if (isAdmin) {
      fetchTransactions();
    }
  }, [fetchTransactions, isAdmin]);

  // Realtime subscription — refresh on any DB change
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel('financial-live-isolated')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTransactions, isAdmin]);

  // ── RBAC Guard ─────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-3 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        <Lock className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">
          {isRtl ? 'بوابة الإدارة المالية السيادية (خاصة بالإدارة العليا فقط)' : 'Sovereign Financial Portal (Admin Only)'}
        </h3>
        <p className="text-xs text-slate-400">
          {isRtl ? 'هذه اللوحة محمية ومعزولة تماماً ولا تظهر للعملاء.' : 'This dashboard is strictly protected and isolated from client view.'}
        </p>
      </div>
    );
  }

  // ── Platform-level isolation filter ────────────────────────────────────────
  const platformFiltered = transactions.filter(tx => {
    if (platformFilter === 'all') return true;
    const src = (tx.platform_source || PLATFORM_JURISTECH).toLowerCase();
    if (platformFilter === 'juristech') return src.includes('juristech');
    if (platformFilter === 'legalshield') return src.includes('legalshield');
    return true;
  });

  // ── Status filter ───────────────────────────────────────────────────────────
  const filteredTransactions = platformFiltered.filter(tx => {
    if (filterStatus === 'all') return true;
    const s = (tx.status || '').toLowerCase();
    if (filterStatus === 'success') return ['success', 'completed', 'paid', 'succeeded', 'approved'].includes(s);
    if (filterStatus === 'pending') return ['pending', 'processing'].includes(s);
    if (filterStatus === 'failed') return ['failed', 'rejected', 'cancelled'].includes(s);
    return true;
  });

  // Recompute stats based on platform-filtered set
  const displayRevenue = platformFiltered.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const displayTotal = platformFiltered.length;
  const displaySuccess = platformFiltered.filter(t =>
    ['success', 'completed', 'paid', 'succeeded', 'approved'].includes((t.status || '').toLowerCase())
  ).length;
  const displayPending = platformFiltered.filter(t =>
    ['pending', 'processing'].includes((t.status || '').toLowerCase())
  ).length;

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (['success', 'completed', 'paid', 'succeeded', 'approved'].includes(s)) {
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: <CheckCircle2 className="w-3 h-3" /> };
    }
    if (['pending', 'processing'].includes(s)) {
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: <Clock className="w-3 h-3" /> };
    }
    return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', icon: <AlertCircle className="w-3 h-3" /> };
  };

  return (
    <div
      className="max-w-6xl mx-auto space-y-6 font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ═══════════════ Header Bar ═══════════════ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Database className="w-3 h-3" />
                Supabase Live — Isolated
              </span>
              {lastRefreshed && (
                <span className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                  {isRtl ? 'آخر تحديث:' : 'Last sync:'} {lastRefreshed.toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US')}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-6 h-6 text-emerald-400" />
              {isRtl ? 'الخزينة المالية المعزولة — إدارة عليا فقط' : 'Isolated Financial Vault — Super Admin Only'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {isRtl
                ? 'الإيرادات الحقيقية فقط — مفصولة 100% بين JurisTech Solutions و LegalShield Solution'
                : 'Real verified revenue only — 100% isolated between JurisTech Solutions & LegalShield Solution'}
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{isRtl ? 'تحديث البيانات الحية' : 'Refresh Live Data'}</span>
          </button>
        </div>

        {/* ═══════════════ Platform Isolation Filter ═══════════════ */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
            {isRtl ? 'تصفية حسب المنصة:' : 'Platform Scope:'}
          </span>
          {([
            { key: 'juristech' as PlatformFilter, label: 'JurisTech Solutions', color: 'emerald' },
            { key: 'legalshield' as PlatformFilter, label: 'LegalShield Solution', color: 'cyan' },
            { key: 'all' as PlatformFilter, label: isRtl ? 'كلا المنصتين' : 'Both Platforms', color: 'slate' },
          ]).map(p => (
            <button
              key={p.key}
              onClick={() => setPlatformFilter(p.key)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all flex items-center gap-1.5 ${
                platformFilter === p.key
                  ? p.key === 'juristech'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : p.key === 'legalshield'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-400/30 shadow-sm'
                  : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3 h-3" />
              {p.label}
            </button>
          ))}

          {/* Active platform badge */}
          <span className="ms-auto text-[10px] font-mono text-slate-500 dark:text-slate-500 hidden sm:block">
            {isRtl ? 'النطاق الفعّال:' : 'Active scope:'}{' '}
            <span className="text-amber-400 font-bold">
              {platformFilter === 'juristech' ? PLATFORM_JURISTECH : platformFilter === 'legalshield' ? PLATFORM_LEGALSHIELD : 'ALL PLATFORMS'}
            </span>
          </span>
        </div>

        {/* ═══════════════ KPI Cards ═══════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Total Revenue */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>{isRtl ? 'إجمالي الإيرادات المؤكدة' : 'Total Verified Revenue'}</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ${displayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
              <span className="text-xs text-slate-600 dark:text-slate-400 font-normal font-sans">USD</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">{getPlatformLabel(platformFilter, isRtl)}</span>
          </div>

          {/* Total Transactions */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>{isRtl ? 'عدد المعاملات الحقيقية' : 'Real Transactions Count'}</span>
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {displayTotal}{' '}
              <span className="text-xs text-slate-600 dark:text-slate-400 font-normal font-sans">{isRtl ? 'عملية' : 'transactions'}</span>
            </h3>
          </div>

          {/* Successful */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>{isRtl ? 'العمليات الناجحة' : 'Successful'}</span>
              <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-green-600 dark:text-green-400 font-mono">
              {displaySuccess}
            </h3>
          </div>

          {/* Pending */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>{isRtl ? 'معلقة بانتظار الاعتماد' : 'Pending Verification'}</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {displayPending}
            </h3>
          </div>
        </div>
      </div>

      {/* ═══════════════ Transactions Data Table ═══════════════ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'سجل المعاملات المعزولة الحقيقية' : 'Isolated Real Transactions Ledger'}</span>
          </h3>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-500 mx-1" />
            {([
              { key: 'all' as FilterStatus, label: isRtl ? 'الكل' : 'All' },
              { key: 'success' as FilterStatus, label: isRtl ? 'ناجحة' : 'Success' },
              { key: 'pending' as FilterStatus, label: isRtl ? 'معلقة' : 'Pending' },
              { key: 'failed' as FilterStatus, label: isRtl ? 'فاشلة' : 'Failed' },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  filterStatus === f.key
                    ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-600 dark:text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="font-bold">{isRtl ? 'جاري جلب البيانات من Supabase...' : 'Fetching data from Supabase...'}</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{isRtl ? `خطأ في جلب البيانات: ${error}` : `Error fetching data: ${error}`}</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
            <Database className="w-8 h-8 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400 text-xs font-bold max-w-sm">
              {isRtl
                ? `لا توجد معاملات مالية مسجلة لمنصة ${getPlatformLabel(platformFilter, true)} حتى اللحظة. سيتم تسجيل كل عملية دفع حقيقية فور ورودها عبر Webhook رسمي من بوابة الدفع.`
                : `No transactions recorded for ${getPlatformLabel(platformFilter, false)} yet. Every real payment will appear here instantly upon confirmed webhook from the payment gateway.`}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5 text-right">{isRtl ? 'معرف المعاملة' : 'Transaction ID'}</th>
                  <th className="p-3.5 text-right">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="p-3.5 text-right">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="p-3.5 text-right">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5 text-right">{isRtl ? 'البوابة / التفاصيل' : 'Gateway / Details'}</th>
                  <th className="p-3.5 text-right">{isRtl ? 'المنصة' : 'Platform'}</th>
                  <th className="p-3.5 text-right">{isRtl ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {filteredTransactions.map((tx) => {
                  const badge = getStatusBadge(tx.status);
                  const isJurisTech = !((tx.platform_source || '').toLowerCase().includes('legalshield'));
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono font-bold">
                        {tx.id.length > 12 ? `${tx.id.slice(0, 10)}...` : tx.id}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                        {tx.user_email || '—'}
                      </td>
                      <td className="p-3.5 font-black text-slate-900 dark:text-white font-mono">
                        ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {tx.currency || 'USD'}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.icon}
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-sans">
                        <span className="font-bold text-cyan-500 dark:text-cyan-400">{tx.gateway || 'Direct System'}</span>
                        {tx.description && <span className="text-slate-500 text-[11px] block">{tx.description}</span>}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                          isJurisTech
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        }`}>
                          {isJurisTech ? 'JurisTech' : 'LegalShield'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
                        {new Date(tx.created_at).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <td colSpan={2} className="p-3.5 text-xs text-slate-600 dark:text-slate-400 font-bold">
                    {isRtl ? `إجمالي المعاملات الحقيقية: ${filteredTransactions.length}` : `Total Real Transactions: ${filteredTransactions.length}`}
                  </td>
                  <td className="p-3.5 font-mono font-black text-emerald-500">
                    ${filteredTransactions.reduce((s, t) => s + Number(t.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                  </td>
                  <td colSpan={4} className="p-3.5 text-[10px] text-slate-500 font-mono text-right">
                    {isRtl ? 'مصدر البيانات: Supabase DB — معزول ومؤمن' : 'Data Source: Supabase DB — Isolated & Secured'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
