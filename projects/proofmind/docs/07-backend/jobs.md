# Backend Jobs

## Worker jobs
- `scanSourceEvents`: catch up from the last persisted source block.
- `processSourceEvent`: advance one event through attestation/proof/ASC stages.
- `retryProof`: retry recoverable Proof Builder failures.
- `retrySubmission`: retry recoverable ASC submission failures.
- `confirmExecution`: reconcile submitted transaction status.

## AI jobs
- `evaluateVerifiedEvidence`: create a decision only from verified records.
- `executeApprovedIntent`: submit only after deterministic policy validation.

Jobs must be idempotent and safe to restart. Every job records attempts and the reason for its current state.
