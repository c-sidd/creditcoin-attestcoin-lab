const { expect } = require("chai");
const hre = require("hardhat");

describe("ProofMindDecision", function () {
  let asc;
  let decisionContract;
  let owner;
  let aiSigner;
  let user;
  const SOURCE_CONTRACT = "0x1111111111111111111111111111111111111111";

  beforeEach(async function () {
    [owner, aiSigner, user] = await hre.ethers.getSigners();

    // 1. Deploy MockNativeQueryVerifier and set precompile
    const MockNativeQueryVerifier = await hre.ethers.getContractFactory("MockNativeQueryVerifier");
    const mockVerifier = await MockNativeQueryVerifier.deploy();
    await mockVerifier.waitForDeployment();
    const bytecode = await hre.ethers.provider.getCode(await mockVerifier.getAddress());
    await hre.network.provider.send("hardhat_setCode", [
      "0x0000000000000000000000000000000000000FD2",
      bytecode,
    ]);

    // 2. Deploy ASC
    const ProofMindAttestcoin = await hre.ethers.getContractFactory("ProofMindAttestcoin");
    asc = await ProofMindAttestcoin.deploy(SOURCE_CONTRACT);
    await asc.waitForDeployment();

    // 3. Deploy Decision Contract
    const ProofMindDecision = await hre.ethers.getContractFactory("ProofMindDecision");
    decisionContract = await ProofMindDecision.deploy(await asc.getAddress(), aiSigner.address);
    await decisionContract.waitForDeployment();
  });

  // Helper to generate signature
  async function generateSignature(
    evidenceId,
    decision,
    score,
    action,
    limit,
    modelVersion,
    deadline
  ) {
    const messageHash = hre.ethers.solidityPackedKeccak256(
      ["bytes32", "uint8", "uint256", "uint8", "uint256", "string", "uint256"],
      [evidenceId, decision, score, action, limit, modelVersion, deadline]
    );

    // Sign message hash
    return await aiSigner.signMessage(hre.ethers.getBytes(messageHash));
  }

  // Helper to mock a verified event in ASC
  async function mockVerifiedFactInASC(signalId, subject, signalValue) {
    const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();
    const eventSig = hre.ethers.id("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
    const timestamp = Math.floor(Date.now() / 1000);

    const logs = [
      {
        address_: SOURCE_CONTRACT,
        topics: [
          eventSig,
          hre.ethers.hexlify(signalId),
          hre.ethers.zeroPadValue(subject, 32),
        ],
        data: abiCoder.encode(["uint256", "uint256"], [signalValue, timestamp]),
      },
    ];

    // Build mock encodedTransaction
    const chunk0 = abiCoder.encode(
      ["uint64", "uint64", "address", "bool", "address", "uint256", "bytes"],
      [0, 100000, owner.address, false, SOURCE_CONTRACT, 0, "0x"]
    );
    const chunk1 = abiCoder.encode(
      ["uint128", "uint256", "bytes32", "bytes32"],
      [1000000000, 27, hre.ethers.ZeroHash, hre.ethers.ZeroHash]
    );
    const chunk2 = abiCoder.encode(
      ["uint8", "uint64", "tuple(address address_, bytes32[] topics, bytes data)[]", "bytes"],
      [1, 50000, logs, "0x"]
    );
    const encodedTx = abiCoder.encode(["uint8", "bytes[]"], [0, [chunk0, chunk1, chunk2]]);

    const merkleProof = { root: hre.ethers.ZeroHash, siblings: [] };
    const continuityProof = { lowerEndpointDigest: hre.ethers.ZeroHash, roots: [] };

    await asc.verifyCrossChainEvent(1, 12345, encodedTx, merkleProof, continuityProof, hre.ethers.ZeroHash);
  }

  it("should successfully execute a valid ALLOW decision", async function () {
    const evidenceId = hre.ethers.randomBytes(32);
    const limit = hre.ethers.parseEther("1000");
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const modelVersion = "proofmind-v1";
    const score = 85;

    // Mock evidence verification first
    await mockVerifiedFactInASC(evidenceId, user.address, 42);

    const signature = await generateSignature(
      evidenceId,
      1, // Decision.ALLOW
      score,
      1, // Action.APPROVE_LIMIT
      limit,
      modelVersion,
      deadline
    );

    const tx = await decisionContract.executeDecision(
      evidenceId,
      1, // Decision.ALLOW
      score,
      1, // Action.APPROVE_LIMIT
      limit,
      modelVersion,
      deadline,
      signature
    );

    await expect(tx)
      .to.emit(decisionContract, "DecisionExecuted")
      .withArgs(hre.ethers.hexlify(evidenceId), 1, score, limit, 1);

    expect(await decisionContract.subjectLimits(user.address)).to.equal(limit);
    expect(await decisionContract.executed(evidenceId)).to.equal(true);
  });

  it("should revert if evidence is not verified", async function () {
    const evidenceId = hre.ethers.randomBytes(32);
    const limit = hre.ethers.parseEther("1000");
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const signature = await generateSignature(evidenceId, 1, 85, 1, limit, "v1", deadline);

    await expect(
      decisionContract.executeDecision(evidenceId, 1, 85, 1, limit, "v1", deadline, signature)
    ).to.be.revertedWithCustomError(decisionContract, "EvidenceNotVerified");
  });

  it("should revert if signature is invalid", async function () {
    const evidenceId = hre.ethers.randomBytes(32);
    const limit = hre.ethers.parseEther("1000");
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await mockVerifiedFactInASC(evidenceId, user.address, 42);

    // Invalid signature (using user instead of aiSigner)
    const invalidSignature = await user.signMessage(hre.ethers.randomBytes(32));

    await expect(
      decisionContract.executeDecision(evidenceId, 1, 85, 1, limit, "v1", deadline, invalidSignature)
    ).to.be.revertedWithCustomError(decisionContract, "InvalidSignature");
  });

  it("should revert if limit is exceeded", async function () {
    const evidenceId = hre.ethers.randomBytes(32);
    const limit = hre.ethers.parseEther("6000"); // exceeds MAX_LIMIT (5000)
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await mockVerifiedFactInASC(evidenceId, user.address, 42);

    const signature = await generateSignature(evidenceId, 1, 85, 1, limit, "v1", deadline);

    await expect(
      decisionContract.executeDecision(evidenceId, 1, 85, 1, limit, "v1", deadline, signature)
    ).to.be.revertedWithCustomError(decisionContract, "LimitExceeded");
  });

  it("should revert if score is below MIN_SCORE", async function () {
    const evidenceId = hre.ethers.randomBytes(32);
    const limit = hre.ethers.parseEther("1000");
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const lowScore = 65; // below MIN_SCORE (70)

    await mockVerifiedFactInASC(evidenceId, user.address, 42);

    const signature = await generateSignature(evidenceId, 1, lowScore, 1, limit, "v1", deadline);

    await expect(
      decisionContract.executeDecision(evidenceId, 1, lowScore, 1, limit, "v1", deadline, signature)
    ).to.be.revertedWithCustomError(decisionContract, "InvalidScore");
  });
});
