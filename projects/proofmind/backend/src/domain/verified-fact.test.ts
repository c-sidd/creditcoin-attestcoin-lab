import { isUsableVerifiedFact, VerifiedFact } from "./verified-fact";

describe("VerifiedFact", () => {
  const fact: VerifiedFact = {
    factId: "fact-1",
    sourceChain: "ethereum-sepolia",
    sourceContract: "0x123",
    sourceTransactionHash: "0xtx",
    sourceBlockNumber: 10,
    eventName: "FinancialSignalSubmitted",
    subject: "0x456",
    signalType: "REPAYMENT",
    amount: "500",
    timestamp: 1000,
    proof: {
      protocol: "attestcoin",
      proofId: "proof-1",
    },
    status: "VERIFIED",
  };

  it("accepts a verified Attestcoin-backed fact", () => {
    expect(isUsableVerifiedFact(fact)).toBe(true);
  });

  it("rejects pending evidence", () => {
    expect(isUsableVerifiedFact({ ...fact, status: "PENDING" })).toBe(false);
  });
});
