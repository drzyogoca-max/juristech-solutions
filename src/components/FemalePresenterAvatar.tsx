import React from 'react';
import { Sparkles, Mic, Volume2 } from 'lucide-react';

interface FemalePresenterAvatarProps {
  isSpeaking: boolean;
  selectedLang: string;
  currentScript: string;
  badgeText?: string;
}

export default function FemalePresenterAvatar({
  isSpeaking,
  selectedLang,
  currentScript,
  badgeText = 'سارة — الشارحة الرقمية بالذكاء الاصطناعي',
}: FemalePresenterAvatarProps) {
  const isRtl = selectedLang === 'ar';

  return (
    <div
      className="relative flex flex-col md:flex-row items-center gap-4 bg-slate-900/90 border border-cyan-500/40 p-4 sm:p-5 rounded-3xl backdrop-blur-xl shadow-2xl transition-all duration-500"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 4K HD Animated Female Presenter Avatar Image & Glow Frame */}
      <div className="relative group shrink-0">
        {/* Animated Cyber Ring / Speaker Pulse */}
        <div
          className={`absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 blur-md transition-opacity duration-300 ${
            isSpeaking ? 'opacity-90 animate-pulse' : 'opacity-40'
          }`}
        />

        {/* Presenter Portrait Container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-2xl bg-slate-950 flex items-center justify-center">
          <img
            src="/female_avatar_portrait.webp"

            alt="AI Female Presenter Sarah"
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isSpeaking ? 'scale-105 contrast-110' : 'scale-100 filter brightness-95'
            }`}

            onError={(e) => {
              // Fallback to stylized SVG if image missing
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Speaking Lip-Sync / Wave Indicator Overlay */}
          {isSpeaking && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-400/60 shadow-lg">
              <span className="w-1 h-3 bg-cyan-400 animate-bounce rounded-full" />
              <span className="w-1 h-4 bg-amber-300 animate-pulse rounded-full" />
              <span className="w-1 h-2 bg-emerald-400 animate-bounce rounded-full" />
            </div>
          )}
        </div>

        {/* Live Mic Indicator Badge */}
        <div
          className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border shadow-md transition-colors ${
            isSpeaking
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-ping-once'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Presenter Speech Bubble & Bio Header */}
      <div className="flex-1 space-y-2 text-center md:text-right">
        <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-black font-mono shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>{isRtl ? 'سارة | الشارحة الرقمية (أنيميشن)' : 'Sarah | AI Presenter Girl (Animated)'}</span>
          </span>

          {isSpeaking && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold animate-pulse">
              <Volume2 className="w-3 h-3" />
              <span>{isRtl ? 'تتحدث الآن...' : 'Speaking Live...'}</span>
            </span>
          )}
        </div>

        {/* Subtitle / Script Bubble */}
        <div className="relative bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-inner">
          <p className="text-xs sm:text-sm text-cyan-200 font-medium leading-relaxed font-sans">
            "{currentScript}"
          </p>
        </div>
      </div>
    </div>
  );
}
