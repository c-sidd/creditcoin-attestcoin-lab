# ProofMind Decisions Log

This document records the architectural and design decisions specific to the ProofMind codebase.

## Active Decisions

### PM-DEC-001: Monorepo Workspace Configuration
* **Status**: Decided (2026-08-22)
* **Decision**: We use an npm workspaces monorepo structure at `projects/proofmind/package.json` to coordinate dependencies and scripts across contracts, worker, backend, and dashboard.

### PM-DEC-002: Smart Contract Compilation Framework
* **Status**: Decided (2026-08-22)
* **Decision**: We use Hardhat as the local compilation and testing framework since Foundry is not available on the execution host.
