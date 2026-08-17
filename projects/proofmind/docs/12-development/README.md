# 12 — Development Operations

This folder tells Antigravity **how to work on ProofMind safely**.

## Implementation loop

```text
Read spec
  ↓
Inspect existing reference code
  ↓
Plan smallest change
  ↓
Implement
  ↓
Run focused tests
  ↓
Run broader tests
  ↓
Update docs/status
  ↓
Record architectural decision if needed
```

## Coding rules

- Prefer small modules with explicit interfaces.
- Keep protocol-specific adapters isolated.
- Do not silently change schemas.
- Do not invent external APIs.
- Use deterministic mock adapters for tests.
- Keep secrets out of source control.
- Preserve idempotency across retries.

## Definition of done

A task is done only when code, tests, documentation, configuration and acceptance evidence agree. A compile-only implementation is not considered complete.

## Git discipline

Use focused conventional commits such as `feat(proofmind): add source event contract`, `test(worker): cover restart recovery`, and `docs(proofmind): clarify proof boundary`.
