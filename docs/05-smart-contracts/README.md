# 05 — Smart Contracts

## Contract boundaries

### Source-chain contract
Minimal source-side logic. It performs any logic that must happen on the source chain and emits explicit ProofMind events containing all downstream data.

### Attestcoin Smart Contract integration
Receives the worker's proof payload and encoded transaction data, verifies the proof using the documented Creditcoin verifier mechanism, and derives the verified source data.

### Decision/business contract
Owns ProofMind application state and deterministic policy enforcement.

## Security invariant

A caller must never be able to create a verified fact or execute an economic action merely by supplying fields that look valid. Verification and authorization must be enforced by the contract path.

## Test categories

- valid proof
- invalid proof
- malformed payload
- unauthorized caller
- duplicate source event
- expired decision
- amount over limit
- score below threshold
- unsupported action
