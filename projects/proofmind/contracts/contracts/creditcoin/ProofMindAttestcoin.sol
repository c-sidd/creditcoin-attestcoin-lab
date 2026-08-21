// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@gluwa/usc-contracts/contracts/decoding/EvmV1Decoder.sol";
import "@gluwa/usc-contracts/contracts/write-ability/INativeQueryVerifier.sol";

contract ProofMindAttestcoin {
    using EvmV1Decoder for EvmV1Decoder.ReceiptFields;
    using EvmV1Decoder for EvmV1Decoder.LogEntry[];

    address public sourceContractAddress;
    address public owner;

    struct Fact {
        uint64 chainKey;
        address subject;
        uint256 signalValue;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => Fact) public verifiedFacts;

    event VerifiedFactCreated(bytes32 indexed evidenceId, uint64 chainKey, address indexed subject, uint256 signalValue);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _sourceContractAddress) {
        sourceContractAddress = _sourceContractAddress;
        owner = msg.sender;
    }

    function setSourceContractAddress(address _sourceContractAddress) external onlyOwner {
        sourceContractAddress = _sourceContractAddress;
    }

    function submitProof(
        uint64 chainKey,
        uint64 headerNumber,
        bytes calldata encodedTransaction,
        INativeQueryVerifier.MerkleProof calldata merkleProof,
        INativeQueryVerifier.ContinuityProof calldata continuityProof
    ) external returns (bytes32) {
        // 1. Verify proof using BlockProver precompile (0xFD2)
        INativeQueryVerifier verifier = NativeQueryVerifierLib.getVerifier();
        bool isVerified = verifier.verify(chainKey, headerNumber, encodedTransaction, merkleProof, continuityProof);
        require(isVerified, "Attestcoin verification failed");

        // 2. Decode receipt fields
        EvmV1Decoder.ReceiptFields memory receipt = EvmV1Decoder.decodeReceiptFields(encodedTransaction);
        require(receipt.receiptStatus == 1, "Source transaction failed");

        // 3. Search for the expected event signature
        bytes32 eventSignature = keccak256("RiskSignalSubmitted(bytes32,address,uint256,uint256)");
        EvmV1Decoder.LogEntry[] memory logs = EvmV1Decoder.getLogsByEventSignature(receipt, eventSignature);
        require(logs.length > 0, "RiskSignalSubmitted event not found");

        // Find the log emitted by the expected source contract
        EvmV1Decoder.LogEntry memory targetLog;
        bool found = false;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].address_ == sourceContractAddress) {
                targetLog = logs[i];
                found = true;
                break;
            }
        }
        require(found, "Event from invalid source contract");

        // 4. Decode event fields
        // RiskSignalSubmitted(bytes32 indexed signalId, address indexed subject, uint256 signalValue, uint256 timestamp)
        // Topics: [eventSignature, signalId, subject]
        require(targetLog.topics.length >= 3, "Invalid log topics count");
        bytes32 signalId = targetLog.topics[1];
        address subject = address(uint160(uint256(targetLog.topics[2])));

        (uint256 signalValue, uint256 timestamp) = abi.decode(targetLog.data, (uint256, uint256));

        // 5. Replay Protection
        bytes32 evidenceId = keccak256(abi.encodePacked(chainKey, signalId));
        require(!verifiedFacts[evidenceId].exists, "Replayed evidence");

        // 6. Record Fact
        verifiedFacts[evidenceId] = Fact({
            chainKey: chainKey,
            subject: subject,
            signalValue: signalValue,
            timestamp: timestamp,
            exists: true
        });

        emit VerifiedFactCreated(evidenceId, chainKey, subject, signalValue);
        return evidenceId;
    }

    function getFact(bytes32 evidenceId) external view returns (uint64, address, uint256, uint256, bool) {
        Fact memory fact = verifiedFacts[evidenceId];
        return (fact.chainKey, fact.subject, fact.signalValue, fact.timestamp, fact.exists);
    }
}
