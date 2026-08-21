import { ethers } from "ethers";
import { Database } from "../database/db";
import { PersistenceManager, JobRecord, WorkerState } from "../../../worker/src/persistence";
import { Config } from "../../../worker/src/config";

export class SyncService {
  private config: Config;
  private db: Database;

  constructor(config: Config, db: Database) {
    this.config = config;
    this.db = db;
  }

  /**
   * Synchronizes worker JSON jobs into relational SQLite tables.
   */
  async sync(): Promise<void> {
    // Resolve JSON path. In production, we'll use a file named "proofmind_jobs.json"
    const jsonDbPath = "proofmind_jobs.json";
    const manager = new PersistenceManager(jsonDbPath);
    const jobs = manager.getAllJobs();

    console.log(`[SyncService] Synchronizing ${jobs.length} jobs from JSON to SQLite...`);

    for (const job of jobs) {
      let signalId = ethers.zeroPadValue("0x00", 32);
      let subject = ethers.ZeroAddress;
      let signalValue = 0;

      // Try decoding the source event payload from encodedData
      try {
        if (job.encodedData && !job.encodedData.startsWith("{")) {
          const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
            ["bytes32", "address", "uint256"],
            job.encodedData
          );
          signalId = decoded[0];
          subject = decoded[1];
          signalValue = Number(decoded[2]);
        }
      } catch (err: any) {
        console.warn(`[SyncService] Failed to decode payload for job ${job.id}:`, err.message);
      }

      // If we don't have a valid signalId, use a fallback deterministic hash of job.id
      if (signalId === ethers.zeroPadValue("0x00", 32)) {
        signalId = ethers.keccak256(ethers.toUtf8Bytes(job.id));
      }

      // 1. Sync source_events
      await this.db.run(
        `INSERT OR IGNORE INTO source_events (id, chain_key, contract_address, tx_hash, block_number, log_index, event_name, decoded_payload, detected_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          signalId,
          job.chainKey,
          job.contractAddress,
          job.transactionHash,
          job.blockNumber,
          job.logIndex,
          job.eventName,
          JSON.stringify({ subject, signalValue }),
          job.createdAt
        ]
      );

      // 2. Sync processing_jobs
      await this.db.run(
        `INSERT OR REPLACE INTO processing_jobs (id, source_event_id, state, attempts, next_retry_at, last_error_code, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          job.id,
          signalId,
          job.status,
          job.attempts,
          new Date().toISOString(),
          job.lastError || null,
          job.createdAt,
          job.updatedAt
        ]
      );

      // 3. Sync verification_records if verified
      if (job.status === WorkerState.EXECUTED && job.ascTxHash) {
        await this.db.run(
          `INSERT OR REPLACE INTO verification_records (id, source_event_id, asc_tx_hash, verification_status, verified_payload, verified_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `ver_${signalId}`,
            signalId,
            job.ascTxHash,
            "VERIFIED",
            JSON.stringify({ verified: true, signalValue }),
            job.updatedAt
          ]
        );
      }
    }
  }
}
