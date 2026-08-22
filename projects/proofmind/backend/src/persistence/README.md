# ProofMind Backend Persistence

The backend reads evidence records directly from the shared file-based JSON store (`jobs.json`) managed by the off-chain worker. This keeps deployment simple, ensures a single source of truth for the local hackathon build, and avoids running external heavy databases.

## Schema Specifications

Each record in the database represents a cross-chain signal event and has the following schema layout:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | The source signal identifier (`signalId`). |
| `event_id` | `string` | Deterministic event ID: `${chainKey}-${blockNumber}-${txHash}-${logIndex}`. Enforces event uniqueness. |
| `chain_key` | `number` | Source chain identifier (e.g. `1` for Sepolia). |
| `contract_address` | `string` | Address of the emitting `SourceSignalEmitter` contract. |
| `transaction_hash` | `string` | Hex string hash of the transaction. |
| `block_number` | `number` | Height of the block containing the event. |
| `log_index` | `number` | Index of the log event inside the block. |
| `event_name` | `string` | Emitted event name (`RiskSignalSubmitted`). |
| `status` | `string` | Lifecycle state: `DETECTED` \| `WAITING_FOR_ATTESTATION` \| `ATTESTED` \| `PROOF_REQUESTED` \| `PROOF_RECEIVED` \| `ASC_SUBMITTED` \| `EXECUTED` \| `ASC_FAILED`. |
| `attempts` | `number` | Number of failed attempts for current stage. |
| `last_error` | `string` | Diagnostic error messages from failures. |
| `encoded_data` | `string` | JSON string containing original parameters and the verified read-proof. |

## Integrity and Concurrency
1. **Atomic Renames**: File updates use an atomic write-then-rename strategy (`fs.writeFileSync` followed by `fs.renameSync`) to ensure partial writes never corrupt the database.
2. **Idempotency**: Duplicate event entries are skipped by computing the deterministic `event_id` and performing key-lookup validation before inserting.
