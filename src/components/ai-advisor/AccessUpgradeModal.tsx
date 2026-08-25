import React from 'react';
import { Lock, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import type { SupportedAILang, UserTier } from '../../ai/types';

interface AccessUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier: UserTier;
  featureName: string;
  onUpgrade: (tier: 'startup' | 'sme' | 'enterprise' | 'pro') => void;
  lang: SupportedAILang;
  isRtl: boolean;
}

export const AccessUpgradeModal: React.FC<AccessUpgradeModalProps> = ({
  isOpen,
  onClose,
  requiredTier,
  featureName,
  onUpgrade,
  lang,
  isRtl,
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const tierMap: Record<UserTier, { name: string; price: string; planKey: 'startup' | 'sme' | 'enterprise' | 'pro' }> = {
    free: { name: 'Free Trial', price: '$0', planKey: 'startup' },
    startup: { name: 'Startup Tier', price: '$19 / mo', planKey: 'startup' },
    sme: { name: 'SME Professional', price: '$49 / mo', planKey: 'sme' },
    pro: { name: 'Pro Counsel', price: '$99 / mo', planKey: 'pro' },
    enterprise: { name: 'Enterprise Corporate', price: '$299 / mo', planKey: 'enterprise' },
    lawyer: { name: 'Lawyer Suite', price: '$99 / mo', planKey: 'pro' },
    admin: { name: 'Master Sovereign', price: '$299 / mo', planKey: 'enterprise' },
  };

  const targetTier = tierMap[requiredTier] || tierMap.startup;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {isAr ? 'ترقية الباقة مطلوبة لتفعيل هذه الميزة' : 'Subscription Upgrade Required'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? `الميزة المطلوبة (${featureName}) تتطلب باقة ${targetTier.name} أو أعلى للوصول الكامل.`
              : `The requested capability (${featureName}) requires ${targetTier.name} or higher to access full institutional intelligence.`}
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
              {isAr ? 'الباقة المقترحة' : 'Recommended Tier'}
            </span>
            <span className="text-sm font-bold text-white">{targetTier.name}</span>
          </div>
          <span className="text-base font-extrabold text-cyan-300 font-mono">{targetTier.price}</span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
          >
            {isAr ? 'لاحقاً' : 'Cancel'}
          </button>
          <button
            onClick={() => {
              onClose();
              onUpgrade(targetTier.planKey);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'ترقية الآن' : 'Upgrade Now'}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
