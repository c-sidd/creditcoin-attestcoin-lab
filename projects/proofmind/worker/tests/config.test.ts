import { validateConfig } from "../src/config";

describe("Configuration Validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should parse default configuration values successfully", () => {
    process.env.SEPOLIA_RPC_URL = "http://localhost:8545";
    process.env.CREDITCOIN_RPC_URL = "https://rpc.cc3-testnet.creditcoin.network";
    process.env.PROOF_BUILDER_URL = "https://prover.cc3-testnet.creditcoin.network";

    const config = validateConfig();
    expect(config.sourceChainId).toBe(11155111);
    expect(config.creditcoinChainId).toBe(102031);
    expect(config.workerPollIntervalSeconds).toBe(15);
  });

  it("should fail validation if an invalid URL is supplied", () => {
    process.env.SEPOLIA_RPC_URL = "invalid-url";
    expect(() => validateConfig()).toThrow("Invalid URL configured for SEPOLIA_RPC_URL");
  });
});
