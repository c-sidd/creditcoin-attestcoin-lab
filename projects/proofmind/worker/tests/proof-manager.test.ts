import { ProofManager } from "../src/proof-manager";
import { JobStore, JobRecord } from "../src/persistence";
import { ProofBuilderClient } from "../src/proof-builder";
import { Logger } from "../src/logger";
import fs from "fs";
import path from "path";

// Mock ProofBuilderClient
const mockGetProof = jest.fn();

jest.mock("../src/proof-builder", () => {
  return {
    ProofBuilderClient: jest.fn().mockImplementation(() => {
      return {
        getProof: mockGetProof
      };
    })
  };
});

describe("ProofManager Tests", () => {
  const tempDir = path.join(__dirname, "../dist/test-proof-manager-evidence");
  let store: JobStore;
  let logger: Logger;
  let clientMock: any;
  let manager: ProofManager;

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    store = new JobStore(tempDir, "proof-manager-jobs.json");
    logger = new Logger("ERROR");

    clientMock = new ProofBuilderClient(1, "https://prover.cc3-testnet.creditcoin.network");
    manager = new ProofManager(store, clientMock, logger, 3);
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
      status: "ATTESTED",
      attempts: 0,
      created_at: Date.now(),
      updated_at: Date.now()
    };
  }

  it("should successfully fetch, validate, and transition to PROOF_RECEIVED", async () => {
    const mockProof = {
      chainKey: 1,
      headerNumber: 105,
      txBytes: "0xabcdef",
      merkleProof: { root: "0xroot", siblings: [] },
      continuityProof: { lowerEndpointDigest: "0xlower", roots: [] }
    };
    mockGetProof.mockResolvedValueOnce(mockProof);

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("PROOF_RECEIVED");
    expect(updated?.attempts).toBe(0);

    const data = JSON.parse(updated?.encoded_data || "{}");
    expect(data.proof).toBeDefined();
    expect(data.proof.txBytes).toBe("0xabcdef");
  });

  it("should fail validation if chainKey mismatches", async () => {
    const mockProof = {
      chainKey: 2, // mismatch
      headerNumber: 105,
      txBytes: "0xabcdef",
      merkleProof: { root: "0xroot", siblings: [] },
      continuityProof: { lowerEndpointDigest: "0xlower", roots: [] }
    };
    mockGetProof.mockResolvedValueOnce(mockProof);

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("PROOF_RETRY");
    expect(updated?.last_error).toContain("Chain key mismatch");
  });

  it("should fail validation if header height in proof is lower than event block", async () => {
    const mockProof = {
      chainKey: 1,
      headerNumber: 90, // lower than job block_number 100
      txBytes: "0xabcdef",
      merkleProof: { root: "0xroot", siblings: [] },
      continuityProof: { lowerEndpointDigest: "0xlower", roots: [] }
    };
    mockGetProof.mockResolvedValueOnce(mockProof);

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("PROOF_RETRY");
    expect(updated?.last_error).toContain("Block height mismatch");
  });
});
