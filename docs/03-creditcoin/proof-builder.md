# Proof Builder Integration

## Worker contract
The worker provides the chain identifier/key, source block/transaction reference and any parameters required by the documented Proof Builder API.

## Expected result
A proof package containing the proof material and encoded transaction information required by the ASC call.

## Robustness
- Persist the request context before calling the service.
- Validate response shape before submitting on-chain.
- Store a redacted proof metadata record and request identifiers.
- Retry transient failures with bounded exponential backoff.
- Never fabricate a proof or mark a query complete because the API responded successfully.
- If the proof package is malformed, stop before spending gas and mark the event for investigation.

Exact endpoint paths and request/response schemas must be sourced from the current testnet Proof Builder documentation/reference implementation before implementation.
