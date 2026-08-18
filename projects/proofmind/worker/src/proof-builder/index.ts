import { proofProvider, chainInfo } from "@gluwa/usc-sdk";
import { ethers } from "ethers";
import { Config } from "../config";

export interface ProofPayload {
  chainKey: number;
  blockHeight: number;
  encodedTransaction: string;
  merkleProof: {
    root: string;
    siblings: { hash: string; isLeft: boolean }[];
  };
  continuityProof: {
    lowerEndpointDigest: string;
    roots: string[];
  };
}

export class ProofBuilderClient {
  private config: Config;
  private proofBuilder: any;
  private chainInfoProvider: any;

  constructor(config: Config) {
    this.config = config;
    const provider = new ethers.JsonRpcProvider(config.creditcoinRpcUrl);
    
    // Instantiate SDK services
    this.proofBuilder = new proofProvider.service.ProofBuilder(
      config.sourceChainKey,
      config.proofBuilderUrl
    );
    this.chainInfoProvider = new chainInfo.PrecompileChainInfoProvider(
      provider
    );
  }

  /**
   * Waits for block attestation on Creditcoin, then requests Merkle + continuity proofs.
   * @param txHash The transaction hash on the source chain.
   * @param sourceBlockNumber The block number of the source transaction.
   * @param timeoutMs Maximum wait time (default 20 minutes).
   */
  async getProofForTx(
    txHash: string,
    sourceBlockNumber: number,
    timeoutMs = 20 * 60 * 1000
  ): Promise<ProofPayload> {
    const pollInterval = 15000; // 15 seconds
    const start = Date.now();

    console.log(`Waiting for source block ${sourceBlockNumber} to be attested on Creditcoin...`);

    while (Date.now() - start < timeoutMs) {
      try {
        const { height } = await this.chainInfoProvider.getLatestAttestedHeightAndHash(
          this.config.sourceChainKey
        );
        
        console.log(`Latest attested source height: ${height}. Required height: ${sourceBlockNumber}`);

        if (height >= sourceBlockNumber) {
          console.log("Source block has been attested! Requesting proof from Proof Builder...");
          
          // Request proof from SDK
          const proof = await this.proofBuilder.getProof(txHash);

          // Map SDK response structure to ASC contract parameters
          return {
            chainKey: this.config.sourceChainKey,
            blockHeight: Number(proof.headerNumber),
            encodedTransaction: proof.txBytes,
            merkleProof: {
              root: proof.merkleProof.root,
              siblings: proof.merkleProof.siblings.map((s: any) => ({
                hash: s.hash,
                isLeft: s.isLeft,
              })),
            },
            continuityProof: {
              lowerEndpointDigest: proof.continuityProof.lowerEndpointDigest,
              roots: proof.continuityProof.roots,
            },
          };
        }
      } catch (err) {
        console.warn("Error checking attestation status or fetching proof, retrying:", err);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Timeout waiting for block ${sourceBlockNumber} to be attested.`);
  }
}
