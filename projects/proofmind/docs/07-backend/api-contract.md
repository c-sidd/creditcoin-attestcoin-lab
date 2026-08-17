# Backend API Contract

The API should expose workflow state without pretending that off-chain observations are proof.

## Example read endpoints

```text
GET /api/health
GET /api/workflows
GET /api/workflows/{workflowId}
GET /api/workflows/{workflowId}/evidence
GET /api/executions/{executionId}
```

## Workflow response concept

```json
{
  "id": "workflow-id",
  "status": "EXECUTED",
  "source": {
    "chain": "ethereum-sepolia",
    "txHash": "0x...",
    "block": 123
  },
  "verification": {
    "status": "VERIFIED"
  },
  "ai": {
    "decision": "APPROVE",
    "score": 87
  },
  "execution": {
    "status": "SUCCESS",
    "txHash": "0x..."
  }
}
```

Exact routes and names are implementation choices and must be synchronized with the frontend and tests.

## API rules

- Never accept a client-supplied `verified=true` flag as proof.
- Validate IDs and hashes.
- Return explicit state and error codes.
- Do not expose secrets or private keys.
- Preserve raw blockchain identifiers without numeric truncation.
