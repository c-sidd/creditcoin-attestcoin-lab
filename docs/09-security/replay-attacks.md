# Replay Protection

Use a stable source action identity, ideally including source chain key, source transaction hash and event/log identity. The Creditcoin-side application records whether that identity has already been executed.

## Required cases
- same worker retries after a timeout;
- worker restarts after ASC success;
- two workers observe the same event;
- a malicious caller resubmits an old proof package;
- an AI intent is replayed after its original execution.

The contract must reject already-consumed source actions and expired/reused transaction intents. Worker-level deduplication is an optimization; contract-level protection is the final enforcement layer.
