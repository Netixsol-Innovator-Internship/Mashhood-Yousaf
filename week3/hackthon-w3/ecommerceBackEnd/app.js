const cors = require("cors");
const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const { swaggerUi, swaggerSpec } = require("./src/docs/swagger");

const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

const { swaggerUi, swaggerSpec } = require("./src/docs/swagger");

const connectDB = require("./src/config/db");
const ErrorResponse = require("./src/utils/errorResponse");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Enabling CORS for all origins
app.use(
  cors({
    origin: "*",
    // credentials: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Swagger UI endpoint
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  console.log(`app working`);
  res.status(200).json({
    success: true,
    message: "hy",
    data: {},
  });
});

// middleware for non existing ROute
app.use((req, res, next) => {
  const error = new ErrorResponse("Couldn't found this route", 404, [], false);
  return next(error);
});

// Central error handling middleware
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  const status = typeof error.code === "number" ? error.code : 500;
  const message = error.message || "Internal server error";
  const data = error.data || {};
  const success = typeof error.success !== "undefined" ? error.success : false;
  res.status(status).json({
    success,
    message,
    data,
    status,
  });
});
connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // console.log(`Database Connected`);
  console.log(` Server running on port ${PORT}`);
});

module.exports = app;
