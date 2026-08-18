import OpenAI from "openai";
import { AIProvider, AIDecisionInput, AIDecisionOutput } from "./provider";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o") {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateDecision(input: AIDecisionInput): Promise<AIDecisionOutput> {
    console.log(`[OpenAIProvider] Generating decision for subject ${input.subject}...`);

    const prompt = `
You are the ProofMind risk assessment agent. Analyse the following verified transaction risk signal:
Subject: ${input.subject}
Signal Value: ${input.signalValue}
Timestamp: ${input.timestamp}

Based on this, output a JSON response containing:
- decision: "ALLOW" (if signalValue <= 50), "REVIEW" (if signalValue > 50 and <= 80), or "REJECT" (if signalValue > 80).
- score: confidence score between 0 and 100 (ALLOW should be >= 70, REVIEW should be 50-70, REJECT should be < 50).
- action: "APPROVE_LIMIT" (for ALLOW), "FLAG_REVIEW" (for REVIEW), or "NO_ACTION" (for REJECT).
- limit: uint256 string representing limit in wei (e.g. 1500 * 10^18 is "1500000000000000000000" for ALLOW, "500000000000000000000" for REVIEW, "0" for REJECT).
- reasoning_summary: A short text explaining your reasoning.
`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: "You are a credit decision risk model. You must return only valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return {
      decision: parsed.decision,
      score: Number(parsed.score),
      action: parsed.action,
      limit: parsed.limit,
      reasoning_summary: parsed.reasoning_summary,
      modelVersion: this.model,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
  }
}
