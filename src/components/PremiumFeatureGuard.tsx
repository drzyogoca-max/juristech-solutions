/**
 * src/components/PremiumFeatureGuard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Locks sovereign legal AI features for non-subscribers with high-conversion CTA.
 */

import React, { useState } from 'react';
import { Lock, Crown, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { usePlatformLocale } from '../lib/universalTranslator';
import { PADDLE_CONFIG } from '../lib/paddleClient';

interface Props {
  children: React.ReactNode;
  featureNameEn?: string;
  featureNameAr?: string;
  requiredTier?: 'Startup' | 'SMEs' | 'Pro' | 'Enterprise';
}

export default function PremiumFeatureGuard({
  children,
  featureNameEn = 'Enterprise Sovereign Legal AI',
  featureNameAr = 'الذكاء الاصطناعي القانوني السيادي للمؤسسات',
  requiredTier = 'Pro',
}: Props) {
  const { isSubscriber, tier, subscribeWithPaddle } = useSubscription();
  const { l, isRtl } = usePlatformLocale();
  const [subscribing, setSubscribing] = useState(false);

  if (isSubscriber) {
    return <>{children}</>;
  }

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      await subscribeWithPaddle('pro');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="relative min-h-[450px] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-6 sm:p-10 flex flex-col items-center justify-center text-center">
      {/* Blurred background teaser */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950/80 to-slate-950 pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-500/5">
          <Crown className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{l(`ميزة حصرية للمشتركين (${requiredTier})`, `Subscriber-Only Feature (${requiredTier})`)}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {l(featureNameAr, featureNameEn)}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {l(
              'هذه الميزة تتطلب اشتراكاً نشطاً. اشترك الآن ببطاقة الائتمان عبر Paddle بضمان استرداد وأمان مصرفي كامل.',
              'This enterprise AI capability requires an active subscription. Subscribe now via Paddle with instant activation and full buyer protection.'
            )}
          </p>
        </div>

        {/* Feature bullets */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-start space-y-2 text-xs text-slate-300">
          {[
            { ar: 'محرك Google AI Pro السيادي وتحليل العقود بـ 8 محاور', en: 'Google AI Pro Sovereign Core & 8-Axis Contract Analysis' },
            { ar: 'محاكاة النزاعات القضائية والتفاوض الآلي', en: 'Virtual Dispute Simulation & Autonomous Negotiation' },
            { ar: 'تصدير وثائق Word & PDF غير محدود وسجلات مشفرة', en: 'Unlimited Word/PDF Document Generation & Cryptographic Logs' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{l(item.ar, item.en)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{subscribing ? l('جاري فتح نافذة الدفع...', 'Opening Checkout...') : l('اشترك الآن فوراً (Paddle)', 'Subscribe Now (Paddle)')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Merchant of Record: Paddle</span>
          </span>
          <span>·</span>
          <span>Price: $49/mo</span>
        </div>
      </div>
    </div>
  );
}
