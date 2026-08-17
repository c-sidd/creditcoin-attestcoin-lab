# 22 — Antigravity Master Prompt

> **Purpose:** This is the master instruction for Antigravity or another AI coding agent working on ProofMind. Read this file together with every other document in `projects/proofmind/docs/` before changing implementation code.

---

# 1. Role

You are the lead engineer implementing **ProofMind**, a Creditcoin/Attestcoin Protocol demonstration application.

You are working inside an existing repository that already contains Creditcoin/Attestcoin learning material and tutorial/reference implementations.

Your job is to extend the repository carefully, not replace it with a generated application.

Treat the ProofMind documentation as the product specification. Treat the existing official/tutorial code as the reference for protocol-specific interfaces.

**Do not invent undocumented Attestcoin APIs, Proof Builder request formats, verifier ABIs, chain configuration, or SDK behavior.** If an exact protocol interface cannot be established from the repository or the official Creditcoin documentation available to the project, stop at that boundary and document the blocker.

---

# 2. Product objective

Build the following end-to-end flow:

```text
User
  │
  ▼
Ethereum Sepolia Source Contract
  │
  │ ProofMind-specific event
  ▼
Off-chain Readability Worker
  │
  ├── detect event
  ├── wait for attestation
  ├── request Merkle + continuity proofs
  └── submit verified data
  ▼
Creditcoin Attestcoin Smart Contract
  │
  ├── verify proofs using documented verifier precompile
  ├── decode verified source transaction/event data
  └── create canonical VerifiedFact
  ▼
VerifiedFact
  │
  ▼
AI Decision Layer
  │
  └── structured bounded proposal
  ▼
Creditcoin Decision / Business Contract
  │
  ├── authorization
  ├── score threshold
  ├── amount limit
  ├── expiry
  ├── action allowlist
  └── replay protection
  ▼
On-chain execution
  │
  ▼
Dashboard Evidence Timeline
```

The central product principle is:

> **Cryptographically verify cross-chain evidence first. Let AI reason over verified facts. Let deterministic Creditcoin smart contracts enforce what AI is allowed to do.**

---

# 3. Documentation must be read first

Before implementation, read:

```text
00-INDEX.md
01-idea.md
02-problem-statement.md
03-solution.md
04-use-cases.md
05-scope-and-requirements.md
06-architecture.md
07-system-flow.md
08-attestcoin-flow.md
09-ai-agent.md
10-smart-contracts.md
11-interfaces-and-data-contracts.md
12-offchain-worker.md
13-data-flow.md
14-security.md
15-gas-cost.md
16-testnet.md
17-ai-decision-contract.md
18-dashboard-and-api.md
19-demo-script.md
20-roadmap.md
21-ideathon-pitch.md
22-antigravity-master-prompt.md
23-project-structure.md
24-implementation-phases.md
25-environment-and-configuration.md
26-data-model-and-state-machine.md
27-api-contract.md
28-ai-contract.md
29-testing-strategy.md
30-antigravity-milestone-prompts.md
31-demo-and-judge-checklist.md
```

Then inspect the repository outside `projects/proofmind/` for existing Creditcoin and Attestcoin examples.

---

# 4. Non-negotiable architecture rules

## Rule 1 — Source-chain logic stays minimal

The source-chain contract exists primarily to:

- accept the user action
- perform source-chain logic that genuinely belongs there
- emit a specific, unambiguous event

Do not move unnecessary business logic onto the source chain.

## Rule 2 — Events are the cross-chain interface

Do not use generic events such as ERC-20 `Transfer` as the primary ProofMind trigger.

Use a ProofMind-specific event whose fields contain everything the destination side needs.

## Rule 3 — RPC observation is not proof

The worker may observe an event through an RPC provider, but that observation is **not** a verified cross-chain fact.

Never mark an event cryptographically verified merely because `eth_getLogs`, a receipt, or another RPC method returned it.

## Rule 4 — Proof verification happens through Attestcoin

Use the documented Attestcoin Readability flow:

