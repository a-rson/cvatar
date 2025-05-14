import request from "supertest";
import { server } from "../../src/server";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

let app: any;
let adminToken: string;
let createdUserId: string;

beforeAll(async () => {
  await server.ready();
  app = server.server;

  // Register and login admin
  const adminEmail = `admin+${Date.now()}@example.com`;
  const register = await request(app).post("/auth/register").send({
    email: adminEmail,
    password: "secure123",
    type: "admin",
  });
  expect(register.status).toBe(200);

  adminToken = register.body.token;
  expect(adminToken).toBeDefined();

  // Register another user
  const userEmail = `user+${Date.now()}@example.com`;
  const userRegister = await request(app).post("/auth/register").send({
    email: userEmail,
    password: "secure123",
    type: "client",
  });
  expect(userRegister.status).toBe(200);

  const userToken = userRegister.body.token;
  expect(userToken).toBeDefined();

  // Get created user's ID via /me
  const me = await request(app)
    .get("/me")
    .set("Authorization", `Bearer ${userToken}`);
  expect(me.status).toBe(200);

  createdUserId = me.body.id;
  expect(createdUserId).toBeDefined();
});

afterAll(async () => {
  await server.close();
});

describe("Admin Flow", () => {
  it("can list all users", async () => {
    const res = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("can fetch a single user by ID", async () => {
    const res = await request(app)
      .get(`/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it("can update a user", async () => {
    const res = await request(app)
      .put(`/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ type: "provider" });
    expect(res.status).toBe(200);
    expect(res.body.type).toBe("provider");
  });

  it("can view token access logs", async () => {
    const res = await request(app)
      .get("/admin/logs/token-access")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("can delete a user", async () => {
    const res = await request(app)
      .delete(`/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
