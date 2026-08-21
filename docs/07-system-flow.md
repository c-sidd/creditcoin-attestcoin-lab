# 07 — System Flow

## Happy path

```text
1. User submits source-chain transaction
2. Source contract validates input
3. Source contract emits RiskSignalSubmitted
4. Worker receives event
5. Worker stores event as DETECTED
6. Worker checks attestation status
7. Worker waits until block is attested
8. Worker requests proof material
9. Worker validates proof response shape
10. Worker calls ASC on Creditcoin
11. ASC verifies Merkle + continuity proof
12. ASC extracts/validates event data
13. ASC emits VerifiedEvent
14. Backend records VerifiedFact
15. AI service analyzes VerifiedFact
16. AI returns structured decision
17. Backend validates decision schema
18. Decision contract receives bounded decision
19. Contract checks replay, expiry, limits and authorization
20. Contract executes allowed action
21. Contract emits DecisionExecuted
22. Dashboard updates to COMPLETED
```

## State machine

```text
DETECTED
  ↓
WAITING_FOR_ATTESTATION
  ↓
PROOF_REQUESTED
  ↓
PROOF_READY
  ↓
VERIFICATION_SUBMITTED
  ↓
VERIFIED
  ↓
AI_PENDING
  ↓
AI_DECIDED
  ↓
EXECUTION_SUBMITTED
  ↓
EXECUTED
```

Failure states should be recoverable:

```text
WAITING_FOR_ATTESTATION ──retry──► WAITING_FOR_ATTESTATION
PROOF_REQUESTED ──────────retry──► PROOF_REQUESTED
VERIFICATION_SUBMITTED ───retry──► VERIFICATION_SUBMITTED
AI_PENDING ────────────────retry──► AI_PENDING
EXECUTION_SUBMITTED ──────retry──► EXECUTION_SUBMITTED
```

## Idempotency

The primary event identity should be derived from immutable source information, for example:

`sourceChainId + sourceTxHash + logIndex + eventType`

The same identity must not produce two successful decision executions.

## User experience

The user signs only the source-chain transaction in the normal worker-assisted flow. The dashboard then shows progress asynchronously. If a stage fails, the user sees a human-readable status while the worker can retry in the background.
