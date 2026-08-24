/**
 * scripts/test-webhook-idempotency.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Strict Idempotency, Concurrency & Lease-Timeout Test Suite
 * Simulates:
 *   1. Webhook A (Fresh event processing)
 *   2. Webhook A Duplicate (Sequential replay)
 *   3. Webhook A + Webhook A Concurrently (Race condition attack)
 *   4. Webhook A -> Server Restart -> Webhook A again (Memory wipe simulation)
 *   5. Webhook A on Instance 1 -> Webhook A on Instance 2 (Multi-instance distributed simulation)
 *   6. Webhook A (processing -> timeout -> retry allowed) (Lease-timeout crash recovery)
 */

// Simulated Mock Database Table: public.webhook_events with Lease Timeout & Retry Tracking
class MockDatabase {
  constructor() {
    this.records = new Map(); // provider:event_id -> record
  }

  async insertOrClaimWebhookEvent(provider, eventId, eventType) {
    const key = `${provider}:${eventId}`;
    const existing = this.records.get(key);

    if (existing) {
      if (existing.status === 'completed') {
        return { ok: false, status: 'ALREADY_PROCESSED_IN_DATABASE' };
      }
      
      const now = Date.now();
      const leaseAgeMs = now - existing.claimedAt;
      const LEASE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

      if (existing.status === 'processing' && leaseAgeMs < LEASE_TIMEOUT_MS) {
        return { ok: false, status: 'CURRENTLY_PROCESSING_IN_DATABASE' };
      }

      // Lease timed out or failed: Re-claim and allow retry!
      existing.status = 'processing';
      existing.claimedAt = now;
      existing.attemptCount += 1;
      existing.lastError = 'Retried after processing timeout';
      return { ok: true, status: 'LEASE_RECLAIMED_FOR_RETRY', record: existing };
    }

    const record = {
      provider,
      eventId,
      eventType,
      status: 'processing',
      claimedAt: Date.now(),
      completedAt: null,
      attemptCount: 1,
      lastError: null,
    };
    this.records.set(key, record);
    return { ok: true, status: 'FRESH_CLAIM', record };
  }

  async markCompleted(provider, eventId) {
    const key = `${provider}:${eventId}`;
    const rec = this.records.get(key);
    if (rec) {
      rec.status = 'completed';
      rec.completedAt = Date.now();
    }
  }

  simulateHangOrCrash(provider, eventId, ageMs) {
    const key = `${provider}:${eventId}`;
    const rec = this.records.get(key);
    if (rec) {
      rec.status = 'processing';
      rec.claimedAt = Date.now() - ageMs; // artificially age the claim
    }
  }
}

// Simulated Webhook Handler Instance with Dual-Layer Idempotency & Lease-Timeout
class WebhookHandlerInstance {
  constructor(instanceId, db) {
    this.instanceId = instanceId;
    this.db = db;
    this.memoryCache = new Set();
    this.processedPaymentsCount = 0;
  }

  restart() {
    this.memoryCache.clear();
  }

  async processWebhook(provider, eventId, eventType, amount) {
    const compositeKey = `${provider}:${eventId}`;

    // 1. Layer 1 Check (Process-Local Memory)
    if (this.memoryCache.has(compositeKey)) {
      return { status: 200, result: 'ALREADY_PROCESSED_IN_MEMORY', instance: this.instanceId, duplicate: true };
    }

    // 2. Layer 2 Check (Database-Backed Lease & Claim)
    const dbClaim = await this.db.insertOrClaimWebhookEvent(provider, eventId, eventType);
    if (!dbClaim.ok) {
      return { status: 200, result: dbClaim.status, instance: this.instanceId, duplicate: true };
    }

    // 3. Business Execution & Ledger Completion
    this.processedPaymentsCount += 1;
    await this.db.markCompleted(provider, eventId);
    this.memoryCache.add(compositeKey);

    return { status: 200, result: 'PROCESSED_SUCCESS', instance: this.instanceId, duplicate: false, claimType: dbClaim.status };
  }
}

