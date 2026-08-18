import { useTranslation } from 'react-i18next';
import { Lock, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrialUpgradeModalProps {
  onClose?: () => void;
}

export default function TrialUpgradeModal({ onClose }: TrialUpgradeModalProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  function handleUpgradeClick() {
    if (onClose) onClose();
    navigate('/payment');
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {isRtl ? 'وصلت للحد الأقصى للتجربة المجانية' : 'Trial Limit Reached'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'انتهت الجلسة التجريبية المحدودة' : 'Upgrade to Continue Usage'}
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {isRtl
              ? 'لقد استنفدت عدد محاولات التجربة المجانية (محاولتان فقط). اشترك الآن في إحدى الباقات الاحترافية للاستفادة الكاملة وغير المحدودة.'
              : 'You have reached the free trial limit (2 trials). Upgrade your plan to enjoy unlimited AI legal advisory & contract generation.'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgradeClick}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 font-extrabold text-slate-950 text-sm transition-all shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>{isRtl ? 'ترقية الاشتراك والوصول الكامل' : 'Upgrade Subscription Plan'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              {isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
