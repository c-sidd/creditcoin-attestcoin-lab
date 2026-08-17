# Connect a Wallet to Creditcoin — Project-Relevant Notes

> Source: Official Creditcoin documentation — How to Connect Your Wallet to Creditcoin.

## Creditcoin Network Configuration

### Mainnet
```text
Network Name:    Creditcoin
RPC URL:         https://mainnet3.creditcoin.network
Chain ID:        102030
Currency:        CTC
Explorer:        https://creditcoin.blockscout.com/
```

### Testnet — Hackathon Development
```text
Network Name:    Creditcoin Testnet
RPC URL:         https://rpc.cc3-testnet.creditcoin.network/
Chain ID:        102031
Currency:        tCTC
Explorer:        https://creditcoin-testnet.blockscout.com/
```

**Use the testnet for the hackathon prototype.** Do not assume mainnet configuration applies to testnet.

### Local Node
```text
Network Name:    Creditcoin Local
RPC URL:         http://127.0.0.1:9944
Chain ID:        42
Currency:        CTC
```

## Chainlist

The documentation provides:

- Mainnet: `https://chainlist.org/chain/102030`
- Testnet: `https://chainlist.org/chain/102031`

Basic flow:

```text
Chainlist → Connect Wallet → MetaMask → Select Address
→ Add Creditcoin Network → Approve → Switch Network
```

## Manual MetaMask Setup

1. Open MetaMask.
2. Open the network selector.
3. Select **Add Network**.
4. Enter the Creditcoin configuration.
5. Save the network.
6. Switch to Creditcoin.

For our hackathon:

```text
RPC:      https://rpc.cc3-testnet.creditcoin.network/
Chain ID: 102031
tCTC:     Testnet gas token
Explorer: https://creditcoin-testnet.blockscout.com/
```

## Mainnet vs Testnet

```text
Hackathon / Development
        ↓
Creditcoin Testnet
Chain ID: 102031
        ↓
 tCTC gas + test contracts
        ↓
Attestcoin testing

Production
        ↓
Creditcoin Mainnet
Chain ID: 102030
        ↓
CTC
```

We should avoid accidentally deploying the prototype to mainnet or using real CTC during development.

## Development Checklist

- [ ] Install MetaMask
- [ ] Add Creditcoin Testnet
- [ ] Confirm Chain ID `102031`
- [ ] Confirm RPC `https://rpc.cc3-testnet.creditcoin.network/`
- [ ] Confirm currency `tCTC`
- [ ] Confirm testnet Blockscout
- [ ] Obtain testnet tCTC
- [ ] Deploy a basic Solidity contract
- [ ] Verify deployment on Blockscout
- [ ] Interact with the contract from MetaMask

## Important Architecture Note

Connecting MetaMask to Creditcoin only provides the user's EVM account and transaction-signing capability. **It is not Attestcoin Protocol integration.**

```text
User
 │
 ▼
MetaMask
 │ signed transaction
 ▼
Creditcoin Testnet
 │
 ▼
Our Smart Contract
 │
 ▼
Attestcoin Protocol
 │
 ▼
Verified cross-chain data / messaging
```

## Key Takeaways

1. Mainnet EVM chain ID: **102030**.
2. Testnet EVM chain ID: **102031**.
3. Hackathon development should use **Creditcoin Testnet**.
4. Testnet gas currency is **tCTC**.
5. Testnet RPC: `https://rpc.cc3-testnet.creditcoin.network/`.
6. Testnet explorer: `https://creditcoin-testnet.blockscout.com/`.
7. Local configuration uses chain ID `42` and `http://127.0.0.1:9944` when running a compatible local node.
8. Wallet setup is infrastructure; meaningful Attestcoin integration is the actual hackathon requirement.

## Source

Creditcoin Docs — How to Connect Your Wallet to Creditcoin

Official documentation: https://docs.creditcoin.org/
