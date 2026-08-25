# 05 — Competitor / Benchmark Analysis

## Purpose

These repositories are the benchmark set supplied by the team. We analyze them to avoid cloning an existing idea and to identify where ProofMind can be genuinely different.

The key comparison is not "who has the most features". It is:

> **What fact is proven? What decision does it enable? Where does AI sit? What does Creditcoin execute? And would the product still work if Attestcoin were removed?**

## Benchmark table

| Project | Main idea | Attestcoin / verified-data role | Creditcoin role | Main overlap with ProofMind | Our differentiation |
|---|---|---|---|---|---|
| Web3 Analysis Dashboard | Crypto/airdrop analysis dashboard | Not the core primitive | General Web3 context | Low | We make verified data control financial execution |
| Spark | Verified Sepolia payment history → credit score/LTV → Creditcoin credit line | Sepolia payment proofs | Credit score, credit line, sCREDIT flow | **High** | Proof-carrying underwriting + RWA receivable evidence + AI/policy separation |
| AttestDesk | Attested invoice settlement → autonomous advance | Invoice settlement proof is load-bearing | Vault verifies then credits | **Very high** | We must differentiate on the broader proof-carrying decision layer, multi-agent risk, and policy architecture rather than simply copying invoice underwriting |
| BountyOps Verified Execution | Verified execution for CROO/bounty workflow | Cross-chain verification supports execution | Creditcoin-backed verified execution | Medium | Financial underwriting + RWA financing use case |
| AttestGuard | Guardrail/security-oriented Attestcoin application | Verified data / policy evidence | On-chain guardrail/execution | High at architecture level | Focus on financial underwriting and RWA → liquidity, with deterministic policy after AI |
| BorrowIQ | AI / credit borrowing experience | Cross-chain financial evidence | Credit / borrowing workflow | High | Evidence-linked decision provenance and adversarial execution boundary |
| VeriSettle | Receipt-bound cross-chain escrow | Attested receipt/acceptance gates settlement | Escrow and governed recovery | Medium-high | Financing decision rather than settlement; AI underwriting is upstream of execution |
| index41 | Proves transaction ordering / sandwich relationship | Deep Attestcoin transaction proof use | Bond/dispute payout | Low domain overlap, **high technical benchmark** | We should learn its proof-depth discipline and negative-path evidence, not copy its problem |
| Oracle-Free Council | Agent/council decisions without centralized oracle dependency | Verified data supports decisions | On-chain governance/decision execution | High conceptual overlap | Financial underwriting + RWA evidence + explicit deterministic policy gate |
| CrossCredit | Cross-chain credit profile and lending | Large part of credit score comes from verified source-chain history | Credit registry, tiers, lending pool | **Very high** | Avoid another wallet-history credit score; use verified RWA obligations + proof-carrying AI decisions |
| MoonCreditFi | Credit / DeFi application | Cross-chain/attestation-backed credit context | DeFi credit | High | Stronger verification-to-decision provenance and adversarial AI safety |
| ProofYield | Proof/attestation-backed DeFi/yield concept | Verified facts support yield/financial logic | DeFi execution | Medium | Underwriting + RWA + AI decision layer |
| SnakeAI | AI agent/game concept | Not a meaningful Attestcoin benchmark | Not core | Low | Ignore domain; learn only from agent UX if useful |

## High-value competitor findings

### 1. Spark proves that a simple, end-to-end credit loop is compelling

Spark's current public README describes:

```text
Sepolia payment
   ↓
Attestcoin proof
   ↓
Creditcoin verification
   ↓
credit score / LTV
   ↓
credit line
```

It also has deployed testnet contracts and a live application. This means ProofMind cannot win by simply saying "we use Attestcoin to create a credit score." We need a materially different decision primitive.

### 2. AttestDesk is our closest direct competitor

AttestDesk currently demonstrates:

```text
Sepolia invoice settlement
   ↓
Attestcoin proof
   ↓
agent decision
   ↓
Creditcoin vault
   ↓
advance credit
```

Its README explicitly makes Attestcoin a required execution input and includes negative proof tests. This is extremely close to our initial invoice-financing concept.

**Conclusion:** do not present ProofMind as merely "AI invoice underwriter + Attestcoin." That would be too easy to compare directly against AttestDesk.

### 3. CrossCredit is the strongest credit-history benchmark

