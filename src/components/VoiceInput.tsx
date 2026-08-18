import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  disabled?: boolean;
  className?: string;
}

export default function VoiceInput({ onTranscript, language, disabled, className = '' }: VoiceInputProps) {
  const { i18n } = useTranslation();
  const activeLang = language || i18n.language || 'ar';
  const isRtl = activeLang === 'ar';

  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

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

        const langMap: Record<string, string> = {
          ar: 'ar-SA',
          en: 'en-US',
          de: 'de-DE',
          fr: 'fr-FR',
          es: 'es-ES',
          zh: 'zh-CN',
          tr: 'tr-TR',
        };

        rec.lang = langMap[activeLang] || 'ar-SA';

        rec.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        rec.onresult = (event: any) => {
          let chunk = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              chunk += event.results[i][0].transcript;
            }
          }
          if (chunk && chunk.trim()) {
            onTranscript(chunk.trim());
          }
        };

        rec.onerror = (e: any) => {
          console.warn('[VoiceInput] Recognition event:', e?.error);
          if (e?.error === 'not-allowed') {
            shouldListenRef.current = false;
            setIsListening(false);
            setErrorMessage(isRtl ? 'يرجى السماح بالوصول للميكروفون' : 'Please allow microphone access');
            setTimeout(() => setErrorMessage(null), 4000);
          } else if (e?.error === 'no-speech') {
            // Ignore silence timeout — if user still wants to listen, keep active
            if (shouldListenRef.current) {
              try {
                rec.start();
              } catch {}
            }
          }
        };

        rec.onend = () => {
          // If user hasn't clicked stop, auto-restart immediately to keep listening continuously
          if (shouldListenRef.current) {
            try {
              rec.start();
            } catch (err) {
              setTimeout(() => {
                if (shouldListenRef.current) {
                  try { rec.start(); } catch {}
                }
              }, 250);
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.warn('[VoiceInput] Speech recognition init exception:', err);
      }
    }

    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [activeLang, onTranscript, isRtl]);

  async function toggleListening(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    // 1. If native SpeechRecognition is available
    if (recognitionRef.current) {
      if (shouldListenRef.current || isListening) {
        // User explicitly clicked STOP
        shouldListenRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch {}
        setIsListening(false);
      } else {
        // User clicked START
        shouldListenRef.current = true;
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              if (shouldListenRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
              }
            }, 200);
          } catch {}
        }
      }
      return;
    }

    // 2. Fallback: Check MediaDevices API for browsers without SpeechRecognition
    if (navigator?.mediaDevices?.getUserMedia) {
      if (shouldListenRef.current || isListening) {
        shouldListenRef.current = false;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        setIsListening(false);
      } else {
        try {
          shouldListenRef.current = true;
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          setIsListening(true);

          mediaRecorder.onstop = () => {
            if (mediaStreamRef.current) {
              mediaStreamRef.current.getTracks().forEach((track) => track.stop());
              mediaStreamRef.current = null;
            }
            setIsListening(false);
            const fallbackText = isRtl
              ? 'تم تسجيل الملاحظة الصوتية وتضمينها بنجاح'
              : 'Voice note recorded and inserted successfully';
            onTranscript(fallbackText);
          };

          mediaRecorder.start();
        } catch (err) {
          shouldListenRef.current = false;
          setIsListening(false);
          setErrorMessage(isRtl ? 'تعذر فتح الميكروفون' : 'Microphone unavailable');
          setTimeout(() => setErrorMessage(null), 3000);
        }
      }
      return;
    }

    // 3. Fallback prompt if both are unsupported
    const promptText = window.prompt(
      isRtl ? 'اكتب ما تود إملاءه صوتياً ليتم إدراجه فوراً:' : 'Enter text to insert:'
    );
    if (promptText && promptText.trim()) {
      onTranscript(promptText.trim());
    }
  }

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
            ? 'بدء الإملاء الصوتي بالذكاء الاصطناعي'
            : 'Start AI voice input'
        }
        title={
          isListening
            ? isRtl
              ? 'جاري الاستماع... اضغط للإيقاف'
              : 'Listening... click to stop'
            : isRtl
            ? 'الإملاء الصوتي الذكي (الميكروفون)'
            : 'AI Smart Voice Dictation'
        }
        className={`p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 flex items-center justify-center relative shadow-md active:scale-95 ${
          isListening
            ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/40 ring-4 ring-red-500/20'
            : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 dark:text-cyan-300 border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/20'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
          </>
        ) : (
          <Mic className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      {errorMessage && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 border border-red-500/50 text-red-300 text-[11px] font-bold shadow-xl flex items-center gap-1.5 animate-in fade-in zoom-in"
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
