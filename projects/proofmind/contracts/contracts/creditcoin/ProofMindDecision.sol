// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IProofMindAttestcoin {
    function getFact(bytes32 evidenceId) external view returns (uint64, address, uint256, uint256, bool);
}

contract ProofMindDecision {
    address public owner;
    IProofMindAttestcoin public attestcoinContract;

    uint256 public maxAllowedLimit = 1000000; // Configurable upper limit
    uint256 public maxRiskScore = 70;         // Max allowed risk score (0-100 scale)
    uint256 public expiryWindow = 24 hours;   // Expiry window for facts

    enum DecisionType { None, Approved, Rejected }

    struct DecisionRecord {
        DecisionType decision;
        uint256 score;
        uint256 limit;
        uint256 executedAt;
        bool exists;
    }

    mapping(bytes32 => DecisionRecord) public decisions;
    mapping(address => bool) public authorizedOracles;

    event DecisionExecuted(bytes32 indexed evidenceId, uint8 decision, uint256 score, uint256 limit);
    event DecisionRejected(bytes32 indexed evidenceId, string reason);
    event OracleAuthorizationChanged(address indexed oracle, bool authorized);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedOracles[msg.sender], "Unauthorized caller");
        _;
    }

    constructor(address _attestcoinContract) {
        owner = msg.sender;
        attestcoinContract = IProofMindAttestcoin(_attestcoinContract);
        authorizedOracles[msg.sender] = true;
    }

    function setAttestcoinContract(address _attestcoinContract) external onlyOwner {
        attestcoinContract = IProofMindAttestcoin(_attestcoinContract);
    }

    function setLimits(uint256 _maxLimit, uint256 _maxRisk, uint256 _expiry) external onlyOwner {
        maxAllowedLimit = _maxLimit;
        maxRiskScore = _maxRisk;
        expiryWindow = _expiry;
    }

    function setOracleAuthorization(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
        emit OracleAuthorizationChanged(oracle, authorized);
    }

    function executeDecision(
        bytes32 evidenceId,
        uint8 decisionVal,
        uint256 score,
        uint256 proposedLimit
    ) external onlyAuthorized returns (bool) {
        // 1. Replay Protection
        require(!decisions[evidenceId].exists, "Decision already executed");

        // 2. Fetch and Verify Attestcoin Fact
        (, , uint256 signalValue, uint256 timestamp, bool exists) = attestcoinContract.getFact(evidenceId);
        require(exists, "Evidence not verified by Attestcoin");

        // 3. Enforce Expiry Policy
        require(block.timestamp <= timestamp + expiryWindow, "Evidence has expired");

        // 4. Validate Decision / Score Bounds
        DecisionType decision = DecisionType(decisionVal);
        require(decision == DecisionType.Approved || decision == DecisionType.Rejected, "Invalid decision type");

        if (decision == DecisionType.Approved) {
            // Validate risk score
            if (score > maxRiskScore) {
                decisions[evidenceId] = DecisionRecord({
                    decision: DecisionType.Rejected,
                    score: score,
                    limit: 0,
                    executedAt: block.timestamp,
                    exists: true
                });
                emit DecisionRejected(evidenceId, "Risk score exceeds maximum limit");
                return false;
            }

            // Validate requested amount/value from source signal against proposed limit
            if (signalValue > proposedLimit || proposedLimit > maxAllowedLimit) {
                decisions[evidenceId] = DecisionRecord({
                    decision: DecisionType.Rejected,
                    score: score,
                    limit: 0,
                    executedAt: block.timestamp,
                    exists: true
                });
                emit DecisionRejected(evidenceId, "Requested value exceeds proposed limit bounds");
                return false;
            }
        }

        // 5. Commit Decision State
        decisions[evidenceId] = DecisionRecord({
            decision: decision,
            score: score,
            limit: decision == DecisionType.Approved ? proposedLimit : 0,
            executedAt: block.timestamp,
            exists: true
        });

        emit DecisionExecuted(evidenceId, uint8(decision), score, proposedLimit);
        return true;
    }
}
