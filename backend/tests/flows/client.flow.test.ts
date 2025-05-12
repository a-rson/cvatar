import request from "supertest";
import { server } from "../../src/server";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

let app: any; // actual running HTTP server

beforeAll(async () => {
  await server.ready(); // Ensure Fastify is bootstrapped
  app = server.server; // Access underlying Node.js http.Server
});

afterAll(async () => {
  await server.close();
});

describe("Provider Flow", () => {
  it("runs full client access flow", async () => {
    const email = `client+${Date.now()}@example.com`;
    const register = await request(app).post("/auth/register").send({
      email,
      password: "secure123",
      type: "client",
    });
    expect(register.status).toBe(200);

    const login = await request(app).post("/auth/login").send({
      email,
      password: "secure123",
    });
    expect(login.status).toBe(200);
    const token = login.body.token;
    expect(token).toBeDefined();
  });
});
