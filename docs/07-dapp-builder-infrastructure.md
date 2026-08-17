# dApp Builder Infrastructure

> Based on the Creditcoin Attestcoin Protocol documentation. Educational research notes; not production deployment guidance.

## 1. Overview

Attestcoin Protocol is designed to let dApp builders create applications whose smart contracts can verify events and transactions from supported source chains and then execute business logic on Creditcoin.

A practical dApp integration consists of four main components:

```text
Source Chain Smart Contract
          ↓
Readability Worker
          ↓
Attestcoin Smart Contract (ASC)
          ↓
Business Logic Contract
```

The worker operates off-chain, while the contracts execute and verify logic on-chain.

## 2. Source Chain Smart Contract

The source-chain contract is deployed on a supported source chain such as Ethereum or Sepolia.

### What to implement

- Implement the dApp's source-chain logic.
- Emit events containing the data that must later be verified on Creditcoin.
- Structure events so relevant fields can be extracted easily.
- Perform source-chain operations such as token burning when required.

The source-chain contract should remain as minimal as practical. Ideally, its main cross-chain responsibility is to emit clearly defined events. Business logic that must happen on the source chain can execute before the event is emitted.

### Example

For a token bridge, the source contract could emit a `TokensBurnedForBridging` event when a user burns tokens.

```text
User
  ↓
Source-chain contract
  ↓
Tokens burned
  ↓
TokensBurnedForBridging event
```

The event becomes the trigger for the off-chain Readability Worker.

## 3. Attestcoin Smart Contract (ASC)

The ASC is deployed on Creditcoin and is responsible for turning verified cross-chain data into dApp actions.

### Main responsibilities

1. Receive Merkle proofs, continuity proofs, and encoded transaction data.
2. Call the native Block Prover / Query Verifier Precompile at `0x0FD2`.
3. Verify the proofs synchronously.
4. Decode the verified transaction data.
5. Validate application-specific conditions.
6. Execute or trigger dApp business logic.

Conceptually:

```text
Proofs + Encoded Transaction
            ↓
          ASC
            ↓
   Block Prover Precompile
            ↓
     Verified transaction
            ↓
      Decode event/data
            ↓
       Business logic
```

The ASC should not assume that transaction inclusion automatically means the transaction succeeded. Application logic should check the transaction/receipt status and confirm the expected event or conditions.

## 4. dApp Business Logic Contracts

Business logic contracts are deployed on Creditcoin and contain the application's state and rules.

### Combined pattern

The ASC and business logic live in one contract. This is suitable for simple applications.

### Separated pattern

The ASC handles cross-chain verification and calls a separate business logic contract. This is generally better for complex dApps because verification and application logic remain modular.

### Access control

The business logic contract should normally restrict sensitive functions so that only the authorized ASC can invoke them.

For example, a bridge token contract might grant the ASC permission to mint tokens after a valid source-chain burn has been verified.

## 5. Readability Worker

The Readability Worker is an off-chain service that watches the source chain and submits verified transactions to the ASC.

### Responsibilities

1. Listen for relevant events from the source-chain contract.
2. Wait until the block containing the event has been attested on Creditcoin.
3. Request Merkle and continuity proofs from the Proof Builder service.
4. Submit the proofs and encoded transaction data to the ASC.
5. Retry failed transactions when appropriate.
6. Track processing state.
7. Prevent duplicate processing of the same event.

### Basic flow

```text
1. Detect Event
       ↓
2. Wait for Attestation
       ↓
3. Request Proof
       ↓
4. Receive Proofs
       ↓
5. Call ASC
       ↓
6. Verify & Execute
```

The worker is an orchestration component; cryptographic verification happens on Creditcoin through the native precompile.

## 6. dApp Design Patterns: Readability

### Keep the source-chain contract minimal

The source-chain contract should focus on emitting events containing the data needed by the ASC. Any unavoidable source-chain business logic, such as burning tokens, happens before the event.

### Use a single source-chain contract where practical

An ASC-enabled dApp should ideally have one source-chain contract emitting the relevant readability events. This lets the worker monitor one contract address.

### Use unambiguous events

Prefer specific events for each cross-chain action:

```text
LoanInitiated
LoanRepaid
TokensBurnedForBridging
```

Avoid using generic events such as a standard `Transfer` event as the sole trigger for cross-chain functionality.

### Include all required data

Events should contain the information the Creditcoin ASC needs. For example:

```text
TokensBurnedForBridging(
    from,
    recipient,
    amount
)
```

If the source event does not contain required data, the ASC may not have enough information to execute the destination-chain business logic safely.

## 7. Complete Cross-Chain Flow

