# ProofMind Test Matrix

| Scenario | Expected result |
|---|---|
| Valid source event | detected and persisted |
| Worker restart before attestation | resumes from durable state |
| Block not attested | waits/retries |
| Proof Builder transient error | bounded retry |
| Invalid proof | ASC rejects; no verified fact |
| Malformed encoded tx | no execution |
| Same event twice | second execution rejected/ignored |
| Unauthorized decision call | contract rejects |
| Score below threshold | contract rejects |
| Amount above limit | contract rejects |
| Expired decision | contract rejects |
| Unsupported action | contract rejects |
| AI malformed JSON | proposal rejected |
| AI unavailable | workflow remains recoverable |
| RPC outage | worker switches/retries without losing state |
| Creditcoin tx failure | state retained for safe retry/inspection |

## Evidence requirement

A passing E2E test must record the relevant transaction hashes, contract addresses, workflow ID and final state. Screenshots alone are not sufficient evidence of protocol execution.
