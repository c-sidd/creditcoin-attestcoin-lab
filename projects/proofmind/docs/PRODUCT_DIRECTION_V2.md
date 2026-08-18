# ProofMind V2 — Cross-Chain AI Credit & Risk Intelligence

> **Status: Design direction — implementation must not begin from this document alone.**
>
> This document supersedes the generic "AI decision engine" framing as the primary product story. Existing protocol and implementation documents remain valid unless explicitly changed here.

## 1. Product statement

**ProofMind is an Attestcoin-powered cross-chain AI credit and risk intelligence system for Creditcoin.**

It turns cryptographically verified financial facts from other chains into a structured borrower/risk profile, uses specialized AI agents to analyze that profile, runs deterministic risk and policy checks, and produces a bounded transaction intent that a Creditcoin smart contract can accept or reject.

### Short pitch

> **Verify the financial history. Understand the risk. Enforce the decision.**

## 2. Why this is stronger than a generic AI agent

The AI is not the product by itself. It is one layer in a financial decision pipeline where every layer has a different responsibility:

| Layer | Responsibility |
|---|---|
| Source chains | Hold original financial activity and state |
| Attestcoin | Cryptographically verify selected cross-chain facts |
| VerifiedFact layer | Normalize provenance and expose only verified inputs |
| AI agents | Interpret complex verified financial information |
| Risk engine | Calculate deterministic metrics and scenarios |
| Policy engine | Apply hard protocol/business constraints |
| Creditcoin contracts | Enforce the final allowed action on-chain |
| Dashboard | Explain evidence, reasoning, policy and execution |

The design intentionally avoids giving an LLM direct authority over funds.

## 3. Target problem

A lender or credit application operating on Creditcoin may need information that lives on other chains. A single Creditcoin wallet view may not capture:

- collateral held elsewhere;
- outstanding cross-chain debt;
- previous repayment behavior;
- liquidation history;
- utilization and leverage;
- concentration of positions;
- sudden changes in collateral or liabilities.

A centralized API can report these values, but the application needs a stronger trust boundary when the values influence financial decisions.

Attestcoin provides the verified cross-chain data boundary. ProofMind adds the reasoning, risk, simulation and policy layers needed to turn verified facts into an actionable credit decision.

## 4. Primary use case

### Cross-chain loan underwriting

A borrower requests a loan on Creditcoin. ProofMind obtains selected financial facts from a supported source chain, proves/validates those facts through Attestcoin Readability, constructs a verified financial profile, evaluates the profile with multiple specialized agents, runs deterministic risk calculations, and proposes a bounded loan action.

The final Creditcoin contract checks hard constraints independently before execution.

## 5. Multi-agent design

### 5.1 Financial Analyst Agent

Responsibilities:

- summarize verified assets and liabilities;
- normalize financial relationships;
- identify relevant historical signals;
- produce structured observations;
- never invent missing values.

### 5.2 Risk Agent

Responsibilities:

- interpret verified financial exposure;
- classify risk;
- identify liquidation/default indicators;
- recommend a risk category;
- provide machine-readable reason codes.

### 5.3 Fraud/Anomaly Agent

Responsibilities:

- identify unusual changes or patterns in the verified dataset;
- flag suspicious sequences for review;
- never label a user fraudulent solely from an LLM opinion;
- return anomaly indicators that can be reviewed or combined with deterministic checks.

### 5.4 Credit Agent

Responsibilities:

- convert verified facts + risk outputs into a proposed credit profile;
- recommend a bounded credit limit;
- recommend a risk tier;
- produce structured reasons.

### 5.5 Policy Agent

Responsibilities:

- translate the proposal into an execution intent;
- check application policy before contract submission;
- never replace the on-chain policy contract;
- reject unsupported actions.

The agents can initially run sequentially for reliability. Parallel execution can be introduced later if the data dependencies allow it.

## 6. Deterministic risk engine

AI must not be the only source of a financial metric. The project should calculate deterministic metrics where possible, for example:

