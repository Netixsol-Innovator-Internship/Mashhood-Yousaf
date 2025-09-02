const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");

const JWT_KEY = "chooseAnyStrongKey";
const SALT_ROUNDS = 12;

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (excluding passwords)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all registered users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: totalUsers
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 64e28d56c0a5ef001edabc12
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: john@example.com
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
    if (!users || users.length === 0) {
      const error = new Error("No users found. Create a user first.");
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    console.error("getUsers error:", err);
    const error = new Error("Fetching users failed, please try again later.");
    error.status = 500;
    return next(error);
  }
  return res.json({
    success: true,
    message: "totalUsers",
    users: users.map((u) => u.toObject({ getters: true })),
  });
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: myStrongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64e28d56c0a5ef001edabc12
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI...
 *       409:
 *         description: User already exists
 *       422:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid signup data.");
    error.status = 422;
    error.data = errors.array();
    return next(error);
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists with this email.");
      error.status = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      tasks: [], //empty when user first register
    });

    await createdUser.save();

    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: createdUser.id, email: createdUser.email },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    const error = new Error("Signing up failed, please try again later.");
    error.status = 500;
    return next(error);
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: myStrongPassword123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64e28d56c0a5ef001edabc12
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI...
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.status = 400;
    return next(error);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      return next(error);
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      user: { id: existingUser.id, email: existingUser.email },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    const error = new Error("Sign-in failed, please try again later.");
    error.status = 500;
    return next(error);
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
