# Technology Stack

## Protocol / blockchain
- Source chain: Ethereum Sepolia for the initial testnet demonstration, subject to the exact environment configuration in `25-environment-and-configuration.md`.
- Execution chain: Creditcoin CC3 Testnet for the MVP.
- Solidity/EVM-compatible contracts.
- Attestcoin SDK and Proof Builder interfaces must follow the reference repository and official documentation.

## Off-chain
- Worker: Node.js/TypeScript is the preferred project design for event/RPC orchestration.
- Backend: lightweight API service with persistent database; exact framework is an implementation choice and must be recorded before introduction.
- AI: provider adapter behind a stable interface so the model/provider can change without changing blockchain code.

## Frontend
- Web dashboard for event lifecycle, verified evidence, AI decision and execution status.

## Engineering
- Environment variables for secrets and network configuration.
- Structured logs.
- Unit + integration + end-to-end tests.
- Conventional commits for milestone changes.

Protocol-specific versions, RPC URLs, contract addresses and SDK behavior belong in the environment/source-of-truth documents, not duplicated as unexplained constants.
