# ProofMind AI Decision Engine

The ProofMind AI Decision Engine provides a provider-agnostic, schema-validated boundary that consumes verified Attestcoin fact records, invokes a configured AI model to evaluate risk, and serializes policy-approved outcomes into precise transaction intents for execution on the Creditcoin blockchain.

## Pipeline Architecture

```text
  Verified Event Fact
           ↓
  [VerifiedFactValidator]  (Checks block height, tx hash, address formats, timestamp freshness)
           ↓
  [AiDecisionService]      (Invokes LLM provider with timeouts and handles response schemas)
           ↓
  [AiRiskControls]         (Applies hard limits, risk score grey zones, and injection sanitization)
           ↓
  [IntentSerializer]       (Converts approved decisions to ABI-encoded calldata for the contract)
```

## Configuration

The decision engine determines the active provider from environment variables:
- `AI_PROVIDER`: Set to `groq` (default for development) or `openai` (for production/demo).
- `AI_MODEL`: Model identifier string (e.g. `gpt-4o` or `llama-3.3-70b-versatile`).

## Schema Contracts

### Input Schema
Input data is strictly validated to ensure it comes from a verified block and transaction log:
- `chainKey`: supported source network ID.
- `transactionHash`: hex format string.
- `blockNumber`: positive integer.
- `signalValue`: exact big-integer amount string.
- `timestamp`: freshness validated (maximum age 24 hours).

### Output Schema
The AI output format is strictly structured as follows:
```json
{
  "decision": "APPROVE" | "REJECT",
  "score": number, // 0 to 100 risk score
  "action": "ALLOW_LOAN" | "BLOCK",
  "amount": "string", // Match requested value exactly
  "reasonCodes": ["string"],
  "expiresAt": number // Future Unix timestamp
}
```

## Risk Policies
1. **Admissibility**: A decision is only admissible if risk score is `<= 70` and amount is `<= maxAllowedLimit`.
2. **Manual Review Zone**: Risk scores between `50` and `70` are approved but flagged for human/manual operator confirmation.
3. **Prompt Injection Sanitization**: Inputs containing SQL (`select `), script (`<script>`), or carriage returns are rejected immediately as suspicious.
