// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title FinancialSignalEmitter
 * @notice Project-owned source-chain fixture used to create deterministic
 *         cross-chain financial facts for Attestcoin readability demos.
 *
 * This contract is NOT an Attestcoin primitive. It deliberately emits simple,
 * auditable events that can later be queried and proven through the protocol.
 */
contract FinancialSignalEmitter {
    enum SignalType {
        REPAYMENT,
        DEFAULT,
        DEPOSIT,
        WITHDRAWAL,
        COLLATERAL_UPDATE,
        CREDIT_EVENT
    }

    struct FinancialSignal {
        bytes32 signalId;
        address subject;
        SignalType signalType;
        uint256 amount;
        uint256 timestamp;
        bytes32 metadataHash;
    }

    mapping(bytes32 => FinancialSignal) public signals;

    error DuplicateSignal(bytes32 signalId);
    error InvalidSubject();
    error InvalidSignalId();

    event FinancialSignalSubmitted(
        bytes32 indexed signalId,
        address indexed subject,
        SignalType indexed signalType,
        uint256 amount,
        uint256 timestamp,
        bytes32 metadataHash
    );

    function submitSignal(
        bytes32 signalId,
        address subject,
        SignalType signalType,
        uint256 amount,
        bytes32 metadataHash
    ) external {
        if (signalId == bytes32(0)) revert InvalidSignalId();
        if (subject == address(0)) revert InvalidSubject();
        if (signals[signalId].timestamp != 0) revert DuplicateSignal(signalId);

        uint256 timestamp = block.timestamp;
        signals[signalId] = FinancialSignal({
            signalId: signalId,
            subject: subject,
            signalType: signalType,
            amount: amount,
            timestamp: timestamp,
            metadataHash: metadataHash
        });

        emit FinancialSignalSubmitted(
            signalId,
            subject,
            signalType,
            amount,
            timestamp,
            metadataHash
        );
    }
}
