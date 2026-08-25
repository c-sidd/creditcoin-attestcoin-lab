# 01 — Creditcoin + Attestcoin: Current Technical Reference

This folder is the **current-state technical reference** for ProofMind. It intentionally avoids legacy Creditcoin/Attestcoin patterns that are no longer part of the CC3/USC testnet workflow.

> **Source-of-truth rule:** when an old tutorial, project note, or competitor uses a legacy API, prefer the current Gluwa USC SDK/examples and the live CC3 Testnet behavior.

## 1. What Creditcoin does for ProofMind

Creditcoin is the execution environment for our on-chain financial policy and decision contracts. ProofMind is not using Creditcoin merely as an EVM deployment target: the application needs Creditcoin to receive verified cross-chain evidence and enforce the final financial policy.

For the current hackathon implementation, the important Creditcoin role is:

```text
Ethereum Sepolia / supported source chain
        |
        | transaction / event
        v
Attestation on Creditcoin
        |
        v
Proof Builder
        |
        v
Proof verification on Creditcoin
        |
        v
ProofMind decision / policy contract
        |
        v
Allowed or rejected financial action
```

## 2. What Attestcoin does

Attestcoin is the cross-chain verification layer used by Creditcoin applications. For ProofMind, its critical capability is **cross-chain readability**: a Creditcoin-side contract can verify that a source-chain transaction/event actually occurred and use the verified result as an input to business logic.

This distinction matters:

- A normal RPC/API call tells our backend what a source chain reports.
- An Attestcoin/USC proof lets the Creditcoin-side execution path verify the source-chain fact cryptographically/on-chain.
- The verified fact must affect the actual application state or execution decision, not merely appear on a dashboard.

## 3. Current CC3 Testnet facts

Verified against current Gluwa examples/repositories used by the 2026 builder ecosystem:

| Item | Current reference |
|---|---|
| Creditcoin CC3 Testnet chain ID | `102031` |
| CC3 Testnet RPC | `https://rpc.cc3-testnet.creditcoin.network` |
| Proof Builder | `https://proof-gen-api.cc3-testnet.creditcoin.network` |
| Ethereum Sepolia chain key on CC3 Testnet | `1` |
| ChainInfo precompile | `0x0000000000000000000000000000000000000fd3` |
| Block prover precompile used by current examples | `0x0000000000000000000000000000000000000FD2` |

The official USC SDK examples describe a flow in which the source transaction must be mined, its block must become attested on Creditcoin, and then the Proof Builder can return the proof payload. Ethereum/Sepolia can take several minutes to become attested; this is normal and should be reflected in our live-demo UX.

## 4. Current proof flow

The current pattern is:

1. A source-chain transaction is created.
2. The source transaction is confirmed/mined.
3. The worker identifies its block height.
4. Creditcoin attestors advance the attested source-chain height.
5. The worker waits for the required height to be available to the Proof Builder.
6. Proof Builder returns the transaction/proof material.
7. The Creditcoin-side verifier validates the proof.
8. The application checks the expected source chain, source contract, transaction success/logs, and business-specific conditions.
9. Only then does ProofMind mutate credit/financing state.

The official examples expose `ProofBuilder`, `waitUntilHeightAttested`, `getProof`, and `getLatestAttestedHeightAndHash`. The newer query-builder repository also exposes transaction-query construction and batch proof support.

## 5. What ProofMind should verify

A proof that a transaction exists is not, by itself, enough for credit underwriting. ProofMind should bind the verified transaction to the expected business meaning:

```text
Proof exists
   |
   +--> expected source chain?
   |
   +--> expected source contract?
   |
   +--> transaction succeeded?
   |
   +--> expected event emitted?
   |
   +--> expected beneficiary / counterparty?
   |
   +--> expected asset / invoice ID?
   |
   +--> expected amount / units?
   |
   +--> not already consumed?
   |
   +--> policy satisfied?
   v
EXECUTE
```

This is the security boundary that differentiates ProofMind from a frontend that merely reads a source-chain API.

## 6. Readability vs writability

For the MVP, **cross-chain readability is the priority**.

We should not add cross-chain writability simply to claim another Attestcoin feature. The first release should prove one complete, meaningful path:

> real-world/source-chain evidence → Attestcoin proof → Creditcoin verification → AI decision → deterministic policy → on-chain financial state change.

Cross-chain writability can be a later extension if it is needed for a real product flow.

## 7. Current vs legacy material

The repository previously accumulated research about older USC/Attestcoin designs. Some historical patterns are not safe to use as implementation guidance now.

### Do NOT build against these legacy patterns

- `@gluwa/creditcoin-public-prover` as the current proof architecture.
- Legacy STARK prover-contract flows.
- Legacy `ResultSegment[]` query APIs when the current SDK provides the newer query builder.
- Legacy callback patterns such as `_onQueryValidated` / `_processOracleResults` from pre-migration examples.
- Old precompile addresses from pre-2026 architecture.
- A centralized oracle/API as a substitute for Attestcoin verification.

The CrossCredit project independently documents the same migration: the early-2026 USC Testnet 2.0 migration replaced the older proving model with the native verifier. Its notes explicitly warn that many published materials still describe the old model.

## 8. Current official implementation references

- Gluwa USC Query Builder: https://github.com/gluwa/cc-next-query-builder
- Gluwa USC Testnet bridge examples: https://github.com/gluwa/usc-testnet-bridge-examples
- Creditcoin protocol: https://github.com/gluwa/creditcoin
- Creditcoin organization: https://github.com/gluwa
- Hackathon: https://buidl.creditcoin.org/

## 9. ProofMind integration target

```text
                  SOURCE CHAIN
                       |
                 InvoiceRegistry
                 / business event
                       |
                       v
              Attestcoin attestation
                       |
                       v
                  Proof Builder
                       |
                       v
             Creditcoin verifier
                       |
              verified evidence
                       |
                       v
              ProofMind Evidence
                       |
                       v
                AI Underwriter
                       |
                       v
              Deterministic Policy
                       |
                +------+------+
                |             |
              ALLOW          DENY
                |             |
                v             v
           DeFi/RWA state   no mutation
```

## 10. Non-negotiable implementation rule

**Attestcoin must sit on the execution path.**

If removing Attestcoin would leave the financial decision unchanged, our integration is too shallow.

The intended behavior is:

> **No valid Attestcoin proof → no verified evidence → no financing state change.**

## Sources

- Official BUIDL CTC track description: https://buidl.creditcoin.org/
- Gluwa `cc-next-query-builder`: https://github.com/gluwa/cc-next-query-builder
- Gluwa USC testnet examples: https://github.com/gluwa/usc-testnet-bridge-examples
- Current Creditcoin implementation: https://github.com/gluwa/creditcoin
- CrossCredit's current-state Attestcoin integration notes: https://github.com/OoJae/crosscredit/blob/main/docs/ATTESTCOIN_INTEGRATION.md
