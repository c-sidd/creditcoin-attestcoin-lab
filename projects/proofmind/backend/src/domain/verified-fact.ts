export type ChainName = "ethereum-sepolia" | "creditcoin-cc3-testnet";

export type EvidenceStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";

/**
 * A normalized evidence object consumed by deterministic risk logic and AI.
 * The object is only considered authoritative when status === VERIFIED and
 * proof metadata is present. Raw RPC responses must never be promoted here
 * without protocol verification.
 */
export interface VerifiedFact {
  factId: string;
  sourceChain: ChainName;
  sourceContract: string;
  sourceTransactionHash: string;
  sourceBlockNumber: number;
  sourceBlockHash?: string;
  eventName: string;
  subject: string;
  signalType: string;
  amount?: string;
  timestamp: number;
  metadataHash?: string;
  proof: {
    protocol: "attestcoin";
    proofId: string;
    attestationReference?: string;
    verifiedAt?: number;
  };
  status: EvidenceStatus;
}

export function isUsableVerifiedFact(fact: VerifiedFact): boolean {
  return fact.status === "VERIFIED"
    && fact.proof.protocol === "attestcoin"
    && fact.proof.proofId.length > 0
    && fact.sourceTransactionHash.length > 0
    && fact.sourceBlockNumber >= 0;
}
