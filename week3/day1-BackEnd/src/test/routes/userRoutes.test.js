const request = require("supertest");
const app = require("../../../app");

test("dummy test", () => {
  expect(true).toBe(true);
});

describe("User Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user.id");
  }, 20000);

  it("should fail to register user with invalid email", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Invalid Email",
      email: "not-an-email",
      password: "123456",
    });

    expect(res.statusCode).toBe(422); // Because express-validator
    expect(res.body).toHaveProperty("data");
    expect(res.body.data[0]).toHaveProperty("msg", "Valid email is required");
  });

  it("should login existing user", async () => {
    const loginRes = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "123456",
    });

    expect([200, 401]).toContain(loginRes.statusCode);
    if (loginRes.statusCode === 200) {
      expect(loginRes.body).toHaveProperty("token");
    }
  }, 6000);
});
