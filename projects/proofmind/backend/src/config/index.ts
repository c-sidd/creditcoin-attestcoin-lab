import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../../.env") });

export interface BackendConfig {
  port: number;
  evidenceDir: string;
  allowedOrigins: string[];
  ascContractAddress?: string;
  decisionContractAddress?: string;
}

export function loadConfig(): BackendConfig {
  return {
    port: Number(process.env.PORT || 3001),
    evidenceDir: process.env.EVIDENCE_DIR || path.join(__dirname, "../../../worker/evidence"),
    allowedOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:3000").split(","),
    ascContractAddress: process.env.ASC_CONTRACT_ADDRESS,
    decisionContractAddress: process.env.BUSINESS_LOGIC_CONTRACT_ADDRESS
  };
}
