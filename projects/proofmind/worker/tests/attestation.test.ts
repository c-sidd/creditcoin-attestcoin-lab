import { AttestationManager } from "../src/attestation";
import { JobStore, JobRecord } from "../src/persistence";
import { ProofBuilderClient } from "../src/proof-builder";
import { Logger } from "../src/logger";
import fs from "fs";
import path from "path";

// Mock ProofBuilderClient
const mockWaitForAttestation = jest.fn();

jest.mock("../src/proof-builder", () => {
  return {
    ProofBuilderClient: jest.fn().mockImplementation(() => {
      return {
        waitForAttestation: mockWaitForAttestation
      };
    })
  };
});

describe("AttestationManager Tests", () => {
  const tempDir = path.join(__dirname, "../dist/test-attestation-evidence");
  let store: JobStore;
  let logger: Logger;
  let clientMock: any;
  let manager: AttestationManager;

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    store = new JobStore(tempDir, "attestation-jobs.json");
    logger = new Logger("ERROR");

    clientMock = new ProofBuilderClient(1, "https://prover.cc3-testnet.creditcoin.network");
    manager = new AttestationManager(store, clientMock, logger, 3, 1);
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  function createTestJob(): JobRecord {
    return {
      id: "signal-id",
      event_id: "1-100-0xhash-0",
      chain_key: 1,
      contract_address: "0xsource",
      transaction_hash: "0xhash",
      block_number: 100,
      log_index: 0,
      event_name: "RiskSignalSubmitted",
      encoded_data: "{}",
      status: "DETECTED",
      attempts: 0,
      created_at: Date.now(),
      updated_at: Date.now()
    };
  }

  it("should transition from DETECTED to ATTESTED on successful attestation wait", async () => {
    mockWaitForAttestation.mockResolvedValueOnce(undefined);

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("ATTESTED");
    expect(updated?.attempts).toBe(0);
  });

  it("should increment attempts and transition to PROOF_RETRY on temporary failure", async () => {
    mockWaitForAttestation.mockRejectedValueOnce(new Error("Timeout waiting for block"));

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("PROOF_RETRY");
    expect(updated?.attempts).toBe(1);
    expect(updated?.last_error).toBe("Timeout waiting for block");
  });

  it("should transition to ASC_FAILED when max retries are exceeded", async () => {
    mockWaitForAttestation.mockRejectedValue(new Error("Network Error"));

    const job = createTestJob();
    store.saveJob(job);

    // Run through 3 retries (maxRetries = 3)
    await manager.processJob(job); // attempt 1 -> PROOF_RETRY
    await manager.processJob(job); // attempt 2 -> PROOF_RETRY
    await manager.processJob(job); // attempt 3 -> ASC_FAILED

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("ASC_FAILED");
    expect(updated?.attempts).toBe(3);
  });
});
