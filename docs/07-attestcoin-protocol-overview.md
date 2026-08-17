# Attestcoin Protocol — Project-Relevant Notes

> Source: Official Creditcoin documentation — Attestcoin Protocol.

## 1. What is Attestcoin?

The Attestcoin Protocol is a cross-chain interoperability hub hosted on Creditcoin. It gives Creditcoin smart contracts the ability to read verified information from, and write/trigger actions on, supported blockchains.

Attestcoin uses decentralized oracle infrastructure rather than relying on a single centralized oracle operator. Trust is distributed across multiple independent parties, reducing the single-point-of-failure problem of centralized oracles.

## 2. Attestcoin Smart Contracts (ASC)

Applications on Creditcoin use **Attestcoin Smart Contracts (ASC)** to interact with the Attestcoin Protocol and execute business logic spanning multiple chains.

```text
User
  ↓
Creditcoin EVM
  ↓
Application / Attestcoin Smart Contract
  ↓
Attestcoin Protocol
  ↓
Ethereum / Bitcoin / Other supported chains
```

## 3. Cross-Chain Readability

A Creditcoin smart contract can use verified information or events from another supported chain.

```text
Foreign-chain transaction/event
          ↓
Attestcoin verification
          ↓
Creditcoin contract
          ↓
On-chain application decision
```

For the hackathon, the verified foreign-chain information should **meaningfully affect the application's on-chain behavior** rather than merely being displayed by a frontend.

## 4. Cross-Chain Writability

Attestcoin also supports the ability for Creditcoin smart contracts to write/execute business logic across supported chains.

```text
Read:  Other Chain → verified data → Creditcoin
Write: Creditcoin → cross-chain action → Other Chain
```

We need the dedicated Readability and Writability documentation to determine the exact implementation.

## 5. Why it matters for the hackathon

The hackathon requires a **meaningful and functional Attestcoin Protocol integration**. The following alone are not sufficient:

- Connecting MetaMask
- Deploying an ordinary Solidity contract
- Using Creditcoin only as an EVM chain
- Reading another blockchain through an ordinary centralized API

A strong integration should instead look like:

```text
External blockchain state/event
          ↓
Attestcoin verification
          ↓
Creditcoin Smart Contract
          ↓
Application state change / decision
          ↓
Real DeFi / RWA / AI / DePIN / Gaming outcome
```

## 6. Useful Use Cases

### Cross-chain DeFi

- Lending and borrowing
- Trading and yield systems
- Conditional payments
- Cross-chain asset/NFT logic
- Fractionalized real-world assets

### Gaming

- Cross-chain game economies
- Asset ownership
- Player marketplaces
- Incentive systems

### Governance

- Cross-chain voting
- Identity-aware governance
- Decisions based on verifiable public blockchain state

These ideas also connect naturally with the hackathon's RWA, DePIN, and AI tracks.

## 7. Current Oracle Capacity

According to the documentation, once a source-chain block is finalized and attested on Creditcoin, the Attestcoin Protocol's block prover precompile can validate transactions from that block synchronously.

The documented verification flow can complete within approximately **one Creditcoin block (~15 seconds)** after the source block is finalized and attested.

```text
Source block finalized
        ↓
Block attested on Creditcoin
        ↓
Block prover validates transaction
        ↓
Foreign transaction decoded
        ↓
Result used in dApp execution
```

### Batch queries

Up to **10 queries** can be verified in a batch when they share a continuity proof.

This may be useful for applications requiring several related cross-chain facts.

## 8. Attestcoin vs Bridge

A bridge and Attestcoin should not be treated as the same thing.

A bridge primarily transfers assets/messages between networks. Attestcoin's key value for this hackathon is **verified cross-chain data and cross-chain business logic**.

Therefore, we should not build a simple bridge and call that Attestcoin integration.

## 9. Current Architecture Direction

Do not lock the product idea yet. First understand the implementation details.

```text
                    User
                      ↓
                 EVM Wallet
                      ↓
              Creditcoin EVM
                      ↓
            Application Contract
                      ↓
             Attestcoin Smart Contract
                      ↓
             Attestcoin Protocol
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
   Ethereum        Bitcoin       Other chains
```

Next we need to study:

1. Attestcoin Architecture
2. Attestcoin Readability
3. Attestcoin Writability
4. dApp Builder Infrastructure / SDK
5. Guided Tutorials
6. Supported chains and environments

Those documents should determine the exact contracts, precompiles, interfaces, transaction format, and development workflow.

## 10. Key Takeaways

1. Attestcoin is Creditcoin's cross-chain interoperability infrastructure.
2. It uses decentralized attestation/oracle infrastructure.
3. Creditcoin contracts can consume verified data/events from other chains.
4. Creditcoin contracts can also initiate supported cross-chain actions.
5. Attestcoin Smart Contracts are the application-facing contract layer.
6. Cross-chain data should affect actual on-chain business logic.
7. Verification can complete in roughly one Creditcoin block (~15 seconds) after the source block is finalized and attested.
8. Up to 10 queries can be batched when they share a continuity proof.
9. Attestcoin integration is a core hackathon requirement.
10. We should understand Architecture, Readability, Writability, SDK, and tutorials before selecting the final project.

## Source

Creditcoin Docs — Attestcoin Protocol
https://docs.creditcoin.org/attestcoin-protocol
