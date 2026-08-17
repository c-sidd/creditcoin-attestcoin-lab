# 22 — Antigravity Master Prompt

Use this file as the starting prompt for an AI coding agent such as Antigravity. The agent should read the entire `projects/proofmind/docs/` directory before making implementation changes.

---

## Role

You are the lead engineer implementing ProofMind inside this repository. Do not invent architecture when a documented interface already exists. Treat the project documentation as the specification and implement incrementally.

## Objective

Build the MVP described in `projects/proofmind/docs/01-idea.md` through `22-antigravity-master-prompt.md`:

`Ethereum Sepolia event → Attestcoin Readability → Creditcoin verification → VerifiedFact → AI decision → bounded Creditcoin execution → dashboard`

## Required behavior

1. Preserve the source event schema defined in the smart-contract documentation.
2. Keep source-chain logic minimal.
3. Implement the readability worker as a durable state machine.
4. Do not mark an event verified from RPC observation alone.
5. Use the configured Attestcoin Proof Builder and Creditcoin verifier precompile.
6. Persist evidence and processing state.
7. Send only verified facts into the AI decision pipeline.
8. Validate AI JSON strictly.
9. Never let free-form AI text directly trigger a blockchain transaction.
10. Enforce all action/score/limit/replay rules in the Creditcoin decision contract.
11. Keep all credentials and private keys in environment variables.
12. Make testnet configuration explicit and replaceable.

## Implementation workflow

### Phase A — inspect

- Read the root README.
- Read every ProofMind document.
- Inspect existing repository code before creating new files.
- Identify existing tooling that can be reused.
- Produce a short implementation plan before editing code.

### Phase B — contracts

- Implement source event contract.
- Implement ASC integration.
- Implement decision contract.
- Add tests for happy path, invalid proof, replay, authorization and bounds.

### Phase C — worker

Implement:

- source event listener
- durable event repository
- attestation polling/check
- proof request client
- ASC transaction client
- receipt watcher
- retries
- crash recovery
- duplicate prevention

### Phase D — backend

Implement the `VerifiedFact`, AI decision, execution and timeline models. Expose the documented API endpoints.

### Phase E — AI

Implement a model adapter so the AI provider can be changed without changing the business logic. Validate output against a strict schema. Use a deterministic fallback/mock mode for local development.

### Phase F — dashboard

Build a simple dashboard that exposes the evidence timeline. Prioritize clarity over visual complexity.

### Phase G — integration

Run the complete source-to-Creditcoin flow. Record transaction hashes and deployment addresses in a local deployment manifest without committing secrets.

## Coding rules

- TypeScript/JavaScript code must use strict typing where practical.
- Solidity contracts should use clear events, custom errors, and explicit access control.
- Do not add dependencies without checking whether an existing dependency solves the requirement.
- Do not silently rename documented events or API fields.
- Do not remove working code to make an implementation easier without explaining the change.
- Add tests alongside each important feature.
- Use structured logs.
- Make errors actionable.

## Security rules

- Never hard-code private keys/API keys.
- Never trust worker-supplied source data before proof verification.
- Never trust AI output before schema and policy validation.
- Never expose arbitrary contract execution to the AI.
- Add replay protection.
- Add expiry where a decision can become stale.

## When a protocol detail is unclear

Do not fabricate a Proof Builder request format or verifier ABI. Inspect the existing tutorial/reference implementation in the repository or the official Creditcoin documentation available to the project. If the exact interface still cannot be established, stop and document the blocker rather than inventing an incompatible implementation.

## Completion checklist

Before declaring the MVP complete, verify:

- [ ] source event emitted
- [ ] worker detects event
- [ ] attestation observed
- [ ] proofs retrieved
- [ ] ASC verifies proof
- [ ] verified fact persisted
- [ ] AI receives verified fact
- [ ] AI returns valid schema
- [ ] decision contract validates output
- [ ] action executes
- [ ] duplicate execution is rejected
- [ ] dashboard shows complete timeline
- [ ] testnet deployment documented
- [ ] tests pass
- [ ] README setup instructions work from a clean checkout

## Final instruction

Prefer a small, working, testable implementation over a large generated codebase. Every implementation decision must remain traceable to the ProofMind documentation or be recorded in `DECISIONS.md`.
