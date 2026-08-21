# Backend Services

Recommended service boundaries:

- `EventService`: ingest and deduplicate source events.
- `ProcessingService`: advance the worker/job state machine.
- `AttestcoinService`: adapter around attestation/proof/ASC interactions.
- `EvidenceService`: normalize and persist verified evidence.
- `DecisionService`: invoke AI provider and validate structured output.
- `PolicyService`: deterministic preflight checks before execution.
- `ExecutionService`: submit and track allowed Creditcoin transactions.
- `AuditService`: append lifecycle/audit records.

Services should communicate through typed DTOs. Avoid passing ORM objects or provider-specific payloads across boundaries.
