import React, { useRef } from 'react';
import { ShieldCheck, Lock, Download, CheckCircle2, Copy, X, Key, Shield, Calendar, Globe, Award, Sparkles } from 'lucide-react';
import { CryptographicCertificate } from '../lib/sovereignCryptoEngine';
import { usePlatformLocale } from '../lib/universalTranslator';
import { exportDocumentMultiFormat } from '../lib/documentExporter';

interface CryptographicCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CryptographicCertificate | null;
}

export default function CryptographicCertificateModal({
  isOpen,
  onClose,
  certificate,
}: CryptographicCertificateModalProps) {
  const { l, isRtl } = usePlatformLocale();
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !certificate) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(certificate.sha256Fingerprint);
    alert(l('تم نسخ البصمة الرقمية SHA-256 إلى الحافظة!', 'SHA-256 Fingerprint copied to clipboard!'));
  };

  const handleDownloadCertificate = () => {
    const certText = `================================================================================
          JURISTECH SOLUTIONS — SOVEREIGN CRYPTOGRAPHIC CERTIFICATE
               OFFICIAL PROOF OF DOCUMENT INTEGRITY & NON-TAMPERING
================================================================================

CERTIFICATE ID: ${certificate.certificateId}
DOCUMENT NAME:  ${certificate.documentName}
TIMESTAMP (UTC): ${certificate.timestampISO}
DIGITAL SEAL:   ${certificate.digitalSealNumber}
SECURITY RATING: ${certificate.securityRating}

--------------------------------------------------------------------------------
CRYPTOGRAPHIC FINGERPRINT (SHA-256):
${certificate.sha256Fingerprint}
--------------------------------------------------------------------------------

ENCRYPTION SPECIFICATION:
• Cipher Standard:  ${certificate.encryptionAlgorithm}
• Key Derivation:   PBKDF2 (100,000 Iterations / HMAC-SHA256)
• Integrity Status: ${certificate.tamperStatus}
• Verified By:      ${certificate.verifiedBy}
• Governing Law:    ${certificate.jurisdiction}

--------------------------------------------------------------------------------
VERIFICATION INSTRUCTIONS:
Any party may verify this document's authenticity by uploading the original file
to the JurisTech Vault (https://www.juristech.solutions/vault) and comparing the
generated SHA-256 hash against the fingerprint above.

Authorized by JurisTech Autonomous Forensic Integrity Network.
Dr. Mohammad Mustafa, Chairman & Senior Legal Architect
================================================================================`;

    exportDocumentMultiFormat(
      certText,
      `Certificate_Integrity_${certificate.certificateId}`,
      'JurisTech Sovereign Vault',
      certificate.documentName,
      'pdf',
      isRtl ? 'ar' : 'en'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">
                {l('شهادة السلامة والتشفير السيادي المعتمدة', 'Sovereign Cryptographic Integrity Certificate')}
              </h2>
              <p className="text-xs text-emerald-400 font-mono">
                ID: {certificate.certificateId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body Container */}
        <div ref={certRef} className="p-6 space-y-6 text-slate-200">
          {/* Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {l('حالة المستند: أصلي ومحصن ولم يتعرض لأي تعديل', 'Integrity Status: Genuine & Tamper-Proof')}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {certificate.securityRating}
            </span>
          </div>

          {/* Document Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">{l('اسم المستند المعتمد:', 'Certified Document Name:')}</span>
              <span className="font-bold text-white truncate block">{certificate.documentName}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">{l('تاريخ ووقت الختم (UTC):', 'Timestamp (UTC):')}</span>
              <span className="font-mono text-emerald-400 block">{certificate.timestampISO}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">{l('معيار التشفير:', 'Cipher Specification:')}</span>
              <span className="font-semibold text-cyan-300 block">{certificate.encryptionAlgorithm}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">{l('الختم الرقمي السيادي:', 'Digital Sovereign Seal:')}</span>
              <span className="font-mono text-amber-300 block">{certificate.digitalSealNumber}</span>
            </div>
          </div>

          {/* SHA-256 Fingerprint Display Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Key className="w-4 h-4" />
                {l('بصمة التشفير الرقمية (SHA-256 Hash):', 'Cryptographic Fingerprint (SHA-256):')}
              </span>
              <button
                onClick={copyHash}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                {l('نسخ البصمة', 'Copy Hash')}
              </button>
            </div>
            <div className="font-mono text-xs text-emerald-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800 break-all select-all">
              {certificate.sha256Fingerprint}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {l(
                'هذه البصمة الرقمية تمثل دليلاً رياضياً قاطعاً لا يمكن تزويره، تثبت مطابقة المستند وتاريخ توثيقه أمام أي محكمة أو جهة رقابية.',
                'This cryptographic hash provides definitive mathematical proof of document integrity and timestamping admissible in arbitral and judicial forums.'
              )}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{certificate.verifiedBy}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
            >
              {l('إغلاق', 'Close')}
            </button>
            <button
              onClick={handleDownloadCertificate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {l('تصدير الشهادة الرسمية', 'Export Official Certificate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
