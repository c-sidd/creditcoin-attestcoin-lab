import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

export class Database {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    // If it's a file path with sqlite:// prefix, strip it
    let cleanPath = dbPath;
    if (dbPath.startsWith("sqlite://")) {
      cleanPath = dbPath.replace("sqlite://", "");
    }
    
    if (cleanPath !== ":memory:") {
      cleanPath = path.resolve(cleanPath);
      const dir = path.dirname(cleanPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.db = new sqlite3.Database(cleanPath);
  }

  public async initialize(): Promise<void> {
    await this.exec(`
      CREATE TABLE IF NOT EXISTS source_events (
        id TEXT PRIMARY KEY,
        chain_key INTEGER,
        contract_address TEXT,
        tx_hash TEXT,
        block_number INTEGER,
        log_index INTEGER,
        event_name TEXT,
        decoded_payload TEXT,
        detected_at TEXT,
        UNIQUE (chain_key, tx_hash, log_index)
      );

      CREATE TABLE IF NOT EXISTS processing_jobs (
        id TEXT PRIMARY KEY,
        source_event_id TEXT UNIQUE,
        state TEXT,
        attempts INTEGER DEFAULT 0,
        next_retry_at TEXT,
        last_error_code TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (source_event_id) REFERENCES source_events(id)
      );

      CREATE TABLE IF NOT EXISTS proof_submissions (
        id TEXT PRIMARY KEY,
        source_event_id TEXT,
        request_reference TEXT,
        proof_metadata TEXT,
        proof_status TEXT,
        submitted_at TEXT,
        FOREIGN KEY (source_event_id) REFERENCES source_events(id)
      );

      CREATE TABLE IF NOT EXISTS verification_records (
        id TEXT PRIMARY KEY,
        source_event_id TEXT,
        asc_tx_hash TEXT,
        verification_status TEXT,
        verified_payload TEXT,
        verified_at TEXT,
        FOREIGN KEY (source_event_id) REFERENCES source_events(id)
      );

      CREATE TABLE IF NOT EXISTS ai_decisions (
        id TEXT PRIMARY KEY,
        decision_id TEXT,
        evidence_ids TEXT,
        model_metadata TEXT,
        structured_output TEXT,
        policy_status TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS execution_records (
        id TEXT PRIMARY KEY,
        decision_id TEXT,
        target_contract TEXT,
        intent_hash TEXT,
        tx_hash TEXT,
        execution_status TEXT,
        error_code TEXT,
        created_at TEXT,
        FOREIGN KEY (decision_id) REFERENCES ai_decisions(id)
      );

      CREATE INDEX IF NOT EXISTS idx_source_events_lookup ON source_events (chain_key, tx_hash, log_index);
      CREATE INDEX IF NOT EXISTS idx_processing_jobs_state ON processing_jobs (state);
      CREATE INDEX IF NOT EXISTS idx_ai_decisions_lookup ON ai_decisions (decision_id);
    `);
  }

  public run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  public get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  public all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  public exec(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
