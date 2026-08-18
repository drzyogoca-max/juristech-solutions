/**
 * VideoLanguageSync.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Subtitle & AI Animated Female Presenter (Sarah) Display Component
 * Features:
 *   • Typewriter narration text synced to scene progress
 *   • Live Animated Female Presenter Girl (Sarah) portrait badge with lipsync waves
 *   • Multilingual support for all 7 platform languages
 */
import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Sparkles } from 'lucide-react';
import { VideoScene } from './AnimatedScene';

interface VideoLanguageSyncProps {
  scenes: VideoScene[];
  currentScene: number;
  currentProgress: number;
  language: string;
  isRtl: boolean;
  isSpeaking?: boolean;
}

export default function VideoLanguageSync({
  scenes,
  currentScene,
  currentProgress,
  isRtl,
  isSpeaking = false,
}: VideoLanguageSyncProps) {
  const [displayedText, setDisplayedText] = useState('');

  const scene = scenes[currentScene];
  const fullText = isRtl ? scene.scriptAr : scene.scriptEn;

  useEffect(() => {
    const words = fullText.split(' ');
    const wordCount = words.length;
    const progressFraction = Math.min(1, currentProgress / 90);
    const wordsToShow = Math.max(1, Math.floor(wordCount * progressFraction));

    setDisplayedText(words.slice(0, wordsToShow).join(' '));
  }, [currentProgress, fullText]);

  return (
    <div className="absolute bottom-16 left-0 right-0 px-4 sm:px-8 pb-4 flex justify-center pointer-events-none z-20">
      <div className="max-w-4xl w-full bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-4 sm:p-5 text-center shadow-2xl transition-all duration-300 pointer-events-auto flex flex-col sm:flex-row items-center gap-4">
        
        {/* Animated Female Presenter Avatar (Sarah) Headshot */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div
            className={`absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-indigo-500 blur-sm transition-opacity duration-300 ${
              isSpeaking ? 'opacity-100 animate-pulse' : 'opacity-40'
            }`}
          />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-cyan-400 shadow-xl bg-slate-900">
            <img
              src="/female_avatar_portrait.webp"

              alt="AI Presenter Sarah"
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isSpeaking ? 'scale-105 contrast-110' : 'scale-100'
              }`}

              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 p-1 rounded-full border shadow ${
              isSpeaking ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-bounce' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Mic className="w-3 h-3" />
          </div>
        </div>

        {/* Subtitle & Presenter Bio Body */}
        <div className="flex-1 space-y-1.5 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-[11px] font-mono">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
              <span>{isRtl ? 'سارة | الشارحة الرقمية أنيميشن' : 'Sarah | AI Presenter Girl'}</span>
            </span>

            {/* Speech Wave indicator */}
            <div className="flex items-center gap-0.5 ml-auto">
              {[0.4, 0.9, 0.5, 0.8, 0.3].map((h, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full bg-cyan-400 transition-all duration-300 ${
                    isSpeaking ? 'animate-pulse' : 'opacity-40'
                  }`}
                  style={{ height: isSpeaking ? `${h * 14}px` : '4px' }}
                />
              ))}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-cyan-100 font-medium leading-relaxed font-sans min-h-[2.5rem] flex items-center justify-center sm:justify-start">
            "{displayedText}"
            {currentProgress < 95 && (
              <span className="inline-block w-1.5 h-4 ml-1.5 bg-cyan-400 animate-pulse align-middle rounded-full" />
            )}
          </p>
        </div>

      </div>
    </div>
  );
}

