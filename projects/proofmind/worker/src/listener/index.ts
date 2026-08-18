import { ethers } from "ethers";
import { Config } from "../config";
import { PersistenceManager } from "../persistence";

export class EventListener {
  private config: Config;
  private persistence: PersistenceManager;
  private sourceProvider: ethers.JsonRpcProvider;
  private sourceContract: ethers.Contract;
  private lastProcessedBlockPath: string;

  constructor(config: Config, persistence: PersistenceManager, lastProcessedBlockPath: string) {
    this.config = config;
    this.persistence = persistence;
    this.sourceProvider = new ethers.JsonRpcProvider(config.sourceRpcUrl);
    this.lastProcessedBlockPath = lastProcessedBlockPath;

    const abi = [
      "event RiskSignalSubmitted(bytes32 indexed signalId, address indexed subject, uint256 signalValue, uint256 timestamp)"
    ];
    this.sourceContract = new ethers.Contract(config.sourceContractAddress, abi, this.sourceProvider);
  }

  private loadLastProcessedBlock(defaultBlock: number): number {
    try {
      if (require("fs").existsSync(this.lastProcessedBlockPath)) {
        const val = require("fs").readFileSync(this.lastProcessedBlockPath, "utf-8");
        return parseInt(val.trim(), 10);
      }
    } catch (err) {
      console.error("Error loading last processed block:", err);
    }
    return defaultBlock;
  }

  private saveLastProcessedBlock(blockNumber: number) {
    try {
      require("fs").writeFileSync(this.lastProcessedBlockPath, blockNumber.toString(), "utf-8");
    } catch (err) {
      console.error("Error saving last processed block:", err);
    }
  }

  /**
   * Scans a block range for RiskSignalSubmitted events and creates jobs.
   */
  async scanRange(fromBlock: number, toBlock: number) {
    console.log(`Scanning source chain block range: ${fromBlock} to ${toBlock}`);
    
    // queryFilter is robust and handles historical queries
    const filter = this.sourceContract.filters.RiskSignalSubmitted();
    const events = await this.sourceContract.queryFilter(filter, fromBlock, toBlock);

    console.log(`Found ${events.length} RiskSignalSubmitted events.`);

    for (const event of events) {
      if ("args" in event && event.args) {
        const log = event as ethers.EventLog;
        const signalId = log.args.signalId;
        const subject = log.args.subject;
        const signalValue = log.args.signalValue.toString();

        console.log(`Detected event signalId: ${signalId}, subject: ${subject}, value: ${signalValue}`);

        // Create job atomically (handles duplicate events via deterministic ID check)
        this.persistence.createJob(
          this.config.sourceChainKey,
          this.config.sourceContractAddress,
          log.transactionHash,
          log.blockNumber,
          log.index,
          "RiskSignalSubmitted",
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["bytes32", "address", "uint256"],
            [signalId, subject, log.args.signalValue]
          )
        );
      }
    }
  }

  /**
   * Starts polling loop to monitor new blocks.
   */
  async startPolling(startBlock: number) {
    let currentBlock = this.loadLastProcessedBlock(startBlock);
    console.log(`Starting event listener polling loop from block ${currentBlock}`);

    const poll = async () => {
      try {
        const latestBlock = await this.sourceProvider.getBlockNumber();
        if (latestBlock > currentBlock) {
          await this.scanRange(currentBlock + 1, latestBlock);
          currentBlock = latestBlock;
          this.saveLastProcessedBlock(currentBlock);
        }
      } catch (err) {
        console.error("Error in event listener polling loop:", err);
      }
      setTimeout(poll, 10000); // Poll every 10 seconds
    };

    poll();
  }
}
