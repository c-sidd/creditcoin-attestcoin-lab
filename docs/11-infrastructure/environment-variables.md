# Environment Variables

Use `.env.example` as the canonical variable-name list once implementation starts.

Expected categories:

```text
APP_ENV
DATABASE_URL
SOURCE_CHAIN_RPC_URL
SOURCE_CHAIN_ID
SOURCE_CONTRACT_ADDRESS
CREDITCOIN_RPC_URL
CREDITCOIN_CHAIN_ID
ASC_CONTRACT_ADDRESS
PROOF_BUILDER_URL
DECODER_CONTRACT_ADDRESS
AI_PROVIDER
AI_API_KEY
EXECUTOR_PRIVATE_KEY
LOG_LEVEL
```

The exact names may change with implementation, but all secrets must be environment-provided. Public addresses/URLs may be logged; secrets must be redacted.