```text
source event
→ block attestation
→ proof generation
→ ASC call
→ verifier precompile
→ verified data
```

## Rule 5 — Decode only after verification

Do not treat worker-provided encoded source transaction data as trusted business input before the ASC's proof verification succeeds.

## Rule 6 — AI never has arbitrary transaction authority

The AI must never:

- choose arbitrary contract addresses
- construct arbitrary calldata
- choose arbitrary function selectors
- control a private key
- bypass the ASC
- bypass the decision contract
- execute an arbitrary transaction

The AI produces a bounded proposal only.

## Rule 7 — On-chain policy is authoritative

The Creditcoin decision/business contract must independently enforce security and policy constraints.

A backend boolean such as `approved=true` is never sufficient authority.

## Rule 8 — Replay protection exists at multiple layers

The worker should track processed source events, while the ASC/decision contract provides authoritative on-chain replay protection.

## Rule 9 — Secrets never enter Git

Never commit:

- private keys
- seed phrases
- API keys
- passwords
- production credentials
- wallet exports
- `.env` files containing secrets

## Rule 10 — Small increments

Implement and test one milestone at a time. Do not generate the entire project in one operation.

---

# 5. Phase 0 — Inspect before coding

Do not modify implementation code immediately.

First:

1. inspect repository structure
2. inspect package managers
3. inspect existing contracts
4. inspect existing deployment scripts
5. inspect existing tests
6. inspect existing Attestcoin SDK usage
7. inspect existing chain configuration
8. identify exact Proof Builder integration patterns
9. identify exact verifier/precompile interface
10. run the existing test/build commands

Return a short plan before making major changes.

If an existing tutorial implementation already solves a protocol-specific problem, reuse or adapt it rather than creating a second incompatible implementation.

---

# 6. Source contract implementation

Implement the smallest useful ProofMind source-chain contract.

The event should include all downstream data required by the application.

For example, a lending-style demonstration might include:

```solidity
event ProofMindAction(
    address indexed user,
    uint256 amount,
    bytes32 actionId
);
```

The exact event schema must follow `10-smart-contracts.md`; do not silently substitute another schema.

Requirements:

- explicit validation
- clear custom errors where useful
- clear event names
- no unnecessary source-chain state
- deterministic action/event identity
- tests
- Sepolia deployment script

---

# 7. Attestcoin Smart Contract implementation

The ASC is the cryptographic trust boundary.

It must:

1. receive the documented proof payload
2. receive encoded source transaction data
3. call the documented verifier precompile
4. reject invalid proof results
5. decode verified transaction/event data
6. validate expected source contract/event identity
7. derive the canonical `VerifiedFact`
8. reject duplicate source events
9. call the business/decision contract when appropriate
10. emit useful execution/evidence events

Do not fabricate the ABI for the verifier precompile. Use the existing Creditcoin tutorial/reference implementation.

The current documented CC3 testnet BlockProver precompile address is:

```text
0x0000000000000000000000000000000000000FD2
```

If the official documentation changes, update the configuration/documentation rather than hard-coding a new value throughout the application.

---

# 8. VerifiedFact model

A `VerifiedFact` represents data that has crossed the cryptographic verification boundary.

It should contain enough provenance to answer:

- Which source chain?
- Which source contract?
- Which transaction?
- Which block?
- Which event/log?
- Which proof/verification transaction?
- What exact fields were verified?
- When was the fact verified?

Do not mix raw observations with verified facts.

Use explicit status/type fields if the backend stores both.

---

# 9. Worker implementation

Implement the worker as a durable state machine.

Minimum flow:

```text
DETECTED
→ WAITING_FOR_ATTESTATION
→ ATTESTED
→ PROOF_REQUESTED
→ PROOF_RECEIVED
→ ASC_SUBMITTED
→ EXECUTED
```

Failure handling must be explicit.

The worker must:

- monitor the source contract
- persist discovered events
- recover after restart
- catch up after downtime
- wait for source block attestation
- request proofs
- persist proof-request state
- submit the ASC transaction
- wait for transaction receipt
- retry temporary failures
- stop retrying permanent validation failures
- avoid duplicate submissions
- log structured diagnostic information

