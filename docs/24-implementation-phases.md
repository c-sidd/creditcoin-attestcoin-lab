# 24 — Implementation Phases

ProofMind must be implemented incrementally. Do not ask an AI coding agent to generate the whole system in one pass.

## Phase 0 — Repository reconnaissance

**Goal:** understand the existing Creditcoin examples.

Tasks:
- inspect package managers and existing dependencies
- identify tutorial contracts and scripts
- identify existing Attestcoin SDK usage
- identify network configuration already present
- run existing tests/builds before changing anything
- document reusable components

Exit criteria:
- baseline build/test status recorded
- existing protocol integration points identified

## Phase 1 — Minimal source event contract

Create the smallest source-chain contract that emits a ProofMind-specific event.

The event should contain every field required downstream. Do not depend on generic ERC-20 `Transfer` events as the cross-chain trigger.

Exit criteria:
- contract compiles
- event can be emitted on Sepolia
- event fields are documented
- unit tests cover valid and invalid inputs

## Phase 2 — Creditcoin verification contract

Implement the Attestcoin Smart Contract boundary.

Responsibilities:
- receive proof payloads and encoded transaction data
- call the documented verifier precompile
- reject invalid proofs
- decode only after successful verification
- derive a canonical `VerifiedFact`
- prevent the same source event from being executed twice

Do not invent a precompile ABI. Reuse the official tutorial/reference implementation.

## Phase 3 — Business/decision contract

Implement the bounded on-chain policy engine.

Responsibilities:
- accept calls only from the ASC integration
- validate AI-derived action parameters
- enforce score thresholds and amount limits
- enforce expiry
- enforce replay protection
- emit a decision/execution event

## Phase 4 — Readability worker

Build a durable worker state machine:

```text
DETECTED
  ↓
WAITING_FOR_ATTESTATION
  ↓
ATTESTED
  ↓
PROOF_REQUESTED
  ↓
PROOF_RECEIVED
  ↓
ASC_SUBMITTED
  ↓
EXECUTED
```

Failure states must retain enough information for retry and recovery.

## Phase 5 — Evidence backend

Persist:
- source transaction hash
- source block number
- source contract address
- event identifier
- raw/encoded evidence reference
- proof request status
- proof verification status
- Creditcoin transaction hash
- verified fact
- AI decision
- final execution result

## Phase 6 — AI decision layer

The AI receives only verified facts.

It returns structured JSON such as:

```json
{
  "decision": "APPROVE",
  "score": 87,
  "action": "ALLOW_LOAN",
  "amount": "1000000000000000000",
  "reasonCodes": ["VERIFIED_REPAYMENT_HISTORY"],
  "expiresAt": 1780000000
}
```

The exact schema must be maintained in the data-contract document and validated in code.

## Phase 7 — Dashboard

Show the complete evidence chain:

`Source event → Attestation → Proof → VerifiedFact → AI decision → Creditcoin execution`

The dashboard must make it easy for a judge/developer to understand why an action happened.

## Phase 8 — End-to-end testnet demo

Use Sepolia as the source chain and the documented CC3 testnet environment.

Capture:
- source deployment address
- source transaction hash
- Creditcoin ASC address
- business/decision contract address
- worker logs
- proof request/result
- Creditcoin execution transaction hash

Never commit private keys or secrets.

## Phase 9 — Hardening

Test:
- duplicate events
- invalid proof
- malformed encoded data
- unauthorized caller
- expired decision
- score below threshold
- amount above limit
- worker restart
- RPC outage
- proof-builder failure
- failed Creditcoin transaction

Only after this phase should the MVP be called demo-ready.
