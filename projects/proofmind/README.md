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

Start with [`docs/00-INDEX.md`](docs/00-INDEX.md). The documentation is deliberately split into product, protocol, engineering, testing and demo layers so Antigravity can implement the project incrementally.

Important documents:

- [`06-architecture.md`](docs/06-architecture.md) — system boundaries and trust model
- [`08-attestcoin-flow.md`](docs/08-attestcoin-flow.md) — Attestcoin-specific flow
- [`09-ai-agent.md`](docs/09-ai-agent.md) — AI reasoning boundary
- [`10-smart-contracts.md`](docs/10-smart-contracts.md) — contract responsibilities
- [`12-offchain-worker.md`](docs/12-offchain-worker.md) — worker lifecycle
- [`17-ai-decision-contract.md`](docs/17-ai-decision-contract.md) — deterministic enforcement
- [`22-antigravity-master-prompt.md`](docs/22-antigravity-master-prompt.md) — master coding-agent instruction
- [`23-project-structure.md`](docs/23-project-structure.md) — implementation layout
- [`24-implementation-phases.md`](docs/24-implementation-phases.md) — build order
- [`29-testing-strategy.md`](docs/29-testing-strategy.md) — validation plan
- [`30-antigravity-milestone-prompts.md`](docs/30-antigravity-milestone-prompts.md) — incremental coding prompts
- [`31-demo-and-judge-checklist.md`](docs/31-demo-and-judge-checklist.md) — final demonstration checklist

## Status

### Documentation / planning

**Complete.** The repository contains the detailed product, architecture, protocol, interface, security, testing, Antigravity and demo specifications. The master prompt explicitly requires Antigravity to inspect existing Creditcoin/Attestcoin reference implementations rather than invent undocumented protocol interfaces. fileciteturn113file0L2-L2

### Implementation

**Not yet complete.** The next stage is implementation milestone by milestone. Documentation completion must not be confused with a working end-to-end protocol integration.

The implementation is complete only when the real Sepolia → Attestcoin → Creditcoin flow has been tested and the dashboard can show the resulting evidence trail.

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
