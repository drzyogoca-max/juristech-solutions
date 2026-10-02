/**
 * src/components/GumroadPayModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Gumroad Sovereign Card & Apple Pay Payment Modal
 * Provides 100% real, immediate credit card & Apple Pay checkout without requiring
 * company registration, powered by Gumroad as Merchant of Record (MoR).
 */

import React, { useState } from 'react';
import {
  X, CreditCard, ShieldCheck, Lock, ExternalLink, Sparkles, CheckCircle2,
  Building2, Smartphone, Zap, MessageSquare, ArrowRight, Settings2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  GUMROAD_PLANS,
  getGumroadCheckoutUrl,
  openGumroadCheckout,
  setGumroadCustomUrl
} from '../lib/gumroadGateway';

interface PlanProps {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  price: number | string;
  description?: string;
}

interface GumroadPayModalProps {
  isOpen: boolean;
  plan: PlanProps;
  onClose: () => void;
  onSelectAlternative?: (method: 'wire' | 'binance' | 'instapay' | 'proforma') => void;
}

export default function GumroadPayModal({
  isOpen,
  plan,
  onClose,
  onSelectAlternative
}: GumroadPayModalProps) {
  const { l, isRtl } = usePlatformLocale();
  const [email, setEmail] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const planConfig = GUMROAD_PLANS[plan.id] || GUMROAD_PLANS.startup;
  const currentCheckoutUrl = getGumroadCheckoutUrl(plan.id, { email: email.trim() });
  const numericPrice = typeof plan.price === 'number'
    ? plan.price
    : parseFloat(String(plan.price).replace(/[^0-9.]/g, '')) || planConfig.priceUSD;

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openGumroadCheckout(plan.id, { email: email.trim() });
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setGumroadCustomUrl(plan.id, customUrl.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base sm:text-lg">
                  {l('الدفع المباشر بالبطاقة الائتمانية و Apple Pay', 'Direct Card Checkout & Apple Pay')}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live MoR Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {l(
                  `بوابة دفع فورية ومعتمدة عالمياً (Visa, Mastercard, AMEX)`,
                  `Global instant card processing (Visa, Mastercard, AMEX, Apple Pay)`
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plan Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                {l('الباقة المختارة:', 'Selected Plan:')}
              </span>
              <h4 className="text-base font-black text-white">
                {isRtl ? (plan.nameAr || plan.name) : (plan.nameEn || plan.name)}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-cyan-400 font-mono">
                ${numericPrice}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {l('/ شهرياً', '/ month')}
              </span>
            </div>
          </div>

          {/* Trust & Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{l('تسوية فورية بنكية بدون متطلبات تسجيل شركات', 'Instant settlement with zero company registration required')}</span>
            </div>
            <p className="leading-relaxed text-slate-300 text-[11px]">
              {l(
                'تتم المعالجة المالية بأعلى معايير الأمان المصرفي TLS 1.3 وتشفير AES-256 عبر بوابة Gumroad المعتمدة كوسيط مالي عالمي (Merchant of Record). يتم تفعيل اشتراكك فوراً بعد نجاح العملية.',
                'Payments are securely processed via Gumroad as global Merchant of Record with TLS 1.3 and AES-256 encryption. Your subscription activates instantly upon checkout.'
              )}
            </p>
          </div>

          {/* Accepted Badges */}
          <div className="flex items-center justify-center gap-3 py-1 text-slate-400 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
              💳 Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
              🍏 Apple Pay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
              🤖 Google Pay
            </span>
          </div>

          {/* Buyer Email Input for Pre-filling */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              {l('البريد الإلكتروني لتلقي إيصال السداد والترخيص:', 'Email address for license & receipt delivery:')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. client@company.com"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <span className="text-[10px] text-slate-500 block">
              {l('سيتم تمرير بريدك الإلكتروني تلقائياً لصفحة الدفع لتسهيل العملية.', 'Your email will be automatically prefilled in the checkout form.')}
            </span>
          </div>

          {/* Primary Action Button */}
          <a
            href={currentCheckoutUrl}
            onClick={handleCheckoutClick}
            data-gumroad-single-product="true"
            className="gumroad-button w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>{l(`إتمام الدفع الآمن الآن بالبطاقة ($${numericPrice} USD)`, `Proceed to Secure Card Checkout ($${numericPrice} USD)`)}</span>
            <ExternalLink className="w-4 h-4 text-slate-950" />
          </a>

          {/* Assisted Checkout / Alternative Channels */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{l('أو سدد عبر القنوات البديلة:', 'Or choose an alternative channel:')}</span>
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Settings2 className="w-3 h-3" />
                <span>{l('رابط مخصص', 'Custom Link')}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSelectAlternative) onSelectAlternative('binance');
                }}
                className="py-2 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Smartphone className="w-3 h-3 text-amber-400" />
                <span>Binance Pay</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSelectAlternative) onSelectAlternative('wire');
                }}
                className="py-2 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Building2 className="w-3 h-3 text-sky-400" />
                <span>SWIFT Wire</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSelectAlternative) onSelectAlternative('instapay');
                }}
                className="py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>InstaPay</span>
              </button>
            </div>
          </div>

          {/* Custom Link Configuration Section (Expandable) */}
          {showConfig && (
            <form onSubmit={handleSaveCustomUrl} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">
                  {l('تخصيص رابط Gumroad المباشر لهذه الباقة:', 'Custom Gumroad Link for this tier:')}
                </span>
                {savedSuccess && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    ✓ {l('تم الحفظ بنجاح', 'Saved')}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder={planConfig.defaultPermalink}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  {l('سيتم استخدامه فوراً عند نقر العميل على الدفع بالبطاقة', 'Applied immediately for all card checkouts')}
                </span>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  {l('حفظ الرابط', 'Save Link')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
