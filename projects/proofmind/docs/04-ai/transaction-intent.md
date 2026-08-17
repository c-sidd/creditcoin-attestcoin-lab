# Transaction Intent

The AI output is converted into a small deterministic intent object.

```json
{
  "decisionId": "uuid",
  "action": "ACTION_NAME",
  "sourceEvidenceIds": ["evidence-id"],
  "targetContract": "0x...",
  "parameters": {},
  "reasonCode": "RULE_CODE",
  "expiresAt": 0
}
```

## Rules
- `action` must be allowlisted.
- `targetContract` must be allowlisted.
- Parameters must satisfy the action schema.
- Evidence IDs must resolve to verified records.
- Intent must have an expiry/nonce suitable for replay protection.
- The executor must recompute deterministic constraints before sending a transaction.

This schema is project design and must be versioned when changed.
