import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Scale, AlertTriangle, FileText, Globe, Mail,
  Smartphone, Linkedin, CheckCircle2,
  Building2
} from 'lucide-react';
import { usePlatformLocale } from '../lib/universalTranslator';

export default function Footer() {
  const { l, isRtl } = usePlatformLocale();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';
  const currentYear = new Date().getFullYear();

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. Full 18 Core Services Grid (Rendered on All Pages so information never disappears) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">

          
          {/* Column 1: Contracts & Templates */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/20 space-y-3 shadow-lg">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{l('صياغة ونماذج العقود', 'Contracts & Templates')}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/contracts" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-cyan-300">{l('صانع ومولد العقود الذكية', 'AI Contract Generator')}</span>
                </Link>
              </li>
              <li>
                <Link to="/repository" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-cyan-300">{l('مستودع المليون عقد المؤسسي', 'Mega 1M+ Contracts Repository')}</span>
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-cyan-300">{l('مكتبة النماذج والاتفاقيات الجاهزة', 'Verified Templates Studio')}</span>
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-cyan-300">{l('المستشار القانوني الذكي 24/7', '24/7 AI Legal Copilot')}</span>
                </Link>
              </li>
              <li>
                <Link to="/video-hub" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-cyan-300">{l('استوديو الوسائط والشرح المرئي', 'Video & Audio Media Studio')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Corporate & Investment */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/20 space-y-3 shadow-lg">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{l('الشركات والاستثمار', 'Corporate & Investment')}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/company-formation" className="hover:text-emerald-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">{l('تأسيس الشركات (MISA / DIFC / Delaware)', 'Company Formation')}</span>
                </Link>
              </li>
              <li>
                <Link to="/acquisition" className="hover:text-emerald-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">{l('صفقات الاستحواذ والاندماج M&A', 'M&A & Corporate Takeovers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/lead-radar" className="hover:text-emerald-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">{l('رادار الشركات والفرص التعاقدية B2B', 'B2B Lead & Contract Radar')}</span>
                </Link>
              </li>
              <li>
                <Link to="/b2b-proposals" className="hover:text-emerald-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">{l('صانع العروض والمقترحات للشركات', 'Enterprise B2B Proposals')}</span>
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-emerald-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">{l('باقات الاشتراكات المخصومة (30%)', '30% Discounted Tiers')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Risk & Due Diligence */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/20 space-y-3 shadow-lg">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{l('تدقيق المخاطر والتحري', 'Risk & Due Diligence')}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/risk" className="hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">{l('مدقق المخاطر والبنود التعسفية', 'Contract Risk & Liability Audit')}</span>
                </Link>
              </li>
              <li>
                <Link to="/enterprise-audit" className="hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">{l('الفحص النافي للجهالة الشامل', 'Enterprise Due Diligence Audit')}</span>
                </Link>
              </li>
              <li>
                <Link to="/legal-compliance" className="hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">{l('الامتثال التشريعي وحوكمة الشركات', 'Regulatory Compliance (PDPL/GDPR)')}</span>
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">{l('التقارير الإستراتيجية للمدراء', 'C-Suite Strategic Reports')}</span>
                </Link>
              </li>
              <li>
                <Link to="/sovereign-ai-hub" className="hover:text-amber-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">{l('مركز الذكاء السيادي متعدد النماذج', 'Multi-Model Sovereign AI Hub')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Arbitration, Security & Official Channels */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-500/20 space-y-3 shadow-lg">
            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Scale className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{l('التحكيم والأمان والروابط', 'Arbitration & Security')}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/negotiation" className="hover:text-purple-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-purple-300">{l('مفاوض الصفقات وفض النزاعات الآلي', 'AI Negotiation & Dispute Resolver')}</span>
                </Link>
              </li>
              <li>
                <Link to="/vault" className="hover:text-purple-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-purple-300">{l('خزنة المستندات المشفرة E2EE', 'Zero-Knowledge Encrypted Vault')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-purple-300">{l('من نحن والاستقلالية القانونية', 'About Us & Independence')}</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-purple-300">{l('الشروط والأحكام الرسمية', 'Official Terms of Service')}</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-purple-300 transition-colors flex items-center gap-2 group">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200 group-hover:text-purple-300">{l('سياسة الخصوصية والأمان', 'Privacy & Data Protection Policy')}</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 2. Direct Executive Contact & Fast Channels (Rendered ONLY on Dashboard) */}
        {isHomePage && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{l('البريد المعتمد للإدارة:', 'Official Executive Email:')} <code className="text-sky-300 font-mono">Drzyogo.ca@gmail.com</code></span>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{l('الواتساب المباشر:', 'Direct WhatsApp:')} <code className="text-emerald-300 font-mono">+201126674337</code></span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{l('إنستا باي مصر:', 'InstaPay Egypt:')} <code className="text-purple-300 font-mono">+201031222262</code></span>
            </div>
          </div>
        )}


        {/* 3. Mandatory Legal Disclaimer & Sovereign Independence */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed m-0 font-medium">
            {l(
              'تنبيه نظامي: منصة JurisTech Solutions منظومة ذكاء اصطناعي قانونية استرشادية، ولا تُعد بديلاً عن المشورة القانونية المباشرة من محامٍ مرخص في دائرتك القضائية.',
              'Statutory Notice: JurisTech Solutions is an AI legal intelligence and document generation platform and does not constitute formal legal representation.'
            )}
          </p>
        </div>

        {/* 4. Bottom Copyright, Social Links & Security Status */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} JurisTech Solutions. {l('جميع الحقوق محفوظة', 'All Rights Reserved')}.</p>
          
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
            <span className="text-emerald-400 font-bold ml-2">● {l('مشفر E2EE', 'E2EE Encrypted')}</span>
            <span className="font-mono text-cyan-400 font-bold">v10.7.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
