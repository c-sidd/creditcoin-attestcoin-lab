# Secrets Management

Never commit:
- private keys;
- seed phrases;
- API keys;
- AI provider secrets;
- database passwords;
- production RPC credentials.

Use `.env.example` for names and placeholders only. Load secrets from environment/secret storage. Logs must redact authorization headers, private keys and provider credentials.

For the ideathon, use a dedicated testnet wallet with minimal funds and permissions. Never reuse a personal or production wallet for automated execution.
