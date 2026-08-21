# Tutorial Repository — Implementation Notes

> Source analyzed: `c-sidd/usc-testnet-bridge-examples`, a fork of the official `gluwa/usc-testnet-bridge-examples` repository.
>
> These notes extract reusable implementation patterns from the tutorial code. They do not copy the tutorial repository into this research repo.

## 1. Repository Purpose

The forked tutorial repository is a starting point for exploring Creditcoin CC3 cross-chain features through four tutorials:

1. Hello Bridge
2. Custom Contracts Bridging
3. Bridge Offchain Worker
4. Loan Flow

The README recommends Yarn and Foundry and following the tutorials in that order. fileciteturn38file0L2-L6

## 2. Useful Project Structure

The fork contains a practical separation between:

```text
contracts/
    sol/                # Solidity contracts
    abi/                # generated ABIs
bridge-offchain-worker/
    worker.ts           # event monitoring + proof submission
utils/
    index.ts            # proof generation / gas / event helpers
hello-bridge/
custom-contracts-bridging/
loan-flow/
.github/workflows/      # automated example workflows
```

The repository tree confirms the worker, contract examples, ABI files, tutorial flows, environment files, deployment docs, helper scripts, and CI workflows. fileciteturn36file0L2-L2

## 3. Dependencies and Tooling

The fork currently uses:

- `ethers` 6.x
- `@gluwa/usc-sdk` `0.18.0`
- `@gluwa/usc-contracts` `0.1.2`
- OpenZeppelin Contracts `5.4.0`
- TypeScript / TSX
- Foundry
- Yarn 1.22.x

Its scripts include readability-query submission, off-chain worker startup, loan operations, formatting, linting, typechecking, and `forge build`. fileciteturn42file0L2-L6

### Project baseline

```text
Solidity + Foundry
        +
TypeScript + ethers.js
        +
@gluwa/usc-sdk
        +
Creditcoin CC3 Testnet
```

## 4. Core Readability Worker Pattern

The tutorial worker loads environment configuration for the Proof Builder URL, source-chain contract address/key/RPC, Creditcoin ASC address/RPC, and a Creditcoin wallet private key. It validates the addresses, RPC URLs, and key before starting. fileciteturn39file0L2-L5

```text
Source Chain RPC
      ↓
Event Listener / Poller
      ↓
Relevant Event
      ↓
Transaction Hash
      ↓
Proof Builder
      ├── Merkle proof
      └── Continuity proof
      ↓
ASC on Creditcoin
      ↓
Business logic
```

## 5. Event Monitoring and Reliability

The example polls source and target chains in parallel and advances a starting block after successful polling. Its event helper uses `queryFilter`, waits and retries on errors, and keeps the same starting block on failure so events are not skipped. fileciteturn39file0L2-L5 fileciteturn40file0L2-L5

The worker also tracks processed source transaction hashes and bounds the cache size. fileciteturn39file0L2-L5

For our dApp, persistent replay protection should be stronger than an in-memory set, while the on-chain query protection remains authoritative.

## 6. Proof Generation Pattern

`generateProofFor(...)` follows this sequence:

1. Fetch the source-chain transaction by hash.
2. Confirm it is mined and has a block number.
3. Create an SDK `ProofBuilder` with the source chain `chainKey` and Proof Builder URL.
4. Create a `PrecompileChainInfoProvider` connected to Creditcoin.
5. Wait until the transaction's block is attested.
6. Request the proof from the Proof Builder.
7. Return the proof result. fileciteturn40file0L2-L5

The tutorial imports:

```ts
import { proofProvider, chainInfo } from '@gluwa/usc-sdk';
```

and uses:

```text
proofProvider.service.ProofBuilder
chainInfo.PrecompileChainInfoProvider
```

for proof generation and attestation-state access. fileciteturn40file0L2-L5

## 7. Attestation Waiting

The worker handles the asynchronous part of the pipeline by waiting for the source block to be attested before requesting the proof. The helper uses a 15-second polling interval and a 20-minute maximum wait in this example. fileciteturn40file0L2-L5

```text
Source transaction
      ↓
Wait for source block attestation
      ↓
Generate proof
      ↓
Submit ASC transaction
```

Proof verification itself is synchronous inside the Creditcoin transaction once the ASC is called.

## 8. Proof Payload Sent to ASC

The tutorial extracts:

- `chainKey`
- `headerNumber`
- `txBytes`
- `merkleProof.root`
- `merkleProof.siblings`
- `continuityProof.lowerEndpointDigest`
- `continuityProof.roots`

and supplies those values to the ASC. fileciteturn40file0L2-L5

This gives us a concrete builder-level shape for the readability proof payload.

## 9. Generic ASC Pattern

The tutorial's `USCBase` provides a reusable ASC structure. It binds to the Native Query Verifier precompile at:

```text
0x0000000000000000000000000000000000000FD2
```

and maintains a `processedQueries` mapping to prevent duplicate processing. fileciteturn46file0L2-L5

Its `execute(...)` flow is:

```text
receive proof payload
        ↓
compute queryId
        ↓
reject duplicate
        ↓
verify proof
        ↓
mark query processed
        ↓
process verified transaction
```

