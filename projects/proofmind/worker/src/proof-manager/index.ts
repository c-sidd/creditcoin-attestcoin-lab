import { JobStore, JobRecord } from "../persistence";
import { ProofBuilderClient, ReadabilityProof } from "../proof-builder";
import { Logger } from "../logger";

export class ProofManager {
  private jobStore: JobStore;
  private proofBuilder: ProofBuilderClient;
  private logger: Logger;
  private maxRetries: number;

  constructor(
    jobStore: JobStore,
    proofBuilder: ProofBuilderClient,
    logger: Logger,
    maxRetries = 5
  ) {
    this.jobStore = jobStore;
    this.proofBuilder = proofBuilder;
    this.logger = logger;
    this.maxRetries = maxRetries;
  }

  /**
   * Process a job that is ready for proof generation.
   * @param job The job record
   */
  async processJob(job: JobRecord): Promise<void> {
    if (job.status !== "ATTESTED" && job.status !== "PROOF_REQUESTED" && job.status !== "PROOF_RETRY") {
      return;
    }

    this.logger.info(`Requesting proof for transaction ${job.transaction_hash} (job ${job.event_id})...`);

    // Transition to PROOF_REQUESTED
    job.status = "PROOF_REQUESTED";
    job.updated_at = Date.now();
    this.jobStore.saveJob(job);

    try {
      const proof: ReadabilityProof = await this.proofBuilder.getProof(job.transaction_hash);

      // Validate transaction/block identity in proof matches the job details
      if (proof.chainKey !== job.chain_key) {
        throw new Error(`Chain key mismatch: expected ${job.chain_key}, got ${proof.chainKey}`);
      }

      if (proof.headerNumber < job.block_number) {
        throw new Error(`Block height mismatch: proof header height ${proof.headerNumber} is lower than event block ${job.block_number}`);
      }

      // Store the proof data in encoded_data along with the original event details
      const parsedData = JSON.parse(job.encoded_data);
      const updatedData = {
        ...parsedData,
        proof
      };

      job.encoded_data = JSON.stringify(updatedData);
      job.status = "PROOF_RECEIVED";
      job.attempts = 0; // reset attempts for next stage
      job.updated_at = Date.now();
      
      this.jobStore.saveJob(job);
      this.logger.info(`Successfully retrieved and validated proof for job: ${job.event_id}`);
    } catch (error: any) {
      job.attempts++;
      job.last_error = error.message;
      job.updated_at = Date.now();

      if (job.attempts >= this.maxRetries) {
        job.status = "ASC_FAILED";
        this.logger.error(`Job ${job.event_id} failed proof generation after max retries: ${error.message}`);
      } else {
        job.status = "PROOF_RETRY";
        this.logger.warn(`Job ${job.event_id} failed proof generation (attempt ${job.attempts}/${this.maxRetries}). Retrying...`);
      }
      this.jobStore.saveJob(job);
    }
  }
}
