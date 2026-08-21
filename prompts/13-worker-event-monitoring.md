# Prompt 13 — Worker Event Monitoring

Implement source-chain event discovery for the documented ProofMind event.

Requirements: use a reliable source RPC strategy, persist discovered event identity, support configurable start/catch-up ranges, avoid duplicate jobs, validate chain/network identity, and survive restarts.

Test new events, historical catch-up, duplicate delivery, RPC errors, malformed logs, reorg/replacement handling as supported by the source-chain design, and restart recovery. Document the event filter and processing state machine.