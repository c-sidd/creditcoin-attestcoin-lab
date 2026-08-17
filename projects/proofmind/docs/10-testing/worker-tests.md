# Worker Tests

Cover:
- event discovery;
- duplicate event suppression;
- restart/catch-up from persisted cursor;
- waiting when attestation is not ready;
- Proof Builder transient failure and retry;
- malformed proof response;
- ASC timeout followed by transaction reconciliation;
- successful completion;
- permanent failure and operator visibility;
- two workers racing on the same event.

Use mocked protocol adapters for deterministic unit tests and a small real testnet suite for interface compatibility.
