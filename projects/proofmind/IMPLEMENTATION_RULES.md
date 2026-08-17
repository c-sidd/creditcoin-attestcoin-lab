# ProofMind Implementation Rules

## Purpose

This document is the mandatory engineering rulebook for implementing ProofMind with Antigravity or any other coding agent.

The goal is to prevent hallucinated protocol behavior, accidental architecture drift, unsafe AI authority, incomplete integrations, and false completion claims.

---

## 1. Source-of-truth hierarchy

Use sources in this order:

1. Official Creditcoin/Attestcoin documentation.
2. Preserved Creditcoin tutorial/reference implementation in `examples/usc-testnet-bridge-examples`.
3. ProofMind project documents under `docs/`.
4. Existing implementation code and tests.
5. General engineering knowledge only where the above sources are silent.

If two sources conflict, **stop**. Do not silently choose one. Record the conflict and resolution in `DECISIONS.md`.

---

## 2. Never invent Creditcoin behavior

Do not invent or guess:

- precompile ABI;
- Proof Builder endpoint/request/response fields;
- Attestcoin SDK methods;
- proof encoding;
- chain keys;
- contract addresses;
- attestation semantics;
- transaction-decoding rules;
- undocumented gas behavior;
- undocumented protocol guarantees.

Before implementing a protocol-specific boundary, inspect the official documentation and reference code.

If the exact behavior cannot be verified, leave a clearly marked adapter boundary and stop that milestone rather than fabricating an implementation.

---

## 3. Three information classes must remain separate

Every important design statement belongs to exactly one category:

### Creditcoin fact
A behavior supported by Creditcoin documentation/reference code.

### ProofMind project design
A decision made by this project.

### Implementation note
A concrete coding, API, file, command, test, or deployment instruction.

Never present a project decision as if Creditcoin requires it.

---

## 4. AI is never the oracle

ProofMind must preserve this trust boundary:

```text
Source-chain fact
      ↓
Attestcoin cryptographic verification
      ↓
VerifiedFact
      ↓
AI reasoning
      ↓
Structured decision / transaction intent
      ↓
Deterministic policy validation
      ↓
Smart-contract enforcement
```

The AI may interpret verified data and propose an action. It must not create, modify, or certify the underlying blockchain fact.

AI output is untrusted input until schema validation and deterministic policy checks succeed.

---

## 5. Smart contracts remain the enforcement layer

Critical authorization and business invariants must not depend solely on an LLM response.

Contracts must enforce, where applicable:

- caller authorization;
- allowed action types;
- bounds and limits;
- replay protection;
- state transitions;
- verified-source requirements;
- nonce/event uniqueness;
- token/account invariants.

Never put a private key or unrestricted signing authority into an LLM prompt.

---

## 6. No giant implementation jump

Antigravity must work milestone-by-milestone.

For each milestone:

1. Read the relevant documentation.
2. Inspect existing/reference code.
3. State the implementation plan.
4. Implement the smallest coherent change.
5. Run targeted tests.
6. Run relevant integration checks.
7. Inspect the resulting files/diff.
8. Update documentation.
9. Record important decisions.
10. Produce evidence.
11. Only then move to the next milestone.

Do not implement the entire project in one uncontrolled pass.

---

## 7. Completion cannot be claimed from file creation

A milestone is **COMPLETE** only when all of the following are true:

- required code exists;
- interfaces match the specification;
- automated tests pass;
- negative/error paths are tested where applicable;
- integration behavior is verified;
- documentation reflects the implementation;
- required evidence is recorded;
- no known blocker remains for that milestone.

Use `PLANNED`, `IN_PROGRESS`, `BLOCKED`, `VERIFIED`, and `COMPLETE` explicitly.

`COMPLETE` must never mean "code was generated".

---

## 8. Preserve existing reference material

Do not rewrite or delete the Creditcoin tutorial/reference implementation merely to make ProofMind fit it.

Reuse its patterns where appropriate, but keep ProofMind-specific code isolated under `projects/proofmind/`.

---

## 9. Freeze interfaces before dependent implementation

Before implementing dependent components, freeze and document:

- source-chain events;
- proof request/response boundary;
- VerifiedFact schema;
- AI input/output schema;
- transaction intent schema;
- contract function signatures;
- contract events;
- backend API contracts;
- worker state transitions.

If an interface must change later, update the specification and `DECISIONS.md` first.

---

## 10. Event design rules

Source-chain events must be explicit and unambiguous.

Prefer dedicated events such as:

```text
ActionRequested
LoanCreated
LoanRepaid
TokensBurnedForBridging
```

over generic events when the event is intended to trigger cross-chain processing.

Include every field required downstream. Do not require the AI to reconstruct missing blockchain facts from external sources.

---

## 11. Worker reliability rules

The worker must be designed for failure.

It must account for:

- process restart;
- missed events;
- duplicate events;
- duplicate submissions;
- source RPC failure;
- attestation delay;
- Proof Builder failure;
- Creditcoin RPC failure;
- transaction rejection;
- timeout;
- partial progress.

