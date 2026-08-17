# Prompt 08 — ASC Contract Tests

Build a dedicated test matrix for the ASC. Test proof acceptance/rejection, verifier failure, malformed encoded transactions, authorization, replay protection, event extraction, downstream business-logic success/failure, and atomicity.

Use real protocol components where the test environment supports them; otherwise isolate mocks behind explicit interfaces and label the test as simulated.

Run compile + unit/integration tests and inspect emitted events and state changes. Do not mark the ASC integration complete without evidence of actual verifier interaction when the environment permits it.

Update status, test docs, and known limitations.