# Goals

## Product goal
Build ProofMind as an AI application whose decisions can be grounded in cryptographically verified cross-chain data and whose final on-chain actions are enforced by smart contracts.

## MVP goals
- Detect a source-chain business event.
- Wait for Creditcoin attestation.
- Obtain Merkle and continuity proofs through the documented Proof Builder flow.
- Submit proof material to an Attestcoin Smart Contract (ASC).
- Verify the source-chain transaction synchronously on Creditcoin.
- Produce a normalized verified-data record.
- Let an AI decision layer reason only over verified/explicitly labelled data.
- Convert an approved decision into a bounded transaction intent.
- Enforce the intent on Creditcoin with contract-level policy checks.
- Expose evidence and processing status in a dashboard.

## Success criteria
A judge can follow one complete event from source transaction to proof verification, AI decision, and Creditcoin execution, with transaction hashes and evidence visible at each boundary.

## Non-protocol assumptions
Anything about AI models, backend persistence, UI, policy thresholds, or application business logic is ProofMind project design—not an Attestcoin protocol guarantee.
