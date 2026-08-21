# 31 — Demo and Judge Checklist

## Goal

The demo must communicate one powerful idea clearly:

> ProofMind does not ask AI to trust cross-chain data. Attestcoin cryptographically verifies the source-chain evidence first, then AI makes a bounded decision from the verified fact, and Creditcoin enforces the final policy on-chain.

## Before the demo

- [ ] Sepolia wallet funded with test ETH
- [ ] Creditcoin testnet wallet funded according to the testnet requirements
- [ ] source contract deployed
- [ ] ASC deployed
- [ ] decision/business contract deployed
- [ ] worker running
- [ ] proof builder reachable
- [ ] backend running
- [ ] dashboard running
- [ ] AI provider configured or deterministic demo mode selected
- [ ] deployment manifest populated
- [ ] all transaction hashes recorded

## Live demo sequence

### 1. Explain the problem

Show why an AI application normally cannot safely treat an arbitrary RPC response as trustworthy cross-chain evidence.

### 2. Trigger source event

The user performs one Sepolia transaction. The source contract emits the ProofMind event.

### 3. Show worker

The worker detects the event and moves it through its state machine.

### 4. Show attestation/proof

Explain that the worker waits for attestation and obtains Merkle/continuity proof material through the documented Attestcoin flow.

### 5. Show Creditcoin verification

The ASC verifies the proof synchronously through the documented verifier precompile.

### 6. Show verified fact

Display the fact only after successful verification.

### 7. Show AI decision

Display the structured decision and reason codes. Explain that AI did not receive unverified source-chain observations.

### 8. Show on-chain policy

The decision contract checks limits, score, expiry, authorization and replay protection.

### 9. Show final execution

Display the Creditcoin transaction hash and resulting state/event.

## Judge questions to prepare for

**Why AI?**
AI makes the decision policy adaptive while cryptographic verification establishes trustworthy input.

**Why not let AI call the contract directly?**
That creates an unsafe arbitrary execution boundary. ProofMind deliberately separates AI proposals from deterministic on-chain enforcement.

**Why Attestcoin?**
The architecture uses Attestcoin Readability to provision verifiable source-chain transaction/event data to Creditcoin.

**What happens if the worker fails?**
State is persisted, events are replay-safe, and retryable stages can resume after restart.

**What happens if AI lies?**
The AI output is schema-validated and then independently constrained by the decision contract. It cannot exceed on-chain policy bounds.

**What happens if a proof is invalid?**
The ASC rejects it and no verified fact or business execution should be produced from that evidence.

## Demo failure fallback

If a live external service fails, demonstrate the deterministic local/mock components only where explicitly documented, and clearly label them as mocked. Never claim a mocked proof is cryptographically verified.
