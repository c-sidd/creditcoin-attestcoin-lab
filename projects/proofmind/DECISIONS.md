# ProofMind Architecture Decisions

This file records decisions that affect implementation. Add a new entry instead of silently changing an established interface.

## D001 — Attestcoin is a core trust boundary

**Decision:** Verified source-chain data must reach application logic through Attestcoin Readability. We will not build a centralized oracle path as the primary demo path.

**Reason:** The hackathon value proposition depends on cryptographically verified cross-chain data.

## D002 — Source-chain logic stays minimal

The source contract primarily emits unambiguous events. Business logic that must happen on the source chain stays there; everything else should be handled on Creditcoin.

## D003 — Worker is off-chain

The readability worker monitors events, waits for attestation, requests proofs, submits the ASC transaction, retries failures, and records progress.

## D004 — AI is not the root of trust

AI receives only verified event data. Its output is a recommendation/decision, while the Creditcoin contract enforces schema, bounds, authorization, replay protection, and allowed actions.

## D005 — MVP uses CC3 Testnet

Use the documented CC3 Testnet environment during development. Mainnet values must never be hard-coded into the application.

## D006 — Separate verification and business logic where practical

Use an ASC contract for proof verification and a separate business-logic/decision contract for the MVP. This keeps the trust boundary explicit and makes testing easier.

## D007 — One source contract for bridge-relevant events

The source application should expose a single contract address for the worker to monitor, with distinct event names for each cross-chain action.

## D008 — Structured machine-readable AI output

The AI service must return strict JSON matching the documented decision schema. Free-form text is presentation only and never directly controls a transaction.

## D009 — Every execution is traceable

Persist source transaction hash, block number, event identifier, proof request status, ASC transaction hash, AI decision ID, and final execution status for the dashboard.

## D010 — Demo reliability beats feature count

A small end-to-end flow that works repeatedly is preferred over multiple partially integrated features.

## D011 — Optimize for hackathon quality before AI cost

During the ideathon build, AI inference cost is not the primary optimization target. Use the strongest suitable currently available OpenAI model accessible to the project as the primary provider, subject to API availability and structured-output support.

**Fallback:** Groq + Llama may be supported through the same provider abstraction.

**Constraint:** The exact model identifier must be verified against the current provider API before implementation. Do not invent a model identifier based only on a product nickname.

## D012 — AI provider must be replaceable

AI provider SDKs must not leak throughout the application. The decision engine uses an abstract provider interface, allowing OpenAI and Groq/Llama to be swapped without changing Attestcoin, worker, evidence, or contract boundaries.

## D013 — Environment configuration is explicit

Every runtime dependency must be represented in `.env.example`, documented in the environment documentation, and validated at startup. Secrets must never be committed or exposed to the browser.

## D014 — V2 is multi-agent credit/risk intelligence, not a generic AI decision engine

**Decision:** The primary ProofMind product is an Attestcoin-powered cross-chain credit and risk intelligence system.

The logical AI roles are Financial Analyst, Risk Agent, Fraud/Anomaly Agent, Credit Agent and Policy Agent. They operate on verified facts and deterministic financial metrics. They do not need five independent model servers in the MVP.

**Reason:** This gives AI a substantive role beyond simply formatting one verified event. It also creates a clearer relationship between Attestcoin verification, financial reasoning and Creditcoin enforcement.

**Constraint:** Deterministic metrics, policy thresholds, action allowlists, replay protection, expiry and authorization remain outside the model's authority and are enforced independently.

## D015 — Scenario simulation is deterministic

Scenario analysis evaluates explicit hypothetical inputs using versioned formulas/policies. It is not represented as an LLM prediction of future market prices and does not mutate on-chain state.

## D016 — VerifiedFact is the AI input boundary

The model layer consumes canonical `VerifiedFact`/`FinancialProfile` objects only. Raw RPC observations, arbitrary API values and client claims cannot be promoted to verified facts without the documented Attestcoin verification path.
