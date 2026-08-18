import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home, MessageSquare, FileText, AlertTriangle, Library, Handshake, Users,
  Building2, Video, CreditCard, Headphones, Share2, Menu, X, Shield, ShieldCheck,
  BarChart3, DollarSign, Search, Scale, Globe, Phone, Crown, ChevronDown,
  Sparkles, Zap, Star, ArrowRight, Lock, Palette, Mail, ShieldAlert, Edit3, Briefcase
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import AlertBell from './AlertBell';
import EngineAISearchBar from './EngineAISearchBar';
import JurisdictionSelectorModal from './JurisdictionSelectorModal';
import LiveMeetingModal from './LiveMeetingModal';
import ThemeFontSelectorModal from './ThemeFontSelectorModal';
import CompanyProfileModal from './CompanyProfileModal';
import LegalConsultationBookingModal from './LegalConsultationBookingModal';
import { useAuth } from '../lib/authContext';
import { detectVisitorJurisdiction, JurisdictionInfo } from '../lib/jurisdiction';

// ─── Nav link groups (Visitor & Subscriber separated) ────────────────────────
const VISITOR_LINKS = [
  { to: '/dashboard', icon: Home, key: 'dashboard' },
  { to: '/chat', icon: MessageSquare, key: 'chat' },
  { to: '/repository', icon: Library, key: 'repository' },
  { to: '/payment', icon: CreditCard, key: 'payment' },
  { to: '/support', icon: Headphones, key: 'support' },
  { to: '/about', icon: Building2, key: 'aboutUs' },
  { to: '/legal-compliance', icon: Scale, key: 'legalCompliance' },
];

const SUBSCRIBER_LINKS = [
  { to: '/contracts', icon: FileText, key: 'contracts' },
  { to: '/risk', icon: AlertTriangle, key: 'risk' },
  { to: '/vault', icon: Lock, key: 'vault' },
  { to: '/negotiation', icon: Handshake, key: 'negotiation' },
  { to: '/enterprise-audit', icon: Building2, key: 'enterpriseAudit' },
  { to: '/investigate', icon: Search, key: 'investigate' },
  { to: '/lead-radar', icon: Users, key: 'leadRadar' },
  { to: '/video-hub', icon: Video, key: 'videoHub' },
  { to: '/company-formation', icon: Building2, key: 'companyFormation' },
  { to: '/acquisition', icon: Briefcase, key: 'acquisition' },
  { to: '/sponsors-ads', icon: DollarSign, key: 'sponsorsAds' },
  { to: '/social-marketing', icon: Share2, key: 'socialMarketing' },
  { to: '/reports', icon: BarChart3, key: 'reports' },
];

