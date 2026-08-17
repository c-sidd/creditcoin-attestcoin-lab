# Business Logic Contract

The business logic contract owns application state and deterministic rules after cross-chain verification.

## Responsibilities
- Store application state.
- Validate verified values against application rules.
- Expose only the functions the ASC is allowed to call.
- Emit execution events.
- Reject unauthorized callers.

## Combined vs separated
For a very small MVP, verification and business logic can coexist. The preferred design is separated: ASC verifies protocol data, then calls a business/policy contract. This keeps protocol verification and application logic independently testable.

## Required invariants
- Only the authorized ASC may invoke privileged execution functions.
- A source action cannot be executed twice.
- Invalid or incomplete verified data cannot trigger state changes.
- AI output is treated as input to deterministic validation, never as authorization itself.
