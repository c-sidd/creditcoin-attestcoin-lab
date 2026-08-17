# 23 — Project Structure

## Purpose

This document defines the expected repository layout for ProofMind. Antigravity must inspect the existing repository before creating directories and must reuse existing tutorial infrastructure where possible.

## Target layout

```text
projects/proofmind/
├── README.md
├── DECISIONS.md
├── docs/
├── contracts/
│   ├── source-chain/
│   ├── creditcoin/
│   └── interfaces/
├── worker/
│   ├── src/
│   │   ├── listener/
│   │   ├── attestation/
│   │   ├── proof-builder/
│   │   ├── asc/
│   │   ├── persistence/
│   │   └── config/
│   └── tests/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── ai/
│   └── tests/
├── dashboard/
├── scripts/
│   ├── deploy/
│   ├── seed/
│   └── integration/
├── deployments/
│   └── README.md
└── .env.example
```

## Separation rules

- Source-chain contracts contain only source-chain actions and event emission.
- Attestcoin Smart Contract integration is isolated from business logic.
- The decision/business contract is the final policy enforcement boundary.
- The worker is responsible for orchestration, not truth.
- The backend stores and serves evidence; it does not replace on-chain verification.
- AI proposes a bounded action; it does not possess arbitrary transaction authority.
- Dashboard code is read-oriented and must not bypass contract permissions.

## Antigravity rule

If the existing repository has a different but working structure, do not mechanically move files. Record the reason for deviations in `DECISIONS.md` and preserve compatibility with the existing tutorial code.
