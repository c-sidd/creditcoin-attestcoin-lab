# Prompt 06 — Creditcoin Environment

Read the environment and Attestcoin chain configuration docs supplied with the project and inspect the reference implementation.

## Goal
Create a verified configuration layer for the selected CC3 testnet/source-chain environment.

## Do
Centralize RPC endpoints, chain keys, proof-builder endpoint, precompile addresses, decoder address, contract network IDs, and other protocol configuration only when supported by source material. Separate configuration from secrets.

## Rules
Never hard-code private credentials. Never infer a mainnet value from testnet or vice versa. Label testnet/mainnet clearly.

## Verify
Configuration loads successfully; invalid/missing configuration fails clearly; network identity is checked before transactions.

## Documentation
Record source of every protocol-specific value and how operators select an environment.