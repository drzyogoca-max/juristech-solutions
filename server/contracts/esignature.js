/**
 * Vercel Serverless Function — /api/contracts/esignature
 * JurisTech Solutions | Cryptographic E-Signature & Audit Gate
 * Sprint 04C Phase 2C: Server-Side Authentication & Contract Authorization
 */

import { authenticateRequest } from '../../lib/security/backendAuthGuard.js';
import { computeCanonicalHash } from '../../lib/security/audit-ledger.js';

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

export function extractClientIp(req) {
  let ip = '';
  if (typeof req?.headers?.get === 'function') {
    ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '';
  } else if (req?.headers && typeof req.headers === 'object') {
    ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
  }
  if (ip && typeof ip === 'string') {
    return ip.split(',')[0].trim();
  }
  return 'unknown';
}

async function computeSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function parseRequestBody(req) {
  if (req?.body && typeof req.body === 'object' && !req.body.getReader) {
    return req.body;
  }
  if (typeof req?.json === 'function') {
    return req.json().catch(() => ({}));
  }
  if (typeof req?.text === 'function') {
    const raw = await req.text();
    try {
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }
  return {};
}

const DEFAULT_SUPABASE_URL = 'https://slhxqshdvivvsdifbsxo.supabase.co';

/**
 * Validates contract existence and ownership against public.contracts table
 */
async function fetchAndAuthorizeContract(contractId, verifiedUserId, supabaseUrl, serviceKey) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(contractId)) {
    return {
      authorized: false,
      statusCode: 404,
      error: 'CONTRACT_NOT_FOUND',
      message: 'Contract does not exist or invalid contract identifier format.',
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/contracts?id=eq.${encodeURIComponent(contractId)}&select=id,user_id,content,organization_id`;
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    });

    if (!res.ok) {
      console.error(`[E-Signature] Contract DB query failed: ${res.status}`);
      return {
        authorized: false,
        statusCode: 500,
        error: 'CONTRACT_LOOKUP_ERROR',
        message: 'Database query failed during contract verification.',
      };
    }

    const records = await res.json();
    if (!Array.isArray(records) || records.length === 0) {
      return {
        authorized: false,
        statusCode: 404,
        error: 'CONTRACT_NOT_FOUND',
        message: 'Contract does not exist.',
      };
    }

    const contract = records[0];
    if (contract.user_id !== verifiedUserId) {
      return {
        authorized: false,
        statusCode: 403,
        error: 'FORBIDDEN_CONTRACT_ACCESS',
        message: 'You are not authorized to sign this contract.',
      };
    }

    return { authorized: true, contract };
  } catch (err) {
    console.error('[E-Signature] Contract query network exception:', err?.message || err);
    return {
      authorized: false,
      statusCode: 500,
      error: 'CONTRACT_LOOKUP_NETWORK_ERROR',
      message: 'Network exception during contract verification.',
    };
  }
}

/**
 * Persists verified audit record to public.audit_trail table via service_role
 */
async function persistAuditTrailEntry(entry, supabaseUrl, serviceKey) {
  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/audit_trail`;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(entry),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[E-Signature] Failed to persist audit trail: ${res.status} ${errText}`);
      return { success: false, error: 'AUDIT_PERSISTENCE_FAILED' };
    }

    return { success: true };
  } catch (err) {
    console.error('[E-Signature] Audit trail persistence network error:', err?.message || err);
    return { success: false, error: 'AUDIT_NETWORK_ERROR' };
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

/**
 * Core signing processor shared across Edge and Node runtimes
 */
async function processSignatureRequest(req) {
  // 1. Mandatory Authentication Boundary
  const authResult = await authenticateRequest(req, { corsHeaders: CORS_HEADERS });
  if (!authResult.authenticated) {
    return {
      statusCode: 401,
      body: authResult.error || {
        error: 'UNAUTHORIZED',
        code: 'MISSING_AUTHORIZATION_TOKEN',
        message: 'Authentication required. Missing or invalid Bearer token.',
      },
    };
  }

  const verifiedUser = authResult.user;

  // 2. Parse and Validate Request Payload
  const body = await parseRequestBody(req);
  const rawContractId = body?.contractId;

  if (!rawContractId || typeof rawContractId !== 'string' || !rawContractId.trim()) {
    return {
      statusCode: 400,
      body: {
        error: 'BAD_REQUEST',
        code: 'MISSING_CONTRACT_ID',
        message: 'A valid contractId is required to sign a contract.',
      },
    };
  }

  const contractId = rawContractId.trim();

  // 3. Resolve Environment Credentials
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.error('[E-Signature] Missing SUPABASE_SERVICE_ROLE_KEY server configuration');
    return {
      statusCode: 500,
      body: {
        error: 'SERVER_CONFIGURATION_ERROR',
        code: 'MISSING_SERVICE_ROLE_KEY',
        message: 'Signing service temporarily misconfigured.',
      },
    };
  }

  // 4. Validate Contract Ownership & Authorization
  const contractAuth = await fetchAndAuthorizeContract(contractId, verifiedUser.id, supabaseUrl, serviceKey);
  if (!contractAuth.authorized) {
    return {
      statusCode: contractAuth.statusCode,
      body: {
        error: contractAuth.error,
        code: contractAuth.error,
        message: contractAuth.message,
      },
    };
  }

  const contract = contractAuth.contract;

  // 5. Normalize Signer Identity & IP (Ignore client-supplied spoofed claims)
  const verifiedUserId = verifiedUser.id;
  const verifiedSignerEmail = verifiedUser.email;
  const clientIp = extractClientIp(req);
  const signerDisplayName = (typeof body?.signerName === 'string' && body.signerName.trim())
    ? body.signerName.trim().slice(0, 100)
    : 'Authorized Signatory';

  // 6. Bind Contract Content Hash (if available)
  let contractContentHash = null;
  if (typeof contract.content === 'string' && contract.content.length > 0) {
    contractContentHash = await computeSha256(contract.content);
  }

  // 7. Generate Canonical Timestamp & Integrity Hash
  const timestamp = new Date().toISOString();
  const signatureId = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Deterministic canonical serialization
  const canonicalSignatureData = [
    `contractId:${contractId}`,
    `userId:${verifiedUserId}`,
    `signerEmail:${verifiedSignerEmail}`,
    `signerName:${signerDisplayName}`,
    `timestamp:${timestamp}`,
    `contentHash:${contractContentHash || 'none'}`
  ].join('|');

  const cryptographicProof = await computeCanonicalHash(canonicalSignatureData);

  const signatureCertificate = {
    signatureId,
    contractId,
    signerUserId: verifiedUserId,
    signerEmail: verifiedSignerEmail,
    signerName: signerDisplayName,
    clientIpMetadata: clientIp,
    contractContentHash,
    signedAt: timestamp,
    verificationProtocol: 'SHA-256 Document Integrity Attestation',
  };

  // 8. Persist Audit Record into public.audit_trail
  const auditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    action: 'CONTRACT_SIGNED',
    user_id: verifiedUserId,
    user_email: verifiedSignerEmail,
    contract_id: contractId,
    ip_address: clientIp,
    details: {
      signatureId,
      signerName: signerDisplayName,
      organization_id: contract.organization_id || null,
      contractContentHash,
      protocol: 'SHA256_INTEGRITY_ATTESTATION',
    },
    timestamp,
    sha256_hash: cryptographicProof,
  };

  const persistResult = await persistAuditTrailEntry(auditEntry, supabaseUrl, serviceKey);
  if (!persistResult.success) {
    return {
      statusCode: 500,
      body: {
        error: 'AUDIT_PERSISTENCE_FAILED',
        code: 'AUDIT_PERSISTENCE_FAILED',
        message: 'Failed to record immutable audit trail proof.',
      },
    };
  }

  // 9. Return Certified Result
  return {
    statusCode: 200,
    body: {
      success: true,
      message: 'تم توثيق وسلامة العقد تشفيرياً بنجاح وفق المعايير المؤسسية.',
      cryptographicProof,
      timestamp,
      signatureCertificate,
    },
  };
}

/**
 * Web Standard / Vercel Edge Request Handler
 */
async function handleEdgeRequest(req) {
  try {
    const result = await processSignatureRequest(req);
    return Response.json(result.body, { status: result.statusCode, headers: CORS_HEADERS });
  } catch (err) {
    console.error('[E-Signature Edge Exception]:', err);
    return Response.json(
      { error: 'SERVER_ERROR', message: err?.message || 'Signature execution exception.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * Node.js Serverless Request Handler
 */
async function handleNodeRequest(req, res) {
  try {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    const result = await processSignatureRequest(req);
    return res.status(result.statusCode).json(result.body);
  } catch (err) {
    console.error('[E-Signature Node Exception]:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: err?.message || 'Signature execution exception.' });
  }
}

export async function POST(req, res) {
  if (res && typeof res.status === 'function') {
    return handleNodeRequest(req, res);
  }
  return handleEdgeRequest(req);
}

export default async function handler(req, res) {
  return POST(req, res);
}
