# 10 — Testing Strategy

Testing is layered so a failure can be localized.

## Unit tests

- source contract validation
- event payload construction
- AI schema validation
- policy calculations
- worker state transitions
- retry classification
- API serializers

## Contract tests

- authorization
- proof success/failure
- replay protection
- limits
- expiry
- action allowlist

## Integration tests

- worker → Proof Builder adapter
- worker → ASC adapter
- backend persistence
- AI adapter in mock mode

## End-to-end test

The strongest acceptance test is a real source transaction on the chosen testnet that produces a source event, reaches the Attestcoin verification path, creates a verified fact, produces a bounded AI decision and executes a permitted Creditcoin action.
