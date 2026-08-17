# 29 — Testing Strategy

ProofMind is a cross-chain system, so tests must cover each boundary independently before attempting the complete demo.

## Contract unit tests

### Source contract

Test:
- valid event emission
- invalid input rejection
- correct event fields
- deterministic event identity inputs

### ASC

Test:
- valid proof accepted
- invalid Merkle proof rejected
- invalid continuity proof rejected
- malformed encoded transaction rejected
- unsupported source contract rejected
- duplicate event rejected
- unauthorized caller rejected
- business logic failure handled correctly

### Decision contract

Test:
- authorized ASC call
- unauthorized caller
- score below threshold
- score at threshold
- amount above maximum
- expired decision
- already executed fact
- unsupported action
- valid execution

## Worker tests

Mock external services and test:
- event detection
- restart recovery
- duplicate event detection
- attestation polling
- proof-builder success/failure
- exponential retry
- ASC transaction submission
- receipt confirmation
- permanent error handling

## AI tests

Test:
- valid JSON
- malformed JSON
- missing field
- wrong enum
- score out of range
- amount too large
- expired output
- prompt/provider failure
- deterministic mock behavior

## API tests

Test:
- health endpoint
- event list/filtering
- event detail
- timeline
- verified fact endpoint
- decision endpoint
- consistent error responses

## End-to-end test

The final testnet scenario should prove:

```text
User
 → Sepolia source transaction
 → ProofMind event
 → Worker detection
 → Attestation
 → Proof Builder
 → ASC verification
 → VerifiedFact
 → AI decision
 → Decision contract
 → Creditcoin state update
```

Record every public transaction hash needed for the demo.

## Security regression suite

Every bug involving trust boundaries must become a regression test. Never fix a replay, authorization, validation, or proof issue only in application code without testing the relevant boundary.
