# ProofMind — Creditcoin / Attestcoin Interface Verification

**Verification date:** 2026-08-18
**Purpose:** Pre-implementation verification for ProofMind Milestone 1.

## Result

**Protocol boundary: VERIFIED for implementation planning.**

The values below were checked against the current official Creditcoin documentation, the current published `@gluwa/usc-sdk`, and the official `gluwa/usc-testnet-bridge-examples` reference implementation.

A separate live transaction test is still required before claiming end-to-end runtime success. No wallet/private key is required for this documentation/interface verification.

---

## 1. Target environment

| Item | Verified value | Evidence |
|---|---|---|
| Source chain | Ethereum Sepolia | Official Creditcoin docs + reference examples |
| Source EVM chain ID | 11155111 | Reference `.env` explicitly distinguishes chain key from Ethereum chain ID |
| Creditcoin target | CC3 Testnet | Official Creditcoin testnet docs |
| Creditcoin EVM chain ID | 102031 | Official Creditcoin testnet/endpoints docs |
| Creditcoin HTTPS RPC | `https://rpc.cc3-testnet.creditcoin.network` | Official docs + reference `.env` |
| Creditcoin WebSocket RPC | `wss://rpc.cc3-testnet.creditcoin.network` | Official docs |
| Source chain key for Sepolia on CC3 Testnet | **1** | Current official reference repository `.env` |
| SDK | `@gluwa/usc-sdk` **0.18.0** | Current npm package |

### Important correction

Earlier project notes must **not** use chain key `3` for the ProofMind Sepolia → CC3 Testnet flow.

The current official bridge-example `.env` explicitly defines:

```text
SOURCE_CHAIN_KEY=1
```

It also states that this is a USC source-chain key and is different from Ethereum's EVM chain ID.

---

## 2. Proof Builder

### Current verified endpoint

```text
https://prover.cc3-testnet.creditcoin.network
```

This endpoint is used by the current official bridge-example repository and is also the example endpoint documented by the current `@gluwa/usc-sdk` package.

### Required SDK flow

The official reference implementation uses:

```text
new proofProvider.service.ProofBuilder(chainKey, proofBuilderUrl)
        ↓
waitUntilHeightAttested(...)
        ↓
getProof(txHash)
```

The SDK's proof result exposes the fields consumed by the reference contract integration, including:

```text
chainKey
headerNumber
 txBytes
merkleProof.root
merkleProof.siblings
continuityProof.lowerEndpointDigest
continuityProof.roots
```

Do not hard-code this structure independently of the SDK. Use the SDK types and the reference implementation.

### Important correction

The previously supplied documentation contained:

```text
https://proof-gen-api.cc3-testnet.creditcoin.network/
```

The current builder-facing reference implementation and SDK use:

```text
https://prover.cc3-testnet.creditcoin.network
```

Therefore ProofMind should use the latter unless a newer official release explicitly changes it.

---

## 3. Attestation waiting

The reference worker does not immediately request a proof after observing an event.

Verified flow:

```text
source transaction
    ↓
transaction mined
    ↓
obtain source block number
    ↓
wait for block attestation
    ↓
ProofBuilder.getProof(txHash)
```

The reference implementation constructs `PrecompileChainInfoProvider` against the Creditcoin RPC and calls `getLatestAttestedHeightAndHash(chainKey)` before waiting for the proof-builder attestation cache.

The reference worker allows up to 20 minutes for the proof-builder attestation wait, polling every 15 seconds.

ProofMind may use a different timeout only as an explicit project design decision.

---

## 4. Native verifier precompile

Verified official V2 addresses:

```text
BlockProver / Native Query Verifier:
0x0000000000000000000000000000000000000FD2

ChainInfo:
0x0000000000000000000000000000000000000FD3
```

The current official migration documentation identifies `0x0FD2` as the BlockProver/Native Query Verifier and `0x0FD3` as the ChainInfo precompile.

The official V2 interface includes:

```text
verify(...)
verifyAndEmit(...)
```

