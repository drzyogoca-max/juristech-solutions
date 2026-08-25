/**
 * src/network/multiAgentNegotiation.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Autonomous Multi-Agent Contract Negotiation Room
 * Specification: Task 14.3
 *
 * Simulates collaborative and adversarial multi-agent contract clause negotiations:
 *  • Agent Alpha (Buyer / Enterprise Counsel - Protection Maximizer)
 *  • Agent Beta (Seller / Vendor Counsel - Liability Minimizer)
 *  • Agent Arbiter (Neutral Legal Facilitator - Compromise Harmonizer)
 */

export interface NegotiationMessage {
  turn: number;
  agentRole: 'BUYER_COUNSEL' | 'SELLER_COUNSEL' | 'ARBITER_FACILITATOR';
  agentName: string;
  proposedClauseText: string;
  legalRationaleEn: string;
  legalRationaleAr: string;
  concessionOffered?: string;
}

export interface NegotiationSessionResult {
  sessionId: string;
  clauseTopic: string;
  jurisdiction: string;
  totalTurns: number;
  consensusScore: number; // 0 - 100
  status: 'CONSENSUS_REACHED' | 'IMPASSE' | 'PARTIALLY_AGREED';
  messages: NegotiationMessage[];
  finalSynthesizedClauseEn: string;
  finalSynthesizedClauseAr: string;
  keyTradeoffs: Array<{ issue: string; resolution: string }>;
}

class MultiAgentNegotiationRoom {
  private static instance: MultiAgentNegotiationRoom;

  private constructor() {}

  public static getInstance(): MultiAgentNegotiationRoom {
    if (!MultiAgentNegotiationRoom.instance) {
      MultiAgentNegotiationRoom.instance = new MultiAgentNegotiationRoom();
    }
    return MultiAgentNegotiationRoom.instance;
  }

  /**
   * Execute a simulated multi-agent negotiation round on a contested contract clause
   */
  public runNegotiation(params: {
    clauseTopic: string;
    jurisdiction?: string;
    buyerAggressiveness?: 'BALANCED' | 'AGGRESSIVE';
    sellerFlexibility?: 'FLEXIBLE' | 'RIGID';
  }): NegotiationSessionResult {
    const sessionId = `neg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const jur = params.jurisdiction || 'SA';

    const messages: NegotiationMessage[] = [
      {
        turn: 1,
        agentRole: 'BUYER_COUNSEL',
        agentName: 'Alpha Legal AI (Buyer Counsel)',
        proposedClauseText: 'Vendor shall fully indemnify Buyer against all direct, indirect, and consequential losses without limitation, including full IP indemnification.',
        legalRationaleEn: 'Demanding unlimited indemnification and comprehensive consequential damages to insulate Buyer from supply chain disruptions.',
        legalRationaleAr: 'المطالبة بتعويض شامل وغير مقيد عن كافة الأضرار المباشرة وغير المباشرة لحماية المشتري من مخاطر التوريد.',
      },
      {
        turn: 2,
        agentRole: 'SELLER_COUNSEL',
        agentName: 'Beta Legal AI (Vendor Counsel)',
        proposedClauseText: 'Vendor total aggregate liability under this agreement shall be strictly capped at 50% of the fees actually paid in the preceding 6 months. Indirect damages expressly excluded.',
        legalRationaleEn: 'Rejecting unlimited exposure as commercially unviable. Proposing standard market cap tied to trailing fees with consequential damages waiver.',
        legalRationaleAr: 'رفض المسؤولية غير المحدودة واقتراح سقف مسؤولية يعادل 50% من الرسوم المدفوعة مع استبعاد الأضرار التبعية.',
        concessionOffered: 'Willing to offer 100% cap specifically for gross negligence.',
      },
      {
        turn: 3,
        agentRole: 'ARBITER_FACILITATOR',
        agentName: 'Lex Arbiter (Neutral Legal Harmonizer)',
        proposedClauseText: 'Each Party aggregate liability shall be capped at 100% of fees paid in preceding 12 months. Consequential damages excluded except for breach of confidentiality and willful misconduct. IP indemnity subject to separate super-cap of 200%.',
        legalRationaleEn: 'Synthesized balanced enterprise compromise: 12-month trailing 100% mutual cap, industry-standard carveouts, and dedicated 200% IP super-cap.',
        legalRationaleAr: 'صياغة تسوية تعاقدية متوازنة: سقف تبادلي بنسبة 100% من رسوم 12 شهراً، واستثناء إفشاء السرية وسوء السلوك العمدي، وسقف خاص للملكية الفكرية بنسبة 200%.',
        concessionOffered: 'Balanced reciprocal super-cap structure.',
      },
    ];

    const finalEn = 'Except for breach of confidentiality obligations, gross negligence, or third-party intellectual property indemnification (which shall be subject to an aggregate super-cap of 200% of the total contract value), each party aggregate liability arising out of or related to this Agreement shall be strictly limited to 100% of the fees paid or payable by Buyer in the twelve (12) months preceding the incident.';
    
    const finalAr = 'باستثناء الإخلال بالتزامات السرية، أو الخطأ الجسيم، أو تعويضات الملكية الفكرية للغير (والتي تخضع لسقف خاص بنسبة 200% من إجمالي قيمة العقد)، تقتصر المسؤولية الإجمالية التراكمية لكل طرف ناشئة عن هذا العقد أو متعلقة به على 100% من الرسوم المدفوعة أو المستحقة الدفع من المشتري خلال الاثني عشر (12) شهراً السابقة للواقعة.';

    return {
      sessionId,
      clauseTopic: params.clauseTopic,
      jurisdiction: jur,
      totalTurns: 3,
      consensusScore: 94,
      status: 'CONSENSUS_REACHED',
      messages,
      finalSynthesizedClauseEn: finalEn,
      finalSynthesizedClauseAr: finalAr,
      keyTradeoffs: [
        { issue: 'General Liability Cap', resolution: 'Settled at 100% of trailing 12-month fees' },
        { issue: 'IP Indemnification', resolution: 'Ring-fenced under dedicated 200% super-cap' },
        { issue: 'Consequential Damages', resolution: 'Mutual waiver with statutory fraud carveouts' },
      ],
    };
  }
}

export const multiAgentNegotiationRoom = MultiAgentNegotiationRoom.getInstance();
