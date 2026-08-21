import fs from "fs";
import path from "path";

export interface JobRecord {
  id: string; // Internal database UUID or event_id
  event_id: string; // deterministic source event identity: chainKey-blockNumber-txHash-logIndex
  chain_key: number;
  contract_address: string;
  transaction_hash: string;
  block_number: number;
  log_index: number;
  event_name: string;
  encoded_data: string; // JSON string of parameters
  status:
    | "DETECTED"
    | "WAITING_FOR_ATTESTATION"
    | "ATTESTED"
    | "PROOF_REQUESTED"
    | "PROOF_RETRY"
    | "PROOF_RECEIVED"
    | "ASC_SUBMITTED"
    | "EXECUTED"
    | "ASC_FAILED";
  attempts: number;
  last_error?: string;
  created_at: number;
  updated_at: number;
}

export class JobStore {
  private filePath: string;
  private jobs: Map<string, JobRecord> = new Map();

  constructor(storageDir: string, filename = "jobs.json") {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    this.filePath = path.join(storageDir, filename);
    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.filePath)) {
      try {
        const data = fs.readFileSync(this.filePath, "utf-8");
        const list: JobRecord[] = JSON.parse(data);
        for (const job of list) {
          this.jobs.set(job.event_id, job);
        }
      } catch (error) {
        console.error(`Failed to parse job store file, starting clean: ${error}`);
      }
    }
  }

  private save(): void {
    const list = Array.from(this.jobs.values());
    const tempPath = `${this.filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(list, null, 2), "utf-8");
    fs.renameSync(tempPath, this.filePath); // Atomic rename
  }

  getJob(eventId: string): JobRecord | undefined {
    return this.jobs.get(eventId);
  }

  saveJob(job: JobRecord): void {
    this.jobs.set(job.event_id, job);
    this.save();
  }

  getUnfinishedJobs(): JobRecord[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status !== "EXECUTED" && job.status !== "ASC_FAILED"
    );
  }

  getAllJobs(): JobRecord[] {
    return Array.from(this.jobs.values());
  }

  clear(): void {
    this.jobs.clear();
    this.save();
  }
}
