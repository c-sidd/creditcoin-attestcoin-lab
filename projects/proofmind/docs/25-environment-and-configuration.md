# 25 — Environment and Configuration

## Network targets

The initial MVP uses:

- Source chain: Ethereum Sepolia
- Execution/verification chain: Creditcoin CC3 Testnet
- Ethereum Sepolia Attestcoin chain key: `1`
- Creditcoin CC3 testnet Ethereum chain key: `3`
- BlockProver precompile: `0x0000000000000000000000000000000000000FD2`
- ChainInfo precompile: `0x0000000000000000000000000000000000000fd3`
- CC3 testnet ASC dashboard: `https://dashboard.cc3-testnet.creditcoin.network/`
- CC3 testnet Proof Builder: `https://proof-gen-api.cc3-testnet.creditcoin.network/`

These values come from the Creditcoin documentation supplied for this project. If the official documentation changes, update this file and record the change in `DECISIONS.md`.

## `.env.example`

```env
NODE_ENV=development

SOURCE_RPC_URL=
SOURCE_CHAIN_ID=11155111
SOURCE_CONTRACT_ADDRESS=

CREDITCOIN_RPC_URL=wss://rpc.cc3-testnet.creditcoin.network
CREDITCOIN_CHAIN_ID=
CREDITCOIN_ASC_ADDRESS=
CREDITCOIN_DECISION_ADDRESS=

PROOF_BUILDER_URL=https://proof-gen-api.cc3-testnet.creditcoin.network/

WORKER_PRIVATE_KEY=
DEPLOYER_PRIVATE_KEY=

AI_PROVIDER=mock
AI_API_KEY=
AI_MODEL=

DATABASE_URL=
LOG_LEVEL=info
```

## Secret handling

Never commit:
- private keys
- seed phrases
- API keys
- database passwords
- production credentials
- wallet exports

`.env.example` contains names and safe defaults only.

## Configuration validation

Application startup should fail fast when a required production/testnet variable is absent. Local mock mode may omit AI credentials.

Validate:
- URL format
- numeric chain IDs
- Ethereum address checksum/format where appropriate
- private key presence without logging its value
- proof-builder endpoint reachability during an explicit health check

## Network abstraction

Do not scatter RPC URLs and contract addresses throughout the codebase. Load them from one typed configuration module.

## Deployment manifest

Keep public deployment information in:

```text
deployments/testnet.json
```

Example:

```json
{
  "network": "cc3-testnet",
  "sourceChain": "ethereum-sepolia",
  "sourceContract": "",
  "ascContract": "",
  "decisionContract": "",
  "deployedAt": "",
  "gitCommit": ""
}
```

No secret belongs in this manifest.
