# Attestcoin Smart Contract Boundary

The ASC is the Creditcoin-side verification boundary described by the supplied protocol documentation.

## Inputs
- Merkle proof material.
- Continuity proof material where required.
- Encoded source transaction data.
- Application-specific context required by the frozen contract interface.

## Processing
1. Receive the worker submission.
2. Call the documented Native Query/Block Prover verification precompile at the configured address.
3. Revert on invalid proof material.
4. Extract the required transaction/event data using the documented decoding approach.
5. Apply replay protection.
6. Execute or call the project's business logic only after verification succeeds.

## Security boundary
The ASC must not accept an off-chain claim such as `verified=true` as proof. Verification must be performed through the protocol interface.

## Implementation rule
The exact ABI and precompile call encoding must be copied/validated from the official docs and reference implementation before coding. This document intentionally does not invent a byte-level interface.
