const mongoose = require("mongoose");
const app = require("./app");

console.log(`first`)
const PORT = 8000;
// const MONGODB_URI = `mongodb+srv://mashhoodyousaf:taskCluster@cluster0.9bxzm8e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const MONGODB_URI = `mongodb+srv://mashhoodyousaf:mashhoodyousaf@taskcluster.muhbnyx.mongodb.net/`;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });
