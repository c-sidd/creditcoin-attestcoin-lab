import { AiRiskControls } from "../src/ai/risk-controls";
import { VerifiedInputFact, AiDecisionOutput } from "../src/ai/types";

describe("AiRiskControls Policy Enforcement Tests", () => {
  let riskControls: AiRiskControls;
  let fact: VerifiedInputFact;
  let recommendation: AiDecisionOutput;

  beforeEach(() => {
    riskControls = new AiRiskControls(100000n, 70, 50); // max 100k, threshold 70, gray zone start 50
    fact = {
      chainKey: 1,
      transactionHash: "0x" + "a".repeat(64),
      blockNumber: 123,
      contractAddress: "0x" + "b".repeat(40),
      eventName: "RiskSignalSubmitted",
      signalId: "0x" + "c".repeat(64),
      subject: "0x" + "d".repeat(40),
      signalValue: "10000",
      timestamp: Math.floor(Date.now() / 1000)
    };
    recommendation = {
      decision: "APPROVE",
      score: 30,
      action: "ALLOW_LOAN",
      amount: "10000",
      reasonCodes: ["OK"],
      expiresAt: Math.floor(Date.now() / 1000) + 1000
    };
  });

  it("should approve safe recommendation successfully", () => {
    const outcome = riskControls.evaluate(fact, recommendation);
    expect(outcome.admissible).toBe(true);
    expect(outcome.decision).toBe("APPROVE");
    expect(outcome.requiresManualReview).toBe(false);
  });

  it("should reject if amount exceeds limit", () => {
    recommendation.amount = "150000"; // exceeds 100k max limit
    const outcome = riskControls.evaluate(fact, recommendation);
    expect(outcome.admissible).toBe(false);
    expect(outcome.decision).toBe("REJECT");
    expect(outcome.reason).toContain("exceeds system maximum limit");
  });

  it("should reject if risk score exceeds threshold", () => {
    recommendation.score = 75; // exceeds threshold of 70
    const outcome = riskControls.evaluate(fact, recommendation);
    expect(outcome.admissible).toBe(false);
    expect(outcome.decision).toBe("REJECT");
    expect(outcome.reason).toContain("exceeds maximum threshold");
  });

  it("should approve but flag for manual review if score falls in gray zone", () => {
    recommendation.score = 60; // between 50 and 70
    const outcome = riskControls.evaluate(fact, recommendation);
    expect(outcome.admissible).toBe(true);
    expect(outcome.requiresManualReview).toBe(true);
    expect(outcome.reason).toContain("flagged for manual review");
  });

  it("should reject and flag review if suspicious injection data is present", () => {
    fact.signalId = "<script>alert(1)</script>";
    const outcome = riskControls.evaluate(fact, recommendation);
    expect(outcome.admissible).toBe(false);
    expect(outcome.requiresManualReview).toBe(true);
    expect(outcome.reason).toContain("Potential input injection detected");
  });
});
