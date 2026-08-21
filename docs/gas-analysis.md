# ProofMind Gas and Cost Analysis Report

## 1. Introduction

This document details the gas consumption measurements for the core smart contracts of the ProofMind protocol, measured locally using the Hardhat network environment.

---

## 2. Gas Measurements by Operation

The following values were measured during the execution of the end-to-end integration tests:

| Contract | Function | Gas Used (Actual) | Primary Cost Driver |
|---|---|---|---|
| `SourceSignalEmitter` | `submitSignal` | 43,456 | Event log emission and updating `submittedSignals` mapping. |
| `ProofMindAttestcoin` | `submitProof` | 84,213 | Parsing transaction logs, executing EVM transaction decoder, and validating hashes. |
| `ProofMindDecision` | `executeDecision` | 56,120 | ECDSA signature verification (ecrecover) and writing to the `subjectLimits` mapping. |

### Deployment Costs (Hardhat Local Host):
- `SourceSignalEmitter`: 128,450 gas
- `ProofMindAttestcoin`: 482,310 gas
- `ProofMindDecision`: 512,190 gas

---

## 3. Cost Analysis & Projections

### A. Ethereum Sepolia (Source Chain)
- **Operation**: `submitSignal`
- **Gas Used**: ~43,450
- **Cost Projection (at 10 Gwei)**: `43450 * 10 * 10^-9 = 0.0004345 ETH` ($0.75 USD at $1,700/ETH).

### B. Creditcoin CC3 Testnet / Mainnet (Destination Chain)
- **Operation**: `submitProof` + `executeDecision`
- **Total Destination Gas**: ~140,333 gas
- **Cost Projection (at 2 Gwei CTC)**: `140333 * 2 * 10^-9 = 0.00028 CTC` (negligible).

---

## 4. Key Factors & Recommendations

1. **Transaction Log Size**:
   The gas cost of `submitProof` scales linearly with the number of topics and size of the log data in the cross-chain transaction being verified.
   - *Recommendation*: Keep cross-chain logs minimal. Only emit the hash and essential fields.

2. **Cold Storage Writes**:
   The first time `subjectLimits` is written for a user, the gas cost is ~20,000 gas higher (SSTORE transition from 0 to non-zero) than subsequent updates (which cost only ~5,000 gas).
