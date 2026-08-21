// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockAttestcoin {
    struct MockFact {
        uint64 chainKey;
        address subject;
        uint256 signalValue;
        uint256 timestamp;
        bool exists;
    }
    mapping(bytes32 => MockFact) public facts;

    function setFact(
        bytes32 evidenceId,
        uint64 chainKey,
        address subject,
        uint256 signalValue,
        uint256 timestamp,
        bool exists
    ) external {
        facts[evidenceId] = MockFact(chainKey, subject, signalValue, timestamp, exists);
    }

    function getFact(bytes32 evidenceId) external view returns (uint64, address, uint256, uint256, bool) {
        MockFact memory f = facts[evidenceId];
        return (f.chainKey, f.subject, f.signalValue, f.timestamp, f.exists);
    }
}
