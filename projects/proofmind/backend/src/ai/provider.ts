import { VerifiedInputFact, AiDecisionOutput } from "./types";

export interface AiProvider {
  getDecision(fact: VerifiedInputFact): Promise<AiDecisionOutput>;
}

export class FakeAiProvider implements AiProvider {
  private shouldFail: boolean;

  constructor(shouldFail = false) {
    this.shouldFail = shouldFail;
  }

  async getDecision(fact: VerifiedInputFact): Promise<AiDecisionOutput> {
    if (this.shouldFail) {
      throw new Error("Fake AI Provider simulated network failure");
    }

    const value = BigInt(fact.signalValue);
    const isApproved = value <= 50000n;

    return {
      decision: isApproved ? "APPROVE" : "REJECT",
      score: isApproved ? 25 : 85,
      action: isApproved ? "ALLOW_LOAN" : "BLOCK",
      amount: fact.signalValue,
      reasonCodes: isApproved ? ["VERIFIED_REPAYMENT_HISTORY"] : ["CREDIT_LIMIT_EXCEEDED"],
      expiresAt: Math.floor(Date.now() / 1000) + 3600
    };
  }
}

export class OpenAiCompatibleProvider implements AiProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, baseUrl: string, model: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async getDecision(fact: VerifiedInputFact): Promise<AiDecisionOutput> {
    const prompt = `
You are the ProofMind AI Credit Risk Engine. Enforce the risk assessment policy.
Analyze the following verified creditcoin transaction data:
- Chain Key: ${fact.chainKey}
- Signal ID: ${fact.signalId}
- Subject Address: ${fact.subject}
- Requested Value: ${fact.signalValue}
- Timestamp: ${fact.timestamp}

Your output must be a valid JSON object matching the exact schema below.
Schema:
{
  "decision": "APPROVE" | "REJECT",
  "score": number, // 0 to 100 risk score. Below 70 is APPROVE, above 70 is REJECT.
  "action": "ALLOW_LOAN" | "BLOCK",
  "amount": "string", // Must match Requested Value: ${fact.signalValue}
  "reasonCodes": ["string"],
  "expiresAt": number // Unix timestamp representing expiry (e.g. current time + 3600 seconds)
}
`;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: "You are a credit decision API that only outputs JSON matching the schema requested." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AI API request failed: ${res.statusText} - ${errText}`);
    }

    const json: any = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty message content returned from AI API");
    }

    return JSON.parse(content) as AiDecisionOutput;
  }
}
