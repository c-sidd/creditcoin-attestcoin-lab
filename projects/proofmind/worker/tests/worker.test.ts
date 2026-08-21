import { ProofMindWorker } from "../src";
import { JobStore, JobRecord } from "../src/persistence";
import fs from "fs";
import path from "path";

// Mock ethers provider and wallet
const mockGetBlockNumber = jest.fn().mockResolvedValue(100);
const mockQueryFilter = jest.fn().mockResolvedValue([]);

jest.mock("ethers", () => {
  const original = jest.requireActual("ethers");
  
  class MockProvider {
    getBlockNumber = mockGetBlockNumber;
    destroy = jest.fn();
  }

  class MockWallet {
    constructor() {}
  }

  class MockContract {
    filters = {
      RiskSignalSubmitted: jest.fn()
    };
    queryFilter = mockQueryFilter;
    verifiedFacts = jest.fn().mockResolvedValue([0, original.ethers.ZeroAddress, 0, 0, false]);
    submitProof = Object.assign(
      jest.fn().mockResolvedValue({
        hash: "0xtx",
        wait: jest.fn().mockResolvedValue({ status: 1 })
      }),
      { estimateGas: jest.fn().mockResolvedValue(50000n) }
    );
    constructor() {}
  }

  return {
    ...original,
    ethers: {
      ...original.ethers,
      JsonRpcProvider: MockProvider,
      Wallet: MockWallet,
      Contract: MockContract
    }
  };
});

describe("Worker Integrated Orchestrator Tests", () => {
  const tempStorageDir = path.join(__dirname, "../dist/test-worker-evidence");

  beforeEach(() => {
    if (fs.existsSync(tempStorageDir)) {
      fs.rmSync(tempStorageDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(tempStorageDir)) {
      fs.rmSync(tempStorageDir, { recursive: true, force: true });
    }
  });

  it("should successfully save, fetch, and list jobs using JobStore", () => {
    const store = new JobStore(tempStorageDir, "test-jobs.json");
    const job: JobRecord = {
      id: "test-id",
      event_id: "1-100-0x123-0",
      chain_key: 1,
      contract_address: "0xsource",
      transaction_hash: "0x123",
      block_number: 100,
      log_index: 0,
      event_name: "RiskSignalSubmitted",
      encoded_data: "{}",
      status: "DETECTED",
      attempts: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    store.saveJob(job);
    const fetched = store.getJob("1-100-0x123-0");
    expect(fetched).toBeDefined();
    expect(fetched?.status).toBe("DETECTED");

    const unfinished = store.getUnfinishedJobs();
    expect(unfinished.length).toBe(1);

    job.status = "EXECUTED";
    store.saveJob(job);
    expect(store.getUnfinishedJobs().length).toBe(0);
  });

  it("should run complete worker loop cycle and graceful shutdown", async () => {
    process.env.SEPOLIA_RPC_URL = "http://localhost:8545";
    process.env.CREDITCOIN_RPC_URL = "https://rpc.cc3-testnet.creditcoin.network";
    process.env.PROOF_BUILDER_URL = "https://prover.cc3-testnet.creditcoin.network";
    process.env.EVIDENCE_DIR = tempStorageDir;
    process.env.SOURCE_CONTRACT_ADDRESS = "0xsourceContract";
    process.env.CREDITCOIN_PRIVATE_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";
    process.env.ASC_CONTRACT_ADDRESS = "0xascContract";

    const worker = new ProofMindWorker();
    
    // Start worker (non-blocking)
    await worker.start();
    
    let report = worker.getHealthReport();
    expect(report.status).toBe("RUNNING");
    expect(report.allJobsCount).toBe(0);

    // Stop worker
    await worker.stop();
    report = worker.getHealthReport();
    expect(report.status).toBe("STOPPED");
  });
});
