# Contract Tests

Test at minimum:
- authorized ASC caller succeeds;
- unauthorized caller reverts;
- valid proof path reaches business logic;
- invalid proof path reverts before state change;
- malformed decoded data reverts;
- duplicate source action is rejected;
- invalid/expired intent is rejected;
- policy limits are enforced;
- expected events are emitted;
- zero/maximum boundary values behave correctly.

Prefer deterministic unit tests plus testnet integration tests against the real protocol interfaces.
