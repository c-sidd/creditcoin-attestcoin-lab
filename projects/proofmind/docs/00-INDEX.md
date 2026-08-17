# ProofMind Documentation Index

This directory is the implementation specification for ProofMind. Read documents in order when building the project with Antigravity or manually.

## Reading order

| # | Document | Purpose |
|---|---|---|
| 01 | [Idea](01-idea.md) | Product concept and thesis |
| 02 | [Problem Statement](02-problem-statement.md) | Problem, users, constraints |
| 03 | [Solution](03-solution.md) | Exact MVP solution |
| 04 | [Use Cases](04-use-cases.md) | Primary and secondary flows |
| 05 | [Scope & Requirements](05-scope-and-requirements.md) | Functional/non-functional requirements |
| 06 | [Architecture](06-architecture.md) | Components and boundaries |
| 07 | [System Flow](07-system-flow.md) | End-to-end sequence |
| 08 | [Attestcoin Flow](08-attestcoin-flow.md) | Protocol-specific implementation |
| 09 | [AI Agent](09-ai-agent.md) | AI reasoning service |
| 10 | [Smart Contracts](10-smart-contracts.md) | Contract responsibilities/interfaces |
| 11 | [Interfaces & Data Contracts](11-interfaces-and-data-contracts.md) | JSON/events/API schemas |
| 12 | [Offchain Worker](12-offchain-worker.md) | Worker state machine/retries |
| 13 | [Data Flow](13-data-flow.md) | Data lineage and persistence |
| 14 | [Security](14-security.md) | Threat model and controls |
| 15 | [Gas Cost](15-gas-cost.md) | Gas assumptions and optimization |
| 16 | [Testnet](16-testnet.md) | CC3 Testnet configuration |
| 17 | [AI Decision Contract](17-ai-decision-contract.md) | On-chain enforcement of AI output |
| 18 | [Dashboard & API](18-dashboard-and-api.md) | Operator/user interface |
| 19 | [Demo Script](19-demo-script.md) | Judge-facing demo |
| 20 | [Roadmap](20-roadmap.md) | Milestones and stretch goals |
| 21 | [Ideathon Pitch](21-ideathon-pitch.md) | Pitch, differentiation, judging story |
| 22 | [Antigravity Master Prompt](22-antigravity-master-prompt.md) | Master implementation prompt |
| 23 | [Project Structure](23-project-structure.md) | Exact implementation directory layout |
| 24 | [Implementation Phases](24-implementation-phases.md) | Milestone-by-milestone build order |
| 25 | [Environment & Configuration](25-environment-and-configuration.md) | Networks, RPCs, addresses and secrets |
| 26 | [Data Model & State Machine](26-data-model-and-state-machine.md) | Persistence model and processing states |
| 27 | [API Contract](27-api-contract.md) | Backend endpoint contracts |
| 28 | [AI Contract](28-ai-contract.md) | AI input/output schema and provider boundary |
| 29 | [Testing Strategy](29-testing-strategy.md) | Unit, integration and end-to-end testing |
| 30 | [Antigravity Milestone Prompts](30-antigravity-milestone-prompts.md) | Small prompts for each implementation milestone |
| 31 | [Demo & Judge Checklist](31-demo-and-judge-checklist.md) | Final demo readiness and judge questions |

## Implementation order

1. Read 01–05 to understand the product and freeze the MVP.
2. Read 06–08 to freeze the Creditcoin/Attestcoin architecture and trust boundaries.
3. Read 10–11 before implementing contracts or changing event/data schemas.
4. Read 12 and 26 before implementing the worker state machine and persistence.
5. Read 09 and 28 before implementing the AI provider boundary.
6. Read 17 before implementing any AI-triggered on-chain action.
7. Read 13, 18 and 27 before implementing backend persistence, APIs and dashboard views.
8. Read 14, 16 and 29 continuously while testing and hardening.
9. Use 24 and 30 to execute the implementation milestone by milestone.
10. Use 19 and 31 when preparing the live ideathon demonstration.
11. Use 22 as the final master instruction for Antigravity after it has inspected the repository and the documents above.

## Source-of-truth rule

If implementation conflicts with these documents, stop and resolve the conflict before coding. Record the decision in `../DECISIONS.md`.

If a protocol-specific detail conflicts with an existing Creditcoin/Attestcoin tutorial or official documentation, do not invent a replacement. Inspect the reference implementation, verify the documented interface, and record the resulting decision.

## Current implementation status

- [x] Product concept and MVP defined
- [x] Architecture and trust boundaries documented
- [x] Attestcoin readability flow documented
- [x] AI safety boundary documented
- [x] Smart-contract responsibilities documented
- [x] Worker lifecycle documented
- [x] API/data contracts documented
- [x] Test strategy documented
- [x] Antigravity master and milestone prompts documented
- [x] Demo/judge checklist documented
- [ ] Source-chain contract implemented and tested
- [ ] Creditcoin ASC implemented and tested against the real verifier interface
- [ ] Off-chain worker implemented against the real Proof Builder flow
- [ ] AI provider adapter implemented
- [ ] Decision contract implemented and tested
- [ ] Backend/API implemented
- [ ] Dashboard implemented
- [ ] End-to-end CC3 Testnet flow demonstrated

The checkboxes above distinguish **documentation completeness** from **implementation completeness**. A documented feature must not be presented as implemented until its corresponding tests and deployment evidence exist.
