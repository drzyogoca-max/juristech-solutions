/**
 * scripts/test-mediacube-proposal.mjs
 * Validate sponsor-mediacube.js data structures and email generation
 */

import { MEDIACUBE_PARTNERSHIP_PROPOSAL } from '../api/partnerships/sponsor-mediacube.js';

function testMediacubeProposal() {
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('🧪 Testing Mediacube (MC Pay) Strategic Partnership & Sponsorship Proposal');
  console.log('─────────────────────────────────────────────────────────────────────────────');

  console.log('Recipient:', MEDIACUBE_PARTNERSHIP_PROPOSAL.recipient);
  console.log('CC Recipients:', MEDIACUBE_PARTNERSHIP_PROPOSAL.ccRecipients);
  console.log('Subject:', MEDIACUBE_PARTNERSHIP_PROPOSAL.subject);
  console.log('Text Length:', MEDIACUBE_PARTNERSHIP_PROPOSAL.textBody.length, 'chars');
  console.log('HTML Length:', MEDIACUBE_PARTNERSHIP_PROPOSAL.htmlBody.length, 'chars');

  // Verify all 3 tiers are present
  const hasTier1 = MEDIACUBE_PARTNERSHIP_PROPOSAL.textBody.includes('GLOBAL PLATFORM & NAVIGATION HEADER CO-SPONSOR');
  const hasTier2 = MEDIACUBE_PARTNERSHIP_PROPOSAL.textBody.includes('CO-BRANDED DEAL SHIELD & CREATOR ESCROW PROTECTION');
  const hasTier3 = MEDIACUBE_PARTNERSHIP_PROPOSAL.textBody.includes('EXECUTIVE VIDEO HUB & PRODUCTION SPONSORSHIP');

  console.log('Tier 1 Present:', hasTier1);
  console.log('Tier 2 Present:', hasTier2);
  console.log('Tier 3 Present:', hasTier3);

  if (hasTier1 && hasTier2 && hasTier3) {
    console.log('✅ Mediacube Sponsorship Proposal Verified Successfully!');
  } else {
    console.error('❌ Missing sponsorship tiers in proposal.');
    process.exit(1);
  }
}

testMediacubeProposal();
