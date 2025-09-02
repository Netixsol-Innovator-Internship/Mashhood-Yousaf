const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const { swaggerUi, swaggerSpec } = require("./src/docs/swagger");
const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();

// Enabling CORS for all origins
app.use(
  cors({
    origin: "*",
    credentials: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight OPTIONS requests
// app.options("*", cors()) ;  // this line causing errors

app.use(express.json());

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// middleware for non existing ROute
app.use((req, res, next) => {
  const error = new Error("Could not find this route");
  error.status = 404;
  return next(error);
});

// Central error handling middleware
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  const data = error.data || {};
  res.status(status).json({
    success: false,
    message,
    data,
  });
});

// Config without .env
const PORT = 8000;
const MONGODB_URI = `mongodb+srv://mashhoodyousaf:taskCluster@cluster0.9bxzm8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to DB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(" Database connected");
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });
