import { AiDecisionService } from "../src/ai/service";
import { FakeAiProvider, OpenAiCompatibleProvider } from "../src/ai/provider";
import { VerifiedInputFact } from "../src/ai/types";
import { VerifiedFactValidator } from "../src/ai/validator";

describe("AIDecisionService Schema & Validation Tests", () => {
  const dummyFact: VerifiedInputFact = {
    chainKey: 1,
    transactionHash: "0x" + "a".repeat(64),
    blockNumber: 123,
    contractAddress: "0x" + "b".repeat(40),
    eventName: "RiskSignalSubmitted",
    signalId: "0x" + "c".repeat(64),
    subject: "0x" + "d".repeat(40),
    signalValue: "10000",
    timestamp: Math.floor(Date.now() / 1000)
  };

  it("should successfully return approved decision for small amount", async () => {
    const provider = new FakeAiProvider();
    const service = new AiDecisionService(provider);

    const res = await service.requestDecision(dummyFact);
    expect(res.decision).toBe("APPROVE");
    expect(res.score).toBe(25);
    expect(res.action).toBe("ALLOW_LOAN");
    expect(res.amount).toBe("10000");
  });

  it("should successfully return rejected decision for large amount", async () => {
    const provider = new FakeAiProvider();
    const service = new AiDecisionService(provider);
    const largeAmountFact = { ...dummyFact, signalValue: "100000" };

    const res = await service.requestDecision(largeAmountFact);
    expect(res.decision).toBe("REJECT");
    expect(res.score).toBe(85);
    expect(res.action).toBe("BLOCK");
  });

  it("should throw error if provider simulated network call fails", async () => {
    const provider = new FakeAiProvider(true); // shouldFail = true
    const service = new AiDecisionService(provider);

    await expect(service.requestDecision(dummyFact)).rejects.toThrow("Fake AI Provider simulated network failure");
  });

  it("should throw error on invalid decision value", async () => {
    const badProvider = {
      getDecision: async () => ({
        decision: "INVALID_ENUM", // invalid
        score: 10,
        action: "ALLOW_LOAN",
        amount: "100",
        reasonCodes: ["TEST"],
        expiresAt: Math.floor(Date.now() / 1000) + 1000
      } as any)
    };
    const service = new AiDecisionService(badProvider);
    await expect(service.requestDecision(dummyFact)).rejects.toThrow("Invalid decision value");
  });

  it("should throw error on invalid risk score range", async () => {
    const badProvider = {
      getDecision: async () => ({
        decision: "APPROVE",
        score: 120, // out of range
        action: "ALLOW_LOAN",
        amount: "100",
        reasonCodes: ["TEST"],
        expiresAt: Math.floor(Date.now() / 1000) + 1000
      } as any)
    };
    const service = new AiDecisionService(badProvider);
    await expect(service.requestDecision(dummyFact)).rejects.toThrow("Invalid score");
  });

  it("should throw error if amount is a floating point representation", async () => {
    const badProvider = {
      getDecision: async () => ({
        decision: "APPROVE",
        score: 50,
        action: "ALLOW_LOAN",
        amount: "100.5", // floating point string
        reasonCodes: ["TEST"],
        expiresAt: Math.floor(Date.now() / 1000) + 1000
      } as any)
    };
    const service = new AiDecisionService(badProvider);
    await expect(service.requestDecision(dummyFact)).rejects.toThrow("Invalid amount representation");
  });

  it("should throw error if expiresAt is in the past", async () => {
    const badProvider = {
      getDecision: async () => ({
        decision: "APPROVE",
        score: 50,
        action: "ALLOW_LOAN",
        amount: "100",
        reasonCodes: ["TEST"],
        expiresAt: Math.floor(Date.now() / 1000) - 10 // past expiry
      } as any)
    };
    const service = new AiDecisionService(badProvider);
    await expect(service.requestDecision(dummyFact)).rejects.toThrow("Invalid expiresAt");
  });

  it("should timeout long-running requests", async () => {
    const slowProvider = {
      getDecision: () => new Promise<any>(() => {}) // never resolves
    };
    const service = new AiDecisionService(slowProvider, 100); // 100ms timeout
    await expect(service.requestDecision(dummyFact)).rejects.toThrow("AI Provider request timed out");
  });
});

