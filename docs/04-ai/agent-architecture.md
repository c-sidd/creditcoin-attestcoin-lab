# Agent Architecture

```text
VerifiedDataRepository
        ↓
Context Builder
        ↓
AIProvider
        ↓
StructuredDecisionValidator
        ↓
PolicyEngine
        ↓
TransactionIntent
        ↓
Backend / Wallet / Contract adapter
```

## Stateless core
The model call should be stateless with respect to authorization. Authorization state belongs to deterministic application policy and contracts.

## Context
The context builder should pass typed fields plus evidence references, not raw uncontrolled blockchain payloads. Large payloads should be summarized outside the authorization path and retain a hash/reference to the original evidence.

## Tool use
If tools are added, each tool must have a typed input/output contract and an allowlist. Blockchain-writing tools must be unavailable to the model itself; the model produces an intent that a deterministic executor validates.
