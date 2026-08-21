# ProofMind Threat Model

| Threat | Primary defense | Secondary defense |
|---|---|---|
| Fake source data | Attestcoin proof verification | explicit event design |
| RPC lies | cryptographic proof path | multiple nodes / observations |
| Replay | contract replay key | worker idempotency |
| Worker compromise | bounded destination permissions | contract policy |
| AI hallucination | verified-only input + schema | on-chain policy |
| Prompt injection | treat source text/data as untrusted | strict tool/action allowlist |
| Excessive amount | contract maximum | AI preflight |
| Expired proposal | contract expiry check | backend expiry check |
| Unauthorized execution | contract access control | backend authentication |
| Secret leak | secret manager/env | `.gitignore` + review |

## Important distinction

A healthy worker can still be malicious; therefore the worker must not be able to create arbitrary economic outcomes. The destination contract must constrain what a worker/ASC integration can cause.
