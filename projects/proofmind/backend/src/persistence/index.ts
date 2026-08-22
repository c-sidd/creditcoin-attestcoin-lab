import fs from "fs";
import path from "path";

export interface JobRecord {
  id: string;
  event_id: string;
  chain_key: number;
  contract_address: string;
  transaction_hash: string;
  block_number: number;
  log_index: number;
  event_name: string;
  encoded_data: string;
  status: string;
  attempts: number;
  last_error?: string;
  created_at: number;
  updated_at: number;
}

export class BackendJobStore {
  private filePath: string;

  constructor(evidenceDir: string, filename = "jobs.json") {
    this.filePath = path.join(evidenceDir, filename);
  }

  getAllJobs(): JobRecord[] {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to read jobs file: ${error}`);
      return [];
    }
  }

  getJob(eventId: string): JobRecord | undefined {
    const jobs = this.getAllJobs();
    return jobs.find((job) => job.event_id === eventId);
  }
}
