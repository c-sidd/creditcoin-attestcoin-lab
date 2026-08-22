import { VerifiedInputFact } from "./types";

export class VerifiedFactValidator {
  private allowedChainKeys: Set<number>;
  private maxAgeSeconds: number;

  constructor(allowedChainKeys = [1], maxAgeSeconds = 24 * 3600) {
    this.allowedChainKeys = new Set(allowedChainKeys);
    this.maxAgeSeconds = maxAgeSeconds;
  }

  /**
   * Validate a VerifiedInputFact. Throws an error on validation failure.
   */
  validate(fact: VerifiedInputFact): void {
    if (!fact) {
      throw new Error("Fact input is null or undefined");
    }

    // 1. Validate Source Chain
    if (!this.allowedChainKeys.has(fact.chainKey)) {
      throw new Error(`Unsupported source chain key: ${fact.chainKey}`);
    }

    // 2. Validate Block Number
    if (typeof fact.blockNumber !== "number" || fact.blockNumber <= 0) {
      throw new Error(`Invalid block number: ${fact.blockNumber}`);
    }

    // 3. Validate Transaction Hash Format
    if (
      typeof fact.transactionHash !== "string" ||
      !/^0x[a-fA-F0-9]{64}$/.test(fact.transactionHash)
    ) {
      throw new Error(`Invalid transaction hash format: ${fact.transactionHash}`);
    }

    // 4. Validate Contract Address Format
    if (
      typeof fact.contractAddress !== "string" ||
      !/^0x[a-fA-F0-9]{40}$/.test(fact.contractAddress)
    ) {
      throw new Error(`Invalid contract address format: ${fact.contractAddress}`);
    }

    // 5. Validate Event Type
    if (fact.eventName !== "RiskSignalSubmitted") {
      throw new Error(`Invalid event type: ${fact.eventName}. Expected RiskSignalSubmitted`);
    }

    // 6. Validate Subject Address
    if (
      typeof fact.subject !== "string" ||
      !/^0x[a-fA-F0-9]{40}$/.test(fact.subject)
    ) {
      throw new Error(`Invalid subject address format: ${fact.subject}`);
    }

    // 7. Validate Signal Value (BigInt representation check)
    if (
      typeof fact.signalValue !== "string" ||
      !/^\d+$/.test(fact.signalValue) ||
      BigInt(fact.signalValue) <= 0n
    ) {
      throw new Error(`Invalid signal value: ${fact.signalValue}. Must be a positive integer string`);
    }

    // 8. Freshness Check (Timestamps)
    const nowUnix = Math.floor(Date.now() / 1000);
    const factAge = nowUnix - fact.timestamp;
    if (factAge < 0) {
      throw new Error(`Future timestamp detected: ${fact.timestamp}`);
    }
    if (factAge > this.maxAgeSeconds) {
      throw new Error(`Stale evidence: fact is ${factAge} seconds old (limit: ${this.maxAgeSeconds}s)`);
    }
  }
}
