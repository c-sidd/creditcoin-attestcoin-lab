# Prompt 06 — Decision/Business Contract

```text
Implement the Creditcoin-side ProofMind business/decision contract according to the project design.

The contract is the enforcement layer, not the AI.

Enforce on-chain:
- authorized caller
- allowed action types
- bounds/limits
- score or confidence threshold where specified
- expiry/deadline
- unique decision ID/replay protection
- verified-fact linkage
- deterministic state transitions

Never accept arbitrary AI calldata or arbitrary target execution.

Add positive and negative tests for every policy rule and document emitted execution events.

Gate: PASS only when policy enforcement is independently deterministic and comprehensively tested.
```
