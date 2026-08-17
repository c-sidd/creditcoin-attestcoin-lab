# Prompt 17 — Retry, Idempotency and Recovery

Harden the worker so every event has a durable state machine and a stable identity. Design retry policies by failure class: transient network/service errors, not-yet-attested state, transaction replacement, permanent validation failure.

Guarantee no intentional duplicate ASC submission for the same event. Re-running after shutdown must resume safely. Keep an auditable attempt history without exposing secrets.

Test crash/restart at every stage, duplicate events, duplicate jobs, repeated API responses, and failed transactions. Document recovery semantics.