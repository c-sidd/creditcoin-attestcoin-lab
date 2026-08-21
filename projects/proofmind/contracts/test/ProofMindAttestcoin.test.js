const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("ProofMindAttestcoin", function () {
  let ProofMindAttestcoin;
  let asc;
  let MockBlockProver;
  let mockProver;
  let owner;
  let addr1;
  let addr2;

  const PRECOMPILE_ADDRESS = "0x0000000000000000000000000000000000000FD2";
  const sourceContractAddress = "0xA5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // 1. Deploy MockBlockProver
    MockBlockProver = await ethers.getContractFactory("MockBlockProver");
    mockProver = await MockBlockProver.deploy();
    await mockProver.waitForDeployment();

    // 2. Set the code of the precompile address to the MockBlockProver bytecode
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

    // 4. Deploy ProofMindAttestcoin with linked library
    ProofMindAttestcoin = await ethers.getContractFactory("ProofMindAttestcoin", {
      libraries: {
        "@gluwa/usc-contracts/contracts/decoding/EvmV1Decoder.sol:EvmV1Decoder": decoderAddress,
      },
    });
    asc = await ProofMindAttestcoin.deploy(sourceContractAddress);
    await asc.waitForDeployment();
  });

  // Helper to generate a validly encoded transaction payload
  function createEncodedTransaction({
    status = 1,
    emitter = sourceContractAddress,
    signalId = ethers.id("test-signal"),
    subject = addr1.address,
    signalValue = 100n,
    timestamp = 1718919293n,
    hasCorrectEvent = true,
  }) {
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();

    // 1. Encode CommonTxFields
    const commonTxEncoded = abiCoder.encode(
      ["uint64", "uint64", "address", "bool", "address", "uint256", "bytes"],
      [0, 21000, ethers.ZeroAddress, false, ethers.ZeroAddress, 0, "0x"]
    );

    // 2. Encode LogEntryTuple
    const eventSignature = ethers.id("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
    const wrongEventSignature = ethers.id("WrongEvent(address)");

    const logEntry = {
      address_: emitter,
      topics: [
        hasCorrectEvent ? eventSignature : wrongEventSignature,
        signalId,
        ethers.zeroPadValue(subject, 32),
      ],
      data: abiCoder.encode(["uint256", "uint256"], [signalValue, timestamp]),
    };

    // 3. Encode ReceiptFields
    const receiptEncoded = abiCoder.encode(
      ["uint8", "uint64", "tuple(address address_, bytes32[] topics, bytes data)[]", "bytes"],
      [
        status, // Status
        21000, // Gas Used
        [logEntry], // Logs
        "0x", // Bloom
      ]
    );

    // 4. Encode LegacyFields for Type 0 transaction
    const legacyFieldsEncoded = abiCoder.encode(
      ["uint128", "uint256", "bytes32", "bytes32"],
      [1000000000n, 1n, ethers.ZeroHash, ethers.ZeroHash]
    );

    // 5. Final transaction encoding
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

  describe("Verification Happy Path", function () {
    it("Should successfully submit proof, decode fact, and create VerifiedFact", async function () {
      const signalId = ethers.id("test-happy-path");
      const encodedTx = createEncodedTransaction({
        signalId,
        subject: addr1.address,
        signalValue: 500n,
      });

      const tx = await asc.submitProof(
        1, // chainKey
        100, // headerNumber
        encodedTx,
        dummyProof.merkleProof,
        dummyProof.continuityProof
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "VerifiedFactCreated"
      );
      expect(event).to.not.be.undefined;

      const [evidenceId, chainKey, subject, signalValue] = event.args;
      expect(chainKey).to.equal(1n);
      expect(subject).to.equal(addr1.address);
      expect(signalValue).to.equal(500n);

      // Verify state storage
      const [storedChainKey, storedSubject, storedValue, storedTimestamp, storedExists] =
        await asc.getFact(evidenceId);
      expect(storedChainKey).to.equal(1n);
      expect(storedSubject).to.equal(addr1.address);
      expect(storedValue).to.equal(500n);
      expect(storedExists).to.be.true;
    });
  });

  describe("Negative Paths", function () {
    it("Should revert if BlockProver verification fails", async function () {
      const encodedTx = createEncodedTransaction({});

      await expect(
        asc.submitProof(
          999, // chainKey 999 triggers false return in mock BlockProver
          100,
          encodedTx,
          dummyProof.merkleProof,
          dummyProof.continuityProof
        )
      ).to.be.revertedWith("Attestcoin verification failed");
    });

    it("Should revert if source transaction status is failed (status != 1)", async function () {
      const encodedTx = createEncodedTransaction({ status: 0 });

      await expect(
        asc.submitProof(
          1,
          100,
          encodedTx,
          dummyProof.merkleProof,
          dummyProof.continuityProof
        )
      ).to.be.revertedWith("Source transaction failed");
    });

    it("Should revert if required event is missing", async function () {
      const encodedTx = createEncodedTransaction({ hasCorrectEvent: false });

      await expect(
        asc.submitProof(
          1,
          100,
          encodedTx,
          dummyProof.merkleProof,
          dummyProof.continuityProof
        )
      ).to.be.revertedWith("RiskSignalSubmitted event not found");
    });

    it("Should revert if event is emitted by an invalid source contract", async function () {
      const encodedTx = createEncodedTransaction({ emitter: addr2.address });

      await expect(
        asc.submitProof(
          1,
          100,
          encodedTx,
          dummyProof.merkleProof,
          dummyProof.continuityProof
        )
      ).to.be.revertedWith("Event from invalid source contract");
    });

    it("Should prevent replaying verified evidence", async function () {
      const signalId = ethers.id("replay-test");
      const encodedTx = createEncodedTransaction({ signalId });

      // First submission passes
      await asc.submitProof(
        1,
        100,
        encodedTx,
        dummyProof.merkleProof,
        dummyProof.continuityProof
      );

      // Second submission fails as replay
      await expect(
        asc.submitProof(
          1,
          100,
          encodedTx,
          dummyProof.merkleProof,
          dummyProof.continuityProof
        )
      ).to.be.revertedWith("Replayed evidence");
    });
  });
});
