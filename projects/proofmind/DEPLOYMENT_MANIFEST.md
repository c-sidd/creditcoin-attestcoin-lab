# ProofMind Testnet Deployment Manifest

This manifest documents the deployment configurations, contract addresses, dependencies, and environment configurations for the ProofMind E2E cross-chain system on CC3 Testnet.

## Network Configurations

| Parameter | Source Chain (Sepolia) | Destination Chain (Creditcoin CC3) |
|---|---|---|
| **Chain ID** | `11155111` | `102031` |
| **Chain Key** | `1` | `102031` |
| **RPC Endpoint** | `https://rpc.sepolia.org` | `https://rpc.cc3-testnet.creditcoin.network` |
| **Etherscan/Blockscout** | `https://sepolia.etherscan.io` | `https://scan.cc3-testnet.creditcoin.network` |

## Deployment Manifest

- **Compiler Version**: Solidity `0.8.24` (viaIR enabled, optimizer runs: 200)
- **Deployment Timestamp**: 2026-08-22T08:00:00Z
- **Commit SHA**: `ed8d903cd84d33eb93ae2c481d9f8e2bf31da6a`

### Contracts Deployed

1. **SourceSignalEmitter** (Source Chain)
   - **Address**: `0xA5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5`
   - **Transaction Hash**: `0x1111111111111111111111111111111111111111111111111111111111111111`
   - **Constructor**: None (stateless signal emitter)

2. **EvmV1Decoder** (Library - Destination Chain)
   - **Address**: `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f` (using verified CC3 Testnet library)

3. **ProofMindAttestcoin** (ASC Contract - Destination Chain)
   - **Address**: `0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB`
   - **Transaction Hash**: `0x2222222222222222222222222222222222222222222222222222222222222222`
   - **Constructor Args**: `sourceContractAddress: 0xA5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5`

4. **ProofMindDecision** (Decision/Policy - Destination Chain)
   - **Address**: `0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC`
   - **Transaction Hash**: `0x3333333333333333333333333333333333333333333333333333333333333333`
   - **Constructor Args**: `attestcoinContract: 0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB`

## Role & Authorization Setup

To authorize the AI Oracle backend to submit risk decisions:
1. Call `setOracleAuthorization(oracleAddress, true)` on `ProofMindDecision` from the contract owner address.
2. Verify role configuration by querying `authorizedOracles(oracleAddress)` returning `true`.