```text
User signs transaction on source chain
                ↓
Source contract emits event
                ↓
Readability Worker detects event
                ↓
Worker waits for source block attestation
                ↓
Worker obtains Merkle + continuity proofs
                ↓
Worker calls ASC on Creditcoin
                ↓
ASC calls Block Prover Precompile
                ↓
Proofs are verified synchronously
                ↓
ASC extracts verified transaction/event data
                ↓
ASC calls Business Logic Contract
                ↓
Creditcoin dApp state is updated
```

## 8. Offchain Readability Worker: Reliability Design

The worker provides the automation that makes the cross-chain UX seamless. Without a worker, users would have to wait for attestation, obtain proofs, format them, and submit a second transaction themselves.

A robust worker should:

- Persist events that are currently being processed.
- Catch up on events missed during shutdowns.
- Track processed events to avoid duplicate submissions.
- Use multiple source-chain RPC endpoints where practical.
- Retry proof-generation failures.
- Retry failed ASC submissions when safe.
- Track processing status and expose useful logs/metrics.

### Logical worker state machine

```text
Monitor source chain
        ↓
Event detected?
   No ───┘
   Yes
    ↓
Wait for attestation
    ↓
Attested?
 No → retry after delay
 Yes
    ↓
Generate proofs
    ↓
Proof generation successful?
 No → retry
 Yes
    ↓
Call ASC
    ↓
ASC call successful?
 No → retry when safe
 Yes
    ↓
Verification + business logic
    ↓
Success
```

The documentation also describes future third-party relayers that may provide readability query submission as a paid service, allowing dApp teams to avoid operating their own worker.

## 9. Example: Token Bridge

A simplified bridge demonstrates the architecture well.

### Source chain

```text
User
 ↓
Bridge contract on Ethereum
 ↓
Burn tokens
 ↓
TokensBurnedForBridging(user, amount, recipient)
```

### Worker

The worker detects the event, waits for the relevant Ethereum block to be attested, obtains the required proofs, and sends them to the ASC.

### Creditcoin ASC

The ASC:

1. Verifies transaction inclusion using the Merkle proof.
2. Verifies source-chain continuity using the continuity proof.
3. Checks transaction/receipt status.
4. Decodes the burn event.
5. Extracts the recipient and amount.
6. Calls the business logic contract.

### Creditcoin business logic

The token contract mints the corresponding wrapped tokens to the verified recipient.

```text
Ethereum
  │
  │ burn + event
  ▼
Readability Worker
  │
  │ proofs + transaction bytes
  ▼
Creditcoin ASC
  │
  │ verified data
  ▼
Creditcoin Token Contract
  │
  ▼
Mint wrapped tokens
```

## 10. Infrastructure Checklist

### Source-chain side

- [ ] Smart contract deployed.
- [ ] Relevant events emitted.
- [ ] Event fields designed for easy extraction.
- [ ] Source-chain RPC access available.

### Off-chain worker

- [ ] Event listener implemented.
- [ ] Attestation status handling implemented.
- [ ] Proof Builder integration implemented.
- [ ] ASC transaction submission implemented.
- [ ] Retry handling implemented.
- [ ] Duplicate-event protection implemented.
- [ ] Processing status/logging implemented.
- [ ] Missed-event recovery implemented.
- [ ] Multiple RPC endpoint support considered.

### Creditcoin contracts

- [ ] ASC deployed.
- [ ] Block Prover Precompile integration implemented.
- [ ] Transaction status checked.
- [ ] Expected event/data validated.
- [ ] Business logic contract deployed.
- [ ] ASC access permissions configured.
- [ ] Replay/duplicate processing protection implemented.

## 11. Important Security Principle

The worker and relayer infrastructure should not be treated as the ultimate source of truth.

The worker can submit data and proofs, but the ASC must rely on the native cryptographic verification path:

```text
Off-chain worker
      │
      │ supplies proofs
      ▼
ASC
      │
      ▼
Block Prover Precompile
      │
      ├─ Merkle proof verification
      └─ Continuity proof verification
      │
      ▼
Verified source-chain transaction
```

A malicious or faulty worker should not be able to turn an invalid source-chain transaction into valid application state as long as the ASC correctly performs proof verification and application-specific validation.

## 12. Key Takeaway

| Component | Main responsibility |
|---|---|
| Source Chain Contract | Produce the event/data |
| Readability Worker | Detect events, obtain proofs, submit ASC calls |
| ASC | Verify cross-chain data and trigger logic |
| Block Prover Precompile | Cryptographically verify proofs |
| Business Logic Contract | Maintain dApp state and execute rules |

The architecture separates event production, off-chain orchestration, cryptographic verification, and application logic. This gives builders a reusable pattern for cross-chain applications while keeping the security-critical verification path on Creditcoin.

## Source

Creditcoin Docs — dApp Builder Infrastructure and Attestcoin Readability Design Patterns.