with batch verification variants.

ProofMind must use the exact ABI/type definitions from the current SDK/reference implementation rather than recreating the interface from memory.

---

## 5. Verified ASC proof payload boundary

The current reference implementation calls a destination contract function with this conceptual payload:

```text
chainKey
blockHeight/headerNumber
encodedTransaction / txBytes
merkleRoot
merkleProof.siblings
continuityProof.lowerEndpointDigest
continuityProof.roots
```

The reference implementation then calls the verifier through the native precompile and only after successful verification decodes the verified transaction data.

This confirms the ProofMind trust boundary:

```text
Worker-observed event
        ≠ trusted fact

Proof payload
        ↓
Native verifier
        ↓
verified transaction
        ↓
decoder / event validation
        ↓
VerifiedFact
```

---

## 6. Reference worker behavior verified

The official example worker confirms these implementation patterns:

- `ethers.JsonRpcProvider` is used for both source and Creditcoin EVM RPCs.
- Source events are polled with `queryFilter`.
- Processed transaction hashes are tracked to prevent duplicate processing in the example.
- Proof generation is delegated to `@gluwa/usc-sdk`.
- Gas estimation is attempted before proof submission.
- The example has a fallback gas calculation because precompile simulation can cause gas-estimation failures.
- The worker submits the proof-bearing transaction to the destination contract.
- The receipt can be parsed for the destination execution event.

ProofMind should retain these protocol-specific patterns while improving persistence, restart recovery, catch-up, and idempotency for the production-quality project architecture.

---

## 7. Current Creditcoin release awareness

The current public Creditcoin3 releases show `3.130.0-testnet` as the latest listed testnet release at verification time.

ProofMind does **not** need to run its own Creditcoin node for the initial testnet MVP. It should target the public CC3 Testnet RPC and use the deployed protocol services.

Do not pin application logic to a node binary version unless the implementation actually requires it.

---

## 8. Live-service verification status

The Creditcoin testnet dashboard was reachable during verification and reported:

```text
Creditcoin USC · Oracle status
v1.0.5 · testnet
Oracle network online
```

A direct unauthenticated RPC POST/Proof Builder request could not be executed from the current analysis runtime because outbound network/DNS access from that runtime is restricted. Therefore this document intentionally does **not** claim a live `eth_chainId` or live proof-generation transaction.

That is not a protocol-interface blocker; it is an execution-environment limitation.

Before the first real E2E run, execute these runtime checks from the developer machine:

```bash
# Creditcoin chain ID
curl -s https://rpc.cc3-testnet.creditcoin.network \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Proof Builder health
curl -s https://prover.cc3-testnet.creditcoin.network/api/v1/health
```

The expected Creditcoin chain ID is:

```text
0x18e8f
```

which corresponds to decimal `102031`.

If either runtime check disagrees, stop and update the project configuration before implementation continues.

---

## 9. Milestone-1 implementation boundary

The first implementation milestone can safely proceed with these fixed facts:

```text
Source: Ethereum Sepolia
Source chain key: 1
Execution: Creditcoin CC3 Testnet
Creditcoin EVM chain ID: 102031
Creditcoin RPC: https://rpc.cc3-testnet.creditcoin.network
Proof Builder: https://prover.cc3-testnet.creditcoin.network
Native verifier: 0x...0FD2
ChainInfo: 0x...0FD3
SDK: @gluwa/usc-sdk 0.18.0
```

The remaining runtime gate is simply to execute the health/RPC checks and then perform a real Sepolia transaction during the E2E milestone.

---

## 10. Sources

- Official Creditcoin testnet/endpoints documentation
- Official Creditcoin USC V2 migration documentation
- Official `gluwa/usc-testnet-bridge-examples` reference repository
- Official `@gluwa/usc-sdk` npm package
- Current Creditcoin3 release listing

All protocol-specific implementation claims above are grounded in those sources; project-specific improvements such as durable worker state and ProofMind AI policy remain Project Design rather than Creditcoin protocol facts.
