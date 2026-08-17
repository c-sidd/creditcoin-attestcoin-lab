# Attestcoin Protocol Operator Guides

## Overview

The Attestcoin Protocol has two decentralized operator roles on Creditcoin:

1. **Attestor** — tracks source-chain blocks and creates attestations.
2. **Relayer** — handles cross-chain message/data delivery workflows.

> The documentation notes that the relayer role is evolving and that some writability functionality is not yet released.

## 1. Attestor Role

Attestors have two primary responsibilities.

### A. Follow and attest source-chain blocks

Attestors continuously follow new blocks on supported source chains and attest to their state.

This process is important for **Readability** because the attestation data later allows source-chain transactions to be proven efficiently on Creditcoin.

The attestation flow is roughly:

```text
Source Chain
    |
    | new finalized blocks
    v
Attestor
    |
    | create + sign attestation
    v
P2P Attestor Network
    |
    | aggregate votes/signatures
    v
Creditcoin
    |
    | verify + store attestation
    v
Readability proofs
```

Attestors therefore form an important part of the trust and consensus layer behind Readability.

### B. Future writability signing

The documentation states that in an upcoming release Attestors will also sign **writability messages**.

This is intended to allow Attestcoin Smart Contracts to send data to destination chains, providing two-way interoperability.

Conceptually:

```text
Current Readability:
Source Chain ---> Creditcoin

Future Writability:
Source Chain <--> Creditcoin
```

## 2. Relayer Role

The Relayer role is evolving quickly.

Relayers are associated with moving cross-chain messages/data between the relevant systems. The exact production architecture and responsibilities may change as the Attestcoin Protocol develops.

For the current learning project, the important distinction is:

| Role | Main purpose |
|---|---|
| Attestor | Establish consensus about source-chain state |
| Relayer | Help deliver/submit cross-chain messages |
| dApp Worker | Application-specific off-chain automation |
| ASC | Verify data and execute Creditcoin-side logic |

## 3. Attestor vs dApp Readability Worker

These roles should **not** be confused.

### Attestor

The Attestor is part of the decentralized Attestcoin Protocol infrastructure. It independently observes source-chain state and contributes attestations to protocol consensus.

### dApp Readability Worker

A dApp team's worker is application infrastructure. It watches for events relevant to that specific dApp, waits for the required attestation, obtains proofs, and submits them to the dApp's Attestcoin Smart Contract.

```text
                  Attestcoin Protocol
                         |
              +----------+----------+
              |                     |
          Attestors              Relayers
              |                     |
       Source-chain state      Cross-chain delivery
              |
              v
         Attestations
              |
              v
      dApp Readability Worker
              |
              v
       Proof Builder API
              |
              v
             ASC
              |
              v
       Business Logic
```

## 4. Why Operators Matter

The operator layer is what makes the protocol decentralized rather than relying on one centralized service.

For Readability:

```text
Many Attestors
      |
      v
Independent observations
      |
      v
Consensus / aggregated signatures
      |
      v
On-chain attestations
      |
      v
Cryptographic transaction proofs
      |
      v
Creditcoin dApps
```

A single malicious attestor should not be able to convince the system of an arbitrary source-chain state because the protocol requires consensus among eligible attestors.

## 5. Connection to What We Have Learned

This section completes an important part of the Attestcoin architecture we have studied so far.

### Readability

```text
Attestors
   |
   v
Attestations
   |
   v
Continuity Proof
   +
Merkle Proof
   |
   v
Block Prover Precompile
   |
   v
ASC
   |
   v
Business Logic
```

### Writability

The documentation indicates that future Attestor signing capabilities will allow the reverse direction:

```text
ASC on Creditcoin
       |
       v
Writability message
       |
       v
Attestor signatures
       |
       v
Destination Source Chain
```

This is the key architectural idea behind **two-way cross-chain interoperability**.

## 6. Learning Notes

Important concepts to remember:

- **Attestors** establish decentralized consensus about source-chain state.
- **Attestations** are cryptographic commitments to observed source-chain blocks.
- **Readability** uses those attestations to prove source-chain transactions on Creditcoin.
- **Relayers** are a separate operational role concerned with cross-chain message delivery and are still evolving.
- **dApp Workers** are application-specific automation services, not protocol-level attestors.
- Future writability support is intended to make cross-chain communication bidirectional.

## Source

Creditcoin Docs — Attestcoin Protocol Operator Guides:
https://docs.creditcoin.org/attestcoin-protocol/attestcoin-protocol-operator-guides
