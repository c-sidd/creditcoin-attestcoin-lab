import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("FinancialSignalEmitter", function () {
  async function deploy() {
    const [subject] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("FinancialSignalEmitter");
    const emitter = await Factory.deploy();
    await emitter.waitForDeployment();
    return { emitter, subject };
  }

  it("stores and emits a financial signal", async function () {
    const { emitter, subject } = await deploy();
    const signalId = ethers.keccak256(ethers.toUtf8Bytes("repayment-1"));
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("metadata-1"));

    await expect(emitter.submitSignal(signalId, subject.address, 0, 500, metadataHash))
      .to.emit(emitter, "FinancialSignalSubmitted")
      .withArgs(signalId, subject.address, 0, 500, anyValue, metadataHash);

    const stored = await emitter.signals(signalId);
    expect(stored.subject).to.equal(subject.address);
    expect(stored.amount).to.equal(500);
  });

  it("rejects duplicate signals", async function () {
    const { emitter, subject } = await deploy();
    const signalId = ethers.keccak256(ethers.toUtf8Bytes("duplicate"));
    const metadataHash = ethers.ZeroHash;

    await emitter.submitSignal(signalId, subject.address, 1, 100, metadataHash);

    await expect(emitter.submitSignal(signalId, subject.address, 1, 100, metadataHash))
      .to.be.revertedWithCustomError(emitter, "DuplicateSignal")
      .withArgs(signalId);
  });
});
