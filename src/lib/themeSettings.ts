/**
 * themeSettings.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Advanced User Appearance & Theme Customization System
 * Features:
 *  • Dark / Light Mode Toggle with root HTML class manipulation
 *  • Typography Customization across 7 Legal & Corporate fonts
 *  • Font Scale Leveling (Small 14px, Medium 16px, Large 18px, XL 20px)
 *  • LocalStorage & Supabase User Profile Synchronization
 */

import { supabase } from './supabaseClient';

export type ThemeMode = 'dark' | 'light';
export type ThemeBackground = 'cyber-slate' | 'midnight-obsidian' | 'emerald-stealth' | 'royal-navy' | 'dark-purple' | 'clean-light' | 'warm-paper';
export type AppFont = 'Cairo' | 'Amiri' | 'Tajawal' | 'Readex Pro' | 'Inter' | 'Outfit' | 'Roboto';
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeConfig {
  mode: ThemeMode;
  bgId: ThemeBackground;
  fontId: AppFont;
  fontSize: FontSizeScale;
}

export const FONT_SIZE_LABELS: Record<FontSizeScale, { nameAr: string; nameEn: string; px: string }> = {
  sm: { nameAr: 'صغير (14px)', nameEn: 'Small (14px)', px: '14px' },
  md: { nameAr: 'متوسط (16px - الافتراضي)', nameEn: 'Medium (16px - Default)', px: '16px' },
  lg: { nameAr: 'كبير (18px - مريح)', nameEn: 'Large (18px - Comfortable)', px: '18px' },
  xl: { nameAr: 'كبير جداً (20px - واضح)', nameEn: 'Extra Large (20px - Sharp)', px: '20px' },
};

export const THEME_BACKGROUNDS: Record<ThemeBackground, { nameAr: string; nameEn: string; bgClass: string; accentColor: string; mode: ThemeMode }> = {
  'cyber-slate': {
    nameAr: 'سلايت سيبراني (داكن)',
    nameEn: 'Cyber Slate Dark',
    bgClass: 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100',
    accentColor: '#06b6d4',
    mode: 'dark',
  },
  'midnight-obsidian': {
    nameAr: 'أوبسيديان منتصف الليل (ذهبي)',
    nameEn: 'Deep Midnight Obsidian',
    bgClass: 'bg-neutral-950 text-amber-50',
    accentColor: '#f59e0b',
    mode: 'dark',
  },
  'emerald-stealth': {
    nameAr: 'زمردي فخم (قانوني)',
    nameEn: 'Emerald Stealth Legal',
    bgClass: 'bg-emerald-950/90 text-emerald-50',
    accentColor: '#10b981',
    mode: 'dark',
  },
  'royal-navy': {
    nameAr: 'أزرق ملكي بحري',
    nameEn: 'Royal Sapphire Navy',
    bgClass: 'bg-blue-950/95 text-blue-50',
    accentColor: '#3b82f6',
    mode: 'dark',
  },
  'dark-purple': {
    nameAr: 'أرجواني سيبراني',
    nameEn: 'Cyber Violet International',
    bgClass: 'bg-purple-950/90 text-purple-50',
    accentColor: '#a855f7',
    mode: 'dark',
  },
  'clean-light': {
    nameAr: 'مضيء كلاسيكي (فاتح)',
    nameEn: 'Clean Executive Light',
    bgClass: 'bg-slate-50 text-slate-900',
    accentColor: '#0284c7',
    mode: 'light',
  },
  'warm-paper': {
    nameAr: 'ورقي دافئ (مريح للعين)',
    nameEn: 'Warm Parchment Legal',
    bgClass: 'bg-amber-50/70 text-slate-900',
    accentColor: '#d97706',
    mode: 'light',
  },
};

export const APP_FONTS: Record<AppFont, { nameAr: string; nameEn: string; fontFamily: string; category: string }> = {
  Cairo: {
    nameAr: 'خط القاهرة (Cairo - متوازن وسلس)',
    nameEn: 'Cairo Font (Arabic Balanced)',
    fontFamily: "'Cairo', sans-serif",
    category: 'عصري',
  },
  Amiri: {
    nameAr: 'خط الأميري (Amiri - قانوني أصيل)',
    nameEn: 'Amiri Font (Traditional Legal)',
    fontFamily: "'Amiri', serif",
    category: 'قانوني كلاسيكي',
  },
  Tajawal: {
    nameAr: 'خط تجول (Tajawal - تجاري أنيق)',
    nameEn: 'Tajawal Font (Arabic Corporate)',
    fontFamily: "'Tajawal', sans-serif",
    category: 'تجاري',
  },
  'Readex Pro': {
    nameAr: 'خط ريدكس برو (Readex Pro - حداثي)',
    nameEn: 'Readex Pro (Modern Executive)',
    fontFamily: "'Readex Pro', sans-serif",
    category: 'شركات',
  },
  Inter: {
    nameAr: 'خط إنتر (Inter - عالمي)',
    nameEn: 'Inter Font (Global Minimal)',
    fontFamily: "'Inter', sans-serif",
    category: 'عالمي',
  },
  Outfit: {
    nameAr: 'خط أوتفيت (Outfit - عصري)',
    nameEn: 'Outfit Font (Futuristic)',
    fontFamily: "'Outfit', sans-serif",
    category: 'عصري',
  },
  Roboto: {
    nameAr: 'خط روبوتو (Roboto - تقني)',
    nameEn: 'Roboto Font (Technical)',
    fontFamily: "'Roboto', sans-serif",
    category: 'تقني',
  },
};

export function getSavedThemeConfig(): ThemeConfig {
  try {
    const mode = (localStorage.getItem('juristech_theme_mode') as ThemeMode) || 'dark';
    const bg = (localStorage.getItem('juristech_theme_bg') as ThemeBackground) || (mode === 'light' ? 'clean-light' : 'cyber-slate');
    const font = (localStorage.getItem('juristech_font') as AppFont) || 'Cairo';
    const fontSize = (localStorage.getItem('juristech_font_size') as FontSizeScale) || 'md';
    return { mode, bgId: bg, fontId: font, fontSize };
  } catch {
    return { mode: 'dark', bgId: 'cyber-slate', fontId: 'Cairo', fontSize: 'md' };
  }
}

export function applyThemeConfig(config: ThemeConfig): void {
  try {
    localStorage.setItem('juristech_theme_mode', config.mode);
    localStorage.setItem('juristech_theme_bg', config.bgId);
    localStorage.setItem('juristech_font', config.fontId);
    localStorage.setItem('juristech_font_size', config.fontSize);
  } catch {
    // Ignore storage write error
  }

  if (typeof document !== 'undefined') {
    // 1. Toggle Dark / Light root class
    if (config.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Set Font Family
    const selectedFont = APP_FONTS[config.fontId] || APP_FONTS.Cairo;
    document.documentElement.style.fontFamily = selectedFont.fontFamily;
    document.body.style.fontFamily = selectedFont.fontFamily;

    // 3. Set Font Size Scale
    const pxSize = FONT_SIZE_LABELS[config.fontSize]?.px || '16px';
    document.documentElement.style.fontSize = pxSize;
    document.documentElement.style.setProperty('--user-font-size', pxSize);

    // 4. Update Background theme class
    Object.keys(THEME_BACKGROUNDS).forEach((bgKey) => {
      document.body.classList.remove(`theme-bg-${bgKey}`);
    });
    document.body.classList.add(`theme-bg-${config.bgId}`);
  }
}

export async function syncThemeToSupabase(userId: string, config: ThemeConfig): Promise<void> {
  if (!userId) return;
  try {
    await supabase.from('user_settings').upsert({
      user_id: userId,
      theme_mode: config.mode,
      theme_bg: config.bgId,
      font_family: config.fontId,
      font_size: config.fontSize,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[ThemeSettings] Supabase sync error:', err);
  }
}
