# Component Architecture

```text
User
  │ source-chain tx
  ▼
Source Chain Contract
  │ dedicated event
  ▼
ProofMind Worker ─────► Proof Builder
  │                         │
  │ waits for attestation   │ proofs + encoded tx
  ▼                         ▼
Creditcoin / Attestcoin Smart Contract
  │ verifies proof material via documented precompile
  ▼
Verified Event / Business Logic
  │
  ├──► Evidence Store / API
  │
  └──► AI Decision Service
             │ structured intent
             ▼
       Policy / Decision Contract
             │
             ▼
       Creditcoin execution
             │
             ▼
        Dashboard evidence
```

## Boundaries
- **Source contract:** emits the minimal, unambiguous event data needed cross-chain.
- **Worker:** transport/orchestration; it is not the source of truth.
- **ASC:** protocol verification boundary and immediate application handoff.
- **Business/policy contracts:** deterministic enforcement and state changes.
- **AI service:** reasoning only; it cannot bypass proof verification or contract policy.
- **Backend:** persistence, API, observability and presentation support.
- **Frontend:** user/operator interface only.

Keep these boundaries stable unless `DECISIONS.md` records an intentional architectural change.
