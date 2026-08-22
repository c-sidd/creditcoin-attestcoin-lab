# ProofMind Deployment Manifest

This manifest describes the network configuration used by the ProofMind demo. **The addresses and hashes below are intentionally not presented as live deployment evidence.** A real CC3 Testnet deployment must be recorded only after the contracts are deployed and independently verified on-chain.

## Network Configurations

| Parameter | Source Chain (Sepolia) | Destination Chain (Creditcoin CC3) |
|---|---|---|
| **Chain ID** | `11155111` | `102031` |
| **Chain Key** | `1` | `102031` |
| **RPC Endpoint** | `https://rpc.sepolia.org` | `https://rpc.cc3-testnet.creditcoin.network` |
| **Explorer** | `https://sepolia.etherscan.io` | `https://scan.cc3-testnet.creditcoin.network` |

## Current Deployment Status

**Status: LOCAL / SIMULATED DEMO CONFIGURATION — NOT A LIVE TESTNET DEPLOYMENT**

The repository previously contained placeholder-looking addresses and transaction hashes. They have been removed from this manifest so demo configuration cannot be mistaken for real blockchain evidence.

### Contracts

- **SourceSignalEmitter** — deployed/used by local Hardhat simulation only until a real Sepolia deployment is recorded.
- **EvmV1Decoder** — library dependency used by the destination-chain contract.
- **ProofMindAttestcoin** — tested locally with the native verifier address replaced by a test mock; no live CC3 deployment is claimed here.
- **ProofMindDecision** — tested locally as the policy/decision contract; no live CC3 deployment is claimed here.

## Required Live Deployment Evidence

When a real CC3 Testnet run is completed, update this file with:

1. Real contract addresses.
2. Real deployment transaction hashes.
3. Deployment block numbers.
4. Deployer/oracle addresses where appropriate.
5. Explorer links for each transaction and contract.
6. The exact source commit used for deployment.
7. A successful end-to-end proof submission transaction demonstrating real Attestcoin verification.

## Role & Authorization Setup

To authorize the AI Oracle backend to submit risk decisions:

1. Call `setOracleAuthorization(oracleAddress, true)` on `ProofMindDecision` from the contract owner.
2. Verify `authorizedOracles(oracleAddress)` returns `true`.
3. Record the real transaction hash in the live deployment evidence section once deployed.
