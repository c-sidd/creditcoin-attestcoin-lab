# Coding Conventions

- TypeScript/JavaScript: strict typing where supported, async errors handled explicitly.
- Solidity: small functions, explicit visibility, custom errors where appropriate, NatSpec for public interfaces.
- APIs: versioned typed DTOs; never leak stack traces in production responses.
- Database: migrations committed with schema changes.
- Worker: state transitions centralized instead of scattered string assignments.
- Logging: structured fields and correlation IDs.
- Tests: names describe behavior and failure condition.
- Configuration: no hardcoded secrets or environment-specific addresses in business logic.

Prefer small adapters around external services. Protocol-specific code belongs behind the Attestcoin adapter.
