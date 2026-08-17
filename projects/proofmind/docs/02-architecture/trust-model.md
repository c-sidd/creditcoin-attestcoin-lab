# Trust Model

## Trusted by protocol
The Attestcoin protocol provides the documented attestation/proof verification mechanism. The ASC verifies submitted proof material synchronously through the configured verifier precompile.

## Trusted by application
- Deployed contract addresses are configured explicitly.
- Business rules are deterministic on-chain.
- Worker state is persisted and replay-safe.
- Evidence records reference immutable chain identifiers.

## Not trusted as truth
- AI-generated statements.
- Worker claims that a block is verified without an on-chain result.
- UI status alone.
- Unauthenticated backend requests.
- Arbitrary event types not explicitly supported by the source contract.

## Critical invariant
**AI may recommend an action; only verified cross-chain data plus deterministic contract policy may authorize the resulting state transition.**
