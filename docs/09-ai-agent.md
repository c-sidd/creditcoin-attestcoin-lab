# 09 — AI Agent

## Role

The AI agent interprets a `VerifiedFact`. It does not establish whether the source-chain transaction is real; that responsibility belongs to Attestcoin verification.

## Input contract

The model receives only normalized fields required for the decision, for example:

- evidence ID
- source chain ID
- source transaction hash
- event type
- verified sender/account
- verified numeric signal
- source block number
- verification timestamp
- optional application context that is explicitly marked as non-verified

The AI must be able to distinguish **verified protocol evidence** from contextual metadata.

## Output contract

```json
{
  "decision": "ALLOW|REVIEW|REJECT",
  "score": 0,
  "reasonCodes": ["CODE"],
  "action": "NO_ACTION|APPROVE_LIMIT|FLAG_REVIEW",
  "limit": "0",
  "evidenceId": "ev_...",
  "modelVersion": "proofmind-model-v1"
}
```

## Decision rules

- `decision` must be one of the enumerated values.
- `score` must be within the configured range.
- `reasonCodes` must come from an allowlist.
- `action` must be compatible with `decision`.
- `limit` must respect application bounds.
- `evidenceId` must refer to a verified fact.
- `modelVersion` is required for reproducibility.

## Prompt design

The system prompt should explicitly state:

1. Treat verified fields as authoritative inputs.
2. Never claim that an unverified field was proven by Attestcoin.
3. Return JSON only for the machine-readable response.
4. Select only allowed actions.
5. Prefer `REVIEW` when required information is missing or ambiguous.

## AI failure policy

Malformed output, timeout, provider failure, or unavailable model must not trigger an on-chain action. The verified fact remains queued for retry.

## Explainability

The UI may display a natural-language explanation generated from the structured reason codes. The smart contract must consume structured fields, not prose.

## Determinism boundary

The exact model may evolve. The contract-facing schema must not. Model changes require a new `modelVersion` and regression tests against representative verified facts.
