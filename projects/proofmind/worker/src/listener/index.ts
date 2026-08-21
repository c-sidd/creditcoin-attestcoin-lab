import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { JobStore, JobRecord } from "../persistence";
import { Logger } from "../logger";

export class EventListener {
  private provider: ethers.JsonRpcProvider;
  private jobStore: JobStore;
  private logger: Logger;
  private contractAddress: string;
  private chainKey: number;
  private lastBlockFile: string;

  private contract: ethers.Contract;
  private startBlock: number;

  constructor(
    provider: ethers.JsonRpcProvider,
    jobStore: JobStore,
    logger: Logger,
    contractAddress: string,
    chainKey: number,
    evidenceDir: string,
    defaultStartBlock = 0
  ) {
    this.provider = provider;
    this.jobStore = jobStore;
    this.logger = logger;
    this.contractAddress = contractAddress;
    this.chainKey = chainKey;
    this.lastBlockFile = path.join(evidenceDir, "last-scanned-block.json");
    this.startBlock = defaultStartBlock;

    // Load last scanned block if exists
    if (fs.existsSync(this.lastBlockFile)) {
      try {
        const data = fs.readFileSync(this.lastBlockFile, "utf-8");
        this.startBlock = JSON.parse(data).lastScannedBlock;
      } catch (err: any) {
        this.logger.warn(`Failed to parse last scanned block file: ${err.message}`);
      }
    }

    // SourceSignalEmitter ABI (only RiskSignalSubmitted event is needed for listening)
    const abi = [
      "event RiskSignalSubmitted(bytes32 indexed signalId, address indexed subject, uint256 signalValue, uint256 timestamp)"
    ];
    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }

  getLastScannedBlock(): number {
    return this.startBlock;
  }

  private saveLastScannedBlock(block: number): void {
    this.startBlock = block;
    try {
      const tempPath = `${this.lastBlockFile}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify({ lastScannedBlock: block }), "utf-8");
      fs.renameSync(tempPath, this.lastBlockFile);
    } catch (err: any) {
      this.logger.error(`Failed to save last scanned block: ${err.message}`);
    }
  }

  /**
   * Scan a block range for new events.
   * @param fromBlock Starting block height
   * @param toBlock Ending block height
   */
  async scanRange(fromBlock: number, toBlock: number): Promise<number> {
    this.logger.info(`Scanning block range ${fromBlock} to ${toBlock} for events...`);
    
    try {
      const filter = this.contract.filters.RiskSignalSubmitted();
      const logs = await this.contract.queryFilter(filter, fromBlock, toBlock);
      
      this.logger.info(`Discovered ${logs.length} RiskSignalSubmitted logs.`);

      let newJobsCount = 0;

      for (const log of logs) {
        // cast log as ethers.EventLog
        const eventLog = log as ethers.EventLog;
        if (!eventLog.args) continue;

        const [signalId, subject, signalValue, timestamp] = eventLog.args;

        const eventId = `${this.chainKey}-${eventLog.blockNumber}-${eventLog.transactionHash}-${eventLog.index}`;

        // Check for duplicate in jobStore
        if (this.jobStore.getJob(eventId)) {
          this.logger.debug(`Duplicate log detected, skipping job creation: ${eventId}`);
          continue;
        }

        const job: JobRecord = {
          id: signalId,
          event_id: eventId,
          chain_key: this.chainKey,
          contract_address: this.contractAddress,
          transaction_hash: eventLog.transactionHash,
          block_number: eventLog.blockNumber,
          log_index: eventLog.index,
          event_name: "RiskSignalSubmitted",
          encoded_data: JSON.stringify({
            signalId,
            subject,
            signalValue: signalValue.toString(),
            timestamp: timestamp.toString()
          }),
          status: "DETECTED",
          attempts: 0,
          created_at: Date.now(),
          updated_at: Date.now()
        };

        this.jobStore.saveJob(job);
        newJobsCount++;
        this.logger.info(`Discovered and created job for event: ${eventId}`);
      }

      this.saveLastScannedBlock(toBlock);
      return newJobsCount;
    } catch (error: any) {
      this.logger.error(`Failed to scan range ${fromBlock} to ${toBlock}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run a catch-up scan from the last scanned block up to current block height.
   */
  async catchUp(): Promise<void> {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = this.startBlock + 1;

      if (fromBlock > currentBlock) {
        this.logger.info("Already up to date. No catch-up required.");
        return;
      }

      await this.scanRange(fromBlock, currentBlock);
    } catch (err: any) {
      this.logger.error(`Catch-up scan failed: ${err.message}`);
      throw err;
    }
  }
}