The function receives:

```text
action
chainKey
blockHeight
encodedTransaction
merkleRoot
siblings
lowerEndpointDigest
continuityRoots
```

and calls the native verifier synchronously. fileciteturn46file0L2-L5

## 10. Native Verifier Interface

The tutorial defines:

```solidity
struct MerkleProofEntry {
    bytes32 hash;
    bool isLeft;
}

struct MerkleProof {
    bytes32 root;
    MerkleProofEntry[] siblings;
}

struct ContinuityProof {
    bytes32 lowerEndpointDigest;
    bytes32[] roots;
}
```

The interface exposes `verifyAndEmit(...)` and `calculateTxIndex(...)` and points at `0x0FD2`. fileciteturn47file0L2-L5

## 11. Query ID and Replay Protection

The tutorial computes a deterministic query ID from the source chain key, block height, and the transaction index derived from the Merkle proof. It calls `calculateTxIndex(merkleProof)` and hashes the resulting values to make the query ID. fileciteturn46file0L2-L5

The design principle is:

```text
One verified source transaction
        ↓
Deterministic query identity
        ↓
Cannot be processed twice
```

## 12. Transaction Success and Event Validation

The tutorial's `USCMinter` shows the required post-proof validation path:

1. Decode the transaction type.
2. Require a supported transaction type.
3. Decode receipt fields.
4. Require `receiptStatus == 1`.
5. Search for the expected `TokensBurnedForBridging` event.
6. Extract the origin token, sender, and amount.
7. Require the origin token to be registered.
8. Perform the mint action only after the validations pass. fileciteturn45file0L2-L5

This maps directly to a strong ASC security pattern:

```text
Proof valid
   ↓
Receipt successful?
   ↓
Expected event exists?
   ↓
Event fields valid?
   ↓
Authorization/state checks
   ↓
Business logic
```

## 13. Event Design Pattern

The example uses the dedicated event:

```text
TokensBurnedForBridging(address,uint256)
```

and stores its Keccak-256 signature in the ASC. This matches the documentation's recommendation to use specific events for cross-chain triggers rather than generic events. fileciteturn45file0L2-L5

For our project:

- Use dedicated events for cross-chain triggers.
- Include all data that the ASC will need.
- Avoid generic events where a specific event can make the trigger unambiguous.

## 14. Gas Estimation Pattern

The tutorial first attempts provider gas estimation and adds a **35% buffer**. If estimation fails, it falls back to a calculated gas limit based on continuity-proof length. The code comments note that precompile-related estimation can fail even when execution can succeed. fileciteturn40file0L2-L5

Example fallback:

```text
21000 + continuityLength × 5000 + 20000
```

This is tutorial/example logic, not a protocol guarantee. We should prefer current testnet measurements and explicit estimation when possible.

## 15. Receipt-Based Event Parsing

The tutorial waits for the ASC transaction receipt and parses emitted logs directly rather than relying on long-lived RPC filters. This avoids filter expiration problems such as `Filter id does not exist`. fileciteturn40file0L2-L5

This is a useful reliability pattern for our own worker.

## 16. Environment and Secret Handling

The tutorial contains environment files and environment-specific automation. fileciteturn36file0L2-L2

For our own project, we should use:

```text
.env.example       # placeholders only, safe to commit
.env               # local secrets, never commit
```

and keep testnet/mainnet endpoints separate.

## 17. Reuse vs Replace

### Reuse as architectural reference

- Proof Builder integration
- `@gluwa/usc-sdk`
- ChainInfo precompile
- Generic ASC verification
- Deterministic query/replay protection
- Event-specific decoding
- Worker polling/retry model
- Receipt-based event parsing
- Gas estimation strategy

### Replace for our project

- Bridge-specific events
- Token burn/mint business logic
- `USCMinter`
- Bridge test token contracts
- Loan-specific business logic
- Tutorial-specific environment variables
- Example contract names and actions

The tutorial is implementation reference material, not the final hackathon product.

## 18. Recommended Build Architecture

```text
                 SOURCE CHAIN
                     │
             Our Source Contract
                     │
             Specific Event
                     │
                     ▼
              Readability Worker
                     │
          @gluwa/usc-sdk / Proof Builder
                     │
                     ▼
               Creditcoin ASC
                     │
            Block Prover 0x0FD2
                     │
       ┌─────────────┴─────────────┐
       │                           │
  Transaction               Application
   validation                  logic
       │                           │
       └──────────────┬────────────┘
                      ▼
             Creditcoin state
```

## 19. Immediate Development Plan

Before designing the final product, use the tutorial repo to:

1. Understand/run Hello Bridge.
2. Trace Custom Contract Bridging.
3. Study the Offchain Worker path.
4. Study Loan Flow for a richer application example.
5. Identify exactly which infrastructure is reusable.
6. Replace the bridge/loan business logic with our original hackathon problem.

This lets us retain a protocol-correct Attestcoin implementation while making the application layer original.

## Sources

- Forked repository: `https://github.com/c-sidd/usc-testnet-bridge-examples`
- Original repository: `https://github.com/gluwa/usc-testnet-bridge-examples`
