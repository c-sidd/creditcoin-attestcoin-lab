# 07 — Backend and Evidence API

The backend is the application's persistence and read API layer.

## Responsibilities

- store workflow/evidence records
- expose status and evidence APIs
- correlate source events with proof/ASC/AI/execution stages
- validate external input
- provide dashboard-friendly projections
- provide health/diagnostic endpoints for development

## Non-responsibilities

The backend does not create cryptographic truth, replace the ASC, or become an authorization bypass.

## Suggested entities

- `SourceEvent`
- `WorkflowRun`
- `ProofAttempt`
- `VerifiedFact`
- `AIDecision`
- `Execution`

Each entity should have a stable identifier and timestamps. Hashes and blockchain numeric values should be stored in lossless formats.
