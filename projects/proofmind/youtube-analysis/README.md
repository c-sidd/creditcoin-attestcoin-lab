# BUIDL CTC 2026 Fall — YouTube / Judge Analysis

> **Purpose:** This folder is the internal source-of-truth for how ProofMind should be designed, documented, demonstrated, and submitted for **BUIDL CTC 2026 Fall**.
>
> The primary source analysed here is the official kickoff AMA transcript supplied to the team. Current public hackathon details are cross-checked against the official BUIDL CTC website where appropriate.

---

## 1. Primary Sources

### Official kickoff AMA

**BUIDL CTC 2026 Fall Kickoff AMA | Attestcoin, Creditcoin Ecosystem, CEIP Fast Track**

- YouTube: https://www.youtube.com/watch?v=HPL6LjTqQm4
- Important chapters from the AMA:
  - `00:48` — Season 2 overview
  - `01:41` — Five tracks
  - `01:55` — Prizes and CertiK perks
  - `02:42` — Key dates
  - `03:02` — Creditcoin chain overview
  - `03:53` — Live ecosystem
  - `04:57` — Real users and fiat rails
  - `05:22` — Launch machine
  - `06:03` — Track-by-track head start
  - `07:02` — Attestcoin protocol
  - `10:52` — Readability and writability
  - `12:27` — ATC token and fees
  - `14:09` — Documentation, examples, faucet
  - `15:39` — CEIP Fast Track
  - `16:34` — Five evaluation pillars
  - `18:23` — Q&A
  - `22:36` — Submission reminders

### Official hackathon

- https://buidl.creditcoin.org/
- Submission platform referenced in the AMA: https://dorahacks.io/hackathon/buidl-ctc-2026-fall/buidl

### Official Attestcoin site

- https://attestcoin.org/

### Creditcoin documentation

- https://docs.creditcoin.org/

---

# 2. Executive Summary — What Judges Need to See

The single most important conclusion from the AMA is:

> **Attestcoin must be a core, meaningful feature of the product — not a decorative integration. The implementation must work on testnet and be technically documented.**

The organizers explicitly stated that teams should avoid adding Attestcoin merely for the sake of mentioning it. The integration needs to be central to the solution and demonstrated as a working testnet build.

The AMA also states that the project must be open source and that teams are encouraged to build transparently rather than dropping the entire project in one final commit.

The official hackathon website currently describes the AI track around **AI agents, on-chain decisioning, and verified cross-chain data**, which aligns directly with ProofMind's intended direction.

### Our strategic objective

ProofMind should therefore demonstrate this chain of value:

```text
Cross-chain event
      ↓
Attestcoin verification
      ↓
Verified evidence
      ↓
AI financial reasoning
      ↓
Proof-carrying decision
      ↓
Deterministic policy validation
      ↓
On-chain execution / rejection
      ↓
Auditable result
```

The judge should be able to answer **yes** to all of these questions:

- Is Attestcoin genuinely necessary to the product?
- Does a real cross-chain fact affect the product's business logic?
- Does the AI do something meaningful with the verified fact?
- Is the financial decision constrained by deterministic rules?
- Can we demonstrate the system working on testnet?
- Can a judge inspect the evidence and transaction path?
- Is there a clear user and market problem?
- Does the project create value for the Creditcoin ecosystem?
- Is there a credible path beyond the hackathon?
- Is the repository open, understandable, and transparently developed?

---

# 3. Official Season Requirements

## 3.1 Attestcoin is mandatory

The kickoff AMA states that **every participating team is required to use the Attestcoin protocol as a core feature**.

It is not sufficient to:

- mention Attestcoin in the README;
- put an Attestcoin logo on the UI;
- make a superficial API call;
- use Attestcoin only in a side demo;
- describe a future integration without working code.

The expected standard is:

```text
Attestcoin
   ↓
core application input
   ↓
application logic
   ↓
observable outcome
```

For ProofMind, the cleanest implementation is:

```text
Ethereum Sepolia event
        ↓
Attestcoin readability proof
        ↓
Creditcoin verification
        ↓
Verified financial signal
        ↓
AI risk evaluation
        ↓
Credit policy decision
```

This makes Attestcoin impossible to remove without breaking the core product.

---

## 3.2 Working testnet solution

