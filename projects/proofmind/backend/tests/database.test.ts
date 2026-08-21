import { expect } from "chai";
import { Database } from "../src/database/db";

describe("Database Foundation & Schema Tests", () => {
  let db: Database;

  beforeEach(async () => {
    // Use an in-memory SQLite database for fast isolated unit tests
    db = new Database(":memory:");
    await db.initialize();
  });

  afterEach(async () => {
    await db.close();
  });

  it("should initialize all required tables", async () => {
    const tables = await db.all<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    const tableNames = tables.map((t) => t.name);

    expect(tableNames).to.include("source_events");
    expect(tableNames).to.include("processing_jobs");
    expect(tableNames).to.include("proof_submissions");
    expect(tableNames).to.include("verification_records");
    expect(tableNames).to.include("ai_decisions");
    expect(tableNames).to.include("execution_records");
  });

  it("should enforce unique constraint on source_events", async () => {
    await db.run(
      `INSERT INTO source_events (id, chain_key, contract_address, tx_hash, block_number, log_index, event_name, decoded_payload, detected_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["ev_1", 1, "0xcontract", "0xtxhash", 100, 2, "RiskSignalSubmitted", "{}", "2026-08-22T00:00:00Z"]
    );

    // Attempting to insert a duplicate (chain_key, tx_hash, log_index) should fail
    try {
      await db.run(
        `INSERT INTO source_events (id, chain_key, contract_address, tx_hash, block_number, log_index, event_name, decoded_payload, detected_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ["ev_2", 1, "0xcontract", "0xtxhash", 100, 2, "RiskSignalSubmitted", "{}", "2026-08-22T00:01:00Z"]
      );
      throw new Error("Should have thrown unique constraint error");
    } catch (err: any) {
      expect(err.message).to.contain("UNIQUE constraint failed");
    }
  });

  it("should handle AI decision insertion and query lookup", async () => {
    const decision = {
      id: "dec_1",
      decision_id: "dec_proposal_1",
      evidence_ids: "ev_1",
      model_metadata: "mock-model-v1",
      structured_output: JSON.stringify({ decision: "ALLOW", score: 95 }),
      policy_status: "PASSED",
      created_at: new Date().toISOString(),
    };

    await db.run(
      `INSERT INTO ai_decisions (id, decision_id, evidence_ids, model_metadata, structured_output, policy_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [decision.id, decision.decision_id, decision.evidence_ids, decision.model_metadata, decision.structured_output, decision.policy_status, decision.created_at]
    );

    const retrieved = await db.get<any>("SELECT * FROM ai_decisions WHERE id = ?", [decision.id]);
    expect(retrieved).to.not.be.undefined;
    expect(retrieved.decision_id).to.equal(decision.decision_id);
    expect(JSON.parse(retrieved.structured_output)).to.have.property("decision", "ALLOW");
  });
});
