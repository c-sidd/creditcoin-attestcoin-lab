# Step 02 — Creditcoin / Attestcoin Interface Verification

## Status

**PARTIAL / BLOCKED FOR LIVE EXECUTION**

## Purpose

Verify the protocol-facing assumptions needed before implementing the first real Attestcoin integration.

## Source-of-truth rules

1. Creditcoin documentation is authoritative for protocol behavior.
2. Project design must not be presented as Creditcoin protocol behavior.
3. A live integration is not marked PASS until the required command/network interaction has actually been executed.
4. No invented SDK method, contract address, RPC capability, proof format, or precompile interface is allowed.

## Verified from project documentation

- The project is intended to use Attestcoin for verified cross-chain data.
- The source-chain financial event contract is a project test fixture, not an Attestcoin primitive.
- Verified facts are the boundary between cross-chain evidence and downstream risk/AI processing.
- The implementation must preserve evidence and provenance through the pipeline.

## Required live checks

The following must be executed in an environment with the repository dependencies and appropriate network access:

- install/resolve the exact USC/Attestcoin SDK dependency used by this repository;
- compile the existing contracts;
- run the existing contract tests;
- inspect the actual SDK exports and examples;
- identify the exact supported Attestcoin proof-building/submission APIs;
- verify the configured Creditcoin CC3 testnet RPC;
- deploy or connect to the project contracts on the intended test network;
- execute one source event → attestation/proof → Creditcoin verification path;
- record transaction hashes, contract addresses and command output as evidence.

## Current blocker

The GitHub repository API available to this workflow can inspect and modify repository files, but it does not provide a local Node/Hardhat runtime or a wallet/signing environment. Therefore the live interface checks above must not be fabricated or marked PASS.

## Implementation consequence

Continue building provider interfaces, domain models, validation, tests and deterministic components without hard-coding unverified protocol behavior. The real Attestcoin adapter must remain behind a clearly defined integration boundary until the live SDK/network verification is executable.

## Exit criteria

Step 02 becomes **PASS** only when the live checks above have been executed and evidence is committed under `projects/proofmind/evidence/`.