The AMA states that teams should build the Attestcoin-powered solution on testnet as a working solution.

The transcript identifies **Ethereum Sepolia** as a supported testnet environment and references Creditcoin's environment documentation for the current chain configuration.

ProofMind must therefore provide:

- deployed contracts;
- testnet transaction hashes;
- source-chain event examples;
- proof generation;
- proof verification;
- resulting decision;
- final transaction or explicit rejection;
- reproducible steps for a judge.

A judge should not have to trust screenshots alone.

---

## 3.3 Newly built during the hackathon

The kickoff AMA states that projects need to be newly built during the hackathon period and deployed to testnet.

**Action for ProofMind:** preserve a visible development history and avoid presenting the project as an old finished product repackaged for the event.

---

## 3.4 Open source

The Q&A explicitly confirms that the code base needs to be open source.

The organizers also asked participants to work transparently and specifically discouraged submitting the entire solution as a single last-minute commit.

### Repository strategy

ProofMind should maintain meaningful commits such as:

```text
feat(attestcoin): add source-chain signal emitter
feat(worker): add readability proof polling
feat(contracts): verify cross-chain evidence
feat(ai): add evidence-aware risk engine
feat(policy): add deterministic credit limits
feat(ui): add evidence graph
feat(demo): add adversarial decision test
```

Avoid a history dominated by:

```text
final
final2
final-final
hackathon-final
please-work
```

---

# 4. Tracks

The season has five tracks:

1. **DeFi**
2. **RWA**
3. **DePIN**
4. **Gaming**
5. **AI**

The official website currently describes the AI track using:

- AI Agents
- Onchain Decisioning
- Verified Data

That is an unusually strong fit for ProofMind.

## Recommended primary track

# AI

### Why

ProofMind is not merely using an LLM as a chatbot. Its AI consumes cryptographically verified cross-chain evidence and produces a financial decision that is constrained and enforced on-chain.

### Secondary positioning

ProofMind also naturally touches:

- **DeFi** — credit / lending / financial execution;
- **RWA** — if the first application uses verified invoices or other real-world obligations.

Do **not** force DePIN or Gaming into the product merely to claim additional tracks.

---

# 5. Official Track Positioning vs ProofMind

## AI

Official direction:

> AI agents + on-chain decisioning + verified cross-chain data.

ProofMind:

```text
Verified cross-chain data
          ↓
AI risk agents
          ↓
Financial decision
          ↓
On-chain policy enforcement
```

**Fit: EXTREMELY HIGH**

## DeFi

Official direction includes practical financial applications such as lending, trading, liquidity, and yield.

ProofMind's credit application can provide:

```text
verified borrower evidence
        ↓
credit decision
        ↓
credit limit
        ↓
policy-controlled execution
```

**Fit: HIGH**

## RWA

Official direction includes tokenization, treasury, stablecoins, real estate, commodities, and bridging off-chain value with on-chain transparency.

Potential ProofMind extension:

```text
invoice / obligation
        ↓
verified evidence
        ↓
AI underwriting
        ↓
financing decision
```

**Fit: HIGH if implemented, not something to fake for the track.**

## DePIN

The season connects DePIN with cross-chain data and Attestcoin.

ProofMind does not need DePIN for its core thesis.

**Fit: LOW — do not force it.**

## Gaming

Not relevant to the current ProofMind product.

**Fit: NONE — do not force it.**

---

# 6. Prize and Ecosystem Information

The kickoff AMA states:

| Placement | Cash prize |
|---|---:|
| 1st | $10,000 |
| 2nd | $3,000 |
| 3rd | $2,000 |
| **Total** | **$15,000** |

The AMA also states that winning teams receive CertiK-related perks, including:

- 8,000 credits toward a CertiK repository audit;
- three months of Skynet Boost.

The top three teams also receive access to the **CEIP Fast Track** opportunity.

The official hackathon website confirms the $15,000 prize pool and the September 6, 2026 submission deadline.

---

# 7. Important Dates

According to the kickoff AMA and official hackathon site:

| Event | Date |
|---|---|
| Submissions open | August 13, 2026 |
| Final submission | **September 6, 2026 — 11:59 PM ET** |
| Winner announcement | **September 18, 2026** |
| CTC Ignition | September 28, 2026 — Seoul |

