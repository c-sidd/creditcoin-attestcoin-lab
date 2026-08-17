# BUIDL CTC 2026 Fall — Hackathon Rules & Project Constraints

> Source: BUIDL CTC 2026 Fall — BUIDL For The Real World (DoraHacks)
>
> This document extracts the information that is important for designing and building our hackathon project. It intentionally separates **hard requirements** from useful opportunities and planning implications.

## 1. Hackathon Overview

- **Event:** BUIDL CTC 2026 Fall — BUIDL For The Real World
- **Sponsor:** Creditcoin & Credit Labs
- **Theme:** Attestcoin Protocol
- **Focus:** Building cross-chain applications that expand the Creditcoin ecosystem.
- **Prize pool:** **$15,000**
  - Grand Prize: $10,000
  - 2nd Prize: $3,000
  - 3rd Prize: $2,000
- **Minimum team size:** 1 member
- **Submission deadline:** September 6, 2026, 23:59 ET
- **Winner announcement:** September 18, 2026
- **CTC Ignition 2026:** September 28, 2026, Seoul

## 2. Core Theme — Attestcoin Protocol

Every submission **must leverage the Attestcoin Protocol**.

Attestcoin extends Creditcoin with decentralized infrastructure for:

- Verified cross-chain data
- Cross-chain messaging
- Applications on Creditcoin using attested data from other blockchains
- Cross-chain business logic without centralized oracle operators

### Critical implication for our project

Attestcoin cannot be a decorative or optional integration. The hackathon explicitly states that projects must demonstrate a **meaningful and functional integration**, and that the **depth of Attestcoin Protocol utilization is a core scoring criterion**.

Therefore, our eventual project should be designed **around a genuine cross-chain requirement**, not built first and connected to Attestcoin afterward.

## 3. Five Available Tracks

### 3.1 DeFi

Build lending, trading, liquidity, or yield applications on Creditcoin.

**Potential project direction:** cross-chain lending, borrowing, collateral verification, trading, liquidity, or conditional payments.

### 3.2 RWA

Tokenize, manage, or finance real-world assets on Creditcoin, connecting off-chain value with on-chain transparency.

**Potential project direction:** cross-chain verification or financing of tokenized real-world assets.

### 3.3 DePIN

Build decentralized physical infrastructure applications that use cross-chain data for incentives, settlement, or coordination of hardware/sensor networks.

**Potential project direction:** sensor/hardware events on one chain triggering incentives or settlement on Creditcoin.

### 3.4 Gaming

Create games or gaming infrastructure on Creditcoin featuring:

- In-game economies
- Asset ownership
- Player-driven marketplaces

**Potential project direction:** cross-chain player assets, reputation, ownership, rewards, or game-state interactions.

### 3.5 AI

Deploy AI applications on Creditcoin that process **cryptographically verified cross-chain data** to:

- Inform decisions autonomously
- Trigger on-chain transactions
- Avoid centralized oracle operators

**Important:** This track provides a particularly strong fit for an architecture where **Attestcoin establishes verified facts and AI interprets those facts**.

## 4. Hard Project Requirements

Our final project must satisfy **all** of the following:

1. **Original work** created during the hackathon.
2. **Deployed on a testnet.**
3. **Attestcoin Protocol is a core feature.**
4. Respect third-party intellectual property rights.
5. Include working Attestcoin Protocol integration code.
6. Include technical documentation explaining the setup and how Attestcoin is used.

### Non-negotiable design rule

> The Attestcoin integration must be functional, meaningful, and central to the application's behavior.

A project that merely deploys a Creditcoin contract and mentions Attestcoin would not satisfy the spirit of this requirement.

## 5. What the Hackathon Wants Us to Demonstrate

The official description highlights applications such as:

- Trustless cross-chain DeFi
- Tokenized real-world assets
- Gaming economies
- Verifiable governance

The common capability is:

```text
Other Blockchain(s)
        ↓
Verified / Attested Cross-Chain Data
        ↓
Attestcoin Protocol
        ↓
Creditcoin
        ↓
Smart Contract Business Logic
        ↓
Application / Action
```

This suggests that the strongest projects will demonstrate a clear reason why cross-chain verification or messaging is necessary.

## 6. Submission Requirements

### Project Information

The submission requires:

- Project Name
- Project Logo (optional; PNG, SVG, or AI image URL)
- Project Sector
- Project Description
- Attestcoin Protocol Integration Summary
- GitHub Repository URL
  - **README is required**
- Project Deck or Whitepaper
  - PDF URL
- Prototype Demo Video URL

### Team Information

For each team member:

- First & Last Name
- Email
- Telegram ID (optional)
- X / Twitter (optional)
- LinkedIn (optional)
- Resume PDF URL (optional)
- Short Bio
- Role within the team
- Country of Residence
- Country of Citizenship

## 7. Developer Resources We Must Study

