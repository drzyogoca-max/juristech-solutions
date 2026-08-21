/**
 * src/components/VoiceInput.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Ultra-Responsive Direct Voice Input Engine
 * 
 * Features:
 *  • Pristine, single-click microphone button (Clean Icon UI)
 *  • Continuous Speech-to-Text streaming for all 7 languages
 *  • Zero audio resource locking & auto-recovery on silence
 *  • Live real-time audio pulse & transcript display
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function VoiceInput({
  onTranscript,
  language,
  disabled,
  className = '',
}: VoiceInputProps) {
  const { l, isRtl, i18n } = usePlatformLocale();
  const activeLang = language || i18n.language || 'ar';

  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [interimText, setInterimText] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const watchdogTimerRef = useRef<any>(null);
  const restartCooldownRef = useRef<boolean>(false);

  // Exact BCP-47 Language mapping for 7 global languages
  const langMap: Record<string, string> = {
    ar: 'ar-SA',
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    zh: 'zh-CN',
    tr: 'tr-TR',
  };

  // Safe SpeechRecognition spawner
  const spawnSpeechRecognitionInstance = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) return null;

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = langMap[activeLang] || 'ar-SA';

      rec.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setErrorMessage(null);
        restartCooldownRef.current = false;
      };

      rec.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript + ' ';
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (finalChunk.trim()) {
          onTranscript(finalChunk.trim());
          setInterimText('');
        } else if (currentInterim.trim()) {
          setInterimText(currentInterim.trim());
        }
      };

      rec.onerror = (e: any) => {
        const err = e?.error;
        console.warn('[VoiceInput] Recognition event notice:', err);

        if (err === 'not-allowed' || err === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setErrorMessage(
            l(
              'يرجى السماح بالوصول للميكروفون',
              'Please allow microphone access'
            )
          );
          setTimeout(() => setErrorMessage(null), 4000);
        } else if (err === 'no-speech' || err === 'network' || err === 'audio-capture') {
          if (isListeningRef.current && !restartCooldownRef.current) {
            restartCooldownRef.current = true;
            setTimeout(() => {
              if (isListeningRef.current) {
                try {
                  const newRec = spawnSpeechRecognitionInstance();
                  if (newRec) newRec.start();
                } catch {}
              }
            }, 100);
          }
        }
      };

      rec.onend = () => {
        if (isListeningRef.current && !restartCooldownRef.current) {
          restartCooldownRef.current = true;
          setTimeout(() => {
            if (isListeningRef.current) {
              try {
                const retryRec = spawnSpeechRecognitionInstance();
                if (retryRec) retryRec.start();
              } catch {}
            }
          }, 80);
        } else if (!isListeningRef.current) {
          setIsListening(false);
        }
      };

      recognitionRef.current = rec;
      return rec;
    } catch (err) {
      console.warn('[VoiceInput] Init exception:', err);
      return null;
    }
  }, [activeLang, onTranscript, l]);

  // Watchdog timer to ensure continuous connection while user is speaking
  useEffect(() => {
    if (isListening) {
      watchdogTimerRef.current = setInterval(() => {
        if (isListeningRef.current && (!recognitionRef.current || restartCooldownRef.current)) {
          try {
            const rec = spawnSpeechRecognitionInstance();
            if (rec) rec.start();
          } catch {}
        }
      }, 3000);
    } else {
      if (watchdogTimerRef.current) {
        clearInterval(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
    }
    return () => {
      if (watchdogTimerRef.current) {
        clearInterval(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
    };
  }, [isListening, spawnSpeechRecognitionInstance]);

  // Handle Start / Stop Toggle
  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (isListening || isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      restartCooldownRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    } else {
      isListeningRef.current = true;
      restartCooldownRef.current = false;
      setErrorMessage(null);

      const rec = spawnSpeechRecognitionInstance();
      if (rec) {
        try {
          rec.start();
          setIsListening(true);
        } catch (err) {
          setTimeout(() => {
            if (isListeningRef.current) {
              try {
                const retryRec = spawnSpeechRecognitionInstance();
                if (retryRec) {
                  retryRec.start();
                  setIsListening(true);
                }
              } catch {}
            }
          }, 100);
        }
      } else {
        setErrorMessage(
          l(
            'المتصفح لا يدعم التسجيل الصوتي المباشر',
            'Voice recognition not supported'
          )
        );
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Pristine, Clean Microphone Icon Button */}
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        aria-label={
          isListening
            ? l('إيقاف الإملاء الصوتي', 'Stop voice recording')
            : l('بدء الإملاء الصوتي المباشر', 'Start voice recording')
        }
        title={
          isListening
            ? l('إيقاف الإملاء الصوتي', 'Stop voice recording')
            : l('إملاء صوتي فائق الحساسية', 'Voice recording')
        }
        className={`p-3 rounded-2xl border transition-all shrink-0 flex items-center justify-center relative cursor-pointer active:scale-95 shadow-md ${
          isListening
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/40 ring-4 ring-red-500/25'
            : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 dark:text-cyan-300 border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/20'
        } ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"
              title={l('تسجيل صوتي نشط', 'Recording active')}
            />
          </>
        ) : (
          <Mic className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      {/* Floating Active Dictation Pill with Live Speech Preview */}
      {isListening && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100000] px-4 py-2.5 rounded-3xl bg-slate-900/95 border border-cyan-500/50 text-white text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-4 max-w-[92vw] sm:max-w-lg"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />

          <div className="min-w-0 flex-1 truncate text-slate-200">
            {interimText ? (
              <span className="text-cyan-300 italic truncate block">"{interimText}"</span>
            ) : (
              <span className="text-[11px] text-slate-300 font-medium truncate block">
                {l('🎙️ تحدث الآن... يتم التسجيل بدقة', '🎙️ Speak now... Recording live')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={toggleListening}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shrink-0 shadow transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{l('إتمام', 'Done')}</span>
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-slate-900/95 border border-red-500/50 text-red-300 text-[11px] font-bold shadow-xl flex items-center gap-1.5 animate-in fade-in zoom-in"
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
