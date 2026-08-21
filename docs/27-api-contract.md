# 27 — API Contract

The backend is an evidence/query layer and orchestration boundary. It must never pretend that an off-chain observation is equivalent to Attestcoin verification.

## Health

`GET /api/health`

Returns service health and version information. It must not expose secrets.

## Events

`GET /api/events`

Optional filters:
- `status`
- `sourceChain`
- `eventName`
- `transactionHash`

## Event detail

`GET /api/events/:eventId`

Returns the evidence timeline for one event.

## Verified fact

`GET /api/facts/:eventId`

Returns the canonical fact produced only after successful proof verification.

Suggested response:

```json
{
  "eventId": "...",
  "verified": true,
  "sourceChain": "ethereum-sepolia",
  "sourceTransaction": "0x...",
  "sourceBlock": 123,
  "facts": {
    "borrower": "0x...",
    "amount": "1000000000000000000"
  },
  "creditcoinVerificationTx": "0x..."
}
```

## AI decision

`GET /api/events/:eventId/decision`

Returns the validated decision and execution status.

## Timeline

`GET /api/events/:eventId/timeline`

The timeline should expose:

1. source event detected
2. attestation available
3. proof requested
4. proof received
5. ASC transaction submitted
6. proof verified
7. verified fact created
8. AI decision generated
9. decision contract accepted/rejected
10. business action executed

## Error model

Use a consistent structure:

```json
{
  "error": {
    "code": "PROOF_NOT_READY",
    "message": "Proof is not available yet",
    "retryable": true
  }
}
```

Never return private keys, provider credentials, internal database passwords, or raw secrets.

## API design rule

The API may display evidence, but it cannot manufacture evidence. The source of truth for cross-chain verification is the Attestcoin verification path.
