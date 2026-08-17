# Dashboard

The dashboard is an evidence viewer, not a source of truth.

## Top cards
- source events detected;
- events awaiting attestation;
- proof requests in progress;
- verified events;
- AI decisions;
- successful Creditcoin executions.

## Event timeline
Show each stage with timestamp, status, retry count and transaction/reference identifiers.

## Evidence drawer
Show source chain, source block/tx, event name, decoded fields, proof metadata, ASC tx hash, verification result, AI decision ID, policy result and final execution tx.

Never display fabricated hashes or a green success state without a persisted result.
