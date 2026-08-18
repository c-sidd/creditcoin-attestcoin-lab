import { expect } from "chai";
import fs from "fs";
import path from "path";
import { PersistenceManager, WorkerState } from "../src/persistence";

describe("PersistenceManager", () => {
  const testDbPath = path.resolve(__dirname, "test-db.json");

  afterEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it("should create and retrieve a job record", () => {
    const manager = new PersistenceManager(testDbPath);
    
    const job = manager.createJob(
      1,
      "0xcontract",
      "0xtxhash",
      123,
      0,
      "RiskSignalSubmitted",
      "0xdata"
    );

    expect(job.status).to.equal(WorkerState.DETECTED);
    expect(job.attempts).to.equal(0);
    
    const retrieved = manager.getJob(job.id);
    expect(retrieved).to.not.be.undefined;
    expect(retrieved?.blockNumber).to.equal(123);
  });

  it("should update a job record and survive reloading database", () => {
    const manager1 = new PersistenceManager(testDbPath);
    
    const job = manager1.createJob(
      1,
      "0xcontract",
      "0xtxhash",
      123,
      0,
      "RiskSignalSubmitted",
      "0xdata"
    );

    job.status = WorkerState.ATTESTED;
    job.attempts = 2;
    manager1.saveJob(job);

    // Reload from file
    const manager2 = new PersistenceManager(testDbPath);
    const retrieved = manager2.getJob(job.id);
    
    expect(retrieved?.status).to.equal(WorkerState.ATTESTED);
    expect(retrieved?.attempts).to.equal(2);
  });
});
