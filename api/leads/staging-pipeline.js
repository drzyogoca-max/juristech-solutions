/**
 * Vercel Edge Serverless Function — /api/leads/staging-pipeline
 * Human-in-the-Loop Proposal Staging & Duplicate Prevention Queue
 */

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

// In-memory / Edge KV simulation for staging proposals and processed lead IDs
const PROCESSED_LEAD_IDS = new Set(['lead_demo_01']);
const STAGED_PROPOSALS = [
  {
    id: 'lead-staged-1723028400000',
    leadCompanyId: 'comp_gulf_legal_01',
    companyName: 'مؤسسة الخليج للحلول القانونية والتجارية',
    targetEmail: 'contact@gulf-legal.com',
    proposalContent: 'عرض خيار الحماية السيادية وصياغة العقود التجارية لمؤسسة الخليج خلال 30 ثانية بأعلى دقة محصنة.',
    status: 'pending_admin_approval',
    createdAt: new Date().toISOString()
  }
];

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(req) {
  try {
    const { leadCompanyId, companyName, proposalContent, targetEmail } = await req.json();

    // 1. Verify duplicate lead dispatch prevention
    const isAlreadyProcessed = await checkExistingLeadStatus(leadCompanyId);
    if (isAlreadyProcessed) {
      return Response.json({ status: 'skipped', message: 'تم إرسال عرض مسبق لهذه الشركة، تم تخطيها لمنع التكرار.' }, { headers: CORS_HEADERS });
    }

    // 2. Create Sovereign Staging Proposal (human-in-the-loop pending approval)
    const stagedProposal = {
      id: `lead-staged-${Date.now()}`,
      leadCompanyId: leadCompanyId || `lead_${Date.now()}`,
      companyName: companyName || 'منشأة تجارية مستهدفة',
      targetEmail: targetEmail || 'Drzyogo.ca@gmail.com',
      proposalContent: proposalContent || 'عرض الشراكة السيادية وإدارة المخاطر التعاقدية.',
      status: 'pending_admin_approval',
      createdAt: new Date().toISOString()
    };

    // Save to internal staging queue
    STAGED_PROPOSALS.unshift(stagedProposal);

    // Internal Email Notification to Platform Inbox
    await notifyAdminInbox({
      subject: `[مسودة بانتظار الاعتماد]: عرض شركة ${stagedProposal.companyName}`,
      body: `تم توليد عرض احترافي لشركة ${stagedProposal.companyName}. يرجى مراجعته والضغط على زر الإرسال النهائي من لوحة تحكم المنصة.\n\nمحتوى العرض:\n${stagedProposal.proposalContent}`
    });

    return Response.json({
      success: true,
      stagedId: stagedProposal.id,
      message: "تم تجهيز العرض وتوجيهه إلى مسودات المنصة. بانتظار اعتمادك اليدوي للإرسال الحقيقي."
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error("[Staging Pipeline Error]:", error);
    return Response.json({ error: error.message || 'Staging Queue Bottleneck' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function checkExistingLeadStatus(leadCompanyId) {
  if (!leadCompanyId) return false;
  return PROCESSED_LEAD_IDS.has(leadCompanyId);
}

export async function markLeadAsSent(leadCompanyId) {
  if (leadCompanyId) PROCESSED_LEAD_IDS.add(leadCompanyId);
}

export async function getStagingQueue() {
  return STAGED_PROPOSALS;
}

export async function approveAndSendProposal(stagedId) {
  const index = STAGED_PROPOSALS.findIndex(p => p.id === stagedId);
  if (index === -1) throw new Error("المسودة غير موجودة.");

  const proposal = STAGED_PROPOSALS[index];
  
  // Real Client Email Dispatch Simulation
  await dispatchEmailToClient(proposal.targetEmail, proposal.proposalContent);
  
  // Mark Lead as Processed to prevent duplicates
  await markLeadAsSent(proposal.leadCompanyId);

  // Remove from pending staging proposals
  STAGED_PROPOSALS.splice(index, 1);

  return { success: true, dispatchedAt: new Date().toISOString() };
}

async function notifyAdminInbox({ subject, body }) {
  console.log(`[Admin Staging Notification] -> ${subject}`);
}

async function dispatchEmailToClient(targetEmail, content) {
  console.log(`[Client Email Dispatch] -> Sent proposal to ${targetEmail}`);
}

export default async function handler(req) {
  return POST(req);
}
