# 03 — Solution

## Product direction

ProofMind is an **Attestcoin-powered cross-chain AI credit and risk intelligence system**. The MVP demonstrates how verified financial information originating on another chain can become a bounded credit/risk recommendation and, only when deterministic policy permits it, an on-chain Creditcoin action.

## Four trust stages

### Stage 1 — Observe and prove

A minimal source-chain contract emits a specific financial event. The worker observes it, waits for the required attestation state, obtains the documented proofs, and submits them through the Attestcoin Readability path.

An RPC observation is not trusted application data.

### Stage 2 — Verify on Creditcoin

The Attestcoin Smart Contract uses the documented verifier/precompile flow to validate the source-chain evidence. Only after successful verification may the application create a canonical `VerifiedFact` containing provenance.

### Stage 3 — Understand verified financial data

The backend builds a `FinancialProfile` from verified facts and deterministic metrics. Specialized logical agents then operate on that verified profile:

1. Financial Analyst — normalization and observations.
2. Risk Agent — risk interpretation.
3. Fraud/Anomaly Agent — unusual-pattern detection.
4. Credit Agent — bounded credit recommendation.
5. Policy Agent — machine-readable execution intent.

AI is an interpretation layer, not the source of truth.

### Stage 4 — Enforce on Creditcoin

A deterministic Creditcoin business/decision contract independently checks authorization, supported action, evidence freshness, replay protection, score/risk bounds, amount limits and expiry before any state transition.

## Deterministic companion engine

The system calculates measurable metrics outside the model where formulas are known, such as collateral ratio, utilization, debt exposure, concentration and explicit scenario outcomes. Model reasoning may interpret these signals but must not silently replace their formulas.

## End-to-end MVP

```text
Source-chain financial event
        ↓
Readability worker
        ↓
Attestation + proof generation
        ↓
Attestcoin verification
        ↓
VerifiedFact
        ↓
FinancialProfile
        ↓
Deterministic risk engine
        ↓
Scenario simulation
        ↓
Multi-agent AI
        ↓
Schema + policy validation
        ↓
Bounded transaction intent
        ↓
Creditcoin decision/business contract
        ↓
Allowed execution OR rejection
```

## Trust model

- **Attestcoin:** establishes cross-chain evidence provenance.
- **VerifiedFact:** creates the application trust boundary after verification.
- **AI:** interprets verified information and proposes a bounded action.
- **Deterministic risk/policy:** controls measurable constraints.
- **Creditcoin contract:** is the final authority for the state transition.

## Important boundary

The multi-agent architecture, risk formulas, thresholds, decision schema and UX are **Project Design**. They must not be represented as Creditcoin protocol guarantees.
