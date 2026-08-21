# 04 — Use Cases

## UC-01 — Verified cross-chain risk signal

**Actor:** Source-chain user/application

1. User submits a signal transaction.
2. Source contract emits `RiskSignalSubmitted`.
3. Worker detects the event.
4. Worker waits for attestation.
5. Worker requests proofs.
6. ASC verifies the transaction.
7. Verified event fields are persisted.
8. AI evaluates the verified signal.
9. Decision contract accepts/rejects the bounded decision.
10. Dashboard displays the evidence chain.

## UC-02 — Automatic approval

If the AI decision is `ALLOW` and the policy constraints pass, the decision contract executes the configured action automatically.

## UC-03 — Human review path

If the AI returns `REVIEW`, no privileged state-changing action occurs. The dashboard marks the case for review. This prevents the model from escalating uncertainty into an irreversible transaction.

## UC-04 — Rejection

If the AI returns `REJECT`, the system records the decision and does not execute the protected action.

## UC-05 — Duplicate event

If the same source transaction/event is received twice, the worker and contract replay protection must prevent duplicate execution.

## UC-06 — Proof service failure

The worker records the failure, retries according to its backoff policy, and does not mark the event complete until the ASC execution is confirmed.

## UC-07 — AI service failure

The verified fact remains stored. The AI stage can be retried without repeating the source-chain verification stage.

## UC-08 — Invalid AI output

The backend rejects malformed JSON, unknown decisions, out-of-range values, missing evidence IDs, or unauthorized actions. No on-chain execution is attempted.

## Future use cases

- Cross-chain DeFi risk assessment.
- Verified collateral/asset signals.
- AI-assisted RWA eligibility.
- DePIN incentive decisions based on verified cross-chain events.
- Gaming actions based on verified external-chain achievements.

These are extensions, not MVP commitments.
