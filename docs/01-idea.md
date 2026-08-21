# 01 — Idea

## Product

**ProofMind** is a cross-chain AI decision engine where AI reasoning is grounded in source-chain facts that have been cryptographically verified through the Attestcoin Protocol.

## Core thesis

Traditional AI workflows often assume that the data supplied to the model is trustworthy. Traditional blockchain oracle workflows can prove data but may leave the application developer with a narrow data pipeline. ProofMind combines the two layers:

- **Attestcoin:** establishes cross-chain data authenticity.
- **AI:** interprets verified facts and produces a structured decision.
- **Creditcoin contracts:** enforce the permitted action and update state.

## Example mental model

```text
Source-chain fact
      ↓
Attestation + proofs
      ↓
Creditcoin verification
      ↓
Verified fact envelope
      ↓
AI analysis
      ↓
Bounded decision
      ↓
Creditcoin execution
```

## What makes it interesting

The AI is not merely a chatbot sitting beside a blockchain application. A verified cross-chain event becomes an actual input into an autonomous decision pipeline, and the final action is visible on-chain.

## MVP story

A source-chain user submits a structured risk signal. ProofMind automatically verifies that event on Creditcoin, sends only the verified fields to an AI agent, receives a schema-constrained risk decision, and asks a Creditcoin contract to execute an allowed action.

## Non-goals

- Building a new LLM.
- Replacing Attestcoin with a centralized oracle.
- Putting arbitrary AI-generated code on-chain.
- Supporting every source chain in the MVP.
- Building a production-grade financial product before the protocol flow works.
