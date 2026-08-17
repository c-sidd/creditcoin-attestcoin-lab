# Prompt 07 — Attestcoin Smart Contract

Read the official Attestcoin readability docs, dApp infrastructure docs, ASC design, interfaces, and reference implementation before coding.

## Goal
Implement the ProofMind ASC boundary that receives worker proof data, invokes the documented native verifier/precompile path, extracts verified source transaction/event data, and invokes downstream business logic.

## Rules
Do not invent precompile ABI, proof encoding, decoder behavior, or transaction format. Reuse verified SDK/reference patterns. Keep verification and business logic separable where the design calls for separation.

## Security
Validate proof/data inputs, restrict submission authority as designed, prevent replay, handle failed verification atomically, and emit auditable result events.

## Verify
Compile, unit test valid/invalid proofs, unauthorized submissions, replay attempts, malformed payloads, and downstream-call failures. Document exactly which behavior is mocked versus real.