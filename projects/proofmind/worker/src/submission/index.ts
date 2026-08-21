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

  /**
   * Process a job that has a proof and is ready for ASC submission.
   * @param job The job record
   */
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
      this.jobStore.saveJob(job);
      return;
    }

    // 1. Idempotency Check: Calculate evidenceId and check on-chain status
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

    // 2. Submit Transaction
    job.status = "ASC_SUBMITTED";
    this.jobStore.saveJob(job);

    try {
      // Estimate gas limit with a buffer (Attestcoin precompiles can make gas estimation unstable)
      let gasLimit;
      try {
        const estimatedGas = await this.contract.submitProof.estimateGas(
          proof.chainKey,
          proof.headerNumber,
          proof.txBytes,
          proof.merkleProof,
          proof.continuityProof
        );
        // Add 35% buffer
        gasLimit = (estimatedGas * 135n) / 100n;
      } catch (err: any) {
        this.logger.warn(`Gas estimation failed: ${err.message}. Using fallback gas limit.`);
        // Fallback gas calculation: 21000 + continuityLength * 5000 + 100000
        const continuityLength = BigInt(proof.continuityProof.roots.length);
        gasLimit = 21000n + continuityLength * 5000n + 150000n;
      }

      this.logger.info(`Submitting proof to ASC with gas limit: ${gasLimit}`);
      
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

      if (receipt.status === 1) {
        job.status = "EXECUTED";
        job.attempts = 0;
        this.logger.info(`Job ${job.event_id} successfully executed in tx ${tx.hash}`);
      } else {
        throw new Error(`Transaction reverted in tx ${tx.hash}`);
      }

      job.updated_at = Date.now();
      this.jobStore.saveJob(job);
    } catch (error: any) {
      job.attempts++;
      job.last_error = error.message;
      job.updated_at = Date.now();

      if (job.attempts >= this.maxRetries) {
        job.status = "ASC_FAILED";
        this.logger.error(`Job ${job.event_id} failed ASC submission after max retries: ${error.message}`);
      } else {
        job.status = "ASC_FAILED"; // In Prompt 17 we will specify retry-backoff, for now let's set state
        this.logger.warn(`Job ${job.event_id} failed submission (attempt ${job.attempts}/${this.maxRetries}): ${error.message}`);
      }
      this.jobStore.saveJob(job);
    }
  }
}
