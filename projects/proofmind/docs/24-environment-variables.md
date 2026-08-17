# ProofMind Environment Variables

This document is the implementation-time source of truth for runtime configuration. Never commit real secrets.

## Rules

- Commit `.env.example`, never `.env`.
- Never put API keys, private keys, seed phrases, or JWT secrets in Git.
- Validate required variables at application startup.
- Fail fast with a clear configuration error when a required value is missing.
- Keep provider-specific variables behind the AI/provider configuration boundary.
- Separate local/testnet configuration from production configuration.

## AI

```env
AI_PROVIDER=openai
AI_MODEL=<verified-model-id>
OPENAI_API_KEY=<secret>
```

Optional fallback:

```env
AI_FALLBACK_PROVIDER=groq
AI_FALLBACK_MODEL=<verified-llama-model-id>
GROQ_API_KEY=<secret>
```

The exact model identifiers must be verified before implementation. Do not invent a model name.

## Source-chain / Ethereum Sepolia

```env
SEPOLIA_RPC_URL=<sepolia-rpc-url>
SOURCE_CHAIN_ID=11155111
SOURCE_CHAIN_KEY=1
SOURCE_CONTRACT_ADDRESS=<deployed-source-contract>
SOURCE_DEPLOYER_PRIVATE_KEY=<secret>
```

`SOURCE_CHAIN_ID` is Ethereum's EVM chain ID. `SOURCE_CHAIN_KEY` is the Creditcoin/Attestcoin chain key. These values are different and must never be confused.

## Creditcoin CC3 Testnet

```env
CREDITCOIN_RPC_URL=https://rpc.cc3-testnet.creditcoin.network
CREDITCOIN_CHAIN_ID=102031
CREDITCOIN_PRIVATE_KEY=<secret>
ASC_CONTRACT_ADDRESS=<deployed-asc-contract>
BUSINESS_LOGIC_CONTRACT_ADDRESS=<deployed-business-contract>
```

Protocol-specific addresses and payload formats must come from the verified Creditcoin documentation/reference implementation, not from assumptions in generated code.

## Attestcoin / Proof Builder

```env
PROOF_BUILDER_URL=<verified-current-proof-builder-url>
PROOF_BUILDER_API_KEY=<secret-if-required>
```

The implementation must verify the current endpoint and request/response contract before wiring the worker to it.

## Database

If the backend uses PostgreSQL:

```env
DATABASE_URL=<postgresql-connection-string>
```

The exact schema is defined by the backend/database documentation.

## Backend

Example configuration:

```env
APP_ENV=development
LOG_LEVEL=INFO
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
```

If authentication is implemented:

```env
JWT_SECRET=<secret>
```

## Worker

```env
WORKER_POLL_INTERVAL_SECONDS=<value>
WORKER_MAX_RETRIES=<value>
WORKER_RETRY_BACKOFF_SECONDS=<value>
```

The worker must persist processing state instead of depending only on in-memory variables.

## Evidence / observability

```env
EVIDENCE_DIR=<local-evidence-directory>
LOG_LEVEL=INFO
```

Evidence must never contain secrets.

## Frontend

Only expose values that are intentionally public to the browser. Never expose private API keys or blockchain signing keys through frontend environment variables.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Required startup validation

At startup, the application should report configuration status such as:

```text
AI provider: configured
AI model: configured
Source RPC: configured
Creditcoin RPC: configured
ASC address: configured/not deployed
Business logic address: configured/not deployed
Proof Builder: configured
Database: configured
Secrets: loaded
```

Do not print the actual secret values.

## `.env.example` policy

The repository should contain a sanitized `.env.example` containing every variable required to reproduce the development environment.

Whenever a new environment variable is introduced:

1. add it to `.env.example`;
2. document it here;
3. add startup validation;
4. update the relevant Antigravity prompt/documentation;
5. update `PROJECT_STATUS.md` if the variable represents a new implementation dependency.

## Security checklist

Before committing:

- [ ] `.env` is ignored by Git.
- [ ] No private key appears in source code.
- [ ] No API key appears in source code.
- [ ] No API key appears in logs.
- [ ] No secret appears in evidence artifacts.
- [ ] Frontend environment variables contain only intentionally public values.
- [ ] Testnet keys are clearly separated from any production credentials.
