# 15 — Gas Cost

## Documented verification equation

The supplied Creditcoin documentation gives an approximate readability cost relationship:

`CTC Cost ≈ 2.3×10^-5 + 2.9×10^-7 × continuity hash count`

The exact live cost should be measured on the target environment; this equation is an estimate, not a pricing guarantee.

## Main cost driver

Continuity proof length has a large effect because each block in the continuity proof requires hashing work. Historical transactions can therefore cost more than recently finalized transactions.

## Merkle proof effect

Merkle proof size changes with the number of transactions in a block, but the supplied documentation describes this as a comparatively small effect.

## Transaction decoding

Most transactions have negligible decoding cost, but unusually large transactions can be expensive. The documentation gives an estimated maximum decoding workload of `0.0375 CTC` for the described outlier case.

## Example documented scenarios

- 10 continuity hashes: approximately `2.59×10^-5 CTC`.
- 1000 continuity hashes: approximately `3.13×10^-4 CTC`.

The documentation notes that the second scenario is more than 10× the first.

## Engineering implications

1. Process recently finalized events promptly.
2. Avoid repeatedly requesting verification of unnecessarily large transactions.
3. Do not optimize the MVP around tiny gas differences before the end-to-end flow works.
4. Record actual gas used by ASC transactions for the final demo report.

## Gas telemetry

The worker/dashboard should record:

- gas used
- transaction hash
- CTC fee where available
- continuity hash count if exposed by the proof response
- timestamp

This makes the demo more credible because judges can see the real protocol execution cost.
