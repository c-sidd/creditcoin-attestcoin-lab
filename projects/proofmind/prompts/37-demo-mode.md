# Prompt 37 — Demo / Fallback Mode

Create an explicitly separated development/demo mode for cases where a live external dependency is unavailable.

Mock source events, proof responses, AI provider responses, and transaction results only behind clearly named interfaces. Mark every simulated artifact as `MOCK` in data/UI. Never allow mock proofs to enter a real production/testnet verification path accidentally.

Add configuration safeguards, tests proving mode separation, reset instructions, and a demo dataset that exercises the full UI lifecycle.