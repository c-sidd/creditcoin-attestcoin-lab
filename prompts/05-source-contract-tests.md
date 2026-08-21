# Prompt 05 — Source Contract Tests

Read Prompt 04 and the contract requirements.

## Goal
Prove the source contract behaves exactly as documented.

## Test matrix
Cover deployment state, authorized/unauthorized calls, valid and invalid inputs, event emission and exact event arguments, state transitions, repeated requests, boundary values, and expected reverts.

## Verification
Run the complete contract test suite, compile artifacts, inspect ABI/event selectors, and review the diff. If a test exposes a design ambiguity, stop and document it instead of weakening the test.

## Acceptance
All tests pass; negative paths are covered; tests are deterministic; no protocol behavior is mocked unless explicitly labeled; status and contract docs contain the evidence.