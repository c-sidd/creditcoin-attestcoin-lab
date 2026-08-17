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

## Implementation order

1. Read 01–05.
2. Freeze architecture using 06–08.
3. Implement contracts and interfaces from 10–11.
4. Implement the worker from 12.
5. Implement AI from 09 and enforcement from 17.
6. Build persistence/API/dashboard from 13 and 18.
7. Test using 14 and 16.
8. Prepare the demo using 19.

## Source-of-truth rule

If implementation conflicts with these documents, stop and resolve the conflict before coding. Record the decision in `../DECISIONS.md`.
