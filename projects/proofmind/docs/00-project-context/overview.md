# ProofMind — Canonical Overview

## Definition

ProofMind is a **Verified Cross-Chain AI Decision Engine**. A source-chain event is observed, attested and proven through Attestcoin Readability, converted into a verified fact, evaluated by a bounded AI decision layer, and finally enforced by deterministic Creditcoin smart-contract policy.

## Core invariant

> **Attestcoin = proof → AI = reasoning → smart contracts = enforcement.**

The AI is not the source of truth and does not receive unrestricted blockchain authority.

## MVP path

`Ethereum Sepolia source event → worker → attestation wait → Proof Builder → Creditcoin ASC → proof verification → VerifiedFact → AI proposal → policy contract → execution → evidence dashboard`

## Required boundaries

1. Source contract emits explicit ProofMind events.
2. Worker orchestrates protocol operations but is not a trust root.
3. ASC verifies source data before a `VerifiedFact` exists.
4. AI consumes verified facts and produces schema-constrained proposals.
5. Creditcoin contracts enforce authorization, limits, expiry and replay protection.
6. Backend/dashboard provide observability and evidence; they cannot bypass on-chain controls.

## What is deliberately not promised

ProofMind does not claim that an AI model is cryptographically trustworthy, that an RPC response is proof, or that undocumented Creditcoin APIs can be inferred safely.
