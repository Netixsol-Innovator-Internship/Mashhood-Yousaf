const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../app"); // path to your Express app

const Task = require("../../models/taskSchema");
const User = require("../../models/userSchema");

jest.mock("../../models/taskSchema.js");
jest.mock("../../models/userSchema");

describe("Task Controller", () => {
  let token; // will hold the real token
  const userId = "user12345"; // keep your mock userId

  beforeAll(async () => {
    // Create a JWT token directly for testing
    const jwt = require('jsonwebtoken');
    const generatedToken = jwt.sign(
      { userId: userId },
      'chooseAnyStrongKey',
      { expiresIn: '2h' }
    );

    // Set the bearer token
    token = `Bearer ${generatedToken}`;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      User.findById.mockResolvedValue({
        _id: userId,
        tasks: [],
        save: jest.fn().mockResolvedValue(true),
      });

      Task.prototype.save = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", token)
        .send({ title: "Test Task", description: "Test Desc" });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Task created successfully");
      expect(Task.prototype.save).toHaveBeenCalled();
      expect(User.findById).toHaveBeenCalledWith(userId);
    });

    // ... rest of your tests with `.set("Authorization", token)` where required
  });

  // Make sure all requests that require auth use `.set("Authorization", token)`
  // For example, GET /api/tasks/user, PUT, DELETE, etc.
});
