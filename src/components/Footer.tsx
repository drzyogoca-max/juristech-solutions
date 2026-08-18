import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Scale, AlertTriangle, FileText, Lock, Globe, Mail, ExternalLink, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const currentYear = new Date().getFullYear();

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-slate-800/80 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Mandatory Legal Disclaimer Highlight Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                  {isRtl ? 'إشعار إخلاء المسؤولية والاستقلالية القانونية' : 'Legal Independence & Disclaimer Notice'}
                </span>
                <span className="text-[10px] font-sans text-amber-300 font-bold"><bdi>[INDEPENDENT ENTITY]</bdi></span>
              </div>
              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                {isRtl ? (
                  <>
                    إشعار واستقلالية قانونية رسمية: منصة <strong><bdi>JurisTech Solutions</bdi></strong> (حلول جوريس تك) هي كيان تقني ومؤسسي مستقل بذاته 100% يدار ومسجل في المملكة الأردنية الهاشمية (عمّان). المنصة ليست فرعاً أو وكيلاً أو مرتبطة بأي شكل من الأشكال بشركة <strong><bdi>LegalShield USA</bdi></strong> الأمريكية أو أي علامات تجارية أخرى تحمل أسماء مشابهة.
                  </>
                ) : (
                  <>
                    Official Legal Notice & Trademark Independence: <strong><bdi>JurisTech Solutions</bdi></strong> is a 100% sovereign, independent regional software platform headquartered in Amman, Hashemite Kingdom of Jordan. This platform is not affiliated, associated, authorized, endorsed by, or in any way officially connected with <bdi>LegalShield USA</bdi> or any other third-party trademark entities.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                <img src="/logo.webp" alt="JurisTech Solutions" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" loading="lazy" decoding="async" />


              </div>
              <div>
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none block">
                  JurisTech Solutions <span className="text-cyan-400">| حلول جوريس تك</span>
                </span>
                <span className="text-[10px] font-sans text-cyan-400 block font-bold mt-0.5">
                  {isRtl ? 'المنظومة القانونية والذكاء الاصطناعي الشامل' : 'AI-POWERED LEGAL ECOSYSTEM'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl
                ? 'المنصة الموحدة الذكية لصياغة العقود وتدقيق المخاطر التشريعية المخصصة لدول الشرق الأوسط وشمال أفريقيا والعالم.'
                : 'Unified AI platform for contract generation and legislative risk auditing.'}
            </p>
            <div className="text-xs font-sans text-slate-400 flex items-center gap-1.5 pt-1">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <a href="mailto:juristech.solutions@outlook.com" className="hover:text-cyan-300 underline">
                juristech.solutions@outlook.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>{isRtl ? 'الخدمات الرئيسية' : 'Core Services'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/contracts" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'منشئ العقود الذكية' : 'Smart Contract Builder'}</span>
                </Link>
              </li>
              <li>
                <Link to="/risk" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'محلل المخاطر والامتثال' : 'Risk & Compliance Auditor'}</span>
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'المستشار القانوني الذكي' : 'AI Legal Advisory'}</span>
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'مكتبة الوثائق والمستندات' : 'Document Templates Library'}</span>
                </Link>
              </li>
              <li>
                <Link to="/company-formation" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'تأسيس الشركات وصياغة العقود التأسيسية' : 'Corporate Formation & Drafting'}</span>
                </Link>
              </li>
              <li>
                <Link to="/acquisition" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'منصة الاستحواذ والاندماج الدولية M&A' : 'International M&A Acquisition'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'الحوكمة والامتثال' : 'Legal & Governance'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors flex items-center gap-1 font-bold text-cyan-400">
                  <span>{isRtl ? 'من نحن والاستقلالية القانونية' : 'About Us & Independence'}</span>
                </Link>
              </li>
              <li>
                <Link to="/legal-compliance" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'مركز الامتثال والحوكمة' : 'Compliance & Governance Center'}</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'الشروط والأحكام الرسمية (eIDAS/GDPR)' : 'Terms of Service (eIDAS/GDPR)'}</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy'}</span>
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'مركز الدعم الفني والدعم المباشر' : '24/7 Support Desk'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Scope & Jordan Legal HQ */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{isRtl ? 'المقر الرئيسي والولاية القانونية' : 'Jordan HQ & Jurisdiction'}</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl
                ? 'المقر الرئيسي للمنصة: المملكة الأردنية الهاشمية — عمّان. مسجلة وتخضع حصرياً للتشريعات والقوانين المعمول بها في الأردن (قانون حماية حق المؤلف رقم 22).'
                : 'Global Headquarters: Amman, Hashemite Kingdom of Jordan. Governed exclusively by the statutory laws and IP regulations of the Hashemite Kingdom of Jordan.'}
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Drzyogo.ca@gmail.com</span>
              </div>
              <a 
                href="https://www.linkedin.com/in/juristech-solutions-14954b427/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="JurisTech Solutions on LinkedIn"
                className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-sans hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>JURISTECH Solutions | LinkedIn</span>
              </a>
              <a 
                href="https://www.tiktok.com/@juristech.solutio6?_r=1&_t=ZS-98uWtMFrHld" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="JurisTech Solutions on TikTok"
                className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-sans hover:text-pink-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-pink-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.9 1.62V6.86a4.88 4.88 0 0 1-1-.17z"/>
                </svg>
                <span>@juristech.solutio6 | TikTok</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Certified IP Copyright */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <p>© {currentYear} JurisTech Solutions. {isRtl ? 'جميع الحقوق محفوظة — المقر الرئيسي: المملكة الأردنية الهاشمية.' : 'All Rights Reserved — Global HQ: Hashemite Kingdom of Jordan.'}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 font-bold">● {isRtl ? 'حماية الملكية الفكرية نشطة' : 'IP Protection Active'}</span>
            <span className="font-mono text-cyan-400 font-bold">v10.1.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
