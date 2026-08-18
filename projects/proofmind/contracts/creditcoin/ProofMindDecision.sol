// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ProofMindAttestcoin} from "./ProofMindAttestcoin.sol";

/**
 * @title ProofMindDecision
 * @dev Deterministic on-chain policy and decision enforcement contract on Creditcoin.
 *      Enforces bounds on AI proposals (score, amount, deadline) and checks signatures.
 */
contract ProofMindDecision {
    using ECDSA for bytes32;

    enum Action { NO_ACTION, APPROVE_LIMIT, FLAG_REVIEW }
    enum Decision { REJECT, ALLOW, REVIEW }

    event DecisionExecuted(
        bytes32 indexed evidenceId,
        Decision decision,
        uint256 score,
        uint256 limit,
        Action action
    );
    event DecisionRejected(bytes32 indexed evidenceId, string reason);

    error Unauthorized();
    error EvidenceNotVerified();
    error AlreadyExecuted();
    error InvalidScore(uint256 score);
    error LimitExceeded(uint256 limit, uint256 maxLimit);
    error DecisionExpired();
    error InvalidSignature();

    ProofMindAttestcoin public immutable ascContract;
    address public owner;
    address public aiSigner;

    uint256 public constant MAX_LIMIT = 5000 * 10**18; // Max limit: 5000 tokens
    uint256 public constant MIN_SCORE = 70; // Min score for APPROVE_LIMIT

    // Replay protection: evidenceId => executed
    mapping(bytes32 => bool) public executed;

    // State model: track subject limits and review flags
    mapping(address => uint256) public subjectLimits;
    mapping(address => bool) public subjectInReview;

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    constructor(address _ascContract, address _aiSigner) {
        ascContract = ProofMindAttestcoin(_ascContract);
        aiSigner = _aiSigner;
        owner = msg.sender;
    }

    function setAiSigner(address _newSigner) external onlyOwner {
        aiSigner = _newSigner;
    }

    /**
     * @notice Enforces AI decision policy deterministically on-chain.
     */
    function executeDecision(
        bytes32 evidenceId,
        Decision decision,
        uint256 score,
        Action action,
        uint256 limit,
        string calldata modelVersion,
        uint256 deadline,
        bytes calldata signature
    ) external {
        // 1. Replay protection
        if (executed[evidenceId]) {
            revert AlreadyExecuted();
        }

        // 2. Expiry check
        if (block.timestamp > deadline) {
            revert DecisionExpired();
        }

        // 3. Verify evidence ID was verified by the ASC
        (, address subject,,, bool exists) = ascContract.verifiedFacts(evidenceId);
        if (!exists) {
            revert EvidenceNotVerified();
        }

        // 4. Verify AI backend signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                evidenceId,
                uint8(decision),
                score,
                uint8(action),
                limit,
                modelVersion,
                deadline
            )
        );
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        if (ethSignedMessageHash.recover(signature) != aiSigner) {
            revert InvalidSignature();
        }

        // 5. Enforce policy bounds
        if (action == Action.APPROVE_LIMIT) {
            if (decision != Decision.ALLOW) {
                revert Unauthorized(); // APPROVE_LIMIT requires ALLOW decision
            }
            if (score < MIN_SCORE) {
                revert InvalidScore(score);
            }
            if (limit > MAX_LIMIT) {
                revert LimitExceeded(limit, MAX_LIMIT);
            }

            subjectLimits[subject] = limit;
        } else if (action == Action.FLAG_REVIEW) {
            if (decision != Decision.REVIEW) {
                revert Unauthorized();
            }
            subjectInReview[subject] = true;
        } else if (action == Action.NO_ACTION) {
            if (decision != Decision.REJECT) {
                revert Unauthorized();
            }
            // Rejection: clear any limits
            subjectLimits[subject] = 0;
        }

        executed[evidenceId] = true;

        emit DecisionExecuted(evidenceId, decision, score, limit, action);
    }
}
