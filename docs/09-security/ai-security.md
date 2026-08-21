# AI Security

Threats include prompt injection through untrusted source data, model hallucination, tool abuse, malicious user instructions, provider compromise and output schema confusion.

## Controls
- Treat all source-chain text as untrusted data.
- Keep protocol/evidence fields separate from natural-language instructions.
- Use strict JSON/schema validation.
- Allowlist actions and contracts.
- Never expose signing keys to the model.
- Use deterministic policy checks after model output.
- Log model version/provider and decision ID.
- Support a manual approval mode during development.
- Test adversarial inputs and malformed outputs.

An AI explanation is not cryptographic evidence and must never be rendered as such.
