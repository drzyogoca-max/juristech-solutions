/**
 * src/scale/externalAuditSimulation.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — External Audit Simulation & Virtual Data Room (VDR)
 * Specification: Task 23.2
 *
 * Virtual Data Room (VDR) simulation interface for independent third-party auditors
 * (Big 4, ISO certification bodies, Saudi SDAIA reviewers).
 *
 * STRICT GOVERNANCE RULES:
 *  • AUDIT_VIEW_ONLY = true (Read-only inspection of cryptographic proofs).
 *  • RAW_DATA_EXPORT = BLOCKED (Zero raw customer data in audit rooms).
 *  • Proof Generated != Data Stored.
 */

export type VdrRoomCategory =
  | 'ISO27001_ANNEX_A_EVIDENCE_ROOM'
  | 'SDAIA_AI_ETHICS_AUDIT_ROOM'
  | 'SOC2_TYPE_II_CONTROLS_ROOM'
  | 'POST_QUANTUM_LATTICE_VERIFICATION_ROOM';

export interface VirtualDataRoomEvidenceItem {
  evidenceId: string;
  titleEn: string;
  titleAr: string;
  controlCode: string;
  cryptographicProofHash: string;
  verificationStatus: 'VERIFIED_TAMPER_PROOF' | 'UNDER_INSPECTION';
  nonRetentionCertified: boolean;
}

export interface VirtualDataRoom {
  roomId: string;
  roomTitleEn: string;
  roomTitleAr: string;
  targetAuditorFirm: 'BIG_4_AUDIT_FIRM' | 'ISO_REGISTRAR' | 'SDAIA_REVIEW_TEAM';
  category: VdrRoomCategory;
  evidenceItems: VirtualDataRoomEvidenceItem[];
  auditViewOnlyMode: boolean;
  rawDataExportBlocked: boolean;
  lastAuditorSessionAt: string;
}

class ExternalAuditSimulation {
  private static instance: ExternalAuditSimulation;
  private rooms: Map<string, VirtualDataRoom> = new Map();

  private constructor() {
    this.seedAuditRooms();
  }

  public static getInstance(): ExternalAuditSimulation {
    if (!ExternalAuditSimulation.instance) {
      ExternalAuditSimulation.instance = new ExternalAuditSimulation();
    }
    return ExternalAuditSimulation.instance;
  }

  private seedAuditRooms(): void {
    const list: VirtualDataRoom[] = [
      {
        roomId: 'vdr_iso_annex_a_room',
        roomTitleEn: 'ISO/IEC 27001:2022 Annex A Virtual Audit Room',
        roomTitleAr: 'غرفة التدقيق الافتراضية لضوابط الآيزو 27001:2022 الملحق أ',
        targetAuditorFirm: 'ISO_REGISTRAR',
        category: 'ISO27001_ANNEX_A_EVIDENCE_ROOM',
        auditViewOnlyMode: true,
        rawDataExportBlocked: true,
        lastAuditorSessionAt: '2026-02-26T08:00:00.000Z',
        evidenceItems: [
          {
            evidenceId: 'ev_a_05_policies',
            titleEn: 'Information Security Policy & Human Approval Gate Proof',
            titleAr: 'إثبات سياسات أمن المعلومات وبوابة الموافقة البشرية',
            controlCode: 'A.5.1',
            cryptographicProofHash: 'proof_vdr_sha512_a51_991827364501928374650192837465',
            verificationStatus: 'VERIFIED_TAMPER_PROOF',
            nonRetentionCertified: true,
          },
          {
            evidenceId: 'ev_a_08_access',
            titleEn: 'Zero-Retention RAM Overwrite & Tenant Namespace Isolation',
            titleAr: 'إثبات مسح الذاكرة الفوري وعزل نطاقات المستأجرين',
            controlCode: 'A.8.1',
            cryptographicProofHash: 'proof_vdr_sha512_a81_33491b827e10a99c88271a6b591827',
            verificationStatus: 'VERIFIED_TAMPER_PROOF',
            nonRetentionCertified: true,
          },
        ],
      },
      {
        roomId: 'vdr_sdaia_ethics_room',
        roomTitleEn: 'Saudi SDAIA AI Ethics & Fairness Virtual Audit Room',
        roomTitleAr: 'غرفة التدقيق الافتراضية لأخلاقيات الذكاء الاصطناعي (سدايا)',
        targetAuditorFirm: 'SDAIA_REVIEW_TEAM',
        category: 'SDAIA_AI_ETHICS_AUDIT_ROOM',
        auditViewOnlyMode: true,
        rawDataExportBlocked: true,
        lastAuditorSessionAt: '2026-02-26T08:00:00.000Z',
        evidenceItems: [
          {
            evidenceId: 'ev_sdaia_fairness',
            titleEn: 'Algorithmic Fairness & Bias Mitigation Attestation Proof',
            titleAr: 'إثبات العدالة الخوارزمية ومكافحة الانحياز الإحصائي',
            controlCode: 'SDAIA.ETH.01',
            cryptographicProofHash: 'proof_vdr_sha512_sdaia01_88921a837c19b02e994821a7c81920',
            verificationStatus: 'VERIFIED_TAMPER_PROOF',
            nonRetentionCertified: true,
          },
        ],
      },
    ];

    for (const r of list) {
      this.rooms.set(r.roomId, r);
    }
  }

  public listRooms(): VirtualDataRoom[] {
    return Array.from(this.rooms.values());
  }

  public clear(): void {
    this.rooms.clear();
  }
}

export const externalAuditSimulation = ExternalAuditSimulation.getInstance();
