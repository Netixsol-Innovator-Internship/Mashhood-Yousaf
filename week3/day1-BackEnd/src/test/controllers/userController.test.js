const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");

describe("User Routes", () => {
  afterAll(async () => {
    await User.deleteMany({ email: /test.*@example.com/ });
    // await mongoose.connection.close(); // Uncomment if you connect to DB in tests
  });

  describe("GET /api/users", () => {
    it("should return all users excluding passwords", async () => {
      const testUser = new User({
        name: "GetUsers Test",
        email: `testget${Date.now()}@example.com`,
        password: "hashedpassword",
        tasks: [],
      });
      await testUser.save();

      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBeGreaterThan(0);
      expect(res.body.users[0]).not.toHaveProperty("password");
      expect(res.body.users[0]).toHaveProperty("id");
      expect(res.body.users[0]).toHaveProperty("email");
    });

    it("should return 404 if no users found", async () => {
      await User.deleteMany({});

      const res = await request(app).get("/api/users");
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty(
        "message",
        "No users found. Create a user first."
      );
    });
  });

  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      const email = `test${Date.now()}@example.com`;
      const res = await request(app).post("/api/users/register").send({
        name: "Test User",
        email,
        password: "123456",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("user.id");
      expect(res.body.user.email).toBe(email);
      expect(res.body).toHaveProperty("token");
    }, 20000);

    it("should fail to register user with invalid email", async () => {
      const res = await request(app).post("/api/users/register").send({
        name: "Invalid Email",
        email: "not-an-email",
        password: "123456",
      });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data[0]).toHaveProperty("msg", "Valid email is required");
    });

    it("should fail to register duplicate user", async () => {
      const email = `duplicate${Date.now()}@example.com`;

      const user = new User({
        name: "Duplicate User",
        email,
        password: "hashed",
        tasks: [],
      });
      await user.save();

      const res = await request(app).post("/api/users/register").send({
        name: "Duplicate User",
        email,
        password: "123456",
      });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty(
        "message",
        "User already exists with this email."
      );
    });
  });

  describe("POST /api/users/login", () => {
    const testEmail = `testuser@example.com`;
    const testPassword = "123456";
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      const user = new User({
        name: "Login User",
        email: testEmail,
        password: hashedPassword,
        tasks: [],
      });
      await user.save();
    });

    it("should login existing user with correct credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testEmail);
    });

    it("should fail login with wrong password", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: testEmail,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials.");
    });

    it("should fail login with missing fields", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "",
        password: "",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Email and password are required."
      );
    });

    it("should fail login with non-existent user", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "nonexistent@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials.");
    });
  });
});
