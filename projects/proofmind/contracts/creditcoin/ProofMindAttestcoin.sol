// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {INativeQueryVerifier, NativeQueryVerifierLib} from "@gluwa/usc-contracts/contracts/write-ability/common/INativeQueryVerifier.sol";
import {EvmV1Decoder} from "@gluwa/usc-contracts/contracts/write-ability/common/EvmV1Decoder.sol";

/**
 * @title ProofMindAttestcoin
 * @dev Attestcoin Smart Contract (ASC) on Creditcoin to verify Sepolia transaction proofs
 *      via precompile at 0x0FD2, decode verified events, and prevent replays.
 */
contract ProofMindAttestcoin {
    event VerifiedFactCreated(
        bytes32 indexed evidenceId,
        bytes32 indexed sourceTxHash,
        address indexed subject,
        uint256 signalValue,
        uint256 timestamp
    );

    error AlreadyProcessed(bytes32 queryId);
    error ProofVerificationFailed();
    error InvalidTxStatus();
    error EventNotFound();
    error InvalidSourceContract();

    // Replay protection: queryId => processed status
    mapping(bytes32 => bool) public processedQueries;
    // Map evidenceId (signalId) to verified fact details
    struct VerifiedFact {
        bytes32 sourceTxHash;
        address subject;
        uint256 signalValue;
        uint256 timestamp;
        bool exists;
    }
    mapping(bytes32 => VerifiedFact) public verifiedFacts;

    address public immutable sourceContract;

    bytes32 public constant RISK_SIGNAL_SUBMITTED_SIG =
        keccak256("RiskSignalSubmitted(bytes32,address,uint256,uint256)");

    constructor(address _sourceContract) {
        sourceContract = _sourceContract;
    }

    /**
     * @notice Submits cross-chain transaction proof to verify, decode event, and create a VerifiedFact.
     */
    function verifyCrossChainEvent(
        uint64 chainKey,
        uint64 blockHeight,
        bytes calldata encodedTransaction,
        INativeQueryVerifier.MerkleProof calldata merkleProof,
        INativeQueryVerifier.ContinuityProof calldata continuityProof,
        bytes32 sourceTxHash
    ) external returns (bytes32 signalId) {
        // 1. Calculate query ID and check replay
        uint64 txIndex = NativeQueryVerifierLib.getVerifier().calculateTxIndex(merkleProof);
        bytes32 queryId = keccak256(abi.encodePacked(chainKey, blockHeight, txIndex));
        if (processedQueries[queryId]) {
            revert AlreadyProcessed(queryId);
        }

        // 2. Call Native Query Verifier precompile (0x0FD2)
        bool verified = NativeQueryVerifierLib.getVerifier().verifyAndEmit(
            chainKey,
            blockHeight,
            encodedTransaction,
            merkleProof,
            continuityProof
        );
        if (!verified) {
            revert ProofVerificationFailed();
        }

        // Mark query as processed
        processedQueries[queryId] = true;

        // 3. Decode receipt fields
        EvmV1Decoder.ReceiptFields memory receipt = EvmV1Decoder.decodeReceiptFields(encodedTransaction);
        if (receipt.receiptStatus != 1) {
            revert InvalidTxStatus();
        }

        // 4. Find the expected event
        bool eventFound = false;
        for (uint256 i = 0; i < receipt.receiptLogs.length; i++) {
            EvmV1Decoder.LogEntry memory log = receipt.receiptLogs[i];
            
            // Check if log is from our source contract and matches the signal signature
            if (log.address_ == sourceContract && log.topics.length > 0 && log.topics[0] == RISK_SIGNAL_SUBMITTED_SIG) {
                signalId = log.topics[1];
                address subject = address(uint160(uint256(log.topics[2])));
                (uint256 signalValue, uint256 timestamp) = abi.decode(log.data, (uint256, uint256));

                verifiedFacts[signalId] = VerifiedFact({
                    sourceTxHash: sourceTxHash,
                    subject: subject,
                    signalValue: signalValue,
                    timestamp: timestamp,
                    exists: true
                });

                emit VerifiedFactCreated(signalId, sourceTxHash, subject, signalValue, timestamp);
                eventFound = true;
                break;
            }
        }

        if (!eventFound) {
            revert EventNotFound();
        }
    }
}
