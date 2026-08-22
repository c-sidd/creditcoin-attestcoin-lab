export interface VerifiedInputFact {
  chainKey: number;
  transactionHash: string;
  blockNumber: number;
  contractAddress: string;
  eventName: string;
  signalId: string;
  subject: string;
  signalValue: string; // big integer string representing amount
  timestamp: number;
}

export interface AiDecisionOutput {
  decision: "APPROVE" | "REJECT";
  score: number; // 0-100 risk score
  action: "ALLOW_LOAN" | "BLOCK";
  amount: string; // bigint string
  reasonCodes: string[];
  expiresAt: number; // unix timestamp
}
