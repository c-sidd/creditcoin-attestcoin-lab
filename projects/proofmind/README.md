# ProofMind — Autonomous Credit Risk & Cross-Chain Decision Engine

ProofMind is a state-of-the-art autonomous credit risk and decision execution platform built on Gluwa's Creditcoin network. It trustlessly reads signals from EVM source chains (e.g. Ethereum Sepolia) via Attestcoin, evaluates the data using a provider-agnostic AI decision engine, and executes policy-compliant risk outcomes (approved credit limits, blocking) securely on-chain.

---

## 1. System Architecture

ProofMind consists of four primary components:
1. **Smart Contracts (`/contracts`)**: Solidity smart contracts implementing signal emitters, Merkle/continuity precompile verification (ASC), and credit limit policy decisions.
2. **Off-Chain Worker (`/worker`)**: A TypeScript daemon that polls for signals, waits for block attestation, fetches readability proofs from the Proof Builder, and submits them to the ASC.
3. **Backend API (`/backend`)**: An Express server encapsulating input validation, provider-agnostic AI adapters (OpenAI / Groq), and deterministic risk policy controls.
4. **Operator Dashboard (`/dashboard`)**: A React/Vite web application providing real-time evidence inspection, visual Merkle path inspection, wallet signing simulation, and trigger actions.

---

## 2. Master Document Index

Detailed spec sheets, guides, and reports are located across the repository:

- **Deployment Details**: See [DEPLOYMENT_MANIFEST.md](file:///d:/korea/creditcoin-attestcoin-lab/projects/proofmind/DEPLOYMENT_MANIFEST.md) for network parameters, deployment transaction hashes, and constructor details.
- **E2E Simulation & Pitch**: See [DEMO_GUIDE.md](file:///d:/korea/creditcoin-attestcoin-lab/projects/proofmind/DEMO_GUIDE.md) for the 3-5 minute presentation script and steps for running the simulated demo.
- **Off-chain Worker Specification**: See [worker/README.md](file:///d:/korea/creditcoin-attestcoin-lab/projects/proofmind/worker/README.md) for daemon lifecycles, configuration environments, and persistent states.
- **AI Decision Pipeline & Schemas**: See [backend/src/ai/README.md](file:///d:/korea/creditcoin-attestcoin-lab/projects/proofmind/backend/src/ai/README.md) for input/output JSON schemas and risk controls.
- **Gas & Cost Analysis**: See [docs/gas-analysis.md](file:///d:/korea/creditcoin-attestcoin-lab/docs/gas-analysis.md) for local gas measurements of smart contract invocations.
- **Security Audit Report**: See [docs/security-audit.md](file:///d:/korea/creditcoin-attestcoin-lab/docs/security-audit.md) for threat models, access controls, and severity classifications.

---

## 3. Quick Start (Simulated Mode)

To run the entire system in simulated mock mode locally (no EVM nodes or LLM API keys required):

```bash
# 1. Install workspace dependencies
cd projects/proofmind
npm install

# 2. Build all workspaces
npm run build

# 3. Start the Backend API (runs on port 3001)
cd backend && npm start

# 4. Start the Dashboard (runs on port 5173)
cd ../dashboard && npm run dev
```

---

## 4. Test Suite Execution

ProofMind is backed by a 100% passing test matrix (83 total assertions) covering all boundaries:

```bash
cd projects/proofmind
npm run test
```
This runs:
- Smart contract unit & E2E integration tests in Hardhat.
- Worker event polling, block waiting, proof validation, and submission tests.
- Backend API endpoints, input validators, AI risk limits, and intent serialization tests.
