import { SubmissionManager } from "../src/submission";
import { JobStore, JobRecord } from "../src/persistence";
import { Logger } from "../src/logger";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const mockVerifiedFacts = jest.fn();
const mockSubmitProof = jest.fn();
const mockEstimateGasSubmitProof = jest.fn();

jest.mock("ethers", () => {
  const original = jest.requireActual("ethers");
  class MockContract {
    verifiedFacts = mockVerifiedFacts;
    submitProof = Object.assign(mockSubmitProof, { estimateGas: mockEstimateGasSubmitProof });
    constructor() {}
  }
  return { ...original, ethers: { ...original.ethers, Contract: MockContract } };
});

describe("SubmissionManager Tests", () => {
  const tempDir = path.join(__dirname, "../dist/test-submission-evidence");
  let store: JobStore;
  let logger: Logger;
  let walletMock: any;
  let manager: SubmissionManager;

  beforeEach(() => {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    jest.clearAllMocks();
    store = new JobStore(tempDir, "submission-jobs.json");
    logger = new Logger("ERROR");
    const actualEthers = jest.requireActual("ethers");
    walletMock = new actualEthers.Wallet("0x0123456789012345678901234567890123456789012345678901234567890123");
    manager = new SubmissionManager(store, logger, walletMock, "0xascContract", 3);
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
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
      encoded_data: JSON.stringify({
        signalId: ethers.id("test-signal"),
        proof: {
          chainKey: 1,
          headerNumber: 100,
          txBytes: "0xabcdef",
          merkleProof: { root: ethers.ZeroHash, siblings: [] },
          continuityProof: { lowerEndpointDigest: ethers.ZeroHash, roots: [] }
        }
      }),
      status: "PROOF_RECEIVED",
      attempts: 0,
      created_at: Date.now(),
      updated_at: Date.now()
    };
  }

  it("skips submission if the fact already exists on-chain", async () => {
    mockVerifiedFacts.mockResolvedValueOnce([1, ethers.ZeroAddress, 0, 0, true]);
    const job = createTestJob();
    store.saveJob(job);
    await manager.processJob(job);
    expect(store.getJob(job.event_id)?.status).toBe("EXECUTED");
    expect(mockSubmitProof).not.toHaveBeenCalled();
  });

  it("successfully submits proof and transitions to EXECUTED", async () => {
    mockVerifiedFacts.mockResolvedValueOnce([0, ethers.ZeroAddress, 0, 0, false]);
    mockEstimateGasSubmitProof.mockResolvedValueOnce(50000n);
    mockSubmitProof.mockResolvedValueOnce({ hash: "0xtxhash", wait: jest.fn().mockResolvedValueOnce({ status: 1 }) });
    const job = createTestJob();
    store.saveJob(job);
    await manager.processJob(job);
    expect(store.getJob(job.event_id)?.status).toBe("EXECUTED");
    expect(mockSubmitProof).toHaveBeenCalled();
  });

  it("returns to PROOF_RECEIVED for a retryable submission failure", async () => {
    mockVerifiedFacts.mockResolvedValueOnce([0, ethers.ZeroAddress, 0, 0, false]);
    mockEstimateGasSubmitProof.mockResolvedValueOnce(50000n);
    mockSubmitProof.mockRejectedValueOnce(new Error("temporary RPC failure"));
    const job = createTestJob();
    store.saveJob(job);
    await manager.processJob(job);
    const updated = store.getJob(job.event_id);
    expect(updated?.status).toBe("PROOF_RECEIVED");
    expect(updated?.attempts).toBe(1);
    expect(updated?.last_error).toContain("temporary RPC failure");
  });

  it("moves to ASC_FAILED at the retry limit", async () => {
    const retryManager = new SubmissionManager(store, logger, walletMock, "0xascContract", 1);
    mockVerifiedFacts.mockResolvedValueOnce([0, ethers.ZeroAddress, 0, 0, false]);
    mockEstimateGasSubmitProof.mockResolvedValueOnce(50000n);
    mockSubmitProof.mockRejectedValueOnce(new Error("permanent RPC failure"));
    const job = createTestJob();
    store.saveJob(job);
    await retryManager.processJob(job);
    expect(store.getJob(job.event_id)?.status).toBe("ASC_FAILED");
    expect(store.getJob(job.event_id)?.attempts).toBe(1);
  });
});
