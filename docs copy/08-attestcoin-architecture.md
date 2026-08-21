# Attestcoin Protocol — Architecture

> Source: Official Creditcoin documentation — Attestcoin Protocol / Architecture.

## 1. Core Idea

Attestcoin adds **native decentralized oracle capacity** to Creditcoin. This allows **Attestcoin Smart Contracts (ASCs)** on Creditcoin to access verified state/events from other blockchains and react to them with on-chain business logic.

The protocol has two complementary capabilities:

- **Readability** — read and verify data from another blockchain.
- **Writability** — send verified messages from Creditcoin to another blockchain.

Together they create a bidirectional cross-chain communication model.

## 2. Key Terminology

| Term | Meaning | Project Importance |
|---|---|---|
| Readability | Reads data from another blockchain and exposes it to Creditcoin smart contracts | Lets our contract react to verified external-chain events |
| Writability | Sends messages from Creditcoin to another blockchain | Lets our contract trigger verified actions outside Creditcoin |
| ASC | Attestcoin Smart Contract on Creditcoin using readability/writability | Main application contract integrating Attestcoin |
| Source chain | Blockchain from which data is read | Example: Ethereum |
| Destination chain | Blockchain to which messages are sent | Used by writability |
| Attestation | Cryptographic commitment to source-chain block data validated through consensus | Establishes trust in source-chain state |
| Query | Request to verify a specific source-chain transaction | Defines exactly what our ASC wants to prove |
| Proof | Cryptographic evidence that a transaction occurred in a source-chain block | Used for trustless verification |
| Block Prover Precompile | Native Creditcoin component that verifies cross-chain proofs | Core mechanism for readability |
| Attestor | Independent participant that observes chain state/messages and votes | Provides decentralized consensus |
| Validator | Creditcoin authority-set participant that verifies attestor signatures/quorum | Commits attestations to Creditcoin state |
| Relayer | Delivers validated messages to destination chains | Used mainly by writability; permissionless |

## 3. Readability — How It Works

Readability lets a Creditcoin smart contract verify that a specific transaction occurred on a supported source chain.

```text
Source Chain
    │ Transaction
    ▼
Source Block
    │
    ▼
Attestors observe source-chain state
    │
    ▼
Attestors reach consensus
    │
    ▼
Attestation recognized by Creditcoin
    │
    ▼
ASC submits query + proofs
    │
    ▼
Block Prover Precompile (0x0FD2)
    │
    ├── Merkle proof verification
    └── Continuity proof verification
    │
    ▼
Verified transaction bytes
    │
    ▼
ASC extracts required data
    │
    ▼
Application business logic
```

The application does **not** merely trust an API response. The Creditcoin contract verifies cryptographic proofs connecting the requested transaction to a confirmed source-chain block.

## 4. Attestation

An attestation is a cryptographic commitment to source-chain block data, validated through consensus.

Attestors independently observe the source chain and make assertions about its state. Creditcoin does not rely on one attestor.

```text
Attestor A ─┐
Attestor B ─┤
Attestor C ─┤
Attestor D ─┤──> Consensus / aggregated signatures
Attestor E ─┘
                    │
                    ▼
              Creditcoin Validators
                    │
                    ▼
             On-chain attestation
```

## 5. Query

A **query** identifies the transaction that the application wants to verify. A query specifies:

- Source chain
- Block number
- Transaction to verify

Once verified, the ASC can extract information from the verified transaction bytes.

### Project implication

Our product should choose a cross-chain event where the exact transaction data has a clear business meaning.

```text
External transaction
      ↓
Verify transaction
      ↓
Decode event / transaction data
      ↓
Creditcoin contract checks conditions
      ↓
Execute application logic
```

## 6. Proofs

Attestcoin readability uses two important proof concepts.

### Merkle proof

Proves that a transaction is included in a particular source-chain block.

### Continuity proof

Proves that the relevant block is connected to a confirmed source-chain attestation/checkpoint through the chain of block digests.

```text
Transaction
    │
    ▼
Merkle Proof
    │
    ▼
Transaction belongs to Block X
    │
    ▼
Continuity Proof
    │
    ▼
Block X belongs to confirmed source-chain history
```

Together they provide cryptographic verification rather than trust in an external data provider.

## 7. Block Prover Precompile

The **Block Prover Precompile** is a native Creditcoin component at:

```text
0x0FD2
```

It verifies cross-chain readability proofs at native speed.

It verifies:

1. Transaction inclusion through a Merkle proof.
2. Block continuity through a continuity proof.
3. The relationship between the block and a valid attestation/checkpoint.
4. Correct cryptographic linking of block digests.

It is implemented as compiled Rust code rather than normal EVM bytecode, avoiding EVM interpretation overhead.

## 8. `verify()` vs `verifyAndEmit()`

The Block Prover Precompile exposes two verification functions:

### `verify()`

- View-only.
- Does not emit events.

### `verifyAndEmit()`

- State-changing.
- Emits `TransactionVerified` events.

Our ASC can use these mechanisms to verify cross-chain transactions inside a Creditcoin transaction.

## 9. Critical Security Requirement: Transaction Status

The Block Prover Precompile **does not determine whether the source-chain transaction succeeded**. It only proves that the transaction was included in a block and that the block belongs to the confirmed source-chain history.

Therefore, the ASC **must inspect the transaction `status` field**.

The documentation identifies:

```text
status = 0x1 → successful transaction ✅
```

### Project rule

Never treat a verified transaction as successful without checking its status.

The exact implementation should be confirmed from the Readability SDK/interface before coding.

