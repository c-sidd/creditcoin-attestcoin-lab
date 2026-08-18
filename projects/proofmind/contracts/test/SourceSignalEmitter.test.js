const { expect } = require("chai");
const hre = require("hardhat");

describe("SourceSignalEmitter", function () {
  let emitter;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await hre.ethers.getSigners();

    const SourceSignalEmitter = await hre.ethers.getContractFactory("SourceSignalEmitter");
    emitter = await SourceSignalEmitter.deploy();
    await emitter.waitForDeployment();
  });

  it("should deploy with empty submittedSignals", async function () {
    const fakeSignalId = hre.ethers.randomBytes(32);
    expect(await emitter.submittedSignals(fakeSignalId)).to.equal(false);
  });

  it("should allow submitting a valid signal and emit RiskSignalSubmitted", async function () {
    const signalId = hre.ethers.randomBytes(32);
    const subject = user.address;
    const signalValue = 42;

    const tx = await emitter.submitSignal(signalId, subject, signalValue);
    const receipt = await tx.wait();

    // Verify state transition
    expect(await emitter.submittedSignals(signalId)).to.equal(true);

    // Verify event emission
    await expect(tx)
      .to.emit(emitter, "RiskSignalSubmitted")
      .withArgs(
        hre.ethers.hexlify(signalId),
        subject,
        signalValue,
        (await hre.ethers.provider.getBlock(receipt.blockNumber)).timestamp
      );
  });

  it("should revert if subject is address(0)", async function () {
    const signalId = hre.ethers.randomBytes(32);
    const signalValue = 42;

    await expect(
      emitter.submitSignal(signalId, hre.ethers.ZeroAddress, signalValue)
    ).to.be.revertedWithCustomError(emitter, "InvalidSubject");
  });

  it("should revert on duplicate signal submission", async function () {
    const signalId = hre.ethers.randomBytes(32);
    const subject = user.address;
    const signalValue = 42;

    await emitter.submitSignal(signalId, subject, signalValue);

    await expect(
      emitter.submitSignal(signalId, subject, signalValue)
    ).to.be.revertedWithCustomError(emitter, "DuplicateSignal")
     .withArgs(hre.ethers.hexlify(signalId));
  });
});
