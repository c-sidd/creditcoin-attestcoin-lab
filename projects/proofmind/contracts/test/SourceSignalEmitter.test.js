const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SourceSignalEmitter Comprehensive Tests", function () {
  let SourceSignalEmitter;
  let emitter;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    SourceSignalEmitter = await ethers.getContractFactory("SourceSignalEmitter");
    emitter = await SourceSignalEmitter.deploy();
  });

  describe("Deployment State Initialization", function () {
    it("Should start with a nonce of 0", async function () {
      expect(await emitter.nonce()).to.equal(0n);
    });

    it("Should not have any signalId marked as processed initially", async function () {
      const dummyId = ethers.id("dummy");
      expect(await emitter.processedSignals(dummyId)).to.be.false;
    });
  });

  describe("Input Validation & Reverts", function () {
    it("Should reject zero address as subject", async function () {
      await expect(
        emitter.submitSignal(ethers.ZeroAddress, 100)
      ).to.be.revertedWith("Invalid subject address");
    });

    it("Should reject zero signal value", async function () {
      await expect(
        emitter.submitSignal(addr1.address, 0)
      ).to.be.revertedWith("Signal value must be positive");
    });
  });

  describe("Caller Authorization (Signers)", function () {
    it("Should allow non-owner account to submit signal", async function () {
      const emitterAsAddr1 = emitter.connect(addr1);
      await expect(emitterAsAddr1.submitSignal(addr2.address, 500))
        .to.emit(emitter, "RiskSignalSubmitted");
    });
  });

  describe("Event Emission & State Transitions", function () {
    it("Should emit event and transition state correctly", async function () {
      const tx = await emitter.submitSignal(addr1.address, 50);
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "RiskSignalSubmitted"
      );
      expect(event).to.not.be.undefined;

      const [signalId, subject, signalValue, timestamp] = event.args;

      expect(subject).to.equal(addr1.address);
      expect(signalValue).to.equal(50n);
      expect(timestamp).to.be.gt(0n);

      // State transitions
      expect(await emitter.processedSignals(signalId)).to.be.true;
      expect(await emitter.nonce()).to.equal(1n);
    });
  });

  describe("Repeated Submissions & Boundary Values", function () {
    it("Should generate unique signal IDs on consecutive calls", async function () {
      const tx1 = await emitter.submitSignal(addr1.address, 100);
      const receipt1 = await tx1.wait();
      const id1 = receipt1.logs[0].args[0];

      const tx2 = await emitter.submitSignal(addr1.address, 100);
      const receipt2 = await tx2.wait();
      const id2 = receipt2.logs[0].args[0];

      expect(id1).to.not.equal(id2);
      expect(await emitter.processedSignals(id1)).to.be.true;
      expect(await emitter.processedSignals(id2)).to.be.true;
      expect(await emitter.nonce()).to.equal(2n);
    });

    it("Should handle extremely large signal values (upper boundaries)", async function () {
      const maxUint256 = ethers.MaxUint256;
      const tx = await emitter.submitSignal(addr1.address, maxUint256);
      const receipt = await tx.wait();

      const event = receipt.logs[0];
      const [, , signalValue] = event.args;

      expect(signalValue).to.equal(maxUint256);
    });
  });
});