### Internal rule

Do not target September 6 as our engineering deadline.

Target:

```text
T-7 days → feature freeze
T-5 days → security / integration freeze
T-3 days → final testnet run
T-2 days → demo recording
T-1 day  → submission validation
T-0      → submit with buffer
```

---

# 8. The Five Judge / CEIP Evaluation Pillars

This is the most important section for project strategy.

The AMA explicitly says the five pillars are used not only for CEIP but also for the hackathon.

## Pillar 1 — User Base Expansion

### What they are looking for

Projects that can bring new users into the Creditcoin ecosystem.

### What ProofMind must prove

We need to answer:

> **Who uses ProofMind, and why does using it introduce or deepen Creditcoin usage?**

Potential users:

- lenders;
- borrowers;
- fintech platforms;
- credit underwriters;
- autonomous financial agents;
- RWA financing platforms;
- DeFi protocols requiring verified cross-chain risk signals.

### Evidence we should show

```text
User
 ↓
ProofMind
 ↓
Creditcoin
 ↓
Attestcoin
 ↓
Cross-chain data
 ↓
Financial action
```

The product should not feel like a standalone AI demo that happens to deploy one contract on Creditcoin.

### Judge-facing statement

> ProofMind turns Creditcoin into the execution and verification layer for autonomous financial agents that need trusted cross-chain evidence.

---

# 9. Pillar 2 — Technical Alignment

### What they are looking for

Projects that fully use Creditcoin's technical capabilities and create value for users.

### ProofMind must demonstrate

- Creditcoin EVM deployment;
- Attestcoin readability;
- source-chain event monitoring;
- proof retrieval;
- on-chain verification;
- smart-contract business logic based on verified evidence;
- testnet execution;
- useful integration rather than a superficial SDK call.

### Strong architecture

```text
Ethereum Sepolia
      │
      │ event
      ▼
Attestcoin
      │
      │ proof
      ▼
Creditcoin verification
      │
      ▼
ProofMind evidence layer
      │
      ▼
AI decision engine
      │
      ▼
Creditcoin policy contract
      │
      ├── APPROVE
      └── REJECT
```

### Weak architecture to avoid

```text
AI chatbot
   ↓
random Attestcoin call
   ↓
centralized database
   ↓
marketing dashboard
```

If Attestcoin is removed and the product still works exactly the same, the integration is probably too weak.

---

# 10. Pillar 3 — Product Vision

### What they are looking for

- innovative edge;
- long-term vision;
- roadmap.

### ProofMind's product thesis

## Proof-Carrying Autonomous Finance

AI should not need to be trusted simply because it produced a confident answer.

Instead:

```text
AI says:
"Approve $5,000"

Attestcoin proves:
"These underlying events are real."

Policy contract verifies:
"This decision is allowed."

Blockchain executes:
"Approved."
```

### Long-term vision

ProofMind should become a general trust and policy layer for autonomous financial agents.

First application:

> **Autonomous credit underwriting.**

Future applications:

- autonomous treasury;
- autonomous payments;
- invoice financing;
- insurance claims;
- procurement;
- risk monitoring;
- autonomous trading with deterministic limits.

### Core primitive

A **proof-carrying financial action** should contain:

```text
ACTION
+ EVIDENCE
+ POLICY
+ AGENT IDENTITY
+ DECISION HASH
+ TIMESTAMP / NONCE
```

---

# 11. Pillar 4 — Execution Capability

### What they are looking for

The ability of the team to actually execute the project and move it forward.

### Repository evidence

We should make execution obvious through:

- clean repository structure;
- meaningful commit history;
- test coverage;
- deployment records;
- reproducible setup;
- architecture documentation;
- security documentation;
- demo instructions;
- working testnet contracts;
- known limitations;
- roadmap.

### Technical execution checklist

- [ ] Contracts compile.
- [ ] Contracts have unit tests.
- [ ] Attestcoin proof verification works.
- [ ] Worker can retrieve proofs.
- [ ] Backend validates AI output.
- [ ] AI cannot bypass deterministic policy.
- [ ] Dashboard displays evidence.
- [ ] Testnet transactions are reproducible.
- [ ] Error paths are tested.
- [ ] Replay protection is tested.
- [ ] Invalid evidence is rejected.
- [ ] Excessive credit amount is rejected.

