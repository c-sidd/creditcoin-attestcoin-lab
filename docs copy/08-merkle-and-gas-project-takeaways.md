# Project Takeaways: Merkle Proving and Gas

## Core facts

- Readability uses Merkle proofs to prove transaction inclusion in a source-chain block.
- Readability uses continuity proofs to prove that the block belongs to the finalized source chain.
- The two proofs work together; neither alone provides complete source-chain transaction verification.
- Merkle trees use Keccak-256 in the documented Attestcoin Readability implementation.
- The Block Prover Precompile verifies proofs on Creditcoin.
- After successful verification, an ASC can decode verified transaction bytes and execute business logic.

## Architecture rule

If our application claims that a source-chain event is trustworthy, the critical path should be:

```text
Source-chain event
→ transaction proof
→ Merkle verification
→ continuity verification
→ transaction-data validation
→ application action
```

Do not treat an off-chain RPC response alone as the security boundary.

## Gas rule

Continuity-proof length is the dominant verification-cost variable. Recent events can be cheaper to verify than old events because they can be closer to a recent attestation/checkpoint.

Therefore, a production-minded design should consider:

1. Event detection latency.
2. Finality requirements.
3. Proof-generation timing.
4. Continuity-proof length.
5. Frequency of verification requests.
6. Size and complexity of the transaction being decoded.

## Potential project feature

A future application could include a **Cross-Chain Verification Engine** that:

- Watches supported source chains for relevant events.
- Identifies finalized transactions.
- Requests/generates the required proofs.
- Submits them to an ASC on Creditcoin.
- Lets the ASC verify the transaction through the Block Prover Precompile.
- Executes application-specific logic only after verification succeeds.
- Records verification results and relevant source-chain data.

This is a potential architecture component, not yet the final hackathon project.

## Important security note

Transaction inclusion does not automatically mean the transaction succeeded. The ASC must inspect the transaction/receipt status and validate the expected event or fields before performing sensitive business logic.

## Questions for later research

- Exact Attestcoin SDK interfaces for proof submission.
- Supported source-chain environments for the hackathon.
- Proof Builder endpoints and expected payloads.
- ASC implementation patterns.
- Exact precompile ABI for `verify()` and `verifyAndEmit()`.
- Writability architecture and destination-chain Inbox contracts.
- Testnet deployment workflow.
