import { ethers } from "ethers";
import { JobStore, JobRecord } from "../persistence";
import { Logger } from "../logger";

export class SubmissionManager {
  private jobStore: JobStore;
  private logger: Logger;
  private wallet: ethers.Wallet;
  private contractAddress: string;
  private contract: ethers.Contract;
  private maxRetries: number;

  constructor(
    jobStore: JobStore,
    logger: Logger,
    wallet: ethers.Wallet,
    contractAddress: string,
    maxRetries = 5
  ) {
    this.jobStore = jobStore;
    this.logger = logger;
    this.wallet = wallet;
    this.contractAddress = contractAddress;
    const abi = [
      "function submitProof(uint64 chainKey, uint64 headerNumber, bytes calldata encodedTransaction, tuple(bytes32 root, tuple(bytes32 hash, bool isLeft)[] siblings) merkleProof, tuple(bytes32 lowerEndpointDigest, bytes32[] roots) continuityProof) external returns (bytes32)",
      "function verifiedFacts(bytes32) external view returns (uint64 chainKey, address subject, uint256 signalValue, uint256 timestamp, bool exists)"
    ];
    this.contract = new ethers.Contract(contractAddress, abi, wallet);
    this.maxRetries = maxRetries;
  }

  async processJob(job: JobRecord): Promise<void> {
    if (job.status !== "PROOF_RECEIVED" && job.status !== "ASC_SUBMITTED" && job.status !== "ASC_FAILED") {
      return;
    }

    this.logger.info(`Starting ASC submission for job ${job.event_id}...`);
    const parsedData = JSON.parse(job.encoded_data);
    const { signalId, proof } = parsedData;

    if (!proof) {
      this.logger.error(`Job ${job.event_id} is missing proof data!`);
      job.status = "ASC_FAILED";
      job.last_error = "Missing proof data in job";
      job.updated_at = Date.now();
      this.jobStore.saveJob(job);
      return;
    }

    const evidenceId = ethers.solidityPackedKeccak256(
      ["uint64", "bytes32"],
      [job.chain_key, signalId]
    );

    try {
      const [, , , , exists] = await this.contract.verifiedFacts(evidenceId);
      if (exists) {
        this.logger.info(`Fact ${evidenceId} already verified on-chain. Skipping submission.`);
        job.status = "EXECUTED";
        job.attempts = 0;
        job.updated_at = Date.now();
        this.jobStore.saveJob(job);
        return;
      }
    } catch (error: any) {
      this.logger.warn(`Failed to check on-chain status for ${evidenceId}: ${error.message}. Proceeding with submission...`);
    }

    job.status = "ASC_SUBMITTED";
    this.jobStore.saveJob(job);

    try {
      let gasLimit: bigint;
      try {
        const estimatedGas = await this.contract.submitProof.estimateGas(
          proof.chainKey,
          proof.headerNumber,
          proof.txBytes,
          proof.merkleProof,
          proof.continuityProof
        );
        gasLimit = (estimatedGas * 135n) / 100n;
      } catch (err: any) {
        this.logger.warn(`Gas estimation failed: ${err.message}. Using fallback gas limit.`);
        const continuityLength = BigInt(proof.continuityProof.roots.length);
        gasLimit = 21000n + continuityLength * 5000n + 150000n;
      }

      const tx = await this.contract.submitProof(
        proof.chainKey,
        proof.headerNumber,
        proof.txBytes,
        proof.merkleProof,
        proof.continuityProof,
        { gasLimit }
      );

      this.logger.info(`Transaction submitted: ${tx.hash}. Waiting for confirmation...`);
      const receipt = await tx.wait();
      if (receipt.status !== 1) {
        throw new Error(`Transaction reverted in tx ${tx.hash}`);
      }

      job.status = "EXECUTED";
      job.attempts = 0;
      job.updated_at = Date.now();
      this.jobStore.saveJob(job);
      this.logger.info(`Job ${job.event_id} successfully verified in tx ${tx.hash}`);
    } catch (error: any) {
      job.attempts++;
      job.last_error = error.message;
      job.updated_at = Date.now();

      if (job.attempts >= this.maxRetries) {
        job.status = "ASC_FAILED";
        this.logger.error(`Job ${job.event_id} failed ASC submission after max retries: ${error.message}`);
      } else {
        // PROOF_RECEIVED is the retryable state consumed by the worker loop.
        job.status = "PROOF_RECEIVED";
        this.logger.warn(`Job ${job.event_id} failed submission (attempt ${job.attempts}/${this.maxRetries}); retrying on next worker cycle: ${error.message}`);
      }
      this.jobStore.saveJob(job);
    }
  }
}
