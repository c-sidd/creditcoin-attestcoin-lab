const { expect } = require("chai");
const hre = require("hardhat");

describe("ProofMindAttestcoin", function () {
  let asc;
  let mockVerifier;
  let owner;
  let user;
  const PRECOMPILE_ADDRESS = "0x0000000000000000000000000000000000000FD2";
  const SOURCE_CONTRACT = "0x1111111111111111111111111111111111111111";

  beforeEach(async function () {
    [owner, user] = await hre.ethers.getSigners();

    // 1. Deploy mock verifier
    const MockNativeQueryVerifier = await hre.ethers.getContractFactory("MockNativeQueryVerifier");
    mockVerifier = await MockNativeQueryVerifier.deploy();
    await mockVerifier.waitForDeployment();

    // 2. Set bytecode of the precompile address 0x0FD2 to match the mock verifier
    const bytecode = await hre.ethers.provider.getCode(await mockVerifier.getAddress());
    await hre.network.provider.send("hardhat_setCode", [
      PRECOMPILE_ADDRESS,
      bytecode,
    ]);

    // Deploy ASC contract
    const ProofMindAttestcoin = await hre.ethers.getContractFactory("ProofMindAttestcoin");
    asc = await ProofMindAttestcoin.deploy(SOURCE_CONTRACT);
    await asc.waitForDeployment();

    // Reset precompile mock state to ensure clean slate
    const mockVerifierInstance = await hre.ethers.getContractAt("MockNativeQueryVerifier", PRECOMPILE_ADDRESS);
    await mockVerifierInstance.setShouldVerifyFail(false);
  });

  // Helper to build encodedTransaction chunks
  function buildEncodedTransaction(receiptStatus, logs) {
    const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();

    // chunk 0: nonce, gasLimit, from, toIsNull, to, value, data
    const chunk0 = abiCoder.encode(
      ["uint64", "uint64", "address", "bool", "address", "uint256", "bytes"],
      [0, 100000, owner.address, false, SOURCE_CONTRACT, 0, "0x"]
    );

    // chunk 1: type-specific fields (e.g. gasPrice, v, r, s for legacy)
    const chunk1 = abiCoder.encode(
      ["uint128", "uint256", "bytes32", "bytes32"],
      [1000000000, 27, hre.ethers.ZeroHash, hre.ethers.ZeroHash]
    );

    // chunk 2: receiptStatus, receiptGasUsed, logs, logsBloom
    // struct LogEntryTuple { address address_; bytes32[] topics; bytes data; }
    const chunk2 = abiCoder.encode(
      [
        "uint8",
        "uint64",
        "tuple(address address_, bytes32[] topics, bytes data)[]",
        "bytes",
      ],
      [receiptStatus, 50000, logs, "0x"]
    );

    const chunks = [chunk0, chunk1, chunk2];
    
    // Final encoding: abi.encode(uint8 txType, bytes[] chunks)
    return abiCoder.encode(["uint8", "bytes[]"], [0, chunks]);
  }

  it("should successfully verify a proof and decode the RiskSignalSubmitted event", async function () {
    const signalId = hre.ethers.randomBytes(32);
    const subject = user.address;
    const signalValue = 99;
    const timestamp = Math.floor(Date.now() / 1000);

    const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();
    const eventSig = hre.ethers.id("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
    
    // Log entry
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

    const encodedTx = buildEncodedTransaction(1, logs);

    // Fake proofs
    const merkleProof = {
      root: hre.ethers.ZeroHash,
      siblings: [],
    };
    const continuityProof = {
      lowerEndpointDigest: hre.ethers.ZeroHash,
      roots: [],
    };

    const tx = await asc.verifyCrossChainEvent(
      1,
      12345,
      encodedTx,
      merkleProof,
      continuityProof,
      hre.ethers.ZeroHash
    );

    await expect(tx)
      .to.emit(asc, "VerifiedFactCreated")
      .withArgs(
        hre.ethers.hexlify(signalId),
        hre.ethers.ZeroHash,
        subject,
        signalValue,
        timestamp
      );

    // Verify stored state
    const fact = await asc.verifiedFacts(signalId);
    expect(fact.exists).to.equal(true);
    expect(fact.subject).to.equal(subject);
    expect(fact.signalValue).to.equal(signalValue);
  });

  it("should revert if the precompile verification fails", async function () {
    // Set mock precompile to fail
    const mockVerifierInstance = await hre.ethers.getContractAt("MockNativeQueryVerifier", PRECOMPILE_ADDRESS);
    await mockVerifierInstance.setShouldVerifyFail(true);

    const encodedTx = buildEncodedTransaction(1, []);
    const merkleProof = { root: hre.ethers.ZeroHash, siblings: [] };
    const continuityProof = { lowerEndpointDigest: hre.ethers.ZeroHash, roots: [] };

    await expect(
      asc.verifyCrossChainEvent(1, 12345, encodedTx, merkleProof, continuityProof, hre.ethers.ZeroHash)
    ).to.be.revertedWithCustomError(asc, "ProofVerificationFailed");
  });

  it("should revert if query has already been processed", async function () {
    const signalId = hre.ethers.randomBytes(32);
    const subject = user.address;
    const signalValue = 99;
    const timestamp = Math.floor(Date.now() / 1000);

    const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();
    const eventSig = hre.ethers.id("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
    
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

    const encodedTx = buildEncodedTransaction(1, logs);
    const merkleProof = { root: hre.ethers.ZeroHash, siblings: [] };
    const continuityProof = { lowerEndpointDigest: hre.ethers.ZeroHash, roots: [] };

    // First call succeeds and commits processedQueries state
    await asc.verifyCrossChainEvent(1, 12345, encodedTx, merkleProof, continuityProof, hre.ethers.ZeroHash);

    // Second call should fail on replay protection
    await expect(
      asc.verifyCrossChainEvent(1, 12345, encodedTx, merkleProof, continuityProof, hre.ethers.ZeroHash)
    ).to.be.revertedWithCustomError(asc, "AlreadyProcessed");
  });

  it("should revert if receipt status is not 1", async function () {
    const encodedTx = buildEncodedTransaction(0, []); // status 0 (failed)
    const merkleProof = { root: hre.ethers.ZeroHash, siblings: [] };
    const continuityProof = { lowerEndpointDigest: hre.ethers.ZeroHash, roots: [] };

    await expect(
      asc.verifyCrossChainEvent(1, 12345, encodedTx, merkleProof, continuityProof, hre.ethers.ZeroHash)
    ).to.be.revertedWithCustomError(asc, "InvalidTxStatus");
  });
});
