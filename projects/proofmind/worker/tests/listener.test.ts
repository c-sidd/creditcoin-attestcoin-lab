import { expect } from "chai";
import path from "path";
import fs from "fs";
import { EventListener } from "../src/listener";
import { PersistenceManager } from "../src/persistence";
import { Config } from "../src/config";

describe("EventListener", () => {
  const testDbPath = path.resolve(__dirname, "listener-test-db.json");
  const lastBlockPath = path.resolve(__dirname, "last-block.txt");
  let persistence: PersistenceManager;

  const mockConfig: Config = {
    aiProvider: "groq",
    groqApiKey: "gsk_test",
    sourceChainId: 11155111,
    creditcoinChainId: 102031,
    creditcoinRpcUrl: "https://rpc.cc3-testnet.creditcoin.network",
    proofBuilderUrl: "https://prover.cc3-testnet.creditcoin.network",
    sourceChainKey: 1,
    sourceRpcUrl: "https://rpc.cc3-testnet.creditcoin.network", // using creditcoin as fake RPC since it responds to getBlockNumber
    sourceContractAddress: "0x1234567890123456789012345678901234567890",
    ascContractAddress: "0x1234567890123456789012345678901234567890",
    decisionContractAddress: "0x1234567890123456789012345678901234567890",
    databaseUrl: "sqlite://test.db",
    workerPrivateKey: "0xabc123",
    creditcoinPrivateKey: "0xdef456",
    port: 3000,
    frontendPort: 5173,
  };

  beforeEach(() => {
    persistence = new PersistenceManager(testDbPath);
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(lastBlockPath)) fs.unlinkSync(lastBlockPath);
  });

  it("should initialize listener and expose scanRange function", () => {
    const listener = new EventListener(mockConfig, persistence, lastBlockPath);
    expect(listener.scanRange).to.be.a("function");
  });
});
