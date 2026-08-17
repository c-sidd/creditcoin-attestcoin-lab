# Attestcoin SDK Boundary

The repository documents the `@gluwa/usc-sdk` package as the SDK associated with Attestcoin/USC examples.

## Rule for implementation
Use the SDK only where the reference implementation demonstrates the supported operation. Do not infer undocumented methods or parameter ordering from the package name.

## Adapter pattern
Create a small ProofMind adapter:

```text
ProofMind code
    ↓
AttestcoinAdapter
    ↓
@gluwa/usc-sdk / documented HTTP interfaces
```

The rest of the application should not depend directly on SDK internals. This makes SDK upgrades and test mocks manageable.

## Required adapter tests
- correct chain/environment selection;
- proof request serialization;
- response validation;
- ASC transaction construction;
- deterministic handling of malformed responses;
- mocked retry behavior.
