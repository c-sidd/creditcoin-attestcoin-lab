# ProofMind AI Model Strategy

## Status

**Project decision — implementation phase**

The ProofMind team is optimizing for hackathon quality, reasoning quality, reliability, and demo impact rather than minimizing model/API cost during the ideathon build.

## Primary AI direction

Use a strong OpenAI model as the **primary reasoning model** for ProofMind during development and the final demo.

The exact model identifier must be configured through an environment variable and verified against the currently available OpenAI API/model catalogue before implementation. Do **not** hard-code an assumed model name such as `luna` unless the actual API account exposes that model.

### Why this is the primary direction

- Strong reasoning is more important than minimizing inference cost for the hackathon.
- ProofMind needs reliable structured decisions from verified cross-chain data.
- The AI must explain why a decision was made, not merely produce a classification.
- The final demo should make the AI → verified data → blockchain execution relationship obvious.

## Groq + Llama

Groq-hosted Llama models are a valid **secondary/fallback provider** and may be used during development, rapid iteration, or as a fallback if the primary provider is unavailable.

Groq/Llama is **not the architectural dependency**. The AI layer must use a provider/model adapter so that switching between OpenAI and Groq does not require changing the worker, contracts, evidence system, or dashboard.

## Required abstraction

The application must conceptually expose:

```text
AIProvider
  ├── OpenAIProvider
  └── GroqProvider
```

The decision engine consumes an abstract provider rather than importing a provider SDK throughout the codebase.

## AI responsibilities

The model is responsible for reasoning over data that has already been classified by the system as verified/attested according to the ProofMind protocol flow.

The model must NOT:

- create cryptographic proofs;
- claim that an unverified event is verified;
- bypass Attestcoin verification;
- directly mutate blockchain state;
- hold the authority to execute arbitrary contract calls;
- invent transaction hashes, block numbers, proof values, balances, or protocol responses.

The model produces a **structured decision/transaction intent**. Deterministic application policy and smart contracts remain the enforcement boundary.

## Required AI output boundary

The AI output should be schema-constrained and contain fields equivalent to:

```json
{
  "decision": "string",
  "confidence": 0.0,
  "reasoning_summary": "string",
  "source_event_reference": "string",
  "verified_data": {},
  "action": "string",
  "amount": "string",
  "recipient": "string",
  "risk_flags": [],
  "requires_human_confirmation": false
}
```

The exact schema is controlled by the implementation documents and must be validated by application code before any transaction intent is accepted.

## Critical trust boundary

```text
Source-chain event
       ↓
Attestcoin Readability / proof verification
       ↓
Verified cross-chain data
       ↓
AI reasoning
       ↓
Structured decision
       ↓
Deterministic policy validation
       ↓
Smart contract
       ↓
On-chain state change
```

**Never reverse this trust relationship.** AI output is not proof. AI reasoning cannot replace Attestcoin verification.

## Model configuration

The model should be selected through configuration:

```env
AI_PROVIDER=openai
AI_MODEL=<verified-model-id>
```

Optional fallback configuration:

```env
AI_FALLBACK_PROVIDER=groq
AI_FALLBACK_MODEL=<verified-llama-model-id>
```

The implementation must fail clearly when a configured model is unavailable rather than silently switching to an unknown model.

## Cost policy for hackathon

For the hackathon implementation, **cost optimization is secondary to correctness, reliability, and demonstration quality**.

Do not prematurely introduce aggressive caching, tiny models, low token limits, or complex routing solely to reduce API spend if doing so harms reasoning quality or makes the architecture harder to demonstrate.

Cost controls can be added after the first end-to-end demo works.

## Reliability requirements

AI calls must have:

- timeout handling;
- retry policy with bounded attempts;
- structured-output validation;
- malformed-output handling;
- provider error logging without exposing secrets;
- request/response metadata suitable for evidence and debugging;
- deterministic policy validation after model output.

The raw secret/API key must never be stored in evidence or logs.

## Reproducibility

Every AI decision recorded by ProofMind should retain enough metadata to reproduce or audit the decision, including:

- provider;
- model identifier;
- prompt/version identifier;
- timestamp;
- input data hash/reference where appropriate;
- structured output;
- validation result;
- resulting transaction intent;
- final blockchain transaction hash when execution occurs.

Do not rely on the model's prose explanation as the only audit record.

## Implementation rule

Before integrating an AI SDK, Antigravity must:

1. inspect the current project documentation;
2. verify the provider's current API interface from authoritative documentation;
3. verify the configured model actually exists and is accessible;
4. add the provider behind the ProofMind AI abstraction;
5. add schema validation tests;
6. add failure/fallback tests;
7. update `DECISIONS.md` if the selected provider/model changes.

## Decision summary

**Primary:** OpenAI, using the strongest suitable currently available model accessible to the project.

**Fallback/secondary:** Groq + Llama, behind the same provider interface.

**Priority:** correctness → verified-data integrity → reasoning quality → demo reliability → cost optimization.
