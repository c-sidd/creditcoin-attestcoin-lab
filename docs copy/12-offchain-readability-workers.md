# Offchain Readability Workers

> **Note:** The Creditcoin documentation states that the information and code snippets are educational and should not be directly deployed in production.

## Motivation

Attestcoin Readability normally involves two transactions:

1. The user submits a transaction on the source chain, usually calling a source-chain smart contract that emits an event.
2. The ASC contract is called on Creditcoin with proofs and encoded transaction data.

An off-chain worker can initiate the second transaction automatically on behalf of the user.

## Why Use a Worker?

### Seamless user experience

Without a worker, users would need to wait for attestation, generate proofs, format proof data, and submit a second transaction. A worker handles these steps automatically.

### Lower technical complexity

The worker handles proof generation, attestation timing, retries, and proof formatting.

### Reliability

Workers can implement retry logic, error handling, duplicate prevention, and recovery from service or network failures.

### Monitoring

Workers can track events in progress, processing status, failures, and successful ASC execution.

## Worker Transaction Flow

1. **Monitor source chain:** Watch the source-chain contract for relevant events such as `TokensBurnedForBridging`.
2. **Wait for attestation:** Wait until the block containing the event has been attested on Creditcoin.
3. **Generate proofs:** Request Merkle and continuity proofs from the Proof Builder service.
4. **Call ASC:** Submit proofs and encoded transaction data to the ASC.
5. **Handle results:** Observe ASC events and record successful execution or retry failures.

## Robustness Requirements

A production-oriented worker should:

- Persist events currently being processed so work survives shutdowns.
- Catch up on events missed during downtime.
- Avoid submitting multiple ASC calls for the same event.
- Track processed events for replay protection at the worker level.
- Follow multiple source-chain RPC nodes rather than relying on a single endpoint.
- Retry failed proof-generation requests.
- Retry failed ASC submissions when appropriate.
- Record processing status and useful diagnostics.

## Logical State Flow

```text
Monitor source chain
        |
        v
Event detected?
   | yes
   v
Wait for attestation
        |
        v
Block attested?
   | yes
   v
Generate proofs
        |
        v
Proof generation successful?
   | yes
   v
Call ASC with proofs
        |
        v
ASC call successful?
   | yes
   v
ASC verifies proofs synchronously
        |
        v
Business logic executes
        |
        v
Success
```

Failures should return to the relevant retry stage rather than losing the event.

## Key Takeaway

The worker is the automation layer connecting the source-chain event to Creditcoin execution. The user signs the source transaction once; the worker waits, proves, submits, retries, and tracks the cross-chain execution in the background.
