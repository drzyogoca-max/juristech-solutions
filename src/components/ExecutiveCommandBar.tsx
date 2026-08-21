import React from 'react';
import { Link } from 'react-router-dom';
import { usePlatformLocale } from '../lib/universalTranslator';
import {
  Crown,
  Key,
  MessageCircle,
  Mail,
  Smartphone,
  Sparkles
} from 'lucide-react';

interface ExecutiveCommandBarProps {
  onOpenSecurity?: () => void;
}

export default function ExecutiveCommandBar({ onOpenSecurity }: ExecutiveCommandBarProps) {
  const { l, isRtl } = usePlatformLocale();

  return (
    <div className="card-lawtech-lux rounded-3xl p-4 sm:p-5 border border-sky-500/20 shadow-2xl relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left/Right: Leadership & Authority Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{l('المستشار د. محمد مصطفى', 'Dr. Mohammad Mustafa')}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{l('استشارات فورية 24/7', 'Live Advisory 24/7')}</span>
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
              {l('مركز القيادة والخدمات القانونية السيادية', 'Sovereign Executive Legal Command Center')}
            </h2>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              {l(
                'صياغة العقود وتأسيس الشركات وتدقيق المخاطر التشريعية وفق أنظمة الخليج ومصر والدولية.',
                'Direct contract drafting, company formation & institutional risk audits across GCC, Egypt & Global frameworks.'
              )}
            </p>
          </div>
        </div>

        {/* Action Channels: WhatsApp, Email, InstaPay & Security Hub */}
        <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/201126674337?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%86%D8%B5%D8%A9%20JurisTech%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%82%D8%A7%D9%86%D9%88%D9%86%D9%8A%D8%A9%20%D9%88%D8%AA%D8%A3%D8%B3%D9%8A%D8%B3%20%D8%B9%D9%82%D8%AF"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l('واتساب المستشار المباشر', 'WhatsApp Counsel')}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
            <span className="truncate">{l('واتساب المستشار', 'WhatsApp')}</span>
          </a>

          {/* Email Direct */}
          <a
            href="mailto:Drzyogo.ca@gmail.com?cc=juristech.solutions@outlook.com&subject=Legal%20Advisory%20Inquiry%20-%20JurisTech"
            aria-label={l('البريد الرسمي للمستشار', 'Official Email')}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-sky-600/20 active:scale-95 cursor-pointer"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate">{l('البريد الرسمي', 'Direct Email')}</span>
          </a>

          {/* InstaPay Quick Info */}
          <Link
            to="/payment"
            aria-label={l('إنستا باي والدفع الفوري', 'InstaPay & Checkout')}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4 shrink-0 text-purple-400" />
            <span className="truncate">{l('إنستا باي: 01031222262', 'InstaPay: +201031222262')}</span>
          </Link>

          {/* 2FA & Security Trigger */}
          {onOpenSecurity && (
            <button
              onClick={onOpenSecurity}
              aria-label={l('أمان التشفير 2FA', '2FA Security')}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-all cursor-pointer"
              title={l('إدارة الأمان والمصادقة الثنائية', '2FA Security Settings')}
            >
              <Key className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
