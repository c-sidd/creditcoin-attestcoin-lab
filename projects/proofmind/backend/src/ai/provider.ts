export interface AIDecisionInput {
  evidenceId: string;
  subject: string;
  signalValue: number;
  timestamp: number;
}

export interface AIDecisionOutput {
  decision: "ALLOW" | "REJECT" | "REVIEW";
  score: number;
  action: "APPROVE_LIMIT" | "NO_ACTION" | "FLAG_REVIEW";
  limit: string; // uint256 string
  reasoning_summary: string;
  modelVersion: string;
  expiresAt: number; // Unix timestamp
}

export interface AIProvider {
  generateDecision(input: AIDecisionInput): Promise<AIDecisionOutput>;
}
