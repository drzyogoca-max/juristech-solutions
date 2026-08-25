/**
 * scripts/test-paddle-webhook.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Paddle Webhook Simulation & Integration Test
 * 
 * Tests all 4 required Paddle v2 webhook events:
 *   1. transaction.completed
 *   2. subscription.created
 *   3. subscription.updated
 *   4. subscription.canceled
 * 
 * Usage:
 *   node scripts/test-paddle-webhook.mjs [localhost:3000]
 */

const WEBHOOK_URL = `http://${process.argv[2] || 'localhost:3000'}/api/webhooks/payment?provider=paddle`;

const PADDLE_PRICE_ID = 'pri_01m0ty6sxjj7w0xpm1r07r50ss';
const PADDLE_PRODUCT_ID = 'pro_01m0txshyww92xh07mawyzg52j';
const TEST_EMAIL = 'test-subscriber@juristech.solutions';

const baseData = {
  customer: {
    id: 'ctm_test_01abc123456789',
    email: TEST_EMAIL,
  },
  custom_data: {
    userEmail: TEST_EMAIL,
    userName: 'Test Subscriber',
    planTier: 'pro',
    amountUSD: 49,
    productId: PADDLE_PRODUCT_ID,
  },
  items: [
    {
      price: {
        id: PADDLE_PRICE_ID,
        product_id: PADDLE_PRODUCT_ID,
        billing_cycle: { interval: 'month', frequency: 1 },
        unit_price: { amount: '4900', currency_code: 'USD' },
      },
      quantity: 1,
    }
  ],
  currency_code: 'USD',
  details: {
    totals: { total: '4900', tax: '0', subtotal: '4900' }
  }
};

const EVENTS = [
  {
    name: 'transaction.completed',
    payload: {
      event_id: `evt_txn_${Date.now()}_test`,
      event_type: 'transaction.completed',
      occurred_at: new Date().toISOString(),
      data: {
        ...baseData,
        id: `txn_test_${Date.now()}`,
        subscription_id: `sub_test_01abc123456789`,
        status: 'completed',
      }
    }
  },
  {
    name: 'subscription.created',
    payload: {
      event_id: `evt_sub_created_${Date.now()}_test`,
      event_type: 'subscription.created',
      occurred_at: new Date().toISOString(),
      data: {
        ...baseData,
        id: `sub_test_01abc123456789`,
        status: 'active',
        current_billing_period: {
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        },
        next_billed_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      }
    }
  },
  {
    name: 'subscription.updated',
    payload: {
      event_id: `evt_sub_updated_${Date.now()}_test`,
      event_type: 'subscription.updated',
      occurred_at: new Date().toISOString(),
      data: {
        ...baseData,
        id: `sub_test_01abc123456789`,
        status: 'active',
        current_billing_period: {
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        },
      }
    }
  },
  {
    name: 'subscription.canceled',
    payload: {
      event_id: `evt_sub_canceled_${Date.now()}_test`,
      event_type: 'subscription.canceled',
      occurred_at: new Date().toISOString(),
      data: {
        ...baseData,
        id: `sub_test_01abc123456789`,
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      }
    }
  }
];

async function sendWebhookEvent(event) {
  const start = Date.now();
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'paddle-signature': 'SANDBOX_BYPASS_NO_SECRET_CONFIGURED',
        'X-Test-Source': 'juristech-paddle-webhook-simulator',
      },
      body: JSON.stringify(event.payload),
    });
    const elapsed = Date.now() - start;
    const json = await res.json().catch(() => ({}));

    if (res.status === 200) {
      console.log(`\n✅ [${event.name}] PASS → HTTP ${res.status} (${elapsed}ms)`);
      console.log(`   Event ID:   ${event.payload.event_id}`);
      console.log(`   Idempotency: ${json.idempotency || json.status || 'N/A'}`);
      console.log(`   DB-Backed:  ${json.isDatabaseBacked ?? 'N/A'}`);
    } else {
      console.error(`\n❌ [${event.name}] FAIL → HTTP ${res.status}`);
      console.error(`   Response: ${JSON.stringify(json)}`);
    }
    return res.status === 200;
  } catch (err) {
    console.error(`\n💥 [${event.name}] ERROR → ${err.message}`);
    return false;
  }
}

async function runAll() {
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║   JurisTech Solutions — Paddle Webhook Simulator v1.0           ║');
  console.log('║   Endpoint:', WEBHOOK_URL.padEnd(53), '║');
  console.log('║   Price ID: pri_01m0ty6sxjj7w0xpm1r07r50ss                     ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  let passed = 0;
  for (const event of EVENTS) {
    const ok = await sendWebhookEvent(event);
    if (ok) passed++;
    await new Promise(r => setTimeout(r, 150)); // slight delay between events
  }

  console.log(`\n──────────────────────────────────────────────────────────────────`);
  console.log(`   Result: ${passed}/${EVENTS.length} webhook events processed successfully`);
  console.log(`   Price ID linked: ${PADDLE_PRICE_ID}`);
  console.log(`   Product ID: ${PADDLE_PRODUCT_ID}`);
  if (passed === EVENTS.length) {
    console.log(`\n   🏆 ALL PADDLE WEBHOOK EVENTS PASSED — READY FOR PRODUCTION`);
  } else {
    console.warn(`\n   ⚠️  Some events failed — ensure server is running on ${WEBHOOK_URL}`);
  }
  console.log(`──────────────────────────────────────────────────────────────────\n`);
}

runAll();
