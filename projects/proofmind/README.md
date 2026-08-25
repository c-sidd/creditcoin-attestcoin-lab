# ProofMind — Proof-Carrying Autonomous Finance

> **AI reasons. Attestcoin proves. Smart contracts enforce.**

ProofMind is building a trust layer for autonomous financial decisions on Creditcoin. The first application is verified RWA/credit underwriting: source-chain financial evidence is verified through Attestcoin, an optional AI underwriter proposes a structured decision, and deterministic Creditcoin policy contracts decide whether the financial action can execute.

## 🎯 Current product thesis

```text
Real-world financial obligation
            ↓
       RWA evidence
            ↓
   Attestcoin / USC proof
            ↓
      Verified facts
            ↓
     AI underwriting
            ↓
  Proof-carrying decision
            ↓
  Deterministic policy
            ↓
    Creditcoin execution
```

The AI is **not** the final authority. The protocol must remain safe when the AI is wrong, unavailable, manipulated, or replaced.

---

# 📚 Project Knowledge Base

These folders are the current high-level source of truth for the project strategy. Older exploratory notes may remain elsewhere in the repository for historical context, but new implementation decisions should follow these documents.

| Folder | Purpose |
|---|---|
| [`01-creditcoin-attestcoin`](./01-creditcoin-attestcoin/) | Current Creditcoin/Attestcoin architecture, proof flow, CC3 facts, current vs legacy APIs |
| [`02-problem-solution`](./02-problem-solution/) | Real-world problem, RWA + AI + DeFi solution, product thesis and MVP boundaries |
| [`03-youtube-discussion`](./03-youtube-discussion/) | Kickoff/AMA discussion, official event facts, demo implications and source links |
| [`04-judging-criteria`](./04-judging-criteria/) | Judge readiness, official track alignment, internal scorecard and evidence checklist |
| [`05-competitor-analysis`](./05-competitor-analysis/) | Detailed benchmark of the 13 supplied hackathon projects and ProofMind differentiation |
| [`06-ai-provider-and-budget`](./06-ai-provider-and-budget/) | Mock/Groq/OpenAI provider strategy and strict $30 budget optimization |

## Important links

### Official

- BUIDL CTC 2026 Fall: https://buidl.creditcoin.org/
- Kickoff AMA: https://www.youtube.com/watch?v=HPL6LjTqQm4
- Attestcoin: https://attestcoin.org/
- Creditcoin documentation: https://docs.creditcoin.org/
- Creditcoin source: https://github.com/gluwa/creditcoin
- USC Query Builder: https://github.com/gluwa/cc-next-query-builder
- USC Testnet examples: https://github.com/gluwa/usc-testnet-bridge-examples

### ProofMind

- Repository: https://github.com/c-sidd/creditcoin-attestcoin-lab
- Project: https://github.com/c-sidd/creditcoin-attestcoin-lab/tree/main/projects/proofmind

### Benchmark projects

- Web3 Analysis Dashboard: https://github.com/Faathirazukhruf/Web3-Analysis-Dashboard
- Spark: https://github.com/thesithunyein/spark
- AttestDesk: https://github.com/Qidianyan/attestdesk
- BountyOps Verified Execution: https://github.com/MathieuDWeill/bountyops-verified-execution
- AttestGuard: https://github.com/rudimentall1/AttestGuard
- BorrowIQ: https://github.com/Clean-earthw/borrowiq
- VeriSettle: https://github.com/anhquan075/verisettle
- index41: https://github.com/edycutjong/index41
- Oracle-Free Council: https://github.com/icohangar-ops/oracle-free-council
- CrossCredit: https://github.com/OoJae/crosscredit
- MoonCreditFi: https://github.com/Zakariasisu5/Mooncreditfi
- ProofYield: https://github.com/darkty0x/proofyield
- SnakeAI: https://github.com/snake-ai-agent/SnakeAI

---

# 🧠 AI is optional by design

The project must work without an LLM key.

```text
                 Underwriter interface
                         │
             ┌───────────┼───────────┐
             │           │           │
           Mock         Groq       OpenAI
          default     development  optional
          $0            low-cost    capped
```

- **Mock**: tests, CI, deterministic demos, offline development.
- **Groq**: default real-model development path.
- **OpenAI**: optional adapter for final quality/demo work only.

No AI provider is allowed to bypass deterministic policy enforcement.

---

# 🏗️ System components

1. **Contracts (`/contracts`)** — source signal/evidence contracts and Creditcoin-side verification/policy logic.
2. **Worker (`/worker`)** — source-event polling, attestation waiting, proof retrieval, proof submission and persistence.
3. **Backend (`/backend`)** — evidence normalization, AI provider adapters, schema validation and policy preparation.
4. **Dashboard (`/dashboard`)** — evidence inspection, decision display, execution state and demo controls.

---

# 🧪 Development modes

## Deterministic local mode

No blockchain keys or AI keys required for core tests.

```bash
cd projects/proofmind
npm install
npm run build
npm run test
```

## Live testnet mode

The final target is:

```text
Ethereum Sepolia
      ↓
source event
      ↓
Attestcoin attestation
      ↓
Proof Builder
      ↓
Creditcoin CC3 verifier
      ↓
ProofMind policy
      ↓
financial execution / rejection
```

Live deployment addresses and transaction hashes must be recorded only after they are actually verified.

---

# 🔐 Security principle

The most important negative test is:

```text
AI: "Approve $40,000"

Verified policy maximum: $10,000

→ Creditcoin contract rejects the action.
→ No financial state changes.
```

Other required negative paths include tampered proof, wrong source chain, wrong source contract, failed source receipt, replayed evidence and malformed AI output.

---

# 🚫 Current scope exclusions

For the hackathon MVP, do not spend engineering time on:

- cross-chain writability unless it becomes necessary;
- DePIN or gaming features;
- a generic AI chatbot;
- unrestricted autonomous trading;
- a production legal invoice marketplace;
- multiple expensive LLM providers;
- legacy USC/STARK prover architecture;
- duplicated research documentation.

---

# 📦 Documentation / deployment

- [`DEMO_GUIDE.md`](./DEMO_GUIDE.md) — demo sequence.
- [`DEPLOYMENT_RUNBOOK.md`](./DEPLOYMENT_RUNBOOK.md) — deployment procedure.
- [`DEPLOYMENT_MANIFEST.md`](./DEPLOYMENT_MANIFEST.md) — real deployment evidence; do not populate placeholders as if they were live.
- [`FINAL_COMPLETION_REPORT.md`](./FINAL_COMPLETION_REPORT.md) — historical completion record; update it only when the corresponding claims are verified.

---

# 🏆 Target judge story

> **Real-world financial evidence is difficult to verify, AI decisions are probabilistic, and on-chain money movement must be deterministic. ProofMind connects these layers: Attestcoin proves the evidence, AI evaluates it, and Creditcoin policy contracts enforce what can actually happen.**
