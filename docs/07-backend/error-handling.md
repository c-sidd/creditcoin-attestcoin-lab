# Error Handling

Use stable error categories rather than raw provider messages in API responses.

| Category | Example | Retry |
|---|---|---|
| `NOT_READY` | block not yet attested | yes |
| `UPSTREAM_UNAVAILABLE` | Proof Builder unavailable | yes |
| `INVALID_PROOF_PACKAGE` | malformed proof response | no; inspect |
| `CHAIN_REVERT` | ASC/business logic revert | conditional |
| `DUPLICATE` | event already completed | no |
| `AI_UNAVAILABLE` | provider timeout | yes |
| `POLICY_REJECTED` | deterministic rule failed | no |
| `CONFIGURATION` | missing RPC/address | no |

Never retry a transaction merely because the client timed out. First reconcile whether the transaction was accepted on-chain.