---

# 12. Pillar 5 — Market and Technical Relevance

### What they are looking for

Products aligned with current market trends and evolving technical standards, with the potential to attract users beyond the Creditcoin ecosystem.

### Why ProofMind is relevant

The convergence is:

```text
AI Agents
    +
On-chain finance
    +
Cross-chain data
    +
RWA
    +
Autonomous execution
    +
Security / policy enforcement
```

The important market problem is not:

> "Can an LLM approve a loan?"

It is:

> **"How do we safely give autonomous software permission to move financial value?"**

That is a broader infrastructure problem.

---

# 13. Attestcoin Technical Analysis

## What Attestcoin provides

The kickoff AMA describes Attestcoin as infrastructure for accessing verified information from another blockchain directly on Creditcoin.

The protocol is presented around:

- decentralized attestors;
- ASC / verification component;
- readability;
- writability;
- verified source-chain information.

The current hackathon scope emphasizes **readability**.

## Readability

Readability includes:

```text
watch source chain
      ↓
attest source event
      ↓
block prover / proof builder
      ↓
receive proof
      ↓
verify proof
      ↓
use verified fields in application logic
```

This is exactly what ProofMind should implement.

## Writability

The AMA explicitly says writability is not in scope for the hackathon at the time of the kickoff and was still in development.

Therefore:

**Do not make writability a required dependency of ProofMind.**

ProofMind should use readability as the core integration.

Future architecture can leave room for cross-chain actions when writability becomes available.

---

# 14. ATC and CTC Roles

The AMA distinguishes the roles of the tokens:

### ATC

Attestcoin's utility token is described in the AMA as being used for things including:

- staking;
- slashing / rewards;
- writability fees.

The AMA states that reads are free while writing carries fees.

### CTC

CTC remains the gas token used to pay for transactions on Creditcoin.

### ProofMind implication

For the current readability-focused hackathon build, the main engineering concern is **correct proof verification**, not manufacturing unnecessary ATC payment flows.

---

# 15. Supported Development Resources Mentioned in the AMA

The organizers explicitly pointed builders toward:

- Creditcoin documentation;
- Attestcoin documentation section;
- examples;
- tutorials;
- Attestcoin dashboard;
- proof builder;
- verification precompile address;
- faucet / Discord resources.

The AMA specifically recommends using the documentation as source material for agents when building with AI.

### ProofMind rule

The repository should contain a clear **Technical Resources** section linking the exact documentation used for each integration.

---

# 16. Real-World Product Positioning

The Creditcoin presentation emphasizes real users and fiat connections rather than TVL alone, and describes payments, savings, and credit as practical use cases.

This means ProofMind should avoid a pitch centered only on:

- model accuracy;
- token speculation;
- number of contracts;
- flashy dashboards.

Instead, focus on:

```text
real financial decision
        ↓
real evidence
        ↓
real risk
        ↓
real policy
        ↓
real on-chain outcome
```

---

# 17. The ProofMind Judge Story

The judge should understand the product in under one minute.

## Problem

AI agents are becoming capable of financial decisions, but blindly trusting an AI agent with money is unsafe.

## Existing weakness

```text
External data
     ↓
Backend
     ↓
AI
     ↓
Transaction
```

The user must trust the entire pipeline.

## ProofMind

```text
Cross-chain event
       ↓
Attestcoin proof
       ↓
Verified evidence
       ↓
AI reasoning
       ↓
Decision proof
       ↓
Policy contract
       ↓
Execute / reject
```

## One-line pitch

> **AI reasons. Attestcoin proves. Smart contracts enforce.**

## Stronger conceptual line

> **We don't make AI trustworthy. We make AI unnecessary to trust.**

---

# 18. Killer Demo Sequence

The demo should be designed around **proof, decision, and adversarial failure** rather than a normal happy-path dashboard tour.

## Step 1 — Show a real source-chain event

Example:

```text
Ethereum Sepolia
Borrower repayment event
Transaction: 0x...
Amount: ...
Block: ...
```

## Step 2 — Verify it with Attestcoin

Show:

```text
Source chain: Ethereum Sepolia
Proof generated: ✓
Proof verified on Creditcoin: ✓
```

