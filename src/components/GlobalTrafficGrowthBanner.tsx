import React, { useState, useEffect } from 'react';
import { Globe, Users, TrendingUp, Sparkles, Share2, MessageSquare, CheckCircle2, Activity, ShieldCheck, Briefcase } from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';
import { aiTrafficGrowthEngine, TrafficGrowthMetrics } from '../services/aiTrafficGrowthEngine';
import AutonomousQaAnalyticsModal from './AutonomousQaAnalyticsModal';
import CrmClientManagerModal from './CrmClientManagerModal';

import { useAuth } from '../lib/authContext';
import { verifyAdminAccess, isAuthorizedAdminEmail } from '../lib/adminGuard';

export default function GlobalTrafficGrowthBanner() {
  const { isRtl, formatNum, l } = usePlatformLocale();
  const { user, isAdmin } = useAuth();

  const isSessionAuthed = verifyAdminAccess();
  const isSupabaseAdmin = user && isAuthorizedAdminEmail(user?.email);
  const isOfficialAdmin = isAdmin && (isSessionAuthed || isSupabaseAdmin);

  const [metrics, setMetrics] = useState<TrafficGrowthMetrics>(aiTrafficGrowthEngine.getMetrics());
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQaModal, setShowQaModal] = useState(false);
  const [showCrmModal, setShowCrmModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(aiTrafficGrowthEngine.getMetrics());
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://juristech.solutions';
  const shareText = isRtl
    ? '🚀 مستودع وخزينة العقود والنماذج الذكية الموحدة (Google AI Pro Powered) — 1,000,000+ عقد ونموذج قانوني معتمد:'
    : '🚀 Unified Smart Contracts Vault (Google AI Pro Powered) — 1,000,000+ Verified Contracts:';

  const handleShare = (platform: 'whatsapp' | 'linkedin' | 'twitter' | 'email') => {
    aiTrafficGrowthEngine.trackReferralShare(platform);

    let url = '';
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'email') {
      url = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
    }

    if (url) window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    aiTrafficGrowthEngine.trackReferralShare('whatsapp');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-cyan-500/30 text-white py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Live Visitor & Acquisition Metrics */}
          <div className="flex items-center gap-3 flex-wrap font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-extrabold">{formatNum(metrics.activeGlobalVisitors)}</span>
              <span className="text-[10px] text-slate-300">{isRtl ? 'عميل وزائر نشط الآن' : 'Active Global Clients'}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-extrabold">{formatNum(metrics.totalIndexedPages)}</span>
              <span className="text-[10px] text-slate-300">{isRtl ? 'عقد مفهرس بجوجل وبينج' : 'Indexed Contracts'}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-extrabold">+{formatNum(metrics.convertedClientsToday)}</span>
              <span className="text-[10px] text-slate-300">{isRtl ? 'عميل جديد اليوم' : 'New Clients Today'}</span>
            </div>

            {/* QA & CRM Control Buttons — Restricted ONLY to Super Admin (drzyogo.ca@gmail.com) */}
            {isOfficialAdmin && (
              <>
                <button
                  onClick={() => setShowQaModal(true)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-[10.5px] flex items-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isRtl ? '📊 فحص QA وحركة الزوار' : '📊 QA & Traffic Intelligence'}</span>
                </button>

                <button
                  onClick={() => setShowCrmModal(true)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-[10.5px] flex items-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isRtl ? '👔 إدارة التسويق وعلاقات العملاء (CRM)' : '👔 CRM Client Portal'}</span>
                </button>
              </>
            )}
          </div>

          {/* Viral Growth & Share Action CTA */}
          <div className="flex items-center gap-2">
            <span className="hidden xl:inline-block text-[11px] text-slate-300 font-medium">
              {isRtl ? '🚀 شارك المنصة مع زملائك واكتسب تصريح تحميل مجاني فوري:' : '🚀 Invite colleagues to earn 1 free contract credit:'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Share on LinkedIn"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AutonomousQaAnalyticsModal
        isOpen={showQaModal}
        onClose={() => setShowQaModal(false)}
      />

      <CrmClientManagerModal
        isOpen={showCrmModal}
        onClose={() => setShowCrmModal(false)}
      />
    </>
  );
}
