import { Router, Request, Response } from "express";
import { BackendJobStore } from "../persistence";
import { loadConfig } from "../config";
import { VerifiedFactValidator } from "../ai/validator";
import { AiDecisionService } from "../ai/service";
import { FakeAiProvider, OpenAiCompatibleProvider } from "../ai/provider";
import { AiRiskControls } from "../ai/risk-controls";
import { IntentSerializer } from "../ai/intent-serializer";
import { VerifiedInputFact } from "../ai/types";
import { ethers } from "ethers";

const router = Router();
const config = loadConfig();
const jobStore = new BackendJobStore(config.evidenceDir);

// 1. Initialize AI pipeline components
let aiProvider;
if (process.env.AI_PROVIDER === "openai" && process.env.OPENAI_API_KEY) {
  aiProvider = new OpenAiCompatibleProvider(
    process.env.OPENAI_API_KEY,
    "https://api.openai.com/v1",
    process.env.AI_MODEL || "gpt-4o"
  );
} else if (process.env.AI_PROVIDER === "groq" && process.env.GROQ_API_KEY) {
  aiProvider = new OpenAiCompatibleProvider(
    process.env.GROQ_API_KEY,
    "https://api.groq.com/openai/v1",
    process.env.AI_MODEL || "llama-3.3-70b-versatile"
  );
} else {
  // Fallback to fake provider
  aiProvider = new FakeAiProvider();
}

const aiValidator = new VerifiedFactValidator();
const aiService = new AiDecisionService(aiProvider);
const riskControls = new AiRiskControls();
const intentSerializer = new IntentSerializer(config.decisionContractAddress || ethers.ZeroAddress);

// Health Endpoint
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "ProofMind Backend API",
    version: "v1",
    config: {
      evidenceDir: config.evidenceDir,
      ascContractAddress: config.ascContractAddress,
      decisionContractAddress: config.decisionContractAddress
    }
  });
});

// List Evidence Jobs (with optional status filtering and pagination)
router.get("/evidence", (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;
    let jobs = jobStore.getAllJobs();

    if (status) {
      jobs = jobs.filter((j) => j.status === status);
    }

    // Pagination
    const p = parseInt(page as string, 10);
    const l = parseInt(limit as string, 10);
    const startIndex = (p - 1) * l;
    const endIndex = p * l;

    const paginatedJobs = jobs.slice(startIndex, endIndex);

    res.json({
      data: paginatedJobs,
      pagination: {
        total: jobs.length,
        page: p,
        limit: l,
        pages: Math.ceil(jobs.length / l)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Evidence Job Details
router.get("/evidence/:eventId", (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const job = jobStore.getJob(eventId as string);

    if (!job) {
      res.status(404).json({ error: `Job with ID ${eventId} not found` });
      return;
    }

    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Process AI Decision & Generate Transaction Intent
router.post("/evidence/:eventId/decision", async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const job = jobStore.getJob(eventId as string);

    if (!job) {
      res.status(404).json({ error: `Job with ID ${eventId} not found` });
      return;
    }

    // Verify evidence is in executable state (at least proof received or executed)
    if (job.status !== "EXECUTED" && job.status !== "PROOF_RECEIVED") {
      res.status(400).json({
        error: `Evidence status is ${job.status}. AI decision can only be generated for PROOF_RECEIVED or EXECUTED evidence.`
      });
      return;
    }

    const parsedData = JSON.parse(job.encoded_data);

    // Reconstruct input fact
    const inputFact: VerifiedInputFact = {
      chainKey: job.chain_key,
      transactionHash: job.transaction_hash,
      blockNumber: job.block_number,
      contractAddress: job.contract_address,
      eventName: job.event_name,
      signalId: parsedData.signalId,
      subject: parsedData.subject,
      signalValue: parsedData.signalValue,
      timestamp: Number(parsedData.timestamp)
    };

    // 1. Validate Input Fact
    aiValidator.validate(inputFact);

    // 2. Invoke AI Decision Service
    const recommendation = await aiService.requestDecision(inputFact);

    // 3. Apply Risk Controls
    const policyOutcome = riskControls.evaluate(inputFact, recommendation);

    // 4. Serialize Transaction Intent (if admissible)
    let transactionIntent = null;
    if (policyOutcome.admissible) {
      const evidenceId = ethers.solidityPackedKeccak256(
        ["uint64", "bytes32"],
        [job.chain_key, parsedData.signalId]
      );
      transactionIntent = intentSerializer.serialize(evidenceId, policyOutcome);
    }

    res.json({
      eventId: job.event_id,
      inputFact,
      recommendation,
      policyOutcome,
      transactionIntent,
      metadata: {
        provider: process.env.AI_PROVIDER || "mock",
        model: process.env.AI_MODEL || "mock-model",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
