# Prompt 19 — Final Audit

```text
Perform a clean-room final audit.

Read the entire ProofMind documentation and inspect every implementation file.

Check:
- every documented component exists or is explicitly marked out-of-scope
- every protocol dependency has a verified source
- tests exist for every critical behavior
- no secrets are committed
- environment setup is reproducible
- deployment instructions work
- testnet evidence exists
- E2E hashes resolve
- AI cannot bypass policy enforcement
- worker cannot duplicate execution
- dashboard reflects actual backend state
- README and status match reality
- no TODO marked critical remains

Produce a gap table with severity and exact file/line or component.

Do not mark the project complete if any critical or high gap remains.
```
