import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export interface Config {
  aiProvider: string;
  aiModel: string;
  openaiApiKey?: string;
  aiFallbackProvider?: string;
  aiFallbackModel?: string;
  groqApiKey?: string;

  sepoliaRpcUrl: string;
  sourceChainId: number;
  sourceChainKey: number;
  sourceContractAddress?: string;
  sourceDeployerPrivateKey?: string;

  creditcoinRpcUrl: string;
  creditcoinChainId: number;
  creditcoinPrivateKey?: string;
  ascContractAddress?: string;
  businessLogicContractAddress?: string;

  proofBuilderUrl: string;
  proofBuilderApiKey?: string;

  databaseUrl?: string;
  appEnv: string;
  logLevel: string;
  apiHost: string;
  apiPort: number;
  corsOrigins: string;

  workerPollIntervalSeconds: number;
  workerMaxRetries: number;
  workerRetryBackoffSeconds: number;
  evidenceDir: string;
}

export function validateConfig(): Config {
  const config: Config = {
    aiProvider: process.env.AI_PROVIDER || "mock",
    aiModel: process.env.AI_MODEL || "",
    openaiApiKey: process.env.OPENAI_API_KEY,
    aiFallbackProvider: process.env.AI_FALLBACK_PROVIDER,
    aiFallbackModel: process.env.AI_FALLBACK_MODEL,
    groqApiKey: process.env.GROQ_API_KEY,

    sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL || "",
    sourceChainId: Number(process.env.SOURCE_CHAIN_ID || 11155111),
    sourceChainKey: Number(process.env.SOURCE_CHAIN_KEY || 1),
    sourceContractAddress: process.env.SOURCE_CONTRACT_ADDRESS,
    sourceDeployerPrivateKey: process.env.SOURCE_DEPLOYER_PRIVATE_KEY,

    creditcoinRpcUrl: process.env.CREDITCOIN_RPC_URL || "https://rpc.cc3-testnet.creditcoin.network",
    creditcoinChainId: Number(process.env.CREDITCOIN_CHAIN_ID || 102031),
    creditcoinPrivateKey: process.env.CREDITCOIN_PRIVATE_KEY,
    ascContractAddress: process.env.ASC_CONTRACT_ADDRESS,
    businessLogicContractAddress: process.env.BUSINESS_LOGIC_CONTRACT_ADDRESS,

    proofBuilderUrl: process.env.PROOF_BUILDER_URL || "https://prover.cc3-testnet.creditcoin.network",
    proofBuilderApiKey: process.env.PROOF_BUILDER_API_KEY,

    databaseUrl: process.env.DATABASE_URL,
    appEnv: process.env.APP_ENV || "development",
    logLevel: process.env.LOG_LEVEL || "INFO",
    apiHost: process.env.API_HOST || "0.0.0.0",
    apiPort: Number(process.env.API_PORT || 8000),
    corsOrigins: process.env.CORS_ORIGINS || "http://localhost:3000",

    workerPollIntervalSeconds: Number(process.env.WORKER_POLL_INTERVAL_SECONDS || 15),
    workerMaxRetries: Number(process.env.WORKER_MAX_RETRIES || 5),
    workerRetryBackoffSeconds: Number(process.env.WORKER_RETRY_BACKOFF_SECONDS || 5),
    evidenceDir: process.env.EVIDENCE_DIR || "./evidence",
  };

  // Perform basic URL validation
  const validateUrl = (url: string, name: string) => {
    if (url) {
      try {
        new URL(url);
      } catch {
        throw new Error(`Invalid URL configured for ${name}: ${url}`);
      }
    }
  };

  validateUrl(config.sepoliaRpcUrl, "SEPOLIA_RPC_URL");
  validateUrl(config.creditcoinRpcUrl, "CREDITCOIN_RPC_URL");
  validateUrl(config.proofBuilderUrl, "PROOF_BUILDER_URL");

  return config;
}

export function reportConfig(config: Config): void {
  console.log("========================================");
  console.log("ProofMind Configuration Report:");
  console.log(`AI provider: ${config.aiProvider || "not configured"}`);
  console.log(`AI model: ${config.aiModel || "not configured"}`);
  console.log(`Source RPC: ${config.sepoliaRpcUrl ? "configured" : "not configured"}`);
  console.log(`Creditcoin RPC: ${config.creditcoinRpcUrl ? "configured" : "not configured"}`);
  console.log(`ASC address: ${config.ascContractAddress ? "configured" : "not deployed"}`);
  console.log(`Business logic address: ${config.businessLogicContractAddress ? "configured" : "not deployed"}`);
  console.log(`Proof Builder: ${config.proofBuilderUrl ? "configured" : "not configured"}`);
  console.log(`Database: ${config.databaseUrl ? "configured" : "not configured"}`);
  console.log(`Secrets: ${config.sourceDeployerPrivateKey && config.creditcoinPrivateKey ? "loaded" : "missing keys"}`);
  console.log("========================================");
}
