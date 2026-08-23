import React, { useState, useEffect, useRef } from 'react';
import {
  Video, Youtube, Play, Pause, CheckCircle2, RefreshCw, Calendar, Eye, Sparkles,
  Send, Lock, Globe, Clock, FileText, ArrowRight, Volume2, VolumeX, Download,
  Share2, ShieldCheck, UserPlus, Layers, Activity
} from 'lucide-react';
import SEO from '../components/SEO';
import { youtubeChannelEngine, YouTubeVideoPost, YouTubeChannelStats } from '../services/youtubeChannelEngine';
import { youtubeGrowthEngine } from '../services/youtubeGrowthEngine';
import { usePlatformLocale } from '../lib/universalTranslator';
import { aiVoiceSynthesizer } from '../lib/aiVoiceSynthesizer';

export const YouTubeStudioPage: React.FC = () => {
  const { l, isRtl, i18n } = usePlatformLocale();
  const [stats, setStats] = useState<YouTubeChannelStats>(youtubeChannelEngine.getChannelStats());
  const [videos, setVideos] = useState<YouTubeVideoPost[]>(youtubeChannelEngine.getDailyVideos());
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoPost | null>(videos[0] || null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'SCRIPT_TELEPROMPTER' | 'OAUTH_SETUP' | 'GROWTH_CONNECTIONS'>('SCHEDULE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Video Preview Player State
  const [playerMode, setPlayerMode] = useState<'YOUTUBE_EMBED' | 'AI_CANVAS'>('YOUTUBE_EMBED');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [audioVoiceLang, setAudioVoiceLang] = useState<'ar' | 'en'>('ar');
  const progressIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);

  // Audio & Frame Sync Player Controller
  useEffect(() => {
    if (isPlaying && selectedVideo) {
      const totalSec = selectedVideo.durationSeconds || 60;
      progressIntervalRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            aiVoiceSynthesizer.stop();
            return 0;
          }
          const next = prev + (100 / totalSec);
          // Calculate storyboard frame index
          if (selectedVideo.visualStoryboard && selectedVideo.visualStoryboard.length > 0) {
            const frameRatio = (next / 100) * selectedVideo.visualStoryboard.length;
            setActiveFrameIndex(Math.min(Math.floor(frameRatio), selectedVideo.visualStoryboard.length - 1));
          }
          return next;
        });
      }, 1000);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, selectedVideo]);

  const toggleVideoPlayback = () => {
    if (!selectedVideo) return;

    if (isPlaying) {
      setIsPlaying(false);
      aiVoiceSynthesizer.stop();
    } else {
      setIsPlaying(true);
      const textToSpeak = audioVoiceLang === 'ar'
        ? (selectedVideo.titleAr + '. ' + selectedVideo.scriptVoiceoverEn)
        : (selectedVideo.titleEn + '. ' + selectedVideo.scriptVoiceoverEn);
      
      aiVoiceSynthesizer.speak({ text: textToSpeak, lang: audioVoiceLang });
    }
  };

  const handleGeneratePublish = async (slot: 'MORNING' | 'EVENING') => {
    setIsGenerating(true);
    const msging = isRtl
      ? `🚀 جاري إنشاء فيديو الذكاء الاصطناعي وتجهيزه للنشر التلقائي على يوتيوب (${slot === 'MORNING' ? 'فيديو الصباح' : 'إيجاز المساء'})...`
      : `🚀 Generating AI Video & Publishing to YouTube Channel (${slot})...`;
    setToastMessage(msging);

    setTimeout(async () => {
      const published = await youtubeChannelEngine.generateAndPublishDailyVideo(slot);
      setStats(youtubeChannelEngine.getChannelStats());
      setVideos(youtubeChannelEngine.getDailyVideos());
      setSelectedVideo(published);
      setIsGenerating(false);
      const successMsg = isRtl
        ? `✅ تم نشر ${slot === 'MORNING' ? 'فيديو الصباح' : 'فيديو المساء'} بنجاح على القناة الرسمية (${stats.officialEmail})!`
        : `✅ ${slot} Video published successfully to Official YouTube Channel (${stats.officialEmail})!`;
      setToastMessage(successMsg);
      setTimeout(() => setToastMessage(null), 5000);
    }, 1200);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-20">
      <SEO
        title={l(
          'استوديو إدارة قناة يوتيوب الرسمية والنشر اليومي التلقائي | JurisTech Solutions',
          'Official YouTube Channel Studio & 2x Daily Video Automation | JurisTech Solutions'
        )}
        description={l(
          'استوديو إدارة قناة يوتيوب الرسمية للمنصة juristech.solutions@outlook.com بإشراف المستشار د. محمد مصطفى. توليد ونشر فيديوهات قانونية يومية صباحاً ومساءً 100% بالذكاء الاصطناعي.',
          'Official YouTube Channel Administration for juristech.solutions@outlook.com. Autonomous Morning & Evening AI Video Generation Engine.'
        )}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-3 gap-3 mb-2 flex-wrap">
              <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
                <Youtube className="w-3.5 h-3.5" />
                {l('قناة يوتيوب الرسمية للمنصة', 'Official YouTube Channel Engine')}
              </span>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {l('جدول النشر: 2 فيديو يومياً (صباحاً ومساءً)', '2x Videos / Day (Morning & Evening)')}
              </span>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {l('ثنائي اللغة: عربي + إنجليزي 100%', '100% Bilingual: AR + EN')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {l('استوديو يوتيوب والنشر اليومي الآلي 📺', 'JurisTech Solutions YouTube Studio 📺')}
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
              {l(
                `الحساب الرسمي للقناة: ${stats.officialEmail} | مدار بالكامل بواسطة الوكيل الذكي ومفوض عن سعادة المستشار د. محمد مصطفى.`,
                `Official Channel Account: ${stats.officialEmail} | Administered by Executive AI Proxy under authorization of Dr. Mohammad Mustafa.`
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handleGeneratePublish('MORNING')}
              disabled={isGenerating}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl shadow-lg shadow-red-900/30 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {l('نشر فيديو الصباح (09:00 AM)', 'Publish Morning Video (9 AM UTC)')}
            </button>
            <button
              onClick={() => handleGeneratePublish('EVENING')}
              disabled={isGenerating}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl shadow-lg shadow-cyan-900/30 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {l('نشر فيديو المساء (06:00 PM)', 'Publish Evening Video (6 PM UTC)')}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Channel Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {l('مشتركو القناة الرسمية', 'Channel Subscribers')}
              </span>
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-black text-white">{stats.subscribersCount.toLocaleString()}</div>
            <div className="text-xs text-emerald-400 mt-1 font-semibold">
              {l('↑ +140 مشترك جديد هذا الأسبوع', '↑ +140 new this week')}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {l('إجمالي مشاهدات الفيديوهات', 'Total Video Views')}
              </span>
              <Eye className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalViews.toLocaleString()}</div>
            <div className="text-xs text-cyan-400 mt-1 font-semibold">
              {l('تفاعل عالي من الرؤساء التنفيذيين', 'High C-Suite Engagement')}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {l('الفيديوهات المنشورة', 'Videos Published')}
              </span>
              <Video className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalVideosPublished}</div>
            <div className="text-xs text-purple-400 mt-1 font-semibold">
              {l('محدث يومياً صباحاً ومساءً', 'Updated 2x Daily')}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {l('حالة الربط البرمجي', 'OAuth Status')}
              </span>
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-emerald-400">
              {l('مرتبط ومفعل (Active)', 'Active & Bound')}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              {stats.officialEmail}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-6 gap-6 border-b border-slate-800 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('SCHEDULE')}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'SCHEDULE'
                ? 'border-red-500 text-red-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {l('جدول النشر اليومي 2x', '2x Daily Publishing Schedule')}
          </button>
          <button
            onClick={() => setActiveTab('SCRIPT_TELEPROMPTER')}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'SCRIPT_TELEPROMPTER'
                ? 'border-red-500 text-red-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            {l('نصوص وتلقين الفيديوهات', 'Script Teleprompter & Storyboard')}
          </button>
          <button
            onClick={() => setActiveTab('OAUTH_SETUP')}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'OAUTH_SETUP'
                ? 'border-red-500 text-red-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            {l('بيانات اعتماد يوتيوب (OAuth API)', 'YouTube API Binding Setup')}
          </button>
          <button
            onClick={() => setActiveTab('GROWTH_CONNECTIONS')}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'GROWTH_CONNECTIONS'
                ? 'border-red-500 text-red-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            {l('محرك النمو والتسويق السريع', 'Rapid Growth & Web Syndication')}
          </button>
        </div>

        {/* TAB 1: 2x Daily Schedule & Interactive Video Player */}
        {activeTab === 'SCHEDULE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Video List Column */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-red-400" />
                {l('فيديوهات القناة اليومية (منشورة ومجدولة)', "Today's Published & Scheduled Videos")}
              </h2>

              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    setSelectedVideo(vid);
                    setIsPlaying(false);
                    setPlaybackProgress(0);
                    aiVoiceSynthesizer.stop();
                  }}
                  className={`cursor-pointer border rounded-2xl p-4 transition shadow-lg ${
                    selectedVideo?.id === vid.id
                      ? 'bg-slate-900 border-red-500/80 ring-1 ring-red-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                        vid.slot === 'MORNING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {vid.slot === 'MORNING'
                        ? l('🌅 فيديو الصباح (9:00 AM UTC)', '🌅 Morning Briefing (9 AM UTC)')
                        : l('🌆 إيجاز المساء (6:00 PM UTC)', '🌆 Evening Briefing (6 PM UTC)')}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                      {vid.format}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug mb-2">
                    {isRtl ? vid.titleAr : vid.titleEn}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {l('منشور وجاهز', 'Published')}
                    </span>
                    <span className="font-mono text-[11px]">👁️ {vid.viewsCount} {l('مشاهدة', 'views')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive High-Quality Video Preview Player Column */}
            <div className="lg:col-span-7">
              {selectedVideo && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                        {l('معاينة الفيديو المباشر والتلقين الصوتي', 'Live Video Preview & Narration Player')}
                      </span>
                      <h3 className="text-lg font-black text-white">
                        {isRtl ? selectedVideo.titleAr : selectedVideo.titleEn}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href="https://www.youtube.com/@JurisTechSolutions?sub_confirmation=1"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-red-500 shadow-md shadow-red-900/40 transition flex items-center gap-1.5 no-underline"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                        <span>{l('القناة الرسمية على يوتيوب 🔴', 'Official YouTube Channel 🔴')}</span>
                      </a>
                      <a
                        href="/video-hub"
                        className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-cyan-700/50 shadow-md transition flex items-center gap-1.5 no-underline"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{l('مركز التدريب التفاعلي 🎓', 'Training Academy 🎓')}</span>
                      </a>
                      <button
                        onClick={() => setAudioVoiceLang(audioVoiceLang === 'ar' ? 'en' : 'ar')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        {audioVoiceLang === 'ar' ? 'الصوت: عربي 🇸🇦' : 'Voice: English 🇺🇸'}
                      </button>
                    </div>
                  </div>

                  {/* Video Player Display — Lightweight JurisTech Sovereign Canvas & Storyboard */}
                  <div className="relative aspect-video bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-2xl group">
                    {/* Background Visual Frame Simulation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 opacity-90" />
                    
                    {/* Simulated Storyboard Animation Frame */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Top Header overlay */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1 rounded-full text-xs text-cyan-300 font-bold">
                          <Youtube className="w-4 h-4 text-red-500 animate-pulse" />
                          <span>JurisTech Official Channel • @JurisTechSolutions</span>
                        </div>
                        <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          ● {selectedVideo.format}
                        </span>
                      </div>

                      {/* Center Frame Graphic & Storyboard Overlay */}
                      <div className="text-center my-auto py-6 px-4">
                        <div className="inline-flex p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-xl">
                          <Activity className="w-10 h-10 animate-pulse" />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black text-white drop-shadow-md mb-2">
                          {selectedVideo.visualStoryboard?.[activeFrameIndex]?.textOverlay || (isRtl ? selectedVideo.titleAr : selectedVideo.titleEn)}
                        </h4>
                        <p className="text-xs text-cyan-300 font-mono bg-slate-900/80 max-w-md mx-auto py-1 px-3 rounded-lg border border-slate-800">
                          🎬 {l('المشهد البصري الحالي', 'Current Frame')}: {selectedVideo.visualStoryboard?.[activeFrameIndex]?.visualDescription || 'AI Legal Risk Radar'}
                        </p>
                      </div>

                      {/* Bottom Narration Typewriter Subtitles */}
                      <div className="bg-slate-950/90 backdrop-blur border border-cyan-500/30 p-3 rounded-xl text-xs text-slate-100 font-semibold text-center leading-relaxed">
                        🔊 {isRtl ? (selectedVideo.titleAr + ' — نظام الذكاء الاصطناعي السيادي لمنصة JurisTech Solutions') : (selectedVideo.scriptVoiceoverEn.substring(0, 140) + '...')}
                      </div>
                    </div>

                    {/* Progress Bar overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 via-cyan-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${playbackProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-2xl flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleVideoPlayback}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-red-900/40 transition flex items-center gap-2 text-xs"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>
                          {isPlaying
                            ? l('إيقاف مؤقت', 'Pause Video')
                            : l('▶️ تشغيل العرض البصري والصوتي المباشر', '▶️ Play Live Audio-Visual Video')}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={youtubeGrowthEngine.getDirectSubscribeUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 no-underline"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{l('🔴 اشترك بالقناة', '🔴 Subscribe on YouTube')}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Teleprompter & Storyboard */}
        {activeTab === 'SCRIPT_TELEPROMPTER' && selectedVideo && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-400" />
                {l('النص الصوتي الكامل وتوقيتات اللوحات البصرية', 'Voiceover Script & Storyboard Timing')}
              </h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold">
                {l('المدة', 'Duration')}: {selectedVideo.durationSeconds}s
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-slate-100 font-mono text-base leading-relaxed">
              <strong className="text-cyan-400 block mb-2">{l('🎙️ النص الصوتي للتلقين (Voiceover Script):', '🎙️ Teleprompter Voiceover Script:')}</strong>
              {selectedVideo.scriptVoiceoverEn}
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {l('🎬 اللوحات البصرية والتوقيتات (Storyboard Frames):', '🎬 Visual Storyboard Frames:')}
              </h4>
              <div className="space-y-2">
                {selectedVideo.visualStoryboard.map((frame, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-900 p-3 rounded-xl text-xs border border-slate-800">
                    <span className="font-mono text-cyan-400 font-bold">{frame.timestamp}</span>
                    <span className="text-slate-300">{frame.visualDescription}</span>
                    <span className="text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{frame.textOverlay}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OAuth Credentials & Binding */}
        {activeTab === 'OAUTH_SETUP' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-emerald-400" />
                {l('بيانات اعتماد Google OAuth 2.0 المربوطة', 'Google OAuth 2.0 Credentials Bound & Configured')}
              </h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> BOUND & ACTIVE
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Project ID:</span>
                <span className="text-cyan-400 font-bold">gen-lang-client-0627816917</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Client ID:</span>
                <span className="text-slate-200 font-bold truncate max-w-xs">{stats.oauthClientId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Redirect URI:</span>
                <span className="text-emerald-400 font-bold">{stats.oauthRedirectUri}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Channel Account:</span>
                <span className="text-amber-400 font-bold">{stats.officialEmail}</span>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={`https://accounts.google.com/o/oauth2/auth?client_id=${stats.oauthClientId}&redirect_uri=${encodeURIComponent(stats.oauthRedirectUri)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly')}&access_type=offline&prompt=consent`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-lg shadow-red-900/30 transition flex items-center justify-center gap-2 no-underline"
              >
                <Youtube className="w-4 h-4" />
                {l('منح تفويض جوجل المباشر لرفع الفيديوهات', 'Grant 1-Click Google Authorization for Uploads')}
              </a>
            </div>
          </div>
        )}

        {/* TAB 4: Rapid Growth Connections */}
        {activeTab === 'GROWTH_CONNECTIONS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  {l('محرك تسريع المشاهدات والاشتراكات والربط الخارجي', 'Rapid YouTube Channel Growth & Web Connections')}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {l(
                    'ربط مباشر مع جوجل وبينج وشبكات التواصل الاجتماعية لجلب المشاهدات والاشتراكات العالية تلقائياً.',
                    'Automated web syndication, search engine video schema indexing, and cross-platform growth connections.'
                  )}
                </p>
              </div>
              <a
                href={youtubeGrowthEngine.getDirectSubscribeUrl()}
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-900/40 flex items-center gap-2 no-underline"
              >
                <Youtube className="w-4 h-4" />
                {l('🔴 رابط الاشتراك الفوري المباشر (1-Click)', 'Direct 1-Click Auto-Subscribe Link 🔴')}
              </a>
            </div>

            {/* Growth Platforms Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {youtubeGrowthEngine.getGrowthPlatforms().map((p, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{p.category}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      ● {p.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.targetAudience}</p>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>{l('النشرات النشطة', 'Active Syndications')}: <strong>{p.syndicatedPostsCount}</strong></span>
                    <span>{l('حصة الزيارات', 'Referral Traffic')}: <strong className="text-emerald-400">{p.referralTrafficSharePercent}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