// Top 5 most important links for the visible navbar bar
const TOP_NAV = [
  { to: '/dashboard', key: 'dashboard' },
  { to: '/chat', key: 'chat' },
  { to: '/contracts', key: 'contracts' },
  { to: '/risk', key: 'risk' },
  { to: '/repository', key: 'repository' },
  { to: '/sovereign-ai-hub', key: 'sovereignAiHub' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [activeJurisdiction, setActiveJurisdiction] = useState<JurisdictionInfo | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    detectVisitorJurisdiction().then(setActiveJurisdiction);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => { setIsOpen(false); setShowMoreMenu(false); }, [pathname]);

  function navText(key: string) {
    return t(`Nav.${key}`);
  }

  const allLinks = [...VISITOR_LINKS, ...SUBSCRIBER_LINKS.filter(l => !VISITOR_LINKS.some(v => v.to === l.to))];


  return (
    <>
      {/* ── Accessible Skip to Content Link ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        {isRtl ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      <JurisdictionSelectorModal
        isOpen={showJurisdictionModal}
        onClose={() => setShowJurisdictionModal(false)}
        onSelectJurisdiction={(j) => setActiveJurisdiction(j)}
      />
      <LiveMeetingModal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)} />
      <ThemeFontSelectorModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
      <CompanyProfileModal isOpen={showCompanyModal} onClose={() => setShowCompanyModal(false)} />
      <LegalConsultationBookingModal isOpen={showConsultationModal} onClose={() => setShowConsultationModal(false)} />

      {/* ─── Main Navbar ────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label={isRtl ? 'التنقل الرئيسي' : 'Main Navigation'}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-slate-950/50'
            : 'bg-slate-900/98 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">

          {/* ── Brand ─────────────────────────────────────────────────────── */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group shrink-0" aria-label="JurisTech Solutions Home">
            <div className="p-1 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/10">
              <img src="/logo.webp" alt="JurisTech Solutions Logo" width={32} height={32} loading="eager" decoding="async" fetchPriority="high" className="w-8 h-8 rounded-xl object-cover" />



            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors tracking-tight leading-none block">
                  JurisTech Solutions <span className="text-cyan-400">| حلول جوريس تك</span>
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                  {i18n.language === 'ar' ? 'المنصة الموحدة' : i18n.language === 'fr' ? 'Plateforme Unifiée' : i18n.language === 'de' ? 'Einheitliche Plattform' : i18n.language === 'es' ? 'Plataforma Unificada' : i18n.language === 'zh' ? '统一平台' : i18n.language === 'tr' ? 'Birleşik Platform' : 'Unified Platform'}
                </span>
              </div>
              <span className="text-[9px] font-sans text-slate-500 dark:text-slate-400 block font-bold tracking-wider uppercase mt-0.5">
                {i18n.language === 'ar' ? 'المنظومة القانونية والذكاء الاصطناعي الشامل' : i18n.language === 'fr' ? 'ÉCOSYSTÈME JURIDIQUE IA COMPLET' : i18n.language === 'de' ? 'VOLLSTÄNDIGES KI-RECHTSÖKOSYSTEM' : i18n.language === 'es' ? 'ECOSISTEMA LEGAL INTEGRAL CON IA' : i18n.language === 'zh' ? '主权AI全栈法律生态系统' : i18n.language === 'tr' ? 'YAPAY ZEKA DESTEKLİ HUKUK EKOSİSTEMİ' : 'AI-POWERED LEGAL ECOSYSTEM'}
              </span>
            </div>
          </Link>

          {/* ── Integrated Search & Action Controls ────────────────── */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-xl mx-2">
            <div className="w-full">
              <EngineAISearchBar />
            </div>
          </div>

          {/* ── Center Action Controls & More Menu Dropdown ────────────────── */}
          <div className="hidden xl:flex items-center gap-1.5 shrink-0">
            {/* Quick Action: Direct Legislative Advisor Modal */}
            <button
              onClick={() => setShowJurisdictionModal(true)}
              aria-label={t('Jurisdiction.title')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-xs font-bold transition-all"
              title={t('Jurisdiction.title')}
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              {activeJurisdiction?.flagEmoji ? `${activeJurisdiction.flagEmoji} ` : ''}
              {t('Nav.jurisdictionLaw')}
            </button>

            {/* Quick Action: Book Strategic Advisor Dr. Mohammed Mustafa */}
            <button
              onClick={() => setShowConsultationModal(true)}
              aria-label={t('Consultation.title')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 text-xs font-bold transition-all"
              title={t('Consultation.title')}
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              {t('Nav.bookAdvisor')}
            </button>

            {/* Quick Action: Custom Themes & Fonts */}
            <button
              onClick={() => setShowThemeModal(true)}
              aria-label={t('Theme.title')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 text-xs font-bold transition-all"
              title={t('Theme.title')}
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              {t('Nav.themeFontLabel')}
            </button>

            {/* Unified "المزيد" (More Menu) Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                aria-label={t('Nav.more')}
                aria-expanded={showMoreMenu}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all shadow-md"
              >
                {t('Nav.more')} ▾
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className={`absolute top-full mt-2 z-50 w-[520px] max-w-[92vw] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl shadow-slate-950/90 p-4 space-y-3 ${isRtl ? 'left-0' : 'right-0'}`}>
                    
                    {/* Modal Controls Section */}
                    <div>
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block px-2 mb-1.5">
                        {t('Nav.more')}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <button
                          onClick={() => { setShowMoreMenu(false); setShowCompanyModal(true); }}
                          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-right"
                        >
                          <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="leading-snug">{t('Nav.companyFiles')}</span>
                        </button>
                        <button
                          onClick={() => { setShowMoreMenu(false); setShowMeetingModal(true); }}
                          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-right"
                        >
                          <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="leading-snug">{t('Nav.liveOnlineConsultation')}</span>
                        </button>
                      </div>
                    </div>


                    {/* Main Nav Links Section */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block px-2 mb-1.5">
                        {isRtl ? 'الخدمات الأساسية' : 'Core Services'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {VISITOR_LINKS.map(({ to, icon: Icon, key }) => (
                          <Link key={to} to={to} onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                              pathname === to
                                ? 'text-cyan-400 bg-slate-100 dark:bg-slate-800 border border-cyan-500/20 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                            }`}>
                            <Icon className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                            <span className="leading-snug">{navText(key)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Subscriber Tools Section */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 px-2 mb-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                          {t('Nav.subscriberTools')}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {SUBSCRIBER_LINKS.map(({ to, icon: Icon, key }) => (
                          <Link key={to} to={to} onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                              pathname === to
                                ? 'text-cyan-400 bg-slate-100 dark:bg-slate-800 border border-cyan-500/20 font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                            }`}>
                            <Icon className="w-3.5 h-3.5 text-cyan-400/70 shrink-0" />
                            <span className="leading-snug">{navText(key)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Subscribe & Admin */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                      <Link to="/payment" onClick={() => setShowMoreMenu(false)}
                        className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-slate-900 dark:text-white font-bold text-xs hover:brightness-110 transition-all group">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          {t('Nav.subscribe')}
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                      </Link>

                      {isAdmin && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block px-1">
                            {isRtl ? 'نوافذ ولوحات الإدارة العليا (Admin Windows)' : 'Sovereign Admin Windows'}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            <Link to="/admin" onClick={() => setShowMoreMenu(false)}
                              className="flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{isRtl ? '1. خزينة الإدارة' : '1. Chairman Vault'}</span>
                            </Link>
                            <Link to="/admin/financial" onClick={() => setShowMoreMenu(false)}
                              className="flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                              <DollarSign className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{isRtl ? '2. لوحة المالية' : '2. Financial Suite'}</span>
                            </Link>
                            <Link to="/admin/analytics" onClick={() => setShowMoreMenu(false)}
                              className="flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
                              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{isRtl ? '3. التحليلات الجغرافية' : '3. Geo Analytics'}</span>
                            </Link>
                            <Link to="/admin/anti-fraud" onClick={() => setShowMoreMenu(false)}
                              className="flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{isRtl ? '4. مدقق الاحتيال' : '4. Anti-Fraud Audit'}</span>
                            </Link>
                            <Link to="/admin/review-queue" onClick={() => setShowMoreMenu(false)}
                              className="flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                              <Edit3 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{isRtl ? '5. المراجعة البشرية' : '5. Review Queue'}</span>
                            </Link>
                            <Link to="/admin/receipt-review" onClick={() => setShowMoreMenu(false)}
                              className="flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{isRtl ? '6. فحص الإيصالات' : '6. Receipt Verification'}</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right Controls ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            <AlertBell />
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Subscribe CTA pill */}
            <Link to="/payment"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-900 dark:text-white text-xs font-black hover:opacity-90 transition-all shadow-md shadow-indigo-500/20">
              <Crown className="w-3.5 h-3.5" />
              {t('Nav.subscribe')}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Slide-in Drawer ─────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsOpen(false)}>
          <div
            className={`fixed top-0 bottom-0 w-[85vw] max-w-[340px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-0 transition-all duration-300 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}`}
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-black text-base">JurisTech<span className="text-slate-900 dark:text-white"> Solutions</span></span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={isRtl ? 'إغلاق القائمة' : 'Close menu'}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="p-4 space-y-2 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => { setIsOpen(false); setShowMeetingModal(true); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 font-bold text-blue-300 text-xs flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                {t('Nav.liveOnlineConsultation')}
              </button>
              <button
                onClick={() => { setIsOpen(false); setShowJurisdictionModal(true); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 font-bold text-amber-300 text-xs flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4" />
                {activeJurisdiction?.flagEmoji ? `${activeJurisdiction.flagEmoji} ` : ''}
                {t('Nav.directLegislativeAdvisor')}
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <EngineAISearchBar />
            </div>

            {/* Scrollable nav links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1 mb-2">
                {t('Common.filter')}
              </p>
              {VISITOR_LINKS.map(({ to, icon: Icon, key }) => (
                <Link key={to} to={to} onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all ${
                    pathname === to
                      ? 'text-cyan-400 bg-slate-800/80 border border-cyan-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800/50'
                  }`}>
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  {navText(key)}
                </Link>
              ))}

              {/* Subscriber tools section */}
              <div className="mt-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 px-1 mb-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    {t('Nav.subscriberTools')}
                  </p>
                </div>
                {SUBSCRIBER_LINKS.map(({ to, icon: Icon, key }) => (
                  <Link key={to} to={to} onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all ${
                      pathname === to
                        ? 'text-cyan-400 bg-slate-800/80 border border-cyan-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800/50'
                    }`}>
                    <Icon className="w-4 h-4 text-cyan-400/70 shrink-0" />
                    {navText(key)}
                  </Link>
                ))}
              </div>

              {/* WhatsApp & Admin */}
              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                <Link to="/support" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/15 transition-all">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{isRtl ? 'مركز الدعم الفني المشفر والتذاكر' : '24/7 Support Ticket Desk'}</span>
                </Link>
                {isAdmin && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block px-1">
                      {isRtl ? 'لوحات الإدارة العليا (Admin Windows)' : 'Sovereign Admin Windows'}
                    </span>
                    <Link to="/admin" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xs font-bold px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/15 transition-all">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>{isRtl ? '1. خزينة رئيس مجلس الإدارة' : '1. Chairman Vault'}</span>
                    </Link>
                    <Link to="/admin/financial" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      <span>{isRtl ? '2. لوحة الإدارة والمالية' : '2. Financial & Billing'}</span>
                    </Link>
                    <Link to="/admin/analytics" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xs font-bold px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/15 transition-all">
                      <BarChart3 className="w-4 h-4 shrink-0" />
                      <span>{isRtl ? '3. التحليلات الجغرافية والمالية' : '3. Geo Analytics'}</span>
                    </Link>
                    <Link to="/admin/anti-fraud" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xs font-bold px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-all">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{isRtl ? '4. مدقق الاحتيال والمكافحة' : '4. Anti-Fraud Auditor'}</span>
                    </Link>
                    <Link to="/admin/review-queue" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xs font-bold px-3 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/15 transition-all">
                      <Edit3 className="w-4 h-4 shrink-0" />
                      <span>{isRtl ? '5. طابور المراجعة البشرية' : '5. Human Review Queue'}</span>
                    </Link>
                    <Link to="/admin/receipt-review" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-xs font-bold px-3 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/15 transition-all">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>{isRtl ? '6. فحص الإيصالات البنكية' : '6. Bank Receipt Audit'}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Subscribe CTA at bottom */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link to="/payment" onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-900 dark:text-white font-black text-sm shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all">
                <Zap className="w-4 h-4" />
                {t('Nav.subscribe')}
              </Link>
              <div className="pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 mb-2 font-semibold">{t('Common.language')}</p>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
