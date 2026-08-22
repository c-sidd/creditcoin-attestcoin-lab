import request from "supertest";
import app from "../src/index";

describe("Health API endpoints", () => {
  it("should redirect /health to /api/v1/health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(302);
  });

  it("should return status OK on /api/v1/health", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
    expect(res.body.service).toContain("Backend API");
  });
});
