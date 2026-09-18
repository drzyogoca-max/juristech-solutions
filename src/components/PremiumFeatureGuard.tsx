/**
 * src/components/PremiumFeatureGuard.tsx
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * JurisTech Solutions â€” SaaS Feature Gating Guard
 * Sprint 04B Phase 1: Frontend UX Gating
 *
 * Tier Hierarchy:
 *   Free Trial (0) < Startup (1) < SMEs (2) < Enterprise (3)
 *
 * Enforcement Source:
 *   Strictly useSubscription() & useAuth() â€” ZERO localStorage authority.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, LogIn } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../lib/authContext';
import { usePlatformLocale } from '../lib/universalTranslator';
import CustomerAuthModal from './CustomerAuthModal';

export type GatedTier = 'Free Trial' | 'Startup' | 'SMEs' | 'Pro' | 'Enterprise';

export const TIER_WEIGHTS: Record<string, number> = {
  'Free Trial': 0,
  'Startup': 1,
  'SMEs': 2,
  'Pro': 2,
  'Enterprise': 3,
};

interface Props {
  children: React.ReactNode;
  featureNameEn?: string;
  featureNameAr?: string;
  requiredTier?: GatedTier;
}

export default function PremiumFeatureGuard({
  children,
  featureNameEn = 'Enterprise Sovereign Legal AI',
  featureNameAr = 'الذكاء الاصطناعي القانوني السيادي للمؤسسات',
  requiredTier = 'Startup',
}: Props) {
  const { user, isAdmin, isLawyer } = useAuth();
  const { tier, isSubscriber } = useSubscription();
  const { l } = usePlatformLocale();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Privileged override: System administrators and verified lawyers bypass restrictions
  if (isAdmin || isLawyer) {
    return <>{children}</>;
  }

  // Tier-based evaluation
  const userRank = TIER_WEIGHTS[tier] ?? 0;
  const requiredRank = TIER_WEIGHTS[requiredTier] ?? 1;

  // Unauthenticated guests cannot access Startup+ or higher paid features
  const isAuthenticated = Boolean(user);
  const isAuthorized = isAuthenticated && userRank >= requiredRank;

  if (isAuthorized) {
    return <>{children}</>;
  }

  const handleSubscribe = () => {
    navigate(`/payment?plan=${requiredTier.toLowerCase()}`);
  };

  return (
    <>
      <div className="relative w-full rounded-[2rem] overflow-hidden border border-slate-700/80 bg-[#0b1020] p-5 sm:p-8 lg:p-10 flex flex-col items-center justify-center text-center shadow-[0_24px_80px_-32px_rgba(15,23,42,0.9)]">
        {/* Blurred background teaser */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),transparent_48%),linear-gradient(180deg,#0f172a 0%,#0b1020 100%)] pointer-events-none z-0" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900/90 border border-amber-400/30 text-amber-300 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{l(`ميزة حصرية لباقة (${requiredTier}) فأعلى`, `Exclusive Feature (${requiredTier}+)`)}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {l(featureNameAr, featureNameEn)}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {!isAuthenticated
                ? l(
                    `هذه الميزة تتطلب تسجيل الدخول واشتراكًا نشطًا في باقة ${requiredTier} فأعلى. سجّل دخولك الآن للاستفادة الكاملة مع حماية وأمان مصرفي شامل.`,
                    `This capability requires signing in with an active ${requiredTier} plan or higher. Sign in or register now for instant access.`
                  )
                : l(
                    `باقتك الحالية هي (${tier}). للوصول إلى هذه الميزة يرجى الترقية إلى باقة (${requiredTier}) للاستفادة من قدرات التحليل والتدقيق المتقدمة.`,
                    `Your current plan is (${tier}). Upgrade to the ${requiredTier} plan to unlock advanced statutory analysis and unlimited execution.`
                  )}
            </p>
          </div>

          {/* Feature bullets */}
          <div className="grid gap-2.5 sm:grid-cols-3 p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-700/80 text-start text-xs text-slate-300">
            {[
              { ar: 'فحص وتدقيق تشريعي دقيق عبر الحدود وفق أطر القوانين الموضوعية المعتمدة', en: 'Statutory cross-border audit under certified substantive legal codes' },
              { ar: 'محاكاة النزاعات وتحديد مصائد المسؤولية المالية غير المحدودة', en: 'Dispute simulation & uncapped liability trap diagnostics' },
              { ar: 'تصدير وثائق Word وPDF رسمية مع أختام مشفرة بـ SHA-256', en: 'Official Word & PDF document generation with SHA-256 digital seals' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{l(item.ar, item.en)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{l('تسجيل الدخول / إنشاء حساب', 'Sign In / Register to Access')}</span>
                </button>
                <button
                  onClick={handleSubscribe}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{l('عرض الباقات والأسعار', 'View Pricing Plans')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleSubscribe}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{l(`ترقية إلى باقة ${requiredTier}`, `Upgrade to ${requiredTier}`)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{l('تشفير بنكي TLS 1.3 وحماية كاملة', 'TLS 1.3 Bank-Grade Encryption')}</span>
            </span>
            <span>·</span>
            <span>{l('تفعيل فوري معتمد', 'Verified Instant Activation')}</span>
          </div>
        </div>
      </div>

      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
