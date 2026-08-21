import { JobStore, JobRecord } from "../persistence";
import { ProofBuilderClient } from "../proof-builder";
import { Logger } from "../logger";

export class AttestationManager {
  private jobStore: JobStore;
  private proofBuilder: ProofBuilderClient;
  private logger: Logger;
  private maxRetries: number;
  private backoffSeconds: number;

  constructor(
    jobStore: JobStore,
    proofBuilder: ProofBuilderClient,
    logger: Logger,
    maxRetries = 5,
    backoffSeconds = 5
  ) {
    this.jobStore = jobStore;
    this.proofBuilder = proofBuilder;
    this.logger = logger;
    this.maxRetries = maxRetries;
    this.backoffSeconds = backoffSeconds;
  }

  /**
   * Process a job that is waiting for block attestation.
   * @param job The job record
   */
  async processJob(job: JobRecord): Promise<void> {
    if (job.status !== "DETECTED" && job.status !== "WAITING_FOR_ATTESTATION" && job.status !== "PROOF_RETRY") {
      return;
    }

    this.logger.info(`Starting attestation check for job ${job.event_id} (block ${job.block_number})...`);

    // Update status to WAITING_FOR_ATTESTATION
    job.status = "WAITING_FOR_ATTESTATION";
    job.updated_at = Date.now();
    this.jobStore.saveJob(job);

    try {
      // Perform the wait (defaults to timeout defined in ProofBuilderClient)
      // For unit tests, we've mocked this call.
      await this.proofBuilder.waitForAttestation(job.block_number);

      // Transition to ATTESTED on success
      job.status = "ATTESTED";
      job.attempts = 0; // reset attempts for next stage
      job.updated_at = Date.now();
      this.jobStore.saveJob(job);
      this.logger.info(`Job ${job.event_id} is now ATTESTED.`);
    } catch (error: any) {
      job.attempts++;
      job.last_error = error.message;
      job.updated_at = Date.now();

      if (job.attempts >= this.maxRetries) {
        job.status = "ASC_FAILED"; // Permanent failure for this stage
        this.logger.error(`Job ${job.event_id} failed attestation after max retries: ${error.message}`);
      } else {
        job.status = "PROOF_RETRY";
        this.logger.warn(`Job ${job.event_id} failed attestation check (attempt ${job.attempts}/${this.maxRetries}). Retrying...`);
      }
      this.jobStore.saveJob(job);
    }
  }
}
