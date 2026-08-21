# Prompt 01 — Repository Reconnaissance

Read the ProofMind root docs, all relevant `docs/` files, existing Creditcoin examples, package/config files, and repository history before changing anything.

## Goal
Build a factual map of the repository and identify reusable Attestcoin patterns, SDK usage, ABIs, environments, scripts, and constraints.

## Do
- Inspect the repository tree and relevant source/reference code.
- Locate existing source-contract, ASC, worker, proof-builder, SDK, deployment and test patterns.
- Record exact paths and why each is relevant.
- Identify contradictions or unknowns without resolving them by guesswork.

## Do not
Do not implement features, restructure existing examples, or copy code blindly.

## Verify
Produce a reconnaissance report and confirm every implementation assumption has a source.

## Documentation
Update `PROJECT_STATUS.md` only with reconnaissance evidence and add decisions/open questions when necessary.

## Acceptance
No unexplained protocol assumptions; reusable reference paths identified; next prompt can begin from a known baseline.