# 26 — Data Model and Worker State Machine

## Canonical event identity

Every source-chain event must have a deterministic identity. A practical identifier is derived from:

```text
sourceChainKey + blockNumber + transactionHash + logIndex
```

Do not use only the transaction hash because a transaction can emit multiple relevant logs.

## Event record

Suggested fields:

| Field | Purpose |
|---|---|
| id | internal database ID |
| event_id | deterministic source event identity |
| chain_key | Attestcoin source chain key |
| contract_address | source contract |
| transaction_hash | source transaction |
| block_number | source block |
| log_index | event position |
| event_name | ProofMind event name |
| encoded_data | data needed by proof flow |
| status | worker state |
| attempts | retry count |
| last_error | diagnostic information |
| created_at | discovery time |
| updated_at | last state update |

## State machine

```text
DETECTED
  ├─ retry → DETECTED
  └─ success → WAITING_FOR_ATTESTATION

WAITING_FOR_ATTESTATION
  ├─ not ready → WAITING_FOR_ATTESTATION
  └─ ready → ATTESTED

ATTESTED
  └─ request → PROOF_REQUESTED

PROOF_REQUESTED
  ├─ temporary failure → PROOF_RETRY
  └─ success → PROOF_RECEIVED

PROOF_RETRY
  └─ backoff → PROOF_REQUESTED

PROOF_RECEIVED
  └─ submit → ASC_SUBMITTED

ASC_SUBMITTED
  ├─ reverted → ASC_FAILED
  └─ confirmed → EXECUTED

ASC_FAILED
  └─ retry policy → ASC_SUBMITTED
```

## Idempotency

Before submitting an ASC transaction, the worker must check whether the event is already:
- executed locally
- submitted with a pending transaction
- marked as processed by the ASC contract

The contract remains the final replay-protection authority. The worker's database is an operational safety layer, not a trust layer.

## Recovery

On startup the worker must query persisted records for non-terminal states and resume them. It must also scan a configurable recent block range to catch events discovered during downtime.

## Retry policy

Use bounded exponential backoff with jitter. Permanent validation errors should not retry forever. Store the final error and expose it to operators.
