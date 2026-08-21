# dApp Design Patterns: Readability

An overview of common design patterns for using the Attestcoin Protocol for cross-chain readability.

> **Note:** The Creditcoin documentation states that the information and code snippets are educational and should not be directly deployed in production.

## Core Pattern

Attestcoin Readability allows data from a source chain such as Ethereum to be securely moved cross-chain and verified by an Attestcoin Smart Contract (ASC) on Creditcoin.

The recommended architecture keeps source-chain logic minimal and moves most business logic to Creditcoin.

## Source Chain dApp Contract

The source-chain contract should be as minimal as possible. Its main purpose is to emit events containing the data required by the ASC.

Typical flow:

1. User calls the source-chain contract.
2. Optional source-chain business logic executes, such as burning tokens.
3. The contract emits one or more purpose-specific events.

## Attestcoin Smart Contract

The ASC provides the execution point on Creditcoin:

1. An off-chain worker listens for source-chain events.
2. The worker waits for the event's block to be attested.
3. The worker generates Merkle and continuity proofs using the Proof Builder.
4. The worker calls the ASC with proofs and encoded transaction data.
5. The ASC verifies proofs synchronously through the Block Prover Precompile.
6. The ASC immediately executes business logic, either itself or through a separate dApp contract.

## Best Practices

### Single source-chain contract

Prefer a single source-chain contract that emits all events relevant to the Attestcoin integration. This lets the worker monitor one contract address.

### Unambiguous events

Use distinct events for each cross-chain action. For example:

- `LoanInitiated`
- `LoanRepaid`
- `TokensBurnedForBridging`

### Clear event naming

Event names should communicate that the event initiates cross-chain functionality.

### Avoid common events

Do not use generic events such as a standard `Transfer` event as the trigger for cross-chain functionality. Prefer specific wrapper actions that emit purpose-specific events such as `TokensBurned`.

### Include all required data

Put every value required by the destination-side business logic into the source-chain event. For example, a token bridge event should include fields such as `from` and `value` if those are required to mint tokens on Creditcoin.

## Design Principle

**Keep source-chain logic minimal; use Attestcoin Readability to securely provision the required data; execute meaningful business logic on Creditcoin after synchronous proof verification.**
