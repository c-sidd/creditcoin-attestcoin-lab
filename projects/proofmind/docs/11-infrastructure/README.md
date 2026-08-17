# 11 — Infrastructure and Environments

## Local development

Local development should support mock mode for AI and protocol adapters where a real testnet dependency is unnecessary.

## Testnet

The intended MVP path uses Ethereum Sepolia as the source chain and the documented Creditcoin CC3 testnet environment. Exact endpoints, chain keys, precompile addresses and SDK behavior must be taken from the repository's Creditcoin reference documentation/code at implementation time.

## Environment variables

Expected categories include:

- source-chain RPC URL(s)
- Creditcoin RPC URL
- Proof Builder endpoint
- source contract address
- ASC address
- decision/business contract address
- worker signer configuration
- AI provider configuration
- backend/database configuration

Only variable names and safe placeholders belong in `.env.example`.

## Deployment principle

Deploy in dependency order: source contract → destination contracts → worker configuration → backend → dashboard. Record actual addresses and network identifiers in a deployment artifact that contains no secrets.
