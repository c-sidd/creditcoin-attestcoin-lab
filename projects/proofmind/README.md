# ProofMind

**Verified Cross-Chain AI Decision Engine**

## One-line idea

ProofMind uses Attestcoin Protocol Readability to turn a cryptographically verified event from a source chain into trusted input for an AI decision workflow on Creditcoin, where a bounded smart-contract action can execute automatically.

## Why this project exists

AI can reason over data, but an AI model should not be the root of trust for the data it receives. ProofMind separates **data authenticity** from **AI reasoning**:

1. A source-chain contract emits a specific event.
2. Attestcoin infrastructure attests the source-chain block.
3. A worker obtains Merkle and continuity proofs.
4. An Attestcoin Smart Contract verifies the source transaction on Creditcoin.
5. Only verified event fields enter the decision pipeline.
6. The AI produces a structured decision and explanation.
7. A policy/decision contract validates the bounded decision and executes the allowed action.

## MVP

The first demo should be intentionally small:

- Ethereum Sepolia source contract.
- A dedicated event such as `RiskSignalSubmitted`.
- Creditcoin CC3 Testnet as the destination.
- Off-chain readability worker.
- Attestcoin Smart Contract using the documented verifier precompile.
- AI service returning a deterministic JSON decision schema.
- Creditcoin decision contract that accepts only valid, bounded decisions.
- Dashboard showing the complete evidence → verification → AI → execution trail.

## Important boundary

The AI does **not** replace Attestcoin verification. The protocol proves that the source-chain transaction/event is authentic; the AI interprets the verified data. Smart contracts enforce the final allowed state transition.

## Documentation

Start with [`docs/00-INDEX.md`](docs/00-INDEX.md). It is the source of truth for implementation order, interfaces, flows, demo behavior, and Antigravity prompts.

## Status

Planning/specification phase. Implementation should proceed milestone by milestone and record architectural changes in [`DECISIONS.md`](DECISIONS.md).
