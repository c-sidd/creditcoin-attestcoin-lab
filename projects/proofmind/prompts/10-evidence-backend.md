# Prompt 10 — Evidence Backend

```text
Implement a small backend that stores the lifecycle of each ProofMind cross-chain event.

Persist:
- source transaction/event identity
- attestation status
- proof status
- verification result
- VerifiedFact
- AI decision
- policy result
- execution transaction
- timestamps/errors/retry counts

Expose read APIs for the dashboard. Keep write permissions restricted to trusted application services.

Add schema validation, database migrations, API tests, and failure handling.

Gate: PASS only when a complete lifecycle can be stored and retrieved without exposing secrets or allowing an execution bypass.
```
