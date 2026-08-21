# Prompt 19 — AI Service Foundation

Read the AI architecture, verified-data pipeline, risk-control, interface, and transaction-intent docs.

Create a provider-agnostic AI service boundary. The AI must consume structured application data, not raw unverified blockchain claims. Separate model/provider code from deterministic validation and policy code.

Implement configuration, request/response schemas, provider abstraction, timeouts, structured logs, and tests using a deterministic fake provider. Never place secrets in source. Document provider assumptions and local execution.