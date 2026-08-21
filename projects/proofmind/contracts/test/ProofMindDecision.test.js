const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProofMindDecision", function () {
  let ProofMindDecision;
  let decisionContract;
  let MockAttestcoin;
  let mockAttestcoin;
  let owner;
  let oracle;
  let unauthorized;
  let subject;

  beforeEach(async function () {
    [owner, oracle, unauthorized, subject] = await ethers.getSigners();

    // 1. Deploy MockAttestcoin
    MockAttestcoin = await ethers.getContractFactory("MockAttestcoin");
    mockAttestcoin = await MockAttestcoin.deploy();
    await mockAttestcoin.waitForDeployment();

    // 2. Deploy ProofMindDecision
    ProofMindDecision = await ethers.getContractFactory("ProofMindDecision");
    decisionContract = await ProofMindDecision.deploy(await mockAttestcoin.getAddress());
    await decisionContract.waitForDeployment();

    // 3. Authorize oracle
    await decisionContract.setOracleAuthorization(oracle.address, true);
  });

  describe("Authorization & Access Control", function () {
    it("Should allow owner to execute decision", async function () {
      const evidenceId = ethers.id("ev-1");
      const timestamp = Math.floor(Date.now() / 1000);
      await mockAttestcoin.setFact(evidenceId, 1, subject.address, 100, timestamp, true);

      await expect(
        decisionContract.executeDecision(evidenceId, 1, 10, 500) // 1 = Approved
      ).to.emit(decisionContract, "DecisionExecuted");
    });

    it("Should allow authorized oracle to execute decision", async function () {
      const evidenceId = ethers.id("ev-2");
      const timestamp = Math.floor(Date.now() / 1000);
      await mockAttestcoin.setFact(evidenceId, 1, subject.address, 100, timestamp, true);

      const decisionAsOracle = decisionContract.connect(oracle);
      await expect(
        decisionAsOracle.executeDecision(evidenceId, 1, 10, 500)
      ).to.emit(decisionContract, "DecisionExecuted");
    });

    it("Should reject unauthorized callers", async function () {
      const evidenceId = ethers.id("ev-3");
      const decisionAsUnauthorized = decisionContract.connect(unauthorized);

      await expect(
        decisionAsUnauthorized.executeDecision(evidenceId, 1, 10, 500)
      ).to.be.revertedWith("Unauthorized caller");
    });
  });

  describe("Fact Validation & Expiry", function () {
    it("Should revert if fact does not exist in Attestcoin", async function () {
      const evidenceId = ethers.id("non-existent-fact");
      await expect(
        decisionContract.executeDecision(evidenceId, 1, 10, 500)
      ).to.be.revertedWith("Evidence not verified by Attestcoin");
    });

    it("Should revert if fact is expired", async function () {
      const evidenceId = ethers.id("expired-fact");
      const pastTimestamp = Math.floor(Date.now() / 1000) - (25 * 3600); // 25 hours ago
      await mockAttestcoin.setFact(evidenceId, 1, subject.address, 100, pastTimestamp, true);

      await expect(
        decisionContract.executeDecision(evidenceId, 1, 10, 500)
      ).to.be.revertedWith("Evidence has expired");
    });
  });

  describe("Limits & Score Policy Enforcement", function () {
    it("Should reject (returns false) if risk score is too high", async function () {
      const evidenceId = ethers.id("high-risk");
      const timestamp = Math.floor(Date.now() / 1000);
      await mockAttestcoin.setFact(evidenceId, 1, subject.address, 100, timestamp, true);

      // Max score is 70. Submit with score 75.
      const tx = await decisionContract.executeDecision(evidenceId, 1, 75, 500);
      const receipt = await tx.wait();

      const rejectEvent = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "DecisionRejected"
      );
      expect(rejectEvent).to.not.be.undefined;
      expect(rejectEvent.args[1]).to.equal("Risk score exceeds maximum limit");

      const [, , , , exists] = await decisionContract.decisions(evidenceId);
      expect(exists).to.be.true; // Recorded as executed (Rejected state)
    });

    it("Should reject if requested value (signalValue) exceeds proposed limit", async function () {
      const evidenceId = ethers.id("value-over-limit");
      const timestamp = Math.floor(Date.now() / 1000);
      // Requested amount is 1000. Proposed limit is 500.
      await mockAttestcoin.setFact(evidenceId, 1, subject.address, 1000, timestamp, true);

      const tx = await decisionContract.executeDecision(evidenceId, 1, 20, 500);
      const receipt = await tx.wait();

      const rejectEvent = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "DecisionRejected"
      );
      expect(rejectEvent).to.not.be.undefined;
      expect(rejectEvent.args[1]).to.equal("Requested value exceeds proposed limit bounds");
    });

    it("Should reject if proposed limit exceeds contract maxAllowedLimit", async function () {
      const evidenceId = ethers.id("limit-too-high");
      const timestamp = Math.floor(Date.now() / 1000);
      await mockAttestcoin.setFact(evidenceId, 1, subject.address, 100, timestamp, true);

      // Contract maxAllowedLimit is 1,000,000. Propose 1,500,000.
      const tx = await decisionContract.executeDecision(evidenceId, 1, 20, 1500000);
      const receipt = await tx.wait();

      const rejectEvent = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "DecisionRejected"
      );
      expect(rejectEvent).to.not.be.undefined;
      expect(rejectEvent.args[1]).to.equal("Requested value exceeds proposed limit bounds");
    });
  });

  describe("Replay Protection", function () {
    it("Should revert if decision already executed for this evidenceId", async function () {
      const evidenceId = ethers.id("replay-evidence");
      const timestamp = Math.floor(Date.now() / 1000);
      await mockAttestcoin.setFact(evidenceId, 1, subject.address, 100, timestamp, true);

      // First call succeeds
      await decisionContract.executeDecision(evidenceId, 1, 20, 500);

      // Second call reverts
      await expect(
        decisionContract.executeDecision(evidenceId, 1, 20, 500)
      ).to.be.revertedWith("Decision already executed");
    });
  });
});
