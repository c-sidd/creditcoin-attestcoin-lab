# Prompt 16 — Security Hardening

```text
Run a security review across contracts, worker, backend, AI, dashboard, and configuration.

Test:
- replay attacks
- unauthorized callers
- forged/unverified facts
- malformed proofs/data
- wrong chain/contract/transaction identity
- duplicate events
- worker restart
- stale/expired decisions
- amount/score boundary violations
- arbitrary calldata attempts
- prompt/model output injection into transaction parameters
- secret leakage
- unsafe logging
- API authorization failures

Classify findings Critical/High/Medium/Low and fix Critical/High issues before PASS.

Gate: PASS only when the negative-test matrix passes and no critical/high unresolved finding remains.
```
