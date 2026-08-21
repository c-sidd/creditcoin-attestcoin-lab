# ProofMind System Architecture

## Logical topology

```text
User
  │
  ▼
Ethereum Sepolia Source Contract
  │ explicit ProofMind event
  ▼
Readability Worker ───────► Evidence Backend
  │
  ├─ wait for attestation
  ├─ request proofs
  └─ submit proof + encoded tx
  ▼
Creditcoin ASC
  │
  ├─ verifier precompile
  ├─ decode verified transaction/event data
  └─ create canonical VerifiedFact
  ▼
AI Decision Service
  │ bounded structured proposal
  ▼
Creditcoin Decision Contract
  │ deterministic policy
  ▼
Execution + event
  │
  ▼
Dashboard / evidence API
```

## Boundary responsibilities

| Boundary | Owns | Must not own |
|---|---|---|
| Source contract | source-chain state + explicit events | Creditcoin verification |
| Worker | orchestration/retries/state | truth determination |
| ASC | proof verification + verified-data extraction | arbitrary AI policy |
| AI | interpretation/proposal | final authorization |
| Decision contract | deterministic enforcement | model reasoning |
| Backend | persistence/API/observability | replacing proof verification |
| Dashboard | presentation | bypassing contract permissions |

## Failure philosophy

Failures must be observable and recoverable where safe. A retry must never turn one source event into two economic executions.
