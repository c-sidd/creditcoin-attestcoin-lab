# 11 — Interfaces and Data Contracts

The purpose of this document is to prevent AI-generated components from inventing incompatible payloads.

> **Classification:** Project Design unless explicitly marked as a Creditcoin/Attestcoin protocol interface.

## Event identity

```text
sourceChainKey
sourceEvmChainId
sourceContract
sourceTxHash
sourceBlockNumber
logIndex
eventType
actionId
```

The canonical event identity must be deterministic and unique.

## ObservedEvent

An RPC observation is operational input only:

```json
{
  "sourceChainKey": 1,
  "sourceEvmChainId": 11155111,
  "sourceContract": "0x...",
  "sourceTxHash": "0x...",
  "sourceBlockNumber": 123,
  "logIndex": 0,
  "eventType": "ProofMindCreditEvent",
  "observedAt": "2026-08-18T00:00:00Z"
}
```

`ObservedEvent` must never be treated as verified financial data.

## VerifiedFact

Created only after successful documented Attestcoin verification:

```json
{
  "evidenceId": "ev_001",
  "sourceChainKey": 1,
  "sourceEvmChainId": 11155111,
  "sourceContract": "0x...",
  "sourceTxHash": "0x...",
  "sourceBlockNumber": 123,
  "logIndex": 0,
  "eventType": "ProofMindCreditEvent",
  "subject": "0x...",
  "assets": "25000",
  "liabilities": "7500",
  "repaymentRatioBps": 9600,
  "liquidationCount": 0,
  "verified": true,
  "verificationTxHash": "0x...",
  "verifiedAt": "2026-08-18T00:05:00Z"
}
```

The exact source event fields are defined by the implemented MVP contract. Do not invent protocol fields.

## FinancialProfile

Derived from one or more verified facts plus deterministic metrics:

```json
{
  "evidenceIds": ["ev_001"],
  "collateralRatioBps": 33333,
  "utilizationBps": 3000,
  "debtExposure": "7500",
  "concentrationBps": 10000,
  "liquidationCount": 0,
  "scenarioStatus": "SAFE"
}
```

Derived metrics must identify their formula/version in implementation documentation.

## Multi-agent output

Each agent should return structured output rather than executable instructions. Example:

```json
{
  "agent": "risk",
  "riskLevel": "LOW",
  "riskScore": 23,
  "reasonCodes": ["STRONG_REPAYMENT_HISTORY"],
  "evidenceIds": ["ev_001"],
  "agentVersion": "risk-v2"
}
```

## Final decision proposal

```json
{
  "evidenceIds": ["ev_001"],
  "decision": "APPROVE_WITH_LIMIT",
  "riskLevel": "LOW",
  "riskScore": 23,
  "recommendedCreditLimit": "5000",
  "reasonCodes": ["STRONG_REPAYMENT_HISTORY"],
  "scenarioStatus": "SAFE",
  "action": "PROPOSE_CREDIT",
  "modelVersion": "proofmind-multi-agent-v2"
}
```

This is Project Design and is not a Creditcoin protocol API.

## Worker states

```text
DETECTED
WAITING_FOR_ATTESTATION
ATTESTED
PROOF_REQUESTED
PROOF_READY
VERIFICATION_SUBMITTED
VERIFIED
AI_PENDING
AI_DECIDED
POLICY_PENDING
EXECUTION_SUBMITTED
EXECUTED
FAILED_RETRYABLE
FAILED_FINAL
```

## Backend endpoints

- `GET /api/health`
- `GET /api/events`
- `GET /api/events/:evidenceId`
- `GET /api/events/:evidenceId/timeline`
- `POST /api/ai/decisions/:evidenceId`
- `GET /api/decisions/:evidenceId`
- `GET /api/risk/:evidenceId`
- `POST /api/risk/:evidenceId/simulate`

AI/risk endpoints must refuse unverified evidence.

## Environment variables

Use the repository's `.env.example` as the authoritative variable list. At minimum the application needs configurable source RPC, Creditcoin RPC, contract addresses, Proof Builder endpoint, AI provider configuration, persistence, and signing credentials. Never commit actual values.