describe("VerifiedFactValidator Adversarial Tests", () => {
  let validator: VerifiedFactValidator;
  let baseFact: VerifiedInputFact;

  beforeEach(() => {
    validator = new VerifiedFactValidator([1], 24 * 3600);
    baseFact = {
      chainKey: 1,
      transactionHash: "0x" + "a".repeat(64),
      blockNumber: 123,
      contractAddress: "0x" + "b".repeat(40),
      eventName: "RiskSignalSubmitted",
      signalId: "0x" + "c".repeat(64),
      subject: "0x" + "d".repeat(40),
      signalValue: "10000",
      timestamp: Math.floor(Date.now() / 1000)
    };
  });

  it("should validate a correct fact successfully", () => {
    expect(() => validator.validate(baseFact)).not.toThrow();
  });

  it("should reject unsupported chain key", () => {
    baseFact.chainKey = 999;
    expect(() => validator.validate(baseFact)).toThrow("Unsupported source chain key");
  });

  it("should reject invalid block numbers", () => {
    baseFact.blockNumber = -5;
    expect(() => validator.validate(baseFact)).toThrow("Invalid block number");
  });

  it("should reject malformed transaction hashes", () => {
    baseFact.transactionHash = "0xinvalid";
    expect(() => validator.validate(baseFact)).toThrow("Invalid transaction hash format");
  });

  it("should reject malformed contract addresses", () => {
    baseFact.contractAddress = "0xaddress123";
    expect(() => validator.validate(baseFact)).toThrow("Invalid contract address format");
  });

  it("should reject invalid event types", () => {
    baseFact.eventName = "WrongEvent";
    expect(() => validator.validate(baseFact)).toThrow("Invalid event type");
  });

  it("should reject invalid signal value string format", () => {
    baseFact.signalValue = "100.50";
    expect(() => validator.validate(baseFact)).toThrow("Invalid signal value");
  });

  it("should reject zero or negative signal values", () => {
    baseFact.signalValue = "0";
    expect(() => validator.validate(baseFact)).toThrow("Invalid signal value");
  });

  it("should reject stale evidence", () => {
    baseFact.timestamp = Math.floor(Date.now() / 1000) - (25 * 3600); // 25 hours ago
    expect(() => validator.validate(baseFact)).toThrow("Stale evidence");
  });

  it("should reject future timestamps", () => {
    baseFact.timestamp = Math.floor(Date.now() / 1000) + 100; // 100 seconds in future
    expect(() => validator.validate(baseFact)).toThrow("Future timestamp detected");
  });
});

describe("OpenAiCompatibleProvider Fetch Mock Tests", () => {
  const dummyFact: VerifiedInputFact = {
    chainKey: 1,
    transactionHash: "0x" + "a".repeat(64),
    blockNumber: 123,
    contractAddress: "0x" + "b".repeat(40),
    eventName: "RiskSignalSubmitted",
    signalId: "0x" + "c".repeat(64),
    subject: "0x" + "d".repeat(40),
    signalValue: "10000",
    timestamp: Math.floor(Date.now() / 1000)
  };

  let provider: OpenAiCompatibleProvider;

  beforeEach(() => {
    provider = new OpenAiCompatibleProvider("mock-key", "https://api.openai.com/v1", "gpt-4o");
    global.fetch = jest.fn();
  });

  it("should correctly call OpenAI API and parse JSON response", async () => {
    const mockResponseContent = JSON.stringify({
      decision: "APPROVE",
      score: 15,
      action: "ALLOW_LOAN",
      amount: "10000",
      reasonCodes: ["GOOD_HISTORY"],
      expiresAt: Math.floor(Date.now() / 1000) + 1000
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: mockResponseContent } }]
      })
    });

    const res = await provider.getDecision(dummyFact);
    expect(res.decision).toBe("APPROVE");
    expect(res.score).toBe(15);
    expect(res.amount).toBe("10000");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.any(Object)
    );
  });

  it("should throw error if fetch response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
      text: async () => "Invalid API key"
    });

    await expect(provider.getDecision(dummyFact)).rejects.toThrow(
      "AI API request failed: Unauthorized - Invalid API key"
    );
  });
});
