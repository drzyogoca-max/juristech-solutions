import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Type, Check, X, Sparkles, Sun, Moon, Maximize2, Save } from 'lucide-react';
import {
  THEME_BACKGROUNDS,
  APP_FONTS,
  FONT_SIZE_LABELS,
  ThemeBackground,
  AppFont,
  ThemeMode,
  FontSizeScale,
  getSavedThemeConfig,
  applyThemeConfig,
  syncThemeToSupabase,
} from '../lib/themeSettings';
import { supabase } from '../lib/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeFontSelectorModal({ isOpen, onClose }: Props) {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.language === 'ar';


  const [mode, setMode] = useState<ThemeMode>('dark');
  const [activeBg, setActiveBg] = useState<ThemeBackground>('cyber-slate');
  const [activeFont, setActiveFont] = useState<AppFont>('Cairo');
  const [activeFontSize, setActiveFontSize] = useState<FontSizeScale>('md');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSavedThemeConfig();
      setMode(config.mode);
      setActiveBg(config.bgId);
      setActiveFont(config.fontId);
      setActiveFontSize(config.fontSize);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function updateConfig(newMode: ThemeMode, newBg: ThemeBackground, newFont: AppFont, newSize: FontSizeScale) {
    setMode(newMode);
    setActiveBg(newBg);
    setActiveFont(newFont);
    setActiveFontSize(newSize);
    applyThemeConfig({ mode: newMode, bgId: newBg, fontId: newFont, fontSize: newSize });
    
    // Auto-sync with logged in user if active
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        syncThemeToSupabase(data.user.id, { mode: newMode, bgId: newBg, fontId: newFont, fontSize: newSize });
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  function handleToggleMode(targetMode: ThemeMode) {
    const fallbackBg = targetMode === 'light' ? 'clean-light' : 'cyber-slate';
    updateConfig(targetMode, fallbackBg, activeFont, activeFontSize);
  }

  function handleSelectBg(bgKey: ThemeBackground) {
    const bgMeta = THEME_BACKGROUNDS[bgKey];
    updateConfig(bgMeta.mode, bgKey, activeFont, activeFontSize);
  }

  function handleSelectFont(fontKey: AppFont) {
    updateConfig(mode, activeBg, fontKey, activeFontSize);
  }

  function handleSelectFontSize(sizeKey: FontSizeScale) {
    updateConfig(mode, activeBg, activeFont, sizeKey);
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl shadow-slate-900/20 dark:shadow-slate-950/90 relative max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                {t('Theme.subtitle')}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {t('Theme.title')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('Common.close')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* 1. Theme Mode Switcher (Dark vs Light) */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{isRtl ? 'وضع الإضاءة والنمط البصري (Light / Dark Mode):' : 'Appearance Light / Dark Mode:'}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleToggleMode('dark')}
              className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                mode === 'dark'
                  ? 'bg-slate-950 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="font-extrabold text-xs block">{isRtl ? 'الوضع المعتم (Dark Mode)' : 'Dark Mode'}</span>
                  <span className="text-[10px] opacity-70 block">{isRtl ? 'مظهر سلايت ورؤية سيبرانية فخمة' : 'Cyber Slate & Obsidian'}</span>
                </div>
              </div>
              {mode === 'dark' && <Check className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => handleToggleMode('light')}
              className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                mode === 'light'
                  ? 'bg-sky-50 border-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                  : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="font-extrabold text-xs block">{isRtl ? 'الوضع المضيء (Light Mode)' : 'Light Mode'}</span>
                  <span className="text-[10px] opacity-70 block">{isRtl ? 'إضاءة ناصعة ومريحة للقراءة' : 'Clean & Parchment Light'}</span>
                </div>
              </div>
              {mode === 'light' && <Check className="w-4 h-4 text-sky-600" />}
            </button>
          </div>
        </div>

        {/* 2. Font Size Scaling */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-emerald-500" />
            <span>{isRtl ? 'حجم الخط ومقياس القراءة (Font Size Scale):' : 'Legal Typography Scale:'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(FONT_SIZE_LABELS) as FontSizeScale[]).map((sizeKey) => {
              const meta = FONT_SIZE_LABELS[sizeKey];
              const isSelected = activeFontSize === sizeKey;
              return (
                <button
                  key={sizeKey}
                  onClick={() => handleSelectFontSize(sizeKey)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{isRtl ? meta.nameAr : meta.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Font Selection Grid */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-500" />
            <span>{isRtl ? 'اختر خط القراءة القانوني المفضل (Typography Font):' : 'Select Legal Typography Font:'}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(APP_FONTS) as AppFont[]).map((fontKey) => {
              const font = APP_FONTS[fontKey];
              const isSelected = activeFont === fontKey;
              return (
                <button
                  key={fontKey}
                  onClick={() => handleSelectFont(fontKey)}
                  style={{ fontFamily: font.fontFamily }}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">{isRtl ? font.nameAr : font.nameEn}</span>
                    <span className="text-[10px] text-slate-500 font-sans block">{font.category}</span>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Background Themes Grid */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-500" />
            <span>{isRtl ? 'اختر النمط الملون للخلفية (UI Accent Theme):' : 'Select UI Accent Theme:'}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(THEME_BACKGROUNDS) as ThemeBackground[])
              .filter((bgKey) => THEME_BACKGROUNDS[bgKey].mode === mode)
              .map((bgKey) => {
                const bg = THEME_BACKGROUNDS[bgKey];
                const isSelected = activeBg === bgKey;
                return (
                  <button
                    key={bgKey}
                    onClick={() => handleSelectBg(bgKey)}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-900 dark:text-cyan-300 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: bg.accentColor }}
                      />
                      <span className="text-xs">{isRtl ? bg.nameAr : bg.nameEn}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono">
            {isSaved && <Save className="w-4 h-4 animate-bounce" />}
            <span>{isRtl ? 'تم تطبيق وحفظ التفضيلات فورياً' : 'Preferences saved & applied'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all"
          >
            {isRtl ? 'تأكيد وإغلاق' : 'Apply & Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
