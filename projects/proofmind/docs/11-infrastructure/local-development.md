# Local Development

## Prerequisites
- Node.js and package manager compatible with the implementation.
- Git.
- Docker if the chosen backend/database uses containers.
- A testnet wallet only when chain integration is required.

## Local layers
Run protocol-independent services locally first:
1. backend/database;
2. worker with mocked Attestcoin adapter;
3. AI provider with a mock adapter;
4. frontend.

Then enable testnet adapters using explicit environment configuration.

## Principle
The default local command should not spend real funds or call mainnet. Testnet integration must be an explicit configuration choice.
