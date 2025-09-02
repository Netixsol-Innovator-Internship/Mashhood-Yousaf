const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");
const ErrorResponse = require("../utils/errorResponse");

const superAdminEmails = ["superAdmin1@admin.com", "superAdmin2@admin.com"];
const JWT_KEY = "chooseAnyStrongKey";
const SALT_ROUNDS = 12;

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
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
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
    const error = new ErrorResponse(
      "Invalid signup data.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new ErrorResponse(
        "User already exists with this email.",
        409,
        {},
        false
      );
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role = superAdminEmails.includes(email) ? "superAdmin" : "user";

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await createdUser.save();

    const token = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
      JWT_KEY,
      { expiresIn: "2h" }
    );
    console.log("token from signup", token);
    console.log("createdUser from signup", createdUser);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    const error = new ErrorResponse(
      "Signing up failed, please try again later.",
      500,
      {},
      false
    );
    return next(error);
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
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
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       422:
 *         description: Invalid credentials or validation failed
 *       500:
 *         description: Server error
 */

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new ErrorResponse(
      "Invalid Credentials.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }

  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new ErrorResponse(
        "Invalid Credentials.",
        422,
        errors.array(),
        false
      );

      return next(error);
    }
    if (existingUser.isBlocked) {
      return res
        .status(403)
        .json({ message: "Your account has been blocked." });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "User LoggedIn Succesfully",
      user: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    const error = new ErrorResponse(
      "Invalid Credentials.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  const { newRole } = req.body;
  const currentUser = req.userData;
  const userIdToChange = req.params.id;

  if (!newRole) {
    return res.status(400).json({ message: "New role is required" });
  }
  // Add validation for currentUser
  if (!currentUser || !currentUser.role) {
    return res.status(401).json({ message: "Authentication required" });
  }

  console.log("newRole:", newRole);
  console.log("currentUser:", currentUser);
  console.log("currentUser.role:", currentUser.role);
  console.log("userIdToChange:", userIdToChange);

  try {
    const userToChange = await User.findById(userIdToChange);

    if (!userToChange) {
      return res.status(404).json({ message: "User not found" });
    }

    // Can't modify own role
    if (userToChange._id.toString() === currentUser.userId.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot change your own role" });
    }

    // SuperAdmin restrictions
    if (currentUser.role === "superAdmin") {
      // Can't demote another superAdmin
      if (userToChange.role === "superAdmin" && newRole !== "superAdmin") {
        return res
          .status(403)
          .json({ message: "Cannot demote another SuperAdmin" });
      }

      // Valid transitions: user <--> admin
      const validRoles = ["user", "admin"];
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: "Invalid target role" });
      }
    }

    // Add Admin restrictions
    if (currentUser.role === "admin") {
      // Admins can only change users to/from user role
      if (newRole !== "user") {
        return res.status(403).json({
          message: "Admins can only set role to 'user'",
        });
      }

      // Admins cannot modify other admins or superAdmins
      if (userToChange.role === "admin" || userToChange.role === "superAdmin") {
        return res.status(403).json({
          message: "Cannot modify other admins or super admins",
        });
      }
    }

    userToChange.role = newRole;
    await userToChange.save();

    console.log("userToChange after role changed:", userToChange);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        user: {
          id: userToChange._id,
          email: userToChange.email,
          role: userToChange.role,
        },
      },
    });
  } catch (err) {
    console.error("changeUserRole error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const blockUnblockUser = async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.userData;
  const { action } = req.body; // 'block' or 'unblock'

  if (!action.trim()) {
    return res
      .status(400)
      .json({ message: "Action block or unblcok is required." });
  }

  if (!["block", "unblock"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'block' or 'unblock'." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self block
    if (user._id.toString() === req.userData.userId) {
      return res
        .status(403)
        .json({ message: "You can't block/unblock yourself." });
    }

    if(currentUser.role === "admin" && user.role ==="admin" ) {
      return res
        .status(403)
        .json({ message: "You can't block/unblock another admin." });
    }
    if(currentUser.role === "admin" && user.role ==="superAdmin" ) {
      return res
        .status(403)
        .json({ message: "Access denied." });
    }
    if(currentUser.role === "superAdmin" && user.role ==="superAdmin" ) {
      return res
        .status(403)
        .json({ message: "You can't block/unblock another superAdmin." });
    }

    user.isBlocked = action === "block";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${action}ed successfully.`,
      user,
    });
  } catch (err) {
    next(err);
  }
};


const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: {},
      });
    }
  } catch (err) {
    console.error("Error fetching users:", err.message || err);
    const error = new ErrorResponse(
      "error catched getting users, server error",
      500,
      { err: err.message || err.toString() },
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "  users data",
    data: users,
  });
};


exports.signup = signup;
exports.login = login;
exports.changeUserRole = changeUserRole;
exports.getUsers = getUsers;
exports.blockUnblockUser = blockUnblockUser;
