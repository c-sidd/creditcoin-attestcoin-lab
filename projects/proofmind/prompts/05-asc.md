# Prompt 05 — Attestcoin Smart Contract Boundary

```text
Implement the ProofMind ASC boundary using only the verified Attestcoin verifier interface from the repository/reference implementation.

The ASC must:
- accept the exact proof/transaction representation supported by the reference
- verify before trusting decoded data
- derive the canonical VerifiedFact
- enforce source transaction/event identity
- prevent replay
- emit auditable verification events
- reject malformed/unauthorized/invalid submissions

Do not guess a precompile ABI. If the reference is insufficient, stop and record a blocker.

Add unit tests for valid proof, invalid proof, malformed payload, unauthorized caller, duplicate submission, wrong source event, and wrong chain/transaction identity.

Gate: PASS only with tests and a verified protocol interface.
```
