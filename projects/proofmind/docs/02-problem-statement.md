# 02 — Problem Statement

## Problem

AI systems can make useful decisions from large amounts of data, but the application usually has to trust an API, database, indexer, or centralized oracle to supply the underlying facts. A cross-chain dApp has an additional problem: a fact observed on one chain must be transferred to another chain without losing verifiability.

## Why existing approaches are insufficient for this project

A simple API call can tell an AI that an event happened, but the API itself is not the cryptographic trust boundary. A conventional oracle can relay data, but ProofMind is intended to demonstrate the specific value of Attestcoin Readability: source-chain transaction data can be proven and synchronously verified by an Attestcoin Smart Contract on Creditcoin.

## User pain

A developer wants an application that can:

1. Observe an event on another chain.
2. Establish that the event really exists in the source-chain history.
3. Make an AI decision from that verified event.
4. Trigger a predictable on-chain action.
5. Show the complete evidence and decision trail.

Doing these steps manually creates latency, operational complexity, and opportunities for incorrect data handling.

## Hackathon problem framing

**How can AI make autonomous on-chain decisions without requiring the AI itself to be trusted as the source of truth?**

ProofMind answers by placing a cryptographic verification layer before AI reasoning and a deterministic policy layer after AI reasoning.

## Success criteria

The demo is successful when a judge can follow one source transaction from:

`source event → attestation → proof generation → Creditcoin verification → AI decision → on-chain execution`.

The system should also make it obvious which parts are cryptographic verification, which parts are AI inference, and which parts are deterministic smart-contract enforcement.
