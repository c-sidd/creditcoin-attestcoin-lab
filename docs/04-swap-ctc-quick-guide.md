# Swap CTC Quick Guide — Project-Relevant Notes

> Source: Official Creditcoin documentation — Swap CTC Quick Guide.

## 1. Current Bridge Context

Creditcoin supports moving CTC-related assets between Creditcoin, BSC, and Ethereum using Wormhole Portal Bridge. The older SwapCTC mechanism remains available for specific one-way routes.

### Legacy SwapCTC routes

```text
G-CRE    → CTC (Creditcoin Mainnet)
WCTC old → CTC (Creditcoin Mainnet)
```

The newer recommended cross-chain asset movement path is Wormhole.

## 2. Legacy SwapCTC Flow

1. Open the official SwapCTC tool.
2. Send G-CRE or old WCTC to the official Creditcoin Foundation address:

```text
0x6524653466b9E0E9d515103873e4005Dd99c560F
```

3. Have enough ETH for source-chain gas.
4. The Foundation processes the swap manually. The page states processing can take **1–2 weeks**.
5. CTC is received at a **1:1 ratio** at the same EVM address used to send the tokens.

The resulting balance can be viewed with Credit Wallet, MetaMask after adding Creditcoin, or Creditcoin Blockscout.

## 3. Security

The documentation says to verify the official Swap address through a verified Creditcoin Discord admin or `team@creditcoin.org`.

Do not copy bridge/deposit addresses from unofficial sources.

## 4. Transparency Addresses

The page lists these Creditcoin Foundation storage addresses:

**EVM**

```text
0x29Cb375c0BA5Dc475F1a5BCec2d8b87C9DA7B883
```

**Native**

```text
5DDYL8H9sVhVS3P17TBiPMZVKt4GEc24G37ov4xXykvdBDTs
```

The documentation says received G-CRE and old WCTC are regularly batch-burned after swaps are completed.

## 5. Creditcoin Mainnet EVM Configuration

The documented mainnet configuration is:

| Setting | Value |
|---|---|
| Network Name | Creditcoin |
| RPC URL | `https://mainnet3.creditcoin.network` |
| Chain ID | `102030` |
| Ticker | `CTC` |
| Block Explorer | `https://creditcoin.blockscout.com/` |

**Important:** these are mainnet values. We must obtain the exact hackathon testnet configuration from the environments documentation instead of assuming these values apply to testnet.

## 6. What CTC Can Do After Bridging

CTC on Creditcoin can be used for:

- dApps
- DeFi
- Trading ecosystem tokens on Penguinswap
- Bridging back to Ethereum or BNB through Wormhole
- Converting to CTC (Native) for staking

For our EVM project, CTC is especially relevant for transaction gas and contract interactions.

## 7. Wormhole vs Attestcoin

This page makes an important architectural distinction:

```text
Wormhole / SwapCTC
        ↓
   Asset movement

Attestcoin Protocol
        ↓
Verified cross-chain data / messaging
        ↓
Creditcoin smart-contract logic
```

A token bridge **does not by itself satisfy** the hackathon's Attestcoin integration requirement.

A final project could potentially use both, but only if the product genuinely requires both asset movement and verified cross-chain information.

## 8. Development Checklist

- [ ] Find Creditcoin testnet RPC
- [ ] Find Creditcoin testnet chain ID
- [ ] Find testnet CTC faucet/funding mechanism
- [ ] Find testnet block explorer
- [ ] Configure an EVM wallet
- [ ] Deploy a basic Solidity contract
- [ ] Execute a test transaction
- [ ] Verify gas behavior
- [ ] Only add Wormhole if asset movement is genuinely needed
- [ ] Do not use mainnet bridge addresses in application logic unless explicitly required
- [ ] Do not treat SwapCTC/Wormhole as the Attestcoin integration

## 9. Key Takeaways

1. SwapCTC provides legacy one-way G-CRE/old-WCTC → Creditcoin routes.
2. Legacy processing is manual and can take **1–2 weeks**.
3. Wormhole is the newer cross-chain asset-transfer mechanism involving Creditcoin, Ethereum, and BSC.
4. Mainnet Creditcoin EVM uses chain ID **102030** and the documented RPC `https://mainnet3.creditcoin.network`.
5. **Do not use mainnet configuration for the hackathon testnet without checking the testnet documentation.**
6. Bridges move assets; Attestcoin provides the cross-chain data/messaging capability required by the hackathon.
7. **Attestcoin must remain a core part of our final project.**

## Source

Creditcoin Docs — Swap CTC Quick Guide

Official documentation: https://docs.creditcoin.org/
