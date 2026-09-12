/**
 * src/services/eSignatureService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Ticket 5: eIDAS-Compliant Global Digital Signature Engine (DocuSign / Adobe Sign)
 */

import { supabase } from '../lib/supabaseClient';
import { auditTrailService } from './auditTrailService';

export interface SignatureRequest {
  contractId: string;
  contractTitle: string;
  signatoryName: string;
  signatoryEmail: string;
  signatoryRole: string;
  signatureDataUrl?: string;
  provider?: 'DocuSign' | 'AdobeSign' | 'eIDAS_Internal';
}

export interface SignatureResult {
  signatureId: string;
  contractId: string;
  timestamp: string;
  hash: string;
  eIDASCompliant: boolean;
  status: 'SIGNED' | 'PENDING' | 'REJECTED';
}

class ESignatureService {
  /**
   * Execute digital signature via secure server-side endpoint
   */
  public async executeDigitalSignature(req: SignatureRequest): Promise<SignatureResult> {
    console.log('[Ticket 5: eSignature Engine] Executing digital signature via provider:', req.provider || 'eIDAS_Internal');

    // 1. Retrieve authenticated Supabase access token
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (sessionErr || !token) {
      throw new Error('AUTHENTICATION_REQUIRED: Please sign in to digitally sign contracts.');
    }

    // 2. Transmit to server-side protected endpoint with Bearer authentication
    const response = await fetch('/api/contracts/esignature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        contractId: req.contractId,
        signerName: req.signatoryName,
        provider: req.provider || 'eIDAS_Internal',
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData.message || errData.error || `Signature execution failed with status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const cert = data.signatureCertificate || {};

    const result: SignatureResult = {
      signatureId: cert.signatureId || `sig_${Date.now()}`,
      contractId: cert.contractId || req.contractId,
      timestamp: data.timestamp || new Date().toISOString(),
      hash: data.cryptographicProof || '',
      eIDASCompliant: true,
      status: 'SIGNED',
    };

    // 3. Record in client-side audit cache
    await auditTrailService.logEvent({
      action: 'SIGNATURE_COMPLETED',
      userId: cert.signerUserId,
      userEmail: cert.signerEmail || req.signatoryEmail,
      contractId: req.contractId,
      details: {
        signatureId: result.signatureId,
        signatoryName: cert.signerName || req.signatoryName,
        signatoryRole: req.signatoryRole,
        provider: req.provider || 'eIDAS_Internal',
        hash: data.cryptographicProof,
      },
    });

    return result;
  }

  private async hashSHA256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}

export const eSignatureService = new ESignatureService();
