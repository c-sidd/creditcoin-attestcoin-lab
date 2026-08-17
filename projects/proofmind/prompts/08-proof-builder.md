# Prompt 08 — Proof Builder Integration

```text
Implement the Proof Builder client only from a verified request/response contract.

Document:
- endpoint
- method
- authentication if any
- chain key
- block height/transaction identifier fields
- response proof fields
- encoded transaction representation
- error responses
- retryable versus permanent failures

Use the actual testnet endpoint configured by the project documentation/reference. Never fabricate payload fields.

Add mocked client tests for success and failure, plus a configurable integration test that performs a real request when TESTNET integration is enabled.

Gate: PASS for mock contract tests; real integration PASS only after an actual successful response is captured as evidence.
```
