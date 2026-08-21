// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@gluwa/usc-contracts/contracts/write-ability/INativeQueryVerifier.sol";

contract MockBlockProver is INativeQueryVerifier {
    function verify(
        uint64 chainKey,
        uint64 height,
        bytes calldata encodedTransaction,
        INativeQueryVerifier.MerkleProof calldata merkleProof,
        INativeQueryVerifier.ContinuityProof calldata continuityProof
    ) external pure override returns (bool) {
        if (chainKey == 999) {
            return false;
        }
        return true;
    }
}
