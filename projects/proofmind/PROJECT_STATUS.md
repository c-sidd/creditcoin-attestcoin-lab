# ProofMind — Project Status

## Purpose

This file is the operational status board for the ProofMind build. Documentation status and implementation status are intentionally separate.

## Current state

- Documentation foundation: **complete and being expanded**.
- Creditcoin/Attestcoin learning material: present in the parent lab repository.
- Existing tutorial/reference implementation: preserved under `examples/`.
- ProofMind implementation: **not yet declared end-to-end complete**.
- Testnet proof of the complete Sepolia → Attestcoin → AI → Creditcoin execution path: **pending until actually demonstrated**.

## Source-of-truth hierarchy

1. Official Creditcoin documentation supplied/linked in this repository for protocol facts.
2. Existing Creditcoin tutorial/reference code for concrete SDK, ABI and API behavior.
3. ProofMind documents for project-specific architecture and product decisions.
4. Code and tests as the executable implementation of those decisions.

If these disagree, do not silently guess. Stop at the boundary, inspect the reference implementation, and record a decision.

## Milestone status

| Milestone | Status | Evidence required |
|---|---|---|
| Repository reconnaissance | Planned / repeat before implementation | Baseline build/test notes |
| Source event contract | Planned | Deployment + event tx |
| Creditcoin ASC integration | Planned | Verified test transaction |
| Business/decision contract | Planned | Contract tests |
| Readability worker | Planned | Persistent state + retry tests |
| AI decision service | Planned | Schema validation + mock/provider tests |
| Evidence backend | Planned | API + database tests |
| Dashboard | Planned | End-to-end evidence view |
| Testnet E2E | Planned | Sepolia and CC3 transaction hashes |
| Hardening | Planned | Negative-test matrix |

## Rule

Do not mark a milestone complete because code exists. Mark it complete only when its documented acceptance criteria and evidence are satisfied.