CrossCredit uses verified Ethereum history to derive a credit profile and lending tier. Its current documentation emphasizes that Attestcoin is load-bearing and that the credit score comes from source-chain facts verified inside Creditcoin.

**Conclusion:** wallet-history credit scoring is already occupied. ProofMind should use a different evidence domain and a different decision abstraction.

### 4. VeriSettle owns receipt-bound escrow/settlement

VeriSettle uses Attestcoin-verified acceptance/receipt facts to control cross-chain escrow release. It also has public testnet deployments and judge evidence.

**Conclusion:** do not make escrow release the core ProofMind demo.

### 5. index41 is a technical depth benchmark

index41 is valuable even though the business domain is unrelated. It demonstrates an unusually deep use of Attestcoin to recover transaction ordering information from Merkle-path laterality and uses that fact in a dispute/bond flow.

**Conclusion:** compete on the same standard of technical seriousness: prove the exact source fact, bind it to the expected source, and show negative paths. Do not compete by counting SDK methods.

## What the benchmark set teaches us

### Crowded territory

- Generic credit scoring
- Wallet-history lending
- Invoice underwriting
- Cross-chain escrow
- Generic AI decision councils
- Generic DeFi credit lines

### Less crowded territory

> **A reusable proof-carrying decision layer where an AI agent proposes a financial action, the decision references verifiable cross-chain evidence, and deterministic Creditcoin policy prevents the AI from exceeding the verified financial constraints.**

That is the direction we should own.

## ProofMind differentiation matrix

| Capability | Existing benchmark examples | ProofMind target |
|---|---|---|
| Cross-chain transaction proof | Many | Yes |
| Credit score from wallet history | Spark, CrossCredit | **Not our core** |
| Invoice settlement underwriting | AttestDesk | **Use only as a narrow RWA fixture; differentiate above it** |
| Escrow settlement | VeriSettle | No |
| Transaction-order proof | index41 | No, but adopt its rigor |
| AI decision | Several | Yes |
| AI decision with evidence references | Emerging | **Core** |
| AI decision independently policy-checked | Emerging | **Core** |
| Financial action that carries decision provenance | Fragmented | **Core ProofMind primitive** |
| Deliberate malicious-AI rejection demo | Not the benchmark norm | **Core demo moment** |

## Competitor links

1. Web3 Analysis Dashboard — https://github.com/Faathirazukhruf/Web3-Analysis-Dashboard
2. Spark — https://github.com/thesithunyein/spark
3. AttestDesk — https://github.com/Qidianyan/attestdesk
4. BountyOps Verified Execution — https://github.com/MathieuDWeill/bountyops-verified-execution
5. AttestGuard — https://github.com/rudimentall1/AttestGuard
6. BorrowIQ — https://github.com/Clean-earthw/borrowiq
7. VeriSettle — https://github.com/anhquan075/verisettle
8. index41 — https://github.com/edycutjong/index41
9. Oracle-Free Council — https://github.com/icohangar-ops/oracle-free-council
10. CrossCredit — https://github.com/OoJae/crosscredit
11. MoonCreditFi — https://github.com/Zakariasisu5/Mooncreditfi
12. ProofYield — https://github.com/darkty0x/proofyield
13. SnakeAI — https://github.com/snake-ai-agent/SnakeAI

## Benchmark sources checked

- Spark current README: https://github.com/thesithunyein/spark
- AttestDesk current README: https://github.com/Qidianyan/attestdesk
- VeriSettle current README: https://github.com/anhquan075/verisettle
- CrossCredit Attestcoin integration notes: https://github.com/OoJae/crosscredit/blob/main/docs/ATTESTCOIN_INTEGRATION.md
- index41 current README: https://github.com/edycutjong/index41
- BountyOps repository metadata: https://github.com/MathieuDWeill/bountyops-verified-execution
- Web3 Analysis Dashboard repository metadata: https://github.com/Faathirazukhruf/Web3-Analysis-Dashboard

## Strategic conclusion

**Do not build the 14th version of a credit dashboard.**

Build the infrastructure that makes an autonomous financial decision auditable and enforceable:

```text
verified fact
    ↓
evidence reference
    ↓
AI decision
    ↓
canonical decision intent
    ↓
deterministic policy
    ↓
Creditcoin execution
    ↓
public audit trail
```

That is the benchmark gap ProofMind should attempt to own.
