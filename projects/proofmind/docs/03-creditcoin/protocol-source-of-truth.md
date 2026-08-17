# Creditcoin Protocol Source of Truth

## Purpose

This document tells Antigravity how to decide whether a Creditcoin-specific statement is safe to implement.

## Evidence levels

### Level A — official documentation

Use official Creditcoin documentation for protocol concepts, supported environments, roles, precompile addresses and documented flows.

### Level B — official/tutorial reference code

Use the existing tutorial/reference repository when an implementation detail such as an ABI, SDK call, encoded payload or Proof Builder request is required.

### Level C — ProofMind design

Project-specific structures such as `VerifiedFact`, AI proposal schemas, evidence records and dashboard status are our design, not protocol guarantees.

### Level D — assumption

Anything not confirmed by A–C is an unresolved assumption. It must not be hard-coded as if it were confirmed.

## Implementation gate

Before writing protocol integration code, answer:

- Which chain/environment is being used?
- What is the exact chain key?
- What source-chain contract/address is monitored?
- What exact event is the trigger?
- What is the current documented attestation condition?
- What exact Proof Builder request/response does the reference code use?
- What exact ASC function/ABI receives the proof payload?
- What exact verifier precompile call is used?
- How is verified transaction/event data decoded?

If any answer is unknown, inspect the repository reference implementation first.
