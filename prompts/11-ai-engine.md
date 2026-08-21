# Prompt 11 — AI Decision Engine

```text
Implement the AI layer as a reasoning component over cryptographically verified facts.

Pipeline:
VerifiedFact → evidence normalization → model adapter → strict structured decision → policy validation → transaction intent.

Requirements:
- AI cannot consume unverified source events as trusted evidence
- model provider must be replaceable
- deterministic mock provider for tests
- strict JSON/schema validation
- explicit confidence/reason fields
- bounded action vocabulary
- no arbitrary calldata
- persist prompt/model/version metadata needed for reproducibility
- reject malformed or unsafe model output

The AI proposes; the Creditcoin contract enforces.

Gate: PASS only when invalid model outputs are rejected and policy validation is independent of the model.
```
