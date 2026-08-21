import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";
import { expect } from "chai";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// Set environment variables before loading configs
process.env.AI_PROVIDER = "mock";
process.env.SOURCE_CHAIN_ID = "11155111";
process.env.CREDITCOIN_CHAIN_ID = "102031";

import { loadConfig } from "../../worker/src/config";
import { Database } from "../src/database/db";
import { WorkerOrchestrator } from "../../worker/src/orchestrator";
import { PersistenceManager, WorkerState } from "../../worker/src/persistence";
import { DecisionService } from "../src/services/decision";
import { SyncService } from "../src/services/sync";

describe("ProofMind End-to-End System Integration", () => {
  let source: any;
  let asc: any;
  let decisionContract: any;
  
  let owner: any;
  let aiSigner: any;
  let user: any;

  let db: Database;
  let orchestrator: WorkerOrchestrator;
  let persistence: PersistenceManager;
  let decisionService: DecisionService;
  let syncService: SyncService;

  const testJobsJson = path.resolve(__dirname, "integration-jobs.json");
  const testSqliteDb = path.resolve(__dirname, "integration-db.sqlite");

  before(async () => {
    [owner, aiSigner, user] = await hre.ethers.getSigners();

    // 1. Deploy Contracts locally
    const SourceSignalEmitter = await hre.ethers.getContractFactory("SourceSignalEmitter");
    source = await SourceSignalEmitter.deploy();
    await source.waitForDeployment();

    const MockNativeQueryVerifier = await hre.ethers.getContractFactory("MockNativeQueryVerifier");
    const mockVerifier = await MockNativeQueryVerifier.deploy();
    await mockVerifier.waitForDeployment();
    
    // Override precompile bytecode at 0xFD2
    const verifierAddress = "0x0000000000000000000000000000000000000FD2";
    const bytecode = await hre.ethers.provider.getCode(await mockVerifier.getAddress());
    await hre.network.provider.send("hardhat_setCode", [verifierAddress, bytecode]);

    const ProofMindAttestcoin = await hre.ethers.getContractFactory("ProofMindAttestcoin");
    asc = await ProofMindAttestcoin.deploy(await source.getAddress());
    await asc.waitForDeployment();

    const ProofMindDecision = await hre.ethers.getContractFactory("ProofMindDecision");
    decisionContract = await ProofMindDecision.deploy(await asc.getAddress(), aiSigner.address);
    await decisionContract.waitForDeployment();

    // 2. Set up environment variables matching these local contract addresses
    process.env.SOURCE_CONTRACT_ADDRESS = await source.getAddress();
    process.env.ASC_CONTRACT_ADDRESS = await asc.getAddress();
    process.env.DECISION_CONTRACT_ADDRESS = await decisionContract.getAddress();
    process.env.CREDITCOIN_RPC_URL = "http://localhost:8545";
    process.env.PROOF_BUILDER_URL = "https://prover.cc3-testnet.creditcoin.network";
    process.env.SOURCE_RPC_URL = "http://localhost:8545";
    process.env.SOURCE_CHAIN_KEY = "1";
    process.env.DATABASE_URL = `sqlite://${testSqliteDb}`;
    process.env.WORKER_PRIVATE_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";
    process.env.CREDITCOIN_PRIVATE_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";

    // Setup local JSON file database for worker
    if (fs.existsSync(testJobsJson)) fs.unlinkSync(testJobsJson);
    persistence = new PersistenceManager(testJobsJson);

    // Setup local SQLite database for backend
    if (fs.existsSync(testSqliteDb)) fs.unlinkSync(testSqliteDb);
    db = new Database(testSqliteDb);
    await db.initialize();

    const config = loadConfig();
    
    // Override orchestrator and services with locally connected test wallet and providers
    // We override ascContract and creditcoinWallet using hardhat provider to avoid real network POST requests
    orchestrator = new WorkerOrchestrator(config, persistence);
    // Bind to local hardhat provider/wallet for execution
    (orchestrator as any).creditcoinProvider = hre.ethers.provider;
    (orchestrator as any).creditcoinWallet = owner; // use owner to submit ASC proof
    (orchestrator as any).ascContract = (orchestrator as any).ascContract.connect(owner);

    decisionService = new DecisionService(config, db);
    // Use aiSigner private key for DecisionService signing
    // aiSigner private key from hardhat defaults is known or we can just mock signature in contract tests, 
    // but here we can just bind decisionService wallet to aiSigner signer directly!
    (decisionService as any).wallet = aiSigner; 

    syncService = new SyncService(config, db);
    // Override sync file path to use testJobsJson
    (syncService as any).sync = async function() {
      const manager = new PersistenceManager(testJobsJson);
      const jobs = manager.getAllJobs();
      for (const job of jobs) {
        let signalId = ethers.zeroPadValue("0x00", 32);
        let subject = ethers.ZeroAddress;
        let signalValue = 0;

        const existingJob = await this.db.get(
          "SELECT source_event_id FROM processing_jobs WHERE id = ?",
          [job.id]
        ) as any;

        if (existingJob) {
          signalId = existingJob.source_event_id;
          const existingEvent = await this.db.get(
            "SELECT decoded_payload FROM source_events WHERE id = ?",
            [signalId]
          ) as any;
          if (existingEvent) {
            try {
              const parsed = JSON.parse(existingEvent.decoded_payload);
              subject = parsed.subject;
              signalValue = parsed.signalValue;
            } catch {}
          }
        } else {
          try {
            if (job.encodedData && !job.encodedData.startsWith("{")) {
              const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
                ["bytes32", "address", "uint256"],
                job.encodedData
              );
              signalId = decoded[0];
              subject = decoded[1];
              signalValue = Number(decoded[2]);
            }
          } catch {}
          if (signalId === ethers.zeroPadValue("0x00", 32)) {
            signalId = ethers.keccak256(ethers.toUtf8Bytes(job.id));
          }
        }

        await this.db.run(
          `INSERT OR IGNORE INTO source_events (id, chain_key, contract_address, tx_hash, block_number, log_index, event_name, decoded_payload, detected_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [signalId, job.chainKey, job.contractAddress, job.transactionHash, job.blockNumber, job.logIndex, job.eventName, JSON.stringify({ subject, signalValue }), job.createdAt]
        );
        await this.db.run(
          `INSERT OR REPLACE INTO processing_jobs (id, source_event_id, state, attempts, next_retry_at, last_error_code, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [job.id, signalId, job.status, job.attempts, new Date().toISOString(), job.lastError || null, job.createdAt, job.updatedAt]
        );
        if (job.status === WorkerState.EXECUTED && job.ascTxHash) {
          await this.db.run(
            `INSERT OR REPLACE INTO verification_records (id, source_event_id, asc_tx_hash, verification_status, verified_payload, verified_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [`ver_${signalId}`, signalId, job.ascTxHash, "VERIFIED", JSON.stringify({ verified: true, signalValue }), job.updatedAt]
          );
        }
      }
    };
  });

  after(async () => {
    if (db) {
      await db.close();
    }
    if (fs.existsSync(testJobsJson)) fs.unlinkSync(testJobsJson);
    if (fs.existsSync(testSqliteDb)) fs.unlinkSync(testSqliteDb);
  });

  it("should execute full system pipeline: source signal -> worker verify -> backend AI decision -> policy execution", async () => {
    // 1. Emit signal from source contract
    const signalId = ethers.randomBytes(32);
    const subject = user.address;
    const signalValue = 40; // under 50 triggers ALLOW in Mock AI

    const tx = await source.submitSignal(signalId, subject, signalValue);
    const receipt = await tx.wait();

    // 2. Simulate worker listener creating the job
    const job = persistence.createJob(
      1, // chainKey
      await source.getAddress(),
      tx.hash,
      receipt.blockNumber,
      0, // logIndex
      "RiskSignalSubmitted",
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["bytes32", "address", "uint256"],
        [signalId, subject, signalValue]
      )
    );

    expect(job.status).to.equal(WorkerState.DETECTED);
    await syncService.sync(); // Sync initial job state and payload to SQLite

    // 3. Run worker orchestrator to process job.
    // We override getProofForTx in the orchestrator's proofBuilder to mock the Proof Builder API call
    const eventSig = ethers.id("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
    const logs = [
      {
        address_: await source.getAddress(),
        topics: [
          eventSig,
          ethers.hexlify(signalId),
          ethers.zeroPadValue(subject, 32),
        ],
        data: ethers.AbiCoder.defaultAbiCoder().encode(
          ["uint256", "uint256"],
          [signalValue, (await hre.ethers.provider.getBlock(receipt.blockNumber))!.timestamp]
        ),
      },
    ];

    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const chunk0 = abiCoder.encode(
      ["uint64", "uint64", "address", "bool", "address", "uint256", "bytes"],
      [0, 100000, owner.address, false, await source.getAddress(), 0, "0x"]
    );
    const chunk1 = abiCoder.encode(
      ["uint128", "uint256", "bytes32", "bytes32"],
      [1000000000, 27, ethers.ZeroHash, ethers.ZeroHash]
    );
    const chunk2 = abiCoder.encode(
      ["uint8", "uint64", "tuple(address address_, bytes32[] topics, bytes data)[]", "bytes"],
      [1, 50000, logs, "0x"]
    );
    const encodedTx = abiCoder.encode(["uint8", "bytes[]"], [0, [chunk0, chunk1, chunk2]]);

    const mockProofPayload = {
      chainKey: 1,
      blockHeight: receipt.blockNumber,
      encodedTransaction: encodedTx,
      merkleProof: { root: ethers.ZeroHash, siblings: [] },
      continuityProof: { lowerEndpointDigest: ethers.ZeroHash, roots: [] }
    };
    (orchestrator as any).proofBuilder.getProofForTx = async () => mockProofPayload;

    // Run the worker state machine steps
    await orchestrator.processJob(job); // DETECTED -> WAITING_FOR_ATTESTATION
    await orchestrator.processJob(job); // WAITING_FOR_ATTESTATION -> PROOF_RECEIVED -> ASC_SUBMITTED -> EXECUTED
    
    expect(job.status).to.equal(WorkerState.EXECUTED);
    expect(job.ascTxHash).to.not.be.undefined;

    // 4. Sync backend database with the latest job record
    await syncService.sync();

    console.log("=== DEBUG INTEGRATION TEST ===");
    console.log("Original signalId (hex):", ethers.hexlify(signalId));
    console.log("All rows in source_events:", await db.all("SELECT * FROM source_events"));
    console.log("All rows in processing_jobs:", await db.all("SELECT * FROM processing_jobs"));

    // Verify verifiedFact exists in SQLite db
    const verifiedEvent = await db.get<any>("SELECT * FROM source_events WHERE id = ?", [ethers.hexlify(signalId)]);
    expect(verifiedEvent).to.not.be.undefined;
    
    const verificationRecord = await db.get<any>("SELECT * FROM verification_records WHERE source_event_id = ?", [ethers.hexlify(signalId)]);
    expect(verificationRecord).to.not.be.undefined;
    expect(verificationRecord.verification_status).to.equal("VERIFIED");

    // 5. Backend runs AI decision and signs it
    const decisionResult = await decisionService.generateAndSignDecision(
      ethers.hexlify(signalId),
      subject,
      signalValue
    );

    expect(decisionResult.decision).to.equal("ALLOW");
    expect(decisionResult.action).to.equal("APPROVE_LIMIT");
    expect(decisionResult.signature).to.not.be.undefined;

    // 6. Submit signed decision to policy contract and execute
    const actionVal = 1; // Action.APPROVE_LIMIT
    const decisionVal = 1; // Decision.ALLOW

    const execTx = await decisionContract.executeDecision(
      signalId,
      decisionVal,
      decisionResult.score,
      actionVal,
      decisionResult.limit,
      decisionResult.modelVersion,
      decisionResult.expiresAt,
      decisionResult.signature
    );
    await execTx.wait();

    // Verify limit is correctly updated on-chain
    const subjectLimit = await decisionContract.subjectLimits(subject);
    expect(subjectLimit).to.equal(BigInt(decisionResult.limit));
    expect(await decisionContract.executed(signalId)).to.equal(true);
  });
});
