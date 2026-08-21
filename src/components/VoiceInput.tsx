import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Volume2, Sparkles, Sliders, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

type NoiseControlMode = 'ultra-sensitive' | 'noise-suppressed' | 'balanced';

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
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [interimText, setInterimText] = useState<string>('');
  const [noiseMode, setNoiseMode] = useState<NoiseControlMode>('ultra-sensitive');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
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

  // Simulated visual audio level pulse while listening
  const startLevelPulsing = useCallback(() => {
    let level = 30;
    let up = true;
    const pulse = () => {
      if (!isListeningRef.current) {
        setAudioLevel(0);
        return;
      }
      if (up) {
        level += Math.random() * 20;
        if (level > 85) up = false;
      } else {
        level -= Math.random() * 15;
        if (level < 25) up = true;
      }
      setAudioLevel(Math.round(level));
      animFrameRef.current = requestAnimationFrame(pulse);
    };
    pulse();
  }, []);

  const stopLevelPulsing = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioLevel(0);
    setInterimText('');
  }, []);

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
        startLevelPulsing();
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
        console.warn('[VoiceInput] SpeechRecognition error event:', err);

        if (err === 'not-allowed' || err === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          stopLevelPulsing();
          setErrorMessage(
            l(
              'يرجى السماح بالوصول للميكروفون في إعدادات المتصفح',
              'Please allow microphone access in your browser settings'
            )
          );
          setTimeout(() => setErrorMessage(null), 5000);
        } else if (err === 'no-speech' || err === 'network' || err === 'audio-capture') {
          // Auto-resurrect on silence without terminating session
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
        // Keep alive while user hasn't explicitly clicked stop
        if (isListeningRef.current && !restartCooldownRef.current) {
          restartCooldownRef.current = true;
          setTimeout(() => {
            if (isListeningRef.current) {
              try {
                const resurrectedRec = spawnSpeechRecognitionInstance();
                if (resurrectedRec) {
                  resurrectedRec.start();
                }
              } catch {
                setTimeout(() => {
                  if (isListeningRef.current) {
                    try {
                      const retryRec = spawnSpeechRecognitionInstance();
                      if (retryRec) retryRec.start();
                    } catch {}
                  }
                }, 300);
              }
            }
          }, 80);
        } else if (!isListeningRef.current) {
          setIsListening(false);
          stopLevelPulsing();
        }
      };

      recognitionRef.current = rec;
      return rec;
    } catch (err) {
      console.warn('[VoiceInput] Instantiation exception:', err);
      return null;
    }
  }, [activeLang, onTranscript, l, startLevelPulsing, stopLevelPulsing]);

  // Watchdog timer to ensure continuous connection
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
      stopLevelPulsing();
    };
  }, [isListening, spawnSpeechRecognitionInstance, stopLevelPulsing]);

  // Handle Start / Stop Toggle
  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (isListening || isListeningRef.current) {
      // User clicked stop
      isListeningRef.current = false;
      setIsListening(false);
      restartCooldownRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopLevelPulsing();
    } else {
      // User clicked start
      isListeningRef.current = true;
      restartCooldownRef.current = false;
      setErrorMessage(null);

      const rec = spawnSpeechRecognitionInstance();
      if (rec) {
        try {
          rec.start();
          setIsListening(true);
        } catch (err) {
          console.warn('[VoiceInput] Immediate start retry:', err);
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
          }, 150);
        }
      } else {
        setErrorMessage(
          l(
            'المتصفح لا يدعم التسجيل الصوتي المباشر، يرجى استخدام متصفح Chrome أو Edge',
            'Voice recognition not supported in this browser. Please use Chrome or Edge.'
          )
        );
        setTimeout(() => setErrorMessage(null), 4000);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* Primary Microphone Trigger Button */}
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        aria-label={
          isListening
            ? l('إيقاف الإملاء الصوتي', 'Stop voice input')
            : l('بدء الإملاء الصوتي فائق الحساسية', 'Start ultra-sensitive voice input')
        }
        className={`p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 flex items-center justify-center relative shadow-md active:scale-95 cursor-pointer ${
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
              title={l('تسجيل صوتي نشط مستمر', 'Continuous voice recording active')}
            />
          </>
        ) : (
          <Mic className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      {/* Noise Control & Sensitivity Settings Quick Dropdown Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowSettings(!showSettings);
        }}
        aria-label="Noise & Sensitivity Controls"
        title={l('إعدادات حساسية الميكروفون', 'Microphone Sensitivity Settings')}
        className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
      >
        <Sliders className="w-3.5 h-3.5" />
      </button>

      {/* Floating Active Dictation Pill with Live Speech Preview */}
      {isListening && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100000] px-4 py-2.5 rounded-3xl bg-slate-900/95 border border-cyan-500/50 text-white text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-4 max-w-[92vw] sm:max-w-lg"
        >
          {/* Pulsing indicator */}
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />

          {/* Live Audio Activity Frequency Bars */}
          <div className="flex items-center gap-0.5 h-4 shrink-0">
            <span
              className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
              style={{ height: `${Math.max(25, audioLevel * 0.9)}%` }}
            />
            <span
              className="w-1 bg-indigo-400 rounded-full transition-all duration-75"
              style={{ height: `${Math.max(40, audioLevel * 1.3)}%` }}
            />
            <span
              className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
              style={{ height: `${Math.max(30, audioLevel * 1.1)}%` }}
            />
            <span
              className="w-1 bg-cyan-300 rounded-full transition-all duration-75"
              style={{ height: `${Math.max(20, audioLevel * 0.7)}%` }}
            />
          </div>

          {/* Mode & Live Interim Speech Text */}
          <div className="min-w-0 flex-1 truncate text-slate-200">
            {interimText ? (
              <span className="text-cyan-300 italic truncate block">"{interimText}"</span>
            ) : (
              <span className="text-[11px] text-slate-300 font-medium truncate block">
                {l(
                  '🎙️ استماع مستمر بدون انقطاع — تحدث الآن...',
                  '🎙️ Continuous listening active — Speak now...'
                )}
              </span>
            )}
          </div>

          {/* Complete / Stop Button */}
          <button
            type="button"
            onClick={toggleListening}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shrink-0 shadow transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{l('إتمام', 'Done')}</span>
          </button>
        </div>
      )}

      {/* Noise Control & Sensitivity Menu Popover */}
      {showSettings && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-[10000] w-64 p-3 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-2 text-xs animate-in fade-in zoom-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              {l('حساسية الميكروفون', 'Mic Sensitivity')}
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-white text-[10px]"
            >
              ✕
            </button>
          </div>

          {/* Mode 1: Ultra-Sensitive */}
          <button
            type="button"
            onClick={() => { setNoiseMode('ultra-sensitive'); setShowSettings(false); }}
            className={`w-full p-2 rounded-xl text-start transition-all flex items-start gap-2 ${
              noiseMode === 'ultra-sensitive'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[11px] text-white">
                {l('⚡ حساسية فائقة (Ultra-Sensitive)', '⚡ Ultra-Sensitive (Whisper & Distant)')}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {l('التقاط الصوت الخافت والبعيد بوضوح تام', 'Captures soft whispers & distant voice')}
              </div>
            </div>
          </button>

          {/* Mode 2: Noise Suppression */}
          <button
            type="button"
            onClick={() => { setNoiseMode('noise-suppressed'); setShowSettings(false); }}
            className={`w-full p-2 rounded-xl text-start transition-all flex items-start gap-2 ${
              noiseMode === 'noise-suppressed'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[11px] text-white">
                {l('🛡️ عزل الضوضاء الذكي (Noise Control)', '🛡️ Smart Noise Filter')}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {l('تصفية أصوات التكييف والضجيج المحيط', 'Suppresses HVAC rumble & fan noise')}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Error Feedback */}
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
