# Creditcoin + Attestcoin Lab

Research, protocol notes, architecture, and implementation work for building on Creditcoin and the Attestcoin Protocol.

## Repository Structure

```text
creditcoin-attestcoin-lab/
├── docs/                         # Creditcoin + Attestcoin learning notes
└── projects/
    └── proofmind/                # Hackathon project: verified cross-chain AI
        ├── README.md
        ├── DECISIONS.md
        └── docs/                 # Complete product, protocol, engineering and demo specification
```

## Learning Documentation

- [Hackathon Rules & Requirements](docs/00-hackathon-rules.md)
- [Creditcoin Fundamentals](docs/01-creditcoin-fundamentals.md)
- [CTC, Wallets & Networks](docs/02-ctc-wallets-networks.md)
- [Attestcoin Protocol Architecture](docs/03-attestcoin-architecture.md)
- [Attestcoin Readability](docs/04-attestcoin-readability.md)
- [Attestation](docs/05-attestation.md)
- [Transaction Proving](docs/06-transaction-proving.md)
- [Project-Relevant Takeaways](docs/07-project-takeaways.md)

## Active Project

### ProofMind — Verified Cross-Chain AI Decision Engine

ProofMind is the implementation project in this repository. It is designed around the Attestcoin Protocol Readability flow: a source-chain event is detected, attested, proven with Merkle + continuity proofs, verified by an Attestcoin Smart Contract on Creditcoin, and then consumed by an AI decision layer that can trigger bounded on-chain business logic.

The complete specification lives in [`projects/proofmind/`](projects/proofmind/), with an index at [`projects/proofmind/docs/00-INDEX.md`](projects/proofmind/docs/00-INDEX.md).

## Development Principle

The project documentation is intentionally detailed enough to support AI-assisted/vibe coding. Before implementing a feature, consult the relevant document, preserve the interfaces and event names defined there, and update `DECISIONS.md` when an architectural choice changes.

## Protocol Principle

The strongest Attestcoin integration is one where verified cross-chain data is a real input to application state or execution—not merely a decorative oracle call.
