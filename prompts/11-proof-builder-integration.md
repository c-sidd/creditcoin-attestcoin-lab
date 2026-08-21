# Prompt 11 — Proof Builder Integration

Read the official Proof Builder documentation and existing SDK/reference implementation. Implement a typed client for the documented proof-builder API.

Handle request parameters, response validation, timeouts, retries at the correct layer, malformed responses, HTTP errors, and correlation IDs. Never fabricate proofs in production paths.

Add contract/worker-compatible proof types and fixtures only for tests. Verify request/response compatibility against the documented endpoint. Record the exact API assumptions and any unavailable live dependency.