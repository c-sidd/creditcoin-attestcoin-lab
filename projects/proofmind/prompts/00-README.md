# ProofMind Antigravity Prompt Chain

This directory is the execution control plane for Antigravity.

## Product source of truth

Before implementation, read:

1. `../docs/PRODUCT_DIRECTION_V2.md`
2. `../docs/09-ai-agent.md`
3. `../IMPLEMENTATION_RULES.md`
4. `../PRE_IMPLEMENTATION_GATE.md`
5. the relevant protocol/reference documents

The V2 product is **Attestcoin-powered Cross-Chain AI Credit & Risk Intelligence**.

## Rules

1. Run prompts in order unless a prompt explicitly says it may be skipped.
2. Give Antigravity one prompt at a time.
3. Never allow Antigravity to invent Creditcoin/Attestcoin APIs, ABIs, Proof Builder payloads, RPC behavior, or protocol semantics.
4. After every implementation prompt, require code inspection, tests, changed-file summary, and an explicit PASS/FAIL gate.
5. A milestone is complete only when code, tests, documentation, and required evidence all exist.
6. Never replace a real protocol integration with a mock and call the milestone complete.
7. Mocks are allowed only for isolated/unit application tests.
8. Record protocol discoveries and architecture changes in `../DECISIONS.md`.
9. Record progress in `../PROJECT_STATUS.md`.
10. Store real deployment/test evidence under `../evidence/`.
11. Treat `ObservedEvent` as untrusted until the documented Attestcoin verification boundary succeeds.
12. Treat AI output as untrusted input until schema validation and deterministic policy checks succeed.
13. Never give an AI provider arbitrary transaction authority.

## Prompt order

| Prompt | Purpose | Gate |
|---|---|---|
| 01 | Repository reconnaissance | No code changes; report only |
| 02 | Protocol interface verification | Every external interface has a source |
| 03 | Project scaffold | Build/test commands work |
| 04 | Source-chain contract | Event test + deployment script |
| 05 | ASC boundary | Verification/replay tests |
| 06 | Business/decision contract | Policy tests |
| 07 | Worker foundation | Persistent state machine tests |
| 08 | Proof Builder integration | Real request path or documented blocker |
| 09 | ASC submission | Real test transaction or blocker |
| 10 | Evidence backend | API/database tests |
| **11** | **V2 multi-agent credit/risk layer** | **VerifiedFact-only input + deterministic risk + scenario + strict AI schema** |
| 12 | Dashboard | Evidence timeline works |
| 13 | Local integration | Full local flow |
| 14 | CC3 testnet integration | Real testnet transaction |
| 15 | E2E evidence capture | Reproducible evidence package |
| 16 | Security hardening | Negative-test matrix |
| 17 | Observability/reliability | Failure recovery verified |
| 18 | Demo rehearsal | Judge-ready 3–5 minute flow |
| 19 | Final audit | No unresolved critical gap |
| 20 | Release freeze | Tagged, documented, reproducible |

## Standard completion response required from Antigravity

For every prompt, return:

- Objective
- Files inspected
- Files changed
- Implementation summary
- Tests executed
- Test results
- External interfaces verified and their source
- Known limitations
- Evidence created
- Documentation updated
- Next prompt
- Gate: `PASS` or `FAIL`

Never return `PASS` if a required command was not actually executed.
