# 17 — AI Decision Contract

## Purpose

This contract is the deterministic enforcement boundary between ProofMind's AI/risk recommendation and Creditcoin state changes.

The AI does **not** authorize itself. It produces a bounded proposal. The contract independently validates the proposal against on-chain policy and the referenced verified evidence.

## Inputs

Conceptual project-design inputs:

- one or more `evidenceId` values;
- decision enum;
- risk level/score;
- recommended credit limit;
- supported action;
- model version;
- decision expiry/deadline;
- nonce/replay identifier;
- optional backend signature if the selected architecture requires it.

These are ProofMind interfaces, not Creditcoin protocol interfaces.

## Validation sequence

```text
caller authorized?
      ↓
evidence exists and is verified?
      ↓
evidence fresh enough?
      ↓
evidence/intent already executed?
      ↓
decision enum valid?
      ↓
action allowlisted?
      ↓
risk score in configured range?
      ↓
credit limit within configured bounds?
      ↓
deadline valid?
      ↓
application invariants pass?
      ↓
execute allowed state transition
```

Any failed condition must revert or enter the documented non-execution state.

## Action allowlist

For MVP keep the vocabulary deliberately small:

- `NO_ACTION`
- `PROPOSE_CREDIT`
- `FLAG_REVIEW`

Do not expose arbitrary target addresses, function selectors, calldata or generic `execute(target,data)` functionality to the AI.

## Policy example

```text
APPROVE_WITH_LIMIT + PROPOSE_CREDIT
    → limit <= MAX_CREDIT_LIMIT
    → risk score satisfies configured threshold
    → evidence is fresh

REVIEW + FLAG_REVIEW
    → record review state only

REJECT + NO_ACTION
    → record rejection
```

The actual thresholds are Project Design and must be defined in configuration/tests before deployment.

## Replay protection

Use a canonical evidence/intent identity and reject an already executed identity. The worker may also maintain off-chain idempotency state, but on-chain replay protection remains authoritative.

## AI signature option

If a backend signature is used, it proves that the configured backend authorized submission. It does **not** prove that the model was correct. Attestcoin remains the cross-chain evidence trust boundary and the smart contract remains the final policy authority.

## Events

Emit structured events sufficient for the backend/dashboard to reconcile:

- evidence/intent identity;
- accepted/rejected policy result;
- action;
- bounded amount where applicable;
- final execution state.

## Security rules

- Never trust model prose.
- Never accept an unverified evidence ID.
- Never allow arbitrary contract calls.
- Never skip expiry or replay checks.
- Never make provider availability an authorization condition.
