import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield, Lock, Key, CheckCircle2, AlertTriangle, Copy, Check,
  QrCode, RefreshCw, X, ShieldAlert, KeyRound, Smartphone, Download
} from 'lucide-react';
import { TwoFactorAuthService, TwoFactorConfig } from '../services/twoFactorAuthService';
import { E2EEncryptionService } from '../services/e2eEncryptionService';

interface TwoFactorSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TwoFactorSecurityModal({ isOpen, onClose }: TwoFactorSecurityModalProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [config, setConfig] = useState<TwoFactorConfig>(() => TwoFactorAuthService.getConfig());
  const [step, setStep] = useState<'status' | 'setup_totp' | 'verify' | 'recovery' | 'e2ee'>('status');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // E2EE Sovereign Passphrase State
  const [e2eePassphrase, setE2eePassphrase] = useState<string>(() => E2EEncryptionService.getMasterPassphrase() || '');
  const [e2eeActive, setE2eeActive] = useState<boolean>(() => E2EEncryptionService.isE2EEActive());

  useEffect(() => {
    if (isOpen) {
      const cfg = TwoFactorAuthService.getConfig();
      setConfig(cfg);
      setE2eeActive(E2EEncryptionService.isE2EEActive());
      setE2eePassphrase(E2EEncryptionService.getMasterPassphrase() || '');
      setStep('status');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleStartSetup() {
    const newSecret = TwoFactorAuthService.generateSecret();
    setSecret(newSecret);
    setStep('setup_totp');
    setErrorMsg('');
  }

  async function handleVerifyAndActivate() {
    setErrorMsg('');
    if (!verificationCode || verificationCode.length !== 6) {
      setErrorMsg(isRtl ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام.' : 'Please enter 6-digit verification code.');
      return;
    }

    const isValid = await TwoFactorAuthService.verifyCode(verificationCode, secret);
    if (!isValid) {
      setErrorMsg(isRtl ? 'رمز التحقق غير صحيح. يرجى التأكد من الرمز المدخل.' : 'Invalid 2FA code. Please retry.');
      return;
    }

    const recoveryCodes = TwoFactorAuthService.generateRecoveryCodes();
    const newCfg: TwoFactorConfig = {
      isEnabled: true,
      secret: secret,
      recoveryCodes: recoveryCodes,
      enabledAt: new Date().toISOString(),
      verifiedSessions: [Date.now().toString()],
    };

    TwoFactorAuthService.saveConfig(newCfg);
    setConfig(newCfg);
    setStep('recovery');
    setSuccessMsg(isRtl ? 'تم تفعيل المصادقة الثنائية 2FA بنجاح!' : 'Two-Factor Authentication activated successfully!');
  }

  function handleDisable2FA() {
    const disabledCfg: TwoFactorConfig = {
      isEnabled: false,
      secret: '',
      recoveryCodes: [],
      verifiedSessions: [],
    };
    TwoFactorAuthService.saveConfig(disabledCfg);
    setConfig(disabledCfg);
    setSuccessMsg(isRtl ? 'تم إيقاف المصادقة الثنائية.' : 'Two-Factor Authentication disabled.');
    setStep('status');
  }

  function handleGenerateE2EEKey() {
    const newKey = E2EEncryptionService.generateSecurePassphrase();
    setE2eePassphrase(newKey);
    E2EEncryptionService.setMasterPassphrase(newKey);
    setE2eeActive(true);
    setSuccessMsg(isRtl ? 'تم إنشاء مفتاح التشفير السيادي للطرفين (End-to-End Key)!' : 'Sovereign E2EE Key successfully generated!');
  }

  function handleCopySecret() {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  }

  function handleCopyE2EE() {
    navigator.clipboard.writeText(e2eePassphrase);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  function handleDownloadRecovery() {
    const text = `================================================================================
JURISTECH SOLUTIONS — 2FA EMERGENCY RECOVERY CODES & E2EE KEY
Account: drzyogo.ca@gmail.com
Generated: ${new Date().toISOString()}
================================================================================
KEEP THIS FILE IN A SECURE OFFLINE VAULT.

[2FA EMERGENCY BACKUP CODES]:
${config.recoveryCodes.map((c, i) => `Code ${i + 1}: ${c}`).join('\n')}

[SOVEREIGN CLIENT-SIDE E2EE AES-256 MASTER KEY]:
${e2eePassphrase || 'Default System Key'}
================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JurisTech_Security_Recovery_Keys_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8 rtl:pr-0 rtl:pl-8">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Shield className="w-5 h-5" />
            </span>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              {isRtl ? 'مركز الأمان السيادي والتشفير' : 'Sovereign Security & Cryptography Hub'}
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            {isRtl ? 'المصادقة الثنائية 2FA وتشفير End-to-End' : '2FA Authentication & End-to-End Encryption'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRtl
              ? 'حماية الحساب والمستندات بخوارزميات التشفير العسكرية AES-GCM-256 وبروتوكول TOTP RFC 6238.'
              : 'Military-grade AES-GCM-256 client-side zero-knowledge encryption and RFC 6238 TOTP.'}
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── STEP 1: STATUS DASHBOARD ──────────────────────────────────────── */}
        {step === 'status' && (
          <div className="space-y-5">
            {/* 2FA Status Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${config.isEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isRtl ? 'المصادقة الثنائية (2FA Authenticator)' : 'Two-Factor Authentication (2FA)'}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {config.isEnabled
                        ? (isRtl ? '● مفعّلة ومحمية بتطبيق المصادقة' : '● Enabled with TOTP Authenticator')
                        : (isRtl ? '○ غير مفعّلة حالياً' : '○ Disabled')}
                    </span>
                  </div>
                </div>

                {config.isEnabled ? (
                  <button
                    onClick={handleDisable2FA}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isRtl ? 'إيقاف' : 'Disable'}
                  </button>
                ) : (
                  <button
                    onClick={handleStartSetup}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    {isRtl ? 'تفعيل الآن' : 'Enable 2FA'}
                  </button>
                )}
              </div>
            </div>

            {/* E2EE Sovereign Encryption Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${e2eeActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isRtl ? 'تشفير المستندات من طرف لطرف (E2EE)' : 'Client-Side E2EE Zero-Knowledge'}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {e2eeActive
                        ? (isRtl ? '● مفتاح التشفير AES-GCM-256 نشط' : '● AES-GCM-256 Sovereign Key Active')
                        : (isRtl ? 'تشفير تلقائي بالنظام' : 'Default System Encryption')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateE2EEKey}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {e2eeActive ? (isRtl ? 'تجديد المفتاح' : 'Rotate Key') : (isRtl ? 'توليد مفتاح سيادي' : 'Generate Key')}
                </button>
              </div>

              {e2eePassphrase && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-cyan-300 truncate">{e2eePassphrase}</span>
                  <button
                    onClick={handleCopyE2EE}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {config.isEnabled && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setStep('recovery')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                >
                  {isRtl ? 'عرض مفاتيح الاسترداد الاحتياطية' : 'View Emergency Recovery Codes'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: TOTP SETUP ────────────────────────────────────────────── */}
        {step === 'setup_totp' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                {isRtl ? '1. ربط تطبيق المصادقة (Authenticator App)' : '1. Link Authenticator App'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl
                  ? 'افتح تطبيق Google Authenticator أو Microsoft Authenticator، واختر "إدخال مفتاح الإعداد يدوياً"، ثم الصق المفتاح التالي:'
                  : 'Open Google Authenticator or Microsoft Authenticator, select "Enter Setup Key", and paste this secret:'}
              </p>

              {/* Secret Key Display */}
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-cyan-400 font-black tracking-widest">{secret}</span>
                <button
                  onClick={handleCopySecret}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Verification Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {isRtl ? '2. أدخل الرمز المكون من 6 أرقام الظاهر في التطبيق:' : '2. Enter the 6-digit code from the app:'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center text-xl font-mono tracking-widest py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep('status')}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleVerifyAndActivate}
                className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                {isRtl ? 'تحقق وتفعيل 2FA' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: RECOVERY CODES ────────────────────────────────────────── */}
        {step === 'recovery' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <h3 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase">
                <ShieldAlert className="w-4 h-4" />
                {isRtl ? 'مفاتيح الاسترداد للطوارئ (Emergency Backup Codes)' : 'Emergency Recovery Keys'}
              </h3>
              <p className="text-xs text-slate-300">
                {isRtl
                  ? 'احفظ هذه المفاتيح في مكان آمن. يمكن استخدام كل مفتاح مرة واحدة فقط في حال فقدان تطبيق المصادقة:'
                  : 'Store these single-use codes offline. They can be used to recover access if you lose your authenticator:'}
              </p>
            </div>

            {/* Codes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-xs font-black text-cyan-400">
              {config.recoveryCodes.map((code, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {code}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDownloadRecovery}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isRtl ? 'تحميل ملف المفاتيح' : 'Download Keys (.txt)'}
              </button>
              <button
                onClick={() => setStep('status')}
                className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
              >
                {isRtl ? 'تم الحفظ والانتهاء' : 'Done & Saved'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
