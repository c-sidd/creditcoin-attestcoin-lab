# Verified Data Pipeline

A record is eligible for AI reasoning only after the application has evidence that the ASC accepted the relevant source transaction proof.

```text
source event
  → source tx reference
  → attestation observed
  → proof package obtained
  → ASC tx submitted
  → ASC success observed
  → normalized verified record
  → AI context
```

## Required fields
- source chain identifier;
- source block number/hash;
- source transaction hash;
- source contract address;
- event identifier/log reference;
- relevant decoded fields;
- attestation/proof processing references;
- ASC transaction hash;
- verification status;
- timestamps.

## Data lineage
Every AI decision stores references to the exact verified records used. If evidence changes, the decision must be treated as a new decision rather than silently updating history.
