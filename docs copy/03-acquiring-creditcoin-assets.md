# Acquiring Creditcoin Assets — Project-Relevant Notes

> Source: Official Creditcoin documentation — **Acquiring Creditcoin Assets**.
>
> This file extracts the information useful for development, testnet planning, deployment, and future project design.

## 1. Purpose of This Guide

Creditcoin uses multiple CTC assets across different networks. The official guide explains how users can acquire CTC on Ethereum and move assets to Creditcoin for:

- DeFi
- dApps
- Staking
- Trading ecosystem tokens on Penguinswap
- Paying transaction fees

This is mainly an **operational/user onboarding guide**, but it gives us important information about the real asset flow.

---

## 2. Wallet Setup

The recommended gateway into the Creditcoin ecosystem is **Credit Wallet**.

The guide says users can:

1. Install Credit Wallet.
2. Create or import an EVM wallet.
3. Securely back up the private key or recovery phrase.

### Development implication

Our dApp will likely need an EVM-compatible wallet flow. We should investigate which wallet providers are supported by the Creditcoin EVM environment and whether standard EVM wallet tooling works directly.

---

## 3. Acquiring CTC on Ethereum

The documentation provides two main approaches.

### Option A — Centralized exchanges

Users can acquire CTC through supported exchanges.

### Option B — Decentralized exchange

Users can acquire CTC assets through Uniswap.

The documentation identifies:

- **WCTC (new)**
- **CTC (ERC-20)**, also referred to as **G-CRE** on DEXs

Ethereum transactions require **ETH for gas**.

### Project implication

For a user-facing dApp, requiring users to acquire assets through Ethereum first can create friction. If our project requires CTC, we should investigate the simplest testnet and demo funding path rather than copying the mainnet acquisition flow.

---

## 4. Bridging Assets to Creditcoin

The guide provides different paths depending on the asset a user owns.

### Path A — G-CRE / CTC (ERC-20)

Users can use the Swap CTC tool for a **one-way bridge** from G-CRE to Creditcoin.

Important limitation:

> The guide says this process is manual and can take **up to one week**.

### Path B — New WCTC

The recommended path is to use the **Wormhole Portal Bridge**.

It supports movement between:

```text
Ethereum
   ↕
Creditcoin
   ↕
BNB
```

After bridging, users receive CTC on Creditcoin.

The guide says this CTC can be used immediately as bridge fees.

### Path C — USDT on Ethereum

USDT can also be bridged to Creditcoin through Wormhole, where users receive **USDT.C at a 1:1 ratio**.

---

## 5. Important Distinction: Bridge vs Attestcoin

This page reinforces an important architectural distinction from the previous CTC documentation.

### Asset bridge

Moves an asset between networks:

```text
Ethereum
   │
   │ token bridge
   ▼
Creditcoin
```

### Attestcoin

Provides verified cross-chain information/messaging:

```text
Other chain
     │
     │ verified data / message
     ▼
Attestcoin
     │
     ▼
Creditcoin smart contract
```

These are different primitives.

Our hackathon project should use **Attestcoin for its core cross-chain logic**, rather than claiming a token bridge alone is Attestcoin integration.

---

## 6. Bridge Fees and Gas

The documentation states:

- Bridge fees are charged on the **source chain**.
- Creditcoin token swaps require **CTC for gas fees**.

This means a cross-chain application involving both bridges and Creditcoin transactions may have multiple fee considerations:

```text
Source-chain transaction
        ↓
Source-chain gas / bridge fee
        ↓
Creditcoin transaction
        ↓
CTC gas
```

For our final project, we should minimize unnecessary transactions in the demo flow.

---

## 7. Staking

Users can convert CTC to **CTC (Native)** for staking on Creditcoin Mainnet.

This is separate from the EVM dApp development flow.

For our project:

- EVM application logic → CTC EVM context
- Network staking → CTC Native context

We probably do not need staking functionality unless it becomes part of the product design.

---

## 8. Development and Hackathon Implications

### Mainnet user flow is not necessarily our testnet flow

The guide explains how users acquire real assets on mainnet. Our hackathon requires a **testnet deployment**, so we need to find the testnet-specific process.

We should identify:

- Testnet wallet setup
- Testnet CTC faucet
- Testnet RPC
- Testnet chain ID
- Testnet Attestcoin environment
- Testnet supported source chains
- Whether bridging is necessary for our prototype

### Avoid introducing unnecessary bridges

If our project can demonstrate its value entirely through:

```text
Source-chain data
       ↓
Attestcoin
       ↓
Creditcoin contract
```

then adding a token bridge may create unnecessary complexity.

A bridge should only be included if the product genuinely requires **asset movement**.

---

## 9. Potential Product Opportunities

These are **research ideas only**.

### A. Cross-chain settlement

A verified event on another blockchain could trigger a settlement action on Creditcoin.

```text
External event
      ↓
Attestcoin
      ↓
Creditcoin
      ↓
Settlement
```

### B. Cross-chain DeFi

A product could combine external-chain assets/data with Creditcoin DeFi logic.

### C. Cross-chain RWA

An RWA-related application could potentially use verified data from another chain while keeping business logic on Creditcoin.

### D. AI + verified cross-chain data

AI could consume the verified information delivered through Attestcoin and propose or trigger an on-chain action.

The important design principle remains:

```text
Attestcoin → trust/verification
AI         → interpretation
Smart contract → deterministic execution
```

---

## 10. Questions We Still Need to Resolve

- [ ] What exact testnet environment should we use?
- [ ] Is there a testnet CTC faucet?
- [ ] Can we deploy without acquiring real CTC?
- [ ] What wallet is recommended for development?
- [ ] Which source chains are available on Attestcoin testnet?
- [ ] Does Attestcoin itself require a separate fee mechanism?
- [ ] Do we need a token bridge for the final project?
- [ ] Can a testnet user receive CTC directly rather than bridging from Ethereum?
- [ ] How are cross-chain transactions/messages paid for?

---

## 11. Key Takeaways

1. Creditcoin has multiple CTC asset contexts across networks.
2. **Credit Wallet** is the documented wallet gateway.
3. Users can acquire CTC through centralized or decentralized Ethereum routes.
4. G-CRE → Creditcoin via Swap CTC is a **manual one-way process** that can take up to a week.
5. New WCTC can use Wormhole for cross-chain transfers involving Creditcoin, Ethereum, and BNB.
6. USDT can also be bridged to Creditcoin as USDT.C.
7. Bridge fees are paid on the source chain.
8. Creditcoin token swaps require CTC for gas.
9. **Token bridging and Attestcoin cross-chain verification are separate concepts.**
10. For our hackathon, we should avoid unnecessary bridge complexity unless the product genuinely needs asset movement.
11. The next priority is understanding **testnet environments and Attestcoin itself**, because mainnet asset acquisition is not the core technical challenge of the hackathon.

## Source

Creditcoin Docs — **Acquiring Creditcoin Assets**

Official documentation: https://docs.creditcoin.org/
