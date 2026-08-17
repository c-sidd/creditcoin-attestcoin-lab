# ProofMind — Antigravity Prompt Chain

## Purpose
This directory is the execution playbook for building ProofMind with Antigravity. Run prompts in order unless a prompt explicitly says it may be skipped. Each prompt is a bounded engineering task with verification, documentation, and acceptance criteria.

## Non-negotiable rules
1. Read `projects/proofmind/README.md`, `PROJECT_STATUS.md`, `DECISIONS.md`, and the relevant docs before coding.
2. Official Creditcoin documentation and the existing Creditcoin reference implementation are authoritative for protocol behavior. Never invent protocol behavior.
3. ProofMind documents are authoritative for project-specific design decisions.
4. Inspect existing code before creating replacements; reuse proven patterns where appropriate.
5. Do not modify unrelated repository material.
6. Never commit secrets, private keys, API keys, seed phrases, or real credentials.
7. After every task: run relevant tests, inspect `git diff`, update status/changelog/docs, and report evidence.
8. A task is not complete merely because code exists. Acceptance criteria and verification evidence must pass.
9. If a required fact is unknown, stop at that boundary, record it in the open-questions/decision documentation, and do not guess.
10. Keep mock/demo behavior explicitly separated from real Attestcoin verification.

## Prompt lifecycle
`READ → PLAN → IMPLEMENT → TEST → REVIEW → DOCUMENT → STATUS → HANDOFF`

## Chain
01 Reconnaissance
02 Documentation verification
03 Project scaffold
04 Source-chain contract
05 Source contract tests
06 Creditcoin environment
07 ASC contract
08 ASC tests
09 Business/decision contract
10 Contract integration
11 Proof Builder integration
12 Worker foundation
13 Worker event monitoring
14 Worker attestation waiting
15 Worker proof generation
16 Worker ASC submission
17 Worker retry/idempotency
18 Worker tests
19 AI service foundation
20 AI data validation
21 AI decision engine
22 AI risk controls
23 AI transaction intent
24 AI tests
25 Backend foundation
26 Evidence API
27 Backend database
28 Frontend foundation
29 Dashboard
30 Evidence viewer
31 Wallet flow
32 Integration testing
33 Testnet deployment
34 Real Attestcoin E2E
35 Security audit
36 Gas analysis
37 Demo/mock fallback
38 Ideathon demo
39 Final documentation
40 Final repository audit
41 Final completion gate

## Required handoff
At the end of every prompt report: files created/changed, commands run, tests and results, evidence/transaction hashes if applicable, unresolved issues, documentation updates, and the exact next prompt.
