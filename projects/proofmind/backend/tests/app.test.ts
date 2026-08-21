import request from "supertest";
import { expect } from "chai";
import { ethers } from "ethers";
import fs from "fs";

// Pre-set required environment variables before loading app config
process.env.NODE_ENV = "test";
process.env.AI_PROVIDER = "mock";
process.env.SOURCE_CHAIN_ID = "11155111";
process.env.CREDITCOIN_CHAIN_ID = "102031";
process.env.CREDITCOIN_RPC_URL = "https://rpc.cc3-testnet.creditcoin.network";
process.env.PROOF_BUILDER_URL = "https://prover.cc3-testnet.creditcoin.network";
process.env.SOURCE_CHAIN_KEY = "1";
process.env.SOURCE_RPC_URL = "https://sepolia.infura.io/v3/dummy";
process.env.SOURCE_CONTRACT_ADDRESS = "0x1111111111111111111111111111111111111111";
process.env.ASC_CONTRACT_ADDRESS = "0x2222222222222222222222222222222222222222";
process.env.DECISION_CONTRACT_ADDRESS = "0x3333333333333333333333333333333333333333";
process.env.DATABASE_URL = ":memory:";
// Use a dummy 32-byte private key for testing
process.env.WORKER_PRIVATE_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";
process.env.CREDITCOIN_PRIVATE_KEY = "0x0123456789012345678901234567890123456789012345678901234567890123";

import app, { getDB } from "../src/app";

describe("Backend API End-to-End Route Tests", () => {
  let db: any;

  before(async () => {
    db = await getDB();
    
    // Create a mock worker jobs.json file so the sync service doesn't throw
    const dummyJobs = [
      {
        id: "1_100_0xtx1_0",
        chainKey: 1,
        contractAddress: process.env.SOURCE_CONTRACT_ADDRESS,
        transactionHash: "0xtx1",
        blockNumber: 100,
        logIndex: 0,
        eventName: "RiskSignalSubmitted",
        encodedData: ethers.AbiCoder.defaultAbiCoder().encode(
          ["bytes32", "address", "uint256"],
          [ethers.id("sig1"), "0x5555555555555555555555555555555555555555", 45]
        ),
        status: "WAITING_FOR_ATTESTATION",
        attempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "1_101_0xtx2_0",
        chainKey: 1,
        contractAddress: process.env.SOURCE_CONTRACT_ADDRESS,
        transactionHash: "0xtx2",
        blockNumber: 101,
        logIndex: 0,
        eventName: "RiskSignalSubmitted",
        encodedData: ethers.AbiCoder.defaultAbiCoder().encode(
          ["bytes32", "address", "uint256"],
          [ethers.id("sig2"), "0x6666666666666666666666666666666666666666", 90]
        ),
        status: "EXECUTED",
        attempts: 1,
        ascTxHash: "0xascTx",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync("proofmind_jobs.json", JSON.stringify(dummyJobs, null, 2), "utf-8");
  });

  after(() => {
    if (fs.existsSync("proofmind_jobs.json")) {
      fs.unlinkSync("proofmind_jobs.json");
    }
  });

  it("should return 200 OK and health status from /api/health", async () => {
    await request(app)
      .get("/api/health")
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property("status", "OK");
      });
  });

  it("should return paginated events on /api/events and trigger sync", async () => {
    const res = await request(app)
      .get("/api/events")
      .expect(200);

    expect(res.body.data).to.have.lengthOf(2);
    expect(res.body.pagination).to.have.property("total", 2);
  });

  it("should return details for a specific event", async () => {
    const evidenceId = ethers.id("sig2");
    const res = await request(app)
      .get(`/api/events/${evidenceId}`)
      .expect(200);

    expect(res.body.id).to.equal(evidenceId);
    expect(res.body.status).to.equal("EXECUTED");
    expect(res.body.ascTxHash).to.equal("0xascTx");
    expect(res.body.verificationStatus).to.equal("VERIFIED");
  });

  it("should return 404 for non-existent event", async () => {
    await request(app)
      .get("/api/events/non-existent-id")
      .expect(404);
  });

  it("should return timeline for a workflow event", async () => {
    const evidenceId = ethers.id("sig2");
    const res = await request(app)
      .get(`/api/events/${evidenceId}/timeline`)
      .expect(200);

    expect(res.body.evidenceId).to.equal(evidenceId);
    expect(res.body.timeline).to.have.lengthOf(4);
    expect(res.body.timeline[0]).to.have.property("stage", "DETECTED");
    expect(res.body.timeline[2]).to.have.property("stage", "PROOF_GENERATED");
    expect(res.body.timeline[3]).to.have.property("stage", "VERIFIED_ON_CREDITCOIN");
  });

  it("should fail to run AI decision on unverified evidence", async () => {
    const unverifiedId = ethers.id("sig1");
    await request(app)
      .post(`/api/ai/decisions/${unverifiedId}`)
      .expect(400);
  });

  it("should successfully generate and sign AI decision for verified evidence", async () => {
    const verifiedId = ethers.id("sig2");
    const res = await request(app)
      .post(`/api/ai/decisions/${verifiedId}`)
      .expect(201);

    expect(res.body.evidenceId).to.equal(verifiedId);
    expect(res.body).to.have.property("decision", "REJECT"); // signal 90 is REJECT in Mock
    expect(res.body).to.have.property("signature");
    expect(res.body).to.have.property("modelVersion");
  });

  it("should retrieve stored AI decision details", async () => {
    const verifiedId = ethers.id("sig2");
    const res = await request(app)
      .get(`/api/decisions/${verifiedId}`)
      .expect(200);

    expect(res.body.evidenceId).to.equal(verifiedId);
    expect(res.body.decision).to.equal("REJECT");
    expect(res.body).to.have.property("signature");
  });
});