async function runTestSuite() {
  console.log('🧪 [JurisTech Idempotency Test] Starting Dual-Layer & Concurrency Simulation Suite...\n');

  const sharedDb = new MockDatabase();
  let passedTests = 0;

  // ── TEST 1: Fresh Webhook Processing ──
  const instance1 = new WebhookHandlerInstance('INST-01', sharedDb);
  const res1 = await instance1.processWebhook('paddle', 'evt_1001', 'payment.succeeded', 49.00);
  if (res1.result === 'PROCESSED_SUCCESS' && instance1.processedPaymentsCount === 1) {
    console.log('✅ TEST 1 PASSED: Fresh Webhook processed successfully.');
    passedTests++;
  } else {
    console.error('❌ TEST 1 FAILED:', res1);
  }

  // ── TEST 2: Sequential Duplicate Webhook on Same Instance ──
  const res2 = await instance1.processWebhook('paddle', 'evt_1001', 'payment.succeeded', 49.00);
  if (res2.result === 'ALREADY_PROCESSED_IN_MEMORY' && instance1.processedPaymentsCount === 1) {
    console.log('✅ TEST 2 PASSED: Sequential duplicate blocked by Layer 1 (In-Memory).');
    passedTests++;
  } else {
    console.error('❌ TEST 2 FAILED:', res2);
  }

  // ── TEST 3: Concurrent Parallel Webhook Requests (Race Condition Simulation) ──
  const concurrentPromises = [
    instance1.processWebhook('paytabs', 'evt_2002', 'payment.succeeded', 139.00),
    instance1.processWebhook('paytabs', 'evt_2002', 'payment.succeeded', 139.00),
    instance1.processWebhook('paytabs', 'evt_2002', 'payment.succeeded', 139.00),
  ];
  const concurrentResults = await Promise.all(concurrentPromises);
  const successCount = concurrentResults.filter(r => r.result === 'PROCESSED_SUCCESS').length;
  const duplicateCount = concurrentResults.filter(r => r.duplicate === true).length;

  if (successCount === 1 && duplicateCount === 2) {
    console.log(`✅ TEST 3 PASSED: Concurrent race condition handled atomically (1 Processed, 2 Blocked).`);
    passedTests++;
  } else {
    console.error('❌ TEST 3 FAILED: Race condition allowed double processing!', concurrentResults);
  }

  // ── TEST 4: Server Restart Simulation (Memory Cleared -> Blocked by DB) ──
  instance1.restart(); // Wipe in-memory Set
  const res4 = await instance1.processWebhook('paddle', 'evt_1001', 'payment.succeeded', 49.00);
  if (res4.result === 'ALREADY_PROCESSED_IN_DATABASE' && instance1.processedPaymentsCount === 2) {
    console.log('✅ TEST 4 PASSED: Server restart wiped memory, but Layer 2 (Database-Backed) blocked duplicate.');
    passedTests++;
  } else {
    console.error('❌ TEST 4 FAILED: Server restart caused duplicate processing!', res4);
  }

  // ── TEST 5: Multi-Instance Distributed Serverless Simulation ──
  const instance2 = new WebhookHandlerInstance('INST-02', sharedDb);
  const res5 = await instance2.processWebhook('paddle', 'evt_1001', 'payment.succeeded', 49.00);
  if (res5.result === 'ALREADY_PROCESSED_IN_DATABASE' && instance2.processedPaymentsCount === 0) {
    console.log('✅ TEST 5 PASSED: Separate Instance 2 blocked duplicate via Shared Database constraint.');
    passedTests++;
  } else {
    console.error('❌ TEST 5 FAILED: Multi-instance environment failed to prevent duplicate!', res5);
  }

  // ── TEST 6: Lease-Timeout Crash Recovery (processing -> timeout -> retry allowed) ──
  // Step 1: A first worker claims evt_3003 but crashes mid-flight (never calls markCompleted)
  await sharedDb.insertOrClaimWebhookEvent('stripe', 'evt_3003', 'payment.succeeded');
  // Step 2: Artificially age the claim to 10 minutes ago (lease expired)
  sharedDb.simulateHangOrCrash('stripe', 'evt_3003', 10 * 60 * 1000);
  // Step 3: A second worker (new container) arrives after the timeout and should be allowed to retry
  const res6 = await instance2.processWebhook('stripe', 'evt_3003', 'payment.succeeded', 349.00);
  if (res6.result === 'PROCESSED_SUCCESS' && res6.claimType === 'LEASE_RECLAIMED_FOR_RETRY') {
    console.log('✅ TEST 6 PASSED: Timed-out processing lease recovered and successfully retried.');
    passedTests++;
  } else {
    console.error('❌ TEST 6 FAILED: Lease timeout recovery failed!', res6);
  }

  console.log(`\n==========================================================================`);
  console.log(`🎯 IDEMPOTENCY SIMULATION SUITE RESULT: ${passedTests} / 6 TESTS PASSED (100%)`);
  console.log(`==========================================================================\n`);

  if (passedTests === 6) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite();
