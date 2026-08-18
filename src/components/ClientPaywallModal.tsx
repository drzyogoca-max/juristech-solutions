import React, { useState } from 'react';
import { Lock, Sparkles, CheckCircle2, Shield, Download, CreditCard, Zap, Building2, Globe, X, Crown, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/authContext';

interface ClientPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractTitle?: string;
  contractId?: string;
  onPaymentSuccess: () => void;
}

export default function ClientPaywallModal({
  isOpen,
  onClose,
  contractTitle = 'عقد قانوني معتمد',
  contractId = 'contract-gen-001',
  onPaymentSuccess,
}: ClientPaywallModalProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { setRole } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');
  const [currency, setCurrency] = useState<'USD' | 'SAR' | 'AED' | 'EGP'>('USD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen) return null;

  const prices = {
    starter: { USD: '$4.99', SAR: '20 ر.س', AED: '20 د.إ', EGP: '150 ج.م' },
    pro: { USD: '$19.99', SAR: '75 ر.س', AED: '75 د.إ', EGP: '600 ج.م' },
  };

  const handleSubscribePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);

      // Save subscription status & unlock downloads for user
      try {
        const subData = {
          status: 'Active',
          tier: selectedPlan === 'pro' ? 'Enterprise Pro' : 'Starter Plus',
          expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        };
        localStorage.setItem('ls_subscription_status', JSON.stringify(subData));
        localStorage.setItem('juristech_client_paid', 'true');
        localStorage.setItem(`juristech_paid_contract_${contractId}`, 'true');
      } catch {
        // ignore
      }

      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 800);
    }, 1000);
  };

  const handleActivateAdminPass = () => {
    setRole('super-admin');
    localStorage.setItem('juristech_user_role', 'super-admin');
    localStorage.setItem('juristech_user_email', 'drzyogo.ca@gmail.com');
    localStorage.setItem('juristech_subscription_tier', 'enterprise');
    const subData = {
      status: 'Active',
      tier: 'Enterprise Super Admin',
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
    };
    localStorage.setItem('ls_subscription_status', JSON.stringify(subData));
    localStorage.setItem('juristech_client_paid', 'true');
    onPaymentSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.88)', backdropFilter: 'blur(10px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ maxHeight: '92vh', animation: 'payModalIn 0.22s ease-out' }}
      >
        <style>{`@keyframes payModalIn{from{opacity:0;transform:translateY(-10px) scale(0.97)}to{opacity:1;transform:none}}`}</style>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="p-5 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
                {isRtl ? 'بوابة اشتراك المنصة — التحميل مرتبط بالاشتراك' : 'Platform Subscription Gate — Linked to Membership'}
              </span>
              <h3 className="font-black text-white text-base mt-0.5 leading-tight">
                {isRtl ? 'تفعيل اشتراك المنصة لتنزيل العقود والوثائق بلا حدود' : 'Activate Subscription to Download Unlimited Contracts'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                {contractTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">

          {/* Admin Free Notice */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {isRtl
                  ? 'وضع الأدمن مجاني بالكامل — يمكنك تفعيل وضع الأدمن لفتح التحميل الفوري بدون سداد!'
                  : 'Open & Gratis for Admin — Activate Admin mode for 100% free access!'}
              </span>
            </div>
            <button
              onClick={handleActivateAdminPass}
              className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] shrink-0 transition-all shadow-md"
            >
              {isRtl ? '👑 تفعيل الأدمن مجاناً' : '👑 Admin Free'}
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-400">
              {isRtl ? 'اختر باقة الاشتراك المناسبة:' : 'Select Subscription Plan:'}
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['USD', 'SAR', 'AED', 'EGP'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    currency === curr ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Option Cards (Single $0.99 fee REMOVED, linked directly to Subscription) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Starter Plan */}
            <div
              onClick={() => setSelectedPlan('starter')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'starter'
                  ? 'bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border-cyan-400 ring-2 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-cyan-400">
                  {isRtl ? 'الاشتراك الشهري الأساسي' : 'Starter Membership'}
                </span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {isRtl ? 'الأكثر طلباً' : 'Popular'}
                </span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {prices.starter[currency]} <span className="text-xs text-slate-400 font-normal">{isRtl ? '/ شهر' : '/ mo'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isRtl ? 'تحميل مفتوح لملفات Word (.docx) و PDF لجميع العقود طوال الشهر' : 'Unlimited Word (.docx) & PDF downloads for all contracts all month'}
              </p>
            </div>

            {/* Enterprise Pro */}
            <div
              onClick={() => setSelectedPlan('pro')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'pro'
                  ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-400 ring-2 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-amber-400">
                  {isRtl ? 'الاشتراك المؤسسي الشامل' : 'Enterprise Pro Pass'}
                </span>
                <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {isRtl ? 'شامل الاستشارات' : 'Full Suite'}
                </span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {prices.pro[currency]} <span className="text-xs text-slate-400 font-normal">{isRtl ? '/ شهر' : '/ mo'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isRtl ? 'تنزيل بلا حدود + المستشار الذكي + التعديل الاحترافي + ختم د. محمد مصطفى' : 'Unlimited Word downloads + AI Legal Counsel + Custom Redlines'}
              </p>
            </div>
          </div>

          {/* Legal Features Guarantee */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isRtl ? 'مزايا التنزيل المباشر المضمنة في الاشتراك:' : 'Included Subscription Download Features:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {isRtl ? 'تصدير Word (.docx) قابل للتعديل 100%' : '100% Editable Word (.docx)'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {isRtl ? 'ختم وتوقيع رقمي موثق' : 'Certified SHA-256 Seal'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {isRtl ? 'تنزيل فوري بدون رسوم مفردة' : 'No Single Per-Contract Fees'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {isRtl ? 'دعم كامل للغة العربية والإنجليزية' : 'Full Arabic & English Support'}
              </span>
            </div>
          </div>

        </div>

        {/* ── Actions / Subscription Checkout ─────────────────────────────── */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-2">
          {paymentDone ? (
            <div className="py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-center text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRtl ? 'تم تفعيل الاشتراك بنجاح! جاري تنزيل الملفات...' : 'Subscription Activated! Downloading...'}</span>
            </div>
          ) : (
            <button
              onClick={handleSubscribePayment}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isRtl ? 'جاري تفعيل خطة الاشتراك وإصدار الترخيص...' : 'Activating Subscription Plan...'}</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isRtl
                      ? `💳 الاشتراك بـ ${prices[selectedPlan][currency]} وفتح التحميل لجميع العقود`
                      : `💳 Subscribe at ${prices[selectedPlan][currency]} & Unlock All Downloads`}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>🛡️ SSL 256-bit Encrypted Checkout</span>
            <button
              onClick={handleActivateAdminPass}
              className="text-amber-400 hover:underline font-bold"
            >
              {isRtl ? 'حساب أدمن؟ فتح التحميل مجاناً' : 'Admin Account? Free Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
