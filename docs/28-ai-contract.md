# 28 — AI Decision Contract

## Principle

AI is a decision assistant, not an oracle and not an unrestricted transaction signer.

The AI receives facts that have already passed cryptographic verification. It produces a structured proposal. The Creditcoin contract decides whether that proposal is permitted.

## Input

The AI input should contain only the minimum verified information required for the decision.

Example:

```json
{
  "factId": "0x...",
  "borrower": "0x...",
  "verifiedAmount": "1000000000000000000",
  "verifiedHistory": {
    "repaidLoans": 4,
    "defaultedLoans": 0
  },
  "sourceBlock": 123456
}
```

Do not send private credentials, unnecessary personal information, or unverified RPC observations.

## Output schema

The model must return machine-readable JSON only:

```json
{
  "decision": "APPROVE",
  "score": 87,
  "action": "ALLOW_LOAN",
  "amount": "1000000000000000000",
  "reasonCodes": ["VERIFIED_REPAYMENT_HISTORY"],
  "expiresAt": 1780000000
}
```

## Validation

The backend must validate:
- JSON syntax
- required fields
- enum values
- integer ranges
- address format
- amount format
- expiry format
- reason-code allowlist

Invalid output becomes a failed AI decision, not an executable transaction.

## On-chain validation

The decision contract must independently enforce:
- allowed actions
- minimum score
- maximum amount
- maximum age of the verified fact
- decision expiry
- authorized caller
- replay protection

The contract must not trust a backend boolean such as `verified=true` when the protocol's proof verification can be performed on-chain.

## Model abstraction

Use an interface similar to:

```text
DecisionModel
  └── decide(VerifiedFact) -> DecisionProposal
```

Implement:
- deterministic mock model for local tests
- real provider adapter for the final demo

The business logic must depend on the interface rather than one AI vendor.

## Explainability

Store reason codes and the model/version metadata used to create a decision. The dashboard should display these as evidence, while clearly distinguishing model reasoning from cryptographic proof.
