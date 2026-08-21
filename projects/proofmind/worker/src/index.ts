import { validateConfig, reportConfig, Config } from "./config";
import { JobStore, JobRecord } from "./persistence";
import { ProofBuilderClient } from "./proof-builder";
import { Logger } from "./logger";
import { ethers } from "ethers";

export class ProofMindWorker {
  private config: Config;
  private logger: Logger;
  private jobStore: JobStore;
  private proofBuilder: ProofBuilderClient;
  private sourceProvider!: ethers.JsonRpcProvider;
  private creditcoinProvider!: ethers.JsonRpcProvider;

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

    // Setup providers (only if RPC URLs are configured, otherwise fall back to mock setups for testing)
    if (this.config.sepoliaRpcUrl) {
      this.sourceProvider = new ethers.JsonRpcProvider(this.config.sepoliaRpcUrl);
    }
    if (this.config.creditcoinRpcUrl) {
      this.creditcoinProvider = new ethers.JsonRpcProvider(this.config.creditcoinRpcUrl);
    }

    this.isRunning = true;
    this.logger.info("ProofMind Worker started successfully.");

    // Recovery Phase
    await this.recoverUnfinishedJobs();

    // Start background processing loop
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
      // In subsequent prompts we will implement the resume handler for each state.
    }
  }

  private async loop(): Promise<void> {
    while (this.isRunning) {
      try {
        this.logger.debug("Worker heartbeat / polling check...");
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
