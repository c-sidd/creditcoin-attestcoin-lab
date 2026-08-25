# 03 — YouTube / Kickoff Discussion Analysis

This document records the project-relevant conclusions from the BUIDL CTC 2026 Fall kickoff/AMA discussion and separates organizer-stated facts from our strategy.

## Official event facts verified from the current hackathon page

- Event: **BUIDL CTC 2026 Fall**
- Submission deadline: **September 6, 2026 at 23:59 ET**
- Winner announcement: **September 18, 2026**
- Prize pool: **$15,000**
- Grand prize: **$10,000**
- Second prize: **$3,000**
- Third prize: **$2,000**
- Tracks: **DeFi, RWA, DePIN, Gaming, AI**
- AI track: **AI Agents, Onchain Decisioning, Verified Data**
- Top three projects proceed through the Creditcoin Ecosystem Investment Program fast-track process.

Source: https://buidl.creditcoin.org/

## AI track interpretation for ProofMind

The current AI track description is unusually aligned with our architecture:

> AI apps on Creditcoin should process cryptographically verified cross-chain data to autonomously inform decisions and trigger on-chain transactions without centralized oracle operators.

That maps directly to:

```text
Attestcoin verified data
        |
        v
AI underwriting agent
        |
        v
on-chain decision policy
        |
        v
Creditcoin transaction
```

This means we should optimize for **depth of the verified-data → decision → transaction path**, not for the number of AI features.

## What the judge should see

### 1. Real problem

A real-world receivable/financial obligation exists but trusted underwriting and verification slow access to liquidity.

### 2. Verified data

Show the source transaction/event and its Attestcoin proof path.

### 3. AI agent

Show a structured underwriting decision, not merely a chat response.

### 4. On-chain decisioning

Show the deterministic policy contract accepting or rejecting the AI proposal.

### 5. Financial consequence

Show the resulting DeFi/RWA state change on Creditcoin.

## What we should not claim

Do not claim:

- a numeric judging weight that organizers have not published;
- a production-grade RWA legal structure when the hackathon demo only models the obligation;
- that an LLM itself is a trusted oracle;
- that a centralized RPC/API is equivalent to Attestcoin verification;
- that a local fixture is a live testnet proof;
- deployment addresses or transaction hashes until they are real and recorded.

## Recommended demo story

### Scene 1 — The real-world problem

Show an unpaid receivable and the business's need for working capital.

### Scene 2 — Evidence

Show the source-chain event and Attestcoin verification path.

### Scene 3 — Autonomous underwriting

Show Credit, Risk, and Fraud agents producing a compact structured decision.

### Scene 4 — Policy

Show the exact policy constraints that the decision must satisfy.

### Scene 5 — Execution

Execute the allowed financing action on Creditcoin.

### Scene 6 — Attack the AI

Change the AI recommendation to an invalid amount. Execute again. The contract rejects it.

### Scene 7 — Explain the innovation

> **AI reasons. Attestcoin proves. Smart contracts enforce.**

## Judge-facing evidence package

The repository should contain:

- source transaction hash;
- source-chain contract address;
- source event details;
- proof-builder evidence / recorded fixture where appropriate;
- Creditcoin transaction hash;
- deployed contract addresses;
- exact policy version;
- AI output schema;
- test showing valid execution;
- negative tests showing tampered/wrong/replayed evidence is rejected;
- public demo instructions;
- architecture diagram;
- clear statement of what is live vs simulated.

## Source links

- BUIDL CTC: https://buidl.creditcoin.org/
- Kickoff AMA: https://www.youtube.com/watch?v=HPL6LjTqQm4
- Creditcoin: https://github.com/gluwa/creditcoin
- USC Query Builder: https://github.com/gluwa/cc-next-query-builder
- USC examples: https://github.com/gluwa/usc-testnet-bridge-examples
