# Merkle Proving and Readability Gas Costs

> Based on the Creditcoin Attestcoin Protocol documentation. Educational research notes; not production deployment guidance.

## 1. Merkle Proving

Attestcoin Readability uses Merkle proofs to establish that a specific transaction is included in a specific source-chain block.

### Why Merkle proofs?

A block can contain a very large number of transactions. Checking every transaction directly is inefficient. A Merkle proof requires only `O(log n)` hashes for a block containing `n` transactions.

Examples from the documentation:

| Transactions in block | Approx. hashes |
|---:|---:|
| 1 | 1 |
| 1,024 | 11 |
| 1,000,000 | ~20 |

### How it works

1. Transaction bytes are hashed to form a leaf.
2. Transaction leaves are combined pairwise into parent hashes.
3. Hashing continues until one Merkle root remains.
4. The proof contains the transaction bytes and sibling hashes along the path to the root.
5. The Block Prover Precompile reconstructs the path.
6. If the computed root matches the expected block Merkle root, transaction inclusion is proven.
7. The Attestcoin Smart Contract can then decode the verified transaction bytes and use the data in application logic.

### Important implementation detail

Attestcoin Readability uses standard Merkle trees with **Keccak-256** hashing. Merkle proofs are verified natively by the Creditcoin Block Prover Precompile.

### What this proves — and what it does not

A Merkle proof proves that a transaction is included in a particular block. It does not by itself prove that the block belongs to the finalized source chain. That is the job of the **continuity proof**.

Therefore, complete Readability verification combines:

```text
Merkle Proof
    +
Continuity Proof
    ↓
Transaction cryptographically verified
```

The ASC should additionally validate application-specific conditions such as transaction/receipt status and expected events after verification.

---

## 2. Readability Gas Costs

On-chain verification of Readability queries consumes normal gas for computation.

### Main cost factors

#### 1. Continuity proof length — major factor

For each block represented in a continuity proof, the Block Prover Precompile performs hashing to calculate the block digest. Longer continuity proofs therefore require more gas.

Historical queries can have much longer continuity proofs than recently finalized transactions.

#### 2. Merkle proof size — smaller factor

Merkle proof size grows logarithmically with the number of transactions in a block. This causes some gas variation but is not normally the dominant cost.

For example:

- 1 transaction → 1 hash
- 1,024 transactions → 11 hashes

#### 3. Transaction data size — usually small, but can matter

Decoding transaction data is necessary after verification. Most transactions have negligible decoding cost, but unusually large transactions can become expensive.

The documentation specifically warns about:

- Transactions containing thousands of circular contract calls.
- Transactions bundling state updates for Layer-2 rollups.
- Repeated verification and decoding of very large transactions.

One maximal decoding workload is estimated at approximately **0.0375 CTC**.

---

## 3. Approximate Verification Formula

The documentation gives this rough model:

```text
Cost ≈ base transaction cost + hash operation cost × continuity hash count
```

Approximate CTC cost:

```text
CTC Cost ≈ 2.3 × 10^-5 + 2.9 × 10^-7 × continuity_hash_count
```

### Example 1: Recent transaction

A transaction finalized around 10 minutes ago may have an attestation close to its block height. If 10 continuity hashes are required:

```text
≈ 2.59 × 10^-5 CTC
```

### Example 2: Older transaction

After another 24 hours, sparse checkpoints may mean that the same transaction requires around 1,000 continuity hashes:

```text
≈ 3.13 × 10^-4 CTC
```

The second case is more than 10× more expensive.

> These are approximate figures from the Creditcoin documentation and should not be treated as fixed production gas prices.

---

## 4. Project Design Implications

This creates an important optimization opportunity for applications using Readability heavily:

```text
Source-chain event
      ↓
Wait for finality
      ↓
Detect relevant event quickly
      ↓
Generate proof
      ↓
Submit to Creditcoin
      ↓
Verify on-chain
      ↓
Execute application logic
```

When practical, verifying recently finalized transactions can reduce continuity-proof length substantially compared with waiting for much older checkpoints.

### Builder checklist

- Prefer recently finalized source-chain events when application logic allows it.
- Avoid unnecessary verification of very large transactions.
- Remember that Merkle proof size is usually not the main gas concern.
- Account for continuity-proof length when designing frequent cross-chain verification flows.
- Treat gas as part of the application's cross-chain architecture, not merely a deployment detail.

## 5. Verification Model

```text
Source Chain
    │
    ▼
Finalized Block
    │
    ├── Transaction
    │       │
    │       ▼
    │   Merkle Proof
    │
    ▼
Attestation / Checkpoint
    │
    ▼
Continuity Proof
    │
    └──────────────┐
                   ▼
          Block Prover Precompile
                   │
                   ▼
          Verified Transaction
                   │
                   ▼
          Attestcoin Smart Contract
                   │
                   ▼
          Application Logic
```

## 6. Key Takeaway

**Merkle proving answers:**

> Did this transaction occur inside this block?

**Continuity proving answers:**

> Is this block part of the finalized source chain?

Together they allow an Attestcoin Smart Contract on Creditcoin to use source-chain transaction data without trusting a centralized oracle operator.

## Source

Creditcoin Docs — Attestcoin Readability — Gas Costs:
https://docs.creditcoin.org/attestcoin-protocol/attestcoin-readability/gas-costs.md
