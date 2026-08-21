# Prompt 16 — ASC Submission

Implement the final worker stage that submits the documented proofs and encoded transaction to the ASC.

Before sending, verify network, contract address, event identity, proof metadata, and idempotency state. Estimate/validate transaction requirements using the actual SDK/provider. Persist submission tx hash and lifecycle state.

Handle reverted transactions, dropped/replaced transactions, RPC failures, insufficient funds, and duplicate submissions. Test against a controlled contract first; only call the live testnet after configuration is verified.