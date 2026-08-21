import { ProofBuilderClient } from "../src/proof-builder";

// Mock the SDK
jest.mock("@gluwa/usc-sdk", () => {
  return {
    proofProvider: {
      service: {
        ProofBuilder: jest.fn().mockImplementation(() => {
          return {
            waitUntilHeightAttested: jest.fn().mockImplementation((blockNumber) => {
              if (blockNumber === 9999) {
                return Promise.reject(new Error("Timeout waiting for block"));
              }
              return Promise.resolve();
            }),
            getProof: jest.fn().mockImplementation((txHash) => {
              if (txHash === "0xerror") {
                return Promise.reject(new Error("Network failure"));
              }
              if (txHash === "0xmalformed") {
                return {}; // Missing fields
              }
              return {
                headerNumber: 100,
                txBytes: "0xabcdef",
                merkleProof: {
                  root: "0xroot",
                  siblings: [{ hash: "0xsibling", isLeft: true }],
                },
                continuityProof: {
                  lowerEndpointDigest: "0xlower",
                  roots: ["0xroot"],
                },
              };
            }),
          };
        }),
      },
    },
  };
});

describe("ProofBuilderClient Tests", () => {
  let client: ProofBuilderClient;

  beforeEach(() => {
    client = new ProofBuilderClient(1, "https://prover.cc3-testnet.creditcoin.network");
  });

  it("should fail initialization with empty URL", () => {
    expect(() => new ProofBuilderClient(1, "")).toThrow("Proof Builder URL is required");
  });

  it("should successfully wait for attestation", async () => {
    await expect(client.waitForAttestation(100)).resolves.not.toThrow();
  });

  it("should propagate errors when attestation wait fails", async () => {
    await expect(client.waitForAttestation(9999)).rejects.toThrow("Failed waiting for attestation of block 9999");
  });

  it("should validate txHash input format", async () => {
    await expect(client.getProof("invalid-hash")).rejects.toThrow("Invalid transaction hash");
  });

  it("should successfully fetch and format proofs", async () => {
    const proof = await client.getProof("0x1234567890abcdef");
    expect(proof.chainKey).toBe(1);
    expect(proof.headerNumber).toBe(100);
    expect(proof.txBytes).toBe("0xabcdef");
    expect(proof.merkleProof.root).toBe("0xroot");
    expect(proof.merkleProof.siblings[0].hash).toBe("0xsibling");
    expect(proof.merkleProof.siblings[0].isLeft).toBe(true);
  });

  it("should reject malformed proof builder responses", async () => {
    await expect(client.getProof("0xmalformed")).rejects.toThrow("Proof response is missing required fields");
  });

  it("should propagate network or service errors", async () => {
    await expect(client.getProof("0xerror")).rejects.toThrow("Failed to fetch proof for transaction 0xerror");
  });
});
