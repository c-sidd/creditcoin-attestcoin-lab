# Source Chain Contract

## Responsibility
Keep source-chain logic minimal. Its primary cross-chain responsibility is to emit explicit, unambiguous events containing all fields required downstream.

## Design rules
- Prefer one ProofMind source contract for all protocol-relevant events.
- Use dedicated event names rather than generic `Transfer`-style events.
- Include actor, action identifier, amount/value fields, destination/context and any other field the ASC needs.
- Emit only after required source-chain business logic succeeds.
- Avoid making the worker infer critical values from unrelated state when the value can be emitted directly.

## Example event shape

```solidity
event ProofMindAction(
    bytes32 indexed actionId,
    address indexed actor,
    uint256 value,
    bytes32 policy,
    uint256 timestamp
);
```

This is a project-design example, not a claim about an Attestcoin-required ABI. Final ABI must be frozen before implementation and shared with the worker and ASC tests.
