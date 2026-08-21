# ProofMind Security Audit Report

## 1. Executive Summary

This security audit covers the ProofMind codebase, including smart contracts (`SourceSignalEmitter`, `ProofMindAttestcoin`, `ProofMindDecision`), the off-chain worker orchestrator, and the backend decision service. The audit focuses on access control, cryptographic verification, replay attack prevention, input validation, and secret key management.

Overall, the architecture is highly secure due to:
- **Two-phase verification**: Fact verification is performed cryptographically using Attestcoin transaction proofs, and decision execution is verified via authorized AI signatures.
- **Idempotency controls**: Both the fact verification contract and policy decision contract implement mapping-based replay checks.
- **Strong parameter bounds**: Hardcoded safety checks are enforced on-chain.

---

## 2. Smart Contract Audit

### A. ProofMindAttestcoin.sol
- **Replay Protection**: Enforced by setting `processedQueries[queryHash] = true` upon successful submission.
- **Fact Integrity**: The contract verifies that the source transaction was emitted by the configured `sourceContract` address, preventing spoofed logs.
- **Access Control**: Anyone can call `submitProof` since the proof contains a cryptographic signature over the transaction logs from the source chain, which is verified by the precompile. No privileged roles are required, maintaining decentralized operation.
- **Residual Risk (Low)**: Relies on the security of the native EVM precompile at `0x0000000000000000000000000000000000000FD2`. If the precompile is compromised, invalid proofs could be verified. 
  - *Mitigation*: The precompile is native to the Creditcoin validator set.

### B. ProofMindDecision.sol
- **Signature Verification**: Verifies ECDSA signature over the keccak256 hash of: `[evidenceId, decisionVal, score, actionVal, limit, modelVersion, deadline]`. This prevents parameter tampering.
- **Replay Protection**: Once executed, `executed[evidenceId] = true` is set, blocking re-submission of the same signature.
- **Deadline/Expiry**: The `deadline` parameter prevents executing stale signatures.
- **Access Control**: Only the authorized `aiSigner` address is allowed to sign decision proposals. The policy administrator can call `updateAISigner` to rotate keys if needed.
- **Residual Risk (Low)**: Rotation of the `aiSigner` has no delay or multi-sig control.
  - *Mitigation*: Recommend migrating the admin owner to a multi-sig wallet in production.

---

## 3. Off-Chain Components Audit

### A. Worker Orchestrator
- **Idempotency**: The worker queries the Creditcoin chain using `FactVerified` events before submitting, avoiding redundant transaction submission and gas waste.
- **Error Handling**: A retry-limit and state-transition model prevents the worker from getting stuck on malformed block headers or invalid proofs.

### B. Backend API & AI Boundary
- **Sanitization**: Database inputs are bound using SQLite query parameters, preventing SQL injection.
- **Signature Integrity**: Private keys used for signing are kept only in memory or loaded via environment variables; they are never printed in logs or written to disk.

---

## 4. Severity Classifications & Findings

### Findings:
1. **Unprotected AISigner Key Rotation (Info/Low)**:
   - *Description*: The owner of `ProofMindDecision.sol` can rotate the `aiSigner` instantly. If the owner key is compromised, the attacker can hijack the decision engine.
   - *Recommendation*: Use a multi-sig or a DAO governance address as the owner of the policy contract.
2. **Missing Validation of `sourceContract` at Deployment (Info)**:
   - *Description*: `ProofMindAttestcoin.sol` constructor does not validate if `sourceContract` is not `address(0)`.
   - *Mitigation*: The deployment script verifies the address before deployment.

---

## 5. Conclusion

No critical or high-severity vulnerabilities were identified in the codebase. All interfaces are strongly typed and cryptographically secured. The implementation satisfies the security requirements for the MVP stage.
