# ProofMind Decisions Log

This document records the architectural, protocol, and implementation decisions made during the ProofMind project.

## Active Decisions

### DEC-001: Source Chain Key Configuration
* **Status**: Decided (2026-08-22)
* **Context**: Earlier documents referenced chain key `3` for Ethereum Sepolia.
* **Decision**: We use source chain key `1` for Sepolia, matching the official `gluwa/usc-testnet-bridge-examples` baseline.

### DEC-002: Proof Builder Endpoint
* **Status**: Decided (2026-08-22)
* **Context**: Prior notes referenced `https://proof-gen-api.cc3-testnet.creditcoin.network/`.
* **Decision**: We use the verified endpoint `https://prover.cc3-testnet.creditcoin.network` as documented in current SDK and reference implementations.

### DEC-003: Precompile Address Mapping
* **Status**: Decided (2026-08-22)
* **Decision**: Native Verifier precompile (BlockProver) is at `0x0000000000000000000000000000000000000FD2` and ChainInfo is at `0x0000000000000000000000000000000000000FD3`.

## Open Questions
* *None currently.*
