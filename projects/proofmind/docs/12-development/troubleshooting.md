# Troubleshooting

## Event not detected
Check RPC connectivity, contract address, ABI/event signature, start block and worker cursor.

## Block not attested
Do not generate fake proof data. Keep the event in `WAITING_ATTESTATION` and retry according to policy.

## Proof Builder error
Inspect request identifiers and response schema; retry transient failures; stop on malformed responses.

## ASC revert
Inspect transaction receipt/revert reason, contract address/network and proof encoding. Do not blindly retry a deterministic revert.

## Transaction timeout
Reconcile the transaction on-chain before retrying to avoid duplicate execution.

## AI failure
Keep verified evidence intact and mark the decision as pending/failed. No blockchain action should occur merely because the model failed.

## Dashboard mismatch
Compare UI state with backend record and chain transaction receipt; the UI is never the authoritative source.
