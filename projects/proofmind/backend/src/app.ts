import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { ethers } from "ethers";
import path from "path";
import fs from "fs";
import { loadConfig } from "../../worker/src/config";
import { Database } from "./database/db";
import { SyncService } from "./services/sync";
import { DecisionService } from "./services/decision";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../dashboard/public")));

// Initialize Database & Services lazily
let db: Database;
let syncService: SyncService;
let decisionService: DecisionService;
const config = loadConfig();

async function getDB() {
  if (!db) {
    db = new Database(config.databaseUrl);
    await db.initialize();
    syncService = new SyncService(config, db);
    decisionService = new DecisionService(config, db);
  }
  return db;
}

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[Backend] ${req.method} ${req.path}`);
  next();
});

// Helper to handle async route errors
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// GET /api/events and GET /api/workflows (paginated events listing)
app.get(["/api/events", "/api/workflows"], asyncHandler(async (req: Request, res: Response) => {
  const database = await getDB();
  await syncService.sync(); // Sync latest worker state

  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "10", 10);
  const offset = (page - 1) * limit;

  const events = await database.all<any>(
    `SELECT se.*, pj.state as status, pj.attempts, pj.last_error_code
     FROM source_events se
     LEFT JOIN processing_jobs pj ON se.id = pj.source_event_id
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const total = await database.get<{ count: number }>("SELECT COUNT(*) as count FROM source_events");

  res.status(200).json({
    data: events.map(e => ({
      id: e.id,
      chainKey: e.chain_key,
      contractAddress: e.contract_address,
      transactionHash: e.tx_hash,
      blockNumber: e.block_number,
      logIndex: e.log_index,
      eventName: e.event_name,
      status: e.status,
      attempts: e.attempts,
      lastError: e.last_error_code,
      decodedPayload: JSON.parse(e.decoded_payload || "{}"),
      detectedAt: e.detected_at
    })),
    pagination: {
      page,
      limit,
      total: total?.count || 0
    }
  });
}));

// GET /api/events/:evidenceId and GET /api/workflows/:evidenceId
app.get(["/api/events/:evidenceId", "/api/workflows/:evidenceId"], asyncHandler(async (req: Request, res: Response) => {
  const database = await getDB();
  await syncService.sync();

  const { evidenceId } = req.params;

  const event = await database.get<any>(
    `SELECT se.*, pj.state as status, pj.attempts, pj.last_error_code, vr.asc_tx_hash, vr.verification_status
     FROM source_events se
     LEFT JOIN processing_jobs pj ON se.id = pj.source_event_id
     LEFT JOIN verification_records vr ON se.id = vr.source_event_id
     WHERE se.id = ?`,
    [evidenceId]
  );

  if (!event) {
    return res.status(404).json({ error: { message: "Evidence record not found", status: 404 } });
  }

  res.status(200).json({
    id: event.id,
    chainKey: event.chain_key,
    contractAddress: event.contract_address,
    transactionHash: event.tx_hash,
    blockNumber: event.block_number,
    logIndex: event.log_index,
    eventName: event.event_name,
    status: event.status,
    attempts: event.attempts,
    lastError: event.last_error_code,
    ascTxHash: event.asc_tx_hash,
    verificationStatus: event.verification_status || "UNVERIFIED",
    decodedPayload: JSON.parse(event.decoded_payload || "{}"),
    detectedAt: event.detected_at
  });
}));

// GET /api/events/:evidenceId/timeline and GET /api/workflows/:evidenceId/evidence
app.get(["/api/events/:evidenceId/timeline", "/api/workflows/:evidenceId/evidence"], asyncHandler(async (req: Request, res: Response) => {
  const database = await getDB();
  await syncService.sync();

  const { evidenceId } = req.params;

  const event = await database.get<any>(
    `SELECT se.*, pj.state as status, pj.attempts, pj.last_error_code, vr.asc_tx_hash, vr.verification_status, vr.verified_at
     FROM source_events se
     LEFT JOIN processing_jobs pj ON se.id = pj.source_event_id
     LEFT JOIN verification_records vr ON se.id = vr.source_event_id
     WHERE se.id = ?`,
    [evidenceId]
  );

  if (!event) {
    return res.status(404).json({ error: { message: "Evidence record not found", status: 404 } });
  }

  // Build chronological stages
  const timeline = [
    { stage: "DETECTED", timestamp: event.detected_at, status: "COMPLETED" }
  ];

  if (event.status !== "DETECTED") {
    timeline.push({
      stage: "WAITING_FOR_ATTESTATION",
      timestamp: event.detected_at,
      status: event.status === "WAITING_FOR_ATTESTATION" ? "IN_PROGRESS" : "COMPLETED"
    });
  }

  if (event.verification_status === "VERIFIED") {
    timeline.push({
      stage: "PROOF_GENERATED",
      timestamp: event.verified_at,
      status: "COMPLETED"
    });
    timeline.push({
      stage: "VERIFIED_ON_CREDITCOIN",
      timestamp: event.verified_at,
      status: "COMPLETED"
    });
  } else if (event.status === "FAILED_FINAL") {
    timeline.push({
      stage: "FAILED",
      timestamp: new Date().toISOString(),
      status: "FAILED"
    });
  }

  res.status(200).json({ evidenceId, timeline });
}));

