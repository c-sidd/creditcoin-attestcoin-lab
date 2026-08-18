# 19 — Demo Script

## Demo objective

Show one complete **cross-chain credit-risk decision** in 3–5 minutes and make the role of Attestcoin, AI and Creditcoin unmistakable.

## Before the demo

- Source contract deployed to the selected testnet.
- Creditcoin contracts deployed.
- Worker running.
- Proof Builder path verified.
- AI provider healthy or deterministic mock prepared.
- Dashboard open.
- Test wallet funded.
- Known-good source scenario prepared.
- Backup evidence ID available.
- Explorer links prepared.

## Scene 1 — The problem

Say:

> **“A Creditcoin credit decision may need financial history that exists on another chain. An API can tell us what it saw, but we want the cross-chain fact itself to be verified before AI reasons over it.”**

Show the source-chain financial event.

## Scene 2 — Attestcoin proves the evidence

Trigger the source event and show:

```text
Observed
  ↓
Attestation
  ↓
Proof ready
  ↓
ASC verification
  ↓
VerifiedFact
```

Explain that the worker's RPC observation is not itself trusted financial evidence.

## Scene 3 — Build the financial profile

Show the dashboard extracting verified fields such as:

- collateral;
- liabilities;
- repayment history;
- liquidation history;
- utilization/exposure.

Then show deterministic metrics.

## Scene 4 — Multi-agent analysis

Show the five logical agents:

```text
Financial Analyst
       ↓
Risk Agent
       ↓
Fraud/Anomaly Agent
       ↓
Credit Agent
       ↓
Policy Agent
```

Show a structured result such as:

```text
Risk: LOW
Score: 23
Recommended limit: 5,000
Scenario: SAFE
```

Emphasize:

> **“The AI is not deciding whether the blockchain evidence is authentic. It is reasoning over evidence that has already crossed the Attestcoin verification boundary.”**

## Scene 5 — Scenario simulation

Run one deterministic scenario, e.g. collateral falls by 30%.

Show the result changing from `SAFE` to `REVIEW` if the configured formula requires it.

Explain that this is an explicit hypothetical calculation, not an AI prediction of market prices.

## Scene 6 — Smart-contract enforcement

Submit the bounded intent.

Show the Creditcoin contract checking:

- authorized caller;
- verified evidence;
- freshness;
- replay protection;
- allowed action;
- amount/risk bounds;
- expiry.

Then show `Executed` or `Rejected`.

## Scene 7 — Evidence timeline

Return to the evidence page:

```text
Source event
   ↓
Attestation
   ↓
Proof
   ↓
VerifiedFact
   ↓
Financial profile
   ↓
AI agents
   ↓
Risk/simulation
   ↓
Policy
   ↓
Creditcoin execution
```

## Closing line

> **“Attestcoin proves the financial evidence, AI understands the risk, deterministic policy controls the recommendation, and Creditcoin enforces what is actually allowed.”**

## Security bonus scene

If time permits, submit the same intent twice. Show that replay protection rejects the second execution.

## Demo rule

Never present a mocked proof or mocked verification as a live cryptographic protocol result. If any component is mocked, label it visibly.
