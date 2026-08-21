# Prompt 02 — Protocol Interface Verification

```text
Before writing ProofMind protocol code, build a protocol interface inventory.

For each external dependency record:
- network
- chain key
- RPC
- contract/precompile address
- ABI source
- SDK package/version if used
- method/event names
- request/response shape
- example transaction/reference
- source documentation path

Verify especially the ASC verifier/precompile and Proof Builder boundary against the existing Creditcoin tutorial/reference implementation.

Do not invent missing fields. For every unknown value create a BLOCKER in DECISIONS.md.

Produce docs/protocol-interface-inventory.md and a machine-readable checklist if useful.

Gate: PASS only when every protocol call planned for the next milestone has a verified source.
```
