# ProofMind Evidence

This directory contains reproducible proof that implementation milestones actually work.

## Rules

- Never commit private keys, seed phrases, API secrets, access tokens, or `.env` files containing secrets.
- Prefer public transaction hashes, contract addresses, block numbers, logs, test reports, and sanitized screenshots.
- Every E2E record must identify the source network and destination network.
- Recorded/demo evidence must be clearly labeled as recorded.
- A milestone cannot be marked complete without its required evidence.

## E2E evidence format

Use `e2e/TEMPLATE.md` for every complete cross-chain run.

Recommended layout:

```text
evidence/
├── README.md
├── e2e/
│   └── TEMPLATE.md
├── deployments/
│   └── README.md
├── test-runs/
│   └── README.md
└── screenshots/
    └── README.md
```
