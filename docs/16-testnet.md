# 16 — Testnet Setup

## Target

Develop and demo on **Creditcoin CC3 Testnet** and **Ethereum Sepolia** first.

## Documented CC3 Testnet values

| Item | Value |
|---|---|
| ASC Dashboard | `https://dashboard.cc3-testnet.creditcoin.network/` |
| Proof Builder | `https://proof-gen-api.cc3-testnet.creditcoin.network/` |
| Decoder | `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f` |
| ChainInfo precompile | `0x0000000000000000000000000000000000000fd3` |
| BlockProver precompile | `0x0000000000000000000000000000000000000FD2` |
| Ethereum Sepolia chain key | `1` |
| Ethereum Mainnet chain key | `3` |

The supplied environment documentation should be treated as the reference; verify current values before a live deployment because environments can change.

## Wallets

Use separate testnet accounts for:

- Source-chain user.
- Source contract deployment.
- Creditcoin deployment.
- Worker/relayer.

Fund testnet accounts only with test assets.

## Setup sequence

1. Install Node.js and package manager.
2. Install Solidity development tooling.
3. Configure Sepolia RPC.
4. Configure CC3 Testnet RPC.
5. Configure Proof Builder URL.
6. Create `.env` from `.env.example`.
7. Deploy source contract.
8. Deploy ASC.
9. Deploy decision contract.
10. Write deployment addresses to a local deployment manifest.
11. Start backend and database.
12. Start worker.
13. Start AI service.
14. Start frontend.
15. Trigger a source event and observe the full flow.

## Environment separation

Use explicit `testnet` configuration. Never reuse a private mainnet key in development scripts.

## Troubleshooting order

When the flow fails, inspect in this order:

1. Source transaction receipt.
2. Source event logs.
3. Worker event record.
4. Attestation status.
5. Proof Builder response.
6. ASC transaction receipt/revert reason.
7. `VerifiedFact` record.
8. AI response validation.
9. Decision transaction receipt.
10. Dashboard state.
