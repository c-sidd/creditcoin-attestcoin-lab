# 13 — Data Flow

## Data lineage

The system should preserve a clear lineage for every decision:

```text
Source event
  │ sourceTxHash + logIndex
  ▼
ObservedEvent
  │
  ▼
ProofRequest
  │ Merkle + continuity proof metadata
  ▼
ASCVerification
  │ verificationTxHash
  ▼
VerifiedFact
  │ evidenceId
  ▼
AIDecision
  │ modelVersion + reasonCodes
  ▼
DecisionExecution
  │ executionTxHash
  ▼
Dashboard timeline
```

## Database entities

### `source_events`

Stores immutable observation metadata and processing status.

### `proof_jobs`

Stores proof request status, timestamps, response metadata, and errors. Do not store unnecessary secret material.

### `verified_facts`

Stores normalized fields confirmed by the ASC and the verification transaction hash.

### `ai_decisions`

Stores structured model output, model version, prompt/version identifier if appropriate, and decision status.

### `executions`

Stores Creditcoin transaction hash, action, result, and confirmation status.

## Evidence timeline

For each evidence ID the dashboard should be able to render:

```text
Observed      ✓
Attested      ✓
Proof ready   ✓
Verified      ✓
AI decided    ✓
Executed      ✓
```

## Data integrity rule

The backend may enrich a verified fact with operational metadata, but must not silently change the verified event fields. If a transformation is required, retain both the original verified field and the derived field.

## Privacy

Only the minimum source data required for the AI decision should be sent to the model provider. Secrets, private keys, and internal credentials must never be included in model prompts.