## Step 3 — Show the evidence

```text
Verified evidence
-----------------
Repayment history     ✓
Wallet identity       ✓
Account age           ✓
Previous obligations  ✓
```

## Step 4 — AI decision

Example:

```text
Credit Agent     APPROVE
Risk Agent       APPROVE
Fraud Agent      APPROVE

Decision: APPROVE
Amount: $5,000
```

## Step 5 — Proof-carrying decision

Display:

```text
Evidence root: 0x...
Policy hash:   0x...
Decision hash: 0x...
Agent ID:      ...
Nonce:         ...
```

## Step 6 — Smart-contract enforcement

```text
✓ Evidence verified
✓ Policy satisfied
✓ Credit limit satisfied
✓ Agent authorized
✓ Decision hash valid
✓ Replay protection valid
```

## Step 7 — Execute

The transaction succeeds.

## Step 8 — Attack the AI

Modify the AI's decision:

```text
AI says:
APPROVE $50,000
```

while the verified policy allows only:

```text
$5,000
```

## Step 9 — Contract rejects it

```text
❌ EXECUTION DENIED

Requested amount: $50,000
Verified limit:    $5,000
Reason: POLICY_VIOLATION
```

## Step 10 — Explain the thesis

> **The AI can be wrong. The AI can even be malicious. The protocol still protects the money.**

This is the moment the judge should remember.

---

# 19. Judge Evidence Matrix

| Judge question | ProofMind evidence |
|---|---|
| Is it real? | Testnet deployment + tx hashes |
| Is Attestcoin core? | Verified cross-chain event directly drives decision |
| Is the AI meaningful? | Evidence-aware financial reasoning |
| Is AI trusted blindly? | Deterministic policy contract |
| Is the product innovative? | Proof-carrying financial decisions |
| Does Creditcoin matter? | Verification + policy + execution on Creditcoin |
| Does it have users? | Borrowers, lenders, fintechs, autonomous agents |
| Does it have market relevance? | AI agents + autonomous finance + verified data |
| Can it scale? | Provider-agnostic agent and evidence architecture |
| Can judges reproduce it? | Quickstart + deployed contracts + demo guide |
| Is it secure? | Threat model + negative tests |
| Is it open source? | Public GitHub repository |
| Is development transparent? | Meaningful commit history |
| Does it have long-term vision? | Agent security layer beyond credit |

---

# 20. What We Must NOT Do

## Do not make Attestcoin decorative

Bad:

```text
AI credit app
   ↓
random Attestcoin call
```

Good:

```text
Attestcoin proof
   ↓
verified evidence
   ↓
AI decision
   ↓
policy
```

## Do not build another generic AI chatbot

The AI must produce an outcome that matters.

## Do not rely on centralized data for the core claim

If a fact is supposed to be verified cross-chain, the evidence path must visibly use Attestcoin.

## Do not let the AI directly control funds

AI output should be an **input to policy**, not the policy itself.

## Do not fake multi-track functionality

AI + DeFi is enough. RWA can be a real application extension. DePIN/Gaming should not be bolted on without a genuine use case.

## Do not submit without a reproducible testnet flow

A judge should be able to reproduce at least the core evidence → decision → enforcement path.

---

# 21. Security Requirements for the Final Build

The project should demonstrate that the AI layer is not the final authority.

Minimum negative tests:

### Invalid proof

```text
invalid proof
   ↓
REJECT
```

### Wrong source chain

```text
wrong source chain
   ↓
REJECT
```

### Wrong subject

```text
Alice's evidence → Bob's decision
   ↓
REJECT
```

### Excessive amount

```text
verified limit = $5,000
AI requests = $50,000
   ↓
REJECT
```

### Replay

```text
same evidence / nonce reused
   ↓
REJECT
```

### Expired evidence

```text
stale evidence
   ↓
REJECT
```

### Unauthorized agent

```text
unknown agent
   ↓
REJECT
```

These tests are more persuasive than a large list of unit tests because they demonstrate the actual trust boundary.

---

# 22. Product Architecture to Present

