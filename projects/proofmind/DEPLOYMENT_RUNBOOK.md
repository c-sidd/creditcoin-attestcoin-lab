# ProofMind Testnet Deployment Runbook

This is the deployment checklist for the public hackathon-ready ProofMind environment.

> **Security:** never commit a private key, API key, seed phrase, or `.env` file. Put secrets only in the local environment or the deployment platform's secret manager.

## 1. Target networks

| Component | Network | Chain ID | RPC |
|---|---|---:|---|
| Source signal emitter | Ethereum Sepolia | `11155111` | `https://rpc.sepolia.org` |
| Attestcoin + decision contracts | Creditcoin CC3 Testnet | `102031` | `https://rpc.cc3-testnet.creditcoin.network` |

Proof Builder: `https://prover.cc3-testnet.creditcoin.network`

## 2. Required secrets

Set these locally or in the deployment platform:

```text
SEPOLIA_RPC_URL=
CREDITCOIN_RPC_URL=https://rpc.cc3-testnet.creditcoin.network
SOURCE_DEPLOYER_PRIVATE_KEY=
CREDITCOIN_PRIVATE_KEY=
PROOF_BUILDER_API_KEY=
```

The Hardhat config accepts `DEPLOYER_PRIVATE_KEY` as a shared key, but separate source and destination wallets are recommended for safer operations.

## 3. Fund the deployer wallets

Before deployment, both wallets must have enough testnet gas:

- Sepolia ETH for `SourceSignalEmitter`.
- Creditcoin CC3 testnet native gas for `ProofMindAttestcoin` and `ProofMindDecision`.

Never use a mainnet wallet for this testnet deployment.

## 4. Compile and test first

From `projects/proofmind`:

```bash
npm install
npm run build
npm test
```

Then compile contracts:

```bash
cd contracts
npm run compile
```

Do not deploy if compilation or tests fail.

## 5. Deploy the source contract

From `projects/proofmind/contracts`:

```bash
SOURCE_DEPLOYER_PRIVATE_KEY=... npm run deploy:source
```

Record the emitted `SourceSignalEmitter` address and transaction hash.

Set it as:

```text
SOURCE_CONTRACT_ADDRESS=0x...
```

## 6. Deploy Creditcoin contracts

Use the same source contract address when deploying the destination contracts:

```bash
SOURCE_CONTRACT_ADDRESS=0x... CREDITCOIN_PRIVATE_KEY=... npm run deploy:creditcoin
```

The script deploys:

1. `ProofMindAttestcoin`
2. `ProofMindDecision`

The CC3 testnet `EvmV1Decoder` library address is configured by the deployment script as:

```text
0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f
```

Record all deployment addresses and transaction hashes immediately.

## 7. Authorize the decision oracle

The backend/worker wallet that submits decisions must be authorized by the `ProofMindDecision` owner:

```text
setOracleAuthorization(oracleAddress, true)
```

Then verify:

```text
authorizedOracles(oracleAddress) == true
```

Do not skip this verification.

## 8. Update runtime environment

Populate the deployed addresses in the runtime environment:

```text
SOURCE_CONTRACT_ADDRESS=0x...
ASC_CONTRACT_ADDRESS=0x...
BUSINESS_LOGIC_CONTRACT_ADDRESS=0x...
CREDITCOIN_RPC_URL=https://rpc.cc3-testnet.creditcoin.network
CREDITCOIN_CHAIN_ID=102031
PROOF_BUILDER_URL=https://prover.cc3-testnet.creditcoin.network
APP_ENV=production
```

Keep the private keys and proof-builder API key outside Git.

## 9. Deploy the off-chain services

ProofMind has three runtime surfaces:

### Dashboard

Build the Vite application:

```bash
cd dashboard
npm install
npm run build
```

The generated `dist/` directory should be hosted on a public HTTPS static host.

### Backend API

Build and start:

```bash
cd backend
npm install
npm run build
npm start
```

Expose the API through HTTPS and set `CORS_ORIGINS` to the exact dashboard origin.

### Worker

Build and start:

```bash
cd worker
npm install
npm run build
npm start
```

The worker should run as a persistent background process, not as a serverless request handler.

## 10. Public demo verification

Before submission, verify the complete path:

```text
Sepolia signal
    -> Attestcoin proof/readability
    -> CC3 verification
    -> evidence consumed by worker
    -> AI decision
    -> ProofMindDecision policy check
    -> on-chain execution
    -> dashboard evidence / transaction view
```

Test at least these adversarial cases:

- valid decision executes;
- amount above policy limit is rejected;
- invalid/stale evidence is rejected;
- replayed evidence is rejected;
- unauthorized oracle is rejected;
- wrong source contract is rejected.

## 11. Evidence to publish for judges

After a successful deployment, update `DEPLOYMENT_MANIFEST.md` with:

- exact commit SHA;
- source chain contract address;
- source deployment transaction hash;
- Attestcoin contract address;
- Attestcoin deployment transaction hash;
- decision contract address;
- decision deployment transaction hash;
- decoder/library address;
- authorized oracle address;
- public dashboard URL;
- public API URL, if exposed;
- block explorer links;
- a successful end-to-end transaction hash.

Never publish private keys or API keys.

## 12. Current repository readiness

The contracts Hardhat configuration now defines both Sepolia and Creditcoin CC3 networks, and the contracts package exposes explicit `deploy:source` and `deploy:creditcoin` commands.

The remaining step that cannot be performed safely from the repository alone is the signing of live testnet transactions. That requires a funded testnet wallet and its private key to be supplied through a secure secret manager/local environment.
