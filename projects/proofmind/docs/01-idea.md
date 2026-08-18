# 01 — Idea

## Product

**ProofMind** is an Attestcoin-powered cross-chain AI credit and risk intelligence system for Creditcoin.

It takes selected financial facts from another blockchain, verifies their provenance through Attestcoin Readability, builds a structured financial profile, analyzes that profile with specialized AI agents, applies deterministic risk and policy controls, and produces a bounded transaction intent for a Creditcoin smart contract.

## Core thesis

The product is not "AI plus blockchain" as two unrelated components. Each layer solves a different problem:

- **Attestcoin:** establishes the cryptographic verification boundary for selected cross-chain facts.
- **VerifiedFact layer:** preserves provenance and separates verified data from contextual metadata.
- **AI agents:** interpret complex verified financial information and produce structured analysis.
- **Risk/simulation engine:** performs deterministic calculations and controlled what-if scenarios.
- **Policy layer:** constrains what may be proposed and executed.
- **Creditcoin contracts:** enforce the final permitted action on-chain.

## Primary use case

A borrower requests credit on Creditcoin while important financial history exists on another chain. ProofMind verifies selected cross-chain facts, evaluates the resulting financial profile, and proposes a bounded credit decision.

## Multi-agent roles

1. **Financial Analyst Agent** — organizes verified assets, liabilities and history.
2. **Risk Agent** — evaluates financial risk and produces structured risk indicators.
3. **Fraud/Anomaly Agent** — identifies unusual patterns for review.
4. **Credit Agent** — proposes a bounded credit limit and risk tier.
5. **Policy Agent** — converts the proposal into an allowed transaction intent; the smart contract remains the final authority.

These roles are project architecture, not Creditcoin protocol features.

## End-to-end mental model

```text
Cross-chain financial facts
          ↓
Attestcoin attestation + proofs
          ↓
Creditcoin verification
          ↓
Verified financial profile
          ↓
┌─────────────────────────────┐
│ Multi-agent AI analysis     │
│ Analyst → Risk → Anomaly    │
│ → Credit → Policy           │
└──────────────┬──────────────┘
               ↓
Deterministic risk + simulation
               ↓
Policy validation
               ↓
Bounded transaction intent
               ↓
Creditcoin smart contract
               ↓
On-chain enforcement
               ↓
Evidence dashboard
```

## Why AI is necessary

A fixed smart-contract rule can enforce a simple threshold, but the application may need to interpret multiple heterogeneous financial signals, summarize historical behavior, identify unusual combinations, compare structured scenarios and provide explainable reasons. AI is used for this interpretation layer, while deterministic calculations and smart contracts remain responsible for hard constraints.

AI is therefore **not** the source of truth and is **not** the final authorization authority.

## What makes it interesting

A source-chain fact does not stop at a proof. The verified fact becomes an input to an explainable financial intelligence pipeline, and the resulting bounded action is enforced on Creditcoin.

## Non-goals

- Building a new LLM.
- Replacing Attestcoin with a centralized oracle.
- Giving an LLM unrestricted wallet or contract authority.
- Claiming production-grade credit underwriting.
- Supporting every source chain in the MVP.
- Treating illustrative risk formulas or thresholds as Creditcoin protocol behavior.
