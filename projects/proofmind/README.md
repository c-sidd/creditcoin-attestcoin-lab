# ProofMind

Autonomous Cross-Chain Policy Enforcement utilizing Creditcoin CC3 and Attestcoin.

## Project Structure

```text
projects/proofmind/
├── README.md
├── DECISIONS.md
├── contracts/          # Solidity Smart Contracts (Hardhat-based)
│   ├── source-chain/   # Source chain contracts (Ethereum Sepolia)
│   ├── creditcoin/     # Creditcoin destination contracts
│   └── interfaces/     # Interfaces and ABIs
├── worker/             # Off-chain event listener & proof orchestrator (TypeScript)
├── backend/            # Express.js API & AI decision engine backend (TypeScript)
├── dashboard/          # React/Vite operator dashboard (TypeScript/HTML/CSS)
├── scripts/            # Deployment and seeding utility scripts
└── .env.example        # Environment variables template
```

## Setup Instructions

### Prerequisites
* Node.js v20+
* npm

### Installation
From the `projects/proofmind/` directory, install all workspace dependencies:
```bash
npm install
```

### Running Tests
To run all component tests:
```bash
npm test
```