Use persistent state and idempotency. Never rely only on in-memory state.

---

## 12. Retry rules

Retries must be bounded and observable.

For every retryable operation document:

- what is retryable;
- maximum attempts or retry policy;
- backoff strategy;
- terminal failure state;
- logging/metrics;
- whether retrying can cause duplicate execution.

Never blindly retry an operation that could execute business logic twice without idempotency protection.

---

## 13. Security rules

Never commit:

- private keys;
- seed phrases;
- API secrets;
- RPC credentials;
- production credentials;
- `.env` files containing real secrets.

Use `.env.example` with placeholders.

All externally supplied values must be validated.

Treat AI output, worker messages, API requests and decoded transaction fields as untrusted until validated at the appropriate boundary.

---

## 14. Testing rules

Every subsystem must have tests appropriate to its failure modes.

### Contracts
Test:

- happy path;
- unauthorized caller;
- malformed input;
- invalid proof/verification result;
- replay;
- boundary values;
- failed downstream call.

### Worker
Test:

- event detection;
- restart/catch-up;
- attestation waiting;
- proof failure;
- ASC failure;
- duplicate event;
- successful completion.

### AI
Test:

- valid structured response;
- malformed output;
- unsupported action;
- missing verified fact;
- policy rejection;
- provider failure;
- deterministic safety checks.

### E2E
Test the real chain where feasible, not only mocks.

---

## 15. Mock boundaries explicitly

Mocks are useful for development but must never be confused with protocol verification.

Every mock must clearly state:

- what real system it replaces;
- what behavior it simulates;
- what cannot be proven by the mock;
- which testnet/integration test replaces it.

A mock Proof Builder response is not evidence of real Attestcoin proof generation.

---

## 16. Configuration rules

All environment-dependent values must be centralized.

Do not scatter RPC URLs, chain IDs, chain keys, addresses or API URLs through source code.

Separate:

- local development;
- testnet;
- production/future deployment.

Never silently fall back from one environment to another.

---

## 17. Observability rules

Every asynchronous cross-chain operation must have a traceable identifier.

At minimum track:

- source transaction hash;
- source block number;
- event identifier/index;
- worker processing status;
- proof request status;
- ASC transaction hash;
- verified fact identifier;
- AI decision identifier;
- final execution transaction hash;
- failure reason.

Logs must not expose secrets.

---

## 18. Documentation is part of implementation

When behavior changes, update the relevant documentation in the same milestone.

At minimum update:

- project status;
- relevant specification;
- API/data contracts if changed;
- diagrams if flow changed;
- `DECISIONS.md` if architecture changed;
- changelog when the change is meaningful.

Do not leave documentation for the end.

---

## 19. Decision-record rule

Create a decision record whenever a change affects:

- architecture;
- trust model;
- protocol integration;
- contract interface;
- AI authority;
- data model;
- security model;
- infrastructure choice.

Each decision should record:

```text
Context
Decision
Alternatives considered
Reason
Consequences
Date
```

---

## 20. Protocol changes require re-verification

Creditcoin/Attestcoin behavior may change over time.

Before testnet integration, re-check the current documented:

- environment;
- chain key;
- RPC;
- Proof Builder URL;
- decoder/precompile addresses;
- SDK/package version;
- reference tutorial behavior.

Do not blindly rely on an old copied value.

---

## 21. No production claims

This project is an educational/ideathon implementation unless explicitly hardened and reviewed for production.

Do not describe testnet functionality as production-ready.

Do not claim cryptographic/security guarantees beyond what was actually verified.

---

## 22. Antigravity stop conditions

Antigravity must stop and ask for/perform verification instead of guessing when:

- a required Creditcoin API is undocumented;
- reference code and docs disagree;
- a contract ABI is unknown;
- a proof format is unknown;
- a required testnet resource is unavailable;
- a security invariant is unclear;
- a destructive migration is required;
- a private key/secret would be required in source code;
- an architectural decision is ambiguous.

---

## 23. Required evidence

For each completed milestone, save concise evidence under `evidence/` where applicable.

Evidence can include:

- test output;
- deployment addresses;
- transaction hashes;
- API request/response examples with secrets removed;
- screenshots;
- logs;
- contract event output;
- E2E run summary.

Never fabricate evidence.

---

## 24. Final E2E definition

ProofMind is not end-to-end complete until the intended testnet scenario can be demonstrated from:

```text
User action
→ Source-chain transaction
→ Source event
→ Attestation
→ Proof Builder
→ ASC verification
→ VerifiedFact
→ AI decision
→ deterministic policy validation
→ Creditcoin execution
→ observable final state
```

Exact steps depend on the verified Creditcoin testnet implementation and must be documented from real execution.

---

## 25. Final rule

**When uncertain, verify before coding. When changed, document before continuing. When implemented, test before claiming complete.**
