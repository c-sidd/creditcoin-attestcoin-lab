// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {INativeQueryVerifier} from "@gluwa/usc-contracts/contracts/write-ability/common/INativeQueryVerifier.sol";

contract MockNativeQueryVerifier is INativeQueryVerifier {
    bool public shouldVerifyFail;
    uint64 public mockTxIndex = 0;

    function setShouldVerifyFail(bool _fail) external {
        shouldVerifyFail = _fail;
    }

    function setMockTxIndex(uint64 _index) external {
        mockTxIndex = _index;
    }

    function verifyAndEmit(
        uint64 chainKey,
        uint64 height,
        bytes calldata encodedTransaction,
        MerkleProof calldata merkleProof,
        ContinuityProof calldata continuityProof
    ) external override returns (bool) {
        if (!shouldVerifyFail) {
            emit TransactionVerified(chainKey, height, mockTxIndex);
            return true;
        }
        return false;
    }

    function verifyAndEmit(
        uint64 chainKey,
        uint64[] calldata heights,
        bytes[] calldata encodedTransactions,
        MerkleProof[] calldata merkleProofs,
        ContinuityProof calldata sharedContinuityProof
    ) external override returns (bool) {
        return !shouldVerifyFail;
    }

    function verify(
        uint64 chainKey,
        uint64 height,
        bytes calldata encodedTransaction,
        MerkleProof calldata merkleProof,
        ContinuityProof calldata continuityProof
    ) external view override returns (bool) {
        return !shouldVerifyFail;
    }

    function verify(
        uint64 chainKey,
        uint64[] calldata heights,
        bytes[] calldata encodedTransactions,
        MerkleProof[] calldata merkleProofs,
        ContinuityProof calldata sharedContinuityProof
    ) external view override returns (bool) {
        return !shouldVerifyFail;
    }

    function calculateTxIndex(
        MerkleProof calldata merkleProof
    ) external view override returns (uint64) {
        return mockTxIndex;
    }
}
