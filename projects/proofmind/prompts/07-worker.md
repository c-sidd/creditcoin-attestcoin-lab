# Prompt 07 — Durable Readability Worker

```text
Implement the worker as a persistent state machine.

States must cover at minimum:
DETECTED → WAITING_ATTESTATION → PROOF_REQUESTED → PROOF_READY → ASC_SUBMITTED → CONFIRMED, plus RETRYABLE_FAILURE and PERMANENT_FAILURE.

Persist enough data to recover after process restart.

Implement:
- source event polling/subscription
- historical catch-up
- attestation polling
- Proof Builder client boundary
- ASC transaction submission
- receipt confirmation
- retry/backoff
- duplicate prevention
- multiple RPC endpoint support where configured
- structured logging
- graceful shutdown

Unit-test every state transition and failure path.

Gate: PASS only when restart/catch-up/idempotency tests pass.
```
