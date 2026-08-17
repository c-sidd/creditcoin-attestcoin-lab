# Prompt 15 — Proof Generation

Connect the worker to the verified Proof Builder client. For each attested event, request the documented Merkle/continuity proofs and encoded transaction data.

Validate the returned chain key, block height, transaction identity, proof structure, and encoded payload before storing or submitting anything. Persist proof-generation state and safely retry transient failures.

Test successful generation, malformed responses, wrong transaction/block identity, API errors, timeout, and restart recovery. Never substitute fake proofs outside explicitly named test fixtures.