Do not rely on in-memory state for critical processing.

Use multiple source RPC endpoints where practical for resilience, but do not introduce unnecessary infrastructure before the MVP works.

---

# 10. Proof Builder integration

The worker must use the exact Proof Builder API documented by the repository/reference implementation.

Expected conceptual inputs include information such as:

- source chain key
- block height
- transaction hash

But **do not assume the exact HTTP path, request body, response schema, or authentication mechanism** without confirming it from the official/reference implementation.

Persist enough information to reproduce/debug a failed proof request.

Never log sensitive credentials.

---

# 11. AI architecture

Use this separation:

```text
VerifiedFact
    ↓
DecisionModel interface
    ↓
AI provider adapter
    ↓
DecisionProposal
    ↓
Schema validation
    ↓
Policy validation
    ↓
Creditcoin decision contract
```

Implement a deterministic mock model first.

Then implement a real provider adapter behind the same interface.

The AI must not receive unverified source-chain data.

The AI output must be strict JSON and must validate against the project's documented schema.

Invalid AI output must be rejected rather than repaired into an executable action silently.

---

# 12. Decision contract

The decision contract is deterministic.

It must enforce:

- authorized ASC caller
- allowed actions
- minimum score
- maximum score
- maximum amount
- supported asset/action parameters
- fact freshness
- decision expiry
- replay protection
- valid recipient/user address
- any application-specific invariants

A proposal outside policy must revert.

Do not implement arbitrary `execute(address target, bytes calldata data)` functionality for the AI.

---

# 13. Backend

The backend provides evidence, state, APIs, and AI orchestration.

Suggested entities:

```text
SourceEvent
VerifiedFact
ProofAttempt
ProcessingAttempt
AIDecision
Execution
TimelineEvent
```

Each entity should have timestamps and enough state to diagnose failures.

The backend must distinguish:

```text
OBSERVED
VERIFIED
AI_PROPOSED
POLICY_ACCEPTED
EXECUTED
FAILED
```

Do not collapse these into one `status=success` field.

---

# 14. Dashboard

The dashboard should be evidence-first.

For one event, display:

```text
Source Event
   ↓
Attestation
   ↓
Proof Generation
   ↓
ASC Verification
   ↓
Verified Fact
   ↓
AI Decision
   ↓
Policy Validation
   ↓
Creditcoin Execution
```

Every important step should link to or display its public transaction identifier when available.

Clearly label mocked/local data.

Do not create an admin button that bypasses the normal verification/execution path.

---

# 15. API rules

Implement only the endpoints described in `27-api-contract.md` unless a new endpoint is necessary for a documented feature.

Use consistent errors:

```json
{
  "error": {
    "code": "PROOF_NOT_READY",
    "message": "Proof is not available yet",
    "retryable": true
  }
}
```

Never expose secrets or private internal credentials.

---

# 16. Test strategy

Tests are mandatory at each boundary.

## Contracts

Test:

- valid execution
- invalid proof
- invalid event data
- unauthorized caller
- replay
- expired decision
- score below threshold
- amount above limit
- unsupported action

## Worker

Test:

- event discovery
- restart recovery
- missed-event catch-up
- attestation not ready
- proof service failure
- retry/backoff
- ASC failure
- receipt confirmation
- duplicate event

## AI

Test:

- valid JSON
- malformed JSON
- missing fields
- invalid enum
- out-of-range score
- excessive amount
- expired proposal

## End-to-end

Prove:

```text
Sepolia tx
→ source event
→ worker
→ attestation
→ proof
→ ASC verification
→ VerifiedFact
→ AI decision
→ decision contract
→ Creditcoin execution
```

Do not claim an end-to-end test passed if one of the cryptographic/protocol stages was mocked.

---

# 17. Environment

Initial MVP configuration:

```text
Source: Ethereum Sepolia
Execution: Creditcoin CC3 Testnet
```

Document all endpoints and addresses in `25-environment-and-configuration.md`.

