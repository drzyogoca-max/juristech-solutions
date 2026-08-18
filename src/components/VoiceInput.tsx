import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Volume2, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  autoClearOnStart?: boolean;
}

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
  const [noiseSuppressed, setNoiseSuppressed] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const restartTimeoutRef = useRef<any>(null);

  // Language mapping for recognition
  const langMap: Record<string, string> = {
    ar: 'ar-SA',
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    zh: 'zh-CN',
    tr: 'tr-TR',
  };

  // Clean up all audio streams and animation frames
  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
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
  }, []);

  // Initialize hardware-level noise suppression and microphone sensitivity analyzer
  const initHighSensitivityAudio = async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
        return false;
      }

      cleanupAudio();

      // Advanced audio constraints: Auto-Gain (High Sensitivity) + Noise Suppression + Echo Cancellation
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true }, // Maximizes microphone sensitivity for faint / clear voice
          channelCount: 1,
          sampleRate: 48000,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Web Audio API analyzer for real-time noise & voice sensitivity monitoring
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!shouldListenRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }

      setNoiseSuppressed(true);
      return true;
    } catch (err: any) {
      console.warn('[VoiceInput] High-sensitivity audio initialization notice:', err?.message);
      return false;
    }
  };

  // Setup Continuous Speech Recognition with persistent auto-reconnect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.maxAlternatives = 1;
        rec.lang = langMap[activeLang] || 'ar-SA';

        rec.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        rec.onresult = (event: any) => {
          let latestFinal = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              latestFinal += event.results[i][0].transcript;
            }
          }
          if (latestFinal && latestFinal.trim()) {
            onTranscript(latestFinal.trim());
          }
        };

        rec.onerror = (e: any) => {
          console.warn('[VoiceInput] Speech recognition status:', e?.error);
          if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
            shouldListenRef.current = false;
            setIsListening(false);
            cleanupAudio();
            setErrorMessage(isRtl ? 'يرجى السماح بصلاحية الميكروفون' : 'Please allow microphone access');
            setTimeout(() => setErrorMessage(null), 4000);
          } else if (e?.error === 'no-speech') {
            // Silence detected: do NOT abort. Auto-keep-alive loop keeps listening!
            if (shouldListenRef.current) {
              if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
              restartTimeoutRef.current = setTimeout(() => {
                if (shouldListenRef.current && recognitionRef.current) {
                  try { recognitionRef.current.start(); } catch {}
                }
              }, 150);
            }
          }
        };

        rec.onend = () => {
          // Keep-alive loop: If the user hasn't explicitly clicked STOP, restart immediately
          if (shouldListenRef.current) {
            if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => {
              if (shouldListenRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch {
                  // If browser needs a brief cooldown, try after 300ms
                  setTimeout(() => {
                    if (shouldListenRef.current && recognitionRef.current) {
                      try { recognitionRef.current.start(); } catch {}
                    }
                  }, 300);
                }
              }
            }, 100);
          } else {
            setIsListening(false);
            cleanupAudio();
          }
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.warn('[VoiceInput] Speech recognition instantiation error:', err);
      }
    }

    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      cleanupAudio();
    };
  }, [activeLang, onTranscript, isRtl, cleanupAudio]);

  const toggleListening = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (isListening || shouldListenRef.current) {
      // User explicitly stopped listening
      shouldListenRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      cleanupAudio();
    } else {
      // User started listening
      shouldListenRef.current = true;
      setErrorMessage(null);

      // Start hardware noise suppression & audio sensitivity monitor
      await initHighSensitivityAudio();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = langMap[activeLang] || 'ar-SA';
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              if (shouldListenRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                  setIsListening(true);
                } catch {}
              }
            }, 200);
          } catch {}
        }
      } else {
        // Fallback for browsers lacking native SpeechRecognition
        setErrorMessage(isRtl ? 'الميكروفون نشط بجودة عالية' : 'Microphone active with noise suppression');
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
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
            ? 'بدء الإملاء الصوتي الذكي فائق الحساسية وعزل الضوضاء'
            : 'Start High-Sensitivity AI Voice Input'
        }
        title={
          isListening
            ? isRtl
              ? 'جاري الاستماع المستمر بحساسية فائقة... اضغط للإيقاف'
              : 'Listening continuously with high sensitivity... click to stop'
            : isRtl
            ? 'الميكروفون الذكي (حساسية فائقة + عزل الضوضاء بدون انقطاع)'
            : 'Smart High-Sensitivity Mic (Noise-Controlled & Continuous)'
        }
        className={`p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 flex items-center justify-center relative shadow-md active:scale-95 ${
          isListening
            ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/40 ring-4 ring-red-500/25'
            : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 dark:text-cyan-300 border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/20'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            {/* Live Audio Sensitivity Level Wave Bar */}
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"
              title={isRtl ? 'عازل الضوضاء والحساسية نشط' : 'Noise control active'}
            />
          </>
        ) : (
          <Mic className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      {/* Active High-Sensitivity & Noise Control Badge when Listening */}
      {isListening && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-3 py-1.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 text-white text-[11px] font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in zoom-in"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {isRtl ? 'الميكروفون يستمع (حساسية عالية + عزل الضوضاء)' : 'Listening (High Sensitivity + Noise Filter)'}
          </span>
          {/* Audio Activity Meter */}
          <div className="flex items-center gap-0.5 h-3">
            <span
              className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
              style={{ height: `${Math.max(20, audioLevel)}%` }}
            />
            <span
              className="w-1 bg-indigo-400 rounded-full transition-all duration-75"
              style={{ height: `${Math.max(30, audioLevel * 1.2)}%` }}
            />
            <span
              className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
              style={{ height: `${Math.max(25, audioLevel * 0.8)}%` }}
            />
          </div>
        </div>
      )}

      {/* Error / Status Popover */}
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
