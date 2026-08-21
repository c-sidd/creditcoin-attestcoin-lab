# Sequence Flows

## Happy path

```text
User -> Source Contract: submitAction()
Source Contract -> Source Chain: execute + emit ProofMindEvent
Worker -> Source Chain: detect event
Worker -> Creditcoin: check attestation state
Worker -> Proof Builder: request proof package
Proof Builder -> Worker: Merkle + continuity proofs + encoded tx
Worker -> ASC: submit proof package
ASC -> verifier precompile: verify
verifier -> ASC: valid
ASC -> Business Logic: execute verified action
Business Logic -> Creditcoin: state update + event
Worker/Backend -> Evidence Store: persist lifecycle
Dashboard -> Backend: display evidence
AI -> Policy Contract: bounded transaction intent (project design)
```

## Failure boundaries
- Event discovery failure → rescan/catch-up.
- Attestation not ready → wait with bounded backoff.
- Proof Builder failure → retry; retain event state.
- ASC transaction failure → retry only when failure is recoverable and the event is not already completed.
- AI provider failure → no on-chain action; mark decision pending/failed.
- Policy rejection → terminal business rejection; preserve evidence.
