# Protocol Interface Inventory

This document maps all external protocol dependencies, endpoints, addresses, and boundaries for ProofMind.

## 1. Environment & Chain Details

| Parameter | Ethereum Sepolia (Source) | Creditcoin CC3 Testnet (Destination) |
|---|---|---|
| **EVM Chain ID** | `11155111` | `102031` |
| **USC Chain Key** | `1` | N/A (Destination) |
| **RPC Endpoint (HTTPS)** | Dev/Staging RPC (e.g. Infura/Alchemy) | `https://rpc.cc3-testnet.creditcoin.network` |
| **RPC Endpoint (WSS)** | Dev/Staging WSS | `wss://rpc.cc3-testnet.creditcoin.network` |

## 2. Attestcoin Precompiles

### BlockProver / Native Query Verifier
* **Address**: `0x0000000000000000000000000000000000000FD2`
* **Solidity Interface**:
```solidity
struct MerkleProofEntry {
    bytes32 hash;
    bool isLeft;
}

struct MerkleProof {
    bytes32 root;
    MerkleProofEntry[] siblings;
}

struct ContinuityProof {
    bytes32 lowerEndpointDigest;
    bytes32[] roots;
}

interface IBlockProver {
    function verify(
        uint32 chainKey,
        uint64 headerNumber,
        bytes calldata txBytes,
        MerkleProof calldata merkleProof,
        ContinuityProof calldata continuityProof
    ) external view returns (bool);
}
```

### ChainInfo Precompile
* **Address**: `0x0000000000000000000000000000000000000FD3`
* **Solidity Interface**:
```solidity
interface IChainInfo {
    function getLatestAttestedHeightAndHash(uint32 chainKey) external view returns (uint64, bytes32);
}
```

## 3. Proof Builder
* **Endpoint**: `https://prover.cc3-testnet.creditcoin.network`
* **SDK Methods (`@gluwa/usc-sdk` v0.18.0)**:
  * `new proofProvider.service.ProofBuilder(chainKey, proofBuilderUrl)`
  * `waitUntilHeightAttested(blockNumber)`
  * `getProof(txHash)` -> returns proof payload (merkleProof, continuityProof, headerNumber, txBytes, etc.)

## 4. Verification Baseline
* **Source**: `docs/33-protocol-interface-verification-2026-08-18.md` and `docs copy/13-tutorial-repo-implementation-notes.md`.