// POST /api/ai/decisions/:evidenceId (Triggers/retries AI processing for verified fact)
app.post("/api/ai/decisions/:evidenceId", asyncHandler(async (req: Request, res: Response) => {
  const database = await getDB();
  await syncService.sync();

  const { evidenceId } = req.params;

  const event = await database.get<any>(
    `SELECT se.*, vr.verification_status
     FROM source_events se
     LEFT JOIN verification_records vr ON se.id = vr.source_event_id
     WHERE se.id = ?`,
    [evidenceId]
  );

  if (!event) {
    return res.status(404).json({ error: { message: "Evidence record not found", status: 404 } });
  }

  // Refuse unverified evidence
  if (event.verification_status !== "VERIFIED") {
    return res.status(400).json({ error: { message: "Cannot run AI processing on unverified evidence", status: 400 } });
  }

  const payload = JSON.parse(event.decoded_payload || "{}");
  const decisionResult = await decisionService.generateAndSignDecision(
    evidenceId,
    payload.subject || ethers.ZeroAddress,
    payload.signalValue || 0
  );

  res.status(201).json(decisionResult);
}));

// GET /api/decisions/:evidenceId and GET /api/executions/:evidenceId
app.get(["/api/decisions/:evidenceId", "/api/executions/:evidenceId"], asyncHandler(async (req: Request, res: Response) => {
  const database = await getDB();
  const { evidenceId } = req.params;

  const decision = await database.get<any>("SELECT * FROM ai_decisions WHERE id = ?", [evidenceId]);

  if (!decision) {
    return res.status(404).json({ error: { message: "Decision record not found", status: 404 } });
  }

  const parsedDecision = JSON.parse(decision.structured_output);

  res.status(200).json({
    evidenceId: decision.id,
    decisionId: decision.decision_id,
    decision: parsedDecision.decision,
    score: parsedDecision.score,
    action: parsedDecision.action,
    limit: parsedDecision.limit,
    reasoning: parsedDecision.reasoning_summary,
    signature: parsedDecision.signature,
    expiresAt: parsedDecision.expiresAt,
    modelVersion: decision.model_metadata,
    policyStatus: decision.policy_status,
    createdAt: decision.created_at
  });
}));

// POST /api/demo/submit-event (Simulates emitting a cross-chain event and running it through the pipeline)
app.post("/api/demo/submit-event", asyncHandler(async (req: Request, res: Response) => {
  const database = await getDB();
  const { subject, signalValue } = req.body;

  if (!subject || typeof signalValue !== "number") {
    return res.status(400).json({ error: { message: "Invalid parameters. Required: subject (address), signalValue (number).", status: 400 } });
  }

  const signalId = ethers.hexlify(ethers.randomBytes(32));
  const txHash = ethers.hexlify(ethers.randomBytes(32));
  
  // Read and update the mock jobs JSON file
  const jsonDbPath = "proofmind_jobs.json";
  let jobs: any[] = [];
  if (fs.existsSync(jsonDbPath)) {
    try {
      jobs = JSON.parse(fs.readFileSync(jsonDbPath, "utf-8"));
    } catch {}
  }

  const newJob = {
    id: `1_200_${txHash}_0`,
    chainKey: 1,
    contractAddress: config.sourceContractAddress,
    transactionHash: txHash,
    blockNumber: 200,
    logIndex: 0,
    eventName: "RiskSignalSubmitted",
    encodedData: ethers.AbiCoder.defaultAbiCoder().encode(
      ["bytes32", "address", "uint256"],
      [signalId, subject, signalValue]
    ),
    status: "EXECUTED",
    attempts: 1,
    ascTxHash: ethers.hexlify(ethers.randomBytes(32)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  jobs.push(newJob);
  fs.writeFileSync(jsonDbPath, JSON.stringify(jobs, null, 2), "utf-8");

  // Sync to SQLite db
  await syncService.sync();

  res.status(201).json({
    message: "Event simulated successfully",
    signalId,
    transactionHash: txHash
  });
}));

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Backend Error]", err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      status
    }
  });
});

export default app;
export { getDB };
