# Attestcoin Protocol Chains & Environments

> Based on the Creditcoin Attestcoin Protocol documentation. Educational research notes; verify current endpoints and deployment details before using them in an application.

## 1. Overview

The Attestcoin Protocol supports different Creditcoin environments for cross-chain readability flows. The main environments documented here are:

- **CC3 Mainnet** — production environment.
- **CC3 Testnet** — testing and development environment.

Each environment provides infrastructure for Attestcoin Smart Contracts (ASC), proof generation, transaction decoding, and source-chain information.

## 2. CC3 Mainnet

### ASC Dashboard

```text
https://dashboard.cc3-mainnet-usc.creditcoin.network/
```

The ASC Dashboard is used for Attestcoin Protocol-related mainnet operations and visibility.

### Proof Builder API

```text
https://proofbuilder.cc3-mainnet-usc.creditcoin.network/
```

The Proof Builder service generates the proofs required by readability queries, including Merkle and continuity proofs.

The documentation notes that the mainnet Swagger interface should be accessed through the testnet version.

### Decoder Contract

```text
0x9D094C9f22B10FCf842c2fC6A0981630A4F94B5C
```

The decoder contract is deployed on CC3 Mainnet and is used for transaction-data decoding within the Attestcoin Protocol infrastructure.

### ChainInfo Precompile

```text
0x0000000000000000000000000000000000000fd3
```

### BlockProver Precompile

```text
0x0000000000000000000000000000000000000FD2
```

The BlockProver precompile is the on-chain component responsible for cryptographic verification of readability proofs.

### SDK

The documentation references the npm package:

```text
@gluwa/usc-sdk
```

## 3. CC3 Mainnet Supported Chains

| Source chain | Chain key | Genesis block |
|---|---:|---:|
| Ethereum Mainnet | `1` | `0` |

The chain key identifies the source blockchain when constructing Attestcoin Protocol readability queries.

## 4. CC3 Testnet

### ASC Dashboard

```text
https://dashboard.cc3-testnet.creditcoin.network/
```

### Proof Builder API

```text
https://proof-gen-api.cc3-testnet.creditcoin.network/
```

The testnet Proof Builder API is also the documented environment to use when exploring the Swagger interface.

### Decoder Contract

```text
0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f
```

### ChainInfo Precompile

```text
0x0000000000000000000000000000000000000fd3
```

### BlockProver Precompile

```text
0x0000000000000000000000000000000000000FD2
```

### SDK

The same SDK package is documented for the testnet environment:

```text
@gluwa/usc-sdk
```

## 5. CC3 Testnet Supported Chains

| Source chain | Chain key | Genesis block |
|---|---:|---:|
| Ethereum Sepolia | `1` | `0` |
| Ethereum Mainnet | `3` | `0` |

The chain key is an Attestcoin Protocol identifier and should not automatically be confused with the native EVM chain ID. Always use the chain key expected by the relevant Attestcoin API or SDK.

## 6. Environment Comparison

| Component | CC3 Mainnet | CC3 Testnet |
|---|---|---|
| ASC Dashboard | `dashboard.cc3-mainnet-usc.creditcoin.network` | `dashboard.cc3-testnet.creditcoin.network` |
| Proof Builder | `proofbuilder.cc3-mainnet-usc.creditcoin.network` | `proof-gen-api.cc3-testnet.creditcoin.network` |
| Decoder contract | `0x9D094C9f22B10FCf842c2fC6A0981630A4F94B5C` | `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f` |
| ChainInfo Precompile | `0x...0fd3` | `0x...0fd3` |
| BlockProver Precompile | `0x...0FD2` | `0x...0FD2` |
| SDK | `@gluwa/usc-sdk` | `@gluwa/usc-sdk` |

## 7. How This Fits Into Readability

The environment-specific infrastructure fits into the transaction proving flow described in the Readability documentation:

```text
Source Chain
     │
     │ transaction + event
     ▼
Readability Worker
     │
     │ chainKey + block + tx hash
     ▼
Proof Builder API
     │
     ├── Merkle proof
     └── Continuity proof
     │
     ▼
ASC on Creditcoin
     │
     ▼
BlockProver Precompile
     │
     ▼
Verified source-chain transaction
```

The worker and Proof Builder interact with the appropriate environment, while the ASC uses the corresponding Creditcoin infrastructure.

## 8. Development Recommendation

For development and experimentation, use **CC3 Testnet** first:

1. Deploy or use a test source-chain contract.
2. Emit a test event on a supported source chain.
3. Configure the worker with the testnet chain key and endpoints.
4. Wait for the source-chain block to become attested.
5. Generate Merkle and continuity proofs through the testnet Proof Builder.
6. Submit the proofs to an ASC on CC3 Testnet.
7. Verify the result through the BlockProver precompile.

Move to CC3 Mainnet only after the complete flow has been tested successfully.

## 9. Important Notes

- **Do not assume mainnet and testnet addresses are interchangeable.** The decoder contract differs between environments.
- **The BlockProver and ChainInfo precompile addresses are documented as the same across these environments.**
- **Chain keys are protocol-specific identifiers.** Use the value expected by Attestcoin rather than assuming it equals the source chain's native network ID.
- **Endpoints can change.** Treat the official Creditcoin documentation as the source of truth for current infrastructure URLs.
- **SDK versions can change.** Check the npm package metadata before installing or pinning a version.

## 10. Environment Checklist

### CC3 Testnet

- [ ] Correct testnet ASC Dashboard configured.
- [ ] Testnet Proof Builder endpoint configured.
- [ ] Testnet decoder contract configured.
- [ ] Correct source-chain chain key configured.
- [ ] BlockProver precompile address configured.
- [ ] Test transaction successfully proven.

### CC3 Mainnet

- [ ] Correct mainnet ASC Dashboard configured.
- [ ] Mainnet Proof Builder endpoint configured.
- [ ] Mainnet decoder contract configured.
- [ ] Correct source-chain chain key configured.
- [ ] BlockProver precompile address configured.
- [ ] Production transaction flow tested and reviewed.

## Source

Creditcoin Docs — Attestcoin Protocol Chains - Environments.
