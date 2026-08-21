const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Placeholder", function () {
  it("Should compile and deploy successfully", async function () {
    const Placeholder = await ethers.getContractFactory("Placeholder");
    const placeholder = await Placeholder.deploy();
    expect(await placeholder.name()).to.equal("ProofMind Placeholder");
  });
});
