import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield, Scale, AlertTriangle, FileText, Lock, Globe, Mail,
  MessageCircle, Smartphone, ExternalLink, Linkedin, CheckCircle2,
  Building2, Briefcase, Cpu, Award, Key
} from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';
  const currentYear = new Date().getFullYear();

  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. Reserved Space for Future Advertising & Corporate Sponsors (Only on Home Page) */}
        {isHomePage && (
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-dashed border-sky-500/30 text-center space-y-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-72 h-16 bg-sky-500/5 blur-3xl pointer-events-none rounded-full" />
            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20 inline-block">
                {isRtl ? 'مساحة مخصصة للإعلانات والشراكات الإستراتيجية' : 'Reserved Enterprise Sponsorship & Ad Space'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isRtl
                  ? 'مساحة مخصصة لرعايات الشركات وإعلانات الحلول الرقمية والتقنية القانونية'
                  : 'Premium Showcase Reserved for Certified Legal Tech & Enterprise Sponsors'}
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {isRtl
                  ? 'لحجز مساحات إعلانية وشراكات استراتيجية لشركات الدعاية والإعلان، يرجى التواصل مع إدارة المنصة عبر: juristech.solutions@outlook.com'
                  : 'For enterprise advertising, sponsored placements & media partnerships, reach out to: juristech.solutions@outlook.com'}
              </p>
            </div>
          </div>
        )}

        {/* 2. Full 18 Core Services Grid (Rendered Only on Home Page) */}
        {isHomePage && (
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
            </div>

          </div>
        )}

        {/* 3. Essential Quick Governance & Independence Links (Shown on all pages) */}
        {!isHomePage && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 border-b border-slate-800/80 pb-4">
            <Link to="/dashboard" className="hover:text-sky-400 transition-colors font-bold text-sky-400">
              {isRtl ? '← العودة للرئيسية والداشبورد' : '← Return to Dashboard'}
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/about" className="hover:text-cyan-300 transition-colors">{isRtl ? 'من نحن' : 'About Us'}</Link>
            <span className="text-slate-700">•</span>
            <Link to="/legal-compliance" className="hover:text-cyan-300 transition-colors">{isRtl ? 'الامتثال والحوكمة' : 'Compliance'}</Link>
            <span className="text-slate-700">•</span>
            <Link to="/terms" className="hover:text-cyan-300 transition-colors">{isRtl ? 'الشروط والأحكام' : 'Terms'}</Link>
            <span className="text-slate-700">•</span>
            <Link to="/privacy" className="hover:text-cyan-300 transition-colors">{isRtl ? 'الخصوصية' : 'Privacy'}</Link>
            <span className="text-slate-700">•</span>
            <Link to="/support" className="hover:text-cyan-300 transition-colors">{isRtl ? 'الدعم الفني' : 'Support'}</Link>
          </div>
        )}

        {/* 4. Mandatory Legal Disclaimer & Sovereign Independence */}
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

        {/* 5. Bottom Copyright, Social Links & Security Status */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} JurisTech Solutions Sovereign Tech. {isRtl ? 'جميع الحقوق محفوظة قانونياً — المقر الرئيسي: عمّان، الأردن.' : 'All Rights Reserved — Global HQ: Amman, Jordan.'}</p>
          
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/juristech-solutions-14954b427/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-sky-400 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/JurisTechAI"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X Twitter"
              className="text-slate-400 hover:text-sky-400 transition-colors font-bold text-xs"
            >
              𝕏
            </a>
            <a
              href="https://www.tiktok.com/@juristech.solutio6?_r=1&_t=ZS-98uWtMFrHld"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-slate-400 hover:text-pink-400 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.9 1.62V6.86a4.88 4.88 0 0 1-1-.17z"/>
              </svg>
            </a>
            <span className="text-emerald-400 font-bold ml-2">● {isRtl ? 'مشفر E2EE' : 'E2EE'}</span>
            <span className="font-mono text-cyan-400 font-bold">v10.6.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
