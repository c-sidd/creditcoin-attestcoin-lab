# Worker State Machine

## States

```text
DETECTED
   ↓
WAITING_FOR_ATTESTATION
   ↓
ATTESTED
   ↓
PROOF_REQUESTED
   ↓
PROOF_RECEIVED
   ↓
ASC_SUBMITTED
   ↓
EXECUTED
```

## Failure transitions

- `WAITING_FOR_ATTESTATION` → retry after delay
- `PROOF_REQUESTED` → retry on transient service/network failure
- `ASC_SUBMITTED` → inspect transaction result before retrying
- any non-terminal state → recover after process restart
- terminal execution → never submit again for the same unique source event

## Persistent record

Store enough information to reconstruct progress:

- source chain/key
- source block
- source transaction hash
- log/event index or equivalent unique event identity
- contract address
- current state
- retry count
- last error
- attestation/proof metadata
- ASC transaction hash
- timestamps

## Idempotency

The worker should maintain its own processed-event index, while the destination contract also enforces replay protection. Both layers are required because operational duplicate prevention and economic authorization solve different problems.
