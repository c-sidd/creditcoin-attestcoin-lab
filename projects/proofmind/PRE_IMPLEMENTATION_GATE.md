# ProofMind Pre-Implementation Gate

**Status: VERIFY BEFORE IMPLEMENTATION**

This checklist is the mandatory gate before Antigravity begins writing ProofMind production code.

A checked documentation item means the specification exists. It does **not** mean the underlying runtime behavior has been proven.

---

## Gate A — Repository and reference material

- [ ] Read `projects/proofmind/README.md`.
- [ ] Read `projects/proofmind/docs/00-INDEX.md`.
- [ ] Read the deep engineering reference relevant to the first milestone.
- [ ] Inspect the preserved Creditcoin reference implementation.
- [ ] Identify reusable patterns rather than copying blindly.
- [ ] Confirm no required protocol-specific behavior is based only on assumptions.

## Gate B — Creditcoin protocol facts

Before implementing the Attestcoin boundary, verify from current official documentation/reference code:

- [ ] CC3 Testnet RPC.
- [ ] Source-chain network and chain key.
- [ ] Creditcoin chain/network identity.
- [ ] Proof Builder endpoint.
- [ ] Proof Builder request format.
- [ ] Proof Builder response format.
- [ ] Decoder contract address.
- [ ] BlockProver/Native Query Verifier precompile address and callable interface.
- [ ] Attestcoin SDK package/version and relevant methods.
- [ ] Required source-chain event/transaction data format.
- [ ] Current testnet deployment assumptions.

**Rule:** if any item cannot be verified, do not invent it. Mark the integration boundary `BLOCKED` and record the issue.

## Gate C — Architecture

- [ ] Source-chain contract responsibility is frozen.
- [ ] ASC responsibility is frozen.
- [ ] Business/policy contract responsibility is frozen.
- [ ] Worker responsibility is frozen.
- [ ] AI service responsibility is frozen.
- [ ] Backend responsibility is frozen.
- [ ] Frontend responsibility is frozen.
- [ ] Trust boundaries are documented.
- [ ] Data ownership is documented.
- [ ] Failure ownership is documented.
- [ ] No component has overlapping authority that could create contradictory behavior.

## Gate D — Trust model

The following must remain true:

```text
Blockchain/Attestcoin
        = source of verified cross-chain fact

AI
        = reasoning / recommendation / decision proposal

Policy + Smart Contract
        = deterministic enforcement
```

- [ ] AI cannot certify blockchain facts.
- [ ] AI cannot bypass proof verification.
- [ ] AI cannot directly change protected contract state without the defined enforcement path.
- [ ] Verified data is distinguishable from unverified external data.
- [ ] Policy checks happen before privileged execution.

## Gate E — Interfaces

Freeze the first implementation interfaces before coding dependent components:

- [ ] Source-chain events.
- [ ] Proof request.
- [ ] Proof response.
- [ ] VerifiedFact.
- [ ] AI input.
- [ ] AI output.
- [ ] TransactionIntent.
- [ ] PolicyDecision.
- [ ] ExecutionResult.
- [ ] Worker state record.
- [ ] Backend API responses.
- [ ] Contract functions/events.

For every interface:

- [ ] Required fields are known.
- [ ] Types are known.
- [ ] Optional fields are defined.
- [ ] Validation rules are defined.
- [ ] Error behavior is defined.
- [ ] Version/change strategy is defined.

## Gate F — State machines

### Worker

- [ ] Event detected state.
- [ ] Attestation waiting state.
- [ ] Proof requested state.
- [ ] Proof received state.
- [ ] ASC submitted state.
- [ ] Verified/executed state.
- [ ] Retry state(s).
- [ ] Terminal failure state.
- [ ] Restart/catch-up behavior.

### Business/decision flow

- [ ] Verified fact state.
- [ ] AI processing state.
- [ ] Decision validation state.
- [ ] Policy rejected state.
- [ ] Execution submitted state.
- [ ] Execution confirmed state.
- [ ] Execution failed state.

## Gate G — Security

