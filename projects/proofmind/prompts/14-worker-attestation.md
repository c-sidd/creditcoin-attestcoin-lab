# Prompt 14 — Attestation Waiting

Implement the worker stage that waits until the event's containing block is attested on Creditcoin, following documented Attestcoin behavior.

Use the verified chain/environment configuration. Poll with bounded backoff, persist state, expose progress, handle timeouts and transient RPC errors, and never request proofs prematurely.

Test not-yet-attested, attested, timeout, restart, and network-error cases. Clearly distinguish `detected`, `waiting`, `attested`, and `failed` states.