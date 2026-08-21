# ProofMind Documentation Index

This directory is the implementation specification for ProofMind. It is intentionally split into a **flat numbered implementation curriculum** and a **deep engineering reference tree**. The numbered documents explain the project in sequence; the deep tree is the long-term engineering memory for Antigravity and future contributors.

## Reading order

Use the numbered curriculum first, then consult the deep engineering reference before implementing each subsystem.

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
| 32 | [Completeness Audit](32-completeness-audit.md) | What was missing and what was added |

## Deep engineering reference

- [`00-project-context/`](00-project-context/) — [goals](00-project-context/goals.md), [non-goals](00-project-context/non-goals.md), [terminology](00-project-context/terminology.md) and canonical context
- [`01-product/`](01-product/) — [requirements](01-product/product-requirements.md), [personas](01-product/user-personas.md), [stories](01-product/user-stories.md), use cases and pitch
- [`02-architecture/`](02-architecture/) — [component architecture](02-architecture/component-architecture.md), [sequence flows](02-architecture/sequence-flows.md), [trust model](02-architecture/trust-model.md), [technology stack](02-architecture/technology-stack.md)
- [`03-creditcoin/`](03-creditcoin/) — protocol source-of-truth plus [environments](03-creditcoin/environments.md), [source contract](03-creditcoin/source-chain-contract.md), [ASC](03-creditcoin/attestcoin-contract.md), [business logic](03-creditcoin/business-logic-contract.md), [Proof Builder](03-creditcoin/proof-builder.md), [SDK](03-creditcoin/sdk.md)
- [`04-ai/`](04-ai/) — [agent](04-ai/ai-agent.md), [architecture](04-ai/agent-architecture.md), [verified-data pipeline](04-ai/verified-data-pipeline.md), [tools](04-ai/tool-calling.md), [transaction intent](04-ai/transaction-intent.md), [risk controls](04-ai/risk-controls.md), [blockchain flow](04-ai/ai-to-blockchain-flow.md)
- [`05-smart-contracts/`](05-smart-contracts/) — contract responsibilities, events, access control and replay protection
- [`06-worker/`](06-worker/) — event monitoring, attestation waiting, proof generation, retries and state
- [`07-backend/`](07-backend/) — [database schema](07-backend/database-schema.md), [services](07-backend/services.md), [jobs](07-backend/jobs.md), [errors](07-backend/error-handling.md) and API contracts
- [`08-frontend/`](08-frontend/) — [pages](08-frontend/pages.md), [dashboard](08-frontend/dashboard.md), [agent interface](08-frontend/agent-interface.md), [transaction history](08-frontend/transaction-history.md)
- [`09-security/`](09-security/) — [smart-contract](09-security/smart-contract-security.md), [AI](09-security/ai-security.md), [worker](09-security/oracle-security.md), [replay](09-security/replay-attacks.md), [secrets](09-security/secrets-management.md)
- [`10-testing/`](10-testing/) — [contract](10-testing/contract-tests.md), [worker](10-testing/worker-tests.md), [integration](10-testing/integration-tests.md), [AI](10-testing/ai-tests.md), [E2E](10-testing/end-to-end-tests.md)
- [`11-infrastructure/`](11-infrastructure/) — [local](11-infrastructure/local-development.md), [environment variables](11-infrastructure/environment-variables.md), [deployment](11-infrastructure/deployment.md), [monitoring](11-infrastructure/monitoring.md)
- [`12-development/`](12-development/) — [conventions](12-development/coding-conventions.md), [Git workflow](12-development/git-workflow.md), [definition of done](12-development/definition-of-done.md), [troubleshooting](12-development/troubleshooting.md)
- [`../diagrams/`](../diagrams/) — architecture and sequence diagram source files

## Source-of-truth rule

Three information classes must stay separate:

1. **Creditcoin/Attestcoin facts** — supported by official docs and the preserved reference implementation.
2. **ProofMind project design** — application architecture, AI policy, UI, database and product decisions.
3. **Implementation notes** — concrete files, commands, APIs and code instructions.

If implementation conflicts with these documents, stop and resolve the conflict before coding. Record the decision in `../DECISIONS.md`.

If a protocol-specific detail conflicts with official Creditcoin documentation or the reference implementation, do not invent a replacement. Verify the documented interface and record the resulting decision.

## Implementation status

### Documentation

- [x] Product, architecture and protocol context
- [x] AI, contract and worker specifications
- [x] Backend/frontend specifications
- [x] Security and testing specifications
- [x] Infrastructure/deployment specifications
- [x] Antigravity master and milestone prompts
- [x] Demo/judge material
- [x] Deep engineering reference tree
- [x] Completeness audit and missing reference pages

### Implementation

- [ ] Source-chain contract implemented and tested
- [ ] Creditcoin ASC implemented and tested against the real verifier interface
- [ ] Off-chain worker implemented against the real Proof Builder flow
- [ ] AI provider adapter implemented
- [ ] Decision contract implemented and tested
- [ ] Backend/API implemented
- [ ] Dashboard implemented
- [ ] End-to-end CC3 Testnet flow demonstrated

Documentation completeness is **not** implementation completeness. A feature is not complete until its acceptance criteria and evidence exist.
