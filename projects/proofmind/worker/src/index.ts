import { validateConfig, reportConfig, Config } from "./config";
import { JobStore, JobRecord } from "./persistence";
import { ProofBuilderClient } from "./proof-builder";
import { Logger } from "./logger";
import { EventListener } from "./listener";
import { AttestationManager } from "./attestation";
import { ProofManager } from "./proof-manager";
import { SubmissionManager } from "./submission";
import { ethers } from "ethers";

export class ProofMindWorker {
  private config: Config;
  private logger: Logger;
  private jobStore: JobStore;
  private proofBuilder: ProofBuilderClient;
  private sourceProvider?: ethers.JsonRpcProvider;
  private creditcoinProvider?: ethers.JsonRpcProvider;
  private wallet?: ethers.Wallet;

  private listener?: EventListener;
  private attestationManager?: AttestationManager;
  private proofManager?: ProofManager;
  private submissionManager?: SubmissionManager;

  private isRunning = false;
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    this.config = validateConfig();
    this.logger = new Logger(this.config.logLevel);
    this.jobStore = new JobStore(this.config.evidenceDir);
    this.proofBuilder = new ProofBuilderClient(this.config.sourceChainKey, this.config.proofBuilderUrl);
  }

  async start(): Promise<void> {
    this.logger.info("Initializing ProofMind Offchain Worker...");
    reportConfig(this.config);

    // 1. Setup Providers and Wallet
    if (this.config.sepoliaRpcUrl) {
      this.sourceProvider = new ethers.JsonRpcProvider(this.config.sepoliaRpcUrl);
    }
    if (this.config.creditcoinRpcUrl) {
      this.creditcoinProvider = new ethers.JsonRpcProvider(this.config.creditcoinRpcUrl);
    }
    if (this.config.creditcoinPrivateKey && this.creditcoinProvider) {
      this.wallet = new ethers.Wallet(this.config.creditcoinPrivateKey, this.creditcoinProvider);
    }

    // 2. Initialize Managers
    if (this.sourceProvider && this.config.sourceContractAddress) {
      this.listener = new EventListener(
        this.sourceProvider,
        this.jobStore,
        this.logger,
        this.config.sourceContractAddress,
        this.config.sourceChainKey,
        this.config.evidenceDir
      );
    }

    this.attestationManager = new AttestationManager(
      this.jobStore,
      this.proofBuilder,
      this.logger,
      this.config.workerMaxRetries
    );

    this.proofManager = new ProofManager(
      this.jobStore,
      this.proofBuilder,
      this.logger,
      this.config.workerMaxRetries
    );

    if (this.wallet && this.config.ascContractAddress) {
      this.submissionManager = new SubmissionManager(
        this.jobStore,
        this.logger,
        this.wallet,
        this.config.ascContractAddress,
        this.config.workerMaxRetries
      );
    }

    this.isRunning = true;
    this.logger.info("ProofMind Worker started successfully.");

    // 3. Recovery Phase
    await this.recoverUnfinishedJobs();

    // 4. Start background processing loop
    this.loop();
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    this.logger.info("Graceful shutdown initiated...");
    this.isRunning = false;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Clean up providers
    if (this.sourceProvider) this.sourceProvider.destroy();
    if (this.creditcoinProvider) this.creditcoinProvider.destroy();

    this.logger.info("ProofMind Worker stopped.");
  }

  private async recoverUnfinishedJobs(): Promise<void> {
    const unfinished = this.jobStore.getUnfinishedJobs();
    this.logger.info(`Recovered ${unfinished.length} unfinished jobs on startup.`);
    for (const job of unfinished) {
      this.logger.info(`Resuming job ${job.event_id} in state ${job.status}`);
      // Process immediately on recovery
      this.processJobAsync(job);
    }
  }

  /**
   * Process a single job through its current state handler.
   */
  private async processJobAsync(job: JobRecord): Promise<void> {
    try {
      if (job.status === "DETECTED" || job.status === "WAITING_FOR_ATTESTATION" || job.status === "PROOF_RETRY") {
        if (this.attestationManager) {
          await this.attestationManager.processJob(job);
        }
      }
      
      // Refresh job state from store
      const updatedJob = this.jobStore.getJob(job.event_id);
      if (!updatedJob) return;

      if (updatedJob.status === "ATTESTED" || updatedJob.status === "PROOF_REQUESTED") {
        if (this.proofManager) {
          await this.proofManager.processJob(updatedJob);
        }
      }

      // Refresh job state again
      const finalJob = this.jobStore.getJob(job.event_id);
      if (!finalJob) return;

      if (finalJob.status === "PROOF_RECEIVED" || finalJob.status === "ASC_SUBMITTED") {
        if (this.submissionManager) {
          await this.submissionManager.processJob(finalJob);
        }
      }
    } catch (error: any) {
      this.logger.error(`Error processing job ${job.event_id}: ${error.message}`);
    }
  }

  private async loop(): Promise<void> {
    while (this.isRunning) {
      try {
        this.logger.debug("Worker heartbeat / polling check...");
        
        // 1. Run event discovery
        if (this.listener) {
          await this.listener.catchUp();
        }

        // 2. Load and process active jobs
        const activeJobs = this.jobStore.getUnfinishedJobs();
        for (const job of activeJobs) {
          await this.processJobAsync(job);
        }

        if (!this.isRunning) {
          break;
        }

        // Background listening or job checking interval
        await new Promise<void>((resolve) => {
          this.timer = setTimeout(() => {
            resolve();
          }, this.config.workerPollIntervalSeconds * 1000);
        });
      } catch (error: any) {
        this.logger.error(`Error in worker processing loop: ${error.message}`);
      }
    }
  }

  // Health report function
  getHealthReport() {
    return {
      status: this.isRunning ? "RUNNING" : "STOPPED",
      unfinishedJobsCount: this.jobStore.getUnfinishedJobs().length,
      allJobsCount: this.jobStore.getAllJobs().length,
      timestamp: new Date().toISOString(),
    };
  }
}

// Start worker if executed directly
if (require.main === module) {
  const worker = new ProofMindWorker();
  
  worker.start().catch((err) => {
    console.error("Worker failed to start:", err);
    process.exit(1);
  });

  const shutdown = async () => {
    await worker.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
