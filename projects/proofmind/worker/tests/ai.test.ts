import { expect } from "chai";
import { MockAIProvider } from "../../backend/src/ai/mock";
import { AIFactory } from "../../backend/src/ai/factory";
import { Config } from "../src/config";

describe("AI Service Foundation", () => {
  const mockConfig: Config = {
    aiProvider: "mock",
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
    creditcoinPrivateKey: "0xdef456",
    port: 3000,
    frontendPort: 5173,
  };

  it("should create MockAIProvider via AIFactory", () => {
    const provider = AIFactory.create(mockConfig);
    expect(provider).to.be.an.instanceOf(MockAIProvider);
  });

  it("should generate deterministic ALLOW output for signal <= 50", async () => {
    const provider = new MockAIProvider();
    const result = await provider.generateDecision({
      evidenceId: "0x123",
      subject: "0xuser",
      signalValue: 42,
      timestamp: 123456,
    });

    expect(result.decision).to.equal("ALLOW");
    expect(result.action).to.equal("APPROVE_LIMIT");
    expect(result.score).to.be.at.least(70);
  });

  it("should generate REJECT output for signal > 80", async () => {
    const provider = new MockAIProvider();
    const result = await provider.generateDecision({
      evidenceId: "0x123",
      subject: "0xuser",
      signalValue: 88,
      timestamp: 123456,
    });

    expect(result.decision).to.equal("REJECT");
    expect(result.action).to.equal("NO_ACTION");
    expect(result.score).to.be.below(50);
  });
});