## 10. Writability — How It Works

Writability reverses the direction. Instead of proving an event that happened on another chain, Creditcoin publishes a message intended for another blockchain.

```text
Creditcoin ASC
      │
      ▼
Outbox Contract
      │
      ▼
Cross-chain message
      │
      ▼
Attestors observe message
      │
      ▼
Attestors vote
      │
      ▼
Consensus threshold reached
      │
      ▼
Validated message
      │
      ▼
Relayer
      │
      ▼
Destination Inbox Contract
      │
      ▼
Destination-chain execution
```

## 11. Attestors in Writability

Attestors have a mirror-image role:

- **Readability:** validate facts coming **from** another chain.
- **Writability:** validate messages going **to** another chain.

Once enough attestor signatures are collected, the message is considered validated.

## 12. Message Relayers

Relayers deliver validated messages to destination chains.

Important properties:

- They do **not** participate in consensus.
- They do **not** vote.
- Anyone can operate a relayer.
- No bond is required.
- They earn a delivery fee.
- They cannot forge or alter a message because the destination Inbox verifies attestor signatures.
- A malicious relayer can affect delivery, but not the cryptographic validity of the message.

Relayers can also help the readability path by generating/submitting transaction proofs for dApps that do not want to run their own proof infrastructure.

## 13. Readability + Writability = Closed Information Loop

A sophisticated application can:

```text
1. Prove an event on Chain A
          ↓
2. Execute logic on Creditcoin
          ↓
3. Publish a verified instruction
          ↓
4. Deliver it to Chain B
          ↓
5. Trigger execution on Chain B
          ↓
6. Potentially verify the resulting event again
```

This enables true bidirectional cross-chain applications rather than simple one-way data feeds.

## 14. Documentation Example: Bridge Logic

### Readability

A Creditcoin bridge contract could:

1. Verify that a user burned/locked ETH on Ethereum.
2. Use the verified transaction to prove that event.
3. Mint equivalent wrapped tokens on Creditcoin.

### Writability

When wrapped ETH is later burned on Creditcoin:

1. Creditcoin publishes a writability message.
2. The message declares that the wrapped tokens were burned.
3. Attestors validate the message.
4. A relayer delivers it to Ethereum.
5. Ethereum verifies the message and releases the original ETH.

This demonstrates how readability and writability can work together.

## 15. What This Means for Our Hackathon Project

The strongest architecture should make Attestcoin **necessary**, not decorative.

### Weak integration

```text
Normal dApp on Creditcoin
        +
Random cross-chain data display
```

### Strong integration

```text
External-chain event
        ↓
Attestcoin verification
        ↓
Creditcoin ASC
        ↓
Critical business decision
        ↓
On-chain outcome
```

### Even stronger

```text
Chain A
  ↓ readability
Creditcoin
  ↓ application logic
Creditcoin
  ↓ writability
Chain B
```

The demo should make it obvious that removing Attestcoin would break the core product behavior.

## 16. Design Opportunities

### DeFi

Use verified activity on another chain as a condition for lending, repayment, liquidity, trading, or settlement.

### RWA

Use verified external-chain records/events as inputs into tokenized asset financing or settlement.

### DePIN

Use verifiable cross-chain activity to determine rewards, settlement, or coordination.

### Gaming

Use verified external-chain ownership/activity to unlock game assets or actions.

### AI

Use cryptographically verified cross-chain data as an input to an AI decision system, with the final important action executed on-chain.

These are candidate directions, not the final product. We should inspect Readability, Writability, SDK, supported chains, and tutorials before selecting one.

## 17. Architecture Checklist

Before implementation, confirm:

- [ ] Supported source chains.
- [ ] Supported destination chains.
- [ ] Exact ASC interfaces.
- [ ] Exact query format.
- [ ] Proof format.
- [ ] How to obtain Merkle proofs.
- [ ] How to obtain continuity proofs.
- [ ] Block Prover ABI/interface.
- [ ] `verify()` usage.
- [ ] `verifyAndEmit()` usage.
- [ ] Transaction status decoding.
- [ ] Outbox contract interface.
- [ ] Inbox contract behavior.
- [ ] Attestor quorum requirements.
- [ ] Relayer setup.
- [ ] Testnet addresses.
- [ ] Testnet supported chains.
- [ ] SDK support.
- [ ] Exact deployment workflow.

Do not implement the core cross-chain logic until these details are confirmed from the relevant documentation.

## 18. Key Takeaways

1. Attestcoin adds decentralized oracle functionality directly to Creditcoin.
2. **Readability** verifies data/events from external blockchains.
3. **Writability** sends verified messages from Creditcoin to external blockchains.
4. ASCs are Creditcoin smart contracts that use these capabilities.
5. Readability uses Merkle proofs + continuity proofs.
6. The Block Prover Precompile is at `0x0FD2`.
7. `verify()` is view-only; `verifyAndEmit()` is state-changing and emits `TransactionVerified`.
8. The Block Prover proves transaction inclusion, **not transaction success**.
9. The ASC must check `status == 0x1` for a successful source transaction.
10. Attestors provide decentralized consensus.
11. Creditcoin validators verify attestor signatures/quorum and commit attestations.
12. Relayers deliver validated writability messages but do not participate in consensus.
13. Readability + writability enables a bidirectional cross-chain information loop.
14. For the hackathon, Attestcoin should be a core dependency of the product's business logic.

## Source

Creditcoin Docs — Attestcoin Protocol / Architecture

Official documentation: https://docs.creditcoin.org/attestcoin-protocol/architecture
