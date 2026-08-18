import { expect } from "chai";
import { ProofBuilderClient } from "../src/proof-builder";
import { Config } from "../src/config";

describe("ProofBuilderClient", () => {
  const mockConfig: Config = {
    aiProvider: "groq",
    groqApiKey: "gsk_test",
    sourceChainId: 11155111,
    creditcoinChainId: 102031,
    creditcoinRpcUrl: "http://localhost:8545",
    proofBuilderUrl: "https://prover.cc3-testnet.creditcoin.network",
    sourceChainKey: 1,
    sourceRpcUrl: "http://localhost:8545",
    sourceContractAddress: "0x1234567890123456789012345678901234567890",
    ascContractAddress: "0x1234567890123456789012345678901234567890",
    decisionContractAddress: "0x1234567890123456789012345678901234567890",
    databaseUrl: "sqlite://test.db",
    workerPrivateKey: "0xabc123",
    creditcoinPrivateKey: "0xdef456",
    port: 3000,
    frontendPort: 5173,
  };

  it("should initialize client and expose getProofForTx function", () => {
    const client = new ProofBuilderClient(mockConfig);
    expect(client.getProofForTx).to.be.a("function");
  });
});
