# Prompt 33 — Testnet Deployment

Prepare and execute a controlled deployment to the documented source-chain/CC3 testnet environment.

Before deployment verify compiler/toolchain, RPC identity, chain IDs/keys, deployer balance, contract bytecode, constructor/config values, and environment variables. Deploy in dependency order, record addresses and deployment tx hashes, configure roles, and perform smoke tests.

Never commit credentials. Keep a deployment manifest containing public addresses, network, timestamp, commit SHA, and tx hashes. Mainnet deployment is out of scope unless explicitly requested.