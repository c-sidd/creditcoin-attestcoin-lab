# 04 — AI Layer

The AI layer converts verified facts into bounded decisions. It is deliberately downstream of cryptographic verification.

## Required stages

`VerifiedFact → context normalization → policy context → model reasoning → schema validation → deterministic preflight → transaction proposal`

## Hard rule

AI may recommend an action but cannot directly bypass the Creditcoin decision contract. The contract must independently validate caller, action, amount, score, expiry and replay state.

## Development modes

- **Mock mode:** deterministic responses for local/integration testing.
- **Provider mode:** real model adapter behind the same interface.

The application must remain testable without depending on a live model provider.
