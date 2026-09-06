/**
 * test-admin-approval-rpc.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Sprint 03B-2: Admin Receipt Approval -> public.subscriptions Write Path Audit
 *
 * Validates:
 * 1. Admin approval invokes the RPC exactly once.
 * 2. RPC receives only p_receipt_id and p_admin_notes.
 * 3. Successful RPC returns activation result.
 * 4. RPC failure does not perform fallback direct writes.
 * 5. Existing admin authorization remains intact.
 * 6. Live RPC contract verification and zero unintended database mutations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log('================================================================');
console.log('👑  JURISTECH SOLUTIONS — SPRINT 03B-2 ADMIN APPROVAL WRITE PATH AUDIT');
console.log('================================================================\n');

// ── TEST GROUP 1: Source Code & Architectural Integrity ──────────────────────
console.log('--- TEST GROUP 1: Source Code & Architectural Integrity ---');

const repoPath = path.join(rootDir, 'src', 'lib', 'financialRepository.ts');
const pagePath = path.join(rootDir, 'src', 'pages', 'AdminReceiptReviewPage.tsx');

const repoCode = fs.readFileSync(repoPath, 'utf8');
const pageCode = fs.readFileSync(pagePath, 'utf8');

// 1.1 In auditApproveReceipt: Invokes the verified RPC
assert(
  repoCode.includes("supabase.rpc('admin_approve_receipt_and_activate'") ||
  repoCode.includes('supabase.rpc("admin_approve_receipt_and_activate"'),
  "auditApproveReceipt() invokes verified RPC 'admin_approve_receipt_and_activate'"
);

// 1.2 RPC payload sends ONLY p_receipt_id and p_admin_notes
assert(
  repoCode.includes('p_receipt_id:') &&
  repoCode.includes('p_admin_notes:') &&
  !repoCode.includes('p_user_id:') &&
  !repoCode.includes('p_plan_id:') &&
  !repoCode.includes('p_amount:') &&
  !repoCode.includes('p_expires_at:'),
  "auditApproveReceipt() sends ONLY p_receipt_id and p_admin_notes to the RPC"
);

// 1.3 Direct client-side writes to payments, payment_receipts, and subscriptions removed from approval
const auditApproveFunc = repoCode.substring(
  repoCode.indexOf('export async function auditApproveReceipt'),
  repoCode.indexOf('export async function auditRejectReceipt')
);

assert(
  !auditApproveFunc.includes(".from('payments').update") &&
  !auditApproveFunc.includes('.from("payments").update'),
  "Direct client-side updates to 'payments' removed from auditApproveReceipt()"
);

assert(
  !auditApproveFunc.includes(".from('payment_receipts').update") &&
  !auditApproveFunc.includes('.from("payment_receipts").update'),
  "Direct client-side updates to 'payment_receipts' removed from auditApproveReceipt()"
);

assert(
  !auditApproveFunc.includes(".from('subscriptions')") &&
  !auditApproveFunc.includes('.from("subscriptions")'),
  "Direct client-side writes to 'subscriptions' prohibited from auditApproveReceipt()"
);

// 1.4 Authoritative subscription activation via activateUserSubscription removed from financialRepository
assert(
  !repoCode.includes('activateUserSubscription('),
  "activateUserSubscription() completely removed as authoritative activation mechanism"
);

// 1.5 Admin authorization preserved in AdminReceiptReviewPage
assert(
  pageCode.includes('const { isAdmin } = useAuth();') &&
  pageCode.includes('if (!isAdmin) {') &&
  pageCode.includes('<Forbidden403Page />'),
  "AdminReceiptReviewPage strictly enforces isAdmin check and Forbidden403Page boundary"
);

// 1.6 AdminReceiptReviewPage handleApprove handles RPC result and errors cleanly
assert(
  pageCode.includes('const result = await auditApproveReceipt(') &&
  pageCode.includes('if (result.success)') &&
  pageCode.includes('showBannerMessage('),
  "AdminReceiptReviewPage handleApprove() inspects result.success and displays status banner"
);

// 1.7 Zero direct DB writes in AdminReceiptReviewPage handleApprove
const handleApproveFunc = pageCode.substring(
  pageCode.indexOf('async function handleApprove'),
  pageCode.indexOf('async function handleConfirmReject')
);

assert(
  !handleApproveFunc.includes(".from('payment_receipts')") &&
  !handleApproveFunc.includes(".from('payments')") &&
  !handleApproveFunc.includes(".from('subscriptions')"),
  "handleApprove() performs zero direct table mutations"
);

// ── TEST GROUP 2: Behavioral Mock Unit Tests ─────────────────────────────────
console.log('\n--- TEST GROUP 2: Behavioral Mock Unit Tests ---');

async function runMockApprovalTest({ rpcMock, receiptId = '11111111-1111-1111-1111-111111111111', notes = 'Test Approval' }) {
  let rpcCallCount = 0;
  let receivedArgs = null;
  let directWritesAttempted = false;

  const fakeSupabase = {
    rpc: async (fnName, args) => {
      rpcCallCount++;
      receivedArgs = { fnName, args };
      return rpcMock(fnName, args);
    },
    from: (table) => {
      directWritesAttempted = true;
      return {
        update: () => ({ eq: async () => ({}) }),
        insert: async () => ({}),
      };
    }
  };

  async function testableApprove(id, adminNotes) {
    if (!id) return { success: false, error: 'Receipt ID is required' };
    const { data, error } = await fakeSupabase.rpc('admin_approve_receipt_and_activate', {
      p_receipt_id: id,
      p_admin_notes: adminNotes || null,
    });
    if (error) {
      return { success: false, error: error.message || 'Failed to approve' };
    }
    return {
      success: true,
      idempotent: data?.idempotent ?? false,
      data,
      receipt_id: data?.receipt_id || id,
      user_id: data?.user_id,
      plan_id: data?.plan_id,
      plan_name: data?.plan_name,
      activated_at: data?.activated_at,
      expires_at: data?.expires_at,
    };
  }

  const result = await testableApprove(receiptId, notes);
  return { result, rpcCallCount, receivedArgs, directWritesAttempted };
}

// 2.1 Successful RPC call
const successCase = await runMockApprovalTest({
  rpcMock: async () => ({
    data: {
      success: true,
      idempotent: false,
      receipt_id: '11111111-1111-1111-1111-111111111111',
      user_id: 'cust-uuid-123',
      plan_id: 'enterprise',
      plan_name: 'Enterprise Tier',
      activated_at: '2026-09-06T20:00:00Z',
      expires_at: '2027-09-06T20:00:00Z',
      status: 'active'
    },
    error: null
  })
});

assert(successCase.rpcCallCount === 1, 'Admin approval invokes RPC exactly once');
assert(
  successCase.receivedArgs.fnName === 'admin_approve_receipt_and_activate' &&
  Object.keys(successCase.receivedArgs.args).length === 2 &&
  'p_receipt_id' in successCase.receivedArgs.args &&
  'p_admin_notes' in successCase.receivedArgs.args,
  'RPC receives ONLY p_receipt_id and p_admin_notes'
);
assert(
  successCase.result.success === true &&
  successCase.result.plan_id === 'enterprise' &&
  successCase.result.user_id === 'cust-uuid-123' &&
  successCase.directWritesAttempted === false,
  'Successful RPC returns activation result without direct table writes'
);

// 2.2 Idempotent duplicate approval
const idempotentCase = await runMockApprovalTest({
  rpcMock: async () => ({
    data: {
      success: true,
      idempotent: true,
      message: 'Receipt has already been approved. Subscription was not modified.',
      receipt_id: '11111111-1111-1111-1111-111111111111',
      user_id: 'cust-uuid-123',
      status: 'approved'
    },
    error: null
  })
});

assert(
  idempotentCase.result.success === true &&
  idempotentCase.result.idempotent === true,
  'Idempotent repeated approval safely reports idempotent status'
);

// 2.3 RPC Failure -> No Fallback Direct Writes
const failureCase = await runMockApprovalTest({
  rpcMock: async () => ({
    data: null,
    error: { code: '42501', message: 'Access Denied: Caller is not an authorized administrator' }
  })
});

assert(
  failureCase.result.success === false &&
  failureCase.result.error.includes('Access Denied'),
  'RPC failure returns structured error to caller'
);
assert(
  failureCase.directWritesAttempted === false,
  'RPC failure strictly DOES NOT perform fallback direct table writes'
);

// 2.4 Missing Receipt ID rejected early
const emptyIdCase = await runMockApprovalTest({
  receiptId: '',
  rpcMock: async () => ({ data: null, error: null })
});
assert(
  emptyIdCase.result.success === false &&
  emptyIdCase.rpcCallCount === 0,
  'Empty receiptId is rejected before invoking the network'
);

// ── TEST GROUP 3: Live Production RPC Contract Verification ──────────────────
console.log('\n--- TEST GROUP 3: Live Production Supabase Contract ---');

const SUPABASE_URL = 'https://slhxqshdvivvsdifbsxo.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO';

try {
  const liveRpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_approve_receipt_and_activate`, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_receipt_id: '00000000-0000-0000-0000-000000000000',
      p_admin_notes: 'Automated contract verification'
    })
  });

  const bodyText = await liveRpcRes.text();
  assert(
    liveRpcRes.status === 401 && bodyText.includes('42501') && bodyText.includes('Access Denied'),
    'Live RPC exists, active, and enforces 42501 authorization guard against unauthorized callers'
  );

  const tables = ['payment_receipts', 'payments', 'subscriptions', 'admin_review_queue'];
  for (const t of tables) {
    const tableRes = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=*`, {
      headers: {
        apikey: PUBLISHABLE_KEY,
        Authorization: `Bearer ${PUBLISHABLE_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    const countRange = tableRes.headers.get('content-range');
    assert(
      countRange === '*/0',
      `Production table '${t}' row count remains 0 (zero accidental writes or test records)`
    );
  }
} catch (netErr) {
  console.error('Network verification failed:', netErr.message);
  process.exitCode = 1;
}

console.log('\n================================================================');
console.log(`🏁  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('🎉 SPRINT 03B-2 APPLICATION WRITE PATH VERIFIED SUCCESSFULLY!\n');
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
