# Frontend Pages

## `/`
Project overview and current system status.

## `/events`
Source events with processing state, source tx hash, block and timestamps.

## `/events/:id`
Evidence timeline: detected → attestation → proof → ASC verification → decision → execution.

## `/decisions`
AI decisions with evidence references, structured intent, policy result and execution status.

## `/transactions`
Source-chain and Creditcoin transaction references with explorer links.

## `/settings`
Network/environment status and non-secret configuration visibility.

## `/demo`
Judge-friendly guided view showing the canonical happy path.

The frontend must distinguish `pending`, `verified`, `executed`, `failed`, and `rejected` rather than collapsing all states into a generic success/failure label.
