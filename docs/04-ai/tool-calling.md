# Tool Calling

Tool calling is optional MVP functionality. If implemented, tools are read-oriented by default.

## Tool classes
- **Read tools:** query stored verified evidence, status, balances or application state.
- **Planning tools:** calculate a proposed action without side effects.
- **Write tools:** not exposed directly to the model; the model creates a transaction intent that a deterministic executor validates.

## Tool contract
Every tool defines name, purpose, input schema, output schema, authorization requirements, timeout, retry policy and whether it has side effects.

Unknown tools, unknown fields and malformed outputs must fail closed.
