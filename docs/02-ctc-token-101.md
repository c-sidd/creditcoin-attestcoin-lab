# CTC Token 101 — Project-Relevant Notes

> Source: Official Creditcoin documentation — **CTC Token 101**.
>
> This file extracts the information relevant to developing, deploying, testing, and designing our BUIDL CTC project.

## 1. CTC Has Different Roles Across the Creditcoin Ecosystem

CTC is the native token of the Creditcoin ecosystem and uses a **multichain token architecture**.

The documentation distinguishes CTC across different environments:

| Asset / Form | Main role |
|---|---|
| **CTC (Native)** | Staking, governance, validator participation, Substrate transaction fees |
| **CTC on Creditcoin EVM** | Smart-contract interactions, dApps, DeFi, EVM gas |
| **CTC (G-CRE) on Ethereum** | ERC-20 representation; can be bridged toward Creditcoin |
| **WCTC (new) on Ethereum/BSC ecosystem** | Wrapped CTC supporting cross-chain transfers |
| **WCTC (old)** | Legacy wrapped token being deprecated |

## 2. Creditcoin Has Native and EVM Token Contexts

### CTC (Native)

Used on Creditcoin's native/Substrate side for:

- Staking
- Governance
- Validator participation
- Network participation
- Substrate-based transaction fees

### CTC (EVM)

Used on Creditcoin's EVM environment for:

- Smart-contract interactions
- dApp interactions
- EVM gas fees
- DeFi applications
- Trading ecosystem tokens through Creditcoin's DeFi infrastructure

### Critical development implication

For our Solidity/EVM project, we need to work with the **EVM-side CTC for contract transactions and gas**.

We should not confuse EVM gas requirements with native/Substrate staking or governance requirements.

---

## 3. CTC on Ethereum

The documentation describes multiple representations on Ethereum.

### CTC (G-CRE)

- ERC-20 version of Creditcoin's token
- Available on centralized exchanges
- Listed as **G-CRE** on decentralized exchanges
- Can be bridged toward Creditcoin using the Swap CTC tool

### WCTC (new)

- New wrapped version of CTC
- Designed to support transfers between:
  - Creditcoin
  - Ethereum
  - BSC
- Available on Uniswap
- Enables cross-chain DeFi access

### WCTC (old)

- Legacy wrapped token
- Limited Uniswap liquidity
- Being gradually deprecated

### Project implication

When our project involves CTC across chains, we must explicitly identify **which CTC representation** we are using. We should avoid relying on the deprecated WCTC version.

---

## 4. Moving CTC Between Networks

The documentation identifies two mechanisms:

### Swap CTC tool

A one-way bridge for moving:

```text
CTC (G-CRE) → CTC
```

### Wormhole Portal Bridge

Supports two-way cross-chain transfers for the new WCTC between:

```text
Creditcoin ↔ Ethereum
Creditcoin ↔ BSC
```

### Important distinction

These bridges are **token-transfer infrastructure**. They are different from the Attestcoin Protocol's cross-chain data/messaging role.

For our hackathon, we should not mistake:

```text
Token bridge
```

for:

```text
Attestcoin cross-chain verification / messaging
```

They may potentially be used together, but they solve different problems.

---

## 5. Gas and Transactions

The documentation states:

- **Substrate/native transactions:** use Mainnet CTC (Native)
- **EVM transactions:** use Mainnet CTC (EVM)

For our EVM smart contracts, gas is therefore an important part of the deployment/demo setup.

### Testnet planning question

Before deploying our POC, we need to identify:

- Testnet CTC acquisition method
- Testnet faucet, if available
- EVM chain ID
- RPC endpoint
- Gas pricing
- Whether Attestcoin operations require additional fees

These details should come from the dedicated environments/developer documentation rather than being assumed from the mainnet token page.

---

## 6. Why CTC Matters to Our Project

CTC is not necessarily the **business asset** of our final project. Its role depends on our design.

At minimum, if we deploy an EVM dApp on Creditcoin, CTC is relevant for:

```text
Developer wallet
       ↓
Creditcoin EVM
       ↓
Smart-contract transaction
       ↓
Gas paid in CTC (EVM)
```

If our application itself uses CTC as a financial asset, we also need to account for the appropriate CTC representation and cross-chain liquidity mechanism.

---

## 7. Potential Project Opportunities

These are **ideas to investigate**, not selected project features.

### Opportunity A — Cross-chain CTC-aware DeFi

A DeFi application could use CTC as one of its assets while Attestcoin provides verified cross-chain information.

### Opportunity B — Cross-chain collateral

A user could have an asset or position on another supported blockchain while a Creditcoin contract uses verified information about that position.

The CTC token itself is not necessarily the collateral; the important concept is separating:

- Asset/liquidity movement
- Cross-chain verification
- Creditcoin business logic

### Opportunity C — Cross-chain settlement

A project could combine:

```text
Cross-chain event
       ↓
Attestcoin verification
       ↓
Creditcoin contract
       ↓
CTC settlement / reward
```

Again, whether this is technically feasible depends on the Attestcoin write/read capabilities we still need to study.

---

## 8. Important Architecture Distinction

We now have three separate concepts in our knowledge base:

```text
                   CREDITCOIN ECOSYSTEM
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
     EVM L1            CTC Token          Attestcoin
        │                  │                  │
 Smart contracts       Gas/assets       Cross-chain
                                           data/messages
```

This distinction is important.

### EVM

Provides the environment where we deploy Solidity smart contracts.

### CTC

Provides network token functionality, including EVM transaction gas.

### Attestcoin

Provides the cross-chain interoperability mechanism that is the central requirement of this hackathon.

Our final architecture will likely combine all three, but they have different jobs.

---

## 9. Questions to Resolve Later

- [ ] How do we obtain testnet CTC?
- [ ] Which CTC representation is used on the relevant testnet?
- [ ] What are the exact testnet EVM gas requirements?
- [ ] Can Attestcoin operations consume/transfer CTC?
- [ ] How does Attestcoin handle gas for cross-chain reads/writes?
- [ ] Which source chains can our project use?
- [ ] Can CTC itself be used as a cross-chain asset in an Attestcoin application?
- [ ] What role, if any, should token bridging play in our final product?

---

## 10. Key Takeaways

1. **CTC is Creditcoin's native ecosystem token.**
2. Creditcoin distinguishes **Native CTC** from the **EVM-side CTC**.
3. EVM smart-contract interactions and EVM gas use **CTC on the EVM environment**.
4. Native CTC is used for staking, governance, validators, and Substrate transactions.
5. CTC also has representations on Ethereum, including G-CRE and new WCTC.
6. The new WCTC supports transfers involving Creditcoin, Ethereum, and BSC.
7. The old WCTC is being deprecated and should not be selected for a new project.
8. Token bridges and Attestcoin are **different technologies with different purposes**.
9. For our hackathon, CTC is primarily important for **EVM gas and potentially application-level financial logic**.
10. We should understand the testnet environment before making token-specific assumptions.

## Source

Creditcoin Docs — **CTC Token 101**

Official documentation: https://docs.creditcoin.org/