Use environment variables for credentials and replaceable network configuration.

Use a deployment manifest for public addresses and transaction hashes.

---

# 18. Git and implementation discipline

Use small, understandable commits.

Preferred commit categories:

```text
feat(source): ...
feat(asc): ...
feat(worker): ...
feat(ai): ...
feat(api): ...
feat(ui): ...
test(...): ...
docs(...): ...
fix(...): ...
```

Never commit generated secrets or local database files.

Do not rewrite unrelated tutorial material merely to make ProofMind easier to implement.

---

# 19. Decision log

When implementation deviates from documentation or tutorial behavior, update:

```text
projects/proofmind/DECISIONS.md
```

Each decision should include:

- date
- decision
- reason
- alternatives considered
- affected components
- migration/compatibility impact

---

# 20. Failure handling

When something fails:

1. identify the exact boundary
2. capture the error
3. inspect the relevant official/reference implementation
4. verify network configuration
5. verify ABI/schema/address
6. reproduce with the smallest possible test
7. fix the boundary
8. add a regression test
9. document important architectural changes

Do not hide an error with a mock or hard-coded successful response.

---

# 21. Security checklist

Before completion verify:

- [ ] no private keys in Git
- [ ] no API keys in Git
- [ ] AI cannot select arbitrary contract targets
- [ ] AI cannot construct arbitrary calldata
- [ ] worker data is not trusted as proof
- [ ] proof verification occurs before verified fact creation
- [ ] source contract/event identity is checked
- [ ] ASC caller permissions are enforced
- [ ] replay protection exists
- [ ] decision expiry exists
- [ ] amount limits exist
- [ ] score limits exist
- [ ] invalid AI output is rejected
- [ ] dashboard cannot bypass protocol controls

---

# 22. Definition of done

Do not call ProofMind complete until all applicable items are true:

### Source chain

- [ ] contract deployed to Sepolia
- [ ] event emitted
- [ ] event data contains required fields

### Attestcoin

- [ ] worker detects event
- [ ] block attestation is observed
- [ ] proof request succeeds
- [ ] proof is submitted to ASC
- [ ] verifier precompile accepts valid proof
- [ ] invalid proof is rejected

### Verified fact

- [ ] source transaction provenance recorded
- [ ] verified fact created only after verification

### AI

- [ ] AI receives verified facts only
- [ ] output schema validated
- [ ] mock provider works
- [ ] real provider adapter works when configured

### On-chain policy

- [ ] decision contract enforces bounds
- [ ] unauthorized execution rejected
- [ ] replay rejected
- [ ] expired decisions rejected
- [ ] excessive actions rejected

### Worker

- [ ] restart recovery works
- [ ] retries work
- [ ] duplicates are prevented

### Dashboard

- [ ] evidence timeline works
- [ ] transaction hashes are visible
- [ ] mock vs real status is clear

### Documentation

- [ ] setup works from clean checkout
- [ ] deployment manifest is updated
- [ ] important decisions are recorded
- [ ] demo checklist is complete

---

# 23. How to work with the human developer

When a task is ambiguous:

- inspect the repository first
- inspect the relevant ProofMind document
- inspect existing tutorial code
- propose the smallest compatible implementation
- explain the decision before making a risky architectural change

Do not ask the developer to manually reconstruct information that is already present in the repository.

When you finish a milestone, report:

1. files created/changed
2. functionality implemented
3. tests added/run
4. commands used
5. environment variables required
6. remaining blockers
7. exact next milestone

---

# 24. Final instruction

**Build a small, real, testable system. Do not build a huge fake system.**

A working Sepolia → Attestcoin → Creditcoin flow with a deterministic mock AI and a clearly bounded decision contract is more valuable than a visually impressive dashboard backed by mocked cross-chain verification.

Every implementation decision must be traceable to:

1. the ProofMind documentation,
2. the existing Creditcoin/Attestcoin reference implementation, or
3. an explicit entry in `DECISIONS.md`.

If a protocol-specific detail is unknown, do not guess. Stop at the boundary, identify the missing information, and document it.
