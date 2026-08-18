# 21 — Ideathon Pitch

## Track

**AI** — with Attestcoin as the essential cross-chain verification infrastructure and Creditcoin as the enforcement layer.

## 30-second pitch

**ProofMind is an Attestcoin-powered cross-chain credit and risk intelligence system. A borrower may have important financial history on other chains, but a centralized API should not be the root of trust for a credit decision. ProofMind uses Attestcoin to verify selected cross-chain facts, builds a verified financial profile, uses specialized AI agents plus deterministic risk analysis to understand that profile, and sends only a bounded intent to a Creditcoin smart contract that independently enforces the policy.**

## Problem

Credit decisions become difficult when relevant collateral, debt, repayment and liquidation information is fragmented across blockchains. The application needs both:

1. trustworthy cross-chain evidence; and
2. useful interpretation of heterogeneous financial signals.

A model alone cannot solve the first problem, while fixed rules alone can become brittle when many signals must be interpreted together.

## Solution

```text
Cross-chain financial activity
        ↓
Attestcoin verification
        ↓
Verified financial profile
        ↓
Deterministic risk + scenarios
        ↓
Multi-agent AI
        ↓
Bounded policy intent
        ↓
Creditcoin smart contract
        ↓
Allowed execution / rejection
```

## Why AI matters

AI is not used to verify the blockchain evidence. It interprets verified, structured financial information across several dimensions and produces a bounded recommendation with reason codes.

Specialized agents:

- Financial Analyst;
- Risk Agent;
- Fraud/Anomaly Agent;
- Credit Agent;
- Policy Agent.

Deterministic formulas remain responsible for measurable metrics and hard limits.

## Why Attestcoin matters

Without the Attestcoin verification boundary, the system would be relying on ordinary application/RPC observations for a cross-chain financial claim. Attestcoin is therefore part of the trust model, not a decorative integration.

## Why Creditcoin matters

Creditcoin is the destination execution and policy environment. The final business contract independently validates the proposed action and enforces limits, freshness, authorization and replay protection.

## Differentiation

1. **Proof before intelligence** — AI receives verified facts, not raw untrusted cross-chain claims.
2. **Multi-agent financial reasoning** — different analytical responsibilities are separated.
3. **Deterministic safety boundary** — model output cannot bypass on-chain policy.
4. **Scenario-aware decisions** — explicit stress scenarios can change a recommendation.
5. **Auditable evidence chain** — source transaction, proof verification, agent outputs and Creditcoin execution are linked.

## Strongest judging moment

Show a source-chain event, then visibly move through:

**Verified → Financial Profile → Risk → AI Recommendation → Policy Accepted → Creditcoin Executed**

Then replay the same intent and show the contract reject it.

## Closing line

> **“Attestcoin proves the financial evidence. AI understands the risk. Creditcoin enforces the decision.”**
