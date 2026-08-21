# ProofMind AI Model Strategy

## Status

**Project decision — implementation phase**

For the hackathon, ProofMind uses **Groq + Llama for development/testing** and switches to a **verified OpenAI model for the final submission/demo build**.

The architecture must keep the AI provider replaceable so this change requires configuration, not a rewrite of the application.

## Provider strategy

### Phase A — Development and testing

Use:

```env
AI_PROVIDER=groq
AI_MODEL=<verified-llama-model-id>
```

Groq is the default provider while implementing and testing the system because it is convenient for rapid iteration.

All unit tests, integration tests, worker tests, and end-to-end development flows should work with the Groq provider first.

### Phase B — Final hackathon build

Before the final submission/demo, switch to:

```env
AI_PROVIDER=openai
AI_MODEL=<verified-openai-model-id>
```

The exact OpenAI model identifier must be verified against the currently available OpenAI API/model catalogue before the final build. Do **not** hard-code an assumed model name such as `luna` unless the actual API account exposes that model.

The final OpenAI model should be selected for **reasoning quality, structured-output reliability, and demo quality**, rather than primarily for cost.

## Required abstraction

The application must conceptually expose:

```text
AIProvider
  ├── GroqProvider
  └── OpenAIProvider
```

The decision engine consumes the abstract provider interface. Provider SDK calls must not be scattered throughout the worker, backend, or business-logic code.

Changing:

```env
AI_PROVIDER=groq
```

to:

```env
AI_PROVIDER=openai
```

must be sufficient to select the provider, together with the corresponding model configuration.

## Testing policy

During normal implementation:

1. Run development tests with Groq.
2. Validate structured AI output.
3. Validate malformed-output handling.
4. Validate timeout/retry behavior.
5. Validate deterministic policy checks after AI output.
6. Validate that AI output cannot bypass Attestcoin verification.
7. Validate the complete worker → proof → ASC → business-logic flow independently of the model provider.

The tests must not assume that Groq is the permanent production provider.

## Final-provider verification gate

Before submission, stop implementation and perform a dedicated provider verification:

- Verify the current OpenAI API interface from authoritative OpenAI documentation.
- Verify the selected model ID is available to the project's API account.
- Verify authentication works.
- Verify the model supports the required structured-output behavior.
- Run the full ProofMind test suite using the OpenAI provider.
- Run the complete end-to-end demo flow using OpenAI.
- Record the verified provider/model in project status and decisions documentation.

Only after these checks pass should the final build be considered submission-ready.

## AI responsibilities

The model reasons over data that has already been classified by the system as verified/attested according to the ProofMind protocol flow.

The model must NOT:

- create cryptographic proofs;
- claim that an unverified event is verified;
- bypass Attestcoin verification;
- directly mutate blockchain state;
- hold authority to execute arbitrary contract calls;
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

Application code must validate the exact implementation schema before any transaction intent is accepted.

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

**AI output is not proof. AI reasoning cannot replace Attestcoin verification.**

## Configuration

Development/testing:

```env
AI_PROVIDER=groq
AI_MODEL=<verified-llama-model-id>
```

Final build:

```env
AI_PROVIDER=openai
AI_MODEL=<verified-openai-model-id>
```

Optional fallback configuration may exist, but provider switching must be explicit and observable. The implementation must fail clearly when a configured model is unavailable rather than silently selecting an unknown model.

## Cost policy

For the hackathon, **cost optimization is secondary to correctness, reliability, reasoning quality, and demonstration quality**.

Use Groq during implementation/testing, then use the strongest suitable verified OpenAI model available to the project for the final submission.

Do not introduce aggressive caching, tiny models, or restrictive token limits solely to reduce cost if they harm the final demonstration.

## Reliability requirements

AI calls must have:

- timeout handling;
- bounded retries;
- structured-output validation;
- malformed-output handling;
- provider error logging without exposing secrets;
- request/response metadata suitable for debugging;
- deterministic policy validation after model output.

API keys must never be stored in evidence, logs, Git, or frontend code.

## Reproducibility and auditability

Every AI decision recorded by ProofMind should retain enough metadata to audit the decision, including:

- provider;
- model identifier;
- prompt/version identifier;
- timestamp;
- input data hash/reference where appropriate;
- structured output;
- validation result;
- resulting transaction intent;
- final blockchain transaction hash when execution occurs.

Do not rely on model prose as the only audit record.

## Implementation rule

Before integrating or changing an AI SDK, Antigravity must:

1. inspect the current ProofMind documentation;
2. verify the provider's current API interface from authoritative documentation;
3. verify the configured model actually exists and is accessible;
4. keep the provider behind the ProofMind AI abstraction;
5. add schema-validation tests;
6. add provider failure/retry tests;
7. run the full test suite;
8. update `PROJECT_STATUS.md` and `DECISIONS.md` if the provider/model strategy changes.

## Decision summary

**Development/testing provider:** Groq + verified Llama model.

**Final submission provider:** OpenAI + strongest suitable verified model available to the project.

**Architecture:** provider-agnostic AI adapter.

**Priority:** verified-data integrity → correctness → reasoning quality → demo reliability → cost optimization.
