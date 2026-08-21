# Prompt 12 — Worker Foundation

Create the off-chain worker foundation using the documented architecture.

Implement configuration loading, structured logging, persistent job/event identity, lifecycle states, graceful shutdown, health reporting, and dependency boundaries for source RPC, attestation, proof builder, and Creditcoin RPC.

The worker must recover after restart. Do not keep critical processing state only in memory. Add unit tests for configuration, lifecycle, and persistence. Document run commands and environment variables.