import { ethers } from "ethers";
import { Config } from "../../../worker/src/config";
import { Database } from "../database/db";
import { AIFactory } from "../ai/factory";
import { AIDecisionInput, AIDecisionOutput } from "../ai/provider";

export class DecisionService {
  private config: Config;
  private db: Database;
  private wallet: ethers.Wallet;

  constructor(config: Config, db: Database) {
    this.config = config;
    this.db = db;
    // Use creditcoinPrivateKey to sign AI proposals
    this.wallet = new ethers.Wallet(config.creditcoinPrivateKey);
  }

  /**
   * Generates a signed AI decision for a verified cross-chain evidence ID (signal ID).
   */
  async generateAndSignDecision(evidenceId: string, subject: string, signalValue: number): Promise<any> {
    const aiProvider = AIFactory.create(this.config);

    const input: AIDecisionInput = {
      evidenceId,
      subject,
      signalValue,
      timestamp: Math.floor(Date.now() / 1000)
    };

    console.log(`[DecisionService] Running AI engine for evidence: ${evidenceId}, subject: ${subject}`);
    const aiOutput: AIDecisionOutput = await aiProvider.generateDecision(input);

    // Map Decision enum
    const decisionEnumMap = {
      "REJECT": 0,
      "ALLOW": 1,
      "REVIEW": 2
    };
    const decisionVal = decisionEnumMap[aiOutput.decision];

    // Map Action enum
    const actionEnumMap = {
      "NO_ACTION": 0,
      "APPROVE_LIMIT": 1,
      "FLAG_REVIEW": 2
    };
    const actionVal = actionEnumMap[aiOutput.action];

    // Build the solidity packed message hash
    const messageHash = ethers.solidityPackedKeccak256(
      ["bytes32", "uint8", "uint256", "uint8", "uint256", "string", "uint256"],
      [
        evidenceId,
        decisionVal,
        aiOutput.score,
        actionVal,
        aiOutput.limit,
        aiOutput.modelVersion,
        aiOutput.expiresAt
      ]
    );

    console.log(`[DecisionService] Signing decision with address: ${this.wallet.address}`);
    const signature = await this.wallet.signMessage(ethers.getBytes(messageHash));

    const decisionRecord = {
      id: evidenceId,
      decision_id: `dec_${evidenceId}_${Date.now()}`,
      evidence_ids: evidenceId,
      model_metadata: aiOutput.modelVersion,
      structured_output: JSON.stringify({
        decision: aiOutput.decision,
        score: aiOutput.score,
        action: aiOutput.action,
        limit: aiOutput.limit,
        reasoning_summary: aiOutput.reasoning_summary,
        expiresAt: aiOutput.expiresAt,
        signature
      }),
      policy_status: aiOutput.decision === "REJECT" ? "FAILED" : "PASSED",
      created_at: new Date().toISOString()
    };

    // Store in sqlite db
    await this.db.run(
      `INSERT OR REPLACE INTO ai_decisions (id, decision_id, evidence_ids, model_metadata, structured_output, policy_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        decisionRecord.id,
        decisionRecord.decision_id,
        decisionRecord.evidence_ids,
        decisionRecord.model_metadata,
        decisionRecord.structured_output,
        decisionRecord.policy_status,
        decisionRecord.created_at
      ]
    );

    return {
      evidenceId,
      decision: aiOutput.decision,
      score: aiOutput.score,
      action: aiOutput.action,
      limit: aiOutput.limit,
      reasoning: aiOutput.reasoning_summary,
      signature,
      expiresAt: aiOutput.expiresAt,
      modelVersion: aiOutput.modelVersion
    };
  }
}
