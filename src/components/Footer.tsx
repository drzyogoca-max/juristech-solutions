import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Scale,
  AlertTriangle,
  FileText,
  Globe,
  Mail,
  Smartphone,
  Linkedin,
  Building2,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';

export default function Footer() {
  const { l, isRtl } = usePlatformLocale();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';
  const currentYear = new Date().getFullYear();

  return (
    <footer
      dir={isRtl ? 'rtl' : 'ltr'}
      className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-12 pb-24 lg:pb-10 px-4 sm:px-6 lg:px-8 mt-auto font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Brand & Value Proposition Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">JurisTech Solutions</h3>
              <p className="text-xs text-slate-400">
                {l(
                  'منظومة الذكاء الاصطناعي القانونية السيادية للمؤسسات والشركات',
                  'Sovereign AI Legal Intelligence & Enterprise Automation'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {l('مطابق لـ 15+ نظام قضائي', '15+ Sovereign Frameworks')}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              {l('تشفير بنكي E2EE 256-bit', 'Bank-Grade AES-256')}
            </span>
          </div>
        </div>

        {/* 2. Streamlined Multi-Column Navigation (Mobile-responsive, No bare icons) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          {/* Column 1: Contracts Studio */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{l('صياغة وتدقيق العقود', 'Contracts Studio')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/contracts" className="hover:text-cyan-300 transition-colors block py-0.5">
                  {l('صانع ومولد العقود الذكية', 'AI Contract Generator')}
                </Link>
              </li>
              <li>
                <Link to="/repository" className="hover:text-cyan-300 transition-colors block py-0.5">
                  {l('مستودع المليون عقد المؤسسي', 'Mega 1M+ Contracts Repository')}
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-cyan-300 transition-colors block py-0.5">
                  {l('مكتبة النماذج والاتفاقيات الجاهزة', 'Verified Templates Studio')}
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-cyan-300 transition-colors block py-0.5">
                  {l('المستشار القانوني الذكي 24/7', '24/7 AI Legal Copilot')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Risk & Corporate */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{l('إدارة المخاطر والشركات', 'Risk & Corporate')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/deal-shield" className="hover:text-emerald-300 transition-colors block py-0.5 text-cyan-400 font-bold">
                  {l('رادار الصفقات ومستكشف الاحتياجات (DealShield)', 'DealShield 360™ & Need Radar')}
                </Link>
              </li>
              <li>
                <Link to="/risk" className="hover:text-emerald-300 transition-colors block py-0.5">
                  {l('مدقق المخاطر والبنود التعسفية', 'Contract Risk Audit')}
                </Link>
              </li>
              <li>
                <Link to="/company-formation" className="hover:text-emerald-300 transition-colors block py-0.5">
                  {l('تأسيس الشركات (MISA / DIFC)', 'Company Formation')}
                </Link>
              </li>
              <li>
                <Link to="/acquisition" className="hover:text-emerald-300 transition-colors block py-0.5">
                  {l('صفقات الاستحواذ والاندماج M&A', 'M&A Deal Intelligence')}
                </Link>
              </li>
              <li>
                <Link to="/enterprise-audit" className="hover:text-emerald-300 transition-colors block py-0.5">
                  {l('الفحص النافي للجهالة الشامل', 'Due Diligence Audit')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Arbitration */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{l('الأمان والتحكيم', 'Security & Vault')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/vault" className="hover:text-purple-300 transition-colors block py-0.5">
                  {l('خزنة المستندات المشفرة E2EE', 'Zero-Knowledge Encrypted Vault')}
                </Link>
              </li>
              <li>
                <Link to="/negotiation" className="hover:text-purple-300 transition-colors block py-0.5">
                  {l('مفاوض الصفقات وفض النزاعات', 'AI Dispute Resolution')}
                </Link>
              </li>
              <li>
                <Link to="/youtube-studio" className="hover:text-purple-300 transition-colors block py-0.5 text-red-400 font-bold">
                  {l('إدارة قناة يوتيوب الرسمية 📺', 'YouTube Studio & Daily Automation 📺')}
                </Link>
              </li>
              <li>
                <Link to="/video-hub" className="hover:text-purple-300 transition-colors block py-0.5">
                  {l('استوديو الوسائط والشرح المرئي', 'Media & Video Studio')}
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-purple-300 transition-colors block py-0.5">
                  {l('باقات الأسعار والاشتراكات', 'Pricing & Plans')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{l('الامتثال والسياسات', 'Governance & Legal')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors block py-0.5">
                  {l('من نحن والاستقلالية القانونية', 'About Us & Independence')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-300 transition-colors block py-0.5">
                  {l('الشروط والأحكام الرسمية', 'Terms of Service')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-amber-300 transition-colors block py-0.5">
                  {l('سياسة الخصوصية والأمان', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link to="/legal-compliance" className="hover:text-amber-300 transition-colors block py-0.5">
                  {l('الامتثال للائحة GDPR & PDPL', 'PDPL & GDPR Compliance')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Mandatory Legal Disclaimer & Sovereign Independence */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed m-0 font-medium">
            {l(
              'تنبيه نظامي: منصة JurisTech Solutions منظومة ذكاء اصطناعي قانونية استرشادية، ولا تُعد بديلاً عن المشورة القانونية المباشرة من محامٍ مرخص في دائرتك القضائية.',
              'Statutory Notice: JurisTech Solutions is an AI legal intelligence and document generation platform and does not constitute formal legal representation.'
            )}
          </p>
        </div>

        {/* 5. Bottom Copyright, Social Links & Security Status */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800/60">
          <p>© {currentYear} JurisTech Solutions. {l('جميع الحقوق محفوظة', 'All Rights Reserved')}.</p>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://www.linkedin.com/in/juristech-solutions-14954b427/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Linkedin className="w-4 h-4 text-sky-400" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://x.com/JurisTechAI"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X Twitter"
              className="text-slate-400 hover:text-sky-400 transition-colors font-bold text-xs flex items-center gap-1.5"
            >
              <span className="text-white font-black text-sm">𝕏</span>
              <span>Twitter</span>
            </a>
            <span className="text-emerald-400 font-bold ml-2">● {l('مشفر E2EE', 'E2EE Encrypted')}</span>
            <span className="font-mono text-cyan-400 font-bold">v10.8.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
