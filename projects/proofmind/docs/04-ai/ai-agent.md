# AI Agent

## Role
The AI layer interprets already-normalized, verified application data and proposes a bounded action. It does not verify blockchain truth and does not directly mutate blockchain state.

## Pipeline
1. Receive a user/application objective.
2. Load only eligible evidence.
3. Validate evidence freshness/completeness.
4. Ask the model for a structured decision.
5. Validate the response against a strict schema.
6. Apply deterministic policy checks.
7. Produce a transaction intent or a no-action result.
8. Persist the decision and evidence references.

## Guardrails
- No arbitrary contract call generation.
- No private-key access by the model.
- No accepting model-supplied transaction hashes as evidence.
- No execution if required evidence is missing or unverified.
- No execution if policy contract rejects the intent.

## Provider boundary
Use an `AIProvider` interface so the model can be replaced with a mock during tests and another provider later without changing worker or contract code.
