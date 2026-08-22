import { ethers } from "ethers";
import { PolicyDecision } from "./risk-controls";

export interface TransactionIntent {
  to: string;
  data: string;
  args: {
    evidenceId: string;
    decisionVal: number; // 1 = Approved, 2 = Rejected
    score: number;
    proposedLimit: string; // string representing BigInt
  };
}

export class IntentSerializer {
  private contractInterface: ethers.Interface;
  private contractAddress: string;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
    // ABI for executeDecision function
    this.contractInterface = new ethers.Interface([
      "function executeDecision(bytes32 evidenceId, uint8 decisionVal, uint256 score, uint256 proposedLimit) external returns (bool)"
    ]);
  }

  /**
   * Serialize a policy decision and evidenceId into a TransactionIntent.
   */
  serialize(evidenceId: string, policy: PolicyDecision): TransactionIntent {
    if (!evidenceId || !/^0x[a-fA-F0-9]{64}$/.test(evidenceId)) {
      throw new Error(`Invalid evidence ID: ${evidenceId}`);
    }

    if (!policy.admissible) {
      throw new Error("Cannot serialize inadmissible policy decisions");
    }

    const decisionVal = policy.decision === "APPROVE" ? 1 : 2;
    const proposedLimit = policy.decision === "APPROVE" ? policy.amount : "0";

    // Encode function calldata
    const data = this.contractInterface.encodeFunctionData("executeDecision", [
      evidenceId,
      decisionVal,
      policy.requiresManualReview ? 50n : 30n, // use representative score values
      BigInt(proposedLimit)
    ]);

    return {
      to: this.contractAddress,
      data,
      args: {
        evidenceId,
        decisionVal,
        score: policy.requiresManualReview ? 50 : 30,
        proposedLimit
      }
    };
  }
}
