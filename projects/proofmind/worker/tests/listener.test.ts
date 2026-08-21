import { EventListener } from "../src/listener";
import { JobStore } from "../src/persistence";
import { Logger } from "../src/logger";
import fs from "fs";
import path from "path";

// Mock ethers
const mockQueryFilter = jest.fn();
const mockGetBlockNumber = jest.fn();

jest.mock("ethers", () => {
  const original = jest.requireActual("ethers");
  return {
    ...original,
    ethers: {
      ...original.ethers,
      JsonRpcProvider: jest.fn().mockImplementation(() => {
        return {
          getBlockNumber: mockGetBlockNumber
        };
      }),
      Contract: jest.fn().mockImplementation(() => {
        return {
          filters: {
            RiskSignalSubmitted: jest.fn()
          },
          queryFilter: mockQueryFilter
        };
      })
    }
  };
});

describe("EventListener Tests", () => {
  const tempDir = path.join(__dirname, "../dist/test-listener-evidence");
  let store: JobStore;
  let logger: Logger;
  let providerMock: any;

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    store = new JobStore(tempDir, "listener-jobs.json");
    logger = new Logger("ERROR"); // Keep logs quiet during tests

    const { ethers } = require("ethers");
    providerMock = new ethers.JsonRpcProvider();
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("should scan a block range, discover logs, create jobs, and update the last scanned block", async () => {
    const mockLogs = [
      {
        blockNumber: 100,
        transactionHash: "0xhash123",
        index: 0,
        args: [
          "0xsignalId",
          "0xsubject",
          1000n,
          1718919293n
        ]
      }
    ];
    mockQueryFilter.mockResolvedValueOnce(mockLogs);

    const listener = new EventListener(
      providerMock,
      store,
      logger,
      "0xcontract",
      1, // chainKey
      tempDir,
      90 // default start block
    );

    const newJobs = await listener.scanRange(91, 100);
    expect(newJobs).toBe(1);
    expect(listener.getLastScannedBlock()).toBe(100);

    // Verify job exists in store
    const jobs = store.getAllJobs();
    expect(jobs.length).toBe(1);
    expect(jobs[0].transaction_hash).toBe("0xhash123");
    expect(jobs[0].status).toBe("DETECTED");
  });

  it("should skip duplicate events when scanning", async () => {
    const mockLogs = [
      {
        blockNumber: 100,
        transactionHash: "0xhash123",
        index: 0,
        args: ["0xsignalId", "0xsubject", 1000n, 1718919293n]
      }
    ];
    mockQueryFilter.mockResolvedValue(mockLogs);

    const listener = new EventListener(providerMock, store, logger, "0xcontract", 1, tempDir, 90);
    
    // First scan creates 1 job
    await listener.scanRange(91, 100);
    
    // Second scan with same logs should discover 0 new jobs
    const newJobs = await listener.scanRange(91, 100);
    expect(newJobs).toBe(0);
    expect(store.getAllJobs().length).toBe(1);
  });

  it("should run catch-up scan up to the latest block number", async () => {
    mockGetBlockNumber.mockResolvedValueOnce(150);
    mockQueryFilter.mockResolvedValueOnce([]); // no logs

    const listener = new EventListener(providerMock, store, logger, "0xcontract", 1, tempDir, 140);
    await listener.catchUp();

    expect(listener.getLastScannedBlock()).toBe(150);
  });
});
