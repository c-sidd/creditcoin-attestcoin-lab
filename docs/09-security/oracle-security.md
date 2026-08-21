# Oracle/Worker Security

The off-chain worker is operational infrastructure, not the trust root.

Controls:
- use multiple source RPC endpoints where practical;
- persist the last scanned block and event IDs;
- rescan a safety window after restart;
- verify contract address and event signature before processing;
- never accept a proof package without schema validation;
- reconcile transaction submission timeouts on-chain;
- maintain idempotency at both worker and contract levels;
- keep RPC/API credentials outside source control.

A worker outage should delay processing, not create false verification.
