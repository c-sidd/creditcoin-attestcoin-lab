# Prompt 13 — Local Integration

```text
Connect the implemented components in a deterministic local/integration environment.

Exercise the full logical lifecycle with test doubles only at documented external boundaries:
source event → worker → proof boundary → verification boundary → VerifiedFact → AI → policy → execution.

Verify serialization between every component.

Run unit, integration, and end-to-end tests. Add fixtures for success, malformed event, proof failure, worker restart, duplicate event, AI rejection, policy rejection, and execution failure.

Gate: PASS only when all negative cases fail safely and the happy path is reproducible.
```