```text
                         SOURCE CHAINS
                    ┌──────────┴──────────┐
                    │                     │
               Ethereum              Other EVM
                 Sepolia                chains
                    │                     │
                    └──────────┬──────────┘
                               │
                               ▼
                       ┌───────────────┐
                       │  ATTESTCOIN   │
                       │   READABILITY │
                       └───────┬───────┘
                               │
                         VERIFIED PROOF
                               │
                               ▼
                    ┌────────────────────┐
                    │  PROOFMIND         │
                    │  EVIDENCE ENGINE   │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    AI AGENTS       │
                    │                    │
                    │ Credit / Risk /    │
                    │ Fraud / RWA        │
                    └─────────┬──────────┘
                              │
                       DECISION PACKAGE
                              │
                              ▼
                    ┌────────────────────┐
                    │  POLICY ENGINE     │
                    │                    │
                    │ limits / roles /   │
                    │ nonce / evidence  │
                    └─────────┬──────────┘
                              │
                       ALLOW / REJECT
                              │
                              ▼
                     CREDITCOIN EVM
                              │
                              ▼
                         EXECUTION
```

---

# 23. Evidence Graph — Recommended UI

The dashboard should visually communicate causality.

```text
                     CREDIT DECISION
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
     Repayment          Account age       No default
       proof               proof              proof
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                     ATTESTCOIN PROOF
                            │
                     SOURCE CHAIN
```

Every evidence item should expose:

- source chain;
- source transaction;
- block number;
- event type;
- proof identifier;
- verification status;
- decision dependency.

---

# 24. Repository / Documentation Requirements

The public repository should make judging easy.

Recommended structure:

```text
projects/proofmind/
├── README.md
├── youtube-analysis/
│   └── README.md
├── DEMO_GUIDE.md
├── DEPLOYMENT_MANIFEST.md
├── contracts/
├── worker/
├── backend/
├── dashboard/
└── ...
```

The main README should link to:

- this YouTube / judge analysis;
- architecture;
- deployment manifest;
- demo guide;
- AI decision documentation;
- security audit;
- gas analysis;
- benchmark repositories.

---

# 25. Competitor Benchmark Set

These are the hackathon projects the team has explicitly analysed as benchmarks.

| Project | Repository |
|---|---|
| Web3 Analysis Dashboard | https://github.com/Faathirazukhruf/Web3-Analysis-Dashboard |
| Spark | https://github.com/thesithunyein/spark |
| AttestDesk | https://github.com/Qidianyan/attestdesk |
| BountyOps Verified Execution | https://github.com/MathieuDWeill/bountyops-verified-execution |
| AttestGuard | https://github.com/rudimentall1/AttestGuard |
| BorrowIQ | https://github.com/Clean-earthw/borrowiq |
| VeriSettle | https://github.com/anhquan075/verisettle |
| index41 | https://github.com/edycutjong/index41 |
| Oracle-Free Council | https://github.com/icohangar-ops/oracle-free-council |
| CrossCredit | https://github.com/OoJae/crosscredit |
| MoonCreditFi | https://github.com/Zakariasisu5/Mooncreditfi |
| ProofYield | https://github.com/darkty0x/proofyield |
| SnakeAI | https://github.com/snake-ai-agent/SnakeAI |

### Competitive differentiation target

Do not try to beat every project by adding more features.

Instead, own this category:

> **Proof-carrying autonomous financial decisions.**

The conceptual pipeline is:

```text
FACT
 ↓
PROOF
 ↓
EVIDENCE
 ↓
AI REASONING
 ↓
DECISION
 ↓
DECISION PROOF
 ↓
POLICY
 ↓
EXECUTION
```

---

# 26. Final Submission Checklist

## Eligibility / rules

- [ ] Project is newly built for the hackathon period.
- [ ] Project is deployed to testnet.
- [ ] Repository is public/open source.
- [ ] Attestcoin is a core feature.
- [ ] Attestcoin integration is meaningful and working.
- [ ] Documentation explains the Attestcoin integration.
- [ ] Development history is transparent.

## Technical

- [ ] Creditcoin contracts deployed.
- [ ] Attestcoin verification works.
- [ ] Source-chain event can be reproduced.
- [ ] Proof builder flow documented.
- [ ] AI decision flow documented.
- [ ] Policy enforcement works.
- [ ] Negative/security cases tested.
- [ ] Testnet transaction hashes recorded.

## Product

