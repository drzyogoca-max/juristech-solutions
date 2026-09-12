import React, { useState, useEffect } from 'react';
import { Youtube, X, Play, CheckCircle2, Sparkles, UserPlus, Video, Users } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { youtubeChannelEngine, YouTubeVideoPost } from '../services/youtubeChannelEngine';

export default function YouTubeGrowthWidget() {
  const { isRtl } = usePlatformLocale();
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const [latestVideo, setLatestVideo] = useState<YouTubeVideoPost | null>(null);

  useEffect(() => {
    const videos = youtubeChannelEngine.getDailyVideos();
    if (videos && videos.length > 0) {
      setLatestVideo(videos[0]);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-500 ${
        isMinimized ? 'w-auto' : 'w-80 sm:w-96'
      }`}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl shadow-2xl border border-red-500/40 animate-pulse transition-all"
        >
          <Youtube className="w-4 h-4 text-white" />
          <span>{isRtl ? 'قناة يوتيوب الرسمية 📺' : 'Official YouTube Channel 📺'}</span>
        </button>
      ) : (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-red-500/30 rounded-3xl p-4 shadow-2xl shadow-slate-950 text-slate-100 relative overflow-hidden">
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-cyan-500 to-red-600" />

          {/* Close & Minimize buttons */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                <Youtube className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white leading-tight">
                  JurisTech YouTube Studio
                </h4>
                <span className="text-[10px] text-slate-400 block font-mono">
                  founder@juristech.solutions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs font-bold"
                title={isRtl ? 'تصغير' : 'Minimize'}
                aria-label={isRtl ? 'تصغير' : 'Minimize'}
              >
                _
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs"
                title={isRtl ? 'إغلاق' : 'Close'}
                aria-label={isRtl ? 'إغلاق' : 'Close'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metrics Pills */}
          <div className="grid grid-cols-2 gap-2 text-center mb-3">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                <Video className="w-3 h-3 text-red-400" />
                {isRtl ? 'فيديوهات الذكاء الاصطناعي' : 'AI Video Catalog'}
              </span>
              <span className="text-xs font-black text-white font-mono">
                {isRtl ? 'بث مؤتمت 24/7' : '24/7 Automated'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                {isRtl ? 'المشتركون والمهتمون' : 'Legal Network'}
              </span>
              <span className="text-xs font-black text-emerald-400 font-mono">
                {isRtl ? 'مستمر التوسع' : 'Active Growth'}
              </span>
            </div>
          </div>

          {/* Latest Video Announcement */}
          {latestVideo && (
            <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-800/30 text-[11px] leading-relaxed mb-3">
              <span className="text-red-400 font-bold block mb-0.5">
                {isRtl ? '🔴 أحدث حلقة قانونية ذكية:' : '🔴 Latest Legal AI Feature:'}
              </span>
              <p className="text-slate-300 font-medium line-clamp-2">
                {isRtl ? latestVideo.titleAr : latestVideo.titleEn}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="https://www.youtube.com/@JurisTechSolutions?sub_confirmation=1"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-red-900/30 transition-all no-underline"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'اشترك في القناة 🔴' : 'Subscribe Now 🔴'}</span>
            </a>
            <a
              href="/video-hub"
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all no-underline"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isRtl ? 'استوديو الشرح المرئي' : 'Educational Videos'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
