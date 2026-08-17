# 30 — Antigravity Milestone Prompts

These prompts are intended to be used one at a time. Do not give Antigravity all implementation phases as one coding task.

## Prompt 1 — Reconnaissance

```text
Read projects/proofmind/docs/00-INDEX.md and every ProofMind document. Inspect the entire repository and the existing Creditcoin/Attestcoin tutorial code. Do not modify code yet.

Identify reusable contracts, SDK usage, network configuration, deployment scripts, test setup, and existing worker patterns.

Return:
1. current repository architecture
2. reusable components
3. missing components
4. protocol interfaces that are already proven by the tutorial
5. risks/blockers
6. a proposed implementation sequence

Do not invent undocumented Attestcoin APIs.
```

## Prompt 2 — Source contract

```text
Implement only the ProofMind source-chain event contract according to docs/10-smart-contracts.md and the official/tutorial patterns already present in this repository.

Keep source-chain business logic minimal. Emit one unambiguous ProofMind-specific event containing all data required downstream.

Add tests and deployment scripts for Sepolia. Do not implement the worker, AI, dashboard, or decision contract yet.

After implementation, explain every changed file and show how the emitted event will be identified by the worker.
```

## Prompt 3 — ASC integration

```text
Implement the Attestcoin Smart Contract boundary using only the verified verifier/precompile interface demonstrated by the existing tutorial/reference code.

The contract must verify proofs before decoding/using source-chain data, derive the canonical VerifiedFact, enforce replay protection, and emit clear events.

Do not guess the Proof Builder payload format or precompile ABI. If the repository does not contain enough information, stop and document the exact missing interface.

Add tests for valid proof, invalid proof, malformed data, unauthorized caller, and replay.
```

## Prompt 4 — Decision contract

```text
Implement the Creditcoin decision/business contract described in docs/17-ai-decision-contract.md.

The contract must be deterministic and bounded. It may receive an AI proposal, but it must independently enforce allowed actions, score thresholds, amount limits, expiry, authorized caller, and replay protection.

AI output must never become arbitrary calldata or arbitrary contract execution.

Add comprehensive unit tests.
```

## Prompt 5 — Worker

```text
Implement the off-chain readability worker as a durable state machine described in docs/12-offchain-worker.md and docs/26-data-model-and-state-machine.md.

Implement event monitoring, persistence, attestation polling, Proof Builder integration, ASC submission, receipt watching, retries, crash recovery, and duplicate prevention.

Reuse existing SDK/tutorial code where available. Do not fake proof verification in the production path.

Add mocks for unit tests and one integration path that can be configured for CC3 testnet.
```

## Prompt 6 — AI/backend

```text
Implement the backend evidence and AI decision pipeline.

Only VerifiedFact records produced after successful protocol verification may enter the AI decision layer. Implement a model adapter, deterministic mock provider, strict output validation, decision persistence, and documented APIs.

Never allow free-form model output to directly submit a transaction.
```

## Prompt 7 — Dashboard

```text
Build a simple evidence-first dashboard. Prioritize a clear timeline over visual effects.

For each event show source transaction, attestation status, proof status, verified facts, AI decision, policy validation, and Creditcoin execution transaction.

Clearly distinguish cryptographic verification from AI reasoning. The dashboard must not contain a privileged bypass for executing contracts.
```

## Prompt 8 — Integration

```text
Run the complete ProofMind testnet flow. Do not declare success from mocked components.

Use Sepolia for the source event and CC3 testnet for verification/execution. Capture public deployment addresses and transaction hashes. Verify the final Creditcoin state independently.

If any protocol interface fails, diagnose it against the official/reference implementation and update DECISIONS.md rather than silently changing the architecture.
```
