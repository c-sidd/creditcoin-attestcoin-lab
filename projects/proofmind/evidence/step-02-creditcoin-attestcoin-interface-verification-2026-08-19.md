# Step 02 — Creditcoin / Attestcoin Interface Verification

**Status:** DOCUMENTATION VERIFIED; LIVE NETWORK VERIFICATION BLOCKED
**Date:** 2026-08-19

## Objective

Verify the protocol facts and integration boundaries that implementation may rely on, without inventing protocol behavior.

## Sources of truth

The primary source for this verification is the Creditcoin documentation supplied for this project. The repository's Attestcoin/USC examples are implementation references, not protocol authority.

## Verified protocol facts

### Attestcoin operator roles

- Attestor follows new blocks on a source chain and attests to them.
- Attestor attestation enables rapid, inexpensive readability of source-chain data.
- Attestor writability signing is described as an upcoming capability in the supplied operator guide and therefore must not be treated as available for the MVP.
- Relayer behavior is evolving and must be verified again when the implementation reaches a relayer-dependent milestone.

### Readability boundary

The supplied documentation identifies a readability flow containing:

1. Source-chain block attestation.
2. Transaction proving / proof verification for a source-chain query.

The project therefore treats **VerifiedFact** as the boundary consumed by application logic. AI agents must not consume arbitrary RPC responses as authoritative evidence.

### Environments

The supplied Creditcoin environment documentation distinguishes local/public development, public testnet, and production mainnet. Network selection is controlled by chain configuration and bootnodes.

The supplied per-chain settings identify:

- CC3 Mainnet RPC: `wss://rpc.cc3-mainnet.creditcoin.network`
- CC3 Testnet RPC: `wss://rpc.cc3-testnet.creditcoin.network`
- CC3 Testnet chain key: `3`
- Supplied testnet release image as of 2026-08-07: `3.128.0-testnet`

These values are configuration inputs, not hard-coded application constants.

### Existing repository dependencies

`package.json` currently includes:

- `@gluwa/usc-contracts`
- `@gluwa/usc-sdk`
- Hardhat
- OpenZeppelin contracts
- OpenAI SDK
- TypeScript tooling

The existence of these packages does **not** prove that the current repository has a working end-to-end Attestcoin integration. Their APIs must be exercised in a runnable environment before claiming implementation success.

## Existing source-chain interface

`SourceSignalEmitter.sol` currently emits `RiskSignalSubmitted` with:

- `signalId`
- `subject`
- `signalValue`
- `timestamp`

It also prevents duplicate signal IDs and rejects the zero address subject. This is a project-owned source-chain test fixture, not an Attestcoin protocol primitive.

## Interface rules for implementation

1. Do not invent Attestcoin contract addresses.
2. Do not hard-code environment-specific addresses.
3. Do not assume writability is available for MVP.
4. Do not treat an unverified RPC response as a VerifiedFact.
5. Keep proof generation/verification behind an adapter so protocol API changes are isolated.
6. Keep CC3 testnet configuration environment-driven.
7. Record the exact SDK/package version used by each integration milestone.
8. Capture transaction hashes and block numbers for live verification.

## Live verification status

A live RPC/Proof Builder execution could not be performed through the currently available GitHub-only repository interface. Therefore this step is **not** marked as a full live-interface PASS.

Required live checks remain:

- Connect to CC3 testnet RPC.
- Confirm chain/network identity.
- Compile the local contract fixture.
- Submit a source-chain signal.
- Observe the source event.
- Exercise the actual Attestcoin readability/proof path.
- Verify the resulting evidence against the expected source transaction/block.
- Record transaction hashes and proof metadata.

## Gate decision

**Documentation/interface boundary: PASS.**

**Live interface execution: BLOCKED pending an executable network-connected environment.**

Implementation may proceed only through adapters and local fixtures that preserve this boundary. Any milestone requiring live proof submission must remain explicitly blocked until executed.

Next: **Step 03 — Hardhat/TypeScript foundation.**
