import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home, MessageSquare, FileText, AlertTriangle, Shield,
  Lock, CreditCard, Video, BarChart3, HelpCircle, X,
  Building2, Scale, Zap, Sparkles, ChevronRight, User, LogIn, LogOut
} from 'lucide-react';
import TwoFactorAuthModal from './TwoFactorAuthModal';
import CustomerAuthModal from './CustomerAuthModal';
import { useAuth } from '../lib/authContext';
import { usePlatformLocale } from '../lib/universalTranslator';

export default function MobileBottomNav() {
  const { l, t, isRtl } = usePlatformLocale();
  const location = useLocation();
  const { isAdmin, user, signOut } = useAuth();

  const [showDrawer, setShowDrawer] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const currentPath = location.pathname;

  const PRIMARY_NAV = [
    { to: '/dashboard', icon: Home, labelAr: 'الرئيسية', labelEn: 'Home', i18nKey: 'Nav.dashboard' },
    { to: '/chat', icon: MessageSquare, labelAr: 'المستشار', labelEn: 'Advisor', i18nKey: 'Nav.chat' },
    { to: '/contracts', icon: FileText, labelAr: 'العقود AI', labelEn: 'Contracts', i18nKey: 'Nav.contracts' },
    { to: '/risk', icon: AlertTriangle, labelAr: 'المخاطر', labelEn: 'Risk', i18nKey: 'Nav.risk' },
  ];

  const SECONDARY_SERVICES = [
    { to: '/vault', icon: Lock, labelAr: 'الخزنة المشفرة (E2EE)', labelEn: 'Encrypted Vault (E2EE)', i18nKey: 'Nav.vault', badge: 'E2EE' },
    { to: '/payment', icon: CreditCard, labelAr: 'الأسعار والاشتراكات', labelEn: 'Pricing & Plans', i18nKey: 'Nav.payment' },
    { to: '/video-hub', icon: Video, labelAr: 'مركز الفيديو والإعلانات', labelEn: 'Video Ad Studio', i18nKey: 'Nav.videoHub', badge: '90s' },
    { to: '/enterprise-audit', icon: Building2, labelAr: 'التدقيق المؤسسي', labelEn: 'Enterprise Audit', i18nKey: 'Nav.enterpriseAudit' },
    { to: '/legal-compliance', icon: Scale, labelAr: 'الامتثال القانوني الدولي', labelEn: 'Global Compliance', i18nKey: 'Nav.legalCompliance' },
    { to: '/reports', icon: BarChart3, labelAr: 'التقارير الجنائية الذكية', labelEn: 'Forensic Reports', i18nKey: 'Nav.reports' },
    { to: '/support', icon: HelpCircle, labelAr: 'المساعدة والدعم المباشر', labelEn: 'Direct Support', i18nKey: 'Nav.support' },
  ];

  return (
    <>
      {/* ─── Sovereign Mobile Bottom Navigation ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden backdrop-blur-2xl border-t border-brand-500/15 px-2 py-1.5 transition-all"
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          background: 'rgba(10,11,20,0.92)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6), 0 -1px 0 rgba(99,102,241,0.15)',
        }}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-brand-400 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 shadow-brand-sm" />
                )}
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-brand-500/15 shadow-brand-sm' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                  {item.i18nKey ? (t(item.i18nKey, item.labelEn) || l(item.labelAr, item.labelEn)) : l(item.labelAr, item.labelEn)}
                </span>
              </Link>
            );
          })}

          {/* 5th Button: Quick Services & Security Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowDrawer(true)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              showDrawer
                ? 'text-brand-400 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="p-1 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/15 text-brand-300 border border-brand-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {l('الأمان والمزيد', 'Security+')}
            </span>
          </button>
        </div>
      </nav>

      {/* ─── Slide-Up Quick Drawer for Mobile ─── */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={() => setShowDrawer(false)}
        >
          <div
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            {/* Drawer Handle & Header */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-2" />
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {l('مركز الأمان والخدمات السيادية', 'Sovereign Security & Services')}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {l('تشفير E2EE • تحقق ثنائي 2FA • 15 نظام تشريعي', 'E2EE • 2FA Authentication • 15 Jurisdictions')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Account / Login Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>{user ? (user.email?.split('@')[0] || l('حسابي', 'My Account')) : l('تسجيل الدخول / حساب جديد', 'Account Login / Sign Up')}</span>
                    {user && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">CLIENT</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono truncate max-w-[170px]">
                    {user ? user.email : l('سجل دخولك لحفظ جلساتك ومستنداتك', 'Sign in to preserve sessions & docs')}
                  </p>
                </div>
              </div>
              {!user ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowDrawer(false);
                    setShowAuthModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 text-xs font-black shrink-0 transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{l('دخول', 'Login')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-xs font-bold shrink-0 transition-all border border-slate-700 cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{l('خروج', 'Logout')}</span>
                </button>
              )}
            </div>

            {/* 2FA Quick Action Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>{l('التحقق الثنائي (2FA TOTP)', '2FA Authentication')}</span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">ACTIVE</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    {l('حماية الحساب عبر رمز OTP مشفر', 'RFC 6238 TOTP Account Protection')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  setShow2FA(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shrink-0 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {l('إدارة 2FA', 'Manage')}
              </button>
            </div>

            {/* Secondary Services Grid */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1 block mb-2">
                {l('كافة الخدمات والأنظمة القانونية', 'All Platform Legal AI Engines')}
              </span>
              {SECONDARY_SERVICES.map((srv) => {
                const Icon = srv.icon;
                return (
                  <Link
                    key={srv.to}
                    to={srv.to}
                    onClick={() => setShowDrawer(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                        {l(srv.labelAr, srv.labelEn)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {srv.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {srv.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 text-slate-500 ${isRtl ? 'rotate-180' : ''}`} />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FA && (
        <TwoFactorAuthModal
          isOpen={show2FA}
          onClose={() => setShow2FA(false)}
        />
      )}

      {/* Customer Auth Modal */}
      {showAuthModal && (
        <CustomerAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
