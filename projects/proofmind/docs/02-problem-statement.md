# 02 — Problem Statement

## Problem

Credit applications on one blockchain may not have a complete view of a borrower's financial history. Relevant collateral, liabilities, repayment behavior, liquidations and DeFi exposure can exist on other chains.

This creates two separate problems:

1. **Trust problem:** how can the application establish that a cross-chain financial fact is actually present in the source-chain history?
2. **Decision problem:** once the fact is verified, how can a system interpret many heterogeneous signals and turn them into a bounded, explainable credit/risk decision?

A centralized API or conventional oracle can provide data, but that is not the cryptographic trust boundary demonstrated by Attestcoin Readability.

## Why Attestcoin matters

ProofMind uses Attestcoin to establish the verified cross-chain data boundary. Only after the relevant source-chain information has passed the documented attestation/proof/verification flow can it become a `VerifiedFact` used by the financial intelligence pipeline.

Attestcoin is therefore not an optional data feed in the architecture; it is the mechanism that separates verified source-chain evidence from unverified application context.

## Why AI matters

Simple deterministic rules are useful for hard constraints, but a credit/risk workflow may need to interpret combinations of:

- assets and liabilities;
- repayment history;
- utilization and leverage;
- liquidation history;
- cross-chain exposure;
- concentration;
- changes over time;
- explicit hypothetical scenarios.

Specialized AI agents can summarize and interpret these heterogeneous verified signals, identify patterns for review, and produce structured recommendations. AI remains an untrusted reasoning component: it cannot establish provenance, bypass policy, or directly authorize arbitrary funds movement.

## User pain

A lender or dApp developer wants to:

1. obtain relevant financial facts from another chain;
2. prove those facts rather than blindly trusting an API response;
3. construct a coherent cross-chain financial profile;
4. assess risk and unusual patterns;
5. evaluate controlled what-if scenarios;
6. produce a bounded credit recommendation;
7. enforce hard policy rules on-chain;
8. show the complete evidence → reasoning → policy → execution trail.

## Hackathon problem framing

> **How can a Creditcoin application make useful cross-chain credit decisions when the evidence lives on other chains, without making an AI model or centralized oracle the root of trust?**

ProofMind answers with three explicit layers:

**Attestcoin = verified evidence → AI = financial interpretation → Creditcoin contracts = deterministic enforcement.**

## Success criteria

A successful demo should let a judge follow a concrete financial signal from:

`source-chain event/state → attestation → proof → Creditcoin verification → verified profile → multi-agent analysis → risk/simulation → policy check → bounded Creditcoin execution`.

The UI and logs must clearly distinguish verified protocol evidence, AI-generated reasoning, deterministic calculations, and contract-enforced decisions.
