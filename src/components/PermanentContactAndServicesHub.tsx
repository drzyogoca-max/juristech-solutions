import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Mail,
  Phone,
  CreditCard,
  Building2,
  FileText,
  AlertTriangle,
  Lock,
  Sparkles,
  ShieldCheck,
  Crown,
  Headphones,
  CheckCircle2,
  Copy,
  ExternalLink,
  Zap,
  Handshake,
  Library,
} from 'lucide-react';

export default function PermanentContactAndServicesHub() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [copiedInstaPay, setCopiedInstaPay] = useState(false);

  const handleCopyInstaPay = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('+201031222262');
    setCopiedInstaPay(true);
    setTimeout(() => setCopiedInstaPay(false), 2000);
  };

  const quickServices = [
    {
      to: '/chat',
      titleAr: 'المستشار الذكي 24/7',
      titleEn: 'AI Legal Counsel',
      icon: MessageSquare,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
    },
    {
      to: '/contracts',
      titleAr: 'صياغة وتدقيق العقود',
      titleEn: 'Contract Generator',
      icon: Sparkles,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
    },
    {
      to: '/risk',
      titleAr: 'فحص المخاطر والثغرات',
      titleEn: 'Risk & Redline Radar',
      icon: AlertTriangle,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 hover:border-amber-400',
    },
    {
      to: '/repository',
      titleAr: 'مستودع المليون عقد',
      titleEn: '1M+ Contracts Vault',
      icon: Library,
      color: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30 hover:border-indigo-400',
    },
    {
      to: '/templates',
      titleAr: 'استوديو النماذج الذكية',
      titleEn: 'Smart Templates',
      icon: FileText,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30 hover:border-purple-400',
    },
    {
      to: '/company-formation',
      titleAr: 'تأسيس الشركات وحوكمتها',
      titleEn: 'Corporate Formation',
      icon: Building2,
      color: 'from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30 hover:border-teal-400',
    },
    {
      to: '/negotiation',
      titleAr: 'غرفة التفاوض الذكي',
      titleEn: 'Negotiation Chamber',
      icon: Handshake,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30 hover:border-blue-400',
    },
    {
      to: '/vault',
      titleAr: 'خزنة المستندات المشفّرة',
      titleEn: 'Encrypted Vault',
      icon: Lock,
      color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30 hover:border-violet-400',
    },
    {
      to: '/payment',
      titleAr: 'باقات الاشتراك والترقية',
      titleEn: 'Plans & Payment',
      icon: CreditCard,
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 hover:border-amber-400',
    },
    {
      to: '/support',
      titleAr: 'الدعم الفني المباشر',
      titleEn: '24/7 Client Helpdesk',
      icon: Headphones,
      color: 'from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/30 hover:border-cyan-400',
    },
  ];

  return (
    <div className="w-full space-y-6 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 1. PERMANENT EXECUTIVE CONTACT BAR (قناة التواصل المباشر الثابتة)    */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900 border-2 border-cyan-500/40 shadow-2xl p-5 sm:p-7 glow-cyan">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header & Live Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/10 shrink-0">
                <Crown className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    {isRtl ? 'مركز التواصل المباشر والخدمات السيادية الفورية' : 'Direct Executive Contact & Sovereign Legal Services Hub'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{isRtl ? 'المستشار متصل الآن 24/7' : 'Counsel Online 24/7'}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isRtl
                    ? 'قناة التواصل والتعاقد المباشر مع المستشار د. محمد مصطفى وفريق الخبراء القانونيين للشركات والأفراد.'
                    : 'Direct communications & contract execution channel with Senior Counsel Dr. Mohammed Mostafa & enterprise legal advisors.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? 'خدمات معتمدة وموثقة' : 'Verified Legal Authority'}</span>
              </span>
            </div>
          </div>

          {/* Contact Methods 4-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* 1. Direct WhatsApp */}
            <a
              href="https://wa.me/201126674337?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%86%D8%B5%D8%A9%20JurisTech%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%82%D8%A7%D9%86%D9%88%D9%86%D9%8A%D8%A9%20%D9%88%D8%AA%D8%A3%D8%B3%D9%8A%D8%B3%20%D8%B9%D9%82%D8%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg shadow-emerald-500/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isRtl ? 'واتساب المستشار المباشر' : 'Direct WhatsApp'}
                    </span>
                    <span className="text-sm font-black text-white font-mono select-all">
                      +201126674337
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold pt-2 border-t border-emerald-500/20">
                <span>{isRtl ? 'محادثة فورية مباشرة' : 'Instant Chat'}</span>
                <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">{isRtl ? 'رد خلال دقائق' : 'Active'}</span>
              </div>
            </a>

            {/* 2. Direct Email */}
            <a
              href="mailto:Drzyogo.ca@gmail.com?cc=juristech.solutions@outlook.com&subject=Legal%20Consultation%20Request"
              className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400 transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg shadow-cyan-500/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isRtl ? 'البريد الرسمي للإدارة' : 'Official Legal Email'}
                    </span>
                    <span className="text-xs font-bold text-white font-mono truncate block select-all">
                      Drzyogo.ca@gmail.com
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold pt-2 border-t border-cyan-500/20">
                <span>{isRtl ? 'إرسال العقود والاستشارات' : 'Email Counsel'}</span>
                <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">24/7</span>
              </div>
            </a>

            {/* 3. InstaPay Instant Payment */}
            <div
              onClick={handleCopyInstaPay}
              className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg shadow-purple-500/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isRtl ? 'إنستا باي مصر (InstaPay)' : 'InstaPay Direct'}
                    </span>
                    <span className="text-sm font-black text-white font-mono select-all">
                      +201031222262
                    </span>
                  </div>
                </div>
                <button
                  aria-label="Copy InstaPay Phone"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {copiedInstaPay ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold pt-2 border-t border-purple-500/20">
                <span>{copiedInstaPay ? (isRtl ? 'تم نسخ الرقم بنجاح!' : 'Copied!') : (isRtl ? 'اضغط لنسخ رقم التحويل' : 'Click to Copy')}</span>
                <span className="text-[10px] bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">{isRtl ? 'تفعيل فوري' : 'Instant'}</span>
              </div>
            </div>

            {/* 4. Subscriptions & Direct SWIFT Wire */}
            <Link
              to="/payment"
              className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/40 hover:border-amber-400 transition-all hover:scale-[1.02] group flex flex-col justify-between space-y-3 shadow-lg shadow-amber-500/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isRtl ? 'الاشتراكات وحوالات SWIFT' : 'Plans & SWIFT Wire'}
                    </span>
                    <span className="text-sm font-black text-white">
                      {isRtl ? 'بوابات الدفع الرسمية' : 'Verified Gateways'}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold pt-2 border-t border-amber-500/20">
                <span>{isRtl ? 'الترقية والتحويل البنكي' : 'Upgrade & Invoices'}</span>
                <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">{isRtl ? 'خصم 30%' : '30% Off'}</span>
              </div>
            </Link>

          </div>

        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 2. PERMANENT CORE SERVICES DIRECTORY (شريط الوصول السريع للخدمات)  */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {isRtl ? 'الوصول السريع لجميع الخدمات والأنظمة القانونية المعتمدة' : 'Instant Access to All Certified Legal AI Engines'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isRtl ? 'انقر على أي خدمة للانتقال الفوري وبدء الاستخدام دون انقطاع.' : 'Select any sovereign tool to launch directly with zero interruptions.'}
              </p>
            </div>
          </div>
          <Link
            to="/chat"
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30 transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استشارة فورية' : 'Ask AI Counsel'}</span>
          </Link>
        </div>

        {/* Quick Service Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {quickServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <Link
                key={idx}
                to={srv.to}
                className={`p-3 rounded-2xl bg-gradient-to-br ${srv.color} border transition-all hover:scale-[1.03] flex items-center gap-2.5 shadow-sm active:scale-95`}
              >
                <div className="p-1.5 rounded-xl bg-slate-950/80 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold truncate">
                  {isRtl ? srv.titleAr : srv.titleEn}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
