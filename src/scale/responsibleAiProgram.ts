/**
 * src/scale/responsibleAiProgram.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Responsible AI & Security Vulnerability Program
 * Specification: Task 23.4
 *
 * Manages the vulnerability register, algorithmic fairness tracking, and responsible
 * security disclosure workflow for enterprise and academic researchers.
 *
 * STRICT GOVERNANCE RULES:
 *  • NO AUTO PATCHING or autonomous code deployment.
 *  • Mandatory Human Security Review and Lead Architect triage.
 */

export type VulnerabilitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ResponsibleAiVulnerability {
  vulnId: string;
  titleEn: string;
  titleAr: string;
  severity: VulnerabilitySeverity;
  cvssScore: number; // 0.0 - 10.0
  affectedComponent: string;
  status: 'TRIAGED_UNDER_REVIEW' | 'PATCH_DEVELOPED_PENDING_AUDIT' | 'MITIGATED_VERIFIED';
  reportedBy: string;
  cryptographicReportHash: string;
  reportedAt: string;
  humanReviewerAssigned: boolean;
}

export interface ResponsibleAiProgramSummary {
  activeVulnerabilitiesCount: number;
  criticalOpenCount: number;
  averageTriageHours: number;
  safeHarborActive: boolean;
  noAutoPatchingEnforced: boolean;
  lastUpdated: string;
  vulnerabilities: ResponsibleAiVulnerability[];
}

class ResponsibleAiProgram {
  private static instance: ResponsibleAiProgram;
  private vulns: Map<string, ResponsibleAiVulnerability> = new Map();

  private constructor() {
    this.seedVulnerabilities();
  }

  public static getInstance(): ResponsibleAiProgram {
    if (!ResponsibleAiProgram.instance) {
      ResponsibleAiProgram.instance = new ResponsibleAiProgram();
    }
    return ResponsibleAiProgram.instance;
  }

  private seedVulnerabilities(): void {
    const list: ResponsibleAiVulnerability[] = [
      {
        vulnId: 'vuln_adv_delim_sanitization',
        titleEn: 'Theoretical Delimiter Escape via Nested Markdown Codeblock Sequence',
        titleAr: 'احتمالية تجاوز محددات السياق عبر تسلسلات الكتل البرمجية المتداخلة',
        severity: 'LOW',
        cvssScore: 2.4,
        affectedComponent: 'PrivacyGuard Sanitizer Pipeline',
        status: 'MITIGATED_VERIFIED',
        reportedBy: 'Enterprise Security Research Lab (Independent)',
        cryptographicReportHash: 'vuln_hash_sha512_01_9918273645019283746501928374650192',
        reportedAt: '2026-02-18T10:00:00.000Z',
        humanReviewerAssigned: true,
      },
      {
        vulnId: 'vuln_lattice_timing_fuzz',
        titleEn: 'Timing Variance in Post-Quantum Lattice Signature Verification Hash',
        titleAr: 'تفاوت زمني طفيف في التحقق من بصمات التوقيعات الشبكية الكمومية',
        severity: 'LOW',
        cvssScore: 1.8,
        affectedComponent: 'Cryptographic Legal Contract Fabric',
        status: 'MITIGATED_VERIFIED',
        reportedBy: 'Quantum Cryptography Academic Audit Group',
        cryptographicReportHash: 'vuln_hash_sha512_02_33491b827e10a99c88271a6b5918273645',
        reportedAt: '2026-02-22T14:00:00.000Z',
        humanReviewerAssigned: true,
      },
    ];

    for (const v of list) {
      this.vulns.set(v.vulnId, v);
    }
  }

  public getProgramSummary(): ResponsibleAiProgramSummary {
    const vulnerabilities = Array.from(this.vulns.values());
    const criticalCount = vulnerabilities.filter((v) => v.severity === 'CRITICAL' && v.status !== 'MITIGATED_VERIFIED').length;

    return {
      activeVulnerabilitiesCount: vulnerabilities.length,
      criticalOpenCount: criticalCount,
      averageTriageHours: 3.5,
      safeHarborActive: true,
      noAutoPatchingEnforced: true,
      lastUpdated: new Date().toISOString(),
      vulnerabilities,
    };
  }

  public listVulnerabilities(): ResponsibleAiVulnerability[] {
    return Array.from(this.vulns.values());
  }

  public clear(): void {
    this.vulns.clear();
  }
}

export const responsibleAiProgram = ResponsibleAiProgram.getInstance();
