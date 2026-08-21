# Product Requirements

## Primary user
A dApp builder or user wants an application decision to be based on source-chain facts without trusting a centralized oracle operator for the truth of that source transaction.

## MVP capability
1. Submit a source-chain action that emits a dedicated ProofMind event.
2. Track the event through worker states.
3. Show whether the block is attested.
4. Generate/request proof material.
5. Submit the proof package to the ASC.
6. Persist the verification result and source transaction reference.
7. Run an AI decision over the normalized verified record.
8. Validate the decision against deterministic application policy.
9. Execute an allowed transaction on Creditcoin.
10. Display an evidence timeline.

## Product constraints
- Cryptographic verification must happen on-chain through the documented ASC flow.
- AI output must never be the sole authorization mechanism.
- Every autonomous action needs an auditable intent and execution reference.
- Failed steps must remain observable and retryable.

## Acceptance
The happy path and important failure paths are demonstrable on testnet, and no UI status may claim verification/execution without a corresponding backend/chain record.
