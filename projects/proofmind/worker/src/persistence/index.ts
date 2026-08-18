import fs from "fs";
import path from "path";

export enum WorkerState {
  DETECTED = "DETECTED",
  WAITING_FOR_ATTESTATION = "WAITING_FOR_ATTESTATION",
  ATTESTED = "ATTESTED",
  PROOF_REQUESTED = "PROOF_REQUESTED",
  PROOF_RECEIVED = "PROOF_RECEIVED",
  ASC_SUBMITTED = "ASC_SUBMITTED",
  EXECUTED = "EXECUTED",
  FAILED_RETRYABLE = "FAILED_RETRYABLE",
  FAILED_FINAL = "FAILED_FINAL",
}

export interface JobRecord {
  id: string; // Deterministic event identity: chainKey_blockNumber_txHash_logIndex
  chainKey: number;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  logIndex: number;
  eventName: string;
  encodedData: string;
  status: WorkerState;
  attempts: number;
  lastError?: string;
  ascTxHash?: string;
  createdAt: string;
  updatedAt: string;
}

export class PersistenceManager {
  private dbPath: string;
  private jobs: Map<string, JobRecord> = new Map();

  constructor(dbPath: string) {
    this.dbPath = path.resolve(dbPath);
    this.load();
  }

  private load() {
    if (fs.existsSync(this.dbPath)) {
      try {
        const data = fs.readFileSync(this.dbPath, "utf-8");
        const parsed = JSON.parse(data);
        for (const job of parsed) {
          this.jobs.set(job.id, job);
        }
      } catch (err) {
        console.error("Error loading persistence database:", err);
      }
    }
  }

  private save() {
    try {
      const data = JSON.stringify(Array.from(this.jobs.values()), null, 2);
      // Write atomically using temporary file to prevent corruption
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, data, "utf-8");
      fs.renameSync(tempPath, this.dbPath);
    } catch (err) {
      console.error("Error saving persistence database:", err);
    }
  }

  public getJob(id: string): JobRecord | undefined {
    return this.jobs.get(id);
  }

  public getAllJobs(): JobRecord[] {
    return Array.from(this.jobs.values());
  }

  public saveJob(job: JobRecord) {
    const updated = {
      ...job,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(job.id, updated);
    this.save();
  }

  public createJob(
    chainKey: number,
    contractAddress: string,
    transactionHash: string,
    blockNumber: number,
    logIndex: number,
    eventName: string,
    encodedData: string
  ): JobRecord {
    const id = `${chainKey}_${blockNumber}_${transactionHash}_${logIndex}`;
    
    if (this.jobs.has(id)) {
      return this.jobs.get(id)!;
    }

    const job: JobRecord = {
      id,
      chainKey,
      contractAddress,
      transactionHash,
      blockNumber,
      logIndex,
      eventName,
      encodedData,
      status: WorkerState.DETECTED,
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.jobs.set(id, job);
    this.save();
    return job;
  }
}
