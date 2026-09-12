import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { usePlatformLocale } from '../lib/universalTranslator';
import TrialOnboardingModal from './TrialOnboardingModal';

export interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSignupSuccess?: () => void;
}

export default function CustomerAuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onSignupSuccess,
}: CustomerAuthModalProps) {
  const { l, isRtl } = usePlatformLocale();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowOnboarding(false);
  }, [initialMode, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (showOnboarding) {
    return (
      <TrialOnboardingModal
        isOpen={true}
        onClose={() => {
          setShowOnboarding(false);
          onClose();
        }}
      />
    );
  }

  if (!isOpen) return null;

  function parseAuthError(err: any): string {
    const raw = (err?.message || err?.error_description || String(err || '')).toLowerCase();

    if (raw.includes('invalid login credentials') || raw.includes('invalid credentials')) {
      return l(
        'بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور.',
        'Invalid login credentials. Please check your email and password.'
      );
    }
    if (raw.includes('user already registered') || raw.includes('already exists')) {
      return l(
        'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استعادة الحساب.',
        'This email address is already registered. Please sign in instead.'
      );
    }
    if (raw.includes('password should be at least 6 characters') || raw.includes('password is too short')) {
      return l(
        'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.',
        'Password must be at least 6 characters long.'
      );
    }
    if (raw.includes('rate limit') || raw.includes('too many requests')) {
      return l(
        'تم تجاوز عدد المحاولات المسموح بها مؤقتاً. يرجى المحاولة بعد قليل.',
        'Too many attempts. Please wait a few moments before trying again.'
      );
    }
    if (raw.includes('invalid email') || raw.includes('email format')) {
      return l(
        'صيغة البريد الإلكتروني غير صحيحة.',
        'Please enter a valid email address.'
      );
    }
    if (raw.includes('email not confirmed')) {
      return l(
        'يرجى تأكيد بريدك الإلكتروني عبر الرابط المرسل إلى صندوقك الوارد.',
        'Please confirm your email address via the link sent to your inbox.'
      );
    }

    return err?.message || l('حدث خطأ أثناء المصادقة. يرجى المحاولة مجدداً.', 'Authentication error. Please try again.');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg(l('يرجى إدخال بريد إلكتروني صالح.', 'Please enter a valid email address.'));
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg(
        l(
          'يجب أن تتكون كلمة المرور من 6 خانات أو أحرف على الأقل.',
          'Password must be at least 6 characters long.'
        )
      );
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await signUp(cleanEmail, password, fullName.trim());
        if (error) {
          setErrorMsg(parseAuthError(error));
          return;
        }

        if (data?.session) {
          setSuccessMsg(
            l('تم إنشاء الحساب وتسجيل الدخول بنجاح! جاري تحضير التجربة المجانية...', 'Account created and signed in successfully! Preparing your trial...')
          );
          setTimeout(() => {
            if (onSignupSuccess) {
              onSignupSuccess();
              onClose();
            } else {
              setShowOnboarding(true);
            }
          }, 800);
        } else if (data?.user) {
          setSuccessMsg(
            l(
              'تم إنشاء الحساب بنجاح! إذا طُلب تأكيد البريد، يرجى مراجعة صندوق الوارد.',
              'Account created successfully! If email confirmation is enabled, please verify your inbox.'
            )
          );
          setTimeout(() => {
            if (onSignupSuccess) {
              onSignupSuccess();
              onClose();
            } else {
              setShowOnboarding(true);
            }
          }, 1500);
        }
      } else {
        const { data, error } = await signIn(cleanEmail, password);
        if (error) {
          setErrorMsg(parseAuthError(error));
          return;
        }

        if (data?.user || data?.session) {
          setSuccessMsg(l('تم تسجيل الدخول بنجاح!', 'Signed in successfully!'));
          setTimeout(() => {
            onClose();
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMsg(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white font-sans overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={l('إغلاق', 'Close')}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 mb-1">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {mode === 'login'
              ? l('تسجيل الدخول إلى حسابك', 'Sign in to JurisTech')
              : l('إنشاء حساب عميل جديد', 'Create your JurisTech Account')}
          </h2>
          <p className="text-xs text-slate-400">
            {l(
              'المنظومة القانونية المتكاملة للشركات وحلول الذكاء الاصطناعي',
              'Sovereign Legal Intelligence & SaaS Platform'
            )}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {l('تسجيل الدخول', 'Sign In')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {l('حساب جديد', 'Create Account')}
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {l('الاسم الكامل (اختياري)', 'Full Name (Optional)')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={l('مثال: محمد مصطفى', 'e.g. John Doe')}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors ps-9"
                />
                <User className="w-4 h-4 text-slate-500 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {l('البريد الإلكتروني', 'Email Address')} <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@firm.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors ps-9 font-mono"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {l('كلمة المرور', 'Password')} <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors ps-9 pe-9 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 rtl:right-auto rtl:left-3 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'signup' && (
              <p className="text-[10px] text-slate-500 mt-1">
                {l('يجب ألا تقل عن 6 أحرف أو أرقام', 'At least 6 characters required')}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>{l('جارٍ المعالجة...', 'Processing...')}</span>
              </>
            ) : mode === 'login' ? (
              <>
                <span>{l('تسجيل الدخول', 'Sign In')}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </>
            ) : (
              <>
                <span>{l('إنشاء حساب وتأكيد الهوية', 'Create Account & Continue')}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        {/* Footer info & Security note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-[11px] text-slate-400">
            {mode === 'login' ? (
              <>
                <span>{l('ليس لديك حساب بعد؟ ', "Don't have an account? ")}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className="text-cyan-400 hover:underline font-bold cursor-pointer"
                >
                  {l('أنشئ حسابك الآن', 'Create one now')}
                </button>
              </>
            ) : (
              <>
                <span>{l('لديك حساب بالفعل؟ ', 'Already have an account? ')}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="text-cyan-400 hover:underline font-bold cursor-pointer"
                >
                  {l('سجل دخولك', 'Sign in')}
                </button>
              </>
            )}
          </p>

          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
            <Lock className="w-3 h-3 text-cyan-400/80" />
            <span>{l('مصادقة مشفرة بواسطة Supabase Auth TLS 1.3', 'Encrypted via Supabase Auth TLS 1.3')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
