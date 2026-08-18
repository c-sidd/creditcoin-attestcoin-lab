# 09 — AI Agent System

## Role

ProofMind uses AI as a **financial interpretation layer**, not as the source of truth or the final transaction authority.

The AI receives normalized `VerifiedFact` data only after the Attestcoin verification boundary has succeeded. The model must be able to distinguish verified protocol evidence from unverified application context.

## Multi-agent architecture

### 1. Financial Analyst Agent

Transforms verified facts into a structured financial profile.

Inputs may include:

- evidence IDs;
- source chain identifiers;
- verified account/address;
- verified assets;
- verified liabilities;
- verified repayment/liquidation events;
- source block and transaction references;
- verification timestamps.

Outputs:

- normalized observations;
- missing-data indicators;
- financial profile summary;
- evidence references.

### 2. Risk Agent

Interprets the financial profile and identifies risk factors.

Outputs:

- risk level;
- risk score within configured bounds;
- risk reason codes;
- recommended review status.

### 3. Fraud/Anomaly Agent

Looks for unusual combinations or changes in the verified dataset.

It must use cautious language and structured indicators. It must not independently label a user fraudulent or authorize punitive action.

### 4. Credit Agent

Combines the verified profile, risk analysis and deterministic metrics into a bounded credit recommendation.

Possible outputs:

- recommended credit limit;
- risk tier;
- recommendation status;
- reason codes;
- evidence references.

### 5. Policy Agent

Converts the recommendation into a machine-readable transaction intent that can be submitted to the Creditcoin business contract.

The Policy Agent is not the final authorization layer. The smart contract independently checks its own rules.

## Deterministic companion engine

AI is complemented by deterministic calculations wherever possible. The implementation should calculate documented metrics such as collateral ratio, utilization, debt exposure, concentration and scenario health before asking the agents to interpret them.

AI may explain or combine these signals, but it must not silently replace deterministic formulas with a model guess.

## Scenario simulation

The system may evaluate explicit hypothetical inputs such as:

- collateral decreases by X%;
- debt increases by Y;
- exposure crosses a configured threshold.

The simulator evaluates documented formulas and policies. It does not claim to predict future market behavior.

## Agent output contract

The contract-facing output should remain stable even if the model/provider changes.

```json
{
  "decision": "APPROVE_WITH_LIMIT|REVIEW|REJECT",
  "riskLevel": "LOW|MEDIUM|HIGH|UNKNOWN",
  "riskScore": 0,
  "recommendedCreditLimit": "0",
  "reasonCodes": ["CODE"],
  "evidenceIds": ["ev_..."],
  "scenarioStatus": "SAFE|WARNING|REVIEW|NOT_RUN",
  "action": "NO_ACTION|PROPOSE_CREDIT|FLAG_REVIEW",
  "modelVersion": "proofmind-multi-agent-v2"
}
```

This schema is **Project Design**, not a Creditcoin protocol interface.

## Rules

- Verified fields are authoritative inputs for source-chain claims.
- AI must never claim an unverified field was proven by Attestcoin.
- Every evidence reference must point to a verified fact for contract-facing decisions.
- JSON output must be schema validated.
- Reason codes must come from an allowlist.
- Numeric values must respect configured bounds.
- Missing or ambiguous information should result in `REVIEW`, not fabricated certainty.
- The AI cannot select arbitrary contract methods or arbitrary token transfers.
- Provider/model failure cannot trigger execution.
- The final smart contract must enforce hard policy independently.

## Provider strategy

The application uses a provider abstraction so development and submission models can change without changing the contract-facing schema.

For testing, a deterministic mock provider should be available. A Groq-hosted Llama model can be used for development/testing when configured. The final submission may use an OpenAI model/provider if desired, without changing the verified-data or policy boundaries.

API keys must be supplied through environment variables and never committed.

## Explainability

The dashboard should show:

1. which verified evidence was supplied;
2. deterministic metrics used;
3. which agents ran;
4. structured agent outputs;
5. reason codes;
6. simulation result, if run;
7. policy decision;
8. final transaction hash/status.

Natural-language explanations are presentation only. The smart contract consumes structured fields, not prose.

## Failure policy

Malformed output, timeout, provider failure, unavailable model, missing evidence or failed schema validation must produce **no on-chain action**. The workflow remains retryable or enters manual review.

## Determinism boundary

The exact model can evolve. The verified evidence format, contract-facing schema, policy constraints and security checks must remain stable. A model change requires a new `modelVersion` and regression tests against representative verified datasets.
