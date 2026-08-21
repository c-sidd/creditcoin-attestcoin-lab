# Prompt 23 — Transaction Intent

Convert a policy-approved AI decision into the exact typed transaction-intent structure expected by the Creditcoin-side contract.

Include action, target, bounded parameters, nonce/idempotency identifier, evidence reference/hash, decision metadata, and expiry if required by the project design. Do not let free-form model text reach the contract.

Validate ABI compatibility, encoding, domain/network identity, and replay semantics. Test deterministic serialization and rejection of malformed/unauthorized intents. Document the complete AI → intent → contract boundary.