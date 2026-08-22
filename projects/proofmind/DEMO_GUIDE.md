# ProofMind Operator Demo & Fallback Mode Guide

ProofMind includes a dedicated, zero-setup **Demo / Fallback Mode** that allows operators, judges, and developers to run the entire E2E cross-chain risk evaluation and decision execution flow locally—without requiring live EVM node RPC credentials, testnet faucet tokens, or paid OpenAI/Groq API keys.

---

## 1. Safety Safeguards (Separation of Concerns)

To prevent any simulated data or mock proofs from ever leaking into production channels:
- **Provider Abstraction**: All AI interactions go through the provider-agnostic `AiProvider` boundary. The production code checks for `process.env.AI_PROVIDER === "openai" \| "groq"` and explicit API keys before routing requests. If keys are missing, the system throws or defaults safely to `FakeAiProvider`.
- **UI Indicators**: The frontend Operator Dashboard renders a prominent pulsing green **Dev Mode** badge at the top header, indicating that simulated/mock actions are active.
- **Contract Mocks**: In local testing networks (Hardhat), the worker interacts with `MockBlockProver.sol` at the precompile address `0x...FD2`, leaving the production precompile unchanged.

---

## 2. Step-by-Step E2E Demo Flow

Follow these steps to run a full E2E simulation of the ProofMind cross-chain decision engine:

### Step 1: Start the Backend API Server
Launch the Express API server in simulated mode:
```bash
cd projects/proofmind/backend
npm run build
npm start
```
*Note: Since no API keys or RPC endpoints are provided, the backend automatically initializes in mock fallback mode.*

### Step 2: Start the React Dashboard
Launch the Vite development server for the Operator Dashboard:
```bash
cd projects/proofmind/dashboard
npm run dev
```
*Open `http://localhost:5173` in your browser.*

### Step 3: Connect the Operator Wallet
1. On the dashboard header, click **Connect Wallet**.
2. The mock wallet will simulate connecting to Metamask and display the address `0x7F9B18545f9DfbDC541f9DF3b6317585F849F9f`.

### Step 4: Inspect Evidence & Trigger AI decision
1. From the left panel, select any transaction from the **Evidence Lifecycle** list.
2. In the **Evidence Inspector** panel, review the discovered event logs and Merkle proof payloads.
3. Click **Evaluate AI Decision**.
4. The AI Decision Engine will evaluate the fact against risk policies and return the structured recommendation (`APPROVE` or `REJECT`), risk score, policy outcome, and the serialized transaction calldata.

### Step 5: Submit Decision On-chain
1. Review the generated transaction intent.
2. Click **Submit Transaction Intent**.
3. The dashboard will simulate transaction signing and display a mock transaction confirmation hash.

---

## 3. The Innovation Chain

ProofMind represents a major security paradigm shift for AI on-chain decision-making. The lifecycle is strictly structured:

```text
  Attestcoin Proof  →  Verified Evidence  →  AI Reasoning  →  Deterministic Policy  →  Creditcoin Execution
```

1. **Attestcoin Proof**: The worker retrieves a Merkle/continuity proof of the source transaction.
2. **Verified Evidence**: The ProofMind Attestcoin Smart Contract (ASC) verifies the proof cryptographically using the native BlockProver precompile, extracting raw event logs on-chain.
3. **AI Reasoning**: The AI Decision Service processes only verified facts (never raw unverified inputs) to analyze creditworthiness or risk scores.
4. **Deterministic Policy**: `AiRiskControls` evaluates the AI recommendation against hardcoded limit bounds and flags manual review grey zones.
5. **Creditcoin Execution**: The authorized transaction intent is ABI-encoded and submitted to the blockchain, executing the state transition.

---

## 4. 3-5 Minute Demo & Pitch Script

- **0:00 - 1:00 (The Problem & Solution)**: Explain the danger of feeding unverified data to AI agents on-chain. Pitch ProofMind's solution: bridging trustless EVM readability with LLM risk reasoning.
- **1:00 - 2:00 (Cryptographic Verification)**: Select a transaction on the Operator Dashboard. Highlight the verified Merkle roots and Attestcoin precompile verification status.
- **2:00 - 3:00 (AI Evaluation & Policy Bounds)**: Click **Evaluate AI Decision**. Walk through the structured risk score (e.g. 25/100) and show how the deterministic policy layer verifies the amount bounds.
- **3:00 - 4:00 (On-chain Intent Submission)**: Click **Submit Transaction Intent**. Show how the final decision is serialized and signed, executing the credit limits securely on-chain.

