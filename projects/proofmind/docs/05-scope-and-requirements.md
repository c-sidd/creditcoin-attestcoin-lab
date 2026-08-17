# 05 — Scope and Requirements

## MVP functional requirements

### FR-01 Source contract

Deploy a minimal source-chain contract that emits one dedicated event containing all data required by the demo.

### FR-02 Event monitoring

Worker must discover new events without requiring manual user interaction after the initial source transaction.

### FR-03 Attestation wait

Worker must detect whether the source block has been attested before requesting/submitting the readability proof.

### FR-04 Proof generation

Worker must call the configured Proof Builder endpoint using the documented request format and persist request status.

### FR-05 Verification

ASC must verify the proof through the documented Creditcoin verifier precompile and reject invalid/replayed data.

### FR-06 Verified fact

Backend must expose a normalized verified fact to the AI layer.

### FR-07 AI decision

AI service must return a schema-constrained decision with evidence ID, decision class, score/reason codes, and bounded action fields.

### FR-08 On-chain enforcement

Decision contract must reject unsupported action types, invalid ranges, expired decisions, and duplicate evidence.

### FR-09 Observability

Dashboard must show every major stage and its status.

## Non-functional requirements

- Configuration through environment variables.
- No private keys committed to Git.
- Idempotent worker processing.
- Structured logs with correlation IDs.
- Retryable external calls.
- Clear separation between source chain, Creditcoin, worker, AI, and UI.
- Testnet-first deployment.

## MVP exclusions

- Multi-chain production support.
- Model training pipeline.
- Complex user authentication.
- Real-money financial execution.
- Production-grade custody.
- Unbounded autonomous smart-contract calls.

## Definition of done

A fresh developer can clone the repository, follow the setup documentation, configure testnet credentials, deploy the contracts, run the worker and AI service, trigger one source event, and observe a completed verified decision in the dashboard.
