/**
 * src/ai/policies/customPolicyEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Custom Enterprise AI Policy & Compliance Rules Engine
 * Specification: Task 13.4
 *
 * Enables institutional compliance officers to define custom organizational rules:
 *  • Custom Keyword / Clause Blacklists & Restrictions
 *  • Custom Disclaimer Injections
 *  • Jurisdiction Overrides & Mandatory Review Thresholds
 *  • Sovereign Data Protection Directives
 */

import type { JurisdictionCode } from '../types';

export interface CustomEnterprisePolicy {
  organizationId: string;
  policyName: string;
  enabled: boolean;
  blockedKeywords: string[];
  mandatoryDisclaimerEn?: string;
  mandatoryDisclaimerAr?: string;
  prohibitedJurisdictions: JurisdictionCode[];
  strictPIIMasking: boolean;
  forceHumanReviewForHighValue: boolean;
  highValueThresholdUSD: number; // e.g. contracts >= $100,000 USD
  customRules: Array<{
    id: string;
    name: string;
    pattern: string; // Regex pattern
    action: 'BLOCK' | 'FLAG_REVIEW' | 'INJECT_WARNING';
    messageEn: string;
    messageAr: string;
  }>;
}

export interface CustomPolicyEvaluation {
  allowed: boolean;
  flaggedForReview: boolean;
  warnings: Array<{ en: string; ar: string }>;
  injectedDisclaimerEn?: string;
  injectedDisclaimerAr?: string;
  violations: Array<{ ruleId: string; message: string }>;
}

class CustomPolicyEngine {
  private static instance: CustomPolicyEngine;
  private policies: Map<string, CustomEnterprisePolicy> = new Map();

  private constructor() {
    this.seedDefaultPolicy();
  }

  public static getInstance(): CustomPolicyEngine {
    if (!CustomPolicyEngine.instance) {
      CustomPolicyEngine.instance = new CustomPolicyEngine();
    }
    return CustomPolicyEngine.instance;
  }

  private seedDefaultPolicy(): void {
    const demoPolicy: CustomEnterprisePolicy = {
      organizationId: 'org_enterprise_demo_01',
      policyName: 'Al-Tamimi Global Corporate & M&A Governance Policy',
      enabled: true,
      blockedKeywords: ['unlimited liability without cap', 'perpetual non-compete worldwide'],
      mandatoryDisclaimerEn: 'NOTICE: This advisory has been generated under Al-Tamimi & Partners institutional AI protocol and requires signature by a Senior Partner before client submission.',
      mandatoryDisclaimerAr: 'إشعار: تمت صياغة هذه المشورة وفق بروتوكول الذكاء الاصطناعي لمجموعة التميمي وشركاه وتتطلب توقيع الشريك المسؤول قبل الاعتماد النهائي.',
      prohibitedJurisdictions: ['UNKNOWN'],
      strictPIIMasking: true,
      forceHumanReviewForHighValue: true,
      highValueThresholdUSD: 250000,
      customRules: [
        {
          id: 'rule_indemnity_no_cap',
          name: 'Unlimited Indemnity Prohibition',
          pattern: 'unlimited\\s+indemnif(y|ication)',
          action: 'FLAG_REVIEW',
          messageEn: 'Unlimited indemnification clause detected without liability cap.',
          messageAr: 'تم رصد بند تعويض غير مقيد دون سقف للمسؤولية.',
        },
      ],
    };

    this.policies.set(demoPolicy.organizationId, demoPolicy);
  }

  /**
   * Get policy for an organization
   */
  public getPolicy(organizationId: string): CustomEnterprisePolicy {
    let pol = this.policies.get(organizationId);
    if (!pol) {
      pol = {
        organizationId,
        policyName: 'Standard Enterprise Policy',
        enabled: true,
        blockedKeywords: [],
        prohibitedJurisdictions: [],
        strictPIIMasking: true,
        forceHumanReviewForHighValue: true,
        highValueThresholdUSD: 100000,
        customRules: [],
      };
      this.policies.set(organizationId, pol);
    }
    return pol;
  }

  /**
   * Save / Update custom policy
   */
  public savePolicy(policy: CustomEnterprisePolicy): CustomEnterprisePolicy {
    this.policies.set(policy.organizationId, policy);
    return policy;
  }

  /**
   * Evaluate a legal document or prompt against custom policies
   */
  public evaluateText(
    organizationId: string,
    text: string,
    context?: { estimatedValueUSD?: number; jurisdiction?: JurisdictionCode }
  ): CustomPolicyEvaluation {
    const policy = this.getPolicy(organizationId);
    if (!policy.enabled) {
      return { allowed: true, flaggedForReview: false, warnings: [], violations: [] };
    }

    const warnings: Array<{ en: string; ar: string }> = [];
    const violations: Array<{ ruleId: string; message: string }> = [];
    let flaggedForReview = false;
    let allowed = true;

    // Check prohibited jurisdiction
    if (context?.jurisdiction && policy.prohibitedJurisdictions.includes(context.jurisdiction)) {
      allowed = false;
      violations.push({
        ruleId: 'JURISDICTION_BLOCKED',
        message: `Jurisdiction '${context.jurisdiction}' is blocked by institutional policy.`,
      });
    }

    // Check high value threshold
    if (
      policy.forceHumanReviewForHighValue &&
      context?.estimatedValueUSD &&
      context.estimatedValueUSD >= policy.highValueThresholdUSD
    ) {
      flaggedForReview = true;
      warnings.push({
        en: `High-value matter ($${context.estimatedValueUSD.toLocaleString()} USD) exceeds threshold. Mandatory partner review activated.`,
        ar: `قيمة الصفقة ($${context.estimatedValueUSD.toLocaleString()} دولار) تتجاوز السقف المؤسسي، تم تفعيل المراجعة الإلزامية.`,
      });
    }

    // Check custom regex rules
    for (const rule of policy.customRules) {
      try {
        const regex = new RegExp(rule.pattern, 'i');
        if (regex.test(text)) {
          if (rule.action === 'BLOCK') {
            allowed = false;
            violations.push({ ruleId: rule.id, message: rule.messageEn });
          } else if (rule.action === 'FLAG_REVIEW') {
            flaggedForReview = true;
            warnings.push({ en: rule.messageEn, ar: rule.messageAr });
          } else {
            warnings.push({ en: rule.messageEn, ar: rule.messageAr });
          }
        }
      } catch {
        // Fallback for invalid regex pattern
      }
    }

    return {
      allowed,
      flaggedForReview,
      warnings,
      injectedDisclaimerEn: policy.mandatoryDisclaimerEn,
      injectedDisclaimerAr: policy.mandatoryDisclaimerAr,
      violations,
    };
  }

  public clear(): void {
    this.policies.clear();
  }
}

export const customPolicyEngine = CustomPolicyEngine.getInstance();
