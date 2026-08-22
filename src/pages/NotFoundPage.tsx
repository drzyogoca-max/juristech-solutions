import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  Home,
  MessageSquare,
  FileText,
  AlertTriangle,
  Library,
  Headphones,
  Search,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Compass,
  CornerDownLeft,
  Crown
} from 'lucide-react';
import HeartbeatBackground from '../components/HeartbeatBackground';

export default function NotFoundPage() {
  const { l, isRtl } = usePlatformLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState<number>(15);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState<boolean>(true);

  // Auto redirect countdown to homepage
  useEffect(() => {
    if (!autoRedirectEnabled) return;
    if (countdown <= 0) {
      navigate('/dashboard');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, autoRedirectEnabled, navigate]);

  const quickLinks = [
    {
      to: '/dashboard',
      icon: Home,
      titleAr: 'لوحة التحكم الرئيسية',
      titleEn: 'Main Dashboard & Hub',
      descAr: 'المنصة المتكاملة وجميع الخدمات والأدوات القانونية',
      descEn: 'Access the complete legal tech & sovereign suite',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      to: '/chat',
      icon: MessageSquare,
      titleAr: 'المستشار القانوني الذكي 24/7',
      titleEn: 'AI Legal Copilot 24/7',
      descAr: 'استشارات قانونية وفحص فوري عبر الذكاء الاصطناعي',
      descEn: 'Statutory advisory & instant smart legal answers',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    },
    {
      to: '/contracts',
      icon: FileText,
      titleAr: 'استوديو صياغة وتوليد العقود',
      titleEn: 'Smart Contract Generator',
      descAr: 'صياغة عقود تجارية معتمدة ومطابقة للأنظمة',
      descEn: 'Draft compliant commercial contracts in seconds',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      to: '/risk',
      icon: AlertTriangle,
      titleAr: 'رادار كشف المخاطر والبنود التعسفية',
      titleEn: 'Contract Risk Radar',
      descAr: 'تدقيق بنود المسؤولية والتعويضات والالتزامات',
      descEn: 'Audit liabilities, penalties & hidden contract risks',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      to: '/repository',
      icon: Library,
      titleAr: 'مستودع المليون عقد المؤسسي',
      titleEn: '1M+ Contracts Repository',
      descAr: 'أضخم مكتبة نماذج وعقود تجارية جاهزة للتعديل',
      descEn: 'Massive library of verified corporate agreements',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      to: '/support',
      icon: Headphones,
      titleAr: 'مركز الدعم والتذاكر المشفرة',
      titleEn: 'Live Helpdesk & Support',
      descAr: 'تواصل مباشر مع فريق الدعم والمستشار التنفيذي',
      descEn: 'Direct escalation desk & 24/7 encrypted tickets',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toLowerCase();
    if (q.includes('عقد') || q.includes('contract') || q.includes('صياغ')) {
      navigate('/contracts');
    } else if (q.includes('خطر') || q.includes('risk') || q.includes('فحص') || q.includes('audit')) {
      navigate('/risk');
    } else if (q.includes('شات') || q.includes('chat') || q.includes('مستشار') || q.includes('advisor')) {
      navigate('/chat');
    } else if (q.includes('دعم') || q.includes('support') || q.includes('تواصل') || q.includes('help')) {
      navigate('/support');
    } else if (q.includes('مستودع') || q.includes('نماذج') || q.includes('template') || q.includes('repo')) {
      navigate('/repository');
    } else {
      navigate(`/repository?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main
      className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden bg-slate-950 font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Helmet>
        <title>{l('404: الصفحة غير موجودة | JurisTech Solutions', '404: Page Not Found | JurisTech Solutions')}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <HeartbeatBackground />

      <div className="max-w-4xl w-full mx-auto relative z-10 space-y-8 text-center">
        
        {/* Glowing 404 Visual Crest */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-indigo-500/20 blur-2xl rounded-full pointer-events-none" />
          
          <div className="relative flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-7xl sm:text-9xl font-black bg-gradient-to-br from-cyan-400 via-sky-300 to-indigo-500 bg-clip-text text-transparent font-mono tracking-tighter drop-shadow-2xl">
                404
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-md">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{l('الرابط القانوني المطلوب غير متوفر أو تم نقله', 'Requested Legal Route or Document Not Found')}</span>
            </div>
          </div>
        </div>

        {/* Informative Headline & Context */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {l(
              'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها',
              'Oops! The page or document you are looking for does not exist'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {l(
              'يبدو أن المسار القانوني الذي طلبته (',
              'The route you tried to access ('
            )}
            <code className="text-cyan-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 break-all text-[11px]">
              {location.pathname}
            </code>
            {l(
              ') تم تعديله أو إعادة توجيهه. يمكنك استخدام البحث السريع أدناه أو الانتقال مباشرة للخدمات الأساسية.',
              ') may have moved or been updated. Use the quick navigator below to find your tool.'
            )}
          </p>

          {/* Auto-redirect countdown bar */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            {autoRedirectEnabled ? (
              <>
                <span>{l(`إعادة توجيه تلقائية للرئيسية خلال ${countdown} ثانية...`, `Auto-redirecting to Dashboard in ${countdown}s...`)}</span>
                <button
                  onClick={() => setAutoRedirectEnabled(false)}
                  className="text-cyan-400 underline hover:text-cyan-300 text-[11px] cursor-pointer"
                >
                  {l('إلغاء', 'Pause')}
                </button>
              </>
            ) : (
              <button
                onClick={() => { setAutoRedirectEnabled(true); setCountdown(15); }}
                className="text-cyan-400 underline hover:text-cyan-300 text-[11px] cursor-pointer"
              >
                {l('استئناف العد التنازلي', 'Resume auto-redirect')}
              </button>
            )}
          </div>
        </div>

        {/* Interactive Fast-Navigator Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={l('ابحث عن خدمة (مثل: صياغة عقد، فحص مخاطر، استشارة، أسعار)...', 'Search services (e.g. Draft contract, Risk audit, Pricing)...')}
            className="w-full py-3.5 px-4 ps-11 pe-24 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-xl"
          />
          <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <button
            type="submit"
            className="absolute top-1/2 -translate-y-1/2 end-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
          >
            <span>{l('انتقال', 'Go')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </form>

        {/* Primary CTA: Big Return Home Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 no-underline"
          >
            <Home className="w-4 h-4" />
            <span>{l('العودة إلى لوحة التحكم الرئيسية', 'Return to Main Dashboard')}</span>
          </Link>

          <Link
            to="/chat"
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 no-underline"
          >
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <span>{l('استشارة المستشار الذكي 24/7', 'Ask AI Legal Copilot')}</span>
          </Link>
        </div>

        {/* Quick Access Services Matrix */}
        <div className="pt-6 border-t border-slate-900">
          <div className="flex items-center justify-center gap-2 mb-4 text-slate-400 text-xs font-bold">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{l('أو استكشف الوجهات الأكثر استخداماً على المنصة:', 'Or explore our most popular sovereign destinations:')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-start">
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group no-underline shadow-md hover:scale-[1.01]"
                >
                  <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h2 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {isRtl ? item.titleAr : item.titleEn}
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-1 font-sans">
                      {isRtl ? item.descAr : item.descEn}
                    </p>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all shrink-0 mt-1 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sovereign Legal Assistance Hotline Footer */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {l('تحتاج لمساعدة قانونية عاجلة؟ تواصل مباشرة مع المستشار د. محمد مصطفى', 'Need urgent legal assistance? Connect with Executive Counsel Dr. Mohammad Mustafa')}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/201126674337"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold transition-all"
            >
              WhatsApp
            </a>
            <a
              href="mailto:drzyogo.ca@gmail.com"
              className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-bold transition-all"
            >
              Email
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
