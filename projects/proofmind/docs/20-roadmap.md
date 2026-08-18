# 20 — Roadmap

## Milestone 0 — Product/documentation freeze

- Confirm V2 cross-chain credit/risk problem.
- Confirm source event schema.
- Confirm VerifiedFact schema.
- Confirm deterministic risk formulas.
- Confirm scenario formulas.
- Confirm multi-agent output contracts.
- Confirm decision-contract policy.
- Confirm environment variables and testnet addresses.
- Record architectural decisions.

## Milestone 1 — Source-chain financial event

- Implement the smallest source contract.
- Emit one unambiguous financial event.
- Add unit tests.
- Deploy to Ethereum Sepolia.
- Trigger a known scenario.

## Milestone 2 — Attestcoin verification

- Implement/adapt documented ASC integration.
- Implement proof request path from the verified reference.
- Verify valid proof.
- Reject invalid proof.
- Create canonical VerifiedFact only after successful verification.
- Add replay protection.

## Milestone 3 — Durable readability worker

- Event listener.
- Persistent state machine.
- Attestation waiting.
- Proof Builder integration.
- ASC submission.
- Receipt confirmation.
- Retry/backoff.
- Restart recovery.
- Idempotency/reconciliation.

## Milestone 4 — Financial profile + deterministic risk

- VerifiedFact persistence.
- FinancialProfile model.
- Collateral/debt metrics.
- Utilization/exposure metrics.
- Repayment/liquidation metrics.
- Versioned formulas.

## Milestone 5 — Scenario engine

- Explicit scenario input schema.
- Deterministic calculations.
- SAFE/WARNING/REVIEW output.
- Unit and boundary tests.
- No on-chain mutation from simulation.

## Milestone 6 — Multi-agent AI

- Agent interfaces.
- Financial Analyst.
- Risk Agent.
- Fraud/Anomaly Agent.
- Credit Agent.
- Policy Agent.
- Deterministic mock provider.
- Groq/Llama adapter for development/testing.
- OpenAI adapter for final submission if selected.
- Strict JSON schema validation.
- Model/version tracking.

## Milestone 7 — Creditcoin policy/execution

- Bounded decision contract.
- Authorization.
- Action allowlist.
- Risk/score limits.
- Credit limit bounds.
- Evidence freshness.
- Expiry.
- Replay protection.
- Execution events.

## Milestone 8 — Evidence backend

- Source event records.
- Proof attempts.
- Verified facts.
- Financial profiles.
- Agent decisions.
- Scenario results.
- Policy decisions.
- Executions.
- Evidence timeline API.

## Milestone 9 — Dashboard

- Evidence timeline.
- Verified fields.
- Financial profile.
- Risk metrics.
- Agent traces/results.
- Scenario simulation.
- Policy result.
- Explorer links.
- Clear mock-vs-real labels.

## Milestone 10 — Reliability/security

- Invalid proof tests.
- Replay tests.
- Expiry tests.
- Unauthorized caller tests.
- Malformed AI output tests.
- Provider outage tests.
- Worker restart tests.
- Duplicate event tests.
- Failure injection and recovery evidence.

## Milestone 11 — Testnet E2E

Prove the complete path:

```text
Sepolia event
→ attestation
→ proof
→ Attestcoin verification
→ VerifiedFact
→ financial profile
→ risk/simulation
→ multi-agent decision
→ Creditcoin policy
→ Creditcoin execution
```

Record transaction hashes and evidence IDs.

## Milestone 12 — Demo/release freeze

- Rehearse 3–5 minute demo.
- Prepare backup evidence.
- Update deployment manifest.
- Complete judge checklist.
- Run clean-checkout verification.
- Freeze architecture.
- Tag release candidate.

## Stretch goals

Only after the complete MVP works repeatedly:

- second source chain;
- multiple source event types;
- human approval mode;
- richer anomaly detection;
- agent comparison;
- RWA/DeFi decision templates.

## Priority rule

Do not add features merely because they look impressive. Every feature must strengthen the core story: **verified cross-chain evidence → useful AI/risk interpretation → deterministic Creditcoin enforcement**.
