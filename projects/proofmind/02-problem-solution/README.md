# 02 — Problem → Solution

## Executive problem statement

Small and mid-sized businesses can have genuine economic value locked in **unpaid real-world receivables**—for example, a confirmed invoice that a strong buyer will pay in 30–90 days—while the business needs working capital today.

The bottleneck is not simply a lack of money. The bottleneck is **trusted underwriting**:

- Is the receivable real?
- Did delivery actually occur?
- Did the buyer acknowledge the obligation?
- Has the same receivable already been financed?
- Is the counterparty reliable?
- What financing amount is safe?
- Can the decision be executed without trusting an opaque backend or AI model with unrestricted control of funds?

Traditional underwriting answers these questions through fragmented records, manual verification, centralized data providers, and slow review. Pure DeFi can move liquidity quickly, but it cannot inherently know whether an off-chain invoice is real. AI can process evidence quickly, but an AI model is probabilistic and must not be the final authority over irreversible financial execution.

## The deeper problem

> **How can autonomous financial systems safely convert verified real-world financial obligations into programmable on-chain liquidity when the underlying evidence is fragmented, AI decisions are probabilistic, and financial execution must be deterministic?**

This is the problem that makes the three tracks necessary rather than decorative.

## Why all three tracks are required

### RWA — represents the real-world obligation

The source of value is outside the blockchain:

- invoice / receivable
- delivery confirmation
- buyer acknowledgement
- payment history
- business transaction history

The MVP should represent these facts in a controlled demo fixture and, where possible, anchor the relevant source-chain event as the verifiable record.

### Attestcoin — proves the relevant cross-chain facts

A normal API can say that an invoice-related event happened. ProofMind needs the Creditcoin-side execution path to verify the source-chain transaction/event through the Attestcoin/USC proof system.

This turns an external fact into a **verified execution input**.

### AI — evaluates the evidence

The AI agent performs underwriting/risk analysis over verified evidence. It can recommend:

- approve / reject
- financing amount
- risk band
- confidence
- reasons / evidence references

The AI is **not** allowed to directly mutate financial state.

### DeFi — provides programmable liquidity

Once the evidence and deterministic policy checks pass, a Creditcoin-side financing contract can execute a controlled financing action or update a financing position.

DeFi is therefore the execution/settlement layer, not a token added for marketing.

## ProofMind solution

ProofMind is a **proof-carrying autonomous finance layer**.

```text
REAL-WORLD OBLIGATION
        |
        v
RWA EVIDENCE
        |
        v
ATTESTCOIN / USC PROOF
        |
        v
VERIFIED FACTS
        |
        v
AI UNDERWRITER
        |
        v
PROOF-CARRYING DECISION
        |
        v
DETERMINISTIC POLICY ENGINE
        |
   +----+----+
   |         |
 ALLOW      DENY
   |         |
   v         v
DEFI      NO STATE
ACTION     CHANGE
```

## The key design principle

### AI reasons. Attestcoin proves. Smart contracts enforce.

We do **not** try to make the AI infallible.

Instead:

1. **Attestcoin** establishes what verifiable source-chain facts exist.
2. **AI** proposes what should happen based on those facts.
3. **Policy code** determines what is allowed.
4. **Smart contracts** reject any action outside policy.

Therefore, a malicious or hallucinating AI should fail safely.

## Proof-carrying decision

The AI output should be a structured decision, for example:

```json
{
  "decision": "APPROVE",
  "amount": 1000000,
  "currency": "USDC",
  "riskBand": "LOW",
  "evidenceIds": ["attestation-17", "attestation-21"],
  "policyVersion": "credit-v1"
}
```

The backend/worker converts this into a canonical decision intent. The on-chain policy contract independently checks the critical constraints.

The exact production schema should be kept minimal; do not send raw chain data or long natural-language reasoning to the contract.

## Adversarial safety demo

The strongest judge demonstration is to deliberately make the AI propose an invalid action.

Example:

```text
Verified receivable:        $50,000
Maximum policy financing:   $10,000

AI proposal:                $40,000
```

Expected result:

```text
AI:              APPROVE $40,000
Policy:          REJECT
Reason:          amount > verified/policy limit
Blockchain:      NO FINANCING STATE CHANGE
```

This demonstrates that the system is not merely an AI wrapper around a smart contract. The AI is untrusted input to a deterministic financial control plane.

## MVP use case

### Verified RWA receivable financing

A business has a real-world receivable. The demo creates or records a source-chain event representing a verified settlement/receivable fact. Attestcoin verifies the source-chain event on Creditcoin. AI agents evaluate the verified facts. A deterministic policy calculates the maximum permitted financing. A DeFi-side contract executes only when the verified evidence and policy are valid.

## What is NOT the MVP

Do not spend the hackathon budget on:

- a generic chatbot
- a full banking replacement
- unrestricted autonomous trading
- a production-grade invoice marketplace
- tokenizing every possible RWA
- cross-chain writability unless required by the final flow
- multiple LLM providers in production
- a complicated agent framework that does not change the financial outcome

## Success criteria

A judge should be able to see this causal chain:

> **Real-world financial fact → verified cross-chain proof → AI underwriting → deterministic policy → on-chain financing/rejection.**

If any link is only simulated or decorative, the team should label it clearly and keep the verified testnet path separate from the simulation.

## Product vision after the MVP

The same primitive can support:

- trade finance
- invoice factoring
- collateralized credit
- insurance claims
- autonomous treasury actions
- verified supplier payments
- agentic financial workflows

The MVP is one vertical. The protocol idea is broader: **financial actions that carry verifiable evidence and deterministic policy constraints.**
