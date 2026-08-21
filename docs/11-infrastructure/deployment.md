# Deployment

## MVP deployment order
1. Deploy source-chain contract to the selected testnet.
2. Record source address and deployment tx.
3. Deploy ASC/business contracts to CC3 Testnet.
4. Configure and fund the dedicated worker/executor testnet account.
5. Start backend/database.
6. Start worker.
7. Start frontend.
8. Run the E2E scenario.
9. Record all evidence in the project status.

## Deployment checks
- correct network IDs;
- correct contract addresses;
- ABI versions match deployed bytecode;
- secrets loaded;
- worker can reach source RPC and Proof Builder;
- executor has sufficient testnet funds;
- duplicate protection enabled.

Do not call a deployment production-ready solely because the demo works.
