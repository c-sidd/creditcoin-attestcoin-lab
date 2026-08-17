# Prompt 22 — AI Risk Controls

Implement deterministic safety controls around AI decisions. Define allowlisted actions, numeric bounds, evidence requirements, freshness requirements, confidence/abstention behavior, and human/manual review boundaries exactly as documented.

The model may recommend; policy code decides whether a recommendation is admissible. Add tests for prompt injection-like data fields, unsupported actions, extreme values, missing evidence, low confidence, stale evidence, and policy bypass attempts.

Document the threat model and every enforced control.