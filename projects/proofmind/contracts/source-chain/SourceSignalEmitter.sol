// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SourceSignalEmitter
 * @dev Minimal contract to emit cross-chain ProofMind risk signal events on Sepolia.
 */
contract SourceSignalEmitter {
    event RiskSignalSubmitted(
        bytes32 indexed signalId,
        address indexed subject,
        uint256 signalValue,
        uint256 timestamp
    );

    // Keep track of signal IDs to prevent duplicates on the source chain
    mapping(bytes32 => bool) public submittedSignals;

    error DuplicateSignal(bytes32 signalId);
    error InvalidSubject();

    /**
     * @notice Submits a risk signal to be verified by Attestcoin.
     * @param signalId The unique identifier of this signal.
     * @param subject The target address of the signal (e.g. borrower).
     * @param signalValue The numeric risk rating/value.
     */
    function submitSignal(
        bytes32 signalId,
        address subject,
        uint256 signalValue
    ) external {
        if (subject == address(0)) {
            revert InvalidSubject();
        }
        if (submittedSignals[signalId]) {
            revert DuplicateSignal(signalId);
        }

        submittedSignals[signalId] = true;

        emit RiskSignalSubmitted(
            signalId,
            subject,
            signalValue,
            block.timestamp
        );
    }
}
