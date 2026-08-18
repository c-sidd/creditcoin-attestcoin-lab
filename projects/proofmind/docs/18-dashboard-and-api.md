# 18 — Dashboard and API

## Dashboard goal

The dashboard is an evidence-first explanation of the complete trust pipeline. A judge should be able to understand what was observed, what was cryptographically verified, what the AI concluded, what deterministic risk checks produced, and what the Creditcoin contract finally allowed.

## Main screen

Show:

- total source events;
- verified facts;
- active processing jobs;
- AI/risk decisions;
- policy accepts/rejects;
- executed actions;
- retryable failures;
- latest source transaction;
- latest Attestcoin verification transaction;
- latest Creditcoin execution transaction.

## Evidence detail page

For one `evidenceId` show:

```text
SOURCE
  source chain
  source contract
  transaction hash
  block
  event/log

ATTESTCOIN
  attestation status
  proof status
  verification transaction
  verification result

VERIFIED FACT
  exact verified fields
  provenance
  verification timestamp

FINANCIAL PROFILE
  collateral
  liabilities
  repayment history
  utilization
  exposure
  deterministic metrics

AI AGENTS
  analyst output
  risk output
  anomaly output
  credit output
  policy-agent output
  model/agent versions

SIMULATION
  scenario inputs
  formula/version
  result

POLICY
  action requested
  bounds checked
  accept/reject
  rejection reason if applicable

EXECUTION
  Creditcoin transaction hash
  final status
```

## API

### `GET /api/health`

Returns service health and configured environment name without exposing secrets.

### `GET /api/events`

Returns paginated processing records.

### `GET /api/events/:evidenceId`

Returns the complete evidence record.

### `GET /api/events/:evidenceId/timeline`

Returns chronological processing stages.

### `POST /api/ai/decisions/:evidenceId`

Runs/retries multi-agent analysis for an already verified fact. Must refuse unverified evidence.

### `GET /api/decisions/:evidenceId`

Returns the structured decision and execution status.

### `GET /api/risk/:evidenceId`

Returns deterministic risk metrics and the current risk interpretation.

### `POST /api/risk/:evidenceId/simulate`

Runs an explicit deterministic scenario. It must not mutate on-chain state.

## Frontend states

- Loading
- Waiting for source event
- Waiting for attestation
- Generating proof
- Verifying
- Building verified profile
- Running financial analyst
- Running risk agent
- Running anomaly agent
- Running credit agent
- Running policy agent
- Running deterministic policy checks
- Executing
- Completed
- Review required
- Retryable error
- Final failure

## UX rules

1. Never present AI output as proof.
2. Clearly separate `Observed`, `Verified`, `AI`, `Policy`, and `Executed`.
3. Show evidence IDs and transaction hashes.
4. Show when a provider/model is mocked.
5. Never expose secrets.
6. Do not provide a UI control that bypasses Attestcoin verification or the decision contract.
