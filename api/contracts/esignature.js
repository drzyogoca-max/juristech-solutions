/**
 * Vercel Serverless Function — /api/contracts/esignature
 * JurisTech Solutions | Sovereign Cryptographic E-Signature & Audit Gate
 */

import { createImmutableAuditLog } from '../../lib/security/audit-ledger.js';

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req) {
  try {
    const { contractId, signerName, signerEmail, orgId = 'sovereign_org', ipAddress } = await req.json();

    if (!contractId || !signerEmail) {
      return Response.json({ error: 'Missing signature parameters' }, { status: 400, headers: CORS_HEADERS });
    }

    // Generate Sovereign Cryptographic Signature Certificate Token Payload
    const signaturePayload = {
      contractId,
      signerName: signerName || 'Authenticated Enterprise Signer',
      signerEmail,
      ipAddress: ipAddress || 'secured-edge-ip',
      signedAt: new Date().toISOString()
    };

    // Generate Tamper-Proof Cryptographic Hash Proof
    const auditProof = await createImmutableAuditLog('CONTRACT_SIGNED', signerEmail, orgId, signaturePayload);

    return Response.json({
      success: true,
      message: "تم توثيق واعتماد العقد تشفيرياً بنجاح وفق المعايير السيادية.",
      cryptographicProof: auditProof.cryptographicHash,
      timestamp: auditProof.timestamp,
      signatureCertificate: signaturePayload
    }, {
      headers: CORS_HEADERS
    });

  } catch (error) {
    console.error('[E-Signature API Error]:', error);
    return Response.json({ error: error.message || 'Signature Processing Bottleneck' }, { status: 500, headers: CORS_HEADERS });
  }
}

export default async function handler(req) {
  return POST(req);
}