- collateral ratio;
- debt-to-collateral ratio;
- utilization;
- concentration;
- exposure by chain;
- historical liquidation count;
- repayment ratio;
- scenario health factor.

The exact formulas and thresholds are **Project Design**, not Creditcoin protocol facts, and must be documented before implementation.

## 7. Scenario / simulation engine

Before producing an execution intent, ProofMind can evaluate controlled scenarios such as:

- collateral value decreases by 10%, 20%, or 30%;
- debt increases by a defined amount;
- a collateral source becomes unavailable;
- a concentration threshold is exceeded.

The simulation output should be structured and reproducible. It should not claim to predict the future; it evaluates explicit hypothetical inputs against documented formulas/policies.

## 8. AI + deterministic controls

The system follows this rule:

```text
Verified facts
     ↓
Deterministic normalization
     ↓
Specialized AI analysis
     ↓
Deterministic risk calculations
     ↓
Scenario simulation
     ↓
Policy validation
     ↓
Bounded transaction intent
     ↓
Creditcoin contract
     ↓
On-chain enforcement
```

An AI response alone can never authorize an unrestricted transaction.

## 9. Example output

Illustrative project-design output only:

```json
{
  "decision": "APPROVE_WITH_LIMIT",
  "riskLevel": "LOW",
  "riskScore": 23,
  "recommendedCreditLimit": "5000",
  "currency": "USDC",
  "reasonCodes": [
    "STRONG_REPAYMENT_HISTORY",
    "NO_LIQUIDATION_HISTORY",
    "MODERATE_UTILIZATION"
  ],
  "scenario": {
    "collateralDropPercent": 30,
    "result": "REVIEW"
  },
  "evidenceIds": ["ev_001", "ev_002"],
  "modelVersion": "proofmind-multi-agent-v2"
}
```

The values above are examples, not protocol requirements and not a claim about any real borrower.

## 10. Security boundary

- Attestcoin verification establishes provenance; AI does not.
- AI output is untrusted input until schema validation and policy checks succeed.
- Deterministic policy is enforced again in the smart contract.
- Contract actions are allowlisted.
- Amounts are bounded.
- Intents expire.
- Evidence IDs must reference verified facts.
- Replay protection is mandatory.
- Provider failure or malformed model output results in no execution.

## 11. MVP boundary

### Must have

1. One supported source chain, initially Ethereum Sepolia.
2. One clearly defined financial event/data model.
3. Real Attestcoin Readability verification in the testnet path.
4. VerifiedFact provenance boundary.
5. Multi-agent orchestration with a mock provider for tests.
6. Deterministic risk calculations.
7. Bounded policy contract.
8. Evidence dashboard.
9. End-to-end testnet evidence.

### Should have if time permits

- scenario simulation UI;
- anomaly agent;
- richer cross-chain profile;
- multiple source-chain event types;
- live agent trace visualization.

### Explicitly out of MVP

- unrestricted autonomous fund management;
- production credit underwriting claims;
- unsupported source chains without verified protocol integration;
- an LLM deciding contract authorization by itself;
- a custom token unless required by the final design.

## 12. Hackathon positioning

The project should be presented as an **Attestcoin-native financial intelligence application**, not as "an AI chatbot on Creditcoin."

The judge should understand three statements immediately:

1. **Attestcoin answers: can we trust this cross-chain fact?**
2. **AI answers: what does this verified financial profile imply?**
3. **Creditcoin contracts answer: is the proposed action permitted, and should it execute?**

## 13. Source-of-truth classification

### Creditcoin/Attestcoin facts

Protocol behavior, chain IDs/keys, precompiles, proof flow, SDK behavior, endpoints and contract interfaces must come from the current official Creditcoin references or verified reference implementation.

### Project design

Multi-agent roles, credit-score formulas, risk thresholds, scenario formulas, API schemas and UX are ProofMind decisions and must not be described as Creditcoin protocol guarantees.

### Implementation notes

File paths, functions, environment variables, commands and test procedures belong in the implementation documentation and must be verified against the repository/code.
