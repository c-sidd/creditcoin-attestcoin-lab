# 12 — Offchain Readability Worker

## Purpose

The worker is the automation layer between source-chain events and the Creditcoin ASC. The supplied Attestcoin documentation describes the worker as responsible for monitoring events, waiting for attestation, obtaining proofs, submitting the ASC call, retrying failures, tracking status, and preventing duplicates.

## Worker loop

```text
poll/listen source chain
        ↓
find new event
        ↓
create durable event record
        ↓
check attestation
        ↓
request proof
        ↓
submit ASC transaction
        ↓
wait for receipt
        ↓
mark VERIFIED
        ↓
queue AI decision
```

## Durable state

Never keep the only copy of processing state in memory. Persist:

- event identity
- first-seen time
- source block
- attestation status
- proof request ID/status
- ASC tx hash
- verification result
- AI status
- decision ID
- final execution tx hash
- retry count
- last error

## Retry policy

Use exponential backoff with a maximum delay and a maximum retry count for transient failures. Permanent validation failures should move to `FAILED_FINAL` and require manual inspection.

## Crash recovery

On startup the worker should:

1. Load incomplete records.
2. Reconcile source-chain events from a safe lookback range.
3. Check whether an ASC transaction already succeeded.
4. Resume from the earliest incomplete state.

## Duplicate prevention

Use a database uniqueness constraint on the canonical event identity. The smart contract must provide a second replay-protection layer.

## Multiple RPC nodes

The supplied Attestcoin worker guidance recommends following multiple source-chain nodes where practical. For the MVP, implement a provider abstraction so a second RPC can be added without rewriting event processing.

## Observability

Every processing attempt should include a correlation/evidence ID. Logs should use structured JSON and include stage, event ID, attempt number, duration, and error category.
