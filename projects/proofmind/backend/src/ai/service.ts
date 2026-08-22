import { AiProvider } from "./provider";
import { VerifiedInputFact, AiDecisionOutput } from "./types";

export class AiDecisionService {
  private provider: AiProvider;
  private timeoutMs: number;

  constructor(provider: AiProvider, timeoutMs = 5000) {
    this.provider = provider;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Request a policy decision from the AI provider with timeout and validation.
   */
  async requestDecision(fact: VerifiedInputFact): Promise<AiDecisionOutput> {
    console.log(`[AI SERVICE] Requesting decision for fact signalId: ${fact.signalId}`);

    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("AI Provider request timed out")), this.timeoutMs);
    });

    try {
      const response = await Promise.race([this.provider.getDecision(fact), timeoutPromise]);
      this.validateResponse(response);
      return response;
    } finally {
      clearTimeout(timeoutId!);
    }
  }

  private validateResponse(res: any): void {
    if (!res) {
      throw new Error("AI provider returned empty response");
    }

    // Validate decision enum
    if (res.decision !== "APPROVE" && res.decision !== "REJECT") {
      throw new Error(`Invalid decision value: ${res.decision}`);
    }

    // Validate action enum
    if (res.action !== "ALLOW_LOAN" && res.action !== "BLOCK") {
      throw new Error(`Invalid action value: ${res.action}`);
    }

    // Validate risk score range
    if (typeof res.score !== "number" || res.score < 0 || res.score > 100) {
      throw new Error(`Invalid score: ${res.score}. Must be number between 0 and 100`);
    }

    // Validate amount is integer string, not float, and not empty
    if (typeof res.amount !== "string" || !/^\d+$/.test(res.amount)) {
      throw new Error(`Invalid amount representation: ${res.amount}. Must be integer string`);
    }

    // Validate expiry is in the future
    const nowUnix = Math.floor(Date.now() / 1000);
    if (typeof res.expiresAt !== "number" || res.expiresAt <= nowUnix) {
      throw new Error(`Invalid expiresAt: ${res.expiresAt}. Must be in the future`);
    }

    // Validate reason codes exist
    if (!Array.isArray(res.reasonCodes) || res.reasonCodes.length === 0) {
      throw new Error("Reason codes must be a non-empty array");
    }
  }
}
