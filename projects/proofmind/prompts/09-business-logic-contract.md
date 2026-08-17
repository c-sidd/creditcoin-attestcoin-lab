# Prompt 09 — Business / Decision Contract

Implement the Creditcoin-side contract that owns ProofMind state and enforces approved transaction intents.

## Goal
Keep AI reasoning outside the contract. The contract accepts only the structured, policy-valid intent defined by the project interfaces and only from authorized callers.

## Include
State model, access control, supported actions, bounds, replay/nonce protection, evidence reference/hash, events, failure semantics, and safe external-call behavior.

## Verify
Unit-test every action, unauthorized caller, invalid parameters, stale/replayed intent, unsupported action, and state transition. Confirm the contract cannot be used to bypass the documented ASC/policy boundary.

Update ABI/interface docs and status only after tests pass.