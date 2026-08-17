# 02 — Architecture

This folder defines component boundaries and trust boundaries.

## Components

- Source-chain contract
- Source-chain RPC(s)
- Readability worker
- Creditcoin attestation/proof infrastructure
- Attestcoin Smart Contract
- VerifiedFact boundary
- AI decision service
- Creditcoin business/decision contract
- Backend evidence store/API
- Dashboard

## Architecture rule

Every component must have explicit **inputs, outputs, authority, failure modes and trust assumptions**. Avoid undocumented direct coupling.

## Trust model

Cryptographic verification establishes source-data authenticity at the protocol boundary. AI output is treated as an untrusted proposal. Final authorization belongs to deterministic smart-contract rules.
