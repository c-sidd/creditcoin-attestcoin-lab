import { SubmissionManager } from "../src/submission";
import { JobStore, JobRecord } from "../src/persistence";
import { Logger } from "../src/logger";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// Mock contract methods
const mockVerifiedFacts = jest.fn();
const mockSubmitProof = jest.fn();
const mockEstimateGasSubmitProof = jest.fn();

jest.mock("ethers", () => {
  const original = jest.requireActual("ethers");
  
  // Custom mock contract
  class MockContract {
    verifiedFacts = mockVerifiedFacts;
    submitProof = Object.assign(mockSubmitProof, {
      estimateGas: mockEstimateGasSubmitProof
    });
    constructor() {}
  }

  return {
    ...original,
    ethers: {
      ...original.ethers,
      Contract: MockContract
    }
  };
});

describe("SubmissionManager Tests", () => {
  const tempDir = path.join(__dirname, "../dist/test-submission-evidence");
  let store: JobStore;
  let logger: Logger;
  let walletMock: any;
  let manager: SubmissionManager;

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    store = new JobStore(tempDir, "submission-jobs.json");
    logger = new Logger("ERROR");

    // Dummy wallet using zero key
    const actualEthers = jest.requireActual("ethers");
    walletMock = new actualEthers.Wallet(
      "0x0123456789012345678901234567890123456789012345678901234567890123"
    );

    manager = new SubmissionManager(store, logger, walletMock, "0xascContract", 3);
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  function createTestJob(proofData: any = {}): JobRecord {
    return {
      id: "signal-id",
      event_id: "1-100-0xhash-0",
      chain_key: 1,
      contract_address: "0xsource",
      transaction_hash: "0xhash",
      block_number: 100,
      log_index: 0,
      event_name: "RiskSignalSubmitted",
      encoded_data: JSON.stringify({
        signalId: ethers.id("test-signal"),
        proof: {
          chainKey: 1,
          headerNumber: 100,
          txBytes: "0xabcdef",
          merkleProof: { root: ethers.ZeroHash, siblings: [] },
          continuityProof: { lowerEndpointDigest: ethers.ZeroHash, roots: [] },
          ...proofData
        }
      }),
      status: "PROOF_RECEIVED",
      attempts: 0,
      created_at: Date.now(),
      updated_at: Date.now()
    };
  }

  it("should skip submission if the fact already exists on-chain", async () => {
    // mock verifiedFacts to return exists = true
    mockVerifiedFacts.mockResolvedValueOnce([1, ethers.ZeroAddress, 0, 0, true]);

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("EXECUTED");
    expect(mockSubmitProof).not.toHaveBeenCalled();
  });

  it("should successfully submit proof and transition to EXECUTED on receipt success", async () => {
    mockVerifiedFacts.mockResolvedValueOnce([0, ethers.ZeroAddress, 0, 0, false]);
    mockEstimateGasSubmitProof.mockResolvedValueOnce(50000n);
    
    const mockTx = {
      hash: "0xtxhash",
      wait: jest.fn().mockResolvedValueOnce({ status: 1 })
    };
    mockSubmitProof.mockResolvedValueOnce(mockTx);

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("EXECUTED");
    expect(mockSubmitProof).toHaveBeenCalled();
  });

  it("should transition to ASC_FAILED if transaction receipt has status 0 (revert)", async () => {
    mockVerifiedFacts.mockResolvedValueOnce([0, ethers.ZeroAddress, 0, 0, false]);
    mockEstimateGasSubmitProof.mockResolvedValueOnce(50000n);

    const mockTx = {
      hash: "0xtxhash",
      wait: jest.fn().mockResolvedValueOnce({ status: 0 })
    };
    mockSubmitProof.mockResolvedValueOnce(mockTx);

    const job = createTestJob();
    store.saveJob(job);

    await manager.processJob(job);

    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("ASC_FAILED");
    expect(updated?.last_error).toContain("Transaction reverted");
  });
});
