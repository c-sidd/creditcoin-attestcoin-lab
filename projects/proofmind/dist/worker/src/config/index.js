"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRECOMPILING_ADDRESSES = void 0;
exports.loadConfig = loadConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from projects/proofmind/.env
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
exports.PRECOMPILING_ADDRESSES = {
    BLOCK_PROVER: "0x0000000000000000000000000000000000000FD2",
    CHAIN_INFO: "0x0000000000000000000000000000000000000FD3",
};
function loadConfig() {
    const getEnv = (key, required = true) => {
        const val = process.env[key];
        if (required && !val) {
            throw new Error(`Configuration Error: Missing environment variable ${key}`);
        }
        return val || "";
    };
    const aiProvider = getEnv("AI_PROVIDER", true).toLowerCase();
    if (aiProvider !== "groq" && aiProvider !== "openai") {
        throw new Error(`Configuration Error: AI_PROVIDER must be either 'groq' or 'openai'`);
    }
    const groqApiKey = process.env.GROQ_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (aiProvider === "groq" && !groqApiKey) {
        throw new Error(`Configuration Error: GROQ_API_KEY is required when AI_PROVIDER=groq`);
    }
    if (aiProvider === "openai" && !openaiApiKey) {
        throw new Error(`Configuration Error: OPENAI_API_KEY is required when AI_PROVIDER=openai`);
    }
    return {
        aiProvider,
        groqApiKey,
        openaiApiKey,
        sourceChainId: parseInt(getEnv("SOURCE_CHAIN_ID", true), 10),
        creditcoinChainId: parseInt(getEnv("CREDITCOIN_CHAIN_ID", true), 10),
        creditcoinRpcUrl: getEnv("CREDITCOIN_RPC_URL", true),
        proofBuilderUrl: getEnv("PROOF_BUILDER_URL", true),
        sourceChainKey: parseInt(getEnv("SOURCE_CHAIN_KEY", true), 10),
        sourceRpcUrl: getEnv("SOURCE_RPC_URL", true),
        sourceContractAddress: getEnv("SOURCE_CONTRACT_ADDRESS", true),
        ascContractAddress: getEnv("ASC_CONTRACT_ADDRESS", true),
        decisionContractAddress: getEnv("DECISION_CONTRACT_ADDRESS", true),
        databaseUrl: getEnv("DATABASE_URL", true),
        workerPrivateKey: getEnv("WORKER_PRIVATE_KEY", true),
        creditcoinPrivateKey: getEnv("CREDITCOIN_PRIVATE_KEY", true),
        port: parseInt(process.env.PORT || "3000", 10),
        frontendPort: parseInt(process.env.FRONTEND_PORT || "5173", 10),
    };
}
