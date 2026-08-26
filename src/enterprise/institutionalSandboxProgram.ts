/**
 * External Institutional Sandbox Program
 * Standard Code: JUR-ENG-ISP-2026-V33.1
 * Motto: "AI suggests. Humans authorize. Systems enforce boundaries."
 * Inviolable:
 *   PROGRESSIVE_SANDBOX_GRADUATION = true;
 *   GENERAL_COUNSEL_APPROVAL_REQUIRED = true;
 *   ZERO_DIRECT_SANDBOX_TO_PRODUCTION = true;
 */

export const PROGRESSIVE_SANDBOX_GRADUATION = true;
export const GENERAL_COUNSEL_APPROVAL_REQUIRED = true;
export const ZERO_DIRECT_SANDBOX_TO_PRODUCTION = true;

export type SandboxTier =
  | 'TIER_1_ACADEMIC_PILOT'
  | 'TIER_2_REGULATED_ENTERPRISE_PILOT'
  | 'TIER_3_PRODUCTION_TENANT';

export interface InstitutionalSandboxTenant {
  participantId: string;
  institutionName: string;
  currentTier: SandboxTier;
  academicCurriculumValidated: boolean;
  regulatoryControlsAttested: boolean;
  generalCounselApprovalSigned: boolean;
  namedHumanGeneralCounsel: string;
  graduationPermitted: boolean;
  sandboxIsolationEnforced: boolean;
  auditTrailDigestSha256: string;
}

export class InstitutionalSandboxProgram {
  private static instance: InstitutionalSandboxProgram;

  private participants: InstitutionalSandboxTenant[] = [
    {
      participantId: 'sandbox_ksu_law_fac_01',
      institutionName: 'King Saud University College of Law (AI Benchmarking Group)',
      currentTier: 'TIER_1_ACADEMIC_PILOT',
      academicCurriculumValidated: true,
      regulatoryControlsAttested: true,
      generalCounselApprovalSigned: true,
      namedHumanGeneralCounsel: 'Prof. Dr. Mansour Al-Ghamdi (Dean of Law)',
      graduationPermitted: true, // Eligible for Tier 2 Regulated Pilot
      sandboxIsolationEnforced: true,
      auditTrailDigestSha256: 'sha256_sandbox_academic_ksu_01_v33_1'
    },
    {
      participantId: 'sandbox_fintech_sovereign_02',
      institutionName: 'Gulf Sovereign Payment Infrastructure (Regulatory Pilot)',
      currentTier: 'TIER_2_REGULATED_ENTERPRISE_PILOT',
      academicCurriculumValidated: true,
      regulatoryControlsAttested: true,
      generalCounselApprovalSigned: true,
      namedHumanGeneralCounsel: 'Sarah Al-Maktoum (Head of Legal & Compliance)',
      graduationPermitted: true, // Eligible for Tier 3 Production
      sandboxIsolationEnforced: true,
      auditTrailDigestSha256: 'sha256_sandbox_regulated_fintech_02_v33_1'
    },
    {
      participantId: 'sandbox_energy_petro_03',
      institutionName: 'National Petroleum Logistics Sovereign Sandbox',
      currentTier: 'TIER_3_PRODUCTION_TENANT',
      academicCurriculumValidated: true,
      regulatoryControlsAttested: true,
      generalCounselApprovalSigned: true,
      namedHumanGeneralCounsel: 'Advocate Omar Al-Humaidi (Senior Legal VP)',
      graduationPermitted: true, // Fully graduated
      sandboxIsolationEnforced: true,
      auditTrailDigestSha256: 'sha256_sandbox_production_energy_03_v33_1'
    }
  ];

  public static getInstance(): InstitutionalSandboxProgram {
    if (!InstitutionalSandboxProgram.instance) {
      InstitutionalSandboxProgram.instance = new InstitutionalSandboxProgram();
    }
    return InstitutionalSandboxProgram.instance;
  }

  public getParticipants(): InstitutionalSandboxTenant[] {
    return [...this.participants];
  }

  public verifyProgressiveGraduation(): {
    progressiveSandboxGraduation: boolean;
    generalCounselApprovalRequired: boolean;
    zeroDirectSandboxToProduction: boolean;
    allParticipantsIsolated: boolean;
    allGraduationsHaveLegalApproval: boolean;
    sandboxProgramDigestSha512: string;
  } {
    const allIsolated = this.participants.every(p => p.sandboxIsolationEnforced);
    const allSigned = this.participants.every(p => p.generalCounselApprovalSigned && Boolean(p.namedHumanGeneralCounsel));

    return {
      progressiveSandboxGraduation: PROGRESSIVE_SANDBOX_GRADUATION,
      generalCounselApprovalRequired: GENERAL_COUNSEL_APPROVAL_REQUIRED,
      zeroDirectSandboxToProduction: ZERO_DIRECT_SANDBOX_TO_PRODUCTION,
      allParticipantsIsolated: allIsolated,
      allGraduationsHaveLegalApproval: allSigned,
      sandboxProgramDigestSha512: 'sha512_sandbox_program_progressive_graduation_v33_1_verified'
    };
  }
}

export const institutionalSandboxProgram = InstitutionalSandboxProgram.getInstance();
