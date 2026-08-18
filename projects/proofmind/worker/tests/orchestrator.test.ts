import { expect } from "chai";
import path from "path";
import fs from "fs";
import { WorkerOrchestrator } from "../src/orchestrator";
import { PersistenceManager } from "../src/persistence";
import { Config } from "../src/config";

describe("WorkerOrchestrator", () => {
  const testDbPath = path.resolve(__dirname, "orchestrator-test-db.json");
  let persistence: PersistenceManager;

  const mockConfig: Config = {
    aiProvider: "groq",
    groqApiKey: "gsk_test",
    sourceChainId: 11155111,
    creditcoinChainId: 102031,
    creditcoinRpcUrl: "https://rpc.cc3-testnet.creditcoin.network",
    proofBuilderUrl: "https://prover.cc3-testnet.creditcoin.network",
    sourceChainKey: 1,
    sourceRpcUrl: "https://rpc.cc3-testnet.creditcoin.network",
    sourceContractAddress: "0x1234567890123456789012345678901234567890",
    ascContractAddress: "0x1234567890123456789012345678901234567890",
    decisionContractAddress: "0x1234567890123456789012345678901234567890",
    databaseUrl: "sqlite://test.db",
    workerPrivateKey: "0xabc123",
    creditcoinPrivateKey: "0x0000000000000000000000000000000000000000000000000000000000000001", // valid hex private key format
    port: 3000,
    frontendPort: 5173,
  };

  beforeEach(() => {
    persistence = new PersistenceManager(testDbPath);
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it("should initialize orchestrator and expose processActiveJobs function", () => {
    const orchestrator = new WorkerOrchestrator(mockConfig, persistence);
    expect(orchestrator.processActiveJobs).to.be.a("function");
  });
});
