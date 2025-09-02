const express = require("express");
const { register, login } = require("../controllers/authController");
const { body } = require("express-validator");

const router = express.Router();
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new account
 *     tags: [Auth]
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
 *                 example: Alice Johnson
 *               email:
 *                 type: string
 *                 example: alice.johnson@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass#2025
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate an existing user
 *     tags: [Auth]
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
 *                 example: alice.johnson@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass#2025
 *     responses:
 *       200:
 *         description: Authentication successful, returns a JWT token
 *       401:
 *         description: Incorrect email or password
 */

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  login
);

module.exports = router;
