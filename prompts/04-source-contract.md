# Prompt 04 — Source Chain Contract

```text
Implement only the ProofMind source-chain contract.

Requirements:
- minimal source-chain logic
- one dedicated, unambiguous ProofMind event
- all downstream-required fields included in the event
- deterministic validation of inputs
- no dependence on undocumented Attestcoin behavior
- tests for valid input, invalid input, event fields, and repeated calls
- Sepolia deployment script using environment configuration

Use the repository's verified Solidity/tooling patterns.

After implementation, produce deployment instructions and an event-decoding example.

Gate: PASS only after tests pass and the emitted event can be identified deterministically by the worker.
```
