import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, User, Mail, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { dispatchWhatsAppNotification } from '../services/engine-ai';
import { detectVisitorJurisdiction, JurisdictionInfo } from '../lib/jurisdiction';
import { getUITranslations } from '../lib/uiTranslations';

interface LeadCaptureModalProps {
  onSuccess: () => void;
}

export default function LeadCaptureModal({ onSuccess }: LeadCaptureModalProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'ar';
  const isRtl = lang === 'ar';
  const ui = getUITranslations(lang);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo | null>(null);

  useEffect(() => {
    detectVisitorJurisdiction().then((jur) => {
      setJurisdiction(jur);
      setCountry(jur.countryNameAr || jur.countryName);
    });
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('juristech_user_registered', 'guest');
    onSuccess();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || loading) return;

    setLoading(true);

    try {
      // 1. Save lead to live database
      try {
        await supabase.from('leads').insert({
          full_name: fullName,
          email,
          country: country || jurisdiction?.countryName || 'Global',
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('Lead DB insert notice:', dbErr);
      }

      // 2. Save registration status to local storage
      localStorage.setItem('juristech_user_registered', 'true');
      localStorage.setItem('juristech_user_name', fullName);
      localStorage.setItem('juristech_user_email', email);

      // 3. Dispatch real-time WhatsApp alert to +201126674337
      await dispatchWhatsAppNotification({
        eventType: 'NEW_REGISTRATION',
        clientName: fullName,
        clientEmail: email,
        planOrService: country,
      });

      onSuccess();
    } catch (err) {
      console.warn('Lead capture exception:', err);
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden my-auto"
      >

        {/* Dismiss / Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-800/50"
          title={ui.leadCapture.closeTooltip}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {ui.leadCapture.welcomeTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {ui.leadCapture.welcomeSub}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{ui.leadCapture.fullNameLabel}</label>
            <div className="relative">
              <User className="w-4 h-4 absolute top-3.5 right-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                required
                placeholder={ui.leadCapture.fullNamePlaceholder}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 pr-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{ui.leadCapture.emailLabel}</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute top-3.5 right-3 text-slate-500 dark:text-slate-400" />
              <input
                type="email"
                required
                placeholder={ui.leadCapture.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pr-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-extrabold text-white text-xs sm:text-sm transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
          >
            <span>{loading ? ui.leadCapture.submittingBtn : ui.leadCapture.submitBtn}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors text-center block"
          >
            {ui.leadCapture.skipBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
