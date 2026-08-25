# 06 — AI Provider, Agent Design & $30 Budget Strategy

## Goal

ProofMind must remain fully testable when **no LLM API key exists**. The AI model is an optional intelligence layer, not a protocol dependency.

This keeps the project reliable, protects the remaining API budget, and makes the smart-contract security argument stronger.

## Provider hierarchy

```text
                 ProofMind AI Interface
                         |
            +------------+------------+
            |            |            |
        Deterministic   Groq       OpenAI
          Mock          default     optional
            |             |            |
         Tests/CI     development   final/demo
```

### 1. Deterministic mock — default for tests

Use a deterministic policy fixture for:

- unit tests
- contract tests
- CI
- local demos without internet
- failure-path tests
- regression tests

No tokens. No network. No flaky outputs.

### 2. Groq — development/test LLM

When we need a real model during development, use Groq first because the goal is to minimize paid OpenAI usage.

The adapter must return the same strict schema as every other provider.

### 3. OpenAI — optional premium adapter

OpenAI should be available behind a provider interface but **not required** for:

- installation
- tests
- local development
- contract deployment
- deterministic demo mode

Use it only where the better model quality materially improves a final demo or evaluation.

## Provider interface

The application should conceptually expose:

```ts
interface Underwriter {
  decide(input: VerifiedEvidence): Promise<UnderwritingDecision>;
}
```

The rest of ProofMind should not know whether the provider is Mock, Groq, or OpenAI.

## AI output contract

Keep the output small and deterministic at the protocol boundary:

```json
{
  "decision": "APPROVE",
  "amount": 1000000,
  "riskBand": "LOW",
  "confidence": 0.91,
  "evidenceIds": ["proof-1", "proof-2"],
  "policyVersion": "credit-v1"
}
```

The model should not be trusted to invent evidence IDs. Evidence IDs should be selected from the verified evidence set supplied to it, then schema-checked by the backend.

## What the LLM must NOT control

The model must never directly control:

- private keys
- unrestricted contract calls
- verifier configuration
- source-chain allowlists
- policy constants
- replay protection
- contract ownership
- treasury withdrawal

The model proposes a decision. Code validates it.

## Token budget strategy — maximum $30

The $30 budget should be treated as a scarce test resource, not as the default execution path.

### Spend hierarchy

| Work | Provider | Expected cost |
|---|---|---:|
| Contract/unit tests | Mock | $0 |
| Worker tests | Mock/fixtures | $0 |
| Backend schema/policy tests | Mock | $0 |
| UI development | Mock data | $0 |
| Agent prompt iteration | Groq | low / provider-dependent |
| A few final quality comparisons | OpenAI | tightly capped |
| Final live demo | OpenAI or Groq | only if necessary |

### Rules

1. Never call an LLM inside a test loop unless the test specifically validates the provider adapter.
2. Cache model outputs for repeated local demonstrations.
3. Keep prompts short and provide only the verified evidence relevant to the decision.
4. Ask for structured JSON, not long prose.
5. Reject malformed output before it reaches policy evaluation.
6. Do not send raw Merkle proofs to the LLM. Give the model normalized verified facts plus evidence IDs.
7. Never use a paid model to prove something deterministic code can prove.
8. Keep a local fixture for the final demo so a provider outage cannot break the presentation.

## Recommended agent architecture

Use three logical agents only if they improve the decision:

### Credit Agent

Answers:

> What financing amount is supported by the verified evidence?

### Risk Agent

Answers:

> What risk constraints should apply?

### Fraud Agent

Answers:

> Is there evidence of duplication, mismatch, or suspicious structure?

Their outputs should be compact structured records. The final policy engine combines them.

If three LLM calls are too expensive, use one model call with three deterministic evaluation sections, or use deterministic rules for Risk/Fraud and reserve the LLM for the ambiguous underwriting step.

## Best cost/quality architecture

```text
Verified evidence
      |
      v
Deterministic normalization       $0
      |
      +--> deterministic fraud checks      $0
      |
      +--> deterministic policy bounds    $0
      |
      v
LLM underwriting (Groq)             low cost
      |
      v
Schema validation                   $0
      |
      v
Deterministic policy                $0
      |
      v
Creditcoin execution                chain gas
```

This is both cheaper and safer than putting the entire decision inside an LLM.

## OpenAI adapter rule

The OpenAI integration should be implemented as an optional adapter. Do not import or initialize an OpenAI client in code paths that run when `AI_PROVIDER=mock` or `AI_PROVIDER=groq`.

This allows tests and most local work to run without OpenAI credentials.

## Why this is strategically good

The judge story becomes stronger:

> **The expensive intelligence is optional; the trust boundary is deterministic.**

That is exactly what we want in an autonomous financial system.
