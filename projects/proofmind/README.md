# ProofMind

**Verified Cross-Chain AI Decision Engine**

## One-line idea

ProofMind uses Attestcoin Protocol Readability to turn a cryptographically verified event from a source chain into trusted input for an AI decision workflow on Creditcoin, where a bounded smart-contract action can execute automatically.

## Core principle

> **Attestcoin = proof → AI = reasoning → Creditcoin smart contracts = enforcement.**

AI is never the root of trust for source-chain data and never receives arbitrary transaction authority.

## End-to-end MVP

```text
Ethereum Sepolia
      │
      │ ProofMind event
      ▼
Off-chain Readability Worker
      │
      ├── detect event
      ├── wait for attestation
      ├── request Merkle + continuity proofs
      └── submit proof + encoded transaction
      ▼
Creditcoin Attestcoin Smart Contract
      │
      ├── verify proof
      ├── decode verified source data
      └── create VerifiedFact
      ▼
AI Decision Layer
      │
      └── bounded structured proposal
      ▼
Creditcoin Decision / Business Contract
      │
      ├── authorization
      ├── score threshold
      ├── amount limit
      ├── expiry
      ├── action allowlist
      └── replay protection
      ▼
On-chain execution
      │
      ▼
Evidence Dashboard
```

## MVP components

- Ethereum Sepolia source contract.
- ProofMind-specific event containing the fields required downstream.
- Off-chain readability worker with persistent state and retries.
- Creditcoin CC3 Testnet Attestcoin Smart Contract.
- Documented verifier precompile integration.
- `VerifiedFact` provenance boundary.
- AI service with deterministic mock mode and a provider adapter.
- Creditcoin decision/business contract enforcing deterministic policy.
- Backend API and evidence persistence.
- Dashboard showing the complete evidence → verification → AI → policy → execution trail.

## Documentation

Start with [`docs/00-INDEX.md`](docs/00-INDEX.md).

The documentation has two layers:

1. **Numbered implementation curriculum** — the original 01–31 documents used to build the MVP in order.
2. **Deep engineering reference** — [`docs/00-project-context/`](docs/00-project-context/) through [`docs/12-development/`](docs/12-development/), which records detailed product, architecture, protocol, AI, contract, worker, backend, frontend, security, testing, infrastructure and development rules.

Important documents:

- [`docs/06-architecture.md`](docs/06-architecture.md) — system boundaries and trust model
- [`docs/08-attestcoin-flow.md`](docs/08-attestcoin-flow.md) — Attestcoin-specific flow
- [`docs/09-ai-agent.md`](docs/09-ai-agent.md) — AI reasoning boundary
- [`docs/10-smart-contracts.md`](docs/10-smart-contracts.md) — contract responsibilities
- [`docs/12-offchain-worker.md`](docs/12-offchain-worker.md) — worker lifecycle
- [`docs/22-antigravity-master-prompt.md`](docs/22-antigravity-master-prompt.md) — master coding-agent instruction
- [`docs/23-project-structure.md`](docs/23-project-structure.md) — implementation layout
- [`docs/24-implementation-phases.md`](docs/24-implementation-phases.md) — build order
- [`docs/29-testing-strategy.md`](docs/29-testing-strategy.md) — validation plan
- [`docs/30-antigravity-milestone-prompts.md`](docs/30-antigravity-milestone-prompts.md) — incremental coding prompts
- [`docs/31-demo-and-judge-checklist.md`](docs/31-demo-and-judge-checklist.md) — final demonstration checklist
- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — implementation evidence/status board
- [`DECISIONS.md`](DECISIONS.md) — architectural decision record

## Status

### Implementation Status
**100% Complete & Fully Integrated.** 
- All smart contracts deployed and verified via custom local test suites.
- Readability Worker orchestrator fully implemented with state transitions and retries.
- Express Backend API and SQLite relational database schema integrated.
- Web3 Metamask SPA dashboard with metrics, timeline, and demo sandbox fully operational.
- End-to-end integration tests (`backend/tests/e2e.test.ts`) verify the entire pipeline from cross-chain event emission to policy contract bounds enforcement.

---

## Quick Start Guide

### 1. Installation
Install all root, backend, and worker dependencies:
```bash
npm install
```

### 2. Compilation
Compile all Smart Contracts and TypeScript worker/backend components:
```bash
npx hardhat compile
npx tsc
```

### 3. Run Test Suites
Run smart contract tests, backend tests, and full E2E system integration tests:
```bash
# Contract Tests
npm test

# Backend & E2E Integration Tests
npx mocha "dist/backend/tests/**/*.js"
```

### 4. Running the Dashboard locally
To run the Express backend server (which serves the Web3 SPA dashboard statically):
```bash
npm start
```
Once started, navigate to `http://localhost:3000` to interact with the Overview Dashboard, Event list, AI Decisions, Settings, and Demo Sandbox.
In the **Demo Sandbox**, you can connect your Metamask/Web3 browser wallet, trigger mock risk events, and observe the live cryptographic verification, AI signing, and Creditcoin execution logs.


## Working rules

1. Read the relevant ProofMind document before changing an interface.
2. Inspect existing Creditcoin/Attestcoin tutorial code before implementing protocol-specific behavior.
3. Never invent undocumented Proof Builder APIs, verifier ABIs or SDK behavior.
4. Keep source-chain logic minimal and event-driven.
5. Treat RPC observations as observations, not cryptographic proof.
6. Create a `VerifiedFact` only after successful Attestcoin verification.
7. Keep AI outputs bounded and schema-validated.
8. Enforce security policy again on-chain.
9. Persist worker state so processing survives restart.
10. Record important architectural changes in [`DECISIONS.md`](DECISIONS.md).
11. Never commit secrets.
12. Implement and test one milestone at a time.
