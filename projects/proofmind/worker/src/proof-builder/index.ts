import { proofProvider } from "@gluwa/usc-sdk";

export interface ReadabilityProof {
  chainKey: number;
  headerNumber: number;
  txBytes: string;
  merkleProof: {
    root: string;
    siblings: Array<{ hash: string; isLeft: boolean }>;
  };
  continuityProof: {
    lowerEndpointDigest: string;
    roots: string[];
  };
}

export class ProofBuilderClient {
  private builder: any;
  private chainKey: number;

  constructor(chainKey: number, proofBuilderUrl: string) {
    if (!proofBuilderUrl) {
      throw new Error("Proof Builder URL is required");
    }
    this.chainKey = chainKey;
    this.builder = new proofProvider.service.ProofBuilder(chainKey, proofBuilderUrl);
  }

  /**
   * Wait for a block to be attested on Creditcoin.
   * @param blockNumber The block height on the source chain
   * @param timeoutMs Maximum time to wait in milliseconds (default 20 minutes)
   */
  async waitForAttestation(blockNumber: number, timeoutMs = 20 * 60 * 1000): Promise<void> {
    try {
      console.log(`Waiting for source block ${blockNumber} to be attested...`);
      // The SDK ProofBuilder has a built-in waitUntilHeightAttested or equivalent
      await this.builder.waitUntilHeightAttested(blockNumber);
      console.log(`Source block ${blockNumber} is attested.`);
    } catch (error: any) {
      throw new Error(`Failed waiting for attestation of block ${blockNumber}: ${error.message}`);
    }
  }

  /**
   * Fetch the readability proof for a source transaction hash.
   * @param txHash The transaction hash on the source chain
   */
  async getProof(txHash: string): Promise<ReadabilityProof> {
    if (!txHash || !txHash.startsWith("0x")) {
      throw new Error(`Invalid transaction hash: ${txHash}`);
    }

    try {
      console.log(`Fetching readability proof for transaction ${txHash}...`);
      const proof = await this.builder.getProof(txHash);

      if (!proof) {
        throw new Error("Proof Builder returned empty proof");
      }

      // Validate required fields in the response
      if (
        !proof.merkleProof ||
        !proof.continuityProof ||
        !proof.txBytes ||
        typeof proof.headerNumber === "undefined"
      ) {
        throw new Error("Proof response is missing required fields");
      }

      return {
        chainKey: this.chainKey,
        headerNumber: Number(proof.headerNumber),
        txBytes: proof.txBytes,
        merkleProof: {
          root: proof.merkleProof.root,
          siblings: proof.merkleProof.siblings.map((s: any) => ({
            hash: s.hash,
            isLeft: !!s.isLeft,
          })),
        },
        continuityProof: {
          lowerEndpointDigest: proof.continuityProof.lowerEndpointDigest,
          roots: proof.continuityProof.roots,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch proof for transaction ${txHash}: ${error.message}`);
    }
  }
}
