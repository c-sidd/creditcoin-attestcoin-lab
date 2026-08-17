# 18 — Dashboard and API

## Dashboard goal

The dashboard should make the protocol visible. A judge should not need to inspect terminal logs to understand why an action happened.

## Main screen

Show:

- Total events processed.
- Verified events.
- AI decisions.
- Executed decisions.
- Failed/retryable jobs.
- Latest source transaction.
- Latest Creditcoin transaction.

## Evidence detail page

For one `evidenceId`, show:

```text
Source
  chain
  contract
  tx hash
  block
  event type

Attestcoin
  attestation status
  proof status
  verification tx
  gas used

AI
  model version
  score
  decision
  reason codes

Execution
  action
  Creditcoin tx hash
  final status
```

## API

### `GET /api/health`

Returns service health and configured environment name.

### `GET /api/events`

Returns paginated processing records.

### `GET /api/events/:evidenceId`

Returns the complete evidence record.

### `GET /api/events/:evidenceId/timeline`

Returns chronological processing stages.

### `POST /api/ai/decisions/:evidenceId`

Triggers/retries AI processing for an already verified fact. Must refuse unverified evidence.

### `GET /api/decisions/:evidenceId`

Returns the structured decision and execution status.

## Frontend states

- Loading.
- Waiting for source event.
- Waiting for attestation.
- Generating proof.
- Verifying.
- AI reasoning.
- Executing.
- Completed.
- Retryable error.
- Final failure.

## UX rule

Do not present AI output as proof. Label protocol verification and AI reasoning as separate stages.
