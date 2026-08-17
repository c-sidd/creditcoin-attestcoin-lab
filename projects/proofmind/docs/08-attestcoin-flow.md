# 08 — Attestcoin Flow

## Protocol role

The project uses the Attestcoin Protocol Readability model described in the Creditcoin documentation supplied for this project.

The important sequence is:

1. Source chain produces a transaction/event.
2. Attestors follow source-chain blocks and submit attestations.
3. Worker waits for the relevant block to be attested.
4. Proof Builder supplies Merkle and continuity proofs plus encoded transaction data.
5. Worker submits those materials to the ASC on Creditcoin.
6. ASC calls the Native Query Verifier / Block Prover precompile.
7. Verified transaction data is decoded and used by the ASC/business logic.

## Relevant documented environments

### CC3 Testnet

- ASC Dashboard: `https://dashboard.cc3-testnet.creditcoin.network/`
- Proof Builder API: `https://proof-gen-api.cc3-testnet.creditcoin.network/`
- Decoder contract: `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`
- ChainInfo precompile: `0x0000000000000000000000000000000000000fd3`
- BlockProver precompile: `0x0000000000000000000000000000000000000FD2`
- Ethereum Sepolia chain key: `1`
- Ethereum Mainnet chain key: `3`

These values are configuration references, not secrets. Verify against the latest official documentation before deployment because protocol environments can change.

## Why both Merkle and continuity proofs matter

Merkle proving establishes transaction inclusion within a source block. Continuity proving links the source block to an attested checkpoint. Together they let the verifier establish that the transaction belongs to the authenticated source-chain history represented by the attestation.

## Worker responsibilities

The worker must not assume that an event is verified merely because an RPC node returned it. Verification begins only after successful ASC proof verification.

## Important optimization

The supplied gas documentation says continuity proof length has a large effect on verification cost. Recent transactions can have much shorter proofs than old transactions. The worker should therefore process newly finalized events promptly rather than intentionally delaying them.
