# Prompt 21 — AI Decision Engine

Implement the documented ProofMind reasoning pipeline: receive validated evidence, build a constrained decision context, invoke the AI provider, parse structured output, and pass it through deterministic policy validation.

AI output must never directly execute a blockchain transaction. Require a schema-valid decision and explicit evidence references. Capture model/provider metadata needed for audit without storing sensitive prompts unnecessarily.

Test valid decisions, malformed model output, unsupported actions, missing evidence, contradictory evidence, provider errors, and deterministic policy rejection.