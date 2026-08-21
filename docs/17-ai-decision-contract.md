# 17 — AI Decision Contract

## Purpose

The AI decision contract is the deterministic enforcement layer after model inference. It turns a model response into a permitted blockchain state transition only when every rule passes.

## Inputs

- `evidenceId`
- `decision`
- `score`
- `action`
- `limit`
- `modelVersion`
- `deadline`
- optional decision nonce/signature depending on the chosen backend design

## Validation sequence

```text
caller authorized?
      ↓ yes
 evidence verified?
      ↓ yes
 evidence already executed?
      ↓ no
 decision enum valid?
      ↓ yes
 action compatible?
      ↓ yes
 score in range?
      ↓ yes
 limit in range?
      ↓ yes
 deadline valid?
      ↓ yes
 execute
```

## Action allowlist

For MVP keep the action vocabulary tiny:

- `NO_ACTION`
- `APPROVE_LIMIT`
- `FLAG_REVIEW`

Do not expose arbitrary contract calls to the AI.

## Policy example

```text
ALLOW + APPROVE_LIMIT → limit <= MAX_LIMIT
REVIEW + FLAG_REVIEW → record review state only
REJECT + NO_ACTION → record rejection
```

## Replay protection

Maintain a mapping such as:

`executed[evidenceId] = true`

Set it only after all checks pass and before/atomically with the state transition as appropriate for the implementation.

## AI signature option

If the architecture requires the backend to authorize execution separately from the public AI API, use a dedicated signing key and verify the signature on-chain. The signature proves authorization by the backend; it does not prove that the AI was correct. Attestcoin remains the data-authenticity layer.

## Event

Emit a structured event after successful execution so the worker/backend/dashboard can reconcile final state.
