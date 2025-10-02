const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../middlewares/verifyToken");

const JWT_KEY = "chooseAnyStrongKey";

const app = express();
app.use(express.json());

app.get("/protected", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted", userId: req.userData.userId });
});

// ✅ Custom error handler to send proper error JSON
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

describe("JWT Middleware", () => {
  it("should allow access with valid token", async () => {
    const token = jwt.sign({ userId: "testUser123" }, JWT_KEY, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Access granted",
      userId: "testUser123",
    });
  });

  it("should deny access with invalid token", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid.token.here");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Authentications Failed, token..."
    );
  });

  it("should deny access with no token", async () => {
    const res = await request(app).get("/protected");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Authentications Failed, token..."
    );
  });
});
