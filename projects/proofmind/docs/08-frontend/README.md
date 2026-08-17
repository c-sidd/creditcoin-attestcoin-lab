# 08 — Dashboard / Frontend

The dashboard is an evidence explorer rather than a wallet replacement or policy authority.

## Required views

1. **Overview** — current workflow counts and latest executions.
2. **Workflow detail** — source event → attestation → proof → verification → AI → policy → execution.
3. **AI decision** — structured proposal, score, action, reason codes and expiry.
4. **Execution** — destination transaction and final status.
5. **Diagnostics** — worker/proof/API failures suitable for development.

## UX rule

A user should be able to answer: **What happened? What was proven? What did the AI propose? Which deterministic rule allowed or rejected it? What transaction executed?**

## Security

The UI must not imply that an off-chain status field is cryptographic proof. Display verification status based on the backend's recorded protocol result and provide transaction/hash references where available.
