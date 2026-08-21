# Prompt 04 — Source-Chain Contract

Read the source-chain and smart-contract docs plus the reference implementation.

## Goal
Implement the minimum source-chain contract that performs required source-chain logic and emits the explicit ProofMind cross-chain event.

## Requirements
Use project-specified event names and fields. Include every downstream field required by the ASC/worker. Keep source logic minimal. Do not use generic events as the cross-chain trigger when the design specifies a dedicated event.

## Security
Validate inputs, define access control where required, avoid unnecessary external calls, and make replay/duplicate semantics explicit.

## Verify
Compile with the documented compiler/toolchain and inspect ABI and event signatures.

## Tests
Test happy path, invalid inputs, authorization, event contents, boundary values, and duplicate behavior where applicable.

## Documentation
Update contract docs and status with compiler version, ABI location, and test evidence. Do not claim deployment until a real deployment exists.