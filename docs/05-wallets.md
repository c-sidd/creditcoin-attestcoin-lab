# Creditcoin Wallets — Project-Relevant Notes

> Source: Official Creditcoin documentation — Wallets.

## 1. Core Concept

A blockchain account is controlled through a public/private key pair. The private key controls transactions and access to assets, so it must remain secret.

Never commit private keys, seed phrases, or wallet secrets to GitHub.

## 2. Wallet Categories

### Hot vs Cold

Hot wallets are internet-connected, such as browser extensions and mobile wallets. They are convenient but have greater online security exposure.

Cold wallets keep keys offline, typically through hardware or air-gapped devices, providing stronger isolation.

### Custodial vs Non-Custodial

Custodial wallets give a third party control of private keys. Non-custodial wallets give the user control of their own keys.

Creditcoin's documented wallets are non-custodial.

## 3. Browser Wallets

Browser wallets are particularly relevant for our EVM dApp because they connect a browser to smart contracts.

Advantages:
- Easy dApp interaction
- Convenient account management

Risks:
- Phishing
- Malicious extensions/sites
- Compromised browser/device
- Private-key exposure

The documentation emphasizes verifying wallet authenticity and maintaining a secure environment.

## 4. Supported Creditcoin Wallets

| Wallet | Creditcoin capability |
|---|---|
| Polkadot-JS Extension | Substrate |
| MetaMask | EVM |
| Talisman | Substrate + EVM |
| SubWallet | Substrate + EVM |

For our Solidity/EVM hackathon prototype, **MetaMask is a straightforward initial choice**. Talisman and SubWallet are alternatives if we later need both Substrate and EVM functionality.

## 5. EVM dApp Flow

```text
User
  │
  ▼
Browser Wallet
(MetaMask / Talisman / SubWallet)
  │
  │ signs transaction
  ▼
Creditcoin EVM
  │
  ▼
Smart Contract
```

The application should never receive or store the user's private key.

## 6. Project Security Requirements

- Never commit private keys.
- Never commit seed phrases.
- Never place wallet secrets in frontend source code.
- Use environment variables for deployment credentials where necessary.
- Use a dedicated hackathon/testnet wallet rather than a wallet holding meaningful mainnet funds.
- Verify contract addresses before interacting with them.

Example `.env` pattern:

```text
PRIVATE_KEY=<never_commit_this>
RPC_URL=<testnet_rpc>
```

The real `.env` file should be in `.gitignore`.

## 7. Architecture Implication

The wallet is the **user identity/signing layer**, not the Attestcoin layer.

```text
                 User
                  │
                  ▼
             EVM Wallet
                  │
             signs tx
                  │
                  ▼
          Creditcoin EVM
                  │
          ┌───────┴────────┐
          ▼                ▼
   Our Smart Contract   Attestcoin
```

The wallet authorizes transactions. Our contracts implement application logic. Attestcoin provides the cross-chain verification/messaging capability.

## 8. Key Takeaways

1. Private keys control blockchain assets and must remain secret.
2. Creditcoin's documented wallets are non-custodial.
3. MetaMask supports Creditcoin's EVM environment.
4. Talisman and SubWallet support both Substrate and EVM functionality.
5. MetaMask is a practical initial wallet choice for our Solidity/EVM prototype.
6. The frontend should request signatures/transactions from the wallet rather than handling private keys.
7. Wallet infrastructure is separate from Attestcoin; it provides account access and transaction signing.

## Source

Creditcoin Docs — Wallets

Official documentation: https://docs.creditcoin.org/
