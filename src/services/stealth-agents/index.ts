import { generateEnterpriseProposal, HighTicketProposal, B2BProposalRequest } from './enterpriseDealAgent';
import { runPricingOptimizationAgent, PricingStrategy } from './pricingOptimizationAgent';
import { auditGlobalCompliance, ComplianceAuditReport } from './globalComplianceAgent';
import { runDailySelfEvolution } from './dailySelfEvolution';

export {
  generateEnterpriseProposal,
  runPricingOptimizationAgent,
  auditGlobalCompliance,
  runDailySelfEvolution,
};

export type {
  HighTicketProposal,
  B2BProposalRequest,
  PricingStrategy,
  ComplianceAuditReport,
};

export function startStealthAgents(): void {
  // Execute initial background evaluation
  setTimeout(() => {
    runPricingOptimizationAgent();
    runDailySelfEvolution();
  }, 2000);

  // Set recurring 24-hour cycle for pricing optimization & self evolution
  setInterval(() => {
    runPricingOptimizationAgent();
    runDailySelfEvolution();
  }, 24 * 60 * 60 * 1000);
}
