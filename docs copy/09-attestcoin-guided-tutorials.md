# Attestcoin Protocol — Guided Tutorials

> Source: Official Creditcoin documentation — Guided Tutorials.
>
> The tutorials are educational material and should not be treated as production deployment instructions without further security review.

## 1. Purpose

The Guided Tutorials provide a practical learning path from a simple Attestcoin bridge to more advanced custom cross-chain applications.

The documentation says the modules build on one another, so they are useful for learning both protocol concepts and the builder workflow.

## 2. Tutorial Sequence

1. **Introduction to Attestation Protocol**
2. **Attestcoin Tutorial 1 — Hello Bridge**
3. **Attestcoin Tutorial 2 — Custom Contract Bridging**
4. **Attestcoin Tutorial 3 — Bridge Off-chain Worker**
5. **Attestcoin Tutorial 4 — Cross-Chain Loan dApp**

This progression moves from basic protocol interaction toward application-level cross-chain business logic.

## 3. Official Tutorial Repository

The documentation links to:

```text
https://github.com/gluwa/usc-testnet-bridge-examples
```

This repository is important for us because it should contain concrete examples of the contracts, infrastructure, and transaction flow described by the documentation.

## 4. Naming Note

The tutorial videos use the older term **Universal Smart Contracts (USC)**.

The technology has since been renamed **Attestcoin Protocol**.

```text
USC → Attestcoin Protocol
USC Smart Contract → Attestcoin Smart Contract (ASC)
```

The documentation states that the videos otherwise remain accurate.

## 5. Why These Tutorials Matter

These tutorials can reduce implementation risk by showing working examples of the infrastructure we need to understand.

### Tutorial 1 — Hello Bridge

Useful for understanding the minimum end-to-end cross-chain flow.

**Research goal:** reproduce the smallest working Attestcoin flow on testnet.

### Tutorial 2 — Custom Contract Bridging

Useful for understanding how custom source-chain and destination-chain contracts integrate with Attestcoin rather than relying on a fixed bridge implementation.

**Research goal:** understand how we should structure our own source contract, events, ASC, and business logic.

### Tutorial 3 — Bridge Off-chain Worker

Especially relevant to our Readability architecture:

```text
Detect Event
     ↓
Wait for Attestation
     ↓
Request Proofs
     ↓
Call ASC
     ↓
Verify & Execute
```

**Research goal:** identify the actual worker implementation, Proof Builder API calls, retry handling, and ASC transaction format.

### Tutorial 4 — Cross-Chain Loan dApp

Particularly important for project research because it demonstrates **application-level cross-chain business logic**, not just token movement.

Potentially relevant patterns include:

- DeFi
- Cross-chain credit
- Collateral verification
- Conditional execution
- Financial/RWA workflows

**Research goal:** understand why verified cross-chain data changes the loan application's business logic.

## 6. Recommended Learning Order

```text
1. Introduction
      ↓
2. Hello Bridge
      ↓
3. Custom Contract Bridging
      ↓
4. Off-chain Worker
      ↓
5. Cross-Chain Loan dApp
```

At each stage we should record:

- Source-chain contract structure
- Events emitted
- Chain/environment configuration
- Proof Builder usage
- ASC interface
- Block Prover interaction
- Business logic contract
- Worker implementation
- Testnet transaction flow
- Deployment commands
- Common failure points

## 7. What to Extract From the Tutorial Repository

### Contracts

- Source-chain contracts
- ASC contracts
- Business logic contracts
- Inbox/Outbox contracts if Writability is demonstrated
- Interfaces and ABIs

### Off-chain infrastructure

- Event listeners
- Proof Builder client
- Attestation checking
- Worker state management
- Retry logic
- Duplicate/replay protection

### Configuration

- RPC endpoints
- Chain keys
- Testnet addresses
- Environment variables
- SDK version
- Contract addresses

### Deployment

- Package manager
- Solidity toolchain
- Deployment scripts
- Testnet funding process
- Contract verification/explorer workflow

## 8. Project Selection Insight

The **Cross-Chain Loan dApp** tutorial is especially important because it demonstrates that Attestcoin is intended for more than simple bridging.

The reusable design principle is:

> A verified event or state from another blockchain should directly change an application's state or financial/business outcome on Creditcoin.

We should **not simply reproduce the tutorial**. We should study its architecture and then create an original application for the hackathon.

## 9. Learning Checklist

- [ ] Review the official tutorial repository.
- [ ] Run the Hello Bridge example on testnet.
- [ ] Understand the custom contract example.
- [ ] Understand the off-chain worker implementation.
- [ ] Reproduce a proof-generation request.
- [ ] Reproduce an ASC verification call.
- [ ] Study the cross-chain loan architecture.
- [ ] Identify reusable Attestcoin primitives.
- [ ] Separate tutorial-specific code from protocol capabilities.

## 10. Source

Creditcoin Docs — Attestcoin Protocol Guided Tutorials.

Official tutorials repository:
https://github.com/gluwa/usc-testnet-bridge-examples
