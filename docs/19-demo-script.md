# 19 — Demo Script

## Demo objective

Show one complete cross-chain AI decision in 3–5 minutes without requiring the audience to understand every implementation detail.

## Before the demo

- Contracts deployed on testnet.
- Worker running.
- AI service healthy.
- Dashboard open.
- Test wallet funded.
- Known-good source transaction scenario prepared.
- Backup evidence ID available in case a live RPC/provider fails.

## Scene 1 — Problem

Say: **“We do not want AI to decide based on data we merely received from an API. We first prove the cross-chain fact, then let AI reason over it.”**

## Scene 2 — Source transaction

Submit the source-chain transaction and show the event in the source explorer/logs.

Point out the unique event name and the exact data fields that will be carried across.

## Scene 3 — Attestcoin processing

Show the dashboard changing:

`Detected → Waiting for attestation → Proof ready → Verifying`

Explain that the worker handles the operational complexity automatically.

## Scene 4 — Verification

Show the Creditcoin verification transaction. Explain that the ASC uses the verifier precompile to validate the source transaction proofs before application logic consumes the data.

## Scene 5 — AI

Show the verified fact entering the AI service. Display the structured decision and reason codes.

Emphasize: **“The model is reasoning over verified evidence, not deciding whether the evidence is authentic.”**

## Scene 6 — On-chain action

Show the decision contract accepting the bounded action and emitting `DecisionExecuted`.

## Scene 7 — Close

Return to the evidence timeline and show the entire chain of custody.

### Closing line

**“ProofMind separates truth from intelligence: Attestcoin proves what happened, AI decides what it means, and Creditcoin enforces what is allowed to happen next.”**

## Failure demo

If a second transaction is available, intentionally submit a duplicate and show replay protection. This is a strong security demonstration if the happy path is already complete.
