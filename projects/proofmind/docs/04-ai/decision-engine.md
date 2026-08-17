# AI Decision Engine

## Input contract

The model receives only a normalized verified record. Example conceptual fields:

- source chain identifier
- source transaction hash
- source block number
- source contract address
- event type
- verified event fields
- verification timestamp/reference
- application policy context

Do not expose arbitrary worker internals or unverified RPC observations as authoritative facts.

## Output contract

```json
{
  "decision": "APPROVE",
  "score": 87,
  "action": "ALLOW_LOAN",
  "amount": "1000000000000000000",
  "reasonCodes": ["VERIFIED_REPAYMENT_HISTORY"],
  "expiresAt": 1780000000
}
```

The exact schema must be implemented once and reused by backend, tests and the decision contract adapter.

## Validation

Before submission:

1. JSON parses.
2. Enum values are allowlisted.
3. Numeric ranges are valid.
4. Amount uses an exact integer/string representation, never floating point.
5. Expiry is in the permitted future window.
6. Reason codes are known.
7. The referenced `VerifiedFact` exists and is verified.

Then the on-chain contract repeats security-critical checks.

## Failure behavior

Malformed, incomplete, low-confidence or policy-incompatible output becomes `REJECTED`/`INVALID_PROPOSAL` rather than being repaired by guesswork.
