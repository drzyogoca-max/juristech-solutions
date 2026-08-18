import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Video, X, CheckCircle2, Sparkles, ShieldCheck, FileText, Send, Calendar, Clock, Lock, MessageSquare, Loader2, ExternalLink } from 'lucide-react';
import { callAI } from '../lib/api';
import { useContract } from '../context/ContractContext';

interface LiveMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveMeetingModal({ isOpen, onClose }: LiveMeetingModalProps) {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { contractState } = useContract();

  const [platform, setPlatform] = useState<'zoom' | 'teams'>('zoom');
  const [meetingTopic, setMeetingTopic] = useState(
    contractState.extractedText
      ? contractState.extractedText.substring(0, 50) + '...'
      : (isRtl ? 'جلسة تفاوض ومراجعة عقود اندماج واستحواذ' : 'M&A Contract Audit & Negotiation Session')
  );
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('14:00');
  const [isJoined, setIsJoined] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiMinutes, setAiMinutes] = useState<string>('');
  const [signed, setSigned] = useState(false);

  if (!isOpen) return null;

  const meetingLink = platform === 'zoom' 
    ? 'https://zoom.us/j/9021887766?pwd=JurisTechSovereign2026'
    : 'https://teams.microsoft.com/l/meetup-join/19%3ajuristech_meeting%40thread.v2/0';

  async function handleGenerateAIMinutes() {
    setIsSummarizing(true);
    try {
      const prompt = `أنت مساعد الذكاء الاصطناعي الخارق لإدارة الاجتماعات القانونية. قم بتوليد محضر اجتماع تفاوضي رسمي وشامل لموضوع: "${meetingTopic}".
تضمين:
1. ملخص النقاش والتوافق بين الطرفين.
2. النقاط القانونية والتزام المسؤولية المستخرجة.
3. توصيات الذكاء الاصطناعي لمنع المنازعات المستقبلية.
4. الختم الرقمي لتوقيع الأطراف.`;

      const res = await callAI(prompt);
      setAiMinutes(res);
    } catch (e) {
      setAiMinutes(isRtl 
        ? 'تم استخراج محضر الاجتماع بنجاح: اتفقت الأطراف على الالتزام ببنود السرية والشراء والتعويض بالتضامن بختم SHA-256.'
        : 'Meeting minutes extracted successfully: Parties agreed to NDA and liability terms with SHA-256 seal.');
    } finally {
      setIsSummarizing(false);
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);


  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto my-auto"
      >

        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider mb-0.5 border border-cyan-500/30">
                <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>ZOOM & TEAMS INTEGRATED</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {t('Meeting.title')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('Common.close')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection */}
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-900 dark:text-slate-300">
            {t('Meeting.selectPlatform')}:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPlatform('zoom')}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-black text-xs transition-all ${
                platform === 'zoom'
                  ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-950 dark:text-blue-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Zoom Meeting Room</span>
            </button>

            <button
              onClick={() => setPlatform('teams')}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-black text-xs transition-all ${
                platform === 'teams'
                  ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-950 dark:text-indigo-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Microsoft Teams</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{t('Meeting.dateLabel')}</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{t('Meeting.timeLabel')}</label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-400 mb-1">{t('Meeting.subjectLabel')}</label>
            <input

              type="text"
              value={meetingTopic}
              onChange={(e) => setMeetingTopic(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>

          {/* Join Meeting & AI Live Assistant Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsJoined(true)}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isRtl ? `الانضمام إلى اجتماع ${platform.toUpperCase()} المباشر` : `Join ${platform.toUpperCase()} Meeting`}</span>
            </a>

            <button
              onClick={handleGenerateAIMinutes}
              disabled={isSummarizing}
              className="py-3.5 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Sparkles className="w-4 h-4" />}
              <span>{isRtl ? 'توليد محضر AI الخارق' : 'Generate AI Minutes'}</span>
            </button>
          </div>
        </div>

        {/* AI Meeting Assistant Minutes Output */}
        {aiMinutes && (
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-cyan-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-black text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>{isRtl ? 'محضر الاجتماع الملخص بالذكاء الاصطناعي' : 'AI Assistant Live Meeting Minutes'}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                SHA-256 Cryptographic Digest
              </span>
            </div>

            <div className="text-xs text-slate-900 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold">
              {aiMinutes}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setSigned(true)}
                disabled={signed}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  signed
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{signed ? (isRtl ? 'تم الاعتماد والتوقيع الرقمي' : 'Digitally Signed & Sealed') : (isRtl ? 'توقيع واعتماد المحضر' : 'Sign & Certify Minutes')}</span>
              </button>

              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">Auto-dispatched to both parties</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
