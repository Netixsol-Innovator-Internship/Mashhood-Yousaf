const mongoose = require("mongoose");

beforeAll(async () => {
  const MONGODB_URI =
    "mongodb+srv://mashhoodyousaf:mashhoodyousaf@taskcluster.muhbnyx.mongodb.net/";
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});
