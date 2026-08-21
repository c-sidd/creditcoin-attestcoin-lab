const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Contract Integration E2E Flow", function () {
  let SourceSignalEmitter;
  let sourceEmitter;
  let ProofMindAttestcoin;
  let asc;
  let ProofMindDecision;
  let decisionContract;
  let MockBlockProver;
  let mockProver;

  let owner;
  let oracle;
  let subject;

  const PRECOMPILE_ADDRESS = "0x0000000000000000000000000000000000000FD2";

  before(async function () {
    [owner, oracle, subject] = await ethers.getSigners();

    // 1. Deploy SourceSignalEmitter (Source Chain)
    SourceSignalEmitter = await ethers.getContractFactory("SourceSignalEmitter");
    sourceEmitter = await SourceSignalEmitter.deploy();
    await sourceEmitter.waitForDeployment();

    // 2. Deploy MockBlockProver and write code to precompile address
    MockBlockProver = await ethers.getContractFactory("MockBlockProver");
    mockProver = await MockBlockProver.deploy();
    await mockProver.waitForDeployment();

    const mockProverCode = await network.provider.send("eth_getCode", [
      await mockProver.getAddress(),
    ]);
    await network.provider.send("hardhat_setCode", [
      PRECOMPILE_ADDRESS,
      mockProverCode,
    ]);

    // 3. Deploy EvmV1Decoder library
    const EvmV1Decoder = await ethers.getContractFactory("@gluwa/usc-contracts/contracts/decoding/EvmV1Decoder.sol:EvmV1Decoder");
    const decoder = await EvmV1Decoder.deploy();
    await decoder.waitForDeployment();
    const decoderAddress = await decoder.getAddress();

    // 4. Deploy ProofMindAttestcoin with linked library pointing to SourceSignalEmitter
    ProofMindAttestcoin = await ethers.getContractFactory("ProofMindAttestcoin", {
      libraries: {
        "@gluwa/usc-contracts/contracts/decoding/EvmV1Decoder.sol:EvmV1Decoder": decoderAddress,
      },
    });
    asc = await ProofMindAttestcoin.deploy(await sourceEmitter.getAddress());
    await asc.waitForDeployment();

    // 5. Deploy ProofMindDecision pointing to ProofMindAttestcoin
    ProofMindDecision = await ethers.getContractFactory("ProofMindDecision");
    decisionContract = await ProofMindDecision.deploy(await asc.getAddress());
    await decisionContract.waitForDeployment();

    // 6. Authorize oracle on Decision contract
    await decisionContract.setOracleAuthorization(oracle.address, true);
  });

  // Helper to generate a validly encoded transaction payload
  function createEncodedTransaction({
    status = 1,
    emitter,
    signalId,
    subjectAddress,
    signalValue,
    timestamp,
  }) {
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();

    // 1. Encode CommonTxFields
    const commonTxEncoded = abiCoder.encode(
      ["uint64", "uint64", "address", "bool", "address", "uint256", "bytes"],
      [0, 21000, ethers.ZeroAddress, false, ethers.ZeroAddress, 0, "0x"]
    );

    // 2. Encode LogEntryTuple
    const eventSignature = ethers.id("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
    const logEntry = {
      address_: emitter,
      topics: [
        eventSignature,
        signalId,
        ethers.zeroPadValue(subjectAddress, 32),
      ],
      data: abiCoder.encode(["uint256", "uint256"], [signalValue, timestamp]),
    };

    // 3. Encode ReceiptFields
    const receiptEncoded = abiCoder.encode(
      ["uint8", "uint64", "tuple(address address_, bytes32[] topics, bytes data)[]", "bytes"],
      [
        status,
        21000,
        [logEntry],
        "0x",
      ]
    );

    // 4. Encode LegacyFields for Type 0 transaction
    const legacyFieldsEncoded = abiCoder.encode(
      ["uint128", "uint256", "bytes32", "bytes32"],
      [1000000000n, 1n, ethers.ZeroHash, ethers.ZeroHash]
    );

    return abiCoder.encode(
      ["uint8", "bytes[]"],
      [0, [commonTxEncoded, legacyFieldsEncoded, receiptEncoded]]
    );
  }

  const dummyProof = {
    merkleProof: {
      root: ethers.ZeroHash,
      siblings: [],
    },
    continuityProof: {
      lowerEndpointDigest: ethers.ZeroHash,
      roots: [],
    },
  };

  it("Should execute complete cross-chain signal submission, attestation verification, and policy decision sequence", async function () {
    // Phase 1: Submit Signal on Source Chain
    const signalValue = 50000n; // $50,000 equivalent
    const tx1 = await sourceEmitter.submitSignal(subject.address, signalValue);
    const receipt1 = await tx1.wait();

    const signalEvent = receipt1.logs.find(
      (log) => log.fragment && log.fragment.name === "RiskSignalSubmitted"
    );
    expect(signalEvent).to.not.be.undefined;
    const [signalId, , , sourceTimestamp] = signalEvent.args;

    // Phase 2: Worker Generates Proof and Submits to Attestcoin ASC
    const encodedTx = createEncodedTransaction({
      emitter: await sourceEmitter.getAddress(),
      signalId,
      subjectAddress: subject.address,
      signalValue,
      timestamp: sourceTimestamp,
    });

    const tx2 = await asc.submitProof(
      1, // chainKey for Sepolia
      100, // block header height
      encodedTx,
      dummyProof.merkleProof,
      dummyProof.continuityProof
    );
    const receipt2 = await tx2.wait();

    const factEvent = receipt2.logs.find(
      (log) => log.fragment && log.fragment.name === "VerifiedFactCreated"
    );
    expect(factEvent).to.not.be.undefined;
    const evidenceId = factEvent.args[0];

    // Verify Attestcoin now stores the fact
    const [, , storedVal, , exists] = await asc.getFact(evidenceId);
    expect(exists).to.be.true;
    expect(storedVal).to.equal(signalValue);

    // Phase 3: AI Oracle processes decision and submits to ProofMindDecision contract
    const proposedLimit = 75000n; // limit higher than requested value ($75k)
    const riskScore = 40n;        // low risk score (40/100)

    const decisionAsOracle = decisionContract.connect(oracle);
    const tx3 = await decisionAsOracle.executeDecision(
      evidenceId,
      1, // 1 = Approved
      riskScore,
      proposedLimit
    );
    const receipt3 = await tx3.wait();

    const decisionEvent = receipt3.logs.find(
      (log) => log.fragment && log.fragment.name === "DecisionExecuted"
    );
    expect(decisionEvent).to.not.be.undefined;
    expect(decisionEvent.args[1]).to.equal(1n); // Approved
    expect(decisionEvent.args[2]).to.equal(riskScore);
    expect(decisionEvent.args[3]).to.equal(proposedLimit);

    // Verify final state
    const [storedDecision, storedScore, storedLimit, , decisionExists] =
      await decisionContract.decisions(evidenceId);

    expect(decisionExists).to.be.true;
    expect(storedDecision).to.equal(1n); // Approved
    expect(storedScore).to.equal(riskScore);
    expect(storedLimit).to.equal(proposedLimit);
  });
});
