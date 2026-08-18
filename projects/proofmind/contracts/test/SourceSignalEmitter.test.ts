import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("SourceSignalEmitter", function () {
  it("emits a risk signal and rejects duplicate signal IDs", async function () {
    const [subject] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SourceSignalEmitter");
    const emitter = await Factory.deploy();
    await emitter.waitForDeployment();

    const signalId = ethers.keccak256(ethers.toUtf8Bytes("proofmind-test-1"));

    await expect(emitter.submitSignal(signalId, subject.address, 72))
      .to.emit(emitter, "RiskSignalSubmitted")
      .withArgs(signalId, subject.address, 72, anyValue);

    await expect(emitter.submitSignal(signalId, subject.address, 72))
      .to.be.revertedWithCustomError(emitter, "DuplicateSignal")
      .withArgs(signalId);
  });

  it("rejects the zero address", async function () {
    const Factory = await ethers.getContractFactory("SourceSignalEmitter");
    const emitter = await Factory.deploy();
    await emitter.waitForDeployment();

    const signalId = ethers.keccak256(ethers.toUtf8Bytes("proofmind-test-zero"));

    await expect(emitter.submitSignal(signalId, ethers.ZeroAddress, 1))
      .to.be.revertedWithCustomError(emitter, "InvalidSubject");
  });
});
