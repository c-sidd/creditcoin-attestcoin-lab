# 10 — Smart Contracts

## Contract A — SourceSignalEmitter

**Network:** Ethereum Sepolia for MVP.

### Responsibilities

- Accept the minimal input needed for the demo.
- Emit an unambiguous event.
- Avoid unnecessary cross-chain business logic.

### Event

```solidity
event RiskSignalSubmitted(
    bytes32 indexed signalId,
    address indexed subject,
    uint256 signalValue,
    uint256 timestamp
);
```

The exact event signature should be frozen before worker implementation.

## Contract B — ProofMindAttestcoin

**Network:** Creditcoin CC3 Testnet.

### Responsibilities

- Accept proof data from the worker.
- Call the Native Query Verifier / Block Prover precompile.
- Confirm the requested source transaction.
- Decode/extract the required event information.
- Reject replayed evidence.
- Emit a `VerifiedFactCreated` event.
- Forward verified data to business logic when appropriate.

### Security boundary

Never treat an event field supplied by the worker as verified until the precompile verification succeeds.

## Contract C — ProofMindDecision

**Network:** Creditcoin CC3 Testnet.

### Responsibilities

- Accept a bounded AI decision.
- Verify caller authorization.
- Verify evidence ID has been verified.
- Reject replayed evidence/decision IDs.
- Validate decision/action compatibility.
- Enforce score and limit bounds.
- Enforce optional expiry.
- Execute the allowed state transition.
- Emit a final event.

## Suggested events

```solidity
event VerifiedFactCreated(bytes32 indexed evidenceId, bytes32 sourceTxHash);
event DecisionExecuted(bytes32 indexed evidenceId, uint8 decision, uint256 score, uint256 limit);
event DecisionRejected(bytes32 indexed evidenceId, bytes32 reason);
```

## Contract organization

The supplied Creditcoin documentation recommends a separated ASC/business-logic pattern for complex dApps. ProofMind follows that pattern for clarity: verification and business policy remain separate concerns.

## Upgradeability

Do not add upgradeability to the MVP unless it is necessary. Simpler immutable contracts are easier to reason about during a hackathon demo.
