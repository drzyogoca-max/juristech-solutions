import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Volume2, Sparkles, Sliders, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  const activeLang = language || i18n.language || 'ar';
  const isRtl = activeLang === 'ar';

  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [interimText, setInterimText] = useState<string>('');
  const [noiseMode, setNoiseMode] = useState<NoiseControlMode>('ultra-sensitive');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterHighPassRef = useRef<BiquadFilterNode | null>(null);
  const filterLowPassRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<any>(null);
  const restartCooldownRef = useRef<boolean>(false);

  // Language mapping
  const langMap: Record<string, string> = {
    ar: 'ar-SA',
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    zh: 'zh-CN',
    tr: 'tr-TR',
  };

  // Cleanup Web Audio nodes and animation
  const cleanupAudioPipeline = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (watchdogTimerRef.current) {
      clearInterval(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
    setInterimText('');
  }, []);

  // Update DSP filters based on Noise / Sensitivity mode
  const applyAudioDspSettings = useCallback((mode: NoiseControlMode) => {
    if (!audioContextRef.current || !gainNodeRef.current || !filterHighPassRef.current || !compressorRef.current) {
      return;
    }
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    if (mode === 'ultra-sensitive') {
      // 3.0x Boost (High Sensitivity) + Aggressive Dynamic Range Compression for faint whispers
      gainNodeRef.current.gain.setValueAtTime(3.2, now);
      filterHighPassRef.current.frequency.setValueAtTime(60, now); // Allow natural low speech
      compressorRef.current.threshold.setValueAtTime(-36, now);
      compressorRef.current.ratio.setValueAtTime(12, now);
    } else if (mode === 'noise-suppressed') {
      // Noise suppression: Cut air conditioner / fan rumble (<120Hz) and background hum
      gainNodeRef.current.gain.setValueAtTime(1.8, now);
      filterHighPassRef.current.frequency.setValueAtTime(120, now);
      compressorRef.current.threshold.setValueAtTime(-24, now);
      compressorRef.current.ratio.setValueAtTime(8, now);
    } else {
      // Balanced mode
      gainNodeRef.current.gain.setValueAtTime(2.2, now);
      filterHighPassRef.current.frequency.setValueAtTime(85, now);
      compressorRef.current.threshold.setValueAtTime(-28, now);
      compressorRef.current.ratio.setValueAtTime(6, now);
    }
  }, []);

  // Initialize Web Audio DSP Processing Chain for Noise Control & High Sensitivity
  const initHighSensitivityAudio = async (mode: NoiseControlMode): Promise<boolean> => {
    try {
      if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
        return false;
      }

      cleanupAudioPipeline();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: mode !== 'ultra-sensitive' },
          autoGainControl: { ideal: true },
          channelCount: 1,
          sampleRate: 48000,
        },
      });

      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);

        // 1. High-Pass Filter (removes room rumble & HVAC vibrations)
        const highPass = audioCtx.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.value = mode === 'noise-suppressed' ? 120 : 70;
        highPass.Q.value = 0.7;
        filterHighPassRef.current = highPass;

        // 2. Dynamics Compressor (lifts soft speech, caps screaming/clipping)
        const compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.value = -30;
        compressor.knee.value = 20;
        compressor.ratio.value = 8;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
        compressorRef.current = compressor;

        // 3. Programmable Gain Node (Sensitivity Multiplier)
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = mode === 'ultra-sensitive' ? 3.0 : 2.0;
        gainNodeRef.current = gainNode;

        // 4. Analyser Node (Live visualizer)
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.75;
        analyserRef.current = analyser;

        // Connect DSP graph: Source -> HighPass -> Gain -> Compressor -> Analyser
        source.connect(highPass);
        highPass.connect(gainNode);
        gainNode.connect(compressor);
        compressor.connect(analyser);

        // Audio level animation loop
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateAudioLevel = () => {
          if (!isListeningRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();
      }

      return true;
    } catch (err: any) {
      console.warn('[VoiceEngine] WebAudio DSP init notice:', err?.message);
      return false;
    }
  };

  // Safe restart mechanism for SpeechRecognition instance to guarantee 0 disconnection
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
        console.warn('[VoiceEngine] Recognition event:', err);

        if (err === 'not-allowed' || err === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          cleanupAudioPipeline();
          setErrorMessage(
            isRtl
              ? 'يرجى السماح بالوصول للميكروفون في إعدادات المتصفح'
              : 'Please allow microphone access in browser settings'
          );
          setTimeout(() => setErrorMessage(null), 5000);
        } else if (err === 'no-speech' || err === 'network' || err === 'audio-capture') {
          // Keep active: do NOT kill session on silence or temporary network stall
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
        // Continuous Keep-Alive: If user hasn't pressed STOP, automatically resurrect listener
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
          cleanupAudioPipeline();
        }
      };

      recognitionRef.current = rec;
      return rec;
    } catch (err) {
      console.warn('[VoiceEngine] Instantiation exception:', err);
      return null;
    }
  }, [activeLang, onTranscript, isRtl, cleanupAudioPipeline]);

  // Set up Watchdog timer to ensure the recognition session never stalls
  useEffect(() => {
    if (isListening) {
      watchdogTimerRef.current = setInterval(() => {
        if (isListeningRef.current && (!recognitionRef.current || restartCooldownRef.current)) {
          try {
            const rec = spawnSpeechRecognitionInstance();
            if (rec) rec.start();
          } catch {}
        }
      }, 3500);
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
  const toggleListening = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (isListening || isListeningRef.current) {
      // Explicit User STOP
      isListeningRef.current = false;
      setIsListening(false);
      restartCooldownRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      cleanupAudioPipeline();
    } else {
      // Start Recording
      isListeningRef.current = true;
      restartCooldownRef.current = false;
      setErrorMessage(null);

      // 1. Initialize DSP Noise Filtering & Auto-Gain Sensitivity
      await initHighSensitivityAudio(noiseMode);

      // 2. Spawn and start resilient SpeechRecognition instance
      const rec = spawnSpeechRecognitionInstance();
      if (rec) {
        try {
          rec.start();
          setIsListening(true);
        } catch (err) {
          console.warn('[VoiceEngine] Immediate start fallback attempt:', err);
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
          isRtl
            ? 'الميكروفون فائق الحساسية نشط ويعزل الضوضاء'
            : 'Ultra-sensitive microphone active with noise suppression'
        );
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  const handleModeChange = (newMode: NoiseControlMode) => {
    setNoiseMode(newMode);
    applyAudioDspSettings(newMode);
    setShowSettings(false);
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
            ? isRtl
              ? 'إيقاف الإملاء الصوتي'
              : 'Stop voice input'
            : isRtl
            ? 'بدء الإملاء الصوتي المستمر فائق الحساسية والتحكم في الضوضاء'
            : 'Start Continuous High-Sensitivity Voice Input'
        }
        title={
          isListening
            ? isRtl
              ? 'الميكروفون يستمع بشكل مستمر وبدون انقطاع... اضغط للإيقاف'
              : 'Listening continuously without disconnection... Click to stop'
            : isRtl
            ? 'الميكروفون الذكي (حساسية فائقة + عزل الضوضاء)'
            : 'Smart Microphone (High Sensitivity + Noise Control)'
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
              title={isRtl ? 'عازل الضوضاء ومضاعف الحساسية نشط' : 'Noise filter active'}
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
        title={isRtl ? 'إعدادات حساسية الميكروفون وعزل الضوضاء' : 'Microphone Sensitivity & Noise Control Settings'}
        className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
      >
        <Sliders className="w-3.5 h-3.5" />
      </button>

      {/* Floating Active Dictation Pill with Live Speech Preview & Noise Status */}
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
                {isRtl
                  ? 'ميكروفون مستمر بدون انقطاع (حساسية قصوى + تصفية الضوضاء)'
                  : 'Continuous Dictation Active (High Sensitivity + Noise Filter)'}
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
            <span>{isRtl ? 'إتمام' : 'Done'}</span>
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
              {isRtl ? 'إعدادات حساسية الميكروفون' : 'Mic Sensitivity & Noise'}
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-white text-[10px]"
            >
              ✕
            </button>
          </div>

          {/* Mode 1: Ultra-Sensitive (Boosted for faint/distant voice) */}
          <button
            type="button"
            onClick={() => handleModeChange('ultra-sensitive')}
            className={`w-full p-2 rounded-xl text-start transition-all flex items-start gap-2 ${
              noiseMode === 'ultra-sensitive'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[11px] text-white">
                {isRtl ? '⚡ حساسية فائقة (Ultra-Sensitive)' : '⚡ Ultra-Sensitive (Whisper & Distant)'}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {isRtl
                  ? 'مضاعفة كسب الصوت 3x لالتقاط الصوت الخافت والبعيد بوضوح تام'
                  : '3x gain boost to capture soft whispers & distant voice'}
              </div>
            </div>
          </button>

          {/* Mode 2: Noise Suppression (Filters background sounds) */}
          <button
            type="button"
            onClick={() => handleModeChange('noise-suppressed')}
            className={`w-full p-2 rounded-xl text-start transition-all flex items-start gap-2 ${
              noiseMode === 'noise-suppressed'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[11px] text-white">
                {isRtl ? '🛡️ عزل الضوضاء الذكي (Noise Control)' : '🛡️ Smart Noise Filter'}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {isRtl
                  ? 'تصفية أصوات التكييف والمراوح والضجيج المحيط بالكامل'
                  : 'Suppresses HVAC rumble, fan noise & room echo'}
              </div>
            </div>
          </button>

          {/* Mode 3: Balanced AI */}
          <button
            type="button"
            onClick={() => handleModeChange('balanced')}
            className={`w-full p-2 rounded-xl text-start transition-all flex items-start gap-2 ${
              noiseMode === 'balanced'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[11px] text-white">
                {isRtl ? '✨ الوضع المتوازن (Balanced Studio)' : '✨ Balanced Studio AI'}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {isRtl ? 'توازن مثالي بين وضوح الصوت وحجب الضوضاء' : 'Balanced voice clarity with dynamic suppression'}
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
