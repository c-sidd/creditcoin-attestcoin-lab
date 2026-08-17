# 03 — Solution

## Overview

ProofMind implements a four-stage trust pipeline:

### Stage 1 — Prove the fact

A minimal source-chain contract emits an unambiguous event containing the fields required by the application. The worker watches that contract.

### Stage 2 — Verify the fact on Creditcoin

After the source block is attested, the worker obtains Merkle and continuity proofs and calls the Attestcoin Smart Contract. The ASC invokes the documented Block Prover/Native Query Verifier precompile and extracts the verified transaction/event data.

### Stage 3 — Reason over verified data

The backend creates a canonical `VerifiedFact` object. The AI receives that object rather than raw RPC data. The model returns a strict decision such as `ALLOW`, `REVIEW`, or `REJECT`, together with a confidence score, reason codes, and recommended bounded action.

### Stage 4 — Enforce the decision

A Creditcoin decision contract checks that the request is authorized, not replayed, correctly formatted, and within configured limits. Only then does it update application state or execute the permitted action.

## MVP architecture principle

Keep the source contract and AI service simple. Put the protocol-critical verification in the ASC and put deterministic business rules in the Creditcoin decision contract.

## Example decision

```json
{
  "decision": "ALLOW",
  "score": 82,
  "reasonCodes": ["VERIFIED_ACTIVITY", "LOW_RISK_PATTERN"],
  "action": "APPROVE_LIMIT",
  "limit": "1000000000000000000",
  "evidenceId": "ev_001"
}
```

The exact numeric meaning and units must be defined by the deployed business logic; the AI must never invent a new action name.

## Trust model

- Source-chain event authenticity: Attestcoin proofs.
- Decision reasoning: AI model.
- Decision validity: schema + deterministic policy contract.
- Final state: Creditcoin blockchain.

This division is central to the product and must remain visible in the UI and demo.
