# Prompt 14 — CC3 Testnet Integration

```text
Configure a real Sepolia → CC3 testnet ProofMind deployment using only documented network values and verified reference interfaces.

Before execution verify:
- wallet balances
- chain IDs/network configuration
- source contract address
- ASC/decision contract addresses
- Proof Builder endpoint
- required environment variables
- gas availability

Execute one real event and wait for every asynchronous stage.

Capture transaction hashes and independently query final state.

If a failure occurs, preserve the raw error, identify the boundary, compare with the reference implementation, and document the blocker. Do not silently bypass the failing component.

Gate: PASS only after one complete real testnet lifecycle succeeds.
```
