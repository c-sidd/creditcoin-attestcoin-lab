# ProofMind

**Attestcoin-Powered Cross-Chain AI Credit & Risk Intelligence**

## One-line idea

ProofMind verifies selected financial facts from another chain through Attestcoin Readability, builds a cross-chain financial profile, analyzes it with specialized AI agents and deterministic risk/simulation logic, and submits only a bounded transaction intent to Creditcoin smart contracts for independent policy enforcement.

## Core principle

> **Attestcoin = verified evidence → AI = interpretation → risk/policy = controls → Creditcoin contracts = enforcement.**

AI is never the root of trust for source-chain data and never receives arbitrary transaction authority.

## Why this project exists

A Creditcoin credit application may need financial information that exists on other chains: collateral, liabilities, repayment history, liquidation history and cross-chain exposure. The application needs both a trustworthy evidence boundary and a way to interpret multiple heterogeneous signals.

ProofMind separates those responsibilities:

- **Attestcoin** establishes the verified cross-chain evidence boundary.
- **Multi-agent AI** interprets verified financial information.
- **Deterministic risk/simulation** calculates measurable metrics and controlled scenarios.
- **Policy logic** constrains the proposed action.
- **Creditcoin contracts** independently enforce the final action.

## End-to-end MVP

```text
Ethereum Sepolia / supported source
              │
              │ financial event/state
              ▼
     Off-chain Readability Worker
              │
              ├── detect source evidence
              ├── wait for attestation
              ├── request documented proofs
              └── submit proof + encoded query
              ▼
   Creditcoin Attestcoin Smart Contract
              │
              ├── verify proof
              ├── decode verified source data
              └── create VerifiedFact
              ▼
       Cross-Chain Financial Profile
              │
       ┌──────┴─────────┐
       │ Multi-agent AI │
       │ Analyst        │
       │ Risk           │
       │ Anomaly        │
       │ Credit         │
       │ Policy         │
       └──────┬─────────┘
              ▼
     Deterministic Risk Engine
              │
              ▼
       Scenario Simulation
              │
              ▼
       Policy Validation
              │
              ▼
     Bounded Transaction Intent
              │
              ▼
     Creditcoin Business Contract
              │
       ┌──────┴─────────┐
       │ allowed?       │
       │ amount valid?  │
       │ not expired?   │
       │ not replayed?  │
       └──────┬─────────┘
              ▼
       On-chain execution
              │
              ▼
       Evidence Dashboard
```

## MVP components

- Ethereum Sepolia source contract and controlled financial event/data model.
- Off-chain readability worker with persistent state, retries and idempotency.
- Creditcoin CC3 Testnet Attestcoin integration.
- Documented verifier/precompile integration.
- `VerifiedFact` provenance boundary.
- Multi-agent AI orchestration behind a provider abstraction.
- Deterministic mock provider for tests.
- Deterministic risk metrics and scenario simulation.
- Creditcoin decision/business contract enforcing hard policy.
- Backend API and evidence persistence.
- Dashboard showing evidence → verification → profile → agents → risk → policy → execution.

## Documentation

Start with [`docs/00-INDEX.md`](docs/00-INDEX.md).

### New product direction

- [`docs/PRODUCT_DIRECTION_V2.md`](docs/PRODUCT_DIRECTION_V2.md) — primary V2 product definition and boundaries.
- [`docs/01-idea.md`](docs/01-idea.md) — updated product thesis and multi-agent roles.
- [`docs/02-problem-statement.md`](docs/02-problem-statement.md) — updated real-world problem framing.
- [`docs/09-ai-agent.md`](docs/09-ai-agent.md) — multi-agent architecture, provider strategy, deterministic controls and AI safety boundary.

### Engineering reference

The repository also contains the existing numbered implementation curriculum and deep engineering reference covering architecture, Attestcoin, contracts, worker, backend, frontend, security, testing, infrastructure and development rules.

Important documents include:

- [`docs/06-architecture.md`](docs/06-architecture.md) — system boundaries and trust model
- [`docs/08-attestcoin-flow.md`](docs/08-attestcoin-flow.md) — Attestcoin-specific flow
- [`docs/10-smart-contracts.md`](docs/10-smart-contracts.md) — contract responsibilities
- [`docs/12-offchain-worker.md`](docs/12-offchain-worker.md) — worker lifecycle
- [`docs/22-antigravity-master-prompt.md`](docs/22-antigravity-master-prompt.md) — master coding-agent instruction
- [`docs/24-implementation-phases.md`](docs/24-implementation-phases.md) — build order
- [`docs/29-testing-strategy.md`](docs/29-testing-strategy.md) — validation plan
- [`docs/30-antigravity-milestone-prompts.md`](docs/30-antigravity-milestone-prompts.md) — incremental coding prompts
- [`docs/31-demo-and-judge-checklist.md`](docs/31-demo-and-judge-checklist.md) — final demonstration checklist
- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — implementation evidence/status board
- [`DECISIONS.md`](DECISIONS.md) — architectural decision record

## Status

The implementation foundation already exists in the repository, but the new V2 product direction is a **design update**, not a claim that the complete production flow is finished.

The implementation is complete only when the real source-chain → Attestcoin → multi-agent analysis → policy → Creditcoin execution path has been tested and the dashboard can show the resulting evidence trail.

See [`PROJECT_STATUS.md`](PROJECT_STATUS.md) before implementing the next milestone.

## Working rules

1. Read the relevant ProofMind document before changing an interface.
2. Treat official Creditcoin documentation and the verified reference implementation as the protocol source of truth.
3. Never invent undocumented Proof Builder APIs, verifier ABIs or SDK behavior.
4. Keep source-chain logic minimal and event-driven.
5. Treat RPC observations as observations, not cryptographic proof.
6. Create a `VerifiedFact` only after successful Attestcoin verification.
7. Keep AI outputs bounded, schema-validated and provenance-aware.
8. Keep deterministic financial metrics separate from model-generated reasoning.
9. Enforce security and policy constraints again on-chain.
10. Never give an LLM unrestricted transaction authority.
11. Persist worker state so processing survives restart.
12. Record important architectural changes in [`DECISIONS.md`](DECISIONS.md).
13. Never commit secrets.
14. Implement and test one milestone at a time.
