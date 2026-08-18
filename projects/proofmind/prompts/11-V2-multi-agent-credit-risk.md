# Prompt 11 — V2 Multi-Agent Credit & Risk Layer

## Objective

Align the implementation with `docs/PRODUCT_DIRECTION_V2.md` and `docs/09-ai-agent.md`.

Do not rewrite the repository from scratch. Inspect the existing AI provider abstraction and current tests first.

## Required architecture

Implement the following logical agents behind stable TypeScript interfaces:

1. Financial Analyst
2. Risk Agent
3. Fraud/Anomaly Agent
4. Credit Agent
5. Policy Agent

The first implementation may execute them sequentially. They do not need five independent model servers.

## Hard input boundary

The agent layer may consume only canonical `VerifiedFact`/`FinancialProfile` objects. It must reject unverified observations.

## Deterministic risk engine

Implement deterministic, versioned calculations for the metrics selected by the project documentation. Do not ask the LLM to calculate authoritative policy values when a documented formula can calculate them deterministically.

At minimum design interfaces for:

- collateral ratio;
- debt/utilization;
- cross-chain exposure;
- liquidation/repayment history;
- concentration;
- scenario health.

Do not invent financial formulas without recording them as Project Design and adding tests.

## Scenario engine

Implement explicit hypothetical scenarios. The simulator must not mutate blockchain state and must not claim to predict future markets.

## Model provider

Preserve the provider abstraction.

Required providers:

- deterministic mock for unit/integration tests;
- Groq/Llama adapter for development/testing when configured;
- OpenAI adapter for final submission when configured.

Provider selection must not change the contract-facing schema.

## Final decision schema

Use the documented schema from `docs/PRODUCT_DIRECTION_V2.md` and `docs/09-ai-agent.md`. Validate JSON strictly. Reject malformed output; never silently repair it into an executable action.

## Security requirements

- No arbitrary contract target.
- No arbitrary calldata.
- No private-key access from the model.
- No model-generated proof verification.
- No execution from unverified evidence.
- No execution on provider failure.
- Allowlisted reason codes and actions.
- Numeric bounds validated before execution.

## Tests

Add tests for:

- each agent's valid output;
- missing verified evidence;
- malformed model output;
- invalid enum;
- out-of-range score;
- excessive credit limit;
- missing evidence IDs;
- provider timeout/failure;
- deterministic risk formulas;
- scenario boundaries;
- complete orchestrator flow using the mock provider.

## Required completion gate

Before PASS:

1. inspect all changed files;
2. run the relevant tests for real;
3. verify no old single-agent schema remains in the implementation path;
4. update `PROJECT_STATUS.md`;
5. update `DECISIONS.md` for material architecture choices;
6. document any unresolved interface mismatch;
7. report exact commands and results.

Never claim the real end-to-end Creditcoin/Attestcoin path works from unit tests alone.
