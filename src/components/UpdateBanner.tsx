/**
 * UpdateBanner.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Floating update notification banner.
 * Appears when a new platform version is detected.
 * Supports RTL (Arabic) and LTR, all 7 platform languages.
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, X, Sparkles, Zap, Download } from 'lucide-react';
import { useUpdateNotifier } from '../lib/useUpdateNotifier';

const LANG_STRINGS: Record<string, { title: string; body: string; cta: string; dismiss: string }> = {
  ar: {
    title: 'تحديث جديد متاح! 🚀',
    body: 'تم نشر تحديثات جديدة على المنصة. اضغط للتحديث الفوري وتجربة أحدث الميزات.',
    cta: 'تحديث الآن',
    dismiss: 'لاحقاً',
  },
  en: {
    title: 'New Update Available! 🚀',
    body: 'A new platform version has been deployed. Tap to update instantly and get the latest features.',
    cta: 'Update Now',
    dismiss: 'Later',
  },
  fr: {
    title: 'Mise à jour disponible ! 🚀',
    body: 'Une nouvelle version a été déployée. Appuyez pour mettre à jour et accéder aux dernières fonctionnalités.',
    cta: 'Mettre à jour',
    dismiss: 'Plus tard',
  },
  de: {
    title: 'Neues Update verfügbar! 🚀',
    body: 'Eine neue Plattformversion wurde bereitgestellt. Tippen Sie, um sofort zu aktualisieren.',
    cta: 'Jetzt aktualisieren',
    dismiss: 'Später',
  },
  es: {
    title: '¡Nueva actualización disponible! 🚀',
    body: 'Se ha implementado una nueva versión. Toca para actualizar al instante.',
    cta: 'Actualizar ahora',
    dismiss: 'Más tarde',
  },
  zh: {
    title: '新版本可用！🚀',
    body: '平台已发布新版本。点击立即更新以获取最新功能。',
    cta: '立即更新',
    dismiss: '稍后',
  },
  tr: {
    title: 'Yeni Güncelleme Mevcut! 🚀',
    body: 'Yeni bir platform sürümü yayınlandı. Anında güncellemek için dokunun.',
    cta: 'Şimdi Güncelle',
    dismiss: 'Sonra',
  },
};

export default function UpdateBanner() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { hasUpdate, newVersion, currentVersion, applyUpdate, dismiss } = useUpdateNotifier();
  const [applying, setApplying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const lang = LANG_STRINGS[i18n.language] ?? LANG_STRINGS.en;

  // Animate in
  useEffect(() => {
    if (hasUpdate) {
      setVisible(true);
      // Auto-apply after 30s countdown
      setCountdown(30);
    }
  }, [hasUpdate]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || !hasUpdate) return;
    if (countdown <= 0) {
      handleApply();
      return;
    }
    const t = setTimeout(() => setCountdown(c => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown, hasUpdate]);

  if (!hasUpdate || !visible) return null;

  async function handleApply() {
    setApplying(true);
    setCountdown(null);
    await applyUpdate();
  }

  function handleDismiss() {
    setVisible(false);
    dismiss();
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-4 ${isRtl ? 'left-4' : 'right-4'} z-[9999] max-w-sm w-full sm:max-w-md
        animate-in slide-in-from-bottom-4 duration-500
        bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950
        border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-500/10
        overflow-hidden backdrop-blur-xl`}
    >
      {/* ── Glow pulse border */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-indigo-500/20 pointer-events-none" />
      
      {/* ── Animated top accent bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500">
        {/* countdown fill overlay */}
        {countdown !== null && (
          <div
            className="h-full bg-slate-800/60 transition-none"
            style={{ width: `${(countdown / 30) * 100}%`, float: isRtl ? 'right' : 'left' }}
          />
        )}
      </div>

      <div className="p-4 sm:p-5">
        {/* ── Header row */}
        <div className={`flex items-start justify-between gap-3 mb-3`}>
          <div className={`flex items-center gap-2.5`}>
            {/* Animated icon */}
            <div className="p-2 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{lang.title}</h3>
              <div className={`flex items-center gap-1.5 mt-0.5`}>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 dark:text-slate-400 line-through">{currentVersion}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400">→</span>
                <span className="text-[10px] font-mono font-black text-cyan-400">{newVersion}</span>
              </div>
            </div>
          </div>

          {/* Dismiss X */}
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 transition-all shrink-0 mt-0.5"
            aria-label="dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{lang.body}</p>

        {/* ── Action row */}
        <div className={`flex items-center gap-2`}>
          {/* Primary CTA */}
          <button
            onClick={handleApply}
            disabled={applying}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl
              bg-gradient-to-r from-indigo-500 to-cyan-500
              text-slate-900 dark:text-white font-black text-xs
              hover:opacity-90 active:scale-95 transition-all
              shadow-lg shadow-indigo-500/20
              disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {applying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {isRtl ? 'جارٍ التحديث...' : 'Updating...'}
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                {lang.cta}
                {countdown !== null && (
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-lg font-mono text-[10px]">
                    {countdown}s
                  </span>
                )}
              </>
            )}
          </button>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white font-bold text-xs transition-all"
          >
            {lang.dismiss}
          </button>
        </div>

        {/* ── What's new micro list */}
        <div className={`mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-400`}>
          <Download className="w-3 h-3 shrink-0" />
          <span>
            {isRtl
              ? 'تشمل: رادار ذكي محسّن، أنيميشن تدريبي، محرك تخصيص AI، وتحسينات SEO.'
              : 'Includes: Enhanced Smart Radar, training animation, AI personalization engine, and SEO improvements.'}
          </span>
        </div>
      </div>
    </div>
  );
}
