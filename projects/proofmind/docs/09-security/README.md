# 09 — Security

ProofMind has three independent trust boundaries: cross-chain proof verification, AI reasoning, and on-chain enforcement.

## Threat areas

- forged/malformed source event data
- invalid proofs
- replayed source events
- compromised worker
- malicious RPC responses
- Proof Builder outage or manipulation
- prompt injection through untrusted data
- malformed AI output
- excessive action amount
- expired decision
- unauthorized contract caller
- leaked signing keys
- dashboard/API spoofing

## Security principle

Never solve an on-chain authorization problem only in an off-chain component.

## Secrets

Private keys, RPC credentials and model/API keys belong in environment/secret management and must never be committed. `.env.example` contains names/placeholders only.
