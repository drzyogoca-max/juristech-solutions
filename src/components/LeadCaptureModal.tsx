import React, { useState, useEffect } from 'react';
import { X, Mail, Sparkles, Zap, CheckCircle2, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import { dispatchWhatsAppNotification } from '../services/engine-ai';

const LS_KEY = 'jt_lead_captured_v2';
const SHOW_DELAY_MS = 5000;

const CONTENT: Record<string, {
  headline: string; subline: string; namePlaceholder: string; emailPlaceholder: string;
  cta: string; skip: string; success: string; successSub: string; badge: string;
  nameLabel: string; emailLabel: string; privacy: string;
}> = {
  ar: {
    headline: '🏛️ انضم إلى JurisTech Solutions',
    subline: 'احصل على استشارتك القانونية الأولى مجاناً مع تحديثات حصرية عبر بريدك الإلكتروني.',
    namePlaceholder: 'اسمك الكامل أو اسم الشركة',
    emailPlaceholder: 'بريدك الإلكتروني المؤسسي',
    cta: 'ابدأ الاستشارة المجانية الآن',
    skip: 'تخطّي الآن، ربما لاحقاً',
    success: '✅ تم التسجيل بنجاح!',
    successSub: 'سيتواصل معك فريقنا القانوني قريباً عبر البريد الإلكتروني.',
    badge: 'حصري للمؤسسات والشركات',
    nameLabel: 'الاسم الكامل',
    emailLabel: 'البريد الإلكتروني',
    privacy: 'بياناتك محمية ومشفرة. لن تُشارك مع أي طرف ثالث.',
  },
  en: {
    headline: '🏛️ Join JurisTech Solutions',
    subline: 'Get your first free legal consultation & exclusive institutional updates to your inbox.',
    namePlaceholder: 'Your full name or company name',
    emailPlaceholder: 'Your corporate email address',
    cta: 'Start Free Consultation Now',
    skip: 'Skip for now, maybe later',
    success: '✅ Successfully Registered!',
    successSub: 'Our legal team will reach out to you shortly via email.',
    badge: 'Exclusive for Enterprises & Corporates',
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    privacy: 'Your data is encrypted and never shared with third parties.',
  },
  fr: {
    headline: '🏛️ Rejoignez JurisTech Solutions',
    subline: 'Obtenez votre première consultation juridique gratuite et des mises à jour exclusives.',
    namePlaceholder: 'Votre nom complet ou nom de société',
    emailPlaceholder: 'Votre adresse e-mail professionnelle',
    cta: 'Commencer gratuitement maintenant',
    skip: "Passer pour l'instant",
    success: '✅ Inscription réussie !',
    successSub: 'Notre équipe juridique vous contactera bientôt par e-mail.',
    badge: 'Exclusif aux entreprises et institutions',
    nameLabel: 'Nom complet',
    emailLabel: 'Adresse e-mail',
    privacy: 'Vos données sont chiffrées et jamais partagées avec des tiers.',
  },
  de: {
    headline: '🏛️ Treten Sie JurisTech Solutions bei',
    subline: 'Erhalten Sie Ihre erste kostenlose Rechtsberatung und exklusive Updates.',
    namePlaceholder: 'Ihr vollständiger Name oder Firmenname',
    emailPlaceholder: 'Ihre geschäftliche E-Mail-Adresse',
    cta: 'Jetzt kostenlos starten',
    skip: 'Jetzt überspringen',
    success: '✅ Erfolgreich registriert!',
    successSub: 'Unser Rechtsteam wird Sie bald per E-Mail kontaktieren.',
    badge: 'Exklusiv für Unternehmen',
    nameLabel: 'Vollständiger Name',
    emailLabel: 'E-Mail-Adresse',
    privacy: 'Ihre Daten sind verschlüsselt und werden niemals an Dritte weitergegeben.',
  },
  es: {
    headline: '🏛️ Únase a JurisTech Solutions',
    subline: 'Obtenga su primera consulta legal gratuita y actualizaciones exclusivas.',
    namePlaceholder: 'Su nombre completo o nombre de empresa',
    emailPlaceholder: 'Su correo electrónico corporativo',
    cta: 'Comenzar consulta gratuita ahora',
    skip: 'Omitir por ahora',
    success: '✅ ¡Registrado con éxito!',
    successSub: 'Nuestro equipo legal se comunicará con usted pronto.',
    badge: 'Exclusivo para empresas e instituciones',
    nameLabel: 'Nombre completo',
    emailLabel: 'Correo electrónico',
    privacy: 'Sus datos están cifrados y nunca se comparten con terceros.',
  },
  zh: {
    headline: '🏛️ 加入 JurisTech Solutions',
    subline: '获得您的第一次免费法律咨询及独家企业更新。',
    namePlaceholder: '您的全名或公司名称',
    emailPlaceholder: '您的企业电子邮件地址',
    cta: '立即开始免费咨询',
    skip: '暂时跳过',
    success: '✅ 注册成功！',
    successSub: '我们的法律团队将很快通过电子邮件与您联系。',
    badge: '专为企业和机构提供',
    nameLabel: '全名',
    emailLabel: '电子邮件地址',
    privacy: '您的数据已加密，永不与第三方共享。',
  },
  tr: {
    headline: "🏛️ JurisTech Solutions'a Katılın",
    subline: 'İlk ücretsiz hukuki danışmanlığınızı ve özel güncellemelerinizi alın.',
    namePlaceholder: 'Tam adınız veya şirket adınız',
    emailPlaceholder: 'Kurumsal e-posta adresiniz',
    cta: 'Şimdi Ücretsiz Başlayın',
    skip: 'Şimdilik atla',
    success: '✅ Başarıyla Kaydedildi!',
    successSub: 'Hukuk ekibimiz yakında e-posta yoluyla sizinle iletişime geçecektir.',
    badge: 'Yalnızca Kurumsal Kullanım',
    nameLabel: 'Tam Ad',
    emailLabel: 'E-posta Adresi',
    privacy: 'Verileriniz şifrelidir ve hiçbir zaman üçüncü taraflarla paylaşılmaz.',
  },
};

interface LeadCaptureModalProps {
  onSuccess?: () => void;
}

export default function LeadCaptureModal({ onSuccess }: LeadCaptureModalProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || 'ar') as string;
  const isRtl = lang === 'ar';
  const c = CONTENT[lang] || CONTENT.en;

  const [visible, setVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Auto-show for new visitors only after SHOW_DELAY_MS
  useEffect(() => {
    try {
      if (localStorage.getItem(LS_KEY)) return;
    } catch { /* ignore */ }
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard dismiss
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(LS_KEY, 'skipped_' + Date.now()); } catch { /* ignore */ }
    onSuccess?.();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedName) {
      setError(isRtl ? 'يرجى إدخال الاسم والبريد الإلكتروني.' : 'Please enter your name and a valid email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await supabase.from('leads').insert({
        full_name: trimmedName,
        email: trimmedEmail,
        source: 'lead_capture_modal',
        page: window.location.pathname,
        language: lang,
        created_at: new Date().toISOString(),
        notes: `Auto-captured via Lead Modal — Page: ${window.location.pathname}`,
        status: 'new',
      });
      try {
        await supabase.from('staged_outreach_leads').insert({
          email: trimmedEmail,
          company_name: trimmedName,
          contact_name: trimmedName,
          source: 'Lead Capture Modal',
          language_preference: lang,
          page_visited: window.location.pathname,
          status: 'pending_review',
          created_at: new Date().toISOString(),
        });
      } catch { /* non-critical */ }
      try {
        await dispatchWhatsAppNotification({
          eventType: 'NEW_REGISTRATION',
          clientName: trimmedName,
          clientEmail: trimmedEmail,
          planOrService: `Lead Modal — ${lang}`,
        });
      } catch { /* non-critical */ }
      localStorage.setItem('juristech_user_registered', 'true');
      localStorage.setItem('juristech_user_name', trimmedName);
      localStorage.setItem('juristech_user_email', trimmedEmail);
      try { localStorage.setItem(LS_KEY, 'captured_' + Date.now()); } catch { /* ignore */ }
      setSubmitted(true);
      setTimeout(() => { setVisible(false); onSuccess?.(); }, 3000);
    } catch (err) {
      console.warn('[LeadCaptureModal]', err);
      try { localStorage.setItem(LS_KEY, 'error_' + Date.now()); } catch { /* ignore */ }
      setSubmitted(true);
      setTimeout(() => { setVisible(false); onSuccess?.(); }, 3000);
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9990] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="max-w-md w-full bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/20 space-y-5 relative overflow-hidden my-auto">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />

        {/* Close */}
        <button type="button" onClick={dismiss} className="absolute top-4 end-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-slate-800" aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-white">{c.success}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{c.successSub}</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3 h-3" />{c.badge}
              </span>
              <h2 className="text-xl font-black text-white leading-tight">{c.headline}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{c.subline}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{c.nameLabel}</label>
                <input type="text" required placeholder={c.namePlaceholder} value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setError(''); }} disabled={loading}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 transition-all disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{c.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input type="email" required placeholder={c.emailPlaceholder} value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }} disabled={loading}
                    className="w-full ps-10 pe-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 transition-all disabled:opacity-50 font-mono" />
                </div>
              </div>

              {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black text-sm hover:opacity-90 transition-all shadow-lg disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
                    {isRtl ? 'جارٍ التسجيل...' : 'Registering...'}
                  </span>
                ) : (
                  <><Zap className="w-4 h-4" />{c.cta}{isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}</>
                )}
              </button>

              <button type="button" onClick={dismiss} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1">
                {c.skip}
              </button>
            </form>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 border-t border-slate-800 pt-3">
              <Lock className="w-3 h-3 shrink-0" />
              <span>{c.privacy}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


