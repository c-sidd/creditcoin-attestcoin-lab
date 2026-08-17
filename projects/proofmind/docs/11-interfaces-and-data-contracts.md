# 11 — Interfaces and Data Contracts

The purpose of this document is to prevent different AI-generated components from inventing incompatible payloads.

## Event identity

```text
sourceChainId
sourceContract
sourceTxHash
logIndex
eventType
```

This tuple becomes the canonical event identity.

## VerifiedFact

```json
{
  "evidenceId": "ev_001",
  "sourceChainId": 11155111,
  "sourceContract": "0x...",
  "sourceTxHash": "0x...",
  "sourceBlockNumber": 123,
  "eventType": "RiskSignalSubmitted",
  "signalId": "0x...",
  "subject": "0x...",
  "signalValue": "42",
  "verified": true,
  "verifiedOnChain": "creditcoin",
  "verificationTxHash": "0x..."
}
```

`verified` is a backend representation of a successful on-chain verification. It must never be set merely because the worker saw the event.

## AI decision

```json
{
  "evidenceId": "ev_001",
  "decision": "ALLOW",
  "score": 82,
  "reasonCodes": ["VERIFIED_ACTIVITY"],
  "action": "APPROVE_LIMIT",
  "limit": "1000000000000000000",
  "modelVersion": "proofmind-model-v1",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

## Worker API states

```text
DETECTED
WAITING_FOR_ATTESTATION
PROOF_REQUESTED
PROOF_READY
VERIFICATION_SUBMITTED
VERIFIED
AI_PENDING
AI_DECIDED
EXECUTION_SUBMITTED
EXECUTED
FAILED_RETRYABLE
FAILED_FINAL
```

## Backend endpoints

Suggested MVP endpoints:

- `GET /api/health`
- `GET /api/events`
- `GET /api/events/:evidenceId`
- `GET /api/events/:evidenceId/timeline`
- `POST /api/ai/decisions/:evidenceId`
- `GET /api/decisions/:evidenceId`

The UI should not call blockchain/provider APIs directly when the backend already owns the orchestration state.

## Environment variables

```text
SOURCE_RPC_URL=
CREDITCOIN_RPC_URL=
SOURCE_CONTRACT_ADDRESS=
ASC_CONTRACT_ADDRESS=
DECISION_CONTRACT_ADDRESS=
PROOF_BUILDER_URL=
AI_API_KEY=
DATABASE_URL=
WORKER_PRIVATE_KEY=
CREDITCOIN_PRIVATE_KEY=
```

Never commit actual values.
