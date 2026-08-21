# Prompt 27 — Backend Database

Implement the persistence schema required by the documented lifecycle: source events, processing attempts, attestation/proof state, ASC transaction evidence, AI decisions, transaction intents, and audit metadata.

Use stable IDs and uniqueness constraints for event identity/idempotency. Store hashes/references rather than secrets. Add migrations, indexes based on real queries, integrity constraints, and repository/service tests.

Verify clean installation from an empty database and upgrade from the previous migration state.