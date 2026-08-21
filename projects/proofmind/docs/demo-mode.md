# ProofMind Demo / Fallback Mode

## 1. Introduction

ProofMind includes a dedicated, sandboxed Demo/Fallback mode to allow testing the entire cross-chain logic and AI decision flows without requiring live connections to public Ethereum Sepolia and Creditcoin CC3 networks, or real external API keys (OpenAI/Groq).

---

## 2. Configuration & Setup

To activate the fallback/demo mode:
1. In `projects/proofmind/.env`, set:
   ```env
   AI_PROVIDER=mock
   ```
2. Set the private keys and endpoints to local values (defaults to Hardhat localhost node).

---

## 3. Cryptographic Safeguards

Mock or simulated transaction proofs **cannot** accidentally pass validation on public networks due to:
- **On-Chain Precompile Validation**: The `ProofMindAttestcoin` contract relies on the native precompile at address `0xFD2` to verify Merkle membership of transaction logs. A simulated proof submitted to a real validator node will always revert on-chain.
- **Admin Verification Key Boundaries**: The policy decision contract `ProofMindDecision.sol` only accepts signatures signed by the authorized `aiSigner`. In demo mode, a local test key is used, which does not match the authorized signer address configured on public testnets.

---

## 4. Reset & Seed Instructions

To reset the demo database:
1. Stop the backend server.
2. Delete the SQLite database: `rm projects/proofmind/backend/tests/integration-db.sqlite` (or `proofmind.sqlite`).
3. Delete the worker jobs file: `rm projects/proofmind/proofmind_jobs.json`.
4. Restart the backend. A fresh SQLite schema will be initialized.