- [ ] One clear user problem.
- [ ] One clear user persona.
- [ ] One clear killer workflow.
- [ ] AI contribution is meaningful.
- [ ] Creditcoin contribution is meaningful.
- [ ] Attestcoin contribution is meaningful.
- [ ] Long-term product vision is documented.

## Judging

- [ ] User Base Expansion story is explicit.
- [ ] Technical Alignment story is explicit.
- [ ] Product Vision story is explicit.
- [ ] Execution Capability is demonstrated.
- [ ] Market / Technical Relevance is explicit.

## Demo

- [ ] Happy path works.
- [ ] Evidence is visible.
- [ ] Attestcoin proof is visible.
- [ ] AI decision is visible.
- [ ] On-chain policy is visible.
- [ ] Transaction is visible.
- [ ] Malicious / incorrect AI scenario is demonstrated.
- [ ] Contract rejects invalid decision.

## Submission

- [ ] DoraHacks registration completed.
- [ ] Final project upload completed.
- [ ] **Submit button actually pressed.**
- [ ] Submission is not merely saved as a draft.
- [ ] Submission is completed before the September 6 deadline with buffer.

---

# 27. Judge-Ready Pitch

## 30-second version

> **ProofMind is a trust layer for autonomous financial agents.** It uses Attestcoin to cryptographically verify cross-chain financial evidence, gives that evidence to AI agents for risk decisions, and then forces every decision through deterministic on-chain policies before money can move. **AI reasons. Attestcoin proves. Smart contracts enforce.**

## 60-second version

> Financial AI agents can already reason about credit, risk, and payments, but giving an AI access to money creates a fundamental trust problem. ProofMind solves this by separating reasoning from authority. Attestcoin proves what actually happened on another chain. AI agents reason over those verified facts and produce a proof-carrying decision. A Creditcoin smart contract then independently checks the evidence, policy, identity, limits, and replay protection before allowing execution. If the AI asks for an unsafe amount, the contract rejects it even if the AI is completely compromised. We are building the verification and policy layer for autonomous finance.

---

# 28. Final Strategic Principle

The project should not communicate:

> "We built an AI lending application."

It should communicate:

> **"We built the verification layer that makes autonomous financial agents safe to operate."**

Credit is the first killer application.

Attestcoin is the evidence layer.

Creditcoin is the verification / execution environment.

AI is the reasoning layer.

Smart contracts are the authority layer.

Together:

```text
AI asks:
"What should happen?"

Attestcoin answers:
"What actually happened?"

Policy contract answers:
"What is allowed to happen?"

Creditcoin executes:
"Only the allowed action."
```

---

# 29. Source Notes / Evidence Classification

This document deliberately separates facts from strategy.

### Source-derived facts

The following are directly derived from the kickoff AMA transcript and official hackathon information:

- five tracks;
- mandatory core Attestcoin usage;
- testnet requirement;
- open-source requirement;
- transparent development guidance;
- prizes;
- dates;
- Attestcoin readability vs writability scope;
- documentation / examples / proof builder / faucet resources;
- CEIP Fast Track;
- five evaluation pillars;
- ownership after the hackathon;
- submission reminder.

### Project strategy / interpretation

The following are ProofMind's strategic recommendations rather than official scoring weights:

- primary AI positioning;
- secondary DeFi / RWA positioning;
- proof-carrying decision primitive;
- multi-agent credit architecture;
- adversarial AI demo;
- evidence graph UI;
- recommended internal deadlines;
- competitor differentiation strategy.

**Important:** The public materials reviewed do not provide numeric weights for the five evaluation pillars. Do not claim that, for example, "technical alignment is 30%" unless the organizers publish an official weighting later.

---

# 30. Source Links

- BUIDL CTC: https://buidl.creditcoin.org/
- BUIDL CTC DoraHacks: https://dorahacks.io/hackathon/buidl-ctc-2026-fall/buidl
- Official kickoff AMA: https://www.youtube.com/watch?v=HPL6LjTqQm4
- Attestcoin: https://attestcoin.org/
- Creditcoin docs: https://docs.creditcoin.org/
- ProofMind: https://github.com/c-sidd/creditcoin-attestcoin-lab

---

**Last reviewed:** 2026-08-26

**Document role:** Internal hackathon strategy + judge-readiness reference for ProofMind.
