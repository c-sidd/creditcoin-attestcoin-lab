import { ethers } from "ethers";
import { Config } from "./config";
import { PersistenceManager, JobRecord, WorkerState } from "./persistence";
import { ProofBuilderClient } from "./proof-builder";

export class WorkerOrchestrator {
  private config: Config;
  private persistence: PersistenceManager;
  private proofBuilder: ProofBuilderClient;
  private creditcoinProvider: ethers.JsonRpcProvider;
  private creditcoinWallet: ethers.Wallet;
  private ascContract: ethers.Contract;

  constructor(config: Config, persistence: PersistenceManager) {
    this.config = config;
    this.persistence = persistence;
    this.proofBuilder = new ProofBuilderClient(config);
    this.creditcoinProvider = new ethers.JsonRpcProvider(config.creditcoinRpcUrl);
    this.creditcoinWallet = new ethers.Wallet(config.creditcoinPrivateKey, this.creditcoinProvider);

    const ascAbi = [
      "function verifyCrossChainEvent(uint64 chainKey, uint64 blockHeight, bytes calldata encodedTransaction, tuple(bytes32 root, tuple(bytes32 hash, bool isLeft)[] siblings) merkleProof, tuple(bytes32 lowerEndpointDigest, bytes32[] roots) continuityProof, bytes32 sourceTxHash) external returns (bytes32)"
    ];
    this.ascContract = new ethers.Contract(config.ascContractAddress, ascAbi, this.creditcoinWallet);
  }

  /**
   * Processes a single job record through the state machine.
   */
  async processJob(job: JobRecord) {
    try {
      console.log(`[Job ${job.id}] Processing in state ${job.status}`);

      if (job.status === WorkerState.DETECTED) {
        job.status = WorkerState.WAITING_FOR_ATTESTATION;
        this.persistence.saveJob(job);
      }

      if (job.status === WorkerState.WAITING_FOR_ATTESTATION) {
        // Fetch proof (internally waits for attestation)
        const proofPayload = await this.proofBuilder.getProofForTx(
          job.transactionHash,
          job.blockNumber,
          10 * 60 * 1000 // 10 minute timeout for testing
        );

        job.status = WorkerState.PROOF_RECEIVED;
        // Save proof payload reference in encodedData or record it
        job.encodedData = JSON.stringify(proofPayload);
        this.persistence.saveJob(job);
      }

      if (job.status === WorkerState.PROOF_RECEIVED) {
        const proofPayload = JSON.parse(job.encodedData);
        console.log(`[Job ${job.id}] Submitting proof payload to ASC contract...`);

        // Gas estimation fallback buffer
        const tx = await this.ascContract.verifyCrossChainEvent(
          proofPayload.chainKey,
          proofPayload.blockHeight,
          proofPayload.encodedTransaction,
          proofPayload.merkleProof,
          proofPayload.continuityProof,
          job.transactionHash,
          {
            gasLimit: 5000000 // High gas limit buffer for precompiles
          }
        );

        job.status = WorkerState.ASC_SUBMITTED;
        job.ascTxHash = tx.hash;
        this.persistence.saveJob(job);

        console.log(`[Job ${job.id}] ASC transaction submitted: ${tx.hash}. Waiting for receipt...`);
        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
          job.status = WorkerState.EXECUTED;
          this.persistence.saveJob(job);
          console.log(`[Job ${job.id}] Successfully executed and verified!`);
        } else {
          throw new Error("ASC transaction reverted.");
        }
      }
    } catch (err: any) {
      console.error(`[Job ${job.id}] Error processing:`, err.message);
      job.attempts++;
      job.lastError = err.message;
      
      if (job.attempts >= 5) {
        job.status = WorkerState.FAILED_FINAL;
      } else {
        job.status = WorkerState.FAILED_RETRYABLE;
      }
      this.persistence.saveJob(job);
    }
  }

  /**
   * Scans persistence database for incomplete jobs and processes them.
   */
  async processActiveJobs() {
    const jobs = this.persistence.getAllJobs();
    const activeJobs = jobs.filter(
      (j) =>
        j.status !== WorkerState.EXECUTED &&
        j.status !== WorkerState.FAILED_FINAL
    );

    console.log(`Found ${activeJobs.length} active jobs to process.`);

    for (const job of activeJobs) {
      await this.processJob(job);
    }
  }
}
