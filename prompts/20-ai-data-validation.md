# Prompt 20 — Verified Data Validation

Build deterministic validation between Attestcoin-derived evidence and the AI layer.

Validate source chain, block, transaction, event type, required fields, proof/verification status, timestamps, evidence identity, and freshness according to the project docs. Reject incomplete or unverified evidence before the model sees it.

Add positive and adversarial fixtures: missing fields, wrong chain, mismatched tx/event, stale evidence, duplicate evidence, altered values. Document the trust boundary and evidence schema.