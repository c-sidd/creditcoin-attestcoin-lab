# 04 — Judging Criteria & Submission Readiness

## Important distinction

The official hackathon page currently exposes the track definitions, schedule, prizes, and CEIP information. **Do not invent percentage weights** for judging categories unless the organizers publish them.

Our internal scorecard below is a readiness framework, not an official organizer weighting.

## Official track fit

### AI — primary track

Official framing: **AI Agents / Onchain Decisioning / Verified Data**.

ProofMind should demonstrate all three in one causal path:

```text
verified cross-chain data
        ↓
AI agent
        ↓
autonomous decision
        ↓
on-chain transaction
```

### RWA — application domain

The underlying receivable/invoice is a real-world financial obligation. The important point is not simply tokenization; it is verified evidence about an off-chain obligation becoming an input to financing.

### DeFi — execution layer

The financing action is programmable and executed through Creditcoin-side financial contracts.

## Internal judge scorecard

| Criterion | Target | Evidence required |
|---|---|---|
| Real-world problem | 10/10 | Concrete SME liquidity story, measurable bottleneck |
| AI relevance | 10/10 | Agent consumes verified evidence and returns structured underwriting |
| Verified-data relevance | 10/10 | Attestcoin proof is required for execution |
| On-chain decisioning | 10/10 | Policy contract independently validates action |
| DeFi relevance | 9/10 | Financing state/liquidity action occurs on-chain |
| RWA relevance | 9/10 | Receivable/obligation is clearly modeled and explained |
| Attestcoin depth | 10/10 target | Proof generation, verification, source binding, negative paths |
| Technical correctness | 10/10 target | Tests, deployment, reproducible runbook |
| Security | 10/10 target | Tamper, replay, wrong source, wrong amount, failed receipt tests |
| UX/demo clarity | 10/10 target | 3–5 minute flow with one visible success and one visible rejection |
| Documentation | 10/10 target | Architecture, setup, evidence, live/simulated boundary |
| Market vision | 9/10 | Invoice financing first; general proof-carrying finance later |

## Attestcoin depth checklist

### Must-have

- [ ] Source transaction/event is real or explicitly labeled as a fixture.
- [ ] Source block is attested on Creditcoin for the live path.
- [ ] Proof Builder is used for the live proof path.
- [ ] Creditcoin-side verifier validates the proof.
- [ ] Expected source chain is checked.
- [ ] Expected source contract is checked.
- [ ] Receipt/log/event conditions are checked.
- [ ] Verified evidence changes application state or controls execution.
- [ ] Invalid evidence causes no financial state change.

### Strong differentiators

- [ ] Batch proof path where it genuinely reduces multiple evidence checks.
- [ ] Explicit replay protection.
- [ ] Explicit wrong-source/wrong-contract protection.
- [ ] Recorded proof fixture for deterministic tests.
- [ ] Evidence IDs linked to the AI decision.
- [ ] Decision hash/policy version recorded for auditability.

## AI checklist

- [ ] AI provider is optional.
- [ ] Deterministic mock mode works without an API key.
- [ ] Groq is the default low-cost development LLM if an LLM is needed.
- [ ] OpenAI is an optional adapter, not a hard dependency.
- [ ] AI output is strict JSON / schema-validated.
- [ ] AI cannot directly call unrestricted financial contract functions.
- [ ] Deterministic policy checks the AI output.
- [ ] AI failures fall back to safe rejection/no-op.
- [ ] No secret keys are committed.

## Deployment checklist

### Source chain

- [ ] Deploy source evidence emitter/registry.
- [ ] Create the source event.
- [ ] Record transaction hash.
- [ ] Wait for attestation.

### Creditcoin

- [ ] Deploy the production verifier-backed contracts.
- [ ] Record deployment transaction hashes.
- [ ] Record contract addresses.
- [ ] Configure authorized writers.
- [ ] Execute the live proof path.
- [ ] Record Creditcoin transaction hash.

### Application

- [ ] Public backend URL.
- [ ] Public dashboard URL.
- [ ] Worker deployment or documented operator process.
- [ ] Public demo works without exposing secrets.

## Negative-path evidence

A serious submission should prove that the system fails safely.

| Attack | Expected result |
|---|---|
| Tampered Merkle proof | Revert / reject |
| Tampered continuity proof | Revert / reject |
| Wrong transaction bytes | Revert / reject |
| Unattested block/digest | Revert / reject |
| Wrong chain key | Revert / reject |
| Unknown source contract | Revert / reject |
| Failed source receipt | Revert / reject |
| Replayed evidence | Revert / reject |
| AI amount above policy | Revert / reject |
| Missing/invalid AI output | No-op / reject |

## Final submission quality bar

A judge should be able to clone the repository and answer five questions quickly:

1. **What real problem is being solved?**
2. **Where is Attestcoin actually used?**
3. **What does AI do that is meaningful?**
4. **What stops a bad AI decision from moving money?**
5. **What evidence proves that the system actually works?**

If the repository cannot answer these questions in under five minutes, the documentation is not ready.

## Official references

- BUIDL CTC 2026 Fall: https://buidl.creditcoin.org/
- Creditcoin: https://github.com/gluwa/creditcoin
- USC Query Builder: https://github.com/gluwa/cc-next-query-builder
- USC examples: https://github.com/gluwa/usc-testnet-bridge-examples
