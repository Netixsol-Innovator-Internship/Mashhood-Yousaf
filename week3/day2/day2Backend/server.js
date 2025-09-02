const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

dotenv.config();
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected");
    console.log("DB Name:", mongoose.connection.name);
  })
  .catch((err) => console.error("DB error:", err));



app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 8000;
