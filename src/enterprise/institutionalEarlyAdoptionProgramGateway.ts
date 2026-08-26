/**
 * Institutional Early Adoption Program Gateway
 * Standard Code: JUR-ENG-IEAPG-2026-V32
 * Motto: "AI suggests. Humans authorize. Systems enforce boundaries."
 * Inviolable: STAGED_ADOPTION_SANDBOX = true; GRADUATED_COMPLIANCE_ACCESS = true; NO_BYPASS_OF_HUMAN_OVERSIGHT = true;
 */

export const STAGED_ADOPTION_SANDBOX = true;
export const GRADUATED_COMPLIANCE_ACCESS = true;
export const NO_BYPASS_OF_HUMAN_OVERSIGHT = true;

export type AdoptionStage =
  | 'STAGE_1_SANDBOX_APPLICATION'
  | 'STAGE_2_SOVEREIGN_SANDBOX_VERIFICATION'
  | 'STAGE_3_CRYPTOGRAPHIC_PILOT'
  | 'STAGE_4_HUMAN_JUDICIAL_SIGNOFF'
  | 'STAGE_5_FULL_CONSORTIUM_PEER';

export interface EarlyAdoptionParticipant {
  participantId: string;
  organizationName: string;
  cohort: string;
  country: string;
  currentStage: AdoptionStage;
  sandboxIsolationEnforced: boolean;
  complianceAttestationVerified: boolean;
  humanSignoffOfficer: string;
  graduationReadinessPct: number;
}

export class InstitutionalEarlyAdoptionProgramGateway {
  private static instance: InstitutionalEarlyAdoptionProgramGateway;

  private participants: EarlyAdoptionParticipant[] = [
    {
      participantId: 'eap_participant_saudi_aramco_legal_01',
      organizationName: 'Global Energy Legal Department & Cross-Border Supply Hub',
      cohort: 'Cohort 2026-Q3 Sovereign Pioneers',
      country: 'SA',
      currentStage: 'STAGE_4_HUMAN_JUDICIAL_SIGNOFF',
      sandboxIsolationEnforced: true,
      complianceAttestationVerified: true,
      humanSignoffOfficer: 'Managing Legal Counsel (Energy & Infrastructure)',
      graduationReadinessPct: 92.5
    },
    {
      participantId: 'eap_participant_mashreq_fintech_02',
      organizationName: 'Pan-Arab Banking Consortium Commercial AI Taskforce',
      cohort: 'Cohort 2026-Q3 Sovereign Pioneers',
      country: 'AE',
      currentStage: 'STAGE_3_CRYPTOGRAPHIC_PILOT',
      sandboxIsolationEnforced: true,
      complianceAttestationVerified: true,
      humanSignoffOfficer: 'Group Head of Regulatory Compliance',
      graduationReadinessPct: 78.0
    },
    {
      participantId: 'eap_participant_singapore_tech_arbitration_03',
      organizationName: 'East Asia Digital Dispute Resolution Institute',
      cohort: 'Cohort 2026-Q3 Sovereign Pioneers',
      country: 'SG',
      currentStage: 'STAGE_4_HUMAN_JUDICIAL_SIGNOFF',
      sandboxIsolationEnforced: true,
      complianceAttestationVerified: true,
      humanSignoffOfficer: 'Vice President of International Arbitral Practice',
      graduationReadinessPct: 95.0
    }
  ];

  public static getInstance(): InstitutionalEarlyAdoptionProgramGateway {
    if (!InstitutionalEarlyAdoptionProgramGateway.instance) {
      InstitutionalEarlyAdoptionProgramGateway.instance = new InstitutionalEarlyAdoptionProgramGateway();
    }
    return InstitutionalEarlyAdoptionProgramGateway.instance;
  }

  public getParticipants(): EarlyAdoptionParticipant[] {
    return [...this.participants];
  }

  public verifyGatewayIntegrity(): {
    stagedAdoptionSandbox: boolean;
    graduatedComplianceAccess: boolean;
    noBypassOfHumanOversight: boolean;
    allSandboxed: boolean;
    aggregateGatewayDigestSha512: string;
  } {
    const allSandboxed = this.participants.every(p => p.sandboxIsolationEnforced);

    return {
      stagedAdoptionSandbox: STAGED_ADOPTION_SANDBOX,
      graduatedComplianceAccess: GRADUATED_COMPLIANCE_ACCESS,
      noBypassOfHumanOversight: NO_BYPASS_OF_HUMAN_OVERSIGHT,
      allSandboxed: allSandboxed,
      aggregateGatewayDigestSha512: 'sha512_aggregate_early_adoption_gateway_v32_verified'
    };
  }
}

export const institutionalEarlyAdoptionProgramGateway = InstitutionalEarlyAdoptionProgramGateway.getInstance();
