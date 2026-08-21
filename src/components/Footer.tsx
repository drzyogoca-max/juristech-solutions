import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Shield, Scale, AlertTriangle, FileText, Lock, Globe, Mail,
  MessageCircle, Smartphone, ExternalLink, Linkedin, CheckCircle2,
  Building2, Briefcase, Cpu, Award, Key
} from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const currentYear = new Date().getFullYear();

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 1. Permanent Executive Direct Contact Hub (Always Visible on Every Page) */}
        <div className="card-lawtech-lux rounded-3xl p-6 border border-sky-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {isRtl ? 'قنوات التواصل والتعاقد المباشر' : 'Direct Executive & Retainer Channels'}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>24/7 Live</span>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white">
                {isRtl ? 'تواصل مباشرة مع المستشار د. محمد مصطفى وفريق الخبراء' : 'Connect Directly with Senior Managing Counsel Dr. Mohammad Mustafa'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl
                  ? 'استشارات فورية، صياغة وتدقيق العقود المخصصة، وتأسيس الشركات والتحكيم التجاري عبر قنواتنا المعتمدة.'
                  : 'Instant legal advisory, custom contract drafting, corporate structuring & international arbitration.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
              <a
                href="https://wa.me/201126674337?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%86%D8%B5%D8%A9%20JurisTech%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%82%D8%A7%D9%86%D9%88%D9%86%D9%8A%D8%A9%20%D9%88%D8%AA%D8%A3%D8%B3%D9%8A%D8%B3%20%D8%B9%D9%82%D8%AF"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
                <span>💬 {isRtl ? 'واتساب: +201126674337' : 'WhatsApp'}</span>
              </a>

              <a
                href="mailto:Drzyogo.ca@gmail.com?cc=juristech.solutions@outlook.com&subject=Legal%20Advisory%20Inquiry%20-%20JurisTech"
                className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/20 active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>📧 {isRtl ? 'Drzyogo.ca@gmail.com' : 'Email'}</span>
              </a>

              <Link
                to="/payment"
                className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Smartphone className="w-4 h-4 shrink-0 text-purple-400" />
                <span>📱 {isRtl ? 'إنستا باي: +201031222262' : 'InstaPay'}</span>
              </Link>
            </div>

          </div>
        </div>

        {/* 2. Full 18 Core Services Grid Across 4 Categorized Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
          
          {/* Column 1: Contracts & Templates */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>{isRtl ? 'صياغة ونماذج العقود' : 'Contracts & Templates'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/contracts" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isRtl ? 'صانع ومولد العقود الذكية' : 'AI Contract Generator'}</span>
                </Link>
              </li>
              <li>
                <Link to="/repository" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isRtl ? 'مستودع المليون عقد المؤسسي' : 'Mega 1M+ Contracts Repository'}</span>
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isRtl ? 'مكتبة النماذج والاتفاقيات الجاهزة' : 'Verified Templates Studio'}</span>
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isRtl ? 'المستشار القانوني الذكي 24/7' : '24/7 AI Legal Copilot'}</span>
                </Link>
              </li>
              <li>
                <Link to="/video-hub" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isRtl ? 'استوديو الوسائط والشرح المرئي' : 'Video & Audio Media Studio'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Corporate & Investment */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{isRtl ? 'الشركات والاستثمار' : 'Corporate & Investment'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/company-formation" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? 'تأسيس الشركات (MISA / DIFC / Delaware)' : 'Company Formation'}</span>
                </Link>
              </li>
              <li>
                <Link to="/acquisition" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? 'صفقات الاستحواذ والاندماج M&A' : 'M&A & Corporate Takeovers'}</span>
                </Link>
              </li>
              <li>
                <Link to="/lead-radar" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? 'رادار الشركات والفرص التعاقدية B2B' : 'B2B Lead & Contract Radar'}</span>
                </Link>
              </li>
              <li>
                <Link to="/b2b-proposals" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? 'صانع العروض والمقترحات للشركات' : 'Enterprise B2B Proposals'}</span>
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? 'باقات الاشتراكات المخصومة (30%)' : '30% Discounted Tiers'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Risk & Due Diligence */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{isRtl ? 'تدقيق المخاطر والتحري' : 'Risk & Due Diligence'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/risk" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isRtl ? 'مدقق المخاطر والبنود التعسفية' : 'Contract Risk & Liability Audit'}</span>
                </Link>
              </li>
              <li>
                <Link to="/enterprise-audit" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isRtl ? 'الفحص النافي للجهالة الشامل' : 'Enterprise Due Diligence Audit'}</span>
                </Link>
              </li>
              <li>
                <Link to="/legal-compliance" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isRtl ? 'الامتثال التشريعي وحوكمة الشركات' : 'Regulatory Compliance (PDPL/GDPR)'}</span>
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isRtl ? 'التقارير الإستراتيجية للمدراء' : 'C-Suite Strategic Reports'}</span>
                </Link>
              </li>
              <li>
                <Link to="/sovereign-ai-hub" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isRtl ? 'مركز الذكاء السيادي متعدد النماذج' : 'Multi-Model Sovereign AI Hub'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Arbitration, Security & Official Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>{isRtl ? 'التحكيم والأمان والروابط' : 'Arbitration & Security'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/negotiation" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isRtl ? 'مفاوض الصفقات وفض النزاعات الآلي' : 'AI Negotiation & Dispute Resolver'}</span>
                </Link>
              </li>
              <li>
                <Link to="/vault" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isRtl ? 'خزنة المستندات المشفرة E2EE' : 'Zero-Knowledge Encrypted Vault'}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isRtl ? 'من نحن والاستقلالية القانونية' : 'About Us & Independence'}</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isRtl ? 'الشروط والأحكام الرسمية' : 'Official Terms of Service'}</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isRtl ? 'سياسة الخصوصية والأمان' : 'Privacy & Data Protection Policy'}</span>
                </Link>
              </li>
            </ul>

            {/* Official Social Links */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <a
                href="https://www.linkedin.com/in/juristech-solutions-14954b427/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-xl bg-slate-900 hover:bg-sky-500/20 text-sky-400 border border-slate-800 hover:border-sky-500/40 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/JurisTechAI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Twitter"
                className="p-2 rounded-xl bg-slate-900 hover:bg-sky-500/20 text-sky-400 border border-slate-800 hover:border-sky-500/40 transition-all font-bold text-xs"
              >
                𝕏
              </a>
              <a
                href="https://www.tiktok.com/@juristech.solutio6?_r=1&_t=ZS-98uWtMFrHld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-2 rounded-xl bg-slate-900 hover:bg-pink-500/20 text-pink-400 border border-slate-800 hover:border-pink-500/40 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.9 1.62V6.86a4.88 4.88 0 0 1-1-.17z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* 3. Mandatory Legal Disclaimer & Sovereign Independence */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed m-0 font-medium">
            {isRtl ? (
              <>
                إشعار واستقلالية قانونية رسمية: منصة <strong>JurisTech Solutions</strong> (حلول جوريس تك) هي كيان تقني ومؤسسي مستقل بذاته 100% يدار ومسجل في المملكة الأردنية الهاشمية (عمّان). المنصة ليست فرعاً أو وكيلاً أو مرتبطة بأي شكل من الأشكال بشركة LegalShield USA الأمريكية أو أي علامات تجارية أخرى تحمل أسماء مشابهة.
              </>
            ) : (
              <>
                Official Notice & Trademark Independence: <strong>JurisTech Solutions</strong> is a 100% sovereign, independent software platform headquartered in Amman, Jordan. Not affiliated with LegalShield USA or third-party trademark entities.
              </>
            )}
          </p>
        </div>

        {/* 4. Bottom Copyright & Security Status */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} JurisTech Solutions Sovereign Tech. {isRtl ? 'جميع الحقوق محفوظة قانونياً.' : 'All Rights Reserved.'}</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-400 font-bold">● {isRtl ? 'بيئة تشفير مصرفية نشطة' : 'Bank-Grade E2EE Active'}</span>
            <span className="font-mono text-cyan-400 font-bold">v10.5.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
