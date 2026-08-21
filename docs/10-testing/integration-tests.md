# Integration Tests

Test real boundaries in isolation:

1. Source contract → event listener.
2. Worker → Proof Builder adapter.
3. Proof package → ASC submission.
4. ASC → business contract.
5. Verified evidence → AI provider adapter.
6. AI decision → policy/executor.
7. Execution → evidence API/dashboard.

Record environment, deployed addresses and transaction hashes for testnet runs. Integration tests must not use production keys.
