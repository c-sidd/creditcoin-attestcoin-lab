# Terminology

| Term | Meaning in this project |
|---|---|
| Source chain | Chain where the user transaction/event originates, e.g. Ethereum Sepolia in the MVP. |
| Execution chain | Creditcoin chain where the ASC and application business logic execute. |
| Attestcoin Protocol | Creditcoin's cross-chain readability/writability infrastructure described by the official docs. |
| Attestor | Protocol operator that follows source-chain blocks and attests to them. |
| ASC | Attestcoin Smart Contract on Creditcoin that verifies supplied cross-chain proof material and executes application logic. |
| Readability | Moving verifiable source-chain data so it can be used on Creditcoin. |
| Proof Builder | Service used by the worker to obtain Merkle/continuity proof material for a query. |
| Oracle worker | ProofMind off-chain service that monitors events, waits for attestation, obtains proofs and calls the ASC. |
| Verified event | Application event whose transaction inclusion and required continuity/proof checks have been accepted by the ASC. |
| Evidence | Persisted references proving what was observed, verified, decided and executed. |
| Decision | AI/application output after reasoning over the allowed verified data. |
| Transaction intent | Structured, bounded request describing an on-chain action before contract enforcement. |
| Policy contract | Project-design contract layer that enforces authorization and business constraints; it does not replace proof verification. |

**Rule:** do not use protocol terms as if they mean project-specific components. In particular, AI reasoning is not attestation and an off-chain worker is not a protocol Attestor.
