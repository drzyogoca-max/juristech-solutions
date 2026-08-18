import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldAlert, Zap, Lock, ArrowRight, Mail, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import BinancePayBox from './BinancePayBox';

export interface SubscriptionPaywallModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const SubscriptionPaywallModal: React.FC<SubscriptionPaywallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  if (!isOpen) return null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white font-sans overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button if dismissable */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ── Badge & Title ── */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <h3 dir="auto" className="text-2xl font-black text-white">
            {isRtl
              ? 'انتهت الاستشارات المجانية (Free Trial Quota Reached)'
              : 'Free Trial Quota Exhausted'}
          </h3>

          <p dir="auto" className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {isRtl
              ? 'لقد استنفدت الحد المجاني للخدمة. أتمم اشتراكك الآن للحصول على وصول كامل وغير محدود لكافة الخدمات القانونية وحزم الذكاء الاصطناعي:'
              : 'You have used all free trial queries. Upgrade your account now for unlimited AI legal advisory, contract drafting, and risk auditing:'}
          </p>
        </div>

        {/* ── Payment Gateways ── */}
        <div className="my-4">
          <BinancePayBox showTonWallet={true} />
        </div>

        {/* ── Action: Go to Subscription Page ── */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/payment"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl transition-all transform hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4" />
            <span dir="auto">
              {isRtl ? 'انتقال لصفحة الاشتراك الفوري' : 'Go to Instant Subscription'}
            </span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>

          {/* ── Support Ticket / Official Email Escalation ── */}
          <Link
            to="/support"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-black text-xs sm:text-sm rounded-xl transition-all hover:scale-[1.02]"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span dir="auto">
              {isRtl
                ? '✉️ الدعم الفني المشفر (Drzyogo.ca@gmail.com)'
                : '✉️ Encrypted Support (Drzyogo.ca@gmail.com)'}
            </span>
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </Link>
        </div>

        {/* ── Legal Disclaimer ── */}
        <p dir="auto" className="mt-5 text-center text-[10px] text-slate-500 leading-relaxed">
          {isRtl
            ? '⚖️ منصة JurisTech Solutions — كيان قانوني وتقني مستقل.'
            : '⚖️ JurisTech Solutions — Independent Autonomous Legal Tech Entity.'}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPaywallModal;
