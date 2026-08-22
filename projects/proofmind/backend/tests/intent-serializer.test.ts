import { IntentSerializer } from "../src/ai/intent-serializer";
import { PolicyDecision } from "../src/ai/risk-controls";
import { ethers } from "ethers";

describe("IntentSerializer Tests", () => {
  let serializer: IntentSerializer;
  const contractAddress = "0x" + "a".repeat(40);
  const dummyEvidenceId = "0x" + "b".repeat(64);

  beforeEach(() => {
    serializer = new IntentSerializer(contractAddress);
  });

  it("should successfully serialize an approved policy decision", () => {
    const policy: PolicyDecision = {
      admissible: true,
      decision: "APPROVE",
      action: "ALLOW_LOAN",
      amount: "50000",
      reason: "Approved",
      requiresManualReview: false
    };

    const intent = serializer.serialize(dummyEvidenceId, policy);
    expect(intent.to).toBe(contractAddress);
    expect(intent.args.evidenceId).toBe(dummyEvidenceId);
    expect(intent.args.decisionVal).toBe(1); // Approved
    expect(intent.args.proposedLimit).toBe("50000");
    expect(intent.data).toBeDefined();
    expect(intent.data.startsWith("0x")).toBe(true);
  });

  it("should throw error when serializing inadmissible policy decisions", () => {
    const policy: PolicyDecision = {
      admissible: false, // inadmissible
      decision: "REJECT",
      action: "BLOCK",
      amount: "0",
      reason: "Rejected by risk controls",
      requiresManualReview: false
    };

    expect(() => serializer.serialize(dummyEvidenceId, policy)).toThrow(
      "Cannot serialize inadmissible policy decisions"
    );
  });

  it("should throw error when evidenceId is malformed", () => {
    const policy: PolicyDecision = {
      admissible: true,
      decision: "APPROVE",
      action: "ALLOW_LOAN",
      amount: "50000",
      reason: "Approved",
      requiresManualReview: false
    };

    expect(() => serializer.serialize("invalid-id", policy)).toThrow("Invalid evidence ID");
  });
});
