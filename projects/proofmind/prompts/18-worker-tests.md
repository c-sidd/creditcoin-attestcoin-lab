# Prompt 18 — Worker Test Suite

Create a complete worker test strategy: unit tests for state transitions and clients; integration tests for source RPC/proof builder/ASC boundaries; recovery tests; duplicate/replay tests; timeout/retry tests; and a controlled end-to-end worker test.

Use fixtures for deterministic external responses. Clearly label simulated tests. Run all tests, collect coverage for critical state transitions, review logs for sensitive data, and update the worker documentation/status.