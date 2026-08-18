import { callAI } from '../../lib/api';

export interface B2BProposalRequest {
  companyName: string;
  industry: string;
  teamSize: number;
  estimatedContractVolume: number;
  targetJurisdiction: string;
}

export interface HighTicketProposal {
  id: string;
  companyName: string;
  tier: 'Corporate Pro' | 'Enterprise Elite' | 'Global M&A Suite';
  recommendedPrice: number;
  proposalContent: string;
  estimatedAnnualSavings: string;
  createdAt: string;
}

export async function generateEnterpriseProposal(req: B2BProposalRequest, isRtl: boolean = true): Promise<HighTicketProposal> {
  const prompt = isRtl
    ? `صمم عرضاً استثمارياً وقانونياً مخصصاً (Custom High-Ticket B2B Proposal) لشركة كبرى بالمعلومات التالية:\nاسم الشركة: ${req.companyName}\nالقطاع: ${req.industry}\nعدد أعضاء الفريق القانوني: ${req.teamSize}\nعدد العقود الشهرية المتوقعة: ${req.estimatedContractVolume}\nالدولة والتشريع: ${req.targetJurisdiction}\n\nيجب أن يتضمن العرض:\n1. ملخص تنفيذي يوضح كيف توفر المنصة 80% من التكاليف التشغيلية.\n2. بنود الخطة المخصصة (Enterprise Elite Suite $2,500/month).\n3. جدول العائد على الاستثمار (ROI).\n4. ضمانات المطابقة التشريعية والسرية SSL 256-Bit.`
    : `Generate a custom High-Ticket B2B Proposal for an enterprise client with:\nCompany: ${req.companyName}\nIndustry: ${req.industry}\nTeam Size: ${req.teamSize}\nMonthly Contract Volume: ${req.estimatedContractVolume}\nJurisdiction: ${req.targetJurisdiction}\n\nInclude:\n1. Executive Summary showing 80% operational cost savings.\n2. Customized Enterprise Elite Suite ($2,500/month).\n3. ROI projection table.\n4. Strict 100% compliance & security guarantees.`;

  const result = await callAI(prompt);

  const price = req.estimatedContractVolume > 100 ? 4999 : req.estimatedContractVolume > 30 ? 2499 : 1299;
  const tier = price >= 4999 ? 'Global M&A Suite' : price >= 2499 ? 'Enterprise Elite' : 'Corporate Pro';

  return {
    id: `PROP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    companyName: req.companyName,
    tier,
    recommendedPrice: price,
    proposalContent: result,
    estimatedAnnualSavings: `$${(price * 12 * 3.5).toLocaleString()}`,
    createdAt: new Date().toISOString(),
  };
}
