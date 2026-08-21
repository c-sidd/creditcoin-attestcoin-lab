# 14 — Security

## Trust boundaries

1. **Source RPC → worker:** RPC data is observed, not yet trusted as cross-chain proof.
2. **Worker → ASC:** proof payload is untrusted input until precompile verification succeeds.
3. **ASC → business logic:** only verified/decoded data crosses this boundary.
4. **AI → decision contract:** AI output is untrusted until schema and policy validation succeeds.
5. **Backend → UI:** UI is informational and must not be treated as a security boundary.

## Threats and controls

| Threat | Control |
|---|---|
| Fake source event | Attestcoin proof verification |
| Replay | Source event identity + contract replay mapping |
| Forged AI output | Structured schema + bounded policy |
| Excessive AI limit | Contract-side maximum |
| Unknown action | Allowlisted enum |
| Expired decision | Timestamp/deadline check |
| Worker crash | Durable state + catch-up |
| Duplicate worker | DB uniqueness + contract replay protection |
| RPC outage | Provider abstraction + retry |
| Proof API outage | Retry + persistent job state |
| Secret leakage | Environment variables / secret manager |
| Prompt injection through event text | Treat source text as data; do not allow it to alter system policy |

## AI-specific safety

If source-chain event data contains free-form strings, the AI prompt must explicitly delimit them as untrusted data. The model must not interpret source data as instructions.

## Contract safety

The decision contract should validate every field required for execution. Never rely on the frontend or AI service to enforce monetary/permission limits.

## Key management

Private keys used by the worker or deployment scripts must be injected through environment/secret management. Testnet keys must be clearly separated from any mainnet credentials.

## Emergency controls

For the demo, include a configurable pause/disable mechanism in the business logic if it can be implemented without obscuring the core Attestcoin flow. Pausing should prevent new executions while preserving evidence records.

## Security testing checklist

- Invalid Merkle proof rejected.
- Invalid continuity proof rejected.
- Wrong source transaction rejected.
- Duplicate evidence rejected.
- Unknown decision rejected.
- Out-of-range score rejected.
- Out-of-range limit rejected.
- Expired decision rejected.
- Unauthorized executor rejected.
- Malformed AI JSON rejected.
