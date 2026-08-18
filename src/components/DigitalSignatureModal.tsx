/**
 * src/components/DigitalSignatureModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal for eIDAS-compliant contract digital signing.
 */

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Check, X, Edit3, Loader2, Award } from 'lucide-react';
import { eSignatureService, SignatureResult } from '../services/eSignatureService';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  contractTitle: string;
  onSigned: (result: SignatureResult) => void;
}

export default function DigitalSignatureModal({
  isOpen,
  onClose,
  contractId,
  contractTitle,
  onSigned,
}: DigitalSignatureModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Authorized Signatory');
  const [provider, setProvider] = useState<'DocuSign' | 'AdobeSign' | 'eIDAS_Internal'>('eIDAS_Internal');
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen) return null;

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSigning(true);
    try {
      const result = await eSignatureService.executeDigitalSignature({
        contractId,
        contractTitle,
        signatoryName: name,
        signatoryEmail: email,
        signatoryRole: role,
        provider,
      });

      onSigned(result);
      onClose();
    } catch (err) {
      console.error('Signature failure:', err);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                {t('eSignature.modalTitle', 'eIDAS Digital Signature')}
              </h2>
              <p className="text-xs text-slate-400">{contractTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSign} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('eSignature.signatoryName', 'Full Legal Name')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Alexander Vance"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('eSignature.signatoryEmail', 'Official Email Address')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexander@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {t('eSignature.providerSelect', 'Signature Verification Protocol')}
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="eIDAS_Internal">eIDAS Native SHA-256 (Juristech Certified)</option>
              <option value="DocuSign">DocuSign Cloud Connect</option>
              <option value="AdobeSign">Adobe Sign eIDAS Gateway</option>
            </select>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              {t('eSignature.complianceBadge', 'eIDAS & GDPR Compliant Signature')}
            </div>
            <p>
              {t('eSignature.auditNote', 'A cryptographic SHA-256 hash timestamp will be saved into the legal audit trail upon completion.')}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={isSigning}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition-colors flex items-center gap-2"
            >
              {isSigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
              {t('eSignature.signNow', 'Sign Document Legally')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
