# Prompt 09 — Real ASC Submission

```text
Connect the worker to the deployed/testnet ASC using the exact verified contract interface.

Run one real source-chain event through:
source event → attestation → proof generation → ASC call → receipt.

Capture:
- source contract address
- source transaction hash
- source block
- event parameters
- proof request/result metadata
- ASC address
- Creditcoin transaction hash
- receipt/status

Independently verify the resulting Creditcoin state.

Do not mark complete if any stage is mocked.

Gate: PASS only after a reproducible real testnet transaction succeeds.
```
