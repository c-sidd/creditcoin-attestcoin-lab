const { expect } = require("chai");
const hre = require("hardhat");

describe("ProofMind Contract Integration", function () {
  let source;
  let asc;
  let decisionContract;
  let owner;
  let aiSigner;
  let user;

  const PRECOMPILE_ADDRESS = "0x0000000000000000000000000000000000000FD2";

  beforeEach(async function () {
    [owner, aiSigner, user] = await hre.ethers.getSigners();

    // 1. Deploy source contract
    const SourceSignalEmitter = await hre.ethers.getContractFactory("SourceSignalEmitter");
    source = await SourceSignalEmitter.deploy();
    await source.waitForDeployment();

    // 2. Deploy Mock verifier and override precompile bytecode
    const MockNativeQueryVerifier = await hre.ethers.getContractFactory("MockNativeQueryVerifier");
    const mockVerifier = await MockNativeQueryVerifier.deploy();
    await mockVerifier.waitForDeployment();
    const bytecode = await hre.ethers.provider.getCode(await mockVerifier.getAddress());
    await hre.network.provider.send("hardhat_setCode", [
      PRECOMPILE_ADDRESS,
      bytecode,
    ]);

    // Reset shouldVerifyFail to false to ensure verification works
    const mockVerifierInstance = await hre.ethers.getContractAt("MockNativeQueryVerifier", PRECOMPILE_ADDRESS);
    await mockVerifierInstance.setShouldVerifyFail(false);

    // 3. Deploy ASC contract
    const ProofMindAttestcoin = await hre.ethers.getContractFactory("ProofMindAttestcoin");
    asc = await ProofMindAttestcoin.deploy(await source.getAddress());
    await asc.waitForDeployment();

    // 4. Deploy Decision contract
    const ProofMindDecision = await hre.ethers.getContractFactory("ProofMindDecision");
    decisionContract = await ProofMindDecision.deploy(await asc.getAddress(), aiSigner.address);
    await decisionContract.waitForDeployment();
  });

  // Helper to build encodedTransaction chunks
  async function buildEncodedTransaction(receiptStatus, logs) {
    const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();
    const chunk0 = abiCoder.encode(
      ["uint64", "uint64", "address", "bool", "address", "uint256", "bytes"],
      [0, 100000, owner.address, false, await source.getAddress(), 0, "0x"]
    );
    const chunk1 = abiCoder.encode(
      ["uint128", "uint256", "bytes32", "bytes32"],
      [1000000000, 27, hre.ethers.ZeroHash, hre.ethers.ZeroHash]
    );
    const chunk2 = abiCoder.encode(
      ["uint8", "uint64", "tuple(address address_, bytes32[] topics, bytes data)[]", "bytes"],
      [receiptStatus, 50000, logs, "0x"]
    );
    return abiCoder.encode(["uint8", "bytes[]"], [0, [chunk0, chunk1, chunk2]]);
  }

  it("should successfully execute full integration flow: Source Event -> ASC Verify -> Decision Execution", async function () {
    // Phase 1: Emit event from Source Contract
    const signalId = hre.ethers.randomBytes(32);
    const subject = user.address;
    const signalValue = 88;

    const sourceTx = await source.submitSignal(signalId, subject, signalValue);
    const sourceReceipt = await sourceTx.wait();

    // Phase 2: Simulating worker capturing event and generating proof payload
    const eventSig = hre.ethers.id("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
    const logs = [
      {
        address_: await source.getAddress(),
        topics: [
          eventSig,
          hre.ethers.hexlify(signalId),
          hre.ethers.zeroPadValue(subject, 32),
        ],
        data: hre.ethers.AbiCoder.defaultAbiCoder().encode(
          ["uint256", "uint256"],
          [signalValue, (await hre.ethers.provider.getBlock(sourceReceipt.blockNumber)).timestamp]
        ),
      },
    ];

    const encodedTx = await buildEncodedTransaction(1, logs);
    const merkleProof = { root: hre.ethers.ZeroHash, siblings: [] };
    const continuityProof = { lowerEndpointDigest: hre.ethers.ZeroHash, roots: [] };

    // Phase 3: Submit proof to ASC on Creditcoin
    const ascTx = await asc.verifyCrossChainEvent(
      1, // chainKey
      uint64(sourceReceipt.blockNumber),
      encodedTx,
      merkleProof,
      continuityProof,
      sourceTx.hash
    );
    await expect(ascTx)
      .to.emit(asc, "VerifiedFactCreated")
      .withArgs(
        hre.ethers.hexlify(signalId),
        sourceTx.hash,
        subject,
        signalValue,
        (await hre.ethers.provider.getBlock(sourceReceipt.blockNumber)).timestamp
      );

    // Verify VerifiedFact state exists in ASC
    const fact = await asc.verifiedFacts(signalId);
    expect(fact.exists).to.equal(true);

    // Phase 4: AI Decision generation and signing
    const limit = hre.ethers.parseEther("2000");
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const modelVersion = "proofmind-llama-3";
    const score = 92;

    const messageHash = hre.ethers.solidityPackedKeccak256(
      ["bytes32", "uint8", "uint256", "uint8", "uint256", "string", "uint256"],
      [
        signalId,
        1, // Decision.ALLOW
        score,
        1, // Action.APPROVE_LIMIT
        limit,
        modelVersion,
        deadline,
      ]
    );
    const signature = await aiSigner.signMessage(hre.ethers.getBytes(messageHash));

    // Phase 5: Enforce decision on Creditcoin Policy Contract
    const decisionTx = await decisionContract.executeDecision(
      signalId,
      1, // Decision.ALLOW
      score,
      1, // Action.APPROVE_LIMIT
      limit,
      modelVersion,
      deadline,
      signature
    );

    await expect(decisionTx)
      .to.emit(decisionContract, "DecisionExecuted")
      .withArgs(hre.ethers.hexlify(signalId), 1, score, limit, 1);

    // Final state validation
    expect(await decisionContract.subjectLimits(subject)).to.equal(limit);
    expect(await decisionContract.executed(signalId)).to.equal(true);
  });
});

// Helper for type conversion
function uint64(val) {
  return BigInt(val);
}
