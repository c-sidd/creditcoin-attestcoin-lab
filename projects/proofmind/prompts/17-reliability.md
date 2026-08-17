# Prompt 17 — Reliability and Observability

```text
Harden the worker/backend lifecycle for operational failures.

Implement and test:
- structured logs with correlation/run IDs
- retry with bounded exponential backoff
- durable state transitions
- crash recovery
- historical catch-up
- RPC failover where configured
- Proof Builder timeout handling
- transaction receipt timeout handling
- dead-letter/permanent failure state
- health/readiness checks
- metrics or lightweight counters for event states

Ensure retries cannot cause duplicate execution.

Gate: PASS only after failure injection tests demonstrate safe recovery.
```
