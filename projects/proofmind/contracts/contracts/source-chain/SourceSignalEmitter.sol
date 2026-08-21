// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SourceSignalEmitter {
    uint256 public nonce;
    mapping(bytes32 => bool) public processedSignals;

    event RiskSignalSubmitted(
        bytes32 indexed signalId,
        address indexed subject,
        uint256 signalValue,
        uint256 timestamp
    );

    function submitSignal(address subject, uint256 signalValue) external returns (bytes32) {
        require(subject != address(0), "Invalid subject address");
        require(signalValue > 0, "Signal value must be positive");

        bytes32 signalId = keccak256(abi.encodePacked(msg.sender, subject, signalValue, block.timestamp, nonce));
        nonce++;

        processedSignals[signalId] = true;

        emit RiskSignalSubmitted(signalId, subject, signalValue, block.timestamp);
        return signalId;
    }
}