- [ ] Threat model reviewed.
- [ ] Private key handling defined.
- [ ] Secret handling defined.
- [ ] Contract access control defined.
- [ ] Replay protection defined.
- [ ] Idempotency defined.
- [ ] AI prompt/input injection risks considered.
- [ ] AI output validation defined.
- [ ] Transaction bounds/limits defined.
- [ ] External API trust boundaries documented.
- [ ] Logs are scrubbed of secrets.
- [ ] No production secrets are required for local development.

## Gate H — Testing

- [ ] Contract unit-test plan.
- [ ] Contract negative-test plan.
- [ ] Worker unit-test plan.
- [ ] Worker retry/restart tests.
- [ ] AI schema/policy tests.
- [ ] Backend API tests.
- [ ] Integration tests.
- [ ] Testnet E2E test plan.
- [ ] Failure injection plan.
- [ ] Evidence format defined.

## Gate I — Environment

- [ ] Required runtime versions documented.
- [ ] Package manager documented.
- [ ] Solidity/compiler version documented.
- [ ] Node/TypeScript version documented.
- [ ] Local RPC strategy documented.
- [ ] Testnet RPC documented.
- [ ] Environment variables documented.
- [ ] `.env.example` planned/available.
- [ ] Wallet funding requirements documented.
- [ ] Deployment commands documented or intentionally deferred until verified.

## Gate J — Observability

- [ ] Correlation/processing ID defined.
- [ ] Source transaction hash stored.
- [ ] Source block/event identity stored.
- [ ] Proof request status stored.
- [ ] ASC transaction hash stored.
- [ ] AI decision ID stored.
- [ ] Final execution transaction hash stored.
- [ ] Failure reason stored.
- [ ] Logs do not contain secrets.

## Gate K — Documentation discipline

- [ ] `IMPLEMENTATION_RULES.md` is read by Antigravity before coding.
- [ ] `DECISIONS.md` is the decision record.
- [ ] `PROJECT_STATUS.md` is the status authority.
- [ ] Documentation is updated in the same milestone as behavior changes.
- [ ] Protocol facts are separated from project design.
- [ ] Unknown protocol behavior is explicitly marked rather than guessed.

## Gate L — Prompt-chain readiness

- [ ] Prompt 01 is the only prompt used to begin repository reconnaissance.
- [ ] Each prompt has an explicit input, task, verification, output and stop condition.
- [ ] Antigravity must not skip verification gates.
- [ ] Antigravity must not claim completion without evidence.
- [ ] Failed gates block the next milestone.
- [ ] Prompt outputs are recorded where useful.

## Gate M — Demo definition

Before implementation, define one narrow, deterministic MVP demo:

```text
User initiates source-chain action
        ↓
Source event emitted
        ↓
Attestcoin readability path
        ↓
Verified cross-chain fact
        ↓
AI interprets verified fact
        ↓
Structured decision
        ↓
Policy validation
        ↓
Creditcoin contract execution
        ↓
Dashboard shows evidence
```

- [ ] One exact happy-path scenario selected.
- [ ] Expected source event defined.
- [ ] Expected verified fact defined.
- [ ] Expected AI decision defined.
- [ ] Expected policy result defined.
- [ ] Expected Creditcoin state change defined.
- [ ] Judge-facing evidence defined.

## Final PASS criteria

The pre-implementation gate is `PASS` only when:

1. All protocol-specific facts needed for the next milestone are verified.
2. Architecture and trust boundaries are frozen.
3. Dependent interfaces are defined.
4. Security constraints are defined.
5. Testing and evidence requirements are defined.
6. The first MVP path is unambiguous.
7. No unresolved blocker requires guessing.

If any required item is unresolved:

> **STOP — DO NOT IMPLEMENT THE DEPENDENT MILESTONE.**

Record the blocker in `PROJECT_STATUS.md` and/or `DECISIONS.md`.

## Gate result

**Current result: NOT YET PASSED.**

The documentation layer is substantially complete, but the live protocol-specific values and interfaces must be re-verified immediately before implementation because protocol environments and SDKs can change.
