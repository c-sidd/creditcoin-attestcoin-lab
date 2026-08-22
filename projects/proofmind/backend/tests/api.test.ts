import request from "supertest";
import { ethers } from "ethers";

// Mock the BackendJobStore using a global variable to avoid Jest hoisting race conditions
jest.mock("../src/persistence", () => {
  return {
    BackendJobStore: jest.fn().mockImplementation(() => {
      return {
        getAllJobs: () => (global as any).mockJobs || [],
        getJob: (eventId: string) => {
          const jobs = (global as any).mockJobs || [];
          return jobs.find((j: any) => j.event_id === eventId);
        }
      };
    })
  };
});

// Import app after mock is established
import app from "../src/index";

describe("REST API Endpoints Tests", () => {
  const dummyJob = {
    id: "test-id",
    event_id: "1-100-0xtx-0",
    chain_key: 1,
    contract_address: "0x" + "a".repeat(40),
    transaction_hash: "0x" + "b".repeat(64),
    block_number: 100,
    log_index: 0,
    event_name: "RiskSignalSubmitted",
    encoded_data: JSON.stringify({
      signalId: "0x" + "c".repeat(64),
      subject: "0x" + "d".repeat(40),
      signalValue: "25000",
      timestamp: Math.floor(Date.now() / 1000).toString()
    }),
    status: "EXECUTED",
    attempts: 0,
    created_at: Date.now(),
    updated_at: Date.now()
  };

  beforeEach(() => {
    (global as any).mockJobs = [];
  });

  it("should list all evidence jobs with pagination", async () => {
    (global as any).mockJobs = [dummyJob];

    const res = await request(app).get("/api/v1/evidence?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.total).toBe(1);
  });

  it("should filter evidence jobs by status", async () => {
    (global as any).mockJobs = [
      dummyJob,
      { ...dummyJob, event_id: "1-100-0xtx-1", status: "DETECTED" }
    ];

    const res = await request(app).get("/api/v1/evidence?status=EXECUTED");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe("EXECUTED");
  });

  it("should get specific job details", async () => {
    (global as any).mockJobs = [dummyJob];

    const res = await request(app).get("/api/v1/evidence/1-100-0xtx-0");
    expect(res.status).toBe(200);
    expect(res.body.event_id).toBe("1-100-0xtx-0");
  });

  it("should return 404 for non-existent job details", async () => {
    (global as any).mockJobs = [];

    const res = await request(app).get("/api/v1/evidence/non-existent");
    expect(res.status).toBe(404);
  });

  it("should process decision and return intent for valid job", async () => {
    (global as any).mockJobs = [dummyJob];

    const res = await request(app).post("/api/v1/evidence/1-100-0xtx-0/decision");
    expect(res.status).toBe(200);
    expect(res.body.recommendation.decision).toBe("APPROVE");
    expect(res.body.policyOutcome.admissible).toBe(true);
    expect(res.body.transactionIntent).toBeDefined();
    expect(res.body.transactionIntent.args.decisionVal).toBe(1); // Approved
  });
});
