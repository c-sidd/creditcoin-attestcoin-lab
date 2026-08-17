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
