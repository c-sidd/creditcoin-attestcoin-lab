# Creditcoin — What Is Creditcoin?

> Source: Creditcoin official documentation, **What is Creditcoin**.
>
> This file extracts the technical facts that are most relevant to our BUIDL CTC 2026 project research.

## 1. Core Definition

The current Creditcoin network is an **EVM-compatible Layer 1 blockchain**.

Creditcoin's original focus was an RWA protocol, but the current network has evolved into an EVM-compatible L1 that supports general smart-contract development and cross-chain applications.

### Important distinction

The current EVM-compatible network is called **Creditcoin**.

The older Substrate-based Creditcoin network (2.0+ and earlier) is now referred to as **CC Enterprise**.

For our hackathon, we should work with the **current EVM-compatible Creditcoin**, not the older CC Enterprise architecture.

---

## 2. Creditcoin Was Developed in Two Phases

### Phase 1 — EVM Compatibility

The first major goal was to transform Creditcoin into a fully EVM-compatible Layer 1 blockchain.

This means developers can use the same general programming languages and techniques used by Ethereum and other EVM-compatible chains.

The documentation highlights the benefit of existing Ethereum/EVM network effects:

- Lower dApp development costs
- Shorter development lead times
- Familiar development tooling
- Ability to build smart contracts directly on Creditcoin
- Ability to build a broad range of applications and protocols

### Project relevance

This is highly useful for us because our existing Solidity/EVM knowledge can transfer to Creditcoin.

We should investigate whether our normal Ethereum tooling can be used directly or with small configuration changes, especially:

- Solidity
- Hardhat
- Foundry
- ethers.js
- Wallet tooling
- EVM contract deployment/debugging tools

The exact supported tooling should be verified from the dedicated Creditcoin developer documentation before implementation.

---

## 3. Phase 2 — Universal Smart Contracts (USC)

The second phase introduced **Universal Smart Contracts (USC)**.

The current hackathon calls this technology the **Attestcoin Protocol**. USC is the former name.

According to the documentation, USC is released on mainnet.

### What USC/Attestcoin adds

Creditcoin smart contracts can natively:

- Access information from other Layer 1 blockchains
- Access events from other Layer 1 blockchains
- Coordinate smart contracts across multiple chains
- Interact with multiple blockchains through a standardized interface

The documentation specifically mentions chains such as:

- Bitcoin
- Ethereum

The exact currently supported chain list still needs to be researched separately.

---

## 4. The Big Architectural Idea

Without cross-chain infrastructure, blockchains are largely isolated systems:

```text
Ethereum                    Creditcoin
   │                            │
   │  isolated state            │
   │                            │
   └───────────── X ────────────┘
```

With Universal Smart Contracts / Attestcoin:

```text
          Ethereum
              │
              │ data / events
              ▼
       Attestcoin Protocol
              │
              ▼
          Creditcoin
              │
              ▼
       Smart Contract Logic
```

The important change is that Creditcoin can become a **coordination layer for multi-chain applications**.

---

## 5. Creditcoin's Intended Role

The documentation describes Creditcoin as potentially becoming the **Universal Smart Contract Layer of Web3**.

The important concept is not simply:

> "Deploy another EVM smart contract on Creditcoin."

Instead, the more distinctive capability is:

> **Build smart contracts on Creditcoin that can natively coordinate information, events, and smart-contract activity across multiple blockchains.**

This is the capability our hackathon project should exploit.

---

## 6. What This Enables

The documentation's architecture suggests several categories of applications.

### Cross-chain DeFi

A Creditcoin smart contract could potentially use information/events from another chain when implementing:

- Lending
- Borrowing
- Trading
- Collateral logic
- Liquidity mechanisms
- Conditional financial actions

### Cross-chain RWA

Creditcoin's RWA heritage plus USC creates a possible foundation for applications where:

```text
Real-world asset
       ↓
Tokenized / represented on-chain
       ↓
Information across chains
       ↓
Creditcoin
       ↓
Financial/business logic
```

### Cross-chain AI

The hackathon specifically wants AI applications that can process cryptographically verified cross-chain data.

A possible architecture is:

```text
Source Blockchain
       ↓
Verified cross-chain information
       ↓
Attestcoin
       ↓
Creditcoin
       ↓
AI interpretation
       ↓
Smart-contract action
```

This is a project direction to investigate, **not our final product choice yet**.

---

## 7. Key Technical Insight

The most important information from this page is:

> **Creditcoin is not only an EVM L1; its distinctive capability is Universal Smart Contracts / Attestcoin for native multi-chain coordination.**

Therefore, simply building a standard Solidity dApp on Creditcoin is unlikely to showcase the protocol's unique value.

Our project should ideally use:

```text
EVM Smart Contracts
        +
Attestcoin / USC
        +
External Blockchain Data or Events
        ↓
Native Multichain Application
```

---

## 8. What We Need to Investigate Next

This page gives the high-level architecture, but not the implementation details.

We still need to determine:

- [ ] How Creditcoin EVM compatibility works in practice
- [ ] RPC endpoint and chain ID for the relevant testnet
- [ ] Gas token and transaction costs
- [ ] Contract deployment process
- [ ] Supported EVM tooling
- [ ] Attestcoin architecture
- [ ] Supported source chains
- [ ] How cross-chain reads are requested
- [ ] How cross-chain writes/messages are executed
- [ ] Attestcoin Smart Contract interfaces
- [ ] Precompiles
- [ ] Proof/attestation flow
- [ ] SDK usage
- [ ] Testnet limitations

These will be extracted from subsequent documentation pages.

---

## 9. Project-Relevant Facts vs. Our Ideas

### Officially documented

- Creditcoin is an EVM-compatible Layer 1.
- The old Substrate network is now called CC Enterprise.
- Creditcoin supports smart-contract development using EVM-compatible techniques.
- Universal Smart Contracts are released on mainnet.
- USC enables access to information and events on other L1 blockchains.
- USC enables coordination of smart contracts across multiple chains.
- Bitcoin and Ethereum are explicitly mentioned as examples of other L1s.
- USC provides a standardized interface for multi-blockchain event data.

### Our planning conclusions

- We should use Solidity/EVM tooling where supported.
- The final project should probably emphasize cross-chain functionality rather than being a conventional single-chain dApp.
- We should prove the Attestcoin cross-chain primitive before building the full application.
- AI should be considered an application layer on top of verified cross-chain information, rather than the trust mechanism itself.

---

## 10. Key Takeaways

1. **Creditcoin = current EVM-compatible L1.**
2. **CC Enterprise = older Substrate-era Creditcoin.** Do not confuse the two.
3. Creditcoin's EVM compatibility makes Solidity/EVM development accessible.
4. **USC is the previous name for the technology now called Attestcoin Protocol.**
5. The major differentiator is **native multi-chain coordination**.
6. Creditcoin smart contracts can access information/events from other L1 blockchains through USC/Attestcoin.
7. The final hackathon project should use this multi-chain capability as a central part of its architecture.
8. We need the next Attestcoin documentation pages to understand exactly how the cross-chain mechanism is implemented.

---

## Source

Creditcoin Docs — **What is Creditcoin**

Official documentation: https://docs.creditcoin.org/
