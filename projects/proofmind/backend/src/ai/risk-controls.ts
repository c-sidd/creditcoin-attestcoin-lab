import { AiDecisionOutput, VerifiedInputFact } from "./types";

export interface PolicyDecision {
  admissible: boolean;
  decision: "APPROVE" | "REJECT";
  action: "ALLOW_LOAN" | "BLOCK";
  amount: string;
  reason: string;
  requiresManualReview: boolean;
}

export class AiRiskControls {
  private maxAllowedAmount: bigint;
  private maxRiskThreshold: number;
  private reviewZoneMin: number;

  constructor(maxAllowedAmount = 1000000n, maxRiskThreshold = 70, reviewZoneMin = 50) {
    this.maxAllowedAmount = maxAllowedAmount;
    this.maxRiskThreshold = maxRiskThreshold;
    this.reviewZoneMin = reviewZoneMin;
  }

  /**
   * Apply deterministic risk policies on top of the AI model's recommendation.
   */
  evaluate(fact: VerifiedInputFact, recommendation: AiDecisionOutput): PolicyDecision {
    const amount = BigInt(recommendation.amount);

    // 1. Sanitization & Safety checks (guarding against injection/unusual data)
    if (fact.signalId.includes("<script>") || fact.subject.includes("select ") || fact.signalValue.includes("\n")) {
      return {
        admissible: false,
        decision: "REJECT",
        action: "BLOCK",
        amount: "0",
        reason: "Security validation failed: Potential input injection detected",
        requiresManualReview: true
      };
    }

    // 2. Hard Numeric Bounds
    if (amount > this.maxAllowedAmount) {
      return {
        admissible: false,
        decision: "REJECT",
        action: "BLOCK",
        amount: "0",
        reason: `Requested amount exceeds system maximum limit of ${this.maxAllowedAmount.toString()}`,
        requiresManualReview: false
      };
    }

    // 3. Score Threshold Validation
    if (recommendation.score > this.maxRiskThreshold) {
      return {
        admissible: false,
        decision: "REJECT",
        action: "BLOCK",
        amount: "0",
        reason: `Risk score (${recommendation.score}) exceeds maximum threshold (${this.maxRiskThreshold})`,
        requiresManualReview: false
      };
    }

    // 4. Gray Zone / Manual Review Trigger
    const isGrayZone = recommendation.score >= this.reviewZoneMin && recommendation.score <= this.maxRiskThreshold;
    
    if (recommendation.decision === "APPROVE" && isGrayZone) {
      return {
        admissible: true,
        decision: "APPROVE",
        action: "ALLOW_LOAN",
        amount: recommendation.amount,
        reason: "Approved, but flagged for manual review due to elevated risk score",
        requiresManualReview: true
      };
    }

    return {
      admissible: recommendation.decision === "APPROVE",
      decision: recommendation.decision,
      action: recommendation.action,
      amount: recommendation.amount,
      reason: recommendation.decision === "APPROVE" ? "Approved by policy decision engine" : "Rejected by AI model suggestion",
      requiresManualReview: false
    };
  }
}
