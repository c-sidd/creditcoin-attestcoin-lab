"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const config_1 = require("../src/config");
describe("Configuration Loader", () => {
    const originalEnv = { ...process.env };
    beforeEach(() => {
        process.env = { ...originalEnv };
    });
    afterEach(() => {
        process.env = originalEnv;
    });
    it("should throw if required variable is missing", () => {
        delete process.env.AI_PROVIDER;
        (0, chai_1.expect)(() => (0, config_1.loadConfig)()).to.throw(/Missing environment variable AI_PROVIDER/);
    });
    it("should throw if AI_PROVIDER is invalid", () => {
        process.env.AI_PROVIDER = "anthropic";
        (0, chai_1.expect)(() => (0, config_1.loadConfig)()).to.throw(/AI_PROVIDER must be either 'groq' or 'openai'/);
    });
    it("should throw if GROQ_API_KEY is missing when AI_PROVIDER=groq", () => {
        process.env.AI_PROVIDER = "groq";
        delete process.env.GROQ_API_KEY;
        (0, chai_1.expect)(() => (0, config_1.loadConfig)()).to.throw(/GROQ_API_KEY is required/);
    });
    it("should load valid configuration", () => {
        process.env.AI_PROVIDER = "groq";
        process.env.GROQ_API_KEY = "gsk_test";
        process.env.SOURCE_CHAIN_ID = "11155111";
        process.env.CREDITCOIN_CHAIN_ID = "102031";
        process.env.CREDITCOIN_RPC_URL = "https://rpc.cc3-testnet.creditcoin.network";
        process.env.PROOF_BUILDER_URL = "https://prover.cc3-testnet.creditcoin.network";
        process.env.SOURCE_CHAIN_KEY = "1";
        process.env.SOURCE_RPC_URL = "https://sepolia.infura.io/v3/fake";
        process.env.SOURCE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
        process.env.ASC_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
        process.env.DECISION_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
        process.env.DATABASE_URL = "sqlite://test.db";
        process.env.WORKER_PRIVATE_KEY = "0xabc123";
        process.env.CREDITCOIN_PRIVATE_KEY = "0xdef456";
        const config = (0, config_1.loadConfig)();
        (0, chai_1.expect)(config.aiProvider).to.equal("groq");
        (0, chai_1.expect)(config.sourceChainId).to.equal(11155111);
        (0, chai_1.expect)(config.creditcoinChainId).to.equal(102031);
        (0, chai_1.expect)(config.sourceChainKey).to.equal(1);
    });
});
