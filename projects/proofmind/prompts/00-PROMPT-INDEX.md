# ProofMind — Antigravity Prompt Chain

## Purpose
This directory is the autonomous execution playbook for building ProofMind with Antigravity. Start with `00-AUTONOMOUS-EXECUTION.md`, then execute prompts in order. Antigravity must continue through the chain without asking the user for approval after each prompt.

## Non-negotiable rules
1. Read `projects/proofmind/README.md`, `PROJECT_STATUS.md`, `DECISIONS.md`, `IMPLEMENTATION_RULES.md`, `PRE_IMPLEMENTATION_GATE.md`, and the relevant docs before coding.
2. Official Creditcoin documentation and the existing Creditcoin reference implementation are authoritative for protocol behavior. Never invent protocol behavior.
3. ProofMind documents are authoritative for project-specific design decisions.
4. Inspect existing code before creating replacements; reuse proven patterns where appropriate.
5. Do not modify unrelated repository material.
6. Never commit secrets, private keys, API keys, seed phrases, or real credentials.
7. After every task: run relevant tests, inspect `git diff`, update status/changelog/docs, and commit the completed task.
8. A task is not complete merely because code exists. Acceptance criteria and verification evidence must pass.
9. If a required fact is unknown, do not guess. Record the uncertainty and use the safest documented abstraction, then continue with independent work.
10. Keep mock/demo behavior explicitly separated from real Attestcoin verification.
11. Do not stop for user review between prompts. Continue automatically unless execution is genuinely impossible without a required secret, wallet signature, external service, or unavailable runtime.
12. When blocked, document the exact blocker and continue every independent task that does not depend on it.
13. Never claim a live blockchain/test command passed unless it was actually executed.
14. Maintain the final V2 product direction: cross-chain AI credit/risk intelligence using verified facts, deterministic risk/simulation, and multiple bounded AI agents.
15. AI output is advisory and bounded. Smart contracts enforce deterministic policy; AI never directly controls arbitrary on-chain execution.

## Prompt lifecycle
`READ → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → COMMIT → STATUS → NEXT PROMPT`

## Chain
01 Reconnaissance
02 Documentation verification
03 Project scaffold
04 Source-chain financial contract
05 Source contract tests
06 Creditcoin environment configuration
07 Attestcoin integration boundary
08 Attestcoin adapter/tests
09 Credit/risk business contract
10 Contract integration
11 Proof Builder integration
12 Worker foundation
13 Worker event monitoring
14 Worker attestation waiting
15 Worker proof generation
16 Worker Attestcoin submission
17 Worker retry/idempotency
18 Worker integration tests
19 AI service foundation
20 Verified financial-data validation
21 Deterministic risk engine
22 Scenario simulation engine
23 Financial Analyst Agent
24 Risk Agent
25 Fraud/Anomaly Agent
26 Credit Agent
27 Policy Agent
28 Multi-agent orchestrator
29 AI decision/policy validation
30 AI tests/evaluation
31 Backend foundation
32 Evidence/decision API
33 PostgreSQL persistence
34 Frontend foundation
35 Dashboard
36 Evidence/provenance viewer
37 Wallet and transaction flow
38 Full integration testing
39 Creditcoin testnet deployment
40 Real Attestcoin E2E verification
41 Security/gas/failure audit
42 Demo, final audit and completion gate

## Required handoff
At the end of every prompt, record: files created/changed, commands actually run, test results, evidence/transaction hashes if applicable, unresolved issues/blockers, documentation updates, commit SHA, current status, and the exact next prompt. Then immediately continue to the next prompt without waiting for user approval.
