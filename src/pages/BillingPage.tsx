/**
 * src/pages/BillingPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Account Billing & Paddle Subscription Management
 * Route: /billing
 */

import React, { useState } from 'react';
import {
  CreditCard, Crown, Calendar, ShieldCheck, AlertCircle, RefreshCw,
  XCircle, CheckCircle2, FileText, Download, Zap, ExternalLink, Sparkles,
  ToggleLeft, ToggleRight, ArrowRight, Shield
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { useAuth } from '../lib/authContext';
import { PADDLE_CONFIG, togglePaddleEnvironment } from '../lib/paddleClient';
import { getStoredTransactions, BillingTransaction } from '../lib/financialGateway';
import DigitalInvoiceModal from '../components/DigitalInvoiceModal';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function BillingPage() {
  const { isSubscriber, tier, status, daysLeft, startDate, endDate, paymentMethod, paddleData, cancelSubscription, subscribeWithPaddle, refresh } = useSubscription();
  const { user } = useAuth();
  const { l, isRtl } = usePlatformLocale();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<BillingTransaction | null>(null);

  const transactions = getStoredTransactions();
  const currentEnv = PADDLE_CONFIG.environment;

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      await subscribeWithPaddle('pro');
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubscription();
      setCancelModalOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const isPaddleActive = paddleData?.status === 'active';
  const isCancelled = status === 'Cancelled' || paddleData?.status === 'canceled';

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO
        title={`${isRtl ? 'إدارة الاشتراك والفوترة' : 'Billing & Subscription'} | JURISTECH`}
        description="Manage your JURISTECH sovereign AI subscription, billing details, and invoices."
      />

      {/* Invoice Modal */}
      {activeInvoice && (
        <DigitalInvoiceModal
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
          transaction={activeInvoice}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white">
                {l('تأكيد إلغاء التجديد التلقائي؟', 'Confirm Subscription Cancellation?')}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {l(
                  'سيظل بإمكانك استخدام الميزات المدفوعة حتى نهاية فترة الفوترة الحالية. لن يتم تحصيل أي مبالغ جديدة مستقبلاً.',
                  'Your paid features remain accessible until the end of your billing cycle. No further automatic charges will occur.'
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                {l('التراجع', 'Keep Subscription')}
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold transition-all cursor-pointer"
              >
                {cancelling ? l('جاري الإلغاء...', 'Cancelling...') : l('تأكيد الإلغاء', 'Cancel Now')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{l('بوابة الدفع والفوترة الرسمية', 'Official Merchant Billing Portal')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {l('إدارة الاشتراك والفوترة', 'Account Billing & Subscription')}
            </h1>
            <p className="text-xs text-slate-400">
              {user?.email || localStorage.getItem('juristech_last_login_email') || 'client@juristech.solutions'}
            </p>
          </div>

          {/* Paddle Environment Mode Switcher */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Paddle:</span>
            <button
              onClick={() => togglePaddleEnvironment(currentEnv === 'sandbox' ? 'live' : 'sandbox')}
              className={`px-3 py-1 rounded-xl font-bold font-mono transition-all cursor-pointer ${
                currentEnv === 'live'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
              }`}
            >
              {currentEnv === 'live' ? '🟢 Live Production' : '🟡 Sandbox Testing'}
            </button>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                    {l('الخطة الحالية', 'Current Active Plan')}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {tier} Legal AI Retainer
                  </h3>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                status === 'Active'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : isCancelled
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-red-500/20 border-red-500/40 text-red-300'
              }`}>
                {status === 'Active' ? '● Active' : isCancelled ? '● Cancelled' : '● Expired'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">{l('قيمة الاشتراك', 'Plan Amount')}</span>
                <span className="font-mono font-bold text-white text-sm">$49.00 / mo</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">{l('تاريخ البدء', 'Start Date')}</span>
                <span className="font-mono text-slate-300">{startDate}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">{l('تاريخ التجديد', 'Renewal Date')}</span>
                <span className="font-mono font-bold text-cyan-400">{endDate}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">{l('الأيام المتبقية', 'Days Remaining')}</span>
                <span className="font-mono font-black text-amber-400">{daysLeft} days</span>
              </div>
            </div>

            {/* Paddle Technical Details */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Paddle Price ID:</span>
                <span className="text-sky-300 font-bold">{PADDLE_CONFIG.priceId}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Paddle Product ID:</span>
                <span className="text-slate-300">{PADDLE_CONFIG.productId}</span>
              </div>
              {paddleData?.subscriptionId && (
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subscription ID:</span>
                  <span className="text-emerald-400">{paddleData.subscriptionId}</span>
                </div>
              )}
              {paddleData?.customerId && (
                <div className="flex items-center justify-between text-slate-400">
                  <span>Customer ID:</span>
                  <span className="text-slate-300">{paddleData.customerId}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isSubscriber || isCancelled ? (
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{subscribing ? l('جاري الفتح...', 'Opening...') : l('تفعيل / تجديد الاشتراك (Paddle Checkout)', 'Subscribe Now (Paddle Checkout)')}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{l('ترقية الخطة أو تحديث البطاقة', 'Upgrade / Update Payment')}</span>
                  </button>

                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{l('إلغاء التجديد', 'Cancel Subscription')}</span>
                  </button>
                </>
              )}

              <Link
                to="/pricing"
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <span>{l('مقارنة الخطط الكاملة', 'View All Plans')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Guarantee & Support Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-black text-white text-base">
                {l('ضمان الأمان والتاجر المعتمد', 'Merchant of Record Protection')}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {l(
                  'تُدار جميع المدفوعات والاشتراكات عبر Paddle.com كتاجر سجل معتمد دولياً (Merchant of Record) مع تشفير بنكي TLS 1.3 وحماية كاملة للمشتري.',
                  'All digital software subscription payments are securely processed through Paddle.com as the authorized Merchant of Record with automated tax compliance.'
                )}
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{l('تفعيل فوري لكافة محركات الذكاء الاصطناعي', 'Instant access to all Sovereign AI Engines')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{l('إلغاء الاشتراك بنقرة واحدة في أي وقت', 'One-click cancellation anytime')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><Link to="/refund" className="text-sky-400 underline">{l('سياسة استرداد عادلة ومحمية', 'Protected Refund Policy')}</Link></span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              <span>{l('دعم الفوترة والاسترداد:', 'Billing & Refund Support:')} </span>
              <a href="mailto:juristech.solutions@outlook.com" className="text-sky-400 hover:underline">juristech.solutions@outlook.com</a>
            </div>
          </div>
        </div>

        {/* Invoices & Transaction History */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white">
                {l('سجل الفواتير والمعاملات المشفرة', 'Invoice History & Cryptographic Receipts')}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">SHA-256 Verified</span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                {l('لا توجد فواتير سابقة حتى الآن. ستظهر الفواتير فور إتمام عملية الدفع.', 'No invoices yet. Your receipts will appear here after your first transaction.')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-start font-mono">
                    <th className="pb-3 text-start">Invoice ID</th>
                    <th className="pb-3 text-start">Plan</th>
                    <th className="pb-3 text-start">Amount</th>
                    <th className="pb-3 text-start">Method</th>
                    <th className="pb-3 text-start">Date</th>
                    <th className="pb-3 text-start">Status</th>
                    <th className="pb-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-bold text-white">{tx.invoiceId}</td>
                      <td className="py-3 text-slate-300">{tx.planName}</td>
                      <td className="py-3 font-bold text-emerald-400">${tx.amountUSD.toFixed(2)}</td>
                      <td className="py-3 text-slate-400">{tx.paymentMethod}</td>
                      <td className="py-3 text-slate-500">{tx.createdAt.substring(0, 10)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        <button
                          onClick={() => setActiveInvoice(tx)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-bold flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>{l('عرض الفاتورة', 'Invoice')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
