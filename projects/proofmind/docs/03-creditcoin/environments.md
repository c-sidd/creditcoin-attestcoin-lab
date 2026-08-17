# Creditcoin Environments

Use the project's environment document as the single configuration reference. The supplied Creditcoin documentation identifies CC3 Mainnet and CC3 Testnet as Attestcoin-enabled environments.

## MVP target
CC3 Testnet.

The repository's protocol notes record the testnet ASC dashboard, Proof Builder API, Decoder contract, ChainInfo precompile and BlockProver precompile. Do not copy those values into application code until they are confirmed against the current official documentation/reference implementation.

## Mainnet rule
Mainnet is not required for the ideathon MVP. Never silently switch a testnet deployment to mainnet. Mainnet addresses, RPCs and chain keys must be explicit configuration.

## Configuration principle
Every network-specific value must come from environment/configuration and be surfaced in startup diagnostics without exposing secrets.
