# ProofMind Contract Specification

## Source event

The source contract should expose one clear entry point for the ProofMind workflow and emit a dedicated event. Do not use a generic `Transfer` event as the semantic trigger.

The event should contain every value needed by the Creditcoin-side workflow so the destination side does not have to infer missing business data.

## ASC boundary

Conceptual responsibility:

```text
receive proof payload
        ↓
verify proof
        ↓
if invalid: revert / reject
        ↓
decode verified source transaction/event
        ↓
construct canonical VerifiedFact
        ↓
invoke permitted business/decision path
```

The exact function signature and precompile ABI must come from the Creditcoin reference implementation, not from this project document.

## Decision contract policy

At minimum the project design requires:

- ASC-only authorization for verified execution entry points
- action allowlist
- maximum amount
- minimum score
- decision expiry
- unique source-event/replay identifier
- explicit execution event
- safe handling of malformed values

## Events

Project-level events should make the evidence trail observable, for example:

- `VerifiedFactCreated`
- `DecisionProposed`
- `DecisionExecuted`
- `DecisionRejected`

Names and parameters may change during implementation, but the final ABI must be documented and tested.
