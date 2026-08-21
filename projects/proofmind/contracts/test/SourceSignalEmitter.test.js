const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SourceSignalEmitter", function () {
  let SourceSignalEmitter;
  let emitter;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    SourceSignalEmitter = await ethers.getContractFactory("SourceSignalEmitter");
    emitter = await SourceSignalEmitter.deploy();
  });

  describe("Validation", function () {
    it("Should reject invalid subject address", async function () {
      await expect(
        emitter.submitSignal(ethers.ZeroAddress, 100)
      ).to.be.revertedWith("Invalid subject address");
    });

    it("Should reject non-positive signal value", async function () {
      await expect(
        emitter.submitSignal(addr1.address, 0)
      ).to.be.revertedWith("Signal value must be positive");
    });
  });

  describe("Signal Submission & Events", function () {
    it("Should emit RiskSignalSubmitted event with correct values", async function () {
      const tx = await emitter.submitSignal(addr1.address, 42);
      const receipt = await tx.wait();

      // Find the event
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "RiskSignalSubmitted"
      );

      expect(event).to.not.be.undefined;
      const [signalId, subject, signalValue, timestamp] = event.args;

      expect(subject).to.equal(addr1.address);
      expect(signalValue).to.equal(42n);
      expect(timestamp).to.be.gt(0n);
      expect(await emitter.processedSignals(signalId)).to.be.true;
    });

    it("Should generate unique signalIds and increment nonce on repeated calls", async function () {
      const tx1 = await emitter.submitSignal(addr1.address, 100);
      const rec1 = await tx1.wait();
      const event1 = rec1.logs.find((log) => log.fragment && log.fragment.name === "RiskSignalSubmitted");
      const id1 = event1.args[0];

      const tx2 = await emitter.submitSignal(addr1.address, 100);
      const rec2 = await tx2.wait();
      const event2 = rec2.logs.find((log) => log.fragment && log.fragment.name === "RiskSignalSubmitted");
      const id2 = event2.args[0];

      expect(id1).to.not.equal(id2);
      expect(await emitter.nonce()).to.equal(2n);
    });
  });
});
