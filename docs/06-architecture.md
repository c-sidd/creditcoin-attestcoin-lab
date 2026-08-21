# 06 — Architecture

## High-level components

```text
Ethereum Sepolia
   │
   │ source transaction + event
   ▼
Source Contract
   │
   ▼
Readability Worker ───────► Proof Builder API
   │                              │
   │ proofs + encoded tx          │
   ▼                              │
Creditcoin CC3 Testnet            │
   │                              │
   ▼                              │
Attestcoin Smart Contract ◄──────┘
   │
   │ verified event
   ▼
Verified Fact API / Store
   │
   ▼
AI Decision Service
   │
   │ structured decision
   ▼
Decision / Business Logic Contract
   │
   ▼
Creditcoin state + events
   │
   ▼
Dashboard
```

## Component responsibilities

| Component | Responsibility | Must not do |
|---|---|---|
| Source contract | Emit canonical events | Hold unnecessary cross-chain logic |
| Worker | Detect, wait, prove, submit, retry | Invent verified data |
| Proof Builder | Produce Merkle/continuity proof material | Decide business outcomes |
| ASC | Verify proofs and extract data | Trust raw worker claims |
| Verified Fact Store | Persist normalized evidence | Modify source facts |
| AI service | Reason over verified facts | Directly control arbitrary contracts |
| Decision contract | Enforce allowed actions | Trust free-form AI text |
| Dashboard | Explain state | Become a trust authority |

## Deployment boundaries

### Source chain

- Source contract.
- RPC endpoint.
- User wallet.

### Creditcoin

- ASC.
- Decision/business logic contract.
- RPC endpoint.

### Off-chain

- Worker.
- Backend/API.
- AI service.
- Database.
- Frontend.

## Design rule

Every external dependency must have a configuration interface. Do not embed endpoint URLs, contract addresses, private keys, or model API keys in source code.

## Suggested repository implementation

```text
projects/proofmind/
├── contracts/
│   ├── source/
│   ├── attestcoin/
│   └── decision/
├── worker/
├── backend/
├── ai/
├── frontend/
├── scripts/
└── docs/
```

The exact framework can be selected during implementation, but interfaces in the documentation should remain stable.
