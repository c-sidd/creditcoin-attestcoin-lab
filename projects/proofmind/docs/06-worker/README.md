# 06 — Off-chain Readability Worker

The worker is an orchestration service. It watches the source chain, waits for attestation, obtains proofs, submits the ASC call, and records state.

## Required properties

- durable state
- restart recovery
- catch-up scanning
- duplicate detection
- retry with bounded backoff
- multiple RPC endpoints where practical
- structured logs
- correlation/event IDs
- explicit terminal states

## Worker must never

- declare data cryptographically verified itself
- bypass the ASC verification path
- silently discard failed events
- submit unlimited retries
- store private keys in source control
