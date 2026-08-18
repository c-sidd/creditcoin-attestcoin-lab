import dotenv from "dotenv";
import path from "path";

// Load environment variables from projects/proofmind/.env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export interface Config {
  aiProvider: string;
  groqApiKey?: string;
  openaiApiKey?: string;
  sourceChainId: number;
  creditcoinChainId: number;
  creditcoinRpcUrl: string;
  proofBuilderUrl: string;
  sourceChainKey: number;
  sourceRpcUrl: string;
  sourceContractAddress: string;
  ascContractAddress: string;
  decisionContractAddress: string;
  databaseUrl: string;
  workerPrivateKey: string;
  creditcoinPrivateKey: string;
  port: number;
  frontendPort: number;
}

export const PRECOMPILING_ADDRESSES = {
  BLOCK_PROVER: "0x0000000000000000000000000000000000000FD2",
  CHAIN_INFO: "0x0000000000000000000000000000000000000FD3",
};

export function loadConfig(): Config {
  const getEnv = (key: string, required = true): string => {
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