The hackathon explicitly points developers toward:

1. **Chains and Environments**
   - https://docs.creditcoin.org/creditcoin-usc/usc-chains-environments
2. **Guided Tutorials**
   - https://docs.creditcoin.org/creditcoin-usc/guided-tutorials
3. **Attestcoin Protocol SDK**
   - https://docs.creditcoin.org/creditcoin-usc/dapp-builder-infrastructure/usc-sdk

### Research priority

Before choosing the final project, we should determine from these resources:

- Supported source chains
- Supported environments/testnets
- How cross-chain data is requested
- How proofs/attestations are consumed by contracts
- How cross-chain writes/messages work
- SDK capabilities
- Deployment requirements
- Protocol limitations

## 8. CEIP Opportunity

The **top three teams** proceed through the Creditcoin Ecosystem Investment Program (CEIP) fast-track process.

Potential benefits include:

- Initial investment
- Potential follow-on funding or grants
- Engineering and product advisory
- Access to Creditcoin partners and VCs

The fast-track process bypasses the initial screening stages and moves qualifying teams directly to due diligence.

### Project implication

This means the project should be thought of not only as a hackathon demo, but potentially as a **real product that strengthens the Creditcoin ecosystem**.

## 9. Eligibility Constraints

All team members must:

- Have no criminal record
- Have no pending criminal cases
- Not be residents of sanctioned countries
- Not be sanctioned individuals
- Be legally permitted to participate under applicable local laws

## 10. Terms & Ownership

Participants confirm that:

- Submitted information is accurate and truthful.
- They possess the necessary rights and ownership for all submitted code, content, and materials.

Therefore, our project should use original implementation/content or properly licensed dependencies and assets.

## 11. Project Design Principles Derived From the Rules

These are **our planning conclusions**, not direct claims from the hackathon rules.

### Principle 1 — Attestcoin first

Do not choose a product and then force Attestcoin into it.

Instead:

```text
Understand Attestcoin
        ↓
Find powerful cross-chain primitives
        ↓
Find real-world problems requiring those primitives
        ↓
Design product
```

### Principle 2 — Cross-chain should be visible in the demo

A judge should be able to see a flow similar to:

```text
Source Chain Event
       ↓
Attestcoin Verification / Messaging
       ↓
Creditcoin Smart Contract
       ↓
Automatic Business Action
```

### Principle 3 — Avoid centralized-oracle dependence

If our application can simply fetch the same information from a normal centralized API, the Attestcoin integration may look unnecessary.

We should identify a use case where **cryptographically verified cross-chain information changes the security or trust model**.

### Principle 4 — AI should not replace verification

For an AI project, a strong conceptual separation is:

```text
Attestcoin = establishes verified cross-chain facts
AI         = interprets those verified facts
Contract   = executes deterministic business rules
```

This is a possible architecture to investigate; it is not yet our final project design.

### Principle 5 — Build a protocol POC before the full product

Before building the final application, we should prove a minimal end-to-end Attestcoin flow on testnet.

Target POC:

```text
Source-chain transaction/event
            ↓
       Attestcoin
            ↓
     Creditcoin contract
            ↓
      Verified result
```

Once this works, the protocol risk is significantly reduced.

## 12. Hackathon Checklist

### Mandatory

- [ ] Original project created during the hackathon
- [ ] Creditcoin testnet deployment
- [ ] Functional Attestcoin integration
- [ ] Attestcoin is a core feature
- [ ] Technical Attestcoin documentation
- [ ] GitHub repository with README
- [ ] Project description
- [ ] Attestcoin integration summary
- [ ] Project deck/whitepaper PDF
- [ ] Prototype demo video
- [ ] Team information

### Technical validation before submission

- [ ] Identify supported source chain
- [ ] Verify cross-chain capability works on testnet
- [ ] Verify the actual Attestcoin proof/message flow
- [ ] Confirm smart-contract integration
- [ ] Test failure/invalid-data cases
- [ ] Record testnet transaction/proof evidence
- [ ] Document exact setup steps

## 13. Key Takeaways

1. **Attestcoin is mandatory.**
2. **Meaningful and functional integration is mandatory.**
3. **Depth of Attestcoin usage is a core scoring criterion.**
4. The project must run on a **testnet**.
5. The strongest opportunity is likely a product where **verified cross-chain information directly drives Creditcoin smart-contract logic**.
6. AI is especially interesting when it consumes **cryptographically verified cross-chain data**, rather than acting as the trust layer.
7. We should understand the Attestcoin developer stack before selecting the final product.
8. The final project should be both a compelling hackathon demo and potentially useful to the Creditcoin ecosystem.

## 14. Source

- Hackathon: BUIDL CTC 2026 Fall — BUIDL For The Real World
- Platform: DoraHacks
- Sponsor: Creditcoin / Credit Labs
- Official developer resources are listed in Section 7.
