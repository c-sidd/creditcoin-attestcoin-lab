# Prompt 24 — AI Test Suite

Test the complete AI pipeline using deterministic fixtures and a fake provider before using a real model.

Cover schema validation, evidence validation, deterministic policy rules, provider failure/timeouts, malformed output, unsupported decisions, prompt/data injection resistance, transaction-intent generation, and audit metadata.

Add regression fixtures for every bug found. Run the suite repeatedly for deterministic components and document which tests depend on a live AI provider.