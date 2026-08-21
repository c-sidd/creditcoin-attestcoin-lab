import request from "supertest";
import { expect } from "chai";
import app from "../src/app";

describe("Backend Foundation API", () => {
  it("should return 200 OK and health status from /api/health", async () => {
    const res = await request(app)
      .get("/api/health")
      .expect(200);

    expect(res.body).to.have.property("status", "OK");
    expect(res.body).to.have.property("environment");
    expect(res.body).to.have.property("version", "1.0.0");
    expect(res.body).to.have.property("timestamp");
  });

  it("should return 404 for unknown routes", async () => {
    await request(app)
      .get("/api/unknown-route")
      .expect(404);
  });
});
