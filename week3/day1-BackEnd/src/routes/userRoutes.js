// src/routes/userRoutes.js
const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/userController");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/register",
  [
    check("name").trim().notEmpty().withMessage("Name is required"),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  usersControllers.login
);

module.exports = router;